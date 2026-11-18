
import type { Metadata } from "next";
import ResourcePage, {
  categoryMetadata,
} from "../../../components/ResourcePages";

type Props = {
  params: Promise<{
    region: string[];
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { region } = await params;

  return categoryMetadata("support", region);
}

export default async function SupportRegionPage({
  params,
}: Props) {
  const { region } = await params;

  return (
    <ResourcePage
      category="support"
      segments={region}
    />
  );
}
