import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcCompound, fmtUSD, Frequency, FREQ_LABELS } from './compoundEngine'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import s from './CompoundInterest.module.css'

const FAQS = [
  { question: 'What is compound interest?',
    answer: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest (which only grows on the original principal), compound interest grows exponentially because you earn interest on your interest.' },
  { question: 'How often should interest compound for maximum growth?',
    answer: 'The more frequently interest compounds, the faster your money grows. Daily compounding produces slightly more than monthly, which produces more than annual. However, the difference between daily and monthly compounding is very small — the interest rate and time invested matter far more.' },
  { question: 'What is the Rule of 72?',
    answer: 'The Rule of 72 is a quick mental math shortcut. Divide 72 by your annual interest rate to estimate how many years it takes to double your money. For example, at 8% annual return, your money doubles in roughly 72 ÷ 8 = 9 years.' },
  { question: 'How much does a monthly contribution change the outcome?',
    answer: 'Monthly contributions have an enormous impact over long periods. Even a small monthly addition significantly boosts the final balance because those contributions also compound over time. This is why starting early and contributing consistently is the most powerful wealth-building strategy.' },
]

const FREQ_DISPLAY: Record<Frequency, string> = {
  daily: 'Daily (365×/year)',
  monthly: 'Monthly (12×/year)',
  quarterly: 'Quarterly (4×/year)',
  annually: 'Annually (1×/year)',
}

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('20')
  const [freq, setFreq] = useState<Frequency>('monthly')
  const [monthly, setMonthly] = useState('200')

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0
    const r = parseFloat(rate) || 0
    const y = parseInt(years) || 0
    const m = parseFloat(monthly) || 0
    if (p <= 0 || r <= 0 || y <= 0) return null
    return calcCompound(p, r, y, freq, m)
  }, [principal, rate, years, freq, monthly])

  const chartData = result?.schedule.map(row => ({
    year: `Year ${row.year}`,
    'Principal & Contributions': row.totalContributions,
    'Interest Earned': row.totalInterest,
  })) ?? []

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0
  const m = parseFloat(monthly) || 0

  return (
    <>
      <SEOHead
        title="Compound Interest Calculator – Free Investment Growth Tool"
        description="Free compound interest calculator. See how your money grows with daily, monthly, or annual compounding. Includes monthly contributions and a year-by-year growth chart."
        canonical="/finance/compound-interest-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>Finance › Investment</p>
            <h1 className={s.h1}>Compound Interest Calculator</h1>
            <p className={s.sub}>See how your investments grow over time with the power of compounding.</p>
          </div>

          <AdBanner slot="3000000001" />

          {/* Inputs */}
          <div className={s.inputCard}>
            <div className={s.inputGrid}>
              <Field label="Initial Investment ($)">
                <input className={s.input} type="number" value={principal} onChange={e => setPrincipal(e.target.value)} min="0" step="1000" />
              </Field>
              <Field label="Annual Interest Rate (%)">
                <input className={s.input} type="number" value={rate} onChange={e => setRate(e.target.value)} min="0" max="100" step="0.1" />
              </Field>
              <Field label="Time Period (Years)">
                <input className={s.input} type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="50" />
              </Field>
              <Field label="Monthly Contribution ($)">
                <input className={s.input} type="number" value={monthly} onChange={e => setMonthly(e.target.value)} min="0" step="50" />
              </Field>
              <Field label="Compounding Frequency">
                <select className={s.select} value={freq} onChange={e => setFreq(e.target.value as Frequency)}>
                  {FREQ_LABELS.map(f => <option key={f} value={f}>{FREQ_DISPLAY[f]}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className={`${s.resultsWrap} animate-in`}>
              <div className={s.statRow}>
                <BigStat label="Final Balance" value={fmtUSD(result.finalBalance)} color="var(--accent-green)" />
                <BigStat label="Total Contributions" value={fmtUSD(result.totalContributions)} color="var(--accent)" />
                <BigStat label="Total Interest Earned" value={fmtUSD(result.totalInterest)} color="var(--accent-amber)" />
              </div>

              <div className={s.chartCard}>
                <h2 className={s.chartTitle}>Growth Over {y} Years</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="gInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                      tickFormatter={v => v.replace('Year ', 'Yr ')} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                      tickFormatter={v => '$' + (v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v)} />
                    <Tooltip
                      formatter={(v: number) => fmtUSD(v)}
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                    <Area type="monotone" dataKey="Principal & Contributions" stackId="1"
                      stroke="#3b82f6" fill="url(#gContrib)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Interest Earned" stackId="1"
                      stroke="#10b981" fill="url(#gInterest)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Year-by-year table */}
              <div className={s.tableCard}>
                <h2 className={s.chartTitle}>Year-by-Year Schedule</h2>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Year</th><th>Year's Interest</th><th>Total Contributions</th>
                        <th>Total Interest</th><th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map(row => (
                        <tr key={row.year}>
                          <td>{row.year}</td>
                          <td className={s.green}>{fmtUSD(row.yearInterest)}</td>
                          <td>{fmtUSD(row.totalContributions)}</td>
                          <td className={s.green}>{fmtUSD(row.totalInterest)}</td>
                          <td className={s.bold}>{fmtUSD(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <AdRectangle slot="3000000002" />

          {/* SEO Article */}
          <article className={s.article}>
            <h2>How Compound Interest Works</h2>
            <p>Compound interest is often called the eighth wonder of the world — and for good reason. When your money earns interest, and that interest itself earns interest, growth accelerates exponentially over time. The longer the time horizon, the more dramatic the effect.</p>

            <p>The formula for compound interest is: <strong>A = P(1 + r/n)^(nt)</strong>, where P is principal, r is annual interest rate, n is compounding periods per year, and t is years.</p>

            {result && p > 0 && r > 0 && y > 0 && (
              <div className={s.example}>
                <h3>📊 Your Numbers</h3>
                <p>Starting with <strong>{fmtUSD(p)}</strong> at <strong>{r}% annual interest</strong> compounded <strong>{freq}</strong> for <strong>{y} years</strong>{m > 0 ? ` with ${fmtUSD(m)}/month contributions` : ''}:</p>
                <ul>
                  <li>Your money grows to <strong>{fmtUSD(result.finalBalance)}</strong></li>
                  <li>You contributed a total of <strong>{fmtUSD(result.totalContributions)}</strong></li>
                  <li>Compound interest added <strong>{fmtUSD(result.totalInterest)}</strong> — money you never had to earn</li>
                  <li>Interest makes up <strong>{((result.totalInterest / result.finalBalance) * 100).toFixed(1)}%</strong> of your final balance</li>
                </ul>
              </div>
            )}

            <h2>The Rule of 72</h2>
            <p>A quick mental shortcut: divide 72 by your annual interest rate to estimate doubling time. At 6%, money doubles in 12 years. At 9%, it doubles in 8 years. At 12%, just 6 years. This rule shows why even small differences in return rate have massive long-term consequences.</p>

            <h2>Why Monthly Contributions Matter So Much</h2>
            <p>Adding regular contributions to an investment account dramatically amplifies compound growth. Each contribution starts its own compounding journey. A person investing $200/month for 30 years at 7% accumulates far more than someone who invested a single lump sum of $72,000 (the same total dollars) at the start — because the timing and frequency of contributions affect how long each dollar compounds.</p>

            <h2>Compounding Frequency: Does It Matter?</h2>
            <p>Daily compounding produces slightly more than monthly, but the difference is minimal in practice. On a $10,000 investment at 7% for 20 years: annual compounding yields $38,697, monthly yields $40,065, and daily yields $40,138 — only $73 more than monthly. The frequency of your contributions and the interest rate matter far more than compounding frequency.</p>

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

          <AdBanner slot="3000000003" />
        </div>
      </div>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={s.field}>
      <label className={s.label}>{label}</label>
      {children}
    </div>
  )
}

function BigStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={s.bigStat}>
      <span className={s.bigLabel}>{label}</span>
      <span className={s.bigValue} style={{ color }}>{value}</span>
    </div>
  )
}
