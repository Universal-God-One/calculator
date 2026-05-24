export interface LTVCACResult {
  ltv: number
  cac: number
  ltvCacRatio: number
  paybackPeriodMonths: number
  paybackPeriodYears: number
  grossMarginPct: number
  avgRevenuePerUser: number
  churnRate: number
  customerLifetimeMonths: number
  rating: 'excellent' | 'good' | 'fair' | 'poor'
  ratingLabel: string
  ratingColor: string
  ratingDesc: string
  breakEvenMonths: number
  // For chart
  cumulativeRevenue: { month: number; revenue: number; cac: number }[]
}

export function calcLTVCAC(
  avgMonthlyRevenue: number,
  grossMarginPct: number,
  monthlyChurnPct: number,
  cac: number,
  salesCycleMonths: number = 0,
): LTVCACResult {
  const churnRate = monthlyChurnPct / 100
  const customerLifetimeMonths = churnRate > 0 ? 1 / churnRate : 120
  const grossMargin = grossMarginPct / 100

  // LTV = (Avg Monthly Revenue × Gross Margin) / Monthly Churn Rate
  const ltv = churnRate > 0
    ? (avgMonthlyRevenue * grossMargin) / churnRate
    : avgMonthlyRevenue * grossMargin * 120

  const ltvCacRatio = cac > 0 ? ltv / cac : 0

  // Payback = CAC / (Monthly Revenue × Gross Margin)
  const monthlyContribution = avgMonthlyRevenue * grossMargin
  const paybackPeriodMonths = monthlyContribution > 0
    ? cac / monthlyContribution
    : Infinity

  // Break-even includes sales cycle
  const breakEvenMonths = paybackPeriodMonths + salesCycleMonths

  let rating: LTVCACResult['rating']
  let ratingLabel: string
  let ratingColor: string
  let ratingDesc: string

  if (ltvCacRatio >= 5) {
    rating = 'excellent'; ratingLabel = 'Excellent'
    ratingColor = 'var(--accent-green)'
    ratingDesc = 'World-class unit economics. You may be underinvesting in growth.'
  } else if (ltvCacRatio >= 3) {
    rating = 'good'; ratingLabel = 'Good'
    ratingColor = '#22c55e'
    ratingDesc = 'Healthy ratio. SaaS benchmark — sustainable growth is possible.'
  } else if (ltvCacRatio >= 1) {
    rating = 'fair'; ratingLabel = 'Fair'
    ratingColor = 'var(--accent-amber)'
    ratingDesc = 'Marginal. You\'re recovering CAC but growth may be difficult to sustain.'
  } else {
    rating = 'poor'; ratingLabel = 'Poor'
    ratingColor = 'var(--accent-red)'
    ratingDesc = 'Unsustainable. You spend more to acquire a customer than they\'re worth.'
  }

  // Cumulative revenue curve (up to lifetime or 60 months)
  const months = Math.min(Math.ceil(customerLifetimeMonths), 60)
  const cumulativeRevenue = Array.from({ length: months + 1 }, (_, m) => ({
    month: m,
    revenue: Math.round(m * monthlyContribution * 100) / 100,
    cac: cac,
  }))

  return {
    ltv: Math.round(ltv * 100) / 100,
    cac,
    ltvCacRatio: Math.round(ltvCacRatio * 100) / 100,
    paybackPeriodMonths: Math.round(paybackPeriodMonths * 10) / 10,
    paybackPeriodYears: Math.round(paybackPeriodMonths / 12 * 10) / 10,
    grossMarginPct,
    avgRevenuePerUser: avgMonthlyRevenue,
    churnRate: monthlyChurnPct,
    customerLifetimeMonths: Math.round(customerLifetimeMonths * 10) / 10,
    rating,
    ratingLabel,
    ratingColor,
    ratingDesc,
    breakEvenMonths: Math.round(breakEvenMonths * 10) / 10,
    cumulativeRevenue,
  }
}

export const INDUSTRY_BENCHMARKS = [
  { industry: 'SaaS / Software', ltv_cac: '3–5x', payback: '12–18 mo', churn: '1–2%/mo' },
  { industry: 'E-commerce', ltv_cac: '3–4x', payback: '6–12 mo', churn: '5–8%/mo' },
  { industry: 'Subscription Box', ltv_cac: '2–4x', payback: '3–6 mo', churn: '7–10%/mo' },
  { industry: 'Financial Services', ltv_cac: '5–10x', payback: '18–24 mo', churn: '1–3%/mo' },
  { industry: 'Mobile App (paid)', ltv_cac: '2–3x', payback: '3–9 mo', churn: '5–10%/mo' },
  { industry: 'Enterprise SaaS', ltv_cac: '5–8x', payback: '18–36 mo', churn: '0.5–1%/mo' },
]