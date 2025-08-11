'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Server, 
  AlertTriangle,
  Mail,
  Github
} from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
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
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="glass rounded-2xl p-8 mb-6">
              <div className="relative">
                <h1 className="text-8xl md:text-9xl font-bold gradient-text mb-4">
                  404
                </h1>
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Service Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              The service you're looking for seems to be offline or doesn't exist in our 
              infrastructure. Even with 100+ services running, this one got away from us.
            </p>
          </motion.div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass rounded-lg p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">System Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-400 font-bold">99.5%</div>
                <div className="text-muted-foreground">Infrastructure Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-primary font-bold">100+</div>
                <div className="text-muted-foreground">Services Online</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold">1</div>
                <div className="text-muted-foreground">Service Missing</div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-all duration-200 rounded-lg"
            >
              <Search className="h-4 w-4" />
              Browse Services
            </Link>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Need help? Can't find what you're looking for?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                href="mailto:boden.crouch@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </Link>
              <Link 
                href="https://github.com/bolabaden"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                Report Issue
              </Link>
              <Link 
                href="/#guides"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Check Guides
              </Link>
            </div>
          </motion.div>

          {/* Brand Recognition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8"
          >
            <div className="text-xs text-muted-foreground/60">
              bolabaden.org • Self-Hosted Infrastructure
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 