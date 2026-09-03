import { useState } from "react";
import { useBusinessState, Customer } from "@/hooks/use-business-state";
import { Search, Plus, Phone, Mail, MapPin, Award, Trash2, Calendar, FileText, ArrowLeft, X, Users, Crown, Smile, UserCheck, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function CustomersTab() {
  const { customers, sales, services, customerNotes, addCustomer, addCustomerNote, deleteCustomerNote } = useBusinessState();
  const [search, setSearch] = useState("");
  const [activeSegment, setActiveSegment] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust = addCustomer({
      name,
      phone,
      email,
      address,
      gstin,
      segment: "New",
    });
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setGstin("");
    setIsDrawerOpen(false);

    // Auto open newly created customer
    setSelectedCustomer(newCust);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesSegment = activeSegment === "All" || c.segment === activeSegment;
    return matchesSearch && matchesSegment;
  });

  // Get customer sales and services
  const customerSales = selectedCustomer ? sales.filter((s) => s.customerId === selectedCustomer.id) : [];
  const customerServices = selectedCustomer ? services.filter((s) => s.customerId === selectedCustomer.id) : [];

  if (selectedCustomer) {
    const chronologicalSales = [...customerSales].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let runningTotal = 0;
    const ltvPoints = chronologicalSales.length > 0
      ? [0, ...chronologicalSales.map((sale) => {
          runningTotal += sale.total;
          return runningTotal;
        })]
      : [0, selectedCustomer.ltv];

    const generateSparklinePath = (points: number[], width: number, height: number) => {
      if (points.length === 0) return "";
      const max = Math.max(...points, 1);
      const min = Math.min(...points, 0);
      const range = max - min || 1;
      
      return points.map((p, idx) => {
        const x = (idx / (points.length - 1 || 1)) * width;
        const y = height - ((p - min) / range) * (height - 16) - 8;
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(" ");
    };

    const sparklineD = generateSparklinePath(ltvPoints, 500, 100);

    const currentNotes = customerNotes.filter(n => n.customerId === selectedCustomer.id);

    const timelineItems = [
      ...customerSales.map(s => ({
        id: s.id,
        type: "sale",
        title: `Invoice ${s.invoiceNumber} Generated`,
        description: `Billed ₹${s.total.toLocaleString("en-IN")} via ${s.paymentMethod}.`,
        date: s.date,
      })),
      ...customerServices.map(srv => ({
        id: srv.id,
        type: "service",
        title: `${srv.serviceType} (${srv.status})`,
        description: srv.notes || `Scheduled appointment due on ${srv.nextDueDate}.`,
        date: srv.serviceDate ? `${srv.serviceDate}T12:00:00Z` : new Date().toISOString(),
      })),
      ...currentNotes.map(n => ({
        id: n.id,
        type: "note",
        title: `Operator Note by ${n.author}`,
        description: n.content,
        date: n.date,
        deletable: true,
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleLogNoteSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!noteText.trim()) return;
      addCustomerNote(selectedCustomer.id, noteText);
      setNoteText("");
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedCustomer(null)}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground bg-secondary/40 border border-border/60 rounded-full px-4 py-2 transition-all"
        >
          <ArrowLeft className="size-4" /> Back to Customers
        </button>

        {/* Profile Card Header */}
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-2xl font-700 text-primary-foreground shadow-glow">
                {selectedCustomer.name.split(" ").map(n => n[0]).join("")}
              </span>
              <div>
                <h2 className="text-xl font-display font-700 text-foreground flex items-center gap-2">
                  {selectedCustomer.name}
                  {selectedCustomer.segment === "VIP" && (
                    <Award className="size-5 text-amber-400 fill-amber-400" />
                  )}
                </h2>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-600 border mt-1.5 ${
                  selectedCustomer.segment === "VIP" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  selectedCustomer.segment === "Regular" ? "bg-primary/10 text-primary border-primary/20" :
                  selectedCustomer.segment === "New" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  "bg-secondary text-muted-foreground border-border"
                }`}>
                  {selectedCustomer.segment} Client
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-accent" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-accent" />
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="size-3.5 text-accent mt-0.5" />
                <span className="max-w-[200px]">{selectedCustomer.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lifetime Value</p>
            <p className="font-mono text-xl font-700 mt-1">₹{selectedCustomer.ltv.toLocaleString("en-IN")}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Orders Placed</p>
            <p className="font-mono text-xl font-700 mt-1">{selectedCustomer.ordersCount} sales</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Average Order</p>
            <p className="font-mono text-xl font-700 mt-1">₹{selectedCustomer.avgOrderValue.toLocaleString("en-IN")}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Visit</p>
            <p className="font-mono text-xl font-700 mt-1">
              {selectedCustomer.daysSinceLastVisit === 0 ? "Today" : `${selectedCustomer.daysSinceLastVisit}d ago`}
            </p>
          </div>
        </div>

        {/* LTV Value Accrual Sparkline Card */}
        <div className="glass rounded-3xl p-5 space-y-4 border border-border/60 bg-card/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-600 uppercase tracking-widest text-muted-foreground">LTV Value Accrual Curve</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Cumulative customer revenue contribution over time</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono text-emerald-400">
                ₹{selectedCustomer.ltv.toLocaleString("en-IN")}
              </span>
              <p className="text-[9px] text-muted-foreground font-medium">Total Contribution</p>
            </div>
          </div>
          <div className="h-28 w-full relative pt-2">
            <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`sparkline-grad-${selectedCustomer.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Glowing Area under line */}
              {sparklineD && (
                <path
                  d={`${sparklineD} L 500 100 L 0 100 Z`}
                  fill={`url(#sparkline-grad-${selectedCustomer.id})`}
                />
              )}
              {/* Stroke line */}
              {sparklineD && (
                <path
                  d={sparklineD}
                  fill="none"
                  stroke="rgb(99, 102, 241)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Interactive points */}
              {ltvPoints.map((val, idx) => {
                const x = (idx / (ltvPoints.length - 1 || 1)) * 500;
                const minVal = Math.min(...ltvPoints, 0);
                const maxVal = Math.max(...ltvPoints, 1);
                const y = 100 - ((val - minVal) / (maxVal - minVal || 1)) * 84 - 8;
                return (
                  <g key={idx} className="group/dot">
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      className="fill-card stroke-[rgb(99,102,241)] stroke-[2px] transition-all cursor-pointer hover:r-6"
                    />
                    <title>{`Total contribution at step ${idx}: ₹${val.toLocaleString("en-IN")}`}</title>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start animate-in fade-in duration-250">
          {/* LEFT COLUMN: Notes Logger & Activity Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Notes Form */}
            <div className="glass rounded-3xl p-5 border border-border bg-card/10">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
                <MessageSquare className="size-4 text-accent animate-pulse" />
                <h3 className="font-display font-700 text-xs uppercase tracking-wider">Log Client Interaction</h3>
              </div>
              <form onSubmit={handleLogNoteSubmit} className="space-y-3">
                <textarea
                  placeholder="Record summary of contact, wholesale request, follow-up notes..."
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-3 text-xs outline-none focus:border-primary/50 text-foreground"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-4 py-2 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Plus className="size-4" /> Save Note
                  </button>
                </div>
              </form>
            </div>

            {/* Activity Timeline */}
            <div className="glass rounded-3xl p-5 border border-border bg-card/10">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
                <Smile className="size-4 text-accent animate-pulse" />
                <h3 className="font-display font-700 text-xs uppercase tracking-wider">Chronological History</h3>
              </div>
              <div className="relative border-l border-border/60 pl-6 ml-3 space-y-6 py-2">
                {timelineItems.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground -ml-6">
                    No activities logged for this customer.
                  </div>
                ) : (
                  timelineItems.map((item) => {
                    let Icon = MessageSquare;
                    let colorClass = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
                    if (item.type === "sale") {
                      Icon = FileText;
                      colorClass = "text-primary border-primary/30 bg-primary/10";
                    } else if (item.type === "service") {
                      Icon = Calendar;
                      colorClass = "text-accent border-accent/30 bg-accent/10";
                    }

                    return (
                      <div key={item.id} className="relative group animate-in fade-in slide-in-from-left-2 duration-200">
                        {/* Timeline Node Badge */}
                        <span className={`absolute -left-9.5 top-0.5 grid size-7 place-items-center rounded-full border text-foreground ${colorClass}`}>
                          <Icon className="size-3.5" />
                        </span>

                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-600 text-xs text-foreground">{item.title}</h4>
                              <span className="text-[9px] text-muted-foreground font-mono bg-secondary/60 px-1.5 py-0.5 rounded">
                                {new Date(item.date).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {item.description}
                            </p>
                          </div>

                          {item.deletable && (
                            <button
                              onClick={() => deleteCustomerNote(item.id)}
                              className="text-muted-foreground hover:text-rose-400 p-1 rounded-lg hover:bg-secondary/40 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Delete note"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Table logs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Purchase History */}
            <div className="glass rounded-3xl p-5 border border-border">
              <h3 className="text-sm font-600 uppercase tracking-widest text-muted-foreground mb-4">Invoice history</h3>
              {customerSales.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No orders recorded yet. Checkout through POS to record sales.
                </div>
              ) : (
                <div className="space-y-3">
                  {customerSales.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/40 hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-xl bg-secondary text-accent">
                          <FileText className="size-4.5" />
                        </span>
                        <div>
                          <p className="text-xs font-700 text-foreground">{s.invoiceNumber}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(s.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs font-700 text-foreground">₹{s.total.toLocaleString("en-IN")}</p>
                        <p className="text-[9px] text-emerald-400 mt-0.5 font-500 uppercase">{s.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service History */}
            <div className="glass rounded-3xl p-5 border border-border">
              <h3 className="text-sm font-600 uppercase tracking-widest text-muted-foreground mb-4">Operations & services</h3>
              {customerServices.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No services or reminders scheduled. Schedule one on the CRM tab.
                </div>
              ) : (
                <div className="space-y-3">
                  {customerServices.map((srv) => (
                    <div key={srv.id} className="p-3.5 rounded-2xl bg-secondary/20 border border-border/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-600 text-foreground">{srv.serviceType}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-600 border ${
                          srv.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          "bg-accent/10 text-accent border-accent/20"
                        }`}>
                          {srv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {srv.notes || "No log notes added."}
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" /> Due: {srv.nextDueDate}
                        </span>
                        <span>Recorded: {srv.serviceDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CRM Metrics KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-200">
        <div className="glass rounded-2xl p-4.5 flex items-center justify-between relative overflow-hidden border border-border/50 bg-card/10">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-600">Active Base</p>
            <p className="font-mono text-xl font-700 text-foreground">{customers.length}</p>
            <p className="text-[9px] text-emerald-400 font-500 flex items-center gap-1">
              <span className="size-1 rounded-full bg-emerald-400 animate-ping" />
              Live CRM Registry
            </p>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-secondary/80 text-primary border border-border/40">
            <Users className="size-5.5" />
          </span>
        </div>

        <div className="glass rounded-2xl p-4.5 flex items-center justify-between relative overflow-hidden border border-border/50 bg-card/10">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-600">VIP Tier</p>
            <p className="font-mono text-xl font-700 text-foreground">
              {customers.filter((c) => c.segment === "VIP").length}
            </p>
            <p className="text-[9px] text-amber-400 font-500">
              ₹{customers.filter((c) => c.segment === "VIP").reduce((acc, c) => acc + c.ltv, 0).toLocaleString("en-IN")} contribution
            </p>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-secondary/80 text-amber-400 border border-border/40">
            <Crown className="size-5.5" />
          </span>
        </div>

        <div className="glass rounded-2xl p-4.5 flex items-center justify-between relative overflow-hidden border border-border/50 bg-card/10">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-600">Regulars</p>
            <p className="font-mono text-xl font-700 text-foreground">
              {customers.filter((c) => c.segment === "Regular").length}
            </p>
            <p className="text-[9px] text-primary font-500">
              Loyal patronage
            </p>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-secondary/80 text-primary border border-border/40">
            <Smile className="size-5.5" />
          </span>
        </div>

        <div className="glass rounded-2xl p-4.5 flex items-center justify-between relative overflow-hidden border border-border/50 bg-card/10">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-600">New / Inactive</p>
            <p className="font-mono text-xl font-700 text-foreground">
              {customers.filter((c) => c.segment === "New" || c.segment === "Inactive").length}
            </p>
            <p className="text-[9px] text-muted-foreground font-500">
              Awaiting engagement
            </p>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-secondary/80 text-muted-foreground border border-border/40">
            <UserCheck className="size-5.5" />
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Segment selector */}
        <div className="flex gap-1.5 rounded-full border border-border bg-secondary/40 p-1">
          {["All", "VIP", "Regular", "New", "Inactive"].map((seg) => (
            <button
              key={seg}
              onClick={() => setActiveSegment(seg)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-600 transition-colors ${
                activeSegment === seg
                  ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {seg}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-secondary/40 py-2 pl-9 pr-4 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 text-foreground"
          />
        </div>

        {/* Add Customer Button */}
        <button
          id="add-customer-btn"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground px-4 py-2 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow animate-pulse"
        >
          <Plus className="size-4" /> Add Customer
        </button>
      </div>

      {/* Customers List Table */}
      <div className="glass rounded-3xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground uppercase tracking-widest text-[9px] font-600">
                <th className="px-5 py-4">Client Name</th>
                <th className="px-5 py-4">Phone Number</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Segment</th>
                <th className="px-5 py-4 text-right">Orders</th>
                <th className="px-5 py-4 text-right">LTV</th>
                <th className="px-5 py-4 text-center">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8">
                    <EmptyState
                      title="No Customers Found"
                      description="We couldn't find any customers matching your search or segment filter. Create new customer profiles to track LTV and scheduling."
                      illustration="users"
                      actionText="Add Customer"
                      onAction={() => setIsDrawerOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-secondary/20">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded-lg bg-secondary font-600 text-accent">
                          {c.name.split(" ").map(n => n[0]).join("")}
                        </span>
                        <span className="font-600 text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-600 text-muted-foreground">{c.phone}</td>
                    <td className="px-5 py-4 text-muted-foreground">{c.email || "N/A"}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-600 border ${
                        c.segment === "VIP" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        c.segment === "Regular" ? "bg-primary/10 text-primary border-primary/20" :
                        c.segment === "New" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        "bg-secondary text-muted-foreground border-border"
                      }`}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-600">{c.ordersCount} sales</td>
                    <td className="px-5 py-4 text-right font-mono font-600">₹{c.ltv.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="rounded-full bg-secondary hover:bg-primary/15 hover:text-primary text-muted-foreground px-3.5 py-1 text-[11px] font-600 transition-colors border border-border"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer for customer registration */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 h-full w-[400px] max-w-full border-l border-border bg-card shadow-card flex flex-col animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-secondary/10">
              <h3 className="font-display font-700 text-base text-foreground">Add Customer</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <form onSubmit={handleRegisterCustomer} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Customer Name</label>
                <input
                  required
                  placeholder="e.g. Anita Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Mobile Phone</label>
                <input
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. anita.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Billing Address</label>
                <textarea
                  placeholder="e.g. Beverly Hills, Gurgaon"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">GSTIN Number (Optional)</label>
                <input
                  placeholder="e.g. 07AAAAA1111A1Z1"
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
