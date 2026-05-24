export interface FractionResult {
  numerator: number
  denominator: number
  decimal: number
  percentage: number
  simplified: string
  mixedNumber: string | null
  steps: string[]
}

export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide'

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b)
  while (b) { [a, b] = [b, a % b] }
  return a
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

export function simplify(num: number, den: number): [number, number] {
  if (den === 0) return [num, den]
  const g = gcd(Math.abs(num), Math.abs(den))
  const sign = den < 0 ? -1 : 1
  return [(sign * num) / g, (sign * den) / g]
}

export function fractionToString(num: number, den: number): string {
  const [n, d] = simplify(num, den)
  if (d === 1) return `${n}`
  return `${n}/${d}`
}

export function toMixed(num: number, den: number): string | null {
  const [n, d] = simplify(num, den)
  if (d === 1) return null
  const whole = Math.trunc(n / d)
  const rem = Math.abs(n % d)
  if (whole === 0) return null
  if (rem === 0) return `${whole}`
  return `${whole} ${rem}/${d}`
}

export function calcFraction(
  n1: number, d1: number,
  n2: number, d2: number,
  op: FractionOperation
): FractionResult {
  let rn: number, rd: number
  const steps: string[] = []

  const frac1 = `${n1}/${d1}`
  const frac2 = `${n2}/${d2}`

  switch (op) {
    case 'add':
    case 'subtract': {
      const l = lcm(d1, d2)
      const fn1 = n1 * (l / d1)
      const fn2 = n2 * (l / d2)
      rn = op === 'add' ? fn1 + fn2 : fn1 - fn2
      rd = l
      steps.push(`Find LCD of ${d1} and ${d2}: LCD = ${l}`)
      steps.push(`Convert: ${n1}/${d1} = ${fn1}/${l}`)
      steps.push(`Convert: ${n2}/${d2} = ${fn2}/${l}`)
      steps.push(`${op === 'add' ? 'Add' : 'Subtract'} numerators: ${fn1} ${op === 'add' ? '+' : '−'} ${fn2} = ${rn}`)
      steps.push(`Result: ${rn}/${l}`)
      break
    }
    case 'multiply': {
      rn = n1 * n2
      rd = d1 * d2
      steps.push(`Multiply numerators: ${n1} × ${n2} = ${rn}`)
      steps.push(`Multiply denominators: ${d1} × ${d2} = ${rd}`)
      steps.push(`Result: ${rn}/${rd}`)
      break
    }
    case 'divide': {
      // multiply by reciprocal
      rn = n1 * d2
      rd = d1 * n2
      steps.push(`Flip the second fraction (reciprocal): ${n2}/${d2} → ${d2}/${n2}`)
      steps.push(`Multiply: ${n1}/${d1} × ${d2}/${n2}`)
      steps.push(`Numerator: ${n1} × ${d2} = ${rn}`)
      steps.push(`Denominator: ${d1} × ${n2} = ${rd}`)
      steps.push(`Result: ${rn}/${rd}`)
      break
    }
  }

  const [sn, sd] = simplify(rn!, rd!)
  if (sn !== rn || sd !== rd) {
    const g = gcd(Math.abs(rn!), Math.abs(rd!))
    steps.push(`Simplify by dividing by GCD (${g}): ${rn}/${rd} = ${sn}/${sd}`)
  }

  const decimal = sd !== 0 ? sn / sd : 0
  const [fn, fd] = simplify(rn!, rd!)

  return {
    numerator: fn,
    denominator: fd,
    decimal: Math.round(decimal * 1000000) / 1000000,
    percentage: Math.round(decimal * 10000) / 100,
    simplified: fractionToString(fn, fd),
    mixedNumber: toMixed(fn, fd),
    steps,
  }
}

export function parseFraction(input: string): [number, number] | null {
  const trimmed = input.trim()
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/')
    if (parts.length === 2) {
      const n = parseInt(parts[0])
      const d = parseInt(parts[1])
      if (!isNaN(n) && !isNaN(d) && d !== 0) return [n, d]
    }
  }
  const n = parseFloat(trimmed)
  if (!isNaN(n)) return [n, 1]
  return null
}

// Standalone conversions
export function decimalToFraction(decimal: number, maxDen: number = 1000): [number, number] {
  if (Number.isInteger(decimal)) return [decimal, 1]
  const sign = decimal < 0 ? -1 : 1
  decimal = Math.abs(decimal)
  let bestN = 1, bestD = 1, bestErr = Infinity
  for (let d = 1; d <= maxDen; d++) {
    const n = Math.round(decimal * d)
    const err = Math.abs(n / d - decimal)
    if (err < bestErr) { bestErr = err; bestN = n; bestD = d }
    if (err < 1e-10) break
  }
  return simplify(sign * bestN, bestD)
}