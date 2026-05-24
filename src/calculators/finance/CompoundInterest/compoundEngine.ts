export type Frequency = 'daily' | 'monthly' | 'quarterly' | 'annually'
export const FREQ_N: Record<Frequency, number> = { daily: 365, monthly: 12, quarterly: 4, annually: 1 }
export const FREQ_LABELS: Frequency[] = ['daily', 'monthly', 'quarterly', 'annually']
export const FREQ_DISPLAY: Record<Frequency, string> = {
  daily: 'Daily (365×/year)',
  monthly: 'Monthly (12×/year)',
  quarterly: 'Quarterly (4×/year)',
  annually: 'Annually (1×/year)',
}

export interface YearRow {
  year: number
  balance: number
  yearInterest: number
  totalInterest: number
  totalContributions: number
}

export interface CompoundResult {
  finalBalance: number
  totalContributions: number
  totalInterest: number
  schedule: YearRow[]
}

export function calcCompound(
  principal: number,
  annualRate: number,
  years: number,
  freq: Frequency,
  monthlyContribution: number = 0
): CompoundResult {
  const n = FREQ_N[freq]
  const rPerPeriod = annualRate / 100 / n
  const contribPerPeriod = monthlyContribution * 12 / n
  let balance = principal
  let totalInterest = 0
  let totalContributions = principal
  const schedule: YearRow[] = []
  for (let y = 1; y <= years; y++) {
    let yearInterest = 0
    for (let p = 0; p < n; p++) {
      const interest = balance * rPerPeriod
      balance += interest + contribPerPeriod
      yearInterest += interest
    }
    totalInterest += yearInterest
    totalContributions += monthlyContribution * 12
    schedule.push({ year: y, balance: Math.round(balance), yearInterest: Math.round(yearInterest), totalInterest: Math.round(totalInterest), totalContributions: Math.round(totalContributions) })
  }
  return { finalBalance: Math.round(balance), totalContributions: Math.round(totalContributions), totalInterest: Math.round(totalInterest), schedule }
}