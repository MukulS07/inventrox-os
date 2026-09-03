import { useState, useEffect, useRef } from "react";
import {
  Search,
  LayoutDashboard,
  Boxes,
  Users,
  Settings,
  ShoppingCart,
  FileText,
  Sparkles,
  Command,
  FileSpreadsheet,
  HeartHandshake,
  BarChart3,
  Clock,
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "Navigation" | "Actions" | "Themes" | "Quick Queries" | "Recent Views";
  label: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onOpenAiAssistant,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentViews, setRecentViews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recently visited pages on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);

      const recentStr = localStorage.getItem("inv_recent_tabs");
      if (recentStr) {
        try {
          const parsed = JSON.parse(recentStr);
          if (Array.isArray(parsed)) {
            setRecentViews(parsed);
          }
        } catch (e) {
          console.error("Error parsing recent views:", e);
        }
      }
    }
  }, [isOpen]);

  // Tab mapping for recent views resolving
  const tabItemsMap: { [key: string]: { label: string; icon: React.ComponentType<any>; action: () => void } } = {
    Dashboard: {
      label: "Dashboard Home",
      icon: LayoutDashboard,
      action: () => {
        setActiveTab("Dashboard");
        onClose();
      },
    },
    Inventory: {
      label: "Inventory Catalog",
      icon: Boxes,
      action: () => {
        setActiveTab("Inventory");
        onClose();
      },
    },
    Customers: {
      label: "Customers Registry",
      icon: Users,
      action: () => {
        setActiveTab("Customers");
        onClose();
      },
    },
    POS: {
      label: "POS Billing Console",
      icon: ShoppingCart,
      action: () => {
        setActiveTab("POS");
        onClose();
      },
    },
    Invoices: {
      label: "Invoices Ledger",
      icon: FileText,
      action: () => {
        setActiveTab("Invoices");
        onClose();
      },
    },
    Settings: {
      label: "System Settings",
      icon: Settings,
      action: () => {
        setActiveTab("Settings");
        onClose();
      },
    },
    Reports: {
      label: "Reports Center",
      icon: FileSpreadsheet,
      action: () => {
        setActiveTab("Reports");
        onClose();
      },
    },
    CRM: {
      label: "Client Profiles & Scheduling",
      icon: HeartHandshake,
      action: () => {
        setActiveTab("CRM");
        onClose();
      },
    },
    Analytics: {
      label: "Analytics Hub",
      icon: BarChart3,
      action: () => {
        setActiveTab("Analytics");
        onClose();
      },
    },
    "AI Assistant": {
      label: "AI Orchestration Panel",
      icon: Sparkles,
      action: () => {
        setActiveTab("AI Assistant");
        onClose();
      },
    },
  };

  const items: CommandItem[] = [
    {
      id: "nav-dash",
      category: "Navigation",
      label: "Go to Dashboard Home",
      icon: LayoutDashboard,
      action: () => {
        setActiveTab("Dashboard");
        onClose();
      },
    },
    {
      id: "nav-inv",
      category: "Navigation",
      label: "Go to Inventory",
      icon: Boxes,
      action: () => {
        setActiveTab("Inventory");
        onClose();
      },
    },
    {
      id: "nav-cust",
      category: "Navigation",
      label: "Go to Customers CRM",
      icon: Users,
      action: () => {
        setActiveTab("Customers");
        onClose();
      },
    },
    {
      id: "nav-pos",
      category: "Navigation",
      label: "Open POS Billing",
      icon: ShoppingCart,
      action: () => {
        setActiveTab("POS");
        onClose();
      },
    },
    {
      id: "nav-invoices",
      category: "Navigation",
      label: "Open Invoices Ledger",
      icon: FileText,
      action: () => {
        setActiveTab("Invoices");
        onClose();
      },
    },
    {
      id: "nav-reports",
      category: "Navigation",
      label: "Go to Reports Center",
      icon: FileSpreadsheet,
      action: () => {
        setActiveTab("Reports");
        onClose();
      },
    },
    {
      id: "nav-crm",
      category: "Navigation",
      label: "Open CRM & Service Scheduling",
      icon: HeartHandshake,
      action: () => {
        setActiveTab("CRM");
        onClose();
      },
    },
    {
      id: "nav-analytics",
      category: "Navigation",
      label: "Open Analytics Hub",
      icon: BarChart3,
      action: () => {
        setActiveTab("Analytics");
        onClose();
      },
    },
    {
      id: "nav-settings",
      category: "Navigation",
      label: "Open Settings",
      icon: Settings,
      action: () => {
        setActiveTab("Settings");
        onClose();
      },
    },
    {
      id: "action-addprod",
      category: "Actions",
      label: "Add New Product to Catalog",
      shortcut: "N",
      icon: Boxes,
      action: () => {
        setActiveTab("Inventory");
        setTimeout(() => {
          const btn = document.getElementById("add-product-btn");
          if (btn) btn.click();
        }, 100);
        onClose();
      },
    },
    {
      id: "action-addcust",
      category: "Actions",
      label: "Add New Customer to CRM",
      shortcut: "C",
      icon: Users,
      action: () => {
        setActiveTab("Customers");
        setTimeout(() => {
          const btn = document.getElementById("add-customer-btn");
          if (btn) btn.click();
        }, 100);
        onClose();
      },
    },
    {
      id: "query-lowstock",
      category: "Quick Queries",
      label: "AI Query: What is low on stock?",
      icon: Sparkles,
      action: () => {
        onOpenAiAssistant("What is low on stock?");
        onClose();
      },
    },
    {
      id: "query-rev",
      category: "Quick Queries",
      label: "AI Query: Show today's sales velocity",
      icon: Sparkles,
      action: () => {
        onOpenAiAssistant("Show today's sales velocity");
        onClose();
      },
    },
  ];

  // Base fuzzy filtering
  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Generate "Recent Views" items if query is empty
  const recentCommandItems: CommandItem[] =
    !query && recentViews.length > 0
      ? recentViews
          .map((tabName) => {
            const mapping = tabItemsMap[tabName];
            if (!mapping) return null;
            return {
              id: `recent-${tabName}`,
              category: "Recent Views" as const,
              label: `Jump back to ${mapping.label}`,
              icon: mapping.icon,
              action: mapping.action,
            };
          })
          .filter((item): item is CommandItem => item !== null)
      : [];

  // Combine items for rendering and keyboard navigation
  const displayedItems = [...recentCommandItems, ...filteredItems];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || displayedItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % displayedItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + displayedItems.length) % displayedItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (displayedItems[selectedIndex]) {
          displayedItems[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, displayedItems, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group by category, keeping "Recent Views" first
  const groups: { [key: string]: CommandItem[] } = {};
  displayedItems.forEach((item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
  });

  let globalIdx = 0;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 pt-[15vh] px-4 backdrop-blur-md cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div 
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card/60 shadow-card backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="relative flex items-center border-b border-border px-5 py-4">
          <Search className="size-5 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-base"
          />
          <kbd className="hidden sm:inline-flex select-none items-center gap-0.5 rounded border border-border bg-secondary/80 px-2 py-0.5 font-mono text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* List */}
        <div ref={listRef} className="max-h-[350px] overflow-y-auto px-2 py-3">
          {displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Command className="size-8 text-muted-foreground mb-2 animate-bounce" />
              <p className="text-sm font-500 text-foreground">No matches found</p>
              <p className="text-xs text-muted-foreground mt-1">Try another keyword or run an AI prompt instead.</p>
            </div>
          ) : (
            Object.entries(groups).map(([category, catItems]) => (
              <div key={category} className="mb-4 last:mb-0">
                <h3 className="px-3 py-1.5 text-[10px] font-600 uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  {category === "Recent Views" && <Clock className="size-3 text-accent" />}
                  {category}
                </h3>
                <div className="space-y-0.5">
                  {catItems.map((item) => {
                    const currentIdx = globalIdx++;
                    const isSelected = currentIdx === selectedIndex;

                    return (
                      <button
                        key={item.id}
                        data-active={isSelected}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(currentIdx)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-glow"
                            : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                        }`}
                      >
                        <item.icon className="size-4.5 shrink-0" />
                        <span className="flex-1 font-medium">{item.label}</span>
                        {item.shortcut && (
                          <kbd className={`select-none rounded border px-1.5 py-0.5 font-mono text-[10px] ${
                            isSelected 
                              ? "border-white/20 bg-white/10 text-white" 
                              : "border-border bg-secondary/60 text-muted-foreground"
                          }`}>
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
