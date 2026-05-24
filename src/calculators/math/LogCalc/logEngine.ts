export interface LogResult {
  value: number
  base: number
  result: number
  steps: string[]
}

export interface LogConversions {
  log10: number
  ln: number
  log2: number
  logE: number
}

export function calcLog(value: number, base: number): LogResult {
  if (value <= 0) throw new Error('Logarithm requires a positive number')
  if (base <= 0 || base === 1) throw new Error('Base must be positive and not equal to 1')

  const result = Math.log(value) / Math.log(base)
  const steps = [
    `log_${base}(${value}) = ln(${value}) / ln(${base})`,
    `= ${Math.log(value).toFixed(8)} / ${Math.log(base).toFixed(8)}`,
    `= ${result.toFixed(10)}`,
    `Verification: ${base}^${result.toFixed(6)} = ${Math.pow(base, result).toFixed(6)}`,
  ]
  return { value, base, result, steps }
}

export function calcAllLogs(value: number): LogConversions {
  if (value <= 0) throw new Error('Value must be positive')
  return {
    log10: Math.log10(value),
    ln: Math.log(value),
    log2: Math.log2(value),
    logE: Math.log(value), // same as ln
  }
}

export function antilog(base: number, exponent: number): number {
  return Math.pow(base, exponent)
}

// Change of base: log_b(x) = log_a(x) / log_a(b)
export function changeOfBase(value: number, fromBase: number, toBase: number): number {
  return Math.log(value) / Math.log(fromBase) / (Math.log(toBase) / Math.log(fromBase))
}

// Log identities demonstration
export function logIdentities(a: number, b: number, base: number): {
  product: { lhs: number; rhs: number; identity: string }
  quotient: { lhs: number; rhs: number; identity: string }
  power: { lhs: number; rhs: number; identity: string }
  change: { value: number; identity: string }
} {
  const logA = Math.log(a) / Math.log(base)
  const logB = Math.log(b) / Math.log(base)
  const logAB = Math.log(a * b) / Math.log(base)
  const logADivB = Math.log(a / b) / Math.log(base)
  const logApow = Math.log(Math.pow(a, b)) / Math.log(base)
  return {
    product: { lhs: logAB, rhs: logA + logB, identity: `log(${a}×${b}) = log(${a}) + log(${b})` },
    quotient: { lhs: logADivB, rhs: logA - logB, identity: `log(${a}/${b}) = log(${a}) − log(${b})` },
    power: { lhs: logApow, rhs: b * logA, identity: `log(${a}^${b}) = ${b}×log(${a})` },
    change: { value: logA, identity: `log_${base}(${a}) = log(${a})/log(${base})` },
  }
}

// Generate curve points for y = log_b(x)
export function logCurvePoints(base: number, count = 100): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []
  for (let i = 1; i <= count; i++) {
    const x = i * 0.1
    const y = Math.log(x) / Math.log(base)
    if (isFinite(y) && Math.abs(y) < 20) {
      points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 10000) / 10000 })
    }
  }
  return points
}