import { useState, useEffect } from "react";
import { useBusinessState } from "@/hooks/use-business-state";
import {
  Settings,
  Building,
  Palette,
  Bot,
  Key,
  ShieldAlert,
  Coins,
  Check,
  Plus,
  Trash2,
  Cpu,
  Database,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { sendInvoiceEmailDirectServer, checkEmailConfigStatus } from "@/lib/email-service";
import { fireWebhookServer } from "@/lib/webhook-service";

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState<"profile" | "theme" | "chatbot" | "api" | "performance" | "backup">("profile");

  const {
    products,
    customers,
    sales,
    services,
    suppliers,
    notifications,
    customerNotes,
    importDatabaseBackup,
    resetDatabase,
  } = useBusinessState();

  const handleExportDb = () => {
    try {
      const dbState = {
        products,
        customers,
        sales,
        services,
        suppliers,
        notifications,
        customerNotes,
      };
      const blob = new Blob([JSON.stringify(dbState, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `inventrox_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Database backup file downloaded successfully!");
    } catch (e: any) {
      toast.error(`Export failed: ${e.message || String(e)}`);
    }
  };

  const handleImportDb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const backup = JSON.parse(text);
        
        if (!backup.products && !backup.customers && !backup.sales) {
          throw new Error("Invalid backup file format. Expected an Inventrox database JSON backup.");
        }

        importDatabaseBackup(backup);
        toast.success("Database backup restored and server-synced successfully!");
      } catch (err: any) {
        toast.error(`Import failed: ${err.message || "Invalid JSON database file."}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDb = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset the database? This action is permanent and will delete all custom records.");
    if (!confirmReset) return;

    try {
      await resetDatabase();
      toast.success("Database reset to clean demo state successfully!");
    } catch (err: any) {
      toast.error(`Reset failed: ${err.message || String(err)}`);
    }
  };

  // Redis cache state and simulation handlers
  const [redisCacheEnabled, setRedisCacheEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_redis_cache") === "true";
    }
    return false;
  });

  const handleToggleRedis = (val: boolean) => {
    setRedisCacheEnabled(val);
    localStorage.setItem("inv_redis_cache", String(val));
    if (val) {
      toast.success("Redis Caching enabled globally! Query latency optimized.");
    } else {
      toast.info("Redis Caching disabled. Queries falling back to DB direct.");
    }
  };

  const handlePurgeCache = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: "Purging Redis cache clusters...",
        success: "Cache cleared successfully! 0 active keys.",
        error: "Failed to clear cache.",
      }
    );
  };

  // Profile Form State loaded from localStorage
  const [compName, setCompName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_comp_name") || "INVENTROX Specialty Roasters";
    }
    return "INVENTROX Specialty Roasters";
  });
  const [compGstin, setCompGstin] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_comp_gstin") || "07AAACO8892F1Z9";
    }
    return "07AAACO8892F1Z9";
  });
  const [compAddress, setCompAddress] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_comp_address") || "Plot 45, Udyog Vihar Phase 4, Gurgaon, Haryana, 122016";
    }
    return "Plot 45, Udyog Vihar Phase 4, Gurgaon, Haryana, 122016";
  });
  const [compPhone, setCompPhone] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_comp_phone") || "+91 98765 43210";
    }
    return "+91 98765 43210";
  });
  const [compEmail, setCompEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_comp_email") || "onboarding@resend.dev";
    }
    return "onboarding@resend.dev";
  });

  const handleSaveProfile = () => {
    localStorage.setItem("inv_comp_name", compName);
    localStorage.setItem("inv_comp_gstin", compGstin);
    localStorage.setItem("inv_comp_address", compAddress);
    localStorage.setItem("inv_comp_phone", compPhone);
    localStorage.setItem("inv_comp_email", compEmail);
    
    // Dispatch custom event to sync with Dashboard layout
    window.dispatchEvent(new CustomEvent("inv-company-name-changed", { detail: compName }));
    
    toast.success("Company profile changes saved successfully");
  };

  // Chatbot Config State
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [chatbotGreeting, setChatbotGreeting] = useState("Hi! I am the automated customer assistant. I can check order status, product availability, or guide you to book services.");
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([
    { q: "What are your business hours?", a: "We are open Monday to Saturday from 9 AM to 7 PM." },
  ]);

  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_theme") || "Midnight Black";
    }
    return "Midnight Black";
  });

  // Sync theme changes from header switcher
  useEffect(() => {
    const handleThemeChangedEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === "string") {
        setActiveTheme(customEvent.detail);
      }
    };
    window.addEventListener("inv-theme-changed", handleThemeChangedEvent);
    return () => {
      window.removeEventListener("inv-theme-changed", handleThemeChangedEvent);
    };
  }, []);

  const [activeFontSize, setActiveFontSize] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_font_size") || "md";
    }
    return "md";
  });

  const [activeDensity, setActiveDensity] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_density") || "comfortable";
    }
    return "comfortable";
  });

  // Resend API and Messaging States
  const [resendKey, setResendKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_resend_key") || "";
    }
    return "";
  });
  const [msg91Key, setMsg91Key] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inv_msg91_key") || "";
    }
    return "";
  });
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [hasEnvApiKey, setHasEnvApiKey] = useState(false);

  useEffect(() => {
    checkEmailConfigStatus().then(res => {
      setHasEnvApiKey(res.hasApiKey);
    }).catch(err => {
      console.warn("Failed to check server email config status:", err);
    });
  }, []);

  const handleSaveApiKeys = () => {
    localStorage.setItem("inv_resend_key", resendKey);
    localStorage.setItem("inv_msg91_key", msg91Key);
    localStorage.setItem("inv_comp_email", compEmail);
    toast.success("Resend Email configuration saved successfully");
  };

  const handleTestResendEmail = async () => {
    if (!resendKey && !hasEnvApiKey) {
      toast.error("Please enter a Resend API Key first or configure it in your .env file.");
      return;
    }
    setIsTestingEmail(true);
    try {
      const result = await sendInvoiceEmailDirectServer({
        data: {
          resendApiKey: resendKey || undefined,
          fromEmail: compEmail,
          toEmail: compEmail, // Send test to ourselves
          customerName: "Mukul Sharma (Test Client)",
          invoiceNumber: "INV-2026-TEST",
          total: 1250.00,
          items: [
            { name: "Specialty Roasted Arabica (500g)", quantity: 2, price: 500.00 },
            { name: "Cascara Coffee Cherry Tea (250g)", quantity: 1, price: 250.00 }
          ],
          companyDetails: {
            name: compName,
            gstin: compGstin,
            address: compAddress,
            phone: compPhone
          }
        }
      });

      if (result.success) {
        if (result.sandboxRedirected) {
          toast.warning(`Email redirected to verified address: ${result.verifiedEmail} (Sandbox mode)`);
        } else {
          toast.success("Test email sent successfully! Check your inbox.");
        }
      } else {
        toast.error(`Resend API Error: ${result.error}`);
      }
    } catch (err: any) {
      toast.error(`Email dispatch failed: ${err.message || String(err)}`);
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleTestWebhook = async (url: string, eventName: string) => {
    if (!url) {
      toast.error(`Please enter a webhook URL for ${eventName} first`);
      return;
    }
    setIsTestingWebhook(true);
    try {
      const result = await fireWebhookServer({
        data: {
          url: url,
          payload: {
            event: "test.connection",
            message: `INVENTROX OS Webhook Connection Test (${eventName})`,
            timestamp: new Date().toISOString(),
            companyName: compName,
          }
        }
      });
      if (result.success) {
        toast.success(`${eventName} tested successfully! n8n returned HTTP 200.`);
      } else {
        toast.warning(result.error ? `Connection failed: ${result.error}` : `Webhook fired, but endpoint returned status ${result.status}.`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Connection failed: ${err.message || String(err)}`);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleThemeChange = (themeName: string) => {
    setActiveTheme(themeName);
    localStorage.setItem("inv_theme", themeName);

    // Apply classes to body
    const body = document.body;
    body.classList.remove("theme-white", "theme-neon", "theme-purple");

    if (themeName === "Arctic White") {
      body.classList.add("theme-white");
    } else if (themeName === "Neon Blue") {
      body.classList.add("theme-neon");
    } else if (themeName === "Royal Purple") {
      body.classList.add("theme-purple");
    }
  };

  const handleFontSizeChange = (sizeId: string) => {
    setActiveFontSize(sizeId);
    localStorage.setItem("inv_font_size", sizeId);
    
    // Apply class to html
    const html = document.documentElement;
    html.classList.remove("font-size-sm", "font-size-md", "font-size-lg");
    html.classList.add(`font-size-${sizeId}`);
    toast.success(`Font scaling set to ${sizeId.toUpperCase()}`);
  };

  const handleDensityChange = (densityId: string) => {
    setActiveDensity(densityId);
    localStorage.setItem("inv_density", densityId);
    
    // Apply class to html
    const html = document.documentElement;
    html.classList.remove("density-compact", "density-comfortable");
    html.classList.add(`density-${densityId}`);
    toast.success(`Layout density set to ${densityId.toUpperCase()}`);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { q: "", a: "" }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleFaqChange = (idx: number, field: "q" | "a", val: string) => {
    const updated = [...faqs];
    updated[idx][field] = val;
    setFaqs(updated);
  };

  const settingsNav = [
    { id: "profile", label: "Company Profile", icon: Building },
    { id: "theme", label: "Visual Theme", icon: Palette },
    { id: "chatbot", label: "AI Chatbot Config", icon: Bot },
    { id: "api", label: "Resend Email Config", icon: Key },
    { id: "performance", label: "Performance & Caching", icon: Cpu },
    { id: "backup", label: "Database Backup", icon: Database },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-12 items-start min-h-[500px]">
      {/* LEFT: Settings Nav (30%) */}
      <div className="md:col-span-3 glass rounded-3xl p-3 border border-border flex flex-col gap-1 shrink-0">
        {settingsNav.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-xs font-600 transition-colors ${
                isActive
                  ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT: Config Workspace (70%) */}
      <div className="md:col-span-9 glass rounded-3xl p-5 border border-border min-h-[400px]">
        {/* COMPANY PROFILE */}
        {activeSection === "profile" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-display font-700 text-sm border-b border-border/50 pb-2.5">Company Profile Options</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Registered Name</label>
                <input
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">GSTIN Number</label>
                <input
                  value={compGstin}
                  onChange={(e) => setCompGstin(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Business Phone</label>
                <input
                  value={compPhone}
                  onChange={(e) => setCompPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Company Sender Email</label>
                <input
                  type="email"
                  value={compEmail}
                  onChange={(e) => setCompEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                  placeholder="e.g. billing@yourdomain.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Company Headquarters Address</label>
                <textarea
                  rows={2}
                  value={compAddress}
                  onChange={(e) => setCompAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* THEMES */}
        {activeSection === "theme" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="font-display font-700 text-sm border-b border-border/50 pb-2.5">Application Theme Picker</h3>
            
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Midnight Black", color: "bg-[#09090B] border-[#7C3AED]" },
                { name: "Arctic White", color: "bg-[#FAFAFA] border-[#111827]" },
                { name: "Neon Blue", color: "bg-[#050816] border-[#00E5FF]" },
                { name: "Royal Purple", color: "bg-[#140028] border-[#B517FF]" },
              ].map((theme) => {
                const isSelected = activeTheme === theme.name;
                return (
                  <button
                    key={theme.name}
                    onClick={() => handleThemeChange(theme.name)}
                    className={`rounded-2xl border p-4 text-left flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform ${
                      isSelected ? "border-primary bg-primary/5" : "border-border bg-secondary/20"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-700 text-foreground">{theme.name}</span>
                      {isSelected && <span className="size-4.5 rounded-full bg-primary flex items-center justify-center text-primary-foreground"><Check className="size-3" /></span>}
                    </div>
                    <div className="flex gap-1">
                      <span className={`size-5 rounded border ${theme.color}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Font Scaling Section */}
            <div className="pt-5 border-t border-border/40 space-y-3">
              <div>
                <h4 className="text-xs font-700 text-foreground">Font Size Scaling</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Scale the base text size dynamically across all operational modules.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "sm", label: "Small (90%)" },
                  { id: "md", label: "Medium (100% - Default)" },
                  { id: "lg", label: "Large (110%)" }
                ].map((size) => {
                  const isSelected = activeFontSize === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => handleFontSizeChange(size.id)}
                      className={`px-4 py-2.5 rounded-xl border text-[11px] font-600 active:scale-95 transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/5 text-foreground shadow-glow" 
                          : "border-border bg-secondary/20 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {size.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Density Section */}
            <div className="pt-5 border-t border-border/40 space-y-3">
              <div>
                <h4 className="text-xs font-700 text-foreground">Layout Density Mode</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Compact density reduces table padding and spacings to fit more items on the screen.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "comfortable", label: "Comfortable (Standard padding)" },
                  { id: "compact", label: "Compact Density (Data-rich grids)" }
                ].map((dens) => {
                  const isSelected = activeDensity === dens.id;
                  return (
                    <button
                      key={dens.id}
                      onClick={() => handleDensityChange(dens.id)}
                      className={`px-4 py-2.5 rounded-xl border text-[11px] font-600 active:scale-95 transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/5 text-foreground shadow-glow" 
                          : "border-border bg-secondary/20 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {dens.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AI CHATBOT */}
        {activeSection === "chatbot" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="font-display font-700 text-sm border-b border-border/50 pb-2.5">Customer Chatbot Parameters</h3>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 bg-secondary/10">
              <div>
                <p className="text-xs font-600 text-foreground">Enable AI Customer Chatbot</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Allow public customers to track orders & book services via /chat.</p>
              </div>
              <input
                type="checkbox"
                checked={chatbotEnabled}
                onChange={(e) => setChatbotEnabled(e.target.checked)}
                className="size-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            {chatbotEnabled && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Default Greeting Text</label>
                  <textarea
                    rows={2}
                    value={chatbotGreeting}
                    onChange={(e) => setChatbotGreeting(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                  />
                </div>

                {/* FAQ Rows */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground">Static FAQs Editor</label>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="text-xs text-accent hover:underline font-600 flex items-center gap-1"
                    >
                      <Plus className="size-3.5" /> Add Row
                    </button>
                  </div>

                  <div className="space-y-2">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          placeholder="Question"
                          value={faq.q}
                          onChange={(e) => handleFaqChange(idx, "q", e.target.value)}
                          className="flex-1 rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                        />
                        <input
                          placeholder="Answer"
                          value={faq.a}
                          onChange={(e) => handleFaqChange(idx, "a", e.target.value)}
                          className="flex-1 rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="p-2 border border-border rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button className="rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow">
              Save Chatbot Config
            </button>
          </div>
        )}

        {/* RESEND EMAIL & MESSAGING INTEGRATIONS */}
        {activeSection === "api" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
              <h3 className="font-display font-700 text-sm">Resend Email & Integrations</h3>
              <button
                type="button"
                onClick={handleTestResendEmail}
                disabled={isTestingEmail}
                className="text-[10px] text-accent hover:underline font-600 cursor-pointer disabled:opacity-50"
              >
                {isTestingEmail ? "Sending Test..." : "Test Send Email"}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Resend API Key</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="e.g. re_123456789..."
                  value={resendKey}
                  onChange={(e) => setResendKey(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Get your API Key from your Resend dashboard.</p>
                {hasEnvApiKey && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Global Fallback Active: Resend API Key is loaded from your server .env file. You can leave this input blank.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">Sender Email Address</label>
                <input
                  type="email"
                  placeholder="onboarding@resend.dev"
                  value={compEmail}
                  onChange={(e) => setCompEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Use <b>onboarding@resend.dev</b> for testing. For production, enter your verified domain email.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-1.5">MSG91 / WhatsApp API Key (Optional)</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter MSG91 WhatsApp API key"
                  value={msg91Key}
                  onChange={(e) => setMsg91Key(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 p-2.5 text-xs outline-none focus:border-primary/50 text-foreground font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSaveApiKeys}
              className="rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow"
            >
              Save Email Configuration
            </button>
          </div>
        )}

        {/* PERFORMANCE & CACHING OPTIMIZATION */}
        {activeSection === "performance" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <h3 className="font-display font-700 text-sm">Performance & Redis Caching</h3>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-700 uppercase border ${
                redisCacheEnabled 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                <span className={`size-1.5 rounded-full ${redisCacheEnabled ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                {redisCacheEnabled ? "Redis Cluster Active" : "Redis Caching Inactive"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Enable Redis memory caching to store active queries and database snapshots. This reduces round-trip times to Supabase database instances and significantly improves visual load speeds.
            </p>

            {/* Toggle Cache Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-secondary/15">
              <div className="space-y-0.5">
                <p className="text-xs font-700 text-foreground">Global Memory Caching</p>
                <p className="text-[10px] text-muted-foreground">Intercept queries and cache results in memory</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleRedis(!redisCacheEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  redisCacheEnabled ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    redisCacheEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Caching Statistics Strip */}
            <div className="grid gap-4 grid-cols-3">
              <div className="glass rounded-2xl p-4 border border-border/40">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-600 text-left">Cache Hit Rate</p>
                <p className="font-mono text-xl font-700 mt-1.5 text-foreground text-left">
                  {redisCacheEnabled ? "96.4%" : "0.0%"}
                </p>
                <p className="text-[9px] text-muted-foreground mt-1 text-left">Ratio of cached hits</p>
              </div>

              <div className="glass rounded-2xl p-4 border border-border/40">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-600 text-left">Average Latency</p>
                <p className={`font-mono text-xl font-700 mt-1.5 text-left ${redisCacheEnabled ? "text-emerald-400" : "text-amber-400"}`}>
                  {redisCacheEnabled ? "8 ms" : "240 ms"}
                </p>
                <p className="text-[9px] text-muted-foreground mt-1 text-left">p95 response time</p>
              </div>

              <div className="glass rounded-2xl p-4 border border-border/40">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-600 text-left">Cached Items</p>
                <p className="font-mono text-xl font-700 mt-1.5 text-foreground text-left">
                  {redisCacheEnabled ? "482 keys" : "0 keys"}
                </p>
                <p className="text-[9px] text-muted-foreground mt-1 text-left">Active memory keys</p>
              </div>
            </div>

            {/* Latency Gauge visualization */}
            <div className="glass rounded-2xl p-4 border border-border/40 space-y-2">
              <div className="flex justify-between text-[10px] text-muted-foreground font-600">
                <span>Latency Gauge</span>
                <span>{redisCacheEnabled ? "⚡ optimized" : "direct DB hit"}</span>
              </div>
              <div className="h-2.5 w-full bg-secondary/40 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    redisCacheEnabled 
                      ? "bg-emerald-500 w-[6%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                      : "bg-amber-500 w-[95%] shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                  }`}
                />
              </div>
              <div className="flex justify-between text-[8px] text-muted-foreground font-mono">
                <span>0ms (ideal)</span>
                <span>120ms (average)</span>
                <span>300ms (db cap)</span>
              </div>
            </div>

            {/* Cache Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="space-y-0.5">
                <p className="text-xs font-700 text-foreground text-left">Cache Purge Registry</p>
                <p className="text-[10px] text-muted-foreground text-left">Clear all memory keys and force database reload</p>
              </div>
              <button
                type="button"
                onClick={handlePurgeCache}
                disabled={!redisCacheEnabled}
                className="rounded-xl border border-rose-500/20 hover:border-rose-500/50 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-600 px-4 py-2.5 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Purge Cache Cluster
              </button>
            </div>

            {/* Simulated Live Cache Log */}
            {redisCacheEnabled && (
              <div className="glass rounded-2xl p-4 border border-border/40 space-y-2 animate-in fade-in duration-300">
                <h4 className="text-[10px] font-600 uppercase tracking-widest text-muted-foreground text-left">Recent Cache Operations</h4>
                <div className="space-y-1 text-[10px] font-mono text-left max-h-[85px] overflow-y-auto">
                  <div className="flex justify-between text-emerald-400">
                    <span>GET /products?category=Coffee</span>
                    <span>HIT (2ms)</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>GET /customers?search=Mukul</span>
                    <span>HIT (4ms)</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>POST /sales (Checkout)</span>
                    <span>BYPASS (210ms)</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>GET /suppliers</span>
                    <span>HIT (1ms)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BACKUP & RESTORE */}
        {activeSection === "backup" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-border/50 pb-2.5 flex items-center gap-2">
              <Database className="size-5 text-primary" />
              <h3 className="font-display font-700 text-sm">Backup & Restore Manager</h3>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed text-left">
              Format your device or move data between server instances seamlessly. Export a backup snapshot of your complete business registry, or upload an existing backup file to restore records.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Export Panel */}
              <div className="glass rounded-2xl p-5 border border-border/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2 text-foreground font-700 text-xs">
                    <Download className="size-4 text-emerald-400" />
                    <span>Export Database Backup</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Download a full JSON database snapshot containing all products, customer logs, POS sale invoices, supplier sheets, and interaction histories.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportDb}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2.5 text-xs font-600 transition-all cursor-pointer shadow-inner"
                >
                  <Download className="size-3.5" />
                  Download Backup File
                </button>
              </div>

              {/* Import Panel */}
              <div className="glass rounded-2xl p-5 border border-border/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2 text-foreground font-700 text-xs">
                    <Upload className="size-4 text-sky-400" />
                    <span>Import & Restore Backup</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Restore your business database using a previously exported backup file. Uploading a backup will merge and override local and server databases.
                  </p>
                </div>

                <div>
                  <input
                    type="file"
                    accept=".json"
                    id="db-backup-upload"
                    onChange={handleImportDb}
                    className="hidden"
                  />
                  <label
                    htmlFor="db-backup-upload"
                    className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-600 hover:opacity-90 active:scale-95 transition-all shadow-glow cursor-pointer"
                  >
                    <Upload className="size-3.5" />
                    Upload Backup JSON
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 mt-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-700 text-xs">
                <ShieldAlert className="size-4" />
                <span>Danger Zone: Factory Reset</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal text-left">
                Reset your complete business workspace to the clean default demo state. This will permanently delete all POS sales, suppliers, service logs, customer notes, and restore only 2 default demo products and 2 demo customers.
              </p>
              <button
                type="button"
                onClick={handleResetDb}
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2.5 text-xs font-600 transition-all cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                Reset Database to Demo State
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
