import { company, realValue, socialLinks, type SocialNetwork } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { getServices } from "@/content/services";
import { Link, type AppHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { LogoLockup } from "../brand/Logo";
import { Icon } from "../ui/Icon";
import { PlaceholderAware } from "../ui/RichText";

const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
};

function FooterColumn({ title, links }: { title: string; links: { href: AppHref; label: string }[] }) {
  return (
    <div>
      <h2 className="site-footer__heading">{title}</h2>
      <ul className="site-footer__links">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const email = realValue(company.email);
  const phone = realValue(company.phone);
  const social = socialLinks();
  const year = new Date().getFullYear();

  const serviceLinks = getServices(locale).map((service) => ({ href: service.href, label: service.shortTitle }));
  const companyLinks: { href: AppHref; label: string }[] = [
    { href: "/about", label: dict.nav.items.about },
    { href: "/work", label: dict.nav.items.work },
    { href: "/process", label: dict.nav.items.process },
    { href: "/insights", label: dict.nav.items.insights },
    { href: "/contact", label: dict.footer.contactLink },
  ];
  const legalLinks: { href: AppHref; label: string }[] = [
    { href: "/privacy", label: dict.footer.legalLinks.privacy },
    { href: "/terms", label: dict.footer.legalLinks.terms },
    { href: "/cookies", label: dict.footer.legalLinks.cookies },
  ];

  return (
    <footer className="site-footer theme-dark">
      <div className="container site-footer__main">
        <div className="site-footer__brand">
          <Link href="/" className="logo" aria-label={dict.nav.homeLabel}>
            <LogoLockup variant="white" />
          </Link>
          <p className="site-footer__description">{dict.footer.description}</p>

          <div className="site-footer__contact">
            {email ? <a href={`mailto:${email}`}>{email}</a> : <PlaceholderAware value={company.email} />}
            {phone ? (
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
            ) : (
              <PlaceholderAware value={company.phone} />
            )}
          </div>

          {social.length > 0 && (
            <div>
              <h2 className="site-footer__heading">{dict.footer.followHeading}</h2>
              <ul className="site-footer__social">
                {social.map(({ network, url }) => (
                  <li key={network}>
                    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LABELS[network]}>
                      <Icon name={network} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <FooterColumn title={dict.footer.servicesHeading} links={serviceLinks} />
        <FooterColumn title={dict.footer.companyHeading} links={companyLinks} />
        <FooterColumn title={dict.footer.legalHeading} links={legalLinks} />
      </div>

      <div className="container">
        <div className="site-footer__bottom">
          <p>© Nordic Pixel {year}</p>
          <p className="site-footer__legal-line">
            <span>
              <PlaceholderAware value={company.legalName} />
            </span>
            <span>
              {dict.footer.orgNumberLabel} <PlaceholderAware value={company.orgNumber} />
            </span>
            <span>
              <PlaceholderAware value={company.address} />
            </span>
          </p>
          <p className="site-footer__country">{dict.footer.country}</p>
        </div>
      </div>
    </footer>
  );
}
