"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getHealthColor } from "@/lib/dashboard-utils";
import {
  Cpu,
  HardDrive,
  Clock,
  BarChart,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

interface StatusCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  suffix?: string;
  inverse?: boolean;
  description?: string;
  href?: string;
}

export function StatusCard({
  title,
  value,
  icon: Icon,
  trend,
  suffix = "",
  inverse = false,
  description,
  href,
}: StatusCardProps) {
  const [expanded, setExpanded] = useState(false);
  const displayValue = typeof value === "number" ? value : value;
  const colorClass =
    typeof value === "number" ? getHealthColor(value, inverse) : "text-primary";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-lg p-5 hover:bg-white/5 transition-all duration-300"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-md">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {trend !== undefined && (
              <div className={trend >= 0 ? "text-green-500" : "text-red-500"}>
                <span className="text-xs">
                  {trend >= 0 ? "+" : ""}
                  {trend}%
                </span>
              </div>
            )}
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        <div className="flex items-end gap-1">
          <span className={`text-2xl font-bold ${colorClass}`}>
            {displayValue}
          </span>
          {suffix && (
            <span className="text-xs text-muted-foreground mb-1 ml-1">
              {suffix}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (description || href) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 border-t border-border pt-3"
          >
            {description && (
              <p className="text-xs text-muted-foreground mb-2">
                {description}
              </p>
            )}
            {href && (
              <a
                href={href}
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
              >
                Open details <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function StatusCardGrid({ stats }: { stats: any }) {
  const cards: StatusCardProps[] = [
    {
      title: "System Uptime",
      value: stats.avgUptime,
      icon: Clock,
      suffix: "%",
      trend: 0.3,
      inverse: true,
      description:
        "Service availability averaged across all monitored services.",
      href: "/dashboard",
    },
    {
      title: "Services Online",
      value: `${stats.onlineServices}/${stats.totalServices}`,
      icon: BarChart,
      trend: 0,
      description:
        "Currently healthy services compared to total discovered services.",
      href: "/about#embeds",
    },
    {
      title: "CPU Usage",
      value: stats.avgCpu,
      icon: Cpu,
      suffix: "%",
      trend: -1.5,
      description: "Average CPU utilization across active services.",
      href: "/dashboard",
    },
    {
      title: "Memory Usage",
      value: stats.avgMemory,
      icon: HardDrive,
      suffix: "%",
      trend: 2.1,
      description: "Average memory pressure across active services.",
      href: "/dashboard",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatusCard key={card.title} {...card} />
      ))}
    </div>
  );
}
