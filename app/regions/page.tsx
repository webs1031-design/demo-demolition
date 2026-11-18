
import type { Metadata } from "next";
import Link from "next/link";
import { regions, type Region } from "../data/regions";

const SITE = "https://demo.thesavecompany.com";
const PHONE = "010-2269-8352";
const PHONE_URL = "tel:01022698352";
const TALK_URL = "https://talk.naver.com/profile/wnse6xr";

export const metadata: Metadata = {
  title: "지역별 철거업체 안내 | 더세이브철거",
  description:
    "서울·경기·인천·대전·세종·충남·충북 지역별 상가, 매장, 점포, 가게, 사무실 철거 및 폐업 원상복구 안내. 더세이브철거 무료방문견적 010-2269-8352",
  alternates: {
    canonical: `${SITE}/regions`,
  },
  openGraph: {
    title: "지역별 철거업체 안내 | 더세이브철거",
    description:
      "지역을 선택하고 철거·원상복구 안내를 확인하세요.",
    url: `${SITE}/regions`,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function countDescendants(region: Region): number {
  return (region.children ?? []).reduce(
    (total, child) => total + 1 + countDescendants(child),
    0
  );
}

function RegionChildren({
  childrenRegions,
  depth = 0,
}: {
  childrenRegions: Region[];
  depth?: number;
}) {
  if (depth > 8) return null;

  return (
    <div
      className={
        depth === 0
          ? "grid gap-3 sm:grid-cols-2"
          : "mt-3 space-y-2 border-l-2 border-violet-100 pl-4"
      }
    >
      {childrenRegions.map((region) => {
        const hasChildren = Boolean(region.children?.length);

        return (
          <div
            key={region.path}
            className="rounded-2xl border border-violet-100 bg-white p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href={region.path}
                className="font-bold text-zinc-800 transition hover:text-violet-700"
              >
                {region.name} 철거업체
              </Link>

              <Link
                href={region.path}
                className="rounded-full bg-violet-50 px-3 py-2 text-xs font-black text-violet-700 transition hover:bg-violet-700 hover:text-white"
              >
                상세 보기 →
              </Link>
            </div>

            {hasChildren && (
              <details className="mt-3 group">
                <summary className="cursor-pointer rounded-lg bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-violet-50">
                  하위 지역 펼치기
                  <span className="ml-2 text-violet-700 group-open:hidden">
                    +
                  </span>
                  <span className="ml-2 hidden text-violet-700 group-open:inline">
                    −
                  </span>
                </summary>

                <RegionChildren
                  childrenRegions={region.children ?? []}
                  depth={depth + 1}
                />
              </details>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RegionsPage() {
  return (
    <main className="min-h-screen bg-white pb-16 text-zinc-950 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" className="text-xl font-black md:text-2xl">
            더세이브
            <span className="text-violet-700">철거</span>
          </Link>

          <nav className="flex flex-wrap gap-4 text-xs font-bold text-zinc-600 sm:text-sm">
            <Link href="/" className="hover:text-violet-700">
              홈
            </Link>

            <Link
              href="/industries"
              className="hover:text-violet-700"
            >
              업종별 철거
            </Link>

            <Link href="/regions" className="text-violet-700">
              지역별 안내
            </Link>

            <Link
              href="/estimates"
              className="hover:text-violet-700"
            >
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

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-violet-50 to-purple-200 py-20 md:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-black tracking-[0.25em] text-violet-700">
            THE SAVE SERVICE AREAS
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            지역별 철거업체 안내
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-9 text-zinc-600">
            서울·경기·인천·대전·세종·충청권 등 등록된
            지역별 철거 및 원상복구 정보를 확인할 수 있습니다.
            원하는 지역을 선택하여 상가·매장·점포·가게·사무실
            철거와 폐업 원상복구 안내를 살펴보세요.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={PHONE_URL}
              className="rounded-full bg-violet-700 px-7 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
            >
              무료방문견적 {PHONE}
            </a>

            <a
              href={TALK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-violet-200 bg-white px-7 py-4 text-sm font-black text-violet-800 transition hover:bg-violet-50"
            >
              네이버 톡톡 상담
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <span className="rounded-full border border-violet-200 bg-white/80 px-5 py-3 text-sm font-bold text-violet-800">
              지역별 상세 안내
            </span>
            <span className="rounded-full border border-violet-200 bg-white/80 px-5 py-3 text-sm font-bold text-violet-800">
              철거·원상복구 상담
            </span>
            <span className="rounded-full border border-violet-200 bg-white/80 px-5 py-3 text-sm font-bold text-violet-800">
              무료 현장 견적
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="text-xs font-black tracking-[0.2em] text-violet-600">
          SELECT YOUR REGION
        </p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          철거 지역을 선택해 주세요
        </h2>

        <p className="mt-5 max-w-3xl text-sm leading-8 text-zinc-600">
          큰 지역을 클릭하면 하위 지역이 펼쳐집니다.
          시·구·군별 상세 페이지에서 철거와 원상복구에 필요한
          내용을 확인할 수 있습니다.
        </p>

        <div className="mt-12 grid items-start gap-5 md:grid-cols-2">
          {regions.map((region, index) => (
            <details
              key={region.path}
              className="group overflow-hidden rounded-[1.7rem] border border-violet-200 bg-white shadow-sm transition hover:border-violet-400 hover:shadow-xl"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 bg-gradient-to-br from-violet-50 to-white p-6 md:p-8 [&::-webkit-details-marker]:hidden">
                <div>
                  <p className="text-xs font-black tracking-[0.2em] text-violet-600">
                    REGION {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-4 text-2xl font-black text-zinc-900 md:text-3xl">
                    {region.name} 철거업체
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-zinc-500">
                    {region.name} 철거·폐업·원상복구 안내
                  </p>

                  <p className="mt-3 text-xs font-bold text-violet-600">
                    하위 지역 {countDescendants(region)}개
                  </p>
                </div>

                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-700 text-2xl font-bold text-white transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-violet-100 p-5 md:p-7">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-black text-zinc-800">
                    세부 지역 선택
                  </p>

                  <Link
                    href={region.path}
                    className="rounded-full bg-violet-700 px-5 py-3 text-xs font-black text-white transition hover:bg-violet-800"
                  >
                    {region.name} 전체 보기 →
                  </Link>
                </div>

                {region.children && region.children.length > 0 ? (
                  <RegionChildren
                    childrenRegions={region.children}
                  />
                ) : (
                  <p className="rounded-xl bg-violet-50 p-5 text-sm leading-7 text-zinc-600">
                    해당 지역의 철거 및 원상복구 안내는
                    전체 보기에서 확인하실 수 있습니다.
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-violet-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-black tracking-[0.2em] text-violet-600">
            DEMOLITION SERVICES
          </p>

          <h2 className="mt-4 text-3xl font-black">
            지역별 철거 상담 안내
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "상가·매장·점포 철거",
                description:
                  "상업공간 내부 시설물, 인테리어, 바닥과 천장 등 철거 범위를 확인합니다.",
              },
              {
                title: "사무실·가게 원상복구",
                description:
                  "임대차계약서와 임대인 협의 내용을 기준으로 원상복구 범위를 검토합니다.",
              },
              {
                title: "폐업 철거 및 폐기물",
                description:
                  "폐업 일정, 폐기물 분류와 반출 조건을 확인하여 작업 계획을 안내합니다.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-violet-100 bg-white p-8 shadow-sm"
              >
                <h3 className="text-xl font-black text-violet-800">
                  {item.title}
                </h3>

                <p className="mt-5 text-sm leading-8 text-zinc-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] px-5 py-20 text-center text-white">
        <p className="text-xs font-black tracking-[0.25em] text-violet-200">
          FREE SITE ESTIMATE
        </p>

        <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
          철거·원상복구 무료방문견적
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-violet-100">
          지역과 현장 조건에 맞춰 철거 범위 및 견적 상담을
          안내합니다.
        </p>

        <a
          href={PHONE_URL}
          className="mt-8 inline-block text-3xl font-black md:text-5xl"
        >
          {PHONE}
        </a>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={PHONE_URL}
            className="rounded-full bg-white px-8 py-4 text-sm font-black text-violet-800"
          >
            전화상담
          </a>

          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-black text-white"
          >
            네이버 톡톡
          </a>
        </div>
      </section>

      <footer className="bg-zinc-950 px-5 py-12 text-center text-sm text-white">
        <Link href="/" className="text-xl font-black">
          더세이브철거
        </Link>

        <p className="mt-4 text-zinc-300">
          서울·경기·인천·대전·세종·충청권 철거·원상복구 안내
        </p>

        <p className="mt-3 text-zinc-400">
          무료방문견적 · {PHONE}
        </p>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-violet-100 bg-white shadow-lg md:hidden">
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
