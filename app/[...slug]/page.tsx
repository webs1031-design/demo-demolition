import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { regions, type Region } from "../data/regions";
import {
  createRegionContent,
  type ContentHighlight,
  type ContentSection,
  type RegionContent,
} from "../data/content";

/* =========================================================
   사이트 기본 정보
========================================================= */

const SITE_URL = "https://demo.thesavecompany.com";
const SITE_NAME = "더세이브철거";

const PHONE_DISPLAY = "010-2269-8352";
const PHONE_LINK = "tel:01022698352";

const NAVER_TALK =
  "https://talk.naver.com/profile/wnse6xr";

/*
  Next.js instant navigation 과정에서
  params 접근으로 발생할 수 있는 오류를 방지합니다.
*/
export const instant = false;

/* =========================================================
   PAGE PROPS
========================================================= */

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

/* =========================================================
   REGION MATCH
========================================================= */

type RegionMatch = {
  region: Region;
  ancestors: Region[];
};

/* =========================================================
   지역 데이터 탐색
========================================================= */

function findRegionBySegments(
  items: Region[],
  segments: string[],
  depth = 0,
  ancestors: Region[] = []
): RegionMatch | null {
  const currentSlug = segments[depth];

  if (!currentSlug) {
    return null;
  }

  const currentRegion = items.find(
    (item) => item.slug === currentSlug
  );

  if (!currentRegion) {
    return null;
  }

  const nextAncestors = [
    ...ancestors,
    currentRegion,
  ];

  if (depth === segments.length - 1) {
    return {
      region: currentRegion,
      ancestors: nextAncestors,
    };
  }

  if (
    !currentRegion.children ||
    currentRegion.children.length === 0
  ) {
    return null;
  }

  return findRegionBySegments(
    currentRegion.children,
    segments,
    depth + 1,
    nextAncestors
  );
}

/* =========================================================
   모든 지역 경로 생성
========================================================= */

function getAllRegionPaths(
  items: Region[],
  parentSegments: string[] = []
): string[][] {
  const paths: string[][] = [];

  for (const item of items) {
    const currentSegments = [
      ...parentSegments,
      item.slug,
    ];

    paths.push(currentSegments);

    if (
      item.children &&
      item.children.length > 0
    ) {
      paths.push(
        ...getAllRegionPaths(
          item.children,
          currentSegments
        )
      );
    }
  }

  return paths;
}

/* =========================================================
   부모지역 이름
========================================================= */

function getParentLocationName(
  ancestors: Region[]
) {
  if (ancestors.length <= 1) {
    return undefined;
  }

  return ancestors[
    ancestors.length - 2
  ].name;
}

/* =========================================================
   SEO 검색용 지역명

   예
   서울 강남구
   강남구 역삼동
   안양 만안구
========================================================= */

function getFullSearchLocation(
  region: Region,
  ancestors: Region[]
) {
  if (ancestors.length <= 1) {
    return (
      region.seoLocation ||
      region.name
    );
  }

  if (
    region.seoLocation &&
    region.seoLocation !== region.name
  ) {
    return region.seoLocation;
  }

  const parent =
    ancestors[ancestors.length - 2];

  if (!parent) {
    return region.name;
  }

  return `${parent.name} ${region.name}`;
}

/* =========================================================
   콘텐츠 생성
========================================================= */

function getPageContent(
  region: Region,
  ancestors: Region[],
  pathname: string
): RegionContent {
  return createRegionContent({
    regionName: region.name,
    parentName:
      getParentLocationName(
        ancestors
      ),
    path: pathname,
  });
}

/* =========================================================
   SEO DESCRIPTION
========================================================= */

function createSeoDescription(
  region: Region,
  ancestors: Region[],
  pathname: string
) {
  return getPageContent(
    region,
    ancestors,
    pathname
  ).description;
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const match =
    findRegionBySegments(
      regions,
      slug
    );

  if (!match) {
    return {
      title:
        "지역을 찾을 수 없습니다 | 더세이브철거",

      description:
        "요청한 지역의 철거 정보를 찾을 수 없습니다.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const pathname =
    `/${slug.join("/")}`;

  const content =
    getPageContent(
      match.region,
      match.ancestors,
      pathname
    );

  const description =
    createSeoDescription(
      match.region,
      match.ancestors,
      pathname
    );

  const canonicalUrl =
    `${SITE_URL}${pathname}`;

  return {
    title: content.title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
      },
    },

    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      url: canonicalUrl,
      title: content.title,
      description,
    },

    twitter: {
      card: "summary",
      title: content.title,
      description,
    },
  };
}

