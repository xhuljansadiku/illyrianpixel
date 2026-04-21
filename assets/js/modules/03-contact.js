/* Module: contact */
const initContactModule = () => {
  window.dataLayer = window.dataLayer || [];
  const track = (eventName, payload = {}) => {
    try {
      window.dataLayer.push({ event: eventName, ...payload });
    } catch (err) {}
  };

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
      : `Dërgo kërkesën <span aria-hidden="true"> →</span>`;
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
    cfSummaryServices.textContent = labels.length ? labels.join(", ") : "";

    const name = qs("#cName", form)?.value?.trim() || "";
    const email = qs("#cEmail", form)?.value?.trim() || "";
    const desc = String(projectDesc?.value || "").trim();
    if (cfSummaryDetails) {
      const parts = [name || "", email || ""];
      if (desc) parts.push(desc.length > 240 ? `${desc.slice(0, 240)}⬦` : desc);
      cfSummaryDetails.textContent = parts.join("\n");
    }

    const bud = form.querySelector('input[name="budget"]:checked');
    const budLabel = bud?.closest(".cf-budget-card")?.querySelector(".cf-budget-card__range")?.textContent?.trim();
    if (cfSummaryBudget) cfSummaryBudget.textContent = budLabel || "";

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
      budgetText: "€300  €800",
      timeText: "37 ditë",
      budgetValue: "300-800",
      explain: "Bazuar në përshkrimin tuaj, kjo duket si një website standard me strukturë të qartë dhe funksionalitete bazë."
    },
    ecom: {
      budgetText: "€1500  €3000",
      timeText: "714 ditë",
      budgetValue: "1500-3000",
      explain: "Ky projekt kërkon setup më të plotë për katalog, checkout dhe pagesa, ndaj hyn në një gamë e-commerce më serioze."
    },
    seo: {
      budgetText: "€800  €1500",
      timeText: "24 javë",
      budgetValue: "800-1500",
      explain: "Bazuar në fokusin te SEO ose marketingu, sugjerimi më i përshtatshëm është optimizim i strukturuar me buxhet të përshtatshëm."
    },
    photo: {
      budgetText: "€800  €1500",
      timeText: "25 ditë",
      budgetValue: "800-1500",
      explain: "Kjo duket si një set fotografie me editim dhe delivery gati për web ose social, me buxhet të moderuar."
    },
    maint: {
      budgetText: "€300  €800",
      timeText: "Mujor",
      budgetValue: "300-800",
      explain: "Për mirëmbajtje dhe suport të vazhdueshëm, forma më efikase është një plan mujor me update dhe monitorim."
    },
    brand: {
      budgetText: "€800  €1500",
      timeText: "410 ditë",
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
        track("ip_contact_submit_success", { method: "formsubmit" });
      } else {
        setStatus("FormSubmit nuk është konfiguruar ende. Po hapim email-in...", "muted");
        const mailtoLink = buildMailtoLink();
        track("ip_contact_submit_mailto_fallback");
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
      track("ip_contact_submit_error");
      setStatus("Nuk arritem ta hapim email-in. Na shkruaj direkt te info@illyrianpixel.com.", "err");
    } finally {
      setLoading(false);
    }
  });
};
initContactModule();

  /* Cookie consent + optional Google Analytics (vendos ID në data-ip-ga-id në <html>) */
  (() => {
    const LS = "ip_cookie_consent";
    const root = document.documentElement;
    const params = new URLSearchParams(window.location.search);
    const forceCookieTest = params.get("cookie-test") === "1";

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

    if (forceCookieTest) {
      localStorage.removeItem(LS);
    }

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
            <header class="ip-cookie-bar__head">
              <span class="ip-cookie-bar__cookie-ic" aria-hidden="true"><i class="bi bi-cookie"></i></span>
              <h2 id="ipCookieTitle" class="ip-cookie-bar__title">Përdorimi i cookies</h2>
            </header>

            <div class="ip-cookie-bar__body">
              <p class="ip-cookie-bar__copy">
                Ky sajt përdor cookies thelbësore për funksionim të sigurt dhe performancë bazë.<br class="ip-cookie-bar__line-break" />
                Me pëlqimin tuaj, mund të aktivizojmë edhe cookies analitike për të kuptuar përdorimin e faqes dhe për të përmirësuar përvojën tuaj.
              </p>
              <p class="ip-cookie-bar__more">
                Më shumë: <a href="/legal/privacy/">Politika e privatësisë</a>.
              </p>
            </div>

            <footer class="ip-cookie-bar__actions">
              <button type="button" class="ip-cookie-bar__btn ip-cookie-bar__btn--secondary" data-ip-cookie="essential" aria-label="Refuzo statistikat, vetëm cookies të nevojshme">
                Refuzo
              </button>
              <button type="button" class="ip-cookie-bar__btn ip-cookie-bar__btn--primary" data-ip-cookie="analytics" aria-label="Prano cookies dhe statistika">
                Prano
              </button>
            </footer>
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

  /* Module: analytics hooks (non-blocking) */
  (() => {
    qsa("a[href='/contact/'], .ip-navbar__cta, .hero-btn--primary").forEach((el) => {
      el.addEventListener("click", () => {
        track("ip_cta_click", {
          cta_text: (el.textContent || "").trim().slice(0, 80),
          cta_href: el.getAttribute("href") || "",
        });
      });
    });

    const contactForm = qs("#contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", () => {
        track("ip_contact_submit_attempt");
      });
    }

    const pkgFilters = qsa("[data-pkg-filter]");
    pkgFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        track("ip_pricing_filter_click", {
          filter: btn.getAttribute("data-pkg-filter") || "all",
        });
      });
    });

    const faqForm = qs("#faqChatForm");
    if (faqForm) {
      faqForm.addEventListener("submit", () => {
        track("ip_faq_question_submit");
      });
    }
  })();
