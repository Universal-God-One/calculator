export interface CDResult {
  finalBalance: number
  totalInterest: number
  apy: number
  schedule: { period: number; label: string; interest: number; balance: number }[]
}

export type CompoundFreq = 'daily' | 'monthly' | 'quarterly' | 'annually'
export const FREQ_N: Record<CompoundFreq, number> = { daily: 365, monthly: 12, quarterly: 4, annually: 1 }
export const FREQ_LABELS: CompoundFreq[] = ['daily', 'monthly', 'quarterly', 'annually']
export const FREQ_DISPLAY: Record<CompoundFreq, string> = {
  daily: 'Daily', monthly: 'Monthly', quarterly: 'Quarterly', annually: 'Annually',
}

export function calcCD(
  principal: number,
  annualRate: number,
  months: number,
  freq: CompoundFreq
): CDResult {
  const n = FREQ_N[freq]
  const r = annualRate / 100 / n
  const t = months / 12
  const periods = Math.floor(n * t)

  // APY = (1 + r/n)^n - 1
  const apy = (Math.pow(1 + annualRate / 100 / n, n) - 1) * 100

  let balance = principal
  const schedule = []

  for (let p = 1; p <= periods; p++) {
    const interest = balance * r
    balance += interest

    // Only record monthly snapshots
    if (freq === 'daily' && p % 30 !== 0 && p !== periods) continue
    if (freq === 'quarterly' && p % 1 !== 0) continue

    const monthNum = freq === 'daily' ? Math.round(p / 30) :
                     freq === 'monthly' ? p :
                     freq === 'quarterly' ? p * 3 :
                     p * 12

    schedule.push({
      period: monthNum,
      label: monthNum === 1 ? 'Month 1' : monthNum < 12 ? `Month ${monthNum}` : `Year ${Math.floor(monthNum / 12)}`,
      interest: Math.round((balance - principal) * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
  }

  const totalInterest = balance - principal

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    apy: Math.round(apy * 1000) / 1000,
    schedule,
  }
}

export const CD_TERMS = [
  { label: '3 Months', months: 3 },
  { label: '6 Months', months: 6 },
  { label: '1 Year', months: 12 },
  { label: '18 Months', months: 18 },
  { label: '2 Years', months: 24 },
  { label: '3 Years', months: 36 },
  { label: '4 Years', months: 48 },
  { label: '5 Years', months: 60 },
]