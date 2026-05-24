import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import {
  parseMatrix, add, subtract, multiply, transpose, determinant,
  inverse, trace, rank, scalarMultiply, identity, zeros,
  matrixToString, isSquare, Matrix
} from './matrixEngine'
import s from './MatrixCalc.module.css'

const FAQS = [
  { question: 'When can you multiply two matrices?', answer: 'Matrix multiplication A×B is only possible when the number of columns in A equals the number of rows in B. A 3×2 matrix can be multiplied by a 2×4 matrix, yielding a 3×4 result. The order matters — A×B ≠ B×A in general.' },
  { question: 'What is the determinant?', answer: 'The determinant is a scalar value computed from a square matrix that tells you if the matrix is invertible (det ≠ 0) or singular (det = 0). Geometrically, |det(A)| gives the scaling factor for areas/volumes when the linear transformation A is applied.' },
  { question: 'What is the inverse of a matrix?', answer: 'A matrix A⁻¹ is the inverse of A if A × A⁻¹ = I (the identity matrix). Only square matrices with non-zero determinant have inverses. A⁻¹ = adj(A) / det(A), where adj(A) is the adjugate (transpose of the cofactor matrix).' },
  { question: 'What is matrix rank?', answer: 'The rank of a matrix is the number of linearly independent rows (or columns). It equals the number of non-zero rows after row reduction (Gaussian elimination). Rank tells you the dimension of the column space and is important for determining if a system of equations has solutions.' },
]

type Op = 'add' | 'subtract' | 'multiply' | 'transpose' | 'determinant' | 'inverse' | 'scalar' | 'properties'

const OPS: { id: Op; label: string; needsB: boolean; needsSquare?: boolean }[] = [
  { id: 'add', label: 'A + B', needsB: true },
  { id: 'subtract', label: 'A − B', needsB: true },
  { id: 'multiply', label: 'A × B', needsB: true },
  { id: 'scalar', label: 'k × A', needsB: false },
  { id: 'transpose', label: 'Aᵀ', needsB: false },
  { id: 'determinant', label: 'det(A)', needsB: false, needsSquare: true },
  { id: 'inverse', label: 'A⁻¹', needsB: false, needsSquare: true },
  { id: 'properties', label: 'Properties', needsB: false },
]

function r(n: number) { return Math.round(n * 10000) / 10000 }

function renderMatrix(M: Matrix) {
  return (
    <div className={s.matrixDisplay}>
      <span className={s.bracket}>[</span>
      <div className={s.matrixRows}>
        {M.map((row, i) => (
          <div key={i} className={s.matrixRow}>
            {row.map((v, j) => (
              <span key={j} className={s.matrixCell}>{r(v)}</span>
            ))}
          </div>
        ))}
      </div>
      <span className={s.bracket}>]</span>
    </div>
  )
}

const DEFAULT_A = '1 2\n3 4'
const DEFAULT_B = '5 6\n7 8'

