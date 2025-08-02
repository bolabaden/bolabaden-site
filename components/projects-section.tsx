'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Github, 
  ExternalLink, 
  Calendar, 
  Star, 
  GitFork, 
  Code,
  Zap,
  Server,
  Brain,
  Network,
  Database,
  Shield
} from 'lucide-react'
import { Section } from './section'
import { projects } from '@/lib/data'
import { Project } from '@/lib/types'
import { cn } from '@/lib/utils'

const StatusBadge = ({ status }: { status: Project['status'] }) => {
  const config = {
    active: { color: 'bg-green-500/20 text-green-400', label: 'Active Development' },
    completed: { color: 'bg-blue-500/20 text-blue-400', label: 'Completed' },
    archived: { color: 'bg-gray-500/20 text-gray-400', label: 'Archived' }
  }

  const { color, label } = config[status]

  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', color)}>
      {label}
    </span>
  )
}

const CategoryIcon = ({ category }: { category: string }) => {
  const icons = {
    infrastructure: Server,
    'ai-ml': Brain,
    networking: Network,
    database: Database,
    security: Shield,
    frontend: Code,
    backend: Code,
    devops: Zap,
  }

  const Icon = icons[category as keyof typeof icons] || Code

  return <Icon className="h-5 w-5" />
}

const ProjectCard = ({ project, featured = false }: { project: Project, featured?: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={cn(
      'glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300 h-full flex flex-col',
      featured && 'border-2 border-primary/30'
    )}
  >
    {featured && (
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-4 w-4 text-yellow-400" />
        <span className="text-sm font-medium text-yellow-400">Featured Project</span>
      </div>
    )}

    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <CategoryIcon category={project.category} />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-lg">{project.title}</h3>
          <p className="text-xs text-muted-foreground">{project.category}</p>
        </div>
      </div>
      <StatusBadge status={project.status} />
    </div>

    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
      {project.description}
    </p>

    {project.longDescription && (
      <p className="text-muted-foreground/80 text-sm mb-4 leading-relaxed">
        {project.longDescription}
      </p>
    )}

    <div className="flex flex-wrap gap-1 mb-4">
      {project.technologies.map((tech) => (
        <span key={tech} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
          {tech}
        </span>
      ))}
    </div>

    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>Updated {project.updatedAt.toLocaleDateString()}</span>
      </div>
    </div>

    <div className="mt-auto flex items-center gap-3">
      {project.githubUrl && (
        <Link
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
        >
          <Github className="h-4 w-4" />
          View Code
        </Link>
      )}
      {project.liveUrl && (
        <Link
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          Live Demo
        </Link>
      )}
    </div>
  </motion.div>
)

const CategoryCard = ({ icon: Icon, title, description, count }: { 
  icon: any, 
  title: string, 
  description: string, 
  count: number 
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="glass rounded-lg p-6 text-center hover:bg-white/5 transition-all duration-300"
  >
    <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-4">
      <Icon className="h-8 w-8 text-primary" />
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-3">{description}</p>
    <div className="text-2xl font-bold text-primary">{count}</div>
    <div className="text-xs text-muted-foreground">Active Projects</div>
  </motion.div>
)

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))]
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  const featuredProjects = projects.filter(p => p.featured)
  const regularProjects = projects.filter(p => !p.featured)

  const categoryStats = [
    {
      icon: Server,
      title: 'Infrastructure',
      description: 'Cloud deployment and orchestration automation',
      count: projects.filter(p => p.category === 'infrastructure').length
    },
    {
      icon: Brain,
      title: 'AI & ML',
      description: 'Machine learning tools and AI integrations',
      count: projects.filter(p => p.category === 'ai-ml').length
    },
    {
      icon: Network,
      title: 'Networking',
      description: 'Mesh networks and secure communications',
      count: projects.filter(p => p.category === 'networking').length
    }
  ]

  return (
    <Section 
      id="projects" 
      title="Public Tools & Services"
      subtitle="All services are live, self-hosted, and available for public use. Click to explore."
      background="default"
    >
      {/* Category Overview */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryStats.map((stat, index) => (
            <CategoryCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-center">Featured Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                activeFilter === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70'
              )}
            >
              {category === 'all' ? 'All Projects' : category.replace('-', ' & ')}
            </button>
          ))}
        </div>
      </div>

      {/* All Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* GitHub CTA */}
      <div className="text-center">
        <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
          <Github className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-4">Open Source Contributions</h3>
          <p className="text-muted-foreground mb-6">
            All projects are open source and available on GitHub. Feel free to contribute, 
            fork, or use them as inspiration for your own projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://github.com/bocloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Github className="h-4 w-4" />
              View GitHub Profile
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-lg"
            >
              <Code className="h-4 w-4" />
              Collaborate
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
} 