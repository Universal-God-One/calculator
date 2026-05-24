export interface HomeEquityResult {
  availableEquity: number
  maxLoanAmount: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  currentLTV: number
  newLTV: number
  schedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export function calcHomeEquity(
  homeValue: number,
  mortgageBalance: number,
  loanAmount: number,
  annualRate: number,
  termYears: number,
  maxLTVPct: number = 85, // most lenders allow up to 85% CLTV
): HomeEquityResult {
  const currentEquity = homeValue - mortgageBalance
  const currentLTV = (mortgageBalance / homeValue) * 100
  const maxCLTV = homeValue * maxLTVPct / 100
  const maxLoanAmount = Math.max(0, maxCLTV - mortgageBalance)

  const actualLoan = Math.min(loanAmount, maxLoanAmount)
  const newLTV = ((mortgageBalance + actualLoan) / homeValue) * 100

  const mr = annualRate / 100 / 12
  const n = termYears * 12

  const monthlyPayment = mr === 0
    ? actualLoan / n
    : actualLoan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)

  let balance = actualLoan
  let totalInterest = 0
  const schedule = []

  for (let m = 1; m <= n; m++) {
    if (balance <= 0) break
    const interest = balance * mr
    const principalPaid = Math.min(balance, monthlyPayment - interest)
    balance = Math.max(0, balance - principalPaid)
    totalInterest += interest
    schedule.push({
      month: m,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
  }

  return {
    availableEquity: Math.round(currentEquity * 100) / 100,
    maxLoanAmount: Math.round(maxLoanAmount * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(monthlyPayment * n * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    currentLTV: Math.round(currentLTV * 10) / 10,
    newLTV: Math.round(newLTV * 10) / 10,
    schedule,
  }
}