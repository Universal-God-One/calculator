import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcZScore, buildResult, invNorm, normalCDF, generateZTable } from './zScoreEngine'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import s from './ZScoreCalc.module.css'

type Tab = 'zscore' | 'inverse' | 'table'

const FAQS = [
  { question: 'What is a z-score?', answer: 'A z-score (standard score) measures how many standard deviations a value is from the mean: z = (x − μ) / σ. A z-score of 2 means the value is 2 standard deviations above the mean. Negative z-scores indicate values below the mean.' },
  { question: 'How do you interpret z-scores?', answer: 'Z-scores between -1 and 1 are within one standard deviation (68% of a normal distribution). Between -2 and 2 covers about 95%. Beyond ±2 is considered statistically unusual and beyond ±3 is rare (0.3%). Z-scores are used to compare values from different distributions.' },
  { question: 'What is the z-table used for?', answer: 'A z-table (standard normal table) gives the cumulative probability P(Z ≤ z) for a standard normal distribution. You look up a z-score to find the probability that a random variable falls at or below that value. This is essential for hypothesis testing and confidence intervals.' },
  { question: 'What is the inverse normal (z to p)?', answer: 'The inverse normal finds the z-score corresponding to a given probability. For example, the z-score for the 95th percentile is 1.645, meaning 95% of values fall below this point in a standard normal distribution. Used to find critical values in hypothesis testing.' },
]

function pct(n: number, d = 4) { return (n * 100).toFixed(d) + '%' }
function r4(n: number) { return n.toFixed(4) }

