'use server'

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use dockerproxy service from docker-compose.yml to get real container data
    const dockerProxyUrl = process.env.DOCKER_PROXY_URL || 'http://dockerproxy:2375'
    
    const containersRes = await fetch(`${dockerProxyUrl}/containers/json?all=true`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    })
    
    if (!containersRes.ok) {
      throw new Error(`Docker API failed: ${containersRes.status}`)
    }
    
    const containers = await containersRes.json()
    
    // Filter for containers that are safe to embed and have Traefik routing
    const safeEmbeds = containers
      .filter((container: any) => {
        const name = container.Names?.[0]?.replace('/', '') || ''
        const labels = container.Labels || {}
        const hasTraefik = labels['traefik.enable'] === 'true'
        const isRunning = container.State === 'running'
        
        // Only include containers that are safe to embed (read-only services)
        const safeServices = ['homepage', 'prometheus', 'searxng', 'grafana', 'whoami', 'portainer']
        const isSafe = safeServices.some(safe => name.includes(safe))
        
        return hasTraefik && isRunning && isSafe
      })
      .map((container: any) => {
        const name = container.Names?.[0]?.replace('/', '') || ''
        const labels = container.Labels || {}
        const description = labels['homepage.description'] || `${container.Image} service`
        
        // Extract subdomain from Traefik rule
        let subdomain = name
        const traefikRule = labels[`traefik.http.routers.${name}.rule`]
        if (traefikRule) {
          const hostMatch = traefikRule.match(/Host\(`([^`]+)`\)/)
          if (hostMatch) {
            subdomain = hostMatch[1].split('.')[0]
          }
        }
        
        return {
          id: name,
          title: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
          subdomain,
          description,
          image: container.Image,
          status: container.State,
          created: container.Created
        }
      })
    
    return NextResponse.json({ services: safeEmbeds })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch real-time container data',
      message: error instanceof Error ? error.message : 'Unknown error',
      services: []
    }, { status: 500 })
  }
}


