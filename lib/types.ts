export interface Service {
  id: string
  name: string
  description: string
  status: 'online' | 'offline' | 'maintenance'
  url?: string
  category: string
  port?: number
  technology?: string[]
  uptime?: number
  lastChecked?: Date
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  category: string
  status: 'active' | 'completed' | 'archived'
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Guide {
  id: string
  title: string
  description: string
  content: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  prerequisites: string[]
  technologies: string[]
  createdAt: Date
  updatedAt: Date
  slug: string
}

export interface TechStack {
  name: string
  category: 'frontend' | 'backend' | 'infrastructure' | 'database' | 'ai-ml' | 'devops'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience: number
  description?: string
}

export interface ContactInfo {
  email: string
  github: string
  location: string
  timezone: string
  availability: 'available' | 'not-available' | 'open-to-opportunities'
  preferredCommunication: string[]
  workPreferences: {
    remote: boolean
    contract: boolean
    fullTime: boolean
    partTime: boolean
  }
}

export interface ServiceStats {
  totalServices: number
  uptime: number
  avgResponseTime: number
  categories: Record<string, number>
} 