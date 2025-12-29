import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, Suspense, lazy } from 'react'
import Layout from './components/ui/Layout'
import Home from './pages/Home'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy load calculator pages for better performance
const MortgageCalculator = lazy(() => import('./components/calculators/MortgageCalculator'))
const BMICalculator = lazy(() => import('./components/calculators/BMICalculator'))
const LoanCalculator = lazy(() => import('./components/calculators/LoanCalculator'))
const PercentageCalculator = lazy(() => import('./components/calculators/PercentageCalculator'))
const InterestCalculator = lazy(() => import('./components/calculators/InterestCalculator'))
const InvestmentCalculator = lazy(() => import('./components/calculators/InvestmentCalculator'))

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <BrowserRouter>
      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculators/mortgage" element={<MortgageCalculator />} />
            <Route path="/calculators/bmi" element={<BMICalculator />} />
            <Route path="/calculators/loan" element={<LoanCalculator />} />
            <Route path="/calculators/percentage" element={<PercentageCalculator />} />
            <Route path="/calculators/interest" element={<InterestCalculator />} />
            <Route path="/calculators/investment" element={<InvestmentCalculator />} />
            {/* Add more calculator routes as needed */}
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}