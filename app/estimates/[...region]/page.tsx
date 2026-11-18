
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

// 지역별 견적 SEO 메타데이터 유지
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { region } = await params;

  return categoryMetadata("estimates", region);
}

// 지역별 견적 콘텐츠
async function EstimatesRegionContent({
  params,
}: Props) {
  const { region } = await params;

  return (
    <ResourcePage
      category="estimates"
      segments={region}
    />
  );
}

// Suspense를 이용한 지역별 견적 페이지
export default function EstimatesRegionPage({
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
              지역별 철거 견적 정보를 불러오는 중입니다.
            </p>
          </div>
        </main>
      }
    >
      <EstimatesRegionContent params={params} />
    </Suspense>
  );
}
