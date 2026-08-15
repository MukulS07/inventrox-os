import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Hero } from "@/components/landing/hero";
import {
  Bento,
  FinalCTA,
  Pricing,
  Problems,
  Roadmap,
  SocialProof,
  StatsBand,
  TrustGrid,
  WorkflowExplorer,
} from "@/components/landing/sections";

const title = "INVENTROX — The Operating System for Modern Businesses";
const description =
  "Inventory, POS billing, GST invoicing, CRM and AI forecasting in one tenant-isolated platform for retailers, distributors and SMEs.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <Hero />
        <Problems />
        <Bento />
        <WorkflowExplorer />
        <Roadmap />
        <TrustGrid />
        <StatsBand />
        <SocialProof />
        <Pricing />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
