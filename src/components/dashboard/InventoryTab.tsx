import { useState, useEffect } from "react";
import { useBusinessState, Product } from "@/hooks/use-business-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  PlusCircle,
  MinusCircle,
  Trash2,
  Edit2,
  X,
  Truck,
  Boxes,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function InventoryTab() {
  const {
    products,
    suppliers,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    reorderFromSupplier,
  } = useBusinessState();

  const [activeSubView, setActiveSubView] = useState<"ledger" | "intake">("ledger");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Slide-over drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Product Form state
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formCategory, setFormCategory] = useState("Coffee");
  const [formCost, setFormCost] = useState(0);
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formGst, setFormGst] = useState(18);
  const [formHsn, setFormHsn] = useState("");
  const [formUnit, setFormUnit] = useState("pcs");
  const [formSupplier, setFormSupplier] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Stock Intake flow state
  const [intakeStep, setIntakeStep] = useState(1);
  const [intakeSupplierId, setIntakeSupplierId] = useState("");
  const [intakeRows, setIntakeRows] = useState<{ productId: string; quantity: number }[]>([]);

  // Listen for preselected restock supplier from other tabs
  useEffect(() => {
    const preselected = localStorage.getItem("preselected_restock_supplier");
    if (preselected && suppliers.length > 0) {
      const supplier = suppliers.find((s) => s.name === preselected || s.id === preselected);
      if (supplier) {
        setActiveSubView("intake");
        setIntakeSupplierId(supplier.id);
        setIntakeStep(2); // Jump directly to step 2: configure items
        // Initialize rows with first product or low stock products supplied by this supplier
        const supplierProducts = products.filter((p) => p.supplier === supplier.name);
        const lowStockSupplierProducts = supplierProducts.filter((p) => p.stock <= 10);
        
        const initialRows = lowStockSupplierProducts.length > 0 
          ? lowStockSupplierProducts.map(p => ({ productId: p.id, quantity: 15 }))
          : [{ productId: products[0]?.id || "", quantity: 15 }];
          
        setIntakeRows(initialRows);
      }
      localStorage.removeItem("preselected_restock_supplier");
    }
  }, [products, suppliers]);

  // Unique categories
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "In Stock" && p.stock > 10) ||
      (statusFilter === "Low Stock" && p.stock > 0 && p.stock <= 10) ||
      (statusFilter === "Out of Stock" && p.stock === 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenCreateDrawer = () => {
    setDrawerMode("create");
    setFormName("");
    setFormSku(`SKU-${Date.now().toString().slice(-6)}`);
    setFormCategory("Coffee");
    setFormCost(0);
    setFormPrice(0);
    setFormStock(0);
    setFormGst(18);
    setFormHsn("");
    setFormUnit("pcs");
    setFormSupplier(suppliers[0]?.name || "");
    setFormDescription("");
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (p: Product) => {
    setDrawerMode("edit");
    setSelectedProductId(p.id);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCategory(p.category);
    setFormCost(p.cost);
    setFormPrice(p.price);
    setFormStock(p.stock);
    setFormGst(p.gstRate);
    setFormHsn(p.hsn);
    setFormUnit(p.unit);
    setFormSupplier(p.supplier);
    setFormDescription(p.description);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerMode === "create") {
      addProduct({
        sku: formSku,
        name: formName,
        category: formCategory,
        cost: Number(formCost),
        price: Number(formPrice),
        stock: Number(formStock),
        gstRate: Number(formGst),
        hsn: formHsn,
        unit: formUnit,
        imageUrl: "",
        description: formDescription,
        supplier: formSupplier,
      });
    } else if (drawerMode === "edit" && selectedProductId) {
      updateProduct(selectedProductId, {
        sku: formSku,
        name: formName,
        category: formCategory,
        cost: Number(formCost),
        price: Number(formPrice),
        stock: Number(formStock),
        gstRate: Number(formGst),
        hsn: formHsn,
        unit: formUnit,
        description: formDescription,
        supplier: formSupplier,
      });
    }
    setIsDrawerOpen(false);
  };

  // Stock Intake helpers
  const handleStartIntake = () => {
    setIntakeStep(1);
    setIntakeSupplierId(suppliers[0]?.id || "");
    setIntakeRows([{ productId: products[0]?.id || "", quantity: 10 }]);
    setActiveSubView("intake");
  };

  const handleAddIntakeRow = () => {
    setIntakeRows([...intakeRows, { productId: products[0]?.id || "", quantity: 10 }]);
  };

  const handleRemoveIntakeRow = (idx: number) => {
    setIntakeRows(intakeRows.filter((_, i) => i !== idx));
  };

  const handleIntakeConfirm = () => {
    // Process items in context
    const items = intakeRows.map((row) => ({
      productId: row.productId,
      quantity: row.quantity,
    }));
    reorderFromSupplier(intakeSupplierId, items);
    setActiveSubView("ledger");
  };

  const selectedSupplier = suppliers.find((s) => s.id === intakeSupplierId);

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 rounded-full border border-border bg-secondary/40 p-1">
          <button
            onClick={() => setActiveSubView("ledger")}
            className={`rounded-full px-4 py-1.5 text-xs font-600 transition-colors ${
              activeSubView === "ledger"
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Catalog Ledger
          </button>
          <button
            onClick={handleStartIntake}
            className={`rounded-full px-4 py-1.5 text-xs font-600 transition-colors ${
              activeSubView === "intake"
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Stock Intake Intake
          </button>
        </div>

        {activeSubView === "ledger" && (
          <button
            id="add-product-btn"
            onClick={handleOpenCreateDrawer}
            className="flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-4 py-2 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
          >
            <Plus className="size-4" /> Add Product
          </button>
        )}
      </div>

      {activeSubView === "ledger" ? (
        <div className="space-y-4">
          {/* Quick-Filter Overview Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => setStatusFilter("All")}
              className={`glass rounded-2xl p-4 text-left border transition-all duration-300 ${
                statusFilter === "All"
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "hover:border-border/80 hover:bg-secondary/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">Total SKUs</span>
                <span className="p-1.5 rounded-lg bg-secondary text-foreground"><Boxes className="size-4" /></span>
              </div>
              <p className="font-mono text-2xl font-700 mt-2">{products.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Clear all status filters</p>
            </button>

            <button
              onClick={() => setStatusFilter("In Stock")}
              className={`glass rounded-2xl p-4 text-left border transition-all duration-300 ${
                statusFilter === "In Stock"
                  ? "border-emerald-500/50 bg-emerald-500/5 shadow-glow"
                  : "hover:border-border/80 hover:bg-secondary/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">In Stock</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><span className="size-2 rounded-full bg-emerald-400 inline-block" /></span>
              </div>
              <p className="font-mono text-2xl font-700 mt-2 text-emerald-400">{products.filter((p) => p.stock > 10).length}</p>
              <p className="text-[10px] text-emerald-500/70 mt-1">Healthy stock level (&gt;10)</p>
            </button>

            <button
              onClick={() => setStatusFilter("Low Stock")}
              className={`glass rounded-2xl p-4 text-left border transition-all duration-300 ${
                statusFilter === "Low Stock"
                  ? "border-amber-500/50 bg-amber-500/5 shadow-glow"
                  : "hover:border-border/80 hover:bg-secondary/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">Low Stock</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><span className="size-2 rounded-full bg-amber-400 inline-block animate-pulse" /></span>
              </div>
              <p className="font-mono text-2xl font-700 mt-2 text-amber-400">{products.filter((p) => p.stock > 0 && p.stock <= 10).length}</p>
              <p className="text-[10px] text-amber-500/70 mt-1">Reorder suggested (1-10)</p>
            </button>

            <button
              onClick={() => setStatusFilter("Out of Stock")}
              className={`glass rounded-2xl p-4 text-left border transition-all duration-300 ${
                statusFilter === "Out of Stock"
                  ? "border-rose-500/50 bg-rose-500/5 shadow-glow"
                  : "hover:border-border/80 hover:bg-secondary/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-600">Out of Stock</span>
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"><span className="size-2 rounded-full bg-rose-400 inline-block" /></span>
              </div>
              <p className="font-mono text-2xl font-700 mt-2 text-rose-400">{products.filter((p) => p.stock === 0).length}</p>
              <p className="text-[10px] text-rose-500/70 mt-1">Requires urgent intake (0)</p>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search SKU or Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-9 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground transition-all focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
              <Filter className="size-3.5 shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-foreground cursor-pointer animate-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-card">
                    {c} Category
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
              <Boxes className="size-3.5 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-foreground cursor-pointer"
              >
                <option value="All" className="bg-card">All Stock Levels</option>
                <option value="In Stock" className="bg-card">In Stock (&gt;10)</option>
                <option value="Low Stock" className="bg-card">Low Stock (1-10)</option>
                <option value="Out of Stock" className="bg-card">Out of Stock (0)</option>
              </select>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin max-w-full">
            {categories.map((c) => {
              const count = c === "All" 
                ? products.length 
                : products.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`rounded-full px-3 py-1 text-xs font-600 border shrink-0 transition-all ${
                    categoryFilter === c
                      ? "bg-[image:var(--gradient-primary)] text-primary-foreground border-transparent shadow-glow"
                      : "text-muted-foreground bg-secondary/35 hover:bg-secondary/60 hover:text-foreground border-border/40"
                  }`}
                >
                  {c} <span className="opacity-60 text-[10px] ml-0.5">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Catalog Table */}
          <div className="glass rounded-3xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-muted-foreground uppercase tracking-widest text-[9px] font-600">
                    <th className="px-5 py-4">SKU</th>
                    <th className="px-5 py-4">Product Name</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4 text-center">Stock Level</th>
                    <th className="px-5 py-4 text-right">Cost Price</th>
                    <th className="px-5 py-4 text-right">Selling Price</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8">
                        <EmptyState
                          title="No Products Match"
                          description="We couldn't find any products matching your search or filters. Reset filters or create a new catalog product."
                          illustration="package"
                          actionText="Add Product"
                          onAction={handleOpenCreateDrawer}
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      // stock indicators
                      const status =
                        p.stock === 0
                          ? { label: "Out of Stock", class: "bg-rose-500/10 text-rose-400 border-rose-500/20", dot: "bg-rose-400" }
                          : p.stock <= 10
                          ? { label: "Low Stock", class: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" }
                          : { label: "In Stock", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" };

                      return (
                        <tr key={p.id} className="transition-colors hover:bg-secondary/20">
                          <td className="px-5 py-4 font-mono font-600 text-muted-foreground">{p.sku}</td>
                          <td className="px-5 py-4 font-600 text-foreground">{p.name}</td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 font-medium border border-border text-[10px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  if (p.stock > 0) {
                                    updateProduct(p.id, { stock: p.stock - 1 });
                                  }
                                }}
                                disabled={p.stock === 0}
                                className="p-1 rounded-md border border-border/60 bg-secondary/40 hover:bg-secondary hover:text-rose-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Decrease stock"
                              >
                                <MinusCircle className="size-3.5" />
                              </button>
                              <span className="font-mono font-700 text-xs min-w-[50px] text-center text-foreground">
                                {p.stock} <span className="text-[9px] text-muted-foreground font-normal uppercase">{p.unit}</span>
                              </span>
                              <button
                                onClick={() => {
                                  updateProduct(p.id, { stock: p.stock + 1 });
                                }}
                                className="p-1 rounded-md border border-border/60 bg-secondary/40 hover:bg-secondary hover:text-emerald-400 transition-colors"
                                title="Increase stock"
                              >
                                <PlusCircle className="size-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right font-mono">₹{p.cost.toLocaleString("en-IN")}</td>
                          <td className="px-5 py-4 text-right font-mono font-600">₹{p.price.toLocaleString("en-IN")}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-500 ${status.class}`}>
                              <span className={`size-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditDrawer(p)}
                                className="grid size-8 place-items-center rounded-lg border border-border hover:bg-secondary hover:text-foreground text-muted-foreground transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="size-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="grid size-8 place-items-center rounded-lg border border-border hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Stock Intake Step form */
        <div className="glass rounded-3xl p-6 max-w-3xl mx-auto border border-border">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-display font-700 flex items-center gap-2">
              <Truck className="size-5 text-accent animate-pulse" /> Supplier Reorder Ledger
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span className={intakeStep >= 1 ? "text-accent font-700" : ""}>Select Supplier</span>
              <ChevronRight className="size-3" />
              <span className={intakeStep >= 2 ? "text-accent font-700" : ""}>Configure Items</span>
              <ChevronRight className="size-3" />
              <span className={intakeStep === 3 ? "text-accent font-700" : ""}>Confirmation</span>
            </div>
          </div>

          {/* STEP 1: SELECT SUPPLIER */}
          {intakeStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <p className="text-xs text-muted-foreground">Select the commercial supplier roster to request incoming restock items.</p>
              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-2">Supplier Roster</label>
                <select
                  value={intakeSupplierId}
                  onChange={(e) => setIntakeSupplierId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-3 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id} className="bg-card">
                      {s.name} ({s.phone})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIntakeStep(2)}
                  className="flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
                >
                  Continue <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIGURE ITEMS */}
          {intakeStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <p className="text-xs text-muted-foreground">Add reorder items and specify incoming unit quantities from <span className="font-600 text-foreground">{selectedSupplier?.name}</span>.</p>
              
              <div className="space-y-3">
                {intakeRows.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    {/* Select Product */}
                    <div className="flex-1">
                      <select
                        value={row.productId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setIntakeRows(intakeRows.map((r, i) => i === idx ? { ...r, productId: val } : r));
                        }}
                        className="w-full rounded-xl border border-border bg-secondary/40 p-3 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id} className="bg-card">
                            {p.name} (Current stock: {p.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity Spinner */}
                    <div className="flex items-center border border-border bg-secondary/40 rounded-xl px-2">
                      <button
                        onClick={() => {
                          const val = Math.max(1, row.quantity - 5);
                          setIntakeRows(intakeRows.map((r, i) => i === idx ? { ...r, quantity: val } : r));
                        }}
                        className="p-1 hover:text-accent transition-colors"
                      >
                        <MinusCircle className="size-4" />
                      </button>
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          setIntakeRows(intakeRows.map((r, i) => i === idx ? { ...r, quantity: val } : r));
                        }}
                        className="w-12 bg-transparent border-0 text-center font-mono font-600 text-xs focus:ring-0"
                      />
                      <button
                        onClick={() => {
                          const val = row.quantity + 5;
                          setIntakeRows(intakeRows.map((r, i) => i === idx ? { ...r, quantity: val } : r));
                        }}
                        className="p-1 hover:text-accent transition-colors"
                      >
                        <PlusCircle className="size-4" />
                      </button>
                    </div>

                    {/* Delete row */}
                    {intakeRows.length > 1 && (
                      <button
                        onClick={() => handleRemoveIntakeRow(idx)}
                        className="p-2 border border-border rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddIntakeRow}
                className="flex items-center gap-1.5 text-xs text-accent hover:underline font-600 mt-2"
              >
                <Plus className="size-4" /> Add another item
              </button>

              <div className="flex justify-between pt-6 border-t border-border/40">
                <button
                  onClick={() => setIntakeStep(1)}
                  className="rounded-full border border-border bg-secondary/40 px-5 py-2.5 text-xs font-600 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setIntakeStep(3)}
                  className="flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
                >
                  Review Order <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY CONFIRMATION */}
          {intakeStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <p className="text-xs text-muted-foreground">Please confirm the following incoming stock intake quantities. Stock records will adjust on execution.</p>

              <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border bg-secondary/10">
                <div className="p-3 bg-secondary/30 grid grid-cols-3 text-[10px] font-600 uppercase tracking-widest text-muted-foreground">
                  <span>Product</span>
                  <span className="text-center">Intake Units</span>
                  <span className="text-right">Projected Value</span>
                </div>
                {intakeRows.map((row, idx) => {
                  const prod = products.find((p) => p.id === row.productId);
                  const totalCost = prod ? prod.cost * row.quantity : 0;
                  return (
                    <div key={idx} className="p-3 grid grid-cols-3 text-xs font-500">
                      <span className="truncate text-foreground font-600">{prod?.name}</span>
                      <span className="text-center font-mono font-600">+{row.quantity} {prod?.unit}</span>
                      <span className="text-right font-mono text-muted-foreground">₹{totalCost.toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-6 border-t border-border/40">
                <button
                  onClick={() => setIntakeStep(2)}
                  className="rounded-full border border-border bg-secondary/40 px-5 py-2.5 text-xs font-600 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleIntakeConfirm}
                  className="flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-6 py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
                >
                  <TrendingUp className="size-4" /> Confirm & Execute
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-over Drawer Panel */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 h-full w-[420px] max-w-full border-l border-border bg-card shadow-card flex flex-col animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-secondary/10">
              <h3 className="font-display font-700 text-base text-foreground">
                {drawerMode === "create" ? "Add Product" : "Edit Product Options"}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">SKU</label>
                <input
                  required
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Product Name</label>
                <input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
                  >
                    <option value="Coffee" className="bg-card">Coffee</option>
                    <option value="Syrups" className="bg-card">Syrups</option>
                    <option value="Milks" className="bg-card">Milks</option>
                    <option value="Packaging" className="bg-card">Packaging</option>
                    <option value="Accessories" className="bg-card">Accessories</option>
                    <option value="Apparel" className="bg-card">Apparel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Unit</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
                  >
                    <option value="pcs" className="bg-card">pcs (Units)</option>
                    <option value="kg" className="bg-card">kg (Kilogram)</option>
                    <option value="L" className="bg-card">L (Litre)</option>
                    <option value="box" className="bg-card">box (Bundle)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Cost Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={formCost}
                    onChange={(e) => setFormCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Stock Level</label>
                  <input
                    required
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">GST Rate (%)</label>
                  <select
                    value={formGst}
                    onChange={(e) => setFormGst(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
                  >
                    <option value={0} className="bg-card">0% Exempt</option>
                    <option value={5} className="bg-card">5% GST</option>
                    <option value={12} className="bg-card">12% GST</option>
                    <option value={18} className="bg-card">18% GST</option>
                    <option value={28} className="bg-card">28% GST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">HSN Code</label>
                  <input
                    required
                    placeholder="e.g. 0901"
                    value={formHsn}
                    onChange={(e) => setFormHsn(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Default Supplier</label>
                <select
                  value={formSupplier}
                  onChange={(e) => setFormSupplier(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name} className="bg-card">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
                <textarea
                  placeholder="Enter details..."
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
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
                  {drawerMode === "create" ? "Add Item" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
