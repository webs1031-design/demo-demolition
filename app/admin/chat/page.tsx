"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type ChatRoom = {
  id: string;
  visitor_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type ChatMessage = {
  id: string;
  room_id: string;
  sender_type: string | null;
  message: string;
  created_at: string;
};

type UnreadMap = Record<string, number>;

function formatDateTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatMessageTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getSenderType(message: ChatMessage) {
  return message.sender_type === "admin" ? "admin" : "customer";
}

function shortenMessage(message: string, maxLength = 80) {
  const cleanMessage = message.replace(/\s+/g, " ").trim();

  if (cleanMessage.length <= maxLength) {
    return cleanMessage;
  }

  return `${cleanMessage.slice(0, maxLength)}...`;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export default function AdminChatPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [selectedRoomId, setSelectedRoomId] =
    useState<string | null>(null);

  const [inputMessage, setInputMessage] = useState("");

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [unreadCounts, setUnreadCounts] = useState<UnreadMap>({});

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">("default");

  const [soundEnabled, setSoundEnabled] = useState(false);

  const [pushEnabled, setPushEnabled] = useState(false);

  const [isEnablingNotifications, setIsEnablingNotifications] =
    useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedRoomIdRef = useRef<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.id === selectedRoomId) ?? null;
  }, [rooms, selectedRoomId]);

  const totalUnreadCount = useMemo(() => {
    return Object.values(unreadCounts).reduce(
      (total, count) => total + count,
      0
    );
  }, [unreadCounts]);

  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    setNotificationPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (totalUnreadCount > 0) {
      document.title = `(${totalUnreadCount}) 더세이브철거 상담`;
    } else {
      document.title = "더세이브철거 실시간 상담 관리자";
    }

    return () => {
      document.title = "더세이브철거";
    };
  }, [totalUnreadCount]);

  const scrollToBottom = useCallback(() => {
    window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") {
      return;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      let audioContext = audioContextRef.current;

      if (!audioContext) {
        audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;
      }

      if (audioContext.state === "suspended") {
        void audioContext.resume();
      }

      const now = audioContext.currentTime;

      const oscillator1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();

      oscillator1.type = "sine";
      oscillator1.frequency.setValueAtTime(880, now);

      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.exponentialRampToValueAtTime(
        0.18,
        now + 0.01
      );
      gain1.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.18
      );

      oscillator1.connect(gain1);
      gain1.connect(audioContext.destination);

      oscillator1.start(now);
      oscillator1.stop(now + 0.2);

      const oscillator2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();

      oscillator2.type = "sine";
      oscillator2.frequency.setValueAtTime(
        1174,
        now + 0.2
      );

      gain2.gain.setValueAtTime(0.0001, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(
        0.18,
        now + 0.21
      );
      gain2.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.4
      );

      oscillator2.connect(gain2);
      gain2.connect(audioContext.destination);

      oscillator2.start(now + 0.2);
      oscillator2.stop(now + 0.42);
    } catch (error) {
      console.error("알림음 재생 오류:", error);
    }
  }, [soundEnabled]);

  const showBrowserNotification = useCallback(
    (message: ChatMessage) => {
      if (
        typeof window === "undefined" ||
        !("Notification" in window) ||
        Notification.permission !== "granted"
      ) {
        return;
      }

      try {
        const notification = new Notification(
          "더세이브철거 새 상담 메시지",
          {
            body: shortenMessage(message.message),
            tag: `chat-${message.room_id}`,
            requireInteraction: false,
          }
        );

        notification.onclick = () => {
          window.focus();

          setSelectedRoomId(message.room_id);

          setUnreadCounts((current) => ({
            ...current,
            [message.room_id]: 0,
          }));

          notification.close();
        };
      } catch (error) {
        console.error("브라우저 알림 표시 오류:", error);
      }
    },
    []
  );

  const enableNotifications = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    if (isEnablingNotifications) {
      return;
    }

    setIsEnablingNotifications(true);
    setErrorMessage("");

    try {
      if (!("Notification" in window)) {
        setNotificationPermission("unsupported");

        throw new Error(
          "현재 브라우저에서는 알림 기능을 사용할 수 없습니다."
        );
      }

      const permission =
        await Notification.requestPermission();

      setNotificationPermission(permission);

      if (permission !== "granted") {
        if (permission === "denied") {
          throw new Error(
            "브라우저 알림이 차단되어 있습니다. 사이트 설정에서 알림을 허용해주세요."
          );
        }

        throw new Error(
          "알림 권한을 허용해야 알림을 받을 수 있습니다."
        );
      }

      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (AudioContextClass) {
        let audioContext = audioContextRef.current;

        if (!audioContext) {
          audioContext = new AudioContextClass();

          audioContextRef.current = audioContext;
        }

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        setSoundEnabled(true);

        const now = audioContext.currentTime;

        const oscillator =
          audioContext.createOscillator();

        const gain = audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
          880,
          now
        );

        gain.gain.setValueAtTime(
          0.0001,
          now
        );

        gain.gain.exponentialRampToValueAtTime(
          0.12,
          now + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + 0.18
        );

        oscillator.connect(gain);

        gain.connect(audioContext.destination);

        oscillator.start(now);

        oscillator.stop(now + 0.2);
      }

      if (
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        throw new Error(
          "이 브라우저에서는 Web Push를 사용할 수 없습니다. 아이폰에서는 배포된 사이트를 Safari로 연 뒤 홈 화면에 추가해서 실행해주세요."
        );
      }

      const vapidPublicKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();

      if (!vapidPublicKey) {
        throw new Error(
          "NEXT_PUBLIC_VAPID_PUBLIC_KEY가 설정되지 않았습니다."
        );
      }

      const registration =
        await navigator.serviceWorker.register(
          "/sw.js",
          {
            scope: "/",
          }
        );

      await navigator.serviceWorker.ready;

      let pushSubscription =
        await registration.pushManager.getSubscription();

      if (!pushSubscription) {
        pushSubscription =
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              urlBase64ToUint8Array(
                vapidPublicKey
              ),
          });
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (
        sessionError ||
        !session?.access_token
      ) {
        throw new Error(
          "관리자 로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요."
        );
      }

      const response = await fetch(
        "/api/push/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            subscription:
              pushSubscription.toJSON(),
          }),
        }
      );

      const result =
        (await response.json()) as {
          ok?: boolean;
          message?: string;
        };

      if (
        !response.ok ||
        !result.ok
      ) {
        throw new Error(
          result.message ??
            "푸시 알림 기기 등록에 실패했습니다."
        );
      }

      setPushEnabled(true);
    } catch (error) {
      console.error(
        "알림 설정 오류:",
        error
      );

      setPushEnabled(false);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "알림 설정 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요."
      );
    } finally {
      setIsEnablingNotifications(false);
    }
  }, [isEnablingNotifications]);

  const loadRooms = useCallback(async () => {
    setIsLoadingRooms(true);

    const { data, error } = await supabase
      .from("chat_rooms")
      .select(
        "id, visitor_id, status, created_at, updated_at"
      )
      .order("updated_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "상담방 불러오기 오류:",
        error
      );

      setErrorMessage(
        `상담방을 불러오지 못했습니다. ${error.message}`
      );

      setIsLoadingRooms(false);

      return;
    }

    const nextRooms =
      (data ?? []) as ChatRoom[];

    setRooms(nextRooms);

    setSelectedRoomId(
      (currentRoomId) => {
        if (
          currentRoomId &&
          nextRooms.some(
            (room) =>
              room.id === currentRoomId
          )
        ) {
          return currentRoomId;
        }

        return nextRooms[0]?.id ?? null;
      }
    );

    setIsLoadingRooms(false);
  }, []);

  const loadMessages = useCallback(
    async (roomId: string) => {
      setIsLoadingMessages(true);
      setErrorMessage("");

      const { data, error } =
        await supabase
          .from("chat_messages")
          .select(
            "id, room_id, sender_type, message, created_at"
          )
          .eq("room_id", roomId)
          .order("created_at", {
            ascending: true,
          });

      if (error) {
        console.error(
          "메시지 불러오기 오류:",
          error
        );

        setErrorMessage(
          `메시지를 불러오지 못했습니다. ${error.message}`
        );

        setMessages([]);
        setIsLoadingMessages(false);

        return;
      }

      setMessages(
        (data ?? []) as ChatMessage[]
      );

      setIsLoadingMessages(false);

      setUnreadCounts((current) => ({
        ...current,
        [roomId]: 0,
      }));

      scrollToBottom();
    },
    [scrollToBottom]
  );

  useEffect(() => {
    let mounted = true;

    async function checkAuthentication() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          "관리자 로그인 확인 오류:",
          error
        );

        setErrorMessage(
          "관리자 로그인 상태를 확인하지 못했습니다."
        );

        setIsCheckingAuth(false);

        return;
      }

      if (!session?.user) {
        setUser(null);

        setIsCheckingAuth(false);

        router.replace("/admin");

        return;
      }

      setUser(session.user);

      setIsCheckingAuth(false);
    }

    checkAuthentication();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        if (!session?.user) {
          setUser(null);

          router.replace("/admin");

          return;
        }

        setUser(session.user);
      }
    );

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadRooms();
  }, [user, loadRooms]);

  useEffect(() => {
    if (
      !user ||
      !selectedRoomId
    ) {
      setMessages([]);

      return;
    }

    loadMessages(selectedRoomId);
  }, [
    user,
    selectedRoomId,
    loadMessages,
  ]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const roomChannel = supabase
      .channel("admin-chat-rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_rooms",
        },
        () => {
          loadRooms();
        }
      )
      .subscribe((status) => {
        if (
          status === "CHANNEL_ERROR"
        ) {
          console.error(
            "상담방 실시간 채널 연결 오류"
          );
        }
      });

    return () => {
      supabase.removeChannel(
        roomChannel
      );
    };
  }, [user, loadRooms]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const messageChannel = supabase
      .channel("admin-chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMessage =
            payload.new as ChatMessage;

          setRooms(
            (currentRooms) => {
              const roomExists =
                currentRooms.some(
                  (room) =>
                    room.id ===
                    newMessage.room_id
                );

              if (!roomExists) {
                void loadRooms();

                return currentRooms;
              }

              const nextRooms =
                currentRooms.map(
                  (room) => {
                    if (
                      room.id !==
                      newMessage.room_id
                    ) {
                      return room;
                    }

                    return {
                      ...room,
                      updated_at:
                        newMessage.created_at,
                    };
                  }
                );

              return [
                ...nextRooms,
              ].sort(
                (a, b) =>
                  new Date(
                    b.updated_at
                  ).getTime() -
                  new Date(
                    a.updated_at
                  ).getTime()
              );
            }
          );

          if (
            newMessage.room_id ===
            selectedRoomIdRef.current
          ) {
            setMessages(
              (currentMessages) => {
                const alreadyExists =
                  currentMessages.some(
                    (message) =>
                      message.id ===
                      newMessage.id
                  );

                if (alreadyExists) {
                  return currentMessages;
                }

                return [
                  ...currentMessages,
                  newMessage,
                ];
              }
            );

            scrollToBottom();
          }

          if (
            newMessage.sender_type !==
            "admin"
          ) {
            const isCurrentRoom =
              newMessage.room_id ===
              selectedRoomIdRef.current;

            const pageIsVisible =
              typeof document !==
                "undefined" &&
              document.visibilityState ===
                "visible";

            if (
              !isCurrentRoom ||
              !pageIsVisible
            ) {
              setUnreadCounts(
                (current) => ({
                  ...current,
                  [newMessage.room_id]:
                    (current[
                      newMessage.room_id
                    ] ?? 0) + 1,
                })
              );
            }

            playNotificationSound();

            showBrowserNotification(
              newMessage
            );
          }
        }
      )
      .subscribe((status) => {
        if (
          status === "CHANNEL_ERROR"
        ) {
          console.error(
            "관리자 메시지 실시간 채널 연결 오류"
          );
        }
      });

    return () => {
      supabase.removeChannel(
        messageChannel
      );
    };
  }, [
    user,
    loadRooms,
    playNotificationSound,
    showBrowserNotification,
    scrollToBottom,
  ]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (
        document.visibilityState ===
          "visible" &&
        selectedRoomIdRef.current
      ) {
        const roomId =
          selectedRoomIdRef.current;

        setUnreadCounts(
          (current) => ({
            ...current,
            [roomId]: 0,
          })
        );
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  function handleSelectRoom(
    roomId: string
  ) {
    setSelectedRoomId(roomId);

    setUnreadCounts((current) => ({
      ...current,
      [roomId]: 0,
    }));
  }

  async function handleSendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const message =
      inputMessage.trim();

    if (
      !message ||
      !selectedRoomId ||
      isSending
    ) {
      return;
    }

    setIsSending(true);

    setErrorMessage("");

    const { error } =
      await supabase
        .from("chat_messages")
        .insert({
          room_id: selectedRoomId,
          sender_type: "admin",
          message,
        });

    if (error) {
      console.error(
        "관리자 메시지 전송 오류:",
        error
      );

      setErrorMessage(
        `메시지를 보내지 못했습니다. ${error.message}`
      );

      setIsSending(false);

      return;
    }

    setInputMessage("");

    setIsSending(false);
  }

  async function handleCloseRoom() {
    if (!selectedRoomId) {
      return;
    }

    const { error } =
      await supabase
        .from("chat_rooms")
        .update({
          status: "closed",
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          selectedRoomId
        );

    if (error) {
      console.error(
        "상담 종료 오류:",
        error
      );

      setErrorMessage(
        `상담을 종료하지 못했습니다. ${error.message}`
      );

      return;
    }

    await loadRooms();
  }

  async function handleReopenRoom() {
    if (!selectedRoomId) {
      return;
    }

    const { error } =
      await supabase
        .from("chat_rooms")
        .update({
          status: "open",
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          selectedRoomId
        );

    if (error) {
      console.error(
        "상담 재개 오류:",
        error
      );

      setErrorMessage(
        `상담을 다시 열지 못했습니다. ${error.message}`
      );

      return;
    }

    await loadRooms();
  }

  async function handleLogout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "로그아웃 오류:",
        error
      );

      setErrorMessage(
        "로그아웃하지 못했습니다."
      );

      return;
    }

    router.replace("/admin");
  }

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-yellow-400" />

          <p className="text-sm font-semibold text-zinc-300">
            관리자 로그인 상태를 확인하고 있습니다.
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <p className="text-sm text-zinc-300">
          관리자 로그인 페이지로 이동하고 있습니다.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-950 text-white">
        <div className="mx-auto flex min-h-[72px] max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-lg font-black">
                더세이브철거
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                실시간 상담 관리자
              </p>
            </div>

            {totalUnreadCount > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

                새 메시지{" "}
                {totalUnreadCount}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={
                enableNotifications
              }
              disabled={
                isEnablingNotifications
              }
              className={`rounded-lg px-3 py-2 text-xs font-black transition sm:px-4 ${
                notificationPermission ===
                  "granted" &&
                soundEnabled &&
                pushEnabled
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isEnablingNotifications
                ? "🔔 알림 설정중"
                : notificationPermission ===
                      "granted" &&
                    soundEnabled &&
                    pushEnabled
                  ? "🔔 알림 켜짐"
                  : "🔔 알림 켜기"}
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-xs text-zinc-500">
                로그인 계정
              </p>

              <p className="max-w-[260px] truncate text-sm font-semibold text-zinc-200">
                {user.email ??
                  "관리자"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {notificationPermission ===
        "denied" && (
        <div className="border-b border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800">
          <div className="mx-auto max-w-[1600px]">
            🔕 브라우저 알림이 차단되어
            있습니다. Chrome 주소창 왼쪽의
            사이트 설정에서 알림을
            허용해주세요.
          </div>
        </div>
      )}

      {notificationPermission ===
        "unsupported" && (
        <div className="border-b border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800">
          <div className="mx-auto max-w-[1600px]">
            현재 브라우저에서는 알림 기능을
            사용할 수 없습니다.
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
            <span>
              {errorMessage}
            </span>

            <button
              type="button"
              onClick={() =>
                setErrorMessage("")
              }
              className="shrink-0 font-black"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1600px] grid-cols-1 bg-white lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="border-b border-zinc-200 bg-white lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black">
                  상담 목록
                </h1>

                {totalUnreadCount >
                  0 && (
                  <span className="flex min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 py-1 text-[11px] font-black text-white">
                    {totalUnreadCount >
                    99
                      ? "99+"
                      : totalUnreadCount}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-zinc-500">
                최근 메시지 순으로
                표시됩니다.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRooms}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold transition hover:bg-zinc-50"
            >
              새로고침
            </button>
          </div>

          <div className="max-h-[320px] overflow-y-auto lg:max-h-[calc(100vh-145px)]">
            {isLoadingRooms ? (
              <div className="px-5 py-10 text-center text-sm text-zinc-500">
                상담 목록을 불러오는
                중입니다.
              </div>
            ) : rooms.length ===
              0 ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl">
                  💬
                </div>

                <p className="mt-4 text-sm font-bold text-zinc-700">
                  아직 상담이 없습니다.
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  홈페이지 방문자가 실시간
                  채팅을 시작하면
                  <br />
                  이곳에 상담방이
                  표시됩니다.
                </p>
              </div>
            ) : (
              rooms.map((room) => {
                const isSelected =
                  room.id ===
                  selectedRoomId;

                const isOpen =
                  room.status ===
                  "open";

                const unreadCount =
                  unreadCounts[
                    room.id
                  ] ?? 0;

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() =>
                      handleSelectRoom(
                        room.id
                      )
                    }
                    className={`relative block w-full border-b px-5 py-4 text-left transition ${
                      unreadCount >
                      0
                        ? "border-yellow-200 bg-yellow-100 hover:bg-yellow-50"
                        : isSelected
                          ? "border-zinc-100 bg-yellow-50"
                          : "border-zinc-100 bg-white hover:bg-zinc-50"
                    }`}
                  >
                    {unreadCount >
                      0 && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-red-500" />
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                            unreadCount >
                            0
                              ? "animate-pulse bg-red-500"
                              : isOpen
                                ? "bg-emerald-500"
                                : "bg-zinc-300"
                          }`}
                        />

                        <span
                          className={`truncate text-sm ${
                            unreadCount >
                            0
                              ? "font-black"
                              : "font-bold"
                          }`}
                        >
                          실시간 상담
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {unreadCount >
                          0 && (
                          <span className="flex min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 py-1 text-[11px] font-black text-white">
                            {unreadCount >
                            99
                              ? "99+"
                              : unreadCount}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                            isOpen
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-zinc-100 text-zinc-500"
                          }`}
                        >
                          {isOpen
                            ? "상담중"
                            : "종료"}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 truncate text-xs text-zinc-500">
                      상담번호{" "}
                      {room.id.slice(
                        0,
                        8
                      )}
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      최근 활동{" "}
                      {formatDateTime(
                        room.updated_at
                      )}
                    </p>

                    {unreadCount >
                      0 && (
                      <p className="mt-2 text-xs font-black text-red-600">
                        새 메시지가
                        도착했습니다.
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="flex min-h-[600px] flex-col bg-zinc-50">
          {!selectedRoom ? (
            <div className="flex flex-1 items-center justify-center px-6 py-20">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-2xl font-black text-white">
                  T
                </div>

                <h2 className="mt-5 text-xl font-black">
                  더세이브 실시간 상담
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  왼쪽 상담 목록에서
                  <br />
                  상담방을 선택해주세요.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        selectedRoom.status ===
                        "open"
                          ? "bg-emerald-500"
                          : "bg-zinc-300"
                      }`}
                    />

                    <h2 className="font-black">
                      고객 실시간 상담
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-zinc-500">
                    상담번호{" "}
                    {selectedRoom.id.slice(
                      0,
                      8
                    )}
                    {" · "}
                    시작{" "}
                    {formatDateTime(
                      selectedRoom.created_at
                    )}
                  </p>
                </div>

                {selectedRoom.status ===
                "open" ? (
                  <button
                    type="button"
                    onClick={
                      handleCloseRoom
                    }
                    className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-bold transition hover:bg-zinc-50"
                  >
                    상담 종료
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      handleReopenRoom
                    }
                    className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-zinc-800"
                  >
                    상담 다시 열기
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {isLoadingMessages ? (
                  <div className="flex h-full min-h-[300px] items-center justify-center">
                    <p className="text-sm text-zinc-500">
                      메시지를 불러오는
                      중입니다.
                    </p>
                  </div>
                ) : messages.length ===
                  0 ? (
                  <div className="flex h-full min-h-[300px] items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-700">
                        아직 메시지가
                        없습니다.
                      </p>

                      <p className="mt-2 text-xs text-zinc-500">
                        고객이 메시지를
                        보내면 여기에
                        표시됩니다.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto flex max-w-4xl flex-col gap-4">
                    {messages.map(
                      (message) => {
                        const senderType =
                          getSenderType(
                            message
                          );

                        const isAdmin =
                          senderType ===
                          "admin";

                        return (
                          <div
                            key={
                              message.id
                            }
                            className={`flex ${
                              isAdmin
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] ${
                                isAdmin
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              <p className="mb-1 px-1 text-[11px] font-bold text-zinc-400">
                                {isAdmin
                                  ? "관리자"
                                  : "고객"}
                              </p>

                              <div
                                className={`inline-block rounded-2xl px-4 py-3 text-left text-sm leading-6 shadow-sm ${
                                  isAdmin
                                    ? "rounded-br-md bg-yellow-400 text-zinc-950"
                                    : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {
                                    message.message
                                  }
                                </p>

                                <p
                                  className={`mt-1 text-right text-[10px] ${
                                    isAdmin
                                      ? "text-zinc-700"
                                      : "text-zinc-400"
                                  }`}
                                >
                                  {formatMessageTime(
                                    message.created_at
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}

                    <div
                      ref={
                        messagesEndRef
                      }
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-200 bg-white p-4 sm:p-5">
                {selectedRoom.status ===
                "closed" ? (
                  <div className="rounded-xl bg-zinc-100 px-4 py-4 text-center text-sm font-semibold text-zinc-500">
                    종료된 상담입니다.
                    답변하려면 상담을 다시
                    열어주세요.
                  </div>
                ) : (
                  <form
                    onSubmit={
                      handleSendMessage
                    }
                    className="mx-auto flex max-w-4xl items-end gap-3"
                  >
                    <textarea
                      value={
                        inputMessage
                      }
                      onChange={(
                        event
                      ) =>
                        setInputMessage(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {
                        if (
                          event.key ===
                            "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();

                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      placeholder="고객에게 보낼 답변을 입력해주세요."
                      maxLength={1000}
                      rows={2}
                      className="min-h-[58px] flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-zinc-950"
                    />

                    <button
                      type="submit"
                      disabled={
                        !inputMessage.trim() ||
                        isSending
                      }
                      className="h-[58px] shrink-0 rounded-xl bg-zinc-950 px-6 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                    >
                      {isSending
                        ? "전송중"
                        : "전송"}
                    </button>
                  </form>
                )}

                <div className="mx-auto mt-2 flex max-w-4xl items-center justify-between gap-3 text-[11px] text-zinc-400">
                  <span>
                    Enter 전송 · Shift +
                    Enter 줄바꿈
                  </span>

                  <span>
                    {inputMessage.length}
                    /1000
                  </span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}