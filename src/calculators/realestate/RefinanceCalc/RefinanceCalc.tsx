import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcRefinance } from './refinanceEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
import s from './RefinanceCalc.module.css'

const FAQS = [
  { question: 'When should I refinance my mortgage?', answer: 'Refinancing makes sense when you can lower your interest rate by at least 0.5–1%, you plan to stay in the home long enough to recoup closing costs (break-even point), and your credit score qualifies you for a better rate. Rising home equity can also eliminate PMI.' },
  { question: 'What are typical refinance closing costs?', answer: 'Closing costs typically run 2–5% of the loan amount. Common fees include origination fees, appraisal, title insurance, attorney fees, and government recording fees. Some lenders offer "no-closing-cost" refinances, but they roll the costs into the rate or loan balance.' },
  { question: 'What is the break-even point?', answer: 'The break-even point is how many months it takes for your monthly savings to offset the closing costs. If closing costs are $6,000 and you save $200/month, your break-even is 30 months (2.5 years). If you plan to stay longer than that, refinancing makes financial sense.' },
  { question: 'Should I refinance to a shorter term?', answer: 'Refinancing from a 30-year to a 15-year mortgage dramatically reduces total interest paid, but increases monthly payments. If you can afford the higher payment and the rate is lower, this can save hundreds of thousands in interest and build equity much faster.' },
]

