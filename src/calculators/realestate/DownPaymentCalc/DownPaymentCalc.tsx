import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcDownPayment } from './downPaymentEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import s from './DownPaymentCalc.module.css'

const FAQS = [
  { question: 'How much down payment do I need?', answer: 'The minimum depends on the loan type: FHA loans require 3.5% (with 580+ credit score), conventional loans can go as low as 3–5%, VA loans require 0%, and USDA loans require 0% for eligible rural properties. Putting 20% down eliminates PMI on conventional loans.' },
  { question: 'Is it better to put more or less down?', answer: 'More down means lower monthly payments, no PMI, lower interest costs over time, and instant equity. Less down means keeping more cash liquid for investments or emergencies. If you can earn more investing the difference than you\'d save on mortgage interest and PMI, a smaller down payment may make sense.' },
  { question: 'What is PMI and when can I avoid it?', answer: 'Private Mortgage Insurance (PMI) protects the lender if you default. It costs 0.5–1.5% of the loan annually and is required on conventional loans with less than 20% down. FHA loans have MIP regardless. VA and USDA loans have no PMI. PMI can be removed once you reach 20% equity.' },
  { question: 'Can I use gift money for a down payment?', answer: 'Yes — most loan programs allow gift funds from family members. FHA accepts 100% gift funds. Conventional loans may require you to contribute at least 5% of your own funds if putting down less than 20%. Gift funds typically require a gift letter stating the money is not a loan.' },
]

const DOWN_PCT_OPTIONS = [3.5, 5, 10, 15, 20, 25]

