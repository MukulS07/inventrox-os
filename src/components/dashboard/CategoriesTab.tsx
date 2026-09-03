import { useBusinessState } from "@/hooks/use-business-state";
import { Tags, BarChart3, DollarSign } from "lucide-react";

export default function CategoriesTab() {
  const { products } = useBusinessState();

  // Aggregate stats by category
  const categoryStats: {
    [key: string]: {
      name: string;
      itemCount: number;
      totalStock: number;
      assetValue: number;
    };
  } = {};

  products.forEach((p) => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = {
        name: p.category,
        itemCount: 0,
        totalStock: 0,
        assetValue: 0,
      };
    }
    categoryStats[p.category].itemCount += 1;
    categoryStats[p.category].totalStock += p.stock;
    categoryStats[p.category].assetValue += p.stock * p.cost;
  });

  const categoryList = Object.values(categoryStats);

  // Total valuation
  const totalValuation = categoryList.reduce((acc, curr) => acc + curr.assetValue, 0);
  const totalItems = products.reduce((acc, curr) => acc + curr.stock, 0);

  // Donut chart calculations & styling mappings
  let accumulatedPercent = 0;
  const donutSlices = categoryList.map((cat, idx) => {
    const percent = totalValuation > 0 ? (cat.assetValue / totalValuation) * 100 : 0;
    const strokeDashArray = `${percent} ${100 - percent}`;
    const strokeDashOffset = 100 - accumulatedPercent;
    accumulatedPercent += percent;

    const colors = [
      "stroke-amber-500", // Coffee
      "stroke-orange-500", // Syrups
      "stroke-sky-500", // Milks
      "stroke-emerald-500", // Packaging
      "stroke-slate-400", // Accessories
      "stroke-zinc-500", // Apparel
    ];
    const fillColors = [
      "bg-amber-500",
      "bg-orange-500",
      "bg-sky-500",
      "bg-emerald-500",
      "bg-slate-400",
      "bg-zinc-500",
    ];
    const bgColors = [
      "bg-amber-500/10",
      "bg-orange-500/10",
      "bg-sky-500/10",
      "bg-emerald-500/10",
      "bg-slate-400/10",
      "bg-zinc-500/10",
    ];

    return {
      ...cat,
      percent,
      strokeDashArray,
      strokeDashOffset,
      color: colors[idx % colors.length],
      bgColor: bgColors[idx % bgColors.length],
      fillColor: fillColors[idx % fillColors.length],
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview & Donut Chart Strip */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Statistics cards */}
        <div className="md:col-span-2 grid gap-4 sm:grid-cols-3">
          <div className="glass rounded-2xl p-5 flex flex-col justify-between border border-border/30">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <DollarSign className="size-5" />
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">Total Asset Value</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-700 mt-4 text-foreground">₹{totalValuation.toLocaleString("en-IN")}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Valued at wholesale cost price</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 flex flex-col justify-between border border-border/30">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                <BarChart3 className="size-5" />
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">Total Stock Count</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-700 mt-4 text-foreground">{totalItems.toLocaleString("en-IN")}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Total physical items in stock</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 flex flex-col justify-between border border-border/30">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Tags className="size-5" />
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">Category Count</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-700 mt-4 text-foreground">{categoryList.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Active categories registered</p>
            </div>
          </div>
        </div>

        {/* Donut Chart container */}
        <div className="glass rounded-3xl p-5 flex flex-col items-center justify-center border border-border/40 min-h-[180px]">
          <div className="relative size-32 flex items-center justify-center">
            {totalValuation === 0 ? (
              <p className="text-xs text-muted-foreground text-center">No asset stock</p>
            ) : (
              <>
                <svg viewBox="0 0 36 36" className="size-full rotate-[-90deg]">
                  {/* Background Track */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="3.2" />
                  
                  {/* Slices */}
                  {donutSlices.map((slice, idx) => {
                    const accumulated = donutSlices.slice(0, idx).reduce((sum, s) => sum + s.percent, 0);
                    return (
                      <circle
                        key={slice.name}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        className={`transition-all duration-500 ${slice.color} hover:stroke-[4] cursor-pointer`}
                        strokeWidth="2.8"
                        strokeDasharray={`${slice.percent} ${100 - slice.percent}`}
                        strokeDashoffset={100 - accumulated}
                      />
                    );
                  })}
                </svg>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider font-600">Total Net</p>
                  <p className="font-mono text-sm font-700 text-foreground">₹{Math.round(totalValuation / 1000)}k</p>
                </div>
              </>
            )}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center mt-3 text-[9px] max-w-full">
            {donutSlices.map((slice) => (
              <span key={slice.name} className="flex items-center gap-1 shrink-0">
                <span className={`size-1.5 rounded-full ${slice.fillColor}`} />
                <span className="text-muted-foreground">{slice.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {donutSlices.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground glass rounded-3xl border border-border">
            No categories registered. Register catalog items to categorize.
          </div>
        ) : (
          donutSlices.map((cat) => {
            const stockShare = totalItems > 0 ? Math.round((cat.totalStock / totalItems) * 100) : 0;
            return (
              <div
                key={cat.name}
                className="glass rounded-3xl p-5 space-y-4 hover:border-primary/30 transition-all duration-300 hover:shadow-card group relative overflow-hidden"
              >
                {/* Category accent blur light */}
                <div className={`absolute -right-6 -top-6 size-16 rounded-full ${cat.bgColor} blur-2xl opacity-40 group-hover:scale-150 transition-transform duration-500`} />

                <div className="flex items-center justify-between">
                  <h3 className="font-display font-700 text-base text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  <span className="text-[10px] font-700 bg-secondary/80 px-2.5 py-0.5 rounded-full border border-border/60">
                    {cat.itemCount} SKUs
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-1 border-y border-border/40">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-600">Stock volume</p>
                    <p className="font-mono font-700 text-sm mt-0.5 text-foreground">{cat.totalStock} units</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-600">Valuation (Cost)</p>
                    <p className="font-mono font-700 text-sm mt-0.5 text-foreground">₹{cat.assetValue.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                {/* Progress bar representing valuation share */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span>Valuation Share</span>
                    <span className="font-600 text-foreground">{cat.percent.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.fillColor} rounded-full transition-all duration-500`}
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>

                {/* Progress bar representing stock volume share */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span>Stock Volume Share</span>
                    <span className="font-600 text-foreground">{stockShare}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent-foreground rounded-full transition-all duration-500"
                      style={{ width: `${stockShare}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
