export interface MarginResult {
  cost: number
  revenue: number
  profit: number
  margin: number       // gross profit margin %
  markup: number       // markup %
  marginDecimal: number
  markupDecimal: number
}

export function calcFromCostAndRevenue(cost: number, revenue: number): MarginResult {
  const profit = revenue - cost
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0
  const markup = cost > 0 ? (profit / cost) * 100 : 0
  return { cost, revenue, profit, margin, markup, marginDecimal: margin / 100, markupDecimal: markup / 100 }
}

export function calcFromCostAndMargin(cost: number, margin: number): MarginResult {
  // margin = profit/revenue → revenue = cost/(1 - margin%)
  const m = margin / 100
  if (m >= 1) throw new Error('Margin must be less than 100%')
  const revenue = cost / (1 - m)
  return calcFromCostAndRevenue(cost, revenue)
}

export function calcFromCostAndMarkup(cost: number, markup: number): MarginResult {
  const revenue = cost * (1 + markup / 100)
  return calcFromCostAndRevenue(cost, revenue)
}

export function calcFromRevenueAndMargin(revenue: number, margin: number): MarginResult {
  const profit = revenue * (margin / 100)
  const cost = revenue - profit
  return calcFromCostAndRevenue(cost, revenue)
}

// Margin ↔ Markup conversions
export function marginToMarkup(margin: number): number {
  const m = margin / 100
  if (m >= 1) return Infinity
  return (m / (1 - m)) * 100
}

export function markupToMargin(markup: number): number {
  const mk = markup / 100
  return (mk / (1 + mk)) * 100
}