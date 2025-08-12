// Format a number with comma separators
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

// Format bytes to human-readable format
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get color based on value percentage (red for high, green for low)
export const getHealthColor = (value: number, inverse = false): string => {
  if (inverse) {
    // For metrics where higher is better (like uptime)
    if (value >= 98) return 'text-green-500'
    if (value >= 95) return 'text-green-400'
    if (value >= 90) return 'text-yellow-500'
    if (value >= 80) return 'text-orange-500'
    return 'text-red-500'
  } else {
    // For metrics where lower is better (like CPU usage)
    if (value >= 90) return 'text-red-500'
    if (value >= 75) return 'text-orange-500'
    if (value >= 60) return 'text-yellow-500'
    if (value >= 40) return 'text-green-400'
    return 'text-green-500'
  }
}

// Get background color based on value percentage
export const getHealthBgColor = (value: number, inverse = false): string => {
  if (inverse) {
    // For metrics where higher is better (like uptime)
    if (value >= 98) return 'bg-green-500/20'
    if (value >= 95) return 'bg-green-400/20'
    if (value >= 90) return 'bg-yellow-500/20'
    if (value >= 80) return 'bg-orange-500/20'
    return 'bg-red-500/20'
  } else {
    // For metrics where lower is better (like CPU usage)
    if (value >= 90) return 'bg-red-500/20'
    if (value >= 75) return 'bg-orange-500/20'
    if (value >= 60) return 'bg-yellow-500/20'
    if (value >= 40) return 'bg-green-400/20'
    return 'bg-green-500/20'
  }
}

// Format a timestamp
export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

// Generate sparkline points for a chart
export const generateSparklinePoints = (
  data: number[], 
  width: number, 
  height: number, 
  padding = 5
): string => {
  if (!data.length) return ''
  
  const effectiveWidth = width - (padding * 2)
  const effectiveHeight = height - (padding * 2)
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * effectiveWidth
    const y = height - (padding + ((value - min) / range) * effectiveHeight)
    return `${x},${y}`
  })
  
  return points.join(' ')
}

// Get color for status
export const getStatusConfig = (status: 'online' | 'offline' | 'maintenance') => {
  const statusConfig = {
    online: { color: 'text-green-500', bg: 'bg-green-500/20' },
    offline: { color: 'text-red-500', bg: 'bg-red-500/20' },
    maintenance: { color: 'text-yellow-500', bg: 'bg-yellow-500/20' }
  }
  
  return statusConfig[status]
}

// Convert category key to display name
export const getCategoryDisplayName = (category: string): string => {
  const categories: Record<string, string> = {
    'infrastructure': 'Infrastructure',
    'monitoring': 'Monitoring',
    'media': 'Media',
    'ai-ml': 'AI & ML',
    'security': 'Security',
    'development': 'Development',
    'networking': 'Networking',
    'storage': 'Storage',
  }
  
  return categories[category] || category
}
