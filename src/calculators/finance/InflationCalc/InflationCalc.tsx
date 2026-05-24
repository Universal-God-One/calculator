import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcInflation } from './inflationEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './InflationCalc.module.css'

const FAQS = [
  { question: 'What is inflation?', answer: 'Inflation is the rate at which the general level of prices for goods and services rises over time, reducing purchasing power. When inflation is 3%, something that costs $100 today will cost $103 next year.' },
  { question: 'What is a normal inflation rate?', answer: 'Most central banks target around 2% annual inflation as healthy for economic growth. The US has historically averaged around 3% long-term. During 2021–2023, inflation spiked to 7–9% in many countries before cooling.' },
  { question: 'How does inflation affect savings?', answer: 'If your savings earn less interest than the inflation rate, you are losing real purchasing power. For example, if inflation is 3% and your savings account earns 1%, your real return is -2% — your money buys less each year even though the balance grows.' },
  { question: 'How do I protect against inflation?', answer: 'Common inflation hedges include stocks (which historically outpace inflation), real estate, Treasury Inflation-Protected Securities (TIPS), commodities like gold, and I-Bonds. Keeping too much cash in low-yield accounts is the main risk.' },
]

const COMMON_RATES = [
  { label: 'Low (1%)', value: '1' },
  { label: 'Target (2%)', value: '2' },
  { label: 'Moderate (3%)', value: '3' },
  { label: 'High (5%)', value: '5' },
  { label: 'Very High (8%)', value: '8' },
]

export default function InflationCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [amount, setAmount] = useState('10000')
  const [rate, setRate] = useState('3')
  const [years, setYears] = useState('20')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const a = parseFloat(amount) || 0
    const r = parseFloat(rate) || 0
    const y = parseInt(years) || 0
    if (a <= 0 || y <= 0) return null
    return calcInflation(a, r, y)
  }, [amount, rate, years])

  const a = parseFloat(amount) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0

  const chartData = result?.schedule.map(row => ({
    year: `Yr ${row.year}`,
    'Cost of Goods': row.value,
    'Purchasing Power': row.purchasingPower,
  })) ?? []

  return (
    <>
      <SEOHead
        title="Inflation Calculator – Purchasing Power & Future Cost"
        description="Free inflation calculator. See how inflation erodes purchasing power over time. Calculate future costs and real value of money. Supports 150+ currencies."
        canonical="/finance/inflation-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Inflation</p>
            <h1 className={s.h1}>Inflation Calculator</h1>
            <p className={s.sub}>See how inflation erodes your purchasing power and what things will cost in the future.</p>
          </div>

          <AdBanner slot="9000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Amount ({sym})</label>
                <input className={s.input} type="number" value={amount}
                  onChange={e => setAmount(e.target.value)} min="0" step="1000" placeholder="e.g. 10000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Inflation Rate (%)</label>
                <input className={s.input} type="number" value={rate}
                  onChange={e => setRate(e.target.value)} min="0" max="50" step="0.1" placeholder="e.g. 3" />
                <div className={s.ratePills}>
                  {COMMON_RATES.map(cr => (
                    <button key={cr.value} className={`${s.pill} ${rate === cr.value ? s.pillActive : ''}`}
                      onClick={() => setRate(cr.value)}>
                      {cr.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Time Period (Years)</label>
                <input className={s.input} type="number" value={years}
                  onChange={e => setYears(e.target.value)} min="1" max="100" placeholder="e.g. 20" />
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Inflation Impact</h2>

                <div className={s.bigBlock}>
                  <div className={s.bigItem}>
                    <span className={s.bigLabel}>Future Cost</span>
                    <span className={s.bigValue} style={{ color: 'var(--accent-red)' }}>{fmtMoney(result.futureValue, currency)}</span>
                    <span className={s.bigNote}>What {fmtMoney(a, currency)} buys today costs this in {y} years</span>
                  </div>
                  <div className={s.divider} />
                  <div className={s.bigItem}>
                    <span className={s.bigLabel}>Purchasing Power Today's Money</span>
                    <span className={s.bigValue} style={{ color: 'var(--accent-green)' }}>{fmtMoney(a / Math.pow(1 + r/100, y), currency)}</span>
                    <span className={s.bigNote}>What {fmtMoney(a, currency)} will be worth in {y} years</span>
                  </div>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Starting Amount" value={fmtMoney(a, currency)} />
                  <Stat label="Inflation Rate" value={`${r}% / year`} />
                  <Stat label="Purchasing Power Lost" value={fmtMoney(result.purchasingPowerLost, currency)} red />
                  <Stat label="Power Lost %" value={`${result.purchasingPowerLostPct}%`} red />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>📉</div>
                <p>Enter an amount to see its inflation impact.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Cost vs Purchasing Power Over {y} Years</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Line type="monotone" dataKey="Cost of Goods" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Purchasing Power" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Year-by-Year Breakdown</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Year</th><th>Cost of Goods</th><th>Purchasing Power of {fmtMoney(a, currency)}</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.year}>
                        <td>{row.year}</td>
                        <td className={s.red}>{fmtMoney(row.value, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.purchasingPower, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="9000000002" />

          <article className={s.article}>
            <h2>How Inflation Erodes Purchasing Power</h2>
            <p>Inflation means prices rise over time, so the same amount of money buys less in the future. At 3% annual inflation, prices double roughly every 24 years (Rule of 72: 72 ÷ 3 = 24). This is why simply saving cash without earning a return is a losing strategy long-term.</p>

            {result && a > 0 && y > 0 && (
              <div className={s.example}>
                <h3>📊 Your Numbers</h3>
                <p>At <strong>{r}% annual inflation</strong> over <strong>{y} years</strong>:</p>
                <ul>
                  <li>What costs <strong>{fmtMoney(a, currency)}</strong> today will cost <strong>{fmtMoney(result.futureValue, currency)}</strong></li>
                  <li>Your <strong>{fmtMoney(a, currency)}</strong> will only buy <strong>{fmtMoney(a / Math.pow(1 + r/100, y), currency)}</strong> worth of goods</li>
                  <li>Purchasing power lost: <strong>{fmtMoney(result.purchasingPowerLost, currency)} ({result.purchasingPowerLostPct}%)</strong></li>
                </ul>
              </div>
            )}

            <h2>How to Beat Inflation</h2>
            <p>To preserve purchasing power, your savings must earn a return greater than the inflation rate. The S&P 500 has historically returned around 10% annually (7% after inflation). Real estate, TIPS (Treasury Inflation-Protected Securities), and I-Bonds are also common inflation hedges. Keeping money in a savings account earning less than inflation means losing real value every year.</p>

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

          <AdBanner slot="9000000003" />
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, red }: { label: string; value: string; red?: boolean }) {
  return (
    <div className={s.stat}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={red ? { color: 'var(--accent-red)' } : {}}>{value}</span>
    </div>
  )
}