import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const title = "Contact INVENTROX — Talk to sales";
const description =
  "Book a walkthrough of INVENTROX: inventory, POS, GST invoicing, CRM and AI forecasting for multi-location businesses.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

const channels = [
  { icon: Mail, label: "sales@inventrox.com", note: "Replies within one business day" },
  { icon: Phone, label: "+91 80 4718 2200", note: "Mon–Sat, 9:30–19:00 IST" },
  { icon: MessageSquare, label: "WhatsApp support", note: "For live tenants on Standard and above" },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="hero-glow">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-2">
          <Reveal>
            <h1 className="text-balance text-5xl font-semibold md:text-6xl">
              Let's map your rollout
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              Tell us how many locations you run and what you bill on today. We'll come back with a
              migration plan and a live walkthrough on your own catalog.
            </p>
            <ul className="mt-10 space-y-4">
              {channels.map((c) => (
                <li key={c.label} className="glass flex items-center gap-4 p-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-roast">
                    <c.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="glass p-7">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Thanks — we'll be in touch within one business day.");
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required placeholder="Mukul Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" required placeholder="Bluebird Retail" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" required placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locations">Locations</Label>
                <Input id="locations" inputMode="numeric" placeholder="3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">What are you running today?</Label>
                <Textarea id="message" rows={5} placeholder="Tally + a legacy POS, ~1,200 SKUs…" />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Request a walkthrough
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo form — wire it to your own RPC endpoint when you integrate the backend.
              </p>
            </form>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
