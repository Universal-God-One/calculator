export interface DownPaymentResult {
  downPayment: number
  downPaymentPct: number
  loanAmount: number
  monthlyPayment: number
  monthlyRequired: number
  totalMonths: number
  totalYears: number
  interestEarned: number
  finalSavings: number
  schedule: {
    month: number
    contribution: number
    interest: number
    balance: number
    progress: number // % of goal
  }[]
  milestones: {
    pct: number
    label: string
    amount: number
    monthReached: number | null
  }[]
}

export function calcDownPayment(
  homePrice: number,
  targetDownPct: number,       // % of home price
  currentSavings: number,
  monthlySavings: number,
  annualReturn: number,        // savings account/investment return
  annualRate: number,          // mortgage rate for payment calc
  mortgageTerm: number,
): DownPaymentResult {
  const downPayment = homePrice * targetDownPct / 100
  const loanAmount = homePrice - downPayment
  const mr = annualRate / 100 / 12
  const n = mortgageTerm * 12

  // Monthly mortgage payment
  const monthlyPayment = mr === 0
    ? loanAmount / n
    : loanAmount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)

  // How long to save the down payment
  const rPerMonth = annualReturn / 100 / 12
  const needed = Math.max(0, downPayment - currentSavings)

  let totalMonths = 0
  let balance = currentSavings
  let totalInterest = 0
  const schedule = []

  // Milestones: 3.5% (FHA min), 5%, 10%, 20%
  const milestoneAmounts = [
    { pct: 3.5, label: 'FHA Minimum (3.5%)', amount: homePrice * 0.035 },
    { pct: 5, label: 'Conventional (5%)', amount: homePrice * 0.05 },
    { pct: 10, label: 'No PMI Threshold Halfway (10%)', amount: homePrice * 0.10 },
    { pct: 20, label: 'No PMI (20%)', amount: homePrice * 0.20 },
  ]
  const milestoneReached: Record<number, number> = {}

  const maxMonths = 600 // 50 years max
  for (let m = 1; m <= maxMonths; m++) {
    const interest = balance * rPerMonth
    balance += interest + monthlySavings
    totalInterest += interest

    // Check milestones
    milestoneAmounts.forEach(ms => {
      if (!(ms.pct in milestoneReached) && balance >= ms.amount) {
        milestoneReached[ms.pct] = m
      }
    })

    schedule.push({
      month: m,
      contribution: Math.round(monthlySavings * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      progress: Math.min(100, Math.round((balance / downPayment) * 100 * 10) / 10),
    })

    if (balance >= downPayment) {
      totalMonths = m
      break
    }
  }

  if (totalMonths === 0) totalMonths = maxMonths

  const milestones = milestoneAmounts.map(ms => ({
    pct: ms.pct,
    label: ms.label,
    amount: Math.round(ms.amount),
    monthReached: milestoneReached[ms.pct] ?? null,
  }))

  // Monthly savings required to reach goal in specific time
  const monthlyRequired = rPerMonth === 0
    ? needed / totalMonths
    : needed * rPerMonth / (Math.pow(1 + rPerMonth, totalMonths) - 1)

  return {
    downPayment: Math.round(downPayment),
    downPaymentPct: targetDownPct,
    loanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    monthlyRequired: Math.round(monthlyRequired * 100) / 100,
    totalMonths,
    totalYears: Math.round(totalMonths / 12 * 10) / 10,
    interestEarned: Math.round(totalInterest * 100) / 100,
    finalSavings: Math.round(balance * 100) / 100,
    schedule,
    milestones,
  }
}