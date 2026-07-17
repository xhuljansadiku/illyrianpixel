// Përmbajtje publike e menaxhueshme nga admini (testimoniale, portofol, çmime).
// Vetëm për server components / API routes — përdor service key.
import { createClient } from "@supabase/supabase-js";
import type { PricingOverrides } from "@/lib/pricingOverrides";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Gjuhët publike: shqipja është baza, kolonat *_en janë përkthime opsionale.
// Në /en shfaqen vetëm rreshtat me përkthimin kryesor të plotësuar — fushat
// dytësore bien te shqipja kur mungojnë.
export type PublicLocale = "sq" | "en";

export type TestimonialRow = {
  id: number;
  quote: string;
  name: string;
  company: string | null;
  result: string | null;
  logo: string | null;
  category: string | null;
  quote_en: string | null;
  result_en: string | null;
  category_en: string | null;
  visible: boolean;
  sort: number;
  created_at: string;
};

export type PortfolioRow = {
  id: number;
  title: string;
  category: string | null;
  location: string | null;
  year: string | null;
  description: string | null;
  result: string | null;
  category_en: string | null;
  location_en: string | null;
  description_en: string | null;
  result_en: string | null;
  tags: string[];
  image_url: string | null;
  live_url: string | null;
  visible: boolean;
  sort: number;
  created_at: string;
};

export async function getVisibleTestimonials(locale: PublicLocale = "sq"): Promise<TestimonialRow[]> {
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("visible", true)
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  const rows: TestimonialRow[] = data ?? [];
  if (locale !== "en") return rows;
  return rows
    .filter((t) => t.quote_en)
    .map((t) => ({
      ...t,
      quote: t.quote_en!,
      result: t.result_en ?? t.result,
      category: t.category_en ?? t.category,
    }));
}

export async function getAllTestimonials(): Promise<TestimonialRow[]> {
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  return data ?? [];
}

export async function getVisiblePortfolioItems(locale: PublicLocale = "sq"): Promise<PortfolioRow[]> {
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("visible", true)
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  const rows: PortfolioRow[] = data ?? [];
  if (locale !== "en") return rows;
  // Kategoria është teksti kryesor i dukshëm i kartës — pa të s'e shfaqim në /en
  return rows
    .filter((p) => p.category_en)
    .map((p) => ({
      ...p,
      category: p.category_en,
      location: p.location_en ?? p.location,
      description: p.description_en ?? p.description,
      result: p.result_en ?? p.result,
    }));
}

export async function getAllPortfolioItems(): Promise<PortfolioRow[]> {
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  return data ?? [];
}

export type FaqRow = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  question_en: string | null;
  answer_en: string | null;
  category_en: string | null;
  visible: boolean;
  sort: number;
  created_at: string;
};

export async function getVisibleFaqs(locale: PublicLocale = "sq"): Promise<FaqRow[]> {
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("visible", true)
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  const rows: FaqRow[] = data ?? [];
  if (locale !== "en") return rows;
  return rows
    .filter((f) => f.question_en && f.answer_en)
    .map((f) => ({
      ...f,
      question: f.question_en!,
      answer: f.answer_en!,
      category: f.category_en ?? f.category,
    }));
}

export async function getPricingOverrides(): Promise<PricingOverrides> {
  const { data } = await supabase.from("pricing_overrides").select("key, price, price_note");
  const result: PricingOverrides = {};
  for (const row of data ?? []) {
    result[row.key] = { price: row.price, price_note: row.price_note };
  }
  return result;
}
