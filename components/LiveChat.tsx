"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type ChatMessage = {
  id: string;
  room_id: string;
  sender_type: "customer" | "admin";
  message: string;
  created_at: string;
};

const VISITOR_STORAGE_KEY = "thesave_chat_visitor_id";
const ROOM_STORAGE_KEY = "thesave_chat_room_id";

function createVisitorId() {
  if (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      const random = Math.floor(Math.random() * 16);
      const value = character === "x" ? random : (random & 0x3) | 0x8;

      return value.toString(16);
    }
  );
}

async function sendAdminPushNotification(messageId: string) {
  try {
    const response = await fetch("/api/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageId,
      }),
    });

    const result = (await response.json()) as {
      ok?: boolean;
      message?: string;
    };

    if (!response.ok || !result.ok) {
      console.error(
        "관리자 푸시 알림 발송 실패:",
        result.message ?? "알 수 없는 오류"
      );
    }
  } catch (error) {
    /*
     * 푸시 알림 발송에 실패하더라도
     * 고객의 채팅 메시지 자체는 이미 정상적으로 저장된 상태입니다.
     *
     * 따라서 고객에게 "메시지 전송 실패"를 표시하지 않고
     * 콘솔에만 오류를 기록합니다.
     */
    console.error("관리자 푸시 알림 요청 오류:", error);
  }
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || hasInitialized) {
      return;
    }

    let isMounted = true;

    async function initializeChat() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        let visitorId = localStorage.getItem(VISITOR_STORAGE_KEY);

        if (!visitorId) {
          visitorId = createVisitorId();
          localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
        }

        let savedRoomId = localStorage.getItem(ROOM_STORAGE_KEY);

        if (savedRoomId) {
          const { data: existingRoom, error: existingRoomError } =
            await supabase
              .from("chat_rooms")
              .select("id")
              .eq("id", savedRoomId)
              .eq("visitor_id", visitorId)
              .maybeSingle();

          if (existingRoomError) {
            throw existingRoomError;
          }

          if (!existingRoom?.id) {
            localStorage.removeItem(ROOM_STORAGE_KEY);
            savedRoomId = null;
          }
        }

        if (!savedRoomId) {
          const { data: existingVisitorRoom, error: visitorRoomError } =
            await supabase
              .from("chat_rooms")
              .select("id")
              .eq("visitor_id", visitorId)
              .eq("status", "open")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

          if (visitorRoomError) {
            throw visitorRoomError;
          }

          if (existingVisitorRoom?.id) {
            const existingRoomId = String(existingVisitorRoom.id);

            savedRoomId = existingRoomId;
            localStorage.setItem(ROOM_STORAGE_KEY, existingRoomId);
          }
        }

        if (!savedRoomId) {
          const { data: newRoom, error: roomError } = await supabase
            .from("chat_rooms")
            .insert({
              visitor_id: visitorId,
              status: "open",
            })
            .select("id")
            .single();

          if (roomError) {
            throw roomError;
          }

          if (!newRoom?.id) {
            throw new Error("채팅방 ID를 생성하지 못했습니다.");
          }

          const newRoomId = String(newRoom.id);

          savedRoomId = newRoomId;
          localStorage.setItem(ROOM_STORAGE_KEY, newRoomId);
        }

        if (!savedRoomId) {
          throw new Error("채팅방 정보를 확인하지 못했습니다.");
        }

        const activeRoomId = savedRoomId;

        const { data: existingMessages, error: messagesError } =
          await supabase
            .from("chat_messages")
            .select("id, room_id, sender_type, message, created_at")
            .eq("room_id", activeRoomId)
            .order("created_at", { ascending: true });

        if (messagesError) {
          throw messagesError;
        }

        if (!isMounted) {
          return;
        }

        setRoomId(activeRoomId);
        setMessages((existingMessages ?? []) as ChatMessage[]);
        setHasInitialized(true);
      } catch (error) {
        console.error("채팅 초기화 오류:", error);

        if (isMounted) {
          setErrorMessage(
            "채팅 연결 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeChat();

    return () => {
      isMounted = false;
    };
  }, [isOpen, hasInitialized]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const channel = supabase
      .channel(`chat-room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;

          setMessages((currentMessages) => {
            const alreadyExists = currentMessages.some(
              (message) => message.id === newMessage.id
            );

            if (alreadyExists) {
              return currentMessages;
            }

            return [...currentMessages, newMessage];
          });
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("실시간 채팅 채널 연결 오류");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isOpen]);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = inputMessage.trim();

    if (!trimmedMessage || !roomId || isSending) {
      return;
    }

    try {
      setIsSending(true);
      setErrorMessage("");

      const { data: insertedMessage, error } = await supabase
        .from("chat_messages")
        .insert({
          room_id: roomId,
          sender_type: "customer",
          message: trimmedMessage,
        })
        .select("id, room_id, sender_type, message, created_at")
        .single();

      if (error) {
        throw error;
      }

      setInputMessage("");

      if (insertedMessage) {
        const message = insertedMessage as ChatMessage;

        setMessages((currentMessages) => {
          const alreadyExists = currentMessages.some(
            (currentMessage) => currentMessage.id === message.id
          );

          if (alreadyExists) {
            return currentMessages;
          }

          return [...currentMessages, message];
        });

        /*
         * 고객 메시지가 Supabase에 정상 저장된 뒤
         * 관리자 기기로 Web Push 발송을 요청합니다.
         *
         * 푸시 발송 결과를 기다리지 않기 때문에
         * 고객의 채팅 전송 속도에는 영향을 거의 주지 않습니다.
         */
        void sendAdminPushNotification(message.id);
      }
    } catch (error) {
      console.error("메시지 전송 오류:", error);

      setErrorMessage(
        "메시지를 보내지 못했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleOpenChat() {
    setIsOpen(true);
  }

  function handleCloseChat() {
    setIsOpen(false);
  }

  return (
    <>
      {/* ==================================================
          실시간 채팅 열기 버튼
      ================================================== */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenChat}
          className="fixed bottom-20 right-4 z-[60] flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3.5 text-sm font-bold text-zinc-950 shadow-lg transition hover:bg-yellow-300 md:bottom-6 md:right-6"
          aria-label="실시간 채팅 열기"
        >
          <span
            className="h-2.5 w-2.5 rounded-full bg-green-600"
            aria-hidden="true"
          />
          실시간 채팅
        </button>
      )}

      {/* ==================================================
          실시간 채팅창
      ================================================== */}
      {isOpen && (
        <section
          className="fixed bottom-0 right-0 z-[70] flex h-[78vh] w-full flex-col overflow-hidden border border-zinc-200 bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[620px] sm:max-h-[calc(100vh-3rem)] sm:w-[390px] sm:rounded-2xl"
          aria-label="더세이브 실시간 상담"
        >
          {/* HEADER */}
          <header className="flex items-center justify-between bg-zinc-950 px-5 py-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-green-400"
                  aria-hidden="true"
                />

                <h2 className="text-base font-bold">
                  더세이브 실시간 상담
                </h2>
              </div>

              <p className="mt-1 text-xs text-zinc-400">
                로그인 없이 바로 상담할 수 있습니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseChat}
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              aria-label="채팅창 닫기"
            >
              ×
            </button>
          </header>

          {/* 안내 */}
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3">
            <p className="text-xs leading-5 text-zinc-600">
              철거 지역과 현장 종류를 함께 남겨주시면 상담에 도움이 됩니다.
            </p>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto bg-zinc-100 px-4 py-5">
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-zinc-500">
                  상담 연결 중입니다...
                </p>
              </div>
            )}

            {!isLoading && messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-xl font-bold text-white">
                  T
                </div>

                <p className="text-base font-bold text-zinc-950">
                  더세이브철거
                </p>

                <p className="mt-2 max-w-[260px] text-sm leading-6 text-zinc-600">
                  안녕하세요. 철거 및 원상복구 상담을 도와드리겠습니다.
                </p>

                <p className="mt-3 max-w-[280px] text-xs leading-5 text-zinc-500">
                  예: 강남구 상가철거 / 약 30평 / 폐업 후 원상복구 문의
                </p>
              </div>
            )}

            {!isLoading && messages.length > 0 && (
              <div className="space-y-3">
                {messages.map((chatMessage) => {
                  const isCustomer =
                    chatMessage.sender_type === "customer";

                  return (
                    <div
                      key={chatMessage.id}
                      className={`flex ${
                        isCustomer ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          isCustomer
                            ? "rounded-br-md bg-yellow-400 text-zinc-950"
                            : "rounded-bl-md bg-white text-zinc-950 shadow-sm"
                        }`}
                      >
                        {!isCustomer && (
                          <p className="mb-1 text-xs font-bold text-zinc-500">
                            더세이브철거
                          </p>
                        )}

                        <p className="whitespace-pre-wrap break-words">
                          {chatMessage.message}
                        </p>

                        <p
                          className={`mt-1 text-right text-[10px] ${
                            isCustomer
                              ? "text-zinc-700"
                              : "text-zinc-400"
                          }`}
                        >
                          {new Date(
                            chatMessage.created_at
                          ).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 오류 메시지 */}
          {errorMessage && (
            <div className="border-t border-red-200 bg-red-50 px-4 py-2">
              <p className="text-xs leading-5 text-red-700">
                {errorMessage}
              </p>
            </div>
          )}

          {/* 메시지 입력 */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-zinc-200 bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder={
                  roomId
                    ? "문의 내용을 입력해주세요."
                    : "상담 연결 중입니다."
                }
                disabled={!roomId || isLoading || isSending}
                rows={1}
                maxLength={1000}
                className="min-h-[46px] max-h-28 flex-1 resize-none rounded-xl border border-zinc-300 px-4 py-3 text-sm leading-5 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 disabled:bg-zinc-100"
                aria-label="채팅 메시지"
              />

              <button
                type="submit"
                disabled={
                  !roomId ||
                  !inputMessage.trim() ||
                  isLoading ||
                  isSending
                }
                className="h-[46px] shrink-0 rounded-xl bg-zinc-950 px-4 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {isSending ? "전송중" : "전송"}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between px-1">
              <p className="text-[11px] text-zinc-400">
                Enter 전송 · Shift + Enter 줄바꿈
              </p>

              <p className="text-[11px] text-zinc-400">
                {inputMessage.length}/1000
              </p>
            </div>
          </form>
        </section>
      )}
    </>
  );
}