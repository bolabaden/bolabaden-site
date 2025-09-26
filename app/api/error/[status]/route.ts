import { NextRequest } from 'next/server'

const errorMessages = {
  400: {
    title: 'Bad Request',
    message: 'The request could not be understood by the server due to malformed syntax or missing parameters.',
    technical: 'Request malformed or invalid syntax detected. Please check your request payload and parameters.'
  },
  401: {
    title: 'Unauthorized',
    message: 'Authentication is required to access this resource. Please provide valid credentials.',
    technical: 'Valid authentication credentials are required for this endpoint. Token or session may be missing or expired.'
  },
  402: {
    title: 'Payment Required',
    message: 'Payment is required to access this resource or service.',
    technical: 'The requested resource requires payment before it can be accessed. This status is reserved for future use.'
  },
  403: {
    title: 'Forbidden',
    message: 'You do not have permission to access this resource.',
    technical: 'Insufficient permissions for the requested resource. Access is explicitly denied.'
  },
  404: {
    title: 'Not Found',
    message: 'The requested resource could not be found on this server.',
    technical: 'Resource not found in the current service mesh or endpoint does not exist.'
  },
  405: {
    title: 'Method Not Allowed',
    message: 'The HTTP method used is not allowed for this resource.',
    technical: 'The method specified in the request is not allowed for the resource identified by the request URI.'
  },
  406: {
    title: 'Not Acceptable',
    message: 'The requested resource is only capable of generating content not acceptable according to the Accept headers sent.',
    technical: 'No content matching the Accept headers could be found.'
  },
  407: {
    title: 'Proxy Authentication Required',
    message: 'You must authenticate with a proxy server before this request can be served.',
    technical: 'Proxy authentication credentials are required.'
  },
  408: {
    title: 'Request Timeout',
    message: 'The server timed out waiting for the request.',
    technical: 'The client did not produce a request within the time that the server was prepared to wait.'
  },
  409: {
    title: 'Conflict',
    message: 'The request could not be completed due to a conflict with the current state of the resource.',
    technical: 'Resource conflict detected, such as an edit conflict or duplicate entry.'
  },
  410: {
    title: 'Gone',
    message: 'The requested resource is no longer available and will not be available again.',
    technical: 'Resource has been permanently removed from the server.'
  },
  411: {
    title: 'Length Required',
    message: 'A Content-Length header is required on the request.',
    technical: 'The server refuses to accept the request without a defined Content-Length.'
  },
  412: {
    title: 'Precondition Failed',
    message: 'One or more conditions given in the request header fields evaluated to false.',
    technical: 'Precondition in request headers was not met.'
  },
  413: {
    title: 'Payload Too Large',
    message: 'The request is larger than the server is willing or able to process.',
    technical: 'Request entity is too large.'
  },
  414: {
    title: 'URI Too Long',
    message: 'The URI provided was too long for the server to process.',
    technical: 'Request-URI is longer than the server is willing to interpret.'
  },
  415: {
    title: 'Unsupported Media Type',
    message: 'The request entity has a media type which the server or resource does not support.',
    technical: 'Unsupported Content-Type in request.'
  },
  416: {
    title: 'Range Not Satisfiable',
    message: 'The client has asked for a portion of the file, but the server cannot supply that portion.',
    technical: 'Requested range not satisfiable.'
  },
  417: {
    title: 'Expectation Failed',
    message: 'The server cannot meet the requirements of the Expect request-header field.',
    technical: 'Expectation in request could not be fulfilled.'
  },
  418: {
    title: "I'm a teapot",
    message: 'The server refuses to brew coffee because it is, permanently, a teapot.',
    technical: 'RFC 2324: This code is returned by teapots requested to brew coffee.'
  },
  421: {
    title: 'Misdirected Request',
    message: 'The request was directed at a server that is not able to produce a response.',
    technical: 'Request was sent to a server not configured to respond.'
  },
  422: {
    title: 'Unprocessable Entity',
    message: 'The server understands the content type of the request entity, but was unable to process the contained instructions.',
    technical: 'Semantic errors in the request entity.'
  },
  423: {
    title: 'Locked',
    message: 'The resource that is being accessed is locked.',
    technical: 'Resource is currently locked and cannot be modified.'
  },
  424: {
    title: 'Failed Dependency',
    message: 'The request failed due to failure of a previous request.',
    technical: 'A dependency on another request failed.'
  },
  425: {
    title: 'Too Early',
    message: 'The server is unwilling to risk processing a request that might be replayed.',
    technical: 'Request was sent too early.'
  },
  426: {
    title: 'Upgrade Required',
    message: 'The client should switch to a different protocol.',
    technical: 'Protocol upgrade required (e.g., to TLS/1.0).'
  },
  428: {
    title: 'Precondition Required',
    message: 'The origin server requires the request to be conditional.',
    technical: 'Request must be conditional to prevent lost updates.'
  },
  429: {
    title: 'Too Many Requests',
    message: 'You have sent too many requests in a given amount of time. Please slow down and try again later.',
    technical: 'Request rate limit exceeded for this endpoint.'
  },
  431: {
    title: 'Request Header Fields Too Large',
    message: 'The server is unwilling to process the request because its header fields are too large.',
    technical: 'Request headers too large.'
  },
  451: {
    title: 'Unavailable For Legal Reasons',
    message: 'The requested resource is unavailable due to legal reasons.',
    technical: 'Resource access is restricted by law or regulation.'
  },
  500: {
    title: 'Internal Server Error',
    message: 'An unexpected error occurred on the server. Our monitoring systems have been notified.',
    technical: 'An unexpected error occurred while processing the request.'
  },
  501: {
    title: 'Not Implemented',
    message: 'The server does not support the functionality required to fulfill the request.',
    technical: 'Requested method is not implemented by the server.'
  },
  502: {
    title: 'Bad Gateway',
    message: 'The server received an invalid response from the upstream server.',
    technical: 'Invalid response received from upstream server.'
  },
  503: {
    title: 'Service Unavailable',
    message: 'The service is currently unavailable due to maintenance or overload. Please try again later.',
    technical: 'Service temporarily unavailable due to overload or maintenance.'
  },
  504: {
    title: 'Gateway Timeout',
    message: 'The upstream server failed to send a request in the time allowed by the server.',
    technical: 'Upstream server failed to respond within timeout period.'
  },
  505: {
    title: 'HTTP Version Not Supported',
    message: 'The server does not support the HTTP protocol version used in the request.',
    technical: 'Unsupported HTTP version.'
  },
  506: {
    title: 'Variant Also Negotiates',
    message: 'The server has an internal configuration error: transparent content negotiation for the request results in a circular reference.',
    technical: 'Content negotiation configuration error.'
  },
  507: {
    title: 'Insufficient Storage',
    message: 'The server is unable to store the representation needed to complete the request.',
    technical: 'Server storage limit reached.'
  },
  508: {
    title: 'Loop Detected',
    message: 'The server detected an infinite loop while processing the request.',
    technical: 'Infinite loop detected in request processing.'
  },
  510: {
    title: 'Not Extended',
    message: 'Further extensions to the request are required for the server to fulfill it.',
    technical: 'Request needs further extensions.'
  },
  511: {
    title: 'Network Authentication Required',
    message: 'You need to authenticate to gain network access.',
    technical: 'Network authentication required before request can be fulfilled.'
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

  // Extract the original URL from reverse proxy headers
  const getOriginalUrl = (request: NextRequest) => {
    // Try various headers set by reverse proxies
    const xOriginalUrl = request.headers.get('x-original-url')
    const xForwardedHost = request.headers.get('x-forwarded-host')
    const xForwardedProto = request.headers.get('x-forwarded-proto')
    const referer = request.headers.get('referer')
    
    // If we have forwarded host and proto, construct the original URL
    if (xForwardedHost && xForwardedProto) {
      return `${xForwardedProto}://${xForwardedHost}`
    }
    
    // Fall back to other headers
    if (xOriginalUrl) return xOriginalUrl
    if (referer) return referer
    
    // Last resort - try to extract from current URL
    const currentUrl = new URL(request.url)
    if (currentUrl.searchParams.get('url')) {
      return currentUrl.searchParams.get('url')!
    }
    
    // Default fallback
    return 'Unknown URL'
  }
  
  const originalUrl = getOriginalUrl(request)

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
        
        .copy-animation {
            animation: pulse 0.5s ease-in-out;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .tooltip {
            position: relative;
        }
        
        .tooltip:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
        }
    </style>
    <script>
        function searchService() {
            const query = document.getElementById('serviceSearch').value.trim().toLowerCase();
            if (query) {
                // Try common service patterns
                const serviceUrl = \`https://\${query}.bolabaden.org\`;
                window.open(serviceUrl, '_blank');
            }
        }
        
        function copyErrorId() {
            const errorId = 'ERR-${status}-' + Date.now().toString(36).toUpperCase();
            navigator.clipboard.writeText(errorId).then(() => {
                const btn = document.getElementById('copyErrorBtn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '✓ Copied!';
                btn.classList.add('copy-animation');
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('copy-animation');
                }, 2000);
            });
        }
        
        function reportIssue() {
            const errorData = {
                status: ${status},
                timestamp: new Date().toISOString(),
                url: '${originalUrl}',
                userAgent: navigator.userAgent
            };
            
            const subject = encodeURIComponent(\`Error ${status} Report - bolabaden.org\`);
            const body = encodeURIComponent(\`Error Details:\n\nStatus: ${status}\nURL: ${originalUrl}\nTime: \${errorData.timestamp}\nUser Agent: \${errorData.userAgent}\n\nDescription:\n[Please describe what you were trying to do]\`);
            
            window.open(\`mailto:boden.crouch@gmail.com?subject=\${subject}&body=\${body}\`);
        }
        
        // Auto-retry functionality for certain errors
        let retryCount = 0;
        function autoRetry() {
            if (retryCount < 3 && [502, 503, 504].includes(${status})) {
                retryCount++;
                setTimeout(() => {
                    const retryBtn = document.getElementById('autoRetryBtn');
                    if (retryBtn) {
                        retryBtn.textContent = \`Auto-retry \${retryCount}/3 in progress...\`;
                        location.reload();
                    }
                }, 5000 * retryCount); // Increasing delay: 5s, 10s, 15s
            }
        }
        
        // Initialize auto-retry for server errors
        if ([502, 503, 504].includes(${status})) {
            setTimeout(autoRetry, 2000);
        }
        
        // Populate dynamic information
        function populateErrorInfo() {
            // Generate error ID suffix
            const errorIdSuffix = Date.now().toString(36).toUpperCase();
            const errorIdElement = document.getElementById('errorIdSuffix');
            if (errorIdElement) {
                errorIdElement.textContent = errorIdSuffix;
            }
            
            // Populate browser info
            const browserInfo = navigator.userAgent.split(' ').pop() || 'Unknown';
            const browserInfoElement = document.getElementById('browserInfo');
            if (browserInfoElement) {
                browserInfoElement.textContent = browserInfo;
            }
        }
        
        // Allow Enter key in search
        document.addEventListener('DOMContentLoaded', function() {
            populateErrorInfo();
            
            const searchInput = document.getElementById('serviceSearch');
            if (searchInput) {
                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        searchService();
                    }
                });
            }
        });
    </script>
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
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                        </svg>
                        <h3 class="font-semibold text-white">Technical Details</h3>
                    </div>
                    <button 
                        id="copyErrorBtn" 
                        onclick="copyErrorId()" 
                        class="tooltip px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        data-tooltip="Copy error ID for support"
                    >
                        Copy Error ID
                    </button>
                </div>
                <div class="text-sm text-gray-400 text-left space-y-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div><strong>Status Code:</strong> ${status}</div>
                            <div><strong>Error Type:</strong> ${errorInfo.technical}</div>
                            <div><strong>Timestamp:</strong> ${new Date().toISOString()}</div>
                        </div>
                        <div>
                            <div class="break-all"><strong>Failed URL:</strong> ${originalUrl}</div>
                            <div><strong>Browser:</strong> <span id="browserInfo">Loading...</span></div>
                            <div><strong>Error ID:</strong> ERR-${status}-<span id="errorIdSuffix"></span></div>
                        </div>
                    </div>
                </div>
                ${[502, 503, 504].includes(status) ? `
                <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <div class="flex items-center gap-2 text-yellow-400">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <span class="text-sm font-medium">Auto-retry enabled</span>
                    </div>
                    <div class="text-sm text-yellow-300 mt-1">
                        This page will automatically retry in case of temporary server issues.
                    </div>
                    <button id="autoRetryBtn" class="mt-2 text-xs text-yellow-400 hover:text-yellow-300 underline">
                        Auto-retry will start in 2 seconds...
                    </button>
                </div>
                ` : ''}
            </div>

            <!-- Primary Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a href="https://bolabaden.org" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Return Home
                </a>
                <button onclick="history.back()" class="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-all duration-200 rounded-lg text-white">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Go Back
                </button>
                <button onclick="location.reload()" class="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-all duration-200 rounded-lg text-white">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Retry
                </button>
            </div>

            <!-- Quick Navigation Menu -->
            <div class="glass rounded-lg p-6 mb-8">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Quick Navigation
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <a href="https://bolabaden.org/#services" class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors text-center">
                        <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                        </svg>
                        <span class="text-sm text-gray-300">Services</span>
                    </a>
                    <a href="https://bolabaden.org/#about" class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors text-center">
                        <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="text-sm text-gray-300">About</span>
                    </a>
                    <a href="https://status.bolabaden.org" class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors text-center">
                        <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-sm text-gray-300">Status</span>
                    </a>
                    <a href="https://bolabaden.org/dashboard" class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors text-center">
                        <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        <span class="text-sm text-gray-300">Dashboard</span>
                    </a>
                </div>
            </div>

            <!-- Support & Help Section -->
            <div class="glass rounded-lg p-6 mb-8">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.196l1.732 1L12 5.196 10.268 3.196 12 2.196zM12 18.804l1.732 1L12 21.804 10.268 19.804 12 18.804z"></path>
                    </svg>
                    Get Support
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-3">
                        <a href="mailto:boden.crouch@gmail.com" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <div class="text-sm font-medium text-white">Email Support</div>
                                <div class="text-xs text-gray-400">boden.crouch@gmail.com</div>
                            </div>
                        </a>
                        <button onclick="reportIssue()" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors w-full text-left">
                            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            <div>
                                <div class="text-sm font-medium text-white">Report Issue</div>
                                <div class="text-xs text-gray-400">Pre-filled error report</div>
                            </div>
                        </button>
                    </div>
                    <div class="space-y-3">
                        <a href="https://status.bolabaden.org" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <div class="text-sm font-medium text-white">Service Status</div>
                                <div class="text-xs text-gray-400">Check system health</div>
                            </div>
                        </a>
                        <a href="https://github.com/bolabaden" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <div>
                                <div class="text-sm font-medium text-white">GitHub</div>
                                <div class="text-xs text-gray-400">Source & issues</div>
                            </div>
                        </a>
                    </div>
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