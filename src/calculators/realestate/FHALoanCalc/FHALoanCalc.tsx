import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcFHA, FHA_LIMITS_2024 } from './fhaEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './FHALoanCalc.module.css'

const FAQS = [
  { question: 'What is an FHA loan?', answer: 'An FHA loan is a mortgage insured by the Federal Housing Administration. It allows lower down payments (as low as 3.5%) and more flexible credit requirements than conventional loans, making homeownership accessible to more buyers. In exchange, borrowers pay Mortgage Insurance Premiums (MIP).' },
  { question: 'What is the minimum down payment for an FHA loan?', answer: 'The minimum down payment is 3.5% if your credit score is 580 or higher. If your score is between 500–579, the minimum is 10%. Scores below 500 are not eligible for FHA loans.' },
  { question: 'What is MIP (Mortgage Insurance Premium)?', answer: 'MIP is FHA\'s version of mortgage insurance. It includes an upfront MIP of 1.75% of the loan amount (typically financed into the loan) and an annual MIP of 0.50–0.75% paid monthly. Unlike PMI on conventional loans, FHA MIP may last the life of the loan depending on your down payment.' },
  { question: 'When can I remove FHA MIP?', answer: 'If your down payment was 10% or more, MIP can be removed after 11 years when the LTV drops below 78%. If your down payment was less than 10%, MIP stays for the life of the loan. To eliminate MIP earlier, you would need to refinance into a conventional loan once you have 20% equity.' },
  { question: 'FHA vs Conventional — which is better?', answer: 'FHA is better for buyers with lower credit scores or smaller down payments. Conventional is typically better once you can put 20% down (no PMI) or if you have strong credit (680+) and qualify for competitive rates. The FHA\'s MIP costs often make it more expensive long-term than conventional loans.' },
]

