'use client'

import Link from 'next/link'
import { Github, Mail, ArrowUp } from 'lucide-react'
import { config } from '@/lib/config'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-secondary/20 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{config.SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {config.JOB_SUBTITLE} building and sharing technical solutions.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={config.GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`Visit ${config.OWNER_NAME}'s GitHub profile`}
              >
                <Github className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={`mailto:${config.CONTACT_EMAIL}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`Send email to ${config.OWNER_NAME}`}
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/#embeds"
                  className="hover:text-primary transition-colors"
                >
                  Infrastructure & Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="hover:text-primary transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="hover:text-primary transition-colors"
                >
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={config.GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`mailto:${config.CONTACT_EMAIL}`}
                  className="hover:text-primary transition-colors"
                >
                  {config.CONTACT_EMAIL}
                </Link>
              </li>
              <li>{config.LOCATION}</li>
              <li>{config.TIMEZONE}</li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {config.OWNER_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <button
              onClick={scrollToTop}
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Scroll to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
} 