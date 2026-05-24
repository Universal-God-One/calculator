// Error function approximation
function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const p = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  const r = 1 - p * Math.exp(-x * x)
  return x >= 0 ? r : -r
}

export function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)))
}

export function normalPDF(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
}

// Inverse normal (rational approximation)
export function invNorm(p: number): number {
  if (p <= 0) return -Infinity
  if (p >= 1) return Infinity
  if (p === 0.5) return 0
  const a = [0, -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239]
  const b = [0, -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1]
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416]
  const pLow = 0.02425, pHigh = 1 - pLow
  let q: number, r: number
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p))
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
  } else if (p <= pHigh) {
    q = p - 0.5; r = q * q
    return (((((a[1]*r+a[2])*r+a[3])*r+a[4])*r+a[5])*r+a[6])*q / (((((b[1]*r+b[2])*r+b[3])*r+b[4])*r+b[5])*r+1)
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p))
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
  }
}

export interface ZScoreResult {
  zScore: number
  pLeft: number     // P(Z ≤ z)
  pRight: number    // P(Z ≥ z)
  pMiddle: number   // P(-|z| ≤ Z ≤ |z|)
  pdf: number
  curvePoints: { x: number; y: number }[]
}

export function calcZScore(x: number, mu: number, sigma: number): ZScoreResult {
  const zScore = (x - mu) / sigma
  return buildResult(zScore)
}

export function buildResult(zScore: number): ZScoreResult {
  const pLeft = normalCDF(zScore)
  const pRight = 1 - pLeft
  const pMiddle = normalCDF(Math.abs(zScore)) - normalCDF(-Math.abs(zScore))
  const pdf = normalPDF(zScore)

  const curvePoints = Array.from({ length: 200 }, (_, i) => {
    const x = -4 + (i / 199) * 8
    return { x: +x.toFixed(3), y: +normalPDF(x).toFixed(6) }
  })

  return { zScore: +zScore.toFixed(6), pLeft: +pLeft.toFixed(6), pRight: +pRight.toFixed(6), pMiddle: +pMiddle.toFixed(6), pdf: +pdf.toFixed(6), curvePoints }
}

export interface ZTableRow { z: string; cols: string[] }
export function generateZTable(sign: 'positive' | 'negative'): ZTableRow[] {
  const rows: ZTableRow[] = []
  const start = sign === 'positive' ? 0 : -3.4
  const end = sign === 'positive' ? 3.4 : 0
  const step = sign === 'positive' ? 0.1 : 0.1
  for (let z = start; Math.abs(z) <= Math.abs(end) + 0.001; z = Math.round((z + step) * 10) / 10) {
    const zStr = z.toFixed(1)
    const cols = [0,1,2,3,4,5,6,7,8,9].map(d => {
      const zFull = z + d * 0.01
      return normalCDF(sign === 'negative' ? -Math.abs(zFull) : zFull).toFixed(4)
    })
    rows.push({ z: zStr, cols })
  }
  return sign === 'negative' ? rows.reverse() : rows
}