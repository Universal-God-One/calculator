export interface AmortizationRow {
  month: number
  year: number
  payment: number
  principal: number
  interest: number
  balance: number
  totalInterestPaid: number
  totalPrincipalPaid: number
}

export interface AmortizationResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  totalPrincipal: number
  payoffMonths: number
  schedule: AmortizationRow[]
  yearSummary: {
    year: number
    principal: number
    interest: number
    balance: number
    totalPayment: number
  }[]
}

export function calcAmortization(
  loanAmount: number,
  annualRate: number,
  termYears: number,
  extraMonthly: number = 0,
  extraYearly: number = 0,
  extraOneTime: number = 0,
  oneTimeMonth: number = 1
): AmortizationResult {
  const mr = annualRate / 100 / 12
  const n = termYears * 12

  const monthlyPayment = mr === 0
    ? loanAmount / n
    : loanAmount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)

  let balance = loanAmount
  let totalInterestPaid = 0
  let totalPrincipalPaid = 0
  const schedule: AmortizationRow[] = []
  const yearMap: Record<number, { principal: number; interest: number; payment: number }> = {}

  for (let m = 1; m <= n; m++) {
    if (balance <= 0) break

    const year = Math.ceil(m / 12)
    const interest = balance * mr

    // Extra payments
    let extra = extraMonthly
    if (m % 12 === 0) extra += extraYearly
    if (m === oneTimeMonth) extra += extraOneTime

    const principalPaid = Math.min(balance, monthlyPayment - interest + extra)
    balance = Math.max(0, balance - principalPaid)

    totalInterestPaid += interest
    totalPrincipalPaid += principalPaid

    schedule.push({
      month: m,
      year,
      payment: Math.round((monthlyPayment + extra) * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
      totalPrincipalPaid: Math.round(totalPrincipalPaid * 100) / 100,
    })

    if (!yearMap[year]) yearMap[year] = { principal: 0, interest: 0, payment: 0 }
    yearMap[year].principal += principalPaid
    yearMap[year].interest += interest
    yearMap[year].payment += monthlyPayment + extra

    if (balance <= 0) break
  }

  const yearSummary = Object.entries(yearMap).map(([y, v]) => ({
    year: parseInt(y),
    principal: Math.round(v.principal * 100) / 100,
    interest: Math.round(v.interest * 100) / 100,
    balance: schedule.filter(r => r.year === parseInt(y)).slice(-1)[0]?.balance ?? 0,
    totalPayment: Math.round(v.payment * 100) / 100,
  }))

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round((monthlyPayment * schedule.length + (extraMonthly * schedule.length)) * 100) / 100,
    totalInterest: Math.round(totalInterestPaid * 100) / 100,
    totalPrincipal: Math.round(totalPrincipalPaid * 100) / 100,
    payoffMonths: schedule.length,
    schedule,
    yearSummary,
  }
}