import { useState } from "react";
import { ShoppingCart, RefreshCw, FileCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { TextReveal } from "@/components/landing/TextReveal";

const workflows = [
  {
    id: "pos",
    label: "POS Checkout",
    icon: ShoppingCart,
    title: "1-Click Counter POS & Instant Barcode Scan",
    description: "Scan items, apply discounts, select payment mode, and generate instant GST digital receipts — zero lag during morning rush.",
    highlights: ["Bluetooth & USB barcode scanner", "Multiple payment modes (UPI, Card, Cash)", "Automatic inventory decrement"],
    mock: (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#D97B3F]/20 text-[#D97B3F] text-xs font-mono font-bold">POS</span>
            <div>
              <div className="text-sm font-semibold text-[#F5F1EC]">Counter #1 — Active Cart</div>
              <div className="text-xs text-[#5EEAD4]">3 Items Scanned</div>
            </div>
          </div>
          <span className="rounded-full bg-[#5EEAD4]/10 px-2.5 py-1 text-xs font-medium text-[#5EEAD4]">Ready</span>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-xs">
            <span className="text-[#F5F1EC]">2x Espresso Roast (250g)</span>
            <span className="font-mono text-[#5EEAD4]">₹960.00</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-xs">
            <span className="text-[#F5F1EC]">1x Oat Milk (1L Box)</span>
            <span className="font-mono text-[#5EEAD4]">₹240.00</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm font-bold">
          <span className="text-[#F5F1EC]">Total Payable</span>
          <span className="font-mono text-[#D97B3F] text-lg">₹1,200.00</span>
        </div>
      </div>
    ),
  },
  {
    id: "reorder",
    label: "Stock Reorder",
    icon: RefreshCw,
    title: "Automated Supplier Reorders & Par Level Alerts",
    description: "Never run out of milk, beans, or cups. AI tracks daily burn rate and generates purchase orders automatically when stock drops.",
    highlights: ["Dynamic par level calculation", "Automated WhatsApp & Email PO dispatch", "Supplier lead-time tracking"],
    mock: (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#5EEAD4]/20 text-[#5EEAD4] text-xs font-mono font-bold">PO</span>
            <div>
              <div className="text-sm font-semibold text-[#F5F1EC]">Auto Purchase Order #PO-941</div>
              <div className="text-xs text-[#D97B3F]">Triggered by Par Level Alert</div>
            </div>
          </div>
          <span className="rounded-full bg-[#D97B3F]/20 px-2.5 py-1 text-xs font-medium text-[#D97B3F]">Pending Dispatch</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs space-y-2">
          <div className="flex justify-between text-[#F5F1EC]">
            <span>Supplier: Blue Tokai Roasters</span>
            <span className="text-[#5EEAD4]">Lead Time: 24h</span>
          </div>
          <p className="text-[rgba(245,241,236,0.6)]">Ordered: 40kg Colombia Excelso Green Beans</p>
        </div>
      </div>
    ),
  },
  {
    id: "invoice",
    label: "GST Invoice",
    icon: FileCheck,
    title: "B2B & B2C Compliant GST Invoicing & GSTR-1",
    description: "Generate compliant tax invoices with HSN codes in seconds. Auto-calculate CGST, SGST, IGST and export one-click GSTR-1 reports.",
    highlights: ["Automatic HSN code lookup", "B2B party GSTIN validation", "One-click GSTR-1 JSON export"],
    mock: (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#D97B3F]/20 text-[#D97B3F] text-xs font-mono font-bold">GST</span>
            <div>
              <div className="text-sm font-semibold text-[#F5F1EC]">Tax Invoice #INV-2026-881</div>
              <div className="text-xs text-[#5EEAD4]">HSN: 0901 — Coffee Beans</div>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">GST Verified</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-white/5 p-3">
            <div className="text-[rgba(245,241,236,0.6)]">Taxable Amount</div>
            <div className="font-mono text-[#F5F1EC] font-bold mt-1">₹14,500.00</div>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <div className="text-[rgba(245,241,236,0.6)]">CGST (2.5%) + SGST (2.5%)</div>
            <div className="font-mono text-[#5EEAD4] font-bold mt-1">₹725.00</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "forecast",
    label: "AI Forecast",
    icon: Sparkles,
    title: "Predictive Demand & Revenue Insights",
    description: "Machine learning algorithms analyze historical sales patterns, weather, and weekend rushes to forecast inventory requirements 14 days out.",
    highlights: ["14-day rolling demand prediction", "Roast batch yield optimization", "Waste reduction analytics"],
    mock: (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#5EEAD4]/20 text-[#5EEAD4] text-xs font-mono font-bold">AI</span>
            <div>
              <div className="text-sm font-semibold text-[#F5F1EC]">Weekend Demand Forecast</div>
              <div className="text-xs text-[#5EEAD4]">Confidence Score: 98.4%</div>
            </div>
          </div>
          <span className="rounded-full bg-[#5EEAD4]/20 px-2.5 py-1 text-xs font-medium text-[#5EEAD4]">+18% Peak Expected</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs space-y-3">
          <div className="flex justify-between items-center text-[#F5F1EC]">
            <span>Suggested Roast Yield</span>
            <span className="font-mono text-[#D97B3F] font-bold">85kg (Batch #R-402)</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-[#D97B3F] to-[#5EEAD4] h-full w-[85%]" />
          </div>
        </div>
      </div>
    ),
  },
];

export function WorkflowExplorer() {
  const [activeTab, setActiveTab] = useState("pos");
  const current = workflows.find((w) => w.id === activeTab) || workflows[0];

  return (
    <section id="workflow" className="mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center">
      <ScrollReveal variant="fade-up">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]">
            Tabbed Workflow Explorer
          </span>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white">
            <TextReveal text="Explore operational use cases" />
            <br />
            <TextReveal className="bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold" text="built for speed & control" delay={300} />
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            See how INVENTROX transforms everyday counter, inventory, and back-office tasks.
          </p>
        </div>
      </ScrollReveal>

      {/* Tabs selector */}
      <div className="mt-12 flex justify-center flex-wrap gap-3">
        {workflows.map((w) => {
          const isActive = w.id === activeTab;
          const Icon = w.icon;
          return (
            <button
              key={w.id}
              onClick={() => setActiveTab(w.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#00f0ff] to-[#0284c7] text-[#030712] shadow-[0_0_25px_rgba(0,240,255,0.4)] scale-[1.03]"
                  : "glass text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              {w.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h3 className="text-2xl font-bold text-white leading-snug">{current.title}</h3>
          <p className="text-base text-slate-300 leading-relaxed">{current.description}</p>
          <ul className="space-y-3">
            {current.highlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="size-4 text-[#00f0ff] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <a href="#cta" className="btn-cyan inline-flex items-center gap-2 text-sm">
              Try this workflow live <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="glass-card p-6 md:p-8 border-[#00f0ff]/20 bg-[#030712]/90 shadow-[0_0_40px_rgba(0,240,255,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-[#00f0ff]">
              LIVE MOCK INTERACTION
            </div>
            {current.mock}
          </div>
        </div>
      </div>
    </section>
  );
}
