"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { config } from "@/lib/config";

export function MainFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0b0d10] border-t border-slate-800/80 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-200 font-semibold text-sm">
                {config.SITE_NAME.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg font-semibold text-slate-100">
                {config.SITE_NAME}
              </span>
            </div>
            <p className="text-slate-500">
              © {new Date().getFullYear()} {config.SITE_NAME}.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-4 uppercase tracking-[0.3em]">
              Explore
            </h3>
            <ul className="space-y-2">
              {config.NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-emerald-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-4 uppercase tracking-[0.3em]">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${config.CONTACT_EMAIL}`}
                  className="hover:text-emerald-200 transition-colors"
                >
                  {config.CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={config.GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-200 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t border-slate-800/80 md:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {config.OWNER_NAME}. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 p-2 text-slate-400 hover:text-emerald-200 transition-colors rounded-lg hover:bg-slate-800/50"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
