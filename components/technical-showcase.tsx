'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  Server, 
  Database, 
  Shield, 
  Zap, 
  Monitor, 
  Wifi, 
  CheckCircle, 
  AlertCircle,
  Circle 
} from 'lucide-react'
import { Section } from './section'
import { services, serviceCategories } from '@/lib/data'
import { Service } from '@/lib/types'
import { cn } from '@/lib/utils'

const StatusIndicator = ({ status }: { status: Service['status'] }) => {
  const statusConfig = {
    online: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/20' },
    offline: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/20' },
    maintenance: { icon: Circle, color: 'text-yellow-500', bg: 'bg-yellow-500/20' }
  }

  const { icon: Icon, color, bg } = statusConfig[status]

  return (
    <div className={cn('flex items-center gap-2', color)}>
      <div className={cn('p-1 rounded-full', bg)}>
        <Icon className="h-3 w-3" />
      </div>
      <span className="text-sm font-medium capitalize">{status}</span>
    </div>
  )
}

const InfrastructureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  stats 
}: { 
  icon: any, 
  title: string, 
  description: string, 
  stats: string 
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-primary/20 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-2xl font-bold text-primary">{stats}</div>
    </div>
  </motion.div>
)

const ServiceCard = ({ service }: { service: Service }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass rounded-lg p-4 hover:bg-white/5 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-semibold text-foreground text-sm">{service.name}</h4>
        <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
      </div>
      <StatusIndicator status={service.status} />
    </div>
    
    {service.technology && (
      <div className="flex flex-wrap gap-1 mt-3">
        {service.technology.map((tech) => (
          <span 
            key={tech} 
            className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
    )}
    
    {service.uptime && (
      <div className="mt-3 text-right">
        <span className="text-xs text-muted-foreground">Uptime: </span>
        <span className="text-sm font-medium text-primary">{service.uptime}%</span>
      </div>
    )}
  </motion.div>
)

export function TechnicalShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const infrastructureStats = [
    {
      icon: Cloud,
      title: 'Oracle Cloud',
      description: 'Primary hosting infrastructure',
      stats: '4 vCPUs'
    },
    {
      icon: Server,
      title: 'Kubernetes',
      description: 'Container orchestration',
      stats: '3 Nodes'
    },
    {
      icon: Database,
      title: 'Services',
      description: 'Self-hosted applications',
      stats: '100+'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Tailscale mesh network',
      stats: '99.9%'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Average response time',
      stats: '<200ms'
    },
    {
      icon: Monitor,
      title: 'Monitoring',
      description: 'Real-time observability',
      stats: '24/7'
    }
  ]

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory)

  const categories = Object.keys(serviceCategories)
  const onlineServices = services.filter(s => s.status === 'online').length
  const totalServices = services.length
  const avgUptime = services.reduce((acc, s) => acc + (s.uptime || 0), 0) / services.length

  return (
    <Section 
      id="services" 
      title="Infrastructure & Architecture"
      subtitle="Self-hosted on Oracle Cloud with Kubernetes orchestration, Tailscale mesh networking, and comprehensive monitoring."
      background="muted"
    >
      {/* Infrastructure Overview */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infrastructureStats.map((stat, index) => (
            <InfrastructureCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Service Status Overview */}
      <div className="mb-12">
        <div className="glass rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{onlineServices}/{totalServices}</div>
              <div className="text-sm text-muted-foreground">Services Online</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{avgUptime.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Average Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round((onlineServices / totalServices) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">System Health</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70'
            )}
          >
            All Services
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70'
              )}
            >
              {serviceCategories[category as keyof typeof serviceCategories]}
            </button>
          ))}
        </div>
      </div>

      {/* Live Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Architecture Diagram Placeholder */}
      <div className="mt-16">
        <div className="glass rounded-lg p-8 text-center">
          <Wifi className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Live Architecture Diagram</h3>
          <p className="text-muted-foreground mb-4">
            Real-time visualization of the complete infrastructure stack
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Circle className="h-2 w-2 text-green-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </Section>
  )
} 