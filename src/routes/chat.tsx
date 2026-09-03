import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Send, Calendar, Package, HelpCircle, ArrowLeft, Bot, Trash2 } from "lucide-react";
import { BusinessStateProvider, useBusinessState } from "@/hooks/use-business-state";
import { getAiResponse } from "@/lib/ai-service";
import { fireWebhookServer } from "@/lib/webhook-service";
import { toast } from "sonner";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Customer Assistant — INVENTROX" },
      {
        name: "description",
        content: "Chat with the AI operations chatbot to track orders, check stock, or book services.",
      },
    ],
  }),
  component: ChatRoute,
});

function ChatRoute() {
  return (
    <BusinessStateProvider>
      <div className="relative min-h-screen">
        {/* Ambient bg */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[#09090B]" />
          <div className="absolute -top-1/4 right-0 h-[80vh] w-[80vw] aurora opacity-55 blur-3xl" />
          <div className="absolute inset-0 starfield opacity-30" />
        </div>
        <CustomerChatbot />
      </div>
    </BusinessStateProvider>
  );
}

function CustomerChatbot() {
  const { sales, products, customers, addCustomer, addServiceReminder } = useBusinessState();
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string; bookingForm?: boolean }[]>([
    {
      sender: "ai",
      text: "Hello! I am the automated customer assistant. I can check order/invoice status, check product availability, or guide you to book a machine calibration service. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleEndChat = () => {
    if (confirm("Are you sure you want to end this chat session? All current messages will be cleared.")) {
      setMessages([
        {
          sender: "ai",
          text: "Hello! I am the automated customer assistant. I can check order/invoice status, check product availability, or guide you to book a machine calibration service. How can I help you today?",
        },
      ]);
      toast.success("Chat session ended.");
    }
  };

  const handleBookingSubmit = (data: { name: string; phone: string; email: string; serviceType: string; date: string; notes: string }) => {
    let customerId = "";
    const existing = customers.find((c) => c.phone === data.phone);
    if (existing) {
      customerId = existing.id;
    } else {
      const newCust = addCustomer({
        name: data.name,
        phone: data.phone,
        email: data.email || `${data.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
        address: "Registered via chat support",
        gstin: "",
        segment: "New",
      });
      customerId = newCust.id;
    }

    addServiceReminder({
      customerId,
      customerName: data.name,
      customerPhone: data.phone,
      serviceType: data.serviceType,
      serviceDate: new Date().toISOString().split("T")[0],
      nextDueDate: data.date,
      notes: data.notes || `Calibration requested via customer AI chatbot.`,
    });

    // Add chatbot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `**APPOINTMENT BOOKED SUCCESSFULLY!** 🎉\n\n` +
            `• **Service Type:** ${data.serviceType}\n` +
            `• **Customer Profile:** ${data.name} (${data.phone})\n` +
            `• **Preferred Date:** ${new Date(data.date).toLocaleDateString("en-IN")}\n\n` +
            `I have scheduled this operation in the CRM Service Ledger. Our technicians will reach out shortly for alignment prep.`,
        },
      ]);
    }, 500);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setIsTyping(true);

    const systemPrompt = `You are the automated customer assistant for INVENTROX Specialty Roasters.
Today is ${new Date().toLocaleDateString()}.
Your goal is to help customers with their queries regarding product availability, order status, or booking calibration services.

DATABASE INFORMATION:
AVAILABLE PRODUCTS:
${JSON.stringify(products.filter(p => p.stock > 0).map(p => ({ name: p.name, price: p.price, unit: p.unit, category: p.category })))}

ORDER INVOICES (For verification, if the user asks for invoice status, they MUST specify the invoice number like INV-YYYY-NNNN):
${JSON.stringify(sales.map(s => ({ invoiceNumber: s.invoiceNumber, customerName: s.customerName, total: s.total, date: s.date, items: s.items.map(it => ({ productName: it.productName, quantity: it.quantity })) })))}

SAFETY & BOOKING RULES:
- Never disclose internal cost prices (e.g. cost field) or profit margins.
- Do not list or expose other customers' invoice details unless they explicitly request their own invoice number.
- Be polite, helpful, and concise. Respond in Hinglish or English depending on user input.
- If the customer wants to book a service (e.g., espresso machine calibration, grinder burrs alignment, water filtration replacement, boiler check), respond with information about the service and ALWAYS append the exact tag '[SHOW_BOOKING_FORM]' at the end of your response to trigger the interactive scheduling form.`;

    const n8nUrl = typeof window !== "undefined" 
      ? (localStorage.getItem("inv_n8n_webhook_chatbot") || localStorage.getItem("inv_n8n_webhook")) 
      : null;
    if (n8nUrl) {
      try {
        const response = await fireWebhookServer({
          data: {
            url: n8nUrl,
            payload: {
              event: "ai.chatbot",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
              ],
              timestamp: new Date().toISOString()
            }
          }
        });
        if (response.success && response.data) {
          const data = response.data;
          const content = data.output || data.text || data.content || data.response || (typeof data === "string" ? data : null);
          if (content) {
            const hasFormTag = content.includes("[SHOW_BOOKING_FORM]");
            const textClean = content.replace("[SHOW_BOOKING_FORM]", "").trim();
            setMessages((prev) => [...prev, { sender: "ai", text: textClean, bookingForm: hasFormTag }]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn("n8n Chatbot query failed, falling back to standard AI:", err);
      }
    }

    try {
      const res = await getAiResponse({
        data: {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
          ]
        }
      });

      if (res.success && res.content) {
        const hasFormTag = res.content.includes("[SHOW_BOOKING_FORM]");
        const textClean = res.content.replace("[SHOW_BOOKING_FORM]", "").trim();
        setMessages((prev) => [...prev, { sender: "ai", text: textClean, bookingForm: hasFormTag }]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn("Could not call live AI service, using local rule fallback:", err);
    }

    setTimeout(() => {
      let reply = "Thanks for messaging us! I am currently checking our operations catalog. You can ask me to check an invoice (e.g., 'INV-2026-0001') or list available beans.";
      const q = text.toLowerCase();
      let triggerForm = false;

      // Order status lookup
      if (q.includes("inv-")) {
        const match = q.match(/inv-\d{4}-\d{4}/);
        const invNum = match ? match[0].toUpperCase() : "";
        const sale = sales.find((s) => s.invoiceNumber === invNum);

        if (sale) {
          reply = `**ORDER FOUND:** Invoice **${sale.invoiceNumber}**\n\n` +
            `• **Customer:** ${sale.customerName}\n` +
            `• **Billing Date:** ${new Date(sale.date).toLocaleDateString("en-IN")}\n` +
            `• **Amount Paid:** ₹${sale.total.toLocaleString("en-IN")}\n` +
            `• **Payment Channel:** ${sale.paymentMethod}\n\n` +
            `**Purchased Items:**\n` +
            sale.items.map((it) => `  - ${it.productName} (Qty: ${it.quantity})`).join("\n") +
            `\n\n**Status:** Delivery dispatched / ready for pickup.`;
        } else {
          reply = `I searched our retail logs but could not locate invoice number **${invNum || text}**. Please check the spelling or select a template query.`;
        }
      } else if (q.includes("product") || q.includes("bean") || q.includes("coffee") || q.includes("oat")) {
        // Product availability
        const availableProducts = products.filter((p) => p.stock > 0);
        reply = `**SPECIALTY RETAIL CATALOG:**\n` +
          `Here are our in-stock items available for immediate pickup or delivery:\n\n` +
          availableProducts.map((p) => `• **${p.name}** — ₹${p.price.toLocaleString("en-IN")} / ${p.unit} (${p.stock} units in stock)`).join("\n") +
          `\n\nWould you like me to book a wholesale contract for any of these?`;
      } else if (q.includes("book") || q.includes("service") || q.includes("appointment") || q.includes("calibrate") || q.includes("align")) {
        reply = `**SERVICE BOOKING ASSISTANT:**\n\n` +
          `We offer professional espresso machine calibration, grinder burrs alignment, water filtration replacement, and boiler check operations.\n\n` +
          `Please fill out the booking form below to secure your slots.`;
        triggerForm = true;
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply, bookingForm: triggerForm }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="grid size-9 place-items-center rounded-full border border-border bg-secondary/40 text-muted-foreground hover:text-foreground transition-all"
            title="Return to site"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-glow">
              <Bot className="size-5" />
            </span>
            <div>
              <h1 className="font-display font-700 text-sm text-foreground">INVENTROX</h1>
              <p className="text-[10px] text-emerald-400 font-500 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" /> AI Customer Assistant
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleEndChat}
          className="text-xs px-3.5 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/25 hover:text-rose-300 active:scale-95 transition-all font-600 flex items-center gap-1.5"
        >
          <Trash2 className="size-3.5" />
          <span>End Chat</span>
        </button>
      </header>

      {/* Message Screen */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[image:var(--gradient-primary)] text-primary-foreground font-500 whitespace-pre-line"
                  : "glass text-foreground border border-border"
              }`}
            >
              {msg.sender === "user" ? (
                msg.text
              ) : (
                <MarkdownRenderer content={msg.text} />
              )}
              {msg.bookingForm && (
                <InlineBookingForm onSubmit={handleBookingSubmit} />
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass border border-border rounded-3xl px-4 py-3 flex gap-1 items-center">
              <span className="size-1.5 rounded-full bg-accent animate-bounce" />
              <span className="size-1.5 rounded-full bg-accent animate-bounce delay-100" />
              <span className="size-1.5 rounded-full bg-accent animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Queries */}
      <div className="flex gap-2 overflow-x-auto p-2 border-t border-border/30 shrink-0">
        <button
          onClick={() => handleSendMessage("Check invoice INV-2026-0001")}
          className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full glass hover:bg-secondary text-accent font-500"
        >
          <Package className="size-3.5" /> Check Order INV-2026-0001
        </button>
        <button
          onClick={() => handleSendMessage("Show available coffee blends")}
          className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full glass hover:bg-secondary text-accent font-500"
        >
          <HelpCircle className="size-3.5" /> Check Product Stock
        </button>
        <button
          onClick={() => handleSendMessage("I want to book a service")}
          className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full glass hover:bg-secondary text-accent font-500"
        >
          <Calendar className="size-3.5" /> Book Machine Service
        </button>
      </div>

      {/* Form Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex items-center gap-3 border border-border bg-card/45 rounded-2xl p-2.5 mt-2 shrink-0 backdrop-blur"
      >
        <input
          placeholder="Ask about orders, stocks, or booking service..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-0 text-xs text-foreground placeholder:text-muted-foreground outline-none px-2"
        />
        <button
          type="submit"
          className="size-9 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-glow"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  date: string;
  notes: string;
}

function InlineBookingForm({ onSubmit }: { onSubmit: (data: BookingFormData) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("Espresso Machine Calibration");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) return;
    onSubmit({ name, phone, email, serviceType, date, notes });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 animate-in zoom-in duration-200">
        <span className="inline-grid size-8 place-items-center rounded-full bg-emerald-500/25 text-emerald-400 font-bold">
          ✓
        </span>
        <h4 className="font-600 text-xs text-foreground">Appointment Submitted</h4>
        <p className="text-[10px] text-muted-foreground">The request was successfully registered in the CRM service ledger.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 rounded-2xl bg-secondary/35 border border-border/50 space-y-3 text-left animate-in slide-in-from-top duration-250">
      <div>
        <label className="block text-[9px] font-600 uppercase tracking-widest text-muted-foreground mb-1">Your Name</label>
        <input
          required
          placeholder="e.g. Mukul Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-card/65 p-2 text-[11px] text-foreground outline-none focus:border-primary/50"
        />
      </div>
      <div className="grid gap-2 grid-cols-2">
        <div>
          <label className="block text-[9px] font-600 uppercase tracking-widest text-muted-foreground mb-1">Mobile Phone</label>
          <input
            required
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-border bg-card/65 p-2 text-[11px] text-foreground font-mono outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-[9px] font-600 uppercase tracking-widest text-muted-foreground mb-1">Preferred Date</label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-card/65 p-2 text-[11px] text-foreground outline-none focus:border-primary/50 cursor-pointer"
          />
        </div>
      </div>
      <div>
        <label className="block text-[9px] font-600 uppercase tracking-widest text-muted-foreground mb-1">Email (Optional)</label>
        <input
          type="email"
          placeholder="e.g. mukul@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-card/65 p-2 text-[11px] text-foreground outline-none focus:border-primary/50"
        />
      </div>
      <div>
        <label className="block text-[9px] font-600 uppercase tracking-widest text-muted-foreground mb-1">Service Type</label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full rounded-lg border border-border bg-card/65 p-2 text-[11px] text-foreground outline-none focus:border-primary/50 cursor-pointer"
        >
          <option value="Espresso Machine Calibration" className="bg-card">Espresso Machine Calibration</option>
          <option value="Grinder Burrs Alignment" className="bg-card">Grinder Burrs Alignment</option>
          <option value="Water Filtration Replace" className="bg-card">Water Filtration Replace</option>
          <option value="Boiler Descaling Check" className="bg-card">Boiler Descaling Check</option>
        </select>
      </div>
      <div>
        <label className="block text-[9px] font-600 uppercase tracking-widest text-muted-foreground mb-1">Special Notes</label>
        <textarea
          placeholder="Machine model, issues..."
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-border bg-card/65 p-2 text-[11px] text-foreground outline-none focus:border-primary/50"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground py-2.5 text-[11px] font-700 hover:opacity-90 active:scale-95 transition-all shadow-glow"
      >
        Confirm Booking
      </button>
    </form>
  );
}
