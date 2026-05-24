import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { solveQuadratic, getParabolaPoints } from './quadraticEngine'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import s from './QuadraticCalc.module.css'

const FAQS = [
  { question: 'What is the quadratic formula?', answer: 'The quadratic formula solves any equation in the form ax² + bx + c = 0. The solution is x = (−b ± √(b² − 4ac)) / 2a. The ± gives two possible solutions, known as the roots of the equation.' },
  { question: 'What is the discriminant?', answer: 'The discriminant is b² − 4ac. If it\'s positive, there are two distinct real roots. If zero, there is one repeated real root. If negative, there are two complex (imaginary) conjugate roots with no real solutions.' },
  { question: 'What are complex roots?', answer: 'Complex roots appear when the discriminant is negative. They take the form a ± bi, where i = √(−1). They come in conjugate pairs and represent the parabola not crossing the x-axis. Complex roots are valid mathematical solutions even though they\'re not real numbers.' },
  { question: 'What is the vertex of a parabola?', answer: 'The vertex is the highest or lowest point of the parabola. Its x-coordinate is −b/(2a) and y-coordinate is c − b²/(4a). The vertex represents the minimum (if a > 0) or maximum (if a < 0) of the quadratic function.' },
  { question: 'How do you complete the square?', answer: 'Completing the square converts ax² + bx + c into a(x + h)² + k form, where the vertex is (−h, k). To complete the square: divide by a, move c to the right, add (b/2a)² to both sides, then factor the left side as a perfect square trinomial.' },
]

const PRESETS = [
  { label: 'x² − 5x + 6', a: 1, b: -5, c: 6 },
  { label: 'x² − 4', a: 1, b: 0, c: -4 },
  { label: 'x² + 2x + 5', a: 1, b: 2, c: 5 },
  { label: '2x² + 3x − 2', a: 2, b: 3, c: -2 },
  { label: 'x² − 6x + 9', a: 1, b: -6, c: 9 },
]

