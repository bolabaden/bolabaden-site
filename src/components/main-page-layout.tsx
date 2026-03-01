"use client";

import { MainNavbar } from "@/components/main-navbar";
import { MainFooter } from "@/components/main-footer";

/**
 * Shared layout for main-design pages (everything except /about).
 * Uses the emerald/slate color scheme from the modern design system.
 * The pt-28 accounts for the sticky nav with search bar.
 */
export function MainPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-main min-h-screen bg-[#0b0d10] text-slate-100">
      <MainNavbar />
      <main className="pt-8 pb-24 md:pb-0">{children}</main>
      <MainFooter />
    </div>
  );
}
