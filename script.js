const root = document.documentElement;
const progress = document.querySelector(".scroll-progress");
const projectButtons = document.querySelectorAll("[data-project]");
const projectViewer = document.querySelector(".project-viewer");
const labTrack = document.querySelector("[data-drag-scroll]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const agentPanel = document.querySelector("[data-agent-panel]");
const agentToggle = document.querySelector("[data-agent-toggle]");
const agentClose = document.querySelector("[data-agent-close]");
const agentThread = document.querySelector("[data-agent-thread]");
const agentForm = document.querySelector("[data-agent-form]");
const agentInput = document.querySelector("[data-agent-input]");
const agentPrompts = document.querySelectorAll("[data-agent-prompt]");
const agentShell = document.querySelector(".agent-shell");
const viewLinks = document.querySelectorAll("[data-view-link]");
const viewPanels = document.querySelectorAll("[data-view]");
const contactCards = document.querySelectorAll("[data-contact-card]");
const contactKicker = document.querySelector("[data-contact-kicker]");
const contactTitle = document.querySelector("[data-contact-title]");
const contactDetail = document.querySelector("[data-contact-detail]");
const heroSystem = document.querySelector("[data-hero-system]");
const heroRoot = heroSystem?.closest(".hero");
const heroModeButtons = document.querySelectorAll("[data-hero-mode]");
const heroKicker = document.querySelector("[data-hero-kicker]");
const heroTitle = document.querySelector("[data-hero-title]");
const heroDescription = document.querySelector("[data-hero-description]");
const heroMetricLabel = document.querySelector("[data-hero-metric-label]");
const heroMetric = document.querySelector("[data-hero-metric]");
const storyIntro = document.querySelector("[data-story-intro]");
const heroPoster = document.querySelector(".hero-poster");
const availabilityToggle = document.querySelector("[data-availability-toggle]");
const availabilityMenu = document.querySelector("[data-availability-menu]");
const availabilityClose = document.querySelector("[data-availability-close]");
const availabilityLinks = document.querySelectorAll("[data-availability-link]");
const workCanvas = document.querySelector("[data-work-canvas]");
const canvasModeControls = document.querySelectorAll("[data-canvas-mode]");
const companionKicker = document.querySelector("[data-companion-kicker]");
const companionTitle = document.querySelector("[data-companion-title]");
const riveCanvas = document.querySelector("[data-rive-src]");
const projectPreviewTriggers = document.querySelectorAll("[data-project-preview]");
const projectCursorPreview = document.querySelector("[data-project-cursor-preview]");
const projectCursorPreviewImage = document.querySelector("[data-project-preview-image]");
const projectCursorPreviewMock = document.querySelector("[data-project-preview-mock]");
const projectCursorPreviewLabel = document.querySelector("[data-project-preview-label]");
const projectCursorPreviewTitle = document.querySelector("[data-project-preview-title]");
const projectCursorPreviewDescription = document.querySelector("[data-project-preview-description]");
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const canvasModes = {
  research: {
    state: "thinking",
    phase: "research",
    kicker: "Research mode",
    title: "I am reading signals before drawing UI."
  },
  ai: {
    state: "spark",
    phase: "ai",
    kicker: "AI mode",
    title: "I turn model capability into usable behavior."
  },
  system: {
    state: "mapping",
    phase: "system",
    kicker: "System mode",
    title: "I connect messy workflows into one clear structure."
  },
  ui: {
    state: "polish",
    phase: "ui",
    kicker: "UI mode",
    title: "I make the final surface feel obvious."
  },
  chance: {
    state: "spark",
    phase: "ai",
    kicker: "Chance AI",
    title: "Consumer AI product thinking, activation, and commercial UI."
  },
  deloitte: {
    state: "mapping",
    phase: "research",
    kicker: "Deloitte x SCADpro",
    title: "Healthcare AI onboarding and public-safe experience strategy."
  },
  axel: {
    state: "polish",
    phase: "system",
    kicker: "Axel",
    title: "Restaurant SaaS logic shaped from field research."
  }
};
const canvasModeOrder = Object.keys(canvasModes);
const canvasStateOrder = ["thinking", "spark", "mapping", "polish"];

const projects = {
  chance: {
    type: "Consumer AI",
    title: "Chance AI",
    description:
      "Current product work focused on turning AI capability into a consumer-facing experience with clear utility, retention logic, and polished UI execution.",
    role: "Product design, AI workflow, UI execution",
    value: "Commercial To C product thinking",
    focus: "Activation, habit formation, product clarity",
    tag: "AI product system",
    caseUrl: "",
    ctaLabel: "Request current-work walkthrough",
    ctaUrl: "#contact",
    image: "",
    imageAlt: "",
    accent: "#a89cc2",
    points: [
      "Translate AI capability into clear, habit-forming consumer interactions.",
      "Define useful defaults, guided moments, and product surfaces that show value fast.",
      "Connect retention logic with polished UI execution for a current consumer AI product."
    ]
  },
  deloitte: {
    type: "Healthcare AI",
    title: "Deloitte x SCADpro",
    description:
      "A public-safe case frame for a healthcare support platform: registration, information clarity, onboarding, and AI-assisted guidance concepts.",
    role: "Experience strategy, UX optimization, AI guidance concepting",
    value: "Enterprise client context with roadmap-facing recommendations",
    focus: "Information accessibility, onboarding clarity, service trust",
    tag: "NDA-safe case study",
    caseUrl: "",
    ctaLabel: "Request NDA-safe walkthrough",
    ctaUrl: "#contact",
    image: "",
    imageAlt: "",
    accent: "#9dacb5",
    points: [
      "Frame complex healthcare information into a clearer web onboarding experience.",
      "Explore AI-assisted guidance concepts while keeping public case details NDA-safe.",
      "Translate UX evaluation into strategic recommendations for a client-facing product."
    ]
  },
  axel: {
    type: "Restaurant Operation SaaS",
    title: "Axel",
    description:
      "A unified, real-time restaurant operations dashboard for orders, kitchen workflows, and delivery logistics, shaped from field research into an AI-powered daily action center.",
    role: "UX Designer/Researcher, product vision, business strategy, IA, dashboard design",
    value: "Research-backed SaaS concept for 27 independent restaurants",
    focus: "Today’s Summary, unified order view, issue resolution, Define Actions",
    tag: "Figma case board / SaaS dashboard",
    caseUrl: "axel.html",
    ctaLabel: "View Axel case",
    ctaUrl: "axel.html",
    image: "assets/figma-axel-cover.png",
    imageAlt: "Axel Figma case cover showing a restaurant operations dashboard on a laptop",
    accent: "#c89983",
    points: [
      "Translated scattered POS, delivery, kitchen, and staff workflows into one operational decision layer.",
      "Designed Today’s Summary, Unified Order View, issue resolution, roles/permissions, and Define Actions.",
      "Positioned Axel as an AI-powered system that turns complex restaurant data into clear daily actions."
    ]
  }
};

const orderedProjectKeys = Object.keys(projects);
const availableViews = new Set(Array.from(viewPanels, panel => panel.dataset.view));
const heroModes = {
  research: {
    kicker: "Evidence to product logic",
    title: "Research becomes product decisions.",
    description:
      "Mixed-method work, interviews, VOC synthesis, and field research become sharper information architecture and clearer product flows.",
    metricLabel: "Proof signal",
    metric: "Ipsos + 27 restaurant interviews",
    accent: "#315cff"
  },
  ai: {
    kicker: "AI behavior to usable product",
    title: "AI shows up as guidance, not magic.",
    description:
      "Jamie frames AI as user-facing product behavior: useful defaults, clear agency, and moments that help people understand what to do next.",
    metricLabel: "Best read",
    metric: "Chance AI + Deloitte AI concepts",
    accent: "#00a884"
  },
  system: {
    kicker: "Complexity to commercial UI",
    title: "Systems become obvious through interface.",
    description:
      "Operational workflows, onboarding logic, and data-heavy decisions are translated into product surfaces that support action instead of explanation.",
    metricLabel: "Commercial proof",
    metric: "Axel SaaS + healthcare AI web",
    accent: "#f05a28"
  }
};

function getViewFromHash(hash = window.location.hash) {
  const view = hash.replace("#", "") || "work";
  return availableViews.has(view) ? view : "work";
}

function getTargetFromHash(hash = window.location.hash) {
  const targetId = hash.replace("#", "");
  return document.getElementById(targetId) || document.getElementById("top");
}

function setActiveView(view, options = {}) {
  if (!availableViews.size) return;

  const activeView = availableViews.has(view) ? view : "work";
  const { hash = `#${activeView}`, scroll = true, replace = false } = options;

  viewPanels.forEach(panel => {
    const isActive = panel.dataset.view === activeView;
    panel.hidden = !isActive;
    if (isActive) {
      panel.querySelectorAll(".reveal").forEach(element => element.classList.add("is-visible"));
      if (panel.classList.contains("reveal")) {
        panel.classList.add("is-visible");
      }
    }
  });

  viewLinks.forEach(link => {
    const linkHash = link.getAttribute("href") || "";
    const isPrimaryNav = Boolean(link.closest(".site-nav"));
    const isActive =
      isPrimaryNav &&
      !link.hasAttribute("data-view-affordance") &&
      link.dataset.viewLink === activeView &&
      (activeView !== "work" || linkHash === hash);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.body.dataset.activeView = activeView;

  if (hash && window.location.hash !== hash) {
    const nextUrl = `${window.location.pathname}${window.location.search}${hash}`;
    if (replace) {
      window.history.replaceState(null, "", nextUrl);
    } else {
      window.history.pushState(null, "", nextUrl);
    }
  }

  if (scroll) {
    window.requestAnimationFrame(() => {
      if (hash === "#top") {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        return;
      }
      const target = getTargetFromHash(hash);
      target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    });
  }

  if (activeView === "work") {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }

  updateProgress();
}

function initHeroStoryIntro() {
  if (!heroPoster || !window.gsap) return;

  const frame = heroPoster.querySelector(".hero-poster-frame");
  const eyebrow = heroPoster.querySelector(".eyebrow");
  const titleLines = heroPoster.querySelectorAll("#hero-title span");
  const actions = heroPoster.querySelectorAll(".hero-action");
  const lede = heroPoster.querySelector(".hero-lede");
  const infoCard = heroPoster.querySelector(".hero-info-card");
  const identityCard = heroPoster.querySelector(".hero-identity-card");
  const stamps = heroPoster.querySelectorAll(".hero-stamp");
  const stageElements = [infoCard, identityCard, ...stamps].filter(Boolean);
  const motionTargets = [frame, eyebrow, lede, ...titleLines, ...actions, ...stageElements].filter(Boolean);
  const gsapApi = window.gsap;
  const mm = gsapApi.matchMedia();

  mm.add(
    {
      isMobile: "(max-width: 760px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    context => {
      const { isMobile, reduceMotion } = context.conditions;

      if (reduceMotion) {
        if (storyIntro) {
          gsapApi.set(storyIntro, { autoAlpha: 0, display: "none" });
        }
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.body.classList.add("story-intro-lock");

      const introItems = storyIntro
        ? storyIntro.querySelectorAll(".story-intro__kicker, .story-intro__name, .story-intro__role")
        : [];
      const introLine = storyIntro?.querySelector(".story-intro__line");
      const introWipe = storyIntro?.querySelector(".story-intro__wipe");

      if (storyIntro) {
        gsapApi.set(storyIntro, { display: "grid", autoAlpha: 1 });
        gsapApi.set(introItems, { autoAlpha: 0, y: isMobile ? 14 : 20 });
        gsapApi.set(introLine, { scaleX: 0, transformOrigin: "left center" });
        gsapApi.set(introWipe, { xPercent: -102 });
      }

      gsapApi.set(frame, {
        autoAlpha: 0,
        y: isMobile ? 34 : 72,
        scale: isMobile ? 0.98 : 0.94,
        rotationX: isMobile ? 0 : 5,
        transformOrigin: "50% 70%"
      });
      gsapApi.set([eyebrow, lede, ...titleLines, ...actions].filter(Boolean), {
        autoAlpha: 0,
        y: isMobile ? 18 : 32
      });
      gsapApi.set(stageElements, {
        autoAlpha: 0,
        y: isMobile ? 18 : 28,
        scale: 0.96
      });

      const tl = gsapApi.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.classList.remove("story-intro-lock");
          if (storyIntro) {
            gsapApi.set(storyIntro, { display: "none" });
          }
          gsapApi.set(motionTargets, { clearProps: "transform,opacity,visibility" });
        }
      });

      window.setTimeout(() => {
        if (!document.body.classList.contains("story-intro-lock")) return;
        document.body.classList.remove("story-intro-lock");
        if (storyIntro) {
          gsapApi.set(storyIntro, { autoAlpha: 0, display: "none" });
        }
        gsapApi.set(motionTargets, { clearProps: "transform,opacity,visibility" });
      }, 5200);

      if (storyIntro) {
        tl.to(introLine, { scaleX: 1, duration: 0.62, ease: "power2.out" })
          .to(introItems, { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.12 }, "-=0.38")
          .to(introWipe, { xPercent: 102, duration: 0.92, ease: "power4.inOut" }, isMobile ? "+=0.08" : "+=0.2")
          .to(storyIntro, { autoAlpha: 0, duration: 0.42, ease: "power2.inOut" }, "-=0.36");
      }

      tl.to(frame, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: isMobile ? 0.88 : 1.12,
        ease: "power4.out"
      }, storyIntro ? "-=0.22" : 0)
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.42 }, "-=0.72")
        .to(titleLines, { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.12, ease: "power4.out" }, "-=0.34")
        .to(lede, { autoAlpha: 1, y: 0, duration: 0.58 }, "-=0.38")
        .to(actions, { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.08 }, "-=0.36")
        .to(infoCard, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.58 }, "-=0.54")
        .to(identityCard, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: isMobile ? 8 : 12,
          duration: 0.64,
          ease: "back.out(1.2)"
        }, "-=0.46")
        .to(stamps, { autoAlpha: 1, y: 0, scale: 1, duration: 0.52, stagger: 0.08 }, "-=0.36");
    }
  );
}

