import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Chart colors as CSS custom properties
        'chart-blue': '#3b82f6',
        'chart-green': '#10b981', 
        'chart-purple': '#8b5cf6',
        'chart-orange': '#f97316',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Category colors for dashboard
        category: {
          infrastructure: '#3b82f6',
          monitoring: '#10b981',
          media: '#f59e0b',
          'ai-ml': '#8b5cf6',
          security: '#ef4444',
          development: '#ec4899',
          networking: '#06b6d4',
          storage: '#6366f1',
          default: '#9ca3af',
        },
        // Chart colors
        chart: {
          background: '#1f2937',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in': 'slide-in 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      height: {
        'iframe-sm': '400px',
        'iframe-md': '500px',
        'iframe-lg': '600px',
        'iframe-xl': '700px',
        'chart-sm': '150px',
        'chart-md': '200px',
        'chart-lg': '250px',
      },
      width: {
        'progress': '100%',
      },
      backgroundColor: {
        'chart-bg': '#1f2937',
      },
    },
  },
  plugins: [
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        // Progress Bar Components
        '.progress-bar': {
          width: '100%',
          'background-color': 'rgba(55, 65, 81, 0.3)',
          'border-radius': '9999px',
          height: '0.5rem',
        },
        '.progress-fill': {
          height: '100%',
          'border-radius': '9999px',
        },
        '.progress-fill-high': {
          'background-color': '#ef4444',
        },
        '.progress-fill-medium-high': {
          'background-color': '#f97316',
        },
        '.progress-fill-medium': {
          'background-color': '#f59e0b',
        },
        '.progress-fill-low': {
          'background-color': '#10b981',
        },
        
        // Category Components
        '.category-indicator': {
          width: '0.75rem',
          height: '0.75rem',
          'border-radius': '9999px',
        },
        '.category-infrastructure': {
          'background-color': '#3b82f6',
        },
        '.category-monitoring': {
          'background-color': '#10b981',
        },
        '.category-media': {
          'background-color': '#f59e0b',
        },
        '.category-ai-ml': {
          'background-color': '#8b5cf6',
        },
        '.category-security': {
          'background-color': '#ef4444',
        },
        '.category-development': {
          'background-color': '#ec4899',
        },
        '.category-networking': {
          'background-color': '#06b6d4',
        },
        '.category-storage': {
          'background-color': '#6366f1',
        },
        '.category-default': {
          'background-color': '#9ca3af',
        },
        
        // Chart Components
        '.chart-background': {
          fill: '#1f2937',
        },
        '.chart-grid-line': {
          stroke: 'currentColor',
          'stroke-opacity': '0.1',
          'stroke-dasharray': '4 4',
        },
        '.chart-height-sm': {
          height: '150px',
        },
        '.chart-height-md': {
          height: '200px',
        },
        '.chart-height-lg': {
          height: '250px',
        },
        
        // Trend Components
        '.trend-positive': {
          color: '#10b981',
        },
        '.trend-negative': {
          color: '#ef4444',
        },
        
        // Iframe Heights
        '.iframe-height-sm': {
          height: '400px',
        },
        '.iframe-height-md': {
          height: '500px',
        },
        '.iframe-height-lg': {
          height: '600px',
        },
        '.iframe-height-xl': {
          height: '700px',
        },
        
        // Status Indicators
        '.status-online': {
          color: '#10b981',
          'background-color': 'rgba(16, 185, 129, 0.2)',
        },
        '.status-offline': {
          color: '#ef4444',
          'background-color': 'rgba(239, 68, 68, 0.2)',
        },
        '.status-maintenance': {
          color: '#f59e0b',
          'background-color': 'rgba(245, 158, 11, 0.2)',
        },
        
        // Health Colors
        '.health-excellent': {
          color: '#10b981',
        },
        '.health-good': {
          color: '#22c55e',
        },
        '.health-fair': {
          color: '#f59e0b',
        },
        '.health-poor': {
          color: '#f97316',
        },
        '.health-critical': {
          color: '#ef4444',
        },
        
        // Status Badge Components
        '.status-badge-active': {
          'background-color': 'rgba(16, 185, 129, 0.2)',
          color: '#22c55e',
        },
        '.status-badge-completed': {
          'background-color': 'rgba(59, 130, 246, 0.2)',
          color: '#60a5fa',
        },
        '.status-badge-archived': {
          'background-color': 'rgba(156, 163, 175, 0.2)',
          color: '#9ca3af',
        },
        '.status-badge-beginner': {
          'background-color': 'rgba(16, 185, 129, 0.2)',
          color: '#22c55e',
        },
        '.status-badge-intermediate': {
          'background-color': 'rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
        },
        '.status-badge-advanced': {
          'background-color': 'rgba(239, 68, 68, 0.2)',
          color: '#f87171',
        },
        '.status-badge-expert': {
          'background-color': 'rgba(239, 68, 68, 0.2)',
          color: '#f87171',
        },
        
        // Filter Button States
        '.filter-online': {
          'background-color': 'rgba(5, 150, 105, 0.2)',
          color: '#22c55e',
        },
        '.filter-online-active': {
          'background-color': '#059669',
          color: '#ffffff',
        },
        '.filter-maintenance': {
          'background-color': 'rgba(217, 119, 6, 0.2)',
          color: '#fbbf24',
        },
        '.filter-maintenance-active': {
          'background-color': '#d97706',
          color: '#ffffff',
        },
        '.filter-offline': {
          'background-color': 'rgba(220, 38, 38, 0.2)',
          color: '#f87171',
        },
        '.filter-offline-active': {
          'background-color': '#dc2626',
          color: '#ffffff',
        },
        
        // Uptime Colors
        '.uptime-excellent': {
          color: '#10b981',
        },
        '.uptime-good': {
          color: '#22c55e',
        },
        '.uptime-fair': {
          color: '#f59e0b',
        },
        '.uptime-poor': {
          color: '#ef4444',
        },
        
        // Chart line utilities
        '.chart-line-blue': {
          stroke: '#3b82f6',
          'stroke-width': '2',
          'stroke-linejoin': 'round',
        },
        '.chart-line-green': {
          stroke: '#10b981',
          'stroke-width': '2',
          'stroke-linejoin': 'round',
        },
        '.chart-line-purple': {
          stroke: '#8b5cf6',
          'stroke-width': '2',
          'stroke-linejoin': 'round',
        },
        '.chart-line-orange': {
          stroke: '#f97316',
          'stroke-width': '2',
          'stroke-linejoin': 'round',
        },
        
        // Chart gradient utilities
        '.chart-gradient-blue': {
          fill: 'url(#gradient-blue)',
        },
        '.chart-gradient-green': {
          fill: 'url(#gradient-green)',
        },
        '.chart-gradient-purple': {
          fill: 'url(#gradient-purple)',
        },
        '.chart-gradient-orange': {
          fill: 'url(#gradient-orange)',
        },
        
        // Gradient stop utilities
        '.chart-gradient-stop-blue': {
          'stop-color': '#3b82f6',
        },
        '.chart-gradient-stop-green': {
          'stop-color': '#10b981',
        },
        '.chart-gradient-stop-purple': {
          'stop-color': '#8b5cf6',
        },
        '.chart-gradient-stop-orange': {
          'stop-color': '#f97316',
        },
        
        // Featured Project Indicators
        '.featured-star': {
          color: '#fbbf24',
        },
        
        // Error States
        '.error-text': {
          color: '#ef4444',
        },
        
        // Availability Indicators
        '.availability-online': {
          width: '0.75rem',
          height: '0.75rem',
          'background-color': '#10b981',
          'border-radius': '9999px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        '.availability-text': {
          color: '#22c55e',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

export default config 