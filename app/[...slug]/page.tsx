












import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { regions, type Region } from "../data/regions";
import { createRegionContent } from "../data/content";

const SITE_URL = "https://demo.thesavecompany.com";
const PHONE = "010-2269-8352";
const PHONE_URL = "tel:01022698352";
const TALK_URL = "https://talk.naver.com/profile/wnse6xr";

type Props = {
  params: Promise<{ slug: string[] }>;
};

type Detail = {
  slug: string;
  name: string;
  intro: string;
  targets: string[];
  checks: string[];
  costs: string[];
};

type RouteInfo = {
  region: Region;
  ancestors: Region[];
  kind: "region" | "service" | "industry";
  detail: Detail | null;
};

type InfoSection = {
  id: string;
  title: string;
  description: string;
  points: string[];
};

type LocalProfile = {
  commerce: string;
  building: string;
  access: string;
  restoration: string;
  keywords: string[];
};

const services: Detail[] = [
  {
    slug: "commercial",
    name: "상가철거",
    intro: "상가 내부 시설과 인테리어 철거, 폐업 원상복구 범위를 안내합니다.",
    targets: ["벽체", "천장", "바닥", "간판", "고정 집기", "전기설비"],
    checks: ["임대차계약서", "원상복구 범위", "건물 관리규정"],
    costs: ["면적", "마감재", "폐기물", "반출 조건"],
  },
  {
    slug: "store",
    name: "매장철거",
    intro: "매장 내부 집기와 진열시설, 바닥과 천장 철거를 안내합니다.",
    targets: ["진열대", "카운터", "조명", "바닥", "천장"],
    checks: ["집기 소유 관계", "보존 시설", "간판 처리"],
    costs: ["집기 수량", "마감재", "운반 거리"],
  },
  {
    slug: "office",
    name: "사무실철거",
    intro: "사무실 파티션과 전기·통신 시설의 철거 및 원상복구를 안내합니다.",
    targets: ["파티션", "바닥재", "천장", "조명", "통신설비"],
    checks: ["업무 종료일", "보안 출입", "설비 유지 범위"],
    costs: ["파티션 수량", "층수", "전기·통신 작업"],
  },
  {
    slug: "shop",
    name: "점포철거",
    intro: "점포 폐업 및 이전 시 필요한 철거 범위를 확인합니다.",
    targets: ["집기", "간판", "벽체", "바닥", "조명"],
    checks: ["인도 일정", "임대인 협의", "집기 반출"],
    costs: ["면적", "내부 구조", "폐기물"],
  },
  {
    slug: "business",
    name: "가게철거",
    intro: "가게 내부 시설과 인테리어를 정리하고 원상복구를 준비합니다.",
    targets: ["고정 가구", "벽체", "천장", "바닥", "간판"],
    checks: ["철거 대상", "유지 시설", "작업 가능 시간"],
    costs: ["시설물 종류", "폐기물", "작업 환경"],
  },
  {
    slug: "closure",
    name: "폐업철거",
    intro: "폐업 일정에 맞춰 철거와 공간 인도에 필요한 사항을 안내합니다.",
    targets: ["영업 시설", "고정 집기", "인테리어", "간판"],
    checks: ["폐업 일정", "임대차 종료일", "지원사업 조건"],
    costs: ["철거 범위", "폐기물", "원상복구 항목"],
  },
  {
    slug: "restoration",
    name: "원상복구",
    intro: "임대차계약과 기존 시설 상태를 바탕으로 복구 범위를 검토합니다.",
    targets: ["벽체", "바닥", "천장", "전기", "배관"],
    checks: ["계약 특약", "최초 인도 상태", "임대인 합의"],
    costs: ["복구 면적", "마감 방식", "설비 상태"],
  },
  {
    slug: "interior",
    name: "인테리어철거",
    intro: "기존 인테리어 마감재와 내부 시설의 철거 범위를 안내합니다.",
    targets: [
      "경량벽체",
      "천장재",
      "바닥재",
      "조명",
      "고정 가구",
      "내부 마감재",
    ],
    checks: [
      "구조체와 비구조체 구분",
      "전기·배관 위치",
      "보존 시설",
      "관리규정",
    ],
    costs: [
      "마감재 종류",
      "철거 면적",
      "작업 난이도",
      "폐기물 양",
    ],
  },
];

const industryEntries = [
  ["restaurant", "음식점철거"],
  ["cafe", "카페철거"],
  ["dining", "식당철거"],
  ["academy", "학원철거"],
  ["hospital", "병원철거"],
  ["hair-salon", "미용실철거"],
  ["nail-shop", "네일샵철거"],
  ["skin-care", "피부관리실철거"],
  ["gym", "헬스장철거"],
  ["pilates", "필라테스철거"],
  ["convenience-store", "편의점철거"],
  ["unmanned-store", "무인매장철거"],
  ["bar", "주점철거"],
  ["karaoke", "노래방철거"],
  ["pc-room", "PC방철거"],
  ["reading-room", "독서실철거"],
  ["study-cafe", "스터디카페철거"],
  ["optical-store", "안경점철거"],
  ["clothing-store", "의류매장철거"],
  ["franchise", "프랜차이즈철거"],
] as const;

const industryFacilities: Record<string, string[]> = {
  restaurant: ["주방 후드", "덕트", "조리대", "급배수"],
  cafe: ["바 카운터", "싱크대", "진열장", "바닥"],
  dining: ["주방시설", "객석", "배관", "후드"],
  academy: ["교실 칸막이", "방음재", "책상", "조명"],
  hospital: ["진료실", "급배수", "특수설비", "파티션"],
  "hair-salon": ["샴푸대", "거울", "급배수", "카운터"],
  "nail-shop": ["시술대", "수납장", "조명", "바닥"],
  "skin-care": ["관리실", "파티션", "급배수", "조명"],
  gym: ["운동기구", "고무바닥", "거울", "샤워시설"],
  pilates: ["운동기구", "거울", "바닥", "파티션"],
  "convenience-store": ["진열대", "냉장시설", "카운터", "간판"],
  "unmanned-store": ["키오스크", "진열대", "CCTV", "통신설비"],
  bar: ["바 카운터", "주방", "조명", "방음재"],
  karaoke: ["방음벽", "객실", "전기", "천장"],
  "pc-room": ["컴퓨터", "책상", "배선", "환기시설"],
  "reading-room": ["책상", "칸막이", "조명", "바닥"],
  "study-cafe": ["좌석", "파티션", "키오스크", "조명"],
  "optical-store": ["진열장", "검안실", "조명", "카운터"],
  "clothing-store": ["행거", "진열대", "피팅룸", "조명"],
  franchise: ["브랜드 간판", "집기", "내부 마감", "설비"],
};

const industries: Detail[] = industryEntries.map(([slug, name]) => ({
  slug,
  name,
  intro: `${name}에 필요한 시설물 철거와 폐업 원상복구 범위를 현장 조건에 따라 확인합니다.`,
  targets: industryFacilities[slug],
  checks: [
    "임대차계약 및 원상복구 조건",
    "철거 대상과 보존 시설",
    "설비 연결 및 건물 관리규정",
  ],
  costs: [
    "내부 면적과 시설 수량",
    "마감재 및 설비 종류",
    "폐기물 운반 조건",
  ],
}));

const sectionLabel =
  "text-xs font-black uppercase tracking-[0.22em] text-violet-600";

function flattenRegions(items: Region[]): Region[] {
  return items.flatMap((item) => [
    item,
    ...flattenRegions(item.children ?? []),
  ]);
}

