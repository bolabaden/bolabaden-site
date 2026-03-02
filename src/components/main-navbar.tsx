"use client";

/**
 * Discovery/Reference-focused navigation for main site pages.
 *
 * CONTEXT: Discovery/Reference (non-portfolio)
 * Renders discovery-focused navigation items (Contributions, Status, Playbooks, Contact)
 * with external routing to dedicated pages (/projects, /dashboard, /guides, /contact).
 * Used on /projects, /guides, /contact, /dashboard, and home page.
 *
 * Contrast: AboutNavigation uses internal anchors to portfolio section navigation.
 */

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
      className={`px-3 py-1.5 text-sm transition-colors duration-150 ${
        isActive ? "text-white font-medium" : "text-zinc-400 hover:text-white"
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
    <header className="sticky top-0 z-40 bg-[#0a0a0a] border-b border-[#1f1f1f]">
      {/* SearXNG search bar */}
      <div className="border-b border-[#161616]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 h-9"
            aria-label={config.NAV_SEARCH_FORM_ARIA}
          >
            <Search
              className="h-3.5 w-3.5 text-zinc-600 shrink-0"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={config.NAV_SEARCH_INPUT_PLACEHOLDER}
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
              aria-label={config.NAV_SEARCH_INPUT_ARIA}
            />
            <button
              type="submit"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2"
            >
              {config.NAV_SEARCH_BUTTON_LABEL}
            </button>
            <span className="text-[10px] font-semibold text-zinc-600 border border-[#2a2a2a] rounded px-1.5 py-0.5 shrink-0">
              {config.NAV_SEARCH_TAG}
            </span>
          </form>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 font-semibold text-white tracking-tight text-[15px]"
          >
            {config.SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {config.NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </div>

          {/* About */}
          <div className="hidden md:block">
            <Link
              href="/about"
              className="text-sm font-medium text-white border border-[#2f2f2f] hover:border-[#444] rounded-md px-4 py-1.5 transition-colors"
            >
              {config.NAV_ABOUT_BUTTON_LABEL}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            <svg
              className="h-5 w-5"
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#1f1f1f] bg-[#0a0a0a]">
          <div className="px-4 py-4 space-y-1">
            {config.NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
            <div className="pt-3 mt-2 border-t border-[#1f1f1f]">
              <Link
                href="/about"
                className="block px-3 py-2 text-sm font-medium text-white border border-[#2f2f2f] rounded-md text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {config.NAV_ABOUT_BUTTON_LABEL}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
