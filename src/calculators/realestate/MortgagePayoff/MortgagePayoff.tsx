import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcMortgagePayoff } from './mortgagePayoffEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './MortgagePayoff.module.css'

const FAQS = [
  { question: 'What is the fastest way to pay off a mortgage?', answer: 'The most effective strategies are making extra monthly principal payments, making one extra full payment per year (biweekly payment strategy), applying windfalls like bonuses or tax refunds as lump-sum payments, and refinancing to a shorter term. Even small consistent extra payments compound significantly over time.' },
  { question: 'Does paying extra on principal reduce my payment?', answer: 'No — extra principal payments don\'t reduce your monthly payment. Instead, they shorten the loan term. You still pay the same amount each month, but the loan is paid off earlier, saving you years of payments and thousands in interest.' },
  { question: 'How does the biweekly payment strategy work?', answer: 'Instead of paying monthly, you pay half your monthly payment every two weeks. Since there are 52 weeks per year, you make 26 half-payments = 13 full payments per year instead of 12. That extra payment goes entirely to principal, typically saving 4–6 years on a 30-year mortgage.' },
  { question: 'Should I pay off my mortgage early or invest?', answer: 'It depends on your mortgage rate vs expected investment return. If your mortgage rate is 7% and you expect 10% stock returns, investing may produce better outcomes. But paying off a mortgage provides a guaranteed, risk-free return equal to your interest rate. Personal preference for being debt-free also matters.' },
]

const EXTRA_PRESETS = [100, 200, 500, 1000]

