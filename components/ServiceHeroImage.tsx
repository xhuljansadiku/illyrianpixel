import Image from "next/image";

/** Foto e hero-s te faqet e shërbimeve (SEO, Google Ads) — e njëjta pamje si te ServiceCategoryDetailPage */
export default function ServiceHeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mt-12 lg:mt-0">
      <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[28px] bg-accent/[0.08] blur-3xl" />
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1067}
        priority
        sizes="(min-width: 1024px) 48vw, 100vw"
        className="relative w-full rounded-2xl border border-white/[0.08] object-cover shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
      />
    </div>
  );
}
