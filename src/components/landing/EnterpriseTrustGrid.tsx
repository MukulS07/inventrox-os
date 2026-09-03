import { ShieldCheck, History, UserCheck, Receipt, WifiOff, Activity, Cpu, HeartHandshake } from "lucide-react";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { TextReveal } from "@/components/landing/TextReveal";

const trustTiles = [
  {
    icon: ShieldCheck,
    title: "Multi-Tenant RLS Isolation",
    description: "Row-Level Security policies in Supabase ensure store & organization data is cryptographically isolated.",
  },
  {
    icon: History,
    title: "Immutable Audit Trail",
    description: "Every invoice creation, stock adjustment, and price edit is recorded with precise timestamps & user ID.",
  },
  {
    icon: UserCheck,
    title: "Role-Based Access Control",
    description: "Granular permissions for Baristas, Store Managers, Accountants, and Roastery Admins.",
  },
  {
    icon: Receipt,
    title: "GST & GSTR-1 Compliance",
    description: "Built-in HSN code mapping, CGST/SGST splitting, and instant JSON exports for GSTR-1 filing.",
  },
  {
    icon: WifiOff,
    title: "Three-Tier Offline Resilience",
    description: "Local storage persistence queues offline counter sales and auto-syncs when internet restores.",
  },
  {
    icon: Activity,
    title: "99.98% Sync Uptime",
    description: "High-availability cloud architecture ensures real-time stock sync across multiple cafe locations.",
  },
  {
    icon: Cpu,
    title: "n8n & Webhook Integrations",
    description: "Connect WhatsApp, Shopify, QuickBooks, and custom webhooks effortlessly with built-in n8n workflows.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Onboarding",
    description: "Our technical team handles inventory migration from legacy POS software or Excel within 48 hours.",
  },
];

export function EnterpriseTrustGrid() {
  return (
    <section id="security" className="mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center">
      <ScrollReveal variant="fade-up">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]">
            Enterprise Trust & Security
          </span>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white">
            <TextReveal text="Sovereign security & reliability" />
            <br />
            <TextReveal className="bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold" text="for multi-location operations" delay={300} />
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Built from the ground up for high-availability retail and multi-branch operations.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trustTiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <ScrollReveal key={tile.title} variant="fade-up" delay={i * 80} className="h-full">
              <div className="glass-card p-6 h-full flex flex-col justify-between hover:border-[#00f0ff]/40 transition-all">
                <div>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">{tile.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{tile.description}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
