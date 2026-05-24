export interface SimpleInterestResult {
  interest: number
  totalAmount: number
  dailyInterest: number
  monthlyInterest: number
  schedule: { period: number; label: string; interest: number; totalInterest: number; balance: number }[]
}

export function calcSimpleInterest(
  principal: number,
  annualRate: number,
  years: number
): SimpleInterestResult {
  const rate = annualRate / 100
  const interest = principal * rate * years
  const totalAmount = principal + interest
  const dailyInterest = (principal * rate) / 365
  const monthlyInterest = (principal * rate) / 12

  const schedule = []
  for (let y = 1; y <= years; y++) {
    const yearInterest = principal * rate
    const totalInterest = principal * rate * y
    schedule.push({
      period: y,
      label: `Year ${y}`,
      interest: Math.round(yearInterest * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      balance: Math.round((principal + totalInterest) * 100) / 100,
    })
  }

  return {
    interest: Math.round(interest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    dailyInterest: Math.round(dailyInterest * 100) / 100,
    monthlyInterest: Math.round(monthlyInterest * 100) / 100,
    schedule,
  }
}