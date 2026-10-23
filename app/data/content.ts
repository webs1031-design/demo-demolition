/* =========================================================
   더세이브철거 지역 페이지 콘텐츠 엔진

   목적
   - 지역별 Title / Description / H1 차별화
   - 지역별 도입부 / 본문 / 마무리 차별화
   - URL 기반 결정적 콘텐츠 생성
   - 같은 URL은 항상 같은 콘텐츠 출력
   - Math.random() 사용 금지
   - 상가 / 매장 / 사무실 / 점포 / 가게 / 폐업 / 원상복구
     검색 의도를 자연스럽게 분산
========================================================= */

/* =========================================================
   TYPE
========================================================= */

export type LayoutType =
  | "guide"
  | "closure"
  | "restoration"
  | "commercial"
  | "office"
  | "process"
  | "contract"
  | "field";

export type ContentSection = {
  label?: string;
  heading: string;
  paragraphs: string[];
};

export type ContentHighlight = {
  title: string;
  text: string;
};

export type RegionContent = {
  title: string;
  description: string;

  layoutType: LayoutType;

  eyebrow: string;
  h1: string;

  introHeading: string;
  intro: string[];

  sectionEyebrow: string;
  sectionHeading: string;
  sectionLead: string;

  sections: ContentSection[];

  highlightHeading: string;
  highlights: ContentHighlight[];

  closingEyebrow: string;
  closingHeading: string;
  closing: string[];
};

type CreateRegionContentParams = {
  regionName: string;
  parentName?: string;
  path: string;
};

/* =========================================================
   기본 정보
========================================================= */

const BRAND = "더세이브철거";
const PHONE = "010-2269-8352";

/* =========================================================
   HASH

   URL이 같으면 항상 같은 숫자가 생성됩니다.
========================================================= */

function hashString(value: string) {
  let hash = 2166136261;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^= value.charCodeAt(index);

    hash = Math.imul(
      hash,
      16777619
    );
  }

  return hash >>> 0;
}

/* =========================================================
   배열 선택
========================================================= */

function pick<T>(
  items: readonly T[],
  seed: number,
  offset = 0
): T {
  return items[
    (seed + offset) %
      items.length
  ];
}

/* =========================================================
   배열 회전
========================================================= */

function rotate<T>(
  items: readonly T[],
  amount: number
): T[] {
  if (items.length === 0) {
    return [];
  }

  const start =
    amount % items.length;

  return [
    ...items.slice(start),
    ...items.slice(0, start),
  ];
}

/* =========================================================
   지역 검색명
========================================================= */

function createLocationName(
  regionName: string,
  parentName?: string
) {
  if (!parentName) {
    return regionName;
  }

  if (
    regionName.includes(
      parentName
    )
  ) {
    return regionName;
  }

  return `${parentName} ${regionName}`;
}

/* =========================================================
   TITLE PATTERNS

   단순히 지역명만 바뀌는 제목을 줄이기 위해
   제목 구조 자체를 여러 형태로 분산합니다.
========================================================= */

const titlePatterns = [
  (r: string) =>
    `${r} 철거업체 | 상가 원상복구 작업 범위 안내`,

  (r: string) =>
    `${r} 상가철거업체 | 폐업 후 원상복구 확인사항`,

  (r: string) =>
    `${r} 매장철거 | 철거업체 선정 전 작업 범위 정리`,

  (r: string) =>
    `${r} 철거업체 | 점포 폐업철거와 원상복구 안내`,

  (r: string) =>
    `${r} 사무실철거업체 | 원상복구 범위 확인`,

  (r: string) =>
    `${r} 점포철거 | 가게 원상복구 진행 기준`,

  (r: string) =>
    `${r} 폐업철거업체 | 상가 매장 정리 과정 안내`,

  (r: string) =>
    `${r} 원상복구업체 | 상가철거 전 확인할 범위`,

  (r: string) =>
    `${r} 가게철거업체 | 폐업 현장 원상복구 안내`,

  (r: string) =>
    `${r} 철거업체 | 매장철거 견적 전 확인사항`,

  (r: string) =>
    `${r} 상가철거 | 점포 원상복구 작업 기준`,

  (r: string) =>
    `${r} 매장철거업체 | 폐업 전 철거 범위 정리`,

  (r: string) =>
    `${r} 철거업체 | 사무실 원상복구 진행 안내`,

  (r: string) =>
    `${r} 점포철거업체 | 계약 종료 전 확인사항`,

  (r: string) =>
    `${r} 폐업철거 | 매장과 가게 원상복구 안내`,

  (r: string) =>
    `${r} 원상복구 | 철거업체 현장 확인 기준`,

  (r: string) =>
    `${r} 철거업체 | 상가 매장 철거 범위 확인`,

  (r: string) =>
    `${r} 사무실철거 | 계약 종료 원상복구 안내`,

  (r: string) =>
    `${r} 가게철거 | 점포 폐업 후 정리 과정`,

  (r: string) =>
    `${r} 상가철거업체 | 현장별 원상복구 기준`,

  (r: string) =>
    `${r} 철거업체 | 폐업철거 진행 과정 정리`,

  (r: string) =>
    `${r} 매장 원상복구 | 철거 작업 범위 안내`,

  (r: string) =>
    `${r} 점포철거 | 상가 폐업 현장 정리 안내`,

  (r: string) =>
    `${r} 철거업체 | 가게철거 원상복구 준비사항`,
] as const;

/* =========================================================
   DESCRIPTION
========================================================= */

const descriptionPatterns = [
  (r: string) =>
    `${r} 철거업체를 알아볼 때 확인해야 할 상가철거, 매장철거, 점포철거, 폐업철거와 원상복구 범위를 정리합니다. 현장 확인을 통해 필요한 작업 범위를 안내합니다.`,

  (r: string) =>
    `${r} 상가와 매장 철거를 준비할 때 필요한 원상복구 범위와 폐업철거 진행 내용을 안내합니다. 사무실, 점포, 가게 등 현장 조건에 맞춰 작업 범위를 확인합니다.`,

  (r: string) =>
    `${r} 철거 및 원상복구를 계획하고 있다면 계약 조건과 현장 상태를 함께 확인해야 합니다. 상가, 매장, 사무실, 점포, 가게 철거의 주요 확인사항을 안내합니다.`,

  (r: string) =>
    `${r} 폐업철거와 원상복구 과정에서 확인할 작업 범위를 정리했습니다. 상가철거, 매장철거, 사무실철거 등 공간별 조건을 살펴보고 무료 방문견적 상담을 안내합니다.`,

  (r: string) =>
    `${r} 철거업체 상담 전 확인하면 좋은 내용을 안내합니다. 점포와 가게의 폐업철거부터 상가와 매장 원상복구까지 현장별 작업 범위를 살펴봅니다.`,

  (r: string) =>
    `${r} 원상복구와 철거는 공간의 구조와 계약 조건에 따라 필요한 작업이 달라질 수 있습니다. 상가, 매장, 사무실, 점포, 가게 철거 범위를 현장 중심으로 안내합니다.`,

  (r: string) =>
    `${r} 상가철거와 폐업 후 원상복구를 준비하는 분들을 위해 작업 범위와 현장 확인사항을 정리했습니다. 매장, 사무실, 점포, 가게 철거 상담도 함께 안내합니다.`,

  (r: string) =>
    `${r} 철거 현장은 동일한 평수라도 마감재와 설비, 집기 상태에 따라 작업 범위가 달라집니다. 폐업철거와 원상복구 전 확인할 내용을 공간별로 안내합니다.`,
] as const;

