"use client";

/**
 * Generic contact form section for main site discovery context.
 *
 * CONTEXT: Discovery/Reference (non-portfolio)
 * Renders on /contact page for general reach-out communication.
 * NOT portfolio-focused discussion (no enterprise/collaboration emphasis).
 *
 * For portfolio-specific contact/discussion, see AboutContactSection (/about#contact):
 * - AboutContactSection emphasizes infrastructure challenges, collaboration, partnerships
 * - ContactSection is generic "get in touch" channel
 */

import { config } from "@/lib/config";
import { Mail, Github, Clock, MapPin } from "lucide-react";
import { contactInfo } from "@/lib/data";

export function ContactSection() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4">
        Contact
      </p>
      <h1 className="text-3xl font-semibold text-foreground mb-3">
        Get in touch
      </h1>
      <p className="text-muted-foreground mb-12 max-w-lg leading-relaxed">
        Email is the best way to reach me. I typically respond within 24 hours.
        Prefer async communication and written follow-ups.
      </p>

      {/* Primary actions */}
      <div className="space-y-3 mb-14">
        <a
          href={`mailto:${contactInfo.email}`}
          className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/40 bg-secondary/30 hover:bg-secondary/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {contactInfo.email}
              </p>
            </div>
          </div>
          <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Preferred
          </span>
        </a>

        <a
          href={contactInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/40 bg-secondary/30 hover:bg-secondary/50 transition-all"
        >
          <div className="p-2 rounded-md bg-primary/10">
            <Github className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">GitHub</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Open source projects &amp; code
            </p>
          </div>
        </a>
      </div>

      {/* Info grid */}
      <div className="border-t border-border pt-10">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-6">
          Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-secondary/50 mt-0.5">
              <MapPin
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Location</p>
              <p className="text-sm font-medium text-foreground">
                {contactInfo.location}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-secondary/50 mt-0.5">
              <Clock
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Timezone</p>
              <p className="text-sm font-medium text-foreground">
                {contactInfo.timezone}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-secondary/50 mt-0.5">
              <Mail
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Response time
              </p>
              <p className="text-sm font-medium text-foreground">
                Within 24 hours
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-secondary/50 mt-0.5">
              <Github
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Availability
              </p>
              <p className="text-sm font-medium text-foreground capitalize">
                {contactInfo.availability.replace("-", " ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Communication preferences */}
      <div className="border-t border-border pt-10 mt-10">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4">
          Communication
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Preferred
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>Email for detailed discussions</li>
              <li>Written specs and documentation</li>
              <li>Async across time zones</li>
              <li>Text-based chat for quick questions</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Limited</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>Phone calls by appointment only</li>
              <li>Video for initial or complex meetings</li>
              <li>Always prefer written follow-ups</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-border pt-10 mt-10">
        <a
          href={`mailto:${contactInfo.email}?subject=Project%20Inquiry`}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium text-sm px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Send an email
        </a>
      </div>
    </div>
  );
}
