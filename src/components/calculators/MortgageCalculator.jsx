import { useState, useMemo, useEffect } from 'react'
import InputGroup from '../ui/InputGroup'
import ResultDisplay from '../charts/ResultDisplay'
import DataTable from '../tables/DataTable'
import { calculateAmortizationSchedule } from '../../utils/financeCalculations'

export default function MortgageCalculator() {
  const [formData, setFormData] = useState({
    loanAmount: '300000',
    interestRate: '3.5',
    loanTerm: '30',
    homePrice: '375000',
    downPaymentType: 'percentage',
    downPaymentValue: '20',
    propertyTaxYearly: '3750',
    homeInsuranceYearly: '1200',
    pmiRate: '0.5',
    hoaFeesMonthly: '0',
    startDate: new Date().toISOString().split('T')[0],
    extraPayment: '0',
    extraPaymentStart: '1',
    paymentSchedule: 'monthly'
  })
  const [errors, setErrors] = useState({})

  const allInputs = [
    {
      name: 'homePrice',
      label: 'Home Price ($)',
      type: 'currency',
      default: 375000,
      required: true,
      min: 10000,
      max: 10000000,
      step: 1000,
      validate: (value) => {
        if (value <= 0) return 'Must be greater than 0'
        if (value < 10000) return 'Minimum home price is $10,000'
        if (value > 10000000) return 'Maximum home price is $10,000,000'
        return null
      }
    },
    {
      name: 'downPaymentType',
      label: 'Down Payment Type',
      type: 'select',
      default: 'percentage',
      required: true,
      options: [
        { value: 'percentage', label: 'Percentage (%)' },
        { value: 'amount', label: 'Amount ($)' }
      ]
    },
    {
      name: 'downPaymentValue',
      label: 'Down Payment',
      type: 'number',
      default: 20,
      required: true,
      min: 0,
      max: 100,
      step: 0.1
    },
    {
      name: 'loanTerm',
      label: 'Loan Term (years)',
      type: 'select',
      default: 30,
      required: true,
      options: [
        { value: 10, label: '10 years' },
        { value: 15, label: '15 years' },
        { value: 20, label: '20 years' },
        { value: 25, label: '25 years' },
        { value: 30, label: '30 years' },
        { value: 40, label: '40 years' }
      ]
    },
    {
      name: 'interestRate',
      label: 'Interest Rate (%)',
      type: 'percentage',
      default: 3.5,
      required: true,
      min: 0.1,
      max: 30,
      step: 0.125
    },
    {
      name: 'propertyTaxYearly',
      label: 'Property Tax (yearly)',
      type: 'currency',
      default: 3750,
      required: true,
      min: 0,
      max: 100000,
      step: 100
    },
    {
      name: 'homeInsuranceYearly',
      label: 'Home Insurance (yearly)',
      type: 'currency',
      default: 1200,
      required: true,
      min: 0,
      max: 50000,
      step: 100
    },
    {
      name: 'pmiRate',
      label: 'PMI Rate (%)',
      type: 'percentage',
      default: 0.5,
      required: true,
      min: 0,
      max: 5,
      step: 0.1,
      info: 'Private Mortgage Insurance required if down payment < 20%'
    },
    {
      name: 'hoaFeesMonthly',
      label: 'HOA Fees (monthly)',
      type: 'currency',
      default: 0,
      required: true,
      min: 0,
      max: 10000,
      step: 10
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      default: new Date().toISOString().split('T')[0],
      required: true
    },
    {
      name: 'extraPayment',
      label: 'Extra Monthly Payment ($)',
      type: 'currency',
      default: 0,
      required: true,
      min: 0,
      max: 10000,
      step: 100
    },
    {
      name: 'extraPaymentStart',
      label: 'Start Extra Payment After Month',
      type: 'number',
      default: 1,
      required: true,
      min: 1,
      max: 360,
      step: 1
    },
    {
      name: 'paymentSchedule',
      label: 'Payment Schedule',
      type: 'select',
      default: 'monthly',
      required: true,
      options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'acceleratedBiweekly', label: 'Accelerated Bi-weekly' }
      ]
    }
  ]

  // Validate inputs
  const validationErrors = useMemo(() => {
    const errors = {}
    allInputs.forEach(input => {
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
      
      if (input.validate) {
        const error = input.validate(value)
        if (error) errors[input.name] = error
      }
    })
    return errors
  }, [formData])

  // Update errors state
  useEffect(() => {
    setErrors(validationErrors)
  }, [validationErrors])

  // Calculate results
  const results = useMemo(() => {
    if (Object.keys(validationErrors).length > 0) {
      return null
    }

    try {
      const homePrice = parseFloat(formData.homePrice)
      const downPaymentType = formData.downPaymentType
      const downPaymentValue = parseFloat(formData.downPaymentValue)
      const interestRate = parseFloat(formData.interestRate) / 100
      const termYears = parseInt(formData.loanTerm)
      const propertyTaxYearly = parseFloat(formData.propertyTaxYearly)
      const homeInsuranceYearly = parseFloat(formData.homeInsuranceYearly)
      const pmiRate = parseFloat(formData.pmiRate) / 100
      const hoaFeesMonthly = parseFloat(formData.hoaFeesMonthly)
      const extraPayment = parseFloat(formData.extraPayment)
      const extraPaymentStart = parseInt(formData.extraPaymentStart)
      const paymentSchedule = formData.paymentSchedule
      const startDate = new Date(formData.startDate)

      // Calculate down payment and loan amount
      let downPayment, loanAmount
      if (downPaymentType === 'percentage') {
        downPayment = homePrice * (downPaymentValue / 100)
      } else {
        downPayment = downPaymentValue
      }
      loanAmount = homePrice - downPayment

      // Calculate payments per year based on schedule
      let paymentsPerYear
      switch (paymentSchedule) {
        case 'monthly':
          paymentsPerYear = 12
          break
        case 'biweekly':
          paymentsPerYear = 26
          break
        case 'acceleratedBiweekly':
          paymentsPerYear = 26
          break
        default:
          paymentsPerYear = 12
      }

      // Calculate mortgage payment
      const periodicRate = interestRate / paymentsPerYear
      const totalPayments = termYears * paymentsPerYear
      
      let periodicPayment
      if (periodicRate === 0) {
        periodicPayment = loanAmount / totalPayments
      } else {
        periodicPayment = loanAmount * 
          (periodicRate * Math.pow(1 + periodicRate, totalPayments)) / 
          (Math.pow(1 + periodicRate, totalPayments) - 1)
      }

      // Adjust for accelerated biweekly (half monthly payment every 2 weeks)
      if (paymentSchedule === 'acceleratedBiweekly') {
        periodicPayment = (loanAmount * (interestRate / 12) * Math.pow(1 + interestRate / 12, termYears * 12)) / 
                         (Math.pow(1 + interestRate / 12, termYears * 12) - 1) / 2
      }

      // Calculate PMI if down payment < 20%
      const pmiMonthly = (downPayment / homePrice < 0.2) ? (loanAmount * pmiRate / 12) : 0
      const monthsUntilPMIEnd = (downPayment / homePrice < 0.2) ? 
        Math.ceil((0.2 * homePrice - downPayment) / (periodicPayment * (1 - (interestRate / paymentsPerYear)))) : 0

      // Calculate additional monthly costs
      const propertyTaxMonthly = propertyTaxYearly / 12
      const homeInsuranceMonthly = homeInsuranceYearly / 12
      
      // Total monthly payment
      const totalMonthlyPayment = periodicPayment + pmiMonthly + propertyTaxMonthly + 
                                 homeInsuranceMonthly + hoaFeesMonthly

      // Generate amortization schedule with extra payments
      const schedule = []
      let balance = loanAmount
      let totalInterestPaid = 0
      let totalPrincipalPaid = 0
      let month = 1
      let paymentDate = new Date(startDate)
      
      while (balance > 0.01 && month <= termYears * 12) {
        const interest = balance * (interestRate / 12)
        let principal = periodicPayment - interest
        
        // Apply extra payment if applicable
        if (extraPayment > 0 && month >= extraPaymentStart) {
          principal += extraPayment
        }
        
        // Adjust for final payment
        if (principal > balance) {
          principal = balance
        }
        
        balance -= principal
        totalInterestPaid += interest
        totalPrincipalPaid += principal
        
        // Increment payment date
        paymentDate.setMonth(paymentDate.getMonth() + 1)
        
        schedule.push({
          month,
          date: paymentDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          payment: periodicPayment + (month >= extraPaymentStart ? extraPayment : 0),
          principal,
          interest,
          balance: Math.max(balance, 0),
          pmi: month <= monthsUntilPMIEnd ? pmiMonthly : 0,
          tax: propertyTaxMonthly,
          insurance: homeInsuranceMonthly,
          hoa: hoaFeesMonthly,
          totalPayment: periodicPayment + 
                       (month >= extraPaymentStart ? extraPayment : 0) + 
                       pmiMonthly + 
                       propertyTaxMonthly + 
                       homeInsuranceMonthly + 
                       hoaFeesMonthly
        })
        
        month++
      }

      // Calculate totals
      const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0)
      const totalPMI = schedule.reduce((sum, row) => sum + row.pmi, 0)
      const totalTax = schedule.reduce((sum, row) => sum + row.tax, 0)
      const totalInsurance = schedule.reduce((sum, row) => sum + row.insurance, 0)
      const totalHOA = schedule.reduce((sum, row) => sum + row.hoa, 0)
      const totalCost = homePrice + totalInterestPaid + totalPMI + totalTax + totalInsurance + totalHOA

      // Calculate payoff date
      const payoffDate = new Date(startDate)
      payoffDate.setMonth(payoffDate.getMonth() + schedule.length)

      // Interest savings from extra payments
      const scheduleWithoutExtra = calculateAmortizationSchedule(loanAmount, interestRate, termYears)
      const interestWithoutExtra = scheduleWithoutExtra.reduce((sum, row) => sum + row.interest, 0)
      const interestSavings = interestWithoutExtra - totalInterestPaid
      const timeSavingsMonths = (termYears * 12) - schedule.length

      return {
        loanAmount,
        downPayment,
        homePrice,
        interestRate,
        termYears,
        periodicPayment,
        totalMonthlyPayment,
        totalPayment,
        totalInterestPaid,
        totalPMI,
        totalTax,
        totalInsurance,
        totalHOA,
        totalCost,
        pmiMonthly,
        monthsUntilPMIEnd,
        propertyTaxMonthly,
        homeInsuranceMonthly,
        hoaFeesMonthly,
        extraPayment,
        extraPaymentStart,
        paymentSchedule,
        schedule,
        payoffDate: payoffDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        startDate: startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        interestSavings,
        timeSavingsMonths,
        summary: {
          downPaymentPercent: (downPayment / homePrice * 100).toFixed(1),
          loanToValue: (loanAmount / homePrice * 100).toFixed(1)
        }
      }
    } catch (error) {
      console.error('Calculation error:', error)
      return null
    }
  }, [formData, validationErrors])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      loanAmount: '300000',
      interestRate: '3.5',
      loanTerm: '30',
      homePrice: '375000',
      downPaymentType: 'percentage',
      downPaymentValue: '20',
      propertyTaxYearly: '3750',
      homeInsuranceYearly: '1200',
      pmiRate: '0.5',
      hoaFeesMonthly: '0',
      startDate: new Date().toISOString().split('T')[0],
      extraPayment: '0',
      extraPaymentStart: '1',
      paymentSchedule: 'monthly'
    })
    setErrors({})
  }

  const chartConfig = (results) => ({
    bar: {
      data: {
        labels: ['Principal', 'Interest', 'PMI', 'Tax', 'Insurance', 'HOA'],
        datasets: [{
          label: 'Total Cost Breakdown',
          data: [
            results.homePrice,
            results.totalInterestPaid,
            results.totalPMI,
            results.totalTax,
            results.totalInsurance,
            results.totalHOA
          ],
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(34, 197, 94)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || ''
                const value = context.raw || 0
                return `${label}: $${value.toLocaleString()}`
              }
            }
          }
        }
      }
    },
    pie: {
      data: {
        labels: ['Home Price', 'Interest', 'PMI', 'Tax', 'Insurance', 'HOA'],
        datasets: [{
          data: [
            results.homePrice,
            results.totalInterestPaid,
            results.totalPMI,
            results.totalTax,
            results.totalInsurance,
            results.totalHOA
          ],
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(34, 197, 94)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || ''
                const value = context.raw || 0
                const total = results.totalCost
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: $${value.toLocaleString()} (${percentage}%)`
              }
            }
          }
        }
      }
    }
  })

  const tableConfig = (results) => ({
    data: results.schedule.slice(0, 12), // Show first year by default
    columns: [
      { key: 'month', header: 'Month' },
      { key: 'date', header: 'Payment Date' },
      { key: 'payment', header: 'Principal & Interest' },
      { key: 'principal', header: 'Principal' },
      { key: 'interest', header: 'Interest' },
      { key: 'pmi', header: 'PMI' },
      { key: 'tax', header: 'Tax' },
      { key: 'insurance', header: 'Insurance' },
      { key: 'totalPayment', header: 'Total Payment' },
      { key: 'balance', header: 'Remaining Balance' }
    ],
    pagination: true
  })

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Calculator header */}
      <div>
  <h1 className="text-2xl sm:text-3xl font-bold text-text">Mortgage Calculator</h1>
  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
    Calculate your monthly mortgage payments...
  </p>
</div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input section */}
        <div className="card space-y-6">
          <h2 className="text-xl font-semibold">Mortgage Details</h2>
          
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {allInputs.slice(0, 6).map((input) => (
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

          <h3 className="font-semibold pt-4 border-t border-border">Additional Costs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {allInputs.slice(6, 10).map((input) => (
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

          <h3 className="font-semibold pt-4 border-t border-border">Payment Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {allInputs.slice(10).map((input) => (
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

          <div className="flex justify-center gap-4 pt-6 border-t border-border">
            <button 
              onClick={resetForm}
              className="px-4 py-2 border border-border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Reset
            </button>
            <button 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Calculate Mortgage
            </button>
          </div>
        </div>

        {/* Results section */}
        <div className="space-y-6">
          {results && (
            <>
              {/* Main Results Card */}
              <div className="card bg-gradient-to-br from-primary/5 to-transparent">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">Monthly Payment</h2>
                  <p className="text-sm text-text/60">Total monthly housing cost</p>
                </div>
                
                <div className="text-center py-4">
  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
    ${results.totalMonthlyPayment.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}
  </div>
  <div className="text-xs sm:text-sm text-text/60">
    Starting {results.startDate}
  </div>
</div>

                {/* Payment Breakdown */}
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-text/70">Principal & Interest</span>
                    <span className="font-medium">${results.periodicPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {results.pmiMonthly > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-text/70">PMI (until month {results.monthsUntilPMIEnd})</span>
                      <span className="font-medium">${results.pmiMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-text/70">Property Tax</span>
                    <span className="font-medium">${results.propertyTaxMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-text/70">Home Insurance</span>
                    <span className="font-medium">${results.homeInsuranceMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {results.hoaFeesMonthly > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-text/70">HOA Fees</span>
                      <span className="font-medium">${results.hoaFeesMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Monthly Payment</span>
                      <span className="font-bold text-lg">${results.totalMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                <div className="card">
                  <div className="text-xs sm:text-sm text-text/60 mb-1">Total Loan Amount</div>
<div className="text-lg sm:text-xl font-bold">${results.loanAmount.toLocaleString()}</div>

                </div>
                <div className="card">
                  <div className="text-sm text-text/60 mb-1">Down Payment</div>
                  <div className="text-xl font-bold">${results.downPayment.toLocaleString()} ({results.summary.downPaymentPercent}%)</div>
                </div>
                <div className="card">
                  <div className="text-sm text-text/60 mb-1">Total Interest Paid</div>
                  <div className="text-xl font-bold text-error">${results.totalInterestPaid.toLocaleString()}</div>
                </div>
                <div className="card">
                  <div className="text-sm text-text/60 mb-1">Payoff Date</div>
                  <div className="text-xl font-bold">{results.payoffDate}</div>
                </div>
              </div>

              {/* Results Display */}
              <ResultDisplay 
                results={results} 
                chartConfig={chartConfig(results)}
      
              />
              {/* In your ResultDisplay component or where you render the table, wrap it in: */}
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="min-w-[800px] sm:min-w-0 px-4 sm:px-0">
    {/* Your table or DataTable component */}
    <ResultDisplay 
                results={results} 
         
                tableConfig={tableConfig(results)}
              />
  </div>
</div>

              {/* Extra Payment Savings */}
              {results.extraPayment > 0 && (
                <div className="card bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20">
                  <h3 className="font-semibold mb-3">Extra Payment Savings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="text-sm text-text/60">Interest Saved</div>
                      <div className="text-xl font-bold text-green-600">
                        ${results.interestSavings.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="text-sm text-text/60">Time Saved</div>
                      <div className="text-xl font-bold text-green-600">
                        {Math.floor(results.timeSavingsMonths / 12)} years, {results.timeSavingsMonths % 12} months
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detailed Information */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Mortgage Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div>
            <h3 className="font-semibold mb-2">Total Cost of Home</h3>
            {results && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Home Price</span>
                  <span className="font-medium">${results.homePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Interest</span>
                  <span className="font-medium text-error">${results.totalInterestPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>PMI</span>
                  <span className="font-medium">${results.totalPMI.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Tax</span>
                  <span className="font-medium">${results.totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Home Insurance</span>
                  <span className="font-medium">${results.totalInsurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold">Total Cost</span>
                  <span className="font-bold text-lg">${results.totalCost.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Loan Details</h3>
            {results && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Loan Amount</span>
                  <span className="font-medium">${results.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate</span>
                  <span className="font-medium">{(results.interestRate * 100).toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Term</span>
                  <span className="font-medium">{results.termYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment</span>
                  <span className="font-medium">${results.downPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan-to-Value Ratio</span>
                  <span className="font-medium">{results.summary.loanToValue}%</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Information</h3>
            {results && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Schedule</span>
                  <span className="font-medium capitalize">{results.paymentSchedule.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payments per Year</span>
                  <span className="font-medium">{results.paymentSchedule === 'monthly' ? 12 : 26}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Number of Payments</span>
                  <span className="font-medium">{results.schedule.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Start Date</span>
                  <span className="font-medium">{results.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payoff Date</span>
                  <span className="font-medium">{results.payoffDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}