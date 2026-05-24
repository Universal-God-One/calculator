import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcBusinessLoan } from './businessLoanEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import s from './BusinessLoanCalc.module.css'

const FAQS = [
  { question: 'What types of business loans are there?', answer: 'Common types include term loans (fixed payments over a set period), SBA loans (government-backed, lower rates), lines of credit (revolving, draw as needed), equipment financing (asset-backed), invoice factoring, and merchant cash advances. This calculator models standard term loans.' },
  { question: 'What interest rate can I expect for a business loan?', answer: 'Rates vary widely by loan type, lender, and creditworthiness. SBA 7(a) loans: 10.5–13%. Bank term loans: 6–13%. Online lenders: 10–99%+. Equipment loans: 5–30%. Merchant cash advances can have effective rates of 40–150%. Always compare APR, not just stated rate.' },
  { question: 'What is the origination fee?', answer: 'An origination fee is a one-time upfront charge (typically 1–5% of the loan) for processing the loan. It increases the true cost of borrowing. The APR shown in this calculator includes the origination fee, giving you the true annual cost.' },
  { question: 'How is business loan APR calculated?', answer: 'APR (Annual Percentage Rate) includes both the interest rate and fees, expressed as a yearly rate. A loan with a 10% interest rate but a 3% origination fee has an APR higher than 10%. Always compare APR across lenders, not just the stated interest rate.' },
]

const TERM_PRESETS = [
  { label: '1 yr', months: 12 },
  { label: '2 yr', months: 24 },
  { label: '3 yr', months: 36 },
  { label: '5 yr', months: 60 },
  { label: '7 yr', months: 84 },
  { label: '10 yr', months: 120 },
]

