import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

type SendPushRequestBody = {
  messageId?: string;
};

type ChatMessageRow = {
  id: string;
  room_id: string;
  sender_type: string | null;
  message: string;
  created_at: string;
};

type PushSubscriptionRow = {
  id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

function configureWebPush() {
  const publicKey =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  const privateKey =
    process.env.VAPID_PRIVATE_KEY;

  const subject =
    process.env.VAPID_SUBJECT;

  if (!publicKey) {
    throw new Error(
      "NEXT_PUBLIC_VAPID_PUBLIC_KEY가 설정되지 않았습니다."
    );
  }

  if (!privateKey) {
    throw new Error(
      "VAPID_PRIVATE_KEY가 설정되지 않았습니다."
    );
  }

  if (!subject) {
    throw new Error(
      "VAPID_SUBJECT가 설정되지 않았습니다."
    );
  }

  webpush.setVapidDetails(
    subject,
    publicKey,
    privateKey
  );
}

function shortenMessage(
  message: string,
  maxLength = 120
) {
  const cleanMessage = message
    .replace(/\s+/g, " ")
    .trim();

  if (cleanMessage.length <= maxLength) {
    return cleanMessage;
  }

  return `${cleanMessage.slice(
    0,
    maxLength
  )}...`;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as SendPushRequestBody;

    const messageId =
      body.messageId?.trim();

    if (!messageId) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "messageId가 필요합니다.",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseAdmin =
      getSupabaseAdmin();

    configureWebPush();

    const {
      data: messageData,
      error: messageError,
    } = await supabaseAdmin
      .from("chat_messages")
      .select(
        "id, room_id, sender_type, message, created_at"
      )
      .eq("id", messageId)
      .single();

    if (
      messageError ||
      !messageData
    ) {
      console.error(
        "푸시 대상 메시지 조회 오류:",
        messageError
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "메시지를 확인할 수 없습니다.",
        },
        {
          status: 404,
        }
      );
    }

    const chatMessage =
      messageData as ChatMessageRow;

    if (
      chatMessage.sender_type ===
      "admin"
    ) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        message:
          "관리자 메시지는 푸시 알림을 보내지 않습니다.",
      });
    }

    const {
      data: subscriptionsData,
      error: subscriptionsError,
    } = await supabaseAdmin
      .from("push_subscriptions")
      .select(
        "id, endpoint, p256dh, auth"
      );

    if (subscriptionsError) {
      console.error(
        "푸시 구독 목록 조회 오류:",
        subscriptionsError
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "푸시 알림 기기 목록을 불러오지 못했습니다.",
        },
        {
          status: 500,
        }
      );
    }

    const subscriptions =
      (subscriptionsData ??
        []) as PushSubscriptionRow[];

    if (subscriptions.length === 0) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        message:
          "등록된 푸시 알림 기기가 없습니다.",
      });
    }

    const payload = JSON.stringify({
      title:
        "더세이브철거 새 상담 메시지",
      body: shortenMessage(
        chatMessage.message
      ),
      url: `/admin/chat?room=${encodeURIComponent(
        chatMessage.room_id
      )}`,
      tag: `chat-${chatMessage.room_id}`,
    });

    let sentCount = 0;
    let failedCount = 0;

    const expiredSubscriptionIds: number[] =
      [];

    await Promise.allSettled(
      subscriptions.map(
        async (subscription) => {
          try {
            await webpush.sendNotification(
              {
                endpoint:
                  subscription.endpoint,
                keys: {
                  p256dh:
                    subscription.p256dh,
                  auth:
                    subscription.auth,
                },
              },
              payload
            );

            sentCount += 1;
          } catch (error) {
            failedCount += 1;

            const pushError =
              error as {
                statusCode?: number;
                body?: string;
                message?: string;
              };

            console.error(
              "Web Push 발송 오류:",
              pushError.statusCode,
              pushError.message ??
                pushError.body
            );

            if (
              pushError.statusCode ===
                404 ||
              pushError.statusCode ===
                410
            ) {
              expiredSubscriptionIds.push(
                subscription.id
              );
            }
          }
        }
      )
    );

    if (
      expiredSubscriptionIds.length > 0
    ) {
      const { error: deleteError } =
        await supabaseAdmin
          .from("push_subscriptions")
          .delete()
          .in(
            "id",
            expiredSubscriptionIds
          );

      if (deleteError) {
        console.error(
          "만료된 푸시 구독 삭제 오류:",
          deleteError
        );
      }
    }

    return NextResponse.json({
      ok: true,
      sent: sentCount,
      failed: failedCount,
      removed:
        expiredSubscriptionIds.length,
      message:
        sentCount > 0
          ? `${sentCount}개 기기로 푸시 알림을 발송했습니다.`
          : "푸시 알림을 발송하지 못했습니다.",
    });
  } catch (error) {
    console.error(
      "Push send API error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "푸시 알림 발송 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}