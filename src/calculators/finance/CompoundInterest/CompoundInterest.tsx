import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcCompound, Frequency, FREQ_LABELS, FREQ_DISPLAY } from './compoundEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './CompoundInterest.module.css'

const FAQS = [
  { question: 'What is compound interest?', answer: 'Compound interest is calculated on both the principal and accumulated interest. Unlike simple interest, it grows exponentially because you earn interest on your interest.' },
  { question: 'What is the Rule of 72?', answer: 'Divide 72 by your annual interest rate to estimate doubling time. At 8% return, your money doubles in roughly 9 years.' },
  { question: 'How often should interest compound?', answer: 'More frequent compounding produces slightly more growth. However, the rate and time invested matter far more than compounding frequency.' },
  { question: 'Do monthly contributions make a big difference?', answer: 'Yes — enormously. Each contribution starts its own compounding journey. Consistent contributions over time is the most powerful wealth-building strategy.' },
]

export default function CompoundInterestPage() {
  const [currency, setCurrency] = useState('USD')
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('20')
  const [freq, setFreq] = useState<Frequency>('monthly')
  const [monthly, setMonthly] = useState('200')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0
    const r = parseFloat(rate) || 0
    const y = parseInt(years) || 0
    const m = parseFloat(monthly) || 0
    if (p <= 0 || r <= 0 || y <= 0) return null
    return calcCompound(p, r, y, freq, m)
  }, [principal, rate, years, freq, monthly])

  const chartData = result?.schedule.map(row => ({
    year: `Yr ${row.year}`,
    'Contributions': row.totalContributions,
    'Interest': row.totalInterest,
  })) ?? []

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0
  const m = parseFloat(monthly) || 0

  return (
    <>
      <SEOHead
        title="Compound Interest Calculator – Investment Growth Tool"
        description="Free compound interest calculator supporting 150+ world currencies. See how your money grows with daily, monthly, or annual compounding."
        canonical="/finance/compound-interest-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>Finance › Investment</p>
            <h1 className={s.h1}>Compound Interest Calculator</h1>
            <p className={s.sub}>See how your investments grow with compounding. Supports 150+ currencies.</p>
          </div>

          <AdBanner slot="3000000001" />

          <div className={s.inputCard}>
            <div className={s.inputGrid}>
              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>Initial Investment ({sym})</label>
                <input className={s.input} type="number" value={principal} onChange={e => setPrincipal(e.target.value)} min="0" step="1000" placeholder="e.g. 10000" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Annual Interest Rate (%)</label>
                <input className={s.input} type="number" value={rate} onChange={e => setRate(e.target.value)} min="0" max="100" step="0.1" placeholder="e.g. 7" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Time Period (Years)</label>
                <input className={s.input} type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="50" placeholder="e.g. 20" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Monthly Contribution ({sym})</label>
                <input className={s.input} type="number" value={monthly} onChange={e => setMonthly(e.target.value)} min="0" step="50" placeholder="e.g. 200" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Compounding Frequency</label>
                <select className={s.select} value={freq} onChange={e => setFreq(e.target.value as Frequency)}>
                  {FREQ_LABELS.map(f => <option key={f} value={f}>{FREQ_DISPLAY[f]}</option>)}
                </select>
              </div>
            </div>
          </div>

          {result && (
            <div className={`${s.resultsWrap} animate-in`}>
              <div className={s.statRow}>
                <BigStat label="Final Balance" value={fmtMoney(result.finalBalance, currency)} color="var(--accent-green)" />
                <BigStat label="Total Contributions" value={fmtMoney(result.totalContributions, currency)} color="var(--accent)" />
                <BigStat label="Interest Earned" value={fmtMoney(result.totalInterest, currency)} color="var(--accent-amber)" />
              </div>

              <div className={s.chartCard}>
                <h2 className={s.chartTitle}>Growth Over {y} Years</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={55}
                      tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                    <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                    <Area type="monotone" dataKey="Contributions" stackId="1" stroke="#3b82f6" fill="url(#gC)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Interest" stackId="1" stroke="#10b981" fill="url(#gI)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={s.tableCard}>
                <h2 className={s.chartTitle}>Year-by-Year Schedule</h2>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr><th>Year</th><th>Year's Interest</th><th>Contributions</th><th>Total Interest</th><th>Balance</th></tr>
                    </thead>
                    <tbody>
                      {result.schedule.map(row => (
                        <tr key={row.year}>
                          <td>{row.year}</td>
                          <td className={s.green}>{fmtMoney(row.yearInterest, currency)}</td>
                          <td>{fmtMoney(row.totalContributions, currency)}</td>
                          <td className={s.green}>{fmtMoney(row.totalInterest, currency)}</td>
                          <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <AdRectangle slot="3000000002" />

          <article className={s.article}>
            <h2>How Compound Interest Works</h2>
            <p>Compound interest grows exponentially because you earn interest on your interest. The formula is <strong>A = P(1 + r/n)^(nt)</strong>.</p>
            {result && p > 0 && r > 0 && y > 0 && (
              <div className={s.example}>
                <h3>📊 Your Numbers</h3>
                <p><strong>{fmtMoney(p, currency)}</strong> at <strong>{r}%</strong> compounded <strong>{freq}</strong> for <strong>{y} years</strong>{m > 0 ? ` + ${fmtMoney(m, currency)}/month` : ''}:</p>
                <ul>
                  <li>Final balance: <strong>{fmtMoney(result.finalBalance, currency)}</strong></li>
                  <li>Your contributions: <strong>{fmtMoney(result.totalContributions, currency)}</strong></li>
                  <li>Free interest: <strong>{fmtMoney(result.totalInterest, currency)}</strong> ({((result.totalInterest / result.finalBalance) * 100).toFixed(1)}% of total)</li>
                </ul>
              </div>
            )}
            <h2>The Rule of 72</h2>
            <p>Divide 72 by your annual interest rate to find doubling time. At 6% it takes 12 years. At 12% just 6 years. Small differences in return rate have massive long-term consequences.</p>
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

function BigStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={s.bigStat}>
      <span className={s.bigLabel}>{label}</span>
      <span className={s.bigValue} style={{ color }}>{value}</span>
    </div>
  )
}