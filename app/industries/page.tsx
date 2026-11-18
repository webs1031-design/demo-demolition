
import type { Metadata } from "next";
import Link from "next/link";

const SITE = "https://demo.thesavecompany.com";
const PHONE = "010-2269-8352";
const PHONE_URL = "tel:01022698352";
const TALK_URL = "https://talk.naver.com/profile/wnse6xr";

export const metadata: Metadata = {
  title: "업종별 철거 안내 | 더세이브철거",
  description:
    "음식점, 카페, 식당, 학원, 병원, 미용실, 사무실 등 다양한 업종의 철거 및 원상복구 안내. 더세이브철거 무료방문견적 010-2269-8352",
  alternates: {
    canonical: `${SITE}/industries`,
  },
  openGraph: {
    title: "업종별 철거 안내 | 더세이브철거",
    description:
      "업종별 철거 범위와 원상복구 확인사항을 살펴보세요.",
    url: `${SITE}/industries`,
  },
};

const industries = [
  { title: "음식점철거", slug: "restaurant", icon: "🍽️" },
  { title: "카페철거", slug: "cafe", icon: "☕" },
  { title: "식당철거", slug: "dining", icon: "🥘" },
  { title: "학원철거", slug: "academy", icon: "📚" },
  { title: "병원철거", slug: "hospital", icon: "🏥" },
  { title: "미용실철거", slug: "hair-salon", icon: "✂️" },
  { title: "네일샵철거", slug: "nail-shop", icon: "💅" },
  { title: "피부관리실철거", slug: "skin-care", icon: "🧴" },
  { title: "헬스장철거", slug: "gym", icon: "🏋️" },
  { title: "필라테스철거", slug: "pilates", icon: "🧘" },
  { title: "편의점철거", slug: "convenience-store", icon: "🏪" },
  { title: "무인매장철거", slug: "unmanned-store", icon: "🛒" },
  { title: "주점철거", slug: "bar", icon: "🍻" },
  { title: "노래방철거", slug: "karaoke", icon: "🎤" },
  { title: "PC방철거", slug: "pc-room", icon: "🖥️" },
  { title: "독서실철거", slug: "reading-room", icon: "📖" },
  { title: "스터디카페철거", slug: "study-cafe", icon: "💻" },
  { title: "안경점철거", slug: "optical-store", icon: "👓" },
  { title: "의류매장철거", slug: "clothing-store", icon: "👕" },
  { title: "프랜차이즈철거", slug: "franchise", icon: "🏬" },
];

export default function IndustriesPage() {
  return (
    <main className="min-h-screen bg-white pb-16 text-zinc-950 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" className="text-xl font-black md:text-2xl">
            더세이브<span className="text-violet-700">철거</span>
          </Link>

          <nav className="flex flex-wrap gap-4 text-xs font-bold text-zinc-600 sm:text-sm">
            <Link href="/" className="hover:text-violet-700">
              홈
            </Link>
            <Link href="/industries" className="text-violet-700">
              업종별 철거
            </Link>
            <Link href="/regions" className="hover:text-violet-700">
              지역별 안내
            </Link>
            <Link href="/estimates" className="hover:text-violet-700">
              업종별 견적
            </Link>
          </nav>

          <a
            href={PHONE_URL}
            className="rounded-full bg-violet-700 px-5 py-3 text-xs font-black text-white hover:bg-violet-800"
          >
            무료방문견적
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-violet-200 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-black tracking-[0.25em] text-violet-700">
            INDUSTRY DEMOLITION
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            업종별 철거 안내
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-9 text-zinc-600">
            음식점부터 카페, 학원, 병원, 미용실, 편의점까지
            업종마다 필요한 철거 범위와 원상복구 조건은 다릅니다.
            해당 업종을 선택하여 자세한 안내를 확인해 보세요.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={PHONE_URL}
              className="rounded-full bg-violet-700 px-7 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 hover:bg-violet-800"
            >
              무료방문견적 {PHONE}
            </a>
            <a
              href={TALK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-violet-200 bg-white px-7 py-4 text-sm font-black text-violet-800 hover:bg-violet-50"
            >
              네이버 톡톡 상담
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="text-xs font-black tracking-[0.2em] text-violet-600">
          SELECT YOUR INDUSTRY
        </p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          업종을 선택해 주세요
        </h2>

        <p className="mt-4 text-sm leading-8 text-zinc-600">
          아래 카드를 클릭하면 해당 업종의 철거 상세 안내로 이동합니다.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {industries.map((industry, index) => (
            <Link
              key={industry.slug}
              href={`/industry/${industry.slug}`}
              className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-3xl border border-violet-300/30 bg-gradient-to-br from-[#A78BFA] via-[#7C3AED] to-[#4C1D95] p-6 text-white shadow-lg shadow-violet-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-violet-100">
                  INDUSTRY
                </span>
                <span className="text-xs font-black text-violet-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <span className="mt-7 text-4xl" aria-hidden="true">
                {industry.icon}
              </span>

              <h3 className="mt-5 flex-1 text-lg font-black">
                {industry.title}
              </h3>

              <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4 text-xs font-bold">
                <span>상세정보 보기</span>
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-violet-50 py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 className="text-2xl font-black">
            업종별 철거에서 확인할 사항
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "철거 대상 확인",
                text: "고정 집기, 벽체, 천장, 바닥 및 설비의 철거 범위를 확인합니다.",
              },
              {
                title: "원상복구 조건",
                text: "임대차계약서와 임대인 협의 내용을 바탕으로 복구 범위를 검토합니다.",
              },
              {
                title: "폐기물 처리",
                text: "폐기물 종류와 반출 동선, 운반 및 처리 조건을 확인합니다.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-violet-100 bg-white p-7 shadow-sm"
              >
                <h3 className="text-lg font-black text-violet-800">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-violet-900 to-violet-700 px-5 py-16 text-center text-white">
        <h2 className="text-3xl font-black">
          철거·원상복구 무료방문견적
        </h2>
        <p className="mt-5 text-sm leading-8 text-violet-100">
          현장 상태와 작업 범위를 확인하여 상담을 안내합니다.
        </p>
        <a
          href={PHONE_URL}
          className="mt-7 inline-block rounded-full bg-white px-8 py-4 text-lg font-black text-violet-800"
        >
          {PHONE}
        </a>
      </section>

      <footer className="bg-zinc-950 px-5 py-10 text-center text-sm text-white">
        <Link href="/" className="font-black">
          더세이브철거
        </Link>
        <p className="mt-3 text-zinc-400">
          업종별 철거 · 폐업 · 원상복구 전문 상담
        </p>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-violet-100 bg-white md:hidden">
        <a
          href={PHONE_URL}
          className="bg-violet-700 px-3 py-4 text-center text-sm font-black text-white"
        >
          전화상담
        </a>
        <a
          href={TALK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-4 text-center text-sm font-black text-violet-700"
        >
          네이버 톡톡
        </a>
      </div>
    </main>
  );
}
