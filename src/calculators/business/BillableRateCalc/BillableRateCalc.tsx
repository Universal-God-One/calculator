import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcBillableRate, INDUSTRY_RATES } from './billableRateEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import s from './BillableRateCalc.module.css'

const FAQS = [
  { question: 'How do I calculate my freelance hourly rate?', answer: 'Start with your target annual income, add business expenses and taxes, then divide by your billable hours per year. For example: $80,000 target + $10,000 expenses + 30% tax = ~$117,000 total cost. At 1,000 billable hours/year, that\'s $117/hour minimum. Add a profit margin for growth.' },
  { question: 'What is a billable hour utilization rate?', answer: 'Utilization rate is the percentage of your working hours that are actually billable to clients. 100% utilization is impossible — you spend time on admin, marketing, unpaid proposals, and learning. A realistic target is 60–75% for most freelancers. At 40 hours/week with 65% utilization, you have 26 billable hours/week.' },
  { question: 'Should I charge by the hour or by project?', answer: 'Hourly billing protects you from scope creep but caps your earning potential. Project-based billing rewards efficiency — if you finish faster, your effective rate is higher. Most experienced freelancers transition to project/value-based pricing, using hourly rate calculations only to sanity-check project quotes.' },
  { question: 'How do I handle taxes as a freelancer?', answer: 'As a self-employed freelancer, you pay both employer and employee portions of payroll taxes (self-employment tax ~15.3% in the US), plus income tax. Set aside 25–35% of revenue for taxes depending on your situation. Many freelancers pay quarterly estimated taxes to avoid penalties.' },
]

const PROJECT_HOURS = [2, 5, 10, 20, 40, 80, 160]

