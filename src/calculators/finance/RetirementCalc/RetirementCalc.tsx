import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcRetirement } from './retirementEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import s from './RetirementCalc.module.css'

const FAQS = [
  { question: 'How much do I need to retire?', answer: 'A common rule is the 25x rule — multiply your desired annual retirement income by 25. This is based on the 4% safe withdrawal rate, which research suggests can sustain a 30-year retirement. For example, if you need $50,000/year, aim for $1,250,000 in savings.' },
  { question: 'What is a safe withdrawal rate?', answer: 'The 4% rule suggests withdrawing 4% of your portfolio in year one and adjusting for inflation thereafter. Research shows this historically sustains a portfolio for 30+ years. More conservative planners use 3–3.5% for longer retirements.' },
  { question: 'What return rate should I use for retirement savings?', answer: 'A diversified stock/bond portfolio has historically returned 6–8% annually. During retirement, a more conservative 4–5% is common as portfolios shift toward bonds and income assets. Always use conservative estimates for planning purposes.' },
  { question: 'When should I start saving for retirement?', answer: 'The earlier the better — compound interest is most powerful over long time horizons. Starting at 25 vs 35 can result in double the retirement savings even with the same monthly contributions, because the early contributions have 10 extra years to compound.' },
]

export default function RetirementCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [currentAge, setCurrentAge] = useState('30')
  const [retirementAge, setRetirementAge] = useState('65')
  const [lifeExpectancy, setLifeExpectancy] = useState('90')
  const [currentSavings, setCurrentSavings] = useState('10000')
  const [monthlyContrib, setMonthlyContrib] = useState('500')
  const [growthRate, setGrowthRate] = useState('7')
  const [withdrawalRate, setWithdrawalRate] = useState('4')
  const [monthlyIncome, setMonthlyIncome] = useState('4000')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const ca = parseInt(currentAge) || 0
    const ra = parseInt(retirementAge) || 0
    const le = parseInt(lifeExpectancy) || 0
    const cs = parseFloat(currentSavings) || 0
    const mc = parseFloat(monthlyContrib) || 0
    const gr = parseFloat(growthRate) || 0
    const wr = parseFloat(withdrawalRate) || 0
    const mi = parseFloat(monthlyIncome) || 0
    if (ca >= ra || ra >= le || ca <= 0) return null
    return calcRetirement(ca, ra, le, cs, mc, gr, wr, mi)
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyContrib, growthRate, withdrawalRate, monthlyIncome])

  const ca = parseInt(currentAge) || 0
  const ra = parseInt(retirementAge) || 0
  const mi = parseFloat(monthlyIncome) || 0

  // Combined chart data
  const chartData = [
    ...(result?.savingsPhase.map(r => ({ age: `Age ${r.age}`, Balance: r.balance, phase: 'saving' })) ?? []),
    ...(result?.withdrawalPhase.map(r => ({ age: `Age ${r.age}`, Balance: r.balance, phase: 'withdrawal' })) ?? []),
  ]

  const retirementOk = result && result.monthlyIncomeAvailable >= mi

  return (
    <>
      <SEOHead
        title="Retirement Calculator – Plan Your Retirement Savings"
        description="Free retirement calculator. Find out if you're on track to retire. Calculate your nest egg, monthly income available, and how long your savings will last. Supports 150+ currencies."
        canonical="/finance/retirement-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Retirement</p>
            <h1 className={s.h1}>Retirement Calculator</h1>
            <p className={s.sub}>Find out if you're on track to retire comfortably. Plan your nest egg today.</p>
          </div>

          <AdBanner slot="8000000001" />

          <div className={s.mainGrid}>
            {/* Inputs */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Current Age</label>
                  <input className={s.input} type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} min="18" max="80" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Retirement Age</label>
                  <input className={s.input} type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)} min="40" max="80" />
                </div>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Life Expectancy</label>
                  <input className={s.input} type="number" value={lifeExpectancy} onChange={e => setLifeExpectancy(e.target.value)} min="60" max="110" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Annual Growth (%)</label>
                  <input className={s.input} type="number" value={growthRate} onChange={e => setGrowthRate(e.target.value)} min="0" max="20" step="0.5" />
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Current Savings ({sym})</label>
                <input className={s.input} type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} min="0" step="1000" placeholder="e.g. 10000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Monthly Contribution ({sym})</label>
                <input className={s.input} type="number" value={monthlyContrib} onChange={e => setMonthlyContrib(e.target.value)} min="0" step="100" placeholder="e.g. 500" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Desired Monthly Income ({sym})</label>
                <input className={s.input} type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} min="0" step="500" placeholder="e.g. 4000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Withdrawal Return Rate (%)</label>
                <input className={s.input} type="number" value={withdrawalRate} onChange={e => setWithdrawalRate(e.target.value)} min="0" max="15" step="0.5" />
              </div>
            </div>

            {/* Results */}
            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Retirement Outlook</h2>

                <div className={`${s.statusBanner} ${retirementOk ? s.statusGood : s.statusWarn}`}>
                  {retirementOk
                    ? `✅ On Track — your savings can support ${fmtMoney(result.monthlyIncomeAvailable, currency)}/month`
                    : `⚠️ Shortfall — you can afford ${fmtMoney(result.monthlyIncomeAvailable, currency)}/month, not ${fmtMoney(mi, currency)}/month`
                  }
                </div>

                <div className={s.statGrid}>
                  <Stat label="Nest Egg at Retirement" value={fmtMoney(result.nestedEgg, currency)} green />
                  <Stat label="Monthly Income Available" value={fmtMoney(result.monthlyIncomeAvailable, currency)} green={retirementOk ?? undefined} />
                  <Stat label="Total Contributions" value={fmtMoney(result.totalContributions, currency)} />
                  <Stat label="Interest Earned" value={fmtMoney(result.totalInterest, currency)} />
                  <Stat label="Years Saving" value={`${ra - ca} years`} />
                  <Stat label="Savings Last" value={result.yearsOfIncome > 0 ? `${result.yearsOfIncome} years` : 'Forever'} />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏦</div>
                <p>Enter your details to see your retirement plan.</p>
              </div>
            )}
          </div>

          {/* Chart */}
          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Portfolio Balance — Saving & Withdrawal Phase</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="age" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <ReferenceLine x={`Age ${ra}`} stroke="var(--accent-amber)" strokeDasharray="4 4" label={{ value: 'Retire', fill: 'var(--accent-amber)', fontSize: 11 }} />
                  <Area type="monotone" dataKey="Balance" stroke="#3b82f6" fill="url(#gRet)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Savings phase table */}
          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Savings Phase — Year by Year</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Age</th><th>Annual Contribution</th><th>Interest Earned</th><th>Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.savingsPhase.map(row => (
                      <tr key={row.year}>
                        <td>{row.age}</td>
                        <td>{fmtMoney(row.contribution, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.interest, currency)}</td>
                        <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="8000000002" />

          <article className={s.article}>
            <h2>How to Use This Retirement Calculator</h2>
            <p>Enter your current age, target retirement age, life expectancy, and savings details. The calculator shows your projected nest egg at retirement, how much monthly income it can support, and whether you're on track for your desired lifestyle.</p>

            {result && (
              <div className={s.example}>
                <h3>📊 Your Retirement Plan</h3>
                <p>Retiring at <strong>{ra}</strong> with <strong>{ra - ca} years</strong> of saving:</p>
                <ul>
                  <li>Projected nest egg: <strong>{fmtMoney(result.nestedEgg, currency)}</strong></li>
                  <li>Monthly income available: <strong>{fmtMoney(result.monthlyIncomeAvailable, currency)}</strong></li>
                  <li>You contributed: <strong>{fmtMoney(result.totalContributions, currency)}</strong></li>
                  <li>Interest grew your savings by: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                  {!retirementOk && <li>⚠️ To reach {fmtMoney(mi, currency)}/month, increase contributions or adjust your timeline.</li>}
                </ul>
              </div>
            )}

            <h2>The 4% Rule</h2>
            <p>The 4% rule states that you can withdraw 4% of your portfolio in year one of retirement, then adjust for inflation each year, and your savings should last 30+ years. To find your target nest egg, multiply your desired annual income by 25. For {fmtMoney(mi * 12, currency)}/year, you need {fmtMoney(mi * 12 * 25, currency)}.</p>

            <h2>Why Starting Early Matters</h2>
            <p>Starting at 25 vs 35 with the same monthly contribution can result in nearly double the retirement savings. The first years of investing are the most valuable because those dollars compound the longest. Every year of delay costs more than the previous one.</p>

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

          <AdBanner slot="8000000003" />
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={s.stat}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}