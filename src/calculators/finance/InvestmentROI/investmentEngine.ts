export interface ROIResult {
  totalReturn: number
  totalReturnPct: number
  annualizedReturn: number  // CAGR
  totalValue: number
  profit: number
  schedule: { year: number; value: number; gain: number; totalGain: number }[]
}

export function calcROI(
  initialInvestment: number,
  finalValue: number,
  years: number
): ROIResult {
  const profit = finalValue - initialInvestment
  const totalReturnPct = (profit / initialInvestment) * 100
  // CAGR = (FV/PV)^(1/n) - 1
  const annualizedReturn = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100

  const schedule = []
  for (let y = 1; y <= years; y++) {
    const value = initialInvestment * Math.pow(1 + annualizedReturn / 100, y)
    const gain = value - initialInvestment * Math.pow(1 + annualizedReturn / 100, y - 1)
    schedule.push({
      year: y,
      value: Math.round(value),
      gain: Math.round(gain),
      totalGain: Math.round(value - initialInvestment),
    })
  }

  return {
    totalReturn: profit,
    totalReturnPct,
    annualizedReturn,
    totalValue: finalValue,
    profit,
    schedule,
  }
}

export function calcROIFromRate(
  initialInvestment: number,
  annualRate: number,
  years: number
): ROIResult {
  const finalValue = initialInvestment * Math.pow(1 + annualRate / 100, years)
  return calcROI(initialInvestment, finalValue, years)
}