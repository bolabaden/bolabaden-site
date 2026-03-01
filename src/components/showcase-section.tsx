"use client";

import Link from "next/link";
import { Section } from "./section";
import { ShowcaseItem } from "@/lib/config";
import { ExternalLink } from "lucide-react";

interface ShowcaseSectionProps {
  title: string;
  subtitle: string;
  items: ShowcaseItem[];
}

export function ShowcaseSection({
  title,
  subtitle,
  items,
}: ShowcaseSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Section id="showcase" title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const baseClasses =
            "group relative h-40 sm:h-48 rounded-xl border border-border transition-all duration-300 hover:border-primary/50 overflow-hidden";

          const contentClasses =
            "absolute inset-0 flex flex-col items-center justify-center p-4 text-center";
          const bgGradient = item.color || "from-primary/20 to-accent/20";

          if (item.type === "link" && item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                target={item.href.startsWith("/") ? undefined : "_blank"}
                rel={
                  item.href.startsWith("/") ? undefined : "noopener noreferrer"
                }
                className={`${baseClasses} bg-gradient-to-br ${bgGradient} hover:bg-gradient-to-br hover:from-primary/30 hover:to-accent/30`}
              >
                <div className={contentClasses}>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Visit
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            );
          }

          if (item.type === "embed" || item.type === "iframe") {
            const aspectRatioClass =
              item.aspectRatio === "square"
                ? "aspect-square"
                : item.aspectRatio === "video"
                  ? "aspect-video"
                  : item.aspectRatio === "wide"
                    ? "aspect-[2/1]"
                    : "aspect-auto";

            return (
              <div
                key={item.id}
                className={`${baseClasses} ${aspectRatioClass} bg-background/50 border-2 border-dashed border-border/50`}
              >
                {item.src ? (
                  <iframe
                    src={item.src}
                    title={item.title}
                    className="h-full w-full rounded-[10px]"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                ) : (
                  <div className={contentClasses}>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          }

          // Default: text/placeholder
          return (
            <div
              key={item.id}
              className={`${baseClasses} bg-gradient-to-br ${bgGradient}`}
            >
              <div className={contentClasses}>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
