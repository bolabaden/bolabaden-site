import { Service, Project, Guide, TechStack, ContactInfo } from './types'

export const services: Service[] = [
  {
    id: 'speedtest-tracker',
    name: 'Speedtest Tracker',
    description: 'Network diagnostics and speed testing with historical data tracking',
    status: 'online',
    category: 'monitoring',
    technology: ['Docker', 'PHP', 'MySQL'],
    uptime: 99.8,
  },
  {
    id: 'lobechat',
    name: 'LobeChat',
    description: 'Open-source AI chat with multi-model support and extensible plugins',
    status: 'online',
    category: 'ai-ml',
    technology: ['TypeScript', 'React', 'Docker'],
    uptime: 99.5,
  },
  {
    id: 'ai-research-wizard',
    name: 'AI Research Wizard',
    description: 'Research assistant for technical deep dives, code, and documentation',
    status: 'online',
    category: 'ai-ml',
    technology: ['Python', 'FastAPI', 'Docker'],
    uptime: 98.7,
  },
  {
    id: 'tinyauth',
    name: 'TinyAuth',
    description: 'Minimal, secure authentication for self-hosted services',
    status: 'online',
    category: 'security',
    technology: ['Go', 'SQLite', 'Docker'],
    uptime: 99.9,
  },
  {
    id: 'plex',
    name: 'Plex Media Server',
    description: 'Personal media streaming and management platform',
    status: 'online',
    category: 'media',
    technology: ['Docker', 'Linux'],
    uptime: 99.2,
  },
  {
    id: 'traefik',
    name: 'Traefik',
    description: 'Reverse proxy and load balancer with automatic SSL',
    status: 'online',
    category: 'infrastructure',
    technology: ['Docker', 'Go'],
    uptime: 99.9,
  },
]

export const projects: Project[] = [
  {
    id: 'cloudcradle',
    title: 'CloudCradle',
    description: 'Oracle Cloud deployment automation with infrastructure as code',
    longDescription: 'A comprehensive automation tool for deploying and managing Oracle Cloud infrastructure, including VCN setup, compute instances, and Kubernetes clusters. Features automated provisioning, monitoring, and cost optimization.',
    technologies: ['Python', 'Terraform', 'Oracle Cloud', 'Kubernetes'],
    category: 'infrastructure',
    status: 'active',
    githubUrl: 'https://github.com/bocloud/cloudcradle',
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'ai-research-wizard',
    title: 'AI Research Wizard',
    description: 'Enhanced GPT-researcher with custom integrations and UI improvements',
    longDescription: 'Modified version of GPT-researcher with enhanced capabilities for technical documentation, code analysis, and research automation. Includes custom integrations with multiple AI models and improved user interface.',
    technologies: ['Python', 'FastAPI', 'React', 'Docker'],
    category: 'ai-ml',
    status: 'active',
    githubUrl: 'https://github.com/bocloud/ai-research-wizard',
    liveUrl: 'https://research.bocloud.org',
    featured: true,
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
    githubUrl: 'https://github.com/bocloud/constellation',
    featured: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-04-05'),
  },
  {
    id: 'tailscale-mesh',
    title: 'Tailscale Mesh Network',
    description: 'Secure mesh networking solution for distributed services',
    longDescription: 'Implementation of Tailscale for creating secure, encrypted connections between distributed services across multiple cloud providers and on-premises infrastructure.',
    technologies: ['Tailscale', 'Linux', 'Docker', 'Kubernetes'],
    category: 'networking',
    status: 'completed',
    featured: false,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10'),
  },
]

export const guides: Guide[] = [
  {
    id: 'oracle-cloud-k8s-setup',
    title: 'Oracle Cloud Kubernetes Setup',
    description: 'Complete guide to setting up a production-ready Kubernetes cluster on Oracle Cloud',
    content: `# Oracle Cloud Kubernetes Setup

This guide walks you through setting up a production-ready Kubernetes cluster on Oracle Cloud Infrastructure (OCI).

## Prerequisites

- Oracle Cloud account with appropriate permissions
- OCI CLI configured
- kubectl installed locally

## Step 1: Create VCN and Subnets

First, we'll create a Virtual Cloud Network (VCN) with public and private subnets...`,
    category: 'infrastructure',
    difficulty: 'intermediate',
    estimatedTime: '2-3 hours',
    prerequisites: ['Oracle Cloud account', 'Basic Kubernetes knowledge'],
    technologies: ['Oracle Cloud', 'Kubernetes', 'Docker'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-15'),
    slug: 'oracle-cloud-k8s-setup',
  },
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
  email: 'contact@bocloud.org',
  github: 'https://github.com/bocloud',
  location: 'Remote',
  timezone: 'UTC-5 (Eastern)',
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