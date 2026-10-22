import type { MetadataRoute } from "next";

import { regions, type Region } from "./data/regions";

/* =========================================================
   사이트 기본 주소
========================================================= */

const SITE_URL = "https://demo.thesavecompany.com";

/* =========================================================
   지역 데이터를 재귀적으로 순회해서
   모든 지역 URL을 수집합니다.

   예:
   /seoul
   /seoul/gangnam-gu
   /seoul/gangnam-gu/yeoksam-dong

   /gyeonggi/anyang
   /gyeonggi/anyang/manan-gu
   /gyeonggi/anyang/manan-gu/anyang-dong
========================================================= */

function collectRegionUrls(
  items: Region[]
): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  for (const region of items) {
    urls.push({
      url: `${SITE_URL}${region.path}`,
      changeFrequency: "monthly",
      priority: getPriority(region),
    });

    if (
      region.children &&
      region.children.length > 0
    ) {
      urls.push(
        ...collectRegionUrls(
          region.children
        )
      );
    }
  }

  return urls;
}

/* =========================================================
   페이지 단계별 Priority

   메인페이지       1.0
   광역지역         0.9
   시/군            0.8
   구               0.8
   읍/면/동         0.7

   priority는 검색순위를 올려주는 점수가 아니라
   사이트 내부에서 페이지 중요도를 표현하는 값입니다.
========================================================= */

function getPriority(
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

/* =========================================================
   SITEMAP
========================================================= */

export default function sitemap(): MetadataRoute.Sitemap {
  const homepage: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const regionPages =
    collectRegionUrls(regions);

  return [
    ...homepage,
    ...regionPages,
  ];
}