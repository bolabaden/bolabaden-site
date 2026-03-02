"use client";

import { config } from "@/lib/config";
import { Mail, Github, ArrowRight } from "lucide-react";
import { contactInfo } from "@/lib/data";

/**
 * ABOUT-ONLY Contact Section
 * Portfolio-focused contact intro emphasizing collaboration & discussion
 * Main contact page uses generic ContactSection for broader audience
 */
export function AboutContactSection() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4">
        Reach Out
      </p>
      <h1 className="text-3xl font-semibold text-foreground mb-3">
        Let's discuss your challenge
      </h1>
      <p className="text-muted-foreground mb-12 max-w-lg leading-relaxed">
        I'm interested in discussing infrastructure projects, technical
        partnerships, and complex system design problems. Email is the fastest
        way to start a conversation.
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
            Best <ArrowRight className="inline h-3 w-3 ml-1" />
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
              See open source work &amp; activity
            </p>
          </div>
        </a>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-10 text-center text-sm text-muted-foreground">
        <p>
          Best way forward: send an email with a brief description of the
          infrastructure challenge or opportunity you have in mind.
        </p>
      </div>
    </div>
  );
}
