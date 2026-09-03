import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { FinalCTA, Pricing, TrustGrid } from "@/components/landing/sections";
import { Reveal } from "@/components/site/reveal";

const title = "Pricing — INVENTROX";
const description =
  "Trial, Standard and Enterprise plans priced per location. Every plan includes offline resilience, audit trail and tenant isolation.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <section className="hero-glow border-b border-rule">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center">
            <Reveal>
              <h1 className="text-balance text-5xl font-semibold md:text-6xl">
                Priced per location, not per surprise
              </h1>
              <p className="mt-5 text-muted-foreground">
                Start on a full-platform trial. Move to Standard when you go live, and to Enterprise
                when you run multiple entities.
              </p>
            </Reveal>
          </div>
        </section>
        <Pricing compact />
        <TrustGrid />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
