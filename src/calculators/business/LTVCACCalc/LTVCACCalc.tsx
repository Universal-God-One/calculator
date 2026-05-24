import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcLTVCAC, INDUSTRY_BENCHMARKS } from './ltvCacEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'
import s from './LTVCACCalc.module.css'

const FAQS = [
  { question: 'What is LTV (Customer Lifetime Value)?', answer: 'LTV (or CLV) is the total revenue you can expect from a single customer over their entire relationship with your business. For subscription businesses: LTV = (Average Monthly Revenue × Gross Margin) / Monthly Churn Rate. A $100/month customer with 80% margin and 2% monthly churn has an LTV of $4,000.' },
  { question: 'What is CAC (Customer Acquisition Cost)?', answer: 'CAC is the total cost to acquire one new customer, including all sales and marketing expenses. CAC = Total Sales & Marketing Spend / New Customers Acquired. If you spend $50,000/month on sales and marketing and acquire 100 customers, CAC = $500.' },
  { question: 'What is a good LTV:CAC ratio?', answer: 'The SaaS industry standard is 3:1 or higher. A ratio below 1:1 means you lose money on every customer. At 1-2:1 you are barely covering costs. At 3:1 you have sustainable unit economics. At 5:1+ you may be underinvesting in growth. VCs typically look for 3:1 minimum.' },
  { question: 'What is the CAC payback period?', answer: 'CAC payback period is how many months it takes to recover your customer acquisition cost through gross profit. Payback = CAC / (Monthly Revenue x Gross Margin). A 12-month payback is considered good for SaaS; under 6 months is excellent. Shorter payback = less risk and faster reinvestment.' },
  { question: 'How can I improve my LTV:CAC ratio?', answer: 'Increase LTV by reducing churn (better onboarding, customer success), increasing prices, or expanding revenue (upsells/cross-sells). Reduce CAC by improving conversion rates, focusing on high-ROI channels, or improving sales efficiency. Usually reducing churn has the most dramatic impact.' },
]

