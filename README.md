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
