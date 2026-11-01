# Jamie Zhou Portfolio Design System

Version: 2027.1

## Direction

The portfolio positions Jamie as an AI-native product designer with strength in
research, growth, systems thinking, and interaction craft. The visual system uses
white hierarchy, precise typography, quiet glass depth, and motion that explains
state rather than decorating the page.

Reference principles carried into the system:

- Let work and evidence carry more weight than interface chrome.
- Use editorial spacing and alignment instead of wrapping every section in a card.
- Keep project roles, methods, and outcomes easy to compare.
- Add personality through motion studies and one-off details, not a loud palette.

## Color Tokens

- `#FFFFFF` clean white surface
- `#F7F8FA` soft white page field
- `#FAF9F7` warm white footer field
- `#F3F6F8` cool white media field
- `#121418` near-black primary text
- `#31363E` graphite body text
- `#707782` muted secondary text
- `#5D718C` restrained blue-gray accent
- `#667C6F` secondary signal accent
- `rgba(23, 29, 38, 0.11)` default border

## Typography

The site uses the native system sans stack for speed and consistency with Apple-like
product surfaces. Metadata uses the native monospace stack.

- Home identity: 72px desktop, 58px tablet, 42px mobile
- Case identity: 62px desktop, 52px tablet, 42px mobile
- Section title: 48px desktop, 38px tablet, 32px mobile
- Body: 16-21px depending on narrative importance
- Metadata: 9-11px monospace

Letter spacing stays at zero. Type changes only at explicit breakpoints.

## Layout

- Main portfolio width: 1280px maximum
- Case-study width: 1180px maximum
- Desktop page inset: 32px
- Mobile page inset: 14px
- Standard section spacing: 82-116px
- Surface radius: 6-8px
- Pills are reserved for navigation and tags

Sections remain unframed. Cards are used only for projects, snapshots, repeated
findings, and modal surfaces.

## White Hierarchy

1. Soft white establishes the page field.
2. Clean white separates project and content surfaces.
3. Cool white holds product media and system diagrams.
4. Translucent white creates navigation, modal, and sticky section depth.
5. Warm white closes the experience in the footer.

## Motion

- Micro-interactions: 180-260ms
- Page transition: 220-420ms
- Section reveal: 520ms
- Media movement: up to 600ms
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for soft deceleration
- Properties: transform and opacity only for primary motion

The experience respects `prefers-reduced-motion`. Mobile interactions never depend
on hover.

## Core Components

- Fixed glass navigation with a segmented active state
- Canonical mobile menu with 44px minimum targets
- Identity-first home hero with an Axel artifact preview
- Editorial project index with one primary and two supporting cases
- Sticky case-study chapter navigation
- Reusable Problem / Insight / Decision / Outcome cards
- NDA-safe process flows for Chance AI and Deloitte x SCADpro
- Focus-managed contact dialog
- Motion playground cards with CSS and existing pixel-art assets

## Guardrails

- No cursor glow or decorative tracking effects
- No global assistant competing with portfolio content
- No saturated blue, orange, purple, or gradient blobs
- No nested cards or dashboard-style page composition
- No motion that delays reading or navigation
- No private screens or metrics on NDA-safe case pages
