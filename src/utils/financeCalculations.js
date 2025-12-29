// Financial calculation utilities
export const calculateAmortizationSchedule = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 12
  const totalMonths = years * 12
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1)
  
  const schedule = []
  let balance = principal
  
  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * monthlyRate
    const principalPaid = monthlyPayment - interest
    balance -= principalPaid
    
    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance: Math.max(balance, 0)
    })
  }
  
  return schedule
}

// Compound interest calculation
export const calculateCompoundInterest = (principal, rate, time, compoundFrequency = 12) => {
  const n = compoundFrequency
  const r = rate / 100
  const amount = principal * Math.pow(1 + r/n, n*time)
  return {
    totalAmount: amount,
    interestEarned: amount - principal
  }
}

// Simple interest calculation
export const calculateSimpleInterest = (principal, rate, time) => {
  const interest = principal * (rate / 100) * time
  return {
    totalAmount: principal + interest,
    interestEarned: interest
  }
}

// Loan payment calculation
export const calculateLoanPayment = (loanAmount, annualRate, years) => {
  const monthlyRate = annualRate / 12 / 100
  const totalPayments = years * 12
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  
  return {
    monthlyPayment,
    totalPayment: monthlyPayment * totalPayments,
    totalInterest: (monthlyPayment * totalPayments) - loanAmount
  }
}