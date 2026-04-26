import { buildMetadata } from "@/lib/seo";
import { servicesData } from "@/lib/siteContent";
import ServiceDetailPage from "@/components/ServiceDetailPage";

const service = servicesData.find((item) => item.slug === "marketing")!;

export const metadata = buildMetadata("Marketing", service.short);

export default function MarketingServicePage() {
  return <ServiceDetailPage service={service} />;
}
