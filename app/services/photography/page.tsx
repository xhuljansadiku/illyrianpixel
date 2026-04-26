import { buildMetadata } from "@/lib/seo";
import { servicesData } from "@/lib/siteContent";
import ServiceDetailPage from "@/components/ServiceDetailPage";

const service = servicesData.find((item) => item.slug === "photography")!;

export const metadata = buildMetadata("Photography", service.short);

export default function PhotographyServicePage() {
  return <ServiceDetailPage service={service} />;
}
