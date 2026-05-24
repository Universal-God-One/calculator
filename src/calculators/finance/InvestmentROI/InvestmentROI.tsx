import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcROI, calcROIFromRate } from './investmentEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import s from './InvestmentROI.module.css'

const FAQS = [
  { question: 'What is ROI?', answer: 'Return on Investment (ROI) measures the gain or loss from an investment relative to its cost. It is calculated as (Final Value - Initial Investment) / Initial Investment × 100. A 50% ROI means you gained half of what you originally invested.' },
  { question: 'What is CAGR?', answer: 'Compound Annual Growth Rate (CAGR) is the annualized rate at which an investment grows from its initial value to its final value over a given time period. It smooths out year-to-year volatility to show a consistent annual rate.' },
  { question: 'What is a good ROI?', answer: 'A "good" ROI depends on the asset class. The S&P 500 has historically returned around 10% annually before inflation (7% after). Real estate averages 8–12%. Bonds average 3–5%. Savings accounts currently offer 4–5%.' },
  { question: 'What is the difference between ROI and CAGR?', answer: 'ROI measures total return regardless of time. CAGR normalizes that return into an annual rate, making it easier to compare investments held for different periods. An investment with 100% ROI over 10 years has a CAGR of about 7.2%.' },
]

type Mode = 'byValue' | 'byRate'

