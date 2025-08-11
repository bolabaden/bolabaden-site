import { NextRequest } from 'next/server'

const errorMessages = {
  400: {
    title: 'Bad Request',
    message: 'The request could not be understood or was missing required parameters.',
    technical: 'Request malformed or invalid syntax detected.'
  },
  401: {
    title: 'Unauthorized',
    message: 'Authentication is required to access this service.',
    technical: 'Valid credentials are required for this endpoint.'
  },
  403: {
    title: 'Access Denied',
    message: 'You do not have permission to access this service.',
    technical: 'Insufficient permissions for the requested resource.'
  },
  404: {
    title: 'Service Not Found',
    message: 'The service you\'re looking for seems to be offline or doesn\'t exist in our infrastructure.',
    technical: 'Resource not found in the current service mesh.'
  },
  429: {
    title: 'Rate Limited',
    message: 'Too many requests. Please slow down and try again later.',
    technical: 'Request rate limit exceeded for this endpoint.'
  },
  500: {
    title: 'Internal Server Error',
    message: 'Something went wrong on our end. Our monitoring systems have been notified.',
    technical: 'An unexpected error occurred while processing the request.'
  },
  502: {
    title: 'Bad Gateway',
    message: 'The service is temporarily unavailable. Please try again in a moment.',
    technical: 'Invalid response received from upstream server.'
  },
  503: {
    title: 'Service Unavailable',
    message: 'The service is currently undergoing maintenance or is temporarily overloaded.',
    technical: 'Service temporarily unavailable due to overload or maintenance.'
  },
  504: {
    title: 'Gateway Timeout',
    message: 'The service took too long to respond. Please try again later.',
    technical: 'Upstream server failed to respond within timeout period.'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { status: string } }
) {
  const status = parseInt(params.status, 10)
  const errorInfo = errorMessages[status as keyof typeof errorMessages] || {
    title: 'Unknown Error',
    message: 'An unexpected error occurred.',
    technical: `HTTP ${status} error encountered.`
  }

  // Get the original URL that caused the error from headers
  const originalUrl = request.headers.get('x-original-url') || request.url

  // Return HTML error page that matches the portfolio theme
  const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error ${status} - bolabaden.org</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --background: 222 47% 11%;
            --foreground: 210 20% 98%;
            --primary: 217 91% 60%;
        }
        
        body {
            color: hsl(var(--foreground));
            background: hsl(var(--background));
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .glass {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .gradient-text {
            background: linear-gradient(135deg, hsl(var(--primary)), hsl(217 32% 17%));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .grid-pattern {
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .float-animation {
            animation: float 3s ease-in-out infinite;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 grid-pattern opacity-20"></div>
    
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full float-animation" style="animation-delay: 0s;"></div>
        <div class="absolute top-40 right-32 w-1 h-1 bg-purple-500 rounded-full float-animation" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full float-animation" style="animation-delay: 2s;"></div>
    </div>

    <div class="container mx-auto px-4 py-12 relative z-10">
        <div class="max-w-2xl mx-auto text-center">
            <div class="mb-8">
                <div class="glass rounded-2xl p-8 mb-6">
                    <h1 class="text-6xl md:text-8xl font-bold gradient-text mb-4">${status}</h1>
                </div>
            </div>

            <div class="mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">${errorInfo.title}</h2>
                <p class="text-lg text-gray-300 mb-6 leading-relaxed">${errorInfo.message}</p>
            </div>

            <div class="glass rounded-lg p-6 mb-8">
                <div class="flex items-center gap-3 mb-4">
                    <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                    </svg>
                    <h3 class="font-semibold text-white">Technical Details</h3>
                </div>
                <div class="text-sm text-gray-400 text-left">
                    <div class="mb-2"><strong>Status:</strong> ${status}</div>
                    <div class="mb-2"><strong>Error:</strong> ${errorInfo.technical}</div>
                    <div class="mb-2"><strong>Time:</strong> ${new Date().toISOString()}</div>
                    <div class="truncate"><strong>Path:</strong> ${originalUrl}</div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Return Home
                </a>
                <a href="/#services" class="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-all duration-200 rounded-lg text-white">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Browse Services
                </a>
            </div>

            <div class="text-center">
                <p class="text-sm text-gray-400 mb-4">Need help? Can't find what you're looking for?</p>
                <div class="flex flex-wrap justify-center gap-4 text-sm">
                    <a href="mailto:boden.crouch@gmail.com" class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        Email Support
                    </a>
                    <a href="https://github.com/bolabaden" class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Report Issue
                    </a>
                </div>
            </div>

            <div class="mt-8">
                <div class="text-xs text-gray-500">
                    bolabaden.org • Self-Hosted Infrastructure
                </div>
            </div>
        </div>
    </div>
</body>
</html>`

  return new Response(html, {
    status: status,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { status: string } }
) {
  return GET(request, { params })
} 