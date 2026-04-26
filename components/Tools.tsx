import SectionMark from "@/components/SectionMark";

const tools = ["Next.js", "Shopify", "SEO", "Google Ads", "Analytics", "CMS"];

export default function Tools() {
  return (
    <section id="tools" className="cinematic-section section-tone-services">
      <div className="section-wrap">
        <SectionMark label="TOOLS & STACK" />
        <h2 className="section-title mt-3 max-w-4xl">Teknologji që mbështesin ekzekutimin premium.</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {tools.map((tool) => (
            <span key={tool} className="rounded-full border border-white/14 bg-white/[0.02] px-4 py-2 text-sm text-white/76 transition-colors duration-300 hover:border-accent/45 hover:text-accent">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
