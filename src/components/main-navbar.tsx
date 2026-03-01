"use client";

import { useState, useCallback, FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { config } from "@/lib/config";

function NavLink({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string | null;
  onClick?: () => void;
}) {
  const currentPathname = pathname ?? "";
  const isHashLink = href.includes("#");
  const isActive =
    href === currentPathname ||
    (href === "/" && currentPathname === "/") ||
    (!isHashLink && href !== "/" && currentPathname.startsWith(href));

  const handleClick = useCallback(() => {
    if (isHashLink) {
      const [pagePath, hash] = href.split("#");
      if (
        !pagePath || pagePath === "/"
          ? currentPathname === "/"
          : currentPathname === pagePath
      ) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          onClick?.();
          return;
        }
      }
    }
    onClick?.();
  }, [href, currentPathname, onClick, isHashLink]);

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive ? "text-emerald-300" : "text-slate-300 hover:text-emerald-200"
      }`}
    >
      {label}
    </Link>
  );
}

export function MainNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0d10]/90 backdrop-blur">
      {/* SearXNG search bar */}
      <div className="border-b border-emerald-400/20 bg-emerald-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 py-2.5"
            aria-label={config.NAV_SEARCH_FORM_ARIA}
          >
            <span className="shrink-0 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-300">
              {config.NAV_SEARCH_TAG}
            </span>
            <Search
              className="h-4 w-4 text-emerald-400/60 shrink-0"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={config.NAV_SEARCH_INPUT_PLACEHOLDER}
              className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              aria-label={config.NAV_SEARCH_INPUT_ARIA}
            />
            <button
              type="submit"
              className="shrink-0 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
            >
              {config.NAV_SEARCH_BUTTON_LABEL}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="font-semibold tracking-tight text-slate-100 text-2xl">
              {config.SITE_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {config.NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                />
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/about"
              className="rounded-md border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
            >
              {config.NAV_ABOUT_BUTTON_LABEL}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className="text-slate-200 hover:text-emerald-200 focus:outline-none focus:text-emerald-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#0b0d10] border-t border-slate-800/80">
            {config.NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
            <Link
              href="/about"
              className="border border-emerald-400/40 text-emerald-200 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              {config.NAV_ABOUT_BUTTON_LABEL}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
