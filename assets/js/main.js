/* ==============================
   Illyrian Pixel – main.js (clean)
   Requires: Bootstrap JS (bundle) loaded before this file
   ============================== */

/* Helpers */
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => Array.from(p.querySelectorAll(s));
const hasBootstrap = () => typeof window.bootstrap !== "undefined";

document.addEventListener("DOMContentLoaded", () => {

  /* Follower: pikë + unazë të zeza, lerp; kursori i sistemit mbetet (jo cursor:none) */
  (() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "ip-cursor-dot";
    ring.className = "ip-cursor-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let tx = -100;
    let ty = -100;
    let rx = tx;
    let ry = ty;
    let rafId = 0;
    const lerp = 0.16;
    let visible = false;

    const isTextField = (el) => {
      if (!el || el.nodeType !== 1) return false;
      const t = el.tagName;
      if (t === "TEXTAREA" || t === "SELECT") return true;
      if (t === "INPUT") {
        const type = (el.getAttribute("type") || "text").toLowerCase();
        const nonText = new Set([
          "button", "submit", "reset", "checkbox", "radio", "range", "file", "hidden", "image",
        ]);
        return !nonText.has(type);
      }
      return el.getAttribute("contenteditable") === "true";
    };

    const walkTextHost = (start) => {
      let n = start;
      while (n && n !== document.documentElement) {
        if (isTextField(n)) return n;
        n = n.parentElement;
      }
      return null;
    };

    const isHoverTarget = (start) => {
      if (!start || start.nodeType !== 1) return false;
      const el = start.closest(
        "a[href], button, .btn, [role='button'], input, label, select, summary, .nav-link, .ip-nav-link",
      );
      if (!el) return false;
      if (isTextField(el)) return false;
      if (el.tagName === "INPUT") {
        const type = (el.getAttribute("type") || "").toLowerCase();
        if (type === "hidden") return false;
      }
      return true;
    };

    const setHoverUi = (e) => {
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const textHost = walkTextHost(under);
      document.body.classList.toggle("ip-cursor--text", Boolean(textHost));
      const hover = !textHost && isHoverTarget(under);
      ring.classList.toggle("is-hover", hover);
    };

    const loop = () => {
      rx += (tx - rx) * lerp;
      ry += (ty - ry) * lerp;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (Math.abs(tx - rx) > 0.2 || Math.abs(ty - ry) > 0.2) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
        rx = tx;
        ry = ty;
        ring.style.transform = dot.style.transform;
      }
    };

    const queueFrame = () => {
      if (!rafId) rafId = requestAnimationFrame(loop);
    };

    document.addEventListener(
      "mousemove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!visible) {
          visible = true;
          dot.classList.add("is-visible");
          ring.classList.add("is-visible");
        }
        setHoverUi(e);
        queueFrame();
      },
      { passive: true },
    );

    document.addEventListener("mousedown", () => {
      dot.classList.add("is-down");
      ring.classList.add("is-down");
    });
    document.addEventListener("mouseup", () => {
      dot.classList.remove("is-down");
      ring.classList.remove("is-down");
    });

    document.documentElement.addEventListener("mouseleave", () => {
      visible = false;
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
      document.body.classList.remove("ip-cursor--text");
      ring.classList.remove("is-hover");
    }, { passive: true });

    window.addEventListener(
      "blur",
      () => {
        visible = false;
        dot.classList.remove("is-visible");
        ring.classList.remove("is-visible");
      },
      { passive: true },
    );
  })();

  /* Hero helmet — parallax + liquid vars (respekt për reduced-motion) */
  (() => {
    const stage = qs("#heroHelmetStage");
    if (!stage) return;
    const img = qs(".hero-helmet-img", stage);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let ticking = false;
    let activeT = 0;
    const kickLiquid = () => {
      stage.classList.add("hero-helmet-stage--active");
      window.clearTimeout(activeT);
      activeT = window.setTimeout(() => {
        stage.classList.remove("hero-helmet-stage--active");
      }, 240);
    };

    const paint = (clientX, clientY) => {
      const r = stage.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const x = Math.max(8, Math.min(92, ((clientX - r.left) / r.width) * 100));
      const y = Math.max(8, Math.min(92, ((clientY - r.top) / r.height) * 100));
      stage.style.setProperty("--hx", `${x}%`);
      stage.style.setProperty("--hy", `${y}%`);
      if (img) {
        const px = ((clientX - r.left) / r.width - 0.5) * 14;
        const py = ((clientY - r.top) / r.height - 0.5) * 12;
        img.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      }
    };

    stage.addEventListener("mousemove", (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        paint(e.clientX, e.clientY);
        kickLiquid();
        ticking = false;
      });
    }, { passive: true });

    stage.addEventListener("mouseleave", () => {
      window.clearTimeout(activeT);
      stage.classList.remove("hero-helmet-stage--active");
      stage.style.setProperty("--hx", "50%");
      stage.style.setProperty("--hy", "42%");
      if (img) img.style.transform = "";
    });
  })();

  /* Footer year */
  (() => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  })();

  /* Footer luxe: scroll reveal + subtle parallax */
  (() => {
    const footer = qs("footer#footer.ip-footer-luxe");
    if (!footer) return;

    const parallax = qs(".ip-footer-luxe__parallax", footer);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!reduce.matches && typeof IntersectionObserver !== "undefined") {
      footer.classList.add("will-animate");
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) footer.classList.add("is-revealed");
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px 12% 0px" }
      );
      io.observe(footer);
      requestAnimationFrame(() => {
        const r = footer.getBoundingClientRect();
        if (r.top < (window.innerHeight || 0) * 0.92) footer.classList.add("is-revealed");
      });
    }

    if (reduce.matches || !parallax) return;

    let raf = 0;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = footer.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const visible = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
        const shift = (visible - 0.35) * 22;
        parallax.style.setProperty("--ip-ft-shift", `${shift}px`);
      });
    };

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    sync();
  })();

  /* Scroll progress, reveals, spotlight kartash, magnetic CTA (pa librari) */
  (() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");

    (() => {
      if (reduce.matches) return;
      const doc = document.documentElement;
      if (doc.scrollHeight <= window.innerHeight * 1.12) return;

      const root = document.createElement("div");
      root.className = "ip-scroll-progress";
      root.setAttribute("aria-hidden", "true");
      const fill = document.createElement("span");
      fill.className = "ip-scroll-progress__fill";
      root.appendChild(fill);
      document.body.appendChild(root);

      const sync = () => {
        const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
        const sc = window.scrollY || doc.scrollTop || 0;
        const p = Math.min(1, Math.max(0, sc / max));
        fill.style.transform = `scaleX(${p})`;
      };
      window.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync, { passive: true });
      sync();
    })();

    (() => {
      const els = qsa(".ip-reveal");
      if (!els.length) return;

      const reveal = (el) => {
        el.classList.add("is-inview");
      };

      if (reduce.matches || typeof IntersectionObserver === "undefined") {
        els.forEach(reveal);
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              reveal(en.target);
              io.unobserve(en.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
      );

      els.forEach((el) => {
        io.observe(el);
        requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const vh = window.innerHeight || 0;
          if (r.top < vh * 0.94 && r.bottom > 8) {
            reveal(el);
            io.unobserve(el);
          }
        });
      });
    })();

    (() => {
      if (reduce.matches || !fine.matches) return;
      const cards = qsa(".ip-spotlight-card");
      if (!cards.length) return;

      cards.forEach((card) => {
        const onMove = (e) => {
          if (!(e instanceof PointerEvent)) return;
          const r = card.getBoundingClientRect();
          if (r.width < 1) return;
          card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
          card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
        };
        const onLeave = () => {
          card.style.removeProperty("--spot-x");
          card.style.removeProperty("--spot-y");
        };
        card.addEventListener("pointermove", onMove, { passive: true });
        card.addEventListener("pointerleave", onLeave, { passive: true });
      });
    })();

    (() => {
      if (reduce.matches || !fine.matches) return;
      const btns = qsa(".ip-magnetic");
      if (!btns.length) return;

      const strength = 0.13;
      const maxPx = 10;

      btns.forEach((btn) => {
        const move = (e) => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * strength;
          const dy = (e.clientY - (r.top + r.height / 2)) * strength;
          const mx = Math.max(-maxPx, Math.min(maxPx, dx));
          const my = Math.max(-maxPx, Math.min(maxPx, dy));
          btn.style.setProperty("--mag-x", `${mx}px`);
          btn.style.setProperty("--mag-y", `${my}px`);
        };
        const reset = () => {
          btn.style.setProperty("--mag-x", "0px");
          btn.style.setProperty("--mag-y", "0px");
        };
        btn.addEventListener("pointermove", move, { passive: true });
        btn.addEventListener("pointerleave", reset, { passive: true });
        btn.addEventListener("blur", reset);
      });
    })();
  })();

  /* Lartësi navbar (fixed) → --ip-nav-offset për body padding; pa ndryshim pamjeje në scroll */
  (() => {
    const bar = qs(".ip-navbar");
    if (!bar) return;

    const root = document.documentElement;

    const syncNavOffset = () => {
      const h = Math.ceil(bar.getBoundingClientRect().height);
      root.style.setProperty("--ip-nav-offset", `${h}px`);
    };

    syncNavOffset();
    window.addEventListener("resize", syncNavOffset, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(syncNavOffset).observe(bar);
    }

    if (bar.classList.contains("ip-navbar--luxe")) {
      let scrolledRaf = 0;
      const syncScrolled = () => {
        cancelAnimationFrame(scrolledRaf);
        scrolledRaf = requestAnimationFrame(() => {
          bar.classList.toggle("ip-navbar--scrolled", window.scrollY > 16);
        });
      };
      syncScrolled();
      window.addEventListener("scroll", syncScrolled, { passive: true });
    }
  })();

  /* Active link on scroll (+ data-nav-section për trigger mega Shërbimet) */
  (() => {
    const nav = qs("#ipNav");
    if (!nav || typeof IntersectionObserver === "undefined") return;

    const anchorLinks = qsa('a.nav-link[href^="#"], a.ip-nav-link[href^="#"]', nav);
    const sectionTriggers = qsa("[data-nav-section]", nav);

    const pairs = [];

    anchorLinks.forEach((a) => {
      const href = (a.getAttribute("href") || "").trim();
      if (!href || href === "#") return;
      if (!href.startsWith("#") || href.length < 2) return;
      let sec = null;
      try { sec = document.querySelector(href); } catch (e) { sec = null; }
      if (sec) pairs.push({ sec, el: a });
    });

    sectionTriggers.forEach((el) => {
      const href = (el.getAttribute("data-nav-section") || "").trim();
      if (!href || href.length < 2) return;
      let sec = null;
      try { sec = document.querySelector(href); } catch (e) { sec = null; }
      if (sec) pairs.push({ sec, el });
    });

    if (!pairs.length) return;

    const allEls = pairs.map((p) => p.el);

    const setActive = (activeEl) => {
      allEls.forEach((x) => x.classList.remove("active"));
      if (activeEl) activeEl.classList.add("active");
    };

    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const match = pairs.find((x) => x.sec === visible.target);
      if (match) setActive(match.el);
    }, { rootMargin: "-30% 0px -60% 0px", threshold: [0.12, 0.25, 0.5] });

    pairs.forEach((x) => obs.observe(x.sec));
  })();

  /* Mobile nav: custom drawer state (stable on mobile) ----------------------------------------------------------------------------------*/
  (() => {
    const bar = qs("#ipNavbar");
    const nav = qs("#ipNav");
    if (!bar || !nav) return;

    const toggler = qs(".ip-toggler", bar);
    const backdrop = qs(".ip-nav-backdrop", nav);
    const closeBtn = qs(".ip-close", nav);

    const isMobile = () => window.matchMedia("(max-width: 991.98px)").matches;
    const isOpen = () => bar.classList.contains("ip-nav-open");
    const syncAria = () => toggler?.setAttribute("aria-expanded", isOpen() ? "true" : "false");
    const open = () => {
      bar.classList.add("ip-nav-open");
      document.body.classList.add("ip-nav-open");
      syncAria();
    };
    const close = () => {
      bar.classList.remove("ip-nav-open");
      document.body.classList.remove("ip-nav-open");
      syncAria();
    };
    const toggle = () => (isOpen() ? close() : open());

    window.ipOpenNav = open;
    window.ipCloseNav = close;
    window.ipToggleNav = toggle;

    toggler?.addEventListener("click", (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
      toggle();
    }, true);

    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const isDropdownToggle =
        a.classList.contains("dropdown-toggle") ||
        a.getAttribute("data-bs-toggle") === "dropdown";

      if (isDropdownToggle) return;
      if (!isMobile() || !isOpen()) return;

      close();
    });

    backdrop?.addEventListener("click", (e) => {
      if (!isMobile() || !isOpen()) return;
      e.preventDefault();
      e.stopPropagation();
      close();
    });

    closeBtn?.addEventListener("click", (e) => {
      if (!isMobile() || !isOpen()) return;
      e.preventDefault();
      e.stopPropagation();
      close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMobile() && isOpen()) close();
    });

    window.addEventListener("resize", () => {
      if (!isMobile()) close();
    }, { passive: true });

    syncAria();
  })();

  /* Back to top ------------------------------------------------------------------------------------------------------------------*/
  (() => {
    const backToTop = qs("#backToTop");
    if (!backToTop) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const y = window.scrollY || doc.scrollTop;
      const max = Math.max((doc.scrollHeight || 0) - window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, y / max));
      backToTop.classList.toggle("is-visible", y > 520);
      backToTop.style.setProperty("--bt-progress", String(p));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  })();


  /* Testimonials slider ------------------------------------------------------------------------------------------------------------*/
  (() => {
    const section = qs("#testimonials");
    if (!section) return;

    const slider = qs("#testimonialSlider", section);
    const prevBtn = qs('[data-testimonial-dir="prev"]', section);
    const nextBtn = qs('[data-testimonial-dir="next"]', section);
    const progress = qs("#testimonialProgress", section);
    const cards = qsa("[data-testimonial-card]", section);
    if (!slider || cards.length < 2) return;

    let timer = null;

    const getCardStep = () => {
      const second = cards[1];
      if (!second) return cards[0]?.offsetWidth || 320;
      return Math.abs(second.offsetLeft - cards[0].offsetLeft) || second.offsetWidth || 320;
    };

    const getActiveIndex = () => {
      const center = slider.scrollLeft + (slider.clientWidth / 2);
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const dist = Math.abs(cardCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });

      return bestIdx;
    };

    const syncState = () => {
      const activeIdx = getActiveIndex();
      cards.forEach((card, i) => {
        card.classList.toggle("is-active", i === activeIdx);
        card.classList.toggle("is-inactive", i !== activeIdx);
      });

      if (progress) {
        const ratio = cards.length > 1 ? activeIdx / (cards.length - 1) : 0;
        progress.style.transform = `translateX(${ratio * 260}%)`;
      }
    };

    const scrollByDir = (dir = 1) => {
      slider.scrollBy({ left: getCardStep() * dir, behavior: "smooth" });
    };

    const start = () => {
      stop();
      timer = setInterval(() => scrollByDir(1), 5200);
    };

    const stop = () => { if (timer) clearInterval(timer); timer = null; };

    prevBtn?.addEventListener("click", () => scrollByDir(-1));
    nextBtn?.addEventListener("click", () => scrollByDir(1));

    slider.addEventListener("scroll", syncState, { passive: true });
    window.addEventListener("resize", syncState, { passive: true });

    section.addEventListener("mouseenter", stop);
    section.addEventListener("mouseleave", start);
    section.addEventListener("focusin", stop);
    section.addEventListener("focusout", start);

    syncState();
    start();
  })();

  /* FAQ chat ------------------------------------------------------------------------------------------------------------*/
  (() => {
    const section = qs("#faq");
    if (!section) return;

    const chatWindow = qs("#faqChatWindow", section);
    const form = qs("#faqChatForm", section);
    const input = qs("#faqChatInput", section);
    const suggestions = qsa(".faq-suggestion", section);

    if (!chatWindow || !form || !input) return;

    const cannedAnswers = [
      {
        match: ["website", "faqe", "kushton", "cmim", "çmim"],
        tag: "Website",
        answer: "Për website standard, ndërtimi nis nga €300. Nëse do edhe kujdes mujor, mirëmbajtja fillon nga €100 në muaj me update, siguri dhe suport."
      },
      {
        match: ["kohe", "kohë", "zgjas", "afat"],
        tag: "Afat",
        answer: "Website standard zakonisht mbyllet brenda 3–7 ditësh, ndërsa projektet më të plota planifikohen sipas strukturës, materialeve dhe feedback-ut."
      },
      {
        match: ["seo", "google", "ads"],
        tag: "SEO",
        answer: "Po, përfshijmë SEO bazë dhe ofrojmë plane të avancuara për rritje afatgjatë."
      },
      {
        match: ["e-commerce", "dyqan", "shop", "checkout", "pagesa"],
        tag: "E-commerce",
        answer: "Po ndërtojmë dyqane online me katalog, kategori, checkout dhe integrime pagesash. Çmimi zakonisht lëviz nga €900 deri në €1500 sipas kompleksitetit."
      },
      {
        match: ["foto", "fotografi", "produkte", "product"],
        tag: "Fotografi",
        answer: "Po. Realizojmë fotografi premium për produkte, social dhe katalog, me editim profesional dhe delivery gati për web."
      },
      {
        match: ["mirembajt", "mirëmbajt", "support", "backup", "update"],
        tag: "Mirëmbajtje",
        answer: "Mirëmbajtja përfshin update, backup, monitorim performance, rregullime të vogla dhe suport të vazhdueshëm që faqja të mbetet stabile dhe e sigurt."
      },
      {
        match: ["zotëron", "zoteron", "pronësi", "pronesi", "kod", "dizajn", "copyright"],
        tag: "Kontratë",
        answer: "Pas pagesës dhe dorëzimit të projektit sipas ofertës, ju zotëroni punën e paguar (kod/dizajn/përmbajtje që keni paguar). Për komponentë me licencë palë të tretë zbatohen kushtet e tyre. Detajet fiksohen në kontratë para fillimit."
      },
      {
        match: ["pagesë", "pagese", "avans", "fatur", "invoice", "pagesa"],
        tag: "Pagesë",
        answer: "Zakonisht avans për nisje dhe pjesa tjetër në dorëzim ose sipas fazave në ofertë. Nuk fillon punë intensive pa miratim me shkrim të scope-it dhe kushteve."
      },
      {
        match: ["hosting", "domen", "domain", "server"],
        tag: "Hosting",
        answer: "Hosting dhe domeni janë shpesh kosto e veçantë në emrin tuaj. Ne ju ndihmojmë me konfigurim dhe zgjedhje; çmimet varen nga ofruesi. Nuk i fshehim këto kosto në ofertë."
      },
      {
        match: ["pas lansim", "pas dorëzim", "pas dorezim", "mbështetje pas", "mbeshtetje pas"],
        tag: "Pas lansimit",
        answer: "Pas lansimit ju merrni akses dhe udhëzim bazë. Ofrojmë paketa mirëmbajtjeje me përditësime, backup dhe suport — të ndara nga ndërtimi fillestar, përveç nëse është rënë dakord ndryshe."
      }
    ];

    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      });
    };

    const revealMessage = (el) => {
      requestAnimationFrame(() => el.classList.add("is-visible"));
      scrollToBottom();
    };

    const createMessage = ({ type = "ai", text = "", tag = "", typing = false }) => {
      const wrap = document.createElement("div");
      wrap.className = `faq-msg faq-msg--${type}`;

      if (type === "ai") {
        const avatar = document.createElement("div");
        avatar.className = "faq-msg-avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.innerHTML = "<i class=\"bi bi-stars\" aria-hidden=\"true\"></i>";

        const bubble = document.createElement("div");
        bubble.className = "faq-msg-bubble";

        const label = document.createElement("span");
        label.className = "faq-msg-label";
        label.textContent = "Asistenti Illyrian";
        bubble.appendChild(label);

        if (tag) {
          const tagEl = document.createElement("span");
          tagEl.className = "faq-msg-tag";
          tagEl.textContent = tag;
          bubble.appendChild(tagEl);
        }

        if (typing) {
          const typingDiv = document.createElement("div");
          typingDiv.className = "faq-typing";
          typingDiv.setAttribute("aria-label", "Duke shkruar");
          for (let i = 0; i < 3; i += 1) typingDiv.appendChild(document.createElement("span"));
          bubble.appendChild(typingDiv);
        } else {
          const p = document.createElement("p");
          p.textContent = text;
          bubble.appendChild(p);
        }

        wrap.appendChild(avatar);
        wrap.appendChild(bubble);
      } else {
        const bubble = document.createElement("div");
        bubble.className = "faq-msg-bubble";
        const p = document.createElement("p");
        p.textContent = text;
        bubble.appendChild(p);
        wrap.appendChild(bubble);
      }

      chatWindow.appendChild(wrap);
      revealMessage(wrap);
      return wrap;
    };

    const findAnswer = (question) => {
      const normalized = String(question || "").toLowerCase();
      const hit = cannedAnswers.find((item) => item.match.some((token) => normalized.includes(token)));
      return hit || {
        tag: "Kontakt",
        answer: "Për këtë pyetje ia vlen të flasim shkurt për projektin tënd. Më shkruaj te kontakti dhe të kthejmë përgjigje të qartë me drejtim dhe buxhet orientues."
      };
    };

    const sendQuestion = (question, preset = null) => {
      const cleanQuestion = String(question || "").trim();
      if (!cleanQuestion) return;

      createMessage({ type: "user", text: cleanQuestion });

      const typingEl = createMessage({ type: "ai", typing: true });
      const reply = preset || findAnswer(cleanQuestion);

      window.setTimeout(() => {
        typingEl.remove();
        createMessage({ type: "ai", text: reply.answer, tag: reply.tag || "" });
        scrollToBottom();
      }, 900);
    };

    suggestions.forEach((button) => {
      button.addEventListener("click", () => {
        const question = button.dataset.faqQuestion || button.textContent || "";
        const answer = button.dataset.faqAnswer || "";
        const tag = button.dataset.faqTag || "";

        sendQuestion(question, answer ? { answer, tag } : null);
        input.focus();
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const question = input.value.trim();
      if (!question) return;

      sendQuestion(question);
      input.value = "";
    });

    scrollToBottom();
  })();

  /* Contact wizard + submit (front-end only) -----------------------------------------------------------------------------------------*/
