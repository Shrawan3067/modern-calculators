import { useState, useMemo, useEffect } from 'react'
import InputGroup from '../ui/InputGroup'
import ResultDisplay from '../charts/ResultDisplay'
import DataTable from '../tables/DataTable'

export default function PercentageCalculator() {
  const [calculationType, setCalculationType] = useState('percentageOfNumber')
  const [formData, setFormData] = useState({
    // Type 1: What is X% of Y?
    percentageOfNumber_percentage: '10',
    percentageOfNumber_number: '100',
    
    // Type 2: X is what % of Y?
    whatPercentage_number1: '15',
    whatPercentage_number2: '75',
    
    // Type 3: X is Y% of what?
    percentageOfWhat_number: '20',
    percentageOfWhat_percentage: '25',
    
    // Type 4: Percentage increase/decrease
    percentageChange_original: '100',
    percentageChange_new: '120',
    
    // Type 5: Find percentage change
    findChange_original: '50',
    findChange_percentage: '20',
    findChange_direction: 'increase',
    
    // Type 6: Percentage difference
    percentageDiff_number1: '80',
    percentageDiff_number2: '100',
    percentageDiff_reference: 'average'
  })
  const [errors, setErrors] = useState({})

  const calculationTypes = [
    { 
      id: 'percentageOfNumber', 
      label: 'What is X% of Y?',
      description: 'Find the percentage of a number'
    },
    { 
      id: 'whatPercentage', 
      label: 'X is what % of Y?',
      description: 'Calculate percentage from two numbers'
    },
    { 
      id: 'percentageOfWhat', 
      label: 'X is Y% of what?',
      description: 'Find the whole from a percentage'
    },
    { 
      id: 'percentageChange', 
      label: 'Percentage increase/decrease',
      description: 'Calculate percentage change'
    },
    { 
      id: 'findChange', 
      label: 'Find percentage change',
      description: 'Apply percentage increase/decrease to a number'
    },
    { 
      id: 'percentageDiff', 
      label: 'Percentage difference',
      description: 'Compare two numbers'
    }
  ]

  const getCurrentInputs = () => {
    switch(calculationType) {
      case 'percentageOfNumber':
        return [
          {
            name: 'percentageOfNumber_percentage',
            label: 'Percentage (X%)',
            type: 'percentage',
            default: 10,
            required: true,
            min: 0,
            max: 1000,
            step: 0.1
          },
          {
            name: 'percentageOfNumber_number',
            label: 'Number (Y)',
            type: 'number',
            default: 100,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          }
        ]
      
      case 'whatPercentage':
        return [
          {
            name: 'whatPercentage_number1',
            label: 'First Number (X)',
            type: 'number',
            default: 15,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          },
          {
            name: 'whatPercentage_number2',
            label: 'Second Number (Y)',
            type: 'number',
            default: 75,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          }
        ]
      
      case 'percentageOfWhat':
        return [
          {
            name: 'percentageOfWhat_number',
            label: 'Number (X)',
            type: 'number',
            default: 20,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          },
          {
            name: 'percentageOfWhat_percentage',
            label: 'Percentage (Y%)',
            type: 'percentage',
            default: 25,
            required: true,
            min: 0,
            max: 1000,
            step: 0.1
          }
        ]
      
      case 'percentageChange':
        return [
          {
            name: 'percentageChange_original',
            label: 'Original Value',
            type: 'number',
            default: 100,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          },
          {
            name: 'percentageChange_new',
            label: 'New Value',
            type: 'number',
            default: 120,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          }
        ]
      
      case 'findChange':
        return [
          {
            name: 'findChange_original',
            label: 'Original Value',
            type: 'number',
            default: 50,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          },
          {
            name: 'findChange_percentage',
            label: 'Percentage Change',
            type: 'percentage',
            default: 20,
            required: true,
            min: -1000,
            max: 1000,
            step: 0.1
          },
          {
            name: 'findChange_direction',
            label: 'Direction',
            type: 'select',
            default: 'increase',
            required: true,
            options: [
              { value: 'increase', label: 'Increase' },
              { value: 'decrease', label: 'Decrease' }
            ]
          }
        ]
      
      case 'percentageDiff':
        return [
          {
            name: 'percentageDiff_number1',
            label: 'First Number',
            type: 'number',
            default: 80,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          },
          {
            name: 'percentageDiff_number2',
            label: 'Second Number',
            type: 'number',
            default: 100,
            required: true,
            min: -1000000,
            max: 1000000,
            step: 0.01
          },
          {
            name: 'percentageDiff_reference',
            label: 'Reference Value',
            type: 'select',
            default: 'average',
            required: true,
            options: [
              { value: 'average', label: 'Average of both numbers' },
              { value: 'first', label: 'First number' },
              { value: 'second', label: 'Second number' }
            ]
          }
        ]
      
      default:
        return []
    }
  }

  const validationErrors = useMemo(() => {
    const errors = {}
    const inputs = getCurrentInputs()
    
    inputs.forEach(input => {
      const value = parseFloat(formData[input.name]) || 0
      
      if (input.required && !formData[input.name] && formData[input.name] !== 0) {
        errors[input.name] = `${input.label} is required`
      }
      
      if (input.min !== undefined && value < input.min) {
        errors[input.name] = `Minimum ${input.label} is ${input.min}`
      }
      
      if (input.max !== undefined && value > input.max) {
        errors[input.name] = `Maximum ${input.label} is ${input.max}`
      }
      
      // Special validation for division by zero
      if (calculationType === 'whatPercentage' && input.name === 'whatPercentage_number2' && value === 0) {
        errors[input.name] = 'Cannot divide by zero'
      }
      
      if (calculationType === 'percentageOfWhat' && input.name === 'percentageOfWhat_percentage' && value === 0) {
        errors[input.name] = 'Percentage cannot be zero'
      }
    })
    
    return errors
  }, [formData, calculationType])

  useEffect(() => {
    setErrors(validationErrors)
  }, [validationErrors])

  const results = useMemo(() => {
    if (Object.keys(validationErrors).length > 0) {
      return null
    }

    try {
      switch(calculationType) {
        case 'percentageOfNumber': {
          const percentage = parseFloat(formData.percentageOfNumber_percentage) / 100
          const number = parseFloat(formData.percentageOfNumber_number)
          const result = number * percentage
          
          return {
            type: 'percentageOfNumber',
            percentage: formData.percentageOfNumber_percentage,
            number,
            result,
            calculation: `${formData.percentageOfNumber_percentage}% of ${number.toLocaleString()} = ${result.toLocaleString()}`,
            breakdown: [
              { label: 'Percentage', value: `${formData.percentageOfNumber_percentage}%` },
              { label: 'Original Number', value: number.toLocaleString() },
              { label: 'Result', value: result.toLocaleString() }
            ]
          }
        }
        
        case 'whatPercentage': {
          const num1 = parseFloat(formData.whatPercentage_number1)
          const num2 = parseFloat(formData.whatPercentage_number2)
          const percentage = (num1 / num2) * 100
          
          return {
            type: 'whatPercentage',
            number1: num1,
            number2: num2,
            percentage,
            calculation: `${num1.toLocaleString()} is ${percentage.toFixed(2)}% of ${num2.toLocaleString()}`,
            breakdown: [
              { label: 'First Number', value: num1.toLocaleString() },
              { label: 'Second Number', value: num2.toLocaleString() },
              { label: 'Percentage', value: `${percentage.toFixed(2)}%` }
            ]
          }
        }
        
        case 'percentageOfWhat': {
          const number = parseFloat(formData.percentageOfWhat_number)
          const percentage = parseFloat(formData.percentageOfWhat_percentage) / 100
          const whole = number / percentage
          
          return {
            type: 'percentageOfWhat',
            number,
            percentage: formData.percentageOfWhat_percentage,
            whole,
            calculation: `${number.toLocaleString()} is ${formData.percentageOfWhat_percentage}% of ${whole.toLocaleString()}`,
            breakdown: [
              { label: 'Number', value: number.toLocaleString() },
              { label: 'Percentage', value: `${formData.percentageOfWhat_percentage}%` },
              { label: 'Whole Amount', value: whole.toLocaleString() }
            ]
          }
        }
        
        case 'percentageChange': {
          const original = parseFloat(formData.percentageChange_original)
          const newValue = parseFloat(formData.percentageChange_new)
          const change = newValue - original
          const percentageChange = (change / Math.abs(original)) * 100
          const isIncrease = change >= 0
          
          return {
            type: 'percentageChange',
            original,
            newValue,
            change,
            percentageChange,
            isIncrease,
            calculation: `${isIncrease ? 'Increase' : 'Decrease'} from ${original.toLocaleString()} to ${newValue.toLocaleString()} is ${Math.abs(percentageChange).toFixed(2)}%`,
            breakdown: [
              { label: 'Original Value', value: original.toLocaleString() },
              { label: 'New Value', value: newValue.toLocaleString() },
              { label: 'Absolute Change', value: change.toLocaleString() },
              { label: 'Percentage Change', value: `${percentageChange.toFixed(2)}%` }
            ]
          }
        }
        
        case 'findChange': {
          const original = parseFloat(formData.findChange_original)
          const percentage = parseFloat(formData.findChange_percentage) / 100
          const direction = formData.findChange_direction
          const change = direction === 'increase' ? original * percentage : -original * Math.abs(percentage)
          const newValue = original + change
          
          return {
            type: 'findChange',
            original,
            percentage: formData.findChange_percentage,
            direction,
            change,
            newValue,
            calculation: `${direction === 'increase' ? 'Increase' : 'Decrease'} ${original.toLocaleString()} by ${formData.findChange_percentage}% = ${newValue.toLocaleString()}`,
            breakdown: [
              { label: 'Original Value', value: original.toLocaleString() },
              { label: 'Percentage Change', value: `${formData.findChange_percentage}% ${direction}` },
              { label: 'Amount of Change', value: change.toLocaleString() },
              { label: 'New Value', value: newValue.toLocaleString() }
            ]
          }
        }
        
        case 'percentageDiff': {
          const num1 = parseFloat(formData.percentageDiff_number1)
          const num2 = parseFloat(formData.percentageDiff_number2)
          const reference = formData.percentageDiff_reference
          
          let referenceValue, percentageDiff
          if (reference === 'average') {
            referenceValue = (num1 + num2) / 2
            percentageDiff = ((num2 - num1) / referenceValue) * 100
          } else if (reference === 'first') {
            referenceValue = num1
            percentageDiff = ((num2 - num1) / num1) * 100
          } else {
            referenceValue = num2
            percentageDiff = ((num1 - num2) / num2) * 100
          }
          
          return {
            type: 'percentageDiff',
            number1: num1,
            number2: num2,
            reference,
            referenceValue,
            percentageDiff,
            calculation: `Percentage difference between ${num1.toLocaleString()} and ${num2.toLocaleString()} is ${Math.abs(percentageDiff).toFixed(2)}%`,
            breakdown: [
              { label: 'First Number', value: num1.toLocaleString() },
              { label: 'Second Number', value: num2.toLocaleString() },
              { label: 'Reference Value', value: referenceValue.toLocaleString() },
              { label: 'Percentage Difference', value: `${percentageDiff.toFixed(2)}%` }
            ]
          }
        }
        
        default:
          return null
      }
    } catch (error) {
      console.error('Calculation error:', error)
      return null
    }
  }, [formData, calculationType, validationErrors])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeChange = (type) => {
    setCalculationType(type)
  }

  const resetForm = () => {
    setFormData({
      percentageOfNumber_percentage: '10',
      percentageOfNumber_number: '100',
      whatPercentage_number1: '15',
      whatPercentage_number2: '75',
      percentageOfWhat_number: '20',
      percentageOfWhat_percentage: '25',
      percentageChange_original: '100',
      percentageChange_new: '120',
      findChange_original: '50',
      findChange_percentage: '20',
      findChange_direction: 'increase',
      percentageDiff_number1: '80',
      percentageDiff_number2: '100',
      percentageDiff_reference: 'average'
    })
    setErrors({})
  }

  const chartConfig = (results) => {
    if (!results) return null
    
    switch(results.type) {
      case 'percentageOfNumber':
        return {
          pie: {
            data: {
              labels: [`${results.percentage}% of Number`, 'Remaining'],
              datasets: [{
                data: [results.result, results.number - results.result],
                backgroundColor: ['rgb(59, 130, 246)', 'rgb(229, 231, 235)']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || ''
                      const value = context.raw || 0
                      return `${label}: ${value.toLocaleString()}`
                    }
                  }
                }
              }
            }
          }
        }
      
      case 'percentageChange':
        return {
          bar: {
            data: {
              labels: ['Original', 'New'],
              datasets: [{
                label: 'Values',
                data: [results.original, results.newValue],
                backgroundColor: [
                  'rgb(59, 130, 246)',
                  results.isIncrease ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                ]
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.label}: ${context.raw.toLocaleString()}`
                    }
                  }
                }
              }
            }
          }
        }
      
      default:
        return null
    }
  }

  const tableConfig = (results) => ({
    data: results?.breakdown || [],
    columns: [
      { key: 'label', header: 'Metric' },
      { key: 'value', header: 'Value' }
    ],
    pagination: false
  })

  const getResultDisplay = (results) => {
    if (!results) return null
    
    return (
      <div className="card bg-gradient-to-br from-primary/5 to-transparent">
        <div className="text-center mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Calculation Result</h3>
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {results.type === 'percentageOfNumber' && `${results.result.toLocaleString()}`}
            {results.type === 'whatPercentage' && `${results.percentage.toFixed(2)}%`}
            {results.type === 'percentageOfWhat' && `${results.whole.toLocaleString()}`}
            {results.type === 'percentageChange' && `${results.percentageChange.toFixed(2)}%`}
            {results.type === 'findChange' && `${results.newValue.toLocaleString()}`}
            {results.type === 'percentageDiff' && `${Math.abs(results.percentageDiff).toFixed(2)}%`}
          </div>
          <p className="text-sm md:text-base text-text/60 mt-2">
            {results.calculation}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-text text-center md:text-left">
          Percentage Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base text-center md:text-left">
          Calculate percentages for various scenarios including increases, decreases, and comparisons.
        </p>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Left Column - Calculator Type & Inputs */}
        <div className="w-full lg:w-1/2">
          <div className="card space-y-4 md:space-y-6 mx-2 md:mx-0">
            {/* Calculator Type Selection - Mobile Responsive */}
            <div>
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                Calculation Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {calculationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type.id)}
                    className={`p-3 md:p-4 rounded-lg text-left transition-colors ${
                      calculationType === type.id
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-border hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-medium text-sm md:text-base">{type.label}</div>
                    <div className="text-xs md:text-sm opacity-80 mt-1">
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Section */}
            <div>
              <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">
                Input Values
              </h3>
              <div className="space-y-4">
                {getCurrentInputs().map((input) => (
                  <InputGroup
                    key={input.name}
                    label={input.label}
                    name={input.name}
                    type={input.type}
                    value={formData[input.name]}
                    onChange={handleInputChange}
                    error={errors[input.name]}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    options={input.options}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons - Stack on mobile, side-by-side on larger */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6 border-t border-border">
              <button
                onClick={resetForm}
                className="px-4 py-3 md:py-2 border border-border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base flex-1"
              >
                Reset All
              </button>
              <button
                className="px-4 py-3 md:py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors text-base font-medium flex-1"
              >
                Calculate Percentage
              </button>
            </div>
          </div>

          {/* Help Section - Collapsible on mobile */}
          <div className="card mt-4 md:mt-6 mx-2 md:mx-0">
            <details className="group">
              <summary className="font-semibold text-base md:text-lg cursor-pointer md:cursor-auto md:list-none flex justify-between items-center">
                <span>How to Use</span>
                <span className="md:hidden transform group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-3 md:mt-4 space-y-3 text-sm md:text-base text-text/70">
                <p><strong>What is X% of Y?</strong> - Calculate a percentage of a given number.</p>
                <p><strong>X is what % of Y?</strong> - Find what percentage one number is of another.</p>
                <p><strong>X is Y% of what?</strong> - Find the whole when you know a part and its percentage.</p>
                <p><strong>Percentage increase/decrease</strong> - Calculate the percentage change between two values.</p>
                <p><strong>Find percentage change</strong> - Apply a percentage increase or decrease to a number.</p>
                <p><strong>Percentage difference</strong> - Compare two numbers and express the difference as a percentage.</p>
              </div>
            </details>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
          <div className="space-y-4 md:space-y-6">
            {results && (
              <>
                {/* Main Result Display */}
                {getResultDisplay(results)}

                {/* Charts - Show only when relevant */}
                {chartConfig(results) && (
                  <div className="mx-2 md:mx-0">
                    <ResultDisplay
                      results={results}
                      chartConfig={chartConfig(results)}
                      tableConfig={tableConfig(results)}
                    />
                  </div>
                )}

                {/* Detailed Breakdown - Always show */}
                <div className="card mx-2 md:mx-0">
                  <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">
                    Detailed Breakdown
                  </h3>
                  <div className="overflow-x-auto">
                    <DataTable
                      data={results.breakdown}
                      columns={[
                        { key: 'label', header: 'Metric' },
                        { key: 'value', header: 'Value' }
                      ]}
                      pagination={false}
                    />
                  </div>
                </div>

                {/* Quick Examples Section */}
                <div className="card bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 mx-2 md:mx-0">
                  <h3 className="font-semibold text-base md:text-lg mb-3">
                    Common Percentage Examples
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm text-text/60">10% of 100</div>
                      <div className="font-medium">= 10</div>
                    </div>
                    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm text-text/60">50 is what % of 200</div>
                      <div className="font-medium">= 25%</div>
                    </div>
                    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm text-text/60">75 to 100 increase</div>
                      <div className="font-medium">= 33.33%</div>
                    </div>
                    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm text-text/60">Difference: 80 & 100</div>
                      <div className="font-medium">= 22.22%</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Placeholder when no results */}
            {!results && (
              <div className="card mx-2 md:mx-0">
                <div className="text-center py-8 md:py-12">
                  <div className="text-5xl md:text-6xl mb-4">%</div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    Enter Values to Calculate
                  </h3>
                  <p className="text-text/60">
                    Select a calculation type and enter values to see results
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="card mt-6 md:mt-8 mx-2 md:mx-0">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Percentage Formulas</h2>
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-base">Percentage of a Number</h4>
            <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono">
              (Percentage ÷ 100) × Number
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-base">Percentage Change</h4>
            <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono">
              ((New - Original) ÷ Original) × 100
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-base">Percentage Difference</h4>
            <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono">
              |A - B| ÷ ((A + B) ÷ 2) × 100
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}