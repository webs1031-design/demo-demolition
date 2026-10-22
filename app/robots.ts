import type { MetadataRoute } from "next";

/* =========================================================
   사이트 기본 주소
========================================================= */

const SITE_URL = "https://demo.thesavecompany.com";

/* =========================================================
   ROBOTS

   검색엔진이 메인페이지와 모든 지역페이지를
   정상적으로 크롤링할 수 있도록 허용합니다.

   Sitemap 위치도 함께 알려줍니다.
========================================================= */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,

    host: SITE_URL,
  };
}