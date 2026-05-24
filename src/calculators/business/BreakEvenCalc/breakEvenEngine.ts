export interface BreakEvenResult {
  breakEvenUnits: number
  breakEvenRevenue: number
  contributionMargin: number
  contributionMarginRatio: number
  marginOfSafety: number
  marginOfSafetyPct: number
  degreeOfOperatingLeverage: number | null
  schedule: {
    units: number
    revenue: number
    variableCosts: number
    fixedCosts: number
    totalCosts: number
    profit: number
  }[]
}

export function calcBreakEven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number,
  currentUnits?: number,
): BreakEvenResult {
  if (pricePerUnit <= variableCostPerUnit) throw new Error('Price must be greater than variable cost per unit')
  if (fixedCosts < 0) throw new Error('Fixed costs cannot be negative')

  const contributionMargin = pricePerUnit - variableCostPerUnit
  const contributionMarginRatio = contributionMargin / pricePerUnit
  const breakEvenUnits = fixedCosts / contributionMargin
  const breakEvenRevenue = breakEvenUnits * pricePerUnit

  // Margin of safety (only if current units provided and > break-even)
  const safetyUnits = currentUnits && currentUnits > breakEvenUnits
    ? currentUnits - breakEvenUnits : 0
  const marginOfSafety = safetyUnits * pricePerUnit
  const marginOfSafetyPct = currentUnits && currentUnits > 0
    ? (safetyUnits / currentUnits) * 100 : 0

  // Degree of Operating Leverage = Contribution Margin / Operating Income
  let degreeOfOperatingLeverage: number | null = null
  if (currentUnits && currentUnits > breakEvenUnits) {
    const operatingIncome = currentUnits * contributionMargin - fixedCosts
    const totalContribution = currentUnits * contributionMargin
    degreeOfOperatingLeverage = operatingIncome > 0 ? totalContribution / operatingIncome : null
  }

  // Build schedule from 0 to 2x break-even (or 2x current units)
  const maxUnits = Math.ceil(Math.max(breakEvenUnits * 2, (currentUnits ?? 0) * 1.5, 100))
  const steps = 10
  const stepSize = Math.ceil(maxUnits / steps)
  const schedule = []

  for (let i = 0; i <= steps; i++) {
    const units = i * stepSize
    const revenue = units * pricePerUnit
    const variableCosts = units * variableCostPerUnit
    const totalCosts = fixedCosts + variableCosts
    const profit = revenue - totalCosts
    schedule.push({ units, revenue, variableCosts, fixedCosts, totalCosts, profit })
  }

  return {
    breakEvenUnits: Math.ceil(breakEvenUnits * 100) / 100,
    breakEvenRevenue: Math.round(breakEvenRevenue * 100) / 100,
    contributionMargin: Math.round(contributionMargin * 100) / 100,
    contributionMarginRatio: Math.round(contributionMarginRatio * 10000) / 100,
    marginOfSafety: Math.round(marginOfSafety * 100) / 100,
    marginOfSafetyPct: Math.round(marginOfSafetyPct * 100) / 100,
    degreeOfOperatingLeverage: degreeOfOperatingLeverage !== null
      ? Math.round(degreeOfOperatingLeverage * 100) / 100 : null,
    schedule,
  }
}