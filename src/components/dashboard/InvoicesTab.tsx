import { useState } from "react";
import { createPortal } from "react-dom";
import { useBusinessState, Customer } from "@/hooks/use-business-state";
import { Search, Plus, Trash2, Printer, FileText, X, QrCode } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface InvoiceLineItem {
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number;
}

export default function InvoicesTab() {
  const { sales, customers, checkoutPos } = useBusinessState();

  // Read custom company details from localStorage
  const myCompanyName = typeof window !== "undefined" ? localStorage.getItem("inv_comp_name") || "INVENTROX Specialty Roasters" : "INVENTROX Specialty Roasters";
  const myCompanyAddress = typeof window !== "undefined" ? localStorage.getItem("inv_comp_address") || "Plot 45, Udyog Vihar Phase 4, Gurgaon, Haryana, 122016" : "Plot 45, Udyog Vihar Phase 4, Gurgaon, Haryana, 122016";
  const myCompanyGstin = typeof window !== "undefined" ? localStorage.getItem("inv_comp_gstin") || "07AAACO8892F1Z9" : "07AAACO8892F1Z9";
  const myCompanyPhone = typeof window !== "undefined" ? localStorage.getItem("inv_comp_phone") || "+91 98765 43210" : "+91 98765 43210";

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [lines, setLines] = useState<InvoiceLineItem[]>([
    { description: "Specialty Coffee Roasts", hsn: "0901", qty: 2, rate: 1200, gstRate: 5 },
  ]);

  const [previewInvoice, setPreviewInvoice] = useState<any | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      document.body.classList.add("printing-invoice");
      window.print();
      document.body.classList.remove("printing-invoice");
      setIsPrinting(false);
    }, 150);
  };

  const handleAddLine = () => {
    setLines([...lines, { description: "", hsn: "0901", qty: 1, rate: 100, gstRate: 18 }]);
  };

  const handleRemoveLine = (idx: number) => {
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleLineChange = (idx: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...lines];
    updated[idx] = {
      ...updated[idx],
      [field]: value,
    };
    setLines(updated);
  };

  // Calculations
  let subtotal = 0;
  let totalGst = 0;
  lines.forEach((line) => {
    const lineSub = line.qty * line.rate;
    subtotal += lineSub;
    totalGst += lineSub * (line.gstRate / 100);
  });

  const discount = Math.round(subtotal * (discountPercent / 100));
  const grandTotal = Math.round(subtotal - discount + totalGst);

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    // Map lines to products format for the checkout hook
    const mockCartItems = lines.map((line) => ({
      product: {
        id: `mock_${Date.now()}`,
        sku: "MOCK",
        name: line.description,
        category: "Custom",
        cost: line.rate * 0.7,
        price: line.rate,
        stock: 99,
        gstRate: line.gstRate,
        hsn: line.hsn,
        unit: "pcs",
        imageUrl: "",
        description: "",
        supplier: "",
      },
      quantity: line.qty,
    }));

    const newSale = checkoutPos(
      mockCartItems,
      selectedCustomerId || "walkin",
      "UPI",
      discountPercent
    );

    // Open print preview modal for the newly created invoice
    setPreviewInvoice(newSale);
    setActiveTab("list");
    setLines([{ description: "Specialty Coffee Roasts", hsn: "0901", qty: 2, rate: 1200, gstRate: 5 }]);
    setSelectedCustomerId("");
    setDiscountPercent(0);
  };

  const filteredSales = sales.filter((s) =>
    s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top toggle bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 rounded-full border border-border bg-secondary/40 p-1">
          <button
            onClick={() => setActiveTab("list")}
            className={`rounded-full px-4 py-1.5 text-xs font-600 transition-colors ${
              activeTab === "list"
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Invoice Registry
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`rounded-full px-4 py-1.5 text-xs font-600 transition-colors ${
              activeTab === "create"
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Tax Invoice
          </button>
        </div>
      </div>

      {activeTab === "list" ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search invoice number or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-border bg-secondary/40 py-2.5 pl-9 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground"
            />
          </div>

          {/* List layout */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSales.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  title="No Invoices Registered"
                  description="We couldn't find any tax invoices matching your search or filters. Sell items in POS or create custom invoices."
                  illustration="document"
                  actionText="Create Tax Invoice"
                  onAction={() => setActiveTab("create")}
                />
              </div>
            ) : (
              filteredSales.map((s) => (
                <div
                  key={s.id}
                  className="glass rounded-3xl p-5 space-y-4 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div>
                      <span className="font-mono font-700 text-sm text-foreground">{s.invoiceNumber}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(s.date).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-700 uppercase">
                      PAID
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground">Billed To:</p>
                    <p className="font-600 text-foreground">{s.customerName}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{s.customerPhone}</p>
                  </div>

                  <div className="flex justify-between items-end border-t border-border/30 pt-3 mt-1">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Total Sum</p>
                      <p className="font-mono font-700 text-base text-accent">₹{s.total.toLocaleString("en-IN")}</p>
                    </div>
                    <button
                      onClick={() => setPreviewInvoice(s)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline font-600"
                    >
                      <Printer className="size-3.5" /> Inspect PDF
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Create Invoice Form */
        <div className="glass rounded-3xl p-6 max-w-4xl mx-auto border border-border animate-in fade-in duration-200">
          <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-3">
            <FileText className="size-5 text-accent animate-pulse" />
            <h2 className="text-lg font-display font-700">Tax Invoice Creator</h2>
          </div>

          <form onSubmit={handleSaveInvoice} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Select Customer */}
              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                  Select Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
                >
                  <option value="" className="bg-card">Walk-in Cash Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-card">
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                  Discount percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={discountPercent || ""}
                  onChange={(e) => setDiscountPercent(Math.min(99, Math.max(0, Number(e.target.value))))}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-600 uppercase tracking-widest text-muted-foreground">Line items</h3>
              
              <div className="space-y-2">
                {lines.map((line, idx) => (
                  <div key={idx} className="group relative flex gap-2 items-center flex-wrap sm:flex-nowrap border border-border/40 p-2.5 rounded-2xl bg-secondary/10 hover:bg-secondary/20 hover:border-primary/20 transition-all">
                    {/* Description */}
                    <div className="w-full sm:flex-1">
                      <input
                        required
                        placeholder="Item Description"
                        value={line.description}
                        onChange={(e) => handleLineChange(idx, "description", e.target.value)}
                        className="w-full rounded-xl border border-border bg-card/45 hover:border-border/80 p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground transition-all"
                      />
                    </div>

                    {/* HSN */}
                    <div className="w-24">
                      <input
                        required
                        placeholder="HSN"
                        value={line.hsn}
                        onChange={(e) => handleLineChange(idx, "hsn", e.target.value)}
                        className="w-full rounded-xl border border-border bg-card/45 hover:border-border/80 p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground font-mono transition-all"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="w-20">
                      <input
                        required
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={line.qty || ""}
                        onChange={(e) => handleLineChange(idx, "qty", Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-xl border border-border bg-card/45 hover:border-border/80 p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground font-mono transition-all"
                      />
                    </div>

                    {/* Rate */}
                    <div className="w-24">
                      <input
                        required
                        type="number"
                        min="0"
                        placeholder="Rate (₹)"
                        value={line.rate || ""}
                        onChange={(e) => handleLineChange(idx, "rate", Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-xl border border-border bg-card/45 hover:border-border/80 p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground font-mono transition-all"
                      />
                    </div>

                    {/* GST */}
                    <div className="w-24">
                      <select
                        value={line.gstRate}
                        onChange={(e) => handleLineChange(idx, "gstRate", Number(e.target.value))}
                        className="w-full rounded-xl border border-border bg-card/45 hover:border-border/80 p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground cursor-pointer transition-all"
                      >
                        <option value={0} className="bg-card">0%</option>
                        <option value={5} className="bg-card">5%</option>
                        <option value={12} className="bg-card">12%</option>
                        <option value={18} className="bg-card">18%</option>
                        <option value={28} className="bg-card">28%</option>
                      </select>
                    </div>

                    {/* Trash */}
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        className="p-2 border border-border/60 hover:border-rose-500 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-70 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddLine}
                className="flex items-center gap-1.5 text-xs text-accent hover:underline font-600"
              >
                <Plus className="size-4" /> Add Line Item
              </button>
            </div>

            {/* Calculations summaries */}
            <div className="border-t border-border/40 pt-4 flex flex-col items-end text-xs space-y-2">
              <div className="flex justify-between w-64 text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between w-64 text-muted-foreground">
                <span>Discount</span>
                <span className="font-mono">-₹{discount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between w-64 text-muted-foreground">
                <span>Estimated GST</span>
                <span className="font-mono">+₹{Math.round(totalGst).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between w-64 border-t border-border/40 pt-2 text-sm font-700 text-foreground">
                <span>Total Amount Due</span>
                <span className="font-mono text-accent">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Submissions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="rounded-xl border border-border px-4 py-2.5 text-xs font-600 hover:bg-secondary/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
              >
                Save & Preview Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Styled Printable Invoice Modal Overlay */}
      {previewInvoice && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-2xl bg-white text-black p-8 rounded-3xl relative animate-in zoom-in-95 duration-150 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setPreviewInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2.5 transition-colors print:hidden"
            >
              <X className="size-4.5" />
            </button>

            {/* Print Header controls */}
            <div className="mb-6 flex gap-2 justify-end print:hidden pr-10">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-slate-900 text-white rounded-full px-4 py-2 text-xs font-600 hover:opacity-90 transition-all"
              >
                <Printer className="size-4" /> Print / Save PDF
              </button>
            </div>

            {/* Printable Area */}
            <div className="border border-[#d6d3d1] p-8 rounded-2xl bg-[#FBF9F4] space-y-6 relative overflow-hidden font-serif shadow-inner">
              
              {/* Faint Watermark Seal Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
                <svg className="w-96 h-96 text-amber-900" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                  <circle cx="100" cy="100" r="92" strokeWidth="2.5" strokeDasharray="4 3" />
                  <circle cx="100" cy="100" r="82" strokeWidth="1" />
                  <path id="seal-text-path-print" d="M 20 100 A 80 80 0 1 1 180 100 A 80 80 0 1 1 20 100" fill="none" />
                  <text className="text-[8px] font-bold uppercase tracking-widest fill-current font-sans">
                    <textPath href="#seal-text-path-print" startOffset="0%">
                      * {myCompanyName.toUpperCase()} * TRANSACTION SEAL *
                    </textPath>
                  </text>
                  <g transform="translate(68, 68)">
                    {/* Retro Box Logo Vector */}
                    <path d="M32 2L2 17l30 15 30-15-30-15zM2 47l30 15 30-15M2 32l30 15 30-15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>

              {/* Logo / Company Header */}
              <div className="flex justify-between items-start gap-4 relative z-10">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">{myCompanyName}</h1>
                  <p className="text-[10px] text-slate-600 mt-1 font-sans">{myCompanyAddress}</p>
                  <p className="text-[10px] text-slate-600 font-sans">GSTIN: {myCompanyGstin} · Phone: {myCompanyPhone}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">TAX INVOICE</h2>
                  <p className="font-mono text-xs font-700 text-slate-900 mt-1">{previewInvoice.invoiceNumber}</p>
                  <p className="text-[10px] text-slate-600 font-sans">Date: {new Date(previewInvoice.date).toLocaleDateString("en-IN")}</p>
                </div>
              </div>

              {/* Billed To / Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-200 py-3 text-xs relative z-10">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Billed To:</p>
                  <p className="font-bold text-slate-800 mt-1 font-sans">{previewInvoice.customerName}</p>
                  <p className="font-mono text-slate-600 mt-0.5 font-sans">Phone: {previewInvoice.customerPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Payment details:</p>
                  <p className="text-slate-800 font-semibold mt-1 font-sans">Mode: {previewInvoice.paymentMethod}</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5 font-sans">PAYMENT RECEIVED</p>
                </div>
              </div>

              {/* Lines Table */}
              <table className="w-full text-left text-xs border-collapse relative z-10">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 font-bold font-sans">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">HSN</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">GST %</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewInvoice.items.map((item: any, idx: number) => (
                    <tr key={idx} className="text-slate-800">
                      <td className="py-2.5 font-semibold font-sans">{item.productName}</td>
                      <td className="py-2.5 text-center font-mono">{item.gstRate === 5 ? "0901" : "2106"}</td>
                      <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="py-2.5 text-right font-mono">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 text-right font-mono">{item.gstRate}%</td>
                      <td className="py-2.5 text-right font-mono font-semibold">₹{item.lineTotal.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom calculations split */}
              <div className="grid grid-cols-12 gap-4 border-t border-slate-300 pt-4 items-start relative z-10">
                <div className="col-span-7 flex gap-4 items-center">
                  <div className="border-2 border-slate-300 p-2.5 rounded-xl bg-white shadow-sm flex flex-col items-center">
                    <QrCode className="size-16 text-slate-800" />
                    <span className="text-[7px] text-muted-foreground mt-1 uppercase font-sans tracking-widest font-800">UPI MERCHANT</span>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500 font-sans">Scan to Pay via UPI</p>
                    <div className="flex gap-1.5 items-center mt-1">
                      <span className="size-1.5 rounded-full bg-[#FF9933]" />
                      <span className="size-1.5 rounded-full bg-[#FFFFFF] border border-slate-200" />
                      <span className="size-1.5 rounded-full bg-[#138808]" />
                      <span className="text-[10px] font-bold text-slate-700 font-sans uppercase">BHIM UPI QR</span>
                    </div>
                    <p className="text-[9.5px] text-slate-600 mt-1 leading-relaxed font-sans font-medium">
                      Secure merchant settlement via bank gateway. Scan with GPay, PhonePe, Paytm or any banking app.
                    </p>
                  </div>
                </div>

                <div className="col-span-5 text-right text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{previewInvoice.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {previewInvoice.discount > 0 && (
                    <div className="flex justify-between text-slate-600 font-sans">
                      <span>Discount</span>
                      <span className="font-mono">-₹{previewInvoice.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Tax (GST)</span>
                    <span className="font-mono">₹{previewInvoice.gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-bold text-slate-900 font-sans">
                    <span>Invoice Total</span>
                    <span className="font-mono">₹{previewInvoice.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
              {/* Thank you footer */}
              <div className="text-center text-[10px] text-slate-500 border-t border-slate-200 pt-3 relative z-10 font-sans mt-4">
                This is a computer generated tax invoice. Thank you for your business!
              </div>
            </div>
          </div>
        </div>
      )}
      {/* React Portal for Print layout */}
      {isPrinting && previewInvoice && createPortal(
        <div className="print-root-container">
          <div className="print-invoice-layout space-y-6 relative overflow-hidden font-serif">
            {/* Central Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
              <svg className="w-96 h-96 text-amber-900" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                <circle cx="100" cy="100" r="92" strokeWidth="2.5" strokeDasharray="4 3" />
                <circle cx="100" cy="100" r="82" strokeWidth="1" />
                <path id="seal-text-path-invoices" d="M 20 100 A 80 80 0 1 1 180 100 A 80 80 0 1 1 20 100" fill="none" />
                <text className="text-[8px] font-bold uppercase tracking-widest fill-current font-sans">
                  <textPath href="#seal-text-path-invoices" startOffset="0%">
                    * {myCompanyName.toUpperCase()} * TRANSACTION SEAL *
                  </textPath>
                </text>
                <g transform="translate(68, 68)">
                  <path d="M32 2L2 17l30 15 30-15-30-15zM2 47l30 15 30-15M2 32l30 15 30-15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>

            {/* Logo / Company Header */}
            <div className="flex justify-between items-start gap-4 relative z-10">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">{myCompanyName}</h1>
                <p className="text-[10px] text-slate-600 mt-1 font-sans">{myCompanyAddress}</p>
                <p className="text-[10px] text-slate-600 font-sans">GSTIN: {myCompanyGstin} · Phone: {myCompanyPhone}</p>
              </div>
              <div className="text-right">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">TAX INVOICE</h2>
                <p className="font-mono text-xs font-700 text-slate-900 mt-1">{previewInvoice.invoiceNumber}</p>
                <p className="text-[10px] text-slate-600 font-sans">Date: {new Date(previewInvoice.date).toLocaleDateString("en-IN")}</p>
              </div>
            </div>

            {/* Billed To / Details */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-200 py-3 text-xs relative z-10">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Billed To:</p>
                <p className="font-bold text-slate-800 mt-1 font-sans">{previewInvoice.customerName}</p>
                <p className="font-mono text-slate-600 mt-0.5 font-sans">Phone: {previewInvoice.customerPhone || "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Payment details:</p>
                <p className="text-slate-800 font-semibold mt-1 font-sans">Mode: {previewInvoice.paymentMethod}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5 font-sans">PAYMENT RECEIVED</p>
              </div>
            </div>

            {/* Lines Table */}
            <table className="w-full text-left text-xs border-collapse relative z-10">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600 font-bold font-sans">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">GST %</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {previewInvoice.items.map((item: any, idx: number) => (
                  <tr key={idx} className="text-slate-800">
                    <td className="py-2.5 font-semibold font-sans">{item.productName}</td>
                    <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 text-right font-mono">{item.gstRate}%</td>
                    <td className="py-2.5 text-right font-mono font-semibold">₹{item.lineTotal.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom calculations split */}
            <div className="grid grid-cols-12 gap-4 border-t border-slate-300 pt-4 items-start relative z-10">
              <div className="col-span-7 flex gap-4 items-center">
                <div className="border-2 border-slate-300 p-2 rounded-xl bg-white flex flex-col items-center">
                  <QrCode className="size-14 text-slate-800" />
                  <span className="text-[6px] text-muted-foreground mt-1 uppercase font-sans tracking-widest font-800">UPI MERCHANT</span>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500 font-sans">Scan to Pay via UPI</p>
                  <p className="text-[9px] text-slate-600 mt-1 leading-normal font-sans font-medium">
                    Secure merchant settlement. Scan with Google Pay, PhonePe, Paytm, or any BHIM UPI app.
                  </p>
                </div>
              </div>

              <div className="col-span-5 text-right text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600 font-sans">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{previewInvoice.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {previewInvoice.discount > 0 && (
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Discount</span>
                    <span className="font-mono">-₹{previewInvoice.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 font-sans">
                  <span>Tax (GST)</span>
                  <span className="font-mono">₹{previewInvoice.gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-bold text-slate-900 font-sans">
                  <span>Invoice Total</span>
                  <span className="font-mono">₹{previewInvoice.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Thank you footer */}
            <div className="text-center text-[9px] text-slate-500 border-t border-slate-200 pt-3 relative z-10 font-sans mt-4">
              This is a computer generated tax invoice. Thank you for your business!
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
