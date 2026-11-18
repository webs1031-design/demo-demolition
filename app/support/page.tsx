
import type { Metadata } from "next";
import ResourcePage, {
  categoryMetadata,
} from "../../components/ResourcePages";

export const metadata: Metadata = categoryMetadata("support");

export default function SupportPage() {
  return <ResourcePage category="support" />;
}
