import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcRothIRA, calcTraditionalIRA } from './rothIRAEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './RothIRA.module.css'

const FAQS = [
  { question: 'What is a Roth IRA?', answer: 'A Roth IRA is an individual retirement account funded with after-tax dollars. Contributions are not tax-deductible, but all qualified withdrawals in retirement are completely tax-free — including the investment growth. This makes it especially powerful for younger investors who expect to be in a higher tax bracket in retirement.' },
  { question: 'What are the 2024 Roth IRA contribution limits?', answer: 'For 2024, you can contribute up to $7,000 per year ($8,000 if you are age 50 or older). There are also income limits — single filers with MAGI above $161,000 and married filers above $240,000 cannot contribute directly to a Roth IRA.' },
  { question: 'Roth IRA vs Traditional IRA — which is better?', answer: 'Roth IRA is generally better if you expect to be in a higher tax bracket in retirement than now. Traditional IRA is better if you expect lower taxes in retirement. Roth IRAs also have no required minimum distributions (RMDs), giving more flexibility. Most young people benefit more from Roth.' },
  { question: 'When can I withdraw from a Roth IRA tax-free?', answer: 'Qualified tax-free withdrawals require two conditions: the account must be at least 5 years old, and you must be at least 59½ years old. You can always withdraw your contributions (not earnings) at any time without penalty.' },
]

