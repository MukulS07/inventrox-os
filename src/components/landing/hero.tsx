import { Link } from "@tanstack/react-router";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import { revenueSeries } from "@/data/mock";

function Sparkbars() {
  const max = Math.max(...revenueSeries.map((d) => d.value));
  return (
    <div className="flex h-12 items-end gap-1.5">
      {revenueSeries.map((d, i) => (
        <div
          key={d.label}
          className="w-full flex-1 rounded-[2px] bg-roast/80"
          style={{
            height: `${Math.max(18, (d.value / max) * 100)}%`,
            opacity: i > revenueSeries.length - 4 ? 1 : 0.45,
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-glow">
      <div className="mx-auto max-w-7xl px-5 pb-40 pt-20 md:pt-24">
        {/* Headline block */}
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-glass px-3 py-1 backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-signal opacity-70 ring-pulse" />
              <span className="relative inline-flex size-2 rounded-full bg-signal" />
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              System status: live operations
            </span>
          </span>

          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            The intelligence layer for <span className="text-roast">modern operations</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            INVENTROX unifies inventory, POS billing, GST invoicing, CRM and AI forecasting into one
            tenant-isolated command center — synchronized to the second, resilient offline.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Start free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">See the live console</Link>
            </Button>
          </div>
        </Reveal>

        {/* Command center visual — stacked glass */}
        <Reveal delay={140} className="relative mx-auto mt-24 aspect-[16/10] w-full max-w-5xl md:aspect-[16/9]">
          {/* ambient glows */}
          <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-roast/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-signal/[0.07] blur-[120px]" />

          {/* Layer 1 — frame + dot grid */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px] border border-border/60 bg-glass backdrop-blur-sm">
            <div className="absolute inset-0 grid-dots opacity-60" />
          </div>

          {/* Layer 2 — main canvas */}
          <div className="glass-strong absolute inset-4 z-10 flex flex-col overflow-hidden rounded-[18px] p-6 shadow-[var(--shadow-glass)] md:inset-6 md:p-8">
            {/* radar rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
              <div className="grid size-[26rem] place-items-center rounded-full border border-border">
                <div className="grid size-64 place-items-center rounded-full border border-border">
                  <div className="size-32 rounded-full border border-roast/25 ring-pulse" />
                </div>
              </div>
            </div>
            {/* scan sweep */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-signal/[0.07] to-transparent scan-sweep" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Revenue this week
                </p>
                <p className="mt-1 text-3xl font-semibold tabular md:text-4xl">
                  <CountUp value={820000} prefix="₹" />
                </p>
              </div>
              <div className="hidden gap-8 text-right sm:flex">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Orders
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular">
                    <CountUp value={1284} />
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Avg. order
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular">
                    <CountUp value={638} prefix="₹" />
                  </p>
                </div>
              </div>
            </div>

            {/* main trend */}
            <div className="relative mt-8 flex flex-1 items-end gap-2 md:gap-3">
              {revenueSeries.map((d, i) => {
                const max = Math.max(...revenueSeries.map((x) => x.value));
                const last = i === revenueSeries.length - 1;
                return (
                  <div key={d.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <div
                      className={`w-full rounded-t-md ${last ? "bg-roast" : "bg-signal/60"}`}
                      style={{ height: `${Math.max(12, (d.value / max) * 92)}%` }}
                    />
                    <span className="text-center text-[10px] text-muted-foreground">{d.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
              <div className="flex gap-6">
                <span>STREAM_ID // INVX-882</span>
                <span className="hidden sm:inline">TENANT // ISOLATED_RLS</span>
              </div>
              <span className="text-signal">SYNC · VERIFIED</span>
            </div>
          </div>

          {/* Layer 3 — throughput panel */}
          <div className="glass-strong absolute -left-6 bottom-16 z-20 hidden w-60 rounded-2xl p-5 shadow-[var(--shadow-glass)] float-a lg:block lg:-left-16">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Throughput rate
            </p>
            <p className="mt-1 text-2xl font-semibold tabular text-signal">
              <CountUp value={14289} />
              <span className="ml-1 text-[10px] font-normal text-muted-foreground">u/hr</span>
            </p>
            <div className="mt-4">
              <Sparkbars />
            </div>
          </div>

          {/* Layer 4 — network health */}
          <div className="glass-strong absolute -right-6 -top-10 z-30 hidden w-52 rounded-xl p-4 shadow-[var(--shadow-glass)] float-b lg:block lg:-right-14">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Network
              </p>
              <span className="size-2 rounded-full bg-signal" />
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[94%] rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Forecast accuracy <span className="tabular text-foreground">94.2%</span>
            </p>
          </div>


          {/* Layer 5 — AI insight */}
          <div className="absolute -right-4 top-1/2 z-40 hidden w-64 -translate-y-1/2 rounded-2xl border border-roast/30 bg-roast/10 p-5 shadow-[var(--shadow-glow)] backdrop-blur-xl float-c lg:block lg:-right-14">
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-roast text-roast-foreground">
                <Zap className="size-4" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-roast">
                  Critical flux
                </p>
                <p className="mt-1 text-sm leading-snug">
                  Yirgacheffe — <span className="tabular">4 days</span> to stockout. Reorder 24
                  packs.
                </p>
              </div>
            </div>
          </div>

          {/* Layer 6 — HUD pill */}
          <div className="absolute -bottom-5 left-8 z-50 hidden items-center gap-4 rounded-full border border-border bg-glass px-6 py-3 font-mono text-[10px] backdrop-blur-xl sm:flex md:left-20">
            <span className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-3 text-signal" /> AUDIT TRAIL: ON
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="text-signal">UPTIME 99.98%</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