export default function LTVCACCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [arpu, setArpu] = useState('100')
  const [grossMargin, setGrossMargin] = useState('80')
  const [churn, setChurn] = useState('2')
  const [cac, setCac] = useState('500')
  const [salesCycle, setSalesCycle] = useState('0')

  const result = useMemo(() => {
    const a = parseFloat(arpu) || 0
    const gm = parseFloat(grossMargin) || 0
    const ch = parseFloat(churn) || 0
    const c = parseFloat(cac) || 0
    const sc = parseFloat(salesCycle) || 0
    if (a <= 0 || c <= 0) return null
    try { return calcLTVCAC(a, gm, ch, c, sc) } catch { return null }
  }, [arpu, grossMargin, churn, cac, salesCycle])

  return (
    <>
      <SEOHead
        title="LTV to CAC Ratio Calculator - Customer Lifetime Value and Acquisition Cost"
        description="Free LTV:CAC ratio calculator. Calculate customer lifetime value, acquisition cost ratio, payback period, and compare to industry benchmarks."
        canonical="/business/ltv-cac-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Growth Metrics</p>
            <h1 className={s.h1}>LTV to CAC Calculator</h1>
            <p className={s.sub}>Calculate customer lifetime value, acquisition cost ratio, and payback period.</p>
            <div className={s.formulaRow}>
              <span className={s.formula}>LTV = (ARPU x Margin) / Churn</span>
              <span className={s.formulaSep}>·</span>
              <span className={s.formula}>Ratio = LTV / CAC</span>
            </div>
          </div>

          <AdBanner slot="45000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Business Metrics</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              <div className={s.fieldGroup}>
                <h3 className={s.groupTitle}>LTV Inputs</h3>
                <div className={s.field}>
                  <label className={s.label}>Avg Monthly Revenue per Customer</label>
                  <input className={s.input} type="number" value={arpu} onChange={e => setArpu(e.target.value)} min="0" step="10" placeholder="e.g. 100" />
                  <span className={s.hint}>ARPU — average monthly recurring revenue per user</span>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Gross Margin (%)</label>
                  <input className={s.input} type="number" value={grossMargin} onChange={e => setGrossMargin(e.target.value)} min="0" max="100" step="1" placeholder="e.g. 80" />
                  <span className={s.hint}>Revenue minus COGS, as % of revenue</span>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Monthly Churn Rate (%)</label>
                  <input className={s.input} type="number" value={churn} onChange={e => setChurn(e.target.value)} min="0" max="100" step="0.1" placeholder="e.g. 2" />
                  <span className={s.hint}>% of customers who cancel each month</span>
                </div>
              </div>

              <div className={s.fieldGroup}>
                <h3 className={s.groupTitle}>CAC Inputs</h3>
                <div className={s.field}>
                  <label className={s.label}>Customer Acquisition Cost</label>
                  <input className={s.input} type="number" value={cac} onChange={e => setCac(e.target.value)} min="0" step="10" placeholder="e.g. 500" />
                  <span className={s.hint}>Total sales + marketing spend / new customers</span>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Sales Cycle (months)</label>
                  <input className={s.input} type="number" value={salesCycle} onChange={e => setSalesCycle(e.target.value)} min="0" step="1" placeholder="0" />
                  <span className={s.hint}>Optional: time from first contact to close</span>
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>LTV:CAC Analysis</h2>

                <div className={s.ratioBig}>
                  <div className={s.ratioNum} style={{ color: result.ratingColor }}>{result.ltvCacRatio}x</div>
                  <div className={s.ratioBadge} style={{ borderColor: result.ratingColor, color: result.ratingColor }}>{result.ratingLabel}</div>
                  <p className={s.ratioDesc}>{result.ratingDesc}</p>
                </div>

                <div className={s.gaugeWrap}>
                  <div className={s.gauge}>
                    <div className={s.gaugeZones}>
                      <div className={s.gZone} style={{ background: 'rgba(239,68,68,0.3)', width: '20%' }} />
                      <div className={s.gZone} style={{ background: 'rgba(245,158,11,0.3)', width: '20%' }} />
                      <div className={s.gZone} style={{ background: 'rgba(34,197,94,0.3)', width: '20%' }} />
                      <div className={s.gZone} style={{ background: 'rgba(16,185,129,0.3)', width: '40%' }} />
                    </div>
                    <div className={s.gaugeMarker} style={{ left: `${Math.min((result.ltvCacRatio / 6) * 100, 98)}%`, background: result.ratingColor }} />
                  </div>
                  <div className={s.gaugeLabels}><span>0x</span><span>1x</span><span>2x</span><span>3x</span><span>6x+</span></div>
                </div>

                <div className={s.statGrid}>
                  <BigStat label="LTV" value={fmtMoney(result.ltv, currency)} sub="lifetime value" green />
                  <BigStat label="CAC" value={fmtMoney(result.cac, currency)} sub="acquisition cost" />
                  <BigStat label="Payback Period" value={`${result.paybackPeriodMonths} mo`} sub={`${result.paybackPeriodYears} years`} />
                  <BigStat label="Customer Lifetime" value={`${result.customerLifetimeMonths} mo`} sub={`${Math.round(result.customerLifetimeMonths / 12 * 10) / 10} years`} />
                  <BigStat label="Monthly Contribution" value={fmtMoney(parseFloat(arpu) * parseFloat(grossMargin) / 100, currency)} sub="after gross margin" />
                  <BigStat label="LTV needed for 3x" value={fmtMoney(result.cac * 3, currency)} sub="benchmark target" />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>📈</div>
                <p>Enter your ARPU, gross margin, churn rate, and CAC to calculate your LTV:CAC ratio.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>CAC Recovery Over Time</h2>
              <p className={s.chartSub}>Cumulative gross profit per customer vs CAC</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={result.cumulativeRevenue.slice(0, Math.min(result.cumulativeRevenue.length, 48))}
                  margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    label={{ value: 'Month', position: 'insideBottom', fill: 'var(--text-muted)', fontSize: 11, offset: -10 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number, name: string) => [fmtMoney(v, currency), name]}
                    labelFormatter={l => `Month ${l}`}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <ReferenceLine x={Math.ceil(result.paybackPeriodMonths)} stroke="var(--accent-amber)" strokeDasharray="4 4"
                    label={{ value: `Payback: ${result.paybackPeriodMonths}mo`, fill: 'var(--accent-amber)', fontSize: 9, position: 'top' }} />
                  <Line type="monotone" dataKey="revenue" name="Cumulative Gross Profit" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="cac" name="CAC" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className={`${s.benchmarksCard} animate-in`}>
            <h2 className={s.benchTitle}>Industry Benchmarks</h2>
            <div className={s.benchTable}>
              <div className={s.benchHeader}>
                <span>Industry</span><span>LTV:CAC</span><span>Payback</span><span>Churn</span>
              </div>
              {INDUSTRY_BENCHMARKS.map(b => (
                <div key={b.industry} className={s.benchRow}>
                  <span className={s.benchIndustry}>{b.industry}</span>
                  <span className={s.benchVal}>{b.ltv_cac}</span>
                  <span className={s.benchVal}>{b.payback}</span>
                  <span className={s.benchVal}>{b.churn}</span>
                </div>
              ))}
            </div>
          </div>

          <article className={s.article}>
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

          <AdBanner slot="45000000002" />
        </div>
      </div>
    </>
  )
}

function BigStat({ label, value, sub, green }: { label: string; value: string; sub?: string; green?: boolean }) {
  return (
    <div className={s.bigStat}>
      <span className={s.bigLabel}>{label}</span>
      <span className={s.bigValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
      {sub && <span className={s.bigSub}>{sub}</span>}
    </div>
  )
}