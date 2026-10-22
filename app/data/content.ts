/* =========================================================
   더세이브철거 지역별 콘텐츠 엔진

   목적
   ---------------------------------------------------------
   지역명만 바뀌는 페이지를 만들지 않습니다.

   지역 URL을 기준으로 다음 요소를 분산합니다.

   - Title
   - Description 기본값
   - Eyebrow
   - H1
   - 도입부
   - 페이지 콘텐츠 유형
   - 핵심 섹션
   - H2
   - 본문
   - 체크/보조 정보
   - 마무리

   Math.random()은 사용하지 않습니다.
   같은 URL에서는 항상 같은 콘텐츠가 출력됩니다.
========================================================= */

export type ContentSection = {
  heading: string;
  paragraphs: string[];
  label?: string;
};

export type ContentHighlight = {
  title: string;
  text: string;
};

export type RegionContent = {
  title: string;
  description: string;

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

  layoutType:
    | "guide"
    | "closure"
    | "restoration"
    | "commercial"
    | "office"
    | "process"
    | "contract"
    | "field";
};

/* =========================================================
   입력 타입
========================================================= */

type ContentInput = {
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
   Hash

   URL이 같으면 항상 같은 숫자가 생성됩니다.
========================================================= */

function hashString(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);

    hash = Math.imul(
      hash,
      16777619
    );
  }

  return hash >>> 0;
}

/* =========================================================
   배열 선택 함수
========================================================= */

function pick<T>(
  items: T[],
  seed: number,
  offset = 0
): T {
  return items[
    (seed + offset) % items.length
  ];
}

/* =========================================================
   지역 표시

   예:
   서울 + 강남구 → 서울 강남구
   안양 + 만안구 → 안양 만안구
   강남구 + 역삼동 → 강남구 역삼동
========================================================= */

function createLocationLabel(
  regionName: string,
  parentName?: string
) {
  if (
    !parentName ||
    parentName === regionName
  ) {
    return regionName;
  }

  return `${parentName} ${regionName}`;
}

/* =========================================================
   페이지 유형

   8개 유형을 사용합니다.

   같은 철거 페이지라도
   무엇을 중심으로 설명하는지 달라집니다.
========================================================= */

