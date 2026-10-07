# Nordic Pixel

Website for **Nordic Pixel** — a Scandinavian full-service digital agency (websites, e-commerce,
SEO & Google Ads, branding & content, digital marketing, maintenance & growth).
Swedish is the primary language; English serves the wider Nordic/European market.

> Nordic Pixel is a separate brand and codebase from Illyrian Pixel. Do not push this
> repository to the Illyrian Pixel remote or deploy it to the Illyrian Pixel Vercel project.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript, static generation)
- **next-intl** for locale routing and localized URLs — no other runtime dependencies
- Plain, structured **CSS with design tokens** (no CSS framework)
- **Inter** (UI/body) and **Manrope** (headings), self-hosted via `next/font`
- **Resend** REST API for contact-form e-mail (server-side only, no SDK)
- **Vitest** for unit/content tests

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — see "Contact form" below
npm run dev                  # http://localhost:3000 → redirects to /sv
```

| Script                  | What it does                                                         |
| ----------------------- | -------------------------------------------------------------------- |
| `npm run dev`           | Development server                                                   |
| `npm run build`         | Production build (57 statically generated pages)                     |
| `npm start`             | Serve the production build                                           |
| `npm run lint`          | ESLint (Next.js rules)                                               |
| `npm run typecheck`     | TypeScript                                                           |
| `npm test`              | Validation, rate-limit, e-mail and content-integrity tests           |
| `npm run check:static`  | After a build: key pages are static, `<html lang>` is correct, placeholder case studies are `noindex` |
| `npm run verify`        | All of the above in sequence                                         |
| `npm run icons`         | Regenerates favicons, app icons and brand mark files from the logo   |

## Languages and URLs

Every URL carries its locale. Swedish URLs use Swedish slugs for SEO in Sweden; `/` redirects to `/sv`.
There is no automatic language detection (many Swedes browse with English system settings) and no locale cookie.

| Page                 | Swedish                                | English                             |
| -------------------- | -------------------------------------- | ----------------------------------- |
| Home                 | `/sv`                                  | `/en`                               |
| Services             | `/sv/tjanster`                         | `/en/services`                      |
| Service pages        | `/sv/tjanster/webbutveckling` …        | `/en/services/web-development` …    |
| Work / case study    | `/sv/case`, `/sv/case/[slug]`          | `/en/work`, `/en/work/[slug]`       |
| About                | `/sv/om-oss`                           | `/en/about`                         |
| Process              | `/sv/process`                          | `/en/process`                       |
| Insights / article   | `/sv/insikter`, `/sv/insikter/[slug]`  | `/en/insights`, `/en/insights/[slug]` |
| Contact              | `/sv/kontakt` (+ `/sv/kontakt/tack`)   | `/en/contact` (+ `/en/contact/thank-you`) |
| Legal                | `/sv/integritetspolicy`, `/sv/villkor`, `/sv/cookies` | `/en/privacy`, `/en/terms`, `/en/cookies` |

The mapping lives in [`i18n/routing.ts`](i18n/routing.ts). Folders in `app/[locale]` use the internal
(English) names. Adding a locale (e.g. `no`, `da`, `fi`) means adding it to `routing.locales`, adding
localized pathnames, and adding a dictionary that matches `content/dictionaries/sv.ts`.

## Where the content lives

All copy is in typed TypeScript files — the English versions must match the Swedish shape, which
TypeScript and `content/content.test.ts` enforce.

| File                                   | Content                                                     |
| -------------------------------------- | ----------------------------------------------------------- |
| `content/dictionaries/sv.ts`, `en.ts`  | UI text, home page sections, page copy, FAQ, process steps, meta titles/descriptions |
| `content/services.ts`                  | The six services (overview + full service pages)            |
| `content/projects.ts`                  | Case studies (currently placeholders)                       |
| `content/insights.ts`                  | Articles (slugs per locale in `content/insight-slugs.ts`)    |
| `content/legal.ts`                     | Privacy policy, terms of use, cookie policy                 |
| `content/company.ts`                   | Company name, org. number, address, e-mail, phone, social links |
| `content/social-proof.ts`              | Client logos and testimonials (intentionally empty)         |
| `content/form.ts`                      | Contact form labels, options and messages                   |

Long-form text supports `[label](/contact)` (localized internal link), `[label](https://…)` and `**bold**`.
Anything written as `[LIKE THIS]` is rendered as a visibly marked placeholder.

## Design system

- Tokens: [`styles/variables.css`](styles/variables.css) — colours, spacing, radius, shadows, type scale, motion, layout.
- Base & type: `styles/globals.css`, `styles/typography.css`, `styles/motion.css`, `styles/responsive.css`.
- Components: `styles/components/*.css` (buttons, navbar, cards, forms, modal, faq, footer).
- Sections: `styles/sections/*.css` (hero, services, work, process, contact …).
- React components: `components/` (`ui/`, `layout/`, `home/`, `sections/`, `work/`, `contact/`, `brand/`).

Brand guidelines (logo, colours, typography, usage): [`docs/BRAND.md`](docs/BRAND.md).

## Contact form

`components/contact/ContactForm.tsx` posts to `app/api/contact/route.ts`. Validation rules are shared by
the browser and the server (`lib/contact/schema.ts`).

Spam protection: honeypot field, minimum fill time, link limit, same-origin check, payload size limit and
per-IP rate limiting (5 per 15 minutes). The rate limiter is in-memory (per server instance) — for
stricter limits swap it for a shared store such as Upstash Redis. Without JavaScript the form still
works and lands on the thank-you page.

E-mail delivery needs three server-side environment variables (see [`.env.example`](.env.example)):
`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (a sender on a domain verified in Resend).
Without them, inquiries are logged to the terminal in development and the form shows an error in production.

## SEO, accessibility and performance

- Unique title/description, canonical URL, hreflang (`sv`, `en`, `x-default`), Open Graph and Twitter
  tags on every page (`lib/seo.ts`); generated share images per locale (`app/[locale]/opengraph-image.tsx`).
- JSON-LD: Organization, WebSite, Service, Article, BreadcrumbList, FAQPage (`lib/structured-data.ts`).
  Placeholder company details are never included; there are no ratings or reviews.
- `sitemap.xml` with language alternates, `robots.txt`, web manifest, favicons.
- Semantic landmarks, skip link, one `h1` per page, labelled form fields with linked errors, native
  `<dialog>` for the modal and mobile menu, `<details>` for the FAQ, visible focus styles, colour
  contrast checked against WCAG AA, `prefers-reduced-motion` respected. Content is visible without JavaScript.
- Static pages, no third-party scripts, fonts or images, no cookies, ~105–120 kB first-load JS.

## Before launch

1. **Company details** — fill in `content/company.ts` (legal name, org. number, address, e-mail, phone,
   social profiles) once the Swedish company is registered.
2. **Case studies** — replace or delete the three placeholder projects in `content/projects.ts`
   (real projects only, with the client's permission and verifiable results; screenshots in `/public/work/<slug>/`).
3. **Legal texts** — confirm the `[BRACKETED]` items in `content/legal.ts` (retention period, providers)
   and have the texts reviewed.
4. **Clients & testimonials** — add only real ones to `content/social-proof.ts`.
5. **Environment** — set `NEXT_PUBLIC_SITE_URL` and the three Resend variables in the hosting project.
6. **Business claims** — confirm the copy that describes how you work, e.g. "we usually reply within one
   business day" and the 4–10 week website timeline (in the dictionaries and `content/services.ts`).
7. **Analytics** — the site currently sets no cookies. If you add analytics, add a consent banner and update
   the cookie and privacy policies.
8. Run `npm run verify` and search the codebase for `[` placeholders: `grep -rn "\[[A-Z]" content`.

## Deployment

Create a **new** Git repository and a **new** Vercel project for Nordic Pixel. `vercel.json` places the
serverless function (the contact API) in Stockholm (`arn1`); the pages themselves are static and served
from the CDN.
