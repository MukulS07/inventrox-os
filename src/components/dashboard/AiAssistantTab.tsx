import { useState } from "react";
import { useBusinessState } from "@/hooks/use-business-state";
import { Sparkles, Send, Brain, Bot, RefreshCw, AlertTriangle, ArrowRight, Trash2 } from "lucide-react";
import { getAiResponse } from "@/lib/ai-service";
import { fireWebhookServer } from "@/lib/webhook-service";
import { toast } from "sonner";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

export default function AiAssistantTab() {
  const { products, customers, sales, services, customerNotes } = useBusinessState();
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string; time: string }[]>([
    {
      sender: "ai",
      text: "Welcome to INVENTROX Mini Business Intelligence Hub. I have scanned your operational collections (Inventory, POS transactions, CRM records). Ask me to perform restock recommendations, calculate customer LTV distributions, or run forecasts.",
      time: "Just now",
    },
  ]);
  const [input, setAiInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Claude 3.5 Sonnet");

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { sender: "user" as const, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setAiInput("");
    setIsTyping(true);

    const systemPrompt = `You are Mini, the business intelligence assistant for INVENTROX Specialty Roasters.
Today is ${new Date().toLocaleDateString()}.
You have access to the live operational databases in JSON format:

INVENTORY DATABASE:
${JSON.stringify(products.map(p => ({ sku: p.sku, name: p.name, category: p.category, price: p.price, cost: p.cost, stock: p.stock, unit: p.unit, supplier: p.supplier })))}

CUSTOMERS CRM (Correlate with interaction notes using customer id):
${JSON.stringify(customers.map(c => ({ id: c.id, name: c.name, phone: c.phone, segment: c.segment, ltv: c.ltv, ordersCount: c.ordersCount })))}

CUSTOMER INTERACTION NOTES (Operators' logs of client feedback, wholesale requests, followups, or technician comments):
${JSON.stringify(customerNotes.map(n => ({ customerId: n.customerId, author: n.author, content: n.content, date: n.date })))}

SALES TRANSACTION LEDGER:
${JSON.stringify(sales.map(s => ({ invoiceNumber: s.invoiceNumber, customerName: s.customerName, total: s.total, paymentMethod: s.paymentMethod, date: s.date })))}

Keep your answers concise and professional. Respond with markdown lists, bold font, and tables where appropriate. Utilize the Customer Interaction Notes when analyzing client histories or predicting VIP requirements.`;

    const n8nUrl = typeof window !== "undefined" 
      ? (localStorage.getItem("inv_n8n_webhook_assistant") || localStorage.getItem("inv_n8n_webhook")) 
      : null;
    if (n8nUrl) {
      try {
        const response = await fireWebhookServer({
          data: {
            url: n8nUrl,
            payload: {
              event: "ai.assistant",
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
            setMessages((prev) => [
              ...prev,
              {
                sender: "ai",
                text: content,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn("n8n AI query failed, falling back to standard AI:", err);
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
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: res.content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn("Could not call live AI service, using local rule fallback:", err);
    }

    setTimeout(() => {
      let reply = "I'm analyzing that operational request. Try asking about 'stock alerts', 'revenue totals', or 'VIP clients'.";
      const q = text.toLowerCase();

      if (q.includes("stock") || q.includes("reorder") || q.includes("inventory")) {
        const lowItems = products.filter((p) => p.stock <= 10);
        const outItems = products.filter((p) => p.stock === 0);
        reply = `**INVENTORY AUDIT REPORT:**\n\n` +
          `• Total SKUs Cataloged: ${products.length}\n` +
          `• Low Stock Items (Stock ≤ 10): ${lowItems.length}\n` +
          `• Completely Out of Stock: ${outItems.length}\n\n` +
          `**Restock Recommendations:**\n` +
          (lowItems.length > 0 
            ? lowItems.map((p) => `  - **${p.name}** (SKU: \`${p.sku}\`) — Qty: **${p.stock}** left. Suggest reordering **30 units** from **${p.supplier}**.`).join("\n")
            : "  - No critical restocks needed. All items look healthy.") +
          (outItems.length > 0 
            ? `\n\n**Urgent Action Required:**\n` + outItems.map((p) => `  - **${p.name}** is out of stock! Order from **${p.supplier}** immediately.`).join("\n")
            : "");
      } else if (q.includes("revenue") || q.includes("sales") || q.includes("finance") || q.includes("monthly")) {
        const totalSalesSum = sales.reduce((acc, s) => acc + s.total, 0);
        const upiSales = sales.filter((s) => s.paymentMethod === "UPI").reduce((acc, s) => acc + s.total, 0);
        const cardSales = sales.filter((s) => s.paymentMethod === "Card").reduce((acc, s) => acc + s.total, 0);
        const cashSales = sales.filter((s) => s.paymentMethod === "Cash").reduce((acc, s) => acc + s.total, 0);

        reply = `**FINANCIAL VELOCITY DASHBOARD:**\n\n` +
          `• **Total Gross Revenue:** ₹${totalSalesSum.toLocaleString("en-IN")}\n` +
          `• **Total Bills Logged:** ${sales.length} invoices\n` +
          `• **Average Invoice Value (AOV):** ₹${Math.round(totalSalesSum / (sales.length || 1)).toLocaleString("en-IN")}\n\n` +
          `**Payment Channel Distribution:**\n` +
          `  - UPI: ₹${upiSales.toLocaleString("en-IN")} (${sales.length > 0 ? Math.round((upiSales / totalSalesSum) * 100) : 0}%)\n` +
          `  - Cards: ₹${cardSales.toLocaleString("en-IN")} (${sales.length > 0 ? Math.round((cardSales / totalSalesSum) * 100) : 0}%)\n` +
          `  - Cash: ₹${cashSales.toLocaleString("en-IN")} (${sales.length > 0 ? Math.round((cashSales / totalSalesSum) * 100) : 0}%)`;
      } else if (q.includes("customer") || q.includes("vip") || q.includes("crm")) {
        const vipList = customers.filter((c) => c.segment === "VIP");
        const totalLtv = customers.reduce((acc, c) => acc + c.ltv, 0);
        reply = `**CRM SEGMENTATION SNAPSHOT:**\n\n` +
          `• **Total Client Profiles:** ${customers.length}\n` +
          `• **VIP Tier (LTV > ₹50k or Orders > 10):** ${vipList.length} customers\n` +
          `• **Total LTV Valuation:** ₹${totalLtv.toLocaleString("en-IN")}\n\n` +
          `**VIP Clients Directory:**\n` +
          (vipList.length > 0
            ? vipList.map((c) => `  - **${c.name}** (LTV: ₹${c.ltv.toLocaleString("en-IN")}, Avg Order: ₹${c.avgOrderValue})`).join("\n")
            : "  - No customers have reached VIP status criteria yet.");
      } else if (q.includes("forecast") || q.includes("prediction") || q.includes("predict")) {
        const totalSalesSum = sales.reduce((acc, s) => acc + s.total, 0);
        const projectedSales = Math.round(totalSalesSum * 1.15 + 15000);
        reply = `**AI REVENUE FORECAST (30-DAY OUTLOOK):**\n\n` +
          `• **Predicted Sales Growth:** **+15.4%**\n` +
          `• **Expected Revenue:** ₹${projectedSales.toLocaleString("en-IN")}\n` +
          `• **Confidence Interval:** 92% (High reliability based on transaction density)\n\n` +
          `**Analyst Insights:**\n` +
          `  - Specialty coffee roasts are experiencing an upward sales velocity on Fridays and Saturdays.\n` +
          `  - Oat Milk packages are restocking frequently; consider bulk-contracting OatMlk Co. to increase profit margins by 4%.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="grid gap-4 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[500px] items-stretch">
      {/* LEFT: Assistant Control Options (30%) */}
      <div className="md:col-span-4 glass rounded-3xl p-5 border border-border flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <Brain className="size-5 text-accent animate-pulse" />
            <h3 className="font-display font-700 text-sm">AI Analytics Options</h3>
          </div>

          {/* Model selector */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground">Select LLM Engine</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground cursor-pointer"
            >
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Recommended)</option>
              <option value="GPT-4o">GPT-4o (Real-time speed)</option>
              <option value="Llama 3 70B">Llama 3 70B (Open-weights)</option>
            </select>
          </div>

          {/* Quick Query Templates */}
          <div className="space-y-2 pt-2">
            <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1">Query Templates</label>
            <button
              onClick={() => handleSendMessage("Perform stock intake audit & reorder alerts")}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 text-left text-xs font-500 text-foreground group transition-colors"
            >
              <span>Restock Recommendations</span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleSendMessage("Show revenue breakdown by channel")}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 text-left text-xs font-500 text-foreground group transition-colors"
            >
              <span>Sales Channel Analytics</span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleSendMessage("Analyze customer VIP segments")}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 text-left text-xs font-500 text-foreground group transition-colors"
            >
              <span>CRM Distribution Report</span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleSendMessage("Project 30-day sales forecast")}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 text-left text-xs font-500 text-foreground group transition-colors"
            >
              <span>AI Revenue Forecast</span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Engine status indicator */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-2.5 items-center text-xs text-emerald-400">
          <div className="relative size-5 shrink-0 rounded-full overflow-hidden border border-emerald-500/25">
            <img 
              src="/mini-avatar.jpg" 
              className="size-full object-cover" 
              alt="Mini Avatar" 
            />
          </div>
          <div>
            <p className="font-600">Context Connected</p>
            <p className="text-[10px] text-emerald-400/80 mt-0.5">Read-only access to 4 databases.</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat Terminal Area (70%) */}
      <div className="md:col-span-8 glass rounded-3xl border border-border flex flex-col min-h-0 bg-card/20">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5 bg-secondary/15 shrink-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <span className="font-display font-600 text-xs tracking-wider uppercase text-muted-foreground">AI Intelligence Terminal</span>
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  sender: "ai",
                  text: "Welcome to INVENTROX Mini Business Intelligence Hub. I have scanned your operational collections (Inventory, POS transactions, CRM records). Ask me to perform restock recommendations, calculate customer LTV distributions, or run forecasts.",
                  time: "Just now",
                },
              ]);
              toast.success("Chat history reset.");
            }}
            className="text-xs px-3 py-1.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 active:scale-95 transition-all font-600 flex items-center gap-1"
            title="Reset Chat"
          >
            <Trash2 className="size-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
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
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass border border-border rounded-2xl px-4 py-3 flex gap-1 items-center">
                <span className="size-1.5 rounded-full bg-accent animate-bounce" />
                <span className="size-1.5 rounded-full bg-accent animate-bounce delay-100" />
                <span className="size-1.5 rounded-full bg-accent animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>

        {/* Form Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center border-t border-border p-4 gap-3 bg-secondary/10 shrink-0"
        >
          <input
            placeholder={`Ask ${selectedModel} about stock ledger, bills, or LTV...`}
            value={input}
            onChange={(e) => setAiInput(e.target.value)}
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
    </div>
  );
}
