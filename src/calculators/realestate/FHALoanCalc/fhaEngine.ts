export interface FHAResult {
  monthlyPayment: number
  monthlyPI: number
  monthlyMIP: number
  monthlyPropertyTax: number
  monthlyInsurance: number
  upfrontMIP: number
  loanAmount: number
  totalLoanWithMIP: number
  downPayment: number
  downPaymentPct: number
  totalPayment: number
  totalInterest: number
  totalMIPPaid: number
  mipRemovedMonth: number | null
  schedule: {
    month: number
    payment: number
    principal: number
    interest: number
    mip: number
    balance: number
  }[]
}

// 2024 FHA MIP rates
function getAnnualMIPRate(loanAmount: number, ltv: number, termYears: number): number {
  if (termYears <= 15) {
    if (loanAmount <= 150000) return ltv <= 90 ? 0.0015 : 0.0040
    return ltv <= 90 ? 0.0040 : 0.0065
  }
  // > 15 years
  if (loanAmount <= 726200) {
    if (ltv <= 90) return 0.0050
    if (ltv <= 95) return 0.0050
    return 0.0055
  }
  // Jumbo FHA
  if (ltv <= 90) return 0.0070
  if (ltv <= 95) return 0.0075
  return 0.0075
}

export function calcFHA(
  homePrice: number,
  downPaymentPct: number,
  annualRate: number,
  termYears: number,
  propertyTaxRate: number,
  homeInsuranceAnnual: number,
): FHAResult {
  const downPayment = homePrice * (downPaymentPct / 100)
  const baseLoan = homePrice - downPayment
  const ltv = (baseLoan / homePrice) * 100

  // Upfront MIP: 1.75% of base loan
  const upfrontMIP = baseLoan * 0.0175
  const totalLoanWithMIP = baseLoan + upfrontMIP

  const mr = annualRate / 100 / 12
  const n = termYears * 12

  // Monthly P&I on total loan (including upfront MIP financed)
  const monthlyPI = mr === 0
    ? totalLoanWithMIP / n
    : totalLoanWithMIP * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)

  // Annual MIP rate
  const annualMIPRate = getAnnualMIPRate(baseLoan, ltv, termYears)

  // Monthly costs
  const monthlyPropertyTax = homePrice * propertyTaxRate / 100 / 12
  const monthlyInsurance = homeInsuranceAnnual / 12

  let balance = totalLoanWithMIP
  let totalInterest = 0
  let totalMIPPaid = 0
  let mipRemovedMonth: number | null = null
  const schedule = []

  for (let m = 1; m <= n; m++) {
    const interest = balance * mr
    const principalPaid = Math.min(balance, monthlyPI - interest)
    balance = Math.max(0, balance - principalPaid)

    // MIP: removed when LTV drops below 80% AND at least 11 years paid (if original LTV > 90%)
    const currentLTV = (balance / homePrice) * 100
    let monthlyMIP = 0
    if (mipRemovedMonth === null) {
      if (downPaymentPct >= 10 && m >= 132 && currentLTV <= 78) {
        mipRemovedMonth = m
      } else if (downPaymentPct < 10) {
        // MIP for life of loan if original down payment < 10%
        monthlyMIP = balance * annualMIPRate / 12
      } else if (mipRemovedMonth === null) {
        monthlyMIP = balance * annualMIPRate / 12
      }
    }

    totalInterest += interest
    totalMIPPaid += monthlyMIP

    schedule.push({
      month: m,
      payment: Math.round((monthlyPI + monthlyMIP) * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      mip: Math.round(monthlyMIP * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })

    if (balance <= 0) break
  }

  const avgMIP = totalLoanWithMIP * annualMIPRate / 12
  const monthlyMIPFirst = mipRemovedMonth === null ? avgMIP : avgMIP

  const monthlyPayment = monthlyPI + monthlyMIPFirst + monthlyPropertyTax + monthlyInsurance

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    monthlyPI: Math.round(monthlyPI * 100) / 100,
    monthlyMIP: Math.round(monthlyMIPFirst * 100) / 100,
    monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    monthlyInsurance: Math.round(monthlyInsurance * 100) / 100,
    upfrontMIP: Math.round(upfrontMIP * 100) / 100,
    loanAmount: Math.round(baseLoan * 100) / 100,
    totalLoanWithMIP: Math.round(totalLoanWithMIP * 100) / 100,
    downPayment: Math.round(downPayment * 100) / 100,
    downPaymentPct,
    totalPayment: Math.round((monthlyPI * n) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalMIPPaid: Math.round(totalMIPPaid * 100) / 100,
    mipRemovedMonth,
    schedule,
  }
}

// FHA 2024 loan limits by area type
export const FHA_LIMITS_2024 = {
  'Low-Cost Area': 498257,
  'High-Cost Area': 1149825,
  'Alaska / Hawaii': 1724738,
}