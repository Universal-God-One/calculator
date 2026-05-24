export interface PayoffResult {
  originalMonthlyPayment: number
  newMonthlyPayment: number
  originalPayoffMonths: number
  newPayoffMonths: number
  monthsSaved: number
  yearsSaved: number
  originalTotalInterest: number
  newTotalInterest: number
  interestSaved: number
  originalPayoffDate: string
  newPayoffDate: string
  schedule: {
    month: number
    year: number
    balance: number
    extraPayment: number
    cumulativeInterestSaved: number
  }[]
}

function getPayoffDate(monthsFromNow: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + monthsFromNow)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function calcMortgagePayoff(
  balance: number,
  annualRate: number,
  monthsRemaining: number,
  extraMonthly: number = 0,
  extraYearly: number = 0,
  extraOneTime: number = 0,
  oneTimeMonth: number = 1,
): PayoffResult {
  const mr = annualRate / 100 / 12

  // Original monthly payment
  const originalMonthly = mr === 0
    ? balance / monthsRemaining
    : balance * (mr * Math.pow(1 + mr, monthsRemaining)) / (Math.pow(1 + mr, monthsRemaining) - 1)

  // Original schedule (no extra)
  let origBal = balance
  let origTotalInterest = 0
  for (let m = 1; m <= monthsRemaining; m++) {
    const interest = origBal * mr
    origBal = Math.max(0, origBal - (originalMonthly - interest))
    origTotalInterest += interest
    if (origBal <= 0) break
  }

  // New schedule with extra payments
  let newBal = balance
  let newTotalInterest = 0
  let origInterestToDate = 0
  let newPayoffMonths = 0
  const schedule = []

  for (let m = 1; m <= monthsRemaining; m++) {
    if (newBal <= 0) break

    const interest = newBal * mr
    let extra = extraMonthly
    if (m % 12 === 0) extra += extraYearly
    if (m === oneTimeMonth) extra += extraOneTime

    const principalPaid = Math.min(newBal, originalMonthly - interest + extra)
    newBal = Math.max(0, newBal - principalPaid)
    newTotalInterest += interest

    // Original interest to same month
    const origMonthInterest = origBal * mr // approximate
    origInterestToDate += interest + (origTotalInterest / monthsRemaining)

    if (m % 12 === 0 || newBal <= 0) {
      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        balance: Math.round(newBal * 100) / 100,
        extraPayment: Math.round(extra * 100) / 100,
        cumulativeInterestSaved: Math.round((origTotalInterest - newTotalInterest) * 100) / 100,
      })
    }

    if (newBal <= 0) {
      newPayoffMonths = m
      break
    }
  }

  if (newPayoffMonths === 0) newPayoffMonths = monthsRemaining

  const monthsSaved = monthsRemaining - newPayoffMonths
  const interestSaved = origTotalInterest - newTotalInterest

  return {
    originalMonthlyPayment: Math.round(originalMonthly * 100) / 100,
    newMonthlyPayment: Math.round((originalMonthly + extraMonthly) * 100) / 100,
    originalPayoffMonths: monthsRemaining,
    newPayoffMonths,
    monthsSaved,
    yearsSaved: Math.round(monthsSaved / 12 * 10) / 10,
    originalTotalInterest: Math.round(origTotalInterest * 100) / 100,
    newTotalInterest: Math.round(newTotalInterest * 100) / 100,
    interestSaved: Math.round(interestSaved * 100) / 100,
    originalPayoffDate: getPayoffDate(monthsRemaining),
    newPayoffDate: getPayoffDate(newPayoffMonths),
    schedule,
  }
}