/* =========================================================
   EYEBROW
========================================================= */

const eyebrowPatterns = [
  "철거 및 원상복구 안내",
  "폐업 현장 정리 안내",
  "상가·매장 철거 안내",
  "현장 확인 중심 철거 안내",
  "계약 종료 원상복구 안내",
  "점포·가게 철거 안내",
  "사무실·상업공간 철거 안내",
  "무료 방문견적 안내",
] as const;

/* =========================================================
   H1
========================================================= */

const h1Patterns = [
  (r: string) =>
    `${r} 철거업체 원상복구 범위 확인`,

  (r: string) =>
    `${r} 상가철거와 폐업 원상복구 안내`,

  (r: string) =>
    `${r} 매장철거 현장별 작업 범위`,

  (r: string) =>
    `${r} 점포철거와 가게 원상복구 안내`,

  (r: string) =>
    `${r} 사무실철거 계약 종료 준비`,

  (r: string) =>
    `${r} 폐업철거 전 확인할 작업 범위`,

  (r: string) =>
    `${r} 원상복구 철거 현장 확인 안내`,

  (r: string) =>
    `${r} 상가 매장 철거업체 안내`,
] as const;

/* =========================================================
   INTRO HEADING
========================================================= */

const introHeadingPatterns = [
  (r: string) =>
    `${r} 철거는 작업 전에 범위를 먼저 정리해야 합니다`,

  (r: string) =>
    `${r} 폐업 현장은 원상복구 기준 확인이 중요합니다`,

  (r: string) =>
    `${r} 상가와 매장은 현장 상태에 따라 철거 범위가 달라집니다`,

  (r: string) =>
    `${r} 철거 견적은 현장 조건을 함께 살펴봐야 합니다`,

  (r: string) =>
    `${r} 점포와 가게 철거는 계약 조건부터 확인합니다`,

  (r: string) =>
    `${r} 사무실 원상복구는 기존 시설 상태를 확인해야 합니다`,

  (r: string) =>
    `${r} 폐업철거는 철거와 복구 범위를 구분하는 것이 중요합니다`,

  (r: string) =>
    `${r} 원상복구는 필요한 작업만 구분해 진행해야 합니다`,
] as const;

/* =========================================================
   INTRO PARAGRAPH POOLS
========================================================= */

const introFirst = [
  (r: string) =>
    `${r}에서 철거를 준비할 때는 단순히 내부 시설물을 모두 제거하는 것보다 어떤 부분까지 철거하고 어떤 부분을 남겨야 하는지 먼저 확인하는 과정이 중요합니다. 상가나 매장처럼 임대차 계약이 있는 공간은 계약 당시의 상태와 임대인이 요구하는 반환 기준을 함께 살펴봐야 합니다.`,

  (r: string) =>
    `${r}의 상가철거와 매장철거는 공간의 크기만으로 작업 범위를 판단하기 어렵습니다. 천장과 바닥, 벽체, 전기, 조명, 집기, 간판 등 기존 시설의 상태가 현장마다 다르기 때문에 실제 현장을 기준으로 필요한 철거 항목을 구분하는 것이 좋습니다.`,

  (r: string) =>
    `${r}에서 폐업철거를 진행한다면 영업을 종료한 뒤 남아 있는 시설물을 무조건 철거하기보다 임대차 계약서와 원상복구 조건을 먼저 확인하는 것이 필요합니다. 기존 시설과 새로 설치한 인테리어를 구분하면 불필요한 작업을 줄이는 데 도움이 됩니다.`,

  (r: string) =>
    `${r} 철거 현장은 같은 업종이나 비슷한 면적이라도 내부 구조와 마감 상태에 따라 작업 내용이 달라질 수 있습니다. 특히 점포철거와 가게철거는 집기와 설비가 많이 남아 있는 경우가 있어 현장 확인을 통해 작업 순서를 정리하는 과정이 필요합니다.`,

  (r: string) =>
    `${r}에서 원상복구를 준비하는 경우 가장 먼저 살펴볼 부분은 공간을 어느 상태까지 되돌려야 하는지입니다. 바닥과 벽, 천장뿐 아니라 전기 배선이나 조명, 냉난방 설비, 간판 등도 계약 조건에 따라 복구 대상이 달라질 수 있습니다.`,

  (r: string) =>
    `${r} 사무실철거는 상가나 매장과 다른 확인사항이 생길 수 있습니다. 파티션과 바닥 마감, 천장 설비, 네트워크 배선, 전기 시설처럼 업무 공간에 추가된 시설물을 구분하고 건물 관리 기준도 함께 확인하는 것이 중요합니다.`,
] as const;

const introSecond = [
  (r: string) =>
    `${r} 철거업체를 알아볼 때는 견적 금액만 비교하기보다 견적에 포함된 작업 범위를 함께 살펴보는 것이 좋습니다. 철거 대상, 폐기물 처리, 운반 조건, 공용부 보호, 마감 정리 등 실제 작업에 필요한 항목이 어디까지 포함되어 있는지 확인하면 견적 차이를 이해하기 쉽습니다.`,

  (r: string) =>
    `${r} 원상복구는 임대인이나 건물 관리 주체가 요구하는 조건에 따라 달라질 수 있습니다. 따라서 공사를 시작하기 전에 반환 기준을 확인하고 필요한 부분과 유지할 부분을 나누어 작업 범위를 정리하는 방식이 효율적입니다.`,

  (r: string) =>
    `${r}의 매장이나 점포가 건물 내부에 위치한 경우에는 엘리베이터 사용 시간, 폐기물 반출 동선, 소음 작업 가능 시간처럼 건물 운영 규정도 확인해야 합니다. 이러한 조건은 작업 일정과 진행 방식에 영향을 줄 수 있습니다.`,

  (r: string) =>
    `${r} 폐업 현장에서는 철거뿐 아니라 남아 있는 집기와 시설물의 정리 순서도 중요합니다. 철거 대상과 이동할 물품을 미리 구분하면 작업 중 혼선을 줄일 수 있고 현장 정리도 보다 체계적으로 진행할 수 있습니다.`,

  (r: string) =>
    `${r} 상가와 가게의 원상복구는 기존 상태를 확인할 수 있는 사진이나 계약 당시 자료가 있다면 범위를 정하는 데 도움이 됩니다. 자료가 부족한 경우에는 임대인과 협의한 내용을 기준으로 현장을 확인하는 것이 좋습니다.`,

  (r: string) =>
    `${r} 철거는 현장마다 필요한 장비와 인력, 폐기물의 종류가 다를 수 있습니다. 무료 방문견적을 통해 실제 공간을 확인하면 전화상담만으로 판단하기 어려운 작업 범위를 보다 구체적으로 살펴볼 수 있습니다.`,
] as const;

