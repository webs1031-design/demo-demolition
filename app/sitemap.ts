
import type { MetadataRoute } from "next";
import { regions, type Region } from "./data/regions";

/* =====================================================
   더세이브철거 sitemap.xml 전체 교체본

   사이트:
   https://demo.thesavecompany.com

   주요 기능:
   - 홈페이지 URL 등록
   - 기존 전체 지역 URL 유지
   - 서비스 상세 페이지 등록
   - 업종별 상세 페이지 등록
   - 철거지원금 페이지 등록
   - 철거사례 페이지 등록
   - 업종별 견적 페이지 등록
   - 철거 Q&A 페이지 등록
   - 신규 카테고리의 전체 지역 URL 등록
   - 중복 URL 자동 제거
   - 지역별 우선순위 적용
   - 존재하는 지역 경로만 등록
   - Next.js App Router 대응
===================================================== */

const SITE_URL = "https://demo.thesavecompany.com";

/* =====================================================
   1. 서비스·업종 상세 페이지 등록 설정
===================================================== */

const ENABLE_DETAIL_SITEMAP = true;

/* =====================================================
   2. 서비스·업종 상세 페이지 등록 지역

   기존 설정 유지:
   처음에는 서울 강남구만 등록합니다.
===================================================== */

const DETAIL_REGION_PATHS: string[] = [
  "/seoul/gangnam-gu",
];

/* =====================================================
   3. 신규 카테고리 등록 설정

   true  = 전체 지역별 URL 등록
   false = 카테고리 메인 URL만 등록
===================================================== */

const ENABLE_RESOURCE_REGION_SITEMAP = true;

/* =====================================================
   4. 신규 카테고리 목록

   실제 구현된 페이지 경로:
   /support
   /cases
   /estimates
   /qa
===================================================== */

const RESOURCE_CATEGORIES = [
  {
    slug: "support",
    priority: 0.8,
  },
  {
    slug: "cases",
    priority: 0.8,
  },
  {
    slug: "estimates",
    priority: 0.8,
  },
  {
    slug: "qa",
    priority: 0.8,
  },
] as const;

/* =====================================================
   5. 서비스 상세 페이지

   app/[...slug]/page.tsx에 구현된
   서비스 slug와 동일하게 구성
===================================================== */

const SERVICE_SLUGS = [
  "commercial",
  "store",
  "office",
  "shop",
  "business",
  "closure",
  "restoration",
  "interior",
] as const;

/* =====================================================
   6. 업종별 상세 페이지
===================================================== */

const INDUSTRY_SLUGS = [
  "restaurant",
  "cafe",
  "dining",
  "academy",
  "hospital",
  "hair-salon",
  "nail-shop",
  "skin-care",
  "gym",
  "pilates",
  "convenience-store",
  "unmanned-store",
  "bar",
  "karaoke",
  "pc-room",
  "reading-room",
  "study-cafe",
  "optical-store",
  "clothing-store",
  "franchise",
] as const;

/* =====================================================
   7. 지역별 업종 카드 선택 알고리즘

   지역 페이지와 동일하게
   업종 5개를 고정 선택합니다.
===================================================== */

function hashString(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getSelectedIndustrySlugs(
  regionPath: string
): string[] {
  const items: string[] = [...INDUSTRY_SLUGS];

  let seed = hashString(regionPath) || 1;

  for (let i = items.length - 1; i > 0; i--) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;

    const j = (seed >>> 0) % (i + 1);

    [items[i], items[j]] = [items[j], items[i]];
  }

  return items.slice(0, 5);
}

/* =====================================================
   8. 전체 지역 데이터 수집

   하위 지역까지 재귀적으로 수집
===================================================== */

function flattenRegions(
  items: Region[]
): Region[] {
  const result: Region[] = [];

  for (const region of items) {
    result.push(region);

    if (region.children?.length) {
      result.push(
        ...flattenRegions(region.children)
      );
    }
  }

  return result;
}

/* =====================================================
   9. 지역별 검색 우선순위

   priority는 검색 순위를 보장하지 않으며
   사이트맵 내 상대적 중요도 표시입니다.
===================================================== */

function getRegionPriority(
  region: Region
): number {
  switch (region.level) {
    case "province":
      return 0.9;

    case "city":
      return 0.8;

    case "district":
      return 0.8;

    case "town":
      return 0.7;

    default:
      return 0.7;
  }
}

/* =====================================================
   10. URL 정규화 및 중복 제거
===================================================== */

