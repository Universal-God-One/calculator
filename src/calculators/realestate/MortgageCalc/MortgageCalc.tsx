import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcMortgage } from './mortgageEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './MortgageCalc.module.css'

const FAQS = [
  { question: 'What is included in a monthly mortgage payment?', answer: 'Principal (reducing your loan balance) and interest (cost of borrowing). Many lenders also escrow property taxes and homeowner\'s insurance, making total monthly outlay higher than what this calculator shows.' },
  { question: 'How does the down payment affect my mortgage?', answer: 'A larger down payment reduces your loan amount and monthly payment. Putting down 20% or more eliminates Private Mortgage Insurance (PMI), which typically costs 0.5–1.5% of the loan annually.' },
  { question: 'Should I choose a 15-year or 30-year mortgage?', answer: 'A 15-year mortgage has higher monthly payments but far less total interest. A 30-year mortgage has lower monthly payments but costs significantly more over the loan\'s life. The right choice depends on your income stability and cash flow needs.' },
  { question: 'How much do extra payments save?', answer: 'Extra principal payments save dramatically on total interest. Even an extra $100/month on a typical mortgage can save tens of thousands and pay off the loan years early.' },
]

export default function MortgageCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [price, setPrice] = useState('400000')
  const [down, setDown] = useState('20')
  const [rate, setRate] = useState('7.0')
  const [term, setTerm] = useState('30')
  const [extra, setExtra] = useState('0')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const p = parseFloat(price) || 0
    const d = parseFloat(down) || 0
    const r = parseFloat(rate) || 0
    const t = parseInt(term) || 30
    const e = parseFloat(extra) || 0
    if (p <= 0 || r <= 0) return null
    return calcMortgage(p, d, r, t, e)
  }, [price, down, rate, term, extra])

  const p = parseFloat(price) || 0
  const d = parseFloat(down) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 30

  const chartData = result
    ? Array.from({ length: Math.ceil(result.schedule.length / 12) }, (_, i) => {
        const yr = result.schedule.slice(i * 12, (i + 1) * 12)
        return {
          year: `Yr ${i + 1}`,
          Principal: Math.round(yr.reduce((s, m) => s + m.principal, 0)),
          Interest: Math.round(yr.reduce((s, m) => s + m.interest, 0)),
        }
      })
    : []

  return (
    <>
      <SEOHead
        title="Mortgage Calculator – Monthly Payment & Amortization Schedule"
        description="Free mortgage calculator with 150+ currency support. Calculate monthly payment, total interest, and full amortization schedule. Supports extra payments and multiple loan terms."
        canonical="/real-estate/mortgage-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Mortgage</p>
            <h1 className={s.h1}>Mortgage Calculator</h1>
            <p className={s.sub}>Calculate your monthly payment, total interest, and full amortization schedule. Supports 150+ currencies.</p>
          </div>

          <AdBanner slot="4000000001" />

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
                <label className={s.label}>Home Price ({sym})</label>
                <input className={s.input} type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" step="10000" placeholder="e.g. 400000" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Down Payment (%)</label>
                <div className={s.inputRow}>
                  <input className={s.input} type="number" value={down} onChange={e => setDown(e.target.value)} min="0" max="100" step="1" />
                  <span className={s.inputSide}>{p > 0 ? fmtMoney(p * parseFloat(down || '0') / 100, currency) : '--'}</span>
                </div>
              </div>
              <div className={s.field}>
                <label className={s.label}>Annual Interest Rate (%)</label>
                <input className={s.input} type="number" value={rate} onChange={e => setRate(e.target.value)} min="0" max="30" step="0.05" placeholder="e.g. 7.0" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Loan Term</label>
                <select className={s.select} value={term} onChange={e => setTerm(e.target.value)}>
                  <option value="30">30 Years</option>
                  <option value="20">20 Years</option>
                  <option value="15">15 Years</option>
                  <option value="10">10 Years</option>
                  <option value="5">5 Years</option>
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>Extra Monthly Payment ({sym})</label>
                <input className={s.input} type="number" value={extra} onChange={e => setExtra(e.target.value)} min="0" step="50" placeholder="0" />
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Payment Summary</h2>
                <div className={s.bigPayment}>
                  <span className={s.bigPayLabel}>Monthly Payment</span>
                  <span className={s.bigPayValue}>{fmtMoney(result.monthlyPayment, currency)}<span className={s.bigPaySub}>/mo</span></span>
                </div>
                <div className={s.statGrid}>
                  <Stat label="Loan Amount" value={fmtMoney(result.principal, currency)} />
                  <Stat label="Total Payment" value={fmtMoney(result.totalPayment, currency)} />
                  <Stat label="Total Interest" value={fmtMoney(result.totalInterest, currency)} red />
                  <Stat label="Interest / Loan" value={((result.totalInterest / result.principal) * 100).toFixed(1) + '%'} />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏠</div>
                <p>Enter loan details to calculate your payment.</p>
              </div>
            )}
          </div>

          {result && (
            <>
              <div className={`${s.chartCard} animate-in`}>
                <h2 className={s.cardTitle}>Principal vs Interest — Yearly</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={55}
                      tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'K'} />
                    <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                    <Bar dataKey="Principal" fill="#10b981" radius={[2,2,0,0]} />
                    <Bar dataKey="Interest" fill="#ef4444" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={s.tableCard}>
                <h2 className={s.cardTitle}>Amortization Schedule</h2>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
                    </thead>
                    <tbody>
                      {result.schedule.slice(0, 120).map(row => (
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
                  {result.schedule.length > 120 && (
                    <p className={s.tableNote}>Showing first 120 of {result.schedule.length} months.</p>
                  )}
                </div>
              </div>
            </>
          )}

          <AdRectangle slot="4000000002" />

          <article className={s.article}>
            <h2>How to Use This Mortgage Calculator</h2>
            <p>Select your currency, enter the home price, down payment, interest rate, and term. Results update live. Add an extra monthly payment to see how much faster you pay off the loan and how much interest you save.</p>
            {result && p > 0 && (
              <div className={s.example}>
                <h3>📊 Your Loan</h3>
                <p><strong>{fmtMoney(p, currency)}</strong> home, <strong>{d}% down</strong>, <strong>{r}%</strong> rate, <strong>{t} years</strong>:</p>
                <ul>
                  <li>Loan amount: <strong>{fmtMoney(result.principal, currency)}</strong></li>
                  <li>Monthly payment: <strong>{fmtMoney(result.monthlyPayment, currency)}</strong></li>
                  <li>Total interest paid: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                  <li>For every {sym}1 borrowed, you repay <strong>{sym}{(result.totalPayment / result.principal).toFixed(2)}</strong> total</li>
                </ul>
              </div>
            )}
            <h2>Understanding Amortization</h2>
            <p>Early mortgage payments go mostly toward interest. As the balance drops, more goes to principal. This is why extra early payments save so much — they reduce the balance on which future interest is calculated.</p>
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

          <AdBanner slot="4000000003" />
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