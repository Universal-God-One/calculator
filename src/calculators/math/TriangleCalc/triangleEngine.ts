export interface TriangleResult {
  a: number; b: number; c: number
  A: number; B: number; C: number  // angles in degrees
  area: number
  perimeter: number
  semiPerimeter: number
  inradius: number
  circumradius: number
  height_a: number; height_b: number; height_c: number
  type: string
  isValid: boolean
  steps: string[]
}

function toDeg(r: number) { return r * 180 / Math.PI }
function toRad(d: number) { return d * Math.PI / 180 }
function r6(n: number) { return Math.round(n * 1000000) / 1000000 }

export type SolveMode =
  | 'SSS' | 'SAS' | 'ASA' | 'AAS' | 'SSA'

export function classifyTriangle(a: number, b: number, c: number, A: number, B: number, C: number): string {
  const types: string[] = []
  // By sides
  if (Math.abs(a - b) < 1e-9 && Math.abs(b - c) < 1e-9) types.push('Equilateral')
  else if (Math.abs(a - b) < 1e-9 || Math.abs(b - c) < 1e-9 || Math.abs(a - c) < 1e-9) types.push('Isosceles')
  else types.push('Scalene')
  // By angles
  const maxAngle = Math.max(A, B, C)
  if (Math.abs(maxAngle - 90) < 1e-6) types.push('Right')
  else if (maxAngle > 90) types.push('Obtuse')
  else types.push('Acute')
  return types.join(' ')
}

export function solveSSS(a: number, b: number, c: number): TriangleResult | null {
  if (a + b <= c || b + c <= a || a + c <= b) return null
  const A = toDeg(Math.acos((b*b + c*c - a*a) / (2*b*c)))
  const B = toDeg(Math.acos((a*a + c*c - b*b) / (2*a*c)))
  const C = 180 - A - B
  return buildResult(a, b, c, A, B, C, ['Given: a, b, c (SSS)', `Law of Cosines: A = arccos((b²+c²-a²)/(2bc)) = ${r6(A)}°`, `B = arccos((a²+c²-b²)/(2ac)) = ${r6(B)}°`, `C = 180° - A - B = ${r6(C)}°`])
}

export function solveSAS(a: number, C_deg: number, b: number): TriangleResult | null {
  if (C_deg <= 0 || C_deg >= 180) return null
  const C = C_deg
  const c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(toRad(C)))
  if (c <= 0) return null
  const A = toDeg(Math.acos((b*b + c*c - a*a) / (2*b*c)))
  const B = 180 - A - C
  return buildResult(a, b, c, A, B, C, ['Given: a, C, b (SAS)', `Law of Cosines: c = √(a²+b²-2ab·cos(C)) = ${r6(c)}`, `A = arccos((b²+c²-a²)/(2bc)) = ${r6(A)}°`, `B = 180° - A - C = ${r6(B)}°`])
}

export function solveASA(A_deg: number, c: number, B_deg: number): TriangleResult | null {
  const C = 180 - A_deg - B_deg
  if (C <= 0 || A_deg <= 0 || B_deg <= 0) return null
  const a = c * Math.sin(toRad(A_deg)) / Math.sin(toRad(C))
  const b = c * Math.sin(toRad(B_deg)) / Math.sin(toRad(C))
  return buildResult(a, b, c, A_deg, B_deg, C, ['Given: A, c, B (ASA)', `C = 180° - A - B = ${r6(C)}°`, `Law of Sines: a = c·sin(A)/sin(C) = ${r6(a)}`, `b = c·sin(B)/sin(C) = ${r6(b)}`])
}

export function solveAAS(A_deg: number, B_deg: number, a: number): TriangleResult | null {
  const C = 180 - A_deg - B_deg
  if (C <= 0 || A_deg <= 0 || B_deg <= 0) return null
  const b = a * Math.sin(toRad(B_deg)) / Math.sin(toRad(A_deg))
  const c = a * Math.sin(toRad(C)) / Math.sin(toRad(A_deg))
  return buildResult(a, b, c, A_deg, B_deg, C, ['Given: A, B, a (AAS)', `C = 180° - A - B = ${r6(C)}°`, `b = a·sin(B)/sin(A) = ${r6(b)}`, `c = a·sin(C)/sin(A) = ${r6(c)}`])
}

export function solveSSA(a: number, b: number, A_deg: number): TriangleResult[] {
  const results: TriangleResult[] = []
  const h = b * Math.sin(toRad(A_deg))
  // No solution
  if (a < h) return []
  const sinB = b * Math.sin(toRad(A_deg)) / a
  if (sinB > 1) return []
  const B1 = toDeg(Math.asin(sinB))
  // Solution 1
  const C1 = 180 - A_deg - B1
  if (C1 > 0) {
    const c1 = a * Math.sin(toRad(C1)) / Math.sin(toRad(A_deg))
    const r1 = buildResult(a, b, c1, A_deg, B1, C1, ['Given: a, b, A (SSA — Solution 1)', `sin(B) = b·sin(A)/a = ${r6(sinB)}`, `B = ${r6(B1)}°, C = ${r6(C1)}°, c = ${r6(c1)}`])
    if (r1) results.push(r1)
  }
  // Solution 2 (ambiguous case)
  const B2 = 180 - B1
  const C2 = 180 - A_deg - B2
  if (C2 > 0 && Math.abs(a - b) > 1e-9) {
    const c2 = a * Math.sin(toRad(C2)) / Math.sin(toRad(A_deg))
    const r2 = buildResult(a, b, c2, A_deg, B2, C2, ['Given: a, b, A (SSA — Solution 2, ambiguous case)', `B = ${r6(B2)}°, C = ${r6(C2)}°, c = ${r6(c2)}`])
    if (r2) results.push(r2)
  }
  return results
}

function buildResult(a: number, b: number, c: number, A: number, B: number, C: number, steps: string[]): TriangleResult {
  const s = (a + b + c) / 2
  const area = Math.sqrt(s * (s-a) * (s-b) * (s-c))
  const inradius = area / s
  const circumradius = (a * b * c) / (4 * area)
  return {
    a: r6(a), b: r6(b), c: r6(c),
    A: r6(A), B: r6(B), C: r6(C),
    area: r6(area), perimeter: r6(a+b+c), semiPerimeter: r6(s),
    inradius: r6(inradius), circumradius: r6(circumradius),
    height_a: r6(2*area/a), height_b: r6(2*area/b), height_c: r6(2*area/c),
    type: classifyTriangle(a, b, c, A, B, C),
    isValid: true, steps,
  }
}