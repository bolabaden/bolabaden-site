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
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
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