export default function BusinessLoanCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [loanAmount, setLoanAmount] = useState('100000')
  const [rate, setRate] = useState('8')
  const [termMonths, setTermMonths] = useState('60')
  const [originationFee, setOriginationFee] = useState('0')
  const [showSchedule, setShowSchedule] = useState(false)

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const la = parseFloat(loanAmount) || 0
    const r = parseFloat(rate) || 0
    const t = parseInt(termMonths) || 0
    const of = parseFloat(originationFee) || 0
    if (la <= 0 || r <= 0 || t <= 0) return null
    try { return calcBusinessLoan(la, r, t, of) } catch { return null }
  }, [loanAmount, rate, termMonths, originationFee])

  const la = parseFloat(loanAmount) || 0
  const t = parseInt(termMonths) || 0

  const chartData = result?.schedule
    .filter((_, i) => i % Math.max(1, Math.floor(t / 24)) === 0)
    .map(row => ({
      month: `M${row.month}`,
      Balance: row.balance,
    })) ?? []

  return (
    <>
      <SEOHead
        title="Business Loan Calculator – Monthly Payment & Total Cost"
        description="Free business loan calculator. Calculate monthly payments, total interest, APR with fees, and full amortization schedule for any business loan."
        canonical="/business/business-loan-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Financing</p>
            <h1 className={s.h1}>Business Loan Calculator</h1>
            <p className={s.sub}>Calculate monthly payments, total interest, and true APR including origination fees.</p>
          </div>

          <AdBanner slot="40000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Loan Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Loan Amount ({sym})</label>
                <input className={s.input} type="number" value={loanAmount}
                  onChange={e => setLoanAmount(e.target.value)} min="0" step="1000" placeholder="e.g. 100000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Interest Rate (%)</label>
                <input className={s.input} type="number" value={rate}
                  onChange={e => setRate(e.target.value)} min="0" max="100" step="0.1" placeholder="e.g. 8" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Loan Term</label>
                <div className={s.termBtns}>
                  {TERM_PRESETS.map(p => (
                    <button key={p.months}
                      className={`${s.termBtn} ${termMonths === String(p.months) ? s.termActive : ''}`}
                      onClick={() => setTermMonths(String(p.months))}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <input className={s.input} type="number" value={termMonths}
                  onChange={e => setTermMonths(e.target.value)} min="1" max="360" placeholder="months" />
                {t > 0 && <span className={s.hint}>{Math.floor(t / 12)} years {t % 12} months</span>}
              </div>

              <div className={s.field}>
                <label className={s.label}>Origination Fee (%)</label>
                <input className={s.input} type="number" value={originationFee}
                  onChange={e => setOriginationFee(e.target.value)} min="0" max="10" step="0.1" placeholder="0" />
                {la > 0 && parseFloat(originationFee) > 0 && (
                  <span className={s.hint}>= {fmtMoney(la * parseFloat(originationFee) / 100, currency)} upfront</span>
                )}
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Loan Summary</h2>

                <div className={s.monthly}>
                  <span className={s.monthlyLabel}>Monthly Payment</span>
                  <span className={s.monthlyValue}>{fmtMoney(result.monthlyPayment, currency)}</span>
                  <span className={s.monthlySub}>for {t} months</span>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Loan Amount" value={fmtMoney(la, currency)} />
                  <Stat label="Total Interest + Fees" value={fmtMoney(result.totalInterest, currency)} red />
                  <Stat label="Total Payment" value={fmtMoney(result.totalPayment, currency)} />
                  <Stat label="Stated Rate" value={`${rate}%`} />
                  <Stat label="True APR" value={`${result.apr}%`} highlight={result.apr > parseFloat(rate)} />
                  <Stat label="Effective Rate" value={`${result.effectiveRate}%`} />
                </div>

                {parseFloat(originationFee) > 0 && (
                  <div className={s.aprNote}>
                    ℹ️ APR of <strong>{result.apr}%</strong> is higher than the stated {rate}% rate because it includes the {originationFee}% origination fee.
                  </div>
                )}

                <div className={s.costBar}>
                  <div className={s.costBarLabel}>
                    <span>Principal</span>
                    <span>Interest + Fees</span>
                  </div>
                  <div className={s.bar}>
                    <div className={s.barPrincipal} style={{ width: `${(la / result.totalPayment) * 100}%` }} />
                    <div className={s.barInterest} style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }} />
                  </div>
                  <div className={s.barPcts}>
                    <span>{((la / result.totalPayment) * 100).toFixed(1)}%</span>
                    <span>{((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏦</div>
                <p>Enter loan details to calculate your monthly payment.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Loan Balance Over Time</h2>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gLoan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Balance" stroke="#3b82f6" fill="url(#gLoan)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.scheduleCard} animate-in`}>
              <div className={s.scheduleHeader}>
                <h2 className={s.chartTitle}>Amortization Schedule</h2>
                <button className={s.toggleBtn} onClick={() => setShowSchedule(v => !v)}>
                  {showSchedule ? 'Hide' : 'Show'} Schedule
                </button>
              </div>
              {showSchedule && (
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
                    </thead>
                    <tbody>
                      {result.schedule.map(row => (
                        <tr key={row.month}>
                          <td>{row.month}</td>
                          <td>{fmtMoney(row.payment, currency)}</td>
                          <td className={s.green}>{fmtMoney(row.principal, currency)}</td>
                          <td className={s.red}>{fmtMoney(row.interest, currency)}</td>
                          <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <article className={s.article}>
            <h2>How Business Loan Payments Are Calculated</h2>
            <p>Business term loans use the same amortization formula as mortgages: fixed monthly payments where early payments are mostly interest, and later payments are mostly principal. The monthly payment formula is P = L[r(1+r)ⁿ]/[(1+r)ⁿ−1], where L is the loan amount, r is the monthly rate, and n is the number of payments.</p>
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

          <AdBanner slot="40000000002" />
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, red, highlight }: { label: string; value: string; red?: boolean; highlight?: boolean }) {
  return (
    <div className={s.stat}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={red ? { color: 'var(--accent-red)' } : highlight ? { color: 'var(--accent-amber)' } : {}}>{value}</span>
    </div>
  )
}