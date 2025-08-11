'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Code, 
  Globe, 
  Clock, 
  MessageSquare, 
  CheckCircle,
  Zap,
  Target,
  Users,
  BookOpen,
  Server,
  Shield
} from 'lucide-react'
import { Section } from './section'
import { techStack } from '@/lib/data'
import { TechStack } from '@/lib/types'
import { cn } from '@/lib/utils'

const SkillCard = ({ skill }: { skill: TechStack }) => {
  const levelColors = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-orange-500/20 text-orange-400',
    expert: 'bg-red-500/20 text-red-400'
  }

  const categoryIcons = {
    frontend: Code,
    backend: Server,
    infrastructure: Server,
    database: Server,
    'ai-ml': Brain,
    devops: Zap,
  }

  const Icon = categoryIcons[skill.category as keyof typeof categoryIcons] || Code

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-lg p-4 hover:bg-white/5 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">{skill.name}</h4>
            <p className="text-xs text-muted-foreground">{skill.category}</p>
          </div>
        </div>
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', levelColors[skill.level])}>
          {skill.level}
        </span>
      </div>
      
      <p className="text-xs text-muted-foreground mb-2">{skill.description}</p>
      
      <div className="text-xs text-muted-foreground">
        <span className="font-medium">{skill.yearsOfExperience}</span> years experience
      </div>
    </motion.div>
  )
}

const PrincipleCard = ({ icon: Icon, title, description }: { 
  icon: any, 
  title: string, 
  description: string 
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="glass rounded-lg p-6 text-center hover:bg-white/5 transition-all duration-300"
  >
    <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-4">
      <Icon className="h-8 w-8 text-primary" />
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
)

export function AboutSection() {
  const principles = [
    {
      icon: BookOpen,
      title: 'Self-Taught Excellence',
      description: 'Passionate about continuous learning and staying current with emerging technologies'
    },
    {
      icon: Target,
      title: 'Practical Solutions',
      description: 'Focus on building things that work reliably in production environments'
    },
    {
      icon: Users,
      title: 'Remote Collaboration',
      description: 'Experienced in async communication and distributed team workflows'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Always prioritize security and best practices in system design'
    }
  ]

  const workPreferences = [
    { icon: Globe, label: 'Remote Work', description: 'Fully remote, distributed teams' },
    { icon: MessageSquare, label: 'Async Communication', description: 'Email, text-based chat, documentation' },
    { icon: Clock, label: 'Flexible Hours', description: 'Eastern timezone, flexible scheduling' },
    { icon: Code, label: 'Technical Focus', description: 'Hands-on development and architecture' }
  ]

  const skillCategories = Array.from(new Set(techStack.map(s => s.category)))

  return (
    <Section 
      id="about" 
      title="About Me"
      subtitle="A 30-year-old self-taught software engineer with ADHD who has extensive technical skills and runs sophisticated self-hosted infrastructure."
      background="muted"
    >
      {/* Philosophy and Approach */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((principle, index) => (
            <PrincipleCard key={index} {...principle} />
          ))}
        </div>
      </div>

      {/* Background Story */}
      <div className="mb-16">
        <div className="glass rounded-lg p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Technical Journey</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Self-taught developer with 6+ years of hands-on experience building and maintaining 
                  complex technical systems. Started with curiosity about how things work and evolved 
                  into running 100+ self-hosted services across multiple cloud providers.
                </p>
                <p>
                  Specialized in infrastructure automation, container orchestration, and AI/ML 
                  integrations. Experience spans from small personal projects to production-grade 
                  systems with high availability requirements.
                </p>
                <p>
                  Currently focused on sharing knowledge through open source contributions and 
                  comprehensive technical documentation.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Current Focus</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Infrastructure as Code</div>
                    <div className="text-sm text-muted-foreground">
                      Automating Oracle Cloud deployments with Terraform and Kubernetes
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">AI/ML Integration</div>
                    <div className="text-sm text-muted-foreground">
                      Building practical AI tools and research automation systems
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Knowledge Sharing</div>
                    <div className="text-sm text-muted-foreground">
                      Creating comprehensive guides for self-hosted infrastructure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Preferences */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">Work Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workPreferences.map((pref, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-lg p-4 text-center hover:bg-white/5 transition-all duration-300"
            >
              <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-3">
                <pref.icon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{pref.label}</h4>
              <p className="text-sm text-muted-foreground">{pref.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">Technical Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {techStack.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="text-center">
        <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">Open to Opportunities</span>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Let's Work Together</h3>
          <p className="text-muted-foreground mb-6">
            I'm interested in remote positions where I can contribute to complex technical systems, 
            mentor other developers, and continue learning new technologies. Particularly excited 
            about opportunities in infrastructure, AI/ML, and developer tooling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@bolabaden.org"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Get in Touch
            </a>
            <a
              href="https://github.com/bolabaden"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-lg"
            >
              <Code className="h-4 w-4" />
              View My Code
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
} 