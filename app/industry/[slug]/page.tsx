
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const SITE_URL = "https://demo.thesavecompany.com";
const PHONE = "010-2269-8352";
const PHONE_URL = "tel:01022698352";
const TALK_URL = "https://talk.naver.com/profile/wnse6xr";

const INDUSTRIES = [
  ["restaurant", "음식점철거", "주방 후드, 덕트, 조리대, 객석, 급배수 시설"],
  ["cafe", "카페철거", "바 카운터, 싱크대, 진열장, 조명, 바닥"],
  ["dining", "식당철거", "주방 설비, 후드, 객석 파티션, 배수 시설"],
  ["academy", "학원철거", "강의실 칸막이, 상담실, 천장, 조명, 바닥"],
  ["hospital", "병원철거", "진료실 파티션, 대기실, 고정 수납장, 바닥"],
  ["hair-salon", "미용실철거", "샴푸대, 거울, 카운터, 급배수 시설"],
  ["nail-shop", "네일샵철거", "시술 테이블, 수납장, 카운터, 벽면"],
  ["skin-care", "피부관리실철거", "시술실 파티션, 수납장, 카운터, 천장"],
  ["gym", "헬스장철거", "운동용 바닥재, 거울, 샤워실, 락커"],
  ["pilates", "필라테스철거", "고정 거울, 바닥, 파티션, 수납장"],
  ["convenience-store", "편의점철거", "진열대, 계산대, 냉장 설비, 간판"],
  ["unmanned-store", "무인매장철거", "무인 계산대, 진열대, 수납장"],
  ["bar", "주점철거", "바 카운터, 주방 설비, 객석 파티션"],
  ["karaoke", "노래방철거", "객실 파티션, 방음재, 천장, 고정 가구"],
  ["pc-room", "PC방철거", "컴퓨터 책상, 파티션, 전기 및 통신 배선"],
  ["reading-room", "독서실철거", "고정 책상, 좌석 칸막이, 조명"],
  ["study-cafe", "스터디카페철거", "고정 책상, 파티션, 출입 설비"],
  ["optical-store", "안경점철거", "진열장, 수납장, 카운터, 조명"],
  ["clothing-store", "의류매장철거", "진열대, 피팅룸, 선반, 카운터"],
  ["franchise", "프랜차이즈철거", "브랜드 고정 집기, 카운터, 간판"],
] as const;

type Props = {
  params: Promise<{ slug: string }>;
};

function getIndustry(slug: string) {
  return INDUSTRIES.find((item) => item[0] === slug);
}

