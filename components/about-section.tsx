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
    { icon: Clock, label: 'Flexible Hours', description: 'Central timezone, flexible scheduling' },
    { icon: Code, label: 'Technical Focus', description: 'Hands-on development and architecture' }
  ]

  const skillCategories = Array.from(new Set(techStack.map(s => s.category)))

  return (
    <Section 
      id="about" 
      title="About Me"
      subtitle="Self-taught infrastructure engineer who learned to automate production systems after breaking my home lab so often I learned to script the fixes."
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
              <h3 className="text-xl font-semibold mb-4">My Story</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  I'm a self-taught infrastructure engineer who learned by doing — and by breaking things. 
                  I once rebuilt a staging cluster 4 times in a week because a manual network setup left 
                  services half-configured. That frustration led me to write the Terraform modules that 
                  now run unattended for 10+ months.
                </p>
                <p>
                  My focus is on building <strong className="text-foreground">sane, repeatable infrastructure</strong> 
                  (Kubernetes, Terraform, OCI) and turning ad-hoc setups into automated, testable systems. 
                  I hyper-focus on tricky debugging sessions and spot odd failure modes others miss — 
                  a trait that's served me well in production environments.
                </p>
                <p>
                  Today, I run 8+ self-hosted services with 99.9% uptime, contribute to open source, 
                  and share knowledge through comprehensive technical documentation. My work emphasizes 
                  <strong className="text-foreground">automation that you can trust</strong> and systems 
                  designed to be debugged at 3 AM.
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
                      Automating Oracle Cloud deployments with Terraform; built CloudCradle to reduce 
                      provisioning time from 3 hours to 12 minutes
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Production Systems</div>
                    <div className="text-sm text-muted-foreground">
                      Self-hosting 20+ services with automated health checks, canary deployments, 
                      and self-healing via Traefik and custom orchestration
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">AI/ML Integration</div>
                    <div className="text-sm text-muted-foreground">
                      Building intelligent fallback systems for LLM APIs; reduced costs by 35% 
                      through smart model selection
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
            I'm seeking remote roles where I can design reliable systems, automate infrastructure, 
            and solve challenging technical problems. Ideal fit: infrastructure engineer, platform engineer, 
            or SRE role where I can reduce toil and improve system resilience. 
            <span className="block mt-2">
              Typical onboarding contribution: identify and eliminate manual processes, saving teams 
              hours per week and reducing incident frequency.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:boden.crouch@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              aria-label="Send email to Boden Crouch"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Get in Touch
            </a>
            <a
              href="https://github.com/bolabaden"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-lg"
              aria-label="Visit Boden Crouch's GitHub profile (opens in new tab)"
            >
              <Code className="h-4 w-4" aria-hidden="true" />
              View My Code
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
} 