import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  Package,
  Tags,
  Truck,
  Users,
  ShoppingCart,
  FileText,
  ScanLine,
  HeartHandshake,
  BarChart3,
  Sparkles,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronDown,
  TrendingUp,
  PanelLeftClose,
  PanelLeft,
  X,
  MessageSquare,
  ClipboardList,
  FileSpreadsheet,
  Send,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

// Tab imports
import InventoryTab from "@/components/dashboard/InventoryTab";
import ProductsTab from "@/components/dashboard/ProductsTab";
import CategoriesTab from "@/components/dashboard/CategoriesTab";
import SuppliersTab from "@/components/dashboard/SuppliersTab";
import CustomersTab from "@/components/dashboard/CustomersTab";
import SalesTab from "@/components/dashboard/SalesTab";
import InvoicesTab from "@/components/dashboard/InvoicesTab";
import PosTab from "@/components/dashboard/PosTab";
import CrmTab from "@/components/dashboard/CrmTab";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import ReportsTab from "@/components/dashboard/ReportsTab";
import AiAssistantTab from "@/components/dashboard/AiAssistantTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import RateListTab from "@/components/dashboard/RateListTab";
import { CommandPalette } from "@/components/dashboard/CommandPalette";

// State provider & data
import { BusinessStateProvider, useBusinessState } from "@/hooks/use-business-state";
import { AreaTrend, Donut } from "@/components/dash/charts";
import { CountUp } from "@/components/site/count-up";
import { revenueSeries, valuationByCategory } from "@/data/mock";

const title = "INVENTROX Operations Console";
const description =
  "Complete operating system for retail, roasteries, and SMEs — Inventory, POS with OTP, CRM service reminders, Rate List, GST invoicing, and AI assistant.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <BusinessStateProvider>
      <DashboardShell />
    </BusinessStateProvider>
  );
}

const navGroups = [
  {
    group: "Core",
    items: [
      { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "Inventory", label: "Inventory", icon: Boxes },
      { id: "Products", label: "Products", icon: Package },
      { id: "Categories", label: "Categories", icon: Tags },
      { id: "Rate List", label: "Rate List", icon: ClipboardList },
      { id: "Suppliers", label: "Suppliers", icon: Truck },
    ],
  },
  {
    group: "Commerce",
    items: [
      { id: "Customers", label: "Customers", icon: Users },
      { id: "Sales", label: "Sales", icon: ShoppingCart },
      { id: "Invoices", label: "Invoices", icon: FileText },
      { id: "POS", label: "POS", icon: ScanLine },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { id: "CRM", label: "CRM", icon: HeartHandshake },
      { id: "Analytics", label: "Analytics", icon: BarChart3 },
      { id: "Reports", label: "Reports", icon: FileSpreadsheet },
      { id: "Mini AI", label: "Mini AI", icon: MessageSquare },
      { id: "Settings", label: "Settings", icon: Settings },
    ],
  },
];

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--muted-foreground)",
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { products, customers, sales, notifications, markNotificationRead } = useBusinessState();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Keybindings (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-all duration-300 md:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground font-mono text-xs font-bold text-background">
              IX
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-base tracking-tight">INVENTROX</span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-1 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {navGroups.map((g) => (
            <div key={g.group} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-700 uppercase tracking-widest text-muted-foreground/70 mb-1">
                  {g.group}
                </p>
              )}
              {g.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-600 transition-all cursor-pointer",
                      isActive
                        ? "bg-accent text-roast shadow-sm font-700"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", isActive && "text-roast")} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="border-t border-border/40 p-3 flex items-center gap-3">
          <div className="size-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-mono font-bold text-xs text-accent">
            MS
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-600 truncate">Mukul Sharma</p>
              <p className="text-[10px] text-muted-foreground truncate">Admin Operator</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-700 text-sm md:text-base">{activeTab}</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-sage px-2.5 py-0.5 text-[11px] font-600 text-signal border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-signal animate-ping" />
              Sovereign Ledger Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">Ctrl+K</kbd>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen((v) => !v)}
                className="p-2 rounded-xl border border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative cursor-pointer"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                    <h4 className="font-display font-700 text-xs">Notifications</h4>
                    <span className="text-[10px] text-muted-foreground font-mono">{unreadCount} unread</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={cn(
                            "p-2.5 rounded-xl border text-xs cursor-pointer transition-colors",
                            n.read ? "bg-secondary/20 border-border/30 text-muted-foreground" : "bg-accent/10 border-accent/30 text-foreground font-500"
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-700 text-[11px]">{n.title}</span>
                            <span className="text-[9px] text-muted-foreground font-mono">{n.time}</span>
                          </div>
                          <p className="text-[10px] leading-relaxed">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Horizontal Tabs (< 768px) */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-2.5 md:hidden scrollbar-none">
          {navGroups.flatMap((g) => g.items).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-600 shrink-0",
                activeTab === item.id ? "border-accent bg-accent text-roast font-700" : "border-border text-muted-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tab Router Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === "Dashboard" && <OverviewTab />}
          {activeTab === "Inventory" && <InventoryTab />}
          {activeTab === "Products" && <ProductsTab />}
          {activeTab === "Categories" && <CategoriesTab />}
          {activeTab === "Rate List" && <RateListTab />}
          {activeTab === "Suppliers" && <SuppliersTab />}
          {activeTab === "Customers" && <CustomersTab />}
          {activeTab === "Sales" && <SalesTab />}
          {activeTab === "Invoices" && <InvoicesTab />}
          {activeTab === "POS" && <PosTab />}
          {activeTab === "CRM" && <CrmTab />}
          {activeTab === "Analytics" && <AnalyticsTab />}
          {activeTab === "Reports" && <ReportsTab />}
          {activeTab === "Mini AI" && <AiAssistantTab />}
          {activeTab === "Settings" && <SettingsTab />}
        </main>
      </div>

      {/* Floating AI Insight Widget */}
      <AiWidget />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tabName) => setActiveTab(tabName)}
      />
    </div>
  );
}

