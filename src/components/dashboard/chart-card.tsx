"use client";

import { motion } from "framer-motion";
import { generateSparklinePoints, formatTime } from "@/lib/dashboard-utils";
import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

interface ChartCardProps {
  title: string;
  data: { timestamp: string; value: number }[];
  color?: string;
  yAxisLabel?: string;
  height?: number;
  description?: string;
  href?: string;
}

export function ChartCard({
  title,
  data,
  color = "chart-line-blue",
  yAxisLabel,
  height = 200,
  description,
  href,
}: ChartCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Get gradient class for chart fill - ONLY returns class names
  const getGradientClass = (colorClass: string): string => {
    const gradientMap: Record<string, string> = {
      "chart-line-blue": "chart-gradient-blue",
      "chart-line-green": "chart-gradient-green",
      "chart-line-purple": "chart-gradient-purple",
      "chart-line-orange": "chart-gradient-orange",
    };
    return gradientMap[colorClass] || "chart-gradient-blue";
  };
  const chartValues = data.map((item) => item.value);
  const chartWidth = 600; // Will be responsive

  const sparklinePoints = generateSparklinePoints(
    chartValues,
    chartWidth,
    height - 50,
    10,
  );
  const maxValue = Math.max(...chartValues);
  const minValue = Math.min(...chartValues);

  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
  const previousValue = data.length > 1 ? data[data.length - 2].value : 0;
  const trend = previousValue
    ? ((latestValue - previousValue) / previousValue) * 100
    : 0;
  const trendDisplay = trend.toFixed(1);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass rounded-lg p-5 hover:bg-white/5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{latestValue}</span>
          {trend !== 0 && (
            <span
              className={`text-xs ${trend > 0 ? "trend-positive" : "trend-negative"}`}
            >
              {trend > 0 ? "+" : ""}
              {trendDisplay}%
            </span>
          )}
          {(description || href) && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? "Collapse chart details" : "Expand chart details"}
              title={expanded ? "Collapse chart details" : "Expand chart details"}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      <div
        className={`relative ${height <= 150 ? "chart-container-sm" : height <= 200 ? "chart-container-md" : "chart-container-lg"}`}
      >
        {/* Y-axis label */}
        {yAxisLabel && (
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
            {yAxisLabel}
          </div>
        )}

        {/* Sparkline */}
        <svg width="100%" height="100%" className="overflow-visible">
          <defs>
            <linearGradient
              id="gradient-blue"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                className="chart-gradient-stop-blue"
                stopOpacity="0.2"
              />
              <stop
                offset="100%"
                className="chart-gradient-stop-blue"
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient
              id="gradient-green"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                className="chart-gradient-stop-green"
                stopOpacity="0.2"
              />
              <stop
                offset="100%"
                className="chart-gradient-stop-green"
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient
              id="gradient-purple"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                className="chart-gradient-stop-purple"
                stopOpacity="0.2"
              />
              <stop
                offset="100%"
                className="chart-gradient-stop-purple"
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient
              id="gradient-orange"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                className="chart-gradient-stop-orange"
                stopOpacity="0.2"
              />
              <stop
                offset="100%"
                className="chart-gradient-stop-orange"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g className="grid-lines">
            {[0, 25, 50, 75, 100].map((percent, i) => {
              const y = ((100 - percent) / 100) * (height - 40) + 20;
              return (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2="100%"
                  y2={y}
                  className="chart-grid-line"
                />
              );
            })}
          </g>

          {/* Line */}
          <polyline points={sparklinePoints} fill="none" className={color} />

          {/* Area fill */}
          <polygon
            points={`${sparklinePoints} ${chartWidth},${height - 10} 0,${height - 10}`}
            className={getGradientClass(color)}
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = 10 + (index / (data.length - 1)) * (chartWidth - 20);
            const y =
              height -
              (10 +
                ((item.value - minValue) / (maxValue - minValue || 1)) *
                  (height - 50));

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={index === data.length - 1 ? 4 : 0}
                className={
                  index === data.length - 1
                    ? color
                    : "stroke-transparent fill-transparent"
                }
                fill="currentColor"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {[0, Math.floor(data.length / 2), data.length - 1].map((index) => {
            if (data[index]) {
              return <div key={index}>{formatTime(data[index].timestamp)}</div>;
            }
            return <div key={index}></div>;
          })}
        </div>
      </div>

      {(description || href) && (
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="mt-3 border-t border-border pt-3">
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
                Open related view <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface ChartGridProps {
  historyData: any[];
}

export function ChartGrid({ historyData }: ChartGridProps) {
  const chartConfigs = [
    {
      title: "System Uptime (%)",
      key: "uptime",
      color: "chart-line-green",
      yAxisLabel: "Uptime %",
      description: "Historical uptime trend from service health checks.",
      href: "/dashboard",
    },
    {
      title: "CPU Usage (%)",
      key: "cpu",
      color: "chart-line-blue",
      yAxisLabel: "CPU %",
      description: "Average CPU trend across monitored services.",
      href: "/dashboard",
    },
    {
      title: "Memory Usage (%)",
      key: "memory",
      color: "chart-line-purple",
      yAxisLabel: "Memory %",
      description: "Memory utilization trend over recent intervals.",
      href: "/dashboard",
    },
    {
      title: "Requests per Minute",
      key: "requests",
      color: "chart-line-orange",
      yAxisLabel: "Requests",
      description: "Incoming request load trend over time.",
      href: "/#embeds",
    },
  ];

  const prepareChartData = (key: string) => {
    return historyData.map((item) => ({
      timestamp: item.timestamp,
      value: item[key],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {chartConfigs.map((chart) => (
        <ChartCard
          key={chart.title}
          title={chart.title}
          data={prepareChartData(chart.key)}
          color={chart.color}
          yAxisLabel={chart.yAxisLabel}
          description={chart.description}
          href={chart.href}
        />
      ))}
    </div>
  );
}
