'use client'

import { useState, useRef, useEffect } from 'react'
import { Section } from './section'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'

type Service = {
  id: string
  name: string
  description: string
  url: string
  height?: number
}

export function EmbedsSection() {
  const defaultTab = config.EMBED_SERVICES[config.EMBED_SERVICES.length - 1]?.id || 'homepage'
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // Advanced seamless iframe setup
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    // Apply comprehensive stealth styles
    const applyStealthStyling = () => {
      // Container styling
      const container = iframe.parentElement
      if (container) {
        Object.assign(container.style, {
          overflow: 'hidden',
          border: 'none',
          margin: '0',
          padding: '0',
          background: 'transparent'
        })
      }

      // Iframe styling
      Object.assign(iframe.style, {
        width: '100%',
        height: '100vh',
        minHeight: '800px',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        overflow: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        resize: 'none',
        margin: '0',
        padding: '0'
      })

      // Force remove WebKit scrollbars and add seamless styling
      const style = document.createElement('style')
      style.textContent = `
        #${iframe.id || 'embedded-iframe'}::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        #${iframe.id || 'embedded-iframe'} {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          border: none !important;
          outline: none !important;
        }
        #${iframe.id || 'embedded-iframe'}::before,
        #${iframe.id || 'embedded-iframe'}::after {
          display: none !important;
        }
      `
      document.head.appendChild(style)

      // Try to inject CSS into iframe content (may fail due to CORS)
      iframe.addEventListener('load', () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDoc) {
            const iframeStyle = iframeDoc.createElement('style')
            iframeStyle.textContent = `
              body {
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
              body::-webkit-scrollbar {
                display: none !important;
              }
              html {
                overflow: hidden !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
              html::-webkit-scrollbar {
                display: none !important;
              }
            `
            iframeDoc.head?.appendChild(iframeStyle)
          }
        } catch (e) {
          // CORS prevents access - this is expected for cross-origin iframes
          console.log('Cannot modify iframe content due to CORS (expected)')
        }
      })

      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style)
        }
      }
    }

    // Apply on load and immediately
    const cleanup = applyStealthStyling()
    iframe.addEventListener('load', applyStealthStyling)
    
    // Set unique ID for styling
    if (!iframe.id) {
      iframe.id = 'embedded-iframe'
    }

    return () => {
      cleanup()
      iframe.removeEventListener('load', applyStealthStyling)
    }
  }, [activeTab])

  // Build services array from config
  const services: Service[] = config.EMBED_SERVICES.map((svc) => ({
    id: svc.id,
    name: svc.name,
    description: svc.description,
    url: config.getSubdomainUrl(svc.subdomain),
    height: 700,
  }))

  const activeService = services.find(s => s.id === activeTab) || services[0]

  return (
    <Section id="embeds" title="Live Services" subtitle="Embedded, read-only views of self-hosted services" background="muted">
      <div className="glass rounded-lg p-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors rounded-t-lg border-b-2',
                activeTab === service.id
                  ? 'text-primary border-primary bg-primary/10'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              )}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* Service Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{activeService.name}</h3>
          <p className="text-sm text-muted-foreground">{activeService.description}</p>
          <a 
            href={activeService.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Open in new tab →
          </a>
        </div>

         {/* Completely Seamless Iframe */}
         <div className="seamless-iframe-container relative">
           <iframe
             ref={iframeRef}
             src={activeService.url}
             title={activeService.name}
             className="seamless-iframe"
             scrolling="no"
             frameBorder="0"
             style={{
               width: '100%',
               height: '100vh',
               minHeight: '800px'
             }}
             sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
             allow="fullscreen; camera; microphone; geolocation; payment; autoplay; encrypted-media"
           />
         </div>
      </div>
    </Section>
  )
}


