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

  const setMenuOpen = (open) => {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const panel = document.querySelector(".mobile-menu-panel");
    body.classList.toggle("menu-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    panel?.setAttribute("aria-hidden", String(!open));
    if (open) window.setTimeout(() => panel?.querySelector("a, button")?.focus(), 40);
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
    panel.className = "mobile-menu-panel";
    panel.setAttribute("aria-label", "Mobile navigation");
    panel.setAttribute("aria-hidden", "true");

    const canonicalLinks = [
      ["index.html", "Home"],
      ["work.html", "Selected Work"],
      ["lab.html", "Playground"],
      ["about.html", "About"],
    ];

    canonicalLinks.forEach(([href, label]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      if (pageName(window.location.href) === href) link.setAttribute("aria-current", "page");
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
      else if (body.classList.contains("menu-open")) setMenuOpen(false);
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
          <p>AI-native product designer · Research, growth, systems, motion · 2027</p>
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
})();
