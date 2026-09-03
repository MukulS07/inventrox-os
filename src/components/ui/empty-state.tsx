import React from "react";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  illustration: "cart" | "document" | "users" | "package" | "suppliers" | "search";
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  illustration,
  actionText,
  onAction,
}) => {
  // Render high-fidelity premium inline SVGs with animations and color gradients
  const renderIllustration = () => {
    switch (illustration) {
      case "cart":
        return (
          <svg className="w-24 h-24 text-accent/80 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="opacity-20" />
            <path d="M30 40H74L68 64H36L30 40Z" stroke="url(#cart-grad)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M22 30H30L36 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="40" cy="74" r="5" fill="currentColor" />
            <circle cx="64" cy="74" r="5" fill="currentColor" />
            <line x1="47" y1="46" x2="57" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="52" y1="41" x2="52" y2="51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="cart-grad" x1="30" y1="40" x2="74" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor="oklch(var(--primary))" />
                <stop offset="1" stopColor="oklch(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        );
      case "document":
        return (
          <svg className="w-24 h-24 text-primary/80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="20" width="40" height="60" rx="6" stroke="url(#doc-grad)" strokeWidth="2.5" />
            <path d="M40 35H60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
            <path d="M40 45H60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
            <path d="M40 55H52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
            <circle cx="65" cy="65" r="16" fill="black" stroke="currentColor" strokeWidth="2" />
            <path d="M61 65H69" stroke="oklch(var(--accent))" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M65 61V69" stroke="oklch(var(--accent))" strokeWidth="2.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="doc-grad" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="oklch(var(--primary))" />
                <stop offset="1" stopColor="oklch(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        );
      case "users":
        return (
          <svg className="w-24 h-24 text-accent/80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="38" cy="40" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M20 65C20 54 28 48 38 48C48 48 56 54 56 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            <circle cx="62" cy="45" r="8" stroke="url(#user-grad)" strokeWidth="2" />
            <path d="M48 68C48 60 54 55 62 55C70 55 76 60 76 68" stroke="url(#user-grad)" strokeWidth="2" strokeLinecap="round" />
            
            <line x1="82" y1="36" x2="90" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="86" y1="32" x2="86" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="user-grad" x1="48" y1="45" x2="76" y2="68" gradientUnits="userSpaceOnUse">
                <stop stopColor="oklch(var(--primary))" />
                <stop offset="1" stopColor="oklch(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        );
      case "package":
        return (
          <svg className="w-24 h-24 text-primary/80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15L80 30L50 45L20 30L50 15Z" stroke="url(#pkg-grad)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M20 30V65L50 80" stroke="url(#pkg-grad)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M80 30V65L50 80" stroke="url(#pkg-grad)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M50 45V80" stroke="currentColor" strokeWidth="2" className="opacity-30" />
            <circle cx="50" cy="50" r="12" fill="black" stroke="oklch(var(--accent))" strokeWidth="2" />
            <line x1="45" y1="50" x2="55" y2="50" stroke="oklch(var(--accent))" strokeWidth="2" />
            <defs>
              <linearGradient id="pkg-grad" x1="20" y1="15" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="oklch(var(--primary))" />
                <stop offset="1" stopColor="oklch(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        );
      case "suppliers":
        return (
          <svg className="w-24 h-24 text-accent/80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 40H60V70H20V40Z" stroke="url(#sup-grad)" strokeWidth="2.5" />
            <path d="M60 48H74L82 58V70H60V48Z" stroke="url(#sup-grad)" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="32" cy="76" r="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="70" cy="76" r="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="84" cy="40" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" className="opacity-40" />
            <defs>
              <linearGradient id="sup-grad" x1="20" y1="40" x2="82" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="oklch(var(--primary))" />
                <stop offset="1" stopColor="oklch(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        );
      case "search":
      default:
        return (
          <svg className="w-24 h-24 text-primary/70 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45" cy="45" r="20" stroke="url(#search-grad)" strokeWidth="2.5" />
            <path d="M59 59L80 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="45" cy="45" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-15" />
            <defs>
              <linearGradient id="search-grad" x1="25" y1="25" x2="65" y2="65" gradientUnits="userSpaceOnUse">
                <stop stopColor="oklch(var(--primary))" />
                <stop offset="1" stopColor="oklch(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[320px] rounded-3xl border border-border/40 bg-card/15 shadow-inner relative overflow-hidden backdrop-blur-md transition-all duration-300">
      {/* Ambient background glow orb */}
      <div className="absolute size-36 bg-primary/5 rounded-full blur-[40px] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      
      <div className="mb-5 flex justify-center filter drop-shadow-[0_0_15px_rgba(var(--primary),0.1)]">
        {renderIllustration()}
      </div>
      
      <h3 className="font-display font-700 text-sm text-foreground mb-1.5 tracking-tight">
        {title}
      </h3>
      
      <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border/60 hover:border-primary/40 hover:bg-secondary text-foreground px-4 py-2 text-xs font-600 transition-all active:scale-95 shadow-sm group cursor-pointer"
        >
          <span>{actionText}</span>
          <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </button>
      )}
    </div>
  );
};