function setHeroMode(modeKey) {
  const mode = heroModes[modeKey];
  if (!mode || !heroSystem) return;

  heroModeButtons.forEach(button => {
    const isActive = button.dataset.heroMode === modeKey;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (!reducedMotion) {
    heroSystem.classList.remove("is-switching");
    void heroSystem.offsetWidth;
    heroSystem.classList.add("is-switching");
  }

  heroSystem.dataset.heroActive = modeKey;
  heroSystem.style.setProperty("--hero-accent", mode.accent);
  heroRoot?.style.setProperty("--hero-accent", mode.accent);
  if (heroKicker) heroKicker.textContent = mode.kicker;
  if (heroTitle) heroTitle.textContent = mode.title;
  if (heroDescription) heroDescription.textContent = mode.description;
  if (heroMetricLabel) heroMetricLabel.textContent = mode.metricLabel;
  if (heroMetric) heroMetric.textContent = mode.metric;
}

heroModeButtons.forEach(button => {
  button.addEventListener("pointerenter", () => setHeroMode(button.dataset.heroMode));
  button.addEventListener("focus", () => setHeroMode(button.dataset.heroMode));
  button.addEventListener("click", () => setHeroMode(button.dataset.heroMode));
});

if (heroModeButtons.length) {
  setHeroMode(heroModeButtons[0].dataset.heroMode);
}

viewLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const hash = link.getAttribute("href") || "#work";
    if (link.hasAttribute("data-availability-link")) {
      setAvailabilityMenuOpen(false);
    }
    setActiveView(link.dataset.viewLink || getViewFromHash(hash), { hash });
  });
});

