import { buildMetadata } from "@/lib/seo";
import { servicesData } from "@/lib/siteContent";
import ServiceDetailPage from "@/components/ServiceDetailPage";

const service = servicesData.find((item) => item.slug === "seo")!;

export const metadata = buildMetadata("SEO", service.short);

export default function SeoServicePage() {
  return <ServiceDetailPage service={service} />;
}
