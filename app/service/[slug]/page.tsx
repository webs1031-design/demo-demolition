
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const SITE_URL = "https://demo.thesavecompany.com";
const PHONE = "010-2269-8352";
const PHONE_LINK = "tel:01022698352";
const TALK_LINK = "https://talk.naver.com/profile/wnse6xr";

type Section = {
  title: string;
  description: string;
  checks: string[];
};

type Service = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  sections: Section[];
};

const section = (
  title: string,
  description: string,
  ...checks: string[]
): Section => ({ title, description, checks });

const SERVICES: Service[] = [
  {
    slug: "commercial",
    name: "상가철거",
    subtitle: "상업시설 철거부터 임대차 원상복구까지",
    description:
      "상가철거는 건물의 구조, 임대차계약, 공용시설과 영업용 설비를 함께 확인해야 하는 작업입니다.",
    sections: [
      section("상가철거의 작업 범위",
        "상가 내부에 설치된 벽체와 마감재, 영업용 시설을 구분하고 철거 범위를 정합니다.",
        "내부 구조물", "영업용 설비", "보존 시설"),
      section("상가 건물 관리규정 확인",
        "상가건물은 관리사무소의 작업 승인과 공용부 사용 기준을 먼저 확인해야 할 수 있습니다.",
        "작업 가능 시간", "공용 복도 보호", "화물 승강기"),
      section("상가 내부 벽체 철거",
        "경량벽체와 비내력 칸막이 등 철거 가능한 구조를 구분하고, 구조체 손상을 방지해야 합니다.",
        "벽체 재질", "설비 매립 여부", "구조체 구분"),
      section("상가 천장 및 바닥 정리",
        "천장 마감과 바닥재는 설비 배치 및 원상복구 조건에 따라 철거 범위가 달라집니다.",
        "천장 설비", "바닥 접착재", "기존 마감 상태"),
      section("상가 공용시설 보호",
        "건물 출입구와 복도, 엘리베이터는 자재 반출 과정에서 보호가 필요한 구역입니다.",
        "출입구", "엘리베이터", "공용 통로"),
      section("상가 폐기물 처리",
        "철거 과정에서 발생하는 목재, 금속, 석고보드 등 폐기물을 종류별로 확인합니다.",
        "폐기물 종류", "적재 위치", "운반 조건"),
      section("상가철거 비용 산정",
        "면적 외에도 시설 수량, 층수, 반출 거리, 작업시간과 마감재 종류가 견적에 영향을 줍니다.",
        "작업 면적", "시설물 수량", "반출 환경"),
      section("상가 임대차 원상복구",
        "임대차계약서의 특약과 임대인 협의 내용을 기준으로 철거 후 복구 범위를 정해야 합니다.",
        "계약 특약", "인도 당시 상태", "복구 합의"),
      section("상가철거 일정 계획",
        "영업 종료, 집기 반출, 철거, 원상복구, 최종 인도를 구분해 일정을 준비합니다.",
        "영업 종료일", "공사 일정", "인도일"),
      section("상가철거 최종 점검",
        "작업 완료 후 잔여 폐기물, 공용시설 상태, 유지하기로 한 설비를 확인합니다.",
        "잔여 폐기물", "공용부 상태", "복구 완료 항목"),
    ],
  },
  {
    slug: "store",
    name: "매장철거",
    subtitle: "판매공간의 진열시설과 매장 인테리어 정리",
    description:
      "매장철거는 상품 진열시설, 카운터, 브랜드 인테리어와 전시용 설비를 중심으로 작업 범위를 정합니다.",
    sections: [
      section("매장 진열대 철거",
        "벽면과 바닥에 고정된 진열대는 고정 방식과 재사용 여부를 확인한 후 분리합니다.",
        "고정 방식", "재사용 여부", "벽면 손상"),
      section("매장 카운터 해체",
        "계산대와 안내 카운터에 연결된 전기 및 통신 배선을 확인합니다.",
        "POS 연결", "전원", "고정 가구"),
      section("판매용 집기 분류",
        "이동 가능한 집기와 철거해야 하는 고정 시설을 구분하면 작업 범위를 명확히 할 수 있습니다.",
        "이동 집기", "고정 집기", "재사용 품목"),
      section("쇼윈도와 유리시설",
        "매장 전면 유리와 진열공간은 건물 소유 시설인지 확인해야 합니다.",
        "유리 파손 방지", "건물 소유 여부", "보존 범위"),
      section("매장 조명 및 전기",
        "레일 조명과 진열 조명은 연결된 전기회로를 확인한 뒤 안전하게 분리해야 합니다.",
        "레일 조명", "배선", "분전반"),
      section("매장 바닥 마감재",
        "타일, 데코타일, 장판 등 기존 바닥재의 종류에 따라 철거 방법이 달라집니다.",
        "마감재 종류", "접착 상태", "바탕면"),
      section("매장 간판 정리",
        "실내외 간판과 브랜드 표시물의 소유 및 철거 범위를 확인합니다.",
        "실내 사인", "외부 간판", "전원 연결"),
      section("매장 폐기물 반출",
        "진열 가구와 포장재, 철거 폐기물의 양에 따라 운반 계획을 수립합니다.",
        "집기 부피", "운반 동선", "적재 공간"),
      section("매장철거 견적 기준",
        "진열시설 수량과 내부 마감, 전기설비, 간판 철거 여부를 항목별로 비교합니다.",
        "진열대 수량", "마감재", "간판 포함 여부"),
      section("매장 인도 전 확인",
        "영업시설 제거 후 바닥과 벽면, 전기설비 상태를 확인하고 임대인과 인도 범위를 점검합니다.",
        "시설 제거", "벽면 상태", "인도 조건"),
    ],
  },
  {
    slug: "office",
    name: "사무실철거",
    subtitle: "업무공간 파티션·통신설비·OA바닥 정리",
    description:
      "사무실철거는 업무공간을 구성하는 파티션과 전기·통신시설, 바닥 및 천장 마감재의 복구 조건을 검토합니다.",
    sections: [
      section("사무실 파티션 해체",
        "유리 파티션과 경량 칸막이는 재질과 고정 방식에 따라 해체 절차를 구분합니다.",
        "유리 파티션", "경량벽체", "고정 부위"),
      section("OA바닥 철거",
        "이중바닥과 하부 배선은 건물 기본 시설과 임차인 설치 시설을 구분해야 합니다.",
        "바닥 패널", "하부 배선", "기본 시설"),
      section("통신선과 네트워크",
        "인터넷과 사내 네트워크 배선은 철거 전 장비 연결을 해제하고 유지할 회선을 확인합니다.",
        "랜선", "통신함", "유지 회선"),
      section("사무실 전기설비",
        "콘센트와 조명, 전원 분배시설은 사용 중인 회로와 분리 대상 회로를 확인합니다.",
        "콘센트", "조명", "분전 설비"),
      section("회의실과 업무실",
        "회의실 벽체, 방음 마감, 출입문 등 업무실 구획시설의 철거 범위를 결정합니다.",
        "회의실", "출입문", "방음 마감"),
      section("사무용 가구 반출",
        "책상과 수납장, 고정 캐비닛의 반출 여부와 운반 방법을 정리합니다.",
        "책상", "캐비닛", "고정 수납장"),
      section("보안 및 자료 관리",
        "철거 전 문서와 저장장치, 보안 장비를 별도 관리하여 정보 유출을 예방합니다.",
        "문서 보관", "저장장치", "보안 장비"),
      section("업무용 건물 작업 승인",
        "관리사무소와 협의해 작업시간, 출입증, 화물 승강기와 공용부 보호 조건을 확인합니다.",
        "출입 승인", "승강기 예약", "공용부 보호"),
      section("사무실 원상복구",
        "계약 조건에 따라 파티션, 바닥, 천장, 전기 및 통신설비의 복구 범위를 확인합니다.",
        "계약 특약", "설비 원상복구", "마감 상태"),
      section("사무실 이전 일정",
        "이사와 장비 반출이 끝난 뒤 철거가 시작되도록 업무 종료 일정을 조율합니다.",
        "이사 일정", "장비 반출", "인도 예정일"),
    ],
  },
  {
    slug: "shop",
    name: "점포철거",
    subtitle: "소규모 점포의 영업시설 정리와 공간 인도",
    description:
      "점포철거는 비교적 제한된 공간 안에 설치된 영업시설과 간판, 내부 마감재를 효율적으로 정리하는 과정입니다.",
    sections: [
      section("점포 내부 구조 확인",
        "좁은 점포에서는 시설물의 배치와 출입구 폭에 따라 해체 및 반출 순서가 달라집니다.",
        "출입구 폭", "시설 배치", "반출 순서"),
      section("소규모 영업시설 해체",
        "카운터와 선반, 수납장 등 영업에 사용된 시설을 고정 여부에 따라 분류합니다.",
        "카운터", "선반", "고정 가구"),
      section("점포 전면 간판",
        "점포 외부 간판은 설치 위치와 전기 연결, 건물 관리규정을 확인합니다.",
        "간판 위치", "전원", "건물 승인"),
      section("점포 출입문과 셔터",
        "출입문과 셔터가 건물 기본 시설인지 임차인 설치 시설인지 구분합니다.",
        "출입문", "셔터", "소유 구분"),
      section("점포 내부 바닥",
        "영업 중 사용한 바닥 마감재와 하부 상태를 확인하고 철거 범위를 정합니다.",
        "타일", "데코타일", "바닥 손상"),
      section("점포 벽면 마감",
        "벽면 선반과 장식 패널, 도장 마감의 복구 여부를 검토합니다.",
        "벽면 패널", "선반", "도장"),
      section("점포 폐기물 반출",
        "보행자 동선과 점포 앞 적재 공간을 고려해 폐기물 반출 방법을 정합니다.",
        "보행 동선", "적재 공간", "운반 거리"),
      section("점포철거 비용 비교",
        "소규모 공간이라도 간판과 설비, 마감재 종류에 따라 비용 차이가 발생합니다.",
        "간판", "설비", "마감재"),
      section("점포 영업 종료 준비",
        "상품과 이동 집기를 먼저 정리하고 철거 대상만 현장에 남기도록 계획합니다.",
        "재고", "이동 집기", "영업 종료일"),
      section("점포 최종 인도",
        "임대차 종료 시점에 맞춰 원상복구 범위와 현장 정리 상태를 확인합니다.",
        "인도일", "원상복구", "현장 점검"),
    ],
  },
  {
    slug: "business",
    name: "가게철거",
    subtitle: "가게 내부 집기부터 영업 종료 후 정리까지",
    description:
      "가게철거는 영업 중 사용하던 집기와 설비를 정리하고 임대공간을 인도하기 위해 필요한 작업을 검토합니다.",
    sections: [
      section("가게 영업 집기 정리",
        "영업에 사용한 이동식 집기와 고정 가구를 구분하고 재사용할 품목을 먼저 분류합니다.",
        "재사용 집기", "고정 가구", "반출 품목"),
      section("가게 수납시설 철거",
        "벽면 수납장과 선반은 고정 상태 및 벽체 손상 가능성을 확인합니다.",
        "수납장", "선반", "고정 부위"),
      section("가게 내부 인테리어",
        "장식 벽체와 천장, 바닥 마감은 기존 시설과 새로 설치한 시설을 구분합니다.",
        "장식 벽체", "천장", "바닥"),
      section("가게 전기 연결 정리",
        "영업 장비와 조명, 콘센트의 전기 연결을 안전하게 분리할 수 있는지 확인합니다.",
        "영업 장비", "조명", "전원"),
      section("가게 급배수 설비",
        "싱크대나 세척시설이 있다면 배관 분리와 마감 범위를 검토합니다.",
        "싱크대", "배수구", "배관 마감"),
      section("가게 외부 시설",
        "차양과 간판, 외부 장식물은 건물 소유 여부와 철거 조건을 확인합니다.",
        "차양", "간판", "외부 장식"),
      section("가게 폐기물 구분",
        "상품 재고, 재사용 집기, 철거 폐기물을 구분해 처리 계획을 세웁니다.",
        "상품 재고", "재사용 집기", "철거 폐기물"),
      section("가게철거 견적 준비",
        "가게 내부 사진과 면적, 시설물 목록을 준비하면 상담에 도움이 됩니다.",
        "현장 사진", "면적", "시설물 목록"),
      section("가게 폐업 일정",
        "영업 종료와 상품 정리, 시설 철거 및 인도 일정을 순서대로 정리합니다.",
        "영업 종료", "재고 정리", "공간 인도"),
      section("가게 원상회복 확인",
        "임대차계약에서 요구하는 마감 상태와 보존 설비를 최종 확인합니다.",
        "계약 조건", "마감 상태", "보존 설비"),
    ],
  },
  {
    slug: "closure",
    name: "폐업철거",
    subtitle: "폐업 준비부터 철거 일정과 지원사업 확인까지",
    description:
      "폐업철거는 사업 종료 일정, 임대차계약, 집기 처분, 철거 및 원상복구 절차를 함께 검토해야 합니다.",
    sections: [
      section("폐업 일정 수립",
        "영업 종료일부터 임대차 인도일까지 필요한 일정을 구분해 계획합니다.",
        "영업 종료일", "계약 종료일", "인도일"),
      section("임대차계약 확인",
        "철거 전에 원상복구 특약과 시설 유지에 관한 합의 내용을 확인합니다.",
        "계약 특약", "임대인 협의", "시설 보존"),
      section("폐업 전 재고 정리",
        "판매 재고와 소모품, 재사용 가능한 집기를 철거 폐기물과 분리합니다.",
        "재고", "소모품", "재사용 집기"),
      section("사업용 설비 처분",
        "임차인 소유 장비와 렌털 장비를 구분해 반환 및 처분 일정을 정합니다.",
        "소유 장비", "렌털 장비", "반환 일정"),
      section("폐업 지원사업 확인",
        "소상공인 지원사업은 공고 시기와 신청 자격, 증빙 요건이 다를 수 있어 공식 안내를 확인해야 합니다.",
        "지원 자격", "신청 기한", "증빙 서류"),
      section("철거 견적 증빙",
        "지원사업 신청이나 비용 정산을 고려한다면 견적서와 계약서 등 필요한 서류를 확인합니다.",
        "견적서", "계약서", "정산 서류"),
      section("폐업철거 작업 범위",
        "영업시설과 인테리어를 철거하되 임대인과 합의한 유지 시설은 구분합니다.",
        "영업시설", "마감재", "유지 시설"),
      section("폐업 폐기물 처리",
        "사업장에서 발생한 폐기물의 종류와 처리 방법을 확인합니다.",
        "폐기물 분류", "처리 방법", "운반 조건"),
      section("폐업 원상복구",
        "철거 후 계약에 따른 복구가 필요한 항목을 점검하고 공간 인도를 준비합니다.",
        "바닥", "벽체", "전기·배관"),
      section("폐업 후 공간 인도",
        "열쇠 반환과 시설 상태 확인, 임대인과의 최종 점검을 준비합니다.",
        "최종 점검", "인도 확인", "잔여 시설"),
    ],
  },
  {
    slug: "restoration",
    name: "원상복구",
    subtitle: "임대차계약에 따른 공간 복구 범위와 절차",
    description:
      "원상복구는 철거 자체보다 임대차계약과 기존 인도 상태에 따라 어떤 부분을 복구해야 하는지 확인하는 과정이 중요합니다.",
    sections: [
      section("원상복구의 기본 개념",
        "임대공간을 반환할 때 계약과 합의 내용에 따라 필요한 복구 범위를 정합니다.",
        "계약 조건", "합의 사항", "반환 상태"),
      section("임대차 특약 검토",
        "원상복구에 관한 특약은 일반적인 철거 범위보다 우선 검토해야 할 수 있습니다.",
        "특약 문구", "설치 시설", "면제 합의"),
      section("최초 인도 상태 확인",
        "입점 당시 사진이나 시설 목록이 있다면 복구 범위 판단에 도움이 됩니다.",
        "입점 사진", "시설 목록", "기존 도면"),
      section("벽체 원상복구",
        "임차인이 설치한 칸막이와 벽체의 철거 및 마감 상태를 확인합니다.",
        "칸막이", "벽면 마감", "손상 부위"),
      section("바닥 원상복구",
        "바닥재 철거 여부와 기존 바닥 상태, 접착재 제거 범위를 확인합니다.",
        "바닥재", "접착재", "기존 바탕면"),
      section("천장 원상복구",
        "천장재와 조명, 설비 위치를 검토해 필요한 복구 항목을 구분합니다.",
        "천장재", "조명", "설비 개구부"),
      section("전기·통신 원상복구",
        "임차인이 추가 설치한 배선과 콘센트, 통신시설의 유지 또는 제거 범위를 정합니다.",
        "추가 배선", "콘센트", "통신선"),
      section("급배수 원상복구",
        "싱크대와 세척시설 등의 제거 후 배관 마감이 필요한지 확인합니다.",
        "급수관", "배수관", "마감 상태"),
      section("원상복구 비용 검토",
        "철거 비용과 마감 복구 비용을 구분해 견적 포함 범위를 비교합니다.",
        "철거 항목", "복구 항목", "추가 작업"),
      section("임대인 최종 확인",
        "공간 인도 전 복구 결과를 확인하고 합의된 범위가 반영되었는지 점검합니다.",
        "복구 결과", "합의 범위", "최종 인도"),
    ],
  },
  {
    slug: "interior",
    name: "인테리어철거",
    subtitle: "기존 인테리어 마감재와 내부 시설 철거 안내",
    description:
      "인테리어철거는 기존 마감재와 비구조 벽체, 고정 가구를 제거하면서 유지해야 할 구조와 설비를 보호하는 작업입니다.",
    sections: [
      section("인테리어철거 범위 설정",
        "철거 대상이 내부 마감재인지 구조물인지 구분하고 작업 범위를 정합니다.",
        "마감재", "비구조 벽체", "유지 구조"),
      section("경량벽체 철거",
        "석고보드와 경량철골 등 비구조 벽체의 재질과 내부 설비를 확인합니다.",
        "석고보드", "경량철골", "매립 설비"),
      section("천장 마감재 철거",
        "텍스와 석고보드, 금속 천장재 등의 종류에 따라 철거 절차가 달라집니다.",
        "천장재", "조명", "설비"),
      section("바닥재 철거",
        "데코타일, 마루, 타일 등 마감재별 철거 방식과 바탕면 상태를 확인합니다.",
        "마루", "타일", "바탕면"),
      section("고정 가구 해체",
        "붙박이장과 카운터, 벽면 수납시설 등의 고정 상태를 확인합니다.",
        "붙박이장", "카운터", "고정 선반"),
      section("인테리어 조명 정리",
        "매립 조명과 간접 조명, 레일 조명의 연결 상태를 확인합니다.",
        "매립 조명", "간접 조명", "레일 조명"),
      section("내부 전기설비 보호",
        "철거 과정에서 유지할 배선과 설비를 구분하고 안전 조치를 검토합니다.",
        "유지 배선", "분전반", "콘센트"),
      section("마감재 폐기물 분류",
        "목재와 금속, 석고보드 등 서로 다른 마감재의 처리 방법을 확인합니다.",
        "목재", "금속", "석고보드"),
      section("인테리어철거 비용",
        "철거 면적 외에 마감재 종류, 고정 상태, 폐기물 양이 견적에 영향을 줍니다.",
        "면적", "마감재", "반출 조건"),
      section("철거 후 바탕면 확인",
        "새로운 인테리어를 진행하거나 원상복구를 준비할 수 있도록 남은 바탕면과 설비 상태를 점검합니다.",
        "바탕면", "잔여 접착재", "설비 상태"),
    ],
  },
];

