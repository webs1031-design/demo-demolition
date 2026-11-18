
import type { MetadataRoute } from "next";

/* =========================================================
   더세이브철거 robots.txt 전체 교체본

   사이트:
   https://demo.thesavecompany.com

   검색엔진 수집 허용:
   - 홈페이지
   - 전체 지역별 철거업체 페이지
   - 지역별 서비스 상세 페이지
   - 지역별 업종 상세 페이지
   - 철거지원금 메인 및 지역 페이지
   - 철거사례 메인 및 지역 페이지
   - 업종별 견적 메인 및 지역 페이지
   - 철거 Q&A 메인 및 지역 페이지

   검색엔진 수집 제한:
   - 관리자 페이지
   - 실시간 채팅 관리자 페이지
   - 내부 API

   사이트맵:
   https://demo.thesavecompany.com/sitemap.xml

   Next.js App Router 대응
========================================================= */

const SITE_URL = "https://demo.thesavecompany.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",

        allow: "/",

        disallow: [
          "/admin",
          "/api/",
        ],
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,

    host: SITE_URL,
  };
}