const layoutTypes: RegionContent["layoutType"][] =
  [
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
   TITLE 패턴
========================================================= */

const titlePatterns = [
  (r: string) =>
    `${r} 철거업체 | 상가 매장 원상복구 안내`,

  (r: string) =>
    `${r} 철거업체 | 폐업철거 작업범위 확인`,

  (r: string) =>
    `${r} 상가철거 | 원상복구 철거업체 안내`,

  (r: string) =>
    `${r} 철거업체 | 사무실 점포 철거 준비`,

  (r: string) =>
    `${r} 매장철거 | 폐업 후 원상복구 안내`,

  (r: string) =>
    `${r} 철거업체 | 가게 점포 철거 작업범위`,

  (r: string) =>
    `${r} 폐업철거 | 상가 매장 원상복구`,

  (r: string) =>
    `${r} 철거업체 | 현장 철거 범위와 견적`,
];

/* =========================================================
   기본 Description

   실제 Metadata에서는 page.tsx가
   부모지역 + 현재지역을 활용한 Description을
   한 번 더 생성합니다.

   이 값은 콘텐츠 데이터/확장용으로 유지합니다.
========================================================= */

const descriptionPatterns = [
  (location: string) =>
    `${location} 철거를 준비할 때 확인해야 할 상가·매장·사무실 철거와 폐업 후 원상복구 범위를 안내합니다. 현장 확인 후 무료 방문견적 상담이 가능합니다.`,

  (location: string) =>
    `${location} 철거업체를 알아보고 있다면 점포·가게·상가의 기존 시설물과 원상복구 조건을 확인해보세요. 현장별 작업 범위를 확인하고 무료 방문견적을 안내합니다.`,

  (location: string) =>
    `${location} 폐업철거와 매장 원상복구를 준비하는 분들을 위해 내부 인테리어와 시설물 철거 범위, 현장 확인사항을 안내합니다.`,

  (location: string) =>
    `${location} 상가철거와 사무실철거 전 확인해야 할 계약 조건과 시설물 범위를 살펴보고 현장에 필요한 원상복구 작업을 안내합니다.`,

  (location: string) =>
    `${location} 매장·점포·가게 철거를 계획할 때 확인할 작업 순서와 원상복구 범위를 안내합니다. 현장 무료 방문견적 상담이 가능합니다.`,
];

/* =========================================================
   GUIDE TYPE
   종합 안내형
========================================================= */

function createGuideContent(
  region: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  const intros = [
    [
      `${region}에서 철거를 준비하고 있다면 먼저 공간을 비우는 일과 실제 철거 작업을 구분해서 살펴볼 필요가 있습니다.`,
      `상가나 매장은 집기 반출 이후에도 벽체와 바닥, 천장, 조명처럼 영업을 위해 추가한 시설이 남을 수 있습니다.`,
      `어디까지 제거하고 어떤 시설을 유지할지는 임대차 반환 조건과 현재 현장을 함께 확인한 뒤 정하는 것이 좋습니다.`,
    ],

    [
      `${region} 철거 현장은 면적이 비슷해도 기존 인테리어와 시설물 구성에 따라 필요한 작업이 달라질 수 있습니다.`,
      `점포와 가게는 업종에 따라 철거 대상이 달라지고 사무실은 파티션이나 전기·통신 설비 확인이 중요할 수 있습니다.`,
      `작업을 시작하기 전 현장을 살펴보면서 철거 대상과 원상복구 구간을 나누면 전체 과정을 정리하기 수월합니다.`,
    ],
  ];

  const sectionSets: ContentSection[][] = [
    [
      {
        label: "작업 범위",
        heading:
          "철거 대상과 남겨야 할 시설을 먼저 구분",
        paragraphs: [
          "내부에 있는 모든 시설이 반드시 철거 대상이 되는 것은 아닙니다. 건물 기본 시설과 임차인이 추가한 인테리어를 구분하는 과정이 먼저 필요합니다.",
          "천장과 바닥, 벽체, 조명, 간판처럼 현재 공간에 설치된 시설을 살펴보고 반환 조건에 맞춰 작업 범위를 정리합니다.",
        ],
      },

      {
        label: "상가와 매장",
        heading:
          "영업 공간은 업종에 따라 철거 방식이 달라집니다",
        paragraphs: [
          "판매 매장은 진열 구조물과 카운터가 중심일 수 있고 음식점이나 카페는 주방시설과 급배수, 배기 관련 시설까지 확인해야 할 수 있습니다.",
          "기존 인테리어가 어떤 방식으로 설치되어 있는지를 확인하면 작업 순서와 철거 범위를 정하는 데 도움이 됩니다.",
        ],
      },

      {
        label: "사무실",
        heading:
          "사무실 이전과 원상복구 일정을 함께 확인",
        paragraphs: [
          "사무실은 집기 이동뿐 아니라 파티션, 회의실 벽체, 바닥 마감, 전기 및 통신 설비가 함께 설치된 경우가 있습니다.",
          "이전 일정과 철거 일정을 함께 조율하고 건물에 남겨야 할 시설을 구분한 뒤 작업하는 것이 좋습니다.",
        ],
      },

      {
        label: "원상복구",
        heading:
          "철거 후 공간을 어떤 상태로 반환할지 확인",
        paragraphs: [
          "원상복구는 현재 시설물을 제거하는 것만 의미하지 않을 수 있습니다. 철거 이후 바닥이나 벽면, 천장에 추가 마감이 필요한지도 살펴봐야 합니다.",
          "임대차 계약과 입주 당시 상태를 확인하면 필요한 복구 범위를 보다 명확하게 정리할 수 있습니다.",
        ],
      },
    ],

    [
      {
        label: "현장 확인",
        heading:
          "공간의 현재 상태부터 확인하는 이유",
        paragraphs: [
          "철거 견적이나 작업 계획을 정하기 전에 현재 공간에 어떤 시설이 설치되어 있는지 확인해야 합니다.",
          "사진만으로 확인하기 어려운 고정 방식이나 설비 연결 상태도 있어 실제 현장을 살펴보는 과정이 중요할 수 있습니다.",
        ],
      },

      {
        label: "폐업 준비",
        heading:
          "폐업 일정과 공간 반환 일정을 함께 정리",
        paragraphs: [
          "영업 종료일과 임대차 계약 종료일 사이에 집기 반출, 내부 철거, 폐기물 정리, 원상복구가 이어질 수 있습니다.",
          "작업 가능한 기간을 먼저 확인하면 폐업 이후 일정이 지나치게 촉박해지는 상황을 줄일 수 있습니다.",
        ],
      },

      {
        label: "점포 정리",
        heading:
          "점포와 가게는 고정 시설부터 확인",
        paragraphs: [
          "이동 가능한 물품은 먼저 분류하고 벽이나 바닥에 고정된 시설은 철거 대상으로 별도 확인하는 것이 좋습니다.",
          "재사용할 물품과 폐기할 시설을 미리 구분하면 현장 정리 과정도 보다 명확해집니다.",
        ],
      },

      {
        label: "견적",
        heading:
          "평수보다 실제 철거 대상을 확인합니다",
        paragraphs: [
          "같은 크기의 공간이라도 벽체의 수와 마감 방식, 설비 종류, 폐기물 반출 환경에 따라 작업 내용이 달라질 수 있습니다.",
          "현장 방문 시 실제 철거 대상과 작업 환경을 확인한 뒤 필요한 범위를 기준으로 상담할 수 있습니다.",
        ],
      },
    ],
  ];

  return {
    eyebrow: `${location} 철거 현장 안내`,

    h1: `${region} 철거업체 현장별 작업범위 안내`,

    introHeading:
      `${region} 철거는 공간 상태부터 확인합니다`,

    intro: pick(
      intros,
      seed,
      2
    ),

    sectionEyebrow:
      "철거 범위 안내",

    sectionHeading:
      `${region} 철거에서 먼저 살펴볼 부분`,

    sectionLead:
      "상가와 매장, 사무실, 점포는 내부 시설이 서로 다르기 때문에 실제 현장을 기준으로 철거 범위를 구분하는 것이 중요합니다.",

    sections: pick(
      sectionSets,
      seed,
      4
    ),

    highlightHeading:
      "현장 확인 전에 준비하면 좋은 내용",

    highlights: [
      {
        title: "계약 조건",
        text:
          "임대차 종료 시 공간을 어느 상태로 반환해야 하는지 확인합니다.",
      },
      {
        title: "철거 대상",
        text:
          "직접 설치한 인테리어와 건물 기본 시설을 구분합니다.",
      },
      {
        title: "작업 일정",
        text:
          "영업 종료일과 공간 반환일 사이의 작업 가능 기간을 살펴봅니다.",
      },
    ],

    closingEyebrow:
      `${region} 철거 상담`,

    closingHeading:
      "현장에 필요한 작업부터 구분해보세요",

    closing: [
      "공간마다 설치된 시설과 반환 조건이 다르기 때문에 철거 범위 역시 현장에 맞춰 확인하는 것이 좋습니다.",
      `${BRAND}는 현장 확인이 필요한 경우 ${PHONE}을 통해 무료 방문견적 상담을 안내합니다.`,
    ],
  };
}

/* =========================================================
   CLOSURE TYPE
   폐업철거 중심
========================================================= */

function createClosureContent(
  region: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  const intros = [
    [
      `${region}에서 폐업을 결정했다면 영업을 끝내는 날짜뿐 아니라 점포를 실제로 반환해야 하는 날짜까지 함께 확인하는 것이 좋습니다.`,
      "매장 안의 집기를 반출한 뒤에도 인테리어 구조물과 간판, 조명, 바닥 마감처럼 철거가 필요한 시설이 남을 수 있습니다.",
      "폐업철거와 원상복구를 한 번에 계획하면 어떤 작업을 먼저 진행해야 하는지 정리하기 수월합니다.",
    ],

    [
      `${region} 매장이나 가게의 영업을 종료할 때는 폐업 신고와 별개로 임차 공간을 정리하는 과정이 남습니다.`,
      "집기 정리와 내부 철거, 폐기물 반출, 원상복구가 서로 연결되기 때문에 반환 일정에서 거꾸로 작업 순서를 정하는 방법도 도움이 됩니다.",
      "특히 임대인이 요구하는 복구 범위를 미리 확인하면 철거가 끝난 뒤 추가 작업이 발생하는 상황을 줄일 수 있습니다.",
    ],
  ];

  const sections: ContentSection[] = [
    {
      label: "폐업 일정",
      heading:
        "영업 종료일보다 공간 반환일을 함께 확인",
      paragraphs: [
        "폐업철거를 준비할 때는 마지막 영업일 이후 실제로 철거에 사용할 수 있는 기간을 확인해야 합니다.",
        "집기와 상품을 반출하는 날짜, 내부 철거가 가능한 날짜, 건물에 공간을 반환해야 하는 날짜를 나누어 정리하면 일정 계획이 수월합니다.",
      ],
    },

    {
      label: "매장 정리",
      heading:
        "이동할 물품과 철거할 시설을 먼저 나눕니다",
      paragraphs: [
        "재사용할 집기나 장비가 있다면 철거가 시작되기 전에 먼저 반출하는 편이 좋습니다.",
        "그 다음 벽체와 진열 구조물, 카운터, 조명처럼 고정된 인테리어 시설을 확인해 철거 대상을 정리할 수 있습니다.",
      ],
    },

    {
      label: "점포철거",
      heading:
        "점포의 기존 인테리어를 확인해야 하는 이유",
      paragraphs: [
        "같은 점포라도 이전 업종과 현재 업종에 따라 바닥과 천장, 벽체의 변경 정도가 다를 수 있습니다.",
        "추가 시공된 부분과 건물 기본 시설을 구분하면 제거할 시설과 유지할 시설을 판단하는 데 도움이 됩니다.",
      ],
    },

    {
      label: "원상복구",
      heading:
        "폐업 후 반환 상태까지 고려합니다",
      paragraphs: [
        "철거가 완료되었다고 해서 임대차 반환 준비가 모두 끝나는 것은 아닐 수 있습니다.",
        "철거 이후 벽면이나 바닥 마감이 필요한지, 전기나 천장 시설을 복구해야 하는지까지 확인해 전체 범위를 정리하는 것이 좋습니다.",
      ],
    },

    {
      label: "현장견적",
      heading:
        "폐업 현장의 작업량은 직접 확인해야 합니다",
      paragraphs: [
        "내부 시설의 양과 고정 방식, 폐기물 반출 환경에 따라 필요한 작업은 달라질 수 있습니다.",
        "현장을 확인하면서 실제 철거 대상과 원상복구 구간을 나눈 뒤 필요한 작업을 기준으로 견적을 살펴볼 수 있습니다.",
      ],
    },
  ];

  return {
    eyebrow:
      `${location} 폐업철거 안내`,

    h1:
      `${region} 폐업철거 매장과 점포 정리 안내`,

    introHeading:
      `${region} 폐업 후 공간 반환까지 함께 준비하세요`,

    intro: pick(
      intros,
      seed,
      7
    ),

    sectionEyebrow:
      "폐업부터 반환까지",

    sectionHeading:
      "영업 종료 이후 진행되는 공간 정리 과정",

    sectionLead:
      "폐업철거는 집기를 비우는 단계부터 내부 시설 철거와 원상복구까지 순서대로 살펴보는 것이 좋습니다.",

    sections,

    highlightHeading:
      "폐업철거 일정에서 놓치기 쉬운 부분",

    highlights: [
      {
        title: "집기 반출",
        text:
          "재사용하거나 이동할 물품은 내부 철거 전에 먼저 정리합니다.",
      },
      {
        title: "건물 규정",
        text:
          "작업 가능 시간과 엘리베이터 사용 등 건물 관리 기준을 확인합니다.",
      },
      {
        title: "반환 날짜",
        text:
          "철거 완료 후 원상복구까지 고려해 공간 반환일을 확인합니다.",
      },
      {
        title: "임대인 협의",
        text:
          "남겨도 되는 시설과 제거해야 할 시설이 무엇인지 미리 확인합니다.",
      },
    ],

    closingEyebrow:
      "폐업 현장 무료 방문견적",

    closingHeading:
      `${region} 폐업철거는 일정과 범위를 함께 확인합니다`,

    closing: [
      "영업이 끝난 뒤 철거를 시작하기보다 폐업 일정이 정해졌을 때 공간 반환 조건을 함께 확인하는 것이 좋습니다.",
      `${BRAND}는 ${PHONE}을 통해 상가와 매장, 점포 폐업 현장의 무료 방문견적 상담을 안내합니다.`,
    ],
  };
}

/* =========================================================
   RESTORATION TYPE
   원상복구 중심
========================================================= */

function createRestorationContent(
  region: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  const sections: ContentSection[] = [
    {
      label: "반환 기준",
      heading:
        "원상복구는 입주 전 상태와 계약 내용을 확인",
      paragraphs: [
        "원상복구 범위는 모든 공간에 동일하게 적용되는 것이 아니라 임차 당시 상태와 계약 조건에 따라 달라질 수 있습니다.",
        "입주하면서 새로 설치한 벽체와 바닥, 천장, 조명 등의 시설을 확인하고 어느 부분까지 복구해야 하는지 살펴보는 것이 우선입니다.",
      ],
    },

    {
      label: "철거 구간",
      heading:
        "철거할 곳과 그대로 둘 곳을 구분합니다",
      paragraphs: [
        "건물 기본 시설을 임의로 제거하지 않도록 임차인이 설치한 시설과 기존 시설을 구분해야 합니다.",
        "다음 임차인이 사용할 수 있도록 남겨두기로 협의한 시설이 있다면 해당 부분도 작업 대상에서 제외할 수 있습니다.",
      ],
    },

    {
      label: "마감 작업",
      heading:
        "철거 이후 필요한 마감까지 확인",
      paragraphs: [
        "벽체나 바닥재를 제거한 자리에는 추가적인 마감이 필요할 수 있습니다.",
        "철거와 복구를 따로 계획하기보다 처음부터 반환 상태를 기준으로 필요한 공정을 확인하면 작업이 반복되는 상황을 줄일 수 있습니다.",
      ],
    },

    {
      label: "상가와 사무실",
      heading:
        "공간 용도에 따라 복구 항목이 달라질 수 있습니다",
      paragraphs: [
        "상가는 영업용 인테리어가 많이 추가되어 있을 수 있고 사무실은 파티션이나 통신, 전기 설비 변경이 많을 수 있습니다.",
        "현재 사용 용도와 기존 시설을 함께 살펴보면서 필요한 원상복구 범위를 구체적으로 정리합니다.",
      ],
    },
  ];

  return {
    eyebrow:
      `${location} 원상복구 안내`,

    h1:
      `${region} 철거업체 원상복구 범위 확인`,

    introHeading:
      "철거보다 먼저 반환 기준을 확인해야 합니다",

    intro: [
      `${region}에서 임대차 계약 종료를 앞두고 있다면 내부 시설을 바로 철거하기 전에 원상복구 범위를 먼저 확인하는 편이 좋습니다.`,
      "원상복구는 공간을 무조건 비우는 것이 아니라 임대차 계약에서 정한 상태로 반환하는 과정과 연결됩니다.",
      "철거해야 하는 시설과 남겨야 하는 기본 시설을 구분하면 불필요한 철거와 재시공을 줄이는 데 도움이 됩니다.",
    ],

    sectionEyebrow:
      "원상복구 기준",

    sectionHeading:
      `${region} 공간 반환 전에 확인할 핵심 내용`,

    sectionLead:
      "입주 당시 상태와 현재 공간의 차이를 확인하면서 철거 대상과 복구가 필요한 부분을 구분합니다.",

    sections,

    highlightHeading:
      "원상복구 전 확인자료",

    highlights: [
      {
        title: "임대차 계약서",
        text:
          "원상복구와 공간 반환에 관한 조건이 있는지 살펴봅니다.",
      },
      {
        title: "입주 당시 사진",
        text:
          "기존 시설과 추가 설치한 인테리어를 구분하는 데 도움이 됩니다.",
      },
      {
        title: "임대인 협의내용",
        text:
          "유지하거나 철거하기로 한 시설이 있다면 작업 전에 다시 확인합니다.",
      },
    ],

    closingEyebrow:
      `${region} 원상복구 상담`,

    closingHeading:
      "철거와 복구 범위를 처음부터 함께 살펴봅니다",

    closing: [
      "철거 이후 추가 복구가 필요한 상황을 줄이려면 작업 전에 공간 반환 기준을 확인하는 것이 중요합니다.",
      `${BRAND} 무료 방문견적 상담은 ${PHONE}으로 문의할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   COMMERCIAL TYPE
   상가·매장 중심
========================================================= */

function createCommercialContent(
  region: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  const sections: ContentSection[] = [
    {
      label: "상가철거",
      heading:
        "상가 인테리어는 업종별로 구성이 다릅니다",
      paragraphs: [
        "카페와 음식점은 주방이나 급배수 시설이 있을 수 있고 판매점은 진열 구조물과 카운터, 조명 시설의 비중이 높을 수 있습니다.",
        "공간을 어떤 업종으로 사용했는지 살펴보면 철거해야 할 시설과 작업 순서를 파악하기 쉬워집니다.",
      ],
    },

    {
      label: "매장철거",
      heading:
        "매장 집기 반출과 내부 철거를 구분",
      paragraphs: [
        "이동할 수 있는 진열대나 장비는 먼저 반출하고 벽이나 바닥에 고정된 시설은 별도의 철거 대상으로 확인합니다.",
        "재사용할 시설을 미리 구분하면 내부 철거 과정에서 필요한 물품이 함께 폐기되는 상황을 예방할 수 있습니다.",
      ],
    },

    {
      label: "점포철거",
      heading:
        "점포 반환 조건에 맞춰 작업범위를 결정",
      paragraphs: [
        "임대차 계약이 종료되는 점포는 현재 상태가 아니라 반환해야 할 상태를 기준으로 철거 범위를 확인하는 것이 좋습니다.",
        "벽체와 천장, 바닥, 간판 등 영업을 위해 추가한 시설을 확인하면서 유지할 부분과 제거할 부분을 나눕니다.",
      ],
    },

    {
      label: "가게철거",
      heading:
        "가게 내부 설비까지 함께 살펴봅니다",
      paragraphs: [
        "내부 인테리어뿐 아니라 전기나 급배수, 환기처럼 업종에 따라 추가된 설비가 있는지도 확인할 필요가 있습니다.",
        "설비의 위치와 연결 상태를 확인한 뒤 해체 순서를 정하면 다른 시설에 영향을 줄 가능성을 줄일 수 있습니다.",
      ],
    },

    {
      label: "현장 확인",
      heading:
        "상가 철거비용은 공간 크기만으로 정하기 어렵습니다",
      paragraphs: [
        "평수가 같더라도 인테리어 구조와 폐기물 양, 작업 동선에 따라 실제 필요한 작업은 달라질 수 있습니다.",
        "현장 방문을 통해 철거 대상과 반출 환경을 확인한 뒤 필요한 작업을 기준으로 견적을 살펴볼 수 있습니다.",
      ],
    },
  ];

  return {
    eyebrow:
      `${location} 상가 매장 철거`,

    h1:
      `${region} 상가철거 매장 원상복구 현장 안내`,

    introHeading:
      "영업 공간은 기존 인테리어부터 살펴봅니다",

    intro: [
      `${region}에서 상가나 매장을 정리할 때는 공간 안에 설치된 영업용 시설을 먼저 확인하는 것이 좋습니다.`,
      "간판과 진열 구조물, 카운터, 벽면 마감, 조명처럼 업종에 맞춰 추가한 시설은 폐업 후 철거 대상이 될 수 있습니다.",
      "임대차 반환 조건과 현장 상태를 함께 확인하면 상가철거와 원상복구 범위를 보다 구체적으로 나눌 수 있습니다.",
    ],

    sectionEyebrow:
      "상업공간 철거",

    sectionHeading:
      `${region} 상가와 매장의 공간별 확인사항`,

    sectionLead:
      "상업공간은 업종에 따라 시설 구성이 크게 달라질 수 있어 현장의 사용 형태를 기준으로 작업 범위를 살펴봅니다.",

    sections,

    highlightHeading:
      "상가철거에서 확인할 시설",

    highlights: [
      {
        title: "간판과 외부시설",
        text:
          "건물 외부에 설치한 시설의 철거 여부를 확인합니다.",
      },
      {
        title: "바닥과 천장",
        text:
          "입주 후 변경한 마감재가 있는지 살펴봅니다.",
      },
      {
        title: "영업 설비",
        text:
          "주방이나 급배수, 전기 등 업종별 설비를 확인합니다.",
      },
      {
        title: "진열 구조물",
        text:
          "벽이나 바닥에 고정된 구조물과 이동식 집기를 구분합니다.",
      },
    ],

    closingEyebrow:
      `${region} 상가철거 상담`,

    closingHeading:
      "업종과 현장 구조에 맞춰 작업 범위를 확인합니다",

    closing: [
      "상가와 매장은 같은 면적이라도 내부 시설과 기존 인테리어에 따라 철거 내용이 달라질 수 있습니다.",
      `${BRAND}는 ${PHONE}을 통해 상가·매장·점포·가게 철거 무료 방문견적 상담을 안내합니다.`,
    ],
  };
}

/* =========================================================
   OFFICE TYPE
   사무실 중심
========================================================= */

function createOfficeContent(
  region: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  const sections: ContentSection[] = [
    {
      label: "이전 준비",
      heading:
        "사무실 이전 일정과 철거 일정을 분리해서 확인",
      paragraphs: [
        "업무 종료와 집기 이동이 끝난 뒤 철거를 시작할 수 있도록 이전 일정을 먼저 확인하는 것이 좋습니다.",
        "통신 장비나 중요 물품이 남아 있는 상태에서 철거가 시작되지 않도록 공간을 비우는 순서를 정리합니다.",
      ],
    },

    {
      label: "파티션",
      heading:
        "회의실과 업무공간의 벽체 구조 확인",
      paragraphs: [
        "사무실 내부에는 파티션뿐 아니라 회의실을 만들기 위한 고정 벽체가 설치되어 있을 수 있습니다.",
        "철거 대상 벽체와 건물 기본 벽체를 구분하고 바닥이나 천장과 연결된 상태도 함께 살펴봅니다.",
      ],
    },

    {
      label: "전기·통신",
      heading:
        "배선과 통신시설은 다른 공정과 함께 확인",
      paragraphs: [
        "업무공간에는 추가 콘센트나 통신선, 조명 등이 설치되어 있는 경우가 많습니다.",
        "어떤 설비를 제거하고 건물 기본 시설을 어디까지 유지할지 확인한 뒤 내부 철거 순서를 정하는 것이 좋습니다.",
      ],
    },

    {
      label: "원상복구",
      heading:
        "입주하면서 변경한 부분을 중심으로 복구범위 확인",
      paragraphs: [
        "바닥재와 벽면, 천장, 조명처럼 사무실 입주 후 변경한 부분이 있다면 반환 시 복구가 필요한지 살펴봅니다.",
        "계약 조건과 건물 관리 기준을 확인하면 철거와 원상복구 작업을 구체적으로 구분할 수 있습니다.",
      ],
    },
  ];

  return {
    eyebrow:
      `${location} 사무실철거 안내`,

    h1:
      `${region} 사무실철거 이전과 원상복구 준비`,

    introHeading:
      "사무실은 이전 일정부터 정리해야 합니다",

    intro: [
      `${region}에서 사무실 이전을 준비한다면 내부 철거만 따로 계획하기보다 집기 이동과 통신 장비 이전 일정을 함께 살펴보는 것이 좋습니다.`,
      "업무공간에는 파티션과 회의실 벽체, 바닥 마감, 조명, 전기와 통신 설비처럼 여러 시설이 연결되어 있을 수 있습니다.",
      "남겨야 하는 건물 시설과 철거할 인테리어를 구분하면 원상복구 범위를 정리하기 수월합니다.",
    ],

    sectionEyebrow:
      "사무공간 정리",

    sectionHeading:
      `${region} 사무실 이전부터 반환까지 확인할 내용`,

    sectionLead:
      "사무실철거는 업무 종료와 집기 이동, 내부 시설 철거, 원상복구가 이어지는 일정으로 계획할 수 있습니다.",

    sections,

    highlightHeading:
      "사무실철거 체크포인트",

    highlights: [
      {
        title: "집기 이동",
        text:
          "책상과 장비 등 이동할 물품을 철거 전에 반출합니다.",
      },
      {
        title: "통신 장비",
        text:
          "인터넷과 전화 등 이전이 필요한 장비를 먼저 확인합니다.",
      },
      {
        title: "파티션",
        text:
          "이동식과 고정식 구조물을 구분해 철거 대상을 살펴봅니다.",
      },
    ],

    closingEyebrow:
      `${region} 사무실철거 상담`,

    closingHeading:
      "업무 이전과 공간 반환을 함께 계획하세요",

    closing: [
      "사무실은 여러 시설이 연결되어 있어 철거 순서를 미리 정하는 것이 중요합니다.",
      `${BRAND} 무료 방문견적 상담은 ${PHONE}으로 문의할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   PROCESS TYPE
   작업 과정 중심
========================================================= */

function createProcessContent(
  region: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  const sections: ContentSection[] = [
    {
      label: "첫 단계",
      heading:
        "현장 상태와 계약 조건을 확인합니다",
      paragraphs: [
        "철거를 시작하기 전에 공간의 현재 상태와 임대차 반환 조건을 먼저 살펴봅니다.",
        "어떤 시설이 임차인이 설치한 것인지 확인하면서 철거 대상과 유지할 부분을 구분합니다.",
      ],
    },

    {
      label: "두 번째",
      heading:
        "이동할 집기와 철거 시설을 분리합니다",
      paragraphs: [
        "재사용하거나 다른 장소로 옮길 물품은 철거가 시작되기 전에 반출하는 것이 좋습니다.",
        "이후 고정된 인테리어와 설비를 중심으로 실제 철거 대상을 정리합니다.",
      ],
    },

    {
      label: "세 번째",
      heading:
        "내부 인테리어를 작업 순서에 맞춰 정리",
      paragraphs: [
        "천장과 벽체, 바닥, 고정 구조물 등이 서로 연결되어 있다면 현장 구조에 맞춰 해체 순서를 정합니다.",
        "다른 시설에 영향을 주지 않도록 유지해야 하는 설비의 위치도 함께 확인합니다.",
      ],
    },

    {
      label: "마무리",
      heading:
        "철거 이후 원상복구가 필요한 부분을 확인",
      paragraphs: [
        "시설을 제거한 뒤 바닥이나 벽면에 추가 마감이 필요한지 살펴봅니다.",
        "공간 반환 조건에 맞춰 필요한 복구 작업까지 확인하면 철거 이후 추가 공정을 줄이는 데 도움이 됩니다.",
      ],
    },
  ];

  return {
    eyebrow:
      `${location} 철거 진행 과정`,

    h1:
      `${region} 철거업체 현장 작업 순서 안내`,

    introHeading:
      "철거는 무엇부터 제거할지 순서를 정하는 작업입니다",

    intro: [
      `${region} 철거 현장에서는 내부 시설을 한 번에 제거하기보다 공간을 비우는 단계부터 원상복구까지 순서를 나눠 준비하는 것이 좋습니다.`,
      "집기 반출과 고정 시설 해체가 섞이면 작업 중 필요한 물품이 함께 정리될 수 있고 유지해야 할 시설에 영향을 줄 수도 있습니다.",
      "현장 구조를 확인한 뒤 단계별로 작업 대상을 구분하면 전체 철거 과정을 보다 명확하게 계획할 수 있습니다.",
    ],

    sectionEyebrow:
      "작업 순서",

    sectionHeading:
      `${region} 철거 현장의 진행 흐름`,

    sectionLead:
      "실제 작업 내용은 현장마다 달라질 수 있지만 철거 전 확인부터 공간 반환까지 필요한 항목을 순서대로 살펴볼 수 있습니다.",

    sections,

    highlightHeading:
      "작업 전에 확인할 환경",

    highlights: [
      {
        title: "출입 동선",
        text:
          "폐기물과 시설물을 외부로 이동할 경로를 확인합니다.",
      },
      {
        title: "작업 시간",
        text:
          "건물에서 정한 철거 가능 시간이나 요일이 있는지 살펴봅니다.",
      },
      {
        title: "차량 접근",
        text:
          "반출 차량이 현장 가까이 접근할 수 있는지 확인합니다.",
      },
      {
        title: "공용시설",
        text:
          "엘리베이터와 복도 등 공용공간 사용 기준을 확인합니다.",
      },
    ],

    closingEyebrow:
      "현장 작업 상담",

    closingHeading:
      "철거 순서는 현장 구조에 맞춰 정합니다",

    closing: [
      "상가와 매장, 사무실, 점포는 각각 시설 구성이 다르기 때문에 작업 순서 역시 달라질 수 있습니다.",
      `${BRAND}는 ${PHONE}을 통해 현장 무료 방문견적 상담을 안내합니다.`,
    ],
  };
}

/* =========================================================
   CONTRACT TYPE
   임대차 계약·반환 중심
========================================================= */

function createContractContent(
  region: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  const sections: ContentSection[] = [
    {
      label: "계약 확인",
      heading:
        "철거 전에 임대차 반환 조건부터 살펴봅니다",
      paragraphs: [
        "계약서에 원상복구 관련 내용이 있다면 내부 시설을 철거하기 전에 해당 조건을 먼저 확인하는 것이 좋습니다.",
        "입주 당시 공간 상태와 현재 모습의 차이를 확인하면 어떤 부분이 임차인이 추가한 시설인지 판단하는 데 도움이 됩니다.",
      ],
    },

    {
      label: "협의사항",
      heading:
        "임대인과 남길 시설을 미리 확인",
      paragraphs: [
        "현재 설치된 시설 가운데 그대로 사용하기로 협의한 부분이 있다면 반드시 모두 철거할 필요는 없을 수 있습니다.",
        "반대로 제거해야 하는 시설이 남으면 공간 반환 이후 추가 작업이 필요할 수 있으므로 작업 전 협의가 중요합니다.",
      ],
    },

    {
      label: "철거범위",
      heading:
        "상가와 점포의 추가 인테리어를 구분",
      paragraphs: [
        "벽체와 바닥, 천장, 조명, 간판처럼 영업을 위해 추가한 시설을 중심으로 철거 여부를 살펴봅니다.",
        "건물 기본 시설과 임차 시설이 연결된 부분은 현장을 확인하면서 작업 범위를 구체적으로 나누는 것이 좋습니다.",
      ],
    },

    {
      label: "반환 준비",
      heading:
        "철거 완료가 아니라 공간 반환을 기준으로 계획",
      paragraphs: [
        "시설물을 모두 제거한 이후에도 바닥이나 벽면 마감처럼 추가적인 원상복구가 필요할 수 있습니다.",
        "계약 종료일까지 필요한 공정을 마칠 수 있도록 철거와 복구 일정을 함께 확인합니다.",
      ],
    },
  ];

  return {
    eyebrow:
      `${location} 임대차 종료 철거`,

    h1:
      `${region} 철거업체 계약 종료 원상복구 안내`,

    introHeading:
      "철거 범위는 계약 당시 조건에서 시작합니다",

    intro: [
      `${region} 상가나 점포의 임대차 계약이 끝나갈 때는 현재 공간을 무조건 비우기보다 어떤 상태로 반환해야 하는지를 먼저 확인하는 것이 좋습니다.`,
      "임차인이 추가한 인테리어와 건물의 기본 시설을 구분하지 않고 철거하면 다시 복구해야 하는 상황이 생길 수 있습니다.",
      "계약 내용과 임대인 협의사항을 확인한 뒤 실제 현장에서 철거 대상과 원상복구 구간을 나눠볼 수 있습니다.",
    ],

    sectionEyebrow:
      "계약 종료 준비",

    sectionHeading:
      `${region} 임대차 종료 전 확인해야 할 철거 범위`,

    sectionLead:
      "철거 자체보다 공간을 어떤 상태로 반환해야 하는지를 먼저 확인하면 필요한 작업을 정리하기 쉽습니다.",

    sections,

    highlightHeading:
      "계약 종료 전에 챙길 자료",

    highlights: [
      {
        title: "계약서",
        text:
          "원상복구와 시설물 반환 관련 조항을 확인합니다.",
      },
      {
        title: "기존 사진",
        text:
          "입주 당시 공간 상태를 확인할 수 있는 자료를 살펴봅니다.",
      },
      {
        title: "협의 기록",
        text:
          "임대인과 유지하기로 한 시설이 있는지 확인합니다.",
      },
    ],

    closingEyebrow:
      "공간 반환 상담",

    closingHeading:
      "계약 종료일에 맞춰 철거와 복구를 준비합니다",

    closing: [
      "철거 범위가 명확하지 않다면 작업 전에 반환 조건을 다시 확인하는 것이 좋습니다.",
      `${BRAND}는 ${PHONE}으로 무료 방문견적 상담을 안내합니다.`,
    ],
  };
}

/* =========================================================
   FIELD TYPE
   현장조건·견적 중심
========================================================= */

function createFieldContent(
  region: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  const sections: ContentSection[] = [
    {
      label: "공간 구조",
      heading:
        "같은 평수라도 내부 구조에 따라 작업이 달라집니다",
      paragraphs: [
        "벽체가 많은 공간과 개방된 공간은 해체해야 하는 시설의 양부터 차이가 날 수 있습니다.",
        "천장과 바닥의 마감 방식이나 고정 시설의 수를 함께 확인해야 실제 작업량을 파악할 수 있습니다.",
      ],
    },

    {
      label: "폐기물",
      heading:
        "철거 대상의 종류와 양을 확인합니다",
      paragraphs: [
        "목재와 금속, 석고보드 등 현장에서 발생하는 철거물은 기존 인테리어 구성에 따라 달라질 수 있습니다.",
        "내부 시설의 종류와 양을 확인하면 반출에 필요한 작업도 함께 살펴볼 수 있습니다.",
      ],
    },

    {
      label: "반출환경",
      heading:
        "계단과 엘리베이터 등 이동 동선을 살펴봅니다",
      paragraphs: [
        "철거한 시설물을 외부로 이동할 때 사용할 수 있는 동선은 현장 작업에 영향을 줄 수 있습니다.",
        "엘리베이터 사용 가능 여부와 계단, 출입구, 차량 접근 위치 등을 미리 확인하는 것이 좋습니다.",
      ],
    },

    {
      label: "작업조건",
      heading:
        "건물의 작업 가능 시간도 확인 대상입니다",
      paragraphs: [
        "상가건물이나 업무시설은 관리 규정에 따라 철거 가능 시간이 정해져 있을 수 있습니다.",
        "소음이 발생하는 작업이나 공용공간 사용에 별도 기준이 있다면 일정 계획 전에 확인할 필요가 있습니다.",
      ],
    },

    {
      label: "원상복구",
      heading:
        "철거 이후 필요한 복구 작업까지 함께 확인",
      paragraphs: [
        "시설물을 제거한 자리에 추가 마감이 필요한 경우 철거만으로 작업이 끝나지 않을 수 있습니다.",
        "현장 확인 단계에서 원상복구 범위를 함께 살펴보면 전체 작업 내용을 보다 정확하게 정리할 수 있습니다.",
      ],
    },
  ];

  return {
    eyebrow:
      `${location} 철거 현장견적`,

    h1:
      `${region} 철거업체 현장 조건과 견적 안내`,

    introHeading:
      "철거 견적은 평수 하나로 판단하기 어렵습니다",

    intro: [
      `${region}에서 철거 견적을 알아볼 때 공간의 크기만 비교하면 실제 현장의 작업 조건을 충분히 반영하기 어렵습니다.`,
      "내부 구조와 인테리어 시설의 양, 폐기물 반출 동선, 건물의 작업 규정처럼 현장에서 확인해야 하는 요소가 있기 때문입니다.",
      "무료 방문견적에서는 실제 철거 대상과 원상복구 범위를 확인하면서 필요한 작업을 구체적으로 살펴볼 수 있습니다.",
    ],

    sectionEyebrow:
      "현장 조건",

    sectionHeading:
      `${region} 철거 견적에서 확인하는 주요 요소`,

    sectionLead:
      "철거 작업량에 영향을 줄 수 있는 공간 구조와 시설물, 반출 환경 등을 실제 현장을 기준으로 살펴봅니다.",

    sections,

    highlightHeading:
      "방문견적 때 확인하면 좋은 내용",

    highlights: [
      {
        title: "철거할 시설",
        text:
          "제거할 벽체와 바닥, 천장, 집기 등을 확인합니다.",
      },
      {
        title: "유지할 시설",
        text:
          "건물 기본 시설이나 남겨야 할 설비를 구분합니다.",
      },
      {
        title: "반출 동선",
        text:
          "철거물을 외부로 이동할 수 있는 경로를 살펴봅니다.",
      },
      {
        title: "복구 범위",
        text:
          "철거 후 마감이나 원상복구가 필요한 구간을 확인합니다.",
      },
    ],

    closingEyebrow:
      `${region} 무료 방문견적`,

    closingHeading:
      "현장을 확인해야 작업 범위를 구체적으로 나눌 수 있습니다",

    closing: [
      "사진과 면적만으로 판단하기 어려운 부분은 실제 공간을 살펴보면서 확인할 수 있습니다.",
      `${BRAND} 현장 무료 방문견적 상담은 ${PHONE}으로 문의할 수 있습니다.`,
    ],
  };
}

/* =========================================================
   콘텐츠 유형 생성기
========================================================= */

function createLayoutContent(
  type: RegionContent["layoutType"],
  regionName: string,
  location: string,
  seed: number
): Omit<
  RegionContent,
  "title" | "description" | "layoutType"
> {
  switch (type) {
    case "closure":
      return createClosureContent(
        regionName,
        location,
        seed
      );

    case "restoration":
      return createRestorationContent(
        regionName,
        location,
        seed
      );

    case "commercial":
      return createCommercialContent(
        regionName,
        location,
        seed
      );

    case "office":
      return createOfficeContent(
        regionName,
        location,
        seed
      );

    case "process":
      return createProcessContent(
        regionName,
        location,
        seed
      );

    case "contract":
      return createContractContent(
        regionName,
        location,
        seed
      );

    case "field":
      return createFieldContent(
        regionName,
        location,
        seed
      );

    case "guide":
    default:
      return createGuideContent(
        regionName,
        location,
        seed
      );
  }
}

/* =========================================================
   최종 콘텐츠 생성

   page.tsx에서는 이 함수 하나만 사용하면 됩니다.
========================================================= */

export function createRegionContent({
  regionName,
  parentName,
  path,
}: ContentInput): RegionContent {
  const seed = hashString(path);

  const location =
    createLocationLabel(
      regionName,
      parentName
    );

  const layoutType = pick(
    layoutTypes,
    seed,
    1
  );

  const layoutContent =
    createLayoutContent(
      layoutType,
      regionName,
      location,
      seed
    );

  const title = pick(
    titlePatterns,
    seed,
    11
  )(regionName);

  const description = pick(
    descriptionPatterns,
    seed,
    23
  )(location);

  return {
    title,
    description,

    layoutType,

    ...layoutContent,
  };
}