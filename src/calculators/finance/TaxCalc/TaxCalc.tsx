import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcTax, fmt, pct, FilingStatus } from './taxEngine'
import { COUNTRIES } from './taxRates'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './TaxCalc.module.css'

const STATUSES = [
  { value: 'single', label: 'Single' },
  { value: 'married_jointly', label: 'Married Filing Jointly' },
  { value: 'married_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
]
const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6']

const FAQS = [
  { question: 'What is the difference between effective and marginal tax rate?',
    answer: 'Your marginal rate is the rate on your last dollar earned — the top bracket you reach. Your effective rate is total tax divided by gross income — the true average rate you pay. Most people pay far less than their marginal rate because only income within each bracket is taxed at that bracket\'s rate.' },
  { question: 'What is the 2024 standard deduction?',
    answer: 'For 2024: $14,600 for single filers, $29,200 for married filing jointly, $14,600 for married filing separately, and $21,900 for head of household. These are adjusted annually for inflation.' },
  { question: 'Does this include Social Security and Medicare taxes?',
    answer: 'Yes. For US filers, FICA taxes are included: Social Security at 6.2% on wages up to $168,600, and Medicare at 1.45% on all wages, plus a 0.9% surcharge on income above $200,000.' },
  { question: 'Is state income tax included?',
    answer: 'Yes for US filers. Select your state to include an estimated state income tax. Nine states have no income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming.' },
]

export default function TaxCalcPage() {
  const [income, setIncome] = useState('')
  const [country, setCountry] = useState('United States')
  const [status, setStatus] = useState<FilingStatus>('single')
  const [state, setState] = useState('No State Tax')

  const data = COUNTRIES[country]
  const isUS = country === 'United States'
  const states = isUS && data.stateRates ? Object.keys(data.stateRates) : []
  const sym = data.symbol

  const result = useMemo(() => {
    const n = parseFloat(income.replace(/,/g, ''))
    if (!n || n <= 0) return null
    return calcTax(n, status, data, isUS ? state : undefined)
  }, [income, status, data, isUS, state])

  const pie = result ? [
    { name: 'Federal Tax', value: Math.round(result.federalTax) },
    { name: 'State Tax', value: Math.round(result.stateTax) },
    { name: 'Social Security', value: Math.round(result.socialSecurity) },
    { name: 'Medicare', value: Math.round(result.medicare) },
    { name: 'Take-Home', value: Math.round(result.takeHome) },
  ].filter(d => d.value > 0) : []

  const gross = parseFloat(income.replace(/,/g, '')) || 0

  return (
    <>
      <SEOHead
        title="Income Tax Calculator 2024 – Federal & State Tax Estimator"
        description="Free 2024 income tax calculator. Instantly estimate federal tax, state tax, Social Security, Medicare, effective rate, and take-home pay for US, UK, Canada, Australia, and India."
        canonical="/finance/income-tax-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>Finance › Tax</p>
            <h1 className={s.h1}>Income Tax Calculator 2024</h1>
            <p className={s.sub}>Estimate your federal & state taxes, effective rate, and take-home pay instantly.</p>
          </div>

          <AdBanner slot="2000000001" />

          <div className={s.grid}>
            {/* Inputs */}
            <div className={s.card}>
              <h2 className={s.cardTitle}>Your Details</h2>
              <Field label="Country">
                <select className={s.select} value={country} onChange={e => setCountry(e.target.value)}>
                  {Object.keys(COUNTRIES).map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={`Annual Gross Income (${sym})`}>
                <input className={s.input} type="number" placeholder="e.g. 75000" value={income}
                  onChange={e => setIncome(e.target.value)} min="0" step="1000" />
              </Field>
              {isUS && (
                <Field label="Filing Status">
                  <select className={s.select} value={status} onChange={e => setStatus(e.target.value as FilingStatus)}>
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
              )}
              {isUS && (
                <Field label="State">
                  <select className={s.select} value={state} onChange={e => setState(e.target.value)}>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              )}
            </div>

            {/* Results */}
            {result ? (
              <div className={`${s.card} animate-in`}>
                <h2 className={s.cardTitle}>Your Tax Breakdown</h2>
                <div className={s.stats}>
                  <Stat label="Take-Home Pay" value={fmt(result.takeHome, sym)} green />
                  <Stat label="Total Tax" value={fmt(result.totalTax, sym)} />
                  <Stat label="Effective Rate" value={pct(result.effectiveRate)} />
                  <Stat label="Marginal Rate" value={pct(result.marginalRate)} />
                  <Stat label="Monthly Take-Home" value={fmt(result.monthly, sym)} />
                  <Stat label="Weekly Take-Home" value={fmt(result.weekly, sym)} />
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} strokeWidth={2} stroke="var(--bg-surface)">
                      {pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmt(v, sym)}
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <p className={s.bracketLabel}>Federal Bracket Breakdown</p>
                <div className={s.brackets}>
                  <div className={s.bracketHead}><span>Rate</span><span>Taxed Amount</span><span>Tax</span></div>
                  {result.brackets.map((b, i) => (
                    <div key={i} className={s.bracketRow}>
                      <span className={s.rate}>{pct(b.rate)}</span>
                      <span>{fmt(b.amount, sym)}</span>
                      <span className={s.taxAmt}>{fmt(b.tax, sym)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>◈</div>
                <p>Enter your income above to see your full tax breakdown.</p>
              </div>
            )}
          </div>

          <AdRectangle slot="2000000002" />

          {/* SEO Article */}
          <article className={s.article}>
            <h2>How to Use This Income Tax Calculator</h2>
            <p>Enter your annual gross income, select your country and filing status, and choose your state if you're in the US. Results update instantly — no button click needed. The calculator covers federal income tax, state income tax (US), Social Security, and Medicare taxes for the 2024 tax year.</p>

            {result && gross > 0 && (
              <div className={s.example}>
                <h3>📊 Your Personalised Breakdown</h3>
                <p>On a gross income of <strong>{fmt(gross, sym)}</strong> filing as <strong>{isUS ? STATUSES.find(st => st.value === status)?.label : country}</strong>:</p>
                <ul>
                  <li>Standard deduction reduces taxable income to <strong>{fmt(result.taxableIncome, sym)}</strong></li>
                  <li>Federal income tax: <strong>{fmt(result.federalTax, sym)}</strong></li>
                  {result.stateTax > 0 && <li>State tax ({state}): <strong>{fmt(result.stateTax, sym)}</strong></li>}
                  {result.socialSecurity > 0 && <li>Social Security: <strong>{fmt(result.socialSecurity, sym)}</strong></li>}
                  {result.medicare > 0 && <li>Medicare: <strong>{fmt(result.medicare, sym)}</strong></li>}
                  <li>You keep <strong>{pct(1 - result.effectiveRate)}</strong> of every dollar on average</li>
                </ul>
              </div>
            )}

            <h2>How Federal Tax Brackets Work in 2024</h2>
            <p>The US tax system is progressive — you don't pay the same rate on all income. Income is taxed at increasing rates as it moves through each bracket. For 2024, there are seven federal brackets from 10% to 37%. Reaching the 22% bracket doesn't mean all income is taxed at 22% — only the income within that bracket pays 22%. Everything below still pays 10% and 12%.</p>

            <h2>Standard Deduction vs. Itemizing</h2>
            <p>Before any tax is calculated, the IRS lets you reduce taxable income through deductions. The 2024 standard deduction is $14,600 for single filers and $29,200 for married couples filing jointly. Around 90% of taxpayers claim the standard deduction because it exceeds their itemizable expenses. You should only itemize if your mortgage interest, charitable donations, state taxes (capped at $10,000), and large medical expenses exceed the standard deduction.</p>

            <h2>FICA: Social Security and Medicare</h2>
            <p>On top of income tax, employees pay FICA taxes. Social Security is 6.2% on the first $168,600 of wages in 2024. Medicare is 1.45% on all wages with an extra 0.9% on income above $200,000 for single filers. Self-employed workers pay both the employee and employer share — 15.3% total — but can deduct half as a business expense.</p>

            <h2>State Income Taxes</h2>
            <p>State income taxes vary dramatically. Florida, Texas, Nevada, Washington, Alaska, South Dakota, Tennessee, New Hampshire, and Wyoming have no income tax. California has the highest top rate at 13.3%. States like Illinois use a flat rate (4.95%) while others like New York use graduated brackets similar to the federal system.</p>

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

          <AdBanner slot="2000000003" />
        </div>
      </div>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {children}
    </div>
  )
}

function Stat({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={`${s.stat} ${green ? s.statGreen : ''}`}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue}>{value}</span>
    </div>
  )
}
