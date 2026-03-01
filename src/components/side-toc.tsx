"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

interface SideTocProps {
  items: TocItem[];
}

const NAVBAR_OFFSET_PX = 116;

function getActiveSectionId(items: TocItem[]): string {
  if (typeof window === "undefined") return items[0]?.id ?? "";

  const threshold = NAVBAR_OFFSET_PX + 24;
  let activeId = items[0]?.id ?? "";

  for (const item of items) {
    const el = document.getElementById(item.id);
    if (!el) continue;

    const top = el.getBoundingClientRect().top;
    if (top <= threshold) {
      activeId = item.id;
    } else {
      break;
    }
  }

  return activeId;
}

export function SideToc({ items }: SideTocProps) {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleItems = useMemo(() => {
    if (!mounted || typeof document === "undefined") return items;

    const existing = items.filter((item) => document.getElementById(item.id));
    return existing.length > 0 ? existing : items;
  }, [items, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const updateActive = () => {
      const next = getActiveSectionId(visibleItems);
      if (next) setActiveId(next);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [mounted, visibleItems]);

  const activeIndex = visibleItems.findIndex((item) => item.id === activeId);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!mounted || visibleItems.length === 0) return null;

  return (
    <>
      <aside
        aria-label="Section table of contents"
        className="pointer-events-none fixed left-3 top-32 bottom-4 z-40 hidden md:block xl:left-6"
      >
        <nav
          className="pointer-events-auto relative h-full w-28"
          aria-label="Sections timeline"
        >
          <span
            aria-hidden="true"
            className="absolute left-6 top-0 bottom-0 w-px bg-primary/30"
          />

          <ul className="relative flex h-full flex-col justify-between py-2">
            {visibleItems.map((item, index) => {
              const isActive = item.id === activeId;
              const isReached = activeIndex >= 0 && index <= activeIndex;

              return (
                <li key={item.id} className="relative pl-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    animate={{
                      scale: isActive ? 1.1 : isReached ? 1.03 : 1,
                      x: isActive ? 3 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "group relative flex w-full items-center rounded-full px-2 py-5 text-left transition-all duration-300 focus-ring",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-label={`Jump to ${item.label} section`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span
                      className={cn(
                        "relative z-10 ml-4 h-2.5 w-2.5 rounded-full transition-all duration-300",
                        isActive
                          ? "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.9)]"
                          : isReached
                            ? "bg-primary/70"
                            : "bg-muted-foreground/40 group-hover:bg-primary/60 group-focus-visible:bg-primary/60",
                      )}
                      aria-hidden="true"
                    >
                      <span
                        className={cn(
                          "pointer-events-none absolute left-1/2 -top-4 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium transition-all duration-300",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground/80 group-hover:text-foreground/90",
                        )}
                      >
                        {item.label}
                      </span>
                    </span>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <aside
        aria-label="Quick section navigation"
        className="pointer-events-none fixed inset-x-2 bottom-3 z-40 md:hidden"
      >
        <nav className="pointer-events-auto rounded-2xl bg-background/85 px-3 py-2 backdrop-blur-xl">
          <div className="relative flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span
              aria-hidden="true"
              className="absolute left-3 right-3 top-1/2 z-0 h-px -translate-y-1/2 bg-primary/30"
            />
            {visibleItems.map((item, index) => {
              const isActive = item.id === activeId;
              const isReached = activeIndex >= 0 && index <= activeIndex;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  animate={{
                    scale: isActive ? 1.12 : isReached ? 1.03 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "group relative z-10 shrink-0 rounded-full px-2 py-3 transition-all duration-300 focus-ring",
                    isActive
                      ? "text-foreground"
                      : isReached
                        ? "text-foreground/90"
                        : "text-muted-foreground",
                  )}
                  aria-label={`Jump to ${item.label} section`}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span
                    className={cn(
                      "block h-2.5 w-2.5 rounded-full transition-all duration-300",
                      isActive
                        ? "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.7)]"
                        : isReached
                          ? "bg-primary/70"
                          : "bg-muted-foreground/40 group-hover:bg-primary/60",
                    )}
                    aria-hidden="true"
                  />
                  {isActive && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1.5 whitespace-nowrap text-[10px] font-medium text-primary">
                      {item.label}
                    </span>
                  )}
                  <span className="sr-only">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
