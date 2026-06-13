// Përmbajtje publike e menaxhueshme nga admini (testimoniale, portofol, çmime).
// Vetëm për server components / API routes — përdor service key.
import { createClient } from "@supabase/supabase-js";
import type { PricingOverrides } from "@/lib/pricingOverrides";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type TestimonialRow = {
  id: number;
  quote: string;
  name: string;
  company: string | null;
  result: string | null;
  logo: string | null;
  category: string | null;
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
  tags: string[];
  image_url: string | null;
  live_url: string | null;
  visible: boolean;
  sort: number;
  created_at: string;
};

export async function getVisibleTestimonials(): Promise<TestimonialRow[]> {
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("visible", true)
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  return data ?? [];
}

export async function getAllTestimonials(): Promise<TestimonialRow[]> {
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  return data ?? [];
}

export async function getVisiblePortfolioItems(): Promise<PortfolioRow[]> {
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("visible", true)
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  return data ?? [];
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
  visible: boolean;
  sort: number;
  created_at: string;
};

export async function getVisibleFaqs(): Promise<FaqRow[]> {
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("visible", true)
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  return data ?? [];
}

export async function getPricingOverrides(): Promise<PricingOverrides> {
  const { data } = await supabase.from("pricing_overrides").select("key, price, price_note");
  const result: PricingOverrides = {};
  for (const row of data ?? []) {
    result[row.key] = { price: row.price, price_note: row.price_note };
  }
  return result;
}
