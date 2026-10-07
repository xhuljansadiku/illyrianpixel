import { NextResponse } from "next/server";
import { serviceCategories } from "@/lib/serviceCategories";
import { applyOverridesToCategory } from "@/lib/pricingOverrides";
import { getVisibleFaqs, getPricingOverrides } from "@/lib/publicContent";

export const revalidate = 300;

// Të dhënat që përdor "King Genti" (asistenti i sajtit) për t'iu përgjigjur
// klientëve me çmime dhe FAQ aktuale — gjithmonë të sinkronizuara me panelin.
export async function GET() {
  const overrides = await getPricingOverrides();
  const faqs = await getVisibleFaqs();

  const services = serviceCategories.map((category) => {
    const withOverrides = applyOverridesToCategory(category, overrides);
    return {
      slug: withOverrides.slug,
      title: withOverrides.title,
      short: withOverrides.short,
      packages: withOverrides.packages.map((pkg) => ({
        name: pkg.name,
        price: pkg.price,
        priceNote: pkg.priceNote ?? null,
        ideal: pkg.ideal,
      })),
    };
  });

  return NextResponse.json({
    success: true,
    services,
    faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
  });
}
