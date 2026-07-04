---
version: alpha
name: Jamie Editorial Systems
description: Motion-led editorial portfolio for an AI-native product designer.
colors:
  primary: "#15120F"
  secondary: "#5D574F"
  tertiary: "#F05A28"
  neutral: "#FFF8EC"
  surface: "#FFFDF8"
  line: "rgba(21, 18, 15, 0.12)"
  accent-blue: "#315CFF"
  accent-mint: "#00A884"
  on-primary: "#FFFFFF"
  on-tertiary: "#FFFFFF"
typography:
  display:
    fontFamily: Notion Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: clamp(66px, 8vw, 128px)
    fontWeight: 650
    lineHeight: 0.94
    letterSpacing: 0
  section-title:
    fontFamily: Notion Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: clamp(52px, 6vw, 94px)
    fontWeight: 650
    lineHeight: 0.95
    letterSpacing: 0
  body:
    fontFamily: Notion Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  label:
    fontFamily: Notion Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 11px
    fontWeight: 750
    lineHeight: 1.3
    letterSpacing: 0
rounded:
  sm: 11px
  md: 16px
  lg: 26px
  pill: 999px
spacing:
  xs: 6px
  sm: 10px
  md: 16px
  lg: 24px
  xl: 34px
  xxl: 56px
components:
  nav-shell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: 18px
    padding: 5px
  nav-item-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: 13px
    padding: 10px 14px
  project-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: 24px
  action-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.md}"
    padding: 14px 18px
---

## Overview

Jamie Editorial Systems should feel like an intelligent product-design magazine rather than a generic portfolio template. The site needs to communicate commercial product judgement first, then motion taste, research logic, and creative systems thinking.

The visual language is editorial, warm, precise, and interactive. Motion should support orientation and state changes, not become visual noise.

## Colors

The palette uses high-contrast ink, warm paper neutrals, and three controlled accents.

- **Primary (#15120F):** Deep ink for active navigation, major headings, and strong interface states.
- **Secondary (#5D574F):** Warm gray for supporting copy, metadata, and quiet UI labels.
- **Tertiary (#F05A28):** Primary interaction accent for progress, labels, and active details.
- **Neutral (#FFF8EC):** Warm paper base that prevents the page from feeling like a blank white document.
- **Accent Blue (#315CFF):** AI/product signal used in system lines and progress gradients.
- **Accent Mint (#00A884):** Research/system signal used as a secondary gradient endpoint.

Do not let the palette become a single beige theme. Ink contrast and controlled blue/mint/coral accents should stay visible.

## Typography

Typography is sans-serif, dense, and editorial. Large display type is reserved for hero and section-level statements. Cards, buttons, prompts, and chat UI use smaller text with stable line-height.

All letter spacing should remain zero. Do not use viewport-width scaling for body text.

## Layout

The site uses four independent views: Work, Lab, Method, and Contact. Work is the default recruiter path. Lab, Method, and Contact should each feel like a focused screen, not sections in one long generic page.

The layout should use grid, strong section boundaries, and stable responsive widths. Important controls must not be covered by the Pumpy assistant.

## Elevation & Depth

Depth is subtle and functional. Panels can use soft shadows and translucent paper/glass surfaces when they establish hierarchy. Avoid stacked cards inside cards.

## Shapes

Use restrained radii:

- Small controls: 11px.
- Standard surfaces: 16px.
- Feature panels: 26px.
- Pills only for tags or segmented navigation.

## Components

Navigation is a segmented control. The active view is high-contrast ink; inactive views are quiet and warm.

Project browsing is an editorial index with active preview. The selected project should be obvious through text weight, progress color, and active dot.

The Pumpy agent uses pixel-art affordance and pumpkin colors. Its panel should feel compatible with the pumpkin but should not distract from portfolio content.

## Do's and Don'ts

Do:

- Preserve clear role, value, and project hierarchy for recruiters.
- Use motion to explain state and system thinking.
- Keep contrast high enough for small labels and controls.
- Make every view feel intentionally composed.

Don't:

- Add decorative blobs, generic gradients, or stock-like visuals.
- Make the website feel like a landing page.
- Let motion or the assistant cover project controls.
- Introduce more colors without assigning a role.