export function generateStaticParams() {
  return INDUSTRIES.map(([slug]) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) {
    return {
      title: "페이지를 찾을 수 없습니다",
      robots: { index: false, follow: false },
    };
  }

  const [, name, facilities] = industry;
  const title = `${name} | 철거 범위·비용·원상복구 안내`;
  const description =
    `${name} 전문 안내. ${facilities} 등 주요 시설의 철거 범위, ` +
    "비용 결정 요소와 폐업 원상복구 절차를 확인하세요. " +
    "더세이브철거 무료방문견적 상담.";

  const url = `${SITE_URL}/industry/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: "더세이브철거",
      url,
      title,
      description,
    },
  };
}

export default async function IndustryPage({
  params,
}: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) notFound();

  const [, name, facilities] = industry;
  const facilityList = facilities.split(", ");

  const otherIndustries = INDUSTRIES.filter(
    (item) => item[0] !== slug
  ).slice(0, 8);

  return (
    <main className="min-h-screen bg-white pb-16 text-zinc-950 md:pb-0">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="text-xl font-black md:text-2xl">
            더세이브
            <span className="text-violet-700">철거</span>
          </Link>

          <a
            href={PHONE_URL}
            className="rounded-full bg-violet-700 px-5 py-3 text-sm font-black text-white"
          >
            무료방문견적
          </a>
        </div>
      </header>

      {/* BREADCRUMB */}
      <nav className="border-b border-violet-100 bg-violet-50 px-5 py-4 text-xs text-zinc-600">
        <div className="mx-auto max-w-7xl">
          <Link href="/">홈</Link>
          <span className="mx-2">/</span>
          <Link href="/#industries">업종별 철거</Link>
          <span className="mx-2">/</span>
          <strong>{name}</strong>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-white via-violet-50 to-purple-100 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black tracking-[0.25em] text-violet-700">
              THE SAVE DEMOLITION
            </p>

            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              {name}
              <br />
              <span className="text-violet-700">
                철거부터 원상복구까지
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-9 text-zinc-600">
              {name}는 내부 시설의 종류와 작업 범위에 따라
              필요한 철거 과정이 달라집니다.
              현장 구조와 폐기물 처리 조건을 확인하여
              적절한 작업 계획을 안내합니다.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={PHONE_URL}
                className="rounded-full bg-violet-700 px-7 py-4 text-sm font-black text-white"
              >
                무료 방문견적 신청하기
              </a>

              <a
                href={TALK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-violet-200 bg-white px-7 py-4 text-sm font-black text-violet-700"
              >
                네이버 톡톡 상담
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-[#A78BFA] via-[#7C3AED] to-[#4C1D95] p-9 text-white shadow-2xl md:p-12">
            <p className="text-xs font-black tracking-[0.25em] text-violet-100">
              FREE SITE ESTIMATE
            </p>

            <h2 className="mt-12 text-3xl font-black leading-tight">
              {name}
              <br />
              현장 맞춤 상담
            </h2>

            <p className="mt-6 leading-8 text-violet-100">
              현장 확인 · 철거 범위 협의 · 폐기물 처리 · 원상복구
            </p>

            <a
              href={PHONE_URL}
              className="mt-10 block text-3xl font-black md:text-4xl"
            >
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* 주요 철거 대상 */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-black tracking-[0.25em] text-violet-600">
            DEMOLITION SCOPE
          </p>

          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            {name} 주요 철거 대상
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-zinc-600">
            아래 시설은 현장에서 확인할 수 있는 주요 철거 대상입니다.
            실제 작업 여부는 시설 상태와 원상복구 조건에 따라 결정됩니다.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilityList.map((facility, index) => (
              <article
                key={facility}
                className="rounded-2xl border border-violet-100 bg-violet-50 p-7"
              >
                <span className="text-xs font-black text-violet-500">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-5 text-xl font-black">
                  {facility}
                </h3>

                <p className="mt-4 text-sm leading-8 text-zinc-600">
                  해당 시설의 설치 상태와 철거 필요 여부를 확인합니다.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 견적 기준 */}
      <section className="bg-zinc-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-black tracking-[0.25em] text-violet-600">
            ESTIMATE GUIDE
          </p>

          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            {name} 비용을 결정하는 요소
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              ["현장 면적", "전체 면적과 실제 철거가 필요한 구역을 구분합니다."],
              ["내부 시설", "고정 집기와 벽체, 천장, 바닥의 구조를 확인합니다."],
              ["폐기물 처리", "폐기물 종류와 양, 반출 동선 및 작업 환경을 살펴봅니다."],
              ["원상복구 조건", "임대인과 협의한 시설 유지 및 복구 범위를 확인합니다."],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-2xl border border-zinc-200 bg-white p-8"
              >
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-4 leading-8 text-zinc-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 절차 */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 className="text-3xl font-black md:text-4xl">
            {name} 진행 절차
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {[
              "상담 접수",
              "현장 확인",
              "견적 안내",
              "철거 진행",
              "현장 마무리",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-violet-100 p-6"
              >
                <span className="text-2xl font-black text-violet-600">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-5 font-black">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 다른 업종 */}
      <section className="bg-violet-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 className="text-3xl font-black">
            다른 업종별 철거 안내
          </h2>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {otherIndustries.map(([otherSlug, otherName]) => (
              <Link
                key={otherSlug}
                href={`/industry/${otherSlug}`}
                className="rounded-xl border border-violet-100 bg-white p-5 text-sm font-black transition hover:bg-violet-100"
              >
                {otherName} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 상담 */}
      <section className="bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] py-20 text-center text-white">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-3xl font-black md:text-5xl">
            {name} 무료방문견적
          </h2>

          <p className="mt-6 leading-8 text-violet-100">
            현장 상황과 필요한 철거 범위를 확인하여 안내합니다.
          </p>

          <a
            href={PHONE_URL}
            className="mt-8 block text-4xl font-black md:text-6xl"
          >
            {PHONE}
          </a>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
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
              className="rounded-full border border-white/40 px-8 py-4 text-sm font-black"
            >
              네이버 톡톡
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-xl font-black">
            더세이브<span className="text-violet-700">철거</span>
          </Link>

          <p className="mt-4 text-sm text-zinc-500">
            {name} · 폐업철거 · 원상복구 · 무료방문견적
          </p>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 bg-white shadow-lg md:hidden">
        <a
          href={PHONE_URL}
          className="bg-violet-700 py-4 text-center text-sm font-black text-white"
        >
          전화상담
        </a>

        <a
          href={TALK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="py-4 text-center text-sm font-black text-violet-700"
        >
          네이버 톡톡
        </a>
      </div>
    </main>
  );
}
