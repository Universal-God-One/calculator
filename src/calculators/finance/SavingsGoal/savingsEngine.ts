export interface SavingsResult {
  monthlyRequired: number
  totalContributions: number
  totalInterest: number
  finalBalance: number
  months: number
  schedule: { month: number; contribution: number; interest: number; balance: number }[]
}

export function calcSavingsGoal(
  goalAmount: number,
  currentSavings: number,
  annualRate: number,
  years: number
): SavingsResult {
  const months = years * 12
  const r = annualRate / 100 / 12
  const remaining = goalAmount - currentSavings

  // Monthly payment formula: PMT = (FV * r) / ((1 + r)^n - 1)
  const monthlyRequired = r === 0
    ? remaining / months
    : (remaining * r) / (Math.pow(1 + r, months) - 1)

  let balance = currentSavings
  let totalContributions = currentSavings
  let totalInterest = 0
  const schedule = []

  for (let m = 1; m <= months; m++) {
    const interest = balance * r
    balance += interest + monthlyRequired
    totalContributions += monthlyRequired
    totalInterest += interest
    schedule.push({
      month: m,
      contribution: Math.round(monthlyRequired * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
  }

  return {
    monthlyRequired: Math.round(monthlyRequired * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    finalBalance: Math.round(balance * 100) / 100,
    months,
    schedule,
  }
}