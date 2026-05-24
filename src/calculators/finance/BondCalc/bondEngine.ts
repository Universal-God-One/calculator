export interface BondResult {
  price: number
  ytm: number
  currentYield: number
  totalCouponPayments: number
  totalReturn: number
  duration: number // Macaulay duration in years
  schedule: {
    period: number
    coupon: number
    principal: number
    cashflow: number
    presentValue: number
    balance: number
  }[]
}

// Calculate bond price from YTM
export function calcBondPrice(
  faceValue: number,
  couponRate: number,     // annual %
  ytm: number,            // annual %
  years: number,
  frequency: number       // 1=annual, 2=semiannual
): number {
  const periodsPerYear = frequency
  const totalPeriods = years * periodsPerYear
  const couponPerPeriod = (faceValue * couponRate / 100) / periodsPerYear
  const ratePerPeriod = ytm / 100 / periodsPerYear

  let price = 0
  for (let t = 1; t <= totalPeriods; t++) {
    price += couponPerPeriod / Math.pow(1 + ratePerPeriod, t)
  }
  price += faceValue / Math.pow(1 + ratePerPeriod, totalPeriods)

  return Math.round(price * 100) / 100
}

// Calculate YTM from price (Newton-Raphson)
export function calcYTM(
  faceValue: number,
  couponRate: number,
  price: number,
  years: number,
  frequency: number
): number {
  const periodsPerYear = frequency
  const totalPeriods = years * periodsPerYear
  const couponPerPeriod = (faceValue * couponRate / 100) / periodsPerYear

  let ytmGuess = couponRate / 100 / periodsPerYear

  for (let i = 0; i < 100; i++) {
    let pv = 0
    let dpv = 0
    for (let t = 1; t <= totalPeriods; t++) {
      const disc = Math.pow(1 + ytmGuess, t)
      pv += couponPerPeriod / disc
      dpv -= t * couponPerPeriod / (disc * (1 + ytmGuess))
    }
    const disc = Math.pow(1 + ytmGuess, totalPeriods)
    pv += faceValue / disc
    dpv -= totalPeriods * faceValue / (disc * (1 + ytmGuess))

    const f = pv - price
    if (Math.abs(f) < 0.0001) break
    ytmGuess -= f / dpv
  }

  return Math.round(ytmGuess * periodsPerYear * 10000) / 100 // annual %
}

export function calcBond(
  faceValue: number,
  couponRate: number,
  ytm: number,
  years: number,
  frequency: number
): BondResult {
  const periodsPerYear = frequency
  const totalPeriods = years * periodsPerYear
  const couponPerPeriod = (faceValue * couponRate / 100) / periodsPerYear
  const ratePerPeriod = ytm / 100 / periodsPerYear

  const price = calcBondPrice(faceValue, couponRate, ytm, years, periodsPerYear)
  const currentYield = ((couponPerPeriod * periodsPerYear) / price) * 100
  const totalCouponPayments = couponPerPeriod * totalPeriods

  // Schedule
  let balance = faceValue
  let durationNumerator = 0
  let durationDenominator = 0
  const schedule = []

  for (let t = 1; t <= totalPeriods; t++) {
    const coupon = couponPerPeriod
    const principal = t === totalPeriods ? faceValue : 0
    const cashflow = coupon + principal
    const pv = cashflow / Math.pow(1 + ratePerPeriod, t)
    balance = t === totalPeriods ? 0 : faceValue

    durationNumerator += (t / periodsPerYear) * pv
    durationDenominator += pv

    schedule.push({
      period: t,
      coupon: Math.round(coupon * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      cashflow: Math.round(cashflow * 100) / 100,
      presentValue: Math.round(pv * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
  }

  const duration = durationNumerator / durationDenominator

  return {
    price,
    ytm,
    currentYield: Math.round(currentYield * 100) / 100,
    totalCouponPayments: Math.round(totalCouponPayments * 100) / 100,
    totalReturn: Math.round((totalCouponPayments + faceValue - price) * 100) / 100,
    duration: Math.round(duration * 100) / 100,
    schedule,
  }
}