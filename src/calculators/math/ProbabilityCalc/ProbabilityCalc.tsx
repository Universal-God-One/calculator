import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import {
  calcBasic, calcBinomial, calcNormal,
  combinations, permutations, factorial,
} from './probabilityEngine'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine, Cell,
} from 'recharts'
import s from './ProbabilityCalc.module.css'

type Tab = 'basic' | 'binomial' | 'normal' | 'combinatorics'

const FAQS = [
  { q: 'What is the difference between permutations and combinations?', a: 'Permutations count arrangements where order matters (PIN codes, race placements). Combinations count selections where order doesn\'t matter (lottery numbers, committee members). P(n,r) = n!/(n−r)!, C(n,r) = n!/(r!(n−r)!).' },
  { q: 'What is the binomial distribution?', a: 'The binomial distribution models the number of successes in n independent trials, each with probability p. For example: flipping a coin 10 times, probability of getting exactly 6 heads. Mean = np, variance = np(1-p).' },
  { q: 'What is a normal distribution?', a: 'The normal (Gaussian) distribution is a bell-shaped curve defined by mean μ and standard deviation σ. About 68% of values fall within 1σ, 95% within 2σ, and 99.7% within 3σ of the mean (the 68-95-99.7 rule).' },
  { q: 'What is a z-score?', a: 'A z-score measures how many standard deviations a value is from the mean: z = (x − μ) / σ. A z-score of 2 means the value is 2 standard deviations above the mean. Z-scores allow comparison across different normal distributions.' },
]

function r(n: number, d = 6) { return +n.toFixed(d) }
function pct(n: number) { return (n * 100).toFixed(4) + '%' }

