import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcLog, calcAllLogs, antilog, logIdentities, logCurvePoints } from './logEngine'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import s from './LogCalc.module.css'

const FAQS = [
  { question: 'What is a logarithm?', answer: 'A logarithm answers the question: "What exponent do I need to raise the base to, to get this number?" log_b(x) = y means b^y = x. For example, log_10(1000) = 3 because 10³ = 1000.' },
  { question: 'What is the difference between log and ln?', answer: 'log (common logarithm) uses base 10. ln (natural logarithm) uses base e ≈ 2.71828. log₂ uses base 2 and is common in computer science. All are logarithms — they just use different bases.' },
  { question: 'What are the logarithm laws?', answer: 'The three main laws are: Product rule: log(ab) = log(a) + log(b). Quotient rule: log(a/b) = log(a) − log(b). Power rule: log(aⁿ) = n·log(a). These let you break complex logarithms into simpler parts.' },
  { question: 'What is the change of base formula?', answer: 'log_b(x) = log_a(x) / log_a(b). This converts a logarithm in any base to base 10 or natural log, which most calculators support. For example: log_3(81) = log(81)/log(3) = log₁₀(81)/log₁₀(3).' },
  { question: 'What is an antilogarithm?', answer: 'The antilogarithm (antilog) is the inverse of a logarithm. If log_b(x) = y, then the antilog is b^y = x. Antilog_10(3) = 10³ = 1000. It\'s simply raising the base to the power of the logarithm value.' },
]

type Tab = 'log' | 'antilog' | 'identities' | 'graph'

function r(n: number, d = 6) { return +n.toFixed(d) }

