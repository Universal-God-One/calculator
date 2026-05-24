import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcSimpleInterest } from './simpleInterestEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './SimpleInterest.module.css'

const FAQS = [
  { question: 'What is simple interest?', answer: 'Simple interest is calculated only on the original principal amount. The formula is I = P × R × T, where P is principal, R is annual rate, and T is time in years. Unlike compound interest, you do not earn interest on accumulated interest.' },
  { question: 'What is the difference between simple and compound interest?', answer: 'Simple interest is calculated only on the principal each period. Compound interest is calculated on both the principal and accumulated interest. Over time, compound interest grows much faster. For a $10,000 loan at 5% over 10 years: simple interest = $5,000 total, compound interest = $6,289 total.' },
  { question: 'Where is simple interest used?', answer: 'Simple interest is commonly used for short-term loans, car loans, personal loans, and some savings accounts. Most mortgages and long-term investments use compound interest.' },
  { question: 'How do I calculate simple interest manually?', answer: 'Use the formula I = P × R × T. For example, $5,000 at 6% for 3 years: I = 5000 × 0.06 × 3 = $900. Total amount = $5,000 + $900 = $5,900.' },
]

export default function SimpleInterestPage() {
  const [currency, setCurrency] = useState('USD')
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('5')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0
    const r = parseFloat(rate) || 0
    const y = parseInt(years) || 0
    if (p <= 0 || r <= 0 || y <= 0) return null
    return calcSimpleInterest(p, r, y)
  }, [principal, rate, years])

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0

  const chartData = result?.schedule.map(row => ({
    year: row.label,
    'Principal': p,
    'Interest': row.totalInterest,
  })) ?? []

  return (
    <>
      <SEOHead
        title="Simple Interest Calculator – I = P × R × T"
        description="Free simple interest calculator. Calculate interest earned or owed using the formula I = PRT. Compare simple vs compound interest. Supports 150+ currencies."
        canonical="/finance/simple-interest-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Interest</p>
            <h1 className={s.h1}>Simple Interest Calculator</h1>
            <p className={s.sub}>Calculate interest using the formula <strong>I = P × R × T</strong>. Fast and straightforward.</p>
          </div>

          <AdBanner slot="12000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Enter Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Principal ({sym})</label>
                <input className={s.input} type="number" value={principal}
                  onChange={e => setPrincipal(e.target.value)} min="0" step="1000" placeholder="e.g. 10000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Interest Rate (%)</label>
                <input className={s.input} type="number" value={rate}
                  onChange={e => setRate(e.target.value)} min="0" max="100" step="0.1" placeholder="e.g. 5" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Time Period (Years)</label>
                <input className={s.input} type="number" value={years}
                  onChange={e => setYears(e.target.value)} min="1" max="50" placeholder="e.g. 5" />
              </div>

              {result && (
                <div className={s.formula}>
                  <span className={s.formulaLabel}>Formula</span>
                  <span className={s.formulaText}>
                    I = {fmtMoney(p, currency)} × {r}% × {y} = <strong>{fmtMoney(result.interest, currency)}</strong>
                  </span>
                </div>
              )}
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Results</h2>

                <div className={s.bigBlock}>
                  <div className={s.bigItem}>
                    <span className={s.bigLabel}>Total Amount</span>
                    <span className={s.bigValue}>{fmtMoney(result.totalAmount, currency)}</span>
                  </div>
                  <div className={s.bigItem}>
                    <span className={s.bigLabel}>Interest Earned</span>
                    <span className={s.bigValue} style={{ color: 'var(--accent-green)' }}>{fmtMoney(result.interest, currency)}</span>
                  </div>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Principal" value={fmtMoney(p, currency)} />
                  <Stat label="Annual Rate" value={`${r}%`} />
                  <Stat label="Time Period" value={`${y} years`} />
                  <Stat label="Daily Interest" value={fmtMoney(result.dailyInterest, currency)} />
                  <Stat label="Monthly Interest" value={fmtMoney(result.monthlyInterest, currency)} />
                  <Stat label="Yearly Interest" value={fmtMoney(result.interest / y, currency)} />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🧮</div>
                <p>Enter your details to calculate simple interest.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Principal vs Interest Over {y} Years</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Bar dataKey="Principal" fill="#3b82f6" radius={[2,2,0,0]} />
                  <Bar dataKey="Interest" fill="#10b981" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Year-by-Year Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Year</th><th>Annual Interest</th><th>Total Interest</th><th>Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.period}>
                        <td>{row.period}</td>
                        <td className={s.green}>{fmtMoney(row.interest, currency)}</td>
                        <td>{fmtMoney(row.totalInterest, currency)}</td>
                        <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="12000000002" />

          <article className={s.article}>
            <h2>Simple Interest Formula: I = P × R × T</h2>
            <p>Simple interest is the most straightforward way to calculate interest. The formula has three components: <strong>P</strong> (Principal — the starting amount), <strong>R</strong> (Rate — annual interest as a decimal), and <strong>T</strong> (Time — in years).</p>

            {result && p > 0 && (
              <div className={s.example}>
                <h3>📊 Your Calculation</h3>
                <p><strong>I = {fmtMoney(p, currency)} × {r / 100} × {y}</strong></p>
                <ul>
                  <li>Interest earned: <strong>{fmtMoney(result.interest, currency)}</strong></li>
                  <li>Total amount: <strong>{fmtMoney(result.totalAmount, currency)}</strong></li>
                  <li>Daily interest: <strong>{fmtMoney(result.dailyInterest, currency)}</strong></li>
                  <li>Monthly interest: <strong>{fmtMoney(result.monthlyInterest, currency)}</strong></li>
                </ul>
              </div>
            )}

            <h2>Simple Interest vs Compound Interest</h2>
            <p>The key difference: simple interest is calculated only on the original principal every period. Compound interest is calculated on the principal plus all accumulated interest. For the same principal, rate, and time, compound interest always produces a higher total than simple interest. The longer the time period, the bigger the gap.</p>

            <h2>Where Simple Interest Is Used</h2>
            <p>Simple interest is common in short-term loans, car loans, personal loans, and some savings bonds. Most banks and investment accounts use compound interest. When borrowing money, simple interest is more favorable to the borrower; when investing, compound interest is more favorable to the investor.</p>

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

          <AdBanner slot="12000000003" />
        </div>
      </div>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.stat}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue}>{value}</span>
    </div>
  )
}