/* =========================================================
   공통 HIGHLIGHT
========================================================= */

function createHighlights(
  region: string,
  seed: number
): ContentHighlight[] {
  const pool: ContentHighlight[] = [
    {
      title: "현장 확인",
      text: `${region} 현장의 구조와 마감재, 설비 상태를 확인해 실제 필요한 철거 범위를 살펴봅니다.`,
    },
    {
      title: "원상복구 기준",
      text: "임대차 계약과 반환 조건을 확인해 철거할 부분과 유지할 부분을 구분하는 것이 중요합니다.",
    },
    {
      title: "폐기물 반출",
      text: "철거 후 발생하는 폐기물의 종류와 양, 반출 동선을 확인하면 작업 계획을 세우는 데 도움이 됩니다.",
    },
    {
      title: "건물 관리규정",
      text: "상가나 사무실이 입점한 건물은 작업 가능 시간과 엘리베이터 사용 등 관리 규정을 확인해야 합니다.",
    },
    {
      title: "철거 범위",
      text: "천장, 바닥, 벽체, 전기, 조명, 집기 등 철거 대상이 어디까지인지 견적 전에 구분합니다.",
    },
    {
      title: "무료 방문견적",
      text: `${BRAND}는 현장을 직접 확인한 뒤 필요한 작업 범위를 살펴보고 상담을 진행합니다.`,
    },
    {
      title: "계약 종료 준비",
      text: "임대차 종료 일정과 반환 날짜를 고려해 철거와 원상복구 작업 일정을 미리 정리하는 것이 좋습니다.",
    },
    {
      title: "공용부 보호",
      text: "건물 복도와 엘리베이터 등 공용 공간을 이용하는 현장은 반출 과정에서 필요한 보호 조치를 확인합니다.",
    },
  ];

  return rotate(
    pool,
    seed
  ).slice(0, 4);
}

/* =========================================================
   검색의도별 추가 섹션

   모든 페이지에 7개를 똑같이 넣지 않고
   URL seed에 따라 4~5개를 선택합니다.
========================================================= */

function createIntentSections(
  region: string,
  seed: number
): ContentSection[] {
  const intentSections: ContentSection[] = [
    {
      label: "상가철거",
      heading: `${region} 상가철거는 임대차 반환 기준부터 확인합니다`,
      paragraphs: [
        `${region} 상가철거를 준비할 때는 현재 설치되어 있는 인테리어를 모두 철거해야 하는지부터 확인하는 것이 좋습니다. 임대인이 요구하는 반환 상태와 계약 당시 시설을 구분하면 불필요한 철거를 줄일 수 있습니다.`,
        "바닥 마감과 천장, 벽체, 전기 시설, 간판처럼 임차인이 추가한 부분이 어디까지인지 확인하고 폐기물 반출 조건과 작업 가능 시간도 함께 살펴보면 현장 진행 계획을 세우기 수월합니다.",
      ],
    },

    {
      label: "매장철거",
      heading: `${region} 매장철거는 집기와 설비 정리 순서가 중요합니다`,
      paragraphs: [
        `${region} 매장철거 현장은 진열대와 카운터, 조명, 간판, 주방 설비 등 업종에 따라 남아 있는 시설물이 다양할 수 있습니다. 철거 전에 이동할 물품과 폐기할 시설을 나누어 두면 작업 과정에서 혼선을 줄일 수 있습니다.`,
        "매장 내부뿐 아니라 외부 간판이나 출입구 주변 시설까지 원상복구 대상에 포함되는지 확인하고 건물 관리 규정에 맞춰 반출 동선과 작업 시간을 정리하는 것이 좋습니다.",
      ],
    },

    {
      label: "사무실철거",
      heading: `${region} 사무실철거는 파티션과 배선 범위를 확인합니다`,
      paragraphs: [
        `${region} 사무실철거에서는 파티션과 바닥 마감, 천장, 전기 배선, 네트워크 선로처럼 업무 공간을 구성하기 위해 추가된 시설물을 확인해야 합니다. 건물 기본 시설과 임차인이 설치한 시설을 구분하는 과정이 필요합니다.`,
        "사무실은 같은 건물 내 다른 업체가 업무를 진행하고 있을 수 있어 소음 작업 시간과 엘리베이터 이용 조건 등 관리사무소의 공사 규정을 사전에 확인하는 것이 중요합니다.",
      ],
    },

    {
      label: "점포철거",
      heading: `${region} 점포철거는 계약 종료 일정과 함께 계획합니다`,
      paragraphs: [
        `${region} 점포철거는 임대차 계약 종료일과 공간 반환 일정을 기준으로 작업 계획을 세우는 것이 좋습니다. 철거가 끝난 뒤 추가 보완이 필요한 상황까지 고려하면 일정에 여유를 두고 준비할 수 있습니다.`,
        "점포 내부의 벽체와 바닥, 천장뿐 아니라 간판, 전기, 수도, 가스 등 부대시설의 처리 기준도 확인해 견적 단계에서 작업 범위를 구체적으로 정리하는 것이 도움이 됩니다.",
      ],
    },

    {
      label: "가게철거",
      heading: `${region} 가게철거는 업종별 시설 상태를 함께 살펴봅니다`,
      paragraphs: [
        `${region} 가게철거는 음식점, 카페, 판매점 등 기존 업종에 따라 철거해야 할 시설이 달라질 수 있습니다. 주방 시설이나 급배수 설비, 진열 시설, 바닥 마감처럼 업종 특성에 따라 설치된 부분을 먼저 확인합니다.`,
        "철거할 시설과 그대로 유지할 시설을 구분하고 폐기물의 종류와 반출 방법을 함께 살펴보면 현장에 맞는 작업 범위를 정하는 데 도움이 됩니다.",
      ],
    },

    {
      label: "폐업철거",
      heading: `${region} 폐업철거는 영업 종료 후 정리 범위를 구분합니다`,
      paragraphs: [
        `${region} 폐업철거를 진행할 때는 남아 있는 물품을 먼저 정리하고 철거 대상 시설을 구분하는 것이 좋습니다. 재사용하거나 이동할 집기와 폐기할 시설을 나누면 철거 과정이 보다 명확해집니다.`,
        "폐업 후 임대차 공간을 반환해야 한다면 원상복구 조건을 함께 확인해야 합니다. 단순 철거와 원상복구가 필요한 부분을 나누어 계획하면 작업 범위를 이해하기 쉽습니다.",
      ],
    },

    {
      label: "원상복구",
      heading: `${region} 원상복구는 철거 후 반환 상태가 기준입니다`,
      paragraphs: [
        `${region} 원상복구는 무조건 모든 시설을 철거하는 작업이 아니라 임대차 계약에서 정한 반환 상태에 맞추는 과정입니다. 기존 시설과 임차인이 추가한 인테리어를 구분하는 것이 우선입니다.`,
        "철거가 끝난 뒤 바닥이나 벽, 천장 등의 마감 보완이 필요한지 확인하고 임대인 또는 관리 주체와 협의한 범위에 맞춰 마무리 상태를 점검하는 것이 좋습니다.",
      ],
    },
  ];

  const rotated =
    rotate(
      intentSections,
      seed
    );

  const count =
    seed % 2 === 0
      ? 5
      : 4;

  return rotated.slice(
    0,
    count
  );
}