export default function ProbabilityCalcPage() {
  const [tab, setTab] = useState<Tab>('basic')

  // Basic
  const [favorable, setFavorable] = useState('3')
  const [total, setTotal] = useState('6')
  const [p2, setP2] = useState('0.5')
  const [isIndependent, setIsIndependent] = useState(true)

  // Binomial
  const [bn, setBn] = useState('10')
  const [bk, setBk] = useState('6')
  const [bp, setBp] = useState('0.5')

  // Normal
  const [nx, setNx] = useState('75')
  const [nmu, setNmu] = useState('70')
  const [nsigma, setNsigma] = useState('10')

  // Combinatorics
  const [cn, setCn] = useState('10')
  const [cr, setCr] = useState('3')
  const [fnVal, setFnVal] = useState('7')

  // ── Computed ─────────────────────────────────────────────────────────────
  const basicResult = useMemo(() => {
    const f = parseFloat(favorable) || 0
    const t = parseFloat(total) || 0
    if (t <= 0 || f < 0 || f > t) return null
    const p2v = parseFloat(p2) || 0
    return calcBasic(f, t, p2v > 0 ? p2v : undefined, isIndependent)
  }, [favorable, total, p2, isIndependent])

  const binomialResult = useMemo(() => {
    const n = parseInt(bn) || 0; const k = parseInt(bk) || 0; const p = parseFloat(bp) || 0
    if (n <= 0 || k < 0 || k > n || p < 0 || p > 1) return null
    return calcBinomial(n, k, p)
  }, [bn, bk, bp])

  const normalResult = useMemo(() => {
    const x = parseFloat(nx); const mu = parseFloat(nmu); const sigma = parseFloat(nsigma) || 1
    if (isNaN(x) || isNaN(mu) || sigma <= 0) return null
    return calcNormal(x, mu, sigma)
  }, [nx, nmu, nsigma])

  const comboResult = useMemo(() => {
    const n = parseInt(cn) || 0; const r = parseInt(cr) || 0; const fn = parseInt(fnVal) || 0
    return {
      perm: n >= r && r >= 0 ? permutations(n, r) : NaN,
      comb: n >= r && r >= 0 ? combinations(n, r) : NaN,
      fact: fn >= 0 && fn <= 170 ? factorial(fn) : NaN,
    }
  }, [cn, cr, fnVal])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'basic', label: 'Basic Probability' },
    { id: 'binomial', label: 'Binomial' },
    { id: 'normal', label: 'Normal Distribution' },
    { id: 'combinatorics', label: 'Combinations & Permutations' },
  ]

  return (
    <>
      <SEOHead
        title="Probability Calculator – Binomial, Normal Distribution & More"
        description="Free probability calculator. Calculate basic probability, binomial distribution, normal distribution, combinations, and permutations."
        canonical="/math/probability-calculator"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>Math › Statistics</p>
            <h1 className={s.h1}>Probability Calculator</h1>
            <p className={s.sub}>Basic probability, binomial & normal distributions, combinations, and permutations.</p>
          </div>

          <AdBanner slot="31000000001" />

          <div className={s.tabs}>
            {TABS.map(t => (
              <button key={t.id} className={`${s.tab} ${tab === t.id ? s.tabActive : ''}`}
                onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {/* ── BASIC ─────────────────────────────────────────── */}
          {tab === 'basic' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Basic Probability</h2>
              <div className={s.inputRow}>
                <Field label="Favorable Outcomes">
                  <input className={s.input} type="number" value={favorable} onChange={e => setFavorable(e.target.value)} min="0" step="1" />
                </Field>
                <div className={s.divider}>/</div>
                <Field label="Total Outcomes">
                  <input className={s.input} type="number" value={total} onChange={e => setTotal(e.target.value)} min="1" step="1" />
                </Field>
              </div>

              <div className={s.separator} />
              <h3 className={s.subTitle}>Second Event (Optional)</h3>
              <div className={s.inputRow}>
                <Field label="P(B)">
                  <input className={s.input} type="number" value={p2} onChange={e => setP2(e.target.value)} min="0" max="1" step="0.01" />
                </Field>
                <div className={s.checkRow}>
                  <input type="checkbox" id="indep" checked={isIndependent} onChange={e => setIsIndependent(e.target.checked)} className={s.check} />
                  <label htmlFor="indep" className={s.checkLabel}>Independent events</label>
                </div>
              </div>

              {basicResult && (
                <div className={s.resultsGrid}>
                  <ResultCard label="P(A)" value={pct(basicResult.p)} sub={basicResult.p.toFixed(6)} accent />
                  <ResultCard label="P(A′) Complement" value={pct(basicResult.complement)} sub={basicResult.complement.toFixed(6)} />
                  <ResultCard label="Odds For" value={basicResult.odds_for} />
                  <ResultCard label="Odds Against" value={basicResult.odds_against} />
                  {basicResult.pAandB !== undefined && (
                    <ResultCard label="P(A ∩ B)" value={pct(basicResult.pAandB)} sub="A and B" />
                  )}
                  {basicResult.pAorB !== undefined && (
                    <ResultCard label="P(A ∪ B)" value={pct(basicResult.pAorB)} sub="A or B" />
                  )}
                </div>
              )}

              {basicResult && (
                <div className={s.probBar}>
                  <div className={s.probFill} style={{ width: `${basicResult.p * 100}%` }} />
                  <span className={s.probLabel}>{pct(basicResult.p)}</span>
                </div>
              )}
            </div>
          )}

          {/* ── BINOMIAL ──────────────────────────────────────── */}
          {tab === 'binomial' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Binomial Distribution</h2>
              <p className={s.cardDesc}>P(X = k) for n trials with probability p of success per trial.</p>
              <div className={s.inputRow}>
                <Field label="n (trials)"><input className={s.input} type="number" value={bn} onChange={e => setBn(e.target.value)} min="1" max="200" /></Field>
                <Field label="k (successes)"><input className={s.input} type="number" value={bk} onChange={e => setBk(e.target.value)} min="0" /></Field>
                <Field label="p (probability)"><input className={s.input} type="number" value={bp} onChange={e => setBp(e.target.value)} min="0" max="1" step="0.01" /></Field>
              </div>

              {binomialResult && (
                <>
                  <div className={s.resultsGrid}>
                    <ResultCard label="P(X = k)" value={pct(binomialResult.pmf)} accent />
                    <ResultCard label="P(X ≤ k)" value={pct(binomialResult.cdfLte)} sub="cumulative" />
                    <ResultCard label="P(X ≥ k)" value={pct(binomialResult.cdfGte)} />
                    <ResultCard label="P(X < k)" value={pct(binomialResult.cdfLt)} />
                    <ResultCard label="P(X > k)" value={pct(binomialResult.cdfGt)} />
                    <ResultCard label="Mean (np)" value={r(binomialResult.mean, 4).toString()} />
                    <ResultCard label="Std Dev" value={r(binomialResult.stddev, 4).toString()} />
                    <ResultCard label="Variance" value={r(binomialResult.variance, 4).toString()} />
                  </div>

                  <div className={s.chartWrap}>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={binomialResult.distribution.slice(0, Math.min(+bn + 1, 40))}
                        margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="k" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={55}
                          tickFormatter={v => (v * 100).toFixed(1) + '%'} />
                        <Tooltip formatter={(v: number) => pct(v)} labelFormatter={l => `k = ${l}`}
                          contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                        <ReferenceLine x={+bk} stroke="var(--accent-green)" />
                        <Bar dataKey="pmf" radius={[2, 2, 0, 0]}>
                          {binomialResult.distribution.slice(0, Math.min(+bn + 1, 40)).map((entry, index) => (
                            <Cell key={index} fill={entry.k === +bk ? '#10b981' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── NORMAL ────────────────────────────────────────── */}
          {tab === 'normal' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Normal Distribution</h2>
              <p className={s.cardDesc}>Calculate probabilities for a normal (Gaussian) distribution.</p>
              <div className={s.inputRow}>
                <Field label="x (value)"><input className={s.input} type="number" value={nx} onChange={e => setNx(e.target.value)} step="0.1" /></Field>
                <Field label="μ (mean)"><input className={s.input} type="number" value={nmu} onChange={e => setNmu(e.target.value)} step="0.1" /></Field>
                <Field label="σ (std dev)"><input className={s.input} type="number" value={nsigma} onChange={e => setNsigma(e.target.value)} min="0.001" step="0.1" /></Field>
              </div>

              {normalResult && (
                <>
                  <div className={s.resultsGrid}>
                    <ResultCard label="P(X ≤ x)" value={pct(normalResult.cdfLte)} accent />
                    <ResultCard label="P(X ≥ x)" value={pct(normalResult.cdfGte)} />
                    <ResultCard label="Z-Score" value={r(normalResult.zScore, 4).toString()} sub="(x−μ)/σ" />
                    <ResultCard label="PDF f(x)" value={r(normalResult.pdf, 6).toString()} />
                  </div>

                  <div className={s.chartWrap}>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={normalResult.curvePoints} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gNorm" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="x" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={55} />
                        <Tooltip formatter={(v: number) => v.toFixed(5)} labelFormatter={l => `x = ${l}`}
                          contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                        <ReferenceLine x={parseFloat(nx)} stroke="var(--accent-green)" strokeDasharray="4 4"
                          label={{ value: `x=${nx}`, fill: 'var(--accent-green)', fontSize: 9 }} />
                        <ReferenceLine x={parseFloat(nmu)} stroke="var(--accent-amber)" strokeDasharray="3 3"
                          label={{ value: 'μ', fill: 'var(--accent-amber)', fontSize: 10 }} />
                        <Area type="monotone" dataKey="y" stroke="#3b82f6" fill="url(#gNorm)" strokeWidth={2.5} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={s.empiricalRule}>
                    <span className={s.erTitle}>68-95-99.7 Rule</span>
                    {[1, 2, 3].map(z => {
                      const lo = parseFloat(nmu) - z * parseFloat(nsigma)
                      const hi = parseFloat(nmu) + z * parseFloat(nsigma)
                      const prob = (calcNormal(hi, parseFloat(nmu), parseFloat(nsigma) || 1).cdfLte -
                        calcNormal(lo, parseFloat(nmu), parseFloat(nsigma) || 1).cdfLte) * 100
                      return (
                        <div key={z} className={s.erRow}>
                          <span>±{z}σ ({r(lo, 2)} to {r(hi, 2)})</span>
                          <span className={s.erPct}>{prob.toFixed(2)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── COMBINATORICS ─────────────────────────────────── */}
          {tab === 'combinatorics' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Combinations & Permutations</h2>

              <div className={s.inputRow}>
                <Field label="n (total items)"><input className={s.input} type="number" value={cn} onChange={e => setCn(e.target.value)} min="0" max="170" /></Field>
                <Field label="r (chosen items)"><input className={s.input} type="number" value={cr} onChange={e => setCr(e.target.value)} min="0" /></Field>
              </div>

              <div className={s.comboResults}>
                <div className={s.comboCard}>
                  <span className={s.comboFormula}>P(n,r) = n! / (n−r)!</span>
                  <span className={s.comboLabel}>Permutations (order matters)</span>
                  <span className={s.comboValue}>{isFinite(comboResult.perm) ? comboResult.perm.toLocaleString() : 'Overflow'}</span>
                  <span className={s.comboSub}>ways to arrange {cr} from {cn}</span>
                </div>
                <div className={s.comboCard}>
                  <span className={s.comboFormula}>C(n,r) = n! / (r!(n−r)!)</span>
                  <span className={s.comboLabel}>Combinations (order doesn't matter)</span>
                  <span className={s.comboValue}>{isFinite(comboResult.comb) ? comboResult.comb.toLocaleString() : 'Overflow'}</span>
                  <span className={s.comboSub}>ways to choose {cr} from {cn}</span>
                </div>
              </div>

              <div className={s.separator} />
              <h3 className={s.subTitle}>Factorial Calculator</h3>
              <div className={s.inputRow}>
                <Field label="n">
                  <input className={s.input} type="number" value={fnVal} onChange={e => setFnVal(e.target.value)} min="0" max="170" />
                </Field>
                <div className={s.factResult}>
                  <span className={s.factLabel}>{fnVal}! =</span>
                  <span className={s.factValue}>
                    {!isNaN(comboResult.fact) && isFinite(comboResult.fact)
                      ? comboResult.fact.toLocaleString()
                      : parseInt(fnVal) > 170 ? 'Too large (> 10¹⁷⁰)' : 'Invalid'}
                  </span>
                </div>
              </div>

              <div className={s.factTable}>
                <span className={s.factTableTitle}>Quick reference</span>
                <div className={s.factGrid}>
                  {[0,1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => (
                    <div key={n} className={s.factRow}>
                      <span>{n}!</span>
                      <span>{factorial(n).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <article className={s.article}>
            <h2>Frequently Asked Questions</h2>
            <div className={s.faqs}>
              {FAQS.map((f, i) => (
                <details key={i} className={s.faq}>
                  <summary className={s.faqQ}>{f.q}</summary>
                  <p className={s.faqA}>{f.a}</p>
                </details>
              ))}
            </div>
          </article>

          <AdBanner slot="31000000002" />
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

function ResultCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`${s.resultCard} ${accent ? s.resultAccent : ''}`}>
      <span className={s.rcLabel}>{label}</span>
      <span className={s.rcValue}>{value}</span>
      {sub && <span className={s.rcSub}>{sub}</span>}
    </div>
  )
}