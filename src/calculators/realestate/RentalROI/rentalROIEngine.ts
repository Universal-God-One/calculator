export interface RentalROIResult {
  // Monthly
  grossRentalIncome: number
  vacancyLoss: number
  effectiveGrossIncome: number
  totalMonthlyExpenses: number
  monthlyMortgage: number
  netOperatingIncome: number
  monthlyCashFlow: number

  // Annual
  annualGrossIncome: number
  annualNOI: number
  annualCashFlow: number

  // Returns
  capRate: number
  cashOnCashReturn: number
  grossRentMultiplier: number
  totalROI: number

  // Equity & appreciation
  totalInvestment: number
  equityAfterYears: number
  homeValueAfterYears: number
  totalReturnAfterYears: number
  annualizedReturn: number

  schedule: {
    year: number
    homeValue: number
    loanBalance: number
    equity: number
    annualRent: number
    annualExpenses: number
    annualMortgage: number
    annualCashFlow: number
    cumulativeCashFlow: number
    totalReturn: number
  }[]
}

export function calcRentalROI(
  purchasePrice: number,
  downPaymentPct: number,
  mortgageRate: number,
  mortgageTerm: number,
  monthlyRent: number,
  vacancyRate: number,         // %
  propertyTaxRate: number,     // % of value annually
  insuranceMonthly: number,
  maintenancePct: number,      // % of value annually
  managementPct: number,       // % of rent
  hoaMonthly: number,
  appreciation: number,        // % annually
  rentIncrease: number,        // % annually
  expenseIncrease: number,     // % annually
  years: number,
  closingCostsPct: number,     // % of purchase
): RentalROIResult {
  const downPayment = purchasePrice * downPaymentPct / 100
  const closingCosts = purchasePrice * closingCostsPct / 100
  const totalInvestment = downPayment + closingCosts
  const loanAmount = purchasePrice - downPayment

  const mr = mortgageRate / 100 / 12
  const n = mortgageTerm * 12

  const monthlyMortgage = mr === 0
    ? loanAmount / n
    : loanAmount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)

  // Year 1 monthly figures
  const vacancyLoss = monthlyRent * vacancyRate / 100
  const effectiveGrossIncome = monthlyRent - vacancyLoss
  const propertyTaxMonthly = purchasePrice * propertyTaxRate / 100 / 12
  const maintenanceMonthly = purchasePrice * maintenancePct / 100 / 12
  const managementFee = effectiveGrossIncome * managementPct / 100
  const totalMonthlyExpenses = propertyTaxMonthly + insuranceMonthly + maintenanceMonthly + managementFee + hoaMonthly
  const netOperatingIncome = effectiveGrossIncome - totalMonthlyExpenses
  const monthlyCashFlow = netOperatingIncome - monthlyMortgage

  const annualGrossIncome = effectiveGrossIncome * 12
  const annualNOI = netOperatingIncome * 12
  const annualCashFlow = monthlyCashFlow * 12

  // Key metrics
  const capRate = (annualNOI / purchasePrice) * 100
  const cashOnCashReturn = totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0
  const grossRentMultiplier = (monthlyRent * 12) > 0 ? purchasePrice / (monthlyRent * 12) : 0

  // Multi-year schedule
  let loanBalance = loanAmount
  let homeValue = purchasePrice
  let currentRent = monthlyRent
  let currentExpenses = totalMonthlyExpenses
  let cumulativeCashFlow = 0
  const schedule = []

  for (let y = 1; y <= years; y++) {
    // Appreciate
    homeValue *= (1 + appreciation / 100)
    currentRent *= (1 + rentIncrease / 100)
    currentExpenses *= (1 + expenseIncrease / 100)

    // Pay down mortgage
    let yearInterest = 0
    for (let m = 0; m < 12; m++) {
      if (loanBalance <= 0) break
      const interest = loanBalance * mr
      const principal = Math.min(loanBalance, monthlyMortgage - interest)
      loanBalance = Math.max(0, loanBalance - principal)
      yearInterest += interest
    }

    const yearVacancy = currentRent * vacancyRate / 100
    const yearEffectiveRent = (currentRent - yearVacancy) * 12
    const yearExpenses = currentExpenses * 12
    const yearMortgage = monthlyMortgage * 12
    const yearCashFlow = yearEffectiveRent - yearExpenses - yearMortgage
    cumulativeCashFlow += yearCashFlow

    const equity = homeValue - loanBalance
    const totalReturn = equity - totalInvestment + cumulativeCashFlow

    schedule.push({
      year: y,
      homeValue: Math.round(homeValue),
      loanBalance: Math.round(Math.max(0, loanBalance)),
      equity: Math.round(equity),
      annualRent: Math.round(yearEffectiveRent),
      annualExpenses: Math.round(yearExpenses),
      annualMortgage: Math.round(yearMortgage),
      annualCashFlow: Math.round(yearCashFlow),
      cumulativeCashFlow: Math.round(cumulativeCashFlow),
      totalReturn: Math.round(totalReturn),
    })
  }

  const finalYear = schedule[schedule.length - 1]
  const totalReturnAfterYears = finalYear.totalReturn
  const annualizedReturn = totalInvestment > 0
    ? (Math.pow((totalReturnAfterYears + totalInvestment) / totalInvestment, 1 / years) - 1) * 100
    : 0

  const totalROI = totalInvestment > 0 ? (totalReturnAfterYears / totalInvestment) * 100 : 0

  return {
    grossRentalIncome: Math.round(monthlyRent * 100) / 100,
    vacancyLoss: Math.round(vacancyLoss * 100) / 100,
    effectiveGrossIncome: Math.round(effectiveGrossIncome * 100) / 100,
    totalMonthlyExpenses: Math.round(totalMonthlyExpenses * 100) / 100,
    monthlyMortgage: Math.round(monthlyMortgage * 100) / 100,
    netOperatingIncome: Math.round(netOperatingIncome * 100) / 100,
    monthlyCashFlow: Math.round(monthlyCashFlow * 100) / 100,
    annualGrossIncome: Math.round(annualGrossIncome * 100) / 100,
    annualNOI: Math.round(annualNOI * 100) / 100,
    annualCashFlow: Math.round(annualCashFlow * 100) / 100,
    capRate: Math.round(capRate * 100) / 100,
    cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
    grossRentMultiplier: Math.round(grossRentMultiplier * 100) / 100,
    totalROI: Math.round(totalROI * 100) / 100,
    totalInvestment: Math.round(totalInvestment * 100) / 100,
    equityAfterYears: finalYear.equity,
    homeValueAfterYears: finalYear.homeValue,
    totalReturnAfterYears,
    annualizedReturn: Math.round(annualizedReturn * 100) / 100,
    schedule,
  }
}