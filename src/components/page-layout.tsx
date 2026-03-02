"use client";

import { MainNavbar } from "@/components/main-navbar";
import { MainFooter } from "@/components/main-footer";

/**
 * Main Site Page Layout - Discovery/Reference Context
 *
 * CONTEXT: Discovery/Reference Focused (non-portfolio)
 * Wraps all main-site pages (/projects, /guides, /contact, /dashboard) with consistent
 * neutral dark theme (theme-main, emerald accent), navigation, and footer.
 *
 * Uses MainNavbar with discovery-focused nav items (Contributions, Status, Playbooks, Contact).
 * Uses MainFooter with external routing and discovery language.
 *
 * Contrast: /about uses dynamic About layout with portfolio nav and footer.tsx.
 */
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-main min-h-screen bg-[#0a0a0a] text-white">
      <MainNavbar />
      <main>{children}</main>
      <MainFooter />
    </div>
  );
}