function OverviewTab() {
  const { products, sales, customers } = useBusinessState();

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Command Center</h1>
          <p className="text-xs text-muted-foreground">
            Live business summary, stock health, and revenue stream analytics.
          </p>
        </div>
      </div>

      {/* 4 KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass p-5 rounded-2xl border border-border">
          <p className="text-xs text-muted-foreground font-600">Total Sales Revenue</p>
          <p className="mt-2 text-2xl font-bold font-mono">
            <CountUp value={totalRevenue > 0 ? totalRevenue : 820000} prefix="₹" />
          </p>
          <p className="mt-1 text-xs text-signal font-600">+14.8% vs previous cycle</p>
        </div>

        <div className="glass p-5 rounded-2xl border border-border">
          <p className="text-xs text-muted-foreground font-600">Active Invoices</p>
          <p className="mt-2 text-2xl font-bold font-mono">
            <CountUp value={sales.length > 0 ? sales.length : 1284} />
          </p>
          <p className="mt-1 text-xs text-signal font-600">All payments committed</p>
        </div>

        <div className="glass p-5 rounded-2xl border border-border">
          <p className="text-xs text-muted-foreground font-600">Low Stock SKUs</p>
          <p className="mt-2 text-2xl font-bold font-mono text-rose-500">
            <CountUp value={lowStockCount} />
          </p>
          <p className="mt-1 text-xs text-rose-500 font-600">Requires reorder intake</p>
        </div>

        <div className="glass p-5 rounded-2xl border border-border">
          <p className="text-xs text-muted-foreground font-600">Registered Customers</p>
          <p className="mt-2 text-2xl font-bold font-mono">
            <CountUp value={customers.length > 0 ? customers.length : 12400} />
          </p>
          <p className="mt-1 text-xs text-signal font-600">CRM database synced</p>
        </div>
      </div>

      {/* Revenue & Category Visuals */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass p-5 rounded-2xl border border-border lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-display">Revenue Velocity Trend</h2>
            <span className="text-[10px] font-bold bg-sage text-signal px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live Stream
            </span>
          </div>
          <AreaTrend data={revenueSeries} />
        </div>

        <div className="glass p-5 rounded-2xl border border-border">
          <h2 className="text-sm font-bold font-display mb-4">Valuation by Category</h2>
          <Donut data={valuationByCategory} colors={chartColors} />
          <ul className="mt-4 space-y-2">
            {valuationByCategory.map((v, i) => (
              <li key={v.category} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2 rounded-full"
                  style={{ background: chartColors[i % chartColors.length] }}
                />
                <span className="text-muted-foreground">{v.category}</span>
                <span className="ml-auto font-mono font-600">{v.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AiWidget() {
  const [open, setOpen] = useState(false);
  const { products, customers, sales, customerNotes } = useBusinessState();
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string; time: string }[]>([
    {
      sender: "ai",
      text: "Hello! I am **INVENTROX Mini AI**, your operational business intelligence assistant. Ask me about stock alerts, revenue totals, VIP clients, or 30-day forecasts.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Keybinding (Ctrl+Shift+A) to toggle widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const q = text.toLowerCase();

      if (q.includes("stock") || q.includes("reorder") || q.includes("inventory") || q.includes("product")) {
        const lowItems = products.filter((p) => p.stock <= 10);
        const outItems = products.filter((p) => p.stock === 0);
        reply = `### 📦 INVENTORY AUDIT REPORT\n\n` +
          `• **Catalog SKUs:** ${products.length} active products\n` +
          `• **Low Stock Items:** ${lowItems.length}\n` +
          `• **Out of Stock:** ${outItems.length}\n\n` +
          (lowItems.length > 0
            ? lowItems.map((p) => `* **${p.name}** (\`${p.sku}\`) — **${p.stock} ${p.unit}** remaining. Supplier: **${p.supplier}**.`).join("\n")
            : "* Stock levels look healthy across all catalog items.");
      } else if (q.includes("revenue") || q.includes("sales") || q.includes("finance") || q.includes("bill") || q.includes("total")) {
        const totalSalesSum = sales.reduce((acc, s) => acc + s.total, 0);
        reply = `### 📈 FINANCIAL SUMMARY\n\n` +
          `• **Gross Sales Revenue:** ₹${totalSalesSum.toLocaleString("en-IN")}\n` +
          `• **Invoices Issued:** ${sales.length} bills\n` +
          `• **Average Invoice Value:** ₹${Math.round(totalSalesSum / (sales.length || 1)).toLocaleString("en-IN")}`;
      } else if (q.includes("customer") || q.includes("vip") || q.includes("crm")) {
        const vipList = customers.filter((c) => c.segment === "VIP");
        reply = `### 👥 CRM SNAPSHOT\n\n` +
          `• **Total Customers:** ${customers.length}\n` +
          `• **VIP Clients:** ${vipList.length}\n\n` +
          (vipList.length > 0
            ? vipList.map((c) => `* **${c.name}** — LTV: ₹${c.ltv.toLocaleString("en-IN")}`).join("\n")
            : "* No VIP clients registered yet.");
      } else if (q.includes("forecast") || q.includes("predict")) {
        const totalSalesSum = sales.reduce((acc, s) => acc + s.total, 0);
        const projectedSales = Math.round((totalSalesSum || 820000) * 1.158);
        reply = `### 🔮 30-DAY AI FORECAST\n\n` +
          `• **Projected Growth:** **+15.8%**\n` +
          `• **Target Revenue:** ₹${projectedSales.toLocaleString("en-IN")}\n` +
          `• **Recommendation:** Pre-order Oat Milk & Yirgacheffe roasts to handle weekend surges.`;
      } else {
        reply = `I have scanned your live database. Ask me about:\n` +
          `* **"Low stock alerts"** for restock recommendations\n` +
          `* **"Total revenue"** for financial metrics\n` +
          `* **"VIP customers"** for CRM details\n` +
          `* **"30-day forecast"** for growth prediction`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 350);
  };

  return (
    <>
      {/* Slide-over Full Chat Drawer Panel */}
      {open && (
        <div className="fixed inset-y-0 right-0 z-[9999] flex w-full max-w-[420px] flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Drawer Topbar Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4 bg-secondary/20">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-roast">
                <Sparkles className="size-4 text-roast animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  INVENTROX Mini AI
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono">Sovereign DB Synced · (Ctrl+Shift+A)</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-accent text-roast font-600 shadow-sm"
                      : "glass text-foreground border border-border/60 bg-card"
                  }`}
                >
                  {msg.sender === "user" ? (
                    msg.text
                  ) : (
                    <MarkdownRenderer content={msg.text} />
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="glass border border-border rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                  <span className="size-1.5 rounded-full bg-accent animate-bounce" />
                  <span className="size-1.5 rounded-full bg-accent animate-bounce delay-100" />
                  <span className="size-1.5 rounded-full bg-accent animate-bounce delay-200" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-4 py-2 border-t border-border/30 bg-secondary/10 flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSendMessage("Low stock alerts")}
              className="px-2.5 py-1 rounded-full border border-border/50 bg-card text-[10px] font-600 text-muted-foreground hover:text-foreground hover:border-accent transition-colors shrink-0 cursor-pointer"
            >
              Low Stock Alerts
            </button>
            <button
              onClick={() => handleSendMessage("Revenue breakdown")}
              className="px-2.5 py-1 rounded-full border border-border/50 bg-card text-[10px] font-600 text-muted-foreground hover:text-foreground hover:border-accent transition-colors shrink-0 cursor-pointer"
            >
              Revenue
            </button>
            <button
              onClick={() => handleSendMessage("VIP customer list")}
              className="px-2.5 py-1 rounded-full border border-border/50 bg-card text-[10px] font-600 text-muted-foreground hover:text-foreground hover:border-accent transition-colors shrink-0 cursor-pointer"
            >
              VIP Clients
            </button>
            <button
              onClick={() => handleSendMessage("30-day forecast")}
              className="px-2.5 py-1 rounded-full border border-border/50 bg-card text-[10px] font-600 text-muted-foreground hover:text-foreground hover:border-accent transition-colors shrink-0 cursor-pointer"
            >
              Forecast
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center border-t border-border p-3.5 gap-2.5 bg-card shrink-0"
          >
            <input
              placeholder="Ask Mini AI about inventory, bills, or LTV..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="size-9 rounded-xl bg-accent text-roast font-bold flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[10000]">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-background"
          aria-label="Toggle Mini AI Assistant"
        >
          <Sparkles className="size-6" />
        </button>
      </div>
    </>
  );
}
