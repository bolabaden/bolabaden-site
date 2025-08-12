'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  AlertCircle,
  Circle,
  Search,
  SortAsc,
  SortDesc,
  Cpu,
  HardDrive,
  Clock,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getStatusConfig, getCategoryDisplayName } from '@/lib/dashboard-utils'
import { cn } from '@/lib/utils'

interface ServiceTableProps {
  services: any[]
  onRefresh: () => void
  loading: boolean
}

export function ServiceTable({ services, onRefresh, loading }: ServiceTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filter, setFilter] = useState<string>('all')
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }
  
  // Apply filtering
  let filteredServices = services
  
  if (filter !== 'all') {
    filteredServices = filteredServices.filter(service => service.status === filter)
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filteredServices = filteredServices.filter(service => 
      service.name.toLowerCase().includes(term) || 
      service.description.toLowerCase().includes(term) ||
      service.category.toLowerCase().includes(term) ||
      (service.technology && service.technology.some((tech: string) => 
        tech.toLowerCase().includes(term)
      ))
    )
  }
  
  // Apply sorting
  filteredServices = [...filteredServices].sort((a, b) => {
    let valA, valB
    
    if (sortBy === 'name') {
      valA = a.name
      valB = b.name
    } else if (sortBy === 'status') {
      const statusOrder: Record<string, number> = { 'online': 0, 'maintenance': 1, 'offline': 2 }
      valA = statusOrder[a.status]
      valB = statusOrder[b.status]
    } else if (sortBy === 'category') {
      valA = a.category
      valB = b.category
    } else if (sortBy === 'uptime') {
      valA = a.uptime || 0
      valB = b.uptime || 0
    } else if (sortBy === 'cpu') {
      valA = a.metrics?.cpu || 0
      valB = b.metrics?.cpu || 0
    } else {
      valA = a[sortBy]
      valB = b[sortBy]
    }
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })
  
  const StatusIndicator = ({ status }: { status: 'online' | 'offline' | 'maintenance' }) => {
    const iconConfig = {
      online: CheckCircle,
      offline: AlertCircle,
      maintenance: Circle
    }
    
    const Icon = iconConfig[status]
    const { color, bg } = getStatusConfig(status)
    
    return (
      <div className={cn('flex items-center gap-2', color)}>
        <div className={cn('p-1 rounded-full', bg)}>
          <Icon className="h-3 w-3" />
        </div>
        <span className="text-sm font-medium capitalize">{status}</span>
      </div>
    )
  }
  
  const ProgressBar = ({ value }: { value: number }) => {
    let barColor
    
    if (value >= 90) barColor = 'bg-red-500'
    else if (value >= 70) barColor = 'bg-orange-500'
    else if (value >= 50) barColor = 'bg-yellow-500'
    else barColor = 'bg-green-500'
    
    return (
      <div className="w-full bg-gray-700/30 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${barColor}`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    )
  }
  
  return (
    <div className="mt-8">
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('online')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'online'
                ? 'bg-green-600 text-white'
                : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
            )}
          >
            Online
          </button>
          <button
            onClick={() => setFilter('maintenance')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'maintenance'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
            )}
          >
            Maintenance
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'offline'
                ? 'bg-red-600 text-white'
                : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
            )}
          >
            Offline
          </button>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              className="pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/30 rounded-lg w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={loading}
            className="p-2 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <RefreshCw className={cn(
              "h-5 w-5 text-primary", 
              loading && "animate-spin"
            )} />
          </motion.button>
        </div>
      </div>
      
      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Service
                    {sortBy === 'name' && (
                      sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortBy === 'status' && (
                      sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortBy === 'category' && (
                      sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('uptime')}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Uptime
                    {sortBy === 'uptime' && (
                      sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Cpu className="h-3 w-3 mr-1" />
                    CPU
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3 mr-1" />
                    Memory
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3 mr-1" />
                    Disk
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                    No services match your filters
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr 
                    key={service.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-sm text-foreground">{service.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{service.description}</div>
                        {service.technology && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {service.technology.map((tech: string) => (
                              <span 
                                key={tech} 
                                className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-0.5 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusIndicator status={service.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {getCategoryDisplayName(service.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-sm font-medium", 
                        service.uptime >= 99 ? "text-green-500" :
                        service.uptime >= 95 ? "text-green-400" :
                        service.uptime >= 90 ? "text-yellow-500" : 
                        "text-red-500"
                      )}>
                        {service.uptime}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="mb-1 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {service.metrics?.cpu}%
                          </span>
                        </div>
                        <ProgressBar value={service.metrics?.cpu} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="mb-1 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {service.metrics?.memory}%
                          </span>
                        </div>
                        <ProgressBar value={service.metrics?.memory} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="mb-1 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {service.metrics?.disk}%
                          </span>
                        </div>
                        <ProgressBar value={service.metrics?.disk} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
