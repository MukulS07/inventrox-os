import { useState } from "react";
import { createPortal } from "react-dom";
import { useBusinessState, Product, Customer } from "@/hooks/use-business-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ScanLine,
  User,
  ShieldCheck,
  CreditCard,
  Wallet,
  Smartphone,
  CheckCircle,
  Coffee,
  Droplet,
  GlassWater,
  Package,
  Wrench,
  Shirt,
  AlertTriangle,
  Printer,
  FileText,
  X,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
}

const getCategoryStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case "coffee":
      return {
        bg: "bg-gradient-to-br from-[#2b1810] via-[#48281d] to-[#1e100a]",
        orb: "bg-amber-500/20",
        iconColor: "text-amber-200/80",
        icon: Coffee,
      };
    case "syrups":
      return {
        bg: "bg-gradient-to-br from-[#451a03] via-[#7c2d12] to-[#290c00]",
        orb: "bg-orange-500/20",
        iconColor: "text-orange-300/80",
        icon: Droplet,
      };
    case "milks":
      return {
        bg: "bg-gradient-to-br from-[#062f4f] via-[#09416e] to-[#031b2e]",
        orb: "bg-sky-400/20",
        iconColor: "text-sky-200/80",
        icon: GlassWater,
      };
    case "packaging":
      return {
        bg: "bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#022c22]",
        orb: "bg-emerald-500/20",
        iconColor: "text-emerald-300/80",
        icon: Package,
      };
    case "accessories":
      return {
        bg: "bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a]",
        orb: "bg-slate-400/20",
        iconColor: "text-slate-200/80",
        icon: Wrench,
      };
    case "apparel":
      return {
        bg: "bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#09090b]",
        orb: "bg-zinc-500/15",
        iconColor: "text-zinc-300/80",
        icon: Shirt,
      };
    default:
      return {
        bg: "bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#0c0a09]",
        orb: "bg-stone-500/15",
        iconColor: "text-stone-300/80",
        icon: Package,
      };
  }
};