(() => {
  const form = qs("#contactForm");
  if (!form) return;

  const panels = qsa(".cf-panel", form);
  const stepsUI = qsa(".cf-step", form);
  const btnNext = qsa(".cf-next", form);
  const btnBack = qsa(".cf-back", form);

  const serviceSelect = qs("#cService", form);
  const msHost = qs("#cServiceMs", form);
  const msInd = qs("[data-ms-indicator]", form);
  const projectDesc = qs("#cProjectDesc", form);
  const smartCard = qs("#cfSmartCard", form);
  const smartLoading = qs("#cfSmartLoading", form);
  const smartBody = qs("#cfSmartBody", form);
  const smartBudget = qs("#cfSmartBudget", form);
  const smartTime = qs("#cfSmartTime", form);
  const smartText = qs("#cfSmartText", form);
  const smartApply = qs("#cfSmartApply", form);
  const status = qs("#contactStatus", form);
  const submitBtn = qs("#contactSubmit", form);
  const msgHidden = qs("#cMsgHidden", form);
  const contactSuccess = qs("#contactSuccess", form);
  const cfProgressFill = qs("#cfProgressFill", form);
  const cfSummaryServices = qs("#cfSummaryServices", form);
  const cfSummaryDetails = qs("#cfSummaryDetails", form);
  const cfSummaryBudget = qs("#cfSummaryBudget", form);
  const cfSummaryTimeline = qs("#cfSummaryTimeline", form);
  const cfSummaryTimelineWrap = qs("#cfSummaryTimelineWrap", form);
  const formSubmitEndpoint = (form.getAttribute("data-formsubmit-endpoint") || "").trim();

  let step = 1;
  let smartTimer = null;
  let smartSelection = null;
  const customSelects = [];

  const closeCustomSelects = (exceptWrap = null) => {
    customSelects.forEach((entry) => {
      if (entry.wrap === exceptWrap) return;
      entry.wrap.classList.remove("is-open");
      entry.trigger.setAttribute("aria-expanded", "false");
    });
  };

  const enhanceContactSelects = () => {
    qsa("select.form-select", form).forEach((select, index) => {
      if (select.dataset.enhanced === "true") return;

      select.dataset.enhanced = "true";
      select.classList.add("cf-native-select");

      const wrap = document.createElement("div");
      wrap.className = "cf-select";

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "cf-select-trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", `cfSelectMenu-${index}`);

      const menu = document.createElement("div");
      menu.className = "cf-select-menu";
      menu.id = `cfSelectMenu-${index}`;
      menu.setAttribute("role", "listbox");

      const options = Array.from(select.options);
      const placeholderOption = options.find((opt) => opt.disabled) || null;

      options.forEach((opt) => {
        if (opt.disabled) return;

        const optionBtn = document.createElement("button");
        optionBtn.type = "button";
        optionBtn.className = "cf-select-option";
        optionBtn.textContent = opt.textContent || "";
        optionBtn.dataset.value = opt.value;
        optionBtn.setAttribute("role", "option");

        optionBtn.addEventListener("click", () => {
          select.value = opt.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          select.dispatchEvent(new Event("input", { bubbles: true }));
          closeCustomSelects();
          trigger.focus();
        });

        menu.appendChild(optionBtn);
      });

      const sync = () => {
        const selected = options.find((opt) => opt.value === select.value);
        const label = selected?.textContent?.trim() || placeholderOption?.textContent?.trim() || "Zgjidh";
        trigger.textContent = label;
        trigger.classList.toggle("is-placeholder", !select.value);
        trigger.setAttribute("aria-expanded", wrap.classList.contains("is-open") ? "true" : "false");

        qsa(".cf-select-option", menu).forEach((btn) => {
          const isSelected = btn.dataset.value === select.value;
          btn.classList.toggle("is-selected", isSelected);
          btn.setAttribute("aria-selected", isSelected ? "true" : "false");
        });
      };

      trigger.addEventListener("click", () => {
        const willOpen = !wrap.classList.contains("is-open");
        closeCustomSelects(willOpen ? wrap : null);
        wrap.classList.toggle("is-open", willOpen);
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });

      trigger.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          closeCustomSelects();
          wrap.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          qsa(".cf-select-option", menu)[0]?.focus();
        }
        if (e.key === "Escape") {
          wrap.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
        }
      });

      menu.addEventListener("keydown", (e) => {
        const items = qsa(".cf-select-option", menu);
        const currentIndex = items.indexOf(document.activeElement);

        if (e.key === "Escape") {
          e.preventDefault();
          wrap.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
          trigger.focus();
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          items[(currentIndex + 1) % items.length]?.focus();
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
        }
      });

      select.insertAdjacentElement("afterend", wrap);
      wrap.append(trigger, menu);

      select.addEventListener("change", sync);
      sync();

      customSelects.push({ wrap, trigger, menu, sync });
    });

    document.addEventListener("click", (e) => {
      customSelects.forEach((entry) => {
        if (!entry.wrap.contains(e.target) && e.target !== entry.trigger) {
          entry.wrap.classList.remove("is-open");
          entry.trigger.setAttribute("aria-expanded", "false");
        }
      });
    });
  };

  const setStatus = (msg, type = "muted") => {
    if (!status) return;
    status.textContent = msg || "";
    status.className = `small ${type === "ok" ? "text-success" : type === "err" ? "text-danger" : "text-muted"}`;
  };

  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
      ? `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Po hapim email-in...`
      : `Dërgo kërkesën <span aria-hidden="true">→</span>`;
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

  const mark = (el, invalid) => {
    if (!el) return;
    el.classList.toggle("is-invalid", !!invalid);
    el.classList.toggle("is-valid", !invalid);
  };

  const scrollToContactTop = () => {
    // hiq fokusin nga butoni që e klikoje (që mos e mbajë viewport-in poshtë)
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }

    const topEl = document.querySelector("#contact-heading") || document.querySelector("#contact .section-title") || document.querySelector("#contact");
    if (!topEl) return;

    const nav = document.querySelector(".ip-navbar");
    const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    const y = topEl.getBoundingClientRect().top + window.pageYOffset - (navH + 16);

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const buildMailtoLink = () => {
    const name = qs("#cName", form)?.value?.trim() || "";
    const email = qs("#cEmail", form)?.value?.trim() || "";
    const services = selectedServices()
      .map((v) => {
        const opt = Array.from(serviceSelect?.options || []).find((o) => o.value === v);
        return opt?.textContent?.trim() || v;
      })
      .filter(Boolean);
    const details = projectDesc?.value?.trim() || "";
    const budgetChecked = form.querySelector('input[name="budget"]:checked');
    const budgetFromCards =
      budgetChecked?.closest(".cf-budget-card")?.querySelector(".cf-budget-card__range")?.textContent?.trim() || "";
    const budgetFromSelect = qs("#cBudget", form)?.selectedOptions?.[0]?.textContent?.trim() || "";
    const budget = budgetFromCards || budgetFromSelect;

    const timelineChecked = form.querySelector('input[name="timeline"]:checked');
    const timelineMap = { urgent: "Urgjent", normal: "Normal", flexible: "Fleksibël" };
    const timelineFromChips = timelineChecked ? (timelineMap[timelineChecked.value] || timelineChecked.value) : "";
    const timelineFromSelect = qs("#cTimeline", form)?.selectedOptions?.[0]?.textContent?.trim() || "";
    const timeline = timelineFromChips || timelineFromSelect;
    const message = qs("#cMessage", form)?.value?.trim() || msgHidden?.value?.trim() || details;
    const service = services[0] || "";
    const subject = `Kerkese e re nga website - ${service || "Projekt i ri"}`;
    const body = [
      "Pershendetje Illyrian Pixel,",
      "",
      "Po ju kontaktoj nga website-i.",
      "",
      `Emri: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Sherbimet: ${services.length ? services.join(", ") : "-"}`,
      `Buxheti: ${budget || "-"}`,
      `Afati: ${timeline || "-"}`,
      "",
      "Detajet e projektit:",
      details || "-",
      "",
      "Mesazhi final:",
      message || "-",
    ].join("\n");

    return `mailto:info@illyrianpixel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const showPanel = (n, doScroll = true) => {
    step = n;

    panels.forEach(p => p.classList.toggle("is-active", Number(p.dataset.step) === n));

    stepsUI.forEach((s, i) => {
      const idx = i + 1;
      s.classList.toggle("is-active", idx === n);
      s.classList.toggle("is-done", idx < n);
    });
    setStatus("");

    if (cfProgressFill) cfProgressFill.style.width = `${(n / 4) * 100}%`;

    // shfaq grupet në panelin aktiv
    showServiceGroup();

    if (n === 4) refreshSummary();

    if (doScroll) scrollToContactTop();
  };

  const selectedServices = () =>
    (serviceSelect ? Array.from(serviceSelect.selectedOptions).map((o) => o.value) : []);

  const refreshSummary = () => {
    if (!cfSummaryServices || !serviceSelect) return;
    const labels = selectedServices().map((v) => {
      const opt = Array.from(serviceSelect.options).find((o) => o.value === v);
      return opt?.textContent?.trim() || v;
    });
    cfSummaryServices.textContent = labels.length ? labels.join(", ") : "—";

    const name = qs("#cName", form)?.value?.trim() || "";
    const email = qs("#cEmail", form)?.value?.trim() || "";
    const desc = String(projectDesc?.value || "").trim();
    if (cfSummaryDetails) {
      const parts = [name || "—", email || "—"];
      if (desc) parts.push(desc.length > 240 ? `${desc.slice(0, 240)}…` : desc);
      cfSummaryDetails.textContent = parts.join("\n");
    }

    const bud = form.querySelector('input[name="budget"]:checked');
    const budLabel = bud?.closest(".cf-budget-card")?.querySelector(".cf-budget-card__range")?.textContent?.trim();
    if (cfSummaryBudget) cfSummaryBudget.textContent = budLabel || "—";

    const tl = form.querySelector('input[name="timeline"]:checked');
    const tlMap = { urgent: "Urgjent", normal: "Normal", flexible: "Fleksibël" };
    const tlText = tl ? tlMap[tl.value] || tl.value : "";
    if (cfSummaryTimelineWrap && cfSummaryTimeline) {
      if (tlText) {
        cfSummaryTimeline.textContent = tlText;
        cfSummaryTimelineWrap.hidden = false;
      } else {
        cfSummaryTimelineWrap.hidden = true;
      }
    }
  };

  const activeService = () => selectedServices()[0] || "";

  const syncMsUi = () => {
    if (!msHost || !serviceSelect) return;
    qsa(".cf-ms-chip", msHost).forEach((chip) => {
      const v = chip.dataset.value;
      const opt = Array.from(serviceSelect.options).find((o) => o.value === v);
      const on = !!(opt && opt.selected);
      chip.classList.toggle("is-selected", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
    const n = selectedServices().length;
    if (msInd) {
      msInd.classList.remove("is-ok", "is-bad", "is-pending", "is-idle");
      if (n === 0) msInd.classList.add("is-idle");
      else msInd.classList.add("is-ok");
    }
    msHost.classList.remove("is-invalid");
  };

  const initServiceMultiselect = () => {
    if (!serviceSelect || !msHost || serviceSelect.dataset.cfMs === "1") return;
    serviceSelect.dataset.cfMs = "1";
    Array.from(serviceSelect.options).forEach((opt, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cf-ms-chip";
      b.style.animationDelay = `${idx * 55}ms`;
      b.textContent = opt.textContent || "";
      b.dataset.value = opt.value;
      b.setAttribute("aria-pressed", opt.selected ? "true" : "false");
      if (opt.selected) b.classList.add("is-selected");
      b.addEventListener("click", () => {
        opt.selected = !opt.selected;
        serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
      });
      msHost.appendChild(b);
    });
    syncMsUi();
  };

  initServiceMultiselect();

  enhanceContactSelects();

  /* Indikatorë real-time për fushat kryesore */
  (() => {
    qsa(".cf-field-control", form).forEach((input) => {
      const ind = input.closest(".cf-field")?.querySelector(".cf-field-indicator");
      if (!ind) return;

      const setInd = (state) => {
        ind.classList.remove("is-idle", "is-pending", "is-ok", "is-bad");
        ind.classList.add(`is-${state}`);
      };

      let t = null;
      const run = () => {
        const v = String(input.value || "").trim();
        if (!v) {
          setInd("idle");
          return;
        }
        if (input.type === "email") {
          setInd(isValidEmail(input.value) ? "ok" : "bad");
          return;
        }
        if (input.tagName === "TEXTAREA" || input.type === "text") {
          setInd(v.length >= 2 ? "ok" : "bad");
        }
      };

      input.addEventListener("input", () => {
        const v = String(input.value || "").trim();
        if (!v) {
          setInd("idle");
          return;
        }
        setInd("pending");
        window.clearTimeout(t);
        t = window.setTimeout(run, 320);
      });

      input.addEventListener("blur", () => {
        window.clearTimeout(t);
        run();
      });
    });
  })();

  const smartRules = {
    website: {
      budgetText: "€300 – €800",
      timeText: "3–7 ditë",
      budgetValue: "300-800",
      explain: "Bazuar në përshkrimin tuaj, kjo duket si një website standard me strukturë të qartë dhe funksionalitete bazë."
    },
    ecom: {
      budgetText: "€1500 – €3000",
      timeText: "7–14 ditë",
      budgetValue: "1500-3000",
      explain: "Ky projekt kërkon setup më të plotë për katalog, checkout dhe pagesa, ndaj hyn në një gamë e-commerce më serioze."
    },
    seo: {
      budgetText: "€800 – €1500",
      timeText: "2–4 javë",
      budgetValue: "800-1500",
      explain: "Bazuar në fokusin te SEO ose marketingu, sugjerimi më i përshtatshëm është optimizim i strukturuar me buxhet të përshtatshëm."
    },
    photo: {
      budgetText: "€800 – €1500",
      timeText: "2–5 ditë",
      budgetValue: "800-1500",
      explain: "Kjo duket si një set fotografie me editim dhe delivery gati për web ose social, me buxhet të moderuar."
    },
    maint: {
      budgetText: "€300 – €800",
      timeText: "Mujor",
      budgetValue: "300-800",
      explain: "Për mirëmbajtje dhe suport të vazhdueshëm, forma më efikase është një plan mujor me update dhe monitorim."
    },
    brand: {
      budgetText: "€800 – €1500",
      timeText: "4–10 ditë",
      budgetValue: "800-1500",
      explain: "Për identitet vizual bazë ose rifreskim, ky interval mbulon logo, drejtim vizual dhe materiale fillestare."
    }
  };

  const hideSmartEstimate = () => {
    if (!smartCard || !smartLoading || !smartBody) return;
    window.clearTimeout(smartTimer);
    smartCard.hidden = true;
    smartLoading.hidden = true;
    smartBody.hidden = true;
    smartSelection = null;
  };

  const getSmartEstimate = () => {
    const svs = selectedServices();
    const service = svs[0] || "";
    const desc = String(projectDesc?.value || "").toLowerCase();
    const text = `${svs.join(" ")} ${desc}`;

    if (!svs.length && !desc.trim()) return null;

    const has = (v) => svs.includes(v);

    if (/(e-?commerce|shop|dyqan|checkout|pagesa|katalog)/.test(text) || has("ecom")) return smartRules.ecom;
    if (/(seo|marketing|ads|google)/.test(text)) return smartRules.seo;
    if (/(foto|fotografi|produkt|shoot)/.test(text) || has("photo")) return smartRules.photo;
    if (/(mir[ëe]mbajt|update|backup|support|suport)/.test(text) || has("maint")) return smartRules.maint;
    if (/(brand|logo|identitet|template)/.test(text) || has("brand")) return smartRules.brand;
    if (/(website|faqe|landing|portfolio|rezervim|menu)/.test(text) || has("website") || has("ux") || has("other")) return smartRules.website;

    return smartRules.website;
  };

  const renderSmartEstimate = (estimate) => {
    if (!smartCard || !smartLoading || !smartBody || !smartBudget || !smartTime || !smartText) return;
    if (!estimate) {
      hideSmartEstimate();
      return;
    }

    smartSelection = estimate;
    smartCard.hidden = false;
    smartLoading.hidden = false;
    smartBody.hidden = true;

    window.clearTimeout(smartTimer);
    smartTimer = window.setTimeout(() => {
      smartBudget.textContent = estimate.budgetText;
      smartTime.textContent = estimate.timeText;
      smartText.textContent = estimate.explain;
      smartLoading.hidden = true;
      smartBody.hidden = false;
    }, 380);
  };

  const scheduleSmartEstimate = () => {
    const desc = String(projectDesc?.value || "").trim();
    const n = selectedServices().length;

    if (!desc && n === 0) {
      hideSmartEstimate();
      return;
    }

    renderSmartEstimate(getSmartEstimate());
  };

  // cf-group mund të jetë në çdo step => shfaq vetëm grupet brenda panelit aktiv
  const showServiceGroup = () => {
    const svs = selectedServices();
    const panel = panels.find(p => p.classList.contains("is-active"));
    if (!panel) return;

    const groups = qsa(".cf-group", panel);

    if (!groups.length) {
      scheduleSmartEstimate();
      return;
    }

    groups.forEach(g => {
      const on = svs.includes(g.dataset.service);
      g.hidden = !on;

      qsa("[data-required]", g).forEach(el => {
        el.required = on;
        if (!on) el.classList.remove("is-invalid", "is-valid");
      });
    });

    scheduleSmartEstimate();
  };

  const validateStep = (n) => {
    let ok = true;

    const panel = panels.find(p => Number(p.dataset.step) === n);
    if (!panel) return true;

    const fields = qsa("input, select, textarea", panel);

    fields.forEach(el => {
      if (el.disabled || el.type === "hidden") return;
      if (el.type === "radio" && el.name === "budget") return;
      if (el.type === "radio" && el.name === "timeline") return;
      if (el.classList.contains("cf-service-native")) {
        el.classList.remove("is-invalid", "is-valid");
      }

      if (!el.required) {
        el.classList.remove("is-invalid");
        return;
      }

      let bad = false;
      if (el.tagName === "SELECT") {
        bad = el.multiple ? el.selectedOptions.length === 0 : !el.value;
      } else if (el.type === "email") bad = !el.value.trim() || !isValidEmail(el.value);
      else if (el.tagName === "TEXTAREA" && el.id === "cProjectDesc") {
        bad = String(el.value || "").trim().length < 2;
      } else bad = !String(el.value || "").trim();

      mark(el, bad);
      if (el === serviceSelect && el.multiple && msHost) {
        msHost.classList.toggle("is-invalid", bad);
      }
      if (el === serviceSelect && el.multiple && msInd && bad) {
        msInd.classList.remove("is-idle", "is-ok", "is-pending");
        msInd.classList.add("is-bad");
      } else if (el === serviceSelect && el.multiple && msInd && !bad) {
        syncMsUi();
      }
      if (bad) ok = false;
    });

    if (n === 3) {
      const wrap = qs("[data-cf-budget-wrap]", panel);
      const budgetSelect = qs("#cBudget", panel) || qs("#cBudget", form);
      const budgetRadio = panel.querySelector('input[name="budget"]:checked');

      if (budgetSelect) {
        const bad = !String(budgetSelect.value || "").trim();
        mark(budgetSelect, bad);
        if (bad) ok = false;
      } else if (!budgetRadio) {
        ok = false;
        wrap?.classList.add("is-invalid");
      } else {
        wrap?.classList.remove("is-invalid");
      }
    }

    return ok;
  };

  // init
  showPanel(1, false);

  serviceSelect?.addEventListener("change", () => {
    syncMsUi();
    showServiceGroup();
    scheduleSmartEstimate();
  });

  projectDesc?.addEventListener("input", () => {
    window.clearTimeout(smartTimer);
    smartTimer = window.setTimeout(scheduleSmartEstimate, 360);
  });

  smartApply?.addEventListener("click", () => {
    if (!smartSelection) return;
    const r = form.querySelector(`input[name="budget"][value="${smartSelection.budgetValue}"]`);
    if (r) r.checked = true;
    showPanel(3, true);
  });

  form.addEventListener("change", (e) => {
    const t = e.target;
    if (t && t.name === "budget") {
      qs("[data-cf-budget-wrap]", form)?.classList.remove("is-invalid");
    }
  });

  btnNext.forEach(b => b.addEventListener("click", () => {
    if (!validateStep(step)) {
      setStatus("Kontrollo fushat e shënuara.", "err");
      return;
    }
    if (step < 4) showPanel(step + 1, true);
  }));

  btnBack.forEach(b => b.addEventListener("click", () => {
    if (step > 1) showPanel(step - 1, true);
  }));

  form.addEventListener("input", (e) => {
    const el = e.target;
    if (!el) return;

    if (el.name === "email") {
      if (el.classList.contains("is-invalid")) mark(el, !isValidEmail(el.value));
      return;
    }

    if (el.classList.contains("is-invalid") && el.required) {
      const bad = !String(el.value || "").trim();
      mark(el, bad);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    const hp = qs("#cfWebsiteHp", form);
    if (hp && hp.value.trim()) {
      setStatus("Dërgesa nuk u krye. Nëse je njeri, na shkruaj te info@illyrianpixel.com.", "err");
      return;
    }

    if (msgHidden && projectDesc) msgHidden.value = projectDesc.value.trim();

    if (!validateStep(4)) {
      setStatus("Kontrollo fushat e shënuara.", "err");
      return;
    }

    try {
      setLoading(true);
      const hasFormSubmit = /^https:\/\/formsubmit\.co\/.+/i.test(formSubmitEndpoint);

      if (hasFormSubmit) {
        setStatus("Duke dërguar kërkesën...", "muted");
        const payload = new FormData(form);
        payload.delete("website_url_hp");

        const selectedServiceLabels = selectedServices()
          .map((v) => {
            const opt = Array.from(serviceSelect?.options || []).find((o) => o.value === v);
            return opt?.textContent?.trim() || v;
          })
          .filter(Boolean);
        payload.set("services_readable", selectedServiceLabels.join(", "));

        const budgetChecked = form.querySelector('input[name="budget"]:checked');
        const budgetLabel =
          budgetChecked?.closest(".cf-budget-card")?.querySelector(".cf-budget-card__range")?.textContent?.trim() || "";
        if (budgetLabel) payload.set("budget_readable", budgetLabel);

        const timelineChecked = form.querySelector('input[name="timeline"]:checked');
        const timelineMap = { urgent: "Urgjent", normal: "Normal", flexible: "Fleksibël" };
        const timelineLabel = timelineChecked ? (timelineMap[timelineChecked.value] || timelineChecked.value) : "";
        if (timelineLabel) payload.set("timeline_readable", timelineLabel);

        const resp = await fetch(formSubmitEndpoint, {
          method: "POST",
          body: payload,
          headers: { Accept: "application/json" },
        });

        if (!resp.ok) throw new Error("FormSubmit request failed");
      } else {
        setStatus("FormSubmit nuk është konfiguruar ende. Po hapim email-in...", "muted");
        const mailtoLink = buildMailtoLink();
        window.location.href = mailtoLink;
      }

      if (contactSuccess) {
        contactSuccess.hidden = false;
        requestAnimationFrame(() => contactSuccess.classList.add("is-visible"));
      }
      setStatus(
        hasFormSubmit
          ? "Kërkesa u dërgua me sukses. Do të të kontaktojmë sa më shpejt."
          : "Nëse email-i nuk hapet automatikisht, na shkruaj te info@illyrianpixel.com.",
        "ok"
      );

      window.setTimeout(() => {
        if (contactSuccess) {
          contactSuccess.classList.remove("is-visible");
          contactSuccess.hidden = true;
        }
        form.reset();
        hideSmartEstimate();
        syncMsUi();
        qsa(".cf-field-indicator", form).forEach((ind) => {
          ind.classList.remove("is-pending", "is-ok", "is-bad");
          ind.classList.add("is-idle");
        });
        if (msInd) {
          msInd.classList.remove("is-ok", "is-bad", "is-pending");
          msInd.classList.add("is-idle");
        }

        panels.forEach(p => qsa(".is-valid,.is-invalid", p).forEach(x => x.classList.remove("is-valid", "is-invalid")));
        qs("[data-cf-budget-wrap]", form)?.classList.remove("is-invalid");
        showPanel(1, false);
      }, 2600);
    } catch (err) {
      setStatus("Nuk arritem ta hapim email-in. Na shkruaj direkt te info@illyrianpixel.com.", "err");
    } finally {
      setLoading(false);
    }
  });
})();

  /* Cookie consent + optional Google Analytics (vendos ID në data-ip-ga-id në <html>) */
  (() => {
    const LS = "ip_cookie_consent";
    const root = document.documentElement;

    const loadGa = () => {
      const id =
        (root.getAttribute("data-ip-ga-id") || "").trim() ||
        (document.querySelector('meta[name="ip-ga-measurement-id"]')?.getAttribute("content") || "").trim();
      if (!id || window.__ipGaLoaded) return;
      window.__ipGaLoaded = true;
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", id, { anonymize_ip: true });
    };

    const apply = (mode) => {
      if (mode === "analytics") loadGa();
    };

    const existing = localStorage.getItem(LS);
    if (existing === "analytics" || existing === "essential") {
      apply(existing);
      return;
    }

    const bar = document.createElement("div");
    bar.className = "ip-cookie-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-modal", "false");
    bar.setAttribute("aria-live", "polite");
    bar.setAttribute("aria-labelledby", "ipCookieTitle");
    bar.setAttribute("aria-label", "Njoftim për përdorimin e cookies");
    bar.innerHTML = `
      <div class="ip-cookie-bar__panel" role="document">
        <div class="ip-cookie-bar__accent" aria-hidden="true"></div>
        <div class="ip-cookie-bar__container">
          <div class="ip-cookie-bar__row">
            <div class="ip-cookie-bar__text-block">
              <div class="ip-cookie-bar__head">
                <span class="ip-cookie-bar__cookie-ic" aria-hidden="true"><i class="bi bi-cookie"></i></span>
                <h2 id="ipCookieTitle" class="ip-cookie-bar__title">Përdorimi i cookies</h2>
              </div>
              <p class="ip-cookie-bar__copy">
                Përdorim cookies teknike për funksionimin e sigurt të sajtit. Me pëlqimin tuaj lejohet edhe analitikë e përmbledhur e vizitave;
                pa të, aktivizohen vetëm cookies e domosdoshme.
              </p>
              <p class="ip-cookie-bar__more">
                Më shumë: <a href="privacy.html">Politika e privatësisë</a>.
              </p>
            </div>
            <div class="ip-cookie-bar__actions">
              <button type="button" class="ip-cookie-bar__btn ip-cookie-bar__btn--secondary" data-ip-cookie="essential" aria-label="Refuzo statistikat, vetëm cookies të nevojshme">
                Refuzo
              </button>
              <button type="button" class="ip-cookie-bar__btn ip-cookie-bar__btn--primary" data-ip-cookie="analytics" aria-label="Prano cookies dhe statistika">
                Prano
              </button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(bar);
    requestAnimationFrame(() => bar.classList.add("is-visible"));

    const close = () => {
      bar.classList.remove("is-visible");
      window.setTimeout(() => bar.remove(), 320);
    };

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-ip-cookie]");
      if (!btn) return;
      const mode = btn.getAttribute("data-ip-cookie") || "essential";
      localStorage.setItem(LS, mode);
      apply(mode);
      close();
    });
  })();
});

