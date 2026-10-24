import type { StructuredArticlePair } from "./types";

const article: StructuredArticlePair = {
  slug: "shpejtesia-e-website-it",
  published: "2026-10-22",
  sq: {
    metaTitle: "Shpejtësia e website-it pa zhargon: Core Web Vitals për bizneset",
    metaDescription:
      "LCP, INP dhe CLS në gjuhë të thjeshtë: si ta matni shpejtësinë e faqes falas dhe 6 shkaqet më të shpeshta pse një website hapet ngadalë.",
    keywords: ["shpejtësia e website", "core web vitals", "pagespeed", "website i ngadaltë", "optimizim shpejtësie"],
    category: "Web Design",
    title: "Shpejtësia e website-it, pa zhargon: pse çdo sekondë ka rëndësi",
    description: "Askush s'pret një faqe që s'hapet. Ja si ta kuptoni sa e shpejtë është faqja juaj, çfarë mat Google dhe çfarë e ngadalëson zakonisht.",
    breadcrumb: "Shpejtësia",
    date: "Tetor 2026",
    readTime: "8 min lexim",
    related: [
      { slug: "mirembajtja-e-website-it", title: "Mirëmbajtja e website-it: çfarë duhet bërë çdo muaj (dhe pse s'është luks)", category: "Web Design" },
      { slug: "gabimet-kryesore-ne-website", title: "Gabimet që bëjnë bizneset në website (dhe si i rregullojmë)", category: "UX" },
    ],
    blocks: [
      { p: "Mendoni herën e fundit që hapët një faqe në telefon dhe ekrani mbeti bosh. Sa sekonda pritët para se të ktheheshit prapa? Vizitorët tuaj bëjnë saktësisht të njëjtën gjë, dhe s'ju thonë pse s'ju shkruan." },
      { p: "Shpejtësia s'është vetëm çështje teknike. Ndikon te sa njerëz e shohin faqen deri në fund, sa ju kontaktojnë, dhe është një nga sinjalet që Google merr parasysh. Lajmi i mirë: s'ju duhet të jeni programues për ta kuptuar." },

      { h2: "Tri numrat që mat Google" },
      { p: "Google i quan Core Web Vitals. Emrat tingëllojnë teknikë, por secili mat diçka që e ndien çdo vizitor:" },
      { ul: [
        "**LCP (Largest Contentful Paint): sa shpejt shfaqet pjesa kryesore.** Zakonisht titulli ose fotoja e madhe. Google e quan të mirë kur ndodh brenda **2.5 sekondave**.",
        "**INP (Interaction to Next Paint): sa shpejt reagon faqja kur e prekni.** Shtypni një buton dhe s'ndodh asgjë për një çast? Kjo është INP. I mirë: nën **200 milisekonda**.",
        "**CLS (Cumulative Layout Shift): sa \"kërcen\" faqja ndërsa hapet.** Doni të shtypni një link, ngarkohet një foto sipër dhe shtypni diçka tjetër. I mirë: nën **0.1**.",
      ] },
      { p: "Google i vlerëson këto sipas përvojës së vizitorëve realë, në 75% të vizitave. Pra s'mjafton që faqja të jetë e shpejtë në kompjuterin tuaj në zyrë; duhet të jetë e shpejtë edhe në telefonin e klientit, me internetin e tij." },

      { h2: "Si ta matni falas, në 2 minuta" },
      { ol: [
        "Hapni **PageSpeed Insights** (pagespeed.web.dev) dhe shkruani adresën e faqes suaj.",
        "Shikoni pjesën e sipërme, \"Discover what your real users are experiencing\". Ato janë të dhëna nga vizitorë realë, nëse faqja ka mjaftueshëm trafik.",
        "Pjesa poshtë, me pikët nga 0 në 100, është një test i simuluar në një telefon të ngadaltë. E dobishme për të gjetur problemet, por mos u frikësoni nga numri: s'është e njëjta gjë me përvojën reale.",
      ] },
      { note: "Pikët e laboratorit (p.sh. 60 nga 100) dhe të dhënat reale shpesh ndryshojnë. Një faqe me shumë animacione mund të marrë pikë të ulëta në test dhe megjithatë të hapet shpejt për vizitorët realë. Vendimet merrini kryesisht nga të dhënat reale." },

      { h2: "6 shkaqet më të shpeshta të një faqeje të ngadaltë" },
      { ol: [
        "**Foto shumë të rënda.** Një foto direkt nga telefoni ose aparati mund të jetë disa megabajt. Në web duhet të jetë shumë më e vogël, në formate si WebP ose AVIF, dhe në madhësinë që shfaqet.",
        "**Shumë plugin-e ose skripte.** Çdo shtesë (chat, statistika, slider, efekte) shton kod që telefoni duhet ta shkarkojë dhe ekzekutojë.",
        "**Hosting i lirë dhe i mbingarkuar.** Serveri përgjigjet ngadalë para se të nisë çdo gjë tjetër.",
        "**Tema \"për gjithçka\".** Disa tema WordPress ngarkojnë funksione që s'i përdorni kurrë.",
        "**Fonte të shumta.** Katër familje shkronjash, secila me pesë trashësi, janë shumë.",
        "**Video që ngarkohet automatikisht** në krye të faqes, sidomos në telefon.",
      ] },

      { h2: "Çfarë mund të bëni vetë sot" },
      { ul: [
        "Zvogëloni fotot para se t'i ngarkoni (ka mjete falas online për këtë).",
        "Çaktivizoni plugin-et që s'i përdorni më.",
        "Hiqni slider-in në krye nëse s'ka arsye të fortë. Një foto e mirë dhe një titull i qartë zakonisht punojnë më mirë.",
        "Kontrolloni faqen në telefonin tuaj me internet celular, jo me Wi-Fi të zyrës.",
      ] },

      { h2: "Kur duhet ndihmë" },
      { p: "Nëse faqja mbetet e ngadaltë pasi keni bërë të sipërmet, problemi zakonisht është më thellë: te tema, hosting-u ose mënyra si është ndërtuar faqja. Ndonjëherë rregullohet me optimizim; ndonjëherë është një nga shenjat që [faqes i duhet rindërtim](/blog/kur-duhet-website-i-ri)." },
      { p: "Optimizimi i shpejtësisë është pjesë e paketave tona të [website-it](/services/website) dhe e [mirëmbajtjes mujore](/services/mirembajtja)." },
    ],
    cta: { title: "Doni të dini pse faqja juaj është e ngadaltë?", body: "Na dërgoni linkun dhe ju themi tre shkaqet kryesore dhe çfarë kushton rregullimi.", button: "Kontrollo shpejtësinë →" },
  },
  en: {
    metaTitle: "Website Speed Without the Jargon: Core Web Vitals for Businesses",
    metaDescription:
      "What LCP, INP and CLS mean in plain language, how to measure your site's speed for free, and the 6 most common reasons a website loads slowly.",
    keywords: ["website speed", "core web vitals", "pagespeed", "slow website", "speed optimisation"],
    category: "Web Design",
    title: "Website Speed Without the Jargon: Why Every Second Counts",
    description: "Nobody waits for a page that won't load. Here's how to tell how fast your site is, what Google measures, and what usually slows it down.",
    breadcrumb: "Speed",
    date: "October 2026",
    readTime: "8 min read",
    related: [
      { slug: "mirembajtja-e-website-it", title: "Website Maintenance: What Needs Doing Every Month (and Why It's Not a Luxury)", category: "Web Design" },
      { slug: "gabimet-kryesore-ne-website", title: "The Mistakes Businesses Make on Their Website (and How We Fix Them)", category: "UX" },
    ],
    blocks: [
      { p: "Think of the last time you opened a page on your phone and the screen stayed blank. How many seconds did you wait before going back? Your visitors do exactly the same, and they don't tell you why they never got in touch." },
      { p: "Speed isn't only a technical matter. It affects how many people see the page to the end, how many contact you, and it's one of the signals Google takes into account. The good news: you don't need to be a developer to understand it." },

      { h2: "The three numbers Google measures" },
      { p: "Google calls them Core Web Vitals. The names sound technical, but each one measures something every visitor feels:" },
      { ul: [
        "**LCP (Largest Contentful Paint): how quickly the main content appears.** Usually the headline or the big image. Google considers it good when it happens within **2.5 seconds**.",
        "**INP (Interaction to Next Paint): how quickly the page reacts when you tap it.** You press a button and nothing happens for a moment? That's INP. Good: under **200 milliseconds**.",
        "**CLS (Cumulative Layout Shift): how much the page \"jumps\" while loading.** You go to tap a link, an image loads above it and you tap something else. Good: under **0.1**.",
      ] },
      { p: "Google assesses these from real visitors' experience, across 75% of visits. So it isn't enough for the site to be fast on your office computer; it has to be fast on your customer's phone, on their connection." },

      { h2: "How to measure it for free in 2 minutes" },
      { ol: [
        "Open **PageSpeed Insights** (pagespeed.web.dev) and enter your site's address.",
        "Look at the top section, \"Discover what your real users are experiencing\". That's data from real visitors, if the site has enough traffic.",
        "The section below, with a score from 0 to 100, is a simulated test on a slow phone. Useful for finding problems, but don't panic about the number: it isn't the same as real experience.",
      ] },
      { note: "Lab scores (say 60 out of 100) and real-user data often differ. A site with lots of animation can score low in the test and still load fast for real visitors. Base decisions mainly on the real-user data." },

      { h2: "The 6 most common causes of a slow site" },
      { ol: [
        "**Images that are too heavy.** A photo straight from a phone or camera can be several megabytes. On the web it should be much smaller, in formats like WebP or AVIF, and at the size it's displayed.",
        "**Too many plugins or scripts.** Every add-on (chat, stats, sliders, effects) adds code the phone has to download and run.",
        "**Cheap, overloaded hosting.** The server responds slowly before anything else can start.",
        "**\"Does everything\" themes.** Some WordPress themes load features you'll never use.",
        "**Too many fonts.** Four font families, each in five weights, is too many.",
        "**Autoplaying video** at the top of the page, especially on phones.",
      ] },

      { h2: "What you can do yourself today" },
      { ul: [
        "Shrink images before uploading them (there are free online tools for this).",
        "Deactivate plugins you no longer use.",
        "Remove the slider at the top unless there's a strong reason for it. One good image and a clear headline usually work better.",
        "Check the site on your own phone over mobile data, not on the office Wi-Fi.",
      ] },

      { h2: "When you need help" },
      { p: "If the site is still slow after all that, the problem usually goes deeper: the theme, the hosting or the way the site was built. Sometimes it can be fixed with optimisation; sometimes it's one of the signs that [the site needs rebuilding](/blog/kur-duhet-website-i-ri)." },
      { p: "Speed optimisation is part of our [website](/services/website) packages and our [monthly maintenance](/services/mirembajtja)." },
    ],
    cta: { title: "Want to know why your site is slow?", body: "Send us the link and we'll tell you the three main causes and what a fix would cost.", button: "Check my speed →" },
  },
};

export default article;
