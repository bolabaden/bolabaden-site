"use client";

import Link from "next/link";
import { config } from "@/lib/config";

export function MainFooter() {
  return (
    <footer className="border-t border-[#1f1f1f] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-semibold text-white text-sm">
              {config.SITE_NAME}
            </Link>
            <p className="mt-2 text-xs text-zinc-600">
              © {new Date().getFullYear()} {config.OWNER_NAME}
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-3">
              Explore
            </p>
            <ul className="space-y-2">
              {config.NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-3">
              Contact
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${config.CONTACT_EMAIL}`}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {config.CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={config.GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* More */}
          <div>
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-3">
              More
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Contributions
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Playbooks
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