/* Pricing: activate particles on view */
(() => {
  const stage = qs("[data-pricing-stage]");
  if (!stage || typeof IntersectionObserver === "undefined") return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      stage.classList.toggle("is-active", entry.isIntersecting && entry.intersectionRatio > 0.35);
    });
  }, {
    threshold: [0.35, 0.6]
  });

  io.observe(stage);
})();

/* Pricing agency: scroll reveal + billing toggle */
(() => {
  const root = qs("[data-ip-pricing-agency]");
  if (!root) return;

  const billingBtns = root.querySelectorAll(".ip-pricing-agency__billing-btn");
  billingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-billing") || "onetime";
      root.setAttribute("data-billing-mode", mode);
      billingBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
  });

  if (typeof IntersectionObserver === "undefined") {
    root.classList.add("ip-pricing-agency--inview");
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) root.classList.add("ip-pricing-agency--inview");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
  );
  io.observe(root);
})();

/* Pricing page: filterable tier groups (3 packages per category) */
(() => {
  const section = qs("#ipPricingPackages");
  if (!section) return;

  const filters = Array.from(section.querySelectorAll("[data-pkg-filter]"));
  const groups = Array.from(section.querySelectorAll("[data-pkg-group]"));
  if (!filters.length || !groups.length) return;

  const apply = (key) => {
    filters.forEach((btn) => {
      const on = (btn.getAttribute("data-pkg-filter") || "all") === key;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    groups.forEach((g) => {
      const tag = g.getAttribute("data-pkg-group") || "";
      const show = key === "all" || tag === key;
      g.classList.toggle("d-none", !show);
    });
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      apply(btn.getAttribute("data-pkg-filter") || "all");
    });
  });
})();

