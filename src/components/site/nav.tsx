import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Platform" },
  { to: "/pricing", label: "Pricing" },
  { to: "/dashboard", label: "Live demo" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-[image:var(--gradient-roast)] text-sm font-bold text-roast-foreground">
            IX
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">INVENTROX</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/contact">Talk to sales</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard">Start free</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-muted-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 px-5 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Button className="mt-2 w-full" asChild>
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              Start free
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
