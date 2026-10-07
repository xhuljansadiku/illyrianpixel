import type { Dictionary } from "./sv";

/** English copy. Must match the Swedish dictionary's shape exactly. */
export const en: Dictionary = {
  meta: {
    home: {
      title: "Nordic Pixel — Digital agency for websites, e-commerce and SEO",
      description:
        "Nordic Pixel is a Scandinavian full-service digital agency. Websites, e-commerce, SEO, branding and digital marketing that grow businesses.",
    },
    services: {
      title: "Services — Web, E-Commerce, SEO and Marketing",
      description:
        "Web design, e-commerce, SEO, Google Ads, branding, digital marketing and maintenance — everything you need to grow digitally, under one roof.",
    },
    work: {
      title: "Work — Selected Projects",
      description: "A selection of websites, e-commerce and digital projects by Nordic Pixel.",
    },
    about: {
      title: "About — A Scandinavian Digital Agency",
      description:
        "Nordic Pixel brings strategy, design, technology and marketing together in one team. Learn how we think and work.",
    },
    process: {
      title: "Process — From Idea to Growth",
      description:
        "How we work: discover, strategy, design, build, launch and grow. A clear process with checkpoints at every stage.",
    },
    insights: {
      title: "Insights — Web, SEO and Digital Growth",
      description: "Guides and perspectives on websites, e-commerce, SEO, Google Ads and digital marketing.",
    },
    contact: {
      title: "Contact — Start a Project",
      description:
        "Tell us about your project. We'll come back with thoughts and next steps — website, e-commerce, SEO or marketing.",
    },
    thanks: {
      title: "Thank you for your inquiry",
      description: "We've received your inquiry and will get back to you as soon as we can.",
    },
    notFound: {
      title: "Page not found",
      description: "The page you are looking for doesn't exist.",
    },
  },

  common: {
    skipToContent: "Skip to content",
    startProject: "Start a project",
    contactUs: "Contact us",
    viewOurWork: "View our work",
    allServices: "All services",
    allWork: "All work",
    exploreService: "Explore service",
    viewCaseStudy: "View case study",
    readArticle: "Read article",
    readMore: "Read more",
    backToHome: "Back to home",
    breadcrumbLabel: "Breadcrumb",
    home: "Home",
    placeholder: "Placeholder",
    placeholderNote: "This content will be replaced with a real case study before launch.",
    minutesRead: (minutes: number) => `${minutes} min read`,
    published: "Published",
    updated: "Updated",
  },

  modal: {
    title: "Start a project",
    description: "Tell us briefly about your project and we'll get back to you with thoughts and next steps.",
    close: "Close",
  },

  nav: {
    label: "Main navigation",
    homeLabel: "Nordic Pixel — home",
    items: {
      services: "Services",
      work: "Work",
      about: "About",
      process: "Process",
      insights: "Insights",
    },
    cta: "Start a project",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    language: "Language",
  },

  footer: {
    description:
      "A Scandinavian digital agency creating websites, e-commerce experiences and digital growth solutions.",
    servicesHeading: "Services",
    companyHeading: "Company",
    legalHeading: "Legal",
    contactHeading: "Contact",
    followHeading: "Follow us",
    country: "Sweden",
    orgNumberLabel: "Reg. no.",
    legalLinks: {
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
    },
    contactLink: "Contact",
    cta: "Have a project in mind?",
  },

  home: {
    hero: {
      eyebrow: "Full-service digital agency",
      title: "We build digital experiences that grow businesses.",
      lead: "Websites, e-commerce, SEO, branding and digital marketing for ambitious businesses.",
      note: "Strategy, design, technology and marketing — under one roof.",
      visual: {
        url: "your-website.com",
        disciplines: ["Strategy", "Design", "Technology", "Growth"],
      },
    },
    trust: {
      heading: "Trusted by ambitious businesses",
      fallback: "Building digital partnerships across Sweden and beyond.",
      pillars: ["Strategy", "Design", "Technology", "Marketing", "Growth"],
      pillarsLabel: "What we bring together under one roof",
    },
    services: {
      eyebrow: "Services",
      title: "Everything you need to grow digitally.",
      lead: "From your first website to a complete digital growth strategy, we bring strategy, design, technology and marketing together.",
    },
    why: {
      eyebrow: "Why Nordic Pixel",
      title: "Digital work with a business purpose.",
      statement: "Clear strategy. Better digital experiences. Measurable growth.",
      principles: [
        { title: "Strategy", text: "We understand the business before we design the solution." },
        { title: "Design", text: "We create clean, memorable and user-focused digital experiences." },
        {
          title: "Technology",
          text: "We use modern technology to build fast, scalable and reliable products.",
        },
        { title: "Growth", text: "We optimise beyond launch to help your digital presence perform." },
      ],
    },
    work: {
      eyebrow: "Work",
      title: "Selected work",
      lead: "A selection of digital experiences we've created for ambitious businesses.",
      emptyTitle: "Our first case studies are on their way.",
      emptyText: "We're documenting our first projects right now. Want yours to be one of them?",
    },
    process: {
      eyebrow: "Process",
      title: "From idea to growth.",
      lead: "A clear process with checkpoints at every stage — so you always know where your project stands.",
      cta: "How we work",
    },
    tech: {
      eyebrow: "Technology",
      title: "Built with modern technology.",
      lead: "We choose tools for what delivers the best result for you — not for what's trending.",
      groups: [
        { title: "Web & applications", items: ["Next.js", "React", "TypeScript", "Node.js"] },
        { title: "E-commerce & CMS", items: ["Shopify", "WooCommerce", "WordPress"] },
        { title: "Data & measurement", items: ["PostgreSQL", "Google Analytics", "Google Ads"] },
      ],
    },
    testimonials: {
      eyebrow: "Clients",
      title: "What our clients say",
      emptyTitle: "Let's make your next project one worth talking about.",
      emptyText: "We build long-term partnerships — and we'd love for your project to be next.",
    },
    proposal: {
      eyebrow: "Investment",
      title: "Every business is different.",
      text: "We build solutions around your goals, audience and budget.",
      points: [
        "An initial conversation about your goals and needs",
        "A written proposal with scope, timeline and price",
        "A setup that suits you — project-based or an ongoing partnership",
      ],
      cta: "Get a proposal",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      lead: "Can't find the answer you're looking for? Get in touch and we'll help.",
    },
    finalCta: {
      title: "Ready to grow your digital presence?",
      text: "Tell us what you're working on. We'll help you figure out the next step.",
    },
  },

  faq: [
    {
      question: "What does a website project cost?",
      answer:
        "It depends on scope, functionality and content. A focused company website is a smaller investment than a large online store with integrations. After a short conversation about your goals, you'll receive a written proposal with a clear price — no surprises.",
    },
    {
      question: "How long does a website take?",
      answer:
        "Most company websites take between four and ten weeks from kickoff to launch. E-commerce and larger platforms usually take longer. The proposal includes a realistic timeline with clear checkpoints.",
    },
    {
      question: "Do you work with companies outside Sweden?",
      answer:
        "Yes. Sweden is our home market, but we're happy to work with companies in Norway, Denmark, Finland and the rest of Europe. We work in Swedish and English, and collaboration works smoothly online.",
    },
    {
      question: "Do you offer ongoing maintenance?",
      answer:
        "Yes. Our maintenance and growth packages cover updates, security, backups, monitoring and continuous improvements, so your website stays fast and secure after launch.",
    },
    {
      question: "Do you provide SEO?",
      answer:
        "Yes. Every website we build has a solid technical SEO foundation. We also offer ongoing SEO — audits, content strategy, technical improvements and local SEO.",
    },
    {
      question: "Do you manage Google Ads?",
      answer:
        "Yes. We set up, run and optimise Google Ads campaigns against clear goals, with conversion tracking in place. The account belongs to your company.",
    },
    {
      question: "Can you redesign an existing website?",
      answer:
        "Yes. We start by reviewing what works today — content, search rankings and data — so the new website improves your results instead of starting from zero.",
    },
    {
      question: "Can you build Shopify stores?",
      answer:
        "Yes. We design and build Shopify stores, from custom themes to integrations and migrations. If another platform fits better, such as WooCommerce, we'll tell you.",
    },
    {
      question: "Do you offer monthly packages?",
      answer:
        "Yes. For maintenance, SEO, Google Ads and marketing we offer monthly partnerships with a scope tailored to your goals and budget.",
    },
  ],

  processSteps: [
    {
      id: "discover",
      title: "Discover",
      short: "We understand your business, audience and goals.",
      description:
        "We start by understanding your business: goals, customers, competitors and what has — or hasn't — worked before. The better we understand the business, the better the solution.",
      deliverables: [
        "Kickoff workshop",
        "Review of your current website, data and channels",
        "Shared goals and success metrics",
      ],
      role: "Share what you know about your business, customers and goals.",
    },
    {
      id: "strategy",
      title: "Strategy",
      short: "We define the right digital direction.",
      description:
        "We turn insights into a clear direction: what to build, for whom and why. Priorities are set so that the budget goes where it makes the biggest difference.",
      deliverables: ["Strategy and priorities", "Sitemap and content plan", "Scope and timeline"],
      role: "Give feedback and approve the direction.",
    },
    {
      id: "design",
      title: "Design",
      short: "We turn the strategy into a clear visual experience.",
      description:
        "We design the experience — from wireframes to finished visual design — and review it with you at clear checkpoints. Everything is built on a consistent design system.",
      deliverables: [
        "Wireframes and prototypes",
        "Visual design for desktop, tablet and mobile",
        "Design system and components",
      ],
      role: "Review the design and give feedback at agreed checkpoints.",
    },
    {
      id: "build",
      title: "Build",
      short: "We develop the solution using modern technology.",
      description:
        "We develop the solution with modern, proven technology, connect the integrations you need and add the content. You can follow progress on a staging site.",
      deliverables: [
        "Development on a staging environment",
        "Integrations and content management",
        "Technical SEO and accessibility",
      ],
      role: "Provide content and test on the staging site.",
    },
    {
      id: "launch",
      title: "Launch",
      short: "We test, optimise and launch.",
      description:
        "Before launch we test on real devices and browsers, check performance and accessibility, and set up analytics and redirects. Then we launch — carefully.",
      deliverables: [
        "Testing across devices and browsers",
        "Analytics and conversion tracking",
        "Launch and redirects",
      ],
      role: "Give your final approval before launch.",
    },
    {
      id: "grow",
      title: "Grow",
      short: "We keep improving performance after launch.",
      description:
        "Launch is where the real data begins. We follow up on results, find improvements and keep developing your digital presence together with you.",
      deliverables: ["Follow-up on results", "Continuous optimisation", "Maintenance and support"],
      role: "Regular check-ins on results and priorities.",
    },
  ],

  servicesPage: {
    eyebrow: "Services",
    title: "Everything you need to grow digitally.",
    lead: "From your first website to a complete digital growth strategy. Hire us for a single service or for the whole chain — we always plan with the whole in mind.",
    includedLabel: "Including",
    wholeTitle: "One team. One whole.",
    wholeText:
      "When strategy, design, technology and marketing are planned together, every part gets stronger. You get one point of contact, shared goals and a digital presence that works as a whole.",
    wholePoints: [
      "One contact person throughout the project",
      "Shared goals and metrics across every channel",
      "A design system that keeps your brand consistent",
    ],
  },

  servicePage: {
    servicesCrumb: "Services",
    included: "What's included",
    includedLead: "Everything is tailored to your goals, but this is what the service typically covers.",
    fit: "A good fit if",
    approach: "How it works",
    tools: "Platforms & tools",
    faq: "Frequently asked questions",
    related: "Related services",
    ctaTitle: "Let's talk about your project.",
    ctaText: "Tell us what you need, and we'll come back with thoughts and a suggested next step.",
  },

  workPage: {
    eyebrow: "Work",
    title: "Selected work",
    lead: "A selection of digital experiences we've created for ambitious businesses.",
  },

  caseStudy: {
    workCrumb: "Work",
    client: "Client",
    industry: "Industry",
    location: "Location",
    year: "Year",
    services: "Services",
    challenge: "The challenge",
    strategy: "The strategy",
    solution: "The solution",
    results: "Results",
    gallery: "Gallery",
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile",
    visitSite: "Visit the website",
    ctaTitle: "Have a project in mind?",
    ctaText: "Tell us about your goals and we'll help you find the right way forward.",
    nextProject: "Next project",
    backToWork: "Back to all work",
  },

  aboutPage: {
    eyebrow: "About",
    title: "A digital partner for businesses that want to grow.",
    lead: "Nordic Pixel is a full-service digital agency. We bring strategy, design, technology and marketing together in one team — so your digital presence works as a whole.",
    storyTitle: "The whole makes the difference.",
    story: [
      "Many businesses have a website, a few social channels and some ads — but no whole. The result is fragmented: different suppliers, different messages and no clear picture of what actually works.",
      "We believe in the opposite. When strategy, design, technology and marketing are planned together, every part gets stronger. That's why we work as a long-term partner, not as a supplier of one-off deliverables.",
    ],
    valuesTitle: "What we stand for",
    values: [
      { title: "Clarity", text: "Simple explanations, clear proposals and no hidden costs." },
      { title: "Craft", text: "We care about the details — in design, code and copy." },
      { title: "Partnership", text: "We think long-term and work closely with your team." },
      { title: "Measurability", text: "We follow up on our work and make decisions based on data." },
    ],
    capabilitiesTitle: "One team, the whole chain",
    capabilitiesLead: "Everything needed to build and develop a strong digital presence — in one place.",
    capabilities: [
      "Strategy & insight",
      "UX & design",
      "Web & e-commerce development",
      "SEO & advertising",
      "Brand & content",
      "Maintenance & support",
    ],
    nordicTitle: "Scandinavian design. International reach.",
    nordicText:
      "To us, Scandinavian design means simplicity, function and respect for the user — principles that work in every market. Sweden is our home market, and we work in Swedish and English with companies that want to grow in Sweden, across the Nordics and throughout Europe.",
  },

  processPage: {
    eyebrow: "Process",
    title: "From idea to growth.",
    lead: "A clear way of working makes projects predictable. Here's how we take a project from the first conversation to launch — and beyond.",
    deliverablesLabel: "You get",
    roleLabel: "Your role",
    stepLabel: "Step",
    modelsTitle: "Ways to work together",
    modelsLead: "We adapt the setup to your needs — from a defined project to a long-term partnership.",
    models: [
      {
        title: "Project",
        text: "A defined delivery with fixed scope, timeline and price — such as a new website or online store.",
      },
      {
        title: "Ongoing partnership",
        text: "A monthly partnership for SEO, advertising, marketing or continuous development.",
      },
      {
        title: "Maintenance & support",
        text: "Reliable operation, updates and help whenever you need it.",
      },
    ],
  },

  insightsPage: {
    eyebrow: "Insights",
    title: "Insights on web, search and digital growth.",
    lead: "Practical guides and perspectives for businesses that want more from their digital presence.",
    allCrumb: "Insights",
    authorName: "Nordic Pixel",
    moreTitle: "More insights",
    ctaTitle: "Want help taking the next step?",
    ctaText: "Tell us about your goals and we'll help you figure out the next step.",
  },

  contactPage: {
    eyebrow: "Contact",
    title: "Let's talk about your project.",
    lead: "Tell us what you're working on — a new website, an online store or a plan for growth. We'll come back with thoughts and next steps.",
    formTitle: "Project inquiry",
    nextTitle: "What happens next?",
    nextSteps: [
      { title: "We read your inquiry", text: "We review your goals and get back to you, usually within one business day." },
      { title: "An initial conversation", text: "A short call to get to know your business and your needs." },
      { title: "A clear proposal", text: "You receive a proposal with scope, timeline and price." },
    ],
    directTitle: "Contact us directly",
    emailLabel: "Email",
    phoneLabel: "Phone",
    basedIn: "Based in Sweden — working in Swedish and English.",
  },

  thanksPage: {
    eyebrow: "Thank you",
    title: "Thank you for your inquiry!",
    text: "We've received your message and will usually get back to you within one business day.",
    secondary: "Read about our process",
  },

  notFound: {
    eyebrow: "404",
    title: "This page doesn't exist.",
    text: "It may have been moved or removed — or there's a pixel missing in the address.",
    linksTitle: "Perhaps you were looking for",
  },

  error: {
    title: "Something went wrong.",
    text: "An unexpected error occurred. Please try again, or go back to the home page.",
    retry: "Try again",
  },

  legal: {
    updated: "Last updated",
  },
};
