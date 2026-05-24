import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcHomeEquity } from './homeEquityEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import s from './HomeEquityCalc.module.css'

const FAQS = [
  { question: 'What is a home equity loan?', answer: 'A home equity loan lets you borrow against the equity you\'ve built in your home. It provides a lump sum at a fixed interest rate and fixed monthly payments, similar to a second mortgage. You use your home as collateral.' },
  { question: 'How much can I borrow with a home equity loan?', answer: 'Most lenders allow you to borrow up to 85% of your home\'s value minus your outstanding mortgage balance (Combined Loan-to-Value or CLTV ratio). For example, if your home is worth $400,000 and you owe $200,000, you could borrow up to $140,000 (85% of $400k minus $200k).' },
  { question: 'What is the difference between a home equity loan and a HELOC?', answer: 'A home equity loan provides a fixed lump sum at a fixed rate with fixed monthly payments. A HELOC (Home Equity Line of Credit) works like a credit card — you draw funds as needed during a draw period, often at a variable rate. Home equity loans are better for one-time large expenses; HELOCs for ongoing needs.' },
  { question: 'Is home equity loan interest tax deductible?', answer: 'Home equity loan interest may be tax deductible if the funds are used to "buy, build, or substantially improve" your home. Interest used for personal expenses (debt consolidation, vacations) is generally not deductible under current IRS rules. Consult a tax professional for your situation.' },
]