export default function RothIRAPage() {
  const [currency, setCurrency] = useState('USD')
  const [currentAge, setCurrentAge] = useState('30')
  const [retirementAge, setRetirementAge] = useState('65')
  const [currentBalance, setCurrentBalance] = useState('5000')
  const [annualContrib, setAnnualContrib] = useState('7000')
  const [returnRate, setReturnRate] = useState('7')
  const [taxRate, setTaxRate] = useState('22')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const ca = parseInt(currentAge) || 0
    const ra = parseInt(retirementAge) || 0
    const cb = parseFloat(currentBalance) || 0
    const ac = parseFloat(annualContrib) || 0
    const rr = parseFloat(returnRate) || 0
    if (ca >= ra || ac <= 0) return null
    return calcRothIRA(ca, ra, cb, ac, rr)
  }, [currentAge, retirementAge, currentBalance, annualContrib, returnRate])

  const ca = parseInt(currentAge) || 0
  const ra = parseInt(retirementAge) || 0
  const tr = parseFloat(taxRate) || 0

  const traditionalAfterTax = result ? calcTraditionalIRA(result.finalBalance, tr) : 0
  const rothAdvantage = result ? result.finalBalance - traditionalAfterTax : 0

  const chartData = result?.schedule.map(row => ({
    age: `${row.age}`,
    'Contributions': row.contribution,
    'Tax-Free Growth': row.interest,
  })) ?? []

  const IRS_LIMIT = ca >= 50 ? 8000 : 7000

  return (
    <>
      <SEOHead
        title="Roth IRA Calculator – Tax-Free Retirement Growth"
        description="Free Roth IRA calculator. See how your Roth IRA grows tax-free over time. Compare Roth vs Traditional IRA after-tax value. Supports 150+ currencies."
        canonical="/finance/roth-ira-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Retirement</p>
            <h1 className={s.h1}>Roth IRA Calculator</h1>
            <p className={s.sub}>See how your Roth IRA grows completely tax-free and compare it to a Traditional IRA.</p>
          </div>

          <AdBanner slot="11000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Roth IRA Details</h2>

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
                <label className={s.label}>Current Balance ({sym})</label>
                <input className={s.input} type="number" value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} min="0" step="500" placeholder="e.g. 5000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Contribution ({sym})</label>
                <input className={s.input} type="number" value={annualContrib} onChange={e => setAnnualContrib(e.target.value)} min="0" max="8000" step="500" placeholder="e.g. 7000" />
                <span className={s.hint}>2024 limit: {sym}{IRS_LIMIT.toLocaleString()} {ca >= 50 ? '(age 50+ catch-up)' : ''}</span>
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Return Rate (%)</label>
                <input className={s.input} type="number" value={returnRate} onChange={e => setReturnRate(e.target.value)} min="0" max="20" step="0.5" placeholder="e.g. 7" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Expected Tax Rate in Retirement (%)</label>
                <input className={s.input} type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} min="0" max="50" step="1" placeholder="e.g. 22" />
                <span className={s.hint}>Used to compare Roth vs Traditional IRA</span>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Roth IRA Projection at Age {ra}</h2>

                <div className={s.bigStat}>
                  <span className={s.bigLabel}>Tax-Free Balance</span>
                  <span className={s.bigValue}>{fmtMoney(result.finalBalance, currency)}</span>
                  <span className={s.bigNote}>100% yours — no taxes on withdrawal</span>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Total Contributions" value={fmtMoney(result.totalContributions, currency)} />
                  <Stat label="Tax-Free Growth" value={fmtMoney(result.totalInterest, currency)} green />
                  <Stat label="Years of Growth" value={`${ra - ca} years`} />
                  <Stat label="Return Rate" value={`${returnRate}%/year`} />
                </div>

                <div className={s.comparison}>
                  <h3 className={s.compTitle}>Roth vs Traditional IRA</h3>
                  <div className={s.compGrid}>
                    <div className={s.compCard}>
                      <span className={s.compLabel}>Roth IRA (after tax)</span>
                      <span className={s.compValue} style={{ color: 'var(--accent-green)' }}>{fmtMoney(result.finalBalance, currency)}</span>
                      <span className={s.compNote}>Tax-free — keep 100%</span>
                    </div>
                    <div className={s.compCard}>
                      <span className={s.compLabel}>Traditional IRA (after {tr}% tax)</span>
                      <span className={s.compValue} style={{ color: 'var(--accent-amber)' }}>{fmtMoney(traditionalAfterTax, currency)}</span>
                      <span className={s.compNote}>Taxed at withdrawal</span>
                    </div>
                  </div>
                  <div className={s.advantage}>
                    Roth advantage: <strong style={{ color: 'var(--accent-green)' }}>{fmtMoney(rothAdvantage, currency)}</strong> more in your pocket
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏦</div>
                <p>Enter your details to see your Roth IRA projection.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Roth IRA Growth — Tax-Free</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gRG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="age" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Area type="monotone" dataKey="Contributions" stackId="1" stroke="#3b82f6" fill="url(#gRC)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Tax-Free Growth" stackId="1" stroke="#10b981" fill="url(#gRG)" strokeWidth={2} />
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
                    <tr><th>Age</th><th>Contribution</th><th>Interest Earned</th><th>Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
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

          <AdRectangle slot="11000000002" />

          <article className={s.article}>
            <h2>Why the Roth IRA is So Powerful</h2>
            <p>The Roth IRA's biggest advantage is tax-free growth. You pay taxes on contributions now (at your current rate), but all future growth and withdrawals are completely tax-free. This is especially valuable for younger investors because the tax savings compound over decades alongside the investment returns.</p>

            {result && (
              <div className={s.example}>
                <h3>📊 Your Roth IRA</h3>
                <p>Contributing <strong>{fmtMoney(parseFloat(annualContrib), currency)}/year</strong> for <strong>{ra - ca} years</strong> at <strong>{returnRate}%</strong>:</p>
                <ul>
                  <li>Tax-free balance: <strong>{fmtMoney(result.finalBalance, currency)}</strong></li>
                  <li>Your contributions: <strong>{fmtMoney(result.totalContributions, currency)}</strong></li>
                  <li>Tax-free growth: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                  <li>vs Traditional IRA after {tr}% tax: <strong>{fmtMoney(traditionalAfterTax, currency)}</strong></li>
                  <li>Roth advantage: <strong>{fmtMoney(rothAdvantage, currency)}</strong> more in your pocket</li>
                </ul>
              </div>
            )}

            <h2>2024 Contribution Limits</h2>
            <p>You can contribute up to $7,000/year to a Roth IRA in 2024 ($8,000 if age 50+). There are income phase-out limits — single filers earning above $146,000 start to phase out, with full phase-out at $161,000. Married filers phase out between $230,000 and $240,000.</p>

            <h2>Roth IRA vs Traditional IRA</h2>
            <p>The core difference: Roth contributions are after-tax, Traditional contributions may be tax-deductible. Roth withdrawals are tax-free; Traditional withdrawals are taxed as income. Roth IRAs have no required minimum distributions (RMDs), giving you more flexibility. If you expect higher taxes in retirement, Roth wins. If you expect lower taxes, Traditional may be better.</p>

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

          <AdBanner slot="11000000003" />
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