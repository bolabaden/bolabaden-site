"use client";

import { motion } from "framer-motion";
import { getCategoryDisplayName } from "@/lib/dashboard-utils";
import { Layers } from "lucide-react";

interface CategoryDistributionProps {
  data: Record<string, number>;
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  // Category class mapping - ONLY class names, no styling
  const getCategoryClass = (category: string) => {
    const classMap: Record<string, string> = {
      infrastructure: "category-infrastructure",
      monitoring: "category-monitoring",
      database: "category-database",
      "ai-ml": "category-ai-ml",
      security: "category-security",
      development: "category-development",
      networking: "category-networking",
      storage: "category-storage",
    };
    return classMap[category] || "category-default";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass rounded-lg p-5 hover:bg-white/5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-md">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-medium text-foreground">
            Service Distribution
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">{total} services</span>
      </div>

      <div className="flex flex-wrap gap-3 justify-between">
        {/* Simple donut chart */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              className="stroke-chart-bg"
              strokeWidth="20"
            />

            {/* Calculate segments based on data */}
            {(() => {
              const segments = [];
              let startAngle = 0;

              for (const [category, count] of Object.entries(data)) {
                const percentage = count / total;
                const angleSize = percentage * 360;
                const endAngle = startAngle + angleSize;
                const x1 =
                  50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
                const y1 =
                  50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
                const x2 =
                  50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
                const y2 =
                  50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));

                const largeArcFlag = angleSize > 180 ? 1 : 0;

                segments.push(
                  <path
                    key={category}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    className={getCategoryClass(category)}
                  />,
                );

                startAngle = endAngle;
              }

              return segments;
            })()}

            {/* Center circle for donut effect */}
            <circle cx="50" cy="50" r="25" className="chart-background" />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {Object.entries(data).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`category-indicator ${getCategoryClass(category)}`}
                />
                <span className="text-xs">
                  {getCategoryDisplayName(category)}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-medium">{count}</span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round((count / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