availabilityToggle?.addEventListener("click", () => {
  setAvailabilityMenuOpen(availabilityMenu?.hidden ?? true);
});

availabilityClose?.addEventListener("click", () => {
  setAvailabilityMenuOpen(false, { returnFocus: true });
});

availabilityLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (!link.hasAttribute("data-view-link")) {
      setAvailabilityMenuOpen(false);
    }
  });
});

document.addEventListener("click", event => {
  if (!availabilityMenu || availabilityMenu.hidden) return;
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("[data-availability-menu]")) return;
  if (event.target.closest("[data-availability-toggle]")) return;
  setAvailabilityMenuOpen(false);
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (!availabilityMenu || availabilityMenu.hidden) return;
  setAvailabilityMenuOpen(false, { returnFocus: true });
});

function syncViewFromLocation() {
  setActiveView(getViewFromHash(), { hash: window.location.hash || "#top", scroll: true, replace: true });
}

window.addEventListener("hashchange", syncViewFromLocation);
window.addEventListener("popstate", syncViewFromLocation);

function setPointerVars(event) {
  const x = event.clientX;
  const y = event.clientY;
  root.style.setProperty("--mx", `${x}px`);
  root.style.setProperty("--my", `${y}px`);
}

window.addEventListener("pointermove", setPointerVars, { passive: true });

