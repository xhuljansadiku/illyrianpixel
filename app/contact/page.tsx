import { buildMetadata } from "@/lib/seo";
import ContactPageClient from "@/components/ContactPageClient";

export const metadata = buildMetadata("Contact", "Rezervo call, plotëso kërkesën dhe merr një plan të qartë për projektin.");

export default function ContactPage() {
  return <ContactPageClient />;
}
