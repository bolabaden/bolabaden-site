'use client'

import { motion } from 'framer-motion'
import { getCategoryDisplayName } from '@/lib/dashboard-utils'
import { PieChart, Layers } from 'lucide-react'

interface CategoryDistributionProps {
  data: Record<string, number>
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0)
  
  // Colors for different categories
  const categoryColors = {
    'infrastructure': '#3b82f6', // blue
    'monitoring': '#10b981', // green
    'media': '#f59e0b', // amber
    'ai-ml': '#8b5cf6', // violet
    'security': '#ef4444', // red
    'development': '#ec4899', // pink
    'networking': '#06b6d4', // cyan
    'storage': '#6366f1', // indigo
    'default': '#9ca3af' // gray
  }
  
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
          <h3 className="text-sm font-medium text-foreground">Service Distribution</h3>
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
              stroke="#1f2937"
              strokeWidth="20"
            />
            
            {/* Calculate segments based on data */}
            {(() => {
              let segments = []
              let startAngle = 0
              
              for (const [category, count] of Object.entries(data)) {
                const percentage = count / total
                const angleSize = percentage * 360
                const endAngle = startAngle + angleSize
                const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180))
                const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180))
                const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180))
                const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180))
                
                const largeArcFlag = angleSize > 180 ? 1 : 0
                
                segments.push(
                  <path
                    key={category}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={categoryColors[category as keyof typeof categoryColors] || categoryColors.default}
                  />
                )
                
                startAngle = endAngle
              }
              
              return segments
            })()}
            
            {/* Center circle for donut effect */}
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="#1f2937"
            />
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {Object.entries(data).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] || categoryColors.default }}
                />
                <span className="text-xs">{getCategoryDisplayName(category)}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-medium">{count}</span>
                <span className="text-xs text-muted-foreground">({Math.round(count / total * 100)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
