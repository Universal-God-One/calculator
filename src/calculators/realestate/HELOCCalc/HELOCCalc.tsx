import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcHELOC } from './helocEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import s from './HELOCCalc.module.css'

const FAQS = [
  { question: 'What is a HELOC?', answer: 'A Home Equity Line of Credit (HELOC) is a revolving credit line secured by your home equity. Unlike a home equity loan (lump sum at fixed rate), a HELOC works like a credit card — you draw funds as needed during the draw period, then repay during the repayment period.' },
  { question: 'What are the HELOC draw and repayment periods?', answer: 'The draw period (typically 10 years) lets you borrow up to your credit limit, paying interest only on what you\'ve drawn. The repayment period (typically 10–20 years) begins when the draw period ends — you can no longer draw funds and must repay the full balance through fixed amortizing payments.' },
  { question: 'Are HELOC rates fixed or variable?', answer: 'Most HELOCs have variable interest rates tied to the prime rate. This means your monthly payment can change as interest rates rise or fall. Some lenders offer fixed-rate conversion options for some or all of your balance. This calculator uses a fixed rate as a projection.' },
  { question: 'What is the HELOC payment shock?', answer: 'Payment shock occurs at the end of the draw period when interest-only payments convert to fully amortizing payments. Your payment could double or triple overnight. For example, interest-only at 8% on $50,000 is $333/month, but full amortization over 20 years at 8% jumps to $418/month.' },
  { question: 'HELOC vs Home Equity Loan — which is better?', answer: 'A HELOC is better for ongoing or uncertain expenses (renovations with unknown final cost, emergency funds, tuition). A home equity loan is better for one-time known expenses where you want payment certainty. HELOCs offer flexibility but carry variable rate risk.' },
]

