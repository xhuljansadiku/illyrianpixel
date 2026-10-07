import type { CaseStudy } from "./caseStudies.sq";

export const caseStudies: CaseStudy[] = [
  {
    slug: "esm-group",
    title: "ESM Group",
    category: "Website for an Industrial Business",
    location: "Milan, Italy",
    flagCodes: ["it"],
    year: "2026",
    intro:
      "A complete digital system for a serious industrial company.\nWe built the brand identity, content structure and a clear website that communicates value immediately.\n\nA professional presence that builds trust and attracts the right clients.",
    problem:
      "The company's offering and experience weren't clearly reflected online, creating ambiguity about the type of projects and the pace of incoming contacts.",
    solution:
      "We built a clean structure with service-first sections, concrete proof and a navigation flow that guides the user toward an inquiry without friction.",
    result: "The right clients, the right message, we made the website speak for them.",
    metrics: ["Structured B2B message", "Friction-free navigation", "Quality industrial inquiries"],
    tags: ["Branding", "Content (IT/EN)", "Website"],
    heroImage: "/images/projects/esm-group.avif",
    liveUrl: "https://esm-group.eu/"
  },
  {
    slug: "bardhi-wellness",
    title: "Bardhi Wellness",
    category: "Personal Brand",
    location: "Pristina & Cologne",
    flagCodes: ["xk", "de"],
    year: "2026",
    intro:
      "A complete online sales system for a personal fitness brand.\nWe built the identity, offer structure and a website with integrated payments for a simple, clear process.\n\nFewer questions, more purchases, an experience that turns visitors into clients.",
    problem:
      "The information existed, but the content hierarchy and offer narrative didn't fully support the brand's professional perception.",
    solution:
      "We organized the content around user intent, clarified the packages and strengthened the sections that build trust before contact.",
    result: "Visitors understand, decide and reach out faster.",
    metrics: ["Clear, structured offer", "Brand with personal authority", "Decision-making without hesitation"],
    tags: ["Branding", "Content", "Website", "Payments (Stripe/PayPal)"],
    heroImage: "/images/projects/bardhi-wellness.png",
    liveUrl: ""
  },
  {
    slug: "hauswerk-niederbayern",
    title: "Hauswerk Niederbayern",
    category: "Local Services Website",
    location: "Straubing, Germany",
    flagCodes: ["de"],
    year: "2026",
    intro:
      "We positioned the services clearly for the local German market, clients find the offer quickly and start contact with accurate expectations.",
    problem:
      "Visitors didn't always immediately understand the relevant service and the right step to send an inquiry.",
    solution:
      "We created a strong homepage hierarchy, clear service separation and direct CTAs for immediate contact.",
    result: "Local clients find the service and start contact directly.",
    metrics: ["Clearly distinguished services", "Direct CTA", "Inquiries with accurate expectations"],
    tags: ["Local Service", "Lead Flow", "Clarity"],
    heroImage: "/images/projects/hauswerk-niederbayern.avif",
    liveUrl: "https://hauswerk-niederbayern.de/"
  },
  {
    slug: "palushi-brothers",
    title: "Palushi Brothers Construction",
    category: "Website for a Construction Company",
    location: "London, UK",
    flagCodes: ["gb"],
    year: "2026",
    intro:
      "A complete lead generation system for a construction company in London.\nWe built the identity, content structure and a trust-optimized website, backed by Google Ads to bring in new clients.\n\nA presence that builds trust and generates real inquiries from the right clients.",
    problem:
      "Visitors arrived with varying expectations and without a clear framework of services, making it harder to filter inquiries.",
    solution:
      "We reorganized the offer, proof and contact sections to establish a more convincing flow from interest to inquiry.",
    result: "Visitors trust and start a serious conversation, not hesitation.",
    metrics: ["Visible social proof", "Understandable services", "Quality inbound conversations"],
    tags: ["Branding", "Content", "Website", "Google Ads"],
    heroImage: "/images/projects/palushi-brothers.png",
    liveUrl: "https://www.palushibrothers.co.uk/"
  },
  {
    slug: "ilirjana-shehu-photography",
    title: "Ilirjana Shehu Photography",
    category: "Portfolio Website",
    location: "Tirana, Albania",
    flagCodes: ["al"],
    year: "2026",
    intro:
      "The portfolio shows the style and quality of the work without noise, the image speaks, the flow is calm, the impact is immediate.",
    problem:
      "The photography projects had no clear editorial framework online, losing the rhythm and impact of the presentation.",
    solution:
      "We built a minimalist structure, a clean hierarchy and a strong focus on the work to raise the perceived quality.",
    result: "The portfolio speaks for itself, without noise, with rhythm and impact.",
    metrics: ["Gallery with editorial rhythm", "Calm, focused navigation", "Quality of work front and center"],
    tags: ["Photography", "Portfolio", "Editorial"],
    heroImage: "/images/projects/ilirjana-shehu-photography.png",
    liveUrl: "https://www.ilirjanashehu.com/"
  },
  {
    slug: "suli-group-trockenbau",
    title: "Suli Group Trockenbau",
    category: "Corporate Services Website",
    location: "Nuremberg, Germany",
    flagCodes: ["de"],
    year: "2026",
    intro:
      "A corporate website that communicates the company's offering with authority, the visitor is guided toward contact without hesitation.",
    problem:
      "The services message was scattered and didn't sufficiently highlight the company's key differentiators.",
    solution:
      "We reorganized the content with clear sections, focused CTAs and a controlled dark-luxury aesthetic.",
    result: "The offer communicates with authority, the visitor is guided toward contact.",
    metrics: ["Controlled dark-luxury aesthetic", "Clear service sections", "Contact without hesitation"],
    tags: ["Construction", "Corporate", "Lead Gen"],
    heroImage: "/images/projects/suli-group-trockenbau.png",
    liveUrl: ""
  }
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((item) => item.slug === slug);
