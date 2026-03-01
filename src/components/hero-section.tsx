"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Mail,
  Server,
  Code,
  Zap,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { config, getYearsOfExperience } from "@/lib/config";
import { FloatingElements } from "./floating-elements";

export function HeroSection() {
  const [stats, setStats] = useState<{
    totalServices: number;
    avgUptime: number;
  } | null>(null);
  const [yearsExperience, setYearsExperience] = useState<number>(
    getYearsOfExperience(),
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalServices: data?.stats?.totalServices ?? 0,
            avgUptime: data?.stats?.avgUptime ?? 0,
          });
        }
      } catch {}
    };
    setYearsExperience(getYearsOfExperience());
    fetchStats();
  }, []);

  const heroStats = [
    {
      id: "experience",
      icon: Code,
      value: `${yearsExperience}+`,
      label: "Years Experience",
      href: "/about#about",
      title: "See technical background and experience details",
    },
    {
      id: "services",
      icon: Server,
      value: `${stats?.totalServices ?? "8+"}`,
      label: "Live Services",
      href: "/about#embeds",
      title: "Browse live self-hosted services",
    },
    {
      id: "uptime",
      icon: Zap,
      value: stats?.avgUptime ? `${stats.avgUptime.toFixed(1)}%` : "99.9%",
      label: "Avg Uptime",
      href: "/dashboard",
      title: "Open full monitoring dashboard",
    },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen scroll-mt-28 flex items-center justify-center overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating Elements */}
      <FloatingElements />

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
              <div className="w-full h-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <User className="w-16 h-16 text-primary" aria-hidden="true" />
              </div>
              {/* When you have a photo, uncomment this and comment out the div above:
              <Image
                src="/images/profile.jpg"
                alt={`${config.OWNER_NAME} — ${config.JOB_TITLE.toLowerCase()}`}
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
              Hi, I&apos;m{" "}
              <span className="gradient-text">{config.OWNER_NAME}</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary font-medium">
              {config.JOB_SUBTITLE}
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
              {config.BIO}
            </p>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto"
          >
            {heroStats.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                title={item.title}
                className="glass rounded-lg p-4 hover:bg-white/10 transition-all duration-300 focus-ring"
              >
                <div className="flex items-center justify-center mb-2">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {item.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.label}
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Hire Me CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-8"
          >
            <p className="text-muted-foreground text-sm mb-4">
              Hiring?{" "}
              <Link
                href={config.RESUME_PATH}
                className="text-primary hover:text-primary/80 font-medium underline"
              >
                Download my resume (PDF)
              </Link>{" "}
              — Available for full-time or contract roles.
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
                "focus-ring",
              )}
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              Contact Me
            </Link>
            <Link
              href={config.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200",
                "glass hover:bg-white/10",
                "focus-ring",
              )}
              aria-label={`Visit ${config.OWNER_NAME}'s GitHub profile (opens in new tab)`}
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
              Looking for a technical engineer who can build, deploy, and
              maintain complex systems? Let's discuss how I can help your team.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/about#embeds"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                Browse All Services{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/about#projects"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View Projects{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/about#guides"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                Technical Guides{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
