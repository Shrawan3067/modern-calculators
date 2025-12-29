import { useState, useMemo, useEffect } from 'react'
import InputGroup from '../ui/InputGroup'
import ResultDisplay from '../charts/ResultDisplay'
import DataTable from '../tables/DataTable'

export default function LoanCalculator() {
  const [formData, setFormData] = useState({
    loanAmount: '10000',
    interestRate: '5.0',
    loanTerm: '5',
    paymentFrequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    loanType: 'personal',
    extraPayment: '0',
    extraPaymentFrequency: 'monthly',
    extraPaymentStart: '1',
    feesAmount: '0',
    feesType: 'upfront',
    compoundFrequency: 'monthly',
    prepaymentPenalty: '0',
    taxDeductible: 'no'
  })
  const [errors, setErrors] = useState({})

  const allInputs = [
    {
      name: 'loanType',
      label: 'Loan Type',
      type: 'select',
      default: 'personal',
      required: true,
      options: [
        { value: 'personal', label: 'Personal Loan' },
        { value: 'auto', label: 'Auto Loan' },
        { value: 'student', label: 'Student Loan' },
        { value: 'home', label: 'Home Equity Loan' },
        { value: 'business', label: 'Business Loan' },
        { value: 'creditCard', label: 'Credit Card Balance' }
      ]
    },
    {
      name: 'loanAmount',
      label: 'Loan Amount ($)',
      type: 'currency',
      default: 10000,
      required: true,
      min: 100,
      max: 1000000,
      step: 100,
      validate: (value) => {
        if (value <= 0) return 'Must be greater than 0'
        if (value < 100) return 'Minimum loan amount is $100'
        if (value > 1000000) return 'Maximum loan amount is $1,000,000'
        return null
      }
    },
    {
      name: 'interestRate',
      label: 'Annual Interest Rate (%)',
      type: 'percentage',
      default: 5.0,
      required: true,
      min: 0.1,
      max: 36,
      step: 0.125,
      validate: (value) => {
        if (value <= 0) return 'Must be greater than 0'
        if (value > 36) return 'Maximum interest rate is 36%'
        return null
      }
    },
    {
      name: 'loanTerm',
      label: 'Loan Term',
      type: 'select',
      default: 5,
      required: true,
      options: [
        { value: 0.5, label: '6 months' },
        { value: 1, label: '1 year' },
        { value: 2, label: '2 years' },
        { value: 3, label: '3 years' },
        { value: 4, label: '4 years' },
        { value: 5, label: '5 years' },
        { value: 7, label: '7 years' },
        { value: 10, label: '10 years' },
        { value: 15, label: '15 years' },
        { value: 20, label: '20 years' },
        { value: 30, label: '30 years' }
      ]
    },
    {
      name: 'paymentFrequency',
      label: 'Payment Frequency',
      type: 'select',
      default: 'monthly',
      required: true,
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'bi-weekly', label: 'Bi-Weekly' },
        { value: 'semi-monthly', label: 'Semi-Monthly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'semi-annual', label: 'Semi-Annual' },
        { value: 'annual', label: 'Annual' }
      ]
    },
    {
      name: 'compoundFrequency',
      label: 'Compound Frequency',
      type: 'select',
      default: 'monthly',
      required: true,
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'bi-weekly', label: 'Bi-Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'semi-annual', label: 'Semi-Annual' },
        { value: 'annual', label: 'Annual' }
      ]
    },
    {
      name: 'feesAmount',
      label: 'Loan Fees ($)',
      type: 'currency',
      default: 0,
      required: true,
      min: 0,
      max: 10000,
      step: 10
    },
    {
      name: 'feesType',
      label: 'Fee Type',
      type: 'select',
      default: 'upfront',
      required: true,
      options: [
        { value: 'upfront', label: 'Upfront Fee' },
        { value: 'monthly', label: 'Monthly Fee' },
        { value: 'annual', label: 'Annual Fee' }
      ]
    },
    {
      name: 'prepaymentPenalty',
      label: 'Prepayment Penalty (%)',
      type: 'percentage',
      default: 0,
      required: true,
      min: 0,
      max: 5,
      step: 0.1
    },
    {
      name: 'extraPayment',
      label: 'Extra Payment ($)',
      type: 'currency',
      default: 0,
      required: true,
      min: 0,
      max: 10000,
      step: 10
    },
    {
      name: 'extraPaymentFrequency',
      label: 'Extra Payment Frequency',
      type: 'select',
      default: 'monthly',
      required: true,
      options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'annual', label: 'Annual' },
        { value: 'one-time', label: 'One-Time' }
      ]
    },
    {
      name: 'extraPaymentStart',
      label: 'Start Extra Payment After',
      type: 'select',
      default: '1',
      required: true,
      options: [
        { value: '1', label: '1st Payment' },
        { value: '6', label: '6th Payment' },
        { value: '12', label: '12th Payment' },
        { value: '24', label: '24th Payment' }
      ]
    },
    {
      name: 'taxDeductible',
      label: 'Interest Tax Deductible',
      type: 'select',
      default: 'no',
      required: true,
      options: [
        { value: 'no', label: 'No' },
        { value: 'student', label: 'Student Loan' },
        { value: 'mortgage', label: 'Mortgage Interest' },
        { value: 'business', label: 'Business Loan' }
      ]
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      default: new Date().toISOString().split('T')[0],
      required: true
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

  // Get payments per year based on frequency
  const getPaymentsPerYear = (frequency) => {
    switch (frequency) {
      case 'daily': return 365
      case 'weekly': return 52
      case 'bi-weekly': return 26
      case 'semi-monthly': return 24
      case 'monthly': return 12
      case 'quarterly': return 4
      case 'semi-annual': return 2
      case 'annual': return 1
      default: return 12
    }
  }

  // Calculate results
  const results = useMemo(() => {
    if (Object.keys(validationErrors).length > 0) {
      return null
    }

    try {
      const loanAmount = parseFloat(formData.loanAmount)
      const interestRate = parseFloat(formData.interestRate) / 100
      const years = parseFloat(formData.loanTerm)
      const paymentFrequency = formData.paymentFrequency
      const compoundFrequency = formData.compoundFrequency
      const feesAmount = parseFloat(formData.feesAmount)
      const feesType = formData.feesType
      const prepaymentPenalty = parseFloat(formData.prepaymentPenalty) / 100
      const extraPayment = parseFloat(formData.extraPayment)
      const extraPaymentFrequency = formData.extraPaymentFrequency
      const extraPaymentStart = parseInt(formData.extraPaymentStart)
      const taxDeductible = formData.taxDeductible
      const startDate = new Date(formData.startDate)

      // Calculate frequencies
      const paymentsPerYear = getPaymentsPerYear(paymentFrequency)
      const compoundsPerYear = getPaymentsPerYear(compoundFrequency)
      const totalPayments = years * paymentsPerYear
      const periodicRate = interestRate / paymentsPerYear
      const compoundPeriodicRate = interestRate / compoundsPerYear

      // Adjust loan amount for upfront fees
      let effectiveLoanAmount = loanAmount
      let totalFees = 0
      
      if (feesType === 'upfront' && feesAmount > 0) {
        effectiveLoanAmount += feesAmount
        totalFees = feesAmount
      }

      // Calculate periodic payment
      let periodicPayment
      if (periodicRate === 0) {
        periodicPayment = effectiveLoanAmount / totalPayments
      } else {
        // Compound interest formula for periodic payments
        periodicPayment = effectiveLoanAmount * 
          (periodicRate * Math.pow(1 + periodicRate, totalPayments)) / 
          (Math.pow(1 + periodicRate, totalPayments) - 1)
      }

      // Add monthly/annual fees to payment
      if (feesType === 'monthly' && feesAmount > 0) {
        periodicPayment += feesAmount
        totalFees = feesAmount * totalPayments
      } else if (feesType === 'annual' && feesAmount > 0) {
        periodicPayment += feesAmount / paymentsPerYear
        totalFees = feesAmount * years
      }

      // Generate amortization schedule with extra payments
      const schedule = []
      let balance = effectiveLoanAmount
      let totalInterestPaid = 0
      let totalPrincipalPaid = 0
      let cumulativeInterest = 0
      let paymentNumber = 1
      let paymentDate = new Date(startDate)
      
      while (balance > 0.01 && paymentNumber <= totalPayments) {
        // Calculate interest for this period
        const interest = balance * periodicRate
        
        // Calculate principal for this period
        let principal = periodicPayment - interest
        
        // Apply extra payment if applicable
        let extraPaymentThisPeriod = 0
        if (extraPayment > 0) {
          const shouldApplyExtra = () => {
            if (extraPaymentFrequency === 'one-time' && paymentNumber === extraPaymentStart) return true
            if (extraPaymentFrequency === 'monthly' && paymentNumber >= extraPaymentStart) return true
            if (extraPaymentFrequency === 'quarterly' && paymentNumber >= extraPaymentStart && paymentNumber % (paymentsPerYear / 4) === 0) return true
            if (extraPaymentFrequency === 'annual' && paymentNumber >= extraPaymentStart && paymentNumber % paymentsPerYear === 0) return true
            return false
          }
          
          if (shouldApplyExtra()) {
            extraPaymentThisPeriod = extraPayment
            principal += extraPayment
          }
        }
        
        // Adjust for final payment
        if (principal > balance) {
          principal = balance
        }
        
        balance -= principal
        totalInterestPaid += interest
        totalPrincipalPaid += principal
        cumulativeInterest += interest
        
        // Calculate payment date
        switch (paymentFrequency) {
          case 'daily':
            paymentDate.setDate(paymentDate.getDate() + 1)
            break
          case 'weekly':
            paymentDate.setDate(paymentDate.getDate() + 7)
            break
          case 'bi-weekly':
            paymentDate.setDate(paymentDate.getDate() + 14)
            break
          case 'semi-monthly':
            paymentDate.setDate(paymentDate.getMonth() === paymentDate.getMonth() ? 15 : 1)
            paymentDate.setMonth(paymentDate.getMonth() + (paymentDate.getDate() === 1 ? 0 : 1))
            break
          case 'monthly':
            paymentDate.setMonth(paymentDate.getMonth() + 1)
            break
          case 'quarterly':
            paymentDate.setMonth(paymentDate.getMonth() + 3)
            break
          case 'semi-annual':
            paymentDate.setMonth(paymentDate.getMonth() + 6)
            break
          case 'annual':
            paymentDate.setFullYear(paymentDate.getFullYear() + 1)
            break
        }
        
        schedule.push({
          paymentNumber,
          date: paymentDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          payment: periodicPayment + extraPaymentThisPeriod,
          principal,
          interest,
          extraPayment: extraPaymentThisPeriod,
          balance: Math.max(balance, 0),
          cumulativeInterest,
          interestToDate: cumulativeInterest
        })
        
        paymentNumber++
      }

      // Calculate totals
      const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0)
      const totalExtraPayments = schedule.reduce((sum, row) => sum + row.extraPayment, 0)
      const totalCost = totalPayment + totalFees
      
      // Calculate prepayment penalty
      const prepaymentPenaltyAmount = prepaymentPenalty > 0 ? 
        (loanAmount - totalPrincipalPaid) * prepaymentPenalty : 0

      // Calculate tax savings if applicable
      let taxSavings = 0
      if (taxDeductible !== 'no') {
        const deductionRates = {
          student: 0.25,
          mortgage: 0.24,
          business: 0.21
        }
        taxSavings = totalInterestPaid * (deductionRates[taxDeductible] || 0)
      }

      // Calculate payoff date
      const payoffDate = new Date(startDate)
      if (paymentFrequency === 'monthly') {
        payoffDate.setMonth(payoffDate.getMonth() + schedule.length)
      } else if (paymentFrequency === 'bi-weekly') {
        payoffDate.setDate(payoffDate.getDate() + (schedule.length * 14))
      } else if (paymentFrequency === 'weekly') {
        payoffDate.setDate(payoffDate.getDate() + (schedule.length * 7))
      } else {
        payoffDate.setMonth(payoffDate.getMonth() + schedule.length)
      }

      // Calculate APR (Annual Percentage Rate)
      const apr = ((Math.pow((totalPayment / loanAmount), (1/years)) - 1) * 100) || interestRate * 100

      // Calculate savings from extra payments
      const scheduleWithoutExtra = []
      let balanceWithoutExtra = effectiveLoanAmount
      for (let i = 1; i <= totalPayments; i++) {
        const interest = balanceWithoutExtra * periodicRate
        const principal = periodicPayment - interest
        balanceWithoutExtra -= principal
        
        scheduleWithoutExtra.push({
          interest,
          principal
        })
        
        if (balanceWithoutExtra <= 0) break
      }
      
      const interestWithoutExtra = scheduleWithoutExtra.reduce((sum, row) => sum + row.interest, 0)
      const interestSavings = interestWithoutExtra - totalInterestPaid
      const timeSavingsMonths = (years * 12) - (schedule.length / (paymentsPerYear / 12))

      return {
        loanAmount,
        effectiveLoanAmount,
        interestRate,
        years,
        paymentFrequency,
        periodicPayment,
        totalPayment,
        totalInterestPaid,
        totalFees,
        totalExtraPayments,
        totalCost,
        prepaymentPenaltyAmount,
        taxSavings,
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
        apr: apr.toFixed(2),
        interestSavings,
        timeSavingsMonths,
        summary: {
          paymentsPerYear,
          totalPayments: schedule.length,
          periodicRate
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
      loanAmount: '10000',
      interestRate: '5.0',
      loanTerm: '5',
      paymentFrequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      loanType: 'personal',
      extraPayment: '0',
      extraPaymentFrequency: 'monthly',
      extraPaymentStart: '1',
      feesAmount: '0',
      feesType: 'upfront',
      compoundFrequency: 'monthly',
      prepaymentPenalty: '0',
      taxDeductible: 'no'
    })
    setErrors({})
  }

  const chartConfig = (results) => ({
    bar: {
      data: {
        labels: ['Principal', 'Interest', 'Fees', 'Extra Payments'],
        datasets: [{
          label: 'Total Cost Breakdown',
          data: [
            results.loanAmount,
            results.totalInterestPaid,
            results.totalFees,
            results.totalExtraPayments
          ],
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(34, 197, 94)'
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
        labels: ['Principal', 'Interest', 'Fees', 'Extra Payments'],
        datasets: [{
          data: [
            results.loanAmount,
            results.totalInterestPaid,
            results.totalFees,
            results.totalExtraPayments
          ],
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(34, 197, 94)'
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
    data: results.schedule.slice(0, 24), // Show first 2 years by default
    columns: [
      { key: 'paymentNumber', header: 'Payment #' },
      { key: 'date', header: 'Payment Date' },
      { key: 'payment', header: 'Payment' },
      { key: 'principal', header: 'Principal' },
      { key: 'interest', header: 'Interest' },
      { key: 'extraPayment', header: 'Extra' },
      { key: 'balance', header: 'Balance' },
      { key: 'cumulativeInterest', header: 'Interest to Date' }
    ],
    pagination: true
  })

  return (
    <div className="space-y-8">
      {/* Calculator header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Loan Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Calculate loan payments, total interest, APR, and create detailed amortization schedules for personal, auto, student, business, and other loans.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input section */}
        <div className="card space-y-6">
          <h2 className="text-xl font-semibold">Loan Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <h3 className="font-semibold pt-4 border-t border-border">Fees & Penalties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <h3 className="font-semibold pt-4 border-t border-border">Extra Payments & Tax</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex gap-4 pt-6 border-t border-border">
            <button 
              onClick={resetForm}
              className="px-4 py-2 border border-border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Reset
            </button>
            <button 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Calculate Loan
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
                  <h2 className="text-xl font-semibold mb-2">Payment Summary</h2>
                  <p className="text-sm text-text/60">
                    {formData.loanType.replace(/([A-Z])/g, ' $1')} Loan • {results.years} years
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-surface rounded-lg">
                    <div className="text-sm text-text/60 mb-1">Periodic Payment</div>
                    <div className="text-xl font-bold text-primary">
                      ${results.periodicPayment.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </div>
                    <div className="text-xs text-text/60 mt-1">
                      {results.paymentFrequency.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-surface rounded-lg">
                    <div className="text-sm text-text/60 mb-1">Total Interest</div>
                    <div className="text-xl font-bold text-error">
                      ${results.totalInterestPaid.toLocaleString()}
                    </div>
                    <div className="text-xs text-text/60 mt-1">
                      {(results.totalInterestPaid / results.loanAmount * 100).toFixed(1)}% of loan
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-surface rounded-lg">
                    <div className="text-sm text-text/60 mb-1">Total Cost</div>
                    <div className="text-xl font-bold text-text">
                      ${results.totalCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-text/60 mt-1">
                      APR: {results.apr}%
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-surface rounded-lg">
                    <div className="text-sm text-text/60 mb-1">Payoff Date</div>
                    <div className="text-xl font-bold">
                      {results.payoffDate.split(',')[0]}
                    </div>
                    <div className="text-xs text-text/60 mt-1">
                      {results.schedule.length} payments
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-text/70">Loan Amount</span>
                    <span className="font-medium">${results.loanAmount.toLocaleString()}</span>
                  </div>
                  {results.totalFees > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-text/70">Loan Fees</span>
                      <span className="font-medium">${results.totalFees.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-text/70">Total Interest</span>
                    <span className="font-medium text-error">${results.totalInterestPaid.toLocaleString()}</span>
                  </div>
                  {results.totalExtraPayments > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-text/70">Extra Payments</span>
                      <span className="font-medium text-green-600">${results.totalExtraPayments.toLocaleString()}</span>
                    </div>
                  )}
                  {results.prepaymentPenaltyAmount > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-text/70">Prepayment Penalty</span>
                      <span className="font-medium text-orange-600">${results.prepaymentPenaltyAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {results.taxSavings > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-text/70">Tax Savings</span>
                      <span className="font-medium text-blue-600">${results.taxSavings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Cost of Loan</span>
                      <span className="font-bold text-lg">${results.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              <ResultDisplay 
                results={results} 
                chartConfig={chartConfig(results)}
                tableConfig={tableConfig(results)}
              />

              {/* Savings Information */}
              {(results.interestSavings > 0 || results.taxSavings > 0) && (
                <div className="card bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20">
                  <h3 className="font-semibold mb-3">Total Savings</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.interestSavings > 0 && (
                      <div className="p-3 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="text-sm text-text/60">Interest Saved</div>
                        <div className="text-xl font-bold text-green-600">
                          ${results.interestSavings.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {results.timeSavingsMonths > 0 && (
                      <div className="p-3 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="text-sm text-text/60">Time Saved</div>
                        <div className="text-xl font-bold text-green-600">
                          {Math.floor(results.timeSavingsMonths / 12)}y {Math.round(results.timeSavingsMonths % 12)}m
                        </div>
                      </div>
                    )}
                    {results.taxSavings > 0 && (
                      <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="text-sm text-text/60">Tax Savings</div>
                        <div className="text-xl font-bold text-blue-600">
                          ${results.taxSavings.toLocaleString()}
                        </div>
                      </div>
                    )}
                    <div className="p-3 border border-border rounded-lg">
                      <div className="text-sm text-text/60">Effective APR</div>
                      <div className="text-xl font-bold">
                        {results.apr}%
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
        <h2 className="text-xl font-semibold mb-4">Loan Insights & Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Loan Terms</h3>
            {results && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Loan Type</span>
                  <span className="font-medium capitalize">{formData.loanType.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Original Amount</span>
                  <span className="font-medium">${results.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate</span>
                  <span className="font-medium">{(results.interestRate * 100).toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Term</span>
                  <span className="font-medium">{results.years} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Frequency</span>
                  <span className="font-medium capitalize">{results.paymentFrequency.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compound Frequency</span>
                  <span className="font-medium capitalize">{formData.compoundFrequency.replace('-', ' ')}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Schedule</h3>
            {results && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payments per Year</span>
                  <span className="font-medium">{results.summary.paymentsPerYear}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Payments</span>
                  <span className="font-medium">{results.summary.totalPayments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Start Date</span>
                  <span className="font-medium">{results.startDate.split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payoff Date</span>
                  <span className="font-medium">{results.payoffDate.split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Amount</span>
                  <span className="font-medium">${results.periodicPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Payments</span>
                  <span className="font-medium">${results.totalExtraPayments.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Cost Analysis</h3>
            {results && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Principal Repaid</span>
                  <span className="font-medium">${results.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Paid</span>
                  <span className="font-medium text-error">${results.totalInterestPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fees & Penalties</span>
                  <span className="font-medium">${(results.totalFees + results.prepaymentPenaltyAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Payments</span>
                  <span className="font-medium text-green-600">${results.totalExtraPayments.toLocaleString()}</span>
                </div>
                {results.taxSavings > 0 && (
                  <div className="flex justify-between">
                    <span>Tax Deduction</span>
                    <span className="font-medium text-blue-600">${results.taxSavings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold">Net Cost</span>
                  <span className="font-bold">${(results.totalCost - results.taxSavings).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}