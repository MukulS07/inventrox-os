# DESIGN.md — INVENTROX Rebrand & Design System

> Direction for the INVENTROX rebrand. Reference for tone/structure: `calldesk.ai` (enterprise
> AI-agent SaaS — confident, editorial, motion-led). Reference for current baseline:
> `inventrox.vercel.app` (dark glassmorphism, modular dashboard). The goal is to keep INVENTROX's
> dark, roaster-native identity but borrow Calldesk's storytelling structure, restraint, and
> enterprise credibility signals.

---

## 1. What to borrow from Calldesk, and what not to

**Borrow:**
- A **two-line, oversized hero headline** that names the outcome, not the feature ("AI agents that
  talk like humans" → for us: something like "Run every cup, every counter, every ledger — from
  one platform").
- **Section rhythm:** problem framing → live product visual → tabbed use-case explorer → "path to
  go-live" timeline → enterprise trust/security grid → stats band → testimonial carousel → final
  CTA. This is a proven enterprise-SaaS scroll structure and maps cleanly onto INVENTROX's modules.
- **Restraint in color:** Calldesk leans on near-black/near-white with a single accent, not a rainbow
  of gradients. INVENTROX should pick one accent family and stay disciplined.
- **Tabbed use-case cards** (their "Qualification & Identification / FAQs / Ticket Creation / Agent
  Transfer") → for INVENTROX this becomes tabbed **workflow demos**: POS Checkout / Stock Reorder /
  GST Invoice / AI Forecast — each with a small animated mock interaction.
- **Counted stats band** (Customer Satisfaction, Resolution Rate, Cost Reduction, Response Time) →
  reuse the pattern with roaster-relevant numbers already present on the current site (Customers
  managed, Products tracked, Revenue generated) plus one operational stat (e.g. sync latency /
  uptime, which the current build already surfaces at 99.98%).
- **"Go live in N days" roadmap** → INVENTROX's existing "Connect → AI organizes → Run & grow" 3-step
  flow is the right shape; tighten the copy to match Calldesk's confident, numbered-week format.

**Do not borrow:**
- Literal color palette, logo, waveform/voice-call iconography, or copy — this is a different
  vertical (retail/coffee ops, not voice AI) and reusing call-center visual language (phone
  bubbles, waveforms) would misrepresent the product.
- Calldesk's light-mode-only system. INVENTROX's identity is dark-first; keep it.

---

## 2. Brand Personality

| Axis | Position |
|---|---|
| Tone | Confident, operational, precise — not playful, not corporate-cold |
| Voice | Second person, outcome-first ("Run your roastery from one screen," not "Our platform offers...") |
| Visual mood | Espresso-dark, warm accent light, glass surfaces catching light like a bar counter at night |
| Motion | Purposeful, not decorative — scroll-triggered reveals that mirror a real dashboard loading, not gratuitous parallax |

---

## 3. Color System

Keep the existing dark-mode base; add one warm accent and one cool "data" accent so charts and
CTAs stay distinguishable from decorative UI.

| Token | Value (approx.) | Use |
|---|---|---|
| `--bg-base` | `#0B0908` (near-black, warm-tinted, not pure black) | App/page background |
| `--surface-glass` | `rgba(255,255,255,0.04)` + `backdrop-blur(20px)` | Glass cards/panels |
| `--surface-border` | `rgba(255,255,255,0.08)` | Card hairlines |
| `--accent-roast` | `#D97B3F` (warm amber/copper — "roasted" accent) | Primary CTA, highlights, active states |
| `--accent-signal` | `#5EEAD4` (cool teal) | Data viz, success states, live/sync indicators |
| `--text-primary` | `#F5F1EC` (warm off-white) | Headlines, body |
| `--text-muted` | `rgba(245,241,236,0.6)` | Secondary copy |
| `--danger` | `#E5484D` | Low-stock/out-of-stock alerts |

Theme palettes in Settings (Midnight Black / Arctic White / Neon Blue / Royal Purple) stay as
user-selectable modes; the palette above is the **default/marketing** identity, not a replacement
for in-app theming.

---

## 4. Typography

- **Display/headline:** a confident geometric-humanist sans (e.g. Inter Tight, General Sans, or
  Satoshi) at large sizes (56–96px desktop hero), tight leading, -2% to -3% tracking — matches
  Calldesk's oversized two-line headline treatment.
- **Body:** the same family or a paired serif-free workhorse (Inter) at 16–18px, 1.6 line-height,
  `--text-muted` for supporting copy.
- **Numerals/stats:** tabular figures, slightly larger weight, used in the stats band and inline
  dashboard cards (LTV, AOV, valuation %) so numbers never visually jitter when they update.

---

## 5. Landing Page Structure (rebrand blueprint)

1. **Hero** — two-line outcome headline, one-sentence subhead, dual CTA ("Start free" /
   "See it in action"), live dashboard screenshot in a glass frame with a subtle floating
   "AI insight" callout card (mirrors Calldesk's floating chat-bubble device, but as an inventory
   insight, e.g. "Ethiopia Yirgacheffe — 4 days to stockout").
2. **Problem framing** — 3-card "signs your operations are costing you growth" (already written on
   current site — keep, tighten visual weight to match Calldesk's icon+headline+one-liner cards).
3. **Product visual band** — animated feature bento (already spec'd as "Feature Bento Showcase" in
   the source doc) with scroll-triggered card reveals via GSAP ScrollTrigger + Lenis smooth scroll.
4. **Tabbed workflow explorer** — POS / Inventory / Invoicing / AI Forecast tabs, each with a small
   looping product mock, directly modeled on Calldesk's "Explore automation use cases" section.
5. **Go-live roadmap** — reuse existing "Connect → AI organizes → Run & grow" 3-step flow, restyle
   as a numbered week-by-week band like Calldesk's "Week 1 / Week 2 / Week 3" roadmap.
6. **Enterprise trust grid** — 8-tile grid: Multi-tenant RLS isolation, Audit trail (sales/invoice
   history), Role-based access, GST/GSTR-1 compliance, Offline resilience (three-tier persistence),
   99.98% sync uptime, n8n/API integrations, Dedicated onboarding.
7. **Stats band** — animated count-up: Customers managed, Products tracked, Revenue generated,
   Sync uptime.
8. **Testimonials / social proof carousel** — roaster logos + quotes (structure only; content is
   real customer data, not fabricated).
9. **Pricing** — keep existing Trial / Standard / Enterprise structure; visually align card style
   with the glass system (Section 3), "Most Popular" badge on Standard.
10. **Final CTA band** — full-bleed dark section, single strong CTA, mirrors Calldesk's closing
    "At every stage, we work alongside your team" band.

---

## 6. Motion Principles

- **Lenis** for smooth scroll; **GSAP ScrollTrigger** for section-entry reveals; **Framer Motion**
  for micro-interactions (hover states, tab switches, stat count-ups).
- Every animated element MUST have a static, fully-legible fallback (respect
  `prefers-reduced-motion`).
- Scroll-triggered reveals should feel like **data arriving**, not decoration: cards fade+rise
  once, no infinite looping ambient motion on core content (looping is reserved for background
  texture only, e.g. a subtle steam/gradient drift behind the hero).

---

## 7. Component Notes (in-app product, not just marketing site)

- **Glass card system**: `--surface-glass` + `--surface-border` + `backdrop-blur(20px)`, 16px
  radius, consistent across ProductsTab, InventoryTab, CategoriesTab, etc. — do not let individual
  tabs invent their own card style.
- **Category gradient panels** (Coffee/Syrups/Milks/Packaging/Accessories/Apparel) keep their
  existing per-category color coding, but all gradients should terminate into `--bg-base` so they
  read as accents on the dark system, not standalone colored blocks.
- **Charts** (donut valuation, LTV sparklines, forecast bands) use `--accent-signal` as the primary
  data color, `--accent-roast` only for the single "you are here" or "current" marker so the two
  accents never compete on the same chart.
- **Command Palette (Cmd+K)** and **Mini AI widget** should use the same glass system as the rest
  of the app — they are core product surfaces, not marketing flourishes.

---

## 8. Naming/Positioning Note

Current landing copy positions INVENTROX generically ("for retailers, distributors and SMEs"),
while the product doc positions it specifically for **specialty coffee roasters**. Pick one lane
for the rebrand:

- **Option A — Vertical-specific (recommended given the product depth):** lead with roaster-native
  language (green coffee, wholesale supply, service/CRM for espresso machines) the way Calldesk
  leads hard into "AI voice agents for contact centers" rather than generic "business software."
  Specificity reads as more credible, matching the Calldesk-style confidence this rebrand is
  chasing.
- **Option B — Horizontal SME platform:** keep the current generic framing and treat coffee as one
  vertical example among several.

This is a product decision, not just a design one — flag it before locking hero copy.
