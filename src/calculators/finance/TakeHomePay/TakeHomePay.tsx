import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcTakeHomePay, convertToAnnual, FilingStatus, PayFrequency, STATE_LIST } from './takeHomePayEngine'
import { fmtMoney } from '@/data/currencies'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './TakeHomePay.module.css'

const FILING_STATUSES = [
  { value: 'single', label: 'Single' },
  { value: 'married_jointly', label: 'Married Filing Jointly' },
  { value: 'married_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
]

const PAY_FREQS: { value: PayFrequency; label: string }[] = [
  { value: 'annually', label: 'Annual Salary' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'biweekly', label: 'Bi-Weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'hourly', label: 'Hourly Rate' },
]

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

const FAQS = [
  { question: 'What is take-home pay?', answer: 'Take-home pay (also called net pay) is what you actually receive after all deductions — federal income tax, state income tax, Social Security, Medicare, and any voluntary deductions like 401(k) contributions or health insurance premiums.' },
  { question: 'How is federal income tax calculated?', answer: 'Federal tax uses progressive brackets. Only the income within each bracket is taxed at that rate. The 2024 brackets range from 10% to 37%. The standard deduction ($14,600 for single filers in 2024) reduces your taxable income before brackets apply.' },
  { question: 'What are FICA taxes?', answer: 'FICA stands for Federal Insurance Contributions Act. It includes Social Security (6.2% on wages up to $168,600) and Medicare (1.45% on all wages, plus 0.9% extra above $200,000). These fund retirement and healthcare programs.' },
  { question: 'How do pre-tax deductions reduce my taxes?', answer: 'Pre-tax deductions like 401(k) contributions and health insurance premiums reduce your adjusted gross income before taxes are calculated. This lowers your taxable income, which means you pay less in both federal and state income tax — effectively getting a discount on those savings.' },
]

export default function TakeHomePayPage() {
  const [income, setIncome] = useState('75000')
  const [freq, setFreq] = useState<PayFrequency>('annually')
  const [status, setStatus] = useState<FilingStatus>('single')
  const [state, setState] = useState('No State Tax')
  const [k401, setK401] = useState('0')
  const [health, setHealth] = useState('0')

  const grossAnnual = useMemo(() => {
    const n = parseFloat(income) || 0
    return convertToAnnual(n, freq)
  }, [income, freq])

  const result = useMemo(() => {
    if (grossAnnual <= 0) return null
    return calcTakeHomePay(
      grossAnnual,
      status,
      state,
      parseFloat(k401) || 0,
      parseFloat(health) || 0
    )
  }, [grossAnnual, status, state, k401, health])

  const fmt = (n: number) => fmtMoney(n, 'USD')

  const pieData = result ? [
    { name: 'Take-Home', value: Math.round(result.netAnnual) },
    { name: 'Federal Tax', value: Math.round(result.federalTax) },
    { name: 'State Tax', value: Math.round(result.stateTax) },
    { name: 'Social Security', value: Math.round(result.socialSecurity) },
    { name: 'Medicare', value: Math.round(result.medicare) },
  ].filter(d => d.value > 0) : []

  return (
    <>
      <SEOHead
        title="Take-Home Pay Calculator – Net Salary After Tax"
        description="Free take-home pay calculator. Calculate your net salary after federal tax, state tax, Social Security, and Medicare. Supports hourly, weekly, biweekly, and annual pay."
        canonical="/finance/take-home-pay-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Paycheck</p>
            <h1 className={s.h1}>Take-Home Pay Calculator</h1>
            <p className={s.sub}>Calculate your exact net pay after all federal and state taxes. Enter any pay frequency.</p>
          </div>

          <AdBanner slot="13000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Pay Details</h2>

              <div className={s.field}>
                <label className={s.label}>Pay Frequency</label>
                <select className={s.select} value={freq} onChange={e => setFreq(e.target.value as PayFrequency)}>
                  {PAY_FREQS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>
                  {freq === 'hourly' ? 'Hourly Rate ($)' :
                   freq === 'weekly' ? 'Weekly Pay ($)' :
                   freq === 'biweekly' ? 'Bi-Weekly Pay ($)' :
                   freq === 'monthly' ? 'Monthly Salary ($)' : 'Annual Salary ($)'}
                </label>
                <input className={s.input} type="number" value={income}
                  onChange={e => setIncome(e.target.value)} min="0" step="1000" placeholder="e.g. 75000" />
                {grossAnnual > 0 && freq !== 'annually' && (
                  <span className={s.hint}>= {fmt(grossAnnual)} / year</span>
                )}
              </div>

              <div className={s.field}>
                <label className={s.label}>Filing Status</label>
                <select className={s.select} value={status} onChange={e => setStatus(e.target.value as FilingStatus)}>
                  {FILING_STATUSES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>State</label>
                <select className={s.select} value={state} onChange={e => setState(e.target.value)}>
                  {STATE_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual 401(k) Contribution ($)</label>
                <input className={s.input} type="number" value={k401}
                  onChange={e => setK401(e.target.value)} min="0" step="500" placeholder="0" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Health Insurance Premium ($)</label>
                <input className={s.input} type="number" value={health}
                  onChange={e => setHealth(e.target.value)} min="0" step="100" placeholder="0" />
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Your Take-Home Pay</h2>

                <div className={s.payGrid}>
                  <PayRow label="Annual" gross={fmt(result.grossAnnual)} net={fmt(result.netAnnual)} highlight />
                  <PayRow label="Monthly" gross={fmt(result.grossMonthly)} net={fmt(result.netMonthly)} />
                  <PayRow label="Bi-Weekly" gross={fmt(result.grossBiweekly)} net={fmt(result.netBiweekly)} />
                  <PayRow label="Weekly" gross={fmt(result.grossWeekly)} net={fmt(result.netWeekly)} />
                  <PayRow label="Daily" gross="—" net={fmt(result.netDaily)} />
                  <PayRow label="Hourly" gross="—" net={fmt(result.netHourly)} />
                </div>

                <div className={s.taxBreakdown}>
                  <h3 className={s.breakdownTitle}>Tax Breakdown (Annual)</h3>
                  <div className={s.taxRows}>
                    <TaxRow label="Federal Income Tax" value={fmt(result.federalTax)} pct={result.federalTax / result.grossAnnual} color="#3b82f6" />
                    <TaxRow label="State Income Tax" value={fmt(result.stateTax)} pct={result.stateTax / result.grossAnnual} color="#f59e0b" />
                    <TaxRow label="Social Security" value={fmt(result.socialSecurity)} pct={result.socialSecurity / result.grossAnnual} color="#10b981" />
                    <TaxRow label="Medicare" value={fmt(result.medicare)} pct={result.medicare / result.grossAnnual} color="#ef4444" />
                    <div className={s.taxTotal}>
                      <span>Total Tax</span>
                      <span>{fmt(result.totalTax)}</span>
                      <span>{(result.effectiveRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>💵</div>
                <p>Enter your salary to calculate take-home pay.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Where Your Money Goes</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={100} strokeWidth={2} stroke="var(--bg-surface)">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <AdRectangle slot="13000000002" />

          <article className={s.article}>
            <h2>How Take-Home Pay Is Calculated</h2>
            <p>Your gross salary goes through several deductions before you receive it. First, pre-tax deductions like 401(k) and health insurance reduce your adjusted gross income. Then the standard deduction is applied to find taxable income. Federal tax, state tax, Social Security, and Medicare are all calculated and subtracted.</p>

            {result && (
              <div className={s.example}>
                <h3>📊 Your Pay Summary</h3>
                <ul>
                  <li>Gross annual salary: <strong>{fmt(result.grossAnnual)}</strong></li>
                  <li>Total taxes: <strong>{fmt(result.totalTax)}</strong> ({(result.effectiveRate * 100).toFixed(1)}% effective rate)</li>
                  <li>Take-home annual: <strong>{fmt(result.netAnnual)}</strong></li>
                  <li>Take-home monthly: <strong>{fmt(result.netMonthly)}</strong></li>
                  <li>Marginal tax rate: <strong>{(result.marginalRate * 100).toFixed(0)}%</strong></li>
                </ul>
              </div>
            )}

            <h2>How Pre-Tax Deductions Save You Money</h2>
            <p>Contributing to a 401(k) or paying health insurance premiums pre-tax reduces your taxable income. If you contribute $5,000/year to a 401(k) and you're in the 22% bracket, you save $1,100 in federal taxes alone. This is one of the most effective ways to legally reduce your tax bill.</p>

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

          <AdBanner slot="13000000003" />
        </div>
      </div>
    </>
  )
}

function PayRow({ label, gross, net, highlight }: { label: string; gross: string; net: string; highlight?: boolean }) {
  return (
    <div className={`${s.payRow} ${highlight ? s.payRowHighlight : ''}`}>
      <span className={s.payLabel}>{label}</span>
      <span className={s.payGross}>{gross}</span>
      <span className={s.payNet}>{net}</span>
    </div>
  )
}

function TaxRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className={s.taxRow}>
      <span className={s.taxDot} style={{ background: color }} />
      <span className={s.taxLabel}>{label}</span>
      <span className={s.taxValue}>{value}</span>
      <span className={s.taxPct}>{(pct * 100).toFixed(1)}%</span>
    </div>
  )
}