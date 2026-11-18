


import Link from "next/link";
import { regions } from "./data/regions";

const PHONE = "010-2269-8352";
const PHONE_URL = "tel:01022698352";
const TALK_URL = "https://talk.naver.com/profile/wnse6xr";

const services = [
  {
    title: "상가철거",
    slug: "commercial",
    english: "COMMERCIAL",
    icon: "🏢",
    description:
      "상가 내부 인테리어와 시설물 철거부터 원상복구까지 현장 조건에 맞춰 작업 범위를 확인합니다.",
  },
  {
    title: "매장철거",
    slug: "store",
    english: "STORE",
    icon: "🏬",
    description:
      "매장 내부 집기와 인테리어, 바닥 및 천장 시설 등 필요한 철거 작업을 안내합니다.",
  },
  {
    title: "사무실철거",
    slug: "office",
    english: "OFFICE",
    icon: "💼",
    description:
      "사무실 파티션과 천장, 바닥, 전기 및 내부 시설물 철거 범위를 확인합니다.",
  },
  {
    title: "점포철거",
    slug: "shop",
    english: "SHOP",
    icon: "🏪",
    description:
      "점포 폐업과 이전 과정에서 필요한 내부 철거와 원상복구 작업을 안내합니다.",
  },
  {
    title: "가게철거",
    slug: "business",
    english: "BUSINESS",
    icon: "🛠️",
    description:
      "가게 내부 시설물과 집기, 인테리어 상태를 확인하고 필요한 철거 범위를 구분합니다.",
  },
  {
    title: "폐업철거",
    slug: "closure",
    english: "CLOSURE",
    icon: "📋",
    description:
      "폐업 일정과 임대인 협의 사항을 확인하고 철거 및 폐기물 처리 범위를 안내합니다.",
  },
  {
    title: "원상복구",
    slug: "restoration",
    english: "RESTORATION",
    icon: "✨",
    description:
      "기존 시설 상태와 임대차 계약 조건을 바탕으로 필요한 원상복구 범위를 검토합니다.",
  },
  {
    title: "인테리어철거",
    slug: "interior",
    english: "INTERIOR",
    icon: "🏗️",
    description:
      "기존 인테리어 벽체와 천장, 바닥 마감재 및 내부 시설물 철거 범위를 확인하고 후속 공사를 준비합니다.",
  },
];

const industries = [
  { title: "음식점철거", slug: "restaurant" },
  { title: "카페철거", slug: "cafe" },
  { title: "식당철거", slug: "dining" },
  { title: "학원철거", slug: "academy" },
  { title: "병원철거", slug: "hospital" },
  { title: "미용실철거", slug: "hair-salon" },
  { title: "네일샵철거", slug: "nail-shop" },
  { title: "피부관리실철거", slug: "skin-care" },
  { title: "헬스장철거", slug: "gym" },
  { title: "필라테스철거", slug: "pilates" },
  { title: "편의점철거", slug: "convenience-store" },
  { title: "무인매장철거", slug: "unmanned-store" },
  { title: "주점철거", slug: "bar" },
  { title: "노래방철거", slug: "karaoke" },
  { title: "PC방철거", slug: "pc-room" },
  { title: "독서실철거", slug: "reading-room" },
  { title: "스터디카페철거", slug: "study-cafe" },
  { title: "안경점철거", slug: "optical-store" },
  { title: "의류매장철거", slug: "clothing-store" },
  { title: "프랜차이즈철거", slug: "franchise" },
];

const completedProjects = [
  "20평 매장 철거완료",
  "28평 아파트 인테리어철거 완료",
  "35평 사무실 원상복구 완료",
  "18평 카페 철거완료",
  "42평 학원 철거완료",
  "25평 음식점 철거완료",
  "30평 상가 원상복구 완료",
  "16평 미용실 철거완료",
  "50평 사무실 철거완료",
  "22평 점포 폐업철거 완료",
];

const achievements = [
  {
    number: "2,790",
    label: "학원·카페·식당 철거 및 원상복구",
  },
  {
    number: "2,450",
    label: "상가·병원 철거 및 원상복구",
  },
  {
    number: "2,450",
    label: "인테리어 철거·폐기물 처리",
  },
  {
    number: "5,560",
    label: "정부지원금 상담",
  },
  {
    number: "7,690",
    label: "폐업 및 철거",
  },
  {
    number: "3,685",
    label: "정부지원 철거",
  },
];

