'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Github, 
  ExternalLink, 
  Calendar, 
  Star,
  GitFork,
  AlertCircle,
  TrendingUp,
  Eye,
} from 'lucide-react'
import { Project } from '@/lib/types'
import { EnhancedRepoStats } from '@/lib/github-enhanced'
import { getRelativeTime, formatDate } from '@/lib/config'
import { cn } from '@/lib/utils'
import { CommitGraph } from './commit-graph'

interface EnhancedProjectCardProps {
  project: Project
  featured?: boolean
  githubStats?: EnhancedRepoStats | null
  CategoryIcon: React.ComponentType<{ category: string }>
  StatusBadge: React.ComponentType<{ status: Project['status'] }>
}

export function EnhancedProjectCard({ 
  project, 
  featured = false,
  githubStats,
  CategoryIcon,
  StatusBadge,
}: EnhancedProjectCardProps) {
  const [showCommitGraph, setShowCommitGraph] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setShowCommitGraph(true)}
      onHoverEnd={() => setShowCommitGraph(false)}
      className={cn(
        'glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300 h-full flex flex-col relative overflow-hidden',
        featured && 'border-2 border-primary/30'
      )}
    >
      {featured && (
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-yellow-400" aria-hidden="true" />
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

      {/* GitHub Stats Row (shows when data available) */}
      {githubStats && (
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          {githubStats.stars > 0 && (
            <div className="flex items-center gap-1" title={`${githubStats.stars} stars`}>
              <Star className="h-3 w-3" aria-hidden="true" />
              <span>{githubStats.stars}</span>
            </div>
          )}
          {githubStats.forks > 0 && (
            <div className="flex items-center gap-1" title={`${githubStats.forks} forks`}>
              <GitFork className="h-3 w-3" aria-hidden="true" />
              <span>{githubStats.forks}</span>
            </div>
          )}
          {githubStats.recentCommitsCount > 0 && (
            <div className="flex items-center gap-1" title={`${githubStats.recentCommitsCount} commits in last 30 days`}>
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              <span>{githubStats.recentCommitsCount} commits/mo</span>
            </div>
          )}
          {githubStats.openIssues > 0 && (
            <div className="flex items-center gap-1" title={`${githubStats.openIssues} open issues`}>
              <AlertCircle className="h-3 w-3" aria-hidden="true" />
              <span>{githubStats.openIssues}</span>
            </div>
          )}
        </div>
      )}

      {/* Commit Graph (shows on hover) */}
      <AnimatePresence>
        {showCommitGraph && githubStats?.commitActivity && githubStats.commitActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <div className="text-xs text-muted-foreground mb-2">Commit activity</div>
            <CommitGraph data={githubStats.commitActivity} />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
        {project.description}
      </p>

      {project.longDescription && (
        <p className="text-muted-foreground/80 text-sm mb-4 leading-relaxed whitespace-pre-line">
          {project.longDescription}
        </p>
      )}

      {/* Language badges from GitHub */}
      {githubStats?.primaryLanguage && (
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
            {githubStats.primaryLanguage}
          </span>
          {githubStats.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Technology stack (static) */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.technologies.map((tech) => (
          <span key={tech} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>

      {/* Date info */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          <span title={formatDate(project.updatedAt, 'long')}>
            Updated {getRelativeTime(project.updatedAt)}
          </span>
        </div>
        {githubStats?.lastPush && (
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            <span title={formatDate(githubStats.lastPush, 'long')}>
              Last push {getRelativeTime(githubStats.lastPush)}
            </span>
          </div>
        )}
      </div>

      {/* Links */}
      <div className="mt-auto flex items-center gap-3">
        {project.githubUrl && (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
            aria-label={`View ${project.title} source code on GitHub (opens in new tab)`}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            View Code
          </Link>
        )}
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
            aria-label={`Visit ${project.title} live demo (opens in new tab)`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Live Demo
          </Link>
        )}
      </div>
    </motion.div>
  )
}

