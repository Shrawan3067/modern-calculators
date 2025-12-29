import { useState, useMemo, useEffect } from 'react'
import InputGroup from '../ui/InputGroup'
import ResultDisplay from '../charts/ResultDisplay'
import DataTable from '../tables/DataTable'

export default function InterestCalculator() {
  const [calculationType, setCalculationType] = useState('simpleInterest')
  const [formData, setFormData] = useState({
    // Common fields
    principal: '1000',
    interestRate: '5',
    timePeriod: '1',
    timeUnit: 'years',
    
    // Compound interest specific
    compoundFrequency: 'annually',
    regularDeposit: '0',
    depositFrequency: 'monthly',
    
    // Credit card interest
    creditCardBalance: '5000',
    apr: '18.99',
    minimumPaymentPercent: '3',
    minimumPaymentAmount: '25',
    monthlyPayment: '200',
    
    // Comparison
    comparePrincipal: '1000',
    compareRate1: '5',
    compareRate2: '7',
    compareTime: '10',
    
    // Advanced
    inflationRate: '2.5',
    taxRate: '25'
  })
  const [errors, setErrors] = useState({})

  const calculationTypes = [
    { 
      id: 'simpleInterest', 
      label: 'Simple Interest',
      description: 'Interest calculated only on principal'
    },
    { 
      id: 'compoundInterest', 
      label: 'Compound Interest',
      description: 'Interest calculated on principal + accumulated interest'
    },
    { 
      id: 'creditCardInterest', 
      label: 'Credit Card Interest',
      description: 'Calculate credit card payoff and interest'
    },
    { 
      id: 'interestComparison', 
      label: 'Interest Comparison',
      description: 'Compare different interest rates'
    },
    { 
      id: 'effectiveRate', 
      label: 'Effective Annual Rate',
      description: 'Calculate EAR from nominal rate'
    },
    { 
      id: 'loanInterest', 
      label: 'Loan Interest',
      description: 'Calculate total interest on a loan'
    }
  ]

  const getCurrentInputs = () => {
    const commonInputs = [
      {
        name: 'principal',
        label: 'Principal Amount ($)',
        type: 'currency',
        default: 1000,
        required: true,
        min: 1,
        max: 10000000,
        step: 100
      },
      {
        name: 'interestRate',
        label: 'Annual Interest Rate (%)',
        type: 'percentage',
        default: 5,
        required: true,
        min: 0.01,
        max: 100,
        step: 0.1
      },
      {
        name: 'timePeriod',
        label: 'Time Period',
        type: 'number',
        default: 1,
        required: true,
        min: 0.08, // 1 month
        max: 100,
        step: 0.5
      },
      {
        name: 'timeUnit',
        label: 'Time Unit',
        type: 'select',
        default: 'years',
        required: true,
        options: [
          { value: 'days', label: 'Days' },
          { value: 'months', label: 'Months' },
          { value: 'years', label: 'Years' }
        ]
      }
    ]

    switch(calculationType) {
      case 'simpleInterest':
        return commonInputs
        
      case 'compoundInterest':
        return [
          ...commonInputs,
          {
            name: 'compoundFrequency',
            label: 'Compounding Frequency',
            type: 'select',
            default: 'annually',
            required: true,
            options: [
              { value: 'daily', label: 'Daily' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'semi-annually', label: 'Semi-Annually' },
              { value: 'annually', label: 'Annually' }
            ]
          },
          {
            name: 'regularDeposit',
            label: 'Regular Deposit ($)',
            type: 'currency',
            default: 0,
            required: true,
            min: 0,
            max: 100000,
            step: 10
          },
          {
            name: 'depositFrequency',
            label: 'Deposit Frequency',
            type: 'select',
            default: 'monthly',
            required: true,
            options: [
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'annually', label: 'Annually' }
            ]
          }
        ]
        
      case 'creditCardInterest':
        return [
          {
            name: 'creditCardBalance',
            label: 'Credit Card Balance ($)',
            type: 'currency',
            default: 5000,
            required: true,
            min: 100,
            max: 100000,
            step: 100
          },
          {
            name: 'apr',
            label: 'Annual Percentage Rate (APR)',
            type: 'percentage',
            default: 18.99,
            required: true,
            min: 0.01,
            max: 50,
            step: 0.1
          },
          {
            name: 'monthlyPayment',
            label: 'Monthly Payment ($)',
            type: 'currency',
            default: 200,
            required: true,
            min: 10,
            max: 10000,
            step: 10
          },
          {
            name: 'minimumPaymentPercent',
            label: 'Minimum Payment (%)',
            type: 'percentage',
            default: 3,
            required: true,
            min: 1,
            max: 100,
            step: 0.5
          },
          {
            name: 'minimumPaymentAmount',
            label: 'Minimum Payment ($)',
            type: 'currency',
            default: 25,
            required: true,
            min: 10,
            max: 1000,
            step: 5
          }
        ]
        
      case 'interestComparison':
        return [
          {
            name: 'comparePrincipal',
            label: 'Principal Amount ($)',
            type: 'currency',
            default: 1000,
            required: true,
            min: 1,
            max: 1000000,
            step: 100
          },
          {
            name: 'compareRate1',
            label: 'First Interest Rate (%)',
            type: 'percentage',
            default: 5,
            required: true,
            min: 0.01,
            max: 100,
            step: 0.1
          },
          {
            name: 'compareRate2',
            label: 'Second Interest Rate (%)',
            type: 'percentage',
            default: 7,
            required: true,
            min: 0.01,
            max: 100,
            step: 0.1
          },
          {
            name: 'compareTime',
            label: 'Time (Years)',
            type: 'number',
            default: 10,
            required: true,
            min: 1,
            max: 100,
            step: 1
          }
        ]
        
      case 'effectiveRate':
        return [
          {
            name: 'interestRate',
            label: 'Nominal Annual Rate (%)',
            type: 'percentage',
            default: 5,
            required: true,
            min: 0.01,
            max: 100,
            step: 0.1
          },
          {
            name: 'compoundFrequency',
            label: 'Compounding Frequency',
            type: 'select',
            default: 'monthly',
            required: true,
            options: [
              { value: 'daily', label: 'Daily (365 times/year)' },
              { value: 'monthly', label: 'Monthly (12 times/year)' },
              { value: 'quarterly', label: 'Quarterly (4 times/year)' },
              { value: 'semi-annually', label: 'Semi-Annually (2 times/year)' },
              { value: 'annually', label: 'Annually (1 time/year)' }
            ]
          }
        ]
        
      case 'loanInterest':
        return [
          {
            name: 'principal',
            label: 'Loan Amount ($)',
            type: 'currency',
            default: 10000,
            required: true,
            min: 100,
            max: 1000000,
            step: 100
          },
          {
            name: 'interestRate',
            label: 'Annual Interest Rate (%)',
            type: 'percentage',
            default: 5,
            required: true,
            min: 0.01,
            max: 30,
            step: 0.125
          },
          {
            name: 'timePeriod',
            label: 'Loan Term (Years)',
            type: 'number',
            default: 5,
            required: true,
            min: 1,
            max: 30,
            step: 1
          },
          {
            name: 'inflationRate',
            label: 'Inflation Rate (%)',
            type: 'percentage',
            default: 2.5,
            required: true,
            min: 0,
            max: 20,
            step: 0.1
          },
          {
            name: 'taxRate',
            label: 'Tax Rate on Interest (%)',
            type: 'percentage',
            default: 25,
            required: true,
            min: 0,
            max: 50,
            step: 1
          }
        ]
        
      default:
        return commonInputs
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
    })
    
    return errors
  }, [formData, calculationType])

  useEffect(() => {
    setErrors(validationErrors)
  }, [validationErrors])

  const calculateTimeInYears = (timePeriod, timeUnit) => {
    const period = parseFloat(timePeriod)
    switch(timeUnit) {
      case 'days': return period / 365
      case 'months': return period / 12
      default: return period
    }
  }

  const getCompoundFrequencyValue = (frequency) => {
    switch(frequency) {
      case 'daily': return 365
      case 'monthly': return 12
      case 'quarterly': return 4
      case 'semi-annually': return 2
      case 'annually': return 1
      default: return 1
    }
  }

  const results = useMemo(() => {
    if (Object.keys(validationErrors).length > 0) {
      return null
    }

    try {
      switch(calculationType) {
        case 'simpleInterest': {
          const principal = parseFloat(formData.principal)
          const rate = parseFloat(formData.interestRate) / 100
          const timeYears = calculateTimeInYears(formData.timePeriod, formData.timeUnit)
          
          const simpleInterest = principal * rate * timeYears
          const totalAmount = principal + simpleInterest
          
          const breakdown = []
          for (let year = 1; year <= Math.ceil(timeYears); year++) {
            const yearInterest = principal * rate * Math.min(1, timeYears - (year - 1))
            breakdown.push({
              year,
              principal: year === 1 ? principal : 0,
              interest: yearInterest,
              total: principal + (principal * rate * Math.min(year, timeYears))
            })
          }

          return {
            type: 'simpleInterest',
            principal,
            rate: rate * 100,
            timeYears,
            simpleInterest,
            totalAmount,
            breakdown,
            calculation: `Simple Interest = $${principal} × ${(rate * 100).toFixed(2)}% × ${timeYears.toFixed(2)} years = $${simpleInterest.toFixed(2)}`,
            summary: [
              { label: 'Principal', value: `$${principal.toLocaleString()}` },
              { label: 'Annual Rate', value: `${(rate * 100).toFixed(2)}%` },
              { label: 'Time Period', value: `${timeYears.toFixed(2)} years` },
              { label: 'Simple Interest', value: `$${simpleInterest.toLocaleString()}` },
              { label: 'Total Amount', value: `$${totalAmount.toLocaleString()}` }
            ]
          }
        }
        
        case 'compoundInterest': {
          const principal = parseFloat(formData.principal)
          const rate = parseFloat(formData.interestRate) / 100
          const timeYears = calculateTimeInYears(formData.timePeriod, formData.timeUnit)
          const n = getCompoundFrequencyValue(formData.compoundFrequency)
          const deposit = parseFloat(formData.regularDeposit)
          const depositFreq = formData.depositFrequency
          
          // Calculate compound interest
          const compoundAmount = principal * Math.pow(1 + rate/n, n * timeYears)
          const compoundInterest = compoundAmount - principal
          
          // Calculate with regular deposits
          let totalWithDeposits = principal
          let totalDeposits = 0
          const breakdown = []
          
          const depositsPerYear = depositFreq === 'monthly' ? 12 : depositFreq === 'quarterly' ? 4 : 1
          const totalPeriods = timeYears * n
          
          for (let period = 1; period <= totalPeriods; period++) {
            const periodRate = rate / n
            totalWithDeposits = totalWithDeposits * (1 + periodRate)
            
            // Add deposit at appropriate frequency
            if (deposit > 0 && period % (n / depositsPerYear) === 0) {
              totalWithDeposits += deposit
              totalDeposits += deposit
            }
            
            if (period % n === 0) { // Yearly breakdown
              breakdown.push({
                year: period / n,
                principal: principal + totalDeposits,
                interest: totalWithDeposits - (principal + totalDeposits),
                total: totalWithDeposits
              })
            }
          }

          return {
            type: 'compoundInterest',
            principal,
            rate: rate * 100,
            timeYears,
            n,
            compoundAmount,
            compoundInterest,
            totalWithDeposits,
            totalDeposits,
            breakdown,
            calculation: `Compound Amount = $${principal} × (1 + ${(rate * 100).toFixed(2)}%/${n})^(${n} × ${timeYears.toFixed(2)}) = $${compoundAmount.toFixed(2)}`,
            summary: [
              { label: 'Principal', value: `$${principal.toLocaleString()}` },
              { label: 'Annual Rate', value: `${(rate * 100).toFixed(2)}%` },
              { label: 'Compounding', value: `${formData.compoundFrequency}` },
              { label: 'Time Period', value: `${timeYears.toFixed(2)} years` },
              { label: 'Compound Interest', value: `$${compoundInterest.toLocaleString()}` },
              { label: 'Final Amount', value: `$${compoundAmount.toLocaleString()}` },
              ...(deposit > 0 ? [
                { label: 'Total Deposits', value: `$${totalDeposits.toLocaleString()}` },
                { label: 'Total with Deposits', value: `$${totalWithDeposits.toLocaleString()}` }
              ] : [])
            ]
          }
        }
        
        case 'creditCardInterest': {
          const balance = parseFloat(formData.creditCardBalance)
          const apr = parseFloat(formData.apr) / 100
          const monthlyRate = apr / 12
          const monthlyPayment = parseFloat(formData.monthlyPayment)
          const minPaymentPercent = parseFloat(formData.minimumPaymentPercent) / 100
          const minPaymentAmount = parseFloat(formData.minimumPaymentAmount)
          
          // Calculate minimum payment
          const calculatedMinPayment = Math.max(minPaymentAmount, balance * minPaymentPercent)
          
          // Calculate payoff with fixed payment
          let monthsToPayoff = 0
          let remainingBalance = balance
          let totalInterest = 0
          const schedule = []
          
          while (remainingBalance > 0 && monthsToPayoff < 600) { // Cap at 50 years
            const interest = remainingBalance * monthlyRate
            const principalPayment = Math.min(remainingBalance, monthlyPayment - interest)
            
            remainingBalance = remainingBalance - principalPayment
            totalInterest += interest
            monthsToPayoff++
            
            schedule.push({
              month: monthsToPayoff,
              payment: monthlyPayment,
              interest,
              principal: principalPayment,
              balance: Math.max(remainingBalance, 0)
            })
            
            if (remainingBalance <= 0) break
          }
          
          // Calculate with minimum payment only
          let minMonths = 0
          let minRemaining = balance
          let minTotalInterest = 0
          
          while (minRemaining > 0 && minMonths < 600) {
            const minPayment = Math.max(minPaymentAmount, minRemaining * minPaymentPercent)
            const interest = minRemaining * monthlyRate
            const principalPayment = Math.min(minRemaining, minPayment - interest)
            
            minRemaining = minRemaining - principalPayment
            minTotalInterest += interest
            minMonths++
            
            if (minRemaining <= 0) break
          }

          return {
            type: 'creditCardInterest',
            balance,
            apr: apr * 100,
            monthlyPayment,
            monthsToPayoff,
            totalInterest,
            minMonths,
            minTotalInterest,
            schedule: schedule.slice(0, 12), // First year only
            calculation: `Credit Card Payoff: $${balance.toLocaleString()} at ${(apr * 100).toFixed(2)}% APR, paying $${monthlyPayment.toLocaleString()}/month`,
            summary: [
              { label: 'Starting Balance', value: `$${balance.toLocaleString()}` },
              { label: 'APR', value: `${(apr * 100).toFixed(2)}%` },
              { label: 'Monthly Payment', value: `$${monthlyPayment.toLocaleString()}` },
              { label: 'Months to Payoff', value: `${monthsToPayoff} months` },
              { label: 'Total Interest', value: `$${totalInterest.toLocaleString()}` },
              { label: 'Total Paid', value: `$${(balance + totalInterest).toLocaleString()}` },
              { label: 'With Minimum Payment', value: `${minMonths} months` },
              { label: 'Min Payment Interest', value: `$${minTotalInterest.toLocaleString()}` }
            ]
          }
        }
        
        case 'interestComparison': {
          const principal = parseFloat(formData.comparePrincipal)
          const rate1 = parseFloat(formData.compareRate1) / 100
          const rate2 = parseFloat(formData.compareRate2) / 100
          const timeYears = parseFloat(formData.compareTime)
          
          const amount1 = principal * Math.pow(1 + rate1, timeYears)
          const amount2 = principal * Math.pow(1 + rate2, timeYears)
          const interest1 = amount1 - principal
          const interest2 = amount2 - principal
          const difference = amount2 - amount1
          
          const breakdown = []
          for (let year = 1; year <= timeYears; year++) {
            breakdown.push({
              year,
              amount1: principal * Math.pow(1 + rate1, year),
              amount2: principal * Math.pow(1 + rate2, year),
              difference: principal * Math.pow(1 + rate2, year) - principal * Math.pow(1 + rate1, year)
            })
          }

          return {
            type: 'interestComparison',
            principal,
            rate1: rate1 * 100,
            rate2: rate2 * 100,
            timeYears,
            amount1,
            amount2,
            interest1,
            interest2,
            difference,
            breakdown,
            calculation: `Comparison: ${(rate1 * 100).toFixed(2)}% vs ${(rate2 * 100).toFixed(2)}% over ${timeYears} years`,
            summary: [
              { label: 'Principal', value: `$${principal.toLocaleString()}` },
              { label: `Rate 1 (${(rate1 * 100).toFixed(2)}%)`, value: `$${amount1.toLocaleString()}` },
              { label: `Rate 2 (${(rate2 * 100).toFixed(2)}%)`, value: `$${amount2.toLocaleString()}` },
              { label: 'Interest Difference', value: `$${difference.toLocaleString()}` },
              { label: 'Percentage Difference', value: `${((difference / amount1) * 100).toFixed(1)}%` }
            ]
          }
        }
        
        case 'effectiveRate': {
          const nominalRate = parseFloat(formData.interestRate) / 100
          const n = getCompoundFrequencyValue(formData.compoundFrequency)
          
          const effectiveRate = (Math.pow(1 + nominalRate/n, n) - 1) * 100
          const difference = effectiveRate - (nominalRate * 100)

          return {
            type: 'effectiveRate',
            nominalRate: nominalRate * 100,
            n,
            effectiveRate,
            difference,
            calculation: `EAR = (1 + ${(nominalRate * 100).toFixed(2)}%/${n})^${n} - 1 = ${effectiveRate.toFixed(2)}%`,
            summary: [
              { label: 'Nominal Annual Rate', value: `${(nominalRate * 100).toFixed(2)}%` },
              { label: 'Compounding Frequency', value: `${formData.compoundFrequency}` },
              { label: 'Effective Annual Rate (EAR)', value: `${effectiveRate.toFixed(2)}%` },
              { label: 'Difference', value: `${difference.toFixed(2)}%` }
            ]
          }
        }
        
        case 'loanInterest': {
          const principal = parseFloat(formData.principal)
          const rate = parseFloat(formData.interestRate) / 100
          const timeYears = parseFloat(formData.timePeriod)
          const inflationRate = parseFloat(formData.inflationRate) / 100
          const taxRate = parseFloat(formData.taxRate) / 100
          
          // Calculate loan payments
          const monthlyRate = rate / 12
          const totalMonths = timeYears * 12
          const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                               (Math.pow(1 + monthlyRate, totalMonths) - 1)
          
          const totalPayment = monthlyPayment * totalMonths
          const totalInterest = totalPayment - principal
          
          // Adjust for inflation
          const realRate = ((1 + rate) / (1 + inflationRate) - 1) * 100
          const inflationAdjustedInterest = totalInterest / Math.pow(1 + inflationRate, timeYears)
          
          // Adjust for taxes
          const afterTaxInterest = totalInterest * (1 - taxRate)

          return {
            type: 'loanInterest',
            principal,
            rate: rate * 100,
            timeYears,
            monthlyPayment,
            totalPayment,
            totalInterest,
            realRate,
            inflationAdjustedInterest,
            afterTaxInterest,
            calculation: `Loan: $${principal.toLocaleString()} at ${(rate * 100).toFixed(2)}% for ${timeYears} years`,
            summary: [
              { label: 'Loan Amount', value: `$${principal.toLocaleString()}` },
              { label: 'Interest Rate', value: `${(rate * 100).toFixed(2)}%` },
              { label: 'Loan Term', value: `${timeYears} years` },
              { label: 'Monthly Payment', value: `$${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
              { label: 'Total Interest', value: `$${totalInterest.toLocaleString()}` },
              { label: 'Real Interest Rate', value: `${realRate.toFixed(2)}%` },
              { label: 'After-tax Interest', value: `$${afterTaxInterest.toLocaleString()}` }
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
      principal: '1000',
      interestRate: '5',
      timePeriod: '1',
      timeUnit: 'years',
      compoundFrequency: 'annually',
      regularDeposit: '0',
      depositFrequency: 'monthly',
      creditCardBalance: '5000',
      apr: '18.99',
      minimumPaymentPercent: '3',
      minimumPaymentAmount: '25',
      monthlyPayment: '200',
      comparePrincipal: '1000',
      compareRate1: '5',
      compareRate2: '7',
      compareTime: '10',
      inflationRate: '2.5',
      taxRate: '25'
    })
    setErrors({})
  }

  const chartConfig = (results) => {
    if (!results) return null
    
    switch(results.type) {
      case 'simpleInterest':
        return {
          pie: {
            data: {
              labels: ['Principal', 'Interest'],
              datasets: [{
                data: [results.principal, results.simpleInterest],
                backgroundColor: ['rgb(59, 130, 246)', 'rgb(34, 197, 94)']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          }
        }
      
      case 'compoundInterest':
        return {
          bar: {
            data: {
              labels: results.breakdown?.map(item => `Year ${item.year}`) || [],
              datasets: [
                {
                  label: 'Principal',
                  data: results.breakdown?.map(item => item.principal) || [],
                  backgroundColor: 'rgb(59, 130, 246)'
                },
                {
                  label: 'Interest',
                  data: results.breakdown?.map(item => item.interest) || [],
                  backgroundColor: 'rgb(34, 197, 94)'
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          }
        }
      
      case 'interestComparison':
        return {
          line: {
            data: {
              labels: results.breakdown?.map(item => `Year ${item.year}`) || [],
              datasets: [
                {
                  label: `${results.rate1.toFixed(1)}% Rate`,
                  data: results.breakdown?.map(item => item.amount1) || [],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4
                },
                {
                  label: `${results.rate2.toFixed(1)}% Rate`,
                  data: results.breakdown?.map(item => item.amount2) || [],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  tension: 0.4
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          }
        }
      
      default:
        return null
    }
  }

  const tableConfig = (results) => {
    if (!results?.summary) return null
    
    return {
      data: results.summary,
      columns: [
        { key: 'label', header: 'Metric' },
        { key: 'value', header: 'Value' }
      ],
      pagination: false
    }
  }

  const getResultDisplay = (results) => {
    if (!results) return null
    
    return (
      <div className="card bg-gradient-to-br from-primary/5 to-transparent mx-2 md:mx-0">
        <div className="text-center mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Calculation Result</h3>
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
            {results.type === 'simpleInterest' && `$${results.totalAmount.toLocaleString()}`}
            {results.type === 'compoundInterest' && `$${results.compoundAmount.toLocaleString()}`}
            {results.type === 'creditCardInterest' && `${results.monthsToPayoff} months`}
            {results.type === 'interestComparison' && `$${results.difference.toLocaleString()}`}
            {results.type === 'effectiveRate' && `${results.effectiveRate.toFixed(2)}%`}
            {results.type === 'loanInterest' && `$${results.totalInterest.toLocaleString()}`}
          </div>
          <p className="text-sm md:text-base text-text/60">
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
          Interest Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base text-center md:text-left">
          Calculate simple interest, compound interest, credit card interest, and compare different rates.
        </p>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Left Column - Calculator Type & Inputs */}
        <div className="w-full lg:w-1/2">
          <div className="card space-y-4 md:space-y-6 mx-2 md:mx-0">
            {/* Calculator Type Selection */}
            <div>
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                Interest Type
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

            {/* Action Buttons */}
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
                Calculate Interest
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="card mt-4 md:mt-6 mx-2 md:mx-0">
            <details className="group">
              <summary className="font-semibold text-base md:text-lg cursor-pointer md:cursor-auto md:list-none flex justify-between items-center">
                <span>Interest Formulas</span>
                <span className="md:hidden transform group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-3 md:mt-4 space-y-3 text-sm md:text-base">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="font-medium mb-1">Simple Interest</div>
                  <div className="font-mono text-xs">I = P × r × t</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="font-medium mb-1">Compound Interest</div>
                  <div className="font-mono text-xs">A = P(1 + r/n)^(nt)</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="font-medium mb-1">Effective Annual Rate</div>
                  <div className="font-mono text-xs">EAR = (1 + r/n)^n - 1</div>
                </div>
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

                {/* Charts */}
                {chartConfig(results) && (
                  <div className="mx-2 md:mx-0">
                    <ResultDisplay
                      results={results}
                      chartConfig={chartConfig(results)}
                      tableConfig={tableConfig(results)}
                    />
                  </div>
                )}

                {/* Detailed Breakdown */}
                <div className="card mx-2 md:mx-0">
                  <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">
                    Detailed Breakdown
                  </h3>
                  <div className="overflow-x-auto">
                    <DataTable
                      data={results.summary}
                      columns={[
                        { key: 'label', header: 'Metric' },
                        { key: 'value', header: 'Value' }
                      ]}
                      pagination={false}
                    />
                  </div>
                </div>

                {/* Quick Examples */}
                <div className="card bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 mx-2 md:mx-0">
                  <h3 className="font-semibold text-base md:text-lg mb-3">
                    Common Interest Examples
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm text-text/60">$1,000 at 5% for 1 year</div>
                      <div className="font-medium">Simple: $50 | Compound: $51.16</div>
                    </div>
                    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm text-text/60">Credit Card $5,000 at 18%</div>
                      <div className="font-medium">Min payment: 328 months</div>
                    </div>
                    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm text-text/60">5% vs 7% over 10 years</div>
                      <div className="font-medium">Difference: $2,367</div>
                    </div>
                    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-sm text-text/60">5% monthly compounding</div>
                      <div className="font-medium">EAR: 5.12%</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Placeholder */}
            {!results && (
              <div className="card mx-2 md:mx-0">
                <div className="text-center py-8 md:py-12">
                  <div className="text-5xl md:text-6xl mb-4">%</div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    Enter Values to Calculate
                  </h3>
                  <p className="text-text/60">
                    Select an interest type and enter values to see results
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="card mt-6 md:mt-8 mx-2 md:mx-0">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Key Interest Concepts</h2>
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-base">Simple Interest</h4>
            <p className="text-sm text-text/70">
              Interest calculated only on the principal amount. Common for short-term loans and some investments.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-base">Compound Interest</h4>
            <p className="text-sm text-text/70">
              Interest calculated on principal plus accumulated interest. The most common type for savings and investments.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-base">APR vs EAR</h4>
            <p className="text-sm text-text/70">
              APR is the nominal rate, EAR is the actual rate after compounding. EAR is always higher than APR with frequent compounding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}