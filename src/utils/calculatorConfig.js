// Utility function to convert calculator names to paths
export const getCalculatorPath = (name) => {
  return `/calculators/${name.toLowerCase().replace(/\s+/g, '-')}`
}

// Calculator categories and their items
export const calculatorCategories = {
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

// Flattened list of all calculators with metadata
export const allCalculators = Object.entries(calculatorCategories).flatMap(([category, items]) => 
  items.map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    category,
    path: getCalculatorPath(name),
    description: `Calculate ${name.toLowerCase()} with precision`
  }))
)

// Group calculators by category for sidebar
export const calculatorsByCategory = allCalculators.reduce((acc, calculator) => {
  if (!acc[calculator.category]) {
    acc[calculator.category] = []
  }
  acc[calculator.category].push(calculator)
  return acc
}, {})