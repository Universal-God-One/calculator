import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcCD, CompoundFreq, FREQ_LABELS, FREQ_DISPLAY, CD_TERMS } from './cdEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import s from './CDCalc.module.css'

const FAQS = [
  { question: 'What is a Certificate of Deposit (CD)?', answer: 'A CD is a savings product offered by banks and credit unions that holds a fixed amount of money for a fixed period at a fixed interest rate. In exchange for leaving your money untouched, you earn a higher interest rate than a regular savings account.' },
  { question: 'What is APY vs APR?', answer: 'APR (Annual Percentage Rate) is the stated interest rate. APY (Annual Percentage Yield) accounts for compounding and represents the actual return earned over a year. The more frequently interest compounds, the higher the APY compared to APR.' },
  { question: 'What happens if I withdraw early from a CD?', answer: 'Early withdrawal typically incurs a penalty, usually a certain number of months of interest (e.g., 3 months interest for a 1-year CD, 6 months for a 5-year CD). The exact penalty varies by bank and CD term.' },
  { question: 'Are CDs safe?', answer: 'CDs at FDIC-insured banks are protected up to $250,000 per depositor. At credit unions, NCUA insurance provides the same protection. They are considered one of the safest savings vehicles available.' },
  { question: 'When is a CD a good choice?', answer: 'CDs are ideal when you have money you won\'t need for a defined period and want a guaranteed return. They\'re especially attractive when rates are high. If you might need the money early, a high-yield savings account offers more flexibility.' },
]

export default function CDCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('5')
  const [months, setMonths] = useState('12')
  const [freq, setFreq] = useState<CompoundFreq>('monthly')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0
    const r = parseFloat(rate) || 0
    const m = parseInt(months) || 0
    if (p <= 0 || r <= 0 || m <= 0) return null
    return calcCD(p, r, m, freq)
  }, [principal, rate, months, freq])

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const m = parseInt(months) || 0

  const chartData = result?.schedule.map(row => ({
    period: row.label,
    Balance: row.balance,
  })) ?? []

  return (
    <>
      <SEOHead
        title="CD Calculator – Certificate of Deposit Interest Calculator"
        description="Free CD calculator. Calculate interest earned on a Certificate of Deposit with daily, monthly, or quarterly compounding. Supports 150+ currencies."
        canonical="/finance/cd-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Savings</p>
            <h1 className={s.h1}>CD Calculator</h1>
            <p className={s.sub}>Calculate interest earned on a Certificate of Deposit with any compounding frequency.</p>
          </div>

          <AdBanner slot="14000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>CD Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Initial Deposit ({sym})</label>
                <input className={s.input} type="number" value={principal}
                  onChange={e => setPrincipal(e.target.value)} min="0" step="1000" placeholder="e.g. 10000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Interest Rate (APR %)</label>
                <input className={s.input} type="number" value={rate}
                  onChange={e => setRate(e.target.value)} min="0" max="20" step="0.05" placeholder="e.g. 5" />
              </div>

              <div className={s.field}>
                <label className={s.label}>CD Term</label>
                <div className={s.termGrid}>
                  {CD_TERMS.map(t => (
                    <button key={t.months}
                      className={`${s.termBtn} ${months === String(t.months) ? s.termActive : ''}`}
                      onClick={() => setMonths(String(t.months))}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className={s.customTerm}>
                  <label className={s.label}>Or enter custom months</label>
                  <input className={s.input} type="number" value={months}
                    onChange={e => setMonths(e.target.value)} min="1" max="120" placeholder="e.g. 12" />
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Compounding Frequency</label>
                <select className={s.select} value={freq} onChange={e => setFreq(e.target.value as CompoundFreq)}>
                  {FREQ_LABELS.map(f => <option key={f} value={f}>{FREQ_DISPLAY[f]}</option>)}
                </select>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>CD Results</h2>

                <div className={s.bigBlock}>
                  <div className={s.bigItem}>
                    <span className={s.bigLabel}>Final Balance</span>
                    <span className={s.bigValue}>{fmtMoney(result.finalBalance, currency)}</span>
                  </div>
                  <div className={s.bigItem}>
                    <span className={s.bigLabel}>Interest Earned</span>
                    <span className={s.bigValue} style={{ color: 'var(--accent-green)' }}>{fmtMoney(result.totalInterest, currency)}</span>
                  </div>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Initial Deposit" value={fmtMoney(p, currency)} />
                  <Stat label="APY" value={`${result.apy.toFixed(3)}%`} green />
                  <Stat label="APR" value={`${r}%`} />
                  <Stat label="Term" value={`${m} months`} />
                  <Stat label="Compounding" value={FREQ_DISPLAY[freq]} />
                  <Stat label="Return %" value={`${((result.totalInterest / p) * 100).toFixed(2)}%`} green />
                </div>

                <div className={s.apyNote}>
                  💡 APY of <strong>{result.apy.toFixed(3)}%</strong> is your true annual yield after compounding — higher than the stated {r}% APR.
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏦</div>
                <p>Enter your CD details to calculate returns.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Balance Growth Over {m} Months</h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gCD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="period" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Balance" stroke="#3b82f6" fill="url(#gCD)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Growth Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Period</th><th>Total Interest</th><th>Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row, i) => (
                      <tr key={i}>
                        <td>{row.label}</td>
                        <td className={s.green}>{fmtMoney(row.interest, currency)}</td>
                        <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="14000000002" />

          <article className={s.article}>
            <h2>How CD Interest Is Calculated</h2>
            <p>CD interest uses compound interest: <strong>A = P(1 + r/n)^(nt)</strong>, where P is your deposit, r is the annual rate, n is compounding periods per year, and t is the term in years. The more frequently it compounds, the higher your actual yield (APY).</p>

            {result && p > 0 && (
              <div className={s.example}>
                <h3>📊 Your CD</h3>
                <p>Depositing <strong>{fmtMoney(p, currency)}</strong> at <strong>{r}% APR</strong> for <strong>{m} months</strong> compounded <strong>{FREQ_DISPLAY[freq].toLowerCase()}</strong>:</p>
                <ul>
                  <li>Interest earned: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                  <li>Final balance: <strong>{fmtMoney(result.finalBalance, currency)}</strong></li>
                  <li>True APY: <strong>{result.apy.toFixed(3)}%</strong></li>
                  <li>Total return: <strong>{((result.totalInterest / p) * 100).toFixed(2)}%</strong></li>
                </ul>
              </div>
            )}

            <h2>APR vs APY — What's the Difference?</h2>
            <p>APR is the stated interest rate. APY accounts for compounding within the year and is always equal to or higher than APR. A CD advertised at 5% APR compounded monthly has an APY of 5.116%. Always compare CDs using APY for an accurate comparison.</p>

            <h2>CD Laddering Strategy</h2>
            <p>A CD ladder splits your money across multiple CDs with different terms — for example, 3-month, 6-month, 1-year, 2-year, and 3-year CDs. As each CD matures, you reinvest into the longest term. This gives you regular access to funds while capturing higher long-term rates.</p>

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

          <AdBanner slot="14000000003" />
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={s.stat}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}