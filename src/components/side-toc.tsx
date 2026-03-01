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
        className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 md:block xl:left-6"
      >
        <nav className="pointer-events-auto glass w-56 rounded-2xl border border-primary/20 p-3 shadow-2xl">
          <p className="mb-3 px-2 text-xs font-semibold tracking-wide text-primary/90 uppercase">
            Sections
          </p>

          <ul className="space-y-1.5">
            {visibleItems.map((item, index) => {
              const isActive = item.id === activeId;
              const isReached = activeIndex >= 0 && index <= activeIndex;

              return (
                <li key={item.id}>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      scale: isActive ? 1.07 : isReached ? 1.02 : 1,
                      x: isActive ? 4 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-all duration-300 focus-ring",
                      isActive
                        ? "bg-primary/18 text-foreground"
                        : isReached
                          ? "bg-primary/10 text-foreground/90"
                          : "text-muted-foreground hover:bg-primary/8 hover:text-foreground",
                    )}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-all duration-300",
                        isActive
                          ? "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.9)]"
                          : isReached
                            ? "bg-primary/70"
                            : "bg-muted-foreground/40 group-hover:bg-primary/60",
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate font-medium">{item.label}</span>
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
        <nav className="pointer-events-auto glass rounded-2xl border border-primary/20 px-2 py-2 shadow-2xl">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {visibleItems.map((item, index) => {
              const isActive = item.id === activeId;
              const isReached = activeIndex >= 0 && index <= activeIndex;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  animate={{
                    scale: isActive ? 1.06 : isReached ? 1.02 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 focus-ring",
                    isActive
                      ? "border-primary/70 bg-primary/20 text-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                      : isReached
                        ? "border-primary/45 bg-primary/12 text-foreground/90"
                        : "border-border bg-background/55 text-muted-foreground",
                  )}
                  aria-current={isActive ? "location" : undefined}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
