export type CommissionType = 'flat' | 'tiered' | 'graduated' | 'draw'

export interface Tier {
  from: number
  to: number | null
  rate: number
}

export interface CommissionResult {
  grossCommission: number
  netCommission: number
  totalSales: number
  effectiveRate: number
  breakdown: { label: string; sales: number; rate: number; commission: number }[]
}

// Flat rate
export function calcFlat(sales: number, rate: number, base: number = 0): CommissionResult {
  const commission = sales * (rate / 100)
  const net = commission + base
  return {
    grossCommission: Math.round(commission * 100) / 100,
    netCommission: Math.round(net * 100) / 100,
    totalSales: sales,
    effectiveRate: sales > 0 ? Math.round((commission / sales) * 10000) / 100 : 0,
    breakdown: [{ label: `${rate}% on all sales`, sales, rate, commission }],
  }
}

// Tiered (different rate per tier, applied only to that tier's range)
export function calcTiered(sales: number, tiers: Tier[]): CommissionResult {
  let remaining = sales
  let total = 0
  const breakdown = []

  for (const tier of tiers) {
    if (remaining <= 0) break
    const tierMax = tier.to !== null ? tier.to - tier.from : Infinity
    const tierSales = Math.min(remaining, tierMax)
    const tierCommission = tierSales * (tier.rate / 100)
    total += tierCommission
    breakdown.push({
      label: tier.to !== null
        ? `${tier.rate}% on ${tier.from.toLocaleString()}–${tier.to.toLocaleString()}`
        : `${tier.rate}% on ${tier.from.toLocaleString()}+`,
      sales: tierSales,
      rate: tier.rate,
      commission: tierCommission,
    })
    remaining -= tierSales
  }

  return {
    grossCommission: Math.round(total * 100) / 100,
    netCommission: Math.round(total * 100) / 100,
    totalSales: sales,
    effectiveRate: sales > 0 ? Math.round((total / sales) * 10000) / 100 : 0,
    breakdown,
  }
}

// Graduated (hitting a tier applies that rate to ALL sales)
export function calcGraduated(sales: number, tiers: Tier[]): CommissionResult {
  let appliedRate = tiers[0].rate
  for (const tier of tiers) {
    if (sales >= tier.from) appliedRate = tier.rate
  }
  const commission = sales * (appliedRate / 100)
  return {
    grossCommission: Math.round(commission * 100) / 100,
    netCommission: Math.round(commission * 100) / 100,
    totalSales: sales,
    effectiveRate: appliedRate,
    breakdown: [{ label: `${appliedRate}% on total sales (graduated rate)`, sales, rate: appliedRate, commission }],
  }
}

// Draw against commission
export function calcDraw(sales: number, rate: number, drawAmount: number): CommissionResult {
  const commission = sales * (rate / 100)
  const net = Math.max(commission - drawAmount, 0)
  const owedBack = commission < drawAmount ? drawAmount - commission : 0
  return {
    grossCommission: Math.round(commission * 100) / 100,
    netCommission: Math.round(net * 100) / 100,
    totalSales: sales,
    effectiveRate: sales > 0 ? Math.round((commission / sales) * 10000) / 100 : 0,
    breakdown: [
      { label: `${rate}% commission`, sales, rate, commission },
      { label: 'Draw deducted', sales: 0, rate: 0, commission: -Math.min(drawAmount, commission) },
    ],
  }
}

export const DEFAULT_TIERS: Tier[] = [
  { from: 0, to: 10000, rate: 5 },
  { from: 10000, to: 25000, rate: 8 },
  { from: 25000, to: null, rate: 12 },
]