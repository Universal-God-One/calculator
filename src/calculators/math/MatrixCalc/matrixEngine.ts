export type Matrix = number[][]

export function zeros(r: number, c: number): Matrix {
  return Array.from({ length: r }, () => Array(c).fill(0))
}

export function identity(n: number): Matrix {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0))
}

export function add(A: Matrix, B: Matrix): Matrix {
  const r = A.length, c = A[0].length
  if (B.length !== r || B[0].length !== c) throw new Error('Matrices must have the same dimensions')
  return A.map((row, i) => row.map((v, j) => v + B[i][j]))
}

export function subtract(A: Matrix, B: Matrix): Matrix {
  const r = A.length, c = A[0].length
  if (B.length !== r || B[0].length !== c) throw new Error('Matrices must have the same dimensions')
  return A.map((row, i) => row.map((v, j) => v - B[i][j]))
}

export function multiply(A: Matrix, B: Matrix): Matrix {
  const rA = A.length, cA = A[0].length, cB = B[0].length
  if (B.length !== cA) throw new Error(`Cannot multiply ${rA}×${cA} by ${B.length}×${cB}`)
  return Array.from({ length: rA }, (_, i) =>
    Array.from({ length: cB }, (_, j) =>
      A[i].reduce((sum, _, k) => sum + A[i][k] * B[k][j], 0)
    )
  )
}

export function scalarMultiply(A: Matrix, s: number): Matrix {
  return A.map(row => row.map(v => v * s))
}

export function transpose(A: Matrix): Matrix {
  return Array.from({ length: A[0].length }, (_, j) =>
    Array.from({ length: A.length }, (_, i) => A[i][j])
  )
}

export function determinant(A: Matrix): number {
  const n = A.length
  if (A.some(row => row.length !== n)) throw new Error('Determinant requires a square matrix')
  if (n === 1) return A[0][0]
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0]
  return A[0].reduce((sum, val, j) => {
    const minor = A.slice(1).map(row => [...row.slice(0, j), ...row.slice(j + 1)])
    return sum + val * Math.pow(-1, j) * determinant(minor)
  }, 0)
}

export function cofactorMatrix(A: Matrix): Matrix {
  const n = A.length
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      const minor = A.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j))
      return Math.pow(-1, i + j) * determinant(minor)
    })
  )
}

export function inverse(A: Matrix): Matrix {
  const n = A.length
  if (A.some(row => row.length !== n)) throw new Error('Inverse requires a square matrix')
  const det = determinant(A)
  if (Math.abs(det) < 1e-10) throw new Error('Matrix is singular (determinant = 0) — no inverse exists')
  if (n === 1) return [[1 / A[0][0]]]
  const cof = cofactorMatrix(A)
  const adj = transpose(cof)
  return adj.map(row => row.map(v => r6(v / det)))
}

export function trace(A: Matrix): number {
  if (A.length !== A[0].length) throw new Error('Trace requires a square matrix')
  return A.reduce((sum, row, i) => sum + row[i], 0)
}

export function rank(A: Matrix): number {
  // Gaussian elimination to find rank
  const mat = A.map(row => [...row])
  const rows = mat.length, cols = mat[0].length
  let r = 0
  for (let c = 0; c < cols && r < rows; c++) {
    let pivot = -1
    for (let i = r; i < rows; i++) {
      if (Math.abs(mat[i][c]) > 1e-10) { pivot = i; break }
    }
    if (pivot === -1) continue
    ;[mat[r], mat[pivot]] = [mat[pivot], mat[r]]
    const scale = mat[r][c]
    for (let j = c; j < cols; j++) mat[r][j] /= scale
    for (let i = 0; i < rows; i++) {
      if (i !== r && Math.abs(mat[i][c]) > 1e-10) {
        const factor = mat[i][c]
        for (let j = c; j < cols; j++) mat[i][j] -= factor * mat[r][j]
      }
    }
    r++
  }
  return r
}

// Gauss-Jordan elimination for solving Ax = b
export function solveLinear(A: Matrix, b: number[]): number[] | null {
  const n = A.length
  const aug = A.map((row, i) => [...row, b[i]])
  for (let col = 0; col < n; col++) {
    let maxRow = col
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r][col]) > Math.abs(aug[maxRow][col])) maxRow = r
    }
    ;[aug[col], aug[maxRow]] = [aug[maxRow], aug[col]]
    if (Math.abs(aug[col][col]) < 1e-12) return null
    const pivot = aug[col][col]
    for (let j = col; j <= n; j++) aug[col][j] /= pivot
    for (let r = 0; r < n; r++) {
      if (r !== col) {
        const f = aug[r][col]
        for (let j = col; j <= n; j++) aug[r][j] -= f * aug[col][j]
      }
    }
  }
  return aug.map(row => r6(row[n]))
}

function r6(n: number) { return Math.round(n * 1000000) / 1000000 }

export function parseMatrix(raw: string): Matrix {
  const rows = raw.trim().split('\n').map(line =>
    line.trim().split(/[\s,;]+/).map(Number).filter(n => !isNaN(n))
  ).filter(row => row.length > 0)
  if (rows.length === 0) throw new Error('Empty matrix')
  const cols = rows[0].length
  if (rows.some(r => r.length !== cols)) throw new Error('Unequal row lengths')
  return rows
}

export function matrixToString(M: Matrix, decimals = 4): string {
  return M.map(row => row.map(v => {
    const rounded = Math.round(v * Math.pow(10, decimals)) / Math.pow(10, decimals)
    return String(rounded)
  }).join('\t')).join('\n')
}

export function isSquare(M: Matrix) { return M.length === M[0].length }