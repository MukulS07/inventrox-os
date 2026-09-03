import { Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { customers, revenueSeries } from "@/data/mock";

const rows = [
  { sku: "INVX-00231", name: "Colombia Supremo 1kg", qty: 128, status: "In stock" as const },
  { sku: "INVX-00417", name: "House Blend 500g", qty: 6, status: "Low stock" as const },
  { sku: "INVX-00902", name: "Barista Oat Milk 1L", qty: 74, status: "In stock" as const },
  { sku: "INVX-01144", name: "Ethiopia Yirgacheffe", qty: 0, status: "Out of stock" as const },
];

const statusTone: Record<string, string> = {
  "In stock": "bg-sage text-signal",
  "Low stock": "bg-butter text-warning",
  "Out of stock": "bg-blush text-destructive",
};

export function Hero() {
  const max = Math.max(...revenueSeries.map((d) => d.value));

  return (
    <section className="border-b border-rule">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:py-28">
        {/* Left — editorial column */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
            <span className="size-1.5 rounded-full bg-signal" />
            <span className="label-mono">Inventory · POS · CRM</span>
          </span>

          <h1 className="mt-7 text-balance text-[2.75rem] leading-[1.04] tracking-tight md:text-6xl">
            Inventory that{" "}
            <span className="serif-accent text-roast">actually</span> matches your shelf.
          </h1>

          <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-muted-foreground">
            INVENTROX keeps stock, billing, GST invoicing and customer history in one place — so
            every sale updates the ledger, the shelf count and the relationship at once.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" className="rounded-full px-7" asChild>
              <Link to="/dashboard">
                Start for free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-7" asChild>
              <Link to="/contact">Get a demo</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {["No card required", "Import from Excel or Tally", "Live in a week"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-signal" /> {f}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Right — real product surface, bordered */}
        <Reveal delay={120} className="relative">
          <div className="glass overflow-hidden">
            <div className="flex items-center justify-between border-b border-rule px-5 py-3.5">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Boxes className="size-4" /> Stock overview
              </span>
              <span className="label-mono">Synced 12:04</span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[var(--rule)] border-b border-rule">
              {[
                ["SKUs", "3,482"],
                ["Valuation", "₹41.2L"],
                ["Low stock", "12"],
              ].map(([k, v]) => (
                <div key={k} className="px-5 py-4">
                  <p className="label-mono">{k}</p>
                  <p className="mt-1 text-xl font-semibold tabular">{v}</p>
                </div>
              ))}
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-rule">
                  {["SKU", "Item", "Qty", "Status"].map((h) => (
                    <th key={h} className="label-mono px-5 py-2.5 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.sku}
                    className="border-b border-rule transition-colors last:border-0 hover:bg-accent/60"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.sku}</td>
                    <td className="px-5 py-3 text-sm">{r.name}</td>
                    <td className="px-5 py-3 text-sm tabular">{r.qty}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${statusTone[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-end gap-1.5 border-t border-rule px-5 py-4">
              {revenueSeries.map((d, i) => (
                <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-sm ${
                      i === revenueSeries.length - 1 ? "bg-roast" : "bg-foreground/12"
                    }`}
                    style={{ height: `${Math.max(6, (d.value / max) * 44)}px` }}
                  />
                  <span className="label-mono text-[9px]">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assistant card — the one overlay allowed a shadow */}
          <div className="glass-strong absolute -bottom-8 -left-4 hidden w-64 p-4 shadow-[var(--shadow-pop)] sm:block lg:-left-12">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full border border-foreground/70">
                <Sparkles className="size-3.5" />
              </span>
              <span className="label-mono">Reorder assistant</span>
            </div>
            <p className="mt-3 text-sm leading-snug">
              Yirgacheffe hits zero in <span className="tabular font-medium">4 days</span>. Draft a
              PO for 24 packs?
            </p>
          </div>

          {/* Top account chip */}
          <div className="glass absolute -right-3 -top-6 hidden items-center gap-2.5 px-3.5 py-2.5 lg:flex">
            <span className="grid size-7 place-items-center rounded-full bg-accent font-mono text-[10px] font-semibold text-accent-foreground">
              {customers[0]!.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="text-xs font-medium leading-tight">{customers[0]!.name}</p>
              <p className="label-mono text-[9px]">
                LTV ₹{(customers[0]!.ltv / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