/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams() {
  return getAllRegionPaths(
    regions
  ).map((slug) => ({
    slug,
  }));
}

/* =========================================================
   공통 SECTION
========================================================= */

function SectionText({
  section,
}: {
  section: ContentSection;
}) {
  return (
    <>
      {section.label && (
        <p className="text-xs font-black tracking-widest text-zinc-500">
          {section.label}
        </p>
      )}

      <h3 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
        {section.heading}
      </h3>

      <div className="mt-5 space-y-4">
        {section.paragraphs.map(
          (paragraph, index) => (
            <p
              key={index}
              className="leading-8 text-zinc-600"
            >
              {paragraph}
            </p>
          )
        )}
      </div>
    </>
  );
}

/* =========================================================
   HIGHLIGHT
========================================================= */

function HighlightCards({
  heading,
  highlights,
}: {
  heading: string;
  highlights: ContentHighlight[];
}) {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className="max-w-3xl text-2xl font-black md:text-3xl">
          {heading}
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(
            (item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="border border-zinc-200 bg-white p-6"
              >
                <h3 className="font-black">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   GUIDE LAYOUT
========================================================= */

function GuideLayout({
  content,
}: {
  content: RegionContent;
}) {
  return (
    <>
      <section className="bg-zinc-100">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-bold text-zinc-500">
              {content.sectionEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              {content.sectionHeading}
            </h2>

            <p className="mt-6 leading-8 text-zinc-600">
              {content.sectionLead}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {content.sections.map(
              (section, index) => (
                <article
                  key={index}
                  className="rounded-2xl bg-white p-8 shadow-sm"
                >
                  <SectionText
                    section={section}
                  />
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <HighlightCards
        heading={
          content.highlightHeading
        }
        highlights={
          content.highlights
        }
      />
    </>
  );
}

/* =========================================================
   CLOSURE LAYOUT
========================================================= */

function ClosureLayout({
  content,
}: {
  content: RegionContent;
}) {
  return (
    <>
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold text-zinc-400">
              {content.sectionEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              {content.sectionHeading}
            </h2>

            <p className="mt-6 max-w-3xl leading-8 text-zinc-300">
              {content.sectionLead}
            </p>
          </div>

          <div className="mt-14">
            {content.sections.map(
              (section, index) => (
                <article
                  key={index}
                  className="grid gap-5 border-t border-zinc-700 py-9 md:grid-cols-[100px_1fr]"
                >
                  <div className="text-4xl font-black text-zinc-600">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </div>

                  <div className="[&_p]:text-zinc-300">
                    <SectionText
                      section={section}
                    />
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <HighlightCards
        heading={
          content.highlightHeading
        }
        highlights={
          content.highlights
        }
      />
    </>
  );
}

/* =========================================================
   RESTORATION LAYOUT
========================================================= */

function RestorationLayout({
  content,
}: {
  content: RegionContent;
}) {
  const first =
    content.sections[0];

  const remaining =
    content.sections.slice(1);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold text-zinc-500">
              {content.sectionEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              {content.sectionHeading}
            </h2>

            <p className="mt-6 leading-8 text-zinc-600">
              {content.sectionLead}
            </p>
          </div>

          {first && (
            <article className="bg-zinc-950 p-8 text-white md:p-12">
              <div className="[&_p]:text-zinc-300">
                <SectionText
                  section={first}
                />
              </div>
            </article>
          )}
        </div>

        <div className="mt-14 divide-y divide-zinc-200 border-y border-zinc-200">
          {remaining.map(
            (section, index) => (
              <article
                key={index}
                className="grid gap-5 py-9 md:grid-cols-[220px_1fr]"
              >
                <div className="text-sm font-black text-zinc-500">
                  {section.label}
                </div>

                <div>
                  <SectionText
                    section={{
                      ...section,
                      label: undefined,
                    }}
                  />
                </div>
              </article>
            )
          )}
        </div>
      </section>

      <HighlightCards
        heading={
          content.highlightHeading
        }
        highlights={
          content.highlights
        }
      />
    </>
  );
}

/* =========================================================
   COMMERCIAL LAYOUT
========================================================= */

function CommercialLayout({
  content,
}: {
  content: RegionContent;
}) {
  const first =
    content.sections[0];

  const rest =
    content.sections.slice(1);

  return (
    <>
      <section className="bg-zinc-100">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-zinc-500">
                {content.sectionEyebrow}
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                {content.sectionHeading}
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-zinc-600">
                {content.sectionLead}
              </p>
            </div>

            {first && (
              <article className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
                <SectionText
                  section={first}
                />
              </article>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {rest.map(
              (section, index) => (
                <article
                  key={index}
                  className={
                    index % 3 === 0
                      ? "rounded-3xl bg-zinc-950 p-8 text-white md:p-10 [&_p]:text-zinc-300"
                      : "rounded-3xl bg-white p-8 shadow-sm md:p-10"
                  }
                >
                  <SectionText
                    section={section}
                  />
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <HighlightCards
        heading={
          content.highlightHeading
        }
        highlights={
          content.highlights
        }
      />
    </>
  );
}

/* =========================================================
   OFFICE LAYOUT
========================================================= */

function OfficeLayout({
  content,
}: {
  content: RegionContent;
}) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="max-w-4xl">
          <p className="text-sm font-bold text-zinc-500">
            {content.sectionEyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
            {content.sectionHeading}
          </h2>

          <p className="mt-6 leading-8 text-zinc-600">
            {content.sectionLead}
          </p>
        </div>

        <div className="mt-12 border-t border-zinc-950">
          {content.sections.map(
            (section, index) => (
              <article
                key={index}
                className="grid gap-7 border-b border-zinc-200 py-10 lg:grid-cols-[80px_0.8fr_1.2fr]"
              >
                <div className="text-3xl font-black text-zinc-300">
                  {index + 1}
                </div>

                <div>
                  <p className="text-xs font-black tracking-widest text-zinc-500">
                    {section.label}
                  </p>

                  <h3 className="mt-3 text-2xl font-black leading-tight">
                    {section.heading}
                  </h3>
                </div>

                <div className="space-y-4">
                  {section.paragraphs.map(
                    (
                      paragraph,
                      paragraphIndex
                    ) => (
                      <p
                        key={
                          paragraphIndex
                        }
                        className="leading-8 text-zinc-600"
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              </article>
            )
          )}
        </div>
      </section>

      <HighlightCards
        heading={
          content.highlightHeading
        }
        highlights={
          content.highlights
        }
      />
    </>
  );
}

/* =========================================================
   PROCESS LAYOUT
========================================================= */

function ProcessLayout({
  content,
}: {
  content: RegionContent;
}) {
  return (
    <>
      <section className="bg-zinc-100">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-zinc-500">
              {content.sectionEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              {content.sectionHeading}
            </h2>

            <p className="mt-6 leading-8 text-zinc-600">
              {content.sectionLead}
            </p>
          </div>

          <div className="mt-14 max-w-5xl">
            {content.sections.map(
              (section, index) => (
                <article
                  key={index}
                  className="relative border-l-2 border-zinc-300 pb-12 pl-9 last:pb-0"
                >
                  <span className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-xs font-black text-white">
                    {index + 1}
                  </span>

                  <div className="bg-white p-7 md:p-9">
                    <SectionText
                      section={section}
                    />
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <HighlightCards
        heading={
          content.highlightHeading
        }
        highlights={
          content.highlights
        }
      />
    </>
  );
}

/* =========================================================
   CONTRACT LAYOUT
========================================================= */

function ContractLayout({
  content,
}: {
  content: RegionContent;
}) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <aside>
            <p className="text-sm font-bold text-zinc-500">
              {content.sectionEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight">
              {content.sectionHeading}
            </h2>

            <p className="mt-6 leading-8 text-zinc-600">
              {content.sectionLead}
            </p>

            <div className="mt-8 border-l-4 border-zinc-950 pl-5 text-sm font-bold leading-7 text-zinc-700">
              계약 종료 전에 반환 기준을
              먼저 확인하면 불필요한
              철거와 추가 복구를 줄이는 데
              도움이 됩니다.
            </div>
          </aside>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {content.sections.map(
              (section, index) => (
                <article
                  key={index}
                  className="py-9"
                >
                  <SectionText
                    section={section}
                  />
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <HighlightCards
        heading={
          content.highlightHeading
        }
        highlights={
          content.highlights
        }
      />
    </>
  );
}

/* =========================================================
   FIELD LAYOUT
========================================================= */

function FieldLayout({
  content,
}: {
  content: RegionContent;
}) {
  return (
    <>
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold text-zinc-400">
              {content.sectionEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              {content.sectionHeading}
            </h2>

            <p className="mt-6 leading-8 text-zinc-300">
              {content.sectionLead}
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden bg-zinc-700 md:grid-cols-2">
            {content.sections.map(
              (section, index) => (
                <article
                  key={index}
                  className="bg-zinc-950 p-8 md:p-10"
                >
                  <div className="[&_p]:text-zinc-300">
                    <SectionText
                      section={section}
                    />
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <HighlightCards
        heading={
          content.highlightHeading
        }
        highlights={
          content.highlights
        }
      />
    </>
  );
}

/* =========================================================
   CONTENT LAYOUT SELECTOR
========================================================= */

function RegionContentLayout({
  content,
}: {
  content: RegionContent;
}) {
  switch (content.layoutType) {
    case "closure":
      return (
        <ClosureLayout
          content={content}
        />
      );

    case "restoration":
      return (
        <RestorationLayout
          content={content}
        />
      );

    case "commercial":
      return (
        <CommercialLayout
          content={content}
        />
      );

    case "office":
      return (
        <OfficeLayout
          content={content}
        />
      );

    case "process":
      return (
        <ProcessLayout
          content={content}
        />
      );

    case "contract":
      return (
        <ContractLayout
          content={content}
        />
      );

    case "field":
      return (
        <FieldLayout
          content={content}
        />
      );

    case "guide":
    default:
      return (
        <GuideLayout
          content={content}
        />
      );
  }
}

/* =========================================================
   INTRO SECTION
========================================================= */

function IntroSection({
  content,
}: {
  content: RegionContent;
}) {
  if (
    content.layoutType ===
      "closure" ||
    content.layoutType === "field"
  ) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold text-zinc-500">
              {content.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              {content.introHeading}
            </h2>
          </div>

          <div className="space-y-5">
            {content.intro.map(
              (paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-8 text-zinc-600 md:text-lg"
                >
                  {paragraph}
                </p>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (
    content.layoutType ===
      "contract" ||
    content.layoutType ===
      "restoration"
  ) {
    return (
      <section className="bg-zinc-100">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-4xl border-l-4 border-zinc-950 pl-7 md:pl-10">
            <p className="text-sm font-bold text-zinc-500">
              {content.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              {content.introHeading}
            </h2>

            <div className="mt-7 space-y-5">
              {content.intro.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className="leading-8 text-zinc-600 md:text-lg"
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
      <div className="max-w-4xl">
        <p className="text-sm font-bold text-zinc-500">
          {content.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
          {content.introHeading}
        </h2>

        <div className="mt-7 space-y-5">
          {content.intro.map(
            (paragraph, index) => (
              <p
                key={index}
                className="text-base leading-8 text-zinc-600 md:text-lg"
              >
                {paragraph}
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REGION PAGE
========================================================= */

export default async function RegionPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const match =
    findRegionBySegments(
      regions,
      slug
    );

  if (!match) {
    notFound();
  }

  const region =
    match.region;

  const ancestors =
    match.ancestors;

  const pathname =
    `/${slug.join("/")}`;

  const canonicalUrl =
    `${SITE_URL}${pathname}`;

  const content =
    getPageContent(
      region,
      ancestors,
      pathname
    );

  const pageDescription =
    createSeoDescription(
      region,
      ancestors,
      pathname
    );

  const searchLocation =
    getFullSearchLocation(
      region,
      ancestors
    );

  /* =======================================================
     부모 지역
  ======================================================= */

  const parentRegion =
    ancestors.length > 1
      ? ancestors[
          ancestors.length - 2
        ]
      : null;

  /* =======================================================
     형제 지역
  ======================================================= */

  const siblingRegions =
    parentRegion?.children?.filter(
      (item) =>
        item.slug !== region.slug
    ) ?? [];

  /* =======================================================
     BREADCRUMB SCHEMA
  ======================================================= */

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: SITE_NAME,
      item: SITE_URL,
    },

    ...ancestors.map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name:
          `${item.name} 철거업체`,
        item:
          `${SITE_URL}${item.path}`,
      })
    ),
  ];

  /* =======================================================
     STRUCTURED DATA
  ======================================================= */

  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "Organization",

        "@id":
          `${SITE_URL}/#organization`,

        name: SITE_NAME,

        url: SITE_URL,

        telephone:
          PHONE_DISPLAY,
      },

      {
        "@type":
          "Service",

        "@id":
          `${canonicalUrl}#service`,

        name:
          `${searchLocation} 철거 및 원상복구`,

        url:
          canonicalUrl,

        description:
          pageDescription,

        provider: {
          "@id":
            `${SITE_URL}/#organization`,
        },

        areaServed: {
          "@type":
            "AdministrativeArea",

          name:
            searchLocation,
        },

        serviceType: [
          "철거업체",
          "상가철거",
          "매장철거",
          "사무실철거",
          "점포철거",
          "가게철거",
          "폐업철거",
          "원상복구",
        ],
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${canonicalUrl}#breadcrumb`,

        itemListElement:
          breadcrumbItems,
      },

      {
        "@type":
          "WebPage",

        "@id":
          `${canonicalUrl}#webpage`,

        url:
          canonicalUrl,

        name:
          content.title,

        description:
          pageDescription,

        inLanguage:
          "ko-KR",

        breadcrumb: {
          "@id":
            `${canonicalUrl}#breadcrumb`,
        },

        about: {
          "@id":
            `${canonicalUrl}#service`,
        },

        isPartOf: {
          "@id":
            `${SITE_URL}/#website`,
        },
      },

      {
        "@type":
          "WebSite",

        "@id":
          `${SITE_URL}/#website`,

        url:
          SITE_URL,

        name:
          SITE_NAME,

        publisher: {
          "@id":
            `${SITE_URL}/#organization`,
        },

        inLanguage:
          "ko-KR",
      },
    ],
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white pb-16 text-zinc-950 md:pb-0"
    >
      {/* JSON-LD */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData
            ).replace(
              /</g,
              "\\u003c"
            ),
        }}
      />

      {/* HEADER */}

      <header className="border-b border-zinc-800 bg-zinc-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-tight"
          >
            더세이브철거
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={PHONE_LINK}
              className="rounded-md bg-white px-4 py-2.5 text-sm font-bold text-zinc-950"
            >
              무료방문견적
            </a>

            <a
              href={NAVER_TALK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-md border border-zinc-600 px-4 py-2.5 text-sm font-bold sm:inline-block"
            >
              네이버 톡톡
            </a>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}

      <nav
        aria-label="현재 위치"
        className="border-b border-zinc-200 bg-zinc-50"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-4 text-sm text-zinc-600">
          <Link
            href="/"
            className="hover:text-zinc-950"
          >
            홈
          </Link>

          {ancestors.map(
            (item) => (
              <span
                key={item.path}
                className="flex items-center gap-2"
              >
                <span
                  aria-hidden="true"
                  className="text-zinc-400"
                >
                  ›
                </span>

                <Link
                  href={item.path}
                  className="hover:text-zinc-950"
                >
                  {item.name} 철거업체
                </Link>
              </span>
            )
          )}
        </div>
      </nav>

      {/* HERO */}

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-5xl">
            <p className="text-sm font-bold tracking-widest text-zinc-400">
              {content.eyebrow}
            </p>

            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              {content.h1}
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
              {pageDescription}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={PHONE_LINK}
                className="rounded-md bg-white px-6 py-3.5 font-bold text-zinc-950"
              >
                무료방문견적{" "}
                {PHONE_DISPLAY}
              </a>

              <a
                href={PHONE_LINK}
                className="rounded-md border border-zinc-600 px-6 py-3.5 font-bold text-white"
              >
                전화상담
              </a>

              <a
                href={NAVER_TALK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-zinc-600 px-6 py-3.5 font-bold text-white"
              >
                네이버 톡톡
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 지역별 도입부 */}

      <IntroSection
        content={content}
      />

      {/* 지역별 핵심 콘텐츠 */}

      <RegionContentLayout
        content={content}
      />

      {/* 지역별 마무리 */}

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <article className="max-w-4xl">
            <p className="text-sm font-bold text-zinc-500">
              {content.closingEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              {content.closingHeading}
            </h2>

            <div className="mt-7 space-y-4">
              {content.closing.map(
                (
                  paragraph,
                  index
                ) => (
                  <p
                    key={index}
                    className="leading-8 text-zinc-600 md:text-lg"
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </article>
        </div>
      </section>

      {/* 하위지역 내부링크 */}

      {region.children &&
        region.children.length > 0 && (
          <section className="bg-zinc-100">
            <div className="mx-auto max-w-7xl px-6 py-20">
              <div className="max-w-3xl">
                <p className="text-sm font-bold text-zinc-500">
                  세부 지역
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {region.name} 세부 지역
                  철거업체
                </h2>

                <p className="mt-5 leading-8 text-zinc-600">
                  아래 세부 지역을 선택하면
                  각 지역의 상가·매장·사무실
                  철거와 폐업 후 원상복구
                  정보를 확인할 수 있습니다.
                </p>
              </div>

              <nav
                aria-label={`${region.name} 세부 지역`}
                className="mt-8 flex flex-wrap gap-3"
              >
                {region.children.map(
                  (child) => (
                    <Link
                      key={child.path}
                      href={child.path}
                      className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-bold transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                    >
                      {child.name} 철거업체
                    </Link>
                  )
                )}
              </nav>
            </div>
          </section>
        )}

      {/* 형제지역 내부링크 */}

      {siblingRegions.length >
        0 && (
        <section className="border-t border-zinc-200">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <p className="text-sm font-bold text-zinc-500">
              관련 지역
            </p>

            <h2 className="mt-3 text-2xl font-black">
              {parentRegion
                ? `${parentRegion.name} 관련 지역 철거 안내`
                : "같은 권역의 철거 안내"}
            </h2>

            <nav
              aria-label="관련 지역"
              className="mt-7 flex flex-wrap gap-3"
            >
              {siblingRegions.map(
                (sibling) => (
                  <Link
                    key={
                      sibling.path
                    }
                    href={
                      sibling.path
                    }
                    className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-bold transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                  >
                    {sibling.name}{" "}
                    철거업체
                  </Link>
                )
              )}
            </nav>
          </div>
        </section>
      )}

      {/* 부모지역 링크 */}

      {parentRegion && (
        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <Link
              href={
                parentRegion.path
              }
              className="font-bold text-zinc-700 hover:text-zinc-950"
            >
              ← {parentRegion.name}{" "}
              철거업체 안내로 이동
            </Link>
          </div>
        </section>
      )}

      {/* CONTACT */}

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center md:py-24">
          <p className="text-sm font-bold text-zinc-400">
            {searchLocation} 무료 방문견적
          </p>

          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            현장을 확인하고
            <br />
            필요한 철거 범위를
            안내합니다
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-300">
            상가·매장·사무실·점포·가게
            철거와 폐업 후 원상복구
            상담이 필요하다면 현장
            확인을 통해 필요한 작업
            범위를 살펴볼 수 있습니다.
          </p>

          <a
            href={PHONE_LINK}
            className="mt-8 block text-3xl font-black tracking-tight md:text-5xl"
          >
            {PHONE_DISPLAY}
          </a>

          <p className="mt-3 text-sm text-zinc-400">
            무료 방문견적 및 전화상담
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={PHONE_LINK}
              className="rounded-md bg-white px-7 py-3.5 font-bold text-zinc-950"
            >
              전화상담
            </a>

            <a
              href={NAVER_TALK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-600 px-7 py-3.5 font-bold text-white"
            >
              네이버 톡톡
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-400">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/"
            className="text-lg font-black text-white"
          >
            더세이브철거
          </Link>

          <p className="mt-3 max-w-3xl text-sm leading-7">
            {searchLocation} 상가철거,
            매장철거, 사무실철거,
            점포철거, 가게철거,
            폐업철거 및 원상복구
            상담을 안내합니다.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={PHONE_LINK}
              className="font-semibold text-white"
            >
              무료방문견적{" "}
              {PHONE_DISPLAY}
            </a>

            <a
              href={NAVER_TALK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white"
            >
              네이버 톡톡
            </a>
          </div>

          <p className="mt-6 text-xs">
            © 2026 더세이브철거
          </p>
        </div>
      </footer>

      {/* 모바일 고정 상담 */}

      <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-2 border-t border-zinc-200 bg-white md:hidden">
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
    </main>
  );
}