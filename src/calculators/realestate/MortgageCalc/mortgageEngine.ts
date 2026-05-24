export interface MortgageResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  principal: number
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[]
}

export function calcMortgage(homePrice: number, downPct: number, annualRate: number, termYears: number, extraMonthly = 0): MortgageResult {
  const principal = homePrice * (1 - downPct / 100)
  const mr = annualRate / 100 / 12
  const n = termYears * 12
  const mp = mr === 0 ? principal / n : principal * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
  let balance = principal, totalInterest = 0
  const schedule = []
  for (let m = 1; m <= n; m++) {
    if (balance <= 0) break
    const interest = balance * mr
    const principalPaid = Math.min(balance, mp - interest + extraMonthly)
    balance -= principalPaid
    totalInterest += interest
    schedule.push({ month: m, payment: Math.round((mp + extraMonthly) * 100) / 100, principal: Math.round(principalPaid * 100) / 100, interest: Math.round(interest * 100) / 100, balance: Math.max(0, Math.round(balance * 100) / 100) })
  }
  return { monthlyPayment: Math.round(mp * 100) / 100, totalPayment: Math.round((mp + extraMonthly) * schedule.length * 100) / 100, totalInterest: Math.round(totalInterest * 100) / 100, principal, schedule }
}