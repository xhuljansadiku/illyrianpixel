import { buildMetadata } from "@/lib/seo";
import { servicesData } from "@/lib/siteContent";
import ServiceDetailPage from "@/components/ServiceDetailPage";

const service = servicesData.find((item) => item.slug === "branding")!;

export const metadata = buildMetadata("Branding", service.short);

export default function BrandingServicePage() {
  return <ServiceDetailPage service={service} />;
}