function addUrl(
  result: MetadataRoute.Sitemap,
  usedUrls: Set<string>,
  pathname: string,
  priority: number,
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never" = "monthly"
) {
  const normalizedPath =
    pathname === "/"
      ? ""
      : pathname.replace(/\/+$/, "");

  const url = `${SITE_URL}${normalizedPath}`;

  if (usedUrls.has(url)) {
    return;
  }

  usedUrls.add(url);

  result.push({
    url,
    changeFrequency,
    priority,
  });
}

/* =====================================================
   11. 기존 전체 지역 URL 등록
===================================================== */

function addRegionUrls(
  result: MetadataRoute.Sitemap,
  usedUrls: Set<string>,
  allRegions: Region[]
) {
  for (const region of allRegions) {
    addUrl(
      result,
      usedUrls,
      region.path,
      getRegionPriority(region)
    );
  }
}

/* =====================================================
   12. 서비스 상세 URL 등록
===================================================== */

function addServiceDetailUrls(
  result: MetadataRoute.Sitemap,
  usedUrls: Set<string>,
  regionPath: string
) {
  for (const slug of SERVICE_SLUGS) {
    addUrl(
      result,
      usedUrls,
      `${regionPath}/service/${slug}`,
      0.6
    );
  }
}

/* =====================================================
   13. 업종별 상세 URL 등록

   해당 지역의 업종 카드 5개 등록
===================================================== */

function addIndustryDetailUrls(
  result: MetadataRoute.Sitemap,
  usedUrls: Set<string>,
  regionPath: string
) {
  const selectedSlugs =
    getSelectedIndustrySlugs(regionPath);

  for (const slug of selectedSlugs) {
    addUrl(
      result,
      usedUrls,
      `${regionPath}/industry/${slug}`,
      0.6
    );
  }
}

/* =====================================================
   14. 신규 카테고리 메인 URL 등록

   /support
   /cases
   /estimates
   /qa
===================================================== */

function addResourceMainUrls(
  result: MetadataRoute.Sitemap,
  usedUrls: Set<string>
) {
  for (const category of RESOURCE_CATEGORIES) {
    addUrl(
      result,
      usedUrls,
      `/${category.slug}`,
      category.priority,
      "weekly"
    );
  }
}

/* =====================================================
   15. 신규 카테고리 지역별 URL 등록

   예시:
   /support/seoul/gangnam-gu
   /cases/seoul/gangnam-gu
   /estimates/seoul/gangnam-gu
   /qa/seoul/gangnam-gu

   regions.ts에 존재하는 지역만 사용합니다.
===================================================== */

function addResourceRegionUrls(
  result: MetadataRoute.Sitemap,
  usedUrls: Set<string>,
  allRegions: Region[]
) {
  for (const category of RESOURCE_CATEGORIES) {
    for (const region of allRegions) {
      const regionPriority =
        getRegionPriority(region);

      const resourcePriority = Math.min(
        regionPriority,
        0.7
      );

      addUrl(
        result,
        usedUrls,
        `/${category.slug}${region.path}`,
        resourcePriority,
        "monthly"
      );
    }
  }
}

/* =====================================================
   16. 최종 sitemap.xml 생성
===================================================== */

export default function sitemap(): MetadataRoute.Sitemap {
  const result: MetadataRoute.Sitemap = [];

  const usedUrls = new Set<string>();

  // 홈페이지 등록
  addUrl(
    result,
    usedUrls,
    "/",
    1,
    "weekly"
  );

  // 전체 지역 데이터 수집
  const allRegions = flattenRegions(regions);

  // 기존 전체 지역 URL 등록
  addRegionUrls(
    result,
    usedUrls,
    allRegions
  );

  // 신규 카테고리 메인 페이지 등록
  addResourceMainUrls(
    result,
    usedUrls
  );

  // 신규 카테고리 전체 지역 페이지 등록
  if (ENABLE_RESOURCE_REGION_SITEMAP) {
    addResourceRegionUrls(
      result,
      usedUrls,
      allRegions
    );
  }

  // 기존 서비스·업종 상세 페이지 등록
  if (ENABLE_DETAIL_SITEMAP) {
    const validRegionPaths = new Set(
      allRegions.map((region) => region.path)
    );

    for (const regionPath of DETAIL_REGION_PATHS) {
      if (!validRegionPaths.has(regionPath)) {
        continue;
      }

      // 서비스 상세 페이지
      addServiceDetailUrls(
        result,
        usedUrls,
        regionPath
      );

      // 업종별 상세 페이지
      addIndustryDetailUrls(
        result,
        usedUrls,
        regionPath
      );
    }
  }

  return result;
}
