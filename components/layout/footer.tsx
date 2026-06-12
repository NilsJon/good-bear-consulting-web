"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Good Bear Consulting
            </p>
            <p className="text-xs text-muted-foreground">
              Building what's next.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/the-bear"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              The Bear
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <a
              href="mailto:nils@goodbearconsulting.se"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              nils@goodbearconsulting.se
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/[0.04]">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Good Bear Consulting. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
