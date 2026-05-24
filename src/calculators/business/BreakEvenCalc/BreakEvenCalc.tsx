import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcBreakEven } from './breakEvenEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts'
import s from './BreakEvenCalc.module.css'

const FAQS = [
  { question: 'What is the break-even point?', answer: 'The break-even point is the sales volume at which total revenue equals total costs — you make neither profit nor loss. Any sales above break-even generate profit; below it generates a loss. It\'s a critical metric for pricing decisions and business viability.' },
  { question: 'What is contribution margin?', answer: 'Contribution margin is the selling price minus variable cost per unit: CM = Price − Variable Cost. It\'s the amount each unit sold "contributes" toward covering fixed costs and then generating profit. Break-even units = Fixed Costs ÷ Contribution Margin.' },
  { question: 'What is margin of safety?', answer: 'Margin of safety is how much your current sales exceed the break-even point, expressed in dollars or as a percentage. It measures how much sales can decline before you start losing money. A higher margin of safety means less business risk.' },
  { question: 'What is the degree of operating leverage?', answer: 'DOL measures how sensitive operating profit is to changes in sales. DOL = Contribution Margin ÷ Operating Income. A DOL of 3 means a 10% increase in sales leads to a 30% increase in profit. High DOL means high fixed costs relative to profit — more risk but more reward.' },
]