export default function HELOCCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [homeValue, setHomeValue] = useState('500000')
  const [mortgageBalance, setMortgageBalance] = useState('280000')
  const [creditLine, setCreditLine] = useState('100000')
  const [drawAmount, setDrawAmount] = useState('60000')
  const [rate, setRate] = useState('8.5')
  const [drawYears, setDrawYears] = useState('10')
  const [repayYears, setRepayYears] = useState('20')
  const [maxLTV, setMaxLTV] = useState('85')
  const [extraDraw, setExtraDraw] = useState('0')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const hv = parseFloat(homeValue) || 0
    const mb = parseFloat(mortgageBalance) || 0
    const cl = parseFloat(creditLine) || 0
    const da = parseFloat(drawAmount) || 0
    const r = parseFloat(rate) || 0
    const dy = parseInt(drawYears) || 10
    const ry = parseInt(repayYears) || 20
    const ltv = parseFloat(maxLTV) || 85
    const ed = parseFloat(extraDraw) || 0
    if (hv <= 0 || r <= 0 || da <= 0) return null
    if (mb >= hv) return null
    return calcHELOC(hv, mb, cl, da, r, dy, ry, ltv, ed)
  }, [homeValue, mortgageBalance, creditLine, drawAmount, rate, drawYears, repayYears, maxLTV, extraDraw])

  const hv = parseFloat(homeValue) || 0
  const mb = parseFloat(mortgageBalance) || 0
  const da = parseFloat(drawAmount) || 0
  const dy = parseInt(drawYears) || 10
  const ry = parseInt(repayYears) || 20
  const equityPct = hv > 0 ? ((hv - mb) / hv * 100).toFixed(1) : '0'

  const chartData = result?.schedule
    .filter((_, i) => i % 12 === 11)
    .map((row, i) => ({
      year: `Yr ${i + 1}`,
      Balance: row.balance,
    })) ?? []

  return (
    <>
      <SEOHead
        title="HELOC Calculator – Home Equity Line of Credit Payment"
        description="Free HELOC calculator. Calculate draw period interest-only payments and repayment period payments. See total interest cost and payment shock."
        canonical="/real-estate/heloc-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Home Equity</p>
            <h1 className={s.h1}>HELOC Calculator</h1>
            <p className={s.sub}>Calculate your Home Equity Line of Credit payments across both the draw and repayment periods.</p>
          </div>

          <AdBanner slot="26000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>HELOC Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Home Value ({sym})</label>
                <input className={s.input} type="number" value={homeValue}
                  onChange={e => setHomeValue(e.target.value)} min="0" step="10000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Mortgage Balance ({sym})</label>
                <input className={s.input} type="number" value={mortgageBalance}
                  onChange={e => setMortgageBalance(e.target.value)} min="0" step="5000" />
                {hv > 0 && mb < hv && (
                  <span className={s.hint}>Equity: {fmtMoney(hv - mb, currency)} ({equityPct}%)</span>
                )}
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Credit Line ({sym})</label>
                  <input className={s.input} type="number" value={creditLine}
                    onChange={e => setCreditLine(e.target.value)} min="0" step="5000" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Amount Drawn ({sym})</label>
                  <input className={s.input} type="number" value={drawAmount}
                    onChange={e => setDrawAmount(e.target.value)} min="0" step="5000" />
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Interest Rate (%)</label>
                <input className={s.input} type="number" value={rate}
                  onChange={e => setRate(e.target.value)} min="0" max="30" step="0.1" />
                <span className={s.hint}>Most HELOCs are variable — this projects at a fixed rate</span>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Draw Period (yrs)</label>
                  <select className={s.select} value={drawYears} onChange={e => setDrawYears(e.target.value)}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Repay Period (yrs)</label>
                  <select className={s.select} value={repayYears} onChange={e => setRepayYears(e.target.value)}>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Max CLTV (%)</label>
                  <input className={s.input} type="number" value={maxLTV}
                    onChange={e => setMaxLTV(e.target.value)} min="50" max="95" step="1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Extra Principal/mo ({sym})</label>
                  <input className={s.input} type="number" value={extraDraw}
                    onChange={e => setExtraDraw(e.target.value)} min="0" step="50" placeholder="0" />
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>HELOC Summary</h2>

                <div className={s.phaseGrid}>
                  <div className={s.phaseCard}>
                    <span className={s.phaseLabel}>Draw Period ({dy} yrs)</span>
                    <span className={s.phaseNote}>Interest Only</span>
                    <span className={s.phaseAmount}>{fmtMoney(result.drawMonthlyInterestOnly, currency)}</span>
                    <span className={s.phaseSubNote}>/month</span>
                  </div>
                  <div className={s.phaseArrow}>→</div>
                  <div className={`${s.phaseCard} ${s.phaseRepay}`}>
                    <span className={s.phaseLabel}>Repay Period ({ry} yrs)</span>
                    <span className={s.phaseNote}>Fully Amortizing</span>
                    <span className={s.phaseAmount}>{fmtMoney(result.repayMonthlyPayment, currency)}</span>
                    <span className={s.phaseSubNote}>/month</span>
                  </div>
                </div>

                {result.repayMonthlyPayment > result.drawMonthlyInterestOnly * 1.2 && (
                  <div className={s.shockWarning}>
                    ⚠️ <strong>Payment Shock:</strong> Payment increases from {fmtMoney(result.drawMonthlyInterestOnly, currency)} to {fmtMoney(result.repayMonthlyPayment, currency)}/mo — a {Math.round((result.repayMonthlyPayment / result.drawMonthlyInterestOnly - 1) * 100)}% jump.
                  </div>
                )}

                <div className={s.statGrid}>
                  <Stat label="Amount Drawn" value={fmtMoney(da, currency)} />
                  <Stat label="Available Credit" value={fmtMoney(result.availableCredit, currency)} green />
                  <Stat label="Max Credit Line" value={fmtMoney(result.maxCreditLine, currency)} />
                  <Stat label="New Combined LTV" value={`${result.newCLTV}%`} warn={result.newCLTV > 85} />
                  <Stat label="Draw Period Interest" value={fmtMoney(result.drawPeriodTotalInterest, currency)} />
                  <Stat label="Repay Period Interest" value={fmtMoney(result.repayTotalInterest, currency)} />
                </div>

                <div className={s.totalSection}>
                  <div className={s.totalRow}>
                    <span>Total Interest</span>
                    <span className={s.totalVal}>{fmtMoney(result.totalInterest, currency)}</span>
                  </div>
                  <div className={s.totalRow}>
                    <span>Total Cost (draw + interest)</span>
                    <span className={s.totalVal}>{fmtMoney(result.totalCost, currency)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>💳</div>
                <p>{mb >= hv ? 'Your mortgage balance exceeds home value.' : 'Enter your HELOC details to calculate payments.'}</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Balance Over {dy + ry} Years</h2>
              <ResponsiveContainer width="100%" height={270}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gHELOC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <ReferenceLine x={`Yr ${dy}`} stroke="var(--accent-amber)" strokeDasharray="4 4"
                    label={{ value: 'Repayment Begins', fill: 'var(--accent-amber)', fontSize: 10 }} />
                  <Area type="monotone" dataKey="Balance" stroke="#f59e0b" fill="url(#gHELOC)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Payment Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Month</th><th>Phase</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule
                      .filter((row, i) => i % 6 === 0 || (i > 0 && result.schedule[i].phase !== result.schedule[i - 1].phase))
                      .map(row => (
                        <tr key={row.month} className={row.phase === 'repayment' ? s.repayRow : ''}>
                          <td>{row.month}</td>
                          <td><span className={`${s.phaseBadge} ${row.phase === 'draw' ? s.phaseDraw : s.phaseRepayBadge}`}>{row.phase}</span></td>
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

          <AdRectangle slot="26000000002" />

          <article className={s.article}>
            <h2>How a HELOC Works</h2>
            <p>A HELOC has two phases. During the <strong>draw period</strong> (typically 10 years), you can borrow up to your credit limit and pay interest only on what you've drawn. During the <strong>repayment period</strong> (typically 10–20 years), you can no longer borrow and must fully repay the outstanding balance through amortizing payments.</p>

            {result && da > 0 && (
              <div className={s.example}>
                <h3>📊 Your HELOC</h3>
                <ul>
                  <li>Draw amount: <strong>{fmtMoney(da, currency)}</strong></li>
                  <li>Draw period payment (interest only): <strong>{fmtMoney(result.drawMonthlyInterestOnly, currency)}/mo</strong> for {dy} years</li>
                  <li>Repayment period payment: <strong>{fmtMoney(result.repayMonthlyPayment, currency)}/mo</strong> for {ry} years</li>
                  <li>Total interest: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                  <li>Remaining available credit: <strong>{fmtMoney(result.availableCredit, currency)}</strong></li>
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

          <AdBanner slot="26000000003" />
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