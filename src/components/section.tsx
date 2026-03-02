/**
 * Reusable section wrapper component with consistent spacing and styling.
 *
 * CONTEXT: Shared/Context-Agnostic
 * Used in BOTH portfolio (/about) and discovery (main site) contexts.
 * Provides consistent vertical rhythm, background variants, and sizing.
 * Does NOT change behavior based on context; parent containers determine section purpose.
 */

import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  background?: "default" | "muted" | "gradient";
  size?: "sm" | "md" | "lg";
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
  background = "default",
  size = "md",
}: SectionProps) {
  const sizeClasses = {
    sm: "py-12 md:py-16",
    md: "py-16 md:py-24",
    lg: "py-20 md:py-32",
  };

  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-secondary/20",
    gradient: "bg-linear-to-br from-background to-secondary/20",
  };

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28",
        sizeClasses[size],
        backgroundClasses[background],
        className,
      )}
    >
      <div className="container mx-auto px-2">
        {(title || subtitle) && (
          <div className="mb-10 md:mb-12">
            {title && (
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
