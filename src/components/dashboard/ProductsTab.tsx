import { useState } from "react";
import { useBusinessState } from "@/hooks/use-business-state";
import { toast } from "sonner";
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  Coffee,
  Droplet,
  GlassWater,
  Package,
  Wrench,
  Shirt,
} from "lucide-react";

const getCategoryStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case "coffee":
      return {
        bg: "bg-gradient-to-br from-[#2b1810] via-[#48281d] to-[#1e100a]",
        orb: "bg-amber-500/25",
        iconColor: "text-amber-200",
        accentBorder: "border-amber-700/35",
        label: "Premium Blend",
        icon: Coffee,
      };
    case "syrups":
      return {
        bg: "bg-gradient-to-br from-[#451a03] via-[#7c2d12] to-[#290c00]",
        orb: "bg-orange-500/20",
        iconColor: "text-orange-300",
        accentBorder: "border-orange-700/30",
        label: "Elixir / Syrup",
        icon: Droplet,
      };
    case "milks":
      return {
        bg: "bg-gradient-to-br from-[#062f4f] via-[#09416e] to-[#031b2e]",
        orb: "bg-sky-400/25",
        iconColor: "text-sky-200",
        accentBorder: "border-sky-800/30",
        label: "Barista Dairy",
        icon: GlassWater,
      };
    case "packaging":
      return {
        bg: "bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#022c22]",
        orb: "bg-emerald-500/20",
        iconColor: "text-emerald-300",
        accentBorder: "border-emerald-700/30",
        label: "Eco-Friendly",
        icon: Package,
      };
    case "accessories":
      return {
        bg: "bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a]",
        orb: "bg-slate-400/20",
        iconColor: "text-slate-200",
        accentBorder: "border-slate-700/35",
        label: "Heavy Equipment",
        icon: Wrench,
      };
    case "apparel":
      return {
        bg: "bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#09090b]",
        orb: "bg-zinc-500/15",
        iconColor: "text-zinc-300",
        accentBorder: "border-zinc-700/30",
        label: "Official Gear",
        icon: Shirt,
      };
    default:
      return {
        bg: "bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#0c0a09]",
        orb: "bg-stone-500/15",
        iconColor: "text-stone-300",
        accentBorder: "border-stone-700/30",
        label: "Standard Stock",
        icon: Package,
      };
  }
};

export default function ProductsTab() {
  const { products, updateProduct } = useBusinessState();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search and Categories bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 order-2 md:order-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-600 transition-all duration-200 border ${
                selectedCategory === cat
                  ? "bg-[image:var(--gradient-primary)] text-primary-foreground border-transparent shadow-glow"
                  : "text-muted-foreground bg-secondary/30 hover:bg-secondary/60 hover:text-foreground border-border/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 order-1 md:order-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-secondary/40 py-2 pl-9 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground transition-all focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground glass rounded-3xl border border-border/40">
            No products match the search query.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isOutOfStock = p.stock === 0;
            const isLowStock = p.stock > 0 && p.stock <= 10;
            const styles = getCategoryStyles(p.category);
            const IconComponent = styles.icon;

            return (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/30 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-card/50 hover:shadow-card flex flex-col justify-between"
              >
                <div>
                  {/* Product Premium Gradient Header */}
                  <div className={`relative aspect-square w-full overflow-hidden rounded-2xl ${styles.bg} flex flex-col items-center justify-center border ${styles.accentBorder} mb-3 group-hover:scale-[1.01] transition-all duration-300 shadow-inner`}>
                    {/* Glowing ambient orb behind the icon */}
                    <div className={`absolute size-24 rounded-full ${styles.orb} blur-xl group-hover:scale-125 transition-transform duration-500`} />
                    
                    {/* Premium patterned overlays */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))]" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:12px_12px]" />

                    {/* Dynamic Category Icon */}
                    <IconComponent className={`size-16 stroke-[1.15] ${styles.iconColor} group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 z-10 filter drop-shadow-md`} />
                    
                    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 font-mono text-[9px] text-white/90 border border-white/10 uppercase font-600 tracking-wider">
                      {styles.label}
                    </span>

                    <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 font-mono text-[9px] text-white/70 border border-white/5 uppercase font-600">
                      {p.category}
                    </span>

                    {p.onRateList && (
                      <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[9px] font-800 border border-primary/20 shadow-lg z-20">
                        ✓ RATE LIST
                      </span>
                    )}

                    {isOutOfStock ? (
                      <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex flex-col items-center justify-center text-rose-400 font-display font-700 text-xs tracking-widest z-20">
                        <AlertTriangle className="size-5 mb-1 text-rose-400 animate-bounce" />
                        OUT OF STOCK
                      </div>
                    ) : isLowStock ? (
                      <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-amber-500 text-black px-2.5 py-0.5 text-[9px] font-800 animate-pulse border border-amber-400/50 shadow-lg z-20">
                        <AlertTriangle className="size-3" /> LOW STOCK
                      </span>
                    ) : null}
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 px-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-display font-700 text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                    </div>

                    <p className="font-mono text-xs font-600 text-muted-foreground">{p.sku}</p>

                    <p className="text-xs text-muted-foreground/80 line-clamp-2 h-8 leading-relaxed">
                      {p.description || "Premium operational stock item optimized for quality execution."}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-3">
                  <div className="flex items-end justify-between border-t border-border/40 pt-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">Selling Price</p>
                      <p className="font-mono font-700 text-base text-foreground">₹{p.price.toLocaleString("en-IN")}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">Availability</p>
                      <p className={`font-mono text-xs font-700 ${isOutOfStock ? "text-rose-400" : isLowStock ? "text-amber-400" : "text-emerald-400"}`}>
                        {p.stock} {p.unit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover overlay details button */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/90 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 flex flex-col gap-2.5 z-30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-600">
                      <ShieldCheck className="size-3.5" /> GST Compliant ({p.gstRate}%)
                    </span>
                    <span className="text-[10px] text-white/95 font-mono">
                      HSN: {p.hsn}
                    </span>
                  </div>

                  {/* Toggle Rate List Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateProduct(p.id, { onRateList: !p.onRateList });
                      toast.success(p.onRateList ? `Removed ${p.name} from Rate List` : `Added ${p.name} to Rate List`);
                    }}
                    className={`w-full rounded-xl py-1.5 text-center text-[10px] font-700 transition-all uppercase tracking-wider cursor-pointer ${
                      p.onRateList 
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30" 
                        : "bg-primary text-primary-foreground hover:scale-[1.03] border border-primary/20 shadow-md"
                    }`}
                  >
                    {p.onRateList ? "✓ On Rate List" : "+ Add to Rate List"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

