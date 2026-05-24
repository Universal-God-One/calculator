import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcRentalROI } from './rentalROIEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './RentalROI.module.css'

const FAQS = [
  { question: 'What is cap rate?', answer: 'Cap rate (capitalization rate) is the annual Net Operating Income (NOI) divided by the property purchase price, expressed as a percentage. It measures the income potential of a property independent of financing. A 6–8% cap rate is generally considered good in most markets.' },
  { question: 'What is cash-on-cash return?', answer: 'Cash-on-cash return measures the annual cash flow as a percentage of your actual cash invested (down payment + closing costs). It accounts for mortgage financing, making it more practical than cap rate for leveraged investors. A 6–10% cash-on-cash return is generally considered solid.' },
  { question: 'What is the 1% rule in real estate?', answer: 'The 1% rule states that a rental property\'s monthly rent should be at least 1% of its purchase price. For a $200,000 property, rent should be at least $2,000/month. It\'s a quick screening tool — properties passing the 1% rule are more likely to generate positive cash flow.' },
  { question: 'What is the Gross Rent Multiplier (GRM)?', answer: 'GRM is the purchase price divided by annual gross rent. A lower GRM means you\'re paying less for each dollar of rent — generally better. GRMs of 10–15 are typical in many markets; under 10 is excellent; above 20 may be difficult to cash flow.' },
  { question: 'What vacancy rate should I use?', answer: 'A 5–10% vacancy rate is standard for most residential rentals. In hot rental markets, vacancy may be 2–5%. In weaker markets or for less desirable properties, plan for 10–15%. Always factor in vacancy even if your property is currently occupied — leases end and tenants move.' },
]

