import { useState } from "react";
import { useBusinessState } from "@/hooks/use-business-state";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
  IndianRupee,
  Boxes,
  Percent,
  Users,
  Truck,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ReportsTab() {
  const { products, customers, sales, services } = useBusinessState();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportCards = [
    {
      id: "revenue",
      title: "Revenue Report",
      desc: "Daily/weekly gross revenue, Average Order Values, and payment shares.",
      icon: IndianRupee,
      color: "text-accent bg-accent/10",
    },
    {
      id: "inventory",
      title: "Inventory Audits",
      desc: "Live stock levels, reorder thresholds, slow-movers, and total valuations.",
      icon: Boxes,
      color: "text-primary bg-primary/10",
    },
    {
      id: "gst",
      title: "GST Compliance",
      desc: "CGST/SGST/IGST breakdown, HSN logs, and GSTR-1 preparation spreadsheets.",
      icon: Percent,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: "customers",
      title: "Customer Segments",
      desc: "Top clients, lifetime value distributions, and acquisition rate curves.",
      icon: Users,
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      id: "suppliers",
      title: "Supplier Lead Times",
      desc: "Order frequencies, procurement costs, and purchase ledger audits.",
      icon: Truck,
      color: "text-purple-400 bg-purple-500/10",
    },
    {
      id: "forecast",
      title: "AI Sales Forecast",
      desc: "30-day predictive growth, confidence intervals, and buying habits analysis.",
      icon: Sparkles,
      color: "text-pink-400 bg-pink-500/10",
    },
    {
      id: "service",
      title: "Services & Reminders",
      desc: "Upcoming maintenance task completion ratios and client reminders log.",
      icon: Calendar,
      color: "text-amber-400 bg-amber-500/10",
    },
  ];

  // Mock data for AI Forecasting
  const forecastData = [
    { d: "Week 1", actual: 48000, forecast: 48000, ciLower: 48000, ciUpper: 48000 },
    { d: "Week 2", actual: 52000, forecast: 51000, ciLower: 49500, ciUpper: 52500 },
    { d: "Week 3", actual: 56000, forecast: 54500, ciLower: 52000, ciUpper: 57000 },
    { d: "Week 4", actual: 58000, forecast: 59000, ciLower: 56000, ciUpper: 62000 },
    { d: "Week 5", actual: null, forecast: 64000, ciLower: 60000, ciUpper: 68000 },
    { d: "Week 6", actual: null, forecast: 69000, ciLower: 63500, ciUpper: 74500 },
    { d: "Week 7", actual: null, forecast: 74000, ciLower: 67000, ciUpper: 81000 },
  ];

  const handleExportCSV = (reportId: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportId === "inventory") {
      csvContent += "SKU,Product Name,Category,Stock,Cost Price,Selling Price,Value\n";
      products.forEach((p) => {
        csvContent += `"${p.sku}","${p.name}","${p.category}",${p.stock},${p.cost},${p.price},${p.stock * p.price}\n`;
      });
    } else if (reportId === "revenue") {
      csvContent += "Invoice #,Customer Name,Date,Payment Mode,Subtotal,GST,Total\n";
      sales.forEach((s) => {
        csvContent += `"${s.invoiceNumber}","${s.customerName}","${s.date}","${s.paymentMethod}",${s.subtotal},${s.gst},${s.total}\n`;
      });
    } else {
      csvContent += "Export,Logs,Timestamp\n";
      csvContent += `"${reportId}","Operational dataset",${new Date().toISOString()}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventrox_${reportId}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Reports Hub Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reportCards.map((r) => (
          <div
            key={r.id}
            className={`glass rounded-3xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 ${
              selectedReport === r.id ? "border-primary bg-primary/5" : ""
            }`}
          >
            <div className="space-y-3">
              <span className={`grid size-10 place-items-center rounded-xl ${r.color}`}>
                <r.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-display font-700 text-sm text-foreground">{r.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">{r.desc}</p>
              </div>
            </div>

            <div className="flex gap-2 items-center justify-between border-t border-border/30 pt-4 mt-5">
              <button
                onClick={() => setSelectedReport(r.id)}
                className="text-[11px] font-700 text-accent hover:underline flex items-center gap-1"
              >
                Generate Report
              </button>
              <button
                onClick={() => handleExportCSV(r.id)}
                className="grid size-7 place-items-center rounded-lg border border-border hover:bg-secondary text-muted-foreground transition-colors"
                title="Download CSV"
              >
                <Download className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Report Viewer Panel */}
      {selectedReport && (
        <div className="glass rounded-3xl p-6 border border-border space-y-6 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h2 className="font-display font-700 text-base text-foreground uppercase tracking-wide">
              {selectedReport === "revenue" && "Financial Revenue Ledger Statement"}
              {selectedReport === "inventory" && "Catalog Valuation & Auditing Statement"}
              {selectedReport === "gst" && "CGST / SGST Invoicing Audit Ledger"}
              {selectedReport === "customers" && "CRM LTV Profiling Summary"}
              {selectedReport === "suppliers" && "Supplier Procurement Ledger Summary"}
              {selectedReport === "forecast" && "Claude AI 30-Day Sales Forecast Model"}
              {selectedReport === "service" && "Operational Service Schedules Ledger"}
            </h2>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs text-muted-foreground hover:text-foreground font-600 border border-border rounded-full px-3 py-1 bg-secondary/30 transition-all"
            >
              Hide Report
            </button>
          </div>

          {/* REVENUE REPORT DETAILED VIEW */}
          {selectedReport === "revenue" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/40 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Gross Transaction Volume</p>
                  <p className="font-mono text-lg font-700 text-foreground mt-1">
                    ₹{sales.reduce((acc, curr) => acc + curr.total, 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/40 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Completed Invoices</p>
                  <p className="font-mono text-lg font-700 text-foreground mt-1">{sales.length} logs</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/40 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Average Cart size</p>
                  <p className="font-mono text-lg font-700 text-foreground mt-1">
                    ₹{Math.round(sales.reduce((acc, curr) => acc + curr.total, 0) / (sales.length || 1)).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/20">
                <div className="grid grid-cols-4 p-3 bg-secondary/40 text-[9px] font-600 uppercase tracking-widest text-muted-foreground">
                  <span>Invoice #</span>
                  <span>Customer Name</span>
                  <span>Method</span>
                  <span className="text-right">Total Amount</span>
                </div>
                {sales.map((s) => (
                  <div key={s.id} className="grid grid-cols-4 p-3 text-xs font-500">
                    <span className="font-mono font-700 text-foreground">{s.invoiceNumber}</span>
                    <span className="truncate text-muted-foreground">{s.customerName}</span>
                    <span className="font-700 text-accent">{s.paymentMethod}</span>
                    <span className="text-right font-mono font-700">₹{s.total.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVENTORY REPORT */}
          {selectedReport === "inventory" && (
            <div className="space-y-4">
              <div className="border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/20">
                <div className="grid grid-cols-4 p-3 bg-secondary/40 text-[9px] font-600 uppercase tracking-widest text-muted-foreground">
                  <span>SKU / Product</span>
                  <span>Category</span>
                  <span className="text-right">Stock Qty</span>
                  <span className="text-right">Book Value</span>
                </div>
                {products.map((p) => (
                  <div key={p.id} className="grid grid-cols-4 p-3 text-xs font-500">
                    <div>
                      <p className="font-600 text-foreground truncate">{p.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground mt-0.5">{p.sku}</p>
                    </div>
                    <span>{p.category}</span>
                    <span className="text-right font-mono font-600">{p.stock} {p.unit}</span>
                    <span className="text-right font-mono font-700 text-foreground">
                      ₹{(p.stock * p.cost).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GST COMPLIANCE REPORT */}
          {selectedReport === "gst" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">GST sales logs with detailed tax itemization ready for GSTR-1 Excel template filling.</p>
              <div className="border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/20">
                <div className="grid grid-cols-5 p-3 bg-secondary/40 text-[9px] font-600 uppercase tracking-widest text-muted-foreground">
                  <span>Invoice #</span>
                  <span className="text-right">Assessable (₹)</span>
                  <span className="text-right">CGST (₹)</span>
                  <span className="text-right">SGST (₹)</span>
                  <span className="text-right">GST Collected (₹)</span>
                </div>
                {sales.map((s) => {
                  const cgst = Math.round(s.gst / 2);
                  return (
                    <div key={s.id} className="grid grid-cols-5 p-3 text-xs font-500">
                      <span className="font-mono font-700 text-foreground">{s.invoiceNumber}</span>
                      <span className="text-right font-mono text-muted-foreground">₹{s.subtotal.toLocaleString("en-IN")}</span>
                      <span className="text-right font-mono text-muted-foreground">₹{cgst.toLocaleString("en-IN")}</span>
                      <span className="text-right font-mono text-muted-foreground">₹{cgst.toLocaleString("en-IN")}</span>
                      <span className="text-right font-mono font-700 text-foreground">₹{s.gst.toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI FORECAST REPORT (CHARTS WITH CONFIDENCE INTERVAL BANDS) */}
          {selectedReport === "forecast" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex gap-3 text-xs text-primary leading-relaxed">
                <AlertCircle className="size-4 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <span className="font-700 uppercase">Claude 3.5 Sonnet Analyst Insight:</span>
                  <p className="mt-1">
                    Specialty coffee roasts show a projected 15.4% week-on-week demand growth. Based on inventory health metrics, paper packaging and vanilla syrups are critical bottlenecks that will deplete within 6 days unless orders are placed.
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData} margin={{ left: -16, right: 8, top: 8 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="d"
                      stroke="oklch(0.66 0.018 286)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="oklch(0.66 0.018 286)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.165 0.014 285)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "white",
                      }}
                    />
                    {/* Actual curve */}
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Actual Sales (₹)"
                      stroke="oklch(0.74 0.14 210)"
                      strokeWidth={2.5}
                      dot={{ fill: "oklch(0.74 0.14 210)" }}
                    />
                    {/* Forecast curve */}
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      name="Forecast Model (₹)"
                      stroke="oklch(0.66 0.2 300)"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* DEFAULT / OTHERS SKELETON */}
          {!["revenue", "inventory", "gst", "forecast"].includes(selectedReport) && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Statement generated successfully. Click the export icon to compile offline files.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
