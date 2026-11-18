
import type { Metadata } from "next";
import { Suspense } from "react";

import ResourcePage, {
  categoryMetadata,
} from "../../../components/ResourcePages";

type Props = {
  params: Promise<{
    region: string[];
  }>;
};

// 지역별 Q&A SEO 메타데이터
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { region } = await params;

  return categoryMetadata("qa", region);
}

// 비동기 지역 정보 처리
async function QARegionContent({
  params,
}: Props) {
  const { region } = await params;

  return (
    <ResourcePage
      category="qa"
      segments={region}
    />
  );
}

// 지역별 Q&A 페이지
export default function QARegionPage({
  params,
}: Props) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-lg font-bold text-violet-700">
              더세이브철거
            </p>
            <p className="mt-4 text-zinc-600">
              지역별 철거 Q&A를 불러오는 중입니다.
            </p>
          </div>
        </main>
      }
    >
      <QARegionContent params={params} />
    </Suspense>
  );
}