/* =========================================================
   GUIDE
========================================================= */

function createGuideLayout(
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  return {
    eyebrow:
      pick(
        eyebrowPatterns,
        seed
      ),

    h1:
      pick(
        h1Patterns,
        seed
      )(region),

    introHeading:
      pick(
        introHeadingPatterns,
        seed,
        1
      )(region),

    intro: [
      pick(
        introFirst,
        seed
      )(region),

      pick(
        introSecond,
        seed,
        2
      )(region),
    ],

    sectionEyebrow:
      "철거 준비 가이드",

    sectionHeading:
      `${region} 철거 전 먼저 확인할 내용`,

    sectionLead:
      "철거는 공간을 비우는 작업에서 끝나지 않습니다. 계약 조건과 현장 상태, 건물 관리 기준을 함께 확인해 실제 필요한 범위를 정리하는 과정이 중요합니다.",

    sections: [
      {
        label:
          "현장 확인",

        heading:
          `${region} 현장의 철거 대상부터 구분합니다`,

        paragraphs: [
          "천장과 벽체, 바닥, 조명, 전기 시설, 간판, 집기 등 현재 설치된 시설을 살펴보고 철거할 부분과 유지할 부분을 구분합니다.",
          "같은 면적이라도 내부 구조와 마감재에 따라 필요한 작업이 달라질 수 있으므로 실제 현장을 기준으로 판단하는 것이 좋습니다.",
        ],
      },

      {
        label:
          "계약 확인",

        heading:
          "임대차 반환 조건을 확인합니다",

        paragraphs: [
          "상가와 매장, 사무실처럼 임대차 계약이 있는 공간은 계약 종료 시 어느 상태까지 복구해야 하는지 확인하는 과정이 필요합니다.",
          "계약서와 기존 사진, 임대인과 협의한 내용을 함께 확인하면 불필요한 철거나 추가 복구를 줄이는 데 도움이 됩니다.",
        ],
      },

      {
        label:
          "작업 계획",

        heading:
          "철거와 반출 순서를 정리합니다",

        paragraphs: [
          "남아 있는 집기와 시설물의 종류를 확인하고 이동할 물품과 폐기할 대상을 먼저 나누어 두면 작업 진행이 수월합니다.",
          "폐기물 반출 동선과 엘리베이터 사용 여부, 차량 진입 조건도 함께 확인하면 현장에 맞는 작업 계획을 세울 수 있습니다.",
        ],
      },

      {
        label:
          "마무리",

        heading:
          "철거 후 원상복구 상태를 확인합니다",

        paragraphs: [
          "철거 작업이 끝난 뒤에는 바닥과 벽, 천장 등 추가 보완이 필요한 부분이 있는지 확인합니다.",
          "임대인이나 관리 주체가 요구하는 반환 상태와 비교해 필요한 마무리 범위를 점검하는 것이 좋습니다.",
        ],
      },
    ],

    highlightHeading:
      `${region} 철거 견적 전에 살펴볼 핵심`,

    highlights:
      createHighlights(
        region,
        seed
      ),

    closingEyebrow:
      "현장 상담",

    closingHeading:
      `${region} 철거는 현장을 확인한 뒤 범위를 정합니다`,

    closing: [
      `${region} 철거는 공간의 면적만으로 필요한 작업을 정확하게 판단하기 어렵습니다. 상가, 매장, 사무실, 점포, 가게마다 내부 시설과 원상복구 조건이 다르기 때문입니다.`,
      `${BRAND}는 현장을 직접 확인한 뒤 필요한 작업 범위를 살펴보고 상담을 진행합니다. 무료 방문견적 상담은 ${PHONE}로 문의할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   CLOSURE
========================================================= */

function createClosureLayout(
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  return {
    eyebrow:
      "폐업철거 안내",

    h1:
      `${region} 폐업철거와 원상복구 준비`,

    introHeading:
      `${region} 폐업 후 공간을 반환하기 전에 확인합니다`,

    intro: [
      `${region}에서 매장이나 점포 영업을 종료한 뒤 공간을 반환해야 한다면 남아 있는 시설물을 정리하는 것과 원상복구 범위를 확인하는 일을 함께 준비해야 합니다. 폐업철거는 단순히 내부를 비우는 것과 다르게 계약 조건에 맞는 반환 상태를 고려해야 합니다.`,
      pick(
        introSecond,
        seed
      )(region),
    ],

    sectionEyebrow:
      "폐업 현장 진행 순서",

    sectionHeading:
      `${region} 폐업철거는 순서를 정해 준비합니다`,

    sectionLead:
      "영업 종료 후에는 집기 정리부터 철거, 폐기물 반출, 원상복구 확인까지 여러 과정이 이어질 수 있습니다. 현장 상황에 맞춰 순서를 정리하는 것이 좋습니다.",

    sections: [
      {
        label:
          "영업 종료",

        heading:
          "남아 있는 물품과 집기를 먼저 구분합니다",

        paragraphs: [
          "이동할 집기와 재사용할 물품, 폐기할 시설물을 구분하면 철거 대상이 보다 명확해집니다.",
          "주방 설비나 진열 시설처럼 업종별로 설치된 장비가 있다면 철거 전에 처리 방법을 정하는 것이 좋습니다.",
        ],
      },

      {
        label:
          "계약 조건",

        heading:
          "임대차 계약의 원상복구 범위를 확인합니다",

        paragraphs: [
          "임차인이 설치한 인테리어를 어디까지 철거해야 하는지 확인하고 기존 시설과 구분합니다.",
          "임대인과 협의한 반환 기준이 있다면 공사 시작 전에 내용을 정리해 두는 것이 좋습니다.",
        ],
      },

      {
        label:
          "철거 작업",

        heading:
          "시설별 철거 순서와 반출 동선을 정리합니다",

        paragraphs: [
          "천장과 벽체, 바닥, 간판, 전기, 집기 등 철거 대상의 종류에 따라 작업 순서를 정합니다.",
          "건물 내 점포라면 공용부 보호와 엘리베이터 사용, 폐기물 반출 시간도 확인해야 합니다.",
        ],
      },

      {
        label:
          "반환 준비",

        heading:
          "철거 후 공간 상태를 다시 확인합니다",

        paragraphs: [
          "철거가 완료된 뒤에는 원상복구가 필요한 부분이 남아 있는지 확인하고 마감 상태를 점검합니다.",
          "계약에서 정한 반환 기준과 실제 현장 상태를 비교하면 추가 작업 여부를 판단하는 데 도움이 됩니다.",
        ],
      },
    ],

    highlightHeading:
      `${region} 폐업철거에서 놓치기 쉬운 부분`,

    highlights:
      createHighlights(
        region,
        seed + 2
      ),

    closingEyebrow:
      "폐업 현장 상담",

    closingHeading:
      `${region} 폐업철거는 반환 일정까지 고려해 준비합니다`,

    closing: [
      "폐업 후에는 정리해야 할 일이 많기 때문에 철거와 원상복구 범위를 미리 확인해 두면 공간 반환 일정을 계획하는 데 도움이 됩니다.",
      `${BRAND}는 ${region} 현장을 확인한 뒤 상가철거, 매장철거, 점포철거, 가게철거와 원상복구에 필요한 범위를 안내합니다. 무료 방문견적은 ${PHONE}로 상담할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   RESTORATION
========================================================= */

function createRestorationLayout(
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  return {
    eyebrow:
      "원상복구 안내",

    h1:
      `${region} 원상복구 철거 범위 확인`,

    introHeading:
      `${region} 원상복구는 반환 기준을 먼저 살펴봅니다`,

    intro: [
      `${region} 원상복구는 공간을 처음 상태와 완전히 똑같이 만드는 의미로만 이해하기보다 임대차 계약과 임대인이 요구하는 반환 기준을 확인하는 것이 중요합니다. 기존 시설과 임차인이 추가한 시설을 구분하면 필요한 작업을 정하기 쉽습니다.`,
      pick(
        introSecond,
        seed,
        3
      )(region),
    ],

    sectionEyebrow:
      "원상복구 기준",

    sectionHeading:
      "철거 대상과 복구 대상을 나누어 확인합니다",

    sectionLead:
      "현장에 남아 있는 시설을 모두 철거하기 전에 계약 당시 상태와 반환 조건을 확인하면 필요한 작업을 보다 구체적으로 정리할 수 있습니다.",

    sections: [
      {
        label:
          "기존 상태",

        heading:
          "계약 당시 시설을 확인합니다",

        paragraphs: [
          "기존에 설치되어 있던 천장이나 바닥, 조명, 설비가 무엇인지 확인하면 임차인이 추가한 부분을 구분하는 데 도움이 됩니다.",
          "입주 당시 사진이나 계약 자료가 있다면 원상복구 범위를 정할 때 참고할 수 있습니다.",
        ],
      },

      {
        label:
          "추가 시설",

        heading:
          "임차인이 설치한 인테리어를 구분합니다",

        paragraphs: [
          "벽체와 파티션, 바닥 마감, 간판, 조명 등 영업이나 업무를 위해 새로 설치한 시설을 확인합니다.",
          "철거가 필요한 시설과 임대인이 유지하기로 한 시설을 구분하면 불필요한 작업을 줄일 수 있습니다.",
        ],
      },

      {
        label:
          "마감 확인",

        heading:
          "철거 후 보완할 부분을 확인합니다",

        paragraphs: [
          "시설물을 제거한 뒤 벽이나 바닥, 천장에 남는 흔적과 마감 상태를 살펴봅니다.",
          "단순 철거만 필요한지 마감 보완까지 필요한지는 반환 조건과 현장 상태를 함께 보고 판단합니다.",
        ],
      },

      {
        label:
          "최종 확인",

        heading:
          "공간 반환 전 작업 상태를 점검합니다",

        paragraphs: [
          "작업이 끝난 뒤 철거 대상이 남아 있지 않은지, 추가 복구가 필요한 부분이 없는지 확인합니다.",
          "임대인 또는 관리 주체와 협의한 범위를 기준으로 마무리 상태를 살펴보는 것이 좋습니다.",
        ],
      },
    ],

    highlightHeading:
      `${region} 원상복구 범위를 정할 때 확인할 내용`,

    highlights:
      createHighlights(
        region,
        seed + 3
      ),

    closingEyebrow:
      "원상복구 상담",

    closingHeading:
      `${region} 원상복구는 필요한 범위를 먼저 확인합니다`,

    closing: [
      "원상복구는 현장마다 기준이 다를 수 있으므로 다른 현장의 사례를 그대로 적용하기보다 현재 공간의 계약 조건과 시설 상태를 확인하는 것이 중요합니다.",
      `${BRAND}는 ${region} 현장을 직접 확인하고 철거와 원상복구에 필요한 범위를 안내합니다. 상담은 ${PHONE}로 문의할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   COMMERCIAL
========================================================= */

function createCommercialLayout(
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  return {
    eyebrow:
      "상가·매장 철거 안내",

    h1:
      `${region} 상가 매장 철거업체 안내`,

    introHeading:
      `${region} 상업공간은 업종별 시설을 함께 확인합니다`,

    intro: [
      `${region}의 상가와 매장은 업종에 따라 내부 시설 구성이 크게 달라질 수 있습니다. 판매점의 진열 시설과 음식점의 주방 설비, 카페의 카운터와 급배수 시설처럼 공간마다 철거 대상이 달라지므로 현장 상태를 먼저 확인하는 것이 중요합니다.`,
      pick(
        introSecond,
        seed,
        4
      )(region),
    ],

    sectionEyebrow:
      "상업공간 철거",

    sectionHeading:
      `${region} 상가와 매장 철거 범위를 공간별로 살펴봅니다`,

    sectionLead:
      "상업공간은 내부 인테리어뿐 아니라 간판과 설비, 전기, 급배수 시설 등 확인해야 할 부분이 다양합니다.",

    sections: [
      {
        label:
          "매장 내부",

        heading:
          "진열 시설과 내부 인테리어를 구분합니다",

        paragraphs: [
          "진열대와 카운터, 파티션, 벽체, 천장, 바닥 등 영업을 위해 설치한 시설의 철거 여부를 확인합니다.",
          "이동하거나 재사용할 시설이 있다면 철거 전에 별도로 구분하는 것이 좋습니다.",
        ],
      },

      {
        label:
          "설비",

        heading:
          "전기와 급배수 등 부대시설을 확인합니다",

        paragraphs: [
          "업종에 따라 추가된 전기 배선과 조명, 수도, 배수 시설 등이 원상복구 대상에 포함되는지 확인합니다.",
          "건물 기본 설비와 임차인이 추가한 설비를 구분하면 작업 범위를 정하는 데 도움이 됩니다.",
        ],
      },

      {
        label:
          "외부 시설",

        heading:
          "간판과 출입구 주변 시설도 확인합니다",

        paragraphs: [
          "외부 간판이나 유리 시트, 출입구 주변 홍보 시설 등이 계약 종료 시 철거 대상인지 살펴봅니다.",
          "건물 외부 시설은 관리 규정에 따라 작업 방식이 달라질 수 있으므로 사전에 확인하는 것이 좋습니다.",
        ],
      },

      {
        label:
          "반출",

        heading:
          "폐기물 반출 동선과 시간을 확인합니다",

        paragraphs: [
          "상가 건물은 다른 점포가 함께 영업하고 있을 수 있어 폐기물 반출 시간과 이동 경로를 확인해야 합니다.",
          "엘리베이터 사용이나 차량 진입 조건을 미리 살펴보면 작업 계획을 세우기 수월합니다.",
        ],
      },
    ],

    highlightHeading:
      `${region} 상가·매장 철거 전 확인사항`,

    highlights:
      createHighlights(
        region,
        seed + 4
      ),

    closingEyebrow:
      "상업공간 상담",

    closingHeading:
      `${region} 상가철거는 업종과 현장 조건에 맞춰 확인합니다`,

    closing: [
      "상가와 매장은 같은 면적이라도 기존 업종과 설치 시설에 따라 철거 범위가 크게 달라질 수 있습니다. 따라서 실제 현장을 확인해 필요한 작업을 구분하는 것이 좋습니다.",
      `${BRAND}는 ${region} 상가철거와 매장철거, 점포철거, 가게철거 및 원상복구 상담을 진행합니다. 무료 방문견적 문의는 ${PHONE}입니다.`,
    ],
  };
}

/* =========================================================
   OFFICE
========================================================= */

function createOfficeLayout(
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  return {
    eyebrow:
      "사무실철거 안내",

    h1:
      `${region} 사무실철거 원상복구 안내`,

    introHeading:
      `${region} 사무실은 업무시설과 건물 기본시설을 구분합니다`,

    intro: [
      `${region} 사무실철거에서는 파티션과 바닥, 천장뿐 아니라 전기 배선과 네트워크 선로, 조명 등 업무 공간을 위해 추가한 시설을 확인해야 합니다. 건물의 기본 설비를 손상하지 않도록 철거 범위를 구분하는 과정이 중요합니다.`,
      pick(
        introSecond,
        seed,
        5
      )(region),
    ],

    sectionEyebrow:
      "업무공간 철거",

    sectionHeading:
      `${region} 사무실 원상복구에서 확인할 부분`,

    sectionLead:
      "사무실은 파티션과 배선, 바닥 마감 등 업무환경을 구성하기 위해 설치된 시설이 많아 계약 종료 전 작업 범위를 정리하는 것이 좋습니다.",

    sections: [
      {
        label:
          "파티션",

        heading:
          "공간 구획 시설의 철거 범위를 확인합니다",

        paragraphs: [
          "사무실 내부의 파티션과 회의실 벽체 등 임차인이 설치한 공간 구획 시설을 확인합니다.",
          "건물 기본 벽체와 추가 설치 벽체를 구분해 철거 대상을 정하는 것이 중요합니다.",
        ],
      },

      {
        label:
          "배선",

        heading:
          "전기와 통신 배선의 처리 기준을 살펴봅니다",

        paragraphs: [
          "업무용 전기 배선과 랜선, 콘센트, 조명 등 추가된 시설이 어디까지 원상복구 대상인지 확인합니다.",
          "건물 기본 전기 시설과 연결된 부분은 작업 전에 구조를 확인하는 것이 좋습니다.",
        ],
      },

      {
        label:
          "바닥·천장",

        heading:
          "마감재와 설비 상태를 확인합니다",

        paragraphs: [
          "데코타일이나 카펫 등 바닥 마감과 천장 시설의 철거 여부를 계약 조건에 맞춰 확인합니다.",
          "철거 후 남는 접착제나 고정 흔적 등 추가 마감이 필요한 부분도 함께 살펴봅니다.",
        ],
      },

      {
        label:
          "건물 규정",

        heading:
          "업무시간과 공사 가능 시간을 확인합니다",

        paragraphs: [
          "같은 건물에서 다른 업체가 업무 중이라면 소음이 발생하는 작업의 가능 시간을 확인해야 합니다.",
          "엘리베이터 사용과 폐기물 반출 시간 등 관리사무소의 공사 규정을 미리 확인하는 것이 좋습니다.",
        ],
      },
    ],

    highlightHeading:
      `${region} 사무실철거 핵심 확인사항`,

    highlights:
      createHighlights(
        region,
        seed + 5
      ),

    closingEyebrow:
      "사무실철거 상담",

    closingHeading:
      `${region} 사무실 원상복구는 계약 조건과 시설 상태를 함께 봅니다`,

    closing: [
      "사무실은 업무를 위해 설치한 시설과 건물 기본 시설이 섞여 있는 경우가 많아 철거 전에 각각의 범위를 구분하는 것이 중요합니다.",
      `${BRAND}는 ${region} 사무실철거 현장을 확인하고 필요한 철거 및 원상복구 범위를 안내합니다. 무료 방문견적은 ${PHONE}로 문의할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   PROCESS
========================================================= */

function createProcessLayout(
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  return {
    eyebrow:
      "철거 진행 과정",

    h1:
      `${region} 철거업체 작업 과정 안내`,

    introHeading:
      `${region} 철거는 현장 확인부터 마무리까지 순서가 중요합니다`,

    intro: [
      `${region} 철거 현장은 바로 철거를 시작하기보다 현장 상태를 확인하고 작업 범위를 정한 뒤 일정과 반출 방법을 계획하는 것이 좋습니다. 작업 전 준비가 명확하면 철거 과정에서 생길 수 있는 혼선을 줄이는 데 도움이 됩니다.`,
      pick(
        introSecond,
        seed,
        6
      )(region),
    ],

    sectionEyebrow:
      "현장 진행 단계",

    sectionHeading:
      `${region} 철거 진행 흐름을 확인합니다`,

    sectionLead:
      "현장마다 세부 과정은 달라질 수 있지만 철거 범위를 확인하고 반출과 원상복구 상태를 점검하는 기본 흐름을 미리 알아두면 준비하기 쉽습니다.",

    sections: [
      {
        label:
          "현장 확인",

        heading:
          "철거 대상과 유지 시설을 구분합니다",

        paragraphs: [
          "현장 내부를 확인해 철거할 시설과 그대로 유지해야 할 시설을 구분합니다.",
          "계약 조건이나 임대인과 협의한 반환 기준이 있다면 이 단계에서 함께 확인하는 것이 좋습니다.",
        ],
      },

      {
        label:
          "견적 범위",

        heading:
          "작업 항목과 반출 조건을 정리합니다",

        paragraphs: [
          "천장과 벽, 바닥, 집기, 설비 등 철거 항목을 정리하고 폐기물 처리와 반출 조건을 확인합니다.",
          "건물 관리 규정과 작업 가능 시간도 견적 단계에서 함께 확인하면 일정 계획에 도움이 됩니다.",
        ],
      },

      {
        label:
          "철거 진행",

        heading:
          "현장 조건에 맞춰 작업을 진행합니다",

        paragraphs: [
          "시설의 구조와 종류를 고려해 작업 순서를 정하고 철거 후 발생한 폐기물을 순차적으로 반출합니다.",
          "공용부를 이용하는 현장은 이동 동선과 주변 공간의 보호도 함께 고려해야 합니다.",
        ],
      },

      {
        label:
          "마무리 확인",

        heading:
          "원상복구와 현장 정리 상태를 살펴봅니다",

        paragraphs: [
          "철거 대상이 모두 정리되었는지 확인하고 추가 보완이 필요한 부분을 살펴봅니다.",
          "계약에서 정한 공간 반환 상태를 기준으로 최종 현장을 확인하는 것이 좋습니다.",
        ],
      },
    ],

    highlightHeading:
      `${region} 철거 과정에서 확인할 항목`,

    highlights:
      createHighlights(
        region,
        seed + 6
      ),

    closingEyebrow:
      "현장 진행 상담",

    closingHeading:
      `${region} 철거는 작업 전 범위를 명확하게 정리합니다`,

    closing: [
      "철거 과정은 현장 구조와 건물 조건에 따라 달라질 수 있습니다. 작업 전에 필요한 범위와 반출 조건을 정리하면 보다 체계적으로 준비할 수 있습니다.",
      `${BRAND}는 ${region} 철거 현장을 직접 확인하고 필요한 작업 범위를 안내합니다. 상담은 ${PHONE}로 문의할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   CONTRACT
========================================================= */

function createContractLayout(
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  return {
    eyebrow:
      "계약 종료 철거 안내",

    h1:
      `${region} 계약 종료 원상복구 안내`,

    introHeading:
      `${region} 철거 전에 임대차 반환 조건을 확인합니다`,

    intro: [
      `${region}의 상가나 사무실, 매장 계약이 끝나는 시점에는 공간을 어느 상태로 반환해야 하는지 확인하는 것이 중요합니다. 철거를 먼저 진행한 뒤 반환 기준을 확인하면 필요하지 않은 부분까지 제거하거나 추가 복구가 생길 수 있습니다.`,
      pick(
        introSecond,
        seed,
        7
      )(region),
    ],

    sectionEyebrow:
      "계약 확인",

    sectionHeading:
      `${region} 임대차 종료 전 살펴볼 철거 기준`,

    sectionLead:
      "계약서와 기존 시설 상태, 임대인과 협의한 내용을 기준으로 철거할 부분과 유지할 부분을 구분하면 원상복구 범위를 정하기 쉽습니다.",

    sections: [
      {
        label:
          "계약서",

        heading:
          "원상복구 관련 조항을 확인합니다",

        paragraphs: [
          "임대차 계약서에 원상복구 범위나 반환 상태에 대한 내용이 있는지 먼저 살펴봅니다.",
          "표현이 명확하지 않은 부분은 임대인과 협의해 작업 전에 범위를 확인하는 것이 좋습니다.",
        ],
      },

      {
        label:
          "기존 시설",

        heading:
          "입주 전부터 있던 시설을 구분합니다",

        paragraphs: [
          "계약 당시부터 설치되어 있던 시설과 임차 후 추가한 인테리어를 구분합니다.",
          "기존 사진이나 인수인계 자료가 있다면 원래 상태를 확인하는 데 도움이 됩니다.",
        ],
      },

      {
        label:
          "추가 설치",

        heading:
          "영업과 업무를 위해 추가한 시설을 확인합니다",

        paragraphs: [
          "간판과 파티션, 조명, 바닥, 벽체, 전기 설비 등 추가 설치 시설을 목록으로 정리합니다.",
          "임대인이 유지하기로 한 시설이 있다면 철거 대상에서 제외해야 합니다.",
        ],
      },

      {
        label:
          "반환 일정",

        heading:
          "철거 완료와 공간 반환 날짜를 함께 계획합니다",

        paragraphs: [
          "철거 후 보완 작업이 필요한 경우를 고려해 계약 종료일보다 여유 있게 일정을 준비하는 것이 좋습니다.",
          "건물의 공사 가능 시간과 폐기물 반출 일정도 함께 확인하면 작업 계획을 세우기 수월합니다.",
        ],
      },
    ],

    highlightHeading:
      `${region} 계약 종료 철거에서 확인할 부분`,

    highlights:
      createHighlights(
        region,
        seed + 7
      ),

    closingEyebrow:
      "계약 종료 상담",

    closingHeading:
      `${region} 원상복구는 계약 기준을 확인한 뒤 진행합니다`,

    closing: [
      "임대차 계약 종료 시 필요한 원상복구는 현장마다 기준이 다를 수 있습니다. 계약 내용과 기존 시설 상태를 먼저 확인한 뒤 실제 필요한 철거 범위를 정하는 것이 중요합니다.",
      `${BRAND}는 ${region} 상가, 매장, 사무실, 점포, 가게의 계약 종료 철거와 원상복구 범위를 현장에서 확인합니다. 문의는 ${PHONE}입니다.`,
    ],
  };
}

/* =========================================================
   FIELD
========================================================= */

function createFieldLayout(
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  return {
    eyebrow:
      "현장 중심 철거 안내",

    h1:
      `${region} 철거 현장 작업 범위 안내`,

    introHeading:
      `${region} 철거 견적은 실제 현장을 기준으로 살펴봅니다`,

    intro: [
      `${region} 철거는 온라인에서 면적이나 업종만 확인하는 것보다 실제 현장을 살펴보는 과정이 중요합니다. 같은 평수의 상가나 매장이라도 벽체 구조와 바닥 마감, 천장 시설, 집기와 설비의 양에 따라 작업 범위가 달라질 수 있습니다.`,
      pick(
        introSecond,
        seed,
        1
      )(region),
    ],

    sectionEyebrow:
      "현장 체크",

    sectionHeading:
      `${region} 철거 현장에서 확인하는 주요 조건`,

    sectionLead:
      "철거 대상뿐 아니라 폐기물 반출과 건물 이용 조건까지 함께 확인하면 현장에 맞는 작업 계획을 정리할 수 있습니다.",

    sections: [
      {
        label:
          "내부 구조",

        heading:
          "벽체와 천장, 바닥의 구조를 확인합니다",

        paragraphs: [
          "철거 대상 마감재와 구조물의 종류를 확인하고 건물 기본 구조와 구분합니다.",
          "마감재의 종류와 설치 방식에 따라 작업 방법이 달라질 수 있으므로 현장 확인이 필요합니다.",
        ],
      },

      {
        label:
          "시설물",

        heading:
          "집기와 설비의 종류를 살펴봅니다",

        paragraphs: [
          "매장 집기와 사무실 파티션, 주방 시설 등 공간에 설치된 시설물을 확인합니다.",
          "재사용하거나 이동할 시설과 폐기할 대상을 나누면 철거 범위를 보다 명확하게 정할 수 있습니다.",
        ],
      },

      {
        label:
          "반출 조건",

        heading:
          "폐기물 이동 경로를 확인합니다",

        paragraphs: [
          "현장에서 건물 밖까지 폐기물을 이동하는 경로와 엘리베이터 사용 가능 여부를 살펴봅니다.",
          "차량 진입이 어려운 곳이나 이동 거리가 긴 현장은 반출 조건도 작업 계획에 영향을 줄 수 있습니다.",
        ],
      },

      {
        label:
          "주변 환경",

        heading:
          "건물 운영과 주변 점포 상황을 확인합니다",

        paragraphs: [
          "상가나 업무시설은 주변 공간이 운영 중인 경우가 많아 소음과 이동 동선을 고려해야 합니다.",
          "관리사무소가 정한 공사 가능 시간과 공용부 사용 규정을 미리 확인하는 것이 좋습니다.",
        ],
      },
    ],

    highlightHeading:
      `${region} 현장견적에서 확인하는 조건`,

    highlights:
      createHighlights(
        region,
        seed + 1
      ),

    closingEyebrow:
      "무료 방문견적",

    closingHeading:
      `${region} 철거는 현장을 직접 보고 필요한 범위를 확인합니다`,

    closing: [
      "철거 비용과 작업 범위는 공간의 크기만으로 결정되지 않습니다. 내부 구조와 시설물, 폐기물 반출 조건, 원상복구 기준을 함께 살펴봐야 합니다.",
      `${BRAND}는 ${region} 현장을 확인한 뒤 필요한 철거 범위를 안내합니다. 무료 방문견적 상담은 ${PHONE}로 문의할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   LAYOUT GENERATOR
========================================================= */

function createLayoutContent(
  layoutType: LayoutType,
  region: string,
  seed: number
): Omit<
  RegionContent,
  | "title"
  | "description"
  | "layoutType"
> {
  switch (layoutType) {
    case "closure":
      return createClosureLayout(
        region,
        seed
      );

    case "restoration":
      return createRestorationLayout(
        region,
        seed
      );

    case "commercial":
      return createCommercialLayout(
        region,
        seed
      );

    case "office":
      return createOfficeLayout(
        region,
        seed
      );

    case "process":
      return createProcessLayout(
        region,
        seed
      );

    case "contract":
      return createContractLayout(
        region,
        seed
      );

    case "field":
      return createFieldLayout(
        region,
        seed
      );

    case "guide":
    default:
      return createGuideLayout(
        region,
        seed
      );
  }
}

/* =========================================================
   LAYOUT TYPES
========================================================= */

const layoutTypes: readonly LayoutType[] = [
  "guide",
  "closure",
  "restoration",
  "commercial",
  "office",
  "process",
  "contract",
  "field",
];

/* =========================================================
   FINAL CONTENT GENERATOR
========================================================= */

export function createRegionContent({
  regionName,
  parentName,
  path,
}: CreateRegionContentParams): RegionContent {
  const seed =
    hashString(path);

  const location =
    createLocationName(
      regionName,
      parentName
    );

  const layoutType =
    pick(
      layoutTypes,
      seed
    );

  const title =
    pick(
      titlePatterns,
      seed,
      2
    )(location);

  const description =
    pick(
      descriptionPatterns,
      seed,
      5
    )(location);

  const layoutContent =
    createLayoutContent(
      layoutType,
      location,
      seed
    );

  /*
    기존 레이아웃의 기본 섹션과
    검색의도별 추가 섹션을 합칩니다.

    동일한 label 또는 heading이 있으면
    중복 추가하지 않습니다.
  */

  const intentSections =
    createIntentSections(
      location,
      seed
    );

  const existingLabels =
    new Set(
      layoutContent.sections
        .map(
          (section) =>
            section.label
        )
        .filter(
          (
            label
          ): label is string =>
            Boolean(label)
        )
    );

  const existingHeadings =
    new Set(
      layoutContent.sections.map(
        (section) =>
          section.heading
      )
    );

  const uniqueIntentSections =
    intentSections.filter(
      (section) => {
        const duplicateLabel =
          section.label
            ? existingLabels.has(
                section.label
              )
            : false;

        const duplicateHeading =
          existingHeadings.has(
            section.heading
          );

        return (
          !duplicateLabel &&
          !duplicateHeading
        );
      }
    );

  const sections = [
    ...layoutContent.sections,
    ...uniqueIntentSections,
  ];

  return {
    title,
    description,

    layoutType,

    ...layoutContent,

    sections,
  };
}