export default function ZScoreCalcPage() {
  const [tab, setTab] = useState<Tab>('zscore')

  // Z-score from value
  const [x, setX] = useState('75')
  const [mu, setMu] = useState('70')
  const [sigma, setSigma] = useState('10')

  // Z-score direct
  const [zDirect, setZDirect] = useState('1.5')

  // Inverse
  const [prob, setProb] = useState('0.95')

  // Table
  const [tableSign, setTableSign] = useState<'positive' | 'negative'>('positive')
  const [highlight, setHighlight] = useState<string | null>(null)

  const fromValue = useMemo(() => {
    const xv = parseFloat(x), mv = parseFloat(mu), sv = parseFloat(sigma)
    if (isNaN(xv) || isNaN(mv) || isNaN(sv) || sv <= 0) return null
    return calcZScore(xv, mv, sv)
  }, [x, mu, sigma])

  const fromZ = useMemo(() => {
    const z = parseFloat(zDirect)
    if (isNaN(z)) return null
    return buildResult(z)
  }, [zDirect])

  const inverseResult = useMemo(() => {
    const p = parseFloat(prob)
    if (isNaN(p) || p <= 0 || p >= 1) return null
    const z = invNorm(p)
    return { z: r4(z), p, cdf: normalCDF(z) }
  }, [prob])

  const zTable = useMemo(() => generateZTable(tableSign), [tableSign])

  const activeResult = tab === 'zscore' ? fromValue ?? fromZ : fromZ

  // Build shaded area for chart
  function buildChartData(result: typeof fromValue, shadeType: 'left' | 'right' | 'both') {
    if (!result) return []
    const z = result.zScore
    return result.curvePoints.map(pt => {
      let shade: number | undefined
      if (shadeType === 'left' && pt.x <= z) shade = pt.y
      else if (shadeType === 'right' && pt.x >= z) shade = pt.y
      else if (shadeType === 'both' && Math.abs(pt.x) <= Math.abs(z)) shade = pt.y
      return { ...pt, shade }
    })
  }

  return (
    <>
      <SEOHead
        title="Z-Score Calculator – Standard Normal Distribution Table"
        description="Free z-score calculator. Calculate z-scores, find probabilities from the standard normal distribution, use the inverse normal, and look up z-table values."
        canonical="/math/z-score-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Statistics</p>
            <h1 className={s.h1}>Z-Score Calculator</h1>
            <p className={s.sub}>Calculate z-scores, cumulative probabilities, inverse normal, and look up z-table values.</p>
            <div className={s.formulaBadge}>z = (x − μ) / σ</div>
          </div>

          <AdBanner slot="33000000001" />

          <div className={s.tabs}>
            {([['zscore','Z-Score & Probability'],['inverse','Inverse Normal'],['table','Z-Table']] as [Tab,string][]).map(([id,label]) => (
              <button key={id} className={`${s.tab} ${tab === id ? s.tabActive : ''}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>

          {/* ── Z-SCORE TAB ─────────────────────────────────── */}
          {tab === 'zscore' && (
            <div className={`${s.mainGrid} animate-in`}>
              <div className={s.inputCard}>
                <h2 className={s.cardTitle}>Calculate Z-Score</h2>

                <div className={s.inputSection}>
                  <h3 className={s.inputSubtitle}>From a data value</h3>
                  <div className={s.fieldRow}>
                    <Field label="x (value)"><input className={s.input} type="number" value={x} onChange={e => setX(e.target.value)} step="0.1" /></Field>
                    <Field label="μ (mean)"><input className={s.input} type="number" value={mu} onChange={e => setMu(e.target.value)} step="0.1" /></Field>
                    <Field label="σ (std dev)"><input className={s.input} type="number" value={sigma} onChange={e => setSigma(e.target.value)} min="0.001" step="0.1" /></Field>
                  </div>
                </div>

                <div className={s.divider}><span>or enter z directly</span></div>

                <div className={s.inputSection}>
                  <div className={s.fieldRow}>
                    <Field label="z-score">
                      <input className={s.input} type="number" value={zDirect} onChange={e => setZDirect(e.target.value)} step="0.01" />
                    </Field>
                  </div>
                </div>
              </div>

              {fromValue && (
                <div className={s.resultsCard}>
                  <h2 className={s.cardTitle}>Results</h2>
                  <div className={s.zBig}>
                    <span className={s.zBigLabel}>Z-Score</span>
                    <span className={s.zBigValue}>{r4(fromValue.zScore)}</span>
                    <span className={s.zBigNote}>{fromValue.zScore > 0 ? `${r4(fromValue.zScore)} std devs above mean` : fromValue.zScore < 0 ? `${r4(Math.abs(fromValue.zScore))} std devs below mean` : 'At the mean'}</span>
                  </div>
                  <div className={s.probGrid}>
                    <ProbCard label="P(Z ≤ z)" sub="area to the LEFT" value={pct(fromValue.pLeft)} num={r4(fromValue.pLeft)} />
                    <ProbCard label="P(Z ≥ z)" sub="area to the RIGHT" value={pct(fromValue.pRight)} num={r4(fromValue.pRight)} />
                    <ProbCard label="P(−|z| ≤ Z ≤ |z|)" sub="area BETWEEN ±z" value={pct(fromValue.pMiddle)} num={r4(fromValue.pMiddle)} />
                    <ProbCard label="PDF f(z)" sub="height of curve at z" value={r4(fromValue.pdf)} />
                  </div>
                </div>
              )}

              {!fromValue && fromZ && (
                <div className={s.resultsCard}>
                  <h2 className={s.cardTitle}>Results (from z = {zDirect})</h2>
                  <div className={s.zBig}>
                    <span className={s.zBigLabel}>Z-Score</span>
                    <span className={s.zBigValue}>{r4(fromZ.zScore)}</span>
                  </div>
                  <div className={s.probGrid}>
                    <ProbCard label="P(Z ≤ z)" sub="area to the LEFT" value={pct(fromZ.pLeft)} num={r4(fromZ.pLeft)} />
                    <ProbCard label="P(Z ≥ z)" sub="area to the RIGHT" value={pct(fromZ.pRight)} num={r4(fromZ.pRight)} />
                    <ProbCard label="P(−|z| ≤ Z ≤ |z|)" sub="area BETWEEN ±z" value={pct(fromZ.pMiddle)} num={r4(fromZ.pMiddle)} />
                    <ProbCard label="PDF f(z)" sub="height of curve" value={r4(fromZ.pdf)} />
                  </div>
                </div>
              )}

              {(fromValue ?? fromZ) && (() => {
                const res = fromValue ?? fromZ!
                const chartData = buildChartData(res, 'left')
                return (
                  <div className={s.chartCard}>
                    <h2 className={s.chartTitle}>Standard Normal Curve — P(Z ≤ {r4(res.zScore)}) = {pct(res.pLeft)}</h2>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gShade" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="x" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickCount={9} type="number" domain={[-4, 4]} />
                        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={50} />
                        <Tooltip formatter={(v: number) => v.toFixed(5)} labelFormatter={l => `z = ${(+l).toFixed(2)}`}
                          contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                        <ReferenceLine x={res.zScore} stroke="var(--accent-green)" strokeDasharray="4 4"
                          label={{ value: `z=${r4(res.zScore)}`, fill: 'var(--accent-green)', fontSize: 9, position: 'top' }} />
                        <ReferenceLine x={0} stroke="var(--accent-amber)" strokeDasharray="3 3" />
                        <Area type="monotone" dataKey="y" stroke="#3b82f6" fill="none" strokeWidth={2} dot={false} />
                        <Area type="monotone" dataKey="shade" stroke="none" fill="url(#gShade)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )
              })()}
            </div>
          )}

          {/* ── INVERSE TAB ─────────────────────────────────── */}
          {tab === 'inverse' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Inverse Normal — Find z from probability</h2>
              <p className={s.cardDesc}>Enter a cumulative probability P(Z ≤ z) to find the corresponding z-score.</p>

              <div className={s.fieldRow}>
                <Field label="Probability P (0 to 1)">
                  <input className={s.input} type="number" value={prob} onChange={e => setProb(e.target.value)} min="0.001" max="0.999" step="0.001" />
                </Field>
              </div>

              {inverseResult && (
                <div className={s.invResult}>
                  <div className={s.invRow}>
                    <span className={s.invLabel}>Z-Score</span>
                    <span className={s.invValue}>{inverseResult.z}</span>
                  </div>
                  <div className={s.invRow}>
                    <span className={s.invLabel}>P(Z ≤ {inverseResult.z})</span>
                    <span className={s.invValue}>{pct(inverseResult.cdf)}</span>
                  </div>
                  <div className={s.invRow}>
                    <span className={s.invLabel}>Percentile</span>
                    <span className={s.invValue}>{(parseFloat(prob) * 100).toFixed(1)}th</span>
                  </div>
                </div>
              )}

              <div className={s.criticalValues}>
                <h3 className={s.cvTitle}>Common Critical Values</h3>
                <div className={s.cvGrid}>
                  {[
                    { conf: '90%', alpha: '0.10', z1: '1.645', z2: '1.282' },
                    { conf: '95%', alpha: '0.05', z1: '1.960', z2: '1.645' },
                    { conf: '98%', alpha: '0.02', z1: '2.326', z2: '2.054' },
                    { conf: '99%', alpha: '0.01', z1: '2.576', z2: '2.326' },
                  ].map(row => (
                    <div key={row.conf} className={s.cvRow}>
                      <span className={s.cvConf}>{row.conf} CI</span>
                      <span className={s.cvZ}>Two-tail: ±{row.z1}</span>
                      <span className={s.cvZ}>One-tail: {row.z2}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Z-TABLE TAB ─────────────────────────────────── */}
          {tab === 'table' && (
            <div className={`${s.card} animate-in`}>
              <div className={s.tableHeader}>
                <h2 className={s.cardTitle}>Standard Normal Z-Table — P(Z ≤ z)</h2>
                <div className={s.signToggle}>
                  <button className={`${s.signBtn} ${tableSign === 'negative' ? s.signActive : ''}`} onClick={() => setTableSign('negative')}>Negative Z</button>
                  <button className={`${s.signBtn} ${tableSign === 'positive' ? s.signActive : ''}`} onClick={() => setTableSign('positive')}>Positive Z</button>
                </div>
              </div>
              <div className={s.tableWrap}>
                <table className={s.zTable}>
                  <thead>
                    <tr>
                      <th>z</th>
                      {[0,1,2,3,4,5,6,7,8,9].map(d => <th key={d}>.0{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {zTable.map(row => (
                      <tr key={row.z}>
                        <td className={s.zRowLabel}>{row.z}</td>
                        {row.cols.map((val, ci) => {
                          const key = `${row.z}${ci}`
                          const isHl = highlight === key
                          return (
                            <td key={ci}
                              className={`${s.zCell} ${isHl ? s.zCellHl : ''}`}
                              onClick={() => setHighlight(isHl ? null : key)}
                              title={`z = ${(parseFloat(row.z) + ci * 0.01).toFixed(2)} → ${val}`}>
                              {val}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={s.tableNote}>Click any cell to highlight. Values show P(Z ≤ z) — the cumulative probability from the left.</p>
            </div>
          )}

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

          <AdBanner slot="33000000002" />
        </div>
      </div>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={s.field}>
      <label className={s.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function ProbCard({ label, sub, value, num }: { label: string; sub: string; value: string; num?: string }) {
  return (
    <div className={s.probCard}>
      <span className={s.probLabel}>{label}</span>
      <span className={s.probSub}>{sub}</span>
      <span className={s.probValue}>{value}</span>
      {num && <span className={s.probNum}>{num}</span>}
    </div>
  )
}