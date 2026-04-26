import Link from "next/link";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
};

export default function ServiceCard({ title, description, href }: ServiceCardProps) {
  return (
    <article className="rounded-[1rem] border border-white/10 bg-[#151515] p-5 transition-transform duration-300 hover:-translate-y-[2px]">
      <h3 className="font-display text-3xl leading-[0.96] text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{description}</p>
      <Link href={href} className="luxury-link mt-5">
        Shiko shërbimin <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
