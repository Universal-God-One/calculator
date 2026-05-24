import { TaxBracket, FilingRates, CountryData, US_2024, COUNTRIES } from './taxRates'

export type FilingStatus = 'single' | 'married_jointly' | 'married_separately' | 'head_of_household'

export interface TaxResult {
  grossIncome: number; standardDeduction: number; taxableIncome: number
  federalTax: number; stateTax: number; socialSecurity: number; medicare: number
  totalTax: number; effectiveRate: number; marginalRate: number
  takeHome: number; monthly: number; weekly: number
  brackets: { rate: number; amount: number; tax: number; min: number; max: number }[]
}

function getBrackets(data: CountryData, status: FilingStatus): TaxBracket[] {
  const b = data.brackets
  if (Array.isArray(b)) return b
  return (b as FilingRates)[status] ?? (b as FilingRates).single
}

export function calcTax(
  gross: number, status: FilingStatus, data: CountryData, state?: string
): TaxResult {
  const deductMap = data.standardDeduction
  const deduction = deductMap ? (deductMap[status] ?? deductMap['single'] ?? 0) : 0
  const taxable = Math.max(0, gross - deduction)

  const brackets = getBrackets(data, status)
  let federal = 0, marginal = 0
  const breakdown = []
  for (const b of brackets) {
    if (taxable <= b.min) break
    const amt = Math.min(taxable, b.max) - b.min
    const tax = amt * b.rate
    federal += tax; marginal = b.rate
    breakdown.push({ rate: b.rate, amount: amt, tax, min: b.min, max: b.max })
  }

  let ss = 0, med = 0
  if (data === US_2024) {
    ss = Math.min(gross, data.socialSecurity!.cap) * data.socialSecurity!.rate
    med = gross * data.medicare!.rate
    if (gross > data.medicare!.extraThreshold)
      med += (gross - data.medicare!.extraThreshold) * data.medicare!.extraRate
  }

  const stateTax = (state && data.stateRates) ? taxable * (data.stateRates[state] ?? 0) : 0
  const total = federal + stateTax + ss + med
  const takeHome = gross - total

  return {
    grossIncome: gross, standardDeduction: deduction, taxableIncome: taxable,
    federalTax: federal, stateTax, socialSecurity: ss, medicare: med,
    totalTax: total, effectiveRate: gross > 0 ? total / gross : 0,
    marginalRate: marginal, takeHome,
    monthly: takeHome / 12, weekly: takeHome / 52,
    brackets: breakdown,
  }
}

export const fmt = (n: number, sym = '$') =>
  `${sym}${Math.round(n).toLocaleString('en-US')}`

export const pct = (n: number) => `${(n * 100).toFixed(1)}%`