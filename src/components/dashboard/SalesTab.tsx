import { useState } from "react";
import { createPortal } from "react-dom";
import { useBusinessState, Sale } from "@/hooks/use-business-state";
import { Search, ChevronDown, ChevronUp, FileText, Printer, Calendar, TrendingUp, Coins, Percent, ReceiptText } from "lucide-react";

export default function SalesTab() {
  const { sales } = useBusinessState();
  const [search, setSearch] = useState("");
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  const [printSale, setPrintSale] = useState<Sale | null>(null);

  const compName = typeof window !== "undefined" ? localStorage.getItem("inv_comp_name") || "INVENTROX Specialty Roasters" : "INVENTROX Specialty Roasters";
  const compAddress = typeof window !== "undefined" ? localStorage.getItem("inv_comp_address") || "Plot 45, Udyog Vihar IV, Gurgaon" : "Plot 45, Udyog Vihar IV, Gurgaon";
  const compPhone = typeof window !== "undefined" ? localStorage.getItem("inv_comp_phone") || "+91 98765 43210" : "+91 98765 43210";

  const handlePrintReceipt = (sale: Sale) => {
    setPrintSale(sale);
    setTimeout(() => {
      document.body.classList.add("printing-receipt");
      window.print();
      document.body.classList.remove("printing-receipt");
      setPrintSale(null);
    }, 150);
  };

  const netRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalTax = sales.reduce((acc, s) => acc + s.gst, 0);
  const totalDiscount = sales.reduce((acc, s) => acc + s.discount, 0);
  const avgOrderValue = sales.length > 0 ? Math.round(netRevenue / sales.length) : 0;

  const filteredSales = sales.filter((s) =>
    s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpandRow = (id: string) => {
    setExpandedSaleId(expandedSaleId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Sales Summary KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-200">
        <div className="glass rounded-2xl p-4.5 flex items-center justify-between border border-border/50 bg-card/10">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-600">Net Revenue</p>
            <p className="font-mono text-xl font-700 text-foreground">₹{netRevenue.toLocaleString("en-IN")}</p>
            <p className="text-[9px] text-emerald-400 font-500">Gross transaction volume</p>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-secondary/80 text-emerald-400 border border-border/40">
            <Coins className="size-5.5" />
          </span>
        </div>

        <div className="glass rounded-2xl p-4.5 flex items-center justify-between border border-border/50 bg-card/10">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-600">Avg Order Value</p>
            <p className="font-mono text-xl font-700 text-foreground">₹{avgOrderValue.toLocaleString("en-IN")}</p>
            <p className="text-[9px] text-primary font-500">AOV index per checkout</p>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-secondary/80 text-primary border border-border/40">
            <TrendingUp className="size-5.5" />
          </span>
        </div>

        <div className="glass rounded-2xl p-4.5 flex items-center justify-between border border-border/50 bg-card/10">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-600">Collected GST</p>
            <p className="font-mono text-xl font-700 text-foreground">₹{totalTax.toLocaleString("en-IN")}</p>
            <p className="text-[9px] text-amber-400 font-500">Aggregate retail taxes</p>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-secondary/80 text-amber-400 border border-border/40">
            <Percent className="size-5.5" />
          </span>
        </div>

        <div className="glass rounded-2xl p-4.5 flex items-center justify-between border border-border/50 bg-card/10">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-600">Discounts Given</p>
            <p className="font-mono text-xl font-700 text-foreground">₹{totalDiscount.toLocaleString("en-IN")}</p>
            <p className="text-[9px] text-rose-400 font-500">Promotions & markdowns</p>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-secondary/80 text-rose-400 border border-border/40">
            <ReceiptText className="size-5.5" />
          </span>
        </div>
      </div>

      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search invoice number or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-secondary/40 py-2 pl-9 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground"
          />
        </div>
      </div>

      {/* Sales Logs Table */}
      <div className="glass rounded-3xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground uppercase tracking-widest text-[9px] font-600">
                <th className="px-5 py-4">Invoice #</th>
                <th className="px-5 py-4">Date & Time</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Payment Method</th>
                <th className="px-5 py-4 text-right">Subtotal</th>
                <th className="px-5 py-4 text-right">GST</th>
                <th className="px-5 py-4 text-right">Grand Total</th>
                <th className="px-5 py-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No transactions registered in ledger yet. Complete sales via POS.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => {
                  const isExpanded = expandedSaleId === s.id;
                  const dateObj = new Date(s.date);
                  const formattedDate = dateObj.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <React.Fragment key={s.id}>
                      <tr className={`transition-colors hover:bg-secondary/10 ${isExpanded ? "bg-secondary/20" : ""}`}>
                        <td className="px-5 py-4 font-mono font-700 text-foreground">{s.invoiceNumber}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-3.5" />
                            <span>{formattedDate} · {formattedTime}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-600 text-foreground">
                          {s.customerName}
                          <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.customerPhone}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 font-700 text-[9px] border border-border text-accent uppercase">
                            {s.paymentMethod}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-muted-foreground">₹{s.subtotal.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-4 text-right font-mono text-muted-foreground">+₹{s.gst.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-4 text-right font-mono font-700 text-foreground">₹{s.total.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => toggleExpandRow(s.id)}
                            className="grid size-8 place-items-center rounded-lg border border-border hover:bg-secondary hover:text-foreground text-muted-foreground mx-auto transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="px-5 py-6 bg-secondary/10 border-t border-b border-border/30 animate-in slide-in-from-top-2 duration-200">
                            {/* Thermal-Receipt-like Styled Container */}
                            <div className="max-w-md mx-auto bg-card border border-border shadow-2xl rounded-3xl overflow-hidden relative">
                              {/* Jagged / Dotted Top border decoration */}
                              <div className="absolute top-0 inset-x-0 h-1 bg-[radial-gradient(circle,var(--border)_1px,transparent_1.5px)] bg-[length:6px_6px] opacity-40" />

                              <div className="p-6 space-y-6 text-foreground">
                                {/* Receipt Header */}
                                <div className="text-center space-y-1">
                                  <h4 className="font-display font-800 text-xs tracking-wider uppercase">INVENTROX Operating System</h4>
                                  <p className="text-[9px] text-muted-foreground font-medium">Plot 45, Udyog Vihar Phase 4, Gurgaon, India</p>
                                  <div className="border-b border-dashed border-border/60 py-1" />
                                  <p className="text-[10px] font-700 text-accent tracking-widest uppercase py-1">Official Bill Receipt</p>
                                  <div className="border-b border-dashed border-border/60 py-1" />
                                </div>

                                {/* Transaction Info */}
                                <div className="grid grid-cols-2 gap-y-2 text-[10px] border-b border-border/40 pb-4 font-medium text-muted-foreground">
                                  <div>Invoice: <span className="font-mono font-700 text-foreground">{s.invoiceNumber}</span></div>
                                  <div className="text-right">Date: <span className="text-foreground">{formattedDate}</span></div>
                                  <div>Method: <span className="text-foreground font-700">{s.paymentMethod}</span></div>
                                  <div className="text-right">Time: <span className="text-foreground">{formattedTime}</span></div>
                                  <div>Operator: <span className="text-foreground">Mukul Sharma (Admin)</span></div>
                                  <div className="text-right">OTP: <span className="text-emerald-400 font-700">VERIFIED</span></div>
                                </div>

                                {/* Billed To */}
                                <div className="space-y-1 border-b border-border/40 pb-4">
                                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-600">Customer Details:</p>
                                  <p className="text-xs font-700">{s.customerName}</p>
                                  <p className="font-mono text-[10px] text-muted-foreground">{s.customerPhone || "N/A"}</p>
                                </div>

                                {/* Line Items list */}
                                <div className="space-y-3">
                                  <div className="flex justify-between text-[9px] font-700 uppercase tracking-wider text-muted-foreground border-b border-border/20 pb-1">
                                    <span>Item / Description</span>
                                    <div className="flex gap-4">
                                      <span className="w-10 text-center">Qty</span>
                                      <span className="w-16 text-right">Total</span>
                                    </div>
                                  </div>

                                  <div className="divide-y divide-border/20 space-y-1 pb-2">
                                    {s.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between py-2 text-xs items-start">
                                        <div className="flex-1 pr-4">
                                          <p className="font-600 text-foreground">{item.productName}</p>
                                          <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">
                                            Rate: ₹{item.unitPrice} · GST: {item.gstRate}%
                                          </p>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                          <span className="w-10 text-center font-mono text-muted-foreground">x{item.quantity}</span>
                                          <span className="w-16 text-right font-mono font-600 text-foreground">
                                            ₹{item.lineTotal.toLocaleString("en-IN")}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Bill Summary Calculations */}
                                <div className="border-t border-dashed border-border/60 pt-4 text-xs space-y-2 font-medium">
                                  <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-mono">₹{s.subtotal.toLocaleString("en-IN")}</span>
                                  </div>
                                  {s.discount > 0 && (
                                    <div className="flex justify-between text-rose-400">
                                      <span>Discounts Given</span>
                                      <span className="font-mono">-₹{s.discount.toLocaleString("en-IN")}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-muted-foreground">
                                    <span>Taxes (GST)</span>
                                    <span className="font-mono">+₹{s.gst.toLocaleString("en-IN")}</span>
                                  </div>
                                  <div className="border-t border-border pt-3 flex justify-between text-sm font-800 text-foreground">
                                    <span>Invoice Total</span>
                                    <span className="font-mono text-accent">₹{s.total.toLocaleString("en-IN")}</span>
                                  </div>
                                </div>

                                {/* Footer Barcode / Print */}
                                <div className="text-center space-y-3 pt-4 border-t border-dashed border-border/60">
                                  {/* Simulated Barcode */}
                                  <div className="h-8 bg-[repeating-linear-gradient(90deg,var(--border)_0px,var(--border)_2.5px,transparent_2.5px,transparent_6px)] opacity-55 mx-auto max-w-[200px]" />
                                  <p className="text-[9px] text-muted-foreground tracking-widest font-mono">*{s.id.toUpperCase()}*</p>
                                  
                                  <div className="flex justify-center gap-2 pt-2 print:hidden">
                                    <button
                                      onClick={() => handlePrintReceipt(s)}
                                      className="flex items-center gap-1.5 rounded-xl bg-secondary hover:bg-secondary/60 text-foreground border border-border px-4 py-2 text-xs font-600 transition-all cursor-pointer shadow-sm"
                                    >
                                      <Printer className="size-3.5" /> Print Receipt
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Jagged Bottom border decoration */}
                              <div className="absolute bottom-0 inset-x-0 h-1 bg-[radial-gradient(circle,var(--border)_1px,transparent_1.5px)] bg-[length:6px_6px] opacity-40" />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* React Portal for Print Layout */}
      {printSale && createPortal(
        <div className="print-root-container">
          <div className="print-receipt-layout space-y-4">
            <div className="text-center space-y-1">
              <h4 className="font-bold text-sm uppercase">{compName}</h4>
              <p className="text-[10px]">{compAddress}</p>
              <p className="text-[10px]">Phone: {compPhone}</p>
              <p className="text-[10px]">--------------------------------</p>
              <p className="text-[11px] font-bold uppercase">Official Bill Receipt</p>
              <p className="text-[10px]">--------------------------------</p>
            </div>

            <div className="text-[10px] space-y-0.5">
              <div>Invoice: <strong>{printSale.invoiceNumber}</strong></div>
              <div>Date: {new Date(printSale.date).toLocaleDateString("en-IN")}</div>
              <div>Time: {new Date(printSale.date).toLocaleTimeString("en-IN")}</div>
              <div>Method: {printSale.paymentMethod}</div>
              <div>Status: PAID / OTP VERIFIED</div>
              <div>Customer: {printSale.customerName}</div>
              {printSale.customerPhone && <div>Phone: {printSale.customerPhone}</div>}
            </div>

            <p className="text-[10px]">--------------------------------</p>
            
            {/* Line items */}
            <div className="text-[10px] space-y-1">
              {printSale.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <div>{item.productName}</div>
                    <div className="text-[9px] text-slate-600">
                      {item.quantity} x ₹{item.unitPrice} (GST {item.gstRate}%)
                    </div>
                  </div>
                  <div>₹{item.lineTotal}</div>
                </div>
              ))}
            </div>

            <p className="text-[10px]">--------------------------------</p>

            <div className="text-[10px] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{printSale.subtotal}</span>
              </div>
              {printSale.discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{printSale.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Tax:</span>
                <span>+₹{printSale.gst}</span>
              </div>
              <div className="flex justify-between font-bold text-xs">
                <span>Grand Total:</span>
                <span>₹{printSale.total}</span>
              </div>
            </div>

            <p className="text-[10px]">--------------------------------</p>

            {/* Barcode representation */}
            <div className="text-center space-y-2">
              <div className="h-6 bg-[repeating-linear-gradient(90deg,#000_0px,#000_2px,transparent_2px,transparent_5px)] opacity-85 mx-auto max-w-[150px]" />
              <p className="text-[8px] font-mono">*{printSale.id.slice(0, 10).toUpperCase()}*</p>
              <p className="text-[9px] font-bold">Thank you! Please visit again.</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
// Add React import explicitly to prevent compile errors for react fragment in bundle
import React from "react";
