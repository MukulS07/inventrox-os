import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  ClipboardList,
  CreditCard,
  FileText,
  Fingerprint,
  Layers,
  Lock,
  PlugZap,
  Receipt,
  Repeat,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  WifiOff,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import { cn } from "@/lib/utils";

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-roast">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}

/* 2 — Problem framing */
const problems = [
  {
    icon: AlertTriangle,
    title: "Stock decisions made on guesswork",
    body: "Spreadsheets go stale the moment a sale happens, so reorders arrive late and cash sits in the wrong SKUs.",
  },
  {
    icon: Receipt,
    title: "Billing and compliance run in parallel",
    body: "POS in one tool, GST filings in another. Reconciliation eats days every month and errors surface at audit time.",
  },
  {
    icon: Users,
    title: "Customer value is invisible",
    body: "Nobody can say which accounts are growing, stalling or about to churn — because the ledger never talks to the CRM.",
  },
];

export function Problems() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-24">
      <SectionHead
        eyebrow="The cost of manual ops"
        title="Signs your operations are capping your growth"
      />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {problems.map((x, i) => (
          <Reveal key={x.title} delay={i * 90} className="glass card-hover p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-accent text-roast">
              <x.icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{x.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 3 — Feature bento */
export function Bento() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-24">
      <SectionHead
        eyebrow="One platform"
        title="Every module writes to the same source of truth"
        sub="Catalog, inventory, POS, invoicing, CRM and BI share one tenant-scoped ledger — no exports, no drift."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2">
        <Reveal className="glass card-hover p-7 md:col-span-2 md:row-span-1">
          <span className="grid size-10 place-items-center rounded-xl bg-sage text-signal">
            <Boxes className="size-5" />
          </span>
          <h3 className="mt-5 text-xl font-semibold">Inventory ledger with audit trail</h3>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Optimistic stock adjustments, reorder thresholds and server-computed asset valuation per
            category — every movement traceable to a user and a timestamp.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ["SKUs tracked", "3,482"],
              ["Valuation", "₹41.2L"],
              ["Low stock", "12"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-card p-3">
                <p className="text-[11px] text-muted-foreground">{k}</p>
                <p className="mt-1 text-lg font-semibold tabular">{v}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={90} className="glass card-hover p-7">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-roast">
            <Sparkles className="size-5" />
          </span>
          <h3 className="mt-5 text-xl font-semibold">AI rate-list extractor</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Drop a supplier PDF, Excel or photo. Structured SKU, cost and margin rows come back for
            review — nothing commits without confirmation.
          </p>
        </Reveal>

        <Reveal delay={60} className="glass card-hover p-7">
          <span className="grid size-10 place-items-center rounded-xl bg-sage text-signal">
            <CreditCard className="size-5" />
          </span>
          <h3 className="mt-5 text-xl font-semibold">POS console</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Sale and stock decrement commit as one operation, with OTP verification on high-value
            discounts.
          </p>
        </Reveal>

        <Reveal delay={120} className="glass card-hover p-7 md:col-span-2">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-roast">
            <BarChart3 className="size-5" />
          </span>
          <h3 className="mt-5 text-xl font-semibold">BI that computes on the server</h3>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            LTV, AOV, tax breakdowns and demand forecasts are aggregated server-side, so dashboards
            stay fast and numbers never drift between screens.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* 4 — Tabbed workflow explorer */
const workflows = [
  {
    id: "pos",
    label: "POS Checkout",
    icon: CreditCard,
    headline: "Ring up a sale in four taps",
    body: "Scan, apply discount, take UPI — the ledger, stock count and customer LTV update in the same transaction.",
    rows: [
      ["Colombia Supremo 1kg × 2", "₹5,900"],
      ["Barista Oat Milk 1L × 4", "₹840"],
      ["GST (5% / 12%)", "₹396"],
    ],
    total: ["Total due", "₹7,136"],
    tone: "signal" as const,
  },
  {
    id: "reorder",
    label: "Stock Reorder",
    icon: Repeat,
    headline: "Reorders triggered before you notice",
    body: "Threshold breaches raise a low-stock event, match it to the cheapest active supplier and draft the PO.",
    rows: [
      ["House Blend 500g", "6 left · reorder 15"],
      ["Hazelnut Syrup 750ml", "11 left · reorder 18"],
      ["Suggested supplier", "Roast Collective"],
    ],
    total: ["Draft PO value", "₹18,240"],
    tone: "roast" as const,
  },
  {
    id: "gst",
    label: "GST Invoice",
    icon: FileText,
    headline: "Compliant invoices, generated not assembled",
    body: "HSN codes, split GST, UPI QR and a watermark seal on a PDF that maps straight into GSTR-1.",
    rows: [
      ["Invoice", "INV-2041"],
      ["Taxable value", "₹18,000"],
      ["CGST + SGST", "₹900"],
    ],
    total: ["Invoice total", "₹18,900"],
    tone: "signal" as const,
  },
  {
    id: "ai",
    label: "AI Forecast",
    icon: Sparkles,
    headline: "Demand modelled from your own ledger",
    body: "Seasonality and velocity per SKU produce a reorder window and a confidence band you can act on.",
    rows: [
      ["Ethiopia Yirgacheffe", "4 days to stockout"],
      ["Recommended qty", "24 packs"],
      ["Model confidence", "94.2%"],
    ],
    total: ["Working capital freed", "₹2.4L"],
    tone: "roast" as const,
  },
  {
    id: "crm",
    label: "CRM Win-back",
    icon: Users,
    headline: "Churn risk flagged before the account goes quiet",
    body: "Every sale enriches the customer record — segment, LTV and days-since-visit update in the same transaction, so win-back lists write themselves.",
    rows: [
      ["Rhea Nair · Retail", "9 days idle · LTV ₹24.8k"],
      ["Kettle & Co. · Cafe", "2 days idle · LTV ₹1.49L"],
      ["Suggested play", "WhatsApp nudge + 5% coupon"],
    ],
    total: ["Recoverable revenue", "₹1.74L"],
    tone: "signal" as const,
  },
];

export function WorkflowExplorer() {
  const [active, setActive] = useState(workflows[0]!.id);
  const current = workflows.find((w) => w.id === active) ?? workflows[0]!;


  return (
    <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-24">
      <SectionHead
        eyebrow="Explore workflows"
        title="See what a day on INVENTROX looks like"
      />
      <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
        {workflows.map((w) => (
          <button
            key={w.id}
            onClick={() => setActive(w.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors",
              active === w.id
                ? "border-roast/50 bg-accent text-roast"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <w.icon className="size-4" />
            {w.label}
          </button>
        ))}
      </Reveal>

      <Reveal delay={80} className="glass mt-8 grid gap-8 p-7 md:grid-cols-2 md:p-10">
        <div key={current.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h3 className="text-2xl font-semibold md:text-3xl">{current.headline}</h3>
          <p className="mt-3 text-muted-foreground">{current.body}</p>
          <Button variant="outline" className="mt-6" asChild>
            <Link to="/dashboard">
              Open the demo <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div
          key={`${current.id}-panel`}
          className="animate-in fade-in slide-in-from-bottom-3 rounded-2xl border border-border bg-card p-5 duration-500"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {current.label}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px]",
                current.tone === "signal" ? "bg-sage text-signal" : "bg-accent text-roast",
              )}
            >
              live mock
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {current.rows.map(([k, v]) => (
              <li key={k} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="tabular">{v}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium">{current.total[0]}</span>
            <span className="text-xl font-semibold tabular">{current.total[1]}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* 5 — Go-live roadmap */
const roadmap = [
  {
    week: "Week 1",
    title: "Connect your data",
    body: "Import catalog, customers and opening stock from Excel, Tally or your current POS. Tenant, roles and RLS are provisioned on day one.",
    icon: PlugZap,
  },
  {
    week: "Week 2",
    title: "AI organizes it",
    body: "Rate lists parsed, categories normalised, reorder thresholds proposed from your own sales history and confirmed by your team.",
    icon: Sparkles,
  },
  {
    week: "Week 3",
    title: "Run and grow",
    body: "Counters live on POS, invoices filing-ready, dashboards and automations wired into n8n, WhatsApp and email.",
    icon: BarChart3,
  },
];

export function Roadmap() {
  return (
    <section className="border-y border-rule bg-card/30">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-24">
        <SectionHead eyebrow="Path to go-live" title="Live in three weeks, not three quarters" />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {roadmap.map((s, i) => (
            <Reveal key={s.week} delay={i * 100} className="glass relative p-7">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-signal">
                {s.week}
              </span>
              <h3 className="mt-3 flex items-center gap-2 text-xl font-semibold">
                <s.icon className="size-5 text-roast" />
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              <span className="absolute right-6 top-6 text-4xl font-semibold text-foreground/8 tabular">
                0{i + 1}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6 — Enterprise trust grid */
const trust = [
  { icon: Lock, title: "Multi-tenant RLS isolation", body: "Every row scoped to auth.uid() at the database layer." },
  { icon: ClipboardList, title: "Audit trail", body: "Sales, stock and invoice history retained and queryable." },
  { icon: Fingerprint, title: "Role-based access", body: "Owner, manager and cashier scopes per location." },
  { icon: FileText, title: "GST / GSTR-1 ready", body: "HSN, split tax and filing-shaped exports." },
  { icon: WifiOff, title: "Offline resilience", body: "Three-tier persistence with automatic resync." },
  { icon: Timer, title: "99.98% sync uptime", body: "Measured across tenants over the trailing 90 days." },
  { icon: PlugZap, title: "n8n & API integrations", body: "Webhook events for invoices, low stock and orders." },
  { icon: ShieldCheck, title: "Dedicated onboarding", body: "Migration, training and a named contact." },
];

export function TrustGrid() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-24">
      <SectionHead
        eyebrow="Enterprise ready"
        title="Built for teams that get audited"
        sub="The guarantees that matter when a platform holds your ledger."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map((t, i) => (
          <Reveal key={t.title} delay={(i % 4) * 70} className="glass card-hover p-6">
            <t.icon className="size-5 text-signal" />
            <h3 className="mt-4 text-sm font-semibold">{t.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 7 — Stats band */
export function StatsBand() {
  const stats = [
    { label: "Customers managed", value: 48200, suffix: "+" },
    { label: "Products tracked", value: 132000, suffix: "+" },
    { label: "Revenue processed", value: 96, prefix: "₹", suffix: " Cr" },
    { label: "Sync uptime", value: 99.98, decimals: 2, suffix: "%" },
  ];
  return (
    <section className="border-y border-rule bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <p className="text-4xl font-semibold md:text-5xl">
              <CountUp
                value={s.value}
                decimals={s.decimals ?? 0}
                prefix={s.prefix ?? ""}
                suffix={s.suffix ?? ""}
              />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 8 — Social proof */
export function SocialProof() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-24">
      <SectionHead
        eyebrow="Social proof"
        title="Trusted by operators who count every unit"
        sub="Customer logos and quotes plug in here once approved — placeholders shown, no fabricated testimonials."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Reveal key={i} delay={i * 90} className="glass card-hover p-7">
            <div className="h-6 w-28 rounded bg-foreground/8" />
            <div className="mt-5 space-y-2.5">
              <div className="h-3 w-full rounded bg-foreground/6" />
              <div className="h-3 w-11/12 rounded bg-foreground/6" />
              <div className="h-3 w-2/3 rounded bg-foreground/6" />
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Customer quote pending approval</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 8.5 — CRM relationship ledger */
const pipeline = [
  {
    stage: "New",
    tone: "signal" as const,
    accounts: [{ name: "Mocha Lane", meta: "First order · ₹2,140" }],
  },
  {
    stage: "Active",
    tone: "signal" as const,
    accounts: [
      { name: "Kettle & Co.", meta: "41 orders · AOV ₹3.6k" },
      { name: "Rhea Nair", meta: "12 orders · AOV ₹2.1k" },
    ],
  },
  {
    stage: "Loyal",
    tone: "roast" as const,
    accounts: [
      { name: "Bluebird Cafe", meta: "62 orders · LTV ₹4.86L" },
      { name: "Anchor Roastery", meta: "28 orders · LTV ₹3.12L" },
    ],
  },
  {
    stage: "At risk",
    tone: "roast" as const,
    accounts: [{ name: "Verde Bistro", meta: "21 days idle · LTV ₹88k" }],
  },
];

export function Crm() {
  return (
    <section className="border-y border-rule bg-card/30">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-24">
        <SectionHead
          eyebrow="CRM, built into the ledger"
          title="Every sale deepens the relationship graph"
          sub="No separate CRM to sync — segments, LTV and churn signals compute from the same transactions that run your POS."
        />
        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="space-y-4">
            {[
              {
                k: "Relationship LTV",
                v: "Computed per account from real order history — not a static tag.",
              },
              {
                k: "Churn radar",
                v: "Days-since-visit thresholds surface at-risk accounts with a suggested play.",
              },
              {
                k: "One timeline",
                v: "Invoices, payments, visits and notes on a single customer record.",
              },
            ].map((f) => (
              <div key={f.k} className="glass card-hover p-5">
                <h3 className="text-sm font-semibold">{f.k}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.v}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={120} className="glass-strong p-5 md:p-6">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Account pipeline
              </span>
              <span className="rounded-full bg-sage px-2 py-0.5 text-[11px] text-signal">
                live mock
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {pipeline.map((col) => (
                <div key={col.stage}>
                  <p
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-[0.18em]",
                      col.tone === "signal" ? "text-signal" : "text-roast",
                    )}
                  >
                    {col.stage}
                  </p>
                  <div className="mt-2.5 space-y-2">
                    {col.accounts.map((a) => (
                      <div
                        key={a.name}
                        className="rounded-xl border border-border bg-card p-3 transition-colors hover:border-roast/40"
                      >
                        <p className="truncate text-xs font-medium">{a.name}</p>
                        <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
                          {a.meta}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-roast/40 bg-accent px-4 py-3">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-roast" />
                AI play: win back Verde Bistro with a WhatsApp nudge
              </span>
              <span className="text-sm font-semibold tabular text-roast">₹88k at stake</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* 9 — Pricing */
export const plans = [
  {
    name: "Trial",
    price: "Free",
    note: "14 days, full platform",
    features: ["1 location", "Up to 250 SKUs", "POS + invoicing", "Email support"],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Standard",
    price: "₹4,999",
    note: "per location / month",
    features: [
      "Unlimited SKUs",
      "AI forecasting & rate-list extractor",
      "GST / GSTR-1 exports",
      "n8n + WhatsApp automations",
      "Role-based access",
    ],
    cta: "Start 14-day trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "multi-entity deployments",
    features: [
      "Unlimited locations & users",
      "Dedicated onboarding & migration",
      "Custom integrations and SLAs",
      "Priority support",
    ],
    cta: "Talk to sales",
    popular: false,
  },
];

export function Pricing({ compact = false }: { compact?: boolean }) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-24">
      {!compact && (
        <SectionHead
          eyebrow="Pricing"
          title="Priced per location, not per surprise"
          sub="Every plan includes offline resilience, audit trail and tenant isolation."
        />
      )}
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal
            key={plan.name}
            delay={i * 90}
            className={cn(
              "glass relative flex flex-col p-7",
              plan.popular && "border-[1.5px] border-foreground/60",
            )}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-7 rounded-full bg-foreground px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-background">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-4 text-4xl font-semibold tabular">{plan.price}</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.note}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-signal" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-7" variant={plan.popular ? "default" : "outline"} asChild>
              <Link to={plan.name === "Enterprise" ? "/contact" : "/dashboard"}>{plan.cta}</Link>
            </Button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 10 — Final CTA */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-rule hero-glow">
      <div className="mx-auto max-w-4xl px-5 py-28 text-center">
        <Reveal>
          <Layers className="mx-auto size-8 text-roast" />
          <h2 className="mt-6 text-balance text-4xl font-semibold md:text-6xl">
            One platform behind every counter you run.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Migrate your catalog this week, bill on INVENTROX the next. We stay alongside your team
            at every stage.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Start free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Talk to sales</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
