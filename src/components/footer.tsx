"use client";

import Link from "next/link";
import { Github, Mail, ArrowUp } from "lucide-react";
import { config } from "@/lib/config";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t bg-secondary/20 border-border">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{config.SITE_NAME}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {config.JOB_SUBTITLE} building and sharing technical solutions.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={config.GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-muted-foreground hover:text-primary"
                aria-label={`Visit ${config.OWNER_NAME}'s GitHub profile`}
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={`mailto:${config.CONTACT_EMAIL}`}
                className="transition-colors text-muted-foreground hover:text-primary"
                aria-label={`Send email to ${config.OWNER_NAME}`}
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about#embeds"
                  className="transition-colors hover:text-primary"
                >
                  Infrastructure & Services
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="transition-colors hover:text-primary"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="transition-colors hover:text-primary"
                >
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={config.GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="transition-colors hover:text-primary"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/about#about"
                  className="transition-colors hover:text-primary"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`mailto:${config.CONTACT_EMAIL}`}
                  className="transition-colors hover:text-primary"
                >
                  {config.CONTACT_EMAIL}
                </Link>
              </li>
              <li>{config.LOCATION}</li>
              <li>{config.TIMEZONE}</li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-primary"
                >
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t border-border md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {config.OWNER_NAME}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              href="/contact"
              className="text-sm transition-colors text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 transition-colors rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/50"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Scroll to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
