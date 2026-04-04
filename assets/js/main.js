/* ==============================
   Illyrian Pixel – main.js (clean)
   Requires: Bootstrap JS (bundle) loaded before this file
   ============================== */

/* Helpers */
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => Array.from(p.querySelectorAll(s));
const hasBootstrap = () => typeof window.bootstrap !== "undefined";

document.addEventListener("DOMContentLoaded", () => {

  /* Hero helmet — parallax + liquid vars (respekt për reduced-motion) */
  (() => {
    const stage = qs("#heroHelmetStage");
    if (!stage) return;
    const img = qs(".hero-helmet-img", stage);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let ticking = false;
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
        ticking = false;
      });
    }, { passive: true });

    stage.addEventListener("mouseleave", () => {
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

  /* Mobile nav close: link click + outside + ESC -----------------------------------------------------------------------------------------*/
  (() => {
    const nav = qs("#ipNav");
    if (!nav || !hasBootstrap()) return;

    const toggler = qs('[data-bs-target="#ipNav"]');
    const panel = qs(".ip-mobile-panel", nav) || nav;

    const isMobile = () => window.matchMedia("(max-width: 991.98px)").matches;
    const isOpen = () => nav.classList.contains("show");
    const collapse = () => window.bootstrap.Collapse.getOrCreateInstance(nav, { toggle: false });

    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const isDropdownToggle =
        a.classList.contains("dropdown-toggle") ||
        a.getAttribute("data-bs-toggle") === "dropdown";

      if (isDropdownToggle) return;
      if (!isMobile() || !isOpen()) return;

      collapse().hide();
    });

    document.addEventListener("click", (e) => {
      if (!isMobile() || !isOpen()) return;
      const clickedInside = panel.contains(e.target);
      const clickedToggler = toggler && toggler.contains(e.target);
      if (!clickedInside && !clickedToggler) collapse().hide();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMobile() && isOpen()) collapse().hide();
    });
  })();

  /* Mega menu hover (desktop) – requires #megaMenu id in HTML ----------------------------------------------------------------------*/
  (() => {
    if (!hasBootstrap()) return;

    const mq = window.matchMedia("(min-width: 992px)");
    const megaItem = qs(".ip-mega");
    const trigger = qs("#megaServices");
    const menu = qs("#megaMenu");
    if (!megaItem || !trigger || !menu) return;

    let dd = null;
    let openTimer = null;
    let closeTimer = null;
    let bound = false;

    const init = () => {
      dd = window.bootstrap.Dropdown.getOrCreateInstance(trigger, {
        autoClose: "outside",
        popperConfig: { strategy: "fixed" }
      });
    };

    const open = () => {
      clearTimeout(closeTimer);
      openTimer = setTimeout(() => dd && dd.show(), 80);
    };

    const close = () => {
      clearTimeout(openTimer);
      closeTimer = setTimeout(() => dd && dd.hide(), 180);
    };

    const bind = () => {
      if (bound) return;
      bound = true;

      init();
      trigger.addEventListener("mouseenter", open);
      menu.addEventListener("mouseenter", () => clearTimeout(closeTimer));
      megaItem.addEventListener("mouseleave", close);

      trigger.addEventListener("shown.bs.dropdown", () => trigger.setAttribute("aria-expanded", "true"));
      trigger.addEventListener("hidden.bs.dropdown", () => trigger.setAttribute("aria-expanded", "false"));
    };

    const unbind = () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      bound = false;
    };

    if (mq.matches) bind();
    mq.addEventListener("change", (e) => (e.matches ? bind() : unbind()));
  })();

  /* Back to top ------------------------------------------------------------------------------------------------------------------*/
  (() => {
    const backToTop = qs("#backToTop");
    if (!backToTop) return;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      backToTop.classList.toggle("is-visible", y > 520);
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
        answer: "Po. Përfshijmë SEO bazë teknik, performance, meta dhe analytics. Për rritje më agresive me Google Ads ose strategji afatgjatë, ndërtojmë plan të dedikuar."
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
        wrap.innerHTML = `
          <div class="faq-msg-avatar">
            <i class="bi bi-stars" aria-hidden="true"></i>
          </div>
          <div class="faq-msg-bubble">
            ${tag ? `<span class="faq-msg-tag">${tag}</span>` : ""}
            ${typing ? `<div class="faq-typing" aria-label="Duke shkruar"><span></span><span></span><span></span></div>` : `<p>${text}</p>`}
          </div>
        `;
      } else {
        wrap.innerHTML = `
          <div class="faq-msg-bubble">
            <p>${text}</p>
          </div>
        `;
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
        createMessage({ type: "ai", text: reply.answer, tag: reply.tag });
      }, 720);
    };

    suggestions.forEach((button) => {
      button.addEventListener("click", () => {
        const question = button.dataset.faqQuestion || button.textContent || "";
        const answer = button.dataset.faqAnswer || "";
        const tag = button.dataset.faqTag || "";

        input.value = question;
        sendQuestion(question, { answer, tag });
        input.value = "";
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
  const budgetSelect = qs("#cBudget", form);
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
      ? `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Duke dërguar...`
      : `Dërgo`;
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

    const topEl = document.querySelector("#contact .section-title") || document.querySelector("#contact");
    if (!topEl) return;

    const nav = document.querySelector(".ip-navbar");
    const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    const y = topEl.getBoundingClientRect().top + window.pageYOffset - (navH + 16);

    window.scrollTo({ top: y, behavior: "smooth" });
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

    // shfaq grupet në panelin aktiv
    showServiceGroup();

    if (doScroll) scrollToContactTop();
  };

  const selectedServices = () =>
    (serviceSelect ? Array.from(serviceSelect.selectedOptions).map((o) => o.value) : []);

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
      budgetText: "€300 – €600",
      timeText: "3–7 ditë",
      budgetValue: "lt-500",
      explain: "Bazuar në përshkrimin tuaj, kjo duket si një website standard me strukturë të qartë dhe funksionalitete bazë."
    },
    ecom: {
      budgetText: "€900 – €1500",
      timeText: "7–14 ditë",
      budgetValue: "1000-2500",
      explain: "Ky projekt kërkon setup më të plotë për katalog, checkout dhe pagesa, ndaj hyn në një gamë e-commerce më serioze."
    },
    seo: {
      budgetText: "€200 – €500 / muaj",
      timeText: "2–4 javë",
      budgetValue: "500-1000",
      explain: "Bazuar në fokusin te SEO ose marketingu, sugjerimi më i përshtatshëm është një plan mujor optimizimi dhe rritjeje."
    },
    photo: {
      budgetText: "€250 – €700",
      timeText: "2–5 ditë",
      budgetValue: "500-1000",
      explain: "Kjo duket si një set fotografie me editim dhe delivery gati për web ose social, me buxhet të moderuar."
    },
    maint: {
      budgetText: "€100 – €200 / muaj",
      timeText: "Mujor",
      budgetValue: "lt-500",
      explain: "Për mirëmbajtje dhe suport të vazhdueshëm, forma më efikase është një plan mujor me update dhe monitorim."
    },
    brand: {
      budgetText: "€300 – €900",
      timeText: "4–10 ditë",
      budgetValue: "500-1000",
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

    // nëse ky panel s’ka grupe, mos bëj gjë
    if (!groups.length) return;

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
      else bad = !String(el.value || "").trim();

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
    if (!smartSelection || !budgetSelect) return;
    budgetSelect.value = smartSelection.budgetValue;
    showPanel(3, true);
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

    if (!validateStep(4)) {
      setStatus("Kontrollo fushat e shënuara.", "err");
      return;
    }

    try {
      setLoading(true);
      setStatus("Po e dërgojmë...", "muted");

      await new Promise(r => setTimeout(r, 900));

      setStatus("U dërgua. Do të kthej përgjigje sa më shpejt.", "ok");
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
      showPanel(1, true);
    } catch (err) {
      setStatus("S’funksionoi. Provo përsëri ose më shkruaj në email.", "err");
    } finally {
      setLoading(false);
    }
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
