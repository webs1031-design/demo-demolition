
import type { Metadata } from "next";
import ResourcePage, {
  categoryMetadata,
} from "../../components/ResourcePages";

export const metadata: Metadata = categoryMetadata("estimates");

export default function EstimatesPage() {
  return <ResourcePage category="estimates" />;
}
