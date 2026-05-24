export interface DiscountResult {
  originalPrice: number
  discountAmount: number
  finalPrice: number
  discountPct: number
  savings: number
  taxAmount: number
  totalWithTax: number
}

// From original price + discount %
export function calcFromPctOff(original: number, pctOff: number, taxPct: number = 0): DiscountResult {
  const discountAmount = original * (pctOff / 100)
  const finalPrice = original - discountAmount
  const taxAmount = finalPrice * (taxPct / 100)
  return {
    originalPrice: original,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountPct: pctOff,
    savings: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalWithTax: Math.round((finalPrice + taxAmount) * 100) / 100,
  }
}

// From original price + final price → find discount %
export function calcFromFinalPrice(original: number, finalPrice: number, taxPct: number = 0): DiscountResult {
  const discountAmount = original - finalPrice
  const pctOff = original > 0 ? (discountAmount / original) * 100 : 0
  const taxAmount = finalPrice * (taxPct / 100)
  return {
    originalPrice: original,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountPct: Math.round(pctOff * 100) / 100,
    savings: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalWithTax: Math.round((finalPrice + taxAmount) * 100) / 100,
  }
}

// From original price + discount amount
export function calcFromAmount(original: number, discountAmount: number, taxPct: number = 0): DiscountResult {
  const finalPrice = original - discountAmount
  const pctOff = original > 0 ? (discountAmount / original) * 100 : 0
  const taxAmount = finalPrice * (taxPct / 100)
  return {
    originalPrice: original,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountPct: Math.round(pctOff * 100) / 100,
    savings: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalWithTax: Math.round((finalPrice + taxAmount) * 100) / 100,
  }
}

// Stacked discounts (e.g. 20% off then another 10% off)
export function calcStacked(original: number, discounts: number[], taxPct: number = 0): {
  results: DiscountResult[]
  finalPrice: number
  totalSavings: number
  effectivePct: number
  totalWithTax: number
} {
  let price = original
  const results: DiscountResult[] = []
  let totalSavings = 0

  for (const pct of discounts) {
    const r = calcFromPctOff(price, pct, 0)
    results.push(r)
    totalSavings += r.discountAmount
    price = r.finalPrice
  }

  const effectivePct = original > 0 ? (totalSavings / original) * 100 : 0
  const taxAmount = price * (taxPct / 100)

  return {
    results,
    finalPrice: Math.round(price * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100,
    effectivePct: Math.round(effectivePct * 100) / 100,
    totalWithTax: Math.round((price + taxAmount) * 100) / 100,
  }
}