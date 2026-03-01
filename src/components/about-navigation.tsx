"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Github, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

function AboutNavLink({
  href,
  label,
  pathname,
  onClick,
  className,
}: {
  href: string;
  label: string;
  pathname: string | null;
  onClick?: () => void;
  className?: string;
}) {
  const currentPathname = pathname ?? "";
  const isActive = href === currentPathname;

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "transition-colors focus-ring rounded-md px-2 py-1",
        isActive
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function AboutNavigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    window.open(
      config.getSearxngSearchResolverUrl(searchQuery.trim()),
      "_blank",
      "noopener,noreferrer",
    );

    setSearchQuery("");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "glass backdrop-blur-lg shadow-lg",
      )}
    >
      <div className="border-b border-primary/30 bg-primary/10">
        <div className="container mx-auto px-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 py-5"
            aria-label={config.NAV_SEARCH_FORM_ARIA}
          >
            <span className="shrink-0 rounded-md border border-primary/40 bg-primary/20 px-2 py-1 text-[11px] font-semibold text-primary">
              {config.NAV_SEARCH_TAG}
            </span>
            <Search
              className="h-4 w-4 text-primary shrink-0"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={config.NAV_SEARCH_INPUT_PLACEHOLDER}
              className="w-full rounded-md border border-primary/30 bg-background/70 px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
              aria-label={config.NAV_SEARCH_INPUT_ARIA}
            />
            <button
              type="submit"
              className="shrink-0 rounded-md border border-primary/40 bg-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/30"
            >
              {config.NAV_SEARCH_BUTTON_LABEL}
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/about"
            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            {config.SITE_NAME}
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {config.ABOUT_NAV_ITEMS.map((item) => (
              <AboutNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
            <span className="rounded-full border border-primary/35 bg-primary/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/90">
              About Space
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={config.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md p-2"
              aria-label="GitHub profile (opens in new tab)"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors focus-ring"
            >
              Exit About
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="md:hidden text-foreground hover:text-primary transition-colors focus-ring rounded-md p-2"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass backdrop-blur-lg border-t border-border"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-3">
                {config.ABOUT_NAV_ITEMS.map((item) => (
                  <AboutNavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-left py-2"
                  />
                ))}
                <div className="flex items-center space-x-4 pt-4 border-t border-border">
                  <Link
                    href={config.GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md p-2"
                    aria-label="GitHub profile"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors focus-ring"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Exit About
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