function updateProgress() {
  const max = document.body.scrollHeight - window.innerHeight;
  const current = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${current}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
setActiveView(getViewFromHash(), {
  hash: window.location.hash || "#top",
  scroll: Boolean(window.location.hash),
  replace: true
});
initHeroStoryIntro();

const projectPreviewState = {
  active: false,
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  raf: 0,
  trigger: null,
  browser: null
};

function setProjectPreviewPosition(event) {
  if (!projectCursorPreview || !event) return;

  const previewWidth = projectCursorPreview.offsetWidth || 286;
  const previewHeight = projectCursorPreview.offsetHeight || 260;
  let x = event.clientX + 28;
  let y = event.clientY + 24;

  if (x + previewWidth + 18 > window.innerWidth) {
    x = event.clientX - previewWidth - 28;
  }

  if (y + previewHeight + 18 > window.innerHeight) {
    y = event.clientY - previewHeight - 24;
  }

  projectPreviewState.targetX = Math.max(14, Math.min(x, window.innerWidth - previewWidth - 14));
  projectPreviewState.targetY = Math.max(14, Math.min(y, window.innerHeight - previewHeight - 14));

  if (!projectPreviewState.active || reducedMotion) {
    projectPreviewState.x = projectPreviewState.targetX;
    projectPreviewState.y = projectPreviewState.targetY;
    projectCursorPreview.style.setProperty("--preview-x", `${projectPreviewState.x}px`);
    projectCursorPreview.style.setProperty("--preview-y", `${projectPreviewState.y}px`);
  }
}

function tickProjectPreview() {
  if (!projectPreviewState.active || !projectCursorPreview) {
    projectPreviewState.raf = 0;
    return;
  }

  const ease = reducedMotion ? 1 : 0.18;
  projectPreviewState.x += (projectPreviewState.targetX - projectPreviewState.x) * ease;
  projectPreviewState.y += (projectPreviewState.targetY - projectPreviewState.y) * ease;
  projectCursorPreview.style.setProperty("--preview-x", `${projectPreviewState.x}px`);
  projectCursorPreview.style.setProperty("--preview-y", `${projectPreviewState.y}px`);
  projectPreviewState.raf = window.requestAnimationFrame(tickProjectPreview);
}

function populateProjectPreview(trigger) {
  if (!projectCursorPreview) return;

  const image = trigger.dataset.previewImage || "";
  const visual = trigger.dataset.previewVisual || "system";
  projectCursorPreview.dataset.visual = visual;

  if (projectCursorPreviewLabel) {
    projectCursorPreviewLabel.textContent = trigger.dataset.previewLabel || "Preview";
  }
  if (projectCursorPreviewTitle) {
    projectCursorPreviewTitle.textContent = trigger.dataset.previewTitle || trigger.textContent.trim();
  }
  if (projectCursorPreviewDescription) {
    projectCursorPreviewDescription.textContent = trigger.dataset.previewDescription || "";
  }

  if (projectCursorPreviewImage && projectCursorPreviewMock) {
    if (image) {
      projectCursorPreviewImage.src = image;
      projectCursorPreviewImage.hidden = false;
      projectCursorPreviewMock.hidden = true;
    } else {
      projectCursorPreviewImage.removeAttribute("src");
      projectCursorPreviewImage.hidden = true;
      projectCursorPreviewMock.hidden = false;
    }
  }
}

function showProjectPreview(trigger, event) {
  if (!hasFinePointer || !projectCursorPreview) return;

  populateProjectPreview(trigger);
  setProjectPreviewPosition(event);

  projectPreviewState.active = true;
  projectPreviewState.trigger = trigger;
  projectPreviewState.browser = trigger.closest(".project-browser");
  projectPreviewState.browser?.classList.add("is-previewing");
  projectPreviewTriggers.forEach(item => item.classList.toggle("is-preview-active", item === trigger));
  projectCursorPreview.setAttribute("aria-hidden", "false");
  projectCursorPreview.classList.add("is-visible");

  if (!projectPreviewState.raf) {
    projectPreviewState.raf = window.requestAnimationFrame(tickProjectPreview);
  }
}

function hideProjectPreview() {
  if (!projectCursorPreview) return;

  projectPreviewState.active = false;
  if (projectPreviewState.raf) {
    window.cancelAnimationFrame(projectPreviewState.raf);
    projectPreviewState.raf = 0;
  }
  projectPreviewState.browser?.classList.remove("is-previewing");
  projectPreviewTriggers.forEach(item => item.classList.remove("is-preview-active"));
  projectPreviewState.trigger = null;
  projectPreviewState.browser = null;
  projectCursorPreview.setAttribute("aria-hidden", "true");
  projectCursorPreview.classList.remove("is-visible");
}

projectPreviewTriggers.forEach(trigger => {
  trigger.addEventListener("pointerenter", event => showProjectPreview(trigger, event));
  trigger.addEventListener("pointermove", event => setProjectPreviewPosition(event));
  trigger.addEventListener("pointerleave", hideProjectPreview);
  trigger.addEventListener("blur", hideProjectPreview);
});

function renderProject(projectKey) {
  const project = projects[projectKey];
  if (!project) return;
  const projectType = document.querySelector("[data-project-type]");
  if (!projectType) return;
  const projectIndex = orderedProjectKeys.indexOf(projectKey);
  const projectNumber = String(projectIndex + 1).padStart(2, "0");
  const projectTotal = String(orderedProjectKeys.length).padStart(2, "0");

  projectType.textContent = project.type;
  document.querySelector("[data-project-title]").textContent = project.title;
  document.querySelector("[data-project-description]").textContent = project.description;
  document.querySelector("[data-project-role]").textContent = project.role;
  document.querySelector("[data-project-value]").textContent = project.value;
  document.querySelector("[data-project-focus]").textContent = project.focus;
  document.querySelector("[data-project-tag]").textContent = project.tag;
  document.querySelector("[data-project-index]").textContent = projectNumber;
  document.querySelector("[data-project-count]").textContent = projectTotal;
  document.querySelector("[data-project-number]").textContent = projectNumber;
  projectViewer?.style.setProperty("--project-accent", project.accent);
  document.querySelector("[data-project-progress]").style.width =
    `${((projectIndex + 1) / orderedProjectKeys.length) * 100}%`;
  const caseLink = document.querySelector("[data-project-case-link]");
  const projectImage = document.querySelector("[data-project-image]");
  const deviceFrame = document.querySelector(".device-frame");
  if (caseLink) {
    const ctaUrl = project.caseUrl || project.ctaUrl || "#contact";
    caseLink.hidden = false;
    caseLink.href = ctaUrl;
    caseLink.firstChild.textContent = project.caseUrl
      ? `View ${project.title} case `
      : `${project.ctaLabel || "Request walkthrough"} `;
  }
  if (projectImage && deviceFrame) {
    const hasImage = Boolean(project.image);
    projectViewer?.classList.toggle("has-project-image", hasImage);
    projectImage.hidden = !hasImage;
    deviceFrame.hidden = hasImage;
    if (hasImage) {
      projectImage.src = project.image;
      projectImage.alt = project.imageAlt || `${project.title} project preview`;
    } else {
      projectImage.removeAttribute("src");
      projectImage.alt = "";
    }
  }
  document.querySelectorAll("[data-project-point]").forEach((point, index) => {
    point.textContent = project.points[index] || "";
  });
  document.querySelector(".mock-hero-line").style.background =
    `linear-gradient(135deg, ${project.accent}, color-mix(in srgb, ${project.accent} 42%, white))`;
  projectButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.project === projectKey);
    button.setAttribute("aria-selected", String(button.dataset.project === projectKey));
  });
}

