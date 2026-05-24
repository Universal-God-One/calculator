export interface DescriptiveStats {
  count: number
  sum: number
  mean: number
  trimmedMean: number   // 5% trimmed
  weightedMean: number | null
  median: number
  mode: number[]
  range: number
  min: number
  max: number
  variance_s: number
  variance_p: number
  stddev_s: number
  stddev_p: number
  sem: number           // standard error of mean
  cv: number
  skewness: number
  kurtosis: number
  q1: number
  q3: number
  iqr: number
  outliers: number[]
  sorted: number[]
  percentiles: { p: number; value: number }[]
  zScores: number[]
  frequencies: { value: number; count: number; relFreq: number; cumFreq: number }[]
}

function pctile(sorted: number[], p: number): number {
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx), hi = Math.ceil(idx)
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

export function calcStats(values: number[], weights?: number[]): DescriptiveStats {
  const n = values.length
  const sorted = [...values].sort((a, b) => a - b)
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const min = sorted[0], max = sorted[n - 1]

  // Trimmed mean (5%)
  const trim = Math.floor(n * 0.05)
  const trimmed = sorted.slice(trim, n - trim)
  const trimmedMean = trimmed.length ? trimmed.reduce((a, b) => a + b, 0) / trimmed.length : mean

  // Weighted mean
  let weightedMean: number | null = null
  if (weights && weights.length === n) {
    const wSum = weights.reduce((a, b) => a + b, 0)
    weightedMean = weights.reduce((a, w, i) => a + w * values[i], 0) / wSum
  }

  // Median
  const mid = Math.floor(n / 2)
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

  // Mode
  const freq: Record<number, number> = {}
  for (const v of values) freq[v] = (freq[v] ?? 0) + 1
  const maxFreq = Math.max(...Object.values(freq))
  const mode = maxFreq > 1 ? Object.keys(freq).filter(k => freq[+k] === maxFreq).map(Number).sort((a,b)=>a-b) : []

  // Variance & std dev
  const sqDiffs = values.map(v => (v - mean) ** 2)
  const sumSq = sqDiffs.reduce((a, b) => a + b, 0)
  const variance_p = sumSq / n
  const variance_s = n > 1 ? sumSq / (n - 1) : 0
  const stddev_p = Math.sqrt(variance_p)
  const stddev_s = Math.sqrt(variance_s)
  const sem = stddev_s / Math.sqrt(n)
  const cv = mean !== 0 ? (stddev_s / Math.abs(mean)) * 100 : 0

  // Skewness (Fisher-Pearson)
  const skewness = n > 2
    ? (n / ((n-1)*(n-2))) * values.map(v => ((v-mean)/stddev_s)**3).reduce((a,b)=>a+b,0)
    : 0

  // Excess kurtosis
  const kurtosis = n > 3
    ? ((n*(n+1))/((n-1)*(n-2)*(n-3))) * values.map(v => ((v-mean)/stddev_s)**4).reduce((a,b)=>a+b,0)
      - (3*(n-1)**2)/((n-2)*(n-3))
    : 0

  // Quartiles & IQR
  const q1 = pctile(sorted, 25)
  const q3 = pctile(sorted, 75)
  const iqr = q3 - q1

  // Outliers (Tukey fences)
  const lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr
  const outliers = sorted.filter(v => v < lo || v > hi)

  // Percentiles
  const percentiles = [5,10,20,25,30,40,50,60,70,75,80,90,95].map(p => ({ p, value: pctile(sorted, p) }))

  // Z-scores
  const zScores = values.map(v => stddev_s > 0 ? (v - mean) / stddev_s : 0)

  // Frequency table
  const freqMap: Record<number, number> = {}
  for (const v of sorted) freqMap[v] = (freqMap[v] ?? 0) + 1
  let cum = 0
  const frequencies = Object.entries(freqMap)
    .sort(([a],[b]) => +a - +b)
    .map(([val, count]) => {
      const relFreq = count / n
      cum += relFreq
      return { value: +val, count, relFreq, cumFreq: cum }
    })

  return {
    count: n, sum, mean, trimmedMean, weightedMean, median, mode,
    range: max - min, min, max,
    variance_s, variance_p, stddev_s, stddev_p, sem, cv,
    skewness, kurtosis, q1, q3, iqr, outliers, sorted,
    percentiles, zScores, frequencies,
  }
}

export function parseValues(raw: string): number[] {
  return raw.split(/[\s,;|\n]+/).map(s => s.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n))
}

export function parseWeights(raw: string): number[] {
  return raw.split(/[\s,;|\n]+/).map(s => s.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n) && n >= 0)
}