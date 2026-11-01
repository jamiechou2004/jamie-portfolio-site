# Jamie Zhou Portfolio

Portfolio for Jamie Zhou, an AI-native product designer focused on research-led
systems, growth and activation, consumer AI workflows, and interaction craft.

## Preview

The site is dependency-free and can be opened through a local static server:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765/index.html`.

## Pages

- `index.html` - identity-first home page
- `work.html` - selected work index
- `lab.html` - motion and interaction playground
- `about.html` - profile, experience, education, skills, and interests
- `axel.html` - primary public SaaS case study
- `chance.html` - NDA-safe consumer AI and growth case study
- `deloitte.html` - NDA-safe healthcare AI strategy case study

## Active Frontend

- `portfolio-2027.css` - visual system, layouts, responsive rules, and CSS motion
- `portfolio-2027.js` - page transitions, reveal behavior, mobile navigation,
  contact dialog, section tracking, and subtle pointer response
- `assets/` - project artifacts, portrait, resume, playground sprite, and social card

The previous `styles.css` and `script.js` files are retained as legacy source but are
not loaded by the current pages.

## Accessibility and Performance

- 44px minimum interactive targets
- Visible keyboard focus
- Focus-managed contact dialog
- `prefers-reduced-motion` support
- No horizontal overflow at 390px, 768px, or 1440px
- No runtime framework or third-party animation dependency
- Below-fold images remain eligible for native lazy loading as new assets are added

## Content Notes

Chance AI and Deloitte x SCADpro intentionally omit private screens, metrics, and
client details. Replace the NDA-safe diagrams only with approved public artifacts.

## 2026-09-10 local Chance update

`chance.html` now follows the supplied Chance AI portfolio: answer structure, contextual follow-up, multimodal input, and state boundaries. It uses scoped `chance-case.css` alongside the shared shell. Home and Work entries match this case. The earlier NDA-safe summary and all pre-existing local edits were backed up in the job-search workspace before this update.

This local update is not a publication or a clearance of the UI/portrait assets for public use. Confirm their public scope and the existing domain’s deployment source before publishing. No new hosting site was created.

## 2026-09-11 detail audit

Shared navigation now owns the two-case preview as well; the copied preview-shell.js is retained as historical source and is no longer loaded. Current preview: `/previews/home-two-cases/index.html`. The formal homepage layout is still the earlier version pending separate approval of the proposed layout.

Fixed skip-link targets, mobile menu focus/inert/Escape behavior, history restoration, dark contact/menu styling and inconsistent Work cover media. Cover videos offer pause/play, pause outside the viewport and honor reduced motion. Source UI metrics remain illustrative; numerical research claims in Work/About were generalized pending supporting records. Existing cases and source materials are preserved.

Verified eight routes at 390/768/1440px, local resource/anchor integrity and targeted keyboard/video interactions. Full report and backups: job-search workspace `材料/网站/2026-09-11_全站细节_v1`.


## 2026-09-13 current architecture
`homepage.html` is the public homepage; `index.html` and `work.html` redirect to it. Home, About, and Playground use the scoped `portfolio-editorial.css` horizontal navigation. Long case studies keep their reading table of contents. Deloitte is a V-safe public-health communication campaign, superseding the old healthcare-AI placeholder description. Earlier “formal homepage pending” notes are historical.
