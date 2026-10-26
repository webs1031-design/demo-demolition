import Link from "next/link";
import LiveChat from "../components/LiveChat";
import { regions } from "./data/regions";

const PHONE_DISPLAY = "010-2269-8352";
const PHONE_LINK = "tel:01022698352";
const NAVER_TALK = "https://talk.naver.com/profile/wnse6xr";

const services = [
  {
    title: "상가철거",
    description:
      "상가 계약 종료와 폐업 과정에서 필요한 내부 철거와 원상복구 범위를 현장에 맞춰 확인합니다.",
  },
  {
    title: "매장철거",
    description:
      "매장 내부 인테리어와 집기 시설물 철거부터 원상복구까지 필요한 작업 범위를 안내합니다.",
  },
  {
    title: "사무실철거",
    description:
      "사무실 이전과 계약 종료 시 파티션 시설물 바닥 천장 등 필요한 철거 범위를 확인합니다.",
  },
  {
    title: "점포철거",
    description:
      "점포 폐업 전 임대차 조건과 현장 상태를 확인하고 필요한 철거와 원상복구 작업을 안내합니다.",
  },
  {
    title: "가게철거",
    description:
      "가게 폐업과 이전 과정에서 필요한 내부 철거와 시설물 정리 범위를 현장에 맞춰 확인합니다.",
  },
  {
    title: "폐업철거",
    description:
      "영업 종료 후 남은 시설과 인테리어를 정리하고 필요한 철거와 원상복구 범위를 확인합니다.",
  },
  {
    title: "원상복구",
    description:
      "임대차 계약 조건과 기존 시설 상태를 확인해 철거 후 필요한 원상복구 범위를 안내합니다.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-16 text-zinc-950 md:pb-0">
      {/* ==================================================
          HEADER
      ================================================== */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-zinc-950"
          >
            더세이브철거
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={PHONE_LINK}
              className="rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              전화상담
            </a>

            <a
              href={NAVER_TALK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100 sm:inline-block"
            >
              네이버 톡톡
            </a>
          </div>
        </div>
      </header>

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="border-b border-zinc-800 bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="mb-5 text-sm font-semibold tracking-widest text-zinc-400">
            THE SAVE DEMOLITION
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            철거업체 더세이브철거
            <br />
            상가부터 원상복구까지
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
            서울 경기 인천 대전 세종 충남 충북 지역의 상가 매장 사무실 점포
            가게 철거와 폐업철거 원상복구 정보를 안내합니다. 현장을 직접
            확인한 뒤 필요한 작업 범위를 안내하고 무료 방문견적을 진행합니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={PHONE_LINK}
              className="rounded-md bg-white px-6 py-3.5 font-bold text-zinc-950 transition hover:bg-zinc-200"
            >
              무료방문견적 {PHONE_DISPLAY}
            </a>

            <a
              href={PHONE_LINK}
              className="rounded-md border border-zinc-600 px-6 py-3.5 font-bold text-white transition hover:border-white"
            >
              전화상담
            </a>

            <a
              href={NAVER_TALK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-600 px-6 py-3.5 font-bold text-white transition hover:border-white"
            >
              네이버 톡톡
            </a>
          </div>

          <p className="mt-5 text-sm text-zinc-400">
            무료 방문견적 · 전화상담 · 네이버 톡톡 · 실시간 채팅
          </p>
        </div>
      </section>

      {/* ==================================================
          SERVICES
      ================================================== */}
      <section
        id="services"
        className="mx-auto max-w-7xl px-6 py-20 md:py-24"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-bold text-zinc-500">철거 서비스</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            현장에 따라 달라지는 철거와 원상복구
          </h2>

          <p className="mt-5 leading-8 text-zinc-600">
            같은 철거라도 공간의 용도와 기존 인테리어 상태 임대차 조건에 따라
            필요한 작업이 달라집니다. 현장을 확인하고 실제 필요한 철거 범위를
            구분하는 것이 중요합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-xl border border-zinc-200 p-7"
            >
              <h3 className="text-xl font-bold">{service.title}</h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ==================================================
          REGIONS
      ================================================== */}
      <section id="regions" className="bg-zinc-100">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-zinc-500">지역별 철거 안내</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              서울 경기 인천 대전 세종 충남 충북 지역 철거업체
            </h2>

            <p className="mt-5 leading-8 text-zinc-600">
              지역을 선택하면 해당 지역의 상가철거 매장철거 사무실철거
              점포철거 가게철거 폐업철거와 원상복구 정보를 확인할 수 있습니다.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {regions.map((region) => (
              <article
                key={region.slug}
                className="rounded-xl border border-zinc-200 bg-white p-7"
              >
                <h3 className="text-2xl font-bold">
                  <Link
                    href={region.path}
                    className="transition hover:opacity-60"
                  >
                    {region.name} 철거업체
                  </Link>
                </h3>

                <p className="mt-3 leading-7 text-zinc-600">
                  {region.name} 지역의 철거와 폐업철거 원상복구 정보를
                  확인하세요.
                </p>

                {region.children && region.children.length > 0 && (
                  <nav
                    aria-label={`${region.name} 하위 지역`}
                    className="mt-6 flex flex-wrap gap-2"
                  >
                    {region.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={child.path}
                        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                      >
                        {child.name} 철거업체
                      </Link>
                    ))}
                  </nav>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          DEMOLITION INFORMATION
      ================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <article>
            <p className="text-sm font-bold text-zinc-500">현장 확인</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              철거 전 원상복구 범위부터 확인합니다
            </h2>

            <p className="mt-5 leading-8 text-zinc-600">
              상가나 매장 사무실을 정리할 때 모든 시설을 무조건 철거하는 것이
              아니라 임대차 계약 내용과 기존 시설 상태를 먼저 확인해야 합니다.
              철거할 부분과 유지할 부분을 구분하면 불필요한 작업을 줄일 수
              있습니다.
            </p>
          </article>

          <article>
            <p className="text-sm font-bold text-zinc-500">무료 방문견적</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              현장을 확인하고 필요한 작업을 안내합니다
            </h2>

            <p className="mt-5 leading-8 text-zinc-600">
              점포 가게 상가 매장 사무실 등 공간의 크기와 내부 구조 기존
              인테리어 상태에 따라 철거 범위가 달라질 수 있습니다. 현장을 직접
              확인한 뒤 필요한 작업 내용을 구분해 견적을 안내합니다.
            </p>
          </article>
        </div>
      </section>

      {/* ==================================================
          CONTACT
      ================================================== */}
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm font-bold text-zinc-400">
            더세이브철거 무료 방문견적
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            철거와 원상복구 상담이 필요하신가요
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-zinc-300">
            상가 매장 사무실 점포 가게 폐업철거와 원상복구 현장을 확인하고
            필요한 작업 범위를 안내합니다.
          </p>

          <a
            href={PHONE_LINK}
            className="mt-8 block text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            {PHONE_DISPLAY}
          </a>

          <p className="mt-3 text-sm text-zinc-400">
            무료 방문견적 및 전화상담
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={PHONE_LINK}
              className="rounded-md bg-white px-7 py-3.5 font-bold text-zinc-950 transition hover:bg-zinc-200"
            >
              전화상담
            </a>

            <a
              href={NAVER_TALK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-600 px-7 py-3.5 font-bold text-white transition hover:border-white"
            >
              네이버 톡톡
            </a>

            <a
              href="#regions"
              className="rounded-md border border-zinc-600 px-7 py-3.5 font-bold text-white transition hover:border-white"
            >
              지역별 안내
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}
      <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-400">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-lg font-bold text-white">더세이브철거</p>

          <p className="mt-3 text-sm leading-7">
            서울 경기 인천 대전 세종 충남 충북 지역 상가 매장 사무실 점포
            가게 철거 폐업철거 원상복구
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={PHONE_LINK}
              className="font-semibold text-white hover:underline"
            >
              무료방문견적 {PHONE_DISPLAY}
            </a>

            <a
              href={NAVER_TALK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:underline"
            >
              네이버 톡톡
            </a>
          </div>

          <p className="mt-6 text-xs">© 2026 더세이브철거</p>
        </div>
      </footer>

      {/* ==================================================
          MOBILE FIXED CONTACT
      ================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-zinc-200 bg-white md:hidden">
        <a
          href={PHONE_LINK}
          className="flex items-center justify-center bg-zinc-950 px-3 py-4 text-sm font-bold text-white"
        >
          전화상담
        </a>

        <a
          href={NAVER_TALK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-4 text-sm font-bold text-zinc-950"
        >
          네이버 톡톡
        </a>
      </div>

      {/* ==================================================
          REAL-TIME LIVE CHAT
          components/LiveChat.tsx
      ================================================== */}
      <LiveChat />
    </main>
  );
}