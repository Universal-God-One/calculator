export interface RentVsBuyResult {
  buyingCost: number
  rentingCost: number
  buyingWins: boolean
  breakEvenYear: number | null
  netWorthBuying: number
  netWorthRenting: number
  schedule: {
    year: number
    buyNetWorth: number
    rentNetWorth: number
    buyTotalCost: number
    rentTotalCost: number
    homeValue: number
    remainingLoan: number
    equity: number
  }[]
}

export function calcRentVsBuy(
  // Buying inputs
  homePrice: number,
  downPaymentPct: number,
  mortgageRate: number,
  mortgageTerm: number,
  propertyTaxRate: number,      // annual % of home value
  homeInsurance: number,        // annual
  maintenancePct: number,       // annual % of home value
  hoaMonthly: number,
  homeAppreciation: number,     // annual %
  // Renting inputs
  monthlyRent: number,
  rentIncrease: number,         // annual %
  rentersInsurance: number,     // annual
  // Common
  years: number,
  investmentReturn: number,     // annual % — what renter invests the difference
  marginalTaxRate: number,      // for mortgage interest deduction
): RentVsBuyResult {
  const downPayment = homePrice * downPaymentPct / 100
  const loanAmount = homePrice - downPayment
  const mr = mortgageRate / 100 / 12
  const n = mortgageTerm * 12

  // Monthly mortgage payment
  const monthlyMortgage = mr === 0
    ? loanAmount / n
    : loanAmount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)

  let homeValue = homePrice
  let loanBalance = loanAmount
  let rentNetWorth = 0  // renter's investment portfolio
  let buyNetWorth = -downPayment  // buyer starts negative (down payment)

  // Renter invests down payment
  let renterInvestment = downPayment
  let currentRent = monthlyRent

  let buyTotalCost = downPayment
  let rentTotalCost = 0

  let breakEvenYear: number | null = null
  const schedule = []

  for (let y = 1; y <= years; y++) {
    // --- BUYING ---
    let yearBuyingCost = 0
    for (let m = 0; m < 12; m++) {
      const interest = loanBalance * mr
      const principalPaid = Math.min(loanBalance, monthlyMortgage - interest)
      loanBalance = Math.max(0, loanBalance - principalPaid)
      yearBuyingCost += monthlyMortgage
    }

    // Annual ownership costs
    const annualPropertyTax = homeValue * propertyTaxRate / 100
    const annualMaintenance = homeValue * maintenancePct / 100
    const annualHOA = hoaMonthly * 12

    // Mortgage interest deduction (simplified)
    const annualInterest = yearBuyingCost - (homePrice * downPaymentPct / 100 > 0 ? 0 : 0) // simplified
    const taxSaving = annualInterest * marginalTaxRate / 100

    yearBuyingCost += annualPropertyTax + annualMaintenance + homeInsurance + annualHOA - taxSaving
    buyTotalCost += yearBuyingCost

    // Home value appreciates
    homeValue *= (1 + homeAppreciation / 100)
    const equity = homeValue - loanBalance
    buyNetWorth = equity - buyTotalCost + homeValue - homePrice

    // --- RENTING ---
    const annualRent = currentRent * 12 + rentersInsurance
    rentTotalCost += annualRent

    // Renter invests down payment + monthly difference
    const monthlyDiff = monthlyMortgage + (annualPropertyTax + annualMaintenance + homeInsurance + annualHOA) / 12 - currentRent - rentersInsurance / 12
    const monthlyInvestment = Math.max(0, monthlyDiff)
    renterInvestment = renterInvestment * (1 + investmentReturn / 100) + monthlyInvestment * 12
    rentNetWorth = renterInvestment - rentTotalCost

    // Rent increases
    currentRent *= (1 + rentIncrease / 100)

    // Check break-even
    if (breakEvenYear === null && equity > rentTotalCost) {
      breakEvenYear = y
    }

    schedule.push({
      year: y,
      buyNetWorth: Math.round(equity),
      rentNetWorth: Math.round(renterInvestment),
      buyTotalCost: Math.round(buyTotalCost),
      rentTotalCost: Math.round(rentTotalCost),
      homeValue: Math.round(homeValue),
      remainingLoan: Math.round(loanBalance),
      equity: Math.round(equity),
    })
  }

  const finalBuy = schedule[schedule.length - 1]
  const buyingWins = finalBuy.equity > finalBuy.rentNetWorth

  return {
    buyingCost: Math.round(buyTotalCost),
    rentingCost: Math.round(rentTotalCost),
    buyingWins,
    breakEvenYear,
    netWorthBuying: Math.round(finalBuy.equity),
    netWorthRenting: Math.round(finalBuy.rentNetWorth),
    schedule,
  }
}