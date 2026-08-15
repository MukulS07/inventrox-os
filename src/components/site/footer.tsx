import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-[image:var(--gradient-roast)] text-sm font-bold text-roast-foreground">
              IX
            </span>
            <span className="font-display text-lg font-semibold">INVENTROX</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The operating system for modern businesses — inventory, POS, invoicing, CRM and AI
            forecasting in one platform.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Overview
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                Live demo
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>Careers</li>
            <li>Security</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Compliance</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>GST / GSTR-1 ready</li>
            <li>Row-level tenant isolation</li>
            <li>Audit trail on every write</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} INVENTROX. All rights reserved.
      </div>
    </footer>
  );
}
