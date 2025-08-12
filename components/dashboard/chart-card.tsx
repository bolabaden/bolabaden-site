'use client'

import { motion } from 'framer-motion'
import { generateSparklinePoints, formatTime } from '@/lib/dashboard-utils'
import { useState } from 'react'

interface ChartCardProps {
  title: string
  data: { timestamp: string; value: number }[]
  color?: string
  yAxisLabel?: string
  height?: number
}

export function ChartCard({ 
  title, 
  data, 
  color = 'stroke-blue-500',
  yAxisLabel,
  height = 200
}: ChartCardProps) {
  const chartValues = data.map(item => item.value)
  const chartWidth = 600 // Will be responsive
  
  const sparklinePoints = generateSparklinePoints(chartValues, chartWidth, height - 50, 10)
  const maxValue = Math.max(...chartValues)
  const minValue = Math.min(...chartValues)
  
  const latestValue = data.length > 0 ? data[data.length - 1].value : 0
  const previousValue = data.length > 1 ? data[data.length - 2].value : 0
  const trend = previousValue ? ((latestValue - previousValue) / previousValue) * 100 : 0
  const trendDisplay = trend.toFixed(1)
  
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
            <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trendDisplay}%
            </span>
          )}
        </div>
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis label */}
        {yAxisLabel && (
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
            {yAxisLabel}
          </div>
        )}
        
        {/* Sparkline */}
        <svg width="100%" height="100%" className="overflow-visible">
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color.replace('stroke-', 'rgb(').replace('-500', '-500)')} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color.replace('stroke-', 'rgb(').replace('-500', '-500)')} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g className="grid-lines">
            {[0, 25, 50, 75, 100].map((percent, i) => {
              const y = (100 - percent) / 100 * (height - 40) + 20
              return (
                <line 
                  key={i}
                  x1="0" 
                  y1={y} 
                  x2="100%" 
                  y2={y} 
                  stroke="currentColor" 
                  strokeOpacity="0.1" 
                  strokeDasharray="4 4" 
                />
              )
            })}
          </g>
          
          {/* Line */}
          <polyline
            points={sparklinePoints}
            fill="none"
            className={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          
          {/* Area fill */}
          <polygon
            points={`${sparklinePoints} ${chartWidth},${height-10} 0,${height-10}`}
            fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = 10 + (index / (data.length - 1)) * (chartWidth - 20)
            const y = height - (10 + ((item.value - minValue) / (maxValue - minValue || 1)) * (height - 50))
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={index === data.length - 1 ? 4 : 0}
                className={index === data.length - 1 ? color : 'stroke-transparent fill-transparent'}
                fill="currentColor"
              />
            )
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {[0, Math.floor(data.length / 2), data.length - 1].map((index) => {
            if (data[index]) {
              return <div key={index}>{formatTime(data[index].timestamp)}</div>
            }
            return <div key={index}></div>
          })}
        </div>
      </div>
    </motion.div>
  )
}

interface ChartGridProps {
  historyData: any[]
}

export function ChartGrid({ historyData }: ChartGridProps) {
  const prepareChartData = (key: string) => {
    return historyData.map(item => ({
      timestamp: item.timestamp,
      value: item[key]
    }))
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <ChartCard
        title="System Uptime (%)"
        data={prepareChartData('uptime')}
        color="stroke-green-500"
        yAxisLabel="Uptime %"
      />
      <ChartCard
        title="CPU Usage (%)"
        data={prepareChartData('cpu')}
        color="stroke-blue-500"
        yAxisLabel="CPU %"
      />
      <ChartCard
        title="Memory Usage (%)"
        data={prepareChartData('memory')}
        color="stroke-purple-500"
        yAxisLabel="Memory %"
      />
      <ChartCard
        title="Requests per Minute"
        data={prepareChartData('requests')}
        color="stroke-orange-500"
        yAxisLabel="Requests"
      />
    </div>
  )
}