export default function RentalROIPage() {
  const [currency, setCurrency] = useState('USD')
  // Purchase
  const [price, setPrice] = useState('350000')
  const [downPct, setDownPct] = useState('25')
  const [mortgageRate, setMortgageRate] = useState('7')
  const [mortgageTerm, setMortgageTerm] = useState('30')
  const [closingCosts, setClosingCosts] = useState('3')
  // Income
  const [rent, setRent] = useState('2500')
  const [vacancy, setVacancy] = useState('5')
  // Expenses
  const [propertyTax, setPropertyTax] = useState('1.2')
  const [insurance, setInsurance] = useState('150')
  const [maintenance, setMaintenance] = useState('1')
  const [management, setManagement] = useState('8')
  const [hoa, setHoa] = useState('0')
  // Growth
  const [appreciation, setAppreciation] = useState('3')
  const [rentIncrease, setRentIncrease] = useState('3')
  const [expenseIncrease, setExpenseIncrease] = useState('2')
  const [years, setYears] = useState('10')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const p = parseFloat(price) || 0
    const dp = parseFloat(downPct) || 0
    const mr = parseFloat(mortgageRate) || 0
    const mt = parseInt(mortgageTerm) || 30
    const r = parseFloat(rent) || 0
    const v = parseFloat(vacancy) || 0
    const pt = parseFloat(propertyTax) || 0
    const ins = parseFloat(insurance) || 0
    const mn = parseFloat(maintenance) || 0
    const mg = parseFloat(management) || 0
    const h = parseFloat(hoa) || 0
    const ap = parseFloat(appreciation) || 0
    const ri = parseFloat(rentIncrease) || 0
    const ei = parseFloat(expenseIncrease) || 0
    const y = parseInt(years) || 10
    const cc = parseFloat(closingCosts) || 0
    if (p <= 0 || r <= 0) return null
    return calcRentalROI(p, dp, mr, mt, r, v, pt, ins, mn, mg, h, ap, ri, ei, y, cc)
  }, [price, downPct, mortgageRate, mortgageTerm, rent, vacancy, propertyTax, insurance, maintenance, management, hoa, appreciation, rentIncrease, expenseIncrease, years, closingCosts])

  const p = parseFloat(price) || 0
  const r = parseFloat(rent) || 0
  const y = parseInt(years) || 10

  const onePercentRule = p > 0 ? ((r / p) * 100).toFixed(2) : '0'
  const passesOnePercent = parseFloat(onePercentRule) >= 1

  const chartData = result?.schedule.map(row => ({
    year: `Yr ${row.year}`,
    'Home Equity': row.equity,
    'Cumulative Cash Flow': row.cumulativeCashFlow,
    'Total Return': row.totalReturn,
  })) ?? []

  return (
    <>
      <SEOHead
        title="Rental Property ROI Calculator – Cap Rate, Cash-on-Cash & More"
        description="Free rental property ROI calculator. Calculate cap rate, cash-on-cash return, NOI, GRM, and total return over time. Complete investment property analysis."
        canonical="/real-estate/rental-property-roi-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Investment</p>
            <h1 className={s.h1}>Rental Property ROI Calculator</h1>
            <p className={s.sub}>Complete rental property analysis — cap rate, cash-on-cash return, NOI, and long-term total return.</p>
          </div>

          <AdBanner slot="23000000001" />

          <div className={s.inputsGrid}>
            {/* Purchase */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>🏠 Purchase</h2>
              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>Purchase Price ({sym})</label>
                <input className={s.input} type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" step="10000" />
              </div>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Down Payment (%)</label>
                  <input className={s.input} type="number" value={downPct} onChange={e => setDownPct(e.target.value)} min="0" max="100" step="1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Closing Costs (%)</label>
                  <input className={s.input} type="number" value={closingCosts} onChange={e => setClosingCosts(e.target.value)} min="0" max="10" step="0.5" />
                </div>
              </div>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Mortgage Rate (%)</label>
                  <input className={s.input} type="number" value={mortgageRate} onChange={e => setMortgageRate(e.target.value)} min="0" max="20" step="0.05" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Loan Term (yrs)</label>
                  <select className={s.select} value={mortgageTerm} onChange={e => setMortgageTerm(e.target.value)}>
                    <option value="30">30</option>
                    <option value="20">20</option>
                    <option value="15">15</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Income & Expenses */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>💰 Income & Expenses</h2>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Monthly Rent ({sym})</label>
                  <input className={s.input} type="number" value={rent} onChange={e => setRent(e.target.value)} min="0" step="50" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Vacancy Rate (%)</label>
                  <input className={s.input} type="number" value={vacancy} onChange={e => setVacancy(e.target.value)} min="0" max="50" step="1" />
                </div>
              </div>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Property Tax (%/yr)</label>
                  <input className={s.input} type="number" value={propertyTax} onChange={e => setPropertyTax(e.target.value)} min="0" max="5" step="0.1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Insurance ({sym}/mo)</label>
                  <input className={s.input} type="number" value={insurance} onChange={e => setInsurance(e.target.value)} min="0" step="25" />
                </div>
              </div>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Maintenance (%/yr)</label>
                  <input className={s.input} type="number" value={maintenance} onChange={e => setMaintenance(e.target.value)} min="0" max="5" step="0.1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Management (% rent)</label>
                  <input className={s.input} type="number" value={management} onChange={e => setManagement(e.target.value)} min="0" max="20" step="1" />
                </div>
              </div>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>HOA ({sym}/mo)</label>
                  <input className={s.input} type="number" value={hoa} onChange={e => setHoa(e.target.value)} min="0" step="25" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Years to Analyze</label>
                  <input className={s.input} type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="40" />
                </div>
              </div>
              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Appreciation (%/yr)</label>
                  <input className={s.input} type="number" value={appreciation} onChange={e => setAppreciation(e.target.value)} min="0" max="15" step="0.5" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Rent Growth (%/yr)</label>
                  <input className={s.input} type="number" value={rentIncrease} onChange={e => setRentIncrease(e.target.value)} min="0" max="15" step="0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* 1% Rule badge */}
          {p > 0 && r > 0 && (
            <div className={`${s.ruleCard} ${passesOnePercent ? s.rulePass : s.ruleFail}`}>
              <span className={s.ruleIcon}>{passesOnePercent ? '✅' : '⚠️'}</span>
              <div>
                <span className={s.ruleTitle}>1% Rule: {onePercentRule}%</span>
                <span className={s.ruleSub}>
                  {passesOnePercent
                    ? `${fmtMoney(r, currency)}/mo rent on ${fmtMoney(p, currency)} passes the 1% rule`
                    : `Rent should be at least ${fmtMoney(p * 0.01, currency)}/mo to pass the 1% rule`
                  }
                </span>
              </div>
            </div>
          )}

          {/* Key metrics */}
          {result && (
            <div className={`${s.metricsGrid} animate-in`}>
              <MetricCard label="Cap Rate" value={`${result.capRate}%`} sub="NOI / Price" good={result.capRate >= 6} />
              <MetricCard label="Cash-on-Cash" value={`${result.cashOnCashReturn}%`} sub="Annual cash flow / invested" good={result.cashOnCashReturn >= 6} />
              <MetricCard label="Monthly Cash Flow" value={fmtMoney(result.monthlyCashFlow, currency)} sub="After all expenses" good={result.monthlyCashFlow > 0} />
              <MetricCard label="Gross Rent Multiplier" value={result.grossRentMultiplier.toFixed(1)+'x'} sub="Price / Annual rent" good={result.grossRentMultiplier <= 15} />
            </div>
          )}

          {/* Monthly breakdown */}
          {result && (
            <div className={`${s.breakdownCard} animate-in`}>
              <h2 className={s.cardTitle}>Monthly Income & Expense Breakdown (Year 1)</h2>
              <div className={s.breakdownGrid}>
                <div className={s.breakdownSide}>
                  <h3 className={s.sideTitle}>Income</h3>
                  <BRow label="Gross Rent" value={fmtMoney(result.grossRentalIncome, currency)} />
                  <BRow label="Vacancy Loss" value={`− ${fmtMoney(result.vacancyLoss, currency)}`} neg />
                  <BRow label="Effective Income" value={fmtMoney(result.effectiveGrossIncome, currency)} bold />
                </div>
                <div className={s.breakdownSide}>
                  <h3 className={s.sideTitle}>Expenses</h3>
                  <BRow label="All Operating Expenses" value={fmtMoney(result.totalMonthlyExpenses, currency)} neg />
                  <BRow label="Mortgage (P&I)" value={`− ${fmtMoney(result.monthlyMortgage, currency)}`} neg />
                  <BRow label="Net Cash Flow" value={fmtMoney(result.monthlyCashFlow, currency)} bold good={result.monthlyCashFlow > 0} />
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Investment Growth Over {y} Years</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={70}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Line type="monotone" dataKey="Home Equity" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Cumulative Cash Flow" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Total Return" stroke="#f59e0b" strokeWidth={2.5} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Year schedule */}
          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>{y}-Year Investment Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Home Value</th>
                      <th>Equity</th>
                      <th>Annual Cash Flow</th>
                      <th>Cumulative CF</th>
                      <th>Total Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.year}>
                        <td>{row.year}</td>
                        <td>{fmtMoney(row.homeValue, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.equity, currency)}</td>
                        <td className={row.annualCashFlow >= 0 ? s.green : s.red}>{fmtMoney(row.annualCashFlow, currency)}</td>
                        <td className={row.cumulativeCashFlow >= 0 ? s.blue : s.red}>{fmtMoney(row.cumulativeCashFlow, currency)}</td>
                        <td className={s.bold}>{fmtMoney(row.totalReturn, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result && (
            <div className={`${s.summaryCard} animate-in`}>
              <h2 className={s.cardTitle}>{y}-Year Summary</h2>
              <div className={s.summaryGrid}>
                <SumStat label="Total Investment" value={fmtMoney(result.totalInvestment, currency)} />
                <SumStat label={`Home Value (Yr ${y})`} value={fmtMoney(result.homeValueAfterYears, currency)} green />
                <SumStat label={`Equity (Yr ${y})`} value={fmtMoney(result.equityAfterYears, currency)} green />
                <SumStat label="Total Return" value={fmtMoney(result.totalReturnAfterYears, currency)} green={result.totalReturnAfterYears > 0} />
                <SumStat label="Total ROI" value={`${result.totalROI.toFixed(1)}%`} green={result.totalROI > 0} />
                <SumStat label="Annualized Return" value={`${result.annualizedReturn.toFixed(2)}%`} green={result.annualizedReturn > 0} />
              </div>
            </div>
          )}

          <AdRectangle slot="23000000002" />

          <article className={s.article}>
            <h2>How to Analyze a Rental Property Investment</h2>
            <p>A good rental property generates both monthly cash flow and long-term equity growth. The key metrics are cap rate (property's income potential), cash-on-cash return (your cash yield on invested capital), and total return including appreciation.</p>

            {result && p > 0 && (
              <div className={s.example}>
                <h3>📊 Your Property Analysis</h3>
                <ul>
                  <li>Cap rate: <strong>{result.capRate}%</strong> {result.capRate >= 6 ? '✅ Good' : '⚠️ Below 6% target'}</li>
                  <li>Cash-on-cash return: <strong>{result.cashOnCashReturn}%</strong></li>
                  <li>Monthly cash flow: <strong>{fmtMoney(result.monthlyCashFlow, currency)}</strong></li>
                  <li>After {y} years, total return: <strong>{fmtMoney(result.totalReturnAfterYears, currency)}</strong></li>
                  <li>Annualized return: <strong>{result.annualizedReturn.toFixed(2)}%</strong></li>
                </ul>
              </div>
            )}

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

          <AdBanner slot="23000000003" />
        </div>
      </div>
    </>
  )
}

function MetricCard({ label, value, sub, good }: { label: string; value: string; sub: string; good: boolean }) {
  return (
    <div className={`${s.metricCard} ${good ? s.metricGood : s.metricWarn}`}>
      <span className={s.metricLabel}>{label}</span>
      <span className={s.metricValue}>{value}</span>
      <span className={s.metricSub}>{sub}</span>
    </div>
  )
}

function BRow({ label, value, neg, bold, good }: { label: string; value: string; neg?: boolean; bold?: boolean; good?: boolean }) {
  return (
    <div className={`${s.bRow} ${bold ? s.bRowBold : ''}`}>
      <span>{label}</span>
      <span style={good ? { color: 'var(--accent-green)' } : neg ? { color: 'var(--accent-red)' } : {}}>{value}</span>
    </div>
  )
}

function SumStat({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={s.sumStat}>
      <span className={s.sumLabel}>{label}</span>
      <span className={s.sumValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}