export default function BreakEvenCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [fixedCosts, setFixedCosts] = useState('50000')
  const [pricePerUnit, setPricePerUnit] = useState('25')
  const [variableCost, setVariableCost] = useState('10')
  const [currentUnits, setCurrentUnits] = useState('5000')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const fc = parseFloat(fixedCosts) || 0
    const p = parseFloat(pricePerUnit) || 0
    const vc = parseFloat(variableCost) || 0
    const cu = parseFloat(currentUnits) || undefined
    if (fc <= 0 || p <= 0 || vc < 0) return null
    try { return calcBreakEven(fc, p, vc, cu) } catch { return null }
  }, [fixedCosts, pricePerUnit, variableCost, currentUnits])

  const cu = parseFloat(currentUnits) || 0

  const chartData = result?.schedule.map(row => ({
    units: row.units,
    Revenue: row.revenue,
    'Total Cost': row.totalCosts,
    'Fixed Cost': row.fixedCosts,
    Profit: row.profit,
  }))

  const isAboveBreakEven = result && cu > result.breakEvenUnits

  return (
    <>
      <SEOHead
        title="Break-Even Calculator – Find Your Break-Even Point"
        description="Free break-even calculator. Find break-even units and revenue, contribution margin, margin of safety, and degree of operating leverage with a break-even chart."
        canonical="/business/break-even-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Finance</p>
            <h1 className={s.h1}>Break-Even Calculator</h1>
            <p className={s.sub}>Find your break-even point, contribution margin, and margin of safety.</p>
            <div className={s.formulaBadge}>Break-Even Units = Fixed Costs ÷ (Price − Variable Cost)</div>
          </div>

          <AdBanner slot="39000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Cost & Pricing</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Total Fixed Costs ({sym})</label>
                <input className={s.input} type="number" value={fixedCosts}
                  onChange={e => setFixedCosts(e.target.value)} min="0" step="100" placeholder="e.g. 50000" />
                <span className={s.hint}>Rent, salaries, insurance — costs that don't change with volume</span>
              </div>

              <div className={s.field}>
                <label className={s.label}>Selling Price per Unit ({sym})</label>
                <input className={s.input} type="number" value={pricePerUnit}
                  onChange={e => setPricePerUnit(e.target.value)} min="0" step="0.01" placeholder="e.g. 25" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Variable Cost per Unit ({sym})</label>
                <input className={s.input} type="number" value={variableCost}
                  onChange={e => setVariableCost(e.target.value)} min="0" step="0.01" placeholder="e.g. 10" />
                <span className={s.hint}>Materials, labor — costs that scale with each unit sold</span>
              </div>

              <div className={s.field}>
                <label className={s.label}>Current / Expected Units Sold</label>
                <input className={s.input} type="number" value={currentUnits}
                  onChange={e => setCurrentUnits(e.target.value)} min="0" step="100" placeholder="e.g. 5000" />
                <span className={s.hint}>Optional — enables margin of safety and DOL</span>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Break-Even Analysis</h2>

                <div className={s.beHighlight}>
                  <div className={s.beItem}>
                    <span className={s.beLabel}>Break-Even Units</span>
                    <span className={s.beValue}>{result.breakEvenUnits.toLocaleString()}</span>
                    <span className={s.beSub}>units to sell</span>
                  </div>
                  <div className={s.beItem}>
                    <span className={s.beLabel}>Break-Even Revenue</span>
                    <span className={s.beValue}>{fmtMoney(result.breakEvenRevenue, currency)}</span>
                    <span className={s.beSub}>needed to cover all costs</span>
                  </div>
                </div>

                {cu > 0 && (
                  <div className={`${s.statusBanner} ${isAboveBreakEven ? s.statusProfit : s.statusLoss}`}>
                    {isAboveBreakEven
                      ? `✅ Profitable — selling ${cu.toLocaleString()} units, ${(cu - result.breakEvenUnits).toLocaleString()} above break-even`
                      : `⚠️ Below break-even — need ${(result.breakEvenUnits - cu).toFixed(0)} more units`
                    }
                  </div>
                )}

                <div className={s.statGrid}>
                  <Stat label="Contribution Margin" value={fmtMoney(result.contributionMargin, currency)} sub="per unit" green />
                  <Stat label="CM Ratio" value={result.contributionMarginRatio + '%'} sub="of revenue" green />
                  {cu > 0 && <>
                    <Stat label="Current Revenue" value={fmtMoney(cu * parseFloat(pricePerUnit), currency)} />
                    <Stat label="Current Profit" value={fmtMoney(cu * result.contributionMargin - parseFloat(fixedCosts), currency)}
                      green={cu * result.contributionMargin > parseFloat(fixedCosts)} />
                    <Stat label="Margin of Safety" value={fmtMoney(result.marginOfSafety, currency)} sub={result.marginOfSafetyPct + '%'} />
                    {result.degreeOfOperatingLeverage !== null && (
                      <Stat label="Oper. Leverage (DOL)" value={result.degreeOfOperatingLeverage + 'x'} />
                    )}
                  </>}
                </div>

                <div className={s.formulaBox}>
                  <div className={s.fRow}>
                    <span>Break-Even =</span>
                    <span className={s.fVal}>{fmtMoney(parseFloat(fixedCosts), currency)} ÷ {fmtMoney(result.contributionMargin, currency)} = <strong>{result.breakEvenUnits} units</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>📊</div>
                <p>Enter your fixed costs, price, and variable cost to find your break-even point.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Break-Even Chart</h2>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="units" tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v}
                    label={{ value: 'Units', position: 'insideBottom', fill: 'var(--text-muted)', fontSize: 11, offset: -5 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip
                    formatter={(v: number, name: string) => [fmtMoney(v, currency), name]}
                    labelFormatter={l => `Units: ${(+l).toLocaleString()}`}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <ReferenceLine x={result.breakEvenUnits} stroke="var(--accent-amber)" strokeDasharray="5 5"
                    label={{ value: 'B/E', fill: 'var(--accent-amber)', fontSize: 10, position: 'top' }} />
                  {cu > 0 && (
                    <ReferenceLine x={cu} stroke="var(--accent-green)" strokeDasharray="4 4"
                      label={{ value: 'Current', fill: 'var(--accent-green)', fontSize: 10, position: 'top' }} />
                  )}
                  <Line type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Total Cost" stroke="#ef4444" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Fixed Cost" stroke="rgba(148,163,184,0.5)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className={s.chartNote}>Revenue (blue) crosses Total Cost (red) at the break-even point</p>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Profit at Different Sales Volumes</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Units</th><th>Revenue</th><th>Variable Cost</th><th>Total Cost</th><th>Profit / Loss</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.units} className={row.units >= result.breakEvenUnits && row.units > 0 ? s.profitRow : ''}>
                        <td className={s.mono}>{row.units.toLocaleString()}</td>
                        <td className={s.mono}>{fmtMoney(row.revenue, currency)}</td>
                        <td className={s.mono}>{fmtMoney(row.variableCosts, currency)}</td>
                        <td className={s.mono}>{fmtMoney(row.totalCosts, currency)}</td>
                        <td className={`${s.mono} ${row.profit >= 0 ? s.green : s.red}`}>
                          {fmtMoney(row.profit, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <article className={s.article}>
            <h2>How Break-Even Analysis Works</h2>
            <p>Break-even analysis separates costs into fixed (don't change with volume) and variable (scale with each unit). The contribution margin — price minus variable cost — covers fixed costs first, then generates profit. Once fixed costs are fully covered, every additional unit sold generates pure contribution margin as profit.</p>
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

          <AdBanner slot="39000000002" />
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, sub, green }: { label: string; value: string; sub?: string; green?: boolean }) {
  return (
    <div className={s.stat}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
      {sub && <span className={s.statSub}>{sub}</span>}
    </div>
  )
}