'use client'

import { useState, useEffect } from 'react'
import { StatusCardGrid } from './status-card'
import { ChartGrid } from './chart-card'
import { ServiceTable } from './service-table'
import { CategoryDistribution } from './category-distribution'
import { Loader2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export function Dashboard() {
  const [services, setServices] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/services')
      if (!response.ok) {
        throw new Error(`Error fetching services: ${response.status}`)
      }
      
      const data = await response.json()
      setServices(data.services)
      setStats(data.stats)
      setLastUpdated(new Date())
    } catch (err: any) {
      console.error('Error fetching service data:', err)
      setError(err.message || 'Failed to fetch service data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
    
    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(() => {
      fetchData()
    }, 60000)
    
    return () => clearInterval(intervalId)
  }, [])
  
  if (loading && !lastUpdated) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
      </div>
    )
  }
  
  if (error && !lastUpdated) {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    )
  }
  
  return (
    <div>
      {/* Header with last updated time */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time monitoring and status overview
          </p>
        </div>
        
        <div className="flex items-center mt-4 sm:mt-0 text-sm text-muted-foreground">
          <span className="mr-2">Last updated:</span>
          <span className="text-foreground">{lastUpdated?.toLocaleTimeString()}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            disabled={loading}
            className="ml-3 p-1.5 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 text-primary ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>
      
      {/* Status Cards */}
      <StatusCardGrid stats={stats} />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <ChartGrid historyData={stats.history || []} />
        </div>
        
        <div className="lg:col-span-1">
          <CategoryDistribution data={stats.categoryDistribution || {}} />
        </div>
      </div>
      
      {/* Services Table */}
      <ServiceTable services={services} onRefresh={fetchData} loading={loading} />
    </div>
  )
}
