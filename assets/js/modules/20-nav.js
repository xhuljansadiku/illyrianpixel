/* Module: nav */
const initNavModule = () => {
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
};
initNavModule();

});

