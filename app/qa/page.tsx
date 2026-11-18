
import type { Metadata } from "next";
import ResourcePage, {
  categoryMetadata,
} from "../../components/ResourcePages";

export const metadata: Metadata = categoryMetadata("qa");

export default function QAPage() {
  return <ResourcePage category="qa" />;
}