projectButtons.forEach(button => {
  button.addEventListener("click", () => {
    renderProject(button.dataset.project);
    setCanvasMode(button.dataset.project);
  });
  button.addEventListener("pointerenter", () => {
    renderProject(button.dataset.project);
    setCanvasMode(button.dataset.project);
  });
  button.addEventListener("focus", () => {
    renderProject(button.dataset.project);
    setCanvasMode(button.dataset.project);
  });
});

function stepProject(direction) {
  const currentKey = Array.from(projectButtons).find(button => button.classList.contains("active"))?.dataset.project || orderedProjectKeys[0];
  const currentIndex = orderedProjectKeys.indexOf(currentKey);
  const nextIndex = (currentIndex + direction + orderedProjectKeys.length) % orderedProjectKeys.length;
  const nextKey = orderedProjectKeys[nextIndex];
  renderProject(nextKey);
  setCanvasMode(nextKey);
}

document.querySelector("[data-project-prev]")?.addEventListener("click", () => stepProject(-1));
document.querySelector("[data-project-next]")?.addEventListener("click", () => stepProject(1));
document.querySelector("[data-project-case-link]")?.addEventListener("click", event => {
  const href = event.currentTarget.getAttribute("href") || "";
  if (!href.startsWith("#")) return;
  event.preventDefault();
  setActiveView(getViewFromHash(href), { hash: href });
});

