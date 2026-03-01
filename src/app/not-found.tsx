"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Home,
  Search,
  ArrowLeft,
  Server,
  AlertTriangle,
  Mail,
  Github,
} from "lucide-react";
import { config } from "@/lib/config";
import { FloatingElements } from "@/components/floating-elements";

export default function NotFound() {
  const [stats, setStats] = useState<{
    totalServices: number;
    avgUptime: number;
    onlineServices: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalServices: data?.stats?.totalServices ?? 0,
            avgUptime: data?.stats?.avgUptime ?? 0,
            onlineServices: data?.stats?.onlineServices ?? 0,
          });
        }
      } catch {}
    };
    fetchStats();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden bg-background">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating Elements */}
      <FloatingElements />

      <div className="container relative z-10 px-4 py-12 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="p-8 mb-6 glass rounded-2xl">
              <div className="relative">
                <h1 className="mb-4 font-bold text-8xl md:text-9xl gradient-text">
                  404
                </h1>
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
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
            <h2 className="mb-4 text-2xl font-bold md:text-3xl text-foreground">
              Service Not Found
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              The service you're looking for seems to be offline or doesn't
              exist in our infrastructure. Even with{" "}
              {stats?.totalServices
                ? `${stats.totalServices} services`
                : "multiple services"}{" "}
              running, this one got away from us.
            </p>
          </motion.div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 mb-8 rounded-lg glass"
          >
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">System Status</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="text-center">
                <div className="font-bold text-green-400">
                  {stats ? `${stats.avgUptime.toFixed(1)}%` : "—"}
                </div>
                <div className="text-muted-foreground">
                  Infrastructure Uptime
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-primary">
                  {stats?.onlineServices ?? "—"}
                </div>
                <div className="text-muted-foreground">Services Online</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-yellow-400">1</div>
                <div className="text-muted-foreground">Service Missing</div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 mb-8 sm:flex-row"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 transition-all duration-200 rounded-lg shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 transition-all duration-200 rounded-lg glass hover:bg-white/10"
            >
              <Search className="w-4 h-4" />
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
            <p className="mb-4 text-sm text-muted-foreground">
              Need help? Can't find what you're looking for?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href={`mailto:${config.CONTACT_EMAIL}`}
                className="flex items-center gap-1 transition-colors text-primary hover:text-primary/80"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </Link>
              <Link
                href={config.GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors text-primary hover:text-primary/80"
              >
                <Github className="w-4 h-4" />
                Report Issue
              </Link>
              <Link
                href="/guides"
                className="flex items-center gap-1 transition-colors text-primary hover:text-primary/80"
              >
                <ArrowLeft className="w-4 h-4" />
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
              {config.SITE_NAME} • Self-Hosted Infrastructure
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
