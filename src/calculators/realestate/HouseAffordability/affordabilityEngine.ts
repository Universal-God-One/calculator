export interface AffordabilityResult {
  maxHomePrice: number
  maxLoanAmount: number
  monthlyPayment: number
  downPayment: number
  frontEndRatio: number
  backEndRatio: number
  monthlyIncome: number
  totalMonthlyDebt: number
  breakdown: {
    principal: number
    interest: number
    propertyTax: number
    insurance: number
    pmi: number
    hoa: number
    total: number
  }
  conservative: number
  moderate: number
  aggressive: number
}

export function calcAffordability(
  annualIncome: number,
  monthlyDebts: number,       // existing debts (car, student loans, etc.)
  downPayment: number,
  annualRate: number,
  termYears: number,
  propertyTaxRate: number,    // annual % of home value
  homeInsurance: number,      // annual
  hoaMonthly: number,
  frontEndLimit: number = 28, // % of gross income for housing
  backEndLimit: number = 36,  // % of gross income for all debt
): AffordabilityResult {
  const monthlyIncome = annualIncome / 12
  const mr = annualRate / 100 / 12
  const n = termYears * 12

  // Max monthly housing payment based on front-end ratio
  const maxHousingFrontEnd = monthlyIncome * frontEndLimit / 100

  // Max monthly housing based on back-end ratio
  const maxHousingBackEnd = (monthlyIncome * backEndLimit / 100) - monthlyDebts

  // Use the more restrictive of the two
  const maxMonthlyHousing = Math.max(0, Math.min(maxHousingFrontEnd, maxHousingBackEnd))

  // Subtract fixed housing costs (tax, insurance, HOA)
  // We need to estimate: property tax depends on home price
  // Iteratively solve for home price
  let homePrice = downPayment + 300000 // initial guess

  for (let i = 0; i < 20; i++) {
    const loan = homePrice - downPayment
    const monthlyPTI = homePrice * propertyTaxRate / 100 / 12
    const monthlyIns = homeInsurance / 12
    const monthlyPMI = downPayment / homePrice < 0.20 ? loan * 0.01 / 12 : 0
    const fixedCosts = monthlyPTI + monthlyIns + monthlyPMI + hoaMonthly

    const availableForMortgage = maxMonthlyHousing - fixedCosts

    if (availableForMortgage <= 0) { homePrice = downPayment; break }

    const maxLoan = mr === 0
      ? availableForMortgage * n
      : availableForMortgage * (Math.pow(1 + mr, n) - 1) / (mr * Math.pow(1 + mr, n))

    const newHomePrice = maxLoan + downPayment
    if (Math.abs(newHomePrice - homePrice) < 10) { homePrice = newHomePrice; break }
    homePrice = newHomePrice
  }

  homePrice = Math.max(0, homePrice)
  const loanAmount = Math.max(0, homePrice - downPayment)
  const monthlyPI = mr === 0 ? loanAmount / n : loanAmount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
  const monthlyTax = homePrice * propertyTaxRate / 100 / 12
  const monthlyIns = homeInsurance / 12
  const monthlyPMI = downPayment / Math.max(homePrice, 1) < 0.20 ? loanAmount * 0.01 / 12 : 0
  const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyPMI + hoaMonthly

  // Conservative (25% front-end), moderate (28%), aggressive (36%)
  const calcPrice = (fe: number) => {
    let hp = downPayment + 300000
    for (let i = 0; i < 20; i++) {
      const maxH = Math.min(monthlyIncome * fe / 100, monthlyIncome * backEndLimit / 100 - monthlyDebts)
      const loan = hp - downPayment
      const fixed = hp * propertyTaxRate / 100 / 12 + homeInsurance / 12 + (downPayment / hp < 0.20 ? loan * 0.01 / 12 : 0) + hoaMonthly
      const avail = maxH - fixed
      if (avail <= 0) return downPayment
      const ml = mr === 0 ? avail * n : avail * (Math.pow(1 + mr, n) - 1) / (mr * Math.pow(1 + mr, n))
      const np = ml + downPayment
      if (Math.abs(np - hp) < 10) { hp = np; break }
      hp = np
    }
    return Math.max(0, hp)
  }

  return {
    maxHomePrice: Math.round(homePrice),
    maxLoanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(totalMonthly),
    downPayment: Math.round(downPayment),
    frontEndRatio: Math.round(totalMonthly / monthlyIncome * 100 * 10) / 10,
    backEndRatio: Math.round((totalMonthly + monthlyDebts) / monthlyIncome * 100 * 10) / 10,
    monthlyIncome: Math.round(monthlyIncome),
    totalMonthlyDebt: Math.round(monthlyDebts),
    breakdown: {
      principal: Math.round(monthlyPI * 100) / 100,
      interest: 0,
      propertyTax: Math.round(monthlyTax * 100) / 100,
      insurance: Math.round(monthlyIns * 100) / 100,
      pmi: Math.round(monthlyPMI * 100) / 100,
      hoa: hoaMonthly,
      total: Math.round(totalMonthly * 100) / 100,
    },
    conservative: Math.round(calcPrice(25)),
    moderate: Math.round(calcPrice(28)),
    aggressive: Math.round(calcPrice(36)),
  }
}