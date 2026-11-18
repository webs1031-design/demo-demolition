
import type { Metadata } from "next";
import ResourcePage, {
  categoryMetadata,
} from "../../components/ResourcePages";

export const metadata: Metadata = categoryMetadata("cases");

export default function CasesPage() {
  return <ResourcePage category="cases" />;
}
