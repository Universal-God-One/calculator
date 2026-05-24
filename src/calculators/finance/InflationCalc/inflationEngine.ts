export interface InflationResult {
  futureValue: number
  presentValue: number
  totalInflation: number
  purchasingPowerLost: number
  purchasingPowerLostPct: number
  schedule: { year: number; value: number; purchasingPower: number }[]
}

export function calcInflation(
  amount: number,
  inflationRate: number,
  years: number
): InflationResult {
  const rate = inflationRate / 100
  const futureValue = amount * Math.pow(1 + rate, years)
  const purchasingPowerLost = futureValue - amount
  const purchasingPowerLostPct = (purchasingPowerLost / futureValue) * 100

  const schedule = []
  for (let y = 1; y <= years; y++) {
    const value = amount * Math.pow(1 + rate, y)
    const purchasingPower = amount / Math.pow(1 + rate, y)
    schedule.push({
      year: y,
      value: Math.round(value * 100) / 100,
      purchasingPower: Math.round(purchasingPower * 100) / 100,
    })
  }

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    presentValue: amount,
    totalInflation: Math.round(purchasingPowerLost * 100) / 100,
    purchasingPowerLost: Math.round(purchasingPowerLost * 100) / 100,
    purchasingPowerLostPct: Math.round(purchasingPowerLostPct * 100) / 100,
    schedule,
  }
}