export default function HomeEquityCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [homeValue, setHomeValue] = useState('450000')
  const [mortgageBalance, setMortgageBalance] = useState('250000')
  const [loanAmount, setLoanAmount] = useState('50000')
  const [rate, setRate] = useState('8.5')
  const [term, setTerm] = useState('10')
  const [maxLTV, setMaxLTV] = useState('85')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const hv = parseFloat(homeValue) || 0
    const mb = parseFloat(mortgageBalance) || 0
    const la = parseFloat(loanAmount) || 0
    const r = parseFloat(rate) || 0
    const t = parseInt(term) || 10
    const ltv = parseFloat(maxLTV) || 85
    if (hv <= 0 || r <= 0 || la <= 0) return null
    if (mb >= hv) return null
    return calcHomeEquity(hv, mb, la, r, t, ltv)
  }, [homeValue, mortgageBalance, loanAmount, rate, term, maxLTV])

  const hv = parseFloat(homeValue) || 0
  const mb = parseFloat(mortgageBalance) || 0
  const la = parseFloat(loanAmount) || 0
  const t = parseInt(term) || 10

  const exceedsMax = result && la > result.maxLoanAmount
  const equityPct = hv > 0 ? ((hv - mb) / hv * 100).toFixed(1) : '0'

  const chartData = result?.schedule
    .filter((_, i) => i % 12 === 0)
    .map(row => ({
      year: `Yr ${Math.ceil(row.month / 12)}`,
      Balance: row.balance,
    })) ?? []

  return (
    <>
      <SEOHead
        title="Home Equity Loan Calculator – Monthly Payment & Max Loan"
        description="Free home equity loan calculator. Find your maximum borrowing amount, monthly payment, and total interest. Supports 150+ currencies."
        canonical="/real-estate/home-equity-loan-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Home Equity</p>
            <h1 className={s.h1}>Home Equity Loan Calculator</h1>
            <p className={s.sub}>Calculate how much you can borrow against your home equity and your monthly payment.</p>
          </div>

          <AdBanner slot="22000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Home Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Current Home Value ({sym})</label>
                <input className={s.input} type="number" value={homeValue}
                  onChange={e => setHomeValue(e.target.value)} min="0" step="10000" placeholder="e.g. 450000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Remaining Mortgage Balance ({sym})</label>
                <input className={s.input} type="number" value={mortgageBalance}
                  onChange={e => setMortgageBalance(e.target.value)} min="0" step="5000" placeholder="e.g. 250000" />
                {hv > 0 && mb < hv && (
                  <span className={s.hint}>Current equity: {fmtMoney(hv - mb, currency)} ({equityPct}%)</span>
                )}
              </div>

              <div className={s.field}>
                <label className={s.label}>Loan Amount Needed ({sym})</label>
                <input className={s.input} type="number" value={loanAmount}
                  onChange={e => setLoanAmount(e.target.value)} min="0" step="5000" placeholder="e.g. 50000" />
                {exceedsMax && result && (
                  <span className={s.warning}>⚠️ Exceeds max available: {fmtMoney(result.maxLoanAmount, currency)}</span>
                )}
              </div>

              <div className={s.field}>
                <label className={s.label}>Max CLTV Ratio (%)</label>
                <input className={s.input} type="number" value={maxLTV}
                  onChange={e => setMaxLTV(e.target.value)} min="50" max="95" step="1" placeholder="85" />
                <span className={s.hint}>Most lenders allow 80–90%</span>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Interest Rate (%)</label>
                  <input className={s.input} type="number" value={rate}
                    onChange={e => setRate(e.target.value)} min="0" max="30" step="0.1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Loan Term</label>
                  <select className={s.select} value={term} onChange={e => setTerm(e.target.value)}>
                    <option value="5">5 Years</option>
                    <option value="10">10 Years</option>
                    <option value="15">15 Years</option>
                    <option value="20">20 Years</option>
                    <option value="30">30 Years</option>
                  </select>
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Home Equity Loan Summary</h2>

                <div className={s.bigPayment}>
                  <span className={s.bigLabel}>Monthly Payment</span>
                  <span className={s.bigValue}>{fmtMoney(result.monthlyPayment, currency)}<span className={s.bigSub}>/mo</span></span>
                </div>

                <div className={s.equityViz}>
                  <h3 className={s.equityTitle}>Home Value Breakdown</h3>
                  <div className={s.equityBar}>
                    <div className={s.equitySegMortgage} style={{ width: `${(mb / hv) * 100}%` }} title={`Mortgage: ${fmtMoney(mb, currency)}`} />
                    <div className={s.equitySegLoan} style={{ width: `${(la / hv) * 100}%` }} title={`HE Loan: ${fmtMoney(la, currency)}`} />
                    <div className={s.equitySegFree} style={{ width: `${Math.max(0, ((hv - mb - la) / hv) * 100)}%` }} title="Remaining Equity" />
                  </div>
                  <div className={s.equityLegend}>
                    <span className={s.legendDot} style={{ background: '#ef4444' }} />Mortgage
                    <span className={s.legendDot} style={{ background: '#f59e0b' }} />HE Loan
                    <span className={s.legendDot} style={{ background: '#10b981' }} />Remaining Equity
                  </div>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Home Value" value={fmtMoney(hv, currency)} />
                  <Stat label="Your Equity" value={fmtMoney(result.availableEquity, currency)} green />
                  <Stat label="Max You Can Borrow" value={fmtMoney(result.maxLoanAmount, currency)} green />
                  <Stat label="Current LTV" value={`${result.currentLTV}%`} />
                  <Stat label="New Combined LTV" value={`${result.newLTV}%`} warn={result.newLTV > 85} />
                  <Stat label="Total Interest" value={fmtMoney(result.totalInterest, currency)} />
                </div>

                <div className={s.totalRow}>
                  <span>Total Repayment</span>
                  <span className={s.totalVal}>{fmtMoney(result.totalPayment, currency)}</span>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏡</div>
                <p>{mb >= hv ? 'Your mortgage balance exceeds home value — no equity available.' : 'Enter your home details to calculate available equity.'}</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Loan Balance Over {t} Years</h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gHE" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Balance" stroke="#f59e0b" fill="url(#gHE)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Repayment Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{fmtMoney(row.payment, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.principal, currency)}</td>
                        <td className={s.amber}>{fmtMoney(row.interest, currency)}</td>
                        <td className={s.bold}>{fmtMoney(row.balance, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="22000000002" />

          <article className={s.article}>
            <h2>How Home Equity Loans Work</h2>
            <p>A home equity loan lets you borrow a lump sum against the equity in your home. Lenders typically allow borrowing up to 85% of your home's combined loan-to-value (CLTV) ratio — meaning your existing mortgage plus the new loan cannot exceed 85% of the home's appraised value.</p>

            {result && hv > 0 && (
              <div className={s.example}>
                <h3>📊 Your Equity</h3>
                <ul>
                  <li>Home value: <strong>{fmtMoney(hv, currency)}</strong></li>
                  <li>Available equity: <strong>{fmtMoney(result.availableEquity, currency)} ({equityPct}%)</strong></li>
                  <li>Maximum you can borrow: <strong>{fmtMoney(result.maxLoanAmount, currency)}</strong></li>
                  <li>Monthly payment on {fmtMoney(la, currency)}: <strong>{fmtMoney(result.monthlyPayment, currency)}</strong></li>
                  <li>Total interest: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                </ul>
              </div>
            )}

            <h2>Home Equity Loan vs HELOC</h2>
            <p>A home equity loan gives you a fixed lump sum at a fixed rate — predictable payments for the life of the loan. A HELOC works like a revolving credit line at a variable rate, ideal for ongoing expenses. Choose a home equity loan when you know exactly how much you need and want payment certainty.</p>

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

          <AdBanner slot="22000000003" />
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, green, warn }: { label: string; value: string; green?: boolean; warn?: boolean }) {
  return (
    <div className={s.stat}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : warn ? { color: 'var(--accent-amber)' } : {}}>{value}</span>
    </div>
  )
}