// ── Combinatorics helpers ─────────────────────────────────────────────────
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n > 170) return Infinity
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r
}

export function permutations(n: number, r: number): number {
  if (r > n) return 0
  return factorial(n) / factorial(n - r)
}

export function combinations(n: number, r: number): number {
  if (r > n || r < 0) return 0
  if (r === 0 || r === n) return 1
  return factorial(n) / (factorial(r) * factorial(n - r))
}

// ── Binomial distribution ─────────────────────────────────────────────────
export function binomialPMF(n: number, k: number, p: number): number {
  return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
}

export function binomialCDF(n: number, k: number, p: number): number {
  let sum = 0
  for (let i = 0; i <= k; i++) sum += binomialPMF(n, i, p)
  return sum
}

export interface BinomialResult {
  pmf: number          // P(X = k)
  cdfLte: number       // P(X ≤ k)
  cdfGte: number       // P(X ≥ k)
  cdfLt: number        // P(X < k)
  cdfGt: number        // P(X > k)
  mean: number
  variance: number
  stddev: number
  distribution: { k: number; pmf: number; cdf: number }[]
}

export function calcBinomial(n: number, k: number, p: number): BinomialResult {
  const pmf = binomialPMF(n, k, p)
  const cdfLte = binomialCDF(n, k, p)
  const cdfLt = k > 0 ? binomialCDF(n, k - 1, p) : 0
  const distribution = Array.from({ length: n + 1 }, (_, i) => ({
    k: i, pmf: binomialPMF(n, i, p), cdf: binomialCDF(n, i, p)
  }))
  return {
    pmf, cdfLte, cdfGte: 1 - cdfLt, cdfLt, cdfGt: 1 - cdfLte,
    mean: n * p,
    variance: n * p * (1 - p),
    stddev: Math.sqrt(n * p * (1 - p)),
    distribution,
  }
}

// ── Normal distribution ───────────────────────────────────────────────────
function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  const result = 1 - poly * Math.exp(-x * x)
  return x >= 0 ? result : -result
}

export function normalCDF(x: number, mu = 0, sigma = 1): number {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))))
}

export function normalPDF(x: number, mu = 0, sigma = 1): number {
  return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI))
}

export interface NormalResult {
  pdf: number
  cdfLte: number       // P(X ≤ x)
  cdfGte: number       // P(X ≥ x)
  zScore: number
  mean: number
  sigma: number
  curvePoints: { x: number; y: number }[]
}

export function calcNormal(x: number, mu: number, sigma: number): NormalResult {
  const zScore = (x - mu) / sigma
  const cdfLte = normalCDF(x, mu, sigma)
  const spread = 4 * sigma
  const curvePoints = Array.from({ length: 120 }, (_, i) => {
    const cx = mu - spread + (i / 119) * spread * 2
    return { x: Math.round(cx * 1000) / 1000, y: Math.round(normalPDF(cx, mu, sigma) * 100000) / 100000 }
  })
  return { pdf: normalPDF(x, mu, sigma), cdfLte, cdfGte: 1 - cdfLte, zScore, mean: mu, sigma, curvePoints }
}

// ── Basic probability ─────────────────────────────────────────────────────
export interface BasicProbResult {
  p: number; complement: number; odds_for: string; odds_against: string
  pAandB?: number; pAorB?: number
}
export function calcBasic(favorable: number, total: number, p2?: number, independent?: boolean): BasicProbResult {
  const p = favorable / total
  const complement = 1 - p
  const g = gcd(favorable, total - favorable)
  const odds_for = `${favorable / g} : ${(total - favorable) / g}`
  const odds_against = `${(total - favorable) / g} : ${favorable / g}`
  let pAandB, pAorB
  if (p2 !== undefined) {
    pAandB = independent ? p * p2 : undefined
    pAorB = p + p2 - (pAandB ?? 0)
  }
  return { p, complement, odds_for, odds_against, pAandB, pAorB }
}
function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a }