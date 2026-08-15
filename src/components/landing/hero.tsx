import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import { revenueSeries } from "@/data/mock";

function MiniChart() {
  const max = Math.max(...revenueSeries.map((d) => d.value));
  return (
    <div className="flex h-28 items-end gap-2">
      {revenueSeries.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-sm bg-signal/70 transition-all duration-700"
            style={{ height: `${(d.value / max) * 100}%`, transitionDelay: `${i * 60}ms` }}
          />
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-glow">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 md:pt-28">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-glass px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-signal" />
            99.98% sync uptime across every tenant
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] md:text-7xl lg:text-[84px]">
            Run every order, every counter,
            <br className="hidden md:block" /> every ledger — from one platform.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            INVENTROX unifies inventory, POS billing, GST invoicing, CRM and AI forecasting for
            retailers, distributors and SMEs — with offline resilience built into every write.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Start free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">See it in action</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto mt-16 max-w-5xl">
          <div className="glass-strong p-3 shadow-[var(--shadow-glass)]">
            <div className="rounded-xl bg-card/80 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue this week</p>
                  <p className="mt-1 text-3xl font-semibold">
                    <CountUp value={820000} prefix="₹" />
                  </p>
                </div>
                <div className="hidden items-center gap-6 sm:flex">
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-xl font-semibold tabular">
                      <CountUp value={1284} />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. order</p>
                    <p className="text-xl font-semibold tabular">
                      <CountUp value={638} prefix="₹" />
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-2.5 py-1 text-xs text-signal">
                    <Activity className="size-3.5" /> Live sync
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <MiniChart />
              </div>
            </div>
          </div>

          <div className="glass absolute -bottom-6 -left-2 hidden w-72 p-4 shadow-[var(--shadow-glass)] sm:block md:-left-10">
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-roast/15 text-roast">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-roast">AI insight</p>
                <p className="mt-1 text-sm leading-snug">
                  Ethiopia Yirgacheffe — <span className="tabular">4 days</span> to stockout. Reorder
                  24 packs to hold service level.
                </p>
              </div>
            </div>
          </div>

          <div className="glass absolute -right-2 -top-6 hidden w-56 p-4 shadow-[var(--shadow-glass)] md:block md:-right-10">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-signal/15 text-signal">
                <TrendingUp className="size-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Forecast accuracy</p>
                <p className="text-lg font-semibold tabular">
                  <CountUp value={94.2} decimals={1} suffix="%" />
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