export default function PosTab() {
  const { products, customers, checkoutPos } = useBusinessState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "UPI" | "Card">("UPI");

  const compName = typeof window !== "undefined" ? localStorage.getItem("inv_comp_name") || "INVENTROX Specialty Roasters" : "INVENTROX Specialty Roasters";
  const compAddress = typeof window !== "undefined" ? localStorage.getItem("inv_comp_address") || "Plot 45, Udyog Vihar Phase 4, Gurgaon, Haryana, 122016" : "Plot 45, Udyog Vihar Phase 4, Gurgaon, Haryana, 122016";
  const compPhone = typeof window !== "undefined" ? localStorage.getItem("inv_comp_phone") || "+91 98765 43210" : "+91 98765 43210";
  const compGstin = typeof window !== "undefined" ? localStorage.getItem("inv_comp_gstin") || "07AAACO8892F1Z9" : "07AAACO8892F1Z9";
  const [discountPercent, setDiscountPercent] = useState(0);

  // OTP Verification Modal state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSentPhone, setOtpSentPhone] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [lastInvoiceNum, setLastInvoiceNum] = useState("");
  const [completedSale, setCompletedSale] = useState<any | null>(null);
  const [printType, setPrintType] = useState<"invoice" | "receipt" | null>(null);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) return; // Out of stock

    const existingIdx = cart.findIndex((item) => item.product.id === product.id);
    if (existingIdx > -1) {
      const currentQty = cart[existingIdx].quantity;
      if (currentQty >= product.stock) return; // Cannot exceed stock
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleDecreaseQty = (productId: string) => {
    const existingIdx = cart.findIndex((item) => item.product.id === productId);
    if (existingIdx > -1) {
      const updated = [...cart];
      if (updated[existingIdx].quantity === 1) {
        setCart(cart.filter((item) => item.product.id !== productId));
      } else {
        updated[existingIdx].quantity -= 1;
        setCart(updated);
      }
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  // Cart Calculations
  let subtotal = 0;
  let gstAmount = 0;
  cart.forEach((item) => {
    const lineTotal = item.product.price * item.quantity;
    subtotal += lineTotal;
    gstAmount += lineTotal * (item.product.gstRate / 100);
  });

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const grandTotal = Math.round(subtotal - discountAmount + gstAmount);

  // Checkout Flow
  const handleOpenCheckout = () => {
    if (cart.length === 0) return;

    const customer = customers.find((c) => c.id === selectedCustomerId);
    const phone = customer ? customer.phone : "Walk-in Cash Customer";
    setOtpSentPhone(phone);
    setOtpVerified(false);
    setOtpCode("");
    setIsOtpModalOpen(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length === 6) {
      // Execute global POS checkout
      const newSale = checkoutPos(
        cart,
        selectedCustomerId || "walkin",
        paymentMethod,
        discountPercent
      );

      setLastInvoiceNum(newSale.invoiceNumber);
      setCompletedSale(newSale);
      setOtpVerified(true);
      setCart([]); // Clear cart
      setSelectedCustomerId("");
      setDiscountPercent(0);
    }
  };

  const handlePrint = (type: "invoice" | "receipt", saleData: any) => {
    if (!saleData) return;
    setPrintType(type);
    
    // Allow Portal to mount and style sheet classes to apply
    setTimeout(() => {
      document.body.classList.add(`printing-${type}`);
      window.print();
      document.body.classList.remove(`printing-${type}`);
      setPrintType(null);
    }, 150);
  };

  const handleWhatsAppShare = (saleData: any) => {
    if (!saleData) return;
    const phone = saleData.customerPhone || "Walk-in";
    const n8nUrl = localStorage.getItem("inv_n8n_webhook_invoice") || localStorage.getItem("inv_n8n_webhook");
    if (n8nUrl) {
      toast.success(`Dispatched invoice #${saleData.invoiceNumber} to WhatsApp via n8n automation!`);
    } else {
      toast.success(`Shared invoice ${saleData.invoiceNumber} to customer mobile ${phone} successfully.`);
    }
  };

  const handleCloseAndReset = () => {
    setIsOtpModalOpen(false);
    setOtpVerified(false);
    setOtpCode("");
    setCompletedSale(null);
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="grid gap-4 md:grid-cols-12 items-stretch h-[calc(100vh-140px)] min-h-[500px] animate-in fade-in duration-300">
      {/* LEFT COLUMN: Product Catalog (40%) */}
      <div className="md:col-span-5 glass rounded-3xl p-4 flex flex-col min-h-0 border border-border">
        <div className="space-y-3 mb-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search SKU or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-secondary/40 py-2.5 pl-9 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground transition-all focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-[10px] font-600 transition-all border shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground border-transparent shadow-glow"
                    : "text-muted-foreground bg-secondary/20 hover:bg-secondary/40 border border-border/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid gap-3 grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock === 0;
            const isLowStock = p.stock > 0 && p.stock <= 10;
            const styles = getCategoryStyles(p.category);
            const IconComponent = styles.icon;

            return (
              <button
                key={p.id}
                onClick={() => handleAddToCart(p)}
                disabled={isOutOfStock}
                className="group p-3 rounded-2xl border border-border/40 bg-card/25 text-left flex flex-col justify-between hover:border-primary/30 transition-all hover:bg-card/40 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className={`w-full aspect-square ${styles.bg} rounded-xl flex items-center justify-center mb-2 relative overflow-hidden border border-border/20`}>
                  <div className={`absolute size-14 rounded-full ${styles.orb} blur-lg group-hover:scale-110 transition-transform`} />
                  <IconComponent className={`size-8 stroke-[1.1] ${styles.iconColor} group-hover:rotate-6 transition-transform z-10 filter drop-shadow-md`} />
                  {isOutOfStock ? (
                    <span className="absolute inset-0 bg-black/80 flex items-center justify-center text-[9px] text-rose-400 font-800 tracking-wider z-20">
                      SOLD OUT
                    </span>
                  ) : isLowStock ? (
                    <span className="absolute bottom-1 right-1 bg-amber-500 text-black text-[8px] font-800 px-1.5 py-0.5 rounded shadow animate-pulse z-20">
                      {p.stock} left
                    </span>
                  ) : (
                    <span className="absolute bottom-1 right-1 bg-black/40 backdrop-blur-md text-white text-[8px] font-600 px-1.5 py-0.5 rounded border border-white/10 z-20">
                      {p.stock} {p.unit}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-display font-700 text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {p.name}
                  </h4>
                  <p className="font-mono text-[9px] text-muted-foreground mt-0.5">{p.sku}</p>
                  <p className="font-mono font-700 text-xs text-foreground mt-2">₹{p.price.toLocaleString("en-IN")}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTER COLUMN: Billing Shopping Cart (35%) */}
      <div className="md:col-span-4 glass rounded-3xl p-4 flex flex-col min-h-0 border border-border">
        <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-3 shrink-0">
          <ShoppingCart className="size-4.5 text-accent" />
          <h3 className="font-display font-700 text-sm">Shopping Cart ({cart.length} items)</h3>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 flex flex-col">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center h-full">
              <EmptyState
                title="POS Cart is Empty"
                description="Select coffee roasts, syrups, or apparel from the catalog on the left to build an order receipt."
                illustration="cart"
              />
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/20 border border-border/40 hover:bg-secondary/30 transition-all duration-200 animate-in slide-in-from-bottom-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-600 text-foreground truncate">{item.product.name}</p>
                  <p className="text-[9px] text-muted-foreground font-mono mt-0.5">₹{item.product.price} / {item.product.unit}</p>
                </div>

                {/* Spinners */}
                <div className="flex items-center border border-border bg-secondary/40 rounded-lg p-0.5">
                  <button
                    onClick={() => handleDecreaseQty(item.product.id)}
                    className="p-0.5 hover:text-accent transition-colors"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-6 text-center font-mono font-600 text-xs">{item.quantity}</span>
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="p-0.5 hover:text-accent transition-colors"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>

                <div className="text-right font-mono font-600 text-xs w-16">
                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                </div>

                <button
                  onClick={() => handleRemoveFromCart(item.product.id)}
                  className="p-1 text-muted-foreground hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Aggregations */}
        <div className="border-t border-border/50 pt-3 mt-3 shrink-0 space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Discount (%)</span>
            <input
              type="number"
              min="0"
              max="99"
              value={discountPercent || ""}
              onChange={(e) => setDiscountPercent(Math.min(99, Math.max(0, Number(e.target.value))))}
              className="w-12 bg-secondary/50 border border-border rounded px-1.5 py-0.5 text-center font-mono text-xs focus:ring-0 text-foreground"
            />
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Estimated GST</span>
            <span className="font-mono">+₹{Math.round(gstAmount).toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between border-t border-border/40 pt-2 text-sm font-700 text-foreground">
            <span>Grand Total</span>
            <span className="font-mono text-accent">₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Customer & Payment (25%) */}
      <div className="md:col-span-3 glass rounded-3xl p-4 flex flex-col justify-between border border-border">
        {/* Customer Select */}
        <div className="space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h3 className="font-display font-700 text-sm flex items-center gap-1.5">
              <User className="size-4.5 text-accent" /> Checkout Details
            </h3>
          </div>

          <div>
            <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
              Customer Registry
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
            >
              <option value="" className="bg-card">Walk-in Cash Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="bg-card">
                  {c.name} ({c.phone.slice(-4)})
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && (
            <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 space-y-1 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-600">
                <span>{selectedCustomer.name}</span>
                <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 rounded-full font-700">
                  {selectedCustomer.segment}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">LTV: ₹{selectedCustomer.ltv.toLocaleString("en-IN")}</p>
            </div>
          )}

          {/* Payment Tabs */}
          <div>
            <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
              Payment Gateway
            </label>
            <div className="grid grid-cols-3 gap-1 bg-secondary/30 rounded-xl p-1 border border-border/30">
              <button
                onClick={() => setPaymentMethod("UPI")}
                className={`py-2 rounded-lg flex flex-col items-center gap-1 text-[10px] font-600 transition-colors cursor-pointer ${
                  paymentMethod === "UPI" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="size-4" /> UPI
              </button>
              <button
                onClick={() => setPaymentMethod("Card")}
                className={`py-2 rounded-lg flex flex-col items-center gap-1 text-[10px] font-600 transition-colors cursor-pointer ${
                  paymentMethod === "Card" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className="size-4" /> Card
              </button>
              <button
                onClick={() => setPaymentMethod("Cash")}
                className={`py-2 rounded-lg flex flex-col items-center gap-1 text-[10px] font-600 transition-colors cursor-pointer ${
                  paymentMethod === "Cash" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Wallet className="size-4" /> Cash
              </button>
            </div>
          </div>
        </div>

        {/* Generate Invoice Button */}
        <button
          onClick={handleOpenCheckout}
          disabled={cart.length === 0}
          className="w-full rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground py-3 text-xs font-700 shadow-glow hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-6 cursor-pointer"
        >
          Generate Invoice (₹{grandTotal.toLocaleString("en-IN")})
        </button>
      </div>

      {/* OTP Verification Modal Overlay */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-card backdrop-blur-xl animate-in zoom-in-95 duration-150">
            {!otpVerified ? (
              <div className="space-y-4">
                <div className="text-center border-b border-border/40 pb-3 mb-1">
                  <Smartphone className="size-8 mx-auto text-accent mb-2 animate-bounce" />
                  <h3 className="font-display font-700 text-sm">OTP Authorization Required</h3>
                  
                  {/* Premium Checkout details preview inside modal */}
                  <div className="mt-3 p-2 rounded-xl bg-secondary/40 border border-border/30 text-[10px] space-y-1 text-left">
                    <div className="flex justify-between font-600">
                      <span>Billed Amount:</span>
                      <span className="text-accent font-mono">₹{grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Customer:</span>
                      <span className="truncate max-w-[120px]">{selectedCustomer?.name || "Walk-in"}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Payment Method:</span>
                      <span>{paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-muted-foreground text-center">
                    Enter the 6-digit security code sent to <span className="font-600 font-mono text-foreground">{otpSentPhone}</span>:
                  </p>
                  
                  {/* Premium Split-Box PIN Inputs */}
                  <div className="relative w-full max-w-[280px] mx-auto">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      autoFocus
                    />
                    <div className="flex justify-between gap-1.5">
                      {Array.from({ length: 6 }).map((_, idx) => {
                        const char = otpCode[idx] || "";
                        const isActive = otpCode.length === idx;
                        return (
                          <div
                            key={idx}
                            className={`size-10 rounded-xl border flex items-center justify-center font-mono font-700 text-sm transition-all duration-200 ${
                              char
                                ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/20"
                                : isActive
                                ? "border-accent bg-secondary/50 ring-1 ring-accent"
                                : "border-border/60 bg-secondary/20 text-muted-foreground"
                            }`}
                          >
                            {char ? "•" : ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <p className="text-[9px] text-center text-muted-foreground/80">
                    Tip: Enter any 6 digits (e.g. <span className="font-mono">123456</span>) to verify.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsOtpModalOpen(false)}
                    className="flex-1 rounded-xl border border-border py-2 text-xs font-600 hover:bg-secondary/40 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpCode.length !== 6}
                    className="flex-1 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground py-2 text-xs font-600 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    Verify & Pay
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-2">
                <CheckCircle className="size-12 mx-auto text-emerald-400 animate-bounce" />
                <div>
                  <h3 className="font-display font-700 text-base text-foreground">Transaction Completed</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Invoice <span className="font-mono font-700 text-foreground">{lastInvoiceNum}</span> created successfully.
                  </p>
                </div>
                
                {/* Print Quick Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handlePrint("receipt", completedSale)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-700 shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <Printer className="size-4" /> Print Thermal Receipt (80mm)
                  </button>
                  <button
                    onClick={() => handlePrint("invoice", completedSale)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 text-foreground py-2.5 text-xs font-700 hover:bg-secondary transition-all cursor-pointer"
                  >
                    <FileText className="size-4" /> Print Tax Invoice (A4)
                  </button>
                  <button
                    onClick={() => handleWhatsAppShare(completedSale)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 text-foreground py-2.5 text-xs font-700 hover:bg-secondary transition-all cursor-pointer"
                  >
                    <Smartphone className="size-4" /> WhatsApp Invoice
                  </button>
                </div>

                <div className="pt-4 border-t border-border/40 mt-2">
                  <button
                    onClick={handleCloseAndReset}
                    className="w-full rounded-xl bg-secondary hover:bg-secondary/60 text-foreground py-2 text-xs font-600 transition-colors border border-border cursor-pointer"
                  >
                    New Transaction
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* React Portal for Print Layouts */}
      {printType && completedSale && createPortal(
        <div className="print-root-container">
          {printType === "invoice" ? (
            <div className="print-invoice-layout space-y-6 relative overflow-hidden font-serif">
              {/* Central Watermark Seal */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
                <svg className="w-96 h-96 text-amber-900" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                  <circle cx="100" cy="100" r="92" strokeWidth="2.5" strokeDasharray="4 3" />
                  <circle cx="100" cy="100" r="82" strokeWidth="1" />
                  <path id="seal-text-path-pos" d="M 20 100 A 80 80 0 1 1 180 100 A 80 80 0 1 1 20 100" fill="none" />
                  <text className="text-[8px] font-bold uppercase tracking-widest fill-current font-sans">
                    <textPath href="#seal-text-path-pos" startOffset="0%">
                      * {compName.toUpperCase()} * TRANSACTION SEAL *
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
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">{compName}</h1>
                  <p className="text-[10px] text-slate-600 mt-1 font-sans">{compAddress}</p>
                  <p className="text-[10px] text-slate-600 font-sans">GSTIN: {compGstin} · Phone: {compPhone}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">TAX INVOICE</h2>
                  <p className="font-mono text-xs font-700 text-slate-900 mt-1">{completedSale.invoiceNumber}</p>
                  <p className="text-[10px] text-slate-600 font-sans">Date: {new Date(completedSale.date).toLocaleDateString("en-IN")}</p>
                </div>
              </div>

              {/* Billed To / Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-200 py-3 text-xs relative z-10">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Billed To:</p>
                  <p className="font-bold text-slate-800 mt-1 font-sans">{completedSale.customerName}</p>
                  <p className="font-mono text-slate-600 mt-0.5 font-sans">Phone: {completedSale.customerPhone || "N/A"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Payment details:</p>
                  <p className="text-slate-800 font-semibold mt-1 font-sans">Mode: {completedSale.paymentMethod}</p>
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
                  {completedSale.items.map((item: any, idx: number) => (
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
                    <span className="font-mono">₹{completedSale.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {completedSale.discount > 0 && (
                    <div className="flex justify-between text-slate-600 font-sans">
                      <span>Discount</span>
                      <span className="font-mono">-₹{completedSale.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Tax (GST)</span>
                    <span className="font-mono">₹{completedSale.gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-bold text-slate-900 font-sans">
                    <span>Invoice Total</span>
                    <span className="font-mono">₹{completedSale.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Thank you footer */}
              <div className="text-center text-[9px] text-slate-500 border-t border-slate-200 pt-3 relative z-10 font-sans mt-4">
                This is a computer generated tax invoice. Thank you for your business!
              </div>
            </div>
          ) : (
            <div className="print-receipt-layout space-y-4">
              {/* Monospace Thermal Receipt Layout */}
              <div className="text-center space-y-1">
                <h4 className="font-bold text-sm uppercase">{compName}</h4>
                <p className="text-[10px]">{compAddress}</p>
                <p className="text-[10px]">Phone: {compPhone}</p>
                <p className="text-[10px]">--------------------------------</p>
                <p className="text-[11px] font-bold uppercase">Official Bill Receipt</p>
                <p className="text-[10px]">--------------------------------</p>
              </div>

              <div className="text-[10px] space-y-0.5">
                <div>Invoice: <strong>{completedSale.invoiceNumber}</strong></div>
                <div>Date: {new Date(completedSale.date).toLocaleDateString("en-IN")}</div>
                <div>Time: {new Date(completedSale.date).toLocaleTimeString("en-IN")}</div>
                <div>Method: {completedSale.paymentMethod}</div>
                <div>Status: PAID / OTP VERIFIED</div>
                <div>Customer: {completedSale.customerName}</div>
                {completedSale.customerPhone && <div>Phone: {completedSale.customerPhone}</div>}
              </div>

              <p className="text-[10px]">--------------------------------</p>
              
              {/* Line items */}
              <div className="text-[10px] space-y-1">
                {completedSale.items.map((item: any, idx: number) => (
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
                  <span>₹{completedSale.subtotal}</span>
                </div>
                {completedSale.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-₹{completedSale.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST Tax:</span>
                  <span>+₹{completedSale.gst}</span>
                </div>
                <div className="flex justify-between font-bold text-xs">
                  <span>Grand Total:</span>
                  <span>₹{completedSale.total}</span>
                </div>
              </div>

              <p className="text-[10px]">--------------------------------</p>

              {/* Barcode representation */}
              <div className="text-center space-y-2">
                <div className="h-6 bg-[repeating-linear-gradient(90deg,#000_0px,#000_2px,transparent_2px,transparent_5px)] opacity-85 mx-auto max-w-[150px]" />
                <p className="text-[8px] font-mono">*{completedSale.id.slice(0, 10).toUpperCase()}*</p>
                <p className="text-[9px] font-bold">Thank you! Please visit again.</p>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