export default function DownPaymentCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [homePrice, setHomePrice] = useState('400000')
  const [targetPct, setTargetPct] = useState('20')
  const [currentSavings, setCurrentSavings] = useState('10000')
  const [monthlySavings, setMonthlySavings] = useState('1500')
  const [savingsReturn, setSavingsReturn] = useState('4.5')
  const [mortgageRate, setMortgageRate] = useState('7')
  const [mortgageTerm, setMortgageTerm] = useState('30')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const hp = parseFloat(homePrice) || 0
    const tp = parseFloat(targetPct) || 0
    const cs = parseFloat(currentSavings) || 0
    const ms = parseFloat(monthlySavings) || 0
    const sr = parseFloat(savingsReturn) || 0
    const mr = parseFloat(mortgageRate) || 0
    const mt = parseInt(mortgageTerm) || 30
    if (hp <= 0 || tp <= 0 || ms <= 0) return null
    return calcDownPayment(hp, tp, cs, ms, sr, mr, mt)
  }, [homePrice, targetPct, currentSavings, monthlySavings, savingsReturn, mortgageRate, mortgageTerm])

  const hp = parseFloat(homePrice) || 0
  const cs = parseFloat(currentSavings) || 0
  const ms = parseFloat(monthlySavings) || 0
  const tp = parseFloat(targetPct) || 20

  // Progress bar
  const progressPct = result ? Math.min(100, (cs / result.downPayment) * 100) : 0

  // Chart — show every 3 months
  const chartData = result?.schedule
    .filter((_, i) => i % 3 === 0 || i === result.totalMonths - 1)
    .map(row => ({
      month: `M${row.month}`,
      Savings: row.balance,
    })) ?? []

  return (
    <>
      <SEOHead
        title="Down Payment Calculator – How Long to Save for a House"
        description="Free down payment calculator. Find out how long it will take to save your down payment and track milestone targets. Supports 150+ currencies."
        canonical="/real-estate/down-payment-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Planning</p>
            <h1 className={s.h1}>Down Payment Calculator</h1>
            <p className={s.sub}>Find out how long it takes to save your down payment and track key milestones.</p>
          </div>

          <AdBanner slot="24000000001" />

          <div className={s.mainGrid}>
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

              <div className={s.field}>
                <label className={s.label}>Target Home Price ({sym})</label>
                <input className={s.input} type="number" value={homePrice}
                  onChange={e => setHomePrice(e.target.value)} min="0" step="10000" placeholder="e.g. 400000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Down Payment Target (%)</label>
                <div className={s.pctButtons}>
                  {DOWN_PCT_OPTIONS.map(pct => (
                    <button key={pct}
                      className={`${s.pctBtn} ${targetPct === String(pct) ? s.pctActive : ''}`}
                      onClick={() => setTargetPct(String(pct))}>
                      {pct}%
                    </button>
                  ))}
                </div>
                <input className={s.input} type="number" value={targetPct}
                  onChange={e => setTargetPct(e.target.value)} min="0" max="100" step="0.5" placeholder="e.g. 20" />
                {hp > 0 && (
                  <span className={s.hint}>= {fmtMoney(hp * parseFloat(targetPct || '0') / 100, currency)}</span>
                )}
              </div>

              <div className={s.field}>
                <label className={s.label}>Current Savings ({sym})</label>
                <input className={s.input} type="number" value={currentSavings}
                  onChange={e => setCurrentSavings(e.target.value)} min="0" step="1000" placeholder="e.g. 10000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Monthly Savings ({sym})</label>
                <input className={s.input} type="number" value={monthlySavings}
                  onChange={e => setMonthlySavings(e.target.value)} min="0" step="100" placeholder="e.g. 1500" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Savings Interest Rate (%/yr)</label>
                <input className={s.input} type="number" value={savingsReturn}
                  onChange={e => setSavingsReturn(e.target.value)} min="0" max="20" step="0.1" placeholder="e.g. 4.5" />
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Mortgage Rate (%)</label>
                  <input className={s.input} type="number" value={mortgageRate}
                    onChange={e => setMortgageRate(e.target.value)} min="0" max="20" step="0.05" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Loan Term</label>
                  <select className={s.select} value={mortgageTerm} onChange={e => setMortgageTerm(e.target.value)}>
                    <option value="30">30 yrs</option>
                    <option value="20">20 yrs</option>
                    <option value="15">15 yrs</option>
                  </select>
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Your Savings Plan</h2>

                <div className={s.timeBox}>
                  <span className={s.timeLabel}>Time to Save {tp}% Down</span>
                  <span className={s.timeValue}>
                    {result.totalYears < 1
                      ? `${result.totalMonths} months`
                      : `${Math.floor(result.totalYears)} yr${Math.floor(result.totalYears) !== 1 ? 's' : ''} ${result.totalMonths % 12} mo`
                    }
                  </span>
                </div>

                {/* Progress bar */}
                <div className={s.progressSection}>
                  <div className={s.progressHeader}>
                    <span className={s.progressLabel}>Current Progress</span>
                    <span className={s.progressPct}>{progressPct.toFixed(1)}%</span>
                  </div>
                  <div className={s.progressTrack}>
                    <div className={s.progressFill} style={{ width: `${progressPct}%` }} />
                  </div>
                  <div className={s.progressAmounts}>
                    <span>{fmtMoney(cs, currency)} saved</span>
                    <span>{fmtMoney(result.downPayment, currency)} goal</span>
                  </div>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Down Payment Goal" value={fmtMoney(result.downPayment, currency)} />
                  <Stat label="Loan Amount" value={fmtMoney(result.loanAmount, currency)} />
                  <Stat label="Interest Earned" value={fmtMoney(result.interestEarned, currency)} green />
                  <Stat label="Monthly Mortgage" value={fmtMoney(result.monthlyPayment, currency)} />
                </div>

                {/* Milestones */}
                <div className={s.milestones}>
                  <h3 className={s.milestonesTitle}>Down Payment Milestones</h3>
                  {result.milestones.map(ms => (
                    <div key={ms.pct} className={`${s.milestone} ${ms.monthReached ? s.milestoneReached : ''}`}>
                      <div className={s.milestoneDot} />
                      <div className={s.milestoneContent}>
                        <span className={s.milestoneName}>{ms.label}</span>
                        <span className={s.milestoneAmt}>{fmtMoney(ms.amount, currency)}</span>
                      </div>
                      <span className={s.milestoneTime}>
                        {ms.monthReached
                          ? ms.monthReached < 12
                            ? `${ms.monthReached}mo`
                            : `${Math.floor(ms.monthReached / 12)}y ${ms.monthReached % 12}m`
                          : cs >= ms.amount ? '✅ Done' : '—'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏡</div>
                <p>Enter your details to see your down payment savings plan.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Savings Growth to {fmtMoney(result.downPayment, currency)} Goal</h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gDP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <ReferenceLine y={result.downPayment} stroke="var(--accent-amber)" strokeDasharray="4 4"
                    label={{ value: 'Goal', fill: 'var(--accent-amber)', fontSize: 10, position: 'right' }} />
                  <Area type="monotone" dataKey="Savings" stroke="#10b981" fill="url(#gDP)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <AdRectangle slot="24000000002" />

          <article className={s.article}>
            <h2>How to Save for a Down Payment</h2>
            <p>Saving a down payment is one of the biggest financial milestones for homebuyers. The key is combining consistent monthly savings with a high-yield savings account or short-term investments to let your money grow while you save.</p>

            {result && hp > 0 && (
              <div className={s.example}>
                <h3>📊 Your Plan</h3>
                <p>Saving <strong>{fmtMoney(ms, currency)}/month</strong> at <strong>{savingsReturn}%</strong> with <strong>{fmtMoney(cs, currency)}</strong> already saved:</p>
                <ul>
                  <li>Reach {tp}% down ({fmtMoney(result.downPayment, currency)}) in <strong>{result.totalYears} years</strong></li>
                  <li>Interest earned while saving: <strong>{fmtMoney(result.interestEarned, currency)}</strong></li>
                  <li>Future monthly mortgage: <strong>{fmtMoney(result.monthlyPayment, currency)}</strong></li>
                  {result.milestones[0].monthReached && (
                    <li>FHA minimum (3.5%) reached in <strong>{result.milestones[0].monthReached} months</strong></li>
                  )}
                </ul>
              </div>
            )}

            <h2>Down Payment Strategies</h2>
            <p>High-yield savings accounts currently offer 4–5% APY — far better than a regular savings account. For timelines of 3+ years, a mix of HYSAs and short-term Treasury bonds or CDs can boost returns safely. Avoid investing in stocks for money needed within 2 years due to market volatility risk.</p>

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

          <AdBanner slot="24000000003" />
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