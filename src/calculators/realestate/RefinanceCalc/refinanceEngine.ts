export interface RefinanceResult {
  currentMonthly: number
  newMonthly: number
  monthlySavings: number
  breakEvenMonths: number
  breakEvenYears: number
  totalSavings: number
  currentTotalRemaining: number
  newTotalPayment: number
  netSavings: number
  currentInterestRemaining: number
  newTotalInterest: number
  interestSaved: number
  schedule: {
    month: number
    currentBalance: number
    newBalance: number
    cumulativeSavings: number
  }[]
}

export function calcRefinance(
  currentBalance: number,
  currentRate: number,
  currentMonthsRemaining: number,
  newRate: number,
  newTermYears: number,
  closingCosts: number,
  cashOut: number = 0,
): RefinanceResult {
  const newLoan = currentBalance + cashOut + closingCosts
  const newN = newTermYears * 12

  // Current monthly payment
  const cr = currentRate / 100 / 12
  const currentMonthly = cr === 0
    ? currentBalance / currentMonthsRemaining
    : currentBalance * (cr * Math.pow(1 + cr, currentMonthsRemaining)) / (Math.pow(1 + cr, currentMonthsRemaining) - 1)

  // New monthly payment
  const nr = newRate / 100 / 12
  const newMonthly = nr === 0
    ? newLoan / newN
    : newLoan * (nr * Math.pow(1 + nr, newN)) / (Math.pow(1 + nr, newN) - 1)

  const monthlySavings = currentMonthly - newMonthly
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity

  // Total remaining on current loan
  let currentBal = currentBalance
  let currentTotalRemaining = 0
  let currentInterestRemaining = 0
  for (let m = 0; m < currentMonthsRemaining; m++) {
    const interest = currentBal * cr
    const principal = Math.min(currentBal, currentMonthly - interest)
    currentBal -= principal
    currentTotalRemaining += currentMonthly
    currentInterestRemaining += interest
  }

  // Total on new loan
  let newBal = newLoan
  let newTotalPayment = 0
  let newTotalInterest = 0
  for (let m = 0; m < newN; m++) {
    const interest = newBal * nr
    const principal = Math.min(newBal, newMonthly - interest)
    newBal -= principal
    newTotalPayment += newMonthly
    newTotalInterest += interest
  }

  const netSavings = currentTotalRemaining - newTotalPayment
  const interestSaved = currentInterestRemaining - newTotalInterest

  // Month-by-month schedule (for break-even chart)
  let cBal = currentBalance
  let nBal = newLoan
  let cumSavings = -closingCosts
  const schedule = []
  const maxMonths = Math.min(Math.max(currentMonthsRemaining, newN), 360)

  for (let m = 1; m <= maxMonths; m++) {
    if (cBal > 0) {
      const ci = cBal * cr
      cBal = Math.max(0, cBal - Math.min(cBal, currentMonthly - ci))
    }
    if (nBal > 0) {
      const ni = nBal * nr
      nBal = Math.max(0, nBal - Math.min(nBal, newMonthly - ni))
    }
    cumSavings += monthlySavings
    if (m % 12 === 0 || m === maxMonths) {
      schedule.push({
        month: m,
        currentBalance: Math.round(Math.max(0, cBal) * 100) / 100,
        newBalance: Math.round(Math.max(0, nBal) * 100) / 100,
        cumulativeSavings: Math.round(cumSavings * 100) / 100,
      })
    }
  }

  return {
    currentMonthly: Math.round(currentMonthly * 100) / 100,
    newMonthly: Math.round(newMonthly * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    breakEvenMonths: isFinite(breakEvenMonths) ? breakEvenMonths : 9999,
    breakEvenYears: isFinite(breakEvenMonths) ? Math.round(breakEvenMonths / 12 * 10) / 10 : 9999,
    totalSavings: Math.round(Math.max(0, netSavings) * 100) / 100,
    currentTotalRemaining: Math.round(currentTotalRemaining * 100) / 100,
    newTotalPayment: Math.round(newTotalPayment * 100) / 100,
    netSavings: Math.round(netSavings * 100) / 100,
    currentInterestRemaining: Math.round(currentInterestRemaining * 100) / 100,
    newTotalInterest: Math.round(newTotalInterest * 100) / 100,
    interestSaved: Math.round(interestSaved * 100) / 100,
    schedule,
  }
}