export default function RefinanceCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [currentBalance, setCurrentBalance] = useState('280000')
  const [currentRate, setCurrentRate] = useState('7.5')
  const [monthsRemaining, setMonthsRemaining] = useState('300')
  const [newRate, setNewRate] = useState('6.5')
  const [newTerm, setNewTerm] = useState('30')
  const [closingCosts, setClosingCosts] = useState('6000')
  const [cashOut, setCashOut] = useState('0')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const cb = parseFloat(currentBalance) || 0
    const cr = parseFloat(currentRate) || 0
    const mr = parseInt(monthsRemaining) || 0
    const nr = parseFloat(newRate) || 0
    const nt = parseInt(newTerm) || 30
    const cc = parseFloat(closingCosts) || 0
    const co = parseFloat(cashOut) || 0
    if (cb <= 0 || cr <= 0 || mr <= 0 || nr <= 0) return null
    return calcRefinance(cb, cr, mr, nr, nt, cc, co)
  }, [currentBalance, currentRate, monthsRemaining, newRate, newTerm, closingCosts, cashOut])

  const cc = parseFloat(closingCosts) || 0
  const worthIt = result && result.breakEvenMonths < parseInt(monthsRemaining)

  const chartData = result?.schedule.map(row => ({
    year: `Yr ${Math.floor(row.month / 12)}`,
    'Cumulative Savings': row.cumulativeSavings,
  })) ?? []

  return (
    <>
      <SEOHead
        title="Refinance Calculator – Should I Refinance My Mortgage?"
        description="Free refinance calculator. Find your break-even point, monthly savings, and total interest saved from refinancing. Compare current vs new loan side by side."
        canonical="/real-estate/refinance-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Mortgage</p>
            <h1 className={s.h1}>Refinance Calculator</h1>
            <p className={s.sub}>Find your break-even point and see if refinancing your mortgage makes financial sense.</p>
          </div>

          <AdBanner slot="19000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Loan Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.section}>
                <h3 className={s.sectionTitle}>Current Loan</h3>
                <div className={s.field}>
                  <label className={s.label}>Remaining Balance ({sym})</label>
                  <input className={s.input} type="number" value={currentBalance}
                    onChange={e => setCurrentBalance(e.target.value)} min="0" step="10000" placeholder="e.g. 280000" />
                </div>
                <div className={s.fieldRow}>
                  <div className={s.field}>
                    <label className={s.label}>Current Rate (%)</label>
                    <input className={s.input} type="number" value={currentRate}
                      onChange={e => setCurrentRate(e.target.value)} min="0" max="20" step="0.05" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Months Remaining</label>
                    <input className={s.input} type="number" value={monthsRemaining}
                      onChange={e => setMonthsRemaining(e.target.value)} min="1" max="360" placeholder="e.g. 300" />
                  </div>
                </div>
              </div>

              <div className={s.section}>
                <h3 className={s.sectionTitle}>New Loan</h3>
                <div className={s.fieldRow}>
                  <div className={s.field}>
                    <label className={s.label}>New Rate (%)</label>
                    <input className={s.input} type="number" value={newRate}
                      onChange={e => setNewRate(e.target.value)} min="0" max="20" step="0.05" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>New Term</label>
                    <select className={s.select} value={newTerm} onChange={e => setNewTerm(e.target.value)}>
                      <option value="30">30 Years</option>
                      <option value="20">20 Years</option>
                      <option value="15">15 Years</option>
                      <option value="10">10 Years</option>
                    </select>
                  </div>
                </div>
                <div className={s.fieldRow}>
                  <div className={s.field}>
                    <label className={s.label}>Closing Costs ({sym})</label>
                    <input className={s.input} type="number" value={closingCosts}
                      onChange={e => setClosingCosts(e.target.value)} min="0" step="500" placeholder="e.g. 6000" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Cash Out ({sym})</label>
                    <input className={s.input} type="number" value={cashOut}
                      onChange={e => setCashOut(e.target.value)} min="0" step="1000" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Refinance Analysis</h2>

                <div className={`${s.verdict} ${worthIt ? s.verdictGood : s.verdictWarn}`}>
                  {worthIt
                    ? `✅ Refinancing makes sense — break-even in ${result.breakEvenYears} years`
                    : result.breakEvenMonths === 9999
                      ? '⚠️ New rate is higher — refinancing will cost more'
                      : `⚠️ Break-even (${result.breakEvenYears} yrs) may exceed your remaining term`
                  }
                </div>

                <div className={s.compareGrid}>
                  <div className={s.compareCol}>
                    <span className={s.compareHeader}>Current Loan</span>
                    <span className={s.compareVal}>{fmtMoney(result.currentMonthly, currency)}<span className={s.perMo}>/mo</span></span>
                    <span className={s.compareNote}>Remaining: {fmtMoney(result.currentTotalRemaining, currency)}</span>
                  </div>
                  <div className={s.compareArrow}>→</div>
                  <div className={s.compareCol}>
                    <span className={s.compareHeader}>New Loan</span>
                    <span className={s.compareVal} style={{ color: result.monthlySavings > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {fmtMoney(result.newMonthly, currency)}<span className={s.perMo}>/mo</span>
                    </span>
                    <span className={s.compareNote}>Total: {fmtMoney(result.newTotalPayment, currency)}</span>
                  </div>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Monthly Savings" value={fmtMoney(result.monthlySavings, currency)} green={result.monthlySavings > 0} />
                  <Stat label="Break-Even" value={result.breakEvenMonths === 9999 ? 'N/A' : `${result.breakEvenMonths} months`} />
                  <Stat label="Interest Saved" value={fmtMoney(result.interestSaved, currency)} green={result.interestSaved > 0} />
                  <Stat label="Net Savings" value={fmtMoney(result.netSavings, currency)} green={result.netSavings > 0} />
                  <Stat label="Closing Costs" value={fmtMoney(cc, currency)} />
                  <Stat label="Rate Reduction" value={`${(parseFloat(currentRate) - parseFloat(newRate)).toFixed(2)}%`} green={parseFloat(currentRate) > parseFloat(newRate)} />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🔄</div>
                <p>Enter your current and new loan details to analyze refinancing.</p>
              </div>
            )}
          </div>

          {result && result.breakEvenMonths !== 9999 && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Cumulative Savings Over Time</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={70}
                    tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <ReferenceLine y={0} stroke="var(--accent-amber)" strokeDasharray="4 4"
                    label={{ value: 'Break-even', fill: 'var(--accent-amber)', fontSize: 10, position: 'right' }} />
                  <Line type="monotone" dataKey="Cumulative Savings" stroke="#10b981" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className={s.chartNote}>Negative = still recouping closing costs. Positive = net savings.</p>
            </div>
          )}

          <AdRectangle slot="19000000002" />

          <article className={s.article}>
            <h2>Is Refinancing Worth It?</h2>
            <p>Refinancing replaces your existing mortgage with a new one — ideally at a lower interest rate. The key question is whether your monthly savings will recoup the closing costs before you sell or pay off the home. This is the break-even point.</p>

            {result && (
              <div className={s.example}>
                <h3>📊 Your Refinance</h3>
                <ul>
                  <li>Current payment: <strong>{fmtMoney(result.currentMonthly, currency)}/month</strong></li>
                  <li>New payment: <strong>{fmtMoney(result.newMonthly, currency)}/month</strong></li>
                  <li>Monthly savings: <strong>{fmtMoney(result.monthlySavings, currency)}</strong></li>
                  <li>Closing costs recouped in: <strong>{result.breakEvenMonths === 9999 ? 'N/A' : `${result.breakEvenMonths} months (${result.breakEvenYears} years)`}</strong></li>
                  <li>Interest saved over loan life: <strong>{fmtMoney(result.interestSaved, currency)}</strong></li>
                </ul>
              </div>
            )}

            <h2>The Break-Even Rule</h2>
            <p>Calculate your break-even by dividing total closing costs by monthly savings. If break-even is 24 months and you plan to stay 7+ years, refinancing is a clear win. If you might move in 2 years, it may not be worth it. Consider how long you plan to keep the loan before refinancing.</p>

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

          <AdBanner slot="19000000003" />
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