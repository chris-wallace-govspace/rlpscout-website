---
name: RLPSCOUT AI LLC
description: Company site for a federal lease offeror and lessor, built as a ruled charcoal ledger read under cyan inspection light.
colors:
  charcoal-ground: "#26292c"
  charcoal-band: "#2d3134"
  charcoal-raised: "#34393d"
  rule: "#474c51"
  rule-soft: "#3a3f43"
  rule-strong: "#6b7278"
  ink: "#eceeef"
  ink-lede: "#d3d8db"
  ink-body: "#b0b7bc"
  ink-muted: "#9aa2a8"
  inspection-cyan: "#22d3ee"
  survey-teal: "#14b8a6"
  survey-teal-bright: "#2dd4bf"
  teal-ink: "#062521"
  met-ink: "#7ee8d8"
  caution-amber: "#f2b84b"
typography:
  display:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3.1rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.02em"
rounded:
  sm: "2px"
  md: "4px"
spacing:
  gutter: "clamp(16px, 3vw, 32px)"
  section: "clamp(72px, 10vw, 128px)"
  container: "1320px"
  nav: "64px"
components:
  button-primary:
    backgroundColor: "{colors.survey-teal}"
    textColor: "{colors.teal-ink}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.survey-teal-bright}"
    textColor: "{colors.teal-ink}"
  button-ghost:
    backgroundColor: "rgba(38, 41, 44, 0.72)"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "46px"
  button-ghost-hover:
    backgroundColor: "{colors.charcoal-raised}"
  input:
    backgroundColor: "{colors.charcoal-ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "46px"
  status-met:
    textColor: "{colors.met-ink}"
    rounded: "{rounded.sm}"
    padding: "3px 10px"
  status-needs-work:
    textColor: "{colors.caution-amber}"
    rounded: "{rounded.sm}"
    padding: "3px 10px"
---

# Design System: RLPSCOUT AI LLC

## Overview

**Creative North Star: "The Inspection Ledger"**

The site reads like a charcoal record book held under an inspection lamp. Structure comes from thin ruled lines, not from boxes: sections are full-width bands separated by a hairline, tables and lists are ruled rows, and adjacent panels share a seam instead of floating as cards. Every fact on the page is the kind an officer can verify, so the layout presents facts the way a ledger does: label on the left, value on the right, source stated beside the number.

Cyan is the inspection light. It is rationed to the things being checked or currently selected: the active nav item, the active step, a source citation, a scan line passing over a requirement. Teal is the act of committing (the primary action and a small set of confirmations). Everything else is neutral charcoal and cool gray ink, so the light always means something.

Motion has one authored moment and otherwise stays functional. The requirement trace scans its rows and resolves each status; the hero scanner sweeps the skyline. Everything else is feedback (hover, press, tab change) or a single quiet reveal as content enters the viewport.

