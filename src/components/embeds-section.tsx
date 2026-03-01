"use client";

import { useState, useRef, useEffect } from "react";
import { Section } from "./section";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  description: string;
  url: string;
  height?: number;
};

interface EmbedsSectionProps {
  mode?: "default" | "hero";
}

export function EmbedsSection({ mode = "default" }: EmbedsSectionProps) {
  const defaultTab =
    config.EMBED_SERVICES[config.EMBED_SERVICES.length - 1]?.id || "homepage";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Advanced seamless iframe setup
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Apply comprehensive stealth styles
    const applyStealthStyling = () => {
      // Container styling
      const container = iframe.parentElement;
      if (container) {
        Object.assign(container.style, {
          overflow: "hidden",
          border: "none",
          margin: "0",
          padding: "0",
          background: "transparent",
        });
      }

      // Iframe styling
      Object.assign(iframe.style, {
        border: "none",
        outline: "none",
        background: "transparent",
        overflow: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        resize: "none",
        margin: "0",
        padding: "0",
      });

      // Force remove WebKit scrollbars and add seamless styling
      const style = document.createElement("style");
      style.textContent = `
        #${iframe.id || "embedded-iframe"}::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        #${iframe.id || "embedded-iframe"} {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          border: none !important;
          outline: none !important;
        }
        #${iframe.id || "embedded-iframe"}::before,
        #${iframe.id || "embedded-iframe"}::after {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

      // Try to inject CSS into iframe content (may fail due to CORS)
      iframe.addEventListener("load", () => {
        try {
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const iframeStyle = iframeDoc.createElement("style");
            iframeStyle.textContent = `
              body {
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
              body::-webkit-scrollbar {
                display: none !important;
              }
              html {
                overflow: hidden !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
              html::-webkit-scrollbar {
                display: none !important;
              }
            `;
            iframeDoc.head?.appendChild(iframeStyle);
          }
        } catch (e) {
          // CORS prevents access - this is expected for cross-origin iframes
          console.log("Cannot modify iframe content due to CORS (expected)");
        }
      });

      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    };

    // Apply on load and immediately
    const cleanup = applyStealthStyling();
    iframe.addEventListener("load", applyStealthStyling);

    // Set unique ID for styling
    if (!iframe.id) {
      iframe.id = "embedded-iframe";
    }

    return () => {
      cleanup();
      iframe.removeEventListener("load", applyStealthStyling);
    };
  }, [activeTab]);

  // Build services array from config
  const services: Service[] = config.EMBED_SERVICES.map(
    (svc: { id: any; name: any; description: any; subdomain: string }) => ({
      id: svc.id,
      name: svc.name,
      description: svc.description,
      url: config.getSubdomainUrl(svc.subdomain),
      height: 700,
    }),
  );

  const activeService = services.find((s) => s.id === activeTab) || services[0];

  const isHero = mode === "hero";
  const sectionTitle = isHero ? "Live Service Window" : "Live Services";
  const sectionSubtitle = isHero
    ? "Start on a real-time embedded service surface, then branch into focused areas below."
    : "Embedded, read-only views of self-hosted services";

  return (
    <Section
      id="embeds"
      title={sectionTitle}
      subtitle={sectionSubtitle}
      background="muted"
      size={isHero ? "lg" : "md"}
    >
      <div
        className={cn(
          "glass rounded-lg",
          isHero ? "border border-primary/25 p-5 md:p-6" : "p-4",
        )}
      >
        {/* Tab Navigation */}
        <div
          className={cn(
            "mb-6 flex flex-wrap gap-2 border-b border-border",
            isHero && "pb-2",
          )}
        >
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                isHero
                  ? "rounded-full border border-transparent"
                  : "rounded-t-lg",
                activeTab === service.id
                  ? "text-primary border-primary bg-primary/10"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
              )}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* Service Info */}
        <div className={cn("mb-4", isHero && "mb-5 flex flex-col gap-1")}>
          <h3
            className={cn(
              "font-semibold text-foreground",
              isHero ? "text-xl" : "text-lg",
            )}
          >
            {activeService.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeService.description}
          </p>
          <a
            href={activeService.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-sm text-primary transition-colors hover:text-primary/80",
              isHero &&
                "inline-flex w-fit items-center rounded-full border border-primary/35 bg-primary/10 px-3 py-1",
            )}
          >
            Open in new tab →
          </a>
        </div>

        {/* Completely Seamless Iframe */}
        <div className="relative seamless-iframe-container">
          <iframe
            ref={iframeRef}
            src={activeService.url}
            title={activeService.name}
            className={cn(
              "seamless-iframe w-full",
              isHero
                ? "h-[66vh] min-h-105 sm:h-[68vh] sm:min-h-125 lg:h-[72vh] xl:h-[74vh] rounded-lg border border-border/70"
                : "h-screen min-h-200",
            )}
            scrolling="no"
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
            allow="fullscreen; camera; microphone; geolocation; payment; autoplay; encrypted-media"
          />
        </div>
      </div>
    </Section>
  );
}
