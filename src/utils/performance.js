// src/utils/performance.js
export const reportWebVitals = (metric) => {
  // Send to analytics service
  if (metric.delta < 2000) {
    console.log(`Good performance: ${metric.name} took ${metric.delta}ms`)
  } else {
    console.warn(`Performance alert: ${metric.name} took ${metric.delta}ms`)
  }
}

// Optimize image loading
export const optimizeImage = (url, width = 800) => {
  return `${url}?width=${width}&format=webp&quality=80`
}