/* Process: scroll-in steps + line fill */
(() => {
  const root = qs("[data-ip-proc]");
  if (!root || typeof IntersectionObserver === "undefined") return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) root.classList.add("ip-proc--visible");
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );

  io.observe(root);
})();

/* Testimonials: fade-in shell on scroll */
(() => {
  const root = qs("[data-ip-testi]");
  if (!root || typeof IntersectionObserver === "undefined") return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) root.classList.add("ip-testi--visible");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );

  io.observe(root);
})();

/* Footer: smooth scroll + deep-link service */
(() => {
  const footer = qs("#footer");
  if (!footer) return;

  const scrollToId = (id) => {
    const target = qs(id);
    if (!target) return;

    const nav = qs(".ip-navbar");
    const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    const y = target.getBoundingClientRect().top + window.pageYOffset - (navH + 12);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  footer.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return; // ✅ mos e prish JS

    e.preventDefault();

    // optional: ruaj service choice kur klikohen linket te “Shërbime”
    const sv = a.getAttribute("data-service");
    if (sv) {
      try { localStorage.setItem("ip_services_focus", sv); } catch (err) {}
    }

    scrollToId(href);
  });
})();

/* Stable mobile nav fallback */
(() => {
  const initStableMobileNav = () => {
    if (window.__ipStableNavInit) return;

    const bar = document.querySelector("#ipNavbar");
    const nav = document.querySelector("#ipNav");
    const toggler = bar?.querySelector(".ip-toggler");
    const backdrop = nav?.querySelector(".ip-nav-backdrop");
    const closeBtn = nav?.querySelector(".ip-close");

    if (!bar || !nav || !toggler) return;
    window.__ipStableNavInit = true;

    const isMobile = () => window.matchMedia("(max-width: 991.98px)").matches;
    const isOpen = () => bar.classList.contains("ip-nav-open");
    const syncAria = () => toggler.setAttribute("aria-expanded", isOpen() ? "true" : "false");

    const open = () => {
      if (!isMobile()) return;
      bar.classList.add("ip-nav-open");
      document.body.classList.add("ip-nav-open");
      syncAria();
    };

    const close = () => {
      bar.classList.remove("ip-nav-open");
      document.body.classList.remove("ip-nav-open");
      syncAria();
    };

    const toggle = () => (isOpen() ? close() : open());

    window.ipOpenNav = open;
    window.ipCloseNav = close;
    window.ipToggleNav = toggle;

    toggler.addEventListener("click", (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    backdrop?.addEventListener("click", (e) => {
      e.preventDefault();
      close();
    });

    closeBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      close();
    });

    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link || !isMobile() || !isOpen()) return;
      close();
    });

    window.addEventListener("resize", () => {
      if (!isMobile()) close();
    }, { passive: true });

    syncAria();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStableMobileNav, { once: true });
  } else {
    initStableMobileNav();
  }
})();

