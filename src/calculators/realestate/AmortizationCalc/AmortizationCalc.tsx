import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcAmortization } from './amortizationEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './AmortizationCalc.module.css'

const FAQS = [
  { question: 'What is an amortization schedule?', answer: 'An amortization schedule is a complete table showing every loan payment broken down into the principal and interest portions. In early payments, most goes to interest. Over time, more goes to reducing the principal balance.' },
  { question: 'How do extra payments affect amortization?', answer: 'Extra payments go directly toward the principal balance, reducing future interest charges. Even small extra monthly payments can save thousands in interest and cut years off the loan term. The earlier you make extra payments, the greater the impact.' },
  { question: 'Why do I pay more interest in the early years?', answer: 'Interest is calculated on the remaining balance. In the early years, the balance is large, so interest is high. As the balance decreases, less of each payment goes to interest and more goes to principal — this is the amortization effect.' },
  { question: 'What is the difference between a mortgage and amortization?', answer: 'A mortgage is the loan agreement. Amortization is the process of paying off the loan through regular payments. An amortization schedule shows the math behind every payment over the life of the mortgage.' },
]

type ViewMode = 'monthly' | 'yearly'

export default function AmortizationCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [loanAmount, setLoanAmount] = useState('300000')
  const [rate, setRate] = useState('7')
  const [term, setTerm] = useState('30')
  const [extraMonthly, setExtraMonthly] = useState('0')
  const [extraYearly, setExtraYearly] = useState('0')
  const [extraOneTime, setExtraOneTime] = useState('0')
  const [oneTimeMonth, setOneTimeMonth] = useState('1')
  const [view, setView] = useState<ViewMode>('yearly')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const la = parseFloat(loanAmount) || 0
    const r = parseFloat(rate) || 0
    const t = parseInt(term) || 0
    const em = parseFloat(extraMonthly) || 0
    const ey = parseFloat(extraYearly) || 0
    const eo = parseFloat(extraOneTime) || 0
    const om = parseInt(oneTimeMonth) || 1
    if (la <= 0 || r <= 0 || t <= 0) return null
    return calcAmortization(la, r, t, em, ey, eo, om)
  }, [loanAmount, rate, term, extraMonthly, extraYearly, extraOneTime, oneTimeMonth])

  // Standard schedule (no extra) for comparison
  const standardResult = useMemo(() => {
    const la = parseFloat(loanAmount) || 0
    const r = parseFloat(rate) || 0
    const t = parseInt(term) || 0
    if (la <= 0 || r <= 0 || t <= 0) return null
    return calcAmortization(la, r, t)
  }, [loanAmount, rate, term])

  const la = parseFloat(loanAmount) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 0
  const em = parseFloat(extraMonthly) || 0
  const hasExtra = em > 0 || parseFloat(extraYearly) > 0 || parseFloat(extraOneTime) > 0

  const interestSaved = standardResult && result ? standardResult.totalInterest - result.totalInterest : 0
  const monthsSaved = standardResult && result ? standardResult.payoffMonths - result.payoffMonths : 0

  const chartData = result?.yearSummary.map(row => ({
    year: `Yr ${row.year}`,
    Principal: Math.round(row.principal),
    Interest: Math.round(row.interest),
  })) ?? []

  const tableData = view === 'yearly' ? result?.yearSummary : result?.schedule

  return (
    <>
      <SEOHead
        title="Amortization Calculator – Loan Payment Schedule"
        description="Free amortization calculator. Generate a complete month-by-month and year-by-year loan payment schedule. See how extra payments save interest and reduce loan term."
        canonical="/real-estate/amortization-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Mortgage</p>
            <h1 className={s.h1}>Amortization Calculator</h1>
            <p className={s.sub}>Generate a full loan payment schedule and see the impact of extra payments.</p>
          </div>

          <AdBanner slot="16000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Loan Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Loan Amount ({sym})</label>
                <input className={s.input} type="number" value={loanAmount}
                  onChange={e => setLoanAmount(e.target.value)} min="0" step="10000" placeholder="e.g. 300000" />
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Annual Rate (%)</label>
                  <input className={s.input} type="number" value={rate}
                    onChange={e => setRate(e.target.value)} min="0" max="30" step="0.05" placeholder="e.g. 7" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Term (Years)</label>
                  <select className={s.select} value={term} onChange={e => setTerm(e.target.value)}>
                    <option value="30">30 Years</option>
                    <option value="20">20 Years</option>
                    <option value="15">15 Years</option>
                    <option value="10">10 Years</option>
                    <option value="5">5 Years</option>
                  </select>
                </div>
              </div>

              <div className={s.extraSection}>
                <h3 className={s.extraTitle}>Extra Payments (Optional)</h3>
                <div className={s.field}>
                  <label className={s.label}>Extra Monthly ({sym})</label>
                  <input className={s.input} type="number" value={extraMonthly}
                    onChange={e => setExtraMonthly(e.target.value)} min="0" step="50" placeholder="0" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Extra Yearly ({sym})</label>
                  <input className={s.input} type="number" value={extraYearly}
                    onChange={e => setExtraYearly(e.target.value)} min="0" step="100" placeholder="0" />
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
                <h2 className={s.cardTitle}>Payment Summary</h2>

                <div className={s.bigPayment}>
                  <span className={s.bigLabel}>Monthly Payment</span>
                  <span className={s.bigValue}>{fmtMoney(result.monthlyPayment, currency)}<span className={s.bigSub}>/mo</span></span>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Loan Amount" value={fmtMoney(la, currency)} />
                  <Stat label="Total Interest" value={fmtMoney(result.totalInterest, currency)} red />
                  <Stat label="Total Payment" value={fmtMoney(result.totalPayment, currency)} />
                  <Stat label="Payoff" value={
                    result.payoffMonths < 12
                      ? `${result.payoffMonths} months`
                      : `${Math.floor(result.payoffMonths / 12)}y ${result.payoffMonths % 12}m`
                  } />
                </div>

                {hasExtra && interestSaved > 0 && (
                  <div className={s.savingsBanner}>
                    <div className={s.savingsRow}>
                      <span>💰 Interest Saved</span>
                      <strong className={s.green}>{fmtMoney(interestSaved, currency)}</strong>
                    </div>
                    <div className={s.savingsRow}>
                      <span>⏱ Time Saved</span>
                      <strong className={s.green}>
                        {Math.floor(monthsSaved / 12)}y {monthsSaved % 12}m earlier payoff
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏠</div>
                <p>Enter loan details to generate your amortization schedule.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Principal vs Interest — Year by Year</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gPrin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gInt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Area type="monotone" dataKey="Principal" stroke="#10b981" fill="url(#gPrin)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Interest" stroke="#ef4444" fill="url(#gInt)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <div className={s.tableHeader}>
                <h2 className={s.chartTitle}>Amortization Schedule</h2>
                <div className={s.viewToggle}>
                  <button className={`${s.toggleBtn} ${view === 'yearly' ? s.toggleActive : ''}`}
                    onClick={() => setView('yearly')}>Yearly</button>
                  <button className={`${s.toggleBtn} ${view === 'monthly' ? s.toggleActive : ''}`}
                    onClick={() => setView('monthly')}>Monthly</button>
                </div>
              </div>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    {view === 'yearly' ? (
                      <tr><th>Year</th><th>Principal</th><th>Interest</th><th>Total Payment</th><th>Balance</th></tr>
                    ) : (
                      <tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
                    )}
                  </thead>
                  <tbody>
                    {view === 'yearly'
                      ? result.yearSummary.map(row => (
                          <tr key={row.year}>
                            <td>{row.year}</td>
                            <td className={s.green}>{fmtMoney(row.principal, currency)}</td>
                            <td className={s.red}>{fmtMoney(row.interest, currency)}</td>
                            <td>{fmtMoney(row.totalPayment, currency)}</td>
                            <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                          </tr>
                        ))
                      : result.schedule.map(row => (
                          <tr key={row.month}>
                            <td>{row.month}</td>
                            <td>{fmtMoney(row.payment, currency)}</td>
                            <td className={s.green}>{fmtMoney(row.principal, currency)}</td>
                            <td className={s.red}>{fmtMoney(row.interest, currency)}</td>
                            <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="16000000002" />

          <article className={s.article}>
            <h2>What Is an Amortization Schedule?</h2>
            <p>An amortization schedule shows every payment over the life of a loan, split between principal and interest. In the early months, most of your payment goes toward interest. As your balance decreases, more goes toward principal. This gradual shift is called amortization.</p>

            {result && la > 0 && (
              <div className={s.example}>
                <h3>📊 Your Loan</h3>
                <p><strong>{fmtMoney(la, currency)}</strong> at <strong>{r}%</strong> for <strong>{t} years</strong>:</p>
                <ul>
                  <li>Monthly payment: <strong>{fmtMoney(result.monthlyPayment, currency)}</strong></li>
                  <li>Total interest: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                  <li>Loan paid off in: <strong>{Math.floor(result.payoffMonths / 12)} years {result.payoffMonths % 12} months</strong></li>
                  {hasExtra && interestSaved > 0 && (
                    <li>Extra payments save: <strong>{fmtMoney(interestSaved, currency)}</strong> in interest</li>
                  )}
                </ul>
              </div>
            )}

            <h2>The Power of Extra Payments</h2>
            <p>Making extra payments reduces your principal faster, which lowers future interest charges. On a {fmtMoney(la || 300000, currency)} loan at {r || 7}%, adding just {fmtMoney(200, currency)}/month extra can save over {fmtMoney(30000, currency)} in interest and pay off the loan 4–5 years early. Use the extra payment fields above to see your exact savings.</p>

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

          <AdBanner slot="16000000003" />
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