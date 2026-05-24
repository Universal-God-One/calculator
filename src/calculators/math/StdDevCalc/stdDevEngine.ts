export interface StdDevResult {
  count: number
  sum: number
  mean: number
  median: number
  mode: number[]
  range: number
  min: number
  max: number
  variance_population: number
  variance_sample: number
  stddev_population: number
  stddev_sample: number
  cv: number // coefficient of variation
  q1: number
  q3: number
  iqr: number
  sorted: number[]
}

function percentile(sorted: number[], p: number): number {
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

export function calcStdDev(values: number[]): StdDevResult {
  const n = values.length
  if (n === 0) throw new Error('No data')

  const sorted = [...values].sort((a, b) => a - b)
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const min = sorted[0]
  const max = sorted[n - 1]
  const range = max - min

  // Median
  const mid = Math.floor(n / 2)
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

  // Mode
  const freq: Record<number, number> = {}
  for (const v of values) freq[v] = (freq[v] ?? 0) + 1
  const maxFreq = Math.max(...Object.values(freq))
  const mode = maxFreq > 1 ? Object.keys(freq).filter(k => freq[+k] === maxFreq).map(Number) : []

  // Variance
  const sqDiffs = values.map(v => Math.pow(v - mean, 2))
  const sumSqDiffs = sqDiffs.reduce((a, b) => a + b, 0)
  const variance_population = sumSqDiffs / n
  const variance_sample = n > 1 ? sumSqDiffs / (n - 1) : 0
  const stddev_population = Math.sqrt(variance_population)
  const stddev_sample = Math.sqrt(variance_sample)
  const cv = mean !== 0 ? (stddev_sample / Math.abs(mean)) * 100 : 0

  // Quartiles
  const q1 = percentile(sorted, 25)
  const q3 = percentile(sorted, 75)
  const iqr = q3 - q1

  return {
    count: n, sum, mean, median, mode, range, min, max,
    variance_population, variance_sample,
    stddev_population, stddev_sample,
    cv, q1, q3, iqr, sorted,
  }
}

export function parseInput(raw: string): number[] {
  return raw
    .split(/[\s,;|\n]+/)
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(Number)
    .filter(n => !isNaN(n))
}