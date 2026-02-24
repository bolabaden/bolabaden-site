'use client'

import { motion } from 'framer-motion'
import { getHealthColor } from '@/lib/dashboard-utils'
import { Cpu, HardDrive, Clock, BarChart } from 'lucide-react'

interface StatusCardProps {
  title: string
  value: number | string
  icon: React.ElementType
  trend?: number
  suffix?: string
  inverse?: boolean
}

export function StatusCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  suffix = '', 
  inverse = false 
}: StatusCardProps) {
  const displayValue = typeof value === 'number' ? value : value
  const colorClass = typeof value === 'number' 
    ? getHealthColor(value, inverse)
    : 'text-primary'
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-lg p-5 hover:bg-white/5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-md">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {trend !== undefined && (
          <div className={trend >= 0 ? "text-green-500" : "text-red-500"}>
            <span className="text-xs">
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-1">
        <span className={`text-2xl font-bold ${colorClass}`}>
          {displayValue}
        </span>
        {suffix && (
          <span className="text-xs text-muted-foreground mb-1 ml-1">{suffix}</span>
        )}
      </div>
    </motion.div>
  )
}

export function StatusCardGrid({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard 
        title="System Uptime"
        value={stats.avgUptime}
        icon={Clock}
        suffix="%"
        trend={0.3}
        inverse={true}
      />
      <StatusCard 
        title="Services Online"
        value={`${stats.onlineServices}/${stats.totalServices}`}
        icon={BarChart}
        trend={0}
      />
      <StatusCard 
        title="CPU Usage"
        value={stats.avgCpu}
        icon={Cpu}
        suffix="%"
        trend={-1.5}
      />
      <StatusCard 
        title="Memory Usage"
        value={stats.avgMemory}
        icon={HardDrive}
        suffix="%"
        trend={2.1}
      />
    </div>
  )
}
