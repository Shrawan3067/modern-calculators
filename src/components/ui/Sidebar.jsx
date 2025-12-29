import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Sidebar({ calculators, onClose }) {
  const location = useLocation()
  const [openCategories, setOpenCategories] = useState({
    'Financial': true,
    'Math': true
  })
  const sidebarRef = useRef(null)
  const contentRef = useRef(null)

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const categories = {
    'Financial': [
      'Mortgage Calculator',
      'Loan Calculator',
      'Interest Calculator',
      'Credit Card Interest Calculator',
      'Investment Calculator',
      'Inflation Calculator',
      'Salary to Hourly Calculator',
      'Retirement Calculator'
    ],
    'Math': [
      'Percentage Calculator',
      'Fraction Calculator',
      'Average Calculator',
      'Standard Deviation Calculator',
      'Scientific Calculator'
    ],
    'Health & Fitness': [
      'BMI Calculator',
      'BMR Calculator',
      'Calorie Calculator',
      'Body Fat Calculator'
    ],
    'Date & Time': [
      'Age Calculator',
      'Date Difference Calculator',
      'Time Duration Calculator'
    ],
    'Unit Converters': [
      'Length Converter',
      'Weight Converter',
      'Temperature Converter',
      'Area Converter',
      'Volume Converter'
    ]
  }

  const getCalculatorPath = (calculatorName) => {
    const pathMap = {
      'Mortgage Calculator': '/calculators/mortgage',
      'Loan Calculator': '/calculators/loan',
      'Interest Calculator': '/calculators/interest',
      'Credit Card Interest Calculator': '/calculators/credit-card',
      'Investment Calculator': '/calculators/investment',
      'Inflation Calculator': '/calculators/inflation',
      'Salary to Hourly Calculator': '/calculators/salary',
      'Retirement Calculator': '/calculators/retirement',
      'Percentage Calculator': '/calculators/percentage',
      'Fraction Calculator': '/calculators/fraction',
      'Average Calculator': '/calculators/average',
      'Standard Deviation Calculator': '/calculators/standard-deviation',
      'Scientific Calculator': '/calculators/scientific',
      'BMI Calculator': '/calculators/bmi',
      'BMR Calculator': '/calculators/bmr',
      'Calorie Calculator': '/calculators/calorie',
      'Body Fat Calculator': '/calculators/body-fat',
      'Age Calculator': '/calculators/age',
      'Date Difference Calculator': '/calculators/date-difference',
      'Time Duration Calculator': '/calculators/time-duration',
      'Length Converter': '/calculators/length',
      'Weight Converter': '/calculators/weight',
      'Temperature Converter': '/calculators/temperature',
      'Area Converter': '/calculators/area',
      'Volume Converter': '/calculators/volume'
    }
    
    return pathMap[calculatorName] || `/calculators/${calculatorName.toLowerCase().replace(/\s+/g, '-').replace('-calculator', '')}`
  }

  return (
    <nav className="h-full flex flex-col" ref={sidebarRef}>
      {/* Fixed header section */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-border bg-surface/50">
        <h2 className="text-lg font-semibold text-text mb-2">Calculator categories</h2>
        <p className="text-sm text-text/60">Browse all calculators</p>
      </div>
      
      {/* Scrollable content section */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto p-3 md:p-4"
        style={{
          maxHeight: 'calc(100vh - 9rem)', // Adjust based on your header height
        }}
      >
        <div className="space-y-2">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="mb-4">
              <button
                onClick={() => toggleCategory(category)}
                className="flex bg-gray-100 items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="font-medium">{category}</span>
                {openCategories[category] ? (
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                )}
              </button>

              {openCategories[category] && (
                <div className="ml-2 mt-1 space-y-1">
                  {items.map((item) => {
                    const path = getCalculatorPath(item)
                    const isActive = location.pathname === path
                    
                    return (
                      <Link
                        key={item}
                        to={path}
                        onClick={onClose} // Close sidebar on mobile when clicking a link
                        className={`flex items-center p-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-background'
                        }`}
                      >
                        <span className="text-sm">{item}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}