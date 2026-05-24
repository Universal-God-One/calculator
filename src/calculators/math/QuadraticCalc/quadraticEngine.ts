export type QuadraticResult =
  | { type: 'two_real'; x1: number; x2: number; discriminant: number; vertex: [number, number]; steps: string[] }
  | { type: 'one_real'; x1: number; discriminant: number; vertex: [number, number]; steps: string[] }
  | { type: 'complex'; realPart: number; imagPart: number; discriminant: number; vertex: [number, number]; steps: string[] }
  | { type: 'not_quadratic'; steps: string[] }

function r(n: number, d = 6) {
  return Math.round(n * Math.pow(10, d)) / Math.pow(10, d)
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  const steps: string[] = []
  steps.push(`Equation: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`)
  steps.push(`Using the quadratic formula: x = (−b ± √(b² − 4ac)) / 2a`)
  steps.push(`a = ${a}, b = ${b}, c = ${c}`)

  if (a === 0) {
    return { type: 'not_quadratic', steps: ['a cannot be 0 — this is not a quadratic equation.'] }
  }

  const discriminant = b * b - 4 * a * c
  steps.push(`Discriminant: b² − 4ac = ${b}² − 4(${a})(${c}) = ${b * b} − ${4 * a * c} = ${discriminant}`)

  const vertexX = -b / (2 * a)
  const vertexY = a * vertexX * vertexX + b * vertexX + c
  const vertex: [number, number] = [r(vertexX), r(vertexY)]

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant)
    steps.push(`√${discriminant} = ${r(sqrtD)}`)
    const x1 = (-b + sqrtD) / (2 * a)
    const x2 = (-b - sqrtD) / (2 * a)
    steps.push(`x₁ = (−(${b}) + ${r(sqrtD)}) / (2 × ${a}) = ${r(-b + sqrtD)} / ${2 * a} = ${r(x1)}`)
    steps.push(`x₂ = (−(${b}) − ${r(sqrtD)}) / (2 × ${a}) = ${r(-b - sqrtD)} / ${2 * a} = ${r(x2)}`)
    steps.push(`Two distinct real roots: x₁ = ${r(x1)}, x₂ = ${r(x2)}`)
    return { type: 'two_real', x1: r(x1), x2: r(x2), discriminant, vertex, steps }
  } else if (discriminant === 0) {
    const x1 = -b / (2 * a)
    steps.push(`Discriminant = 0 → one repeated real root`)
    steps.push(`x = −b / 2a = ${-b} / ${2 * a} = ${r(x1)}`)
    return { type: 'one_real', x1: r(x1), discriminant, vertex, steps }
  } else {
    const realPart = -b / (2 * a)
    const imagPart = Math.sqrt(-discriminant) / (2 * a)
    steps.push(`Discriminant < 0 → two complex conjugate roots`)
    steps.push(`√(${discriminant}) = ${r(Math.sqrt(-discriminant))}i`)
    steps.push(`x = ${r(realPart)} ± ${r(imagPart)}i`)
    return { type: 'complex', realPart: r(realPart), imagPart: r(imagPart), discriminant, vertex, steps }
  }
}

export function getParabolaPoints(a: number, b: number, c: number, numPoints = 80): { x: number; y: number }[] {
  const vertexX = -b / (2 * a)
  const spread = Math.max(5, Math.abs(b / a) * 2, 4)
  const xMin = vertexX - spread
  const xMax = vertexX + spread
  const step = (xMax - xMin) / (numPoints - 1)
  return Array.from({ length: numPoints }, (_, i) => {
    const x = xMin + i * step
    const y = a * x * x + b * x + c
    return { x: r(x, 2), y: r(y, 2) }
  })
}