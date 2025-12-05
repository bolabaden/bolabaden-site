'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CommitGraphData } from '@/lib/github-enhanced'
import { getRelativeTime } from '@/lib/config'

interface CommitGraphProps {
  data: CommitGraphData[]
  className?: string
}

export function CommitGraph({ data, className = '' }: CommitGraphProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  if (!data || data.length === 0) {
    return null
  }

  // Take last 12 weeks for compact display
  const recentData = data.slice(-12)
  const maxCommits = Math.max(...recentData.map(d => d.count), 1)
  
  // Color intensity based on commit count
  const getBarColor = (count: number): string => {
    if (count === 0) return 'bg-gray-800'
    const intensity = count / maxCommits
    if (intensity > 0.75) return 'bg-green-500'
    if (intensity > 0.5) return 'bg-green-400'
    if (intensity > 0.25) return 'bg-green-300'
    return 'bg-green-200'
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-end gap-0.5 h-12">
        {recentData.map((week, index) => {
          const heightPercent = maxCommits > 0 ? (week.count / maxCommits) * 100 : 0
          const date = new Date(week.date)
          
          return (
            <motion.div
              key={week.date}
              className="flex-1 relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ height: 0 }}
              animate={{ height: `${heightPercent}%` }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <div 
                className={`w-full h-full rounded-sm transition-all duration-200 ${getBarColor(week.count)} ${
                  hoveredIndex === index ? 'opacity-100 scale-110' : 'opacity-70'
                }`}
                style={{ minHeight: week.count > 0 ? '2px' : '0px' }}
              />
              
              {/* Tooltip on hover */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 pointer-events-none"
                  >
                    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                      <div className="text-xs font-medium text-green-400">
                        {week.count} commit{week.count !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getRelativeTime(date)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span>12 weeks ago</span>
        <span>Recent activity</span>
      </div>
    </div>
  )
}

/**
 * Compact commit sparkline (alternative visualization)
 */
export function CommitSparkline({ data, className = '' }: CommitGraphProps) {
  if (!data || data.length === 0) {
    return null
  }

  const recentData = data.slice(-12)
  const maxCommits = Math.max(...recentData.map(d => d.count), 1)
  
  const points = recentData.map((week, index) => {
    const x = (index / (recentData.length - 1)) * 100
    const y = 100 - ((week.count / maxCommits) * 100)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg 
      viewBox="0 0 100 20" 
      className={`w-full h-6 ${className}`}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-primary"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

