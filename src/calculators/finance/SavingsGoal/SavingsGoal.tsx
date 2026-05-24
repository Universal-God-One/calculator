import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcSavingsGoal } from './savingsEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import s from './SavingsGoal.module.css'

const FAQS = [
  { question: 'How is the required monthly saving calculated?', answer: 'We use the future value of an annuity formula: PMT = (FV × r) / ((1 + r)^n - 1), where FV is the remaining goal amount, r is the monthly interest rate, and n is the number of months. This gives the exact monthly deposit needed to reach your goal.' },
  { question: 'What interest rate should I use?', answer: 'Use the annual interest rate of the account where you will save. High-yield savings accounts offer around 4–5%, money market accounts 3–5%, and regular savings accounts 0.5–1%. For investments, historical stock market returns average around 7–10% annually.' },
  { question: 'Does this account for inflation?', answer: 'No — this calculator uses nominal rates. For inflation-adjusted planning, subtract the inflation rate (typically 2–3%) from your expected return rate to get a real rate of return.' },
  { question: 'What if I already have some savings?', answer: 'Enter your current savings in the "Current Savings" field. The calculator will subtract this from your goal and calculate how much more you need to save monthly to reach the target.' },
]

export default function SavingsGoalPage() {
  const [currency, setCurrency] = useState('USD')
  const [goal, setGoal] = useState('50000')
  const [current, setCurrent] = useState('5000')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('5')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const g = parseFloat(goal) || 0
    const c = parseFloat(current) || 0
    const r = parseFloat(rate) || 0
    const y = parseInt(years) || 0
    if (g <= 0 || y <= 0) return null
    if (c >= g) return null
    return calcSavingsGoal(g, c, r, y)
  }, [goal, current, rate, years])

  const g = parseFloat(goal) || 0
  const c = parseFloat(current) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0

  // Chart — show every 6th month
  const chartData = result?.schedule
    .filter((_, i) => i % 6 === 5 || i === 0)
    .map(row => ({
      month: `M${row.month}`,
      Balance: row.balance,
    })) ?? []

  return (
    <>
      <SEOHead
        title="Savings Goal Calculator – How Much to Save Per Month"
        description="Free savings goal calculator. Find out exactly how much you need to save each month to reach your financial goal. Supports 150+ currencies."
        canonical="/finance/savings-goal-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Savings</p>
            <h1 className={s.h1}>Savings Goal Calculator</h1>
            <p className={s.sub}>Find out exactly how much you need to save each month to reach your goal.</p>
          </div>

          <AdBanner slot="6000000001" />

          <div className={s.mainGrid}>
            {/* Inputs */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Goal</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Goal Amount ({sym})</label>
                <input className={s.input} type="number" value={goal}
                  onChange={e => setGoal(e.target.value)} min="0" step="1000" placeholder="e.g. 50000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Current Savings ({sym})</label>
                <input className={s.input} type="number" value={current}
                  onChange={e => setCurrent(e.target.value)} min="0" step="500" placeholder="e.g. 5000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Interest Rate (%)</label>
                <input className={s.input} type="number" value={rate}
                  onChange={e => setRate(e.target.value)} min="0" max="30" step="0.1" placeholder="e.g. 5" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Time to Reach Goal (Years)</label>
                <input className={s.input} type="number" value={years}
                  onChange={e => setYears(e.target.value)} min="1" max="50" placeholder="e.g. 5" />
              </div>
            </div>

            {/* Results */}
            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Your Savings Plan</h2>

                <div className={s.bigStat}>
                  <span className={s.bigLabel}>Monthly Savings Required</span>
                  <span className={s.bigValue}>{fmtMoney(result.monthlyRequired, currency)}<span className={s.bigSub}>/mo</span></span>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Goal Amount" value={fmtMoney(g, currency)} />
                  <Stat label="Current Savings" value={fmtMoney(c, currency)} />
                  <Stat label="Still Needed" value={fmtMoney(g - c, currency)} />
                  <Stat label="Time Frame" value={`${y} years`} />
                  <Stat label="Total Contributions" value={fmtMoney(result.totalContributions, currency)} />
                  <Stat label="Interest Earned" value={fmtMoney(result.totalInterest, currency)} green />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🎯</div>
                <p>{c >= g ? 'Your current savings already meet the goal!' : 'Enter your goal details to get started.'}</p>
              </div>
            )}
          </div>

          {/* Chart */}
          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Balance Over Time</h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={60}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Balance" stroke="#3b82f6" fill="url(#gSav)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly schedule table */}
          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Monthly Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Month</th><th>Contribution</th><th>Interest</th><th>Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
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

          <AdRectangle slot="6000000002" />

          <article className={s.article}>
            <h2>How to Use This Savings Goal Calculator</h2>
            <p>Enter your savings goal, how much you already have saved, the interest rate you expect to earn, and how many years you have to reach the goal. The calculator instantly tells you the exact monthly amount you need to save.</p>

            {result && g > 0 && y > 0 && (
              <div className={s.example}>
                <h3>📊 Your Plan</h3>
                <p>To reach <strong>{fmtMoney(g, currency)}</strong> in <strong>{y} years</strong> starting with <strong>{fmtMoney(c, currency)}</strong> at <strong>{r}% annual interest</strong>:</p>
                <ul>
                  <li>Save <strong>{fmtMoney(result.monthlyRequired, currency)}</strong> every month</li>
                  <li>Your total contributions: <strong>{fmtMoney(result.totalContributions, currency)}</strong></li>
                  <li>Interest will add <strong>{fmtMoney(result.totalInterest, currency)}</strong> for free</li>
                  <li>Final balance: <strong>{fmtMoney(result.finalBalance, currency)}</strong></li>
                </ul>
              </div>
            )}

            <h2>The Formula Behind the Calculator</h2>
            <p>The monthly savings required is calculated using the future value annuity formula: <strong>PMT = (FV × r) / ((1 + r)^n - 1)</strong>, where FV is the remaining goal, r is the monthly interest rate, and n is the total number of months.</p>

            <h2>Choosing the Right Interest Rate</h2>
            <p>The interest rate you use should match where you plan to save. High-yield savings accounts currently offer 4–5% annually. Money market accounts offer 3–5%. A regular bank savings account might offer 0.5–1%. If investing in index funds, the historical average is around 7–10% annually before inflation.</p>

            <h2>Tips to Reach Your Goal Faster</h2>
            <p>The two most powerful levers are time and rate. Starting earlier dramatically reduces the monthly amount needed. Getting a higher interest rate — by switching to a high-yield savings account — also makes a significant difference. Even a 1% higher rate over 10 years can save you hundreds per month.</p>

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

          <AdBanner slot="6000000003" />
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