import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calc401k } from './calculator401kEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './Calculator401k.module.css'

const FAQS = [
  { question: 'What is a 401(k)?', answer: 'A 401(k) is an employer-sponsored retirement savings plan in the US that lets employees contribute pre-tax dollars from their paycheck. Investments grow tax-deferred, meaning you only pay taxes when you withdraw funds in retirement.' },
  { question: 'How much should I contribute to my 401(k)?', answer: 'At minimum, contribute enough to get the full employer match — that is free money. Beyond that, aim for 15% of your gross income including the employer match. The 2024 IRS contribution limit is $23,000 ($30,500 if age 50+).' },
  { question: 'What is an employer match?', answer: 'Many employers match a portion of your 401(k) contributions. A common structure is 100% match on the first 3% of salary — meaning if you earn $60,000 and contribute 3% ($1,800), your employer adds another $1,800 for free.' },
  { question: 'What happens to my 401(k) if I change jobs?', answer: 'Your vested 401(k) balance is yours to keep. You can roll it into your new employer\'s plan or an IRA, leave it with your old employer, or cash it out (though cashing out triggers taxes and a 10% early withdrawal penalty).' },
]

export default function Calculator401kPage() {
  const [currency, setCurrency] = useState('USD')
  const [currentAge, setCurrentAge] = useState('30')
  const [retirementAge, setRetirementAge] = useState('65')
  const [currentBalance, setCurrentBalance] = useState('10000')
  const [salary, setSalary] = useState('60000')
  const [contribPct, setContribPct] = useState('10')
  const [matchPct, setMatchPct] = useState('100')
  const [matchLimit, setMatchLimit] = useState('3')
  const [returnRate, setReturnRate] = useState('7')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const ca = parseInt(currentAge) || 0
    const ra = parseInt(retirementAge) || 0
    const cb = parseFloat(currentBalance) || 0
    const sal = parseFloat(salary) || 0
    const cp = parseFloat(contribPct) || 0
    const mp = parseFloat(matchPct) || 0
    const ml = parseFloat(matchLimit) || 0
    const rr = parseFloat(returnRate) || 0
    if (ca >= ra || sal <= 0) return null
    return calc401k(ca, ra, cb, sal, cp, mp, ml, rr)
  }, [currentAge, retirementAge, currentBalance, salary, contribPct, matchPct, matchLimit, returnRate])

  const ca = parseInt(currentAge) || 0
  const ra = parseInt(retirementAge) || 0
  const sal = parseFloat(salary) || 0
  const cp = parseFloat(contribPct) || 0

  const chartData = result?.schedule.map(row => ({
    age: `${row.age}`,
    'Your Contributions': row.contribution,
    'Employer Match': row.employerMatch,
    'Interest': row.interest,
  })) ?? []

  const annualContrib = sal * (cp / 100)
  const IRS_LIMIT_2024 = 23000

  return (
    <>
      <SEOHead
        title="401(k) Calculator – Retirement Savings Growth Estimator"
        description="Free 401(k) calculator. See how your 401k grows with employer matching, compounding returns, and regular contributions. Plan your retirement savings."
        canonical="/finance/401k-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Retirement</p>
            <h1 className={s.h1}>401(k) Calculator</h1>
            <p className={s.sub}>See how your 401(k) grows with employer matching and compound returns.</p>
          </div>

          <AdBanner slot="10000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your 401(k) Details</h2>

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
                  <input className={s.input} type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} min="18" max="70" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Retirement Age</label>
                  <input className={s.input} type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)} min="50" max="80" />
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Current 401(k) Balance ({sym})</label>
                <input className={s.input} type="number" value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} min="0" step="1000" placeholder="e.g. 10000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Salary ({sym})</label>
                <input className={s.input} type="number" value={salary} onChange={e => setSalary(e.target.value)} min="0" step="5000" placeholder="e.g. 60000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Your Contribution (% of salary)</label>
                <input className={s.input} type="number" value={contribPct} onChange={e => setContribPct(e.target.value)} min="0" max="100" step="0.5" placeholder="e.g. 10" />
                {annualContrib > IRS_LIMIT_2024 && (
                  <span className={s.warning}>⚠️ Exceeds 2024 IRS limit of {fmtMoney(IRS_LIMIT_2024, currency)}/year</span>
                )}
              </div>

              <div className={s.field}>
                <label className={s.label}>Employer Match (%)</label>
                <input className={s.input} type="number" value={matchPct} onChange={e => setMatchPct(e.target.value)} min="0" max="100" step="1" placeholder="e.g. 100" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Employer Match Limit (% of salary)</label>
                <input className={s.input} type="number" value={matchLimit} onChange={e => setMatchLimit(e.target.value)} min="0" max="20" step="0.5" placeholder="e.g. 3" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Return Rate (%)</label>
                <input className={s.input} type="number" value={returnRate} onChange={e => setReturnRate(e.target.value)} min="0" max="20" step="0.5" placeholder="e.g. 7" />
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Projected Results at Age {ra}</h2>

                <div className={s.bigStat}>
                  <span className={s.bigLabel}>Total 401(k) Balance</span>
                  <span className={s.bigValue}>{fmtMoney(result.finalBalance, currency)}</span>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Your Contributions" value={fmtMoney(result.totalContributions, currency)} />
                  <Stat label="Employer Match" value={fmtMoney(result.totalEmployerMatch, currency)} green />
                  <Stat label="Investment Growth" value={fmtMoney(result.totalInterest, currency)} green />
                  <Stat label="Years of Growth" value={`${ra - ca} years`} />
                  <Stat label="Annual Contribution" value={fmtMoney(sal * (parseFloat(contribPct)||0) / 100, currency)} />
                  <Stat label="Annual Match" value={fmtMoney(result.totalEmployerMatch / (ra - ca), currency)} green />
                </div>

                <div className={s.matchNote}>
                  💡 Employer match adds <strong>{fmtMoney(result.totalEmployerMatch, currency)}</strong> — that's free money worth getting.
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>💼</div>
                <p>Enter your details to project your 401(k) balance.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Annual Growth Breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="gMatch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="gInt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="age" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Area type="monotone" dataKey="Your Contributions" stackId="1" stroke="#3b82f6" fill="url(#gContrib)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Employer Match" stackId="1" stroke="#10b981" fill="url(#gMatch)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Interest" stackId="1" stroke="#f59e0b" fill="url(#gInt)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Year-by-Year Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Age</th><th>Your Contribution</th><th>Employer Match</th><th>Interest</th><th>Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.year}>
                        <td>{row.age}</td>
                        <td>{fmtMoney(row.contribution, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.employerMatch, currency)}</td>
                        <td className={s.amber}>{fmtMoney(row.interest, currency)}</td>
                        <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="10000000002" />

          <article className={s.article}>
            <h2>How to Use This 401(k) Calculator</h2>
            <p>Enter your age, retirement age, current balance, salary, and contribution percentage. The calculator shows your projected balance at retirement, broken down into your contributions, employer match, and investment growth.</p>

            {result && sal > 0 && (
              <div className={s.example}>
                <h3>📊 Your 401(k) Projection</h3>
                <p>Contributing <strong>{contribPct}%</strong> of <strong>{fmtMoney(sal, currency)}</strong> salary for <strong>{ra - ca} years</strong> at <strong>{returnRate}%</strong> return:</p>
                <ul>
                  <li>Final balance: <strong>{fmtMoney(result.finalBalance, currency)}</strong></li>
                  <li>Your contributions: <strong>{fmtMoney(result.totalContributions, currency)}</strong></li>
                  <li>Employer added: <strong>{fmtMoney(result.totalEmployerMatch, currency)}</strong> for free</li>
                  <li>Investment growth: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                </ul>
              </div>
            )}

            <h2>Always Get the Full Employer Match</h2>
            <p>The employer match is the highest guaranteed return you will ever get on an investment. If your employer matches 100% up to 3% of salary, and you only contribute 2%, you are leaving free money on the table. Always contribute at least enough to get the full match before directing money elsewhere.</p>

            <h2>2024 401(k) Contribution Limits</h2>
            <p>The IRS sets annual limits on how much you can contribute. For 2024, the employee contribution limit is $23,000. If you are age 50 or older, you can make an additional $7,500 catch-up contribution for a total of $30,500. Employer contributions do not count toward this limit.</p>

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

          <AdBanner slot="10000000003" />
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