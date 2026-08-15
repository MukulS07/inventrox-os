import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeft,
  Search,
  Settings,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CountUp } from "@/components/site/count-up";
import { cn } from "@/lib/utils";
import {
  customers,
  lowStock,
  products,
  revenueSeries,
  sales,
  valuationByCategory,
  type Category,
} from "@/data/mock";

const title = "INVENTROX Console — Live product demo";
const description =
  "Explore the INVENTROX operations console: inventory valuation, low-stock alerts, POS checkout and GST-ready invoicing on realistic demo data.";

export const Route = createFileRoute("/dashboard")({
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
  component: Dashboard,
});

type TabId = "overview" | "products" | "pos";

const nav: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Boxes },
  { id: "pos", label: "POS Console", icon: CreditCard },
];

const secondaryNav = [
  { label: "Invoices", icon: FileText },
  { label: "Customers", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
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

function categoryChip(c: Category) {
  const map: Record<Category, string> = {
    Coffee: "bg-roast/12 text-roast",
    Syrups: "bg-chart-5/15 text-chart-5",
    Milks: "bg-chart-3/15 text-chart-3",
    Packaging: "bg-signal/12 text-signal",
    Accessories: "bg-chart-4/15 text-chart-4",
    Apparel: "bg-chart-5/12 text-chart-5",
  };
  return map[c];
}

function Dashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-all duration-300 md:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 px-4">
          <Link to="/" className="grid size-8 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-roast)] text-sm font-bold text-roast-foreground">
            IX
          </Link>
          {!collapsed && <span className="font-display font-semibold">INVENTROX</span>}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                tab === n.id
                  ? "bg-roast/12 text-roast"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <n.icon className="size-4 shrink-0" />
              {!collapsed && n.label}
            </button>
          ))}
          <div className="my-3 border-t border-sidebar-border" />
          {secondaryNav.map((n) => (
            <div
              key={n.label}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/70"
            >
              <n.icon className="size-4 shrink-0" />
              {!collapsed && n.label}
            </div>
          ))}
        </nav>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && "Collapse"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <button className="glass flex items-center gap-2 px-3 py-1.5 text-sm">
            <span className="size-2 rounded-full bg-signal" />
            Bluebird Retail
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setPaletteOpen(true)}
            className="ml-auto flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] sm:inline">⌘K</kbd>
          </button>

          <span className="hidden items-center gap-1.5 rounded-full bg-signal/10 px-2.5 py-1 text-xs text-signal sm:inline-flex">
            <Activity className="size-3.5" /> Synced
          </span>
          <Bell className="size-4 text-muted-foreground" />
          <span className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium">
            MS
          </span>
        </header>

        {/* Mobile tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3 md:hidden">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={cn(
                "whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs",
                tab === n.id ? "border-roast/50 bg-roast/12 text-roast" : "text-muted-foreground",
              )}
            >
              {n.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-4 md:p-6">
          {tab === "overview" && <Overview />}
          {tab === "products" && <ProductsTab />}
          {tab === "pos" && <PosTab />}
        </main>
      </div>

      <AiWidget />

      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="Search products, invoices, customers…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Go to">
            {nav.map((n) => (
              <CommandItem
                key={n.id}
                onSelect={() => {
                  setTab(n.id);
                  setPaletteOpen(false);
                }}
              >
                <n.icon className="size-4" /> {n.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Products">
            {products.slice(0, 5).map((p) => (
              <CommandItem key={p.id} onSelect={() => setPaletteOpen(false)}>
                <Boxes className="size-4" /> {p.name}
                <span className="ml-auto text-xs text-muted-foreground tabular">{p.sku}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Recent invoices">
            {sales.slice(0, 3).map((s) => (
              <CommandItem key={s.id} onSelect={() => setPaletteOpen(false)}>
                <FileText className="size-4" /> {s.invoice_number} · {s.customer_name}
                <span className="ml-auto text-xs text-muted-foreground tabular">
                  {inr(s.total)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  prefix,
  suffix,
  decimals,
}: {
  label: string;
  value: number;
  delta: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div className="glass p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">
        <CountUp value={value} prefix={prefix ?? ""} suffix={suffix ?? ""} decimals={decimals ?? 0} />
      </p>
      <p className="mt-1 text-xs text-signal">{delta}</p>
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Demo tenant · all figures from local mock data
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue (7 days)" value={820000} prefix="₹" delta="+12.4% vs last week" />
        <KpiCard label="Orders" value={1284} delta="+86 today" />
        <KpiCard label="Inventory valuation" value={4120000} prefix="₹" delta="42% in Coffee" />
        <KpiCard label="Sync uptime" value={99.98} decimals={2} suffix="%" delta="No incidents" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Revenue trend</h2>
            <Badge variant="outline" className="text-signal">
              Live
            </Badge>
          </div>
          <div className="mt-4">
            <AreaTrend data={revenueSeries} />
          </div>
        </div>

        <div className="glass p-5">
          <h2 className="text-sm font-semibold">Valuation by category</h2>
          <div className="mt-2">
            <Donut data={valuationByCategory} colors={chartColors} />
          </div>
          <ul className="mt-3 space-y-1.5">
            {valuationByCategory.map((v, i) => (
              <li key={v.category} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2 rounded-full"
                  style={{ background: chartColors[i % chartColors.length] }}
                />
                <span className="text-muted-foreground">{v.category}</span>
                <span className="ml-auto tabular">{v.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <TriangleAlert className="size-4 text-destructive" /> Low stock
          </h2>
          <ul className="mt-4 space-y-3">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground tabular">{p.sku}</p>
                </div>
                <span className="rounded-full bg-destructive/12 px-2 py-0.5 text-xs text-destructive tabular">
                  {p.stock} / {p.reorder_point}
                </span>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-5 w-full">
            Draft purchase orders
          </Button>
        </div>

        <div className="glass p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Recent sales</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Invoice</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Method</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-t border-border/60">
                    <td className="py-2.5 tabular">{s.invoice_number}</td>
                    <td className="py-2.5">{s.customer_name}</td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {s.payment_method}
                      </span>
                    </td>
                    <td className="py-2.5 text-right tabular">{inr(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass p-5">
        <h2 className="text-sm font-semibold">Top customers by LTV</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {customers.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.segment}</p>
              <p className="mt-3 text-lg font-semibold tabular">{inr(c.ltv)}</p>
              <p className="text-xs text-muted-foreground tabular">
                {c.orders_count} orders · AOV {inr(c.avg_order_value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground tabular">
            {products.length} SKUs · {lowStock.length} below reorder point
          </p>
        </div>
        <Button size="sm">Add product</Button>
      </div>

      <div className="glass overflow-x-auto p-1">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 text-right font-medium">Cost</th>
              <th className="p-4 text-right font-medium">Price</th>
              <th className="p-4 text-right font-medium">GST</th>
              <th className="p-4 text-right font-medium">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-accent/40">
                <td className="p-4 tabular text-muted-foreground">{p.sku}</td>
                <td className="p-4">
                  <p>{p.name}</p>
                  <p className="text-xs text-muted-foreground tabular">
                    HSN {p.hsn} · {p.supplier}
                  </p>
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs",
                      categoryChip(p.category),
                    )}
                  >
                    {p.category}
                  </span>
                </td>
                <td className="p-4 text-right tabular">{inr(p.cost)}</td>
                <td className="p-4 text-right tabular">{inr(p.price)}</td>
                <td className="p-4 text-right tabular text-muted-foreground">{p.gst_rate}%</td>
                <td className="p-4 text-right">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs tabular",
                      p.stock <= p.reorder_point
                        ? "bg-destructive/12 text-destructive"
                        : "bg-signal/12 text-signal",
                    )}
                  >
                    {p.stock} {p.unit}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PosTab() {
  const [cart, setCart] = useState<Record<string, number>>({
    "cf-col-1kg": 2,
    "mk-oat-1l": 4,
  });

  const lines = products
    .filter((p) => cart[p.id])
    .map((p) => ({ product: p, qty: cart[p.id] as number }));

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const gst = lines.reduce((s, l) => s + (l.product.price * l.qty * l.product.gst_rate) / 100, 0);
  const total = subtotal + gst;

  const add = (id: string, delta: number) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] ?? 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">POS Console</h1>
        <p className="text-sm text-muted-foreground">
          Sale and stock decrement commit as one operation
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Catalog</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => add(p.id, 1)}
                className="rounded-xl border border-border bg-card/50 p-4 text-left transition-colors hover:border-roast/50 hover:bg-accent/50"
              >
                <span
                  className={cn("rounded-full px-2 py-0.5 text-[11px]", categoryChip(p.category))}
                >
                  {p.category}
                </span>
                <p className="mt-3 text-sm font-medium">{p.name}</p>
                <p className="mt-1 text-sm tabular text-muted-foreground">
                  {inr(p.price)} · {p.gst_rate}% GST
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass flex flex-col p-5">
          <h2 className="text-sm font-semibold">Cart</h2>
          <ul className="mt-4 flex-1 space-y-3">
            {lines.length === 0 && (
              <li className="text-sm text-muted-foreground">Tap a product to start a sale.</li>
            )}
            {lines.map((l) => (
              <li key={l.product.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{l.product.name}</p>
                  <p className="text-xs text-muted-foreground tabular">
                    {inr(l.product.price)} × {l.qty}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => add(l.product.id, -1)}
                    className="size-7 rounded-md border border-border text-sm"
                    aria-label={`Remove one ${l.product.name}`}
                  >
                    −
                  </button>
                  <button
                    onClick={() => add(l.product.id, 1)}
                    className="size-7 rounded-md border border-border text-sm"
                    aria-label={`Add one ${l.product.name}`}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular">{inr(Math.round(subtotal))}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST</span>
              <span className="tabular">{inr(Math.round(gst))}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="tabular">{inr(Math.round(total))}</span>
            </div>
          </div>
          <Button className="mt-4" disabled={lines.length === 0}>
            Charge via UPI
          </Button>
        </div>
      </div>
    </div>
  );
}

function AiWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="glass-strong mb-3 w-72 p-4 shadow-[var(--shadow-glass)]">
          <p className="flex items-center gap-2 text-xs font-medium text-roast">
            <Sparkles className="size-3.5" /> AI insight
          </p>
          <p className="mt-2 text-sm leading-snug">
            Ethiopia Yirgacheffe is <span className="tabular">4 days</span> from stockout at current
            velocity. Reorder 24 packs from Highland Traders to hold service level.
          </p>
          <Button size="sm" variant="outline" className="mt-4 w-full">
            Create purchase order
          </Button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="ml-auto flex size-12 items-center justify-center rounded-full bg-[image:var(--gradient-roast)] text-roast-foreground shadow-[var(--shadow-glow)]"
        aria-label="Toggle AI insights"
      >
        <Sparkles className="size-5" />
      </button>
    </div>
  );
}
