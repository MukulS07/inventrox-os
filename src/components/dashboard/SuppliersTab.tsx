import { useState } from "react";
import { useBusinessState, Supplier } from "@/hooks/use-business-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  X,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

export default function SuppliersTab() {
  const { suppliers, addSupplier, products } = useBusinessState();
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({
      name,
      phone,
      email,
      address,
      gstin,
    });
    // Clear
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setGstin("");
    setIsDrawerOpen(false);
  };

  const totalSupplierVal = suppliers.reduce((sum, sup) => sum + sup.totalValue, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-secondary/40 py-2 pl-9 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground transition-all focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <button
          id="add-supplier-btn"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-4 py-2 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
        >
          <Plus className="size-4" /> Add Supplier
        </button>
      </div>

      {/* Grid of Suppliers */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No Suppliers Found"
              description="Your search returned no results, or there are no registered suppliers. Add suppliers to link catalog products."
              illustration="suppliers"
              actionText="Add Supplier"
              onAction={() => setIsDrawerOpen(true)}
            />
          </div>
        ) : (
          filteredSuppliers.map((s) => {
            const supplierProducts = products.filter((p) => p.supplier === s.name);
            const lowStockProducts = supplierProducts.filter((p) => p.stock <= 10);
            const hasAlert = lowStockProducts.length > 0;
            const valueShare = totalSupplierVal > 0 ? Math.round((s.totalValue / totalSupplierVal) * 100) : 0;

            return (
              <div
                key={s.id}
                className="glass rounded-3xl p-5 space-y-4 hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-display font-700 text-base text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
                      {s.gstin && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-600 text-emerald-400 mt-1">
                          <ShieldCheck className="size-3" /> GSTIN Verified
                        </span>
                      )}
                    </div>
                    {hasAlert && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-400 px-2 py-0.5 text-[9px] font-700 animate-pulse border border-amber-500/20 shrink-0">
                        <AlertTriangle className="size-3" /> RESTOCK ALRT
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 shrink-0 text-accent" />
                      <span>{s.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 shrink-0 text-accent" />
                      <span className="truncate">{s.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="size-3.5 shrink-0 text-accent mt-0.5" />
                      <span className="line-clamp-2">{s.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40 text-center">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-600">Active orders</p>
                      <p className="font-mono font-700 text-sm mt-0.5 text-accent">{s.activeOrders} pending</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-600">Order Value (LTD)</p>
                      <p className="font-mono font-700 text-sm mt-0.5 text-foreground">₹{s.totalValue.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  {/* Supplier metrics */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
                        <span>Catalog SKU Coverage</span>
                        <span className="font-600 text-foreground">
                          {supplierProducts.length} SKU{supplierProducts.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-300"
                          style={{ width: `${products.length > 0 ? (supplierProducts.length / products.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
                        <span>Purchase Value Share</span>
                        <span className="font-600 text-foreground">{valueShare}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                          style={{ width: `${valueShare}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Restock Action button */}
                <div className="pt-4 mt-1">
                  <button
                    onClick={() => {
                      localStorage.setItem("preselected_restock_supplier", s.name);
                      window.dispatchEvent(new CustomEvent("switch-dashboard-tab", { detail: "Inventory" }));
                    }}
                    className="w-full py-2.5 rounded-xl border border-primary/20 hover:border-primary/45 bg-primary/5 hover:bg-primary/10 text-primary hover:text-foreground font-600 text-xs transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <TrendingUp className="size-3.5" /> Initiate Restock <ChevronRight className="size-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Slide-over Drawer for adding supplier */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 h-full w-[400px] max-w-full border-l border-border bg-card shadow-card flex flex-col animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-secondary/10">
              <h3 className="font-display font-700 text-base text-foreground">Register Supplier</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Supplier Name</label>
                <input
                  required
                  placeholder="e.g. Blue Tokai Coffee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Contact Phone</label>
                <input
                  required
                  placeholder="e.g. 9100088822"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Contact Email</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. roasters@bluetokai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Supplier Address</label>
                <textarea
                  required
                  placeholder="e.g. Unit 34, Saidulajab, New Delhi"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">GSTIN Code</label>
                <input
                  placeholder="e.g. 07BTCC1234F1ZA"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-600 hover:bg-secondary/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
