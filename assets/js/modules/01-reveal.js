/* Module: reveal */
  const initRevealModule = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");

    (() => {
      if (reduce.matches || !fine.matches) return;

      let current = window.scrollY || window.pageYOffset || 0;
      let target = current;
      let raf = 0;
      const ease = 0.12;
      const margin = 50;

      const maxScroll = () =>
        Math.max((document.documentElement.scrollHeight || 0) - window.innerHeight, 0);

      const clamp = (v) => Math.max(0, Math.min(maxScroll(), v));
      const setTarget = (v) => {
        target = clamp(v);
      };

      const step = () => {
        current += (target - current) * ease;
        if (Math.abs(target - current) < 0.25) current = target;
        window.scrollTo(0, current);
        if (current !== target) {
          raf = requestAnimationFrame(step);
        } else {
          raf = 0;
        }
      };

      const run = () => {
        if (!raf) raf = requestAnimationFrame(step);
      };

      const shouldIgnoreWheel = (el) => {
        if (!el) return false;
        return Boolean(
          el.closest(
            "input, textarea, select, [contenteditable='true'], .t-slider, [data-native-scroll], .cf-panel",
          ),
        );
      };

      window.addEventListener(
        "wheel",
        (e) => {
          if (e.ctrlKey || e.metaKey || shouldIgnoreWheel(e.target)) return;
          e.preventDefault();
          setTarget(target + e.deltaY);
          run();
        },
        { passive: false },
      );

      window.addEventListener(
        "keydown",
        (e) => {
          if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
          const page = window.innerHeight * 0.9;
          if (e.key === "PageDown") {
            e.preventDefault();
            setTarget(target + page);
            run();
          } else if (e.key === "PageUp") {
            e.preventDefault();
            setTarget(target - page);
            run();
          } else if (e.key === "Home") {
            e.preventDefault();
            setTarget(0);
            run();
          } else if (e.key === "End") {
            e.preventDefault();
            setTarget(maxScroll());
            run();
          } else if (e.key === " " && !e.shiftKey) {
            e.preventDefault();
            setTarget(target + page);
            run();
          } else if (e.key === " " && e.shiftKey) {
            e.preventDefault();
            setTarget(target - page);
            run();
          }
        },
        { passive: false },
      );

      window.addEventListener(
        "resize",
        () => {
          current = clamp(current);
          setTarget(target);
        },
        { passive: true },
      );
    })();

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
      const candidates = qsa("section, h1, h2, p, button, .btn, .ip-reveal");
      const els = candidates.filter((el) => {
        if (!(el instanceof HTMLElement)) return false;
        if (el.closest(".ip-navbar, .ip-cookie-bar")) return false;
        if (el.classList.contains("ip-no-reveal")) return false;
        return true;
      });
      if (!els.length) return;

      const reveal = (el) => {
        el.classList.add("is-inview");
      };

      const byParent = new Map();
      els.forEach((el) => {
        if (!el.classList.contains("ip-reveal")) el.classList.add("ip-auto-reveal");
        const parent = el.parentElement || el;
        const idx = byParent.get(parent) || 0;
        if (!el.classList.contains("ip-reveal")) {
          const delay = Math.min(idx * 0.1, 0.7);
          el.style.setProperty("--ip-reveal-delay", `${delay.toFixed(2)}s`);
          byParent.set(parent, idx + 1);
        }
      });

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
      const cards = qsa(
        ".ip-spotlight-card, .ip-pricing-agency-card, .ip-pf-card, .t-slide, .contact-item, .ip-contact-luxe__info-card, .ip-proof-luxe__item, .ip-proc-card, .cf-budget-card__body, .cf-timeline-chip span, .ip-social-band__item, .ip-footer-luxe__col",
      );
      if (!cards.length) return;

      cards.forEach((card) => {
        card.classList.add("ip-gold-pulse");
        if (!qs(".ip-gold-pulse__glow", card)) {
          const glow = document.createElement("span");
          glow.className = "ip-gold-pulse__glow";
          glow.setAttribute("aria-hidden", "true");
          card.appendChild(glow);
        }
        const onMove = (e) => {
          if (!(e instanceof PointerEvent)) return;
          const r = card.getBoundingClientRect();
          if (r.width < 1) return;
          card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
          card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
          card.style.setProperty("--pulse-x", `${e.clientX - r.left}px`);
          card.style.setProperty("--pulse-y", `${e.clientY - r.top}px`);
          card.classList.add("is-pulse-active");
        };
        const onLeave = () => {
          card.style.removeProperty("--spot-x");
          card.style.removeProperty("--spot-y");
          card.style.removeProperty("--pulse-x");
          card.style.removeProperty("--pulse-y");
          card.classList.remove("is-pulse-active");
        };
        card.addEventListener("pointermove", onMove, { passive: true });
        card.addEventListener("pointerleave", onLeave, { passive: true });
      });
    })();

    (() => {
      if (reduce.matches || !fine.matches) return;
      const btns = qsa(
        ".ip-magnetic, .hero-btn--primary, .cf-btn--primary, .ip-footer-luxe__cta, .ip-navbar__cta, .floating-whatsapp",
      );
      if (!btns.length) return;

      const uniqueBtns = Array.from(new Set(btns));
      const strength = 0.18;
      const maxPx = 10;
      const distance = 50;

      uniqueBtns.forEach((btn) => {
        if (btn.classList.contains("hero-btn--outline")) return;
        btn.classList.add("ip-magnetic-target");
        btn.style.setProperty("--mag-x", "0px");
        btn.style.setProperty("--mag-y", "0px");
      });

      const onMove = (e) => {
        uniqueBtns.forEach((btn) => {
          if (!btn.classList.contains("ip-magnetic-target")) return;
          const r = btn.getBoundingClientRect();
          const inRange =
            e.clientX >= r.left - distance &&
            e.clientX <= r.right + distance &&
            e.clientY >= r.top - distance &&
            e.clientY <= r.bottom + distance;

          if (!inRange) {
            btn.style.setProperty("--mag-x", "0px");
            btn.style.setProperty("--mag-y", "0px");
            btn.classList.remove("ip-magnetic-active");
            return;
          }

          const dx = (e.clientX - (r.left + r.width / 2)) * strength;
          const dy = (e.clientY - (r.top + r.height / 2)) * strength;
          const mx = Math.max(-maxPx, Math.min(maxPx, dx));
          const my = Math.max(-maxPx, Math.min(maxPx, dy));
          btn.style.setProperty("--mag-x", `${mx.toFixed(2)}px`);
          btn.style.setProperty("--mag-y", `${my.toFixed(2)}px`);
          btn.classList.add("ip-magnetic-active");
        });
      };

      const resetAll = () => {
        uniqueBtns.forEach((btn) => {
          btn.style.setProperty("--mag-x", "0px");
          btn.style.setProperty("--mag-y", "0px");
          btn.classList.remove("ip-magnetic-active");
        });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", resetAll, { passive: true });
      window.addEventListener("blur", resetAll);
      uniqueBtns.forEach((btn) => {
        btn.addEventListener("blur", resetAll);
      });
    })();
  };
  initRevealModule();

  /* Lartësi navbar (fixed)   --ip-nav-offset për body padding; pa ndryshim pamjeje në scroll */
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

