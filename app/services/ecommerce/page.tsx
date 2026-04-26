import { buildMetadata } from "@/lib/seo";
import { servicesData } from "@/lib/siteContent";
import ServiceDetailPage from "@/components/ServiceDetailPage";

const service = servicesData.find((item) => item.slug === "ecommerce")!;

export const metadata = buildMetadata("E-commerce", service.short);

export default function EcommerceServicePage() {
  return <ServiceDetailPage service={service} />;
}
