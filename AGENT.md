# AGENT.md — INVENTROX Backend & Systems Specification

> This document is written for an engineering agent (human or AI) building or maintaining the
> INVENTROX backend. It defines architecture, data contracts, and operating rules. Treat every
> "MUST" as a hard constraint and every "SHOULD" as a default that needs a stated reason to break.

---

## 1. Product Summary

INVENTROX is a multi-tenant Business OS for specialty coffee roasters (and, per the rebrand,
positioned more broadly as an AI-powered operations platform for SMEs): inventory, wholesale
supply chain, POS billing, CRM, and AI-driven business intelligence, in one app.

Live reference deployment: `https://inventrox.vercel.app/`
Design/positioning reference for the rebrand: `https://calldesk.ai/` (structure and confidence of
messaging, not literal content — see `DESIGN.md`).

---

## 2. Tech Stack (source of truth)

| Layer | Choice |
|---|---|
| Frontend framework | React 19 + Vite + TanStack Router (TanStack Start SSR) |
| Styling | Tailwind CSS + glassmorphism backdrop filters + Framer Motion / GSAP |
| Backend | TanStack Start server RPC functions (`db-service.ts`) |
| Primary database | Supabase PostgreSQL, Row Level Security (RLS), multi-tenant |
| Local fallback DB | `./data/db.json` written by server RPC |
| Client offline cache | Browser local state, used only when server endpoints are unreachable |
| AI layer | OpenAI-compatible SDK — NVIDIA NIM / DeepSeek-v4, GitHub Models, or GPT-4o |
| Automation | n8n (webhook-triggered workflows) |
| Email | Resend API |
| WhatsApp / SMS | MSG91 API |

Agents implementing features MUST use this stack. Do not introduce a second ORM, a second state
manager, or a second automation engine without updating this document first.

---

## 3. Architecture: Double Persistence Strategy

INVENTROX never assumes the network is reliable. Every write path has three tiers, attempted in
order:

1. **Cloud (primary):** Supabase Postgres via RLS-scoped queries, keyed by `auth.uid()`.
2. **Local server fallback:** TanStack Start RPC functions in `db-service.ts` write directly to
   `./data/db.json` when Supabase is unreachable or unconfigured (no `VITE_SUPABASE_URL`).
3. **Offline client cache:** If server RPC endpoints themselves are unreachable (client is fully
   offline), state falls back to an in-memory/local browser cache and queues a resync.

**Agent rule:** any new data-writing feature MUST implement all three tiers or explicitly document
why a tier is skipped (e.g., an AI-only feature with no persisted state).

**Agent rule:** never write directly to `db.json` from the client. All writes go through RPC.

---

## 4. Multi-Tenancy & Auth

- Every tenant-owned table carries `user_id uuid references auth.users(id) default auth.uid()`.
- RLS policy pattern (applied per table): `using (auth.uid() = user_id)` for all operations.
- Composite unique constraints enforce per-tenant uniqueness, not global uniqueness — e.g.
  `unique (user_id, sku)` on `products`, `unique (user_id, invoice_number)` on `sales`.
- Auth: Google OAuth + email/credentials sign-in, plus self-serve company registration from the
  landing page auth console.
- **Agent rule:** never write a query that reads/writes tenant data without a `user_id` filter or
  an RLS policy backing it. Assume RLS is the last line of defense, not the only one — application
  code should still scope queries explicitly for clarity and to avoid relying on policy alone.

---

## 5. Data Model (Supabase Postgres)

Core tables (see full DDL in the project README / migration script):

- **`products`** — `sku`, `name`, `category`, `cost`, `price`, `stock`, `gst_rate`, `hsn`, `unit`,
  `image_url`, `description`, `supplier`, `user_id`. Categories: Coffee, Syrups, Milks, Packaging,
  Accessories, Apparel.
- **`customers`** — CRM record: `name`, `phone`, `email`, `segment`, `address`, `gstin`,
  `joined_date`, `ltv`, `orders_count`, `avg_order_value`, `days_since_last_visit`.
- **`sales`** — transaction ledger: `invoice_number`, `customer_id`/`customer_name`/`customer_phone`,
  `subtotal`, `discount`, `gst`, `total`, `payment_method`, `items` (jsonb line items), `date`.
- **`suppliers`** — `name`, `phone`, `email`, `address`, `gstin`, `active_orders`, `total_value`.
- **`customer_notes`** — CRM activity log, FK to `customers.id` with cascade delete.

**Agent rule:** any new module (e.g., a future "roasting batches" or "green coffee lots" table)
MUST follow the same shape: `id uuid default gen_random_uuid() primary key`, a `user_id` tenant
column, RLS enabled, and an ownership policy — copy the pattern in Section 8 of the source README
verbatim rather than inventing a new one.

---

## 6. Module → Backend Responsibility Map