const serviceMap = new Map(SERVICES.map((item) => [item.slug, item]));

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SERVICES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceMap.get(slug);

  if (!service) {
    return { robots: { index: false, follow: false } };
  }

  const title = `${service.name} | 작업 범위·비용·원상복구 전문 안내 - 더세이브철거`;
  const description = `${service.name} 전문 안내. ${service.subtitle}. 주요 철거 시설과 작업 절차, 비용 결정 요소, 원상복구 확인사항을 살펴보세요.`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}/service/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/service/${slug}`,
      type: "website",
      locale: "ko_KR",
    },
    robots: { index: true, follow: true },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = serviceMap.get(slug);

  if (!service) notFound();

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-xl font-black">
            더세이브<span className="text-violet-700">철거</span>
          </Link>
          <a
            href={PHONE_LINK}
            className="rounded-full bg-violet-700 px-5 py-3 text-sm font-bold text-white"
          >
            무료방문견적
          </a>
        </div>
      </header>

      <nav className="mx-auto max-w-7xl px-5 py-5 text-sm text-zinc-500">
        <Link href="/">홈</Link>
        <span className="mx-2">/</span>
        <span>철거 종류별 안내</span>
        <span className="mx-2">/</span>
        <strong className="text-violet-700">{service.name}</strong>
      </nav>

      <section className="bg-gradient-to-br from-violet-50 via-white to-purple-100 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black tracking-widest text-violet-700">
            THE SAVE SPECIALIZED SERVICE
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            {service.name}
          </h1>
          <h2 className="mt-5 text-xl font-bold text-violet-800 md:text-2xl">
            {service.subtitle}
          </h2>
          <p className="mt-7 max-w-3xl text-base leading-9 text-zinc-600">
            {service.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={PHONE_LINK}
              className="rounded-full bg-violet-700 px-7 py-4 text-sm font-black text-white"
            >
              무료 방문견적 상담
            </a>
            <a
              href={TALK_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-violet-300 bg-white px-7 py-4 text-sm font-black text-violet-700"
            >
              네이버 톡톡
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black tracking-widest text-violet-700">
            SERVICE CONTENTS
          </p>
          <h2 className="mt-3 text-3xl font-black">
            {service.name} 전문 안내 목차
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {service.sections.map((item, index) => (
              <a
                key={index}
                href={`#section-${index + 1}`}
                className="rounded-xl border border-violet-100 bg-violet-50 p-5 transition hover:border-violet-400"
              >
                <span className="text-xs font-black text-violet-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-sm font-bold">{item.title}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl space-y-7 px-5">
          {service.sections.map((item, index) => (
            <article
              id={`section-${index + 1}`}
              key={index}
              className="scroll-mt-24 overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm"
            >
              <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                <div className="p-8 md:p-11">
                  <p className="text-xs font-black tracking-widest text-violet-700">
                    {service.name.toUpperCase()} GUIDE{" "}
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-5 text-2xl font-black md:text-3xl">
                    {item.title}
                  </h2>
                  <p className="mt-6 text-base leading-9 text-zinc-600">
                    {item.description}
                  </p>
                  <p className="mt-5 text-sm leading-8 text-zinc-500">
                    실제 현장에서는 시설 설치 상태, 건물 관리규정,
                    보존 대상과 작업 가능 범위를 확인한 뒤
                    세부 계획을 정하는 것이 중요합니다.
                  </p>
                </div>
                <div className="bg-violet-50 p-8 md:p-11">
                  <h3 className="text-base font-black text-violet-900">
                    주요 확인사항
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {item.checks.map((check) => (
                      <li
                        key={check}
                        className="rounded-xl bg-white px-5 py-4 text-sm font-bold text-zinc-700"
                      >
                        <span className="mr-2 text-violet-700">✓</span>
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black tracking-widest text-violet-700">
            BEFORE & AFTER
          </p>
          <h2 className="mt-4 text-3xl font-black">
            {service.name} 철거 전·후 사진
          </h2>
          <p className="mt-5 leading-8 text-zinc-600">
            실제 현장 사진이 준비되면 작업 전과 후의 상태를
            비교할 수 있도록 제공할 예정입니다.
          </p>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {["철거 전", "철거 후"].map((label) => (
              <div
                key={label}
                className="flex aspect-[4/3] flex-col items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-violet-50 p-8 text-center"
              >
                <p className="text-2xl font-black text-violet-900">
                  {label}
                </p>
                <p className="mt-4 text-sm text-zinc-500">
                  실제 현장 사진 등록 예정
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-violet-50 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-3xl font-black">다른 철거 서비스 살펴보기</h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.filter((item) => item.slug !== slug).map((item) => (
              <Link
                key={item.slug}
                href={`/service/${item.slug}`}
                className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-900 p-7 text-white transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-black">{item.name}</h3>
                <p className="mt-4 text-sm leading-7 text-violet-100">
                  {item.subtitle}
                </p>
                <p className="mt-7 text-sm font-bold">상세 안내 보기 →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-violet-800 to-purple-950 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <p className="text-xs font-black tracking-widest text-violet-200">
            FREE ESTIMATE
          </p>
          <h2 className="mt-5 text-3xl font-black md:text-4xl">
            {service.name} 무료 방문견적
          </h2>
          <p className="mt-5 leading-8 text-violet-100">
            철거 대상과 작업 환경을 확인하여
            현장에 맞는 견적 상담을 안내합니다.
          </p>
          <a
            href={PHONE_LINK}
            className="mt-7 block text-4xl font-black"
          >
            {PHONE}
          </a>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={PHONE_LINK}
              className="rounded-full bg-white px-8 py-4 text-sm font-black text-violet-800"
            >
              전화상담
            </a>
            <a
              href={TALK_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/50 px-8 py-4 text-sm font-black text-white"
            >
              네이버 톡톡
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
        <Link href="/" className="font-black text-zinc-800">
          더세이브철거
        </Link>
        <p className="mt-3">
          상가·매장·점포·가게·사무실 철거 및 원상복구
        </p>
      </footer>
    </main>
  );
}