export default function BillableRateCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [salaryTarget, setSalaryTarget] = useState('80000')
  const [weeklyHours, setWeeklyHours] = useState('40')
  const [weeksPerYear, setWeeksPerYear] = useState('48')
  const [utilization, setUtilization] = useState('65')
  const [expenses, setExpenses] = useState('10000')
  const [taxRate, setTaxRate] = useState('30')
  const [profitMargin, setProfitMargin] = useState('20')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const s = parseFloat(salaryTarget) || 0
    const wh = parseFloat(weeklyHours) || 0
    const wy = parseFloat(weeksPerYear) || 0
    const u = parseFloat(utilization) || 0
    const ex = parseFloat(expenses) || 0
    const tr = parseFloat(taxRate) || 0
    const pm = parseFloat(profitMargin) || 0
    if (s <= 0 || wh <= 0 || wy <= 0) return null
    try { return calcBillableRate(s, wh, wy, u, ex, tr, pm) } catch { return null }
  }, [salaryTarget, weeklyHours, weeksPerYear, utilization, expenses, taxRate, profitMargin])

  return (
    <>
      <SEOHead
        title="Billable Rate Calculator – Freelance Hourly Rate"
        description="Free billable rate calculator for freelancers and consultants. Calculate your minimum and recommended hourly rate based on income target, expenses, taxes, and utilization."
        canonical="/business/billable-rate-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Freelancing</p>
            <h1 className={s.h1}>Billable Rate Calculator</h1>
            <p className={s.sub}>Calculate your minimum and recommended hourly rate as a freelancer or consultant.</p>
          </div>

          <AdBanner slot="46000000001" />

          <div className={s.mainGrid}>
            {/* Inputs */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Numbers</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              <div className={s.section}>
                <h3 className={s.sectionTitle}>Income Target</h3>
                <div className={s.field}>
                  <label className={s.label}>Annual Take-Home Target ({sym})</label>
                  <input className={s.input} type="number" value={salaryTarget}
                    onChange={e => setSalaryTarget(e.target.value)} min="0" step="1000" placeholder="e.g. 80000" />
                  <span className={s.hint}>Your desired net annual income after taxes</span>
                </div>
              </div>

              <div className={s.section}>
                <h3 className={s.sectionTitle}>Working Hours</h3>
                <div className={s.twoCol}>
                  <div className={s.field}>
                    <label className={s.label}>Hours per Week</label>
                    <input className={s.input} type="number" value={weeklyHours}
                      onChange={e => setWeeklyHours(e.target.value)} min="1" max="80" step="1" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Weeks per Year</label>
                    <input className={s.input} type="number" value={weeksPerYear}
                      onChange={e => setWeeksPerYear(e.target.value)} min="1" max="52" step="1" />
                    <span className={s.hint}>{52 - parseInt(weeksPerYear || '48')} weeks vacation</span>
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Billable Utilization Rate (%)</label>
                  <div className={s.sliderWrap}>
                    <input className={s.slider} type="range" value={utilization}
                      onChange={e => setUtilization(e.target.value)} min="10" max="100" step="5" />
                    <span className={s.sliderVal}>{utilization}%</span>
                  </div>
                  <span className={s.hint}>
                    {result ? `${result.billableHoursPerWeek} billable hrs/week · ${result.billableHoursPerYear} hrs/year` : 'Typically 55–75% for freelancers'}
                  </span>
                </div>
              </div>

              <div className={s.section}>
                <h3 className={s.sectionTitle}>Costs & Profit</h3>
                <div className={s.field}>
                  <label className={s.label}>Annual Business Expenses ({sym})</label>
                  <input className={s.input} type="number" value={expenses}
                    onChange={e => setExpenses(e.target.value)} min="0" step="500" placeholder="e.g. 10000" />
                  <span className={s.hint}>Software, hardware, insurance, marketing, etc.</span>
                </div>
                <div className={s.twoCol}>
                  <div className={s.field}>
                    <label className={s.label}>Tax Rate (%)</label>
                    <input className={s.input} type="number" value={taxRate}
                      onChange={e => setTaxRate(e.target.value)} min="0" max="60" step="1" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Profit Margin (%)</label>
                    <input className={s.input} type="number" value={profitMargin}
                      onChange={e => setProfitMargin(e.target.value)} min="0" max="80" step="5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Your Billable Rate</h2>

                <div className={s.rateDisplay}>
                  <div className={s.rateMain}>
                    <span className={s.rateLabel}>Recommended Rate</span>
                    <span className={s.rateValue}>{fmtMoney(result.recommendedRate, currency)}</span>
                    <span className={s.rateSub}>per hour</span>
                  </div>
                  <div className={s.rateMin}>
                    <span className={s.rateMinLabel}>Break-even minimum</span>
                    <span className={s.rateMinValue}>{fmtMoney(result.minimumHourlyRate, currency)}/hr</span>
                  </div>
                </div>

                <div className={s.rateGrid}>
                  <RateCard label="Daily Rate" value={fmtMoney(result.dailyRate, currency)} sub="8 hrs" />
                  <RateCard label="Weekly Rate" value={fmtMoney(result.weeklyRate, currency)} sub={`${result.billableHoursPerWeek} hrs`} />
                  <RateCard label="Monthly Revenue" value={fmtMoney(result.monthlyRevenue, currency)} green />
                  <RateCard label="Annual Revenue" value={fmtMoney(result.annualRevenue, currency)} green />
                </div>

                <div className={s.costBreakdown}>
                  <h3 className={s.breakTitle}>Annual Cost Breakdown</h3>
                  <CostRow label="Take-home target" value={fmtMoney(result.annualSalaryTarget, currency)} />
                  <CostRow label={`Taxes (${taxRate}%)`} value={fmtMoney(result.annualTax, currency)} />
                  <CostRow label="Business expenses" value={fmtMoney(result.annualExpenses, currency)} />
                  <div className={s.costDivider} />
                  <CostRow label="Total cost (break-even)" value={fmtMoney(result.totalAnnualCost, currency)} bold />
                  <CostRow label={`Profit buffer (${profitMargin}%)`} value={fmtMoney(result.profitBuffer, currency)} green />
                  <div className={s.costDivider} />
                  <CostRow label="Total annual revenue needed" value={fmtMoney(result.annualRevenue, currency)} bold green />
                </div>

                <div className={s.utilNote}>
                  <span className={s.utilLabel}>Effective rate (all hours):</span>
                  <span className={s.utilVal}>{fmtMoney(result.effectiveHourlyRate, currency)}/hr</span>
                  <span className={s.utilSub}>across all {Math.round(parseFloat(weeklyHours) * parseFloat(weeksPerYear))} working hours</span>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>💼</div>
                <p>Enter your income target and working hours to calculate your billable rate.</p>
              </div>
            )}
          </div>

          {/* Project quote helper */}
          {result && (
            <div className={`${s.projectCard} animate-in`}>
              <h2 className={s.projectTitle}>Project Quote Reference</h2>
              <p className={s.projectSub}>At {fmtMoney(result.recommendedRate, currency)}/hr — how much to charge for different project sizes</p>
              <div className={s.projectGrid}>
                {PROJECT_HOURS.map(hrs => (
                  <div key={hrs} className={s.projectRow}>
                    <span className={s.projectHours}>{hrs} hrs</span>
                    <span className={s.projectAmount}>{fmtMoney(result.projectRate(hrs), currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Industry rates */}
          <div className={`${s.industryCard} animate-in`}>
            <h2 className={s.industryTitle}>Industry Rate Benchmarks (USD)</h2>
            <div className={s.industryTable}>
              <div className={s.industryHeader}>
                <span>Role</span><span>Low</span><span>High</span><span>Mid</span>
              </div>
              {INDUSTRY_RATES.map(r => (
                <div key={r.role} className={s.industryRow}>
                  <span className={s.industryRole}>{r.role}</span>
                  <span className={s.industryRate}>${r.low}/hr</span>
                  <span className={s.industryRate}>${r.high}/hr</span>
                  <div className={s.industryBar}>
                    <div className={s.industryBarFill} style={{
                      marginLeft: `${(r.low / 350) * 100}%`,
                      width: `${((r.high - r.low) / 350) * 100}%`,
                    }} />
                    {result && result.recommendedRate >= r.low && result.recommendedRate <= r.high && (
                      <div className={s.yourRateMarker} style={{ left: `${(result.recommendedRate / 350) * 100}%` }} title="Your rate" />
                    )}
                  </div>
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

          <AdBanner slot="46000000002" />
        </div>
      </div>
    </>
  )
}

function RateCard({ label, value, sub, green }: { label: string; value: string; sub?: string; green?: boolean }) {
  return (
    <div className={s.rateCard}>
      <span className={s.rcLabel}>{label}</span>
      <span className={s.rcValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
      {sub && <span className={s.rcSub}>{sub}</span>}
    </div>
  )
}

function CostRow({ label, value, bold, green }: { label: string; value: string; bold?: boolean; green?: boolean }) {
  return (
    <div className={`${s.costRow} ${bold ? s.costBold : ''}`}>
      <span className={s.costLabel}>{label}</span>
      <span className={s.costVal} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}