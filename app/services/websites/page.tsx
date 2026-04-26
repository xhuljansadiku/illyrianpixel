import { buildMetadata } from "@/lib/seo";
import { servicesData } from "@/lib/siteContent";
import ServiceDetailPage from "@/components/ServiceDetailPage";

const service = servicesData.find((item) => item.slug === "websites")!;

export const metadata = buildMetadata("Websites", service.short);

export default function WebsitesServicePage() {
  return <ServiceDetailPage service={service} />;
}