export default function InvestmentROIPage() {
  const [mode, setMode] = useState<Mode>('byValue')
  const [currency, setCurrency] = useState('USD')
  const [initial, setInitial] = useState('10000')
  const [finalVal, setFinalVal] = useState('25000')
  const [rate, setRate] = useState('10')
  const [years, setYears] = useState('10')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const p = parseFloat(initial) || 0
    const y = parseInt(years) || 0
    if (p <= 0 || y <= 0) return null

    if (mode === 'byValue') {
      const fv = parseFloat(finalVal) || 0
      if (fv <= 0 || fv <= p) return null
      return calcROI(p, fv, y)
    } else {
      const r = parseFloat(rate) || 0
      if (r <= 0) return null
      return calcROIFromRate(p, r, y)
    }
  }, [mode, initial, finalVal, rate, years])

  const p = parseFloat(initial) || 0
  const y = parseInt(years) || 0

  const chartData = result?.schedule.map(row => ({
    year: `Yr ${row.year}`,
    Value: row.value,
  })) ?? []

  return (
    <>
      <SEOHead
        title="Investment ROI Calculator – Return on Investment & CAGR"
        description="Free investment ROI calculator. Calculate total return, annualized return (CAGR), and year-by-year investment growth. Supports 150+ currencies."
        canonical="/finance/investment-roi-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Investment</p>
            <h1 className={s.h1}>Investment ROI Calculator</h1>
            <p className={s.sub}>Calculate your total return, annualized CAGR, and year-by-year growth.</p>
          </div>

          <AdBanner slot="7000000001" />

          {/* Mode toggle */}
          <div className={s.modeRow}>
            <button className={`${s.modeBtn} ${mode === 'byValue' ? s.modeActive : ''}`}
              onClick={() => setMode('byValue')}>
              I know my final value
            </button>
            <button className={`${s.modeBtn} ${mode === 'byRate' ? s.modeActive : ''}`}
              onClick={() => setMode('byRate')}>
              I know my annual return %
            </button>
          </div>

          <div className={s.mainGrid}>
            {/* Inputs */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Investment Details</h2>

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
                <input className={s.input} type="number" value={initial}
                  onChange={e => setInitial(e.target.value)} min="0" step="1000" placeholder="e.g. 10000" />
              </div>

              {mode === 'byValue' ? (
                <div className={s.field}>
                  <label className={s.label}>Final Value ({sym})</label>
                  <input className={s.input} type="number" value={finalVal}
                    onChange={e => setFinalVal(e.target.value)} min="0" step="1000" placeholder="e.g. 25000" />
                </div>
              ) : (
                <div className={s.field}>
                  <label className={s.label}>Annual Return Rate (%)</label>
                  <input className={s.input} type="number" value={rate}
                    onChange={e => setRate(e.target.value)} min="0" max="100" step="0.1" placeholder="e.g. 10" />
                </div>
              )}

              <div className={s.field}>
                <label className={s.label}>Investment Period (Years)</label>
                <input className={s.input} type="number" value={years}
                  onChange={e => setYears(e.target.value)} min="1" max="50" placeholder="e.g. 10" />
              </div>
            </div>

            {/* Results */}
            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Results</h2>

                <div className={s.statGrid}>
                  <BigStat label="Total Value" value={fmtMoney(result.totalValue, currency)} color="var(--accent-green)" />
                  <BigStat label="Total Profit" value={fmtMoney(result.profit, currency)} color="var(--accent)" />
                  <BigStat label="Total ROI" value={result.totalReturnPct.toFixed(2) + '%'} color="var(--accent-amber)" />
                  <BigStat label="Annual CAGR" value={result.annualizedReturn.toFixed(2) + '%'} color="var(--accent-purple)" />
                </div>

                <div className={s.summaryRow}>
                  <span className={s.summaryItem}>Initial: <strong>{fmtMoney(p, currency)}</strong></span>
                  <span className={s.summaryItem}>Period: <strong>{y} years</strong></span>
                  <span className={s.summaryItem}>Doubled: <strong>{result.annualizedReturn > 0 ? (72 / result.annualizedReturn).toFixed(1) + ' yrs' : 'N/A'}</strong></span>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>📈</div>
                <p>Enter your investment details to see your return.</p>
              </div>
            )}
          </div>

          {/* Chart */}
          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Investment Growth Over {y} Years</h2>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={60}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Value" stroke="#10b981" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Table */}
          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Year-by-Year Breakdown</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Year</th><th>Value</th><th>Annual Gain</th><th>Total Gain</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.year}>
                        <td>{row.year}</td>
                        <td className={s.bold}>{fmtMoney(row.value, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.gain, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.totalGain, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="7000000002" />

          <article className={s.article}>
            <h2>How to Use This ROI Calculator</h2>
            <p>Choose your calculation mode. If you know your investment's starting and ending value, use "I know my final value." If you know the expected annual return percentage, use "I know my annual return %." Enter your details and results update instantly.</p>

            {result && p > 0 && y > 0 && (
              <div className={s.example}>
                <h3>📊 Your Investment</h3>
                <p>Investing <strong>{fmtMoney(p, currency)}</strong> for <strong>{y} years</strong>:</p>
                <ul>
                  <li>Grows to <strong>{fmtMoney(result.totalValue, currency)}</strong></li>
                  <li>Total profit: <strong>{fmtMoney(result.profit, currency)}</strong></li>
                  <li>Total ROI: <strong>{result.totalReturnPct.toFixed(2)}%</strong></li>
                  <li>Annualized CAGR: <strong>{result.annualizedReturn.toFixed(2)}%</strong></li>
                  <li>At this rate, money doubles every <strong>{result.annualizedReturn > 0 ? (72 / result.annualizedReturn).toFixed(1) : 'N/A'} years</strong> (Rule of 72)</li>
                </ul>
              </div>
            )}

            <h2>ROI vs CAGR — What's the Difference?</h2>
            <p>ROI (Return on Investment) measures the total percentage gain over the entire investment period. CAGR (Compound Annual Growth Rate) converts that total return into a smooth annual rate. CAGR is more useful for comparing investments held for different time periods — a 100% ROI over 5 years is very different from 100% over 20 years.</p>

            <h2>The Rule of 72</h2>
            <p>Divide 72 by the annual return rate to estimate how long it takes to double your money. At 10% CAGR, money doubles every 7.2 years. At 6%, every 12 years. This simple rule helps quickly evaluate investment opportunities.</p>

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

          <AdBanner slot="7000000003" />
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