export default function LogCalcPage() {
  const [tab, setTab] = useState<Tab>('log')

  // Log
  const [value, setValue] = useState('100')
  const [base, setBase] = useState('10')

  // Antilog
  const [aBase, setABase] = useState('10')
  const [aExp, setAExp] = useState('3')

  // Identities
  const [idA, setIdA] = useState('8')
  const [idB, setIdB] = useState('4')
  const [idBase, setIdBase] = useState('2')

  // Graph
  const [gBase, setGBase] = useState('10')

  const logResult = useMemo(() => {
    const v = parseFloat(value), b = parseFloat(base)
    if (isNaN(v) || isNaN(b) || v <= 0 || b <= 0 || b === 1) return null
    try { return calcLog(v, b) } catch { return null }
  }, [value, base])

  const allLogs = useMemo(() => {
    const v = parseFloat(value)
    if (isNaN(v) || v <= 0) return null
    try { return calcAllLogs(v) } catch { return null }
  }, [value])

  const antilogResult = useMemo(() => {
    const b = parseFloat(aBase), e = parseFloat(aExp)
    if (isNaN(b) || isNaN(e) || b <= 0 || b === 1) return null
    return antilog(b, e)
  }, [aBase, aExp])

  const identResult = useMemo(() => {
    const a = parseFloat(idA), b = parseFloat(idB), bs = parseFloat(idBase)
    if (isNaN(a) || isNaN(b) || isNaN(bs) || a <= 0 || b <= 0 || bs <= 0 || bs === 1) return null
    try { return logIdentities(a, b, bs) } catch { return null }
  }, [idA, idB, idBase])

  const curveData = useMemo(() => {
    const b = parseFloat(gBase)
    if (isNaN(b) || b <= 0 || b === 1) return []
    return logCurvePoints(b)
  }, [gBase])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'log', label: 'Log / ln / log₂' },
    { id: 'antilog', label: 'Antilogarithm' },
    { id: 'identities', label: 'Log Laws' },
    { id: 'graph', label: 'Graph' },
  ]

  return (
    <>
      <SEOHead
        title="Log Calculator – Logarithm, ln, Antilog & Log Laws"
        description="Free logarithm calculator. Calculate log base 10, natural log (ln), log base 2, antilog, and verify log laws with step-by-step solutions."
        canonical="/math/log-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Algebra</p>
            <h1 className={s.h1}>Log Calculator</h1>
            <p className={s.sub}>Calculate logarithms in any base, antilogarithms, and explore the laws of logarithms.</p>
            <div className={s.formulaBadge}>log_b(x) = y ↔ b^y = x</div>
          </div>

          <AdBanner slot="36000000001" />

          <div className={s.tabs}>
            {TABS.map(t => (
              <button key={t.id} className={`${s.tab} ${tab === t.id ? s.tabActive : ''}`}
                onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {/* ── LOG TAB ─────────────────────────────────── */}
          {tab === 'log' && (
            <div className={`${s.mainGrid} animate-in`}>
              <div className={s.inputCard}>
                <h2 className={s.cardTitle}>Calculate Logarithm</h2>
                <div className={s.fieldRow}>
                  <div className={s.field}>
                    <label className={s.label}>Value (x)</label>
                    <input className={s.input} type="number" value={value}
                      onChange={e => setValue(e.target.value)} min="0.001" step="1" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Base (b)</label>
                    <input className={s.input} type="number" value={base}
                      onChange={e => setBase(e.target.value)} min="0.001" step="1" />
                    <div className={s.baseBtns}>
                      {['2','e','10'].map(b => (
                        <button key={b} className={`${s.baseBtn} ${base === b || (b === 'e' && base === String(Math.E)) ? s.baseBtnActive : ''}`}
                          onClick={() => setBase(b === 'e' ? String(Math.E) : b)}>{b === 'e' ? 'e' : b}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {logResult && (
                  <div className={s.stepBox}>
                    <div className={s.stepTitle}>Solution</div>
                    {logResult.steps.map((step, i) => (
                      <div key={i} className={s.stepLine}>{step}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className={s.resultsCard}>
                <h2 className={s.cardTitle}>Results</h2>
                {logResult && (
                  <div className={s.mainResult}>
                    <span className={s.mainResultLabel}>log_{base}({value})</span>
                    <span className={s.mainResultVal}>{r(logResult.result)}</span>
                  </div>
                )}

                {allLogs && (
                  <div className={s.allLogs}>
                    <h3 className={s.allLogsTitle}>All Common Logarithms of {value}</h3>
                    <LogRow label="log₁₀(x)" formula="Common log" value={r(allLogs.log10)} />
                    <LogRow label="ln(x)" formula="Natural log (base e)" value={r(allLogs.ln)} />
                    <LogRow label="log₂(x)" formula="Binary log" value={r(allLogs.log2)} />
                  </div>
                )}

                {logResult && (
                  <div className={s.verify}>
                    <span className={s.verifyLabel}>Verify:</span>
                    <span className={s.verifyVal}>{base}^{r(logResult.result, 4)} = {r(Math.pow(parseFloat(base), logResult.result), 6)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ANTILOG TAB ─────────────────────────────── */}
          {tab === 'antilog' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Antilogarithm (Inverse Log)</h2>
              <p className={s.cardDesc}>Find x given log_b(x) = y. The antilog is b^y = x.</p>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Base (b)</label>
                  <input className={s.input} type="number" value={aBase} onChange={e => setABase(e.target.value)} min="0.001" />
                  <div className={s.baseBtns}>
                    {['2','e','10'].map(b => (
                      <button key={b} className={`${s.baseBtn} ${aBase === b || (b === 'e' && aBase === String(Math.E)) ? s.baseBtnActive : ''}`}
                        onClick={() => setABase(b === 'e' ? String(Math.E) : b)}>{b === 'e' ? 'e' : b}</button>
                    ))}
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Exponent (y)</label>
                  <input className={s.input} type="number" value={aExp} onChange={e => setAExp(e.target.value)} step="0.1" />
                </div>
              </div>

              {antilogResult !== null && (
                <div className={s.antiResult}>
                  <div className={s.antiFormula}>log_{aBase}(x) = {aExp}</div>
                  <div className={s.antiArrow}>↓</div>
                  <div className={s.antiAnswer}>x = {aBase}^{aExp} = <span className={s.antiVal}>{r(antilogResult)}</span></div>
                </div>
              )}

              <div className={s.antiTable}>
                <h3 className={s.antiTableTitle}>Common Antilog Reference</h3>
                <div className={s.antiGrid}>
                  {[0,1,2,3,-1,-2].map(exp => (
                    <div key={exp} className={s.antiRow}>
                      <span>antilog₁₀({exp})</span>
                      <span className={s.antiRowVal}>{Math.pow(10, exp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── IDENTITIES TAB ─────────────────────────── */}
          {tab === 'identities' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Logarithm Laws</h2>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>a</label>
                  <input className={s.input} type="number" value={idA} onChange={e => setIdA(e.target.value)} min="0.001" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>b</label>
                  <input className={s.input} type="number" value={idB} onChange={e => setIdB(e.target.value)} min="0.001" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Base</label>
                  <input className={s.input} type="number" value={idBase} onChange={e => setIdBase(e.target.value)} min="0.001" />
                </div>
              </div>

              {identResult && (
                <div className={s.lawsGrid}>
                  <LawCard
                    name="Product Rule"
                    formula="log(a·b) = log(a) + log(b)"
                    identity={identResult.product.identity}
                    lhs={r(identResult.product.lhs)}
                    rhs={r(identResult.product.rhs)}
                  />
                  <LawCard
                    name="Quotient Rule"
                    formula="log(a/b) = log(a) − log(b)"
                    identity={identResult.quotient.identity}
                    lhs={r(identResult.quotient.lhs)}
                    rhs={r(identResult.quotient.rhs)}
                  />
                  <LawCard
                    name="Power Rule"
                    formula="log(aᵇ) = b·log(a)"
                    identity={identResult.power.identity}
                    lhs={r(identResult.power.lhs)}
                    rhs={r(identResult.power.rhs)}
                  />
                  <LawCard
                    name="Change of Base"
                    formula="log_b(a) = log(a)/log(b)"
                    identity={identResult.change.identity}
                    lhs={r(identResult.change.value)}
                    rhs={r(identResult.change.value)}
                    noCompare
                  />
                </div>
              )}
            </div>
          )}

          {/* ── GRAPH TAB ─────────────────────────────── */}
          {tab === 'graph' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Graph y = log_b(x)</h2>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Base</label>
                  <input className={s.input} type="number" value={gBase} onChange={e => setGBase(e.target.value)} min="0.001" step="0.5" />
                  <div className={s.baseBtns}>
                    {['2','e','10'].map(b => (
                      <button key={b} className={`${s.baseBtn} ${gBase === b || (b === 'e' && gBase === String(Math.E)) ? s.baseBtnActive : ''}`}
                        onClick={() => setGBase(b === 'e' ? String(Math.E) : b)}>{b === 'e' ? 'e' : b}</button>
                    ))}
                  </div>
                </div>
              </div>
              {curveData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={curveData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="x" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} type="number" domain={[0, 10]} tickCount={11} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={40} domain={[-3, 3]} />
                    <Tooltip formatter={(v: number) => v.toFixed(4)} labelFormatter={l => `x = ${l}`}
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                    <ReferenceLine y={0} stroke="var(--text-muted)" strokeWidth={1.5} />
                    <ReferenceLine x={1} stroke="var(--accent-amber)" strokeDasharray="3 3"
                      label={{ value: 'x=1', fill: 'var(--accent-amber)', fontSize: 9 }} />
                    <Line type="monotone" dataKey="y" stroke="#3b82f6" dot={false} strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              <p className={s.graphNote}>y = log_{gBase}(x) passes through (1, 0) and ({r(parseFloat(gBase) || 10, 2)}, 1)</p>
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

          <AdBanner slot="36000000002" />
        </div>
      </div>
    </>
  )
}

function LogRow({ label, formula, value }: { label: string; formula: string; value: number }) {
  return (
    <div className={s.logRow}>
      <div><span className={s.logLabel}>{label}</span><span className={s.logFormula}> — {formula}</span></div>
      <span className={s.logVal}>{value}</span>
    </div>
  )
}

function LawCard({ name, formula, identity, lhs, rhs, noCompare }: {
  name: string; formula: string; identity: string; lhs: number; rhs: number; noCompare?: boolean
}) {
  const match = !noCompare && Math.abs(lhs - rhs) < 0.0001
  return (
    <div className={s.lawCard}>
      <div className={s.lawName}>{name}</div>
      <div className={s.lawFormula}>{formula}</div>
      <div className={s.lawExample}>{identity}</div>
      {!noCompare && (
        <div className={s.lawCheck}>
          <span>LHS = {lhs}</span>
          <span>RHS = {rhs}</span>
          <span className={match ? s.matchYes : s.matchNo}>{match ? '✓ Equal' : '✗ Check inputs'}</span>
        </div>
      )}
    </div>
  )
}