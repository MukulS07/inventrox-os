import { useState } from "react";
import { useBusinessState, Customer } from "@/hooks/use-business-state";
import { Calendar, Plus, User, HeartHandshake, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function CrmTab() {
  const { customers, services, addServiceReminder, updateServiceStatus } = useBusinessState();

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [serviceType, setServiceType] = useState("Espresso Machine Calibration");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleScheduleService = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    if (!cust) return;

    addServiceReminder({
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      serviceType,
      serviceDate: new Date().toISOString().split("T")[0],
      nextDueDate,
      notes,
    });

    // Clear
    setSelectedCustomerId("");
    setNextDueDate("");
    setNotes("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12 items-stretch min-h-[500px]">
      {/* LEFT COLUMN: Service Timelines (60%) */}
      <div className="lg:col-span-7 glass rounded-3xl p-5 border border-border flex flex-col min-h-0">
        <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4 shrink-0">
          <HeartHandshake className="size-4.5 text-accent animate-pulse" />
          <h3 className="font-display font-700 text-sm">CRM Service Ledger</h3>
        </div>

        {/* Scrollable reminders list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {services.length === 0 ? (
            <div className="text-center py-16 text-xs text-muted-foreground">
              No service logs recorded. Use the wizard to schedule reminders.
            </div>
          ) : (
            services.map((srv) => (
              <div
                key={srv.id}
                className="p-4 rounded-2xl bg-secondary/20 border border-border/40 space-y-3 hover:bg-secondary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-600 text-xs text-foreground">{srv.serviceType}</h4>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <User className="size-3 text-accent" /> {srv.customerName} ({srv.customerPhone})
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-700 uppercase border ${
                    srv.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    srv.status === "Cancelled" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    "bg-accent/10 text-accent border-accent/20"
                  }`}>
                    {srv.status}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {srv.notes || "No additional description logs."}
                </p>

                <div className="flex justify-between items-center border-t border-border/30 pt-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> Scheduled Due: <span className="font-600 text-foreground font-mono">{srv.nextDueDate}</span>
                  </span>
                  
                  {srv.status === "Scheduled" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateServiceStatus(srv.id, "Completed")}
                        className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-600"
                      >
                        <CheckCircle2 className="size-3.5" /> Resolve
                      </button>
                      <button
                        onClick={() => updateServiceStatus(srv.id, "Cancelled")}
                        className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 font-600"
                      >
                        <XCircle className="size-3.5" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Schedule Wizard Form (40%) */}
      <div className="lg:col-span-5 glass rounded-3xl p-5 border border-border flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <Calendar className="size-4.5 text-accent animate-pulse" />
            <h3 className="font-display font-700 text-sm">Schedule Operation</h3>
          </div>

          <form onSubmit={handleScheduleService} className="space-y-4">
            <div>
              <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                Client Profile
              </label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
              >
                <option value="" className="bg-card">Select Client Profile</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id} className="bg-card">
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                Operation Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
              >
                <option value="Espresso Machine Calibration" className="bg-card">Espresso Machine Calibration</option>
                <option value="Grinder Burrs Alignment" className="bg-card">Grinder Burrs Alignment</option>
                <option value="Water Filtration Replace" className="bg-card">Water Filtration Replace</option>
                <option value="Boiler Descaling Check" className="bg-card">Boiler Descaling Check</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                Next Due Date
              </label>
              <input
                required
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">
                Operational Notes
              </label>
              <textarea
                placeholder="Include maintenance specifics, parts replaced..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedCustomerId}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground py-2.5 text-xs font-700 shadow-glow hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Plus className="size-4" /> Schedule Reminder
            </button>
          </form>
        </div>

        <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed text-center">
          Scheduling logs triggers an automated background webhook. Notifications transmit 7 days and 3 days before schedule.
        </p>
      </div>
    </div>
  );
}
