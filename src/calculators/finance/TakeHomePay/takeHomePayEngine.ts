export interface TakeHomePayResult {
  grossAnnual: number
  grossMonthly: number
  grossBiweekly: number
  grossWeekly: number

  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  totalTax: number

  netAnnual: number
  netMonthly: number
  netBiweekly: number
  netWeekly: number
  netDaily: number
  netHourly: number

  effectiveRate: number
  marginalRate: number
}

export type FilingStatus = 'single' | 'married_jointly' | 'married_separately' | 'head_of_household'
export type PayFrequency = 'annually' | 'monthly' | 'biweekly' | 'weekly' | 'hourly'

// 2024 US Federal Brackets
const BRACKETS: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married_jointly: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  married_separately: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 365600, rate: 0.35 },
    { min: 365600, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
}

const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 14600,
  married_jointly: 29200,
  married_separately: 14600,
  head_of_household: 21900,
}

const STATE_RATES: Record<string, number> = {
  'No State Tax': 0, 'Alabama': 0.05, 'Arizona': 0.025, 'Arkansas': 0.044,
  'California': 0.133, 'Colorado': 0.044, 'Connecticut': 0.0699, 'Delaware': 0.066,
  'Georgia': 0.055, 'Hawaii': 0.11, 'Idaho': 0.058, 'Illinois': 0.0495,
  'Indiana': 0.0315, 'Iowa': 0.057, 'Kansas': 0.057, 'Kentucky': 0.045,
  'Louisiana': 0.0425, 'Maine': 0.0715, 'Maryland': 0.0575, 'Massachusetts': 0.05,
  'Michigan': 0.0425, 'Minnesota': 0.0985, 'Mississippi': 0.047, 'Missouri': 0.048,
  'Montana': 0.059, 'Nebraska': 0.0664, 'New Jersey': 0.1075, 'New Mexico': 0.059,
  'New York': 0.109, 'North Carolina': 0.045, 'North Dakota': 0.025, 'Ohio': 0.035,
  'Oklahoma': 0.0475, 'Oregon': 0.099, 'Pennsylvania': 0.0307, 'Rhode Island': 0.0599,
  'South Carolina': 0.065, 'Utah': 0.0465, 'Vermont': 0.0875, 'Virginia': 0.0575,
  'West Virginia': 0.065, 'Wisconsin': 0.0765,
}

export const STATE_LIST = Object.keys(STATE_RATES)

export function convertToAnnual(amount: number, freq: PayFrequency): number {
  switch (freq) {
    case 'annually':  return amount
    case 'monthly':   return amount * 12
    case 'biweekly':  return amount * 26
    case 'weekly':    return amount * 52
    case 'hourly':    return amount * 40 * 52
  }
}

export function calcTakeHomePay(
  grossAnnual: number,
  filingStatus: FilingStatus,
  state: string,
  deductions401k: number = 0,
  deductionsHealth: number = 0
): TakeHomePayResult {
  const preTaxDeductions = deductions401k + deductionsHealth
  const adjustedGross = Math.max(0, grossAnnual - preTaxDeductions)
  const stdDeduction = STANDARD_DEDUCTION[filingStatus]
  const taxableIncome = Math.max(0, adjustedGross - stdDeduction)

  // Federal tax
  let federalTax = 0
  let marginalRate = 0
  for (const b of BRACKETS[filingStatus]) {
    if (taxableIncome <= b.min) break
    federalTax += (Math.min(taxableIncome, b.max) - b.min) * b.rate
    marginalRate = b.rate
  }

  // FICA
  const socialSecurity = Math.min(grossAnnual, 168600) * 0.062
  const medicare = grossAnnual * 0.0145 + (grossAnnual > 200000 ? (grossAnnual - 200000) * 0.009 : 0)

  // State
  const stateRate = STATE_RATES[state] ?? 0
  const stateTax = taxableIncome * stateRate

  const totalTax = federalTax + stateTax + socialSecurity + medicare
  const netAnnual = grossAnnual - totalTax

  return {
    grossAnnual,
    grossMonthly: grossAnnual / 12,
    grossBiweekly: grossAnnual / 26,
    grossWeekly: grossAnnual / 52,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    totalTax,
    netAnnual,
    netMonthly: netAnnual / 12,
    netBiweekly: netAnnual / 26,
    netWeekly: netAnnual / 52,
    netDaily: netAnnual / 260,
    netHourly: netAnnual / (40 * 52),
    effectiveRate: totalTax / grossAnnual,
    marginalRate,
  }
}