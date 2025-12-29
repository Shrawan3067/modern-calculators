// src/hooks/useDebouncedCalculation.js
import { useState, useEffect } from 'react'

export function useDebouncedCalculation(calculate, inputs, delay = 300) {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      try {
        const calculated = calculate(inputs)
        setResults(calculated)
      } catch (error) {
        console.error('Calculation error:', error)
      } finally {
        setLoading(false)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [calculate, inputs, delay])

  return { results, loading }
}