**Key Characteristics:**
- Dark only: charcoal ground (#26292c) with an alternate band one step lighter for rhythm.
- 1px ruled seams carry all structure; corners are near-square (2px).
- Flat: no shadows on content; depth is tonal stepping and rules.
- Geist at regular weight with tight negative tracking for headings; Geist Mono only for data (IDs, codes, sources, readouts).
- One cyan signal, one teal action, one amber caution.

## Colors

Cool charcoal neutrals with a single inspection-cyan signal, a teal action color, and amber reserved for caution.

### Primary
- **Inspection Cyan** (inspection-cyan): the signal for "checked" or "selected". Active nav underline, the sliding step marker, source citations in the trace, the trace scan line, list tick marks, focus rings, HUD readout values, staffing column titles. Never a fill for large areas and never body text.

### Secondary
- **Survey Teal** (survey-teal): the commit color. Primary buttons, the header Contact button, role labels on people, "Evaluated as" captions, the candor marker square. **Survey Teal Bright** (survey-teal-bright) is its hover state only. **Teal Ink** (teal-ink) is the text color on teal fills.
- **Met Ink** (met-ink): text of a "Met" status and a confirmed Copy button.

### Tertiary
- **Caution Amber** (caution-amber): "Needs work" statuses, warning strokes in diagrams, and form field errors. Nothing decorative.

### Neutral
- **Charcoal Ground** (charcoal-ground): page background, input fields, the trace panel.
- **Charcoal Band** (charcoal-band): alternate section bands, the steps panel, the inquiry form, the capability dialog.
- **Charcoal Raised** (charcoal-raised): hover and selected fill for tabs and ghost buttons, the dialog toolbar.
- **Rule** (rule), **Rule Soft** (rule-soft), **Rule Strong** (rule-strong): the three line weights. Rule for table and panel borders, Rule Soft for section seams and trace row dividers, Rule Strong for diagram lines, ghost button borders and resting link underlines.
- **Ink** (ink): headings and primary text. **Ink Lede** (ink-lede): hero lede and nav links. **Ink Body** (ink-body): running text. **Ink Muted** (ink-muted): captions, table headers, metadata, placeholders; tuned to 5.07:1 on the band so it stays AA.

### Named Rules
**The Inspection Light Rule.** Cyan marks only what is checked, selected or focused. If an element is not in one of those states, it is not cyan.

**The One Action Rule.** Teal fill belongs to the action a visitor should take next. One teal button per view region; secondary actions are ghost buttons or underlined links.

**The AA Floor Rule.** No text below Ink Muted on any charcoal surface. A new gray must clear 4.5:1 against the band (charcoal-band), not just the ground.

## Typography

**Display Font:** Geist (with Helvetica Neue, Arial)
**Body Font:** Geist (with Helvetica Neue, Arial)
**Label/Mono Font:** Geist Mono (with ui-monospace, SF Mono, Menlo)

**Character:** A single neutral grotesk at regular weight, tightened at display sizes so headings read as statements rather than shouts. Mono appears only where the content is data.

### Hierarchy
- **Display** (400, clamp(2.4rem, 5vw, 4.4rem), 1.02): the hero heading only. Balanced wrapping.
- **Headline** (400, clamp(2rem, 3.6vw, 3.1rem), 1.06): one per section, the section's claim in a sentence. Balanced wrapping.
- **Title** (400, clamp(1.5rem, 2.4vw, 2rem), 1.1): step panels and commitment names (commitments run larger, up to 2.5rem).
- **Sub-head** (400, 1.25 to 1.375rem): registry caption, Leadership, person names, the candor heading.
- **Body** (400, 1rem, 1.55): running text in Ink Body, measure capped at 52 to 60ch. Section intros run at 1.0625rem.
- **Label** (400, 0.75 to 0.8125rem): captions, metadata, table headers in Ink Muted. In Geist Mono for UEI, CAGE, NAICS, PSC, license numbers, sources, page references and HUD readouts.
- **Figures** (400, clamp(1.75rem, 3vw, 2.5rem), tabular numerals): the market numerals in the ledger table.

### Named Rules
**The Mono Is Data Rule.** Geist Mono is for identifiers, citations, measurements and readouts. Never for headings, buttons or decoration.

**The No Eyebrow Rule.** No small label above a section heading. The heading carries the section; the nav already names it.

## Layout

A single 1320px container (container) with a fluid gutter (gutter) and generous section padding (section). Sections are full-width bands that alternate between ground and band, each separated by a Rule Soft hairline at the top.

Most sections use a split: a 5fr heading column and a 7fr content column with a clamp(32px, 6vw, 96px) gap. On desktop the heading column is sticky under the 64px header (nav), so the claim stays in view while the evidence scrolls. Commitments use a three-column ruled strip; staffing uses a three-column strip with vertical seams.

The hero fills the viewport with the live scanner canvas, a left-to-right scrim for legibility, copy bottom-left and the registration card bottom-right.

Responsive behavior: splits stack below 900px and the nav collapses to a menu; the hero card drops under the copy below 1000px; three-column strips stack below 760 to 860px; the step tabs go 2x2 and ledger and trace rows reflow to single columns below 560 to 640px. On coarse pointers every link and control gets a 44px target.

## Elevation & Depth

Flat. No content surface casts a shadow. Depth comes from tonal stepping (ground, band, raised) and from rules. The two translucent layers are functional, not decorative: the header bar (0.9 alpha with a 12px backdrop blur) once it is solid, and the hero registration card over the canvas. The input focus ring is a 3px cyan halo at 18% alpha, a state cue rather than elevation.

### Named Rules
**The Seam Not Shadow Rule.** If two surfaces need separating, draw a 1px rule or step the tone. Never add a drop shadow.

## Shapes

Near-square everywhere: 2px (sm) on buttons, inputs, panels, statuses and the Copy button; 4px (md) only on the capability dialog. Panels that sit side by side share a border rather than each drawing their own. The only geometric ornaments are the HUD corner brackets in the hero, the 8px teal square marking the candor callout, and the bracket mark in the logo.

## Components

### Buttons
- **Shape:** near-square (2px), 46px tall, 20px horizontal padding, Geist 500 at 0.95rem.
- **Primary:** Survey Teal fill with Teal Ink text. Hover steps to Survey Teal Bright.
- **Ghost:** translucent charcoal with a Rule Strong border and Ink text. Hover brightens the border to Ink and fills Charcoal Raised.
- **States:** color transitions run 160ms on the UI ease; press nudges 1px down; focus is a 2px cyan outline offset 3px. No lift, no glow.

### Navigation
- **Style:** a 64px bar, transparent over the hero, solid (charcoal at 0.9 alpha, blurred, Rule bottom border) once the page scrolls 24px.
- **Links:** Ink Lede text; hover brightens to Ink and draws a 1px underline in from the left (240ms). The current section keeps a cyan underline.
- **Contact:** the one teal button in the bar; its arrow nudges up and right on hover.
- **Mobile:** below 900px a 48px menu toggle opens a ruled list of 52px rows with the Contact button at the end.

### Step Tabs
- **Style:** four tabs in a ruled grid on the band panel, mono index plus name. A single cyan marker slides under the active tab (240ms) in both the 4-column and 2x2 layouts. Panels fade up on change and their diagram draws in left to right with a clip-path reveal.

### Ledger Table
- **Style:** ruled rows, large tabular numerals on the left, the description in Ink Body, the source in Geist Mono in Ink Muted on the right. Rows take a faint cyan wash from the left on hover.

### Requirement Trace (signature)
- **Style:** a ground panel with a caption bar and ruled rows: requirement name, cyan mono source, quoted RLP text behind a 1px Rule Strong line, and a status badge.
- **Status badges:** near-square outline badges; Met in Met Ink, Needs work in Caution Amber.
- **Motion:** when the rows scroll into view a cyan scan line travels down them; each row flashes a faint cyan wash as it passes and its badge resolves from a muted "Checking" to its final status. The final status text is always in the DOM for screen readers; with reduced motion the scan is skipped and statuses show immediately.

### Inputs / Fields
- **Style:** Charcoal Ground fill, 1px Rule border, 2px corners, 46px tall, cyan caret.
- **Hover / Focus:** border steps to Rule Strong on hover; focus turns it cyan with a 3px cyan halo.
- **Error:** amber border and an amber message under the field naming the fix.

### Ruled Rows (people, license, directory)
- **Style:** no cards. Entries sit between top and bottom rules, separated by a vertical seam on desktop. Role labels in Survey Teal, links underlined in Rule Strong that turn cyan on hover.

### Commitments
- **Style:** a three-column ruled strip under an Ink Muted top rule. On hover a cyan rule draws across the top of the column (420ms).

## Do's and Don'ts

### Do:
- **Do** separate surfaces with 1px rules (Rule, Rule Soft) and tonal steps between ground, band and raised.
- **Do** state the source next to every figure, in Geist Mono and Ink Muted.
- **Do** ease arrivals on cubic-bezier(0.16, 1, 0.3, 1) and UI feedback on cubic-bezier(0.25, 1, 0.5, 1), at 160ms for feedback and 240ms for state changes.
- **Do** gate entrance reveals on the `.js` class so content is visible when scripts fail, and give every animation a reduced-motion path that keeps fades and drops movement.
- **Do** keep every text color at or above Ink Muted on the band.

### Don't:
- **Don't** add drop shadows, glass blur or glows to content surfaces.
- **Don't** round corners past 2px on page components.
- **Don't** put an eyebrow label above a section heading.
- **Don't** use cyan for anything that is not checked, selected or focused, and don't fill large areas with it.
- **Don't** use a colored side stripe (a border-left over 1px) on callouts or rows.
- **Don't** use Geist Mono for headings, buttons or decoration.
- **Don't** show testimonials, client logos, award counts or case studies; the firm has none yet, and PRODUCT.md says so.
