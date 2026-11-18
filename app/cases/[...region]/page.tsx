
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

// 지역별 SEO 메타데이터 유지
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { region } = await params;

  return categoryMetadata("cases", region);
}

// 비동기 지역 데이터 처리
async function CasesRegionContent({
  params,
}: Props) {
  const { region } = await params;

  return (
    <ResourcePage
      category="cases"
      segments={region}
    />
  );
}

// Suspense를 이용한 지역별 페이지 렌더링
export default function CasesRegionPage({
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
              지역별 철거사례를 불러오는 중입니다.
            </p>
          </div>
        </main>
      }
    >
      <CasesRegionContent params={params} />
    </Suspense>
  );
}
