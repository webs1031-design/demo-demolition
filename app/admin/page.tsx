"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isChecking, setIsChecking] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error("관리자 로그인 상태 확인 오류:", error);
        setIsChecking(false);
        return;
      }

      if (session?.user) {
        router.replace("/admin/chat");
        return;
      }

      setIsChecking(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage("");

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

    if (error) {
      console.error("관리자 로그인 오류:", error);

      setErrorMessage(
        "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
      );

      setIsLoggingIn(false);
      return;
    }

    if (!data.user || !data.session) {
      setErrorMessage(
        "로그인 정보를 확인하지 못했습니다. 다시 시도해주세요."
      );

      setIsLoggingIn(false);
      return;
    }

    router.replace("/admin/chat");
    router.refresh();
  }

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-yellow-400" />

          <p className="mt-5 text-sm font-semibold text-zinc-300">
            관리자 로그인 상태를 확인하고 있습니다.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-10 text-zinc-950">
      <div className="w-full max-w-[430px]">
        <div className="mb-8 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-2xl font-black text-zinc-950">
            T
          </div>

          <h1 className="mt-5 text-2xl font-black">
            더세이브철거
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            실시간 상담 관리자
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-black">
              관리자 로그인
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              등록된 관리자 계정으로 로그인해주세요.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-bold text-zinc-700"
              >
                이메일
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (errorMessage) {
                    setErrorMessage("");
                  }
                }}
                autoComplete="email"
                placeholder="관리자 이메일"
                disabled={isLoggingIn}
                className="h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-bold text-zinc-700"
              >
                비밀번호
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);

                  if (errorMessage) {
                    setErrorMessage("");
                  }
                }}
                autoComplete="current-password"
                placeholder="비밀번호"
                disabled={isLoggingIn}
                className="h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100"
              />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isLoggingIn ||
                !email.trim() ||
                !password
              }
              className="h-12 w-full rounded-xl bg-yellow-400 text-sm font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              {isLoggingIn
                ? "로그인 중..."
                : "관리자 로그인"}
            </button>
          </form>

          <div className="mt-6 border-t border-zinc-100 pt-5">
            <p className="text-center text-xs leading-5 text-zinc-400">
              더세이브철거 실시간 상담 관리 전용 페이지
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          THE SAVE DEMOLITION
        </p>
      </div>
    </main>
  );
}