/* Rebuilt navbar */
(() => {
  const initRebuiltNav = () => {
    const bar = document.querySelector("#ipNavbar.ip-navbar--rebuilt");
    if (!bar) return;

    const toggleBtn = bar.querySelector(".ip-nav-toggle-btn");
    const overlay = bar.querySelector(".ip-nav-overlay");
    const dismiss = bar.querySelector(".ip-nav-dismiss");
    const navLinks = Array.from(bar.querySelectorAll(".ip-nav-panel a"));
    const mobileServicesBtn = bar.querySelector(".ip-mobile-dd");
    const mobileServices = bar.querySelector("#ipMobileServices");
    const mega = bar.querySelector(".ip-mega");
    const megaBtn = bar.querySelector("#megaServices");
    const megaMenu = bar.querySelector("#megaMenu");
    const desktopMq = window.matchMedia("(min-width: 992px)");

    const isMobile = () => !desktopMq.matches;
    const isOpen = () => bar.classList.contains("ip-nav-open");
    const syncAria = () => toggleBtn?.setAttribute("aria-expanded", isOpen() ? "true" : "false");
    const openNav = () => {
      if (!isMobile()) return;
      bar.classList.add("ip-nav-open");
      document.body.classList.add("ip-nav-open");
      syncAria();
    };
    const closeNav = () => {
      bar.classList.remove("ip-nav-open");
      document.body.classList.remove("ip-nav-open");
      syncAria();
    };

    toggleBtn?.addEventListener("click", (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      isOpen() ? closeNav() : openNav();
    });

    overlay?.addEventListener("click", closeNav);
    dismiss?.addEventListener("click", closeNav);

    document.addEventListener("click", (e) => {
      if (!isMobile() || !isOpen()) return;
      const insideDrawer = e.target instanceof Element && e.target.closest(".ip-nav-drawer");
      const clickedToggler = e.target instanceof Element && e.target.closest(".ip-nav-toggle-btn");
      if (!insideDrawer && !clickedToggler) closeNav();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (isMobile()) closeNav();
        else closeMega();
      });
    });

    mobileServicesBtn?.addEventListener("click", () => {
      const expanded = mobileServicesBtn.getAttribute("aria-expanded") === "true";
      mobileServicesBtn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (mobileServices) mobileServices.hidden = expanded;
    });

    const openMega = () => {
      if (!desktopMq.matches || !mega || !megaBtn) return;
      mega.classList.add("is-open");
      megaBtn.classList.add("is-open");
      megaBtn.setAttribute("aria-expanded", "true");
    };
    const closeMega = () => {
      if (!mega || !megaBtn) return;
      mega.classList.remove("is-open");
      megaBtn.classList.remove("is-open");
      megaBtn.setAttribute("aria-expanded", "false");
    };

    megaBtn?.addEventListener("click", (e) => {
      if (!desktopMq.matches) return;
      e.preventDefault();
      e.stopPropagation();
      mega?.classList.contains("is-open") ? closeMega() : openMega();
    });

    /* Desktop: vetëm klik hap/mban dropdown; mbyll kur miu del nga zona .ip-mega (buton + urë + panel) */
    document.addEventListener(
      "click",
      (e) => {
        if (!desktopMq.matches || !mega) return;
        const t = e.target;
        if (!(t instanceof Element)) return;
        if (!mega.contains(t)) closeMega();
      },
      true,
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMega();
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (desktopMq.matches) {
        closeNav();
        if (mobileServicesBtn && mobileServices) {
          mobileServicesBtn.setAttribute("aria-expanded", "false");
          mobileServices.hidden = true;
        }
      } else {
        closeMega();
      }
    }, { passive: true });

    if (mobileServices) mobileServices.hidden = true;
    syncAria();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRebuiltNav, { once: true });
  } else {
    initRebuiltNav();
  }
})();