export default function MatrixCalcPage() {
  const [op, setOp] = useState<Op>('multiply')
  const [rawA, setRawA] = useState(DEFAULT_A)
  const [rawB, setRawB] = useState(DEFAULT_B)
  const [scalar, setScalar] = useState('2')
  const [size, setSize] = useState('2') // for generate

  const needsB = OPS.find(o => o.id === op)?.needsB ?? false

  const matA = useMemo(() => { try { return parseMatrix(rawA) } catch { return null } }, [rawA])
  const matB = useMemo(() => { try { return parseMatrix(rawB) } catch { return null } }, [rawB])

  const result = useMemo((): { value: Matrix | number | string | null; error: string | null } => {
    if (!matA) return { value: null, error: 'Matrix A is invalid' }
    try {
      switch (op) {
        case 'add': return { value: add(matA, matB!), error: null }
        case 'subtract': return { value: subtract(matA, matB!), error: null }
        case 'multiply': return { value: multiply(matA, matB!), error: null }
        case 'scalar': return { value: scalarMultiply(matA, parseFloat(scalar) || 0), error: null }
        case 'transpose': return { value: transpose(matA), error: null }
        case 'determinant': return { value: determinant(matA), error: null }
        case 'inverse': return { value: inverse(matA), error: null }
        case 'properties': return { value: 'properties', error: null }
        default: return { value: null, error: null }
      }
    } catch (e) {
      return { value: null, error: String(e).replace('Error: ', '') }
    }
  }, [op, matA, matB, scalar])

  const properties = useMemo(() => {
    if (!matA) return null
    try {
      const rows = matA.length, cols = matA[0].length
      const sq = isSquare(matA)
      return {
        size: `${rows} × ${cols}`,
        rank: rank(matA),
        trace: sq ? r(trace(matA)) : 'N/A (non-square)',
        det: sq ? r(determinant(matA)) : 'N/A (non-square)',
        isSquare: sq,
        isSingular: sq && Math.abs(determinant(matA)) < 1e-10,
        isSymmetric: sq && matA.every((row, i) => row.every((v, j) => Math.abs(v - matA[j][i]) < 1e-10)),
        isIdentity: sq && matA.every((row, i) => row.every((v, j) => Math.abs(v - (i === j ? 1 : 0)) < 1e-10)),
      }
    } catch { return null }
  }, [matA])

  function setPreset(which: 'identity' | 'zeros', target: 'A' | 'B') {
    const n = parseInt(size) || 2
    const M = which === 'identity' ? identity(n) : zeros(n, n)
    const str = matrixToString(M, 0)
    if (target === 'A') { setRawA(str) } else { setRawB(str) }
  }

  return (
    <>
      <SEOHead
        title="Matrix Calculator – Add, Multiply, Inverse, Determinant"
        description="Free matrix calculator. Add, subtract, multiply matrices, find transpose, determinant, inverse, rank, and trace with step-by-step results."
        canonical="/math/matrix-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Linear Algebra</p>
            <h1 className={s.h1}>Matrix Calculator</h1>
            <p className={s.sub}>Add, subtract, multiply, transpose, find determinant, inverse, rank, and matrix properties.</p>
          </div>

          <AdBanner slot="37000000001" />

          {/* Op selector */}
          <div className={s.opGrid}>
            {OPS.map(o => (
              <button key={o.id} className={`${s.opBtn} ${op === o.id ? s.opActive : ''}`}
                onClick={() => setOp(o.id)}>
                {o.label}
              </button>
            ))}
          </div>

          <div className={s.mainGrid}>
            {/* Inputs */}
            <div className={s.inputArea}>
              <div className={s.matrixInput}>
                <div className={s.matrixHeader}>
                  <h2 className={s.matLabel}>Matrix A</h2>
                  <div className={s.presetRow}>
                    <input className={s.sizeInput} type="number" value={size} onChange={e => setSize(e.target.value)} min="1" max="6" />
                    <button className={s.presetBtn} onClick={() => setPreset('identity', 'A')}>I</button>
                    <button className={s.presetBtn} onClick={() => setPreset('zeros', 'A')}>0</button>
                  </div>
                </div>
                <textarea className={s.matTextarea} value={rawA} onChange={e => setRawA(e.target.value)}
                  rows={4} placeholder="1 2&#10;3 4&#10;(rows on new lines, values space-separated)" />
                {matA && (
                  <div className={s.matMeta}>{matA.length} × {matA[0].length}</div>
                )}
              </div>

              {needsB && (
                <div className={s.matrixInput}>
                  <div className={s.matrixHeader}>
                    <h2 className={s.matLabel}>Matrix B</h2>
                    <div className={s.presetRow}>
                      <button className={s.presetBtn} onClick={() => setPreset('identity', 'B')}>I</button>
                      <button className={s.presetBtn} onClick={() => setPreset('zeros', 'B')}>0</button>
                    </div>
                  </div>
                  <textarea className={s.matTextarea} value={rawB} onChange={e => setRawB(e.target.value)}
                    rows={4} placeholder="5 6&#10;7 8" />
                  {matB && (
                    <div className={s.matMeta}>{matB.length} × {matB[0].length}</div>
                  )}
                </div>
              )}

              {op === 'scalar' && (
                <div className={s.scalarRow}>
                  <label className={s.scalarLabel}>Scalar k</label>
                  <input className={s.scalarInput} type="number" value={scalar}
                    onChange={e => setScalar(e.target.value)} step="0.1" />
                </div>
              )}
            </div>

            {/* Result */}
            <div className={s.resultArea}>
              {op === 'properties' && properties ? (
                <div className={`${s.resultCard} animate-in`}>
                  <h2 className={s.resultTitle}>Matrix A Properties</h2>
                  <div className={s.propGrid}>
                    <PropRow label="Size" value={properties.size} />
                    <PropRow label="Rank" value={String(properties.rank)} />
                    <PropRow label="Trace" value={String(properties.trace)} />
                    <PropRow label="Determinant" value={String(properties.det)} />
                    <PropRow label="Square" value={properties.isSquare ? 'Yes' : 'No'} />
                    <PropRow label="Singular" value={properties.isSingular ? 'Yes (det=0)' : 'No'} />
                    <PropRow label="Symmetric" value={properties.isSymmetric ? 'Yes' : 'No'} />
                    <PropRow label="Identity" value={properties.isIdentity ? 'Yes' : 'No'} />
                  </div>
                  {matA && (
                    <div className={s.matrixPreview}>
                      <div className={s.previewLabel}>Matrix A</div>
                      {renderMatrix(matA)}
                    </div>
                  )}
                </div>
              ) : result.error ? (
                <div className={s.errorCard}>
                  <div className={s.errorIcon}>⚠️</div>
                  <p className={s.errorMsg}>{result.error}</p>
                </div>
              ) : result.value !== null && result.value !== 'properties' ? (
                <div className={`${s.resultCard} animate-in`}>
                  <h2 className={s.resultTitle}>
                    {op === 'add' ? 'A + B' : op === 'subtract' ? 'A − B' :
                     op === 'multiply' ? 'A × B' : op === 'scalar' ? `${scalar} × A` :
                     op === 'transpose' ? 'Aᵀ' : op === 'determinant' ? 'det(A)' :
                     op === 'inverse' ? 'A⁻¹' : 'Result'}
                  </h2>

                  {typeof result.value === 'number' ? (
                    <div className={s.scalarResult}>
                      <span className={s.scalarResultVal}>{r(result.value)}</span>
                      {op === 'determinant' && (
                        <span className={s.scalarNote}>
                          {Math.abs(result.value) < 1e-10 ? 'Singular — no inverse' :
                           result.value > 0 ? 'Positive — matrix is orientation-preserving' :
                           'Negative — matrix reverses orientation'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      {renderMatrix(result.value as Matrix)}
                      <div className={s.resultMeta}>
                        {(result.value as Matrix).length} × {(result.value as Matrix)[0].length} matrix
                      </div>
                    </>
                  )}

                  {/* Show input matrices for context */}
                  {needsB && matA && matB && (
                    <div className={s.inputPreview}>
                      <div className={s.previewPair}>
                        <div className={s.previewLabel}>A ({matA.length}×{matA[0].length})</div>
                        {renderMatrix(matA)}
                      </div>
                      <div className={s.previewOp}>{op === 'add' ? '+' : op === 'subtract' ? '−' : '×'}</div>
                      <div className={s.previewPair}>
                        <div className={s.previewLabel}>B ({matB.length}×{matB[0].length})</div>
                        {renderMatrix(matB)}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={s.emptyCard}>
                  <div className={s.emptyIcon}>⊞</div>
                  <p>Enter matrix values and select an operation.</p>
                </div>
              )}
            </div>
          </div>

          <article className={s.article}>
            <h2>Frequently Asked Questions</h2>
            <div className={s.faqs}>
              {FAQS.map((f, i) => (
                <details key={i} className={s.faq}>
                  <summary className={s.faqQ}>{f.question}</summary>
                  <p className={s.faqA}>{f.answer}</p>
                </details>
              ))}
            </div>
          </article>

          <AdBanner slot="37000000002" />
        </div>
      </div>
    </>
  )
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.propRow}>
      <span className={s.propLabel}>{label}</span>
      <span className={s.propValue}>{value}</span>
    </div>
  )
}