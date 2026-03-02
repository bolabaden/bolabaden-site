"use client";

/**
 * Shared component for live service embeds (Research Wizard, etc).
 *
 * CONTEXT: Shared/Multi-Context
 * Used in three distinct places with different framing:
 *
 *   Portfolio (/about, id="embeds"): Emphasises real-time, self-hosted
 *     infrastructure as production-quality portfolio evidence.
 *   Home page (/): Showcases live services in the homepage discover section.
 *   Dashboard (/dashboard, id="embeds"): Infrastructure monitoring context,
 *     surfacing operational service status alongside metrics.
 *
 * Accepts a "mode" prop to allow callers to control rendering behaviour.
 * Contrast: About uses id="embeds" anchor; Dashboard wraps it in its own section.
 */

import { useMemo } from "react";
import { config } from "@/lib/config";

type Service = {
  id: string;
  name: string;
  description: string;
  subdomain: string;
};

interface EmbedsSectionProps {
  mode?: "default" | "hero";
}

export function EmbedsSection({ mode = "default" }: EmbedsSectionProps) {
  const researchWizardService = useMemo(() => {
    const embedServices = config.EMBED_SERVICES as Service[];

    return (
      embedServices.find(
        (service) => service.subdomain?.toLowerCase() === "gptr",
      ) ||
      embedServices.find((service) =>
        service.name.toLowerCase().includes("research wizard"),
      ) ||
      embedServices[0]
    );
  }, []);

  const iframeUrl = config.getSubdomainUrl(researchWizardService.subdomain);
  const iframeTitle = researchWizardService.name;
  const iframeHeightClass =
    mode === "hero"
      ? "h-[72vh] min-h-[760px]"
      : "h-[70vh] min-h-[700px] md:h-[72vh]";

  return (
    <section id="embeds" aria-label="Embedded service" className="w-full">
      <iframe
        src={iframeUrl}
        title={iframeTitle}
        className={`block w-full border-0 bg-transparent p-0 m-0 shadow-none outline-none ${iframeHeightClass}`}
        scrolling="no"
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
        allow="fullscreen; camera; microphone; geolocation; payment; autoplay; encrypted-media"
      />
    </section>
  );
}
