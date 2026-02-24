'use client'

import { motion } from 'framer-motion'

/**
 * Floating animated background particles.
 * Used across hero, not-found, and global-error pages for consistent visual style.
 */

interface FloatingParticle {
  className: string
  animate: Record<string, number[]>
  transition: {
    duration: number
    repeat: typeof Infinity
    repeatType: 'reverse'
    delay?: number
  }
}

const PARTICLES: FloatingParticle[] = [
  {
    className: 'absolute top-20 left-20 w-2 h-2 bg-primary rounded-full',
    animate: { y: [0, -20, 0], opacity: [0.3, 1, 0.3] },
    transition: { duration: 4, repeat: Infinity, repeatType: 'reverse' },
  },
  {
    className: 'absolute top-40 right-32 w-1 h-1 bg-accent rounded-full',
    animate: { y: [0, 30, 0], opacity: [0.5, 1, 0.5] },
    transition: { duration: 6, repeat: Infinity, repeatType: 'reverse', delay: 2 },
  },
  {
    className: 'absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary/60 rounded-full',
    animate: { y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] },
    transition: { duration: 5, repeat: Infinity, repeatType: 'reverse', delay: 1 },
  },
]

/**
 * @param count Number of particles to render (default: all 3)
 */
export function FloatingElements({ count = PARTICLES.length }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {PARTICLES.slice(0, count).map((p, i) => (
        <motion.div
          key={i}
          className={p.className}
          animate={p.animate}
          transition={p.transition}
        />
      ))}
    </div>
  )
}
