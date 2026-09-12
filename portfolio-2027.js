(() => {
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  let contactModal = document.querySelector("[data-contact-modal]");
  let lastContactTrigger = null;

  body.classList.add("motion-ready");
  document.querySelectorAll(".cursor-light, .project-cursor-preview, .agent-shell").forEach((item) => item.remove());

  if (!contactModal) {
    const modal = document.createElement("div");
    modal.id = "contact";
    modal.className = "contact-modal";
    modal.hidden = true;
    modal.setAttribute("data-contact-modal", "");
    modal.innerHTML = `
      <button class="contact-modal__backdrop" type="button" data-contact-close aria-label="Close contact card"></button>
      <section class="contact-modal__card" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
        <button class="contact-modal__close" type="button" data-contact-close aria-label="Close contact card">&times;</button>
        <p class="eyebrow">Contact</p>
        <h2 id="contact-modal-title">Let's talk about AI product design roles.</h2>
        <p>Jamie is focused on AI product design, research-led systems, and growth-oriented product teams.</p>
        <div class="contact-modal__links" aria-label="Contact actions">
          <a href="mailto:Jamiechou2004@outlook.com"><span>Email</span><em aria-hidden="true">&#8599;</em></a>
          <a href="https://www.linkedin.com/in/jamie-zihan-chou/" target="_blank" rel="noreferrer"><span>LinkedIn</span><em aria-hidden="true">&#8599;</em></a>
          <a href="assets/Jamie_Zhou_Resume.docx" download><span>Resume</span><em aria-hidden="true">&#8595;</em></a>
        </div>
      </section>`;
    body.append(modal);
    contactModal = modal;
  }

  contactModal.querySelector(".contact-modal__backdrop")?.setAttribute("tabindex", "-1");

  const localPageNames = new Set([
    "index.html",
    "work.html",
    "lab.html",
    "about.html",
    "axel.html",
    "chance.html",
    "deloitte.html",
  ]);

  const pageName = (url) => {
    const pathname = new URL(url, window.location.href).pathname;
    return pathname.split("/").filter(Boolean).pop() || "index.html";
  };

  const currentPage = pageName(window.location.href);
  const isCasePage = body.classList.contains("case-study-page");

  const skipLink = document.createElement("a");
  skipLink.className = "skip-link";
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  body.prepend(skipLink);

  const mainContent = document.querySelector("main");
  if (mainContent && !mainContent.id) mainContent.id = "main-content";
  if (mainContent) {
    mainContent.tabIndex = -1;
    const mainUrl = new URL(window.location.href);
    mainUrl.hash = mainContent.id;
    skipLink.href = mainUrl.href;
  }
  const isHomePreview = window.location.pathname.includes("/previews/home-two-cases/");

  const rail = document.createElement("aside");
  rail.className = `portfolio-rail${isCasePage ? " portfolio-rail--case" : ""}`;
  rail.setAttribute("aria-label", isCasePage ? "Case study navigation" : "Portfolio navigation");

  const primaryLinks = [
    ["index.html", "Work"],
    ["about.html", "About"],
    ["lab.html", "Playground"],
  ];
  const projectLinks = [
    ["axel.html", "Axel SaaS"],
    ["chance.html", "Chance AI"],
    ["deloitte.html", "Deloitte x SCADpro"],
  ].filter(([href]) => !isHomePreview || href !== "deloitte.html");
  const chapterSourceLinks = Array.from(document.querySelectorAll(".case-chapter-nav a[href^='#']"));

  const railLink = ({ href, label, index, current = false, caseSection = "" }) => `
    <a class="portfolio-rail__link${current ? " is-current" : ""}" href="${href}" data-label="${label}"${
      caseSection ? ` data-case-rail-link="${caseSection}"` : ""
    }${current ? ' aria-current="page"' : ""}>
      <span class="portfolio-rail__label">${label}</span>
      <span class="portfolio-rail__index" aria-hidden="true">${String(index).padStart(2, "0")}</span>
    </a>`;

  const railToggleIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3"></rect><path class="portfolio-rail__toggle-divider" d="M9 4v16"></path>
      <path class="portfolio-rail__toggle-arrow" d="m16.5 9-3 3 3 3"></path>
    </svg>`;

  const railHeader = `
    <div class="portfolio-rail__header">
      <a class="portfolio-rail__brand" href="${"index.html"}" aria-label="${
        isCasePage ? "Back to selected work" : "Jamie Zhou home"
      }">
        ${
          isCasePage
            ? '<span class="portfolio-rail__back" aria-hidden="true">←</span><span class="portfolio-rail__brand-name">Selected work</span>'
            : '<span class="portfolio-rail__mark"><img src="assets/identity/r2-ribbon.svg" alt="" aria-hidden="true" width="32" height="32"></span><span class="portfolio-rail__brand-name">Jamie Zhou</span>'
        }
      </a>
      <button class="portfolio-rail__toggle" type="button" aria-label="Collapse navigation" aria-expanded="true">
        ${railToggleIcon}
      </button>
    </div>`;

  if (isCasePage) {
    const caseLinks = chapterSourceLinks
      .map((link, index) => {
        const sectionId = link.getAttribute("href").slice(1);
        const label = link.textContent.replace(/^\s*\d+\s*/, "").trim();
        return railLink({ href: `#${sectionId}`, label, index: index + 1, caseSection: sectionId });
      })
      .join("");
    rail.innerHTML = `${railHeader}
      <div class="portfolio-rail__section portfolio-rail__section--case">
        <p class="portfolio-rail__section-title">Table of contents</p>
        <nav class="portfolio-rail__nav" aria-label="Case study table of contents">${caseLinks}</nav>
      </div>`;
  } else {
    const topLinks = primaryLinks
      .map(([href, label], index) => railLink({ href, label, index: index + 1, current: currentPage === href }))
      .join("");
    const workLinks = projectLinks
      .map(([href, label], index) => railLink({ href, label, index: index + 1 }))
      .join("");
    rail.innerHTML = `${railHeader}
      <div class="portfolio-rail__section portfolio-rail__section--primary">
        <nav class="portfolio-rail__nav" aria-label="Primary portfolio pages">${topLinks}</nav>
      </div>
      <div class="portfolio-rail__section portfolio-rail__section--projects">
        <p class="portfolio-rail__section-title">Product design</p>
        <nav class="portfolio-rail__nav" aria-label="Product design case studies">${workLinks}</nav>
      </div>
      <div class="portfolio-rail__section portfolio-rail__section--social">
        <p class="portfolio-rail__section-title">Connect</p>
        <nav class="portfolio-rail__nav" aria-label="Social and contact links">
          <a class="portfolio-rail__link" href="https://www.linkedin.com/in/jamie-zihan-chou/" target="_blank" rel="noreferrer" data-label="LinkedIn">
            <span class="portfolio-rail__label">LinkedIn</span><span class="portfolio-rail__index" aria-hidden="true">↗</span>
          </a>
          <button class="portfolio-rail__link" type="button" data-contact-open data-label="Email Jamie">
            <span class="portfolio-rail__label">Email</span><span class="portfolio-rail__index" aria-hidden="true">@</span>
          </button>
        </nav>
      </div>`;
  }

  skipLink.insertAdjacentElement("afterend", rail);

  const setRailCollapsed = (collapsed) => {
    document.documentElement.dataset.railCollapsed = String(collapsed);
    rail.classList.toggle("is-collapsed", collapsed);
    const toggle = rail.querySelector(".portfolio-rail__toggle");
    toggle?.setAttribute("aria-expanded", String(!collapsed));
    toggle?.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
    try {
      localStorage.setItem("jamie-portfolio-rail", collapsed ? "collapsed" : "open");
    } catch (_) {
      // The rail remains functional when storage is unavailable.
    }
  };

  let railStartsCollapsed = false;
  try {
    railStartsCollapsed = localStorage.getItem("jamie-portfolio-rail") === "collapsed";
  } catch (_) {
    railStartsCollapsed = false;
  }
  setRailCollapsed(railStartsCollapsed);
  rail.querySelector(".portfolio-rail__toggle")?.addEventListener("click", () => {
    setRailCollapsed(document.documentElement.dataset.railCollapsed !== "true");
  });

  rail.querySelectorAll("[data-case-rail-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", targetId);
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      rail.querySelectorAll("[data-case-rail-link]").forEach((item) => {
        const current = item === link;
        item.classList.toggle("is-current", current);
        if (current) item.setAttribute("aria-current", "location");
        else item.removeAttribute("aria-current");
      });
    });
  });

  const audienceStatements = {
    anyone: "I’m Jamie, an AI-native product designer turning complex systems into clear, useful experiences.",
    recruiters: "I design AI products, growth journeys, and research-led systems—and make the impact easy to scan.",
    leaders: "I turn research signals into product direction, interaction systems, and decisions teams can ship.",
    builders: "I work with product and engineering to turn messy AI workflows into focused, buildable experiences.",
  };
  const audienceButtons = Array.from(document.querySelectorAll("[data-audience]"));
  const audienceCopy = document.querySelector("[data-audience-copy]");

  const setAudience = (audience, { updateUrl = true } = {}) => {
    if (!audienceStatements[audience] || !audienceCopy) return;
    audienceButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.audience === audience)));
    audienceCopy.textContent = audienceStatements[audience];
    if (updateUrl && !reducedMotion) {
      audienceCopy.getAnimations().forEach((animation) => animation.cancel());
      audienceCopy.animate(
        [
          { opacity: 0.36, transform: "translateY(5px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    }
    if (!updateUrl) return;
    const url = new URL(window.location.href);
    if (audience === "anyone") url.searchParams.delete("audience");
    else url.searchParams.set("audience", audience);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  if (audienceButtons.length && audienceCopy) {
    const requestedAudience = new URL(window.location.href).searchParams.get("audience");
    setAudience(audienceStatements[requestedAudience] ? requestedAudience : "anyone", { updateUrl: false });
    audienceButtons.forEach((button) => button.addEventListener("click", () => setAudience(button.dataset.audience)));
  }

  // One contextual cursor across the site; native behavior remains for touch and editing.
  let portfolioCursor = document.querySelector("[data-portfolio-cursor]");
  if (!portfolioCursor) {
    portfolioCursor = document.createElement("div");
    portfolioCursor.className = "portfolio-cursor";
    portfolioCursor.dataset.portfolioCursor = "";
    portfolioCursor.setAttribute("aria-hidden", "true");
    portfolioCursor.innerHTML = '<span data-portfolio-cursor-label></span>';
    body.append(portfolioCursor);
  }
  const portfolioCursorLabel = portfolioCursor.querySelector("[data-portfolio-cursor-label]");
  const cursorMedia = matchMedia("(hover: hover) and (pointer: fine)");
  const motionMedia = matchMedia("(prefers-reduced-motion: reduce)");
  let x = -100, y = -100, px = -100, py = -100, frame = 0, shown = false;
  const hideCursor = () => {
    shown = false;
    document.documentElement.classList.remove("portfolio-cursor-active");
    portfolioCursor.dataset.pressed = "false";
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
  const updateTarget = (el) => {
    if (!cursorMedia.matches || motionMedia.matches || !(el instanceof Element) || el.closest('input,textarea,select,[contenteditable="true"],iframe,video')) { hideCursor(); return false; }
    const target = el.closest("a,button,[role='button'],[data-cursor-label]");
    const caseCover = target?.matches(".hp-cover,.project-index__row,[data-cursor-label]");
    const label = caseCover ? "Read case study  ↗" : "";
    if (portfolioCursorLabel.textContent !== label) portfolioCursorLabel.textContent = label;
    portfolioCursor.dataset.hasLabel = String(Boolean(label));
    portfolioCursor.dataset.interactive = String(Boolean(target));
    portfolioCursor.style.width = label ? "248px" : target ? "26px" : "16px";
    return true;
  };
  const paint = () => {
    px += (x-px)*.36; py += (y-py)*.36;
    portfolioCursor.style.transform = `translate3d(${px}px,${py}px,0) translate(-50%,-50%)`;
    frame = Math.abs(x-px)+Math.abs(y-py) > .2 ? requestAnimationFrame(paint) : 0;
  };
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || !updateTarget(event.target)) return;
    const half = portfolioCursor.dataset.hasLabel === "true" ? 128 : 16;
    x = Math.max(half,Math.min(innerWidth-half,event.clientX));
    y = Math.max(34,Math.min(innerHeight-34,event.clientY));
    if (!shown) { px=x; py=y; shown=true; }
    document.documentElement.classList.add("portfolio-cursor-active");
    if (!frame) frame=requestAnimationFrame(paint);
  }, {passive:true});
  window.addEventListener("pointerdown", () => {portfolioCursor.dataset.pressed="true";});
  window.addEventListener("pointerup", () => {portfolioCursor.dataset.pressed="false";});
  window.addEventListener("pointercancel", hideCursor);
  window.addEventListener("scroll", hideCursor, {passive:true});
  window.addEventListener("blur", hideCursor);
  document.documentElement.addEventListener("pointerleave", hideCursor);
  document.addEventListener("keydown", e => {if(e.key === "Tab") hideCursor();});
  document.addEventListener("visibilitychange", () => {if(document.hidden) hideCursor();});
  cursorMedia.addEventListener("change",hideCursor);
  motionMedia.addEventListener("change",hideCursor);

  if (isCasePage && !body.hasAttribute("data-custom-case-hero")) {
    const hero = document.querySelector(".case-hero");
    const caseHero = document.createElement("figure");
    caseHero.className = `case-shell-hero${currentPage === "axel.html" ? " case-shell-hero--axel" : ""} reveal`;
    const heroAssets = {
      "axel.html": ["assets/axel-cover.svg", "Axel restaurant operations product interface"],
      "chance.html": ["Chance-AI-cover-redesign-v1.png", "Chance AI product and growth case study cover"],
    };
    const asset = heroAssets[currentPage];
    caseHero.innerHTML = asset
      ? `<img src="${asset[0]}" alt="${asset[1]}" />`
      : `<div class="case-shell-hero__placeholder" role="img" aria-label="Healthcare AI journey from understanding to trust to action">
          <span>Healthcare AI</span><strong>Understand</strong><i aria-hidden="true"></i><strong>Trust</strong><i aria-hidden="true"></i><strong>Act</strong>
        </div>`;
    hero?.insertAdjacentElement("beforebegin", caseHero);
  }

  const updateChrome = () => {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
    progress?.style.setProperty("transform", `scaleX(${ratio})`);
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  updateChrome();
  window.addEventListener("scroll", updateChrome, { passive: true });
  window.addEventListener("resize", updateChrome, { passive: true });

  document.querySelectorAll(".site-nav").forEach((nav) => {
    let indicator = nav.querySelector(".nav-indicator");
    if (!indicator) {
      indicator = document.createElement("span");
      indicator.className = "nav-indicator";
      indicator.setAttribute("aria-hidden", "true");
      nav.prepend(indicator);
    }

    const links = Array.from(nav.querySelectorAll("a"));
    const activeLink = nav.querySelector('a[aria-current="page"]');

    const moveIndicator = (link, { hovering = false, instant = false } = {}) => {
      if (!link) return;
      nav.classList.toggle("nav-indicator-instant", instant);
      nav.style.setProperty("--nav-indicator-x", `${link.offsetLeft}px`);
      nav.style.setProperty("--nav-indicator-y", `${link.offsetTop}px`);
      nav.style.setProperty("--nav-indicator-width", `${link.offsetWidth}px`);
      nav.style.setProperty("--nav-indicator-height", `${link.offsetHeight}px`);
      nav.classList.add("nav-indicator-ready");
      nav.classList.toggle("is-hovering", hovering);
      indicator.classList.add("is-visible");

      if (instant) {
        window.requestAnimationFrame(() => nav.classList.remove("nav-indicator-instant"));
      }
    };

    const restoreIndicator = (instant = false) => {
      nav.classList.remove("is-hovering");
      if (activeLink) {
        moveIndicator(activeLink, { instant });
      } else {
        indicator.classList.remove("is-visible");
      }
    };

    if (activeLink) moveIndicator(activeLink, { instant: true });

    links.forEach((link) => {
      if (finePointer) {
        link.addEventListener("pointerenter", () => moveIndicator(link, { hovering: true }));
      }
      link.addEventListener("focus", () => moveIndicator(link, { hovering: true }));
    });

    nav.addEventListener("pointerleave", () => restoreIndicator());
    nav.addEventListener("focusout", () => {
      window.requestAnimationFrame(() => {
        if (!nav.contains(document.activeElement)) restoreIndicator();
      });
    });
    window.addEventListener("resize", () => restoreIndicator(true), { passive: true });
    document.fonts?.ready.then(() => restoreIndicator(true));
  });

  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = revealItems.indexOf(entry.target);
          window.setTimeout(() => entry.target.classList.add("is-visible"), Math.min(index, 4) * 45);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -4%" },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (sessionStorage.getItem("jamie-page-transition") === "1" && !reducedMotion) {
    sessionStorage.removeItem("jamie-page-transition");
    body.classList.add("page-entering");
    window.setTimeout(() => body.classList.remove("page-entering"), 460);
  }

  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!link) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.hasAttribute("download") || link.target === "_blank") return;

    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || !localPageNames.has(pageName(target))) return;
    if (target.pathname === window.location.pathname && target.hash) return;

    if (reducedMotion) return;
    event.preventDefault();
    body.classList.add("page-leaving");
    sessionStorage.setItem("jamie-page-transition", "1");
    window.setTimeout(() => window.location.assign(target.href), 220);
  });

  const setMenuOpen = (open, restoreFocus = false) => {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const panel = document.querySelector(".mobile-menu-panel");
    body.classList.toggle("menu-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (panel) panel.inert = !open;
    panel?.setAttribute("aria-hidden", String(!open));
    if (open) window.setTimeout(() => { if (body.classList.contains("menu-open")) panel?.querySelector("a, button")?.focus(); }, 40);
    else if (restoreFocus) toggle?.focus();
  };

  if (header) {
    const toggle = document.createElement("button");
    toggle.className = "mobile-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "mobile-menu");
    toggle.innerHTML = '<span class="mobile-menu-toggle__icon" aria-hidden="true"></span>';
    header.append(toggle);

    const panel = document.createElement("nav");
    panel.id = "mobile-menu";
    panel.inert = true;
    panel.className = "mobile-menu-panel";
    panel.setAttribute("aria-label", "Mobile navigation");
    panel.setAttribute("aria-hidden", "true");

    const canonicalLinks = isCasePage
      ? [["work.html", "Back to selected work"], ...chapterSourceLinks.map((link) => [link.getAttribute("href"), link.textContent.replace(/^\s*\d+\s*/, "").trim()])]
      : primaryLinks.map(([href, label]) => [href, label === "Work" ? "Selected Work" : label]);

    canonicalLinks.forEach(([href, label]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      if (currentPage === href) link.setAttribute("aria-current", "page");
      panel.append(link);
    });

    const contactButton = document.createElement("button");
    contactButton.type = "button";
    contactButton.textContent = "Contact";
    contactButton.setAttribute("data-contact-open", "");
    panel.append(contactButton);

    const resume = document.createElement("a");
    resume.href = "assets/Jamie_Zhou_Resume.docx";
    resume.textContent = "Resume";
    resume.setAttribute("download", "");
    resume.setAttribute("aria-label", "Download Jamie Zhou resume");
    panel.append(resume);

    header.insertAdjacentElement("afterend", panel);
    toggle.addEventListener("click", () => setMenuOpen(!body.classList.contains("menu-open")));
    panel.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) setMenuOpen(false);
    });
  }

  window.addEventListener("pageshow", () => body.classList.remove("page-leaving", "page-entering"));
  window.addEventListener("resize", () => {if (innerWidth > 820 && body.classList.contains("menu-open")) setMenuOpen(false);});

  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const openContact = (trigger) => {
    if (!contactModal) {
      window.location.href = "mailto:Jamiechou2004@outlook.com";
      return;
    }
    lastContactTrigger = trigger?.closest?.(".mobile-menu-panel")
      ? document.querySelector(".mobile-menu-toggle")
      : trigger || document.activeElement;
    contactModal.hidden = false;
    body.classList.add("contact-modal-open");
    requestAnimationFrame(() => {
      contactModal.classList.add("is-open");
      contactModal.querySelector(".contact-modal__close")?.focus();
    });
  };

  const closeContact = () => {
    if (!contactModal || contactModal.hidden) return;
    contactModal.classList.remove("is-open");
    body.classList.remove("contact-modal-open");
    window.setTimeout(() => {
      contactModal.hidden = true;
      if (lastContactTrigger instanceof HTMLElement) lastContactTrigger.focus();
    }, reducedMotion ? 0 : 210);
  };

  document.addEventListener("click", (event) => {
    const opener = event.target instanceof Element ? event.target.closest("[data-contact-open]") : null;
    if (opener) {
      event.preventDefault();
      setMenuOpen(false);
      openContact(opener);
      return;
    }
    if (event.target instanceof Element && event.target.closest("[data-contact-close]")) closeContact();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (contactModal && !contactModal.hidden) closeContact();
      else if (body.classList.contains("menu-open")) setMenuOpen(false, true);
    }

    if (event.key === "Tab" && body.classList.contains("menu-open") && contactModal.hidden) {
      const items = [...document.querySelectorAll(".mobile-menu-toggle,.mobile-menu-panel a,.mobile-menu-panel button")].filter(el => el.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
      return;
    }
    if (event.key !== "Tab" || !contactModal || contactModal.hidden) return;
    const focusable = Array.from(contactModal.querySelectorAll(focusableSelector)).filter(
      (item) => item instanceof HTMLElement && !item.hidden && item.tabIndex >= 0,
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".portfolio-hero__showcase, .work-featured, .work-card, .lab-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--card-x", `${x * 5}px`);
        card.style.setProperty("--card-y", `${y * 5}px`);
        card.style.setProperty("--media-x", `${x * 8}px`);
        card.style.setProperty("--media-y", `${y * 8}px`);
        card.style.setProperty("--media-x-inverse", `${x * -7}px`);
        card.style.setProperty("--media-y-inverse", `${y * -7}px`);
      });

      card.addEventListener("pointerleave", () => {
        ["--card-x", "--card-y", "--media-x", "--media-y", "--media-x-inverse", "--media-y-inverse"].forEach((name) => card.style.removeProperty(name));
      });
    });
  }

  const chapterNav = document.querySelector(".case-chapter-nav");
  const chapterLinks = Array.from(document.querySelectorAll(".case-chapter-nav a[href^='#']"));
  const chapterSections = chapterLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (chapterNav && chapterLinks.length && chapterSections.length) {
    let activeChapterId = "";
    let chapterScrollFrame = 0;

    const positionChapterPill = (link) => {
      if (!(link instanceof HTMLElement)) return;
      window.requestAnimationFrame(() => {
        chapterNav.style.setProperty("--chapter-pill-x", `${link.offsetLeft}px`);
        chapterNav.style.setProperty("--chapter-pill-width", `${link.offsetWidth}px`);
        chapterNav.classList.add("has-active-chapter");

        const linkStart = link.offsetLeft;
        const linkEnd = linkStart + link.offsetWidth;
        const visibleStart = chapterNav.scrollLeft;
        const visibleEnd = visibleStart + chapterNav.clientWidth;
        if (linkStart < visibleStart + 8 || linkEnd > visibleEnd - 8) {
          chapterNav.scrollTo({
            left: Math.max(0, linkStart - (chapterNav.clientWidth - link.offsetWidth) / 2),
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }
      });
    };

    const setChapter = (id) => {
      if (!id || id === activeChapterId) return;
      activeChapterId = id;
      let activeLink = null;
      chapterLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
          activeLink = link;
        } else {
          link.removeAttribute("aria-current");
        }
      });
      document.querySelectorAll("[data-case-rail-link]").forEach((link) => {
        const active = link.getAttribute("data-case-rail-link") === id;
        link.classList.toggle("is-current", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      positionChapterPill(activeLink);
    };

    const syncChapterToScroll = () => {
      if (chapterScrollFrame) return;
      chapterScrollFrame = window.requestAnimationFrame(() => {
        chapterScrollFrame = 0;
        const activationLine = Math.min(280, window.innerHeight * 0.32);
        let currentSection = chapterSections[0];
        chapterSections.forEach((section) => {
          if (section.getBoundingClientRect().top <= activationLine) currentSection = section;
        });
        setChapter(currentSection.id);
      });
    };

    chapterLinks.forEach((link) => {
      link.addEventListener("click", () => setChapter(link.getAttribute("href").slice(1)));
    });

    window.addEventListener("scroll", syncChapterToScroll, { passive: true });
    window.addEventListener("hashchange", syncChapterToScroll);
    window.addEventListener("load", syncChapterToScroll, { once: true });
    window.addEventListener(
      "resize",
      () => {
        positionChapterPill(chapterNav.querySelector(".is-active"));
        syncChapterToScroll();
      },
      { passive: true },
    );

    syncChapterToScroll();
    window.setTimeout(syncChapterToScroll, 180);
  }

  if (body.classList.contains("portfolio-redesign") && !document.querySelector(".site-footer")) {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="site-footer__inner">
        <div>
          <strong>Jamie Zhou</strong>
          <p>AI-native product designer · Research, growth, systems, motion</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="work.html">Work</a>
          <a href="lab.html">Playground</a>
          <a href="about.html">About</a>
          <a href="mailto:Jamiechou2004@outlook.com">Email</a>
          <a href="https://www.linkedin.com/in/jamie-zihan-chou/" target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </div>`;
    body.append(footer);
  }
  if (isHomePreview) {
    document.querySelectorAll('a[href="index.html"]').forEach(link => {
      link.href = window.location.pathname;
    });
  }

  const coverVideos = [...document.querySelectorAll('[data-cover-video]')];
  let animationPaused = false;
  let animationToggle;
  if (coverVideos.length) {
    animationToggle = document.createElement('button');
    animationToggle.type = 'button';
    animationToggle.className = 'cover-motion-toggle';
    animationToggle.textContent = 'Pause animation';
    animationToggle.setAttribute('aria-pressed', 'false');
    const placement = document.querySelector('.hp-heading,.portfolio-section-heading');
    placement?.append(animationToggle);
    animationToggle.addEventListener('click', () => {
      animationPaused = !animationPaused;
      animationToggle.textContent = animationPaused ? 'Play animation' : 'Pause animation';
      animationToggle.setAttribute('aria-pressed', String(animationPaused));
      document.dispatchEvent(new Event('cover-playback-change'));
    });
  }
  coverVideos.forEach(video => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    const sync = () => {
      if (animationToggle) animationToggle.hidden = motion.matches;
      if (motion.matches || animationPaused || document.hidden || !visible) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener('cover-playback-change', sync);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {visible = entries[0].isIntersecting; sync();}, {threshold: .05}).observe(video);
    sync();
  });
})();
