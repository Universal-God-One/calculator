import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcAffordability } from './affordabilityEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './HouseAffordability.module.css'

const FAQS = [
  { question: 'How much house can I afford?', answer: 'A common rule is the 28/36 rule: spend no more than 28% of gross monthly income on housing (front-end ratio) and no more than 36% on all debt (back-end ratio). Lenders use these ratios to approve mortgages. This calculator uses those exact rules to find your maximum home price.' },
  { question: 'What is the front-end ratio?', answer: 'The front-end ratio (also called the housing ratio) is your total monthly housing cost divided by your gross monthly income. It includes principal, interest, property taxes, insurance, PMI, and HOA fees. Most conventional lenders require this to be 28% or below.' },
  { question: 'What is the back-end ratio (DTI)?', answer: 'The back-end ratio or Debt-to-Income (DTI) ratio is all monthly debt payments divided by gross monthly income. It includes housing plus car loans, student loans, credit cards, and other debts. Most lenders require this to be 36–43% or below.' },
  { question: 'What is PMI?', answer: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. It typically costs 0.5–1.5% of the loan annually, added to your monthly payment. PMI can be removed once you reach 20% equity in the home.' },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function HouseAffordabilityPage() {
  const [currency, setCurrency] = useState('USD')
  const [annualIncome, setAnnualIncome] = useState('80000')
  const [monthlyDebts, setMonthlyDebts] = useState('500')
  const [downPayment, setDownPayment] = useState('60000')
  const [rate, setRate] = useState('7')
  const [term, setTerm] = useState('30')
  const [propertyTax, setPropertyTax] = useState('1.2')
  const [homeInsurance, setHomeInsurance] = useState('1500')
  const [hoa, setHoa] = useState('0')
  const [frontEnd, setFrontEnd] = useState('28')
  const [backEnd, setBackEnd] = useState('36')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const ai = parseFloat(annualIncome) || 0
    const md = parseFloat(monthlyDebts) || 0
    const dp = parseFloat(downPayment) || 0
    const r = parseFloat(rate) || 0
    const t = parseInt(term) || 30
    const pt = parseFloat(propertyTax) || 0
    const hi = parseFloat(homeInsurance) || 0
    const h = parseFloat(hoa) || 0
    const fe = parseFloat(frontEnd) || 28
    const be = parseFloat(backEnd) || 36
    if (ai <= 0 || r <= 0) return null
    return calcAffordability(ai, md, dp, r, t, pt, hi, h, fe, be)
  }, [annualIncome, monthlyDebts, downPayment, rate, term, propertyTax, homeInsurance, hoa, frontEnd, backEnd])

  const ai = parseFloat(annualIncome) || 0
  const dp = parseFloat(downPayment) || 0

  const pieData = result ? [
    { name: 'Principal & Interest', value: result.breakdown.principal },
    { name: 'Property Tax', value: result.breakdown.propertyTax },
    { name: 'Insurance', value: result.breakdown.insurance },
    { name: 'PMI', value: result.breakdown.pmi },
    { name: 'HOA', value: result.breakdown.hoa },
  ].filter(d => d.value > 0) : []

  const dpPct = result && result.maxHomePrice > 0 ? ((dp / result.maxHomePrice) * 100).toFixed(1) : '0'

  return (
    <>
      <SEOHead
        title="House Affordability Calculator – How Much Can I Afford?"
        description="Free house affordability calculator. Find out how much home you can afford based on your income, debts, and down payment using the 28/36 rule."
        canonical="/real-estate/house-affordability-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Affordability</p>
            <h1 className={s.h1}>House Affordability Calculator</h1>
            <p className={s.sub}>Find out how much home you can afford based on your income and the 28/36 lending rule.</p>
          </div>

          <AdBanner slot="18000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Financial Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Gross Income ({sym})</label>
                <input className={s.input} type="number" value={annualIncome}
                  onChange={e => setAnnualIncome(e.target.value)} min="0" step="5000" placeholder="e.g. 80000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Monthly Debt Payments ({sym})</label>
                <input className={s.input} type="number" value={monthlyDebts}
                  onChange={e => setMonthlyDebts(e.target.value)} min="0" step="50" placeholder="car, student loans, etc." />
              </div>

              <div className={s.field}>
                <label className={s.label}>Down Payment ({sym})</label>
                <input className={s.input} type="number" value={downPayment}
                  onChange={e => setDownPayment(e.target.value)} min="0" step="5000" placeholder="e.g. 60000" />
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
                    <option value="20">20 Years</option>
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

              <div className={s.field}>
                <label className={s.label}>HOA ({sym}/month)</label>
                <input className={s.input} type="number" value={hoa}
                  onChange={e => setHoa(e.target.value)} min="0" step="50" placeholder="0" />
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Front-End Limit (%)</label>
                  <input className={s.input} type="number" value={frontEnd}
                    onChange={e => setFrontEnd(e.target.value)} min="15" max="45" step="1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Back-End Limit (%)</label>
                  <input className={s.input} type="number" value={backEnd}
                    onChange={e => setBackEnd(e.target.value)} min="20" max="55" step="1" />
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Your Home Budget</h2>

                <div className={s.maxPrice}>
                  <span className={s.maxLabel}>Maximum Home Price</span>
                  <span className={s.maxValue}>{fmtMoney(result.maxHomePrice, currency)}</span>
                  <span className={s.maxSub}>With {fmtMoney(dp, currency)} down ({dpPct}%) → {fmtMoney(result.maxLoanAmount, currency)} loan</span>
                </div>

                {/* 3 scenarios */}
                <div className={s.scenarios}>
                  <div className={`${s.scenario} ${s.scenarioConservative}`}>
                    <span className={s.scenLabel}>Conservative</span>
                    <span className={s.scenValue}>{fmtMoney(result.conservative, currency)}</span>
                    <span className={s.scenNote}>25% front-end</span>
                  </div>
                  <div className={`${s.scenario} ${s.scenarioModerate}`}>
                    <span className={s.scenLabel}>Moderate</span>
                    <span className={s.scenValue}>{fmtMoney(result.moderate, currency)}</span>
                    <span className={s.scenNote}>28% front-end</span>
                  </div>
                  <div className={`${s.scenario} ${s.scenarioAggressive}`}>
                    <span className={s.scenLabel}>Aggressive</span>
                    <span className={s.scenValue}>{fmtMoney(result.aggressive, currency)}</span>
                    <span className={s.scenNote}>36% front-end</span>
                  </div>
                </div>

                <div className={s.monthlyBreakdown}>
                  <h3 className={s.breakdownTitle}>Monthly Payment Breakdown</h3>
                  <div className={s.breakdownRows}>
                    <BRow label="Principal & Interest" value={fmtMoney(result.breakdown.principal, currency)} />
                    <BRow label="Property Tax" value={fmtMoney(result.breakdown.propertyTax, currency)} />
                    <BRow label="Home Insurance" value={fmtMoney(result.breakdown.insurance, currency)} />
                    {result.breakdown.pmi > 0 && <BRow label="PMI" value={fmtMoney(result.breakdown.pmi, currency)} warn />}
                    {result.breakdown.hoa > 0 && <BRow label="HOA" value={fmtMoney(result.breakdown.hoa, currency)} />}
                    <div className={s.breakdownTotal}>
                      <span>Total Monthly</span>
                      <span>{fmtMoney(result.breakdown.total, currency)}</span>
                    </div>
                  </div>
                </div>

                <div className={s.ratios}>
                  <RatioBar label="Front-End Ratio" value={result.frontEndRatio} limit={parseFloat(frontEnd)} />
                  <RatioBar label="Back-End Ratio" value={result.backEndRatio} limit={parseFloat(backEnd)} />
                </div>

                {result.breakdown.pmi > 0 && (
                  <div className={s.pmiWarning}>
                    ⚠️ Down payment is under 20% — PMI of {fmtMoney(result.breakdown.pmi, currency)}/mo applies until you reach 20% equity.
                  </div>
                )}
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏡</div>
                <p>Enter your income and details to find your home budget.</p>
              </div>
            )}
          </div>

          {result && pieData.length > 0 && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Monthly Payment Breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={100} strokeWidth={2} stroke="var(--bg-surface)">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <AdRectangle slot="18000000002" />

          <article className={s.article}>
            <h2>How Home Affordability Is Calculated</h2>
            <p>Lenders use two ratios to determine how much you can borrow. The <strong>front-end ratio</strong> limits your total housing payment to 28% of gross monthly income. The <strong>back-end ratio</strong> limits all debt payments (housing + other debts) to 36% of income. Your maximum home price is whichever limit is more restrictive.</p>

            {result && ai > 0 && (
              <div className={s.example}>
                <h3>📊 Your Budget</h3>
                <p>On <strong>{fmtMoney(ai, currency)}/year</strong> income ({fmtMoney(result.monthlyIncome, currency)}/month):</p>
                <ul>
                  <li>Maximum home price: <strong>{fmtMoney(result.maxHomePrice, currency)}</strong></li>
                  <li>Loan amount: <strong>{fmtMoney(result.maxLoanAmount, currency)}</strong></li>
                  <li>Total monthly payment: <strong>{fmtMoney(result.breakdown.total, currency)}</strong></li>
                  <li>Front-end ratio: <strong>{result.frontEndRatio}%</strong> (limit: {frontEnd}%)</li>
                  <li>Back-end ratio: <strong>{result.backEndRatio}%</strong> (limit: {backEnd}%)</li>
                </ul>
              </div>
            )}

            <h2>The 28/36 Rule Explained</h2>
            <p>The 28/36 rule is the standard guideline used by conventional lenders. No more than 28% of your gross monthly income should go to housing costs (PITI — principal, interest, taxes, insurance). No more than 36% should go to all debt combined. FHA loans allow slightly higher ratios (31/43), and some conventional lenders go up to 45% back-end DTI.</p>

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

          <AdBanner slot="18000000003" />
        </div>
      </div>
    </>
  )
}

function BRow({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={s.bRow}>
      <span style={warn ? { color: 'var(--accent-amber)' } : {}}>{label}</span>
      <span className={s.bVal} style={warn ? { color: 'var(--accent-amber)' } : {}}>{value}</span>
    </div>
  )
}

function RatioBar({ label, value, limit }: { label: string; value: number; limit: number }) {
  const pct = Math.min((value / limit) * 100, 100)
  const ok = value <= limit
  return (
    <div className={s.ratioBar}>
      <div className={s.ratioHeader}>
        <span className={s.ratioLabel}>{label}</span>
        <span className={s.ratioValue} style={{ color: ok ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {value}% / {limit}%
        </span>
      </div>
      <div className={s.ratioTrack}>
        <div className={s.ratioFill} style={{ width: `${pct}%`, background: ok ? 'var(--accent-green)' : 'var(--accent-red)' }} />
      </div>
    </div>
  )
}