export default function FHALoanCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [homePrice, setHomePrice] = useState('300000')
  const [downPct, setDownPct] = useState('3.5')
  const [rate, setRate] = useState('7')
  const [term, setTerm] = useState('30')
  const [propertyTax, setPropertyTax] = useState('1.2')
  const [homeInsurance, setHomeInsurance] = useState('1200')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const hp = parseFloat(homePrice) || 0
    const dp = parseFloat(downPct) || 0
    const r = parseFloat(rate) || 0
    const t = parseInt(term) || 30
    const pt = parseFloat(propertyTax) || 0
    const hi = parseFloat(homeInsurance) || 0
    if (hp <= 0 || r <= 0) return null
    if (dp < 3.5) return null
    return calcFHA(hp, dp, r, t, pt, hi)
  }, [homePrice, downPct, rate, term, propertyTax, homeInsurance])

  const hp = parseFloat(homePrice) || 0
  const dp = parseFloat(downPct) || 0

  const chartData = result?.schedule
    .filter((_, i) => i % 12 === 0)
    .map(row => ({
      year: `Yr ${Math.ceil(row.month / 12)}`,
      'Principal': row.principal * 12,
      'Interest': row.interest * 12,
      'MIP': row.mip * 12,
    })) ?? []

  const belowMinDown = dp < 3.5 && dp > 0
  const fhaLimit = FHA_LIMITS_2024['Low-Cost Area']
  const exceedsLimit = hp > fhaLimit

  return (
    <>
      <SEOHead
        title="FHA Loan Calculator – Monthly Payment with MIP"
        description="Free FHA loan calculator. Calculate monthly payment including upfront MIP and annual MIP. See when MIP can be removed and compare FHA costs."
        canonical="/real-estate/fha-loan-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › FHA</p>
            <h1 className={s.h1}>FHA Loan Calculator</h1>
            <p className={s.sub}>Calculate your FHA monthly payment including upfront and annual Mortgage Insurance Premium (MIP).</p>
          </div>

          <AdBanner slot="20000000001" />

          {/* FHA Limits Info */}
          <div className={s.limitsBar}>
            <span className={s.limitsTitle}>2024 FHA Loan Limits:</span>
            {Object.entries(FHA_LIMITS_2024).map(([area, limit]) => (
              <span key={area} className={s.limitItem}>
                <strong>{area}:</strong> {fmtMoney(limit, currency)}
              </span>
            ))}
          </div>

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
                <input className={s.input} type="number" value={homePrice}
                  onChange={e => setHomePrice(e.target.value)} min="0" step="5000" placeholder="e.g. 300000" />
                {exceedsLimit && (
                  <span className={s.warning}>⚠️ Exceeds {sym}{fhaLimit.toLocaleString()} FHA limit for low-cost areas</span>
                )}
              </div>

              <div className={s.field}>
                <label className={s.label}>Down Payment (%)</label>
                <input className={s.input} type="number" value={downPct}
                  onChange={e => setDownPct(e.target.value)} min="0" max="100" step="0.5" placeholder="min 3.5%" />
                {belowMinDown && <span className={s.warning}>⚠️ Minimum FHA down payment is 3.5%</span>}
                {result && (
                  <span className={s.hint}>= {fmtMoney(result.downPayment, currency)} down</span>
                )}
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Interest Rate (%)</label>
                  <input className={s.input} type="number" value={rate}
                    onChange={e => setRate(e.target.value)} min="0" max="20" step="0.05" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Loan Term</label>
                  <select className={s.select} value={term} onChange={e => setTerm(e.target.value)}>
                    <option value="30">30 Years</option>
                    <option value="15">15 Years</option>
                  </select>
                </div>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Property Tax (%/yr)</label>
                  <input className={s.input} type="number" value={propertyTax}
                    onChange={e => setPropertyTax(e.target.value)} min="0" max="5" step="0.1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Home Insurance ({sym}/yr)</label>
                  <input className={s.input} type="number" value={homeInsurance}
                    onChange={e => setHomeInsurance(e.target.value)} min="0" step="100" />
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>FHA Payment Summary</h2>

                <div className={s.totalPayment}>
                  <span className={s.totalLabel}>Total Monthly Payment</span>
                  <span className={s.totalValue}>{fmtMoney(result.monthlyPayment, currency)}</span>
                  <span className={s.totalSub}>includes all costs below</span>
                </div>

                <div className={s.breakdown}>
                  <BRow label="Principal & Interest" value={fmtMoney(result.monthlyPI, currency)} />
                  <BRow label="Annual MIP (monthly)" value={fmtMoney(result.monthlyMIP, currency)} highlight />
                  <BRow label="Property Tax" value={fmtMoney(result.monthlyPropertyTax, currency)} />
                  <BRow label="Home Insurance" value={fmtMoney(result.monthlyInsurance, currency)} />
                </div>

                <div className={s.mipSection}>
                  <h3 className={s.mipTitle}>MIP Details</h3>
                  <div className={s.mipGrid}>
                    <Stat label="Upfront MIP (1.75%)" value={fmtMoney(result.upfrontMIP, currency)} />
                    <Stat label="Financed into Loan" value={fmtMoney(result.totalLoanWithMIP, currency)} />
                    <Stat label="Total MIP Paid" value={fmtMoney(result.totalMIPPaid, currency)} />
                    <Stat label="MIP Removed" value={
                      dp >= 10 && result.mipRemovedMonth
                        ? `Month ${result.mipRemovedMonth}`
                        : dp < 10
                          ? 'Life of loan'
                          : 'After 11 yrs'
                    } />
                  </div>
                  {dp < 10 && (
                    <div className={s.mipWarning}>
                      ⚠️ With under 10% down, FHA MIP lasts the <strong>life of the loan</strong>. Consider refinancing to conventional once you reach 20% equity.
                    </div>
                  )}
                </div>

                <div className={s.loanSummary}>
                  <SumRow label="Base Loan" value={fmtMoney(result.loanAmount, currency)} />
                  <SumRow label="Total Interest" value={fmtMoney(result.totalInterest, currency)} />
                  <SumRow label="Total MIP" value={fmtMoney(result.totalMIPPaid, currency)} />
                  <SumRow label="Total Cost" value={fmtMoney(result.totalPayment + result.upfrontMIP, currency)} bold />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏠</div>
                <p>{belowMinDown ? 'FHA requires a minimum 3.5% down payment.' : 'Enter loan details to calculate your FHA payment.'}</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Annual Payment Breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Bar dataKey="Principal" fill="#10b981" radius={[2,2,0,0]} stackId="a" />
                  <Bar dataKey="Interest" fill="#ef4444" radius={[0,0,0,0]} stackId="a" />
                  <Bar dataKey="MIP" fill="#f59e0b" radius={[2,2,0,0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <AdRectangle slot="20000000002" />

          <article className={s.article}>
            <h2>How FHA Loans Work</h2>
            <p>FHA loans are backed by the Federal Housing Administration, which allows lenders to offer more favorable terms to buyers who might not qualify for conventional mortgages. The trade-off is Mortgage Insurance Premium (MIP) — both upfront and annual — which protects the lender if you default.</p>

            {result && hp > 0 && (
              <div className={s.example}>
                <h3>📊 Your FHA Loan</h3>
                <p><strong>{fmtMoney(hp, currency)}</strong> home with <strong>{dp}% down</strong> at <strong>{rate}%</strong>:</p>
                <ul>
                  <li>Down payment: <strong>{fmtMoney(result.downPayment, currency)}</strong></li>
                  <li>Base loan: <strong>{fmtMoney(result.loanAmount, currency)}</strong></li>
                  <li>Upfront MIP (1.75%): <strong>{fmtMoney(result.upfrontMIP, currency)}</strong> (financed)</li>
                  <li>Total loan with MIP: <strong>{fmtMoney(result.totalLoanWithMIP, currency)}</strong></li>
                  <li>Monthly P&I + MIP: <strong>{fmtMoney(result.monthlyPI + result.monthlyMIP, currency)}</strong></li>
                  <li>Total MIP over loan life: <strong>{fmtMoney(result.totalMIPPaid, currency)}</strong></li>
                </ul>
              </div>
            )}

            <h2>Upfront MIP vs Annual MIP</h2>
            <p>FHA charges two types of MIP. The <strong>upfront MIP</strong> is 1.75% of the base loan amount, typically rolled into the loan balance. The <strong>annual MIP</strong> (paid monthly) ranges from 0.50% to 0.75% of the loan amount depending on term, loan size, and LTV ratio.</p>

            <h2>When to Use FHA vs Conventional</h2>
            <p>FHA is ideal if your credit score is below 680 or your down payment is under 5%. Once you can put 20% down, a conventional loan typically costs less because there's no PMI. If you have a score above 740, conventional loans usually offer better rates. The lifetime MIP on FHA loans with under 10% down can add tens of thousands to your total cost.</p>

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

          <AdBanner slot="20000000003" />
        </div>
      </div>
    </>
  )
}

function BRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`${s.bRow} ${highlight ? s.bRowHighlight : ''}`}>
      <span>{label}</span>
      <span className={s.bVal}>{value}</span>
    </div>
  )
}

function SumRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`${s.sumRow} ${bold ? s.sumRowBold : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.mipStat}>
      <span className={s.mipStatLabel}>{label}</span>
      <span className={s.mipStatValue}>{value}</span>
    </div>
  )
}