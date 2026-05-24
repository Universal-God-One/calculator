export interface HELOCResult {
  availableCredit: number
  maxCreditLine: number
  currentLTV: number
  newCLTV: number

  // Draw period
  drawMonthlyInterestOnly: number
  drawPeriodTotalInterest: number

  // Repayment period
  repayMonthlyPayment: number
  repayTotalInterest: number
  repayTotalPayment: number

  // Combined
  totalInterest: number
  totalCost: number

  schedule: {
    month: number
    phase: 'draw' | 'repayment'
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export function calcHELOC(
  homeValue: number,
  mortgageBalance: number,
  creditLineAmount: number,
  drawAmount: number,           // amount actually drawn
  annualRate: number,           // variable, but we treat as fixed for projection
  drawPeriodYears: number,      // typically 10
  repayPeriodYears: number,     // typically 20
  maxCLTVPct: number = 85,
  monthlyDrawPayment: number = 0, // optional extra principal during draw
): HELOCResult {
  const maxCreditLine = Math.max(0, homeValue * maxCLTVPct / 100 - mortgageBalance)
  const actualCreditLine = Math.min(creditLineAmount, maxCreditLine)
  const actualDraw = Math.min(drawAmount, actualCreditLine)

  const currentLTV = mortgageBalance / homeValue * 100
  const newCLTV = (mortgageBalance + actualDraw) / homeValue * 100

  const mr = annualRate / 100 / 12
  const drawMonths = drawPeriodYears * 12
  const repayMonths = repayPeriodYears * 12

  // Draw period — interest only (unless user makes extra principal payments)
  const drawMonthlyInterestOnly = actualDraw * mr
  let drawBal = actualDraw
  let drawTotalInterest = 0
  const schedule: HELOCResult['schedule'] = []

  for (let m = 1; m <= drawMonths; m++) {
    const interest = drawBal * mr
    const principal = Math.min(drawBal, monthlyDrawPayment)
    drawBal = Math.max(0, drawBal - principal)
    drawTotalInterest += interest
    schedule.push({
      month: m,
      phase: 'draw',
      payment: Math.round((interest + principal) * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(drawBal * 100) / 100,
    })
  }

  // Repayment period — fully amortizing on remaining balance
  const repayBal = drawBal
  const repayMonthly = mr === 0 || repayBal === 0
    ? repayBal / Math.max(repayMonths, 1)
    : repayBal * (mr * Math.pow(1 + mr, repayMonths)) / (Math.pow(1 + mr, repayMonths) - 1)

  let rBal = repayBal
  let repayTotalInterest = 0

  for (let m = 1; m <= repayMonths; m++) {
    if (rBal <= 0) break
    const interest = rBal * mr
    const principal = Math.min(rBal, repayMonthly - interest)
    rBal = Math.max(0, rBal - principal)
    repayTotalInterest += interest
    schedule.push({
      month: drawMonths + m,
      phase: 'repayment',
      payment: Math.round(repayMonthly * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(rBal * 100) / 100,
    })
  }

  const totalInterest = drawTotalInterest + repayTotalInterest
  const totalCost = actualDraw + totalInterest

  return {
    availableCredit: Math.round((actualCreditLine - actualDraw) * 100) / 100,
    maxCreditLine: Math.round(maxCreditLine * 100) / 100,
    currentLTV: Math.round(currentLTV * 10) / 10,
    newCLTV: Math.round(newCLTV * 10) / 10,
    drawMonthlyInterestOnly: Math.round(drawMonthlyInterestOnly * 100) / 100,
    drawPeriodTotalInterest: Math.round(drawTotalInterest * 100) / 100,
    repayMonthlyPayment: Math.round(repayMonthly * 100) / 100,
    repayTotalInterest: Math.round(repayTotalInterest * 100) / 100,
    repayTotalPayment: Math.round(repayMonthly * repayMonths * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    schedule,
  }
}