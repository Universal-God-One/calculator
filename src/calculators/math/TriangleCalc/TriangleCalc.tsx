import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { solveSSS, solveSAS, solveASA, solveAAS, solveSSA, TriangleResult } from './triangleEngine'
import s from './TriangleCalc.module.css'

const FAQS = [
  { question: 'What is the Law of Sines?', answer: 'The Law of Sines states that a/sin(A) = b/sin(B) = c/sin(C), where a, b, c are sides and A, B, C are the opposite angles. It is used to solve triangles when you know two angles and a side (AAS/ASA) or two sides and a non-included angle (SSA).' },
  { question: 'What is the Law of Cosines?', answer: 'The Law of Cosines: c² = a² + b² - 2ab·cos(C). It generalizes the Pythagorean theorem to all triangles. Used to solve triangles when you know three sides (SSS) or two sides and the included angle (SAS).' },
  { question: 'What is the SSA ambiguous case?', answer: 'When given two sides and a non-included angle (SSA), there may be 0, 1, or 2 valid triangles. If the given side opposite the angle is shorter than the height of the triangle, there is no solution. If equal to the height, there is one right triangle. Otherwise, there may be two solutions.' },
  { question: 'How is the area of a triangle calculated?', answer: 'Triangle area can be computed several ways: (1) ½ × base × height, (2) Heron\'s formula: √(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2, (3) ½ × a × b × sin(C) when two sides and the included angle are known.' },
  { question: 'What is the circumradius?', answer: 'The circumradius R is the radius of the circle that passes through all three vertices (circumscribed circle). R = abc / (4 × area). The inradius r is the radius of the largest circle that fits inside the triangle: r = area / s, where s is the semi-perimeter.' },
]

type Mode = 'SSS' | 'SAS' | 'ASA' | 'AAS' | 'SSA'

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'SSS', label: 'SSS', desc: '3 sides' },
  { id: 'SAS', label: 'SAS', desc: '2 sides + included angle' },
  { id: 'ASA', label: 'ASA', desc: '2 angles + included side' },
  { id: 'AAS', label: 'AAS', desc: '2 angles + non-included side' },
  { id: 'SSA', label: 'SSA', desc: '2 sides + non-included angle' },
]

function r(n: number, d = 4) { return +n.toFixed(d) }

