# Jamie Zhou Portfolio

Personal portfolio for Jamie Zhou, positioned around AI product design, growth,
frontier UX, and commercial product systems.

## Preview

Open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8000/`.

## Current Direction

- Positioning: AI Product & Growth Designer
- Primary case study: Axel
- Supporting work: Chance AI, Deloitte x SCADpro
- Lab / Play: experimental motion, creative tech, and archived student work
- Visual language: painterly minimal portfolio, soft editorial tech, warm ivory surfaces, restrained motion

## Files

- `index.html` - homepage structure and portfolio content
- `axel.html` - Axel case study page
- `styles.css` - responsive layout, visual system, motion styling
- `script.js` - interactions, portfolio agent, project previews, reveal motion
- `assets/` - public images and supporting files used by the site

## Portfolio Agent

The floating portfolio assistant currently uses curated local site knowledge and
keyword matching, so it works without an API key. To make it a real LLM agent
later, route messages through a secure backend or serverless function. Do not
expose API keys in the browser.

## Privacy Note

Raw research notes, user testing files, competitor screenshots, and draft resume
variants are intentionally excluded from GitHub. Keep the public repository focused
on polished portfolio material.
