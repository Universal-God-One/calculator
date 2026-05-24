export interface VAResult {
  monthlyPayment: number
  monthlyPI: number
  monthlyPropertyTax: number
  monthlyInsurance: number
  fundingFee: number
  fundingFeePct: number
  loanAmount: number
  totalLoanWithFee: number
  downPayment: number
  totalPayment: number
  totalInterest: number
  schedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export type ServiceType = 'active_first' | 'active_subsequent' | 'reserves_first' | 'reserves_subsequent' | 'exempt'

export const SERVICE_LABELS: Record<ServiceType, string> = {
  active_first: 'Active Duty / Veteran — First Use',
  active_subsequent: 'Active Duty / Veteran — Subsequent Use',
  reserves_first: 'Reserves / National Guard — First Use',
  reserves_subsequent: 'Reserves / National Guard — Subsequent Use',
  exempt: 'Exempt (Disability / Purple Heart)',
}

// 2024 VA Funding Fee rates
function getFundingFeePct(
  serviceType: ServiceType,
  downPaymentPct: number
): number {
  if (serviceType === 'exempt') return 0

  if (serviceType === 'active_first' || serviceType === 'active_subsequent') {
    if (serviceType === 'active_first') {
      if (downPaymentPct >= 10) return 0.0125
      if (downPaymentPct >= 5) return 0.015
      return 0.0215
    } else {
      if (downPaymentPct >= 10) return 0.0125
      if (downPaymentPct >= 5) return 0.015
      return 0.033
    }
  }

  // Reserves / National Guard
  if (serviceType === 'reserves_first') {
    if (downPaymentPct >= 10) return 0.0125
    if (downPaymentPct >= 5) return 0.015
    return 0.023
  } else {
    if (downPaymentPct >= 10) return 0.0125
    if (downPaymentPct >= 5) return 0.015
    return 0.036
  }
}

export function calcVA(
  homePrice: number,
  downPaymentPct: number,
  annualRate: number,
  termYears: number,
  serviceType: ServiceType,
  propertyTaxRate: number,
  homeInsuranceAnnual: number,
): VAResult {
  const downPayment = homePrice * (downPaymentPct / 100)
  const baseLoan = homePrice - downPayment

  const fundingFeePct = getFundingFeePct(serviceType, downPaymentPct)
  const fundingFee = baseLoan * fundingFeePct
  const totalLoan = baseLoan + fundingFee

  const mr = annualRate / 100 / 12
  const n = termYears * 12

  const monthlyPI = mr === 0
    ? totalLoan / n
    : totalLoan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)

  const monthlyPropertyTax = homePrice * propertyTaxRate / 100 / 12
  const monthlyInsurance = homeInsuranceAnnual / 12
  const monthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance

  let balance = totalLoan
  let totalInterest = 0
  const schedule = []

  for (let m = 1; m <= n; m++) {
    const interest = balance * mr
    const principalPaid = Math.min(balance, monthlyPI - interest)
    balance = Math.max(0, balance - principalPaid)
    totalInterest += interest
    schedule.push({
      month: m,
      payment: Math.round(monthlyPI * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
    if (balance <= 0) break
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    monthlyPI: Math.round(monthlyPI * 100) / 100,
    monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    monthlyInsurance: Math.round(monthlyInsurance * 100) / 100,
    fundingFee: Math.round(fundingFee * 100) / 100,
    fundingFeePct: fundingFeePct * 100,
    loanAmount: Math.round(baseLoan * 100) / 100,
    totalLoanWithFee: Math.round(totalLoan * 100) / 100,
    downPayment: Math.round(downPayment * 100) / 100,
    totalPayment: Math.round(monthlyPI * schedule.length * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule,
  }
}

// 2024 VA loan limit (no limit for full entitlement)
export const VA_LOAN_LIMIT_2024 = 766550