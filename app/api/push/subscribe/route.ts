import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type PushSubscriptionJSON = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

type SubscribeRequestBody = {
  subscription?: PushSubscriptionJSON;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          ok: false,
          message: "로그인이 필요합니다.",
        },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace("Bearer ", "").trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          ok: false,
          message: "로그인 토큰이 없습니다.",
        },
        { status: 401 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("Push subscription auth error:", userError);

      return NextResponse.json(
        {
          ok: false,
          message: "로그인 정보를 확인할 수 없습니다.",
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as SubscribeRequestBody;
    const subscription = body.subscription;

    if (
      !subscription?.endpoint ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "푸시 구독 정보가 올바르지 않습니다.",
        },
        { status: 400 }
      );
    }

    const { error: saveError } = await supabaseAdmin
      .from("push_subscriptions")
      .upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "endpoint",
        }
      );

    if (saveError) {
      console.error("Push subscription save error:", saveError);

      return NextResponse.json(
        {
          ok: false,
          message: "푸시 알림 정보를 저장하지 못했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "푸시 알림 등록이 완료되었습니다.",
    });
  } catch (error) {
    console.error("Push subscription API error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "푸시 알림 등록 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}