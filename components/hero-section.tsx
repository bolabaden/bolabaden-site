'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Mail, Server, Code, Zap, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const [stats, setStats] = useState<{ totalServices: number; avgUptime: number } | null>(null)
  const [yearsExperience, setYearsExperience] = useState<number>(6)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/services')
        if (res.ok) {
          const data = await res.json()
          setStats({ totalServices: data?.stats?.totalServices ?? 0, avgUptime: data?.stats?.avgUptime ?? 0 })
        }
      } catch {}
    }
    // Experience can be calculated based on a start year if desired
    const startYear = 2023
    const now = new Date().getFullYear()
    setYearsExperience(Math.max(0, now - startYear))
    fetchStats()
  }, [])
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-1 h-1 bg-accent rounded-full"
          animate={{
            y: [0, 30, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary/60 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-2xl">
              {/* Placeholder - replace /images/profile.jpg with actual photo */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <User className="w-16 h-16 text-primary" aria-hidden="true" />
              </div>
              {/* When you have a photo, uncomment this and comment out the div above:
              <Image
                src="/images/profile.jpg"
                alt="Boden Crouch — self-taught infrastructure engineer"
                width={128}
                height={128}
                className="object-cover"
                priority
              />
              */}
            </div>
          </motion.div>
          
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              Hi, I'm{' '}
              <span className="gradient-text">
                Boden Crouch
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary font-medium">
              Self-taught infrastructure engineer & software developer
            </p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              I design, deploy, and maintain complex technical systems, create open source projects, and share technical knowledge. Open to remote opportunities.
            </p>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="glass rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{yearsExperience}+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Server className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats?.totalServices ?? '8+'}</div>
              <div className="text-sm text-muted-foreground">Live Services</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats?.avgUptime ? `${stats.avgUptime.toFixed(1)}%` : '99.9%'}</div>
              <div className="text-sm text-muted-foreground">Avg Uptime</div>
            </div>
          </motion.div>

          {/* Hire Me CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-8"
          >
            <p className="text-muted-foreground text-sm mb-4">
              Hiring? <Link href="/Boden_Crouch_Resume.pdf" className="text-primary hover:text-primary/80 font-medium underline">Download my resume (PDF)</Link> — Available for full-time or contract roles.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "shadow-lg hover:shadow-xl hover:scale-105",
                "focus-ring"
              )}
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              Contact Me
            </Link>
            <Link
              href="https://github.com/bolabaden"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200",
                "glass hover:bg-white/10",
                "focus-ring"
              )}
              aria-label="Visit Boden Crouch's GitHub profile (opens in new tab)"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
              GitHub Profile
            </Link>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-4">
              Looking for a technical engineer who can build, deploy, and maintain complex systems? Let's discuss how I can help your team.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                href="#services" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                Browse All Services <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link 
                href="#projects" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View Projects <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link 
                href="#guides" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                Technical Guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 