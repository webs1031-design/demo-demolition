import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://demo.thesavecompany.com";
const SITE_NAME = "더세이브철거";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "철거업체 더세이브철거 | 상가 매장 사무실 원상복구",
    template: "%s",
  },

  description:
    "서울 경기 인천 충청 지역의 상가 매장 사무실 점포 가게 철거와 폐업철거 원상복구 정보를 안내합니다. 현장 확인을 통한 무료 방문견적을 제공합니다.",

  applicationName: SITE_NAME,

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "철거업체 더세이브철거 | 상가 매장 사무실 원상복구",
    description:
      "서울 경기 인천 충청 지역의 상가 매장 사무실 점포 가게 철거와 폐업철거 원상복구 정보를 안내합니다.",
  },

  twitter: {
    card: "summary_large_image",
    title: "철거업체 더세이브철거 | 상가 매장 사무실 원상복구",
    description:
      "서울 경기 인천 충청 지역의 철거와 폐업철거 원상복구 정보를 안내합니다.",
  },

  category: "철거",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}