const steps = [
  {
    title: "상담 접수",
    description:
      "철거 지역, 현장 종류, 면적과 희망 일정을 확인합니다.",
  },
  {
    title: "현장 확인",
    description:
      "철거 대상과 유지 시설, 작업 환경을 확인합니다.",
  },
  {
    title: "견적 안내",
    description:
      "작업 범위와 폐기물 처리 등을 바탕으로 견적을 안내합니다.",
  },
  {
    title: "철거 진행",
    description:
      "협의된 일정과 범위에 따라 작업을 진행합니다.",
  },
  {
    title: "현장 마무리",
    description:
      "철거 완료 후 현장 상태와 원상복구 범위를 확인합니다.",
  },
];

const faqs = [
  {
    question: "철거 견적은 어떻게 확인하나요?",
    answer:
      "현장 면적, 내부 인테리어, 철거 대상 시설물, 폐기물 처리 범위 등을 확인하여 안내합니다. 정확한 견적을 위해 현장 실측이 필요할 수 있습니다.",
  },
  {
    question: "무료 방문견적이 가능한가요?",
    answer:
      "더세이브철거는 무료 방문 실측 및 견적 상담을 안내합니다. 방문 가능 일정은 상담을 통해 조율합니다.",
  },
  {
    question: "상가와 매장 원상복구도 진행하나요?",
    answer:
      "상가, 매장, 점포, 가게, 사무실 등 다양한 공간의 철거와 원상복구 상담을 진행합니다. 작업 범위는 현장과 계약 조건에 따라 달라집니다.",
  },
  {
    question: "폐업 전에 무엇을 준비해야 하나요?",
    answer:
      "임대차 계약서의 원상복구 조건, 임대인과 협의한 사항, 철거 일정, 유지할 시설 등을 확인하는 것이 좋습니다.",
  },
  {
    question: "철거 폐기물 처리도 가능한가요?",
    answer:
      "현장에서 발생하는 폐기물의 종류와 양, 반출 환경을 확인하여 처리 범위를 함께 안내합니다.",
  },
];

const sectionLabel =
  "text-xs font-black uppercase tracking-[0.25em] text-violet-600";

const primaryButton =
  "inline-flex items-center justify-center rounded-full bg-violet-700 px-7 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800";

