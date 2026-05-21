export interface MortgageResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  principal: number
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[]
}

export function calcMortgage(
  homePrice: number,
  downPaymentPct: number,   // e.g. 20 for 20%
  annualRate: number,        // e.g. 6.5
  termYears: number,
  extraMonthly: number = 0
): MortgageResult {
  const principal = homePrice * (1 - downPaymentPct / 100)
  const monthlyRate = annualRate / 100 / 12
  const n = termYears * 12

  // Standard monthly payment formula
  const monthlyPayment = monthlyRate === 0
    ? principal / n
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)

  let balance = principal
  let totalInterest = 0
  const schedule = []

  for (let m = 1; m <= n; m++) {
    if (balance <= 0) break
    const interest = balance * monthlyRate
    const principalPaid = Math.min(balance, monthlyPayment - interest + extraMonthly)
    balance -= principalPaid
    totalInterest += interest
    if (m <= 360) {
      schedule.push({
        month: m,
        payment: Math.round((monthlyPayment + extraMonthly) * 100) / 100,
        principal: Math.round(principalPaid * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.max(0, Math.round(balance * 100) / 100),
      })
    }
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round((monthlyPayment * schedule.length + extraMonthly * schedule.length) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    principal,
    schedule,
  }
}

export const fmtUSD = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