export default function MortgagePayoffPage() {
  const [currency, setCurrency] = useState('USD')
  const [balance, setBalance] = useState('280000')
  const [rate, setRate] = useState('7')
  const [monthsRemaining, setMonthsRemaining] = useState('300')
  const [extraMonthly, setExtraMonthly] = useState('200')
  const [extraYearly, setExtraYearly] = useState('0')
  const [extraOneTime, setExtraOneTime] = useState('0')
  const [oneTimeMonth, setOneTimeMonth] = useState('1')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const b = parseFloat(balance) || 0
    const r = parseFloat(rate) || 0
    const m = parseInt(monthsRemaining) || 0
    const em = parseFloat(extraMonthly) || 0
    const ey = parseFloat(extraYearly) || 0
    const eo = parseFloat(extraOneTime) || 0
    const om = parseInt(oneTimeMonth) || 1
    if (b <= 0 || r <= 0 || m <= 0) return null
    return calcMortgagePayoff(b, r, m, em, ey, eo, om)
  }, [balance, rate, monthsRemaining, extraMonthly, extraYearly, extraOneTime, oneTimeMonth])

  const hasExtra = (parseFloat(extraMonthly) || 0) > 0 ||
    (parseFloat(extraYearly) || 0) > 0 ||
    (parseFloat(extraOneTime) || 0) > 0

  const chartData = result?.schedule.map(row => ({
    year: `Yr ${row.year}`,
    'Remaining Balance': row.balance,
    'Interest Saved': row.cumulativeInterestSaved,
  })) ?? []

  return (
    <>
      <SEOHead
        title="Mortgage Payoff Calculator – Pay Off Your Mortgage Early"
        description="Free mortgage payoff calculator. See how extra monthly, yearly, or one-time payments reduce your loan term and save interest. Find your new payoff date."
        canonical="/real-estate/mortgage-payoff-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Mortgage</p>
            <h1 className={s.h1}>Mortgage Payoff Calculator</h1>
            <p className={s.sub}>See how extra payments eliminate years from your mortgage and save thousands in interest.</p>
          </div>

          <AdBanner slot="25000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Mortgage</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Current Balance ({sym})</label>
                <input className={s.input} type="number" value={balance}
                  onChange={e => setBalance(e.target.value)} min="0" step="10000" placeholder="e.g. 280000" />
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Interest Rate (%)</label>
                  <input className={s.input} type="number" value={rate}
                    onChange={e => setRate(e.target.value)} min="0" max="20" step="0.05" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Months Remaining</label>
                  <input className={s.input} type="number" value={monthsRemaining}
                    onChange={e => setMonthsRemaining(e.target.value)} min="1" max="360" placeholder="e.g. 300" />
                </div>
              </div>

              <div className={s.extraSection}>
                <h3 className={s.extraTitle}>Extra Payments</h3>

                <div className={s.field}>
                  <label className={s.label}>Extra Monthly ({sym})</label>
                  <div className={s.presetRow}>
                    {EXTRA_PRESETS.map(p => (
                      <button key={p}
                        className={`${s.presetBtn} ${extraMonthly === String(p) ? s.presetActive : ''}`}
                        onClick={() => setExtraMonthly(String(p))}>
                        +{sym}{p}
                      </button>
                    ))}
                  </div>
                  <input className={s.input} type="number" value={extraMonthly}
                    onChange={e => setExtraMonthly(e.target.value)} min="0" step="50" placeholder="0" />
                </div>

                <div className={s.field}>
                  <label className={s.label}>Extra Yearly ({sym})</label>
                  <input className={s.input} type="number" value={extraYearly}
                    onChange={e => setExtraYearly(e.target.value)} min="0" step="500" placeholder="0" />
                </div>

                <div className={s.fieldRow}>
                  <div className={s.field}>
                    <label className={s.label}>One-Time ({sym})</label>
                    <input className={s.input} type="number" value={extraOneTime}
                      onChange={e => setExtraOneTime(e.target.value)} min="0" step="1000" placeholder="0" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>In Month #</label>
                    <input className={s.input} type="number" value={oneTimeMonth}
                      onChange={e => setOneTimeMonth(e.target.value)} min="1" placeholder="1" />
                  </div>
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Payoff Analysis</h2>

                {/* Before/After */}
                <div className={s.compareGrid}>
                  <div className={s.compareCol}>
                    <span className={s.compareLabel}>Without Extra Payments</span>
                    <span className={s.comparePayoff}>{result.originalPayoffDate}</span>
                    <span className={s.compareMonths}>{Math.floor(result.originalPayoffMonths / 12)} yrs {result.originalPayoffMonths % 12} mo</span>
                    <span className={s.compareInterest}>Interest: {fmtMoney(result.originalTotalInterest, currency)}</span>
                  </div>
                  <div className={s.compareArrow}>→</div>
                  <div className={`${s.compareCol} ${s.compareColNew}`}>
                    <span className={s.compareLabel}>With Extra Payments</span>
                    <span className={s.comparePayoff} style={{ color: 'var(--accent-green)' }}>{result.newPayoffDate}</span>
                    <span className={s.compareMonths}>{Math.floor(result.newPayoffMonths / 12)} yrs {result.newPayoffMonths % 12} mo</span>
                    <span className={s.compareInterest}>Interest: {fmtMoney(result.newTotalInterest, currency)}</span>
                  </div>
                </div>

                {hasExtra && result.monthsSaved > 0 && (
                  <div className={s.savingsBanner}>
                    <div className={s.savingsRow}>
                      <span>⏱ Time Saved</span>
                      <strong>{Math.floor(result.monthsSaved / 12)} years {result.monthsSaved % 12} months</strong>
                    </div>
                    <div className={s.savingsRow}>
                      <span>💰 Interest Saved</span>
                      <strong style={{ color: 'var(--accent-green)' }}>{fmtMoney(result.interestSaved, currency)}</strong>
                    </div>
                  </div>
                )}

                <div className={s.statGrid}>
                  <Stat label="Current Monthly" value={fmtMoney(result.originalMonthlyPayment, currency)} />
                  <Stat label="New Monthly" value={fmtMoney(result.newMonthlyPayment, currency)} />
                  <Stat label="Original Interest" value={fmtMoney(result.originalTotalInterest, currency)} />
                  <Stat label="New Interest" value={fmtMoney(result.newTotalInterest, currency)} green />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏠</div>
                <p>Enter your mortgage details to see your payoff plan.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Balance vs Cumulative Interest Saved</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gSav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={70}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Area type="monotone" dataKey="Remaining Balance" stroke="#ef4444" fill="url(#gBal)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Interest Saved" stroke="#10b981" fill="url(#gSav)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Year-by-Year Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Year</th><th>Balance</th><th>Extra Payment</th><th>Interest Saved (Cumulative)</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.month}>
                        <td>{row.year}</td>
                        <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                        <td>{row.extraPayment > 0 ? fmtMoney(row.extraPayment, currency) : '—'}</td>
                        <td className={s.green}>{fmtMoney(row.cumulativeInterestSaved, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="25000000002" />

          <article className={s.article}>
            <h2>The Power of Extra Mortgage Payments</h2>
            <p>Even small additional payments toward your mortgage principal have a dramatic effect. Because interest compounds on the remaining balance, reducing the balance early means less interest accrues on every future payment. The earlier in the loan you make extra payments, the greater the impact.</p>

            {result && hasExtra && result.interestSaved > 0 && (
              <div className={s.example}>
                <h3>📊 Your Savings</h3>
                <ul>
                  <li>Extra monthly payment: <strong>{fmtMoney(parseFloat(extraMonthly) || 0, currency)}</strong></li>
                  <li>New payoff date: <strong>{result.newPayoffDate}</strong> (was {result.originalPayoffDate})</li>
                  <li>Time saved: <strong>{Math.floor(result.monthsSaved / 12)} years {result.monthsSaved % 12} months</strong></li>
                  <li>Interest saved: <strong>{fmtMoney(result.interestSaved, currency)}</strong></li>
                </ul>
              </div>
            )}

            <h2>Biweekly Payment Strategy</h2>
            <p>Instead of 12 monthly payments per year, pay half your monthly payment every two weeks. With 52 weeks per year, you make 26 half-payments = 13 full payments per year. That one extra annual payment goes entirely to principal. On a typical 30-year mortgage, this strategy pays off the loan 4–6 years early and saves tens of thousands in interest.</p>

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

          <AdBanner slot="25000000003" />
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