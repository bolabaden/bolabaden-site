import { Project, Guide, TechStack, ContactInfo } from './types'

// Service data is now fetched dynamically from the API
// endpoint at /api/services

export const projects: Project[] = [
  {
    id: 'bolabaden-infra',
    title: 'Bolabaden Infrastructure',
    description: 'The infrastructure running https://bolabaden.org and its services.',
    technologies: ['Docker', 'Kubernetes', 'Traefik', 'Redis', 'MongoDB', 'Portainer', 'Docker Socket Proxy'],
    category: 'infrastructure',
    status: 'active',
    githubUrl: 'https://github.com/bolabaden/bolabaden-infra',
    featured: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-09-26'),
  },
  {
    id: 'bolabaden-site',
    title: 'Bolabaden NextJS Website',
    description: 'The NextJS website running https://bolabaden.org.',
    technologies: ['NextJS', 'Tailwind CSS', 'TypeScript', 'React', 'Docker'],
    category: 'frontend',
    status: 'active',
    githubUrl: 'https://github.com/bolabaden/bolabaden-site',
    liveUrl: 'https://bolabaden.org',
    featured: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-09-26'),
  },
  {
    id: 'cloudcradle',
    title: 'CloudCradle',
    description: 'Oracle Cloud deployment automation with infrastructure as code',
    longDescription: 'A comprehensive automation tool for deploying and managing Oracle Cloud infrastructure, including VCN setup, compute instances, and Kubernetes clusters. Features automated provisioning, monitoring, and cost optimization.',
    technologies: ['Python', 'Terraform', 'Oracle Cloud', 'Kubernetes'],
    category: 'infrastructure',
    status: 'active',
    githubUrl: 'https://github.com/bolabaden/cloudcradle',
    featured: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-02-20'),
  },
  {
    id: 'ai-researchwizard',
    title: 'AI Research Wizard',
    description: 'Enhanced GPT-researcher with custom integrations and UI improvements',
    longDescription: 'Modified version of GPT-researcher with enhanced capabilities for technical documentation, code analysis, and research automation. Includes custom integrations with multiple AI models and improved user interface.',
    technologies: ['Python', 'FastAPI', 'React', 'Docker'],
    category: 'ai-ml',
    status: 'active',
    githubUrl: 'https://github.com/bolabaden/ai-researchwizard',
    liveUrl: 'https://gptr.bolabaden.org',
    featured: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-03-10'),
  },
  {
    id: 'llm_fallbacks',
    title: 'LLM Fallbacks',
    description: 'A Python library for managing fallbacks, filtering, and sorting for various LLM providers.',
    longDescription: `Features:
🔄 Automatic Fallbacks: Gracefully handle API failures by providing alternative models
📊 Model Filtering: Filter models based on various criteria like cost, context length, and capabilities
💰 Cost Optimization: Sort models by cost to optimize your API usage
🧠 Model Discovery: Discover available models and their capabilities
🛠️ GUI Tool: Includes a GUI tool for exploring and filtering available models`,
    technologies: ['Python', 'LiteLLM', 'LLM'],
    category: 'ai-ml',
    status: 'active',
    githubUrl: 'https://github.com/bolabaden/llm_fallbacks',
    featured: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'constellation',
    title: 'Constellation',
    description: 'Service orchestration and monitoring platform for self-hosted infrastructure',
    longDescription: 'A comprehensive platform for managing and monitoring self-hosted services with automated deployment, health checks, and performance metrics. Built specifically for complex multi-service environments.',
    technologies: ['Go', 'Docker', 'Kubernetes', 'Prometheus'],
    category: 'infrastructure',
    status: 'active',
    githubUrl: 'https://github.com/bolabaden/constellation',
    featured: true,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-04-05'),
  },
]

export const guides: Guide[] = [
  {
    id: 'self-hosted-media-stack',
    title: 'Self-Hosted Media Stack',
    description: 'Deploy a complete media automation stack with Plex, Radarr, Sonarr, and more',
    content: `# Self-Hosted Media Stack

Build your own Netflix-like streaming service with automated content management.

## Services Included

- Plex Media Server
- Radarr (Movie automation)
- Sonarr (TV show automation)
- Overseerr (Request management)
- Jellyfin (Alternative player)

## Docker Compose Setup

Here's the complete docker-compose.yml configuration...`,
    category: 'media',
    difficulty: 'beginner',
    estimatedTime: '1-2 hours',
    prerequisites: ['Docker', 'Basic networking knowledge'],
    technologies: ['Docker', 'Plex', 'Radarr', 'Sonarr'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-05'),
    slug: 'self-hosted-media-stack',
  },
]

export const techStack: TechStack[] = [
  {
    name: 'Kubernetes',
    category: 'infrastructure',
    level: 'expert',
    yearsOfExperience: 4,
    description: 'Container orchestration, cluster management, and service mesh',
  },
  {
    name: 'Docker',
    category: 'infrastructure',
    level: 'expert',
    yearsOfExperience: 5,
    description: 'Containerization, multi-stage builds, and registry management',
  },
  {
    name: 'Python',
    category: 'backend',
    level: 'advanced',
    yearsOfExperience: 6,
    description: 'FastAPI, Django, automation scripts, and AI/ML integrations',
  },
  {
    name: 'Go',
    category: 'backend',
    level: 'advanced',
    yearsOfExperience: 3,
    description: 'High-performance services, CLI tools, and system programming',
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    level: 'advanced',
    yearsOfExperience: 4,
    description: 'React, Next.js, and full-stack development',
  },
  {
    name: 'Oracle Cloud',
    category: 'infrastructure',
    level: 'expert',
    yearsOfExperience: 2,
    description: 'IaaS, networking, and cost optimization',
  },
  {
    name: 'Tailscale',
    category: 'infrastructure',
    level: 'advanced',
    yearsOfExperience: 2,
    description: 'Zero-config mesh networking and secure remote access',
  },
  {
    name: 'Traefik',
    category: 'infrastructure',
    level: 'advanced',
    yearsOfExperience: 3,
    description: 'Reverse proxy, load balancing, and SSL automation',
  },
]

export const contactInfo: ContactInfo = {
  email: 'boden.crouch@gmail.com',
  github: 'https://github.com/bolabaden',
  location: 'Remote',
  timezone: 'UTC-6 (Central)',
  availability: 'open-to-opportunities',
  preferredCommunication: ['email', 'text-based chat', 'async communication'],
  workPreferences: {
    remote: true,
    contract: true,
    fullTime: true,
    partTime: false,
  },
}

export const serviceCategories = {
  'ai-ml': 'AI & Machine Learning',
  'infrastructure': 'Infrastructure',
  'monitoring': 'Monitoring',
  'security': 'Security',
  'media': 'Media',
  'networking': 'Networking',
  'development': 'Development',
} 