export default function QuadraticCalcPage() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('-5')
  const [c, setC] = useState('6')

  const av = parseFloat(a) || 0
  const bv = parseFloat(b) || 0
  const cv = parseFloat(c) || 0

  const result = useMemo(() => {
    if (av === 0 && bv === 0 && cv === 0) return null
    return solveQuadratic(av, bv, cv)
  }, [av, bv, cv])

  const chartData = useMemo(() => {
    if (av === 0) return []
    return getParabolaPoints(av, bv, cv)
  }, [av, bv, cv])

  // clamp Y for readability
  const chartDataClamped = useMemo(() => {
    if (!chartData.length) return []
    const ys = chartData.map(p => p.y)
    const yMin = Math.min(...ys)
    const yMax = Math.max(...ys)
    const span = yMax - yMin || 1
    const lo = yMin - span * 0.1
    const hi = yMax + span * 0.1
    return chartData.filter(p => p.y >= lo && p.y <= hi)
  }, [chartData])

  const eqStr = `${av === 1 ? '' : av === -1 ? '-' : av}x² ${bv >= 0 ? '+' : ''}${bv === 0 ? '' : `${bv === 1 ? '' : bv === -1 ? '-' : bv}x`} ${cv >= 0 ? '+' : ''}${cv !== 0 ? cv : ''}`.replace(/\s+/g, ' ').trim() + ' = 0'

  return (
    <>
      <SEOHead
        title="Quadratic Formula Calculator – Solve ax² + bx + c = 0"
        description="Free quadratic formula calculator. Solve any quadratic equation step by step. Real and complex roots, discriminant, vertex, and parabola graph."
        canonical="/math/quadratic-formula-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Algebra</p>
            <h1 className={s.h1}>Quadratic Formula Calculator</h1>
            <p className={s.sub}>Solve ax² + bx + c = 0 with step-by-step solution and parabola graph.</p>
            <div className={s.formulaDisplay}>x = (−b ± √(b² − 4ac)) / 2a</div>
          </div>

          <AdBanner slot="30000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Enter Coefficients</h2>

              {/* Equation preview */}
              <div className={s.eqPreview}>
                <span className={s.eqText}>{eqStr}</span>
              </div>

              <div className={s.coeffRow}>
                <div className={s.coeffField}>
                  <label className={s.label}>a (x² coefficient)</label>
                  <input className={s.input} type="number" value={a}
                    onChange={e => setA(e.target.value)} placeholder="1" step="1" />
                  {av === 0 && <span className={s.warn}>a ≠ 0</span>}
                </div>
                <div className={s.coeffField}>
                  <label className={s.label}>b (x coefficient)</label>
                  <input className={s.input} type="number" value={b}
                    onChange={e => setB(e.target.value)} placeholder="-5" step="1" />
                </div>
                <div className={s.coeffField}>
                  <label className={s.label}>c (constant)</label>
                  <input className={s.input} type="number" value={c}
                    onChange={e => setC(e.target.value)} placeholder="6" step="1" />
                </div>
              </div>

              <div className={s.presets}>
                <span className={s.presetsLabel}>Examples:</span>
                <div className={s.presetBtns}>
                  {PRESETS.map(p => (
                    <button key={p.label} className={s.presetBtn}
                      onClick={() => { setA(String(p.a)); setB(String(p.b)); setC(String(p.c)) }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {result && result.type !== 'not_quadratic' ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Solution</h2>

                {result.type === 'two_real' && (
                  <div className={s.rootsDisplay}>
                    <div className={s.rootBadge}>
                      <span className={s.rootLabel}>x₁</span>
                      <span className={s.rootValue}>{result.x1}</span>
                    </div>
                    <div className={s.rootBadge}>
                      <span className={s.rootLabel}>x₂</span>
                      <span className={s.rootValue}>{result.x2}</span>
                    </div>
                  </div>
                )}
                {result.type === 'one_real' && (
                  <div className={s.rootsDisplay}>
                    <div className={`${s.rootBadge} ${s.rootBadgeSingle}`}>
                      <span className={s.rootLabel}>x (repeated)</span>
                      <span className={s.rootValue}>{result.x1}</span>
                    </div>
                  </div>
                )}
                {result.type === 'complex' && (
                  <div className={s.rootsDisplay}>
                    <div className={`${s.rootBadge} ${s.rootBadgeComplex}`}>
                      <span className={s.rootLabel}>x₁</span>
                      <span className={s.rootValue}>{result.realPart} + {result.imagPart}i</span>
                    </div>
                    <div className={`${s.rootBadge} ${s.rootBadgeComplex}`}>
                      <span className={s.rootLabel}>x₂</span>
                      <span className={s.rootValue}>{result.realPart} − {result.imagPart}i</span>
                    </div>
                  </div>
                )}

                <div className={s.metaGrid}>
                  <MetaItem label="Discriminant (Δ)" value={String(result.discriminant)}
                    color={result.discriminant > 0 ? 'green' : result.discriminant === 0 ? 'amber' : 'red'} />
                  <MetaItem label="Root Type"
                    value={result.type === 'two_real' ? 'Two real roots' : result.type === 'one_real' ? 'One repeated root' : 'Complex roots'} />
                  <MetaItem label="Vertex" value={`(${result.vertex[0]}, ${result.vertex[1]})`} />
                  <MetaItem label="Parabola" value={av > 0 ? 'Opens upward ∪' : 'Opens downward ∩'} />
                  <MetaItem label="Axis of Symmetry" value={`x = ${result.vertex[0]}`} />
                  <MetaItem label="Y-intercept" value={`(0, ${cv})`} />
                </div>

                <details className={s.stepsDetails}>
                  <summary className={s.stepsSummary}>Step-by-step solution</summary>
                  <ol className={s.stepsList}>
                    {result.steps.map((step, i) => (
                      <li key={i} className={s.step}>{step}</li>
                    ))}
                  </ol>
                </details>
              </div>
            ) : result?.type === 'not_quadratic' ? (
              <div className={s.errorCard}>
                <p className={s.errorMsg}>⚠️ {result.steps[0]}</p>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>📐</div>
                <p>Enter coefficients a, b, and c to solve the equation.</p>
              </div>
            )}
          </div>

          {av !== 0 && chartDataClamped.length > 0 && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Parabola Graph</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartDataClamped} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="x" tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    type="number" domain={['dataMin', 'dataMax']} tickCount={9} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={50} />
                  <Tooltip
                    formatter={(v: number) => [v.toFixed(3), 'y']}
                    labelFormatter={(l: number) => `x = ${(+l).toFixed(3)}`}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <ReferenceLine y={0} stroke="var(--text-muted)" strokeWidth={1.5} />
                  <ReferenceLine x={0} stroke="var(--text-muted)" strokeWidth={1.5} />
                  {result?.type === 'two_real' && (
                    <>
                      <ReferenceLine x={result.x1} stroke="var(--accent-green)" strokeDasharray="4 4"
                        label={{ value: `x₁=${result.x1}`, fill: 'var(--accent-green)', fontSize: 9 }} />
                      <ReferenceLine x={result.x2} stroke="var(--accent-green)" strokeDasharray="4 4"
                        label={{ value: `x₂=${result.x2}`, fill: 'var(--accent-green)', fontSize: 9 }} />
                    </>
                  )}
                  {result?.type === 'one_real' && (
                    <ReferenceLine x={result.x1} stroke="var(--accent-amber)" strokeDasharray="4 4"
                      label={{ value: `x=${result.x1}`, fill: 'var(--accent-amber)', fontSize: 9 }} />
                  )}
                  {result?.type !== 'not_quadratic' && result && (
                    <ReferenceLine x={result.vertex[0]} stroke="rgba(59,130,246,0.4)" strokeDasharray="2 4" />
                  )}
                  <Line type="monotone" dataKey="y" stroke="#3b82f6" dot={false} strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
              <p className={s.chartNote}>Green dashed lines = roots · Blue dashed = axis of symmetry</p>
            </div>
          )}

          <article className={s.article}>
            <h2>The Quadratic Formula</h2>
            <p>For any equation ax² + bx + c = 0 (where a ≠ 0), the solutions are x = (−b ± √(b² − 4ac)) / 2a. The ± symbol means there are generally two solutions: one using + and one using −.</p>
            <h2>Understanding the Discriminant</h2>
            <p>The discriminant (b² − 4ac) tells you everything about the nature of the roots before solving. Positive → two real roots (parabola crosses x-axis twice). Zero → one repeated root (parabola touches x-axis at vertex). Negative → two complex roots (parabola doesn't cross x-axis).</p>
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

          <AdBanner slot="30000000002" />
        </div>
      </div>
    </>
  )
}

function MetaItem({ label, value, color }: { label: string; value: string; color?: 'green' | 'red' | 'amber' }) {
  const colorMap = { green: 'var(--accent-green)', red: 'var(--accent-red)', amber: 'var(--accent-amber)' }
  return (
    <div className={s.metaItem}>
      <span className={s.metaLabel}>{label}</span>
      <span className={s.metaValue} style={color ? { color: colorMap[color] } : {}}>{value}</span>
    </div>
  )
}