projectViewer?.addEventListener("keydown", event => {
  if (event.key !== "ArrowUp" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowRight") return;
  event.preventDefault();
  stepProject(event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1);
});

if (projectButtons.length) {
  renderProject("chance");
}

canvasModeControls.forEach(control => {
  control.addEventListener("click", () => setCanvasMode(control.dataset.canvasMode));
  control.addEventListener("pointerenter", () => setCanvasMode(control.dataset.canvasMode));
  control.addEventListener("focus", () => setCanvasMode(control.dataset.canvasMode));
});

setCanvasMode("research");
initRiveCompanion();

function setActiveContact(card) {
  if (!card) return;

  contactCards.forEach(item => {
    const isActive = item === card;
    item.classList.toggle("active", isActive);
    if (isActive) {
      item.setAttribute("aria-current", "true");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  if (contactKicker) contactKicker.textContent = card.dataset.contactKicker || "";
  if (contactTitle) contactTitle.textContent = card.dataset.contactTitle || card.textContent.trim();
  if (contactDetail) contactDetail.textContent = card.dataset.contactDetail || "";
}

contactCards.forEach(card => {
  card.addEventListener("pointerenter", () => setActiveContact(card));
  card.addEventListener("pointermove", () => setActiveContact(card));
  card.addEventListener("mouseenter", () => setActiveContact(card));
  card.addEventListener("mouseover", () => setActiveContact(card));
  card.addEventListener("focus", () => setActiveContact(card));
  card.addEventListener("touchstart", () => setActiveContact(card), { passive: true });
});

if (contactCards.length) {
  setActiveContact(contactCards[0]);
}

document.addEventListener("focusin", event => {
  const card = event.target instanceof Element ? event.target.closest("[data-contact-card]") : null;
  if (card) setActiveContact(card);
});

document.addEventListener("mousemove", event => {
  const card = event.target instanceof Element ? event.target.closest("[data-contact-card]") : null;
  if (card) setActiveContact(card);
});

function appendAgentMessage(role, text) {
  if (!agentThread) return;

  const message = document.createElement("div");
  message.className = `agent-message agent-message-${role}`;

  const label = document.createElement("span");
  label.textContent = role === "user" ? "You" : "Agent";

  const copy = document.createElement("p");
  copy.textContent = text;

  message.append(label, copy);
  agentThread.append(message);
  agentThread.scrollTop = agentThread.scrollHeight;
}

function findProjectIntent(text) {
  const query = text.toLowerCase();
  if (query.includes("chance") || query.includes("consumer") || query.includes("to c")) return "chance";
  if (query.includes("deloitte") || query.includes("healthcare") || query.includes("nda")) return "deloitte";
  if (query.includes("axel") || query.includes("b2b") || query.includes("restaurant") || query.includes("dashboard")) return "axel";
  return "";
}

function buildAgentReply(text) {
  const query = text.toLowerCase();
  const projectIntent = findProjectIntent(query);

  if (projectIntent) {
    setActiveView("work", { hash: "#work", scroll: true });
    renderProject(projectIntent);
  }

  if (query.includes("deloitte") || query.includes("healthcare") || query.includes("nda")) {
    return "Deloitte x SCADpro is framed safely as a public case: healthcare AI web experience strategy, onboarding clarity, information accessibility, and AI-assisted guidance. Sensitive client material should stay out of the public site and be handled as a private walkthrough.";
  }

  if (query.includes("chance")) {
    return "Chance AI is the current-work signal: consumer AI product design, activation logic, habit formation, and commercial UI execution. It should become the strongest proof that Jamie can design beyond student projects.";
  }

  if (query.includes("axel")) {
    return "Axel is the clearest commercial systems case: research across 27 restaurants, fragmented POS and delivery workflows, Today’s Summary, Unified Order View, issue resolution, and Define Actions. It shows Jamie can turn field research into a decision system for small restaurant operators.";
  }

  if (query.includes("google") || query.includes("recruiter") || query.includes("meta") || query.includes("tiktok")) {
    return "Start with the commercial layer: Chance AI for current consumer AI product thinking, Deloitte x SCADpro for client-facing healthcare AI strategy, and Axel for systems-to-interface execution. The Creative Lab is useful after that as proof of motion taste and interaction range.";
  }

  if (query.includes("founder") || query.includes("startup") || query.includes("commercial") || query.includes("business")) {
    if (!projectIntent) {
      setActiveView("work", { hash: "#work", scroll: true });
      renderProject("axel");
    }
    return "Jamie is strongest when product ambiguity needs to become a usable product surface. The commercial proof is Axel for operational decision support, Chance AI for consumer AI value, and Deloitte for translating complex healthcare onboarding into clearer AI-assisted web experience strategy.";
  }

  if (query.includes("ai product") || query.includes("ai-native") || query.includes("ai native") || query.includes("ai")) {
    return "Jamie's AI product angle is not just using AI tools. It is designing how AI shows up in the product: guided moments, clear user agency, onboarding clarity, and interfaces that turn complex capability into understandable action.";
  }

  if (query.includes("research") || query.includes("uxr") || query.includes("ipsos")) {
    return "The research signal is strong: SCAD UX training, Ipsos mixed-method service research, VOC synthesis, interviews, journey mapping, and survey validation at N=2,400. That research base supports Jamie's product decisions instead of sitting separately from UI.";
  }

  if (query.includes("motion") || query.includes("creative") || query.includes("lab") || query.includes("artwork")) {
    setActiveView("lab", { hash: "#lab", scroll: true });
    return "The motion layer should be read as interaction thinking, not decoration. Awakening Loop, Honda Ecosystem, MoonLog Archive, and the Research Wall show taste, creative technology, and the ability to make abstract systems feel tangible.";
  }

  if (query.includes("contact") || query.includes("email") || query.includes("hire")) {
    setActiveView("contact", { hash: "#contact", scroll: true });
    return "Jamie is open to product design opportunities. Use the footer email or LinkedIn link for outreach; the strongest fit is UX/Product Design, AI Product Design, and consumer AI product teams.";
  }

  return "I would read Jamie as an AI-native Product Designer with a strong mix of research logic, commercial product judgment, and motion-led interaction taste. Ask me about Chance AI, Deloitte, Axel, research strength, or the creative lab for a more specific path.";
}

function askAgent(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  appendAgentMessage("user", cleanQuestion);
  agentInput.value = "";

  window.setTimeout(() => {
    appendAgentMessage("bot", buildAgentReply(cleanQuestion));
  }, 220);
}

function setAgentOpen(open) {
  if (!agentPanel || !agentToggle) return;
  agentPanel.hidden = !open;
  agentToggle.setAttribute("aria-expanded", String(open));
  agentToggle.setAttribute("aria-label", open ? "Close AI assistant" : "Open AI assistant");
  agentShell?.classList.toggle("agent-open", open);
  if (open) {
    window.setTimeout(() => agentInput?.focus(), 60);
  }
}

function setAvailabilityMenuOpen(open, options = {}) {
  if (!availabilityToggle || !availabilityMenu) return;

  const { returnFocus = false } = options;
  availabilityMenu.hidden = !open;
  availabilityToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("availability-menu-open", open);

  if (open) {
    window.requestAnimationFrame(() => availabilityClose?.focus());
  } else if (returnFocus) {
    availabilityToggle.focus();
  }
}

function setCanvasMode(modeKey) {
  const mode = canvasModes[modeKey] || canvasModes.research;
  if (!workCanvas) return;

  workCanvas.dataset.canvasState = mode.state;
  workCanvas.dataset.canvasMode = modeKey;
  workCanvas.dataset.canvasPhase = mode.phase;
  if (companionKicker) companionKicker.textContent = mode.kicker;
  if (companionTitle) companionTitle.textContent = mode.title;

  canvasModeControls.forEach(control => {
    const controlMode = control.dataset.canvasMode;
    control.classList.toggle("active", controlMode === modeKey || controlMode === mode.phase);
  });

  if (window.jamieRiveInputs?.mode && "value" in window.jamieRiveInputs.mode) {
    window.jamieRiveInputs.mode.value = canvasModeOrder.indexOf(modeKey);
  }
  if (window.jamieRiveInputs?.mood && "value" in window.jamieRiveInputs.mood) {
    window.jamieRiveInputs.mood.value = canvasStateOrder.indexOf(mode.state);
  }
  if (window.jamieRiveInputs?.pulse?.fire) {
    window.jamieRiveInputs.pulse.fire();
  }
}

async function initRiveCompanion() {
  if (!riveCanvas) return;
  const src = riveCanvas.dataset.riveSrc?.trim();
  if (!src) return;

  try {
    if (!window.rive) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@rive-app/webgl2@2";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const stateMachine = riveCanvas.dataset.riveStateMachine || undefined;
    const artboard = riveCanvas.dataset.riveArtboard || undefined;
    const RiveRuntime = window.rive;
    let riveInstance;
    riveInstance = new RiveRuntime.Rive({
      src,
      canvas: riveCanvas,
      artboard,
      stateMachines: stateMachine,
      autoplay: true,
      autoBind: true,
      layout: new RiveRuntime.Layout({
        fit: RiveRuntime.Fit.Contain,
        alignment: RiveRuntime.Alignment.Center
      }),
      onLoad: () => {
        riveInstance?.resizeDrawingSurfaceToCanvas();
        const inputs = stateMachine ? riveInstance.stateMachineInputs(stateMachine) : [];
        window.jamieRiveInputs = Object.fromEntries(inputs.map(input => [input.name, input]));
        workCanvas?.classList.add("has-rive");
      }
    });
  } catch (error) {
    console.warn("Rive companion could not load. Fallback character is active.", error);
  }
}

function getAgentToggleTarget(event) {
  return event.target instanceof Element ? event.target.closest("[data-agent-toggle]") : null;
}

document.addEventListener("click", event => {
  if (!getAgentToggleTarget(event)) return;
  setAgentOpen(agentPanel?.hidden ?? true);
});

document.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (!getAgentToggleTarget(event)) return;
  event.preventDefault();
  setAgentOpen(agentPanel?.hidden ?? true);
});

agentClose?.addEventListener("click", () => setAgentOpen(false));

agentToggle?.addEventListener("pointerenter", () => {
  agentToggle.classList.add("pumpkin-hover");
});

agentToggle?.addEventListener("pointerleave", () => {
  agentToggle.classList.remove("pumpkin-hover");
});

agentPrompts.forEach(button => {
  button.addEventListener("click", () => {
    setAgentOpen(true);
    askAgent(button.dataset.agentPrompt || button.textContent);
  });
});

agentForm?.addEventListener("submit", event => {
  event.preventDefault();
  askAgent(agentInput.value);
});

document.querySelectorAll("[data-tilt-card]").forEach(card => {
  card.addEventListener("pointermove", event => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--px", `${x}%`);
    card.style.setProperty("--py", `${y}%`);
  });
});

const liquidControlSelector = [
  ".site-nav a",
  ".availability-pill",
  ".availability-menu a",
  ".availability-menu-close",
  ".hero-action",
  ".project-card",
  ".project-case-link",
  ".canvas-node",
  ".canvas-proof button",
  ".case-return",
  ".project-viewer-controls button",
  ".icon-button",
  ".contact-card",
  ".agent-prompts button",
  ".agent-form button",
  ".agent-close",
  ".case-chapter-nav a"
].join(",");

document.querySelectorAll(liquidControlSelector).forEach(control => {
  control.addEventListener("pointermove", event => {
    const rect = control.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    control.style.setProperty("--liquid-x", `${x.toFixed(2)}%`);
    control.style.setProperty("--liquid-y", `${y.toFixed(2)}%`);

    if (!reducedMotion) {
      control.style.setProperty("--liquid-dx", `${((x - 50) / 50).toFixed(3)}px`);
      control.style.setProperty("--liquid-dy", `${((y - 50) / 70).toFixed(3)}px`);
    }
  });

  control.addEventListener("pointerdown", () => {
    control.classList.add("liquid-pressing");
  });

  function resetLiquidControl() {
    control.classList.remove("liquid-pressing");
    control.style.setProperty("--liquid-x", "50%");
    control.style.setProperty("--liquid-y", "20%");
    control.style.setProperty("--liquid-dx", "0px");
    control.style.setProperty("--liquid-dy", "0px");
  }

  control.addEventListener("pointerup", resetLiquidControl);
  control.addEventListener("pointercancel", resetLiquidControl);
  control.addEventListener("pointerleave", resetLiquidControl);
  control.addEventListener("blur", resetLiquidControl);
});

function enableDragScroll() {
  if (!labTrack) return;

  let down = false;
  let startX = 0;
  let startScroll = 0;

  labTrack.addEventListener("pointerdown", event => {
    down = true;
    startX = event.clientX;
    startScroll = labTrack.scrollLeft;
    labTrack.classList.add("dragging");
    labTrack.setPointerCapture(event.pointerId);
  });

  labTrack.addEventListener("pointermove", event => {
    if (!down) return;
    labTrack.scrollLeft = startScroll - (event.clientX - startX);
  });

  function releaseDrag(event) {
    if (!down) return;
    down = false;
    labTrack.classList.remove("dragging");
    if (event.pointerId) {
      try {
        labTrack.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be released by the browser.
      }
    }
  }

  labTrack.addEventListener("pointerup", releaseDrag);
  labTrack.addEventListener("pointercancel", releaseDrag);
  labTrack.addEventListener("pointerleave", releaseDrag);
}

enableDragScroll();

document.querySelector("[data-lab-prev]")?.addEventListener("click", () => {
  labTrack.scrollBy({ left: -420, behavior: "smooth" });
});

document.querySelector("[data-lab-next]")?.addEventListener("click", () => {
  labTrack.scrollBy({ left: 420, behavior: "smooth" });
});

class SystemCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.pointer = { x: 0.5, y: 0.5 };
    this.nodes = [
      { x: 0.16, y: 0.22, r: 26, color: "#315cff" },
      { x: 0.58, y: 0.16, r: 40, color: "#111111" },
      { x: 0.8, y: 0.54, r: 34, color: "#02a676" },
      { x: 0.36, y: 0.78, r: 28, color: "#ff4b38" },
      { x: 0.72, y: 0.84, r: 18, color: "#e6a700" }
    ];
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.canvas.addEventListener("pointermove", event => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = (event.clientX - rect.left) / rect.width;
      this.pointer.y = (event.clientY - rect.top) / rect.height;
    });
    window.addEventListener("resize", this.resize);
    this.resize();
    this.animate(0);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * ratio;
    this.canvas.height = rect.height * ratio;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  drawNode(node, time) {
    const driftX = (this.pointer.x - 0.5) * 34;
    const driftY = (this.pointer.y - 0.5) * 34;
    const pulse = reducedMotion ? 0 : Math.sin(time / 700 + node.x * 5) * 5;
    const x = node.x * this.width + driftX * (node.x - 0.5);
    const y = node.y * this.height + driftY * (node.y - 0.5);
    const radius = node.r + pulse;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(17, 17, 17, 0.22)";
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(x, y, Math.max(6, radius * 0.18), 0, Math.PI * 2);
    this.ctx.fillStyle = node.color;
    this.ctx.fill();

    return { x, y };
  }

  animate(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    const points = this.nodes.map(node => this.drawNode(node, time));

    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    for (let index = 0; index < points.length; index += 1) {
      const current = points[index];
      const next = points[(index + 1) % points.length];
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      const cpx = (current.x + next.x) / 2 + Math.sin(time / 900 + index) * 46;
      const cpy = (current.y + next.y) / 2 + Math.cos(time / 1000 + index) * 36;
      ctx.quadraticCurveTo(cpx, cpy, next.x, next.y);
      ctx.strokeStyle = index % 2 === 0 ? "rgba(49, 92, 255, 0.24)" : "rgba(17, 17, 17, 0.16)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    for (let index = 0; index < 9; index += 1) {
      const x = ((index * 137 + time * 0.018) % (this.width + 160)) - 80;
      const y = 90 + ((index * 83) % Math.max(160, this.height - 180));
      ctx.beginPath();
      ctx.moveTo(x - 80, y);
      ctx.lineTo(x + 80, y + Math.sin(time / 700 + index) * 22);
      ctx.strokeStyle = "rgba(17, 17, 17, 0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    if (!reducedMotion) {
      requestAnimationFrame(this.animate);
    }
  }
}

const canvas = document.getElementById("systemCanvas");
if (canvas?.dataset.motion === "true") {
  new SystemCanvas(canvas);
}