| Module | Backend responsibility |
|---|---|
| Product Catalog | CRUD on `products`, category tagging, HSN/SKU validation |
| Inventory Ledger | Stock read/write with optimistic +/- adjustments, audit trail |
| Asset Valuation | Aggregation query: valuation weight per category (server-computed, not client-computed, to avoid drift) |
| AI Rate List Extractor | File upload → OCR/AI parse (Excel/PDF/image) → structured SKU/cost/margin rows → insert into `products` after user confirmation. Never auto-commit unconfirmed AI extractions. |
| Suppliers Directory | CRUD on `suppliers`, active order counts, reorder threshold checks feeding `inventory.low_stock` events |
| POS Console | Transactional write to `sales` + stock decrement in one logical operation; OTP verification for high-value discounts |
| Transaction Ledger | Read-only aggregation over `sales` (AOV, tax breakdowns) |
| Invoices | PDF generation, UPI QR generation, watermark seal — triggers `invoice.created` n8n event |
| Customers & LTV | LTV/orders_count/avg_order_value are derived fields — recompute on every `sales` insert tied to that customer, don't let the client set them directly |
| CRM Service Ledger | Scheduled maintenance alerts, technician activity log, customer notes |
| BI Analytics | Server-side aggregation endpoints; do not ship raw `sales` rows to the client for dashboard math at scale |
| Reports Hub | CSV export generation (Revenue Ledger, Catalog Valuation, GST/GSTR-1 ledger, AI Sales Forecast) |
| Command Palette | Read-only fuzzy search across products/customers/tabs — no separate index table needed, query on demand |
| Mini AI Assistant | Calls the AI layer (Section 7) with scoped context: inventory health, forecasts, CRM notes for the current tenant only |
| Public Customer Portal (`/chat`) | Unauthenticated product search + order lookup + service booking; booking wizard auto-creates a `customers` row and `customer_notes` entry |

---

## 7. AI Integration

- SDK: OpenAI-compatible client, pointed at one of `NVIDIA_API_KEY` (NIM/DeepSeek-v4),
  `GITHUB_TOKEN` (GitHub Models), or `OPENAI_API_KEY` (GPT-4o) — first configured key wins; if none
  are set, fall back to a local simulated/canned response so the demo/trial experience still works.
- The Mini AI Assistant MUST be scoped to the authenticated tenant's data only — never construct a
  prompt that could leak cross-tenant rows.
- The AI Rate List Extractor is a **write-adjacent** AI feature: it proposes catalog rows; a human
  confirms before they hit `products`. Treat all AI-proposed writes to financial/inventory data as
  drafts, not commits.

---

## 8. Automation (n8n)

Webhook URLs are configured via localStorage keys or env vars, one per event class:

| Key | Event | Purpose |
|---|---|---|
| `inv_n8n_webhook` | generic/fallback | catch-all business event stream |
| `inv_n8n_webhook_invoice` | `invoice.created` | generate PDF → upload to storage → email via Resend → WhatsApp via MSG91 |
| `inv_n8n_webhook_stock` | `inventory.low_stock` / `.out_of_stock` | alert supplier + admin, recommend reorder |
| `inv_n8n_webhook_assistant` | `ai.assistant` | pipe Mini AI queries into a custom n8n agent context |

**Agent rule:** webhook payloads MUST be tenant-scoped (include `user_id`) so n8n workflows never
cross-contaminate data between roasters. Missing/unreachable webhook = log and continue; never
block the primary user action (e.g., invoice creation must succeed even if the webhook fails).

---

## 9. Environment Configuration

```env
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# AI (pick one; first present wins)
NVIDIA_API_KEY=
GITHUB_TOKEN=
OPENAI_API_KEY=

# Email
RESEND_API_KEY=

# WhatsApp/SMS (not in original .env list but required by MSG91 integration — add explicitly)
MSG91_API_KEY=
```

**Agent rule:** never commit real keys. `.env` stays gitignored; `.env.example` ships with empty
placeholders matching this table exactly.

---

## 10. Local Development

```bash
npm install        # or: bun install
npm run dev         # or: bun run dev  → http://localhost:8080
npm run build        # type-check + compile check before every PR
```

**Agent rule:** `npm run build` MUST pass before a change is considered complete. Type errors in
`db-service.ts` or Supabase query builders are treated as build failures, not warnings.

---

## 11. Non-Negotiables for Any Agent Touching This Codebase

1. Never remove RLS or `user_id` scoping to "make a query simpler."
2. Never let AI-extracted or AI-suggested data write to `products`, `sales`, or `customers`
   without an explicit human confirmation step in the flow.
3. Always keep the three-tier persistence path (cloud → local JSON → offline cache) intact when
   modifying `db-service.ts`.
4. Any new financial calculation (GST, LTV, AOV, valuation) must be computed server-side and
   treated as the source of truth — client-side numbers are for optimistic UI only.
5. Webhook/automation failures must degrade gracefully, never block the user's primary action.