export default function TriangleCalcPage() {
  const [mode, setMode] = useState<Mode>('SSS')
  const [vals, setVals] = useState<Record<string, string>>({
    a: '5', b: '7', c: '8',
    A: '40', B: '60', C: '80',
  })
  const set = (k: string, v: string) => setVals(prev => ({ ...prev, [k]: v }))
  const n = (k: string) => parseFloat(vals[k]) || 0

  const results = useMemo((): TriangleResult[] => {
    try {
      switch (mode) {
        case 'SSS': { const r = solveSSS(n('a'), n('b'), n('c')); return r ? [r] : [] }
        case 'SAS': { const r = solveSAS(n('a'), n('C'), n('b')); return r ? [r] : [] }
        case 'ASA': { const r = solveASA(n('A'), n('c'), n('B')); return r ? [r] : [] }
        case 'AAS': { const r = solveAAS(n('A'), n('B'), n('a')); return r ? [r] : [] }
        case 'SSA': return solveSSA(n('a'), n('b'), n('A'))
        default: return []
      }
    } catch { return [] }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, vals])

  return (
    <>
      <SEOHead
        title="Triangle Calculator – Solve Any Triangle (SSS, SAS, ASA, AAS, SSA)"
        description="Free triangle calculator. Solve any triangle using SSS, SAS, ASA, AAS, or SSA. Find all sides, angles, area, perimeter, inradius, and circumradius with step-by-step solutions."
        canonical="/math/triangle-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Geometry</p>
            <h1 className={s.h1}>Triangle Calculator</h1>
            <p className={s.sub}>Solve any triangle. Find all sides, angles, area, perimeter, inradius, and circumradius.</p>
          </div>

          <AdBanner slot="34000000001" />

          {/* Mode selector */}
          <div className={s.modeGrid}>
            {MODES.map(m => (
              <button key={m.id}
                className={`${s.modeBtn} ${mode === m.id ? s.modeActive : ''}`}
                onClick={() => setMode(m.id)}>
                <span className={s.modeId}>{m.id}</span>
                <span className={s.modeDesc}>{m.desc}</span>
              </button>
            ))}
          </div>

          <div className={s.mainGrid}>
            {/* Input panel */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Known Values</h2>
              <div className={s.triangleDiagram}>
                <TriangleDiagram mode={mode} result={results[0] ?? null} />
              </div>

              <div className={s.inputGrid}>
                {mode === 'SSS' && (
                  <>
                    <NumField label="Side a" value={vals.a} onChange={v => set('a', v)} />
                    <NumField label="Side b" value={vals.b} onChange={v => set('b', v)} />
                    <NumField label="Side c" value={vals.c} onChange={v => set('c', v)} />
                  </>
                )}
                {mode === 'SAS' && (
                  <>
                    <NumField label="Side a" value={vals.a} onChange={v => set('a', v)} />
                    <NumField label="Angle C (°)" value={vals.C} onChange={v => set('C', v)} />
                    <NumField label="Side b" value={vals.b} onChange={v => set('b', v)} />
                  </>
                )}
                {mode === 'ASA' && (
                  <>
                    <NumField label="Angle A (°)" value={vals.A} onChange={v => set('A', v)} />
                    <NumField label="Side c" value={vals.c} onChange={v => set('c', v)} />
                    <NumField label="Angle B (°)" value={vals.B} onChange={v => set('B', v)} />
                  </>
                )}
                {mode === 'AAS' && (
                  <>
                    <NumField label="Angle A (°)" value={vals.A} onChange={v => set('A', v)} />
                    <NumField label="Angle B (°)" value={vals.B} onChange={v => set('B', v)} />
                    <NumField label="Side a" value={vals.a} onChange={v => set('a', v)} />
                  </>
                )}
                {mode === 'SSA' && (
                  <>
                    <NumField label="Side a (opp. A)" value={vals.a} onChange={v => set('a', v)} />
                    <NumField label="Side b" value={vals.b} onChange={v => set('b', v)} />
                    <NumField label="Angle A (°)" value={vals.A} onChange={v => set('A', v)} />
                  </>
                )}
              </div>

              {mode === 'SSA' && (
                <div className={s.ssaNote}>⚠️ SSA may produce 0, 1, or 2 solutions (ambiguous case)</div>
              )}
            </div>

            {/* Results */}
            <div className={s.resultsArea}>
              {results.length === 0 && (
                <div className={s.empty}>
                  <div className={s.emptyIcon}>📐</div>
                  <p>Enter values to solve the triangle. Check that the values form a valid triangle.</p>
                </div>
              )}
              {results.map((res, ri) => (
                <div key={ri} className={`${s.resultCard} animate-in`}>
                  {results.length > 1 && <div className={s.solLabel}>Solution {ri + 1}</div>}
                  <div className={s.typeBadge}>{res.type} Triangle</div>

                  <div className={s.sidesAngles}>
                    <div className={s.saGroup}>
                      <span className={s.saTitle}>Sides</span>
                      <SaRow label="a" value={r(res.a)} />
                      <SaRow label="b" value={r(res.b)} />
                      <SaRow label="c" value={r(res.c)} />
                    </div>
                    <div className={s.saGroup}>
                      <span className={s.saTitle}>Angles</span>
                      <SaRow label="A" value={r(res.A) + '°'} />
                      <SaRow label="B" value={r(res.B) + '°'} />
                      <SaRow label="C" value={r(res.C) + '°'} />
                    </div>
                  </div>

                  <div className={s.metaGrid}>
                    <MetaItem label="Area" value={r(res.area)} />
                    <MetaItem label="Perimeter" value={r(res.perimeter)} />
                    <MetaItem label="Semi-perimeter" value={r(res.semiPerimeter)} />
                    <MetaItem label="Inradius" value={r(res.inradius)} />
                    <MetaItem label="Circumradius" value={r(res.circumradius)} />
                    <MetaItem label="Height hₐ" value={r(res.height_a)} />
                    <MetaItem label="Height h_b" value={r(res.height_b)} />
                    <MetaItem label="Height h_c" value={r(res.height_c)} />
                  </div>

                  <details className={s.stepsWrap}>
                    <summary className={s.stepsSummary}>Step-by-step solution</summary>
                    <ol className={s.steps}>
                      {res.steps.map((step, i) => <li key={i} className={s.step}>{step}</li>)}
                    </ol>
                  </details>
                </div>
              ))}
            </div>
          </div>

          <article className={s.article}>
            <h2>How to Solve a Triangle</h2>
            <p>To uniquely determine a triangle, you need at least 3 pieces of information (sides and/or angles), with at least one being a side length. The five cases are SSS (three sides), SAS (two sides + included angle), ASA (two angles + included side), AAS (two angles + non-included side), and SSA (two sides + non-included angle, which may have two solutions).</p>
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

          <AdBanner slot="34000000002" />
        </div>
      </div>
    </>
  )
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className={s.numField}>
      <label className={s.numLabel}>{label}</label>
      <input className={s.numInput} type="number" value={value} onChange={e => onChange(e.target.value)} min="0" step="0.1" />
    </div>
  )
}

function SaRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className={s.saRow}>
      <span className={s.saLabel}>{label}</span>
      <span className={s.saValue}>{value}</span>
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: number | string }) {
  return (
    <div className={s.metaItem}>
      <span className={s.metaLabel}>{label}</span>
      <span className={s.metaValue}>{value}</span>
    </div>
  )
}

function TriangleDiagram({ mode, result }: { mode: string; result: TriangleResult | null }) {
  const W = 200, H = 160, pad = 24
  // Compute vertex positions from result or show generic
  let pts: [number, number][] = [[pad, H - pad], [W - pad, H - pad], [W / 2, pad]]

  if (result) {
    const { a, b, c } = result
    // Place A at origin, B at (c, 0), compute C
    const Cx = (b * b + c * c - a * a) / (2 * c)
    const Cy = Math.sqrt(Math.max(0, b * b - Cx * Cx))
    // Scale to fit
    const maxX = c, maxY = Cy
    const scale = Math.min((W - 2 * pad) / maxX, (H - 2 * pad) / maxY) * 0.9
    const ox = pad + (W - 2 * pad - c * scale) / 2
    const oy = H - pad
    pts = [
      [ox, oy],
      [ox + c * scale, oy],
      [ox + Cx * scale, oy - Cy * scale],
    ]
  }

  const [A, B, C] = pts
  const labels = [
    { pos: [A[0] - 14, A[1] + 5], text: 'A', side: 'a' },
    { pos: [B[0] + 6, B[1] + 5], text: 'B', side: 'b' },
    { pos: [C[0], C[1] - 8], text: 'C', side: 'c' },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={s.diagram}>
      <polygon points={pts.map(p => p.join(',')).join(' ')} className={s.triPoly} />
      {labels.map(l => (
        <text key={l.text} x={l.pos[0]} y={l.pos[1]} className={s.triLabel}>{l.text}</text>
      ))}
      {/* Side labels */}
      <text x={(B[0] + C[0]) / 2 + 8} y={(B[1] + C[1]) / 2} className={s.triSide}>a</text>
      <text x={(A[0] + C[0]) / 2 - 12} y={(A[1] + C[1]) / 2} className={s.triSide}>b</text>
      <text x={(A[0] + B[0]) / 2} y={(A[1] + B[1]) / 2 + 14} className={s.triSide}>c</text>
    </svg>
  )
}