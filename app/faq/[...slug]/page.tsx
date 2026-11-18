
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { regions } from "../../data/regions";

const SITE_URL = "https://demo.thesavecompany.com";
const PHONE = "010-2269-8352";
const PHONE_URL = "tel:01022698352";
const TALK_URL = "https://talk.naver.com/profile/wnse6xr";

type RegionItem = {
  name: string;
  path: string;
  children?: RegionItem[];
};

type FAQ = {
  category: string;
  question: string;
  answer: string;
  checklist: string;
};

type Props = {
  params: Promise<{ slug: string[] }>;
};

function flattenRegions(
  items: readonly RegionItem[]
): RegionItem[] {
  return items.flatMap((item) => [
    item,
    ...flattenRegions(item.children ?? []),
  ]);
}

const allRegions = flattenRegions(regions);

function normalizePath(path: string) {
  return "/" + path.split("/").filter(Boolean).join("/");
}

function findRegion(slug: string[]) {
  const path = normalizePath("/" + slug.join("/"));

  return allRegions.find(
    (region) => normalizePath(region.path) === path
  );
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

type FAQTemplate = {
  category: string;
  question: (name: string) => string;
  answer: (name: string) => string;
  checklist: string;
};

const faqTemplates: FAQTemplate[] = [
  {
    category: "견적",
    question: (r) => `${r} 철거 견적은 평수만 알면 계산할 수 있나요?`,
    answer: (r) =>
      `${r} 현장도 평수만으로 최종 철거비를 결정하기는 어렵습니다. 천장 구조, 바닥 마감재, 칸막이 수량, 전기·배관 설비, 폐기물 반출 조건에 따라 작업량이 달라집니다. 견적을 비교할 때는 같은 철거 범위와 폐기물 처리 조건을 기준으로 확인해야 합니다.`,
    checklist: "면적, 내부 사진, 철거 범위, 반출 조건",
  },
  {
    category: "원상복구",
    question: (r) => `${r} 상가에서 임대인이 요구한 원상복구를 모두 해야 하나요?`,
    answer: () =>
      "원상복구 책임은 임대차계약서, 특약, 최초 인도 상태, 임대인과의 합의 내용 등을 함께 살펴봐야 합니다. 임대인의 요구만으로 모든 공사 범위가 자동 확정되는 것은 아닙니다. 철거 전 복구 대상 목록을 작성하고 서면으로 확인하는 것이 분쟁 예방에 도움이 됩니다.",
    checklist: "임대차계약서, 특약, 입주 당시 사진, 합의 내용",
  },
  {
    category: "추가 비용",
    question: (r) => `${r} 철거업체 견적이 나중에 달라지는 이유는 무엇인가요?`,
    answer: () =>
      "현장 조사 때 확인하지 못한 이중 천장, 덧시공 바닥, 숨은 설비, 추가 폐기물 등이 발견되면 작업 범위가 달라질 수 있습니다. 계약 전에 포함 항목과 제외 항목을 나누고, 추가 작업은 사전 설명과 동의를 거치도록 협의하는 것이 좋습니다.",
    checklist: "포함·제외 항목, 추가 공사 승인 방식",
  },
  {
    category: "폐업",
    question: (r) => `${r} 매장 폐업일과 철거 시작일은 어떻게 정해야 하나요?`,
    answer: () =>
      "영업 종료, 집기 반출, 철거, 청소, 임대인 확인, 공간 인도까지 필요한 일정을 역산해야 합니다. 임대차 종료일 직전에 철거를 시작하면 예상치 못한 작업 지연에 대응하기 어려울 수 있습니다. 관리사무소의 작업 가능 시간도 미리 확인하세요.",
    checklist: "영업 종료일, 임대차 종료일, 현장 인도일",
  },
  {
    category: "건물 관리",
    question: (r) => `${r} 건물에서 주말이나 야간 철거를 제한하면 어떻게 하나요?`,
    answer: (r) =>
      `${r}의 실제 작업 가능 시간은 건물 관리규정과 현장 조건을 확인해야 합니다. 소음이 큰 작업과 자재 반출 시간을 분리하거나 관리주체와 일정을 조율하는 방법을 검토할 수 있습니다. 야간 작업이 언제나 허용되는 것은 아닙니다.`,
    checklist: "관리사무소 연락처, 작업 허용 시간, 반출 규정",
  },
  {
    category: "폐기물",
    question: (r) => `${r} 철거할 때 발생한 폐기물은 누가 처리하나요?`,
    answer: () =>
      "철거 계약에 폐기물 분류, 운반, 처리 비용이 포함되어 있는지 확인해야 합니다. 재활용 가능한 집기와 철거 폐기물을 구분하고, 처리 방법과 관련 증빙이 필요한지도 사전에 협의하는 것이 좋습니다.",
    checklist: "폐기물 처리 포함 여부, 집기 분리, 증빙",
  },
  {
    category: "비용 절감",
    question: (r) => `${r} 철거 비용을 줄이려면 무엇부터 정리해야 하나요?`,
    answer: () =>
      "재사용할 집기, 중고 판매 가능한 설비, 반드시 철거해야 하는 시설을 먼저 구분하는 것이 좋습니다. 다만 고객이 직접 해체하기 어려운 전기·설비나 위험 작업은 전문적인 검토가 필요합니다. 불필요한 중복 작업을 줄이는 것이 중요합니다.",
    checklist: "보존 집기, 매각 대상, 철거 대상 목록",
  },
  {
    category: "지원금",
    question: (r) => `${r} 폐업철거 지원금은 누구나 받을 수 있나요?`,
    answer: () =>
      "점포철거비 지원은 사업 공고에서 정한 신청 자격, 폐업 시점, 임대차 관계, 증빙서류 등에 따라 달라집니다. 모든 폐업 사업자가 자동으로 지원받는 것은 아닙니다. 철거 일정 확정 전에 해당 연도의 공식 공고와 신청 절차를 확인하는 것이 안전합니다.",
    checklist: "공식 모집공고, 사업자 정보, 임대차계약서",
  },
  {
    category: "보증금",
    question: (r) => `${r} 원상복구가 끝나면 보증금을 바로 받을 수 있나요?`,
    answer: () =>
      "철거 완료만으로 보증금 반환 시점이 자동 결정되지는 않습니다. 계약 종료, 목적물 인도, 미정산 금액, 원상복구 관련 협의 등이 영향을 줄 수 있습니다. 공사 전후 사진과 인수인계 기록을 남겨 두는 것이 좋습니다.",
    checklist: "인도 확인, 정산 내역, 완료 사진",
  },
  {
    category: "작업 일정",
    question: (r) => `${r} 사무실 철거는 업무 종료 후 진행할 수 있나요?`,
    answer: () =>
      "작업 가능 시간은 건물 관리규정과 주변 입주사 환경에 따라 다릅니다. 보안 출입, 엘리베이터 예약, 전기 차단, 소음 발생 공정 등을 고려하여 일정 계획을 세워야 합니다.",
    checklist: "출입 승인, 작업 시간, 전기·통신 철거 계획",
  },
  {
    category: "안전",
    question: (r) => `${r} 철거 중 옆 매장이나 공용시설이 손상되면 어떻게 하나요?`,
    answer: () =>
      "작업 전에 공용부와 인접 시설의 상태를 사진으로 기록하고 보양 범위를 정하는 것이 좋습니다. 손상 발생 시 책임과 처리 절차는 계약 내용 및 실제 발생 경위에 따라 판단해야 하므로, 작업 전 관련 사항을 명확히 협의하세요.",
    checklist: "공용부 사진, 보양 범위, 손상 대응 절차",
  },
  {
    category: "철거 범위",
    question: (r) => `${r} 기존 천장과 바닥을 남겨 두고 철거할 수 있나요?`,
    answer: () =>
      "선택 철거 가능 여부는 시설의 연결 상태, 전기·배관 배치, 구조와 계약상 복구 조건에 따라 달라집니다. 남길 시설과 제거할 시설을 도면이나 사진에 표시하여 견적 범위를 구분하면 도움이 됩니다.",
    checklist: "보존 시설 목록, 철거 경계, 도면",
  },
  {
    category: "간판",
    question: (r) => `${r} 폐업하면서 외부 간판도 반드시 철거해야 하나요?`,
    answer: () =>
      "간판 철거 여부는 임대차계약, 건물 관리규정, 간판 소유 및 설치 조건 등을 확인해야 합니다. 외벽 손상 복구와 전기 배선 마감까지 필요한지 함께 검토하는 것이 좋습니다.",
    checklist: "간판 소유 관계, 외벽 마감, 전기 차단",
  },
  {
    category: "주방",
    question: (r) => `${r} 음식점 후드와 덕트는 어디까지 철거해야 하나요?`,
    answer: () =>
      "후드, 배기 덕트, 급배수 설비, 가스 배관 등의 철거 범위는 현장 구조와 설비 소유 관계에 따라 다릅니다. 공용 설비에 연결된 부분은 임의로 해체하지 말고 관리주체 및 관련 전문업체와 확인해야 합니다.",
    checklist: "후드·덕트 연결부, 가스·급배수, 공용 설비",
  },
  {
    category: "전기",
    question: (r) => `${r} 철거 전에 전기와 통신 설비를 어떻게 정리해야 하나요?`,
    answer: () =>
      "전기 차단 범위, 분전반 유지 여부, 인터넷·전화 회선 해지 또는 이전 여부를 확인해야 합니다. 전기설비 해체는 적절한 자격과 안전조치를 갖춘 작업자가 진행해야 하며, 공용 회로를 건드리지 않도록 주의해야 합니다.",
    checklist: "분전반, 통신 회선, 전기 차단 계획",
  },
  {
    category: "관리사무소",
    question: (r) => `${r} 철거 전에 관리사무소에 무엇을 알려야 하나요?`,
    answer: () =>
      "공사 일정, 작업 인원, 소음 발생 시간, 폐기물 반출 경로, 엘리베이터 사용, 보양 계획 등을 확인하는 것이 좋습니다. 일부 건물은 공사 신청서나 보증금 등을 요구할 수 있으므로 해당 건물 규정을 먼저 확인해야 합니다.",
    checklist: "공사 신청, 반출 경로, 보양·엘리베이터",
  },
  {
    category: "엘리베이터",
    question: (r) => `${r} 고층 매장 철거는 폐기물 반출비가 더 들 수 있나요?`,
    answer: () =>
      "작업 층수, 화물용 승강기 사용 가능 여부, 계단 운반 거리, 차량 접근성에 따라 반출 인력과 시간이 달라질 수 있습니다. 견적 전에 운반 동선을 확인하면 비용 차이를 이해하기 쉽습니다.",
    checklist: "층수, 승강기 사용, 차량 접근 경로",
  },
  {
    category: "주차",
    question: (r) => `${r} 철거 차량이 건물 앞에 주차하지 못하면 어떻게 하나요?`,
    answer: () =>
      "적재 차량의 정차 가능 위치와 폐기물 운반 거리를 확인해야 합니다. 장거리 수작업 운반이나 별도 반출 장비가 필요할 수 있으며, 도로 사용이나 주차 관련 규정을 준수해야 합니다.",
    checklist: "차량 정차 위치, 운반 거리, 진입 높이",
  },
  {
    category: "소음",
    question: (r) => `${r} 주변 상가가 영업 중이어도 철거를 진행할 수 있나요?`,
    answer: () =>
      "주변 영업에 미치는 영향을 고려하여 소음이 큰 공정의 시간과 분진 차단 방법을 협의해야 합니다. 건물 규정과 현장 여건에 따라 작업 계획이 달라지므로, 공사 전에 인접 점포에 안내할 사항도 검토하는 것이 좋습니다.",
    checklist: "인접 점포, 소음 작업 시간, 분진 차단",
  },
  {
    category: "계약",
    question: (r) => `${r} 철거 계약서에서 꼭 확인해야 하는 항목은 무엇인가요?`,
    answer: () =>
      "철거 대상, 원상복구 범위, 폐기물 처리, 작업 일정, 공사대금, 추가 작업 승인 방식, 손상 발생 시 처리 절차를 확인하는 것이 중요합니다. 구두 약속은 견적서나 계약서에 반영하는 편이 안전합니다.",
    checklist: "작업 범위, 금액, 일정, 변경 승인",
  },
  {
    category: "집기",
    question: (r) => `${r} 사용하던 냉장고와 가구를 철거업체에 맡겨도 되나요?`,
    answer: () =>
      "집기의 재사용, 중고 매각, 폐기 여부를 먼저 정해야 합니다. 철거업체가 집기 매입까지 제공하는지는 별도 확인이 필요하며, 폐기 대상은 종류에 따라 적절한 처리 방법을 정해야 합니다.",
    checklist: "매각 대상, 보관 대상, 폐기 대상",
  },
  {
    category: "학원",
    question: (r) => `${r} 학원 철거에서 교실 칸막이는 어떻게 처리하나요?`,
    answer: () =>
      "교실 칸막이 재질, 방음재, 천장 연결 상태, 전기 배선 등을 함께 확인해야 합니다. 칸막이만 제거할지 바닥·천장 마감까지 복구할지는 임대차 조건에 따라 결정됩니다.",
    checklist: "칸막이 재질, 방음재, 천장·바닥 연결부",
  },
  {
    category: "병원",
    question: (r) => `${r} 병원 철거는 일반 매장과 무엇이 다른가요?`,
    answer: () =>
      "의료기기, 특수 설비, 급배수, 전기 용량, 의료폐기물 등 일반 매장과 다른 검토 사항이 있을 수 있습니다. 의료폐기물이나 특수 설비는 관련 법령과 전문 처리 절차를 별도로 확인해야 합니다.",
    checklist: "의료기기, 특수 설비, 폐기물 분류",
  },
  {
    category: "카페",
    question: (r) => `${r} 카페 바 카운터를 철거하면 바닥도 복구해야 하나요?`,
    answer: () =>
      "카운터를 철거한 자리에 배관 구멍, 바닥 마감 차이, 전기 배선 등이 남을 수 있습니다. 원상복구 범위에 바닥 보수까지 포함되는지 확인해야 하며, 현장 상태에 따라 작업 내용이 달라집니다.",
    checklist: "카운터 하부 배관, 바닥 마감, 전기 배선",
  },
  {
    category: "미용실",
    question: (r) => `${r} 미용실 샴푸대 배수 설비는 어떻게 철거하나요?`,
    answer: () =>
      "샴푸대와 연결된 급배수관의 위치를 확인하고 철거 후 마감 방식을 협의해야 합니다. 배관을 어느 지점까지 제거하거나 유지할지는 건물 설비와 복구 조건에 따라 달라집니다.",
    checklist: "샴푸대, 급배수관, 방수·바닥 마감",
  },
  {
    category: "무인매장",
    question: (r) => `${r} 무인매장 철거 시 키오스크와 CCTV는 어떻게 하나요?`,
    answer: () =>
      "키오스크, CCTV, 출입통제장치, 통신 회선의 소유 관계를 먼저 확인해야 합니다. 임대 장비는 계약에 따른 반납 절차가 필요할 수 있으며, 개인정보가 저장된 장비는 적절한 데이터 정리도 검토해야 합니다.",
    checklist: "장비 소유 관계, 임대 계약, 데이터 정리",
  },
  {
    category: "시설 인수",
    question: (r) => `${r} 다음 임차인이 시설을 그대로 쓰겠다면 철거하지 않아도 되나요?`,
    answer: () =>
      "시설 인수에 관해 임대인과 다음 임차인 사이의 합의가 필요할 수 있습니다. 기존 임차인의 원상복구 의무가 어떻게 정리되는지 서면으로 확인하고, 인수 대상 시설 목록을 남기는 것이 좋습니다.",
    checklist: "시설 인수 목록, 임대인 동의, 서면 합의",
  },
  {
    category: "사진 기록",
    question: (r) => `${r} 철거 전후 사진은 어떤 장면을 남겨야 하나요?`,
    answer: () =>
      "전체 공간, 천장·벽·바닥, 설비 연결부, 출입구와 공용부 등을 기록하는 것이 좋습니다. 지원사업 신청이나 공사 완료 확인에 필요한 사진 기준은 해당 기관 및 계약 조건에 따라 달라질 수 있습니다.",
    checklist: "전체 전경, 주요 시설, 작업 전후 비교",
  },
  {
    category: "완료 확인",
    question: (r) => `${r} 철거가 끝난 뒤 현장에서 무엇을 확인해야 하나요?`,
    answer: () =>
      "계약한 철거 대상이 제거되었는지, 남기기로 한 시설이 유지되었는지, 폐기물과 잔재물이 정리되었는지 확인해야 합니다. 원상복구 항목과 임대인 인수인계 사항도 별도로 점검하는 것이 좋습니다.",
    checklist: "계약 범위, 잔재물, 보존 시설, 인수인계",
  },
  {
    category: "공사 변경",
    question: (r) => `${r} 철거 도중 작업 범위를 변경할 수 있나요?`,
    answer: () =>
      "현장 상황에 따라 작업 범위를 변경할 수 있지만, 비용과 일정에 영향이 생길 수 있습니다. 변경 대상과 추가 금액, 작업 기간을 확인하고 합의 내용을 기록하는 것이 중요합니다.",
    checklist: "변경 항목, 추가 금액, 일정 영향",
  },
  {
    category: "세금계산서",
    question: (r) => `${r} 철거비 세금계산서는 언제 확인해야 하나요?`,
    answer: () =>
      "계약 전에 세금계산서 발행 여부와 공급가액·부가세 표시 방식을 확인하는 것이 좋습니다. 지원금 정산에 활용할 계획이라면 해당 지원사업이 요구하는 증빙 형식과 결제 요건을 함께 확인해야 합니다.",
    checklist: "사업자 정보, 세금계산서, 결제 증빙",
  },
  {
    category: "견적 비교",
    question: (r) => `${r} 철거 견적이 싼 업체를 선택해도 괜찮을까요?`,
    answer: () =>
      "총액만 비교하기보다 철거 대상, 원상복구, 폐기물 처리, 공용부 보양, 작업 일정이 모두 포함되어 있는지 확인해야 합니다. 동일한 작업 조건으로 비교해야 가격 차이를 제대로 판단할 수 있습니다.",
    checklist: "견적 항목, 제외 작업, 추가 비용 조건",
  },
  {
    category: "긴급 일정",
    question: (r) => `${r} 철거를 급하게 진행해야 할 때 우선할 일은 무엇인가요?`,
    answer: () =>
      "현장 인도 마감일, 관리사무소 작업 승인, 전기·가스 차단, 폐기물 반출 계획을 우선 확인해야 합니다. 일정이 촉박하더라도 작업 범위와 안전조치를 생략하지 않는 것이 중요합니다.",
    checklist: "인도 마감일, 승인, 설비 차단, 반출 계획",
  },
  {
    category: "상가 이전",
    question: (r) => `${r} 매장을 이전할 때 기존 인테리어를 재사용할 수 있나요?`,
    answer: () =>
      "이전 가능한 집기와 현장에 고정된 시설을 구분해야 합니다. 해체 과정에서 손상될 수 있는 자재와 재설치 비용을 고려해 재사용 여부를 판단하는 것이 좋습니다.",
    checklist: "이전 집기 목록, 해체 가능성, 운반 계획",
  },
  {
    category: "바닥",
    question: (r) => `${r} 타일이나 데코타일을 철거하면 바닥 상태는 어떻게 되나요?`,
    answer: () =>
      "마감재와 접착제 제거 후 바닥면에 잔여 접착층이나 불균일한 부분이 남을 수 있습니다. 바탕면 정리나 재마감이 필요한지 계약상 복구 기준과 함께 확인해야 합니다.",
    checklist: "바닥 마감 종류, 접착층, 복구 기준",
  },
  {
    category: "천장",
    question: (r) => `${r} 천장 철거 후 조명과 소방설비는 어떻게 하나요?`,
    answer: () =>
      "조명, 감지기, 스프링클러 등은 철거 범위와 유지 여부를 구분해야 합니다. 소방시설은 임의 변경하지 말고 건물 관리주체 및 관련 전문업체와 협의해야 합니다.",
    checklist: "조명, 감지기, 스프링클러, 유지 설비",
  },
  {
    category: "유리",
    question: (r) => `${r} 매장 유리문과 유리 파티션도 철거 대상인가요?`,
    answer: () =>
      "유리문과 파티션의 철거 여부는 계약 조건과 다음 사용 계획에 따라 달라집니다. 대형 유리의 해체는 파손과 안전사고 위험이 있으므로 적절한 장비와 작업 계획이 필요합니다.",
    checklist: "유리 규격, 고정 방식, 보존 여부",
  },
  {
    category: "현장 조사",
    question: (r) => `${r} 철거업체 현장 실측 때 무엇을 설명해야 하나요?`,
    answer: () =>
      "공간의 현재 용도, 철거할 시설, 남길 시설, 희망 일정, 임대인 요구사항을 전달하면 좋습니다. 계약서나 도면이 있다면 함께 검토하고, 견적에 반영되지 않은 항목이 없는지 확인해야 합니다.",
    checklist: "도면, 계약서, 현장 사진, 희망 일정",
  },
  {
    category: "계약 종료",
    question: (r) => `${r} 계약 종료일 전에 철거를 마치면 무엇을 해야 하나요?`,
    answer: () =>
      "공사 완료 상태를 확인하고 임대인과 공간 인도 일정 및 정산 사항을 협의해야 합니다. 열쇠·출입카드 반납, 계량기 확인, 공사 완료 사진 보관 등도 함께 점검하면 좋습니다.",
    checklist: "인도 일정, 열쇠 반납, 계량기, 정산",
  },
  {
    category: "부분 철거",
    question: (r) => `${r} 전체 철거 대신 필요한 부분만 제거할 수 있나요?`,
    answer: () =>
      "부분 철거 가능 여부는 시설 연결 상태와 현장 안전 조건에 따라 달라집니다. 부분 철거 후 남는 벽·천장·바닥의 마감 상태를 함께 확인해야 예상하지 못한 복구 작업을 줄일 수 있습니다.",
    checklist: "철거 경계, 연결 설비, 잔여 마감",
  },
];

function createRegionFAQs(region: RegionItem): FAQ[] {
  const seed = hashString(region.path);

  // 지역마다 질문의 선택과 순서를 다르게 구성합니다.
  // 단순한 무작위 변경이 아니라 경로에 따라 항상
  // 동일한 결과를 반환하는 결정적 방식입니다.
  const ranked = faqTemplates
    .map((template, index) => ({
      template,
      index,
      score: hashString(`${region.path}:${index}`),
    }))
    .sort((a, b) => a.score - b.score);

  // 일부 필수 주제를 유지하면서 다른 질문을 배합합니다.
  const essentialCategories = [
    "견적",
    "원상복구",
    "계약",
  ];

  const selected: typeof ranked = [];

  for (const category of essentialCategories) {
    const found = ranked.find(
      (item) => item.template.category === category
    );

    if (found) selected.push(found);
  }

  for (const item of ranked) {
    if (selected.length >= 10) break;

    if (!selected.some((s) => s.index === item.index)) {
      selected.push(item);
    }
  }

  // 지역 경로를 활용해 순서도 고정적으로 변형합니다.
  const offset = seed % selected.length;

  const ordered = [
    ...selected.slice(offset),
    ...selected.slice(0, offset),
  ];

  return ordered.map(({ template }) => ({
    category: template.category,
    question: template.question(region.name),
    answer: template.answer(region.name),
    checklist: template.checklist,
  }));
}

export function generateStaticParams() {
  return allRegions.map((region) => ({
    slug: normalizePath(region.path)
      .split("/")
      .filter(Boolean),
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = findRegion(slug);

  if (!region) {
    return {
      title: "지역별 철거 질문 안내 | 더세이브철거",
    };
  }

  const title =
    `${region.name} 철거 FAQ | 비용·폐업·원상복구 질문 10가지`;

  const description =
    `${region.name} 철거업체를 알아보기 전 확인할 견적, ` +
    `폐업, 원상복구, 추가 비용, 공사 일정 등 ` +
    `실무 질문 10가지를 정리했습니다. 더세이브철거.`;

  const canonical =
    `${SITE_URL}/faq${normalizePath(region.path)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "더세이브철거",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function RegionFAQPage({
  params,
}: Props) {
  const { slug } = await params;
  const region = findRegion(slug);

  if (!region) notFound();

  const faqs = createRegionFAQs(region);

  const faqPath =
    `/faq${normalizePath(region.path)}`;

  return (
    <main className="min-h-screen bg-white text-zinc-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-tight"
          >
            더세이브
            <span className="text-violet-700">철거</span>
          </Link>

          <div className="flex gap-2">
            <Link
              href={region.path}
              className="hidden rounded-full border border-violet-200 px-4 py-2 text-xs font-bold text-violet-700 sm:inline-flex"
            >
              지역 안내
            </Link>

            <a
              href={PHONE_URL}
              className="rounded-full bg-violet-700 px-5 py-2.5 text-xs font-black text-white"
            >
              무료 방문견적
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-purple-100 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-black tracking-[0.25em] text-violet-700">
            LOCAL DEMOLITION Q&A
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            {region.name}
            <br />
            <span className="text-violet-700">
              철거 고민 해결센터
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-9 text-zinc-600">
            {region.name}에서 상가, 매장, 점포, 가게,
            사무실 철거와 폐업 원상복구를 준비하고 계신가요?
            견적부터 건물 관리규정, 폐기물 처리,
            공간 인도까지 확인해야 할 질문을 정리했습니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#questions"
              className="rounded-full bg-violet-700 px-7 py-4 text-sm font-black text-white"
            >
              질문 10개 확인하기
            </a>

            <a
              href={PHONE_URL}
              className="rounded-full border border-violet-200 bg-white px-7 py-4 text-sm font-black text-violet-700"
            >
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="border-b border-zinc-100 py-12">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 md:grid-cols-3">
          {[
            {
              title: "견적 전 확인",
              text: "작업 범위와 추가 비용 조건",
            },
            {
              title: "철거 전 준비",
              text: "계약서와 건물 관리규정",
            },
            {
              title: "철거 후 점검",
              text: "원상복구와 인수인계",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-violet-100 bg-violet-50/60 p-6"
            >
              <h2 className="font-black text-violet-800">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* QUESTIONS */}
      <section
        id="questions"
        className="scroll-mt-28 py-20"
      >
        <div className="mx-auto max-w-4xl px-5">
          <p className="text-xs font-black tracking-[0.25em] text-violet-600">
            10 PRACTICAL QUESTIONS
          </p>

          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            {region.name} 철거 전
            <br />
            확인할 질문 10가지
          </h2>

          <p className="mt-5 leading-8 text-zinc-600">
            질문을 선택하면 상세한 설명과
            실제로 확인할 사항을 볼 수 있습니다.
          </p>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={`${faq.category}-${index}`}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm open:border-violet-300 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-6 md:p-7">
                  <span className="text-xl font-black text-violet-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1">
                    <span className="text-xs font-bold text-violet-600">
                      {faq.category}
                    </span>

                    <h3 className="mt-2 text-base font-black leading-7 md:text-lg">
                      {faq.question}
                    </h3>
                  </div>

                  <span className="text-2xl font-bold text-violet-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="border-t border-violet-100 bg-violet-50/40 px-6 pb-7 pt-6 md:px-7">
                  <p className="text-sm leading-8 text-zinc-700 md:text-base">
                    {faq.answer}
                  </p>

                  <div className="mt-6 rounded-xl border border-violet-100 bg-white p-5">
                    <p className="text-xs font-black text-violet-700">
                      확인 체크리스트
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-7 text-zinc-700">
                      {faq.checklist}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-gradient-to-br from-violet-800 to-purple-950 py-20 text-white">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p className="text-xs font-black tracking-[0.2em] text-violet-200">
            THE SAVE DEMOLITION
          </p>

          <h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
            {region.name} 철거 상담
            <br />
            더세이브철거
          </h2>

          <p className="mt-5 leading-8 text-violet-100">
            실제 견적과 작업 범위는 현장 확인을 통해
            안내해 드립니다.
          </p>

          <a
            href={PHONE_URL}
            className="mt-8 block text-3xl font-black md:text-5xl"
          >
            {PHONE}
          </a>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={PHONE_URL}
              className="rounded-full bg-white px-7 py-4 text-sm font-black text-violet-800"
            >
              전화상담
            </a>

            <a
              href={TALK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 px-7 py-4 text-sm font-black text-white"
            >
              네이버 톡톡
            </a>

            <Link
              href={region.path}
              className="rounded-full border border-white/30 px-7 py-4 text-sm font-black text-white"
            >
              {region.name} 철거 안내
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5">
          <div>
            <p className="font-black">더세이브철거</p>
            <p className="mt-2 text-xs text-zinc-500">
              지역별 철거·원상복구 정보 안내
            </p>
          </div>

          <div className="flex gap-4 text-xs font-semibold text-zinc-500">
            <Link href="/">홈으로</Link>
            <Link href={region.path}>지역 페이지</Link>
            <Link href={faqPath}>Q&A</Link>
          </div>
        </div>
      </footer>

      {/* MOBILE CONTACT */}
      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-violet-100 bg-white md:hidden">
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
