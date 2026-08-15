# INVENTROX Rebrand — Landing + Dashboard Shell

A frontend-only rebrand built to your DESIGN.md spec: espresso-dark glass system, one warm accent, one cool data accent. Positioned as a horizontal SME operations platform (Option B). All data is realistic mock data, structured to match your existing table shapes so you can swap in your Supabase/RPC layer without touching the UI.

## Design system

- Dark-first base `#0B0908`, glass surfaces (4% white + 20px blur, 8% hairline borders, 16px radius).
- Accents: roast copper `#D97B3F` for CTAs/active states, signal teal `#5EEAD4` for data, live/sync and success. Danger red for low stock.
- Type: Inter Tight display at 56–96px hero with tight tracking, Inter body 16–18px, tabular numerals for all stats.
- Motion: scroll-triggered fade+rise reveals that read like data arriving, count-up stats, hover/tab micro-interactions. Full `prefers-reduced-motion` fallbacks, no ambient looping on content.

## Landing page (`/`)

Following the section rhythm in DESIGN.md:

1. Hero — two-line outcome headline, subhead, dual CTA, dashboard mock in a glass frame with a floating AI insight callout.
2. Problem framing — 3 cards on operational cost of manual ops.
3. Feature bento — animated modular grid of the core modules.
4. Tabbed workflow explorer — POS Checkout / Stock Reorder / GST Invoice / AI Forecast, each with a small animated mock.
5. Go-live roadmap — Week 1/2/3 numbered band (Connect → AI organizes → Run & grow).
6. Enterprise trust grid — 8 tiles: multi-tenant RLS isolation, audit trail, RBAC, GST/GSTR-1, offline resilience, 99.98% sync uptime, n8n/API integrations, dedicated onboarding.
7. Stats band — count-up: customers managed, products tracked, revenue generated, sync uptime.
8. Social proof carousel — structure with placeholder slots (no fabricated customer quotes).
9. Pricing — Trial / Standard (Most Popular) / Enterprise in glass cards.
10. Final CTA band.

Secondary routes: `/pricing` and `/contact` as their own pages with their own metadata, linked from the shared nav and footer.

## Dashboard shell (`/dashboard`)

A rebranded UI reference, not a working backend:

- App shell: collapsible sidebar nav, top bar with tenant switcher, search, sync indicator.
- Overview page: KPI cards, valuation donut, revenue sparkline, low-stock alert list, recent sales table.
- Two representative module tabs — Products (table, category gradient chips, stock badges) and POS console (cart, totals, GST breakdown) — proving the glass card system.
- Command palette (Cmd+K) and mini AI insight widget in the same glass system.

## Technical notes

- TanStack Start routes; design tokens defined as semantic CSS variables in `src/styles.css`, no hardcoded colors in components.
- Mock data lives in typed modules (`src/data/*.ts`) shaped after your `products`, `customers`, `sales`, `suppliers` schemas — including `user_id`, `gst_rate`, `hsn`, `ltv`, `items` jsonb line items — so the swap to your RPC/Supabase layer is a data-source change only.
- Charts and count-ups render statically first, then animate; reduced-motion users get the static state.
- Category gradients terminate into the base background; charts use signal teal with roast copper only for the "current" marker.