const allRegions = flattenRegions(regions);

function findRegion(segments: string[]) {
  let items = regions;
  const ancestors: Region[] = [];

  for (const segment of segments) {
    const found = items.find((item) => item.slug === segment);
    if (!found) return null;
    ancestors.push(found);
    items = found.children ?? [];
  }

  const region = ancestors[ancestors.length - 1];
  return region ? { region, ancestors } : null;
}

function resolveRoute(segments: string[]): RouteInfo | null {
  const index = segments.findIndex(
    (part) => part === "service" || part === "industry"
  );

  if (index === -1) {
    const found = findRegion(segments);
    return found
      ? { ...found, kind: "region", detail: null }
      : null;
  }

  if (index < 1 || index !== segments.length - 2) {
    return null;
  }

  const found = findRegion(segments.slice(0, index));
  if (!found) return null;

  const kind = segments[index] as "service" | "industry";

  const detail = (kind === "service" ? services : industries).find(
    (item) => item.slug === segments[index + 1]
  );

  return detail ? { ...found, kind, detail } : null;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function stableShuffle<T>(items: T[], key: string): T[] {
  const result = [...items];
  let seed = hashString(key) || 1;

  for (let i = result.length - 1; i > 0; i--) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;

    const j = (seed >>> 0) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getSelectedIndustries(path: string) {
  return stableShuffle(industries, path).slice(0, 5);
}

/* ======================================================
   지역별 SEO
====================================================== */

const seoSubjects = [
  "상가·사무실",
  "매장·점포",
  "가게·상가",
  "사무실·매장",
  "점포·가게",
  "폐업 매장",
  "상업공간",
  "상가 내부",
  "사무실 이전",
  "매장 폐업",
  "점포 정리",
  "가게 폐업",
  "상가 원상복구",
  "사무실 원상복구",
  "매장 원상복구",
  "점포 원상복구",
  "폐업 원상복구",
  "인테리어 철거",
  "상가·점포",
  "매장·가게",
];

const seoActions = [
  "원상복구 전문 안내",
  "폐업 철거 준비 가이드",
  "철거 비용 확인 방법",
  "원상복구 범위 안내",
  "철거 견적 비교 기준",
  "폐업 정리 절차 안내",
  "철거 전 확인사항",
  "원상복구 비용 가이드",
  "철거 일정 준비 방법",
  "폐기물 처리 안내",
  "철거 계약 체크사항",
  "공간 정리 실무 안내",
  "철거 범위 확인 가이드",
  "폐업 시 주의사항",
  "원상복구 진행 절차",
  "철거 견적 준비 안내",
  "시설물 철거 안내",
  "철거 비용 절감 방법",
  "원상복구 계획 가이드",
  "철거 작업 준비 안내",
];

const seoVariations = [
  "현장별 핵심 정보",
  "실측 전 확인사항",
  "작업 범위 체크리스트",
  "계약 전 실무 안내",
  "공간별 관리 기준",
  "철거 계획 핵심 정리",
  "폐업 일정 준비 정보",
  "현장 상황별 안내",
];

const sortedRegionPaths = [
  ...new Set(allRegions.map((region) => region.path)),
].sort();

function uniqueRegionSuffix(path: string) {
  const index = Math.max(0, sortedRegionPaths.indexOf(path));

  const subject = seoSubjects[index % seoSubjects.length];

  const action =
    seoActions[
      Math.floor(index / seoSubjects.length) % seoActions.length
    ];

  const variation =
    seoVariations[
      Math.floor(
        index / (seoSubjects.length * seoActions.length)
      ) % seoVariations.length
    ];

  const extraIndex = Math.floor(
    index /
      (seoSubjects.length *
        seoActions.length *
        seoVariations.length)
  );

  return [
    subject,
    action,
    variation,
    extraIndex ? `추가 안내 ${extraIndex + 1}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function getSEO(route: RouteInfo, pathname: string) {
  const name = route.region.name;

  const content = createRegionContent({
    regionName: route.region.name,
    parentName: route.region.parentName,
    path: route.region.path,
  });

  if (route.detail) {
    return {
      title: `${name} 철거업체 | ${route.detail.name} 시설 철거와 원상복구 안내`,
      h1: `${name} ${route.detail.name}, 철거 범위와 원상복구`,
      description: `${name} 철거업체 더세이브철거. ${route.detail.name} 주요 시설, 철거 절차, 비용 결정 요소와 폐업 원상복구를 안내합니다.`,
    };
  }

  return {
    title: `${name} 철거업체 | ${uniqueRegionSuffix(pathname)}`,
    h1: content.h1,
    description: content.description,
  };
}

export function generateStaticParams() {
  return allRegions.map((region) => ({
    slug: region.path.split("/").filter(Boolean),
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = resolveRoute(slug);

  if (!route) {
    return {
      title: "페이지를 찾을 수 없습니다",
      robots: { index: false, follow: false },
    };
  }

  const pathname = "/" + slug.join("/");
  const seo = getSEO(route, pathname);
  const url = SITE_URL + pathname;

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: "더세이브철거",
      url,
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
    },
  };
}

/* ======================================================
   지역별 상권 특성 데이터
====================================================== */

const localProfiles: Record<string, LocalProfile> = {
  "/seoul/jongro-gu": {
    commerce:
      "종로구는 종각·종로 일대의 업무 및 상업시설과 인사동·익선동의 음식점, 카페, 소매점 등 서로 다른 형태의 상권을 고려해야 합니다. 폐업하는 점포의 영업 형태에 따라 간판, 주방시설, 고정 집기와 내부 인테리어의 철거 범위가 달라질 수 있습니다.",
    building:
      "구도심의 오래된 상가와 업무용 건물은 내부 구조와 설비 상태가 서로 다를 수 있습니다. 철거 전 벽체의 구조적 역할, 천장 내부 전기설비, 급배수 연결과 보존해야 할 시설을 구분하는 것이 중요합니다.",
    access:
      "전통시장과 골목 상권에서는 차량 진입, 보행자 통행, 폐기물 적재 장소를 미리 확인해야 합니다. 현장에 따라 화물 승강기 사용이나 작업 가능 시간에 제한이 있을 수 있습니다.",
    restoration:
      "임대차계약과 임대인 협의 내용을 기준으로 간판, 벽체, 바닥, 천장 및 전기시설의 복구 범위를 검토합니다. 오래된 건물은 기존 시설과 임차인이 설치한 시설을 구분해야 불필요한 재작업을 줄일 수 있습니다.",
    keywords: ["전통시장", "구도심 상가", "음식점", "카페", "업무시설"],
  },

  "/seoul/gangnam-gu": {
    commerce:
      "강남구는 업무시설과 상업용 빌딩, 학원, 병원, 음식점 및 다양한 판매 매장의 특성을 고려한 철거 계획이 필요합니다. 영업 공간의 구조와 설치된 시설을 확인해 철거 대상을 구분해야 합니다.",
    building:
      "업무용 빌딩과 복합 상업시설에서는 공용부 보호, 전기·통신 설비, 천장과 바닥 마감재의 철거 범위를 검토해야 합니다.",
    access:
      "건물 관리사무소의 작업 승인, 화물 승강기 예약, 주차 공간과 폐기물 반출 동선을 사전에 확인합니다.",
    restoration:
      "사무실 파티션, 매장 인테리어, 조명, 바닥재와 간판 등 임차인이 설치한 시설의 복구 조건을 확인합니다.",
    keywords: ["업무시설", "상업용 빌딩", "학원", "병원", "매장"],
  },

  "/seoul/seocho-gu": {
    commerce:
      "서초구는 사무실, 전문 서비스업 공간, 학원, 음식점 및 상업시설의 용도에 따라 철거 범위를 구분하는 것이 중요합니다.",
    building:
      "사무실의 파티션, 전기·통신 배선, 천장 마감재와 공용시설 보호 조건을 확인해야 합니다.",
    access:
      "업무시설의 출입 승인, 공용 복도 보호, 엘리베이터 사용과 폐기물 운반 일정을 확인합니다.",
    restoration:
      "사무공간의 칸막이, 바닥재, 조명과 전기시설을 중심으로 계약상 원상복구 범위를 검토합니다.",
    keywords: ["사무실", "전문 서비스업", "학원", "상가"],
  },

  "/seoul/songpa-gu": {
    commerce:
      "송파구는 상업시설, 음식점, 학원과 다양한 판매 매장 등 공간의 영업 형태에 맞춰 철거 대상 시설을 구분해야 합니다.",
    building:
      "복합건물과 상업시설에서는 관리규정, 공용시설 보호, 천장 및 전기설비의 유지 범위를 확인합니다.",
    access:
      "상가 내 공용 동선, 폐기물 적재 장소와 차량 접근 조건을 검토하여 철거 일정을 계획합니다.",
    restoration:
      "매장 내부 집기, 벽체, 바닥, 간판과 조명시설을 임대차계약 조건에 맞춰 확인합니다.",
    keywords: ["복합 상업시설", "음식점", "학원", "판매 매장"],
  },

  "/seoul/mapo-gu": {
    commerce:
      "마포구는 홍대·합정·상암 등 서로 다른 상권의 카페, 음식점, 쇼룸과 사무실을 고려해 철거 범위를 확인할 필요가 있습니다.",
    building:
      "노출천장, 특수 마감재, 고정 카운터와 주방시설 등 인테리어 구성이 다양한 공간의 철거 대상을 구분합니다.",
    access:
      "상업시설 주변 보행 동선, 인접 점포의 영업, 차량 진입과 폐기물 반출 시간을 검토합니다.",
    restoration:
      "카페와 음식점의 급배수, 후드·덕트, 바닥 및 벽체 마감재의 복구 조건을 확인합니다.",
    keywords: ["카페", "음식점", "쇼룸", "사무실"],
  },

  "/seoul/seongdong-gu": {
    commerce:
      "성동구는 성수 일대의 카페, 쇼룸, 상업공간과 기존 업무시설 등 다양한 공간 활용 형태를 고려한 철거 계획이 필요합니다.",
    building:
      "노출 마감, 기존 구조물, 고정 진열시설과 내부 인테리어를 구분하여 철거 가능한 범위를 확인합니다.",
    access:
      "현장 출입구 폭, 주변 차량 통행, 폐기물 운반 거리와 적재 가능 장소를 확인합니다.",
    restoration:
      "기존 구조체와 임차인이 설치한 인테리어를 구분하고 바닥, 천장, 벽체 및 전기설비의 복구 범위를 협의합니다.",
    keywords: ["카페", "쇼룸", "상업공간", "인테리어"],
  },

  "/seoul/yeongdeungpo-gu": {
    commerce:
      "영등포구는 업무용 빌딩, 상업시설, 음식점과 소매점 등 다양한 공간의 시설물 철거 조건을 고려해야 합니다.",
    building:
      "사무실의 파티션, 바닥재, 통신 배선과 상업시설의 내부 마감재 및 공용부 보호 조건을 확인합니다.",
    access:
      "건물별 작업 가능 시간, 화물 승강기, 주차장 이용과 폐기물 반출 동선을 검토합니다.",
    restoration:
      "사무실 이전이나 매장 폐업 시 기존 설치 시설과 원상복구 대상을 구분하여 작업 범위를 계획합니다.",
    keywords: ["업무용 빌딩", "상업시설", "음식점", "소매점"],
  },

  "/daejeon/yuseong-gu": {
    commerce:
      "대전 유성구는 연구·업무시설 주변 상권, 음식점, 학원, 사무실과 근린생활시설 등 현장 용도에 따라 철거 대상을 구분할 필요가 있습니다.",
    building:
      "상업용 건물과 업무공간의 내부 칸막이, 천장 마감재, 전기·통신 설비의 유지 여부를 확인합니다.",
    access:
      "상가 주차장과 화물차 진입 조건, 엘리베이터 사용 및 폐기물 반출 경로를 점검합니다.",
    restoration:
      "사무실과 매장의 임대차계약을 기준으로 내부 시설 철거와 원상복구 항목을 확인합니다.",
    keywords: ["연구시설 주변 상권", "사무실", "학원", "근린상가"],
  },
};

function getLocalProfile(region: Region): LocalProfile {
  const exact = localProfiles[region.path];
  if (exact) return exact;

  const name = region.name;
  const parent = region.parentName;
  const isTown = region.level === "town";
  const isDistrict = region.level === "district";

  const keywords = isTown
    ? ["근린상가", "소규모 매장", "음식점", "사무공간"]
    : isDistrict
      ? ["상가", "매장", "사무실", "학원", "음식점"]
      : ["상업시설", "업무시설", "점포", "매장", "사무실"];

  const variation = hashString(region.path) % 4;

  const commerceDescriptions = [
    `${name}의 상가와 매장 철거는 업종에 따라 내부 시설물 구성이 달라질 수 있습니다. 음식점은 주방설비와 급배수, 사무실은 파티션과 통신시설, 판매 매장은 진열시설과 간판을 중심으로 철거 대상을 구분해야 합니다.`,
    `${name}에서 폐업을 준비하는 점포와 가게는 영업 종료 일정뿐 아니라 내부 집기 반출과 시설 철거 순서를 함께 검토해야 합니다. 공간의 용도와 임대차계약에 따라 필요한 원상복구 범위도 달라집니다.`,
    `${name} 지역의 상업공간은 건물 규모와 입점 업종에 따라 작업 조건이 달라질 수 있습니다. 매장, 학원, 사무실, 음식점 등 각 공간의 고정 시설과 유지 설비를 구분하는 것이 철거 계획의 출발점입니다.`,
    `${name}의 철거 견적을 검토할 때는 상권의 명칭보다 실제 현장의 업종, 면적, 시설물 종류를 우선 확인해야 합니다. 같은 지역에서도 주방시설이 있는 가게와 일반 사무실의 철거 범위는 크게 다를 수 있습니다.`,
  ];

  const buildingDescriptions = [
    `${name}의 근린생활시설과 업무용 건물은 벽체, 천장, 바닥의 마감 방식이 다를 수 있습니다. 철거 전 구조체와 비구조체를 구분하고 공용시설을 보호해야 합니다.`,
    `${name} 현장은 건물 관리규정과 기존 설비의 연결 상태를 확인해야 합니다. 전기·통신·급배수 시설을 분리할 때는 유지해야 할 시설과 철거 대상을 명확히 구분하는 것이 중요합니다.`,
    `${name}의 상업용 건물에서는 내부 인테리어 철거뿐 아니라 공용 복도와 승강기 보호가 필요할 수 있습니다. 건물의 구조와 작업 승인 조건을 확인한 뒤 철거 범위를 정합니다.`,
    `${name}에서 오래된 인테리어를 철거하는 경우 기존 마감재 아래에 배선이나 배관이 있을 수 있습니다. 벽체와 천장 내부를 확인하고 후속 공사에 영향을 주는 시설을 점검해야 합니다.`,
  ];

  const accessDescriptions = [
    `${name} 현장의 폐기물 반출은 화물차 진입과 주차 가능 여부, 엘리베이터 또는 계단 사용 조건을 확인한 뒤 계획합니다.`,
    `${name}에서 철거를 진행할 때는 건물의 작업 가능 시간과 주변 보행 동선을 확인해야 합니다. 폐기물 적재 장소와 반출 경로도 사전에 검토하는 것이 좋습니다.`,
    `${name}의 점포 철거에서는 출입구 폭, 층수, 차량 접근성에 따라 운반 방법이 달라질 수 있습니다. 작업 전 반출 동선을 확인해 불필요한 지연을 줄입니다.`,
    `${name}의 상업시설은 인접 점포와 공용 공간을 사용하는 경우가 있으므로 소음·분진 관리, 폐기물 운반 시간과 공용부 보호 조건을 함께 확인합니다.`,
  ];

  const restorationDescriptions = [
    `${name}에서 원상복구를 준비한다면 임대차계약서의 특약과 임대인 협의 내용을 먼저 확인해야 합니다. 벽체, 바닥, 천장, 간판과 전기시설의 복구 범위를 구분합니다.`,
    `${name}의 폐업철거는 집기 철거만으로 마무리되지 않을 수 있습니다. 최초 인도 상태와 현재 시설을 비교하여 원상복구 대상과 유지 시설을 확인해야 합니다.`,
    `${name}의 상가 원상복구에서는 임차인이 설치한 인테리어와 기존 건물 설비를 구분하는 과정이 중요합니다. 철거 후 바닥과 천장 마감 상태도 확인합니다.`,
    `${name}에서 점포를 인도하기 전에는 철거 완료 상태, 폐기물 처리, 전기·급배수 설비의 마무리와 임대인 협의 항목을 확인하는 것이 좋습니다.`,
  ];

  return {
    commerce: commerceDescriptions[variation],
    building: buildingDescriptions[(variation + 1) % 4],
    access: accessDescriptions[(variation + 2) % 4],
    restoration: restorationDescriptions[(variation + 3) % 4],
    keywords,
  };
}

/* ======================================================
   신규 지역 특성 섹션
   HERO 바로 아래 배치
====================================================== */

function LocalCharacterSection({
  region,
}: {
  region: Region;
}) {
  const profile = getLocalProfile(region);

  const cards = [
    {
      number: "01",
      icon: "🏪",
      title: "상권 및 업종 특성",
      text: profile.commerce,
      color: "from-violet-50 to-white",
    },
    {
      number: "02",
      icon: "🏢",
      title: "건물 구조 및 시설 특성",
      text: profile.building,
      color: "from-purple-50 to-white",
    },
    {
      number: "03",
      icon: "🚚",
      title: "철거 작업 및 폐기물 반출",
      text: profile.access,
      color: "from-indigo-50 to-white",
    },
    {
      number: "04",
      icon: "📋",
      title: "폐업 원상복구 확인사항",
      text: profile.restoration,
      color: "from-fuchsia-50 to-white",
    },
  ];

  return (
    <section
      id="local-character"
      className="border-b border-violet-100 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-4xl">
          <p className={sectionLabel}>
            LOCAL DEMOLITION CHARACTERISTICS
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
            {region.name} 지역 특성을 고려한
            <br />
            <span className="text-violet-700">
              철거 및 원상복구 안내
            </span>
          </h2>

          <p className="mt-6 leading-9 text-zinc-600">
            {region.name}
            {region.parentName
              ? `이 속한 ${region.parentName} 지역을 포함해`
              : "의"}{" "}
            상권과 건물 구조, 주변 작업 환경을 고려하여
            상가·매장·점포·가게·사무실 철거를 준비할 때
            확인해야 할 사항을 정리했습니다.
            실제 작업 범위와 비용은 개별 현장 확인 후 결정됩니다.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-2">
          {profile.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-800"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.number}
              className={`group overflow-hidden rounded-[1.7rem] border border-violet-100 bg-gradient-to-br ${card.color} p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-9`}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                  {card.icon}
                </span>

                <span className="text-sm font-black text-violet-300">
                  {card.number}
                </span>
              </div>

              <h3 className="mt-7 text-xl font-black text-zinc-900 md:text-2xl">
                {region.name} {card.title}
              </h3>

              <p className="mt-5 text-sm leading-9 text-zinc-600 md:text-base">
                {card.text}
              </p>

              <div className="mt-7 border-t border-violet-100 pt-5">
                <span className="text-xs font-black text-violet-700">
                  THE SAVE LOCAL GUIDE
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-6 rounded-[1.7rem] bg-gradient-to-r from-violet-700 to-purple-900 p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-xs font-black tracking-widest text-violet-200">
              FREE SITE ESTIMATE
            </p>

            <h3 className="mt-3 text-2xl font-black">
              {region.name} 철거 현장 상담
            </h3>

            <p className="mt-4 text-sm leading-7 text-violet-100">
              지역 특성과 실제 현장 조건을 확인하여
              필요한 철거 범위와 원상복구 항목을 안내합니다.
            </p>
          </div>

          <a
            href={PHONE_URL}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-black text-violet-800"
          >
            무료방문견적 {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   기존 지역 전문 콘텐츠
====================================================== */

function buildExtraSections(route: RouteInfo): InfoSection[] {
  const region = route.region;
  const profile = getLocalProfile(region);
  const detail = route.detail;
  const subject = detail?.name ?? "상가·매장·사무실 철거";
  const topics = detail?.targets ?? profile.keywords;

  const sections: InfoSection[] = [
    {
      id: "regional-character",
      title: `${region.name} 상권과 철거 대상 공간의 특성`,
      description: profile.commerce,
      points: profile.keywords.map(
        (item) => `${item} 공간의 시설물 및 철거 범위 확인`
      ),
    },
    {
      id: "building",
      title: `${region.name} 건물 유형에 따른 철거 준비`,
      description: profile.building,
      points: [
        "건물 관리사무소의 작업 승인 여부",
        "공용 복도와 엘리베이터 보호",
        "구조체와 비구조체 구분",
        "소음·분진 작업 허용 시간",
      ],
    },
    {
      id: "facilities",
      title: `${region.name} ${subject} 주요 시설물 확인`,
      description: `${subject} 현장은 시설 종류와 설치 방식에 따라 철거 순서가 달라질 수 있습니다. 전기·급배수·통신설비와 연결된 시설은 분리 가능 여부를 먼저 검토해야 합니다.`,
      points: topics.map(
        (item) => `${item} 철거 대상 및 보존 여부 확인`
      ),
    },
    {
      id: "preparation",
      title: `${subject} 작업 전 확인해야 할 사항`,
      description:
        "현장에 남길 시설과 철거할 시설을 구분하고 임대인과 합의한 원상복구 기준을 확인해야 불필요한 재작업을 줄일 수 있습니다.",
      points: [
        "임대차계약서와 원상복구 특약",
        "기존 시설 상태를 확인할 수 있는 자료",
        "건물 관리규정 및 작업 승인",
        "작업 일정과 공간 인도 예정일",
      ],
    },
    {
      id: "removal",
      title: `${region.name} 폐기물 반출과 작업 동선`,
      description: profile.access,
      points: [
        "폐기물 종류와 예상 반출량",
        "화물차 진입과 주차 가능 여부",
        "엘리베이터 또는 계단 사용 조건",
        "분리배출과 적법한 폐기물 처리",
      ],
    },
    {
      id: "cost",
      title: `${region.name} ${subject} 비용 결정 요소`,
      description:
        "같은 면적이라도 내부 시설과 마감재, 설비 연결 상태에 따라 견적이 달라집니다. 단순 면적 비교보다는 작업 항목별 포함 범위를 확인하는 것이 좋습니다.",
      points: [
        "철거 면적과 시설물 수량",
        "벽체·천장·바닥 마감재 종류",
        "폐기물 처리 및 운반 조건",
        "전기·배관 분리와 원상복구 항목",
      ],
    },
    {
      id: "restoration",
      title: `${subject} 이후 원상복구 범위`,
      description: profile.restoration,
      points: [
        "벽체와 바닥 마감 상태",
        "천장 및 조명 복구 범위",
        "전기·급배수 설비의 마무리 상태",
        "최종 인도 전 확인 항목",
      ],
    },
    {
      id: "schedule",
      title: `${region.name} 철거 일정과 현장 관리`,
      description:
        "폐업일, 집기 반출일, 철거일과 최종 인도일을 구분해 계획하면 일정 충돌을 줄일 수 있습니다. 건물별 작업 가능 시간도 함께 확인해야 합니다.",
      points: [
        "영업 종료 및 집기 정리",
        "현장 실측과 견적 검토",
        "관리사무소 작업 승인",
        "철거 후 원상복구 및 현장 확인",
      ],
    },
  ];

  if (detail) {
    sections.push(
      ...topics.map((topic, index) => ({
        id: `specialist-${index}`,
        title: `${region.name} ${detail.name} - ${topic} 철거`,
        description: `${detail.name} 현장에서 ${topic}은 설치 상태와 주변 설비에 따라 철거 방법이 달라질 수 있습니다. 철거 전 고정 방식, 연결 배선·배관과 유지 시설을 확인해야 합니다.`,
        points: [
          `${topic}의 설치 및 고정 상태 확인`,
          "전기·통신·급배수 연결 여부",
          "주변 마감재와 보존 시설 보호",
          "철거 후 잔여 시설과 폐기물 확인",
        ],
      }))
    );
  } else {
    sections.push(
      {
        id: "interior",
        title: `${region.name} 인테리어철거와 내부 마감재 정리`,
        description:
          "기존 인테리어의 벽체, 천장, 바닥과 고정 가구를 철거할 때는 구조체와 보존 설비를 구분해야 합니다.",
        points: [
          "경량벽체",
          "천장 마감재",
          "바닥재",
          "고정 가구 및 조명",
        ],
      },
      {
        id: "closure",
        title: `${region.name} 폐업철거 및 공간 인도 준비`,
        description:
          "폐업 과정에서는 영업 종료와 철거 일정뿐 아니라 임대인과의 원상복구 협의가 중요합니다.",
        points: [
          "영업 종료일",
          "집기 반출",
          "원상복구 합의",
          "최종 인도",
        ],
      }
    );
  }

  return stableShuffle(
    sections,
    `${region.path}:${route.kind}:${detail?.slug ?? "main"}:sections`
  );
}

/* ======================================================
   헤더 및 상단 소개
====================================================== */

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/" className="text-xl font-black">
          더세이브
          <span className="text-violet-700">철거</span>
        </Link>

        <nav className="hidden gap-6 text-sm font-bold text-zinc-600 lg:flex">
          <Link href="/#services">철거 서비스</Link>
          <Link href="/industries">업종별 철거</Link>
          <Link href="/regions">지역별 안내</Link>
          <Link href="/support">철거지원금</Link>
          <Link href="/cases">철거사례</Link>
          <Link href="/estimates">업종별 견적</Link>
          <Link href="/qa">철거 Q&A</Link>
        </nav>

        <div className="flex gap-2">
          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-violet-200 px-5 py-3 text-xs font-bold text-violet-700 sm:inline-flex"
          >
            네이버 톡톡
          </a>

          <a
            href={PHONE_URL}
            className="rounded-full bg-violet-700 px-5 py-3 text-xs font-black text-white"
          >
            무료방문견적
          </a>
        </div>
      </div>
    </header>
  );
}

function Breadcrumb({ route }: { route: RouteInfo }) {
  return (
    <nav
      aria-label="현재 위치"
      className="border-b border-zinc-100 bg-white"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-4 text-xs text-zinc-500 md:px-8">
        <Link href="/">홈</Link>

        {route.ancestors.map((region) => (
          <span
            key={region.path}
            className="flex items-center gap-2"
          >
            <span>/</span>
            <Link href={region.path}>{region.name}</Link>
          </span>
        ))}

        {route.detail && (
          <>
            <span>/</span>
            <span className="font-bold text-violet-700">
              {route.detail.name}
            </span>
          </>
        )}
      </div>
    </nav>
  );
}

function Hero({
  route,
  seo,
}: {
  route: RouteInfo;
  seo: ReturnType<typeof getSEO>;
}) {
  return (
    <section className="bg-gradient-to-br from-white via-violet-50 to-purple-100 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <p className={sectionLabel}>
            THE SAVE DEMOLITION
          </p>

          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            {seo.h1}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-9 text-zinc-600">
            {route.detail
              ? route.detail.intro
              : `${route.region.name} 상가·매장·점포·가게·사무실 철거부터 폐업 원상복구와 인테리어철거까지 필요한 작업 범위를 안내합니다.`}
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

        <div className="rounded-[2rem] bg-gradient-to-br from-violet-500 via-violet-700 to-purple-950 p-9 text-white shadow-2xl md:p-12">
          <p className="text-xs font-black tracking-[0.2em] text-violet-200">
            THE SAVE COMPANY
          </p>

          <h2 className="mt-12 text-3xl font-black leading-tight">
            철거부터 원상복구까지
            <br />
            현장에 맞는 전문 상담
          </h2>

          <p className="mt-6 leading-8 text-violet-100">
            작업 범위와 폐기물 반출 조건을 확인하여
            필요한 철거 계획을 안내합니다.
          </p>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6">
            <p className="text-xs font-bold text-violet-100">
              무료 방문 실측 · 견적
            </p>

            <a
              href={PHONE_URL}
              className="mt-3 block text-3xl font-black md:text-4xl"
            >
              {PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   지역별 상세 안내
====================================================== */

function RegionGuide({ region }: { region: Region }) {
  const content = createRegionContent({
    regionName: region.name,
    parentName: region.parentName,
    path: region.path,
  });

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>
          LOCAL DEMOLITION GUIDE
        </p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          {content.introHeading}
        </h2>

        <div className="mt-6 max-w-4xl space-y-5">
          {content.intro.map((paragraph, index) => (
            <p
              key={index}
              className="leading-9 text-zinc-600"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-14">
          <p className={sectionLabel}>
            {content.sectionEyebrow}
          </p>

          <h3 className="mt-4 text-2xl font-black md:text-3xl">
            {content.sectionHeading}
          </h3>

          <p className="mt-5 max-w-4xl leading-8 text-zinc-600">
            {content.sectionLead}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {content.sections.map((section, index) => (
            <article
              key={index}
              className="rounded-2xl border border-zinc-200 bg-white p-7"
            >
              {section.label && (
                <p className="text-xs font-black text-violet-600">
                  {section.label}
                </p>
              )}

              <h3 className="mt-3 text-xl font-black">
                {section.heading}
              </h3>

              {section.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-4 text-sm leading-8 text-zinc-600"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-[1.7rem] bg-violet-50 p-8 md:p-10">
          <h3 className="text-2xl font-black">
            {content.highlightHeading}
          </h3>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.highlights.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6"
              >
                <h4 className="font-black text-violet-800">
                  {item.title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <p className={sectionLabel}>
            {content.closingEyebrow}
          </p>

          <h3 className="mt-4 text-2xl font-black">
            {content.closingHeading}
          </h3>

          <div className="mt-5 max-w-4xl space-y-5">
            {content.closing.map((paragraph, index) => (
              <p
                key={index}
                className="leading-9 text-zinc-600"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCards({ region }: { region: Region }) {
  return (
    <section className="bg-violet-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>OUR SERVICES</p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          {region.name} 철거 서비스 안내
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`${region.path}/service/${service.slug}`}
              className="group rounded-2xl bg-gradient-to-br from-violet-500 to-purple-900 p-7 text-white transition hover:-translate-y-1"
            >
              <h3 className="text-xl font-black">
                {service.name}
              </h3>

              <p className="mt-4 text-sm leading-7 text-violet-100">
                {service.intro}
              </p>

              <p className="mt-6 text-sm font-black">
                상세 안내 보기 →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryCards({ region }: { region: Region }) {
  const selected = getSelectedIndustries(region.path);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>
          INDUSTRY SOLUTIONS
        </p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          {region.name} 업종별 철거 안내
        </h2>

        <p className="mt-5 leading-8 text-zinc-600">
          업종별 주요 시설과 원상복구 조건을 확인해 보세요.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {selected.map((industry) => (
            <Link
              key={industry.slug}
              href={`${region.path}/industry/${industry.slug}`}
              className="group rounded-2xl border border-violet-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-300"
            >
              <p className="text-xs font-bold text-violet-600">
                업종별 안내
              </p>

              <h3 className="mt-4 text-lg font-black">
                {industry.name}
              </h3>

              <p className="mt-4 text-xs font-bold text-violet-700">
                자세히 보기 →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   서비스 및 업종 상세 페이지
====================================================== */

function DetailGuide({ route }: { route: RouteInfo }) {
  const detail = route.detail;
  if (!detail) return null;

  const groups = [
    { title: "주요 철거 대상", items: detail.targets },
    { title: "철거 전 확인사항", items: detail.checks },
    { title: "비용 결정 요소", items: detail.costs },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>
          DETAILED DEMOLITION GUIDE
        </p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          {route.region.name} {detail.name} 상세 안내
        </h2>

        <p className="mt-6 max-w-4xl leading-9 text-zinc-600">
          {detail.intro} 실제 철거 범위는 건물 구조와
          임대차계약, 설비 연결 상태에 따라 달라질 수 있습니다.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {groups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-violet-100 bg-violet-50 p-7"
            >
              <h3 className="text-xl font-black">
                {group.title}
              </h3>

              <ul className="mt-6 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-zinc-700"
                  >
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-zinc-50 p-8">
          <h3 className="text-2xl font-black">
            현장별 철거 범위 확인
          </h3>

          <p className="mt-5 leading-8 text-zinc-600">
            같은 업종이라도 내부 시설, 마감재, 폐기물 양과
            반출 조건에 따라 작업 방법이 달라집니다.
            계약 전 철거 대상과 유지 시설을 구분하고
            견적에 포함된 항목을 확인하는 것이 좋습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function ExpandedContent({ route }: { route: RouteInfo }) {
  const sections = buildExtraSections(route);

  return (
    <section className="bg-gradient-to-b from-white via-violet-50/40 to-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>
          LOCAL & SPECIALIZED GUIDE
        </p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          {route.region.name}{" "}
          {route.detail?.name ?? "철거"} 전문 정보
        </h2>

        <p className="mt-5 max-w-4xl leading-8 text-zinc-600">
          지역별 현장 조건과 철거 대상 시설을 함께 검토할 수 있도록
          주요 확인사항을 정리했습니다.
          실제 작업 가능 여부와 범위는 현장 확인 후 결정됩니다.
        </p>

        <div className="mt-12 space-y-8">
          {sections.map((section, index) => (
            <article
              key={section.id}
              id={section.id}
              className="overflow-hidden rounded-[1.7rem] border border-violet-100 bg-white shadow-sm"
            >
              <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <div className="p-7 md:p-10">
                  <p className="text-xs font-black tracking-widest text-violet-600">
                    LOCAL GUIDE{" "}
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-4 text-2xl font-black leading-snug">
                    {section.title}
                  </h3>

                  <p className="mt-6 leading-9 text-zinc-600">
                    {section.description}
                  </p>
                </div>

                <div className="bg-violet-50 p-7 md:p-10">
                  <p className="text-sm font-black text-violet-800">
                    현장 확인 체크리스트
                  </p>

                  <ul className="mt-6 space-y-4">
                    {section.points.map((point, i) => (
                      <li
                        key={`${section.id}-${i}`}
                        className="flex items-start gap-3 text-sm leading-7 text-zinc-700"
                      >
                        <span className="font-black text-violet-700">
                          ✓
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   철거 전·후 사진 영역
====================================================== */

function BeforeAfterGallery({
  route,
}: {
  route: RouteInfo;
}) {
  const title = `${route.region.name} ${
    route.detail?.name ?? "철거"
  }`;

  const photos = [
    { label: "BEFORE", name: "철거 전", src: "/images/before.png" },
    { label: "AFTER", name: "철거 후", src: "/images/after.png" },
  ];

  return (
    <section className="bg-zinc-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>BEFORE & AFTER</p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          {title} 전·후 이미지
        </h2>

        <p className="mt-5 max-w-4xl leading-8 text-zinc-600">
          철거 전 공간과 내부 시설물이 정리된 공간의 모습을
          이미지로 살펴보세요.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {photos.map((item) => (
            <div
              key={item.label}
              className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white"
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                <img
                  src={item.src}
                  alt={`${item.name} 이미지`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center justify-between gap-4 p-6">
                <span className="text-xs font-black tracking-widest text-violet-700">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-zinc-600">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   진행 절차, FAQ, 지역 이동
====================================================== */

const steps = [
  ["01", "상담 접수", "지역, 면적, 철거 목적과 희망 일정을 확인합니다."],
  ["02", "현장 확인", "철거 대상, 유지 시설과 작업 환경을 확인합니다."],
  ["03", "견적 안내", "작업 범위와 폐기물 처리 조건을 안내합니다."],
  ["04", "철거 진행", "협의한 일정과 범위에 따라 작업합니다."],
  ["05", "현장 마무리", "철거 결과와 원상복구 항목을 확인합니다."],
];

function ProcessSection() {
  return (
    <section className="bg-zinc-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>WORK PROCESS</p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          철거 진행 절차
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map(([number, title, description]) => (
            <article
              key={number}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <span className="text-3xl font-black text-violet-600">
                {number}
              </span>

              <h3 className="mt-5 text-lg font-black">
                {title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-zinc-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqItems = [
  {
    question: "철거 비용은 어떻게 결정되나요?",
    answer:
      "면적뿐 아니라 내부 구조, 철거 대상 시설, 마감재, 폐기물 반출 조건 등에 따라 달라집니다.",
  },
  {
    question: "무료 방문견적이 가능한가요?",
    answer:
      "현장 확인을 위한 무료 방문 실측 및 견적 상담을 안내합니다. 방문 일정은 상담을 통해 조율합니다.",
  },
  {
    question: "폐업 원상복구도 진행하나요?",
    answer:
      "상가, 매장, 점포, 가게, 사무실의 폐업철거와 원상복구 범위를 상담합니다.",
  },
  {
    question: "폐기물 처리도 포함되나요?",
    answer:
      "폐기물의 종류와 양, 운반 환경을 확인하여 견적 포함 여부를 안내합니다.",
  },
  {
    question: "철거 전에 무엇을 준비해야 하나요?",
    answer:
      "임대차계약서, 원상복구 협의 내용, 현장 사진과 희망 일정을 준비하면 도움이 됩니다.",
  },
];

function FAQSection({ location }: { location: string }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5">
        <p className={sectionLabel}>FAQ</p>

        <h2 className="mt-4 text-3xl font-black">
          {location} 철거 자주 묻는 질문
        </h2>

        <div className="mt-10 space-y-3">
          {faqItems.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black">
                <span>{faq.question}</span>
                <span className="text-violet-700 transition group-open:rotate-45">
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
  );
}

function RegionFAQLink({ region }: { region: Region }) {
  return (
    <section className="bg-gradient-to-br from-violet-50 via-white to-purple-100 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-8 rounded-[2rem] border border-violet-200 bg-white p-8 shadow-xl shadow-violet-100/60 md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <p className={sectionLabel}>
              LOCAL DEMOLITION Q&A
            </p>

            <h2 className="mt-4 text-2xl font-black leading-tight md:text-4xl">
              {region.name} 철거,
              <br />
              궁금한 점을 확인해 보세요.
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-zinc-600">
              철거 견적과 추가 비용, 폐업 일정,
              원상복구, 폐기물 처리, 임대인 협의 등
              고객이 궁금해하는 질문 10개와 상세한 답변을 준비했습니다.
            </p>
          </div>

          <Link
            href={`/faq${region.path}`}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-violet-700 px-8 py-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
          >
            {region.name} Q&A 10가지 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   지역별 자료실: 지원금 · 사례 · 견적 · Q&A
====================================================== */

const resourceCategories = [
  {
    slug: "support",
    title: "철거지원금",
    description: "폐업과 점포 철거에 관련된 지원사업의 신청 조건과 확인사항을 안내합니다.",
    icon: "📑",
  },
  {
    slug: "cases",
    title: "철거사례",
    description: "철거 전후 확인사항과 공간별 작업 유형을 살펴봅니다.",
    icon: "🏗️",
  },
  {
    slug: "estimates",
    title: "업종별 견적",
    description: "상가·매장·사무실 등 업종과 시설에 따른 비용 결정 요소를 확인합니다.",
    icon: "🧾",
  },
  {
    slug: "qa",
    title: "철거 Q&A",
    description: "철거 범위, 원상복구, 폐기물 처리에 대한 질문과 답변을 확인합니다.",
    icon: "💬",
  },
] as const;

function RegionResources({ region }: { region: Region }) {
  return (
    <section id="regional-resources" className="bg-gradient-to-b from-violet-50 to-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>REGIONAL DEMOLITION RESOURCES</p>
        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          {region.name} 철거 전문 자료실
        </h2>
        <p className="mt-5 max-w-3xl leading-8 text-zinc-600">
          철거지원금, 철거사례, 업종별 견적과 자주 묻는 질문을 지역별로 확인하세요.
          실제 지원 가능 여부와 견적은 신청 요건 및 현장 조건에 따라 달라집니다.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resourceCategories.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}${region.path}`}
              className="group rounded-[1.5rem] bg-gradient-to-br from-violet-600 via-violet-700 to-purple-950 p-7 text-white shadow-lg shadow-violet-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <h3 className="mt-6 text-xl font-black">{region.name} {item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-violet-100">{item.description}</p>
              <span className="mt-7 inline-block text-sm font-black">자세히 보기 →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionNavigation({ route }: { route: RouteInfo }) {
  const region = route.region;
  const children = region.children ?? [];

  return (
    <section className="bg-zinc-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>SERVICE AREAS</p>

        <h2 className="mt-4 text-3xl font-black md:text-4xl">
          {region.name} 지역별 철거 안내
        </h2>

        {children.length > 0 ? (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {children.map((child) => (
              <Link
                key={child.path}
                href={child.path}
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm font-black transition hover:border-violet-300 hover:text-violet-700"
              >
                {child.name} 철거업체 →
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-7">
            <p className="leading-8 text-zinc-600">
              {region.name} 철거와 원상복구에 대한 자세한 사항은
              상담을 통해 확인할 수 있습니다.
            </p>

            {route.ancestors.length > 1 && (
              <Link
                href={
                  route.ancestors[
                    route.ancestors.length - 2
                  ].path
                }
                className="mt-5 inline-block text-sm font-black text-violet-700"
              >
                상위 지역 보기 →
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ======================================================
   철거 현장 안내
   실제 완료 실적은 검증 후 게시
====================================================== */

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

function ProjectRolling() {
  return (
    <section className="overflow-hidden border-y border-violet-100 bg-white py-12">
      <div className="mx-auto mb-7 max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>
          THE SAVE PROJECT
        </p>

        <h2 className="mt-2 text-2xl font-black">
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
                  className="flex shrink-0 items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-6 py-5"
                >
                  <span className="text-violet-700">
                    ✓
                  </span>

                  <span className="whitespace-nowrap text-sm font-black">
                    {project}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const achievements = [
  ["2,790", "학원·카페·식당 철거 및 원상복구"],
  ["2,450", "상가·병원 철거 및 원상복구"],
  ["2,450", "인테리어 철거·폐기물 처리"],
  ["5,560", "정부지원금 상담"],
  ["7,690", "폐업 및 철거"],
  ["3,685", "정부지원 철거"],
];

function AchievementRolling() {
  return (
    <section className="bg-gradient-to-br from-[#160D29] via-[#28134C] to-[#4C1D95] py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-violet-300">
            THE SAVE IN NUMBERS
          </p>

          <h2 className="mt-5 text-4xl font-black leading-tight">
            숫자로 확인하는
            <br />
            더세이브
          </h2>

          <p className="mt-6 leading-8 text-violet-100">
            철거, 원상복구 및 폐업 관련 주요 지표를 확인할 수 있습니다.
          </p>
        </div>

        <div className="rounded-[1.7rem] border border-white/20 bg-white/10 p-5">
          <div className="achievement-viewport relative h-[250px] overflow-hidden rounded-2xl">
            {achievements.map(([number, label], index) => (
              <div
                key={index}
                className="achievement-slide absolute inset-0 flex flex-col justify-center bg-gradient-to-br from-[#39245D] to-[#1F1B34] p-8"
                style={{
                  animationDelay: `${index * -3}s`,
                }}
              >
                <p className="text-xs font-black text-violet-300">
                  THE SAVE PERFORMANCE
                </p>

                <p className="mt-5 text-5xl font-black text-[#C4F66B]">
                  {number}+
                </p>

                <p className="mt-5 text-sm font-bold">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-violet-200">
            6개 항목 · 3초 간격 자동 전환
          </p>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   상담 및 하단
====================================================== */

function Contact({ location }: { location: string }) {
  return (
    <section className="bg-gradient-to-br from-violet-700 to-purple-950 py-20 text-white md:py-28">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
        <p className="text-xs font-black tracking-[0.25em] text-violet-200">
          FREE SITE ESTIMATE
        </p>

        <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
          {location} 철거·원상복구
          <br />
          무료 방문견적 상담
        </h2>

        <p className="mx-auto mt-6 max-w-2xl leading-8 text-violet-100">
          상가·매장·점포·가게·사무실·폐업철거,
          인테리어철거와 원상복구까지
          현장 상황에 맞는 작업 범위를 안내합니다.
        </p>

        <a
          href={PHONE_URL}
          className="mt-8 inline-block text-4xl font-black md:text-6xl"
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
            className="rounded-full border border-white/40 px-8 py-4 text-sm font-black text-white"
          >
            네이버 톡톡
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ location }: { location: string }) {
  return (
    <footer className="border-t border-zinc-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-2xl font-black">
          더세이브
          <span className="text-violet-700">
            철거
          </span>
        </p>

        <p className="mt-4 text-sm leading-7 text-zinc-500">
          {location} 상가·매장·점포·가게·사무실 철거,
          폐업 원상복구 및 인테리어철거 안내
        </p>

        <a
          href={PHONE_URL}
          className="mt-4 inline-block font-black text-violet-700"
        >
          {PHONE}
        </a>

        <div className="mt-10 border-t border-zinc-100 pt-6 text-xs text-zinc-400">
          © 2026 더세이브철거. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function StructuredData({
  route,
  pathname,
  seo,
}: {
  route: RouteInfo;
  pathname: string;
  seo: ReturnType<typeof getSEO>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: SITE_URL + pathname,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: "더세이브철거",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: `${route.region.name} ${
        route.detail?.name ?? "철거 및 원상복구"
      }`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function RollingStyles() {
  return (
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
        0%, 13.5% {
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
  );
}

/* ======================================================
   지역별 상단 문의 전환 섹션
   HERO → 견적 → 지원금·원상복구 순서 고정
====================================================== */

function EstimateConversionSection({ region }: { region: Region }) {
  return (
    <section id="free-estimate" className="border-b border-violet-100 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>FREE ESTIMATE GUIDE</p>
        <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
          {region.name} 철거비용, 현장 조건부터 확인하세요
        </h2>
        <p className="mt-6 max-w-4xl leading-9 text-zinc-600">
          상가·매장·점포·가게·사무실 철거비용은 면적뿐 아니라 내부 시설,
          폐기물 양, 반출 동선과 원상복구 범위에 따라 달라집니다.
          무료방문견적 상담으로 필요한 작업 항목을 확인해 보세요.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "철거 대상 확인", text: "벽체·천장·바닥, 간판과 고정 집기 등 실제 철거할 시설을 구분합니다." },
            { title: "추가비용 조건 확인", text: "폐기물 처리, 층수, 차량 접근, 설비 분리 등 견적 포함 항목을 확인합니다." },
            { title: "일정·원상복구 협의", text: "폐업일과 임대차 종료일, 임대인 협의 범위를 함께 검토합니다." },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-violet-100 bg-violet-50 p-7">
              <h3 className="text-xl font-black text-violet-900">{item.title}</h3>
              <p className="mt-4 text-sm leading-8 text-zinc-600">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={PHONE_URL} className="rounded-full bg-violet-700 px-7 py-4 text-sm font-black text-white hover:bg-violet-800">
            {region.name} 무료방문견적 {PHONE}
          </a>
          <Link href="/estimates" className="rounded-full border border-violet-200 px-7 py-4 text-sm font-black text-violet-800 hover:bg-violet-50">
            업종별 견적 정보 보기
          </Link>
        </div>
      </div>
    </section>
  );
}

function SupportConversionSection({ region }: { region: Region }) {
  return (
    <section id="support-restoration" className="bg-gradient-to-br from-violet-50 to-purple-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className={sectionLabel}>CLOSURE & RESTORATION</p>
        <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
          {region.name} 폐업철거, 지원사업과 원상복구를 함께 확인하세요
        </h2>
        <p className="mt-6 max-w-4xl leading-9 text-zinc-600">
          폐업 시 철거지원사업 대상 여부와 신청 시점을 먼저 확인하고,
          임대차계약서에 정해진 원상복구 범위도 검토하는 것이 좋습니다.
          지원금은 공고·심사·예산에 따라 달라지며 지급을 보장하지 않습니다.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "지원사업 대상 확인", text: "공식 공고의 신청 기간, 자격 요건과 착공 전 신청 필요 여부를 확인합니다." },
            { title: "원상복구 범위 확인", text: "계약 특약과 임대인 합의를 기준으로 철거 대상과 유지 시설을 구분합니다." },
            { title: "증빙·인도 일정 확인", text: "견적서, 철거 전후 사진과 지출 증빙 및 최종 인도일을 준비합니다." },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-violet-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-black text-violet-900">{item.title}</h3>
              <p className="mt-4 text-sm leading-8 text-zinc-600">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={PHONE_URL} className="rounded-full bg-violet-700 px-7 py-4 text-sm font-black text-white hover:bg-violet-800">
            철거·원상복구 상담 {PHONE}
          </a>
          <Link href="/support" className="rounded-full border border-violet-200 bg-white px-7 py-4 text-sm font-black text-violet-800 hover:bg-violet-50">
            철거지원금 안내 보기
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   최종 페이지: 지역 경로별 고정 섹션 순서
====================================================== */

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const route = resolveRoute(slug);

  if (!route) notFound();

  const pathname = "/" + slug.join("/");
  const seo = getSEO(route, pathname);
  const region = route.region;

  // 지역마다 다른 순서지만, 새로고침해도 동일하게 유지됩니다.
  const regionalSections = stableShuffle(
    [
      "local", "projects", "guide", "services", "industries",
      "resources", "expanded", "gallery", "achievements",
      "process", "faq", "faq-link", "navigation",
    ],
    `${region.path}:regional-page-sections:v2`
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-16 text-zinc-950 md:pb-0">
      <StructuredData route={route} pathname={pathname} seo={seo} />
      <Header />
      <Breadcrumb route={route} />
      <Hero route={route} seo={seo} />

      {route.kind === "region" ? (
        <>
          {/* 방문자가 먼저 보는 2·3번째 섹션: 상담 전환 중심 */}
          <EstimateConversionSection region={region} />
          <SupportConversionSection region={region} />

          {/* 이후 섹션은 지역별로 서로 다른 고정 순서 */}
          {regionalSections.map((section) => {
            switch (section) {
              case "local": return <LocalCharacterSection key={section} region={region} />;
              case "projects": return <ProjectRolling key={section} />;
              case "guide": return <RegionGuide key={section} region={region} />;
              case "services": return <ServiceCards key={section} region={region} />;
              case "industries": return <IndustryCards key={section} region={region} />;
              case "resources": return <RegionResources key={section} region={region} />;
              case "expanded": return <ExpandedContent key={section} route={route} />;
              case "gallery": return <BeforeAfterGallery key={section} route={route} />;
              case "achievements": return <AchievementRolling key={section} />;
              case "process": return <ProcessSection key={section} />;
              case "faq": return <FAQSection key={section} location={region.name} />;
              case "faq-link": return <RegionFAQLink key={section} region={region} />;
              case "navigation": return <RegionNavigation key={section} route={route} />;
              default: return null;
            }
          })}
        </>
      ) : (
        <>
          {/* 업종·서비스 상세 페이지는 기존 섹션 구조 유지 */}
          <ProjectRolling />
          <DetailGuide route={route} />
          <RegionResources region={region} />
          <ExpandedContent route={route} />
          <BeforeAfterGallery route={route} />
          <AchievementRolling />
          <ProcessSection />
          <FAQSection location={region.name} />
          <RegionFAQLink region={region} />
        </>
      )}

      <Contact location={region.name} />
      <Footer location={region.name} />
      <RollingStyles />
    </main>
  );
}