const secondaryButton =
  "inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-7 py-4 text-sm font-black text-violet-800 transition hover:bg-violet-50";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-16 text-zinc-950 md:pb-0">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">

          <Link href="/" className="flex flex-col">
            <span className="text-xl font-black tracking-tight md:text-2xl">
              더세이브
              <span className="text-violet-700">철거</span>
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-[0.16em] text-zinc-400">
              THE SAVE DEMOLITION
            </span>
          </Link>

          <nav className="hidden items-center gap-3 text-xs font-bold text-zinc-600 xl:flex 2xl:gap-5">
            <a href="#services" className="hover:text-violet-700">철거 서비스</a>
            <Link href="/industries" className="hover:text-violet-700">업종별 철거</Link>
            <Link href="/regions" className="hover:text-violet-700">지역별 안내</Link>
            <Link href="/support" className="hover:text-violet-700">철거지원금</Link>
            <Link href="/cases" className="hover:text-violet-700">철거사례</Link>
            <Link href="/estimates" className="hover:text-violet-700">업종별 견적</Link>
            <Link href="/qa" className="hover:text-violet-700">철거 Q&A</Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={TALK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-violet-200 px-5 py-3 text-sm font-bold text-violet-700 hover:bg-violet-50 sm:inline-flex"
            >
              네이버 톡톡
            </a>

            <a
              href={PHONE_URL}
              className="rounded-full bg-violet-700 px-4 py-3 text-xs font-black text-white hover:bg-violet-800 sm:px-5 sm:text-sm"
            >
              무료방문견적
            </a>
          </div>
        </div>
      </header>

      {/* MOBILE RESOURCE NAVIGATION */}
      <nav
        aria-label="철거 정보 카테고리"
        className="border-b border-violet-100 bg-white xl:hidden"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 md:px-8">
          {[
            { label: "업종별 철거", href: "/industries" },
            { label: "지역별 안내", href: "/regions" },
            { label: "철거지원금", href: "/support" },
            { label: "철거사례", href: "/cases" },
            { label: "업종별 견적", href: "/estimates" },
            { label: "철거 Q&A", href: "/qa" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-black text-violet-800 transition hover:bg-violet-700 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-violet-50 to-purple-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-violet-300/30 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2">

          <div>
            <p className="inline-flex rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-black text-violet-700">
              철거 · 폐업 · 원상복구 전문 상담
            </p>

            <p className="mt-8 text-sm font-black tracking-[0.18em] text-violet-700">
              더세이브철거
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.2] tracking-tight md:text-6xl">
              철거의 기준을
              <br />
              <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                새롭게 만듭니다.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-zinc-600 md:text-lg">
              상가·매장·점포·가게·사무실 철거부터 폐업 원상복구,
              인테리어철거까지. 현장 상태와 필요한 작업 범위를
              확인하여 합리적인 철거 계획을 안내합니다.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href={PHONE_URL} className={primaryButton}>
                무료 방문견적 신청하기
              </a>

              <a
                href={TALK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryButton}
              >
                네이버 톡톡 상담
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-5 text-sm font-bold text-zinc-600">
              <span>✓ 무료 방문 실측</span>
              <span>✓ 원상복구 상담</span>
              <span>✓ 폐기물 처리 안내</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-[#A78BFA] via-[#7C3AED] to-[#4C1D95] p-8 text-white shadow-2xl shadow-violet-300/40 md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/20 bg-white/10"
            />

            <div className="relative">
              <p className="text-xs font-black tracking-[0.25em] text-violet-100">
                THE SAVE COMPANY
              </p>

              <h2 className="mt-14 text-3xl font-black leading-tight md:text-4xl">
                공간의 마지막까지
                <br />
                책임감 있게.
              </h2>

              <p className="mt-5 text-sm leading-8 text-violet-100">
                현장 확인부터 철거 범위 협의, 작업 진행과
                마무리까지 체계적으로 안내합니다.
              </p>

              <div className="mt-12 rounded-2xl border border-white/20 bg-white/15 p-6 backdrop-blur-md">
                <p className="text-xs font-bold text-violet-100">
                  무료 방문견적 · 전화상담
                </p>

                <a
                  href={PHONE_URL}
                  className="mt-3 block text-3xl font-black tracking-tight md:text-4xl"
                >
                  {PHONE}
                </a>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                {[
                  "상가·매장",
                  "사무실·점포",
                  "폐업·원상복구",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/20 bg-white/10 px-2 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETED PROJECTS */}
      <section
        aria-label="철거 현장 안내"
        className="overflow-hidden border-y border-violet-100 bg-white py-12"
      >
        <div className="mx-auto mb-7 max-w-7xl px-5 md:px-8">
          <p className={sectionLabel}>THE SAVE PROJECT</p>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">
            철거 현장 안내
          </h2>
        </div>

        <div className="group overflow-hidden">
          <div className="project-marquee flex w-max group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 gap-4 pr-4"
              >
                {completedProjects.map((project, index) => (
                  <div
                    key={`${copy}-${index}`}
                    className="flex shrink-0 items-center gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-white to-violet-50 px-6 py-5 shadow-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700">
                      ✓
                    </span>

                    <span className="whitespace-nowrap text-sm font-black text-violet-950 md:text-base">
                      {project}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES - 8 INDEPENDENT PAGES */}
      <section
        id="services"
        className="scroll-mt-24 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className={sectionLabel}>OUR SERVICES</p>

          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            철거 종류별 전문 안내
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-zinc-600">
            공간의 용도와 철거 목적에 따라 필요한 작업이 달라집니다.
            현장별 작업 범위와 원상복구 조건을 확인하여 안내합니다.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/service/${service.slug}`}
                className="group relative flex min-h-[290px] flex-col overflow-hidden rounded-[1.6rem] border border-violet-300/40 bg-gradient-to-br from-[#A78BFA] via-[#7C3AED] to-[#4C1D95] p-7 text-white shadow-lg shadow-violet-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full border border-white/20 bg-white/10"
                />

                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-black tracking-[0.2em] text-violet-100">
                    {service.english}
                  </span>

                  <span className="text-sm font-black text-violet-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <span
                  className="relative mt-7 text-4xl"
                  aria-hidden="true"
                >
                  {service.icon}
                </span>

                <h3 className="relative mt-5 text-2xl font-black">
                  {service.title}
                </h3>

                <p className="relative mt-3 flex-1 text-sm leading-7 text-violet-50">
                  {service.description}
                </p>

                <div className="relative mt-6 flex justify-between border-t border-white/25 pt-4 text-sm font-bold">
                  <span>서비스 상세 안내</span>

                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCE CATEGORIES */}
      <section
        id="resources"
        className="scroll-mt-24 border-y border-violet-100 bg-violet-50/60 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className={sectionLabel}>DEMOLITION GUIDE</p>

          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            철거에 필요한 정보 한눈에 보기
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-zinc-600">
            폐업 지원제도부터 철거사례 안내, 업종별 견적 기준,
            자주 묻는 질문까지 필요한 정보를 확인해 보세요.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "철거지원금", english: "SUPPORT GUIDE", icon: "📋", description: "폐업 점포 철거지원 제도와 신청 조건, 준비 서류 및 확인사항을 안내합니다.", href: "/support" },
              { title: "철거사례", english: "DEMOLITION CASES", icon: "🏢", description: "상가·매장·점포·사무실 등 공간별 철거 과정과 주요 작업 범위를 살펴봅니다.", href: "/cases" },
              { title: "업종별 견적", english: "ESTIMATE GUIDE", icon: "🧾", description: "음식점·카페·학원·미용실 등 업종별 철거견적의 주요 산정 기준을 확인합니다.", href: "/estimates" },
              { title: "철거 Q&A", english: "QUESTIONS & ANSWERS", icon: "💬", description: "철거비용, 폐업 원상복구, 폐기물 처리와 공사 일정에 관한 궁금증을 확인합니다.", href: "/qa" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[1.7rem] border border-violet-300/30 bg-gradient-to-br from-[#A78BFA] via-[#7C3AED] to-[#4C1D95] p-7 text-white shadow-lg shadow-violet-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/20 bg-white/10"
                />

                <div className="relative flex flex-1 flex-col">
                  <span className="text-xs font-black tracking-[0.15em] text-violet-100">
                    {item.english}
                  </span>

                  <span
                    className="mt-8 text-4xl"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>

                  <h3 className="mt-5 text-2xl font-black">
                    {item.title}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-7 text-violet-50">
                    {item.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-white/25 pt-5 text-sm font-black">
                    <span>자세히 보기</span>
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES - 20 DETAIL PAGE LINKS */}
      <section
        id="industries"
        className="scroll-mt-24 bg-gradient-to-b from-violet-50 to-white py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className={sectionLabel}>INDUSTRY SOLUTIONS</p>

          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            업종별 철거 안내
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-zinc-600">
            음식점, 카페, 학원, 병원, 미용실 등 업종별 특성을 고려하여
            필요한 철거 및 원상복구 범위를 안내합니다.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {industries.map((industry, index) => (
              <Link
                key={industry.slug}
                href={`/industry/${industry.slug}`}
                className="group flex min-h-[135px] flex-col justify-center rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
              >
                <span className="text-xs font-black text-violet-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-4 text-sm font-black text-zinc-900 group-hover:text-violet-700 md:text-base">
                  {industry.title}
                </h3>

                <span className="mt-3 text-xs text-zinc-400">
                  상세 페이지 보기 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section
        id="achievements"
        className="scroll-mt-24 overflow-hidden bg-gradient-to-br from-[#160D29] via-[#28134C] to-[#4C1D95] py-20 text-white md:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-black tracking-[0.25em] text-violet-300">
              THE SAVE IN NUMBERS
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
              숫자로 확인하는
              <br />
              <span className="text-violet-300">
                더세이브
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-violet-100">
              철거와 원상복구, 폐업 관련 서비스의 주요 지표를
              한눈에 확인할 수 있도록 구성했습니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "철거 및 원상복구",
                "폐업 관련 상담",
                "정부지원 안내",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-violet-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-violet-400/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md md:p-6">
              <div className="mb-5 flex items-center justify-between px-2">
                <span className="text-xs font-black tracking-[0.2em] text-violet-200">
                  PERFORMANCE
                </span>

                <span className="flex items-center gap-2 text-xs font-bold text-violet-200">
                  <span className="h-2 w-2 rounded-full bg-violet-300" />
                  AUTO ROLLING
                </span>
              </div>

              <div
                className="achievement-viewport relative h-[250px] overflow-hidden rounded-2xl md:h-[280px]"
                aria-label="주요 지표 자동 전환"
              >
                {achievements.map((achievement, index) => (
                  <div
                    key={`${achievement.label}-${index}`}
                    className="achievement-slide absolute inset-0 flex flex-col justify-center border-b-[3px] border-violet-300 bg-gradient-to-br from-[#39245D] via-[#30204F] to-[#1F1B34] px-7 py-8 md:px-10"
                    style={{
                      animationDelay: `${index * -3}s`,
                    }}
                    aria-hidden={index !== 0}
                  >
                    <span className="text-xs font-black tracking-[0.2em] text-violet-300">
                      THE SAVE PERFORMANCE
                    </span>

                    <p className="mt-5 text-5xl font-black tracking-tight text-[#C4F66B] sm:text-6xl md:text-7xl">
                      {achievement.number}
                      <span className="ml-1 text-3xl md:text-4xl">
                        +
                      </span>
                    </p>

                    <p className="mt-5 text-sm font-bold text-white md:text-base">
                      {achievement.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between px-2">
                <p className="text-xs text-violet-200">
                  6개 항목 자동 순환
                </p>

                <span className="text-xs font-bold text-violet-200">
                  3초 간격
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section
        id="regions"
        className="scroll-mt-24 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className={sectionLabel}>SERVICE AREAS</p>

          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            지역별 철거업체 안내
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-zinc-600">
            서울·경기·인천·대전·세종·충남·충북 지역의
            철거와 원상복구 정보를 확인할 수 있습니다.
            큰 지역을 선택하면 세부 지역 목록이 펼쳐집니다.
          </p>

          <div className="mt-12 grid items-start gap-5 md:grid-cols-2">
            {regions.map((region) => (
              <details
                key={region.path}
                className="region-accordion group overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-lg"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 md:p-8">
                  <div>
                    <p className="text-xs font-black tracking-[0.15em] text-violet-600">
                      SERVICE AREA
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-zinc-900">
                      {region.name} 철거업체
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-zinc-500">
                      {region.name} 지역 철거 및 원상복구 안내
                    </p>
                  </div>

                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-50 text-2xl font-bold text-violet-700 transition group-open:rotate-45 group-open:bg-violet-700 group-open:text-white">
                    +
                  </span>
                </summary>

                <div className="border-t border-violet-100 bg-gradient-to-b from-violet-50/60 to-white px-6 pb-7 pt-6 md:px-8">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-zinc-800">
                      세부 지역 선택
                    </p>

                    <Link
                      href={region.path}
                      className="rounded-full bg-violet-700 px-4 py-2 text-xs font-black text-white transition hover:bg-violet-800"
                    >
                      {region.name} 전체 보기 →
                    </Link>
                  </div>

                  {region.children && region.children.length > 0 ? (
                    <nav
                      aria-label={`${region.name} 세부 지역`}
                      className="flex flex-wrap gap-2"
                    >
                      {region.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className="rounded-full border border-violet-100 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-violet-400 hover:bg-violet-700 hover:text-white"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </nav>
                  ) : (
                    <p className="text-sm leading-7 text-zinc-500">
                      해당 지역의 상세 안내는 전체 보기에서 확인할 수 있습니다.
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section
        id="process"
        className="scroll-mt-24 bg-zinc-50 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className={sectionLabel}>WORK PROCESS</p>

          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            철거 진행 절차
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <span className="text-3xl font-black text-violet-600">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-5 text-lg font-black">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INFORMATION */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8">
          <article className="rounded-[1.7rem] border border-violet-100 bg-violet-50 p-8 md:p-10">
            <p className={sectionLabel}>SITE INSPECTION</p>

            <h2 className="mt-4 text-2xl font-black leading-snug md:text-3xl">
              철거 전 확인해야 할
              <br />
              원상복구 범위
            </h2>

            <p className="mt-5 leading-8 text-zinc-600">
              임대차 계약 조건과 기존 시설 상태에 따라 철거 및 원상복구
              범위가 달라질 수 있습니다. 철거 대상과 유지할 시설을
              구분하고 임대인과 협의한 내용을 확인하는 것이 중요합니다.
            </p>
          </article>

          <article className="rounded-[1.7rem] border border-zinc-200 bg-zinc-50 p-8 md:p-10">
            <p className={sectionLabel}>ESTIMATE GUIDE</p>

            <h2 className="mt-4 text-2xl font-black leading-snug md:text-3xl">
              현장에 맞는
              <br />
              철거 견적 안내
            </h2>

            <p className="mt-5 leading-8 text-zinc-600">
              공간의 면적뿐 아니라 내부 구조, 철거 대상 시설,
              폐기물 반출 환경, 작업 일정 등을 함께 확인해야 합니다.
              현장 실측을 통해 필요한 작업 범위를 안내합니다.
            </p>
          </article>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-24 bg-zinc-50 py-20 md:py-28"
      >
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="text-center">
            <p className={sectionLabel}>
              FREQUENTLY ASKED QUESTIONS
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              자주 묻는 질문
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  <span>{faq.question}</span>

                  <span className="text-2xl text-violet-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-5 border-t border-zinc-100 pt-5 text-sm leading-8 text-zinc-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="scroll-mt-24 bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] py-20 text-white md:py-28"
      >
        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
          <p className="text-xs font-black tracking-[0.3em] text-violet-200">
            FREE SITE ESTIMATE
          </p>

          <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            철거와 원상복구,
            <br />
            상담부터 시작하세요.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-violet-100">
            상가·매장·점포·가게·사무실·폐업철거,
            인테리어철거 및 원상복구까지
            현장 상황에 맞춰 필요한 작업 범위를 안내합니다.
          </p>

          <a
            href={PHONE_URL}
            className="mt-8 inline-block text-4xl font-black tracking-tight md:text-6xl"
          >
            {PHONE}
          </a>

          <p className="mt-3 text-sm font-semibold text-violet-200">
            무료 방문 실측 · 견적 상담
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={PHONE_URL}
              className="rounded-full bg-white px-8 py-4 text-sm font-black text-violet-800 hover:bg-violet-50"
            >
              전화상담
            </a>

            <a
              href={TALK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-black text-white hover:bg-white/20"
            >
              네이버 톡톡
            </a>

            <a
              href="/regions"
              className="rounded-full border border-white/40 px-8 py-4 text-sm font-black text-white hover:bg-white/10"
            >
              지역별 안내
            </a>
          </div>

          <p className="mt-7 text-sm text-violet-200">
            실시간 채팅으로도 상담하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-violet-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <p className="text-2xl font-black">
                더세이브
                <span className="text-violet-700">철거</span>
              </p>

              <p className="mt-4 max-w-md text-sm leading-7 text-zinc-500">
                서울·경기·인천·대전·세종·충남·충북 지역
                상가·매장·사무실·점포·가게 철거,
                인테리어철거 및 폐업 원상복구 안내
              </p>
            </div>

            <div className="text-sm">
              <p className="font-black">상담 안내</p>

              <a
                href={PHONE_URL}
                className="mt-4 block font-bold text-violet-700"
              >
                {PHONE}
              </a>

              <a
                href={TALK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-zinc-600 hover:text-violet-700"
              >
                네이버 톡톡
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-zinc-100 pt-6 text-xs text-zinc-400">
            © 2026 더세이브철거. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MOBILE CONTACT */}
      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-violet-100 bg-white shadow-lg md:hidden">
        <a
          href={PHONE_URL}
          className="flex items-center justify-center bg-violet-700 px-3 py-4 text-sm font-black text-white"
        >
          전화상담
        </a>

        <a
          href={TALK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-4 text-sm font-black text-violet-700"
        >
          네이버 톡톡
        </a>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes projectMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .project-marquee {
          animation: projectMarquee 22s linear infinite;
          will-change: transform;
        }

        @keyframes achievementFade {
          0% {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          13.5% {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          16.66% {
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
          }

          99.99% {
            opacity: 0;
            visibility: hidden;
            transform: translateY(8px);
          }

          100% {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
        }

        .achievement-slide {
          opacity: 0;
          visibility: hidden;
          animation: achievementFade 18s linear infinite;
          will-change: opacity, transform;
        }

        .achievement-viewport:hover .achievement-slide {
          animation-play-state: paused;
        }

        .region-accordion summary {
          list-style: none;
        }

        .region-accordion summary::-webkit-details-marker {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .project-marquee,
          .achievement-slide {
            animation: none;
          }

          .achievement-slide:first-child {
            opacity: 1;
            visibility: visible;
          }
        }
      `}</style>
    </main>
  );
}




