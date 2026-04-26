import { testimonialsCompact } from "@/lib/siteContent";

export default function TestimonialBlock() {
  return (
    <section className="cinematic-section border-t border-white/[0.08] !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-20 md:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          {testimonialsCompact.map((item) => (
            <article key={item.author} className="rounded-[1rem] border border-white/10 bg-[#151515] p-5">
              <p className="text-[1.03rem] leading-relaxed text-white/78">“{item.quote}”</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <p className="text-white/88">{item.author}</p>
                <span className="rounded-full border border-accent/30 px-2 py-0.5 text-accent/88">{item.result}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
