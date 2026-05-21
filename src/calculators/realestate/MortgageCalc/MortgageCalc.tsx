import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcMortgage, fmtUSD } from './mortgageEngine'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './MortgageCalc.module.css'

const FAQS = [
  { question: 'What is included in a monthly mortgage payment?',
    answer: 'A standard mortgage payment covers principal (reducing your loan balance) and interest (cost of borrowing). Many lenders also collect property taxes and homeowner\'s insurance via an escrow account, making the total monthly outlay higher than the P&I payment this calculator shows.' },
  { question: 'What credit score do I need for a mortgage?',
    answer: 'Conventional loans typically require a minimum 620 credit score. FHA loans accept scores as low as 580 (with 3.5% down) or 500 (with 10% down). VA loans have no official minimum but lenders usually require 580–620. Higher scores unlock lower interest rates.' },
  { question: 'How does the down payment affect my mortgage?',
    answer: 'A larger down payment reduces your loan amount and monthly payment, and eliminates Private Mortgage Insurance (PMI) if you put down 20% or more. PMI typically costs 0.5%–1.5% of the loan annually and adds to your monthly payment until you reach 20% equity.' },
  { question: 'Should I choose a 15-year or 30-year mortgage?',
    answer: 'A 15-year mortgage has higher monthly payments but you pay significantly less total interest and build equity faster. A 30-year mortgage has lower monthly payments, offering more cash flow flexibility, but costs far more in total interest over the life of the loan. The right choice depends on your income stability and financial goals.' },
]

export default function MortgageCalcPage() {
  const [price, setPrice] = useState('400000')
  const [down, setDown] = useState('20')
  const [rate, setRate] = useState('7.0')
  const [term, setTerm] = useState('30')
  const [extra, setExtra] = useState('0')

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

  // Yearly chart data (every 12 months)
  const chartData = result
    ? Array.from({ length: Math.ceil(result.schedule.length / 12) }, (_, i) => {
        const yearMonths = result.schedule.slice(i * 12, (i + 1) * 12)
        return {
          year: `Yr ${i + 1}`,
          Principal: Math.round(yearMonths.reduce((s, m) => s + m.principal, 0)),
          Interest: Math.round(yearMonths.reduce((s, m) => s + m.interest, 0)),
        }
      })
    : []

  return (
    <>
      <SEOHead
        title="Mortgage Calculator – Monthly Payment & Amortization Schedule"
        description="Free mortgage calculator. Calculate your monthly payment, total interest, and full amortization schedule. Supports extra payments and multiple loan terms."
        canonical="/real-estate/mortgage-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Mortgage</p>
            <h1 className={s.h1}>Mortgage Calculator</h1>
            <p className={s.sub}>Calculate your monthly payment, total interest, and full amortization schedule.</p>
          </div>

          <AdBanner slot="4000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Loan Details</h2>
              <Field label="Home Price ($)">
                <input className={s.input} type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" step="10000" />
              </Field>
              <Field label="Down Payment (%)">
                <div className={s.inputRow}>
                  <input className={s.input} type="number" value={down} onChange={e => setDown(e.target.value)} min="0" max="100" step="1" />
                  <span className={s.inputSide}>{p > 0 ? fmtUSD(p * parseFloat(down || '0') / 100) : '--'}</span>
                </div>
              </Field>
              <Field label="Annual Interest Rate (%)">
                <input className={s.input} type="number" value={rate} onChange={e => setRate(e.target.value)} min="0" max="30" step="0.05" />
              </Field>
              <Field label="Loan Term">
                <select className={s.select} value={term} onChange={e => setTerm(e.target.value)}>
                  <option value="30">30 Years</option>
                  <option value="20">20 Years</option>
                  <option value="15">15 Years</option>
                  <option value="10">10 Years</option>
                </select>
              </Field>
              <Field label="Extra Monthly Payment ($)">
                <input className={s.input} type="number" value={extra} onChange={e => setExtra(e.target.value)} min="0" step="50" />
              </Field>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Payment Summary</h2>
                <div className={s.bigPayment}>
                  <span className={s.bigPayLabel}>Monthly Payment</span>
                  <span className={s.bigPayValue}>{fmtUSD(result.monthlyPayment)}<span className={s.bigPaySub}>/mo</span></span>
                </div>
                <div className={s.statGrid}>
                  <Stat label="Loan Amount" value={fmtUSD(result.principal)} />
                  <Stat label="Total Payment" value={fmtUSD(result.totalPayment)} />
                  <Stat label="Total Interest" value={fmtUSD(result.totalInterest)} red />
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
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                      tickFormatter={v => '$' + (v/1000).toFixed(0) + 'K'} />
                    <Tooltip formatter={(v: number) => fmtUSD(v)}
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
                          <td>{fmtUSD(row.payment)}</td>
                          <td className={s.green}>{fmtUSD(row.principal)}</td>
                          <td className={s.red}>{fmtUSD(row.interest)}</td>
                          <td className={s.bold}>{fmtUSD(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.schedule.length > 120 && (
                    <p className={s.tableNote}>Showing first 120 months of {result.schedule.length} total months.</p>
                  )}
                </div>
              </div>
            </>
          )}

          <AdRectangle slot="4000000002" />

          <article className={s.article}>
            <h2>How to Use This Mortgage Calculator</h2>
            <p>Enter your home price, down payment percentage, interest rate, and loan term. The calculator instantly shows your monthly payment, total interest paid over the life of the loan, and a full month-by-month amortization schedule.</p>

            {result && p > 0 && (
              <div className={s.example}>
                <h3>📊 Your Loan Summary</h3>
                <p>On a <strong>{fmtUSD(p)}</strong> home with <strong>{d}% down</strong> at <strong>{r}% interest</strong> over <strong>{t} years</strong>:</p>
                <ul>
                  <li>Loan amount: <strong>{fmtUSD(result.principal)}</strong></li>
                  <li>Monthly payment: <strong>{fmtUSD(result.monthlyPayment)}</strong></li>
                  <li>Total interest over {t} years: <strong>{fmtUSD(result.totalInterest)}</strong></li>
                  <li>For every dollar borrowed, you pay back <strong>{((result.totalPayment / result.principal)).toFixed(2)}</strong> total</li>
                </ul>
              </div>
            )}

            <h2>Understanding Amortization</h2>
            <p>In the early years of a mortgage, the vast majority of each payment goes toward interest. As the balance decreases over time, more of each payment goes toward principal. This is called amortization. In the first month of a 30-year $320,000 loan at 7%, roughly $1,867 goes to interest and only $200 goes to principal. By year 25, those numbers flip dramatically.</p>

            <h2>The Power of Extra Payments</h2>
            <p>Making even small extra principal payments has an outsized impact on total interest and loan term. Adding $200/month to a 30-year $320,000 loan at 7% would save over $80,000 in interest and pay off the loan 7 years early. Use the extra payment field above to see your specific savings.</p>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {children}
    </div>
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
