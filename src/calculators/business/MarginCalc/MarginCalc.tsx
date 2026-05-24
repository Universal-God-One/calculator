import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import {
  calcFromCostAndRevenue, calcFromCostAndMargin, calcFromCostAndMarkup,
  calcFromRevenueAndMargin, marginToMarkup, markupToMargin, MarginResult
} from './marginEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import s from './MarginCalc.module.css'

const FAQS = [
  { question: 'What is the difference between margin and markup?', answer: 'Margin (gross profit margin) is profit divided by revenue: (Revenue − Cost) / Revenue. Markup is profit divided by cost: (Revenue − Cost) / Cost. A 50% markup gives a 33.3% margin. They sound similar but are calculated differently — using the wrong one is a common pricing mistake.' },
  { question: 'How do you calculate gross profit margin?', answer: 'Gross Profit Margin = (Revenue − Cost) / Revenue × 100%. For example, if you sell a product for $100 and it costs $60 to produce, your margin is ($100 − $60) / $100 = 40%. This means 40 cents of every dollar of revenue is profit.' },
  { question: 'How do you calculate markup?', answer: 'Markup = (Revenue − Cost) / Cost × 100%. Using the same example: ($100 − $60) / $60 = 66.7% markup. A 66.7% markup on a $60 cost gives a $100 selling price. Markup is always higher than margin for the same product.' },
  { question: 'What is a good profit margin?', answer: 'It depends heavily on the industry. Grocery stores may operate at 1–3% net margin. Software companies often see 20–40%+ margins. Retail typically targets 50% gross margin. A healthy gross margin for most businesses is 30–50%, but net margin after all expenses is usually much lower.' },
]

type CalcMode = 'cost_revenue' | 'cost_margin' | 'cost_markup' | 'revenue_margin'

const MODES = [
  { id: 'cost_revenue' as CalcMode, label: 'Cost + Revenue', desc: 'Find margin & markup' },
  { id: 'cost_margin' as CalcMode, label: 'Cost + Margin %', desc: 'Find revenue & markup' },
  { id: 'cost_markup' as CalcMode, label: 'Cost + Markup %', desc: 'Find revenue & margin' },
  { id: 'revenue_margin' as CalcMode, label: 'Revenue + Margin %', desc: 'Find cost & markup' },
]

function r(n: number, d = 2) { return +n.toFixed(d) }
function pct(n: number) { return r(n, 2) + '%' }

export default function MarginCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [mode, setMode] = useState<CalcMode>('cost_revenue')
  const [cost, setCost] = useState('60')
  const [revenue, setRevenue] = useState('100')
  const [margin, setMargin] = useState('40')
  const [markup, setMarkup] = useState('66.67')

  // Conversion tab
  const [convMargin, setConvMargin] = useState('40')
  const [convMarkup, setConvMarkup] = useState('66.67')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo((): MarginResult | null => {
    const c = parseFloat(cost) || 0
    const rv = parseFloat(revenue) || 0
    const m = parseFloat(margin) || 0
    const mk = parseFloat(markup) || 0
    try {
      switch (mode) {
        case 'cost_revenue': return c > 0 && rv > 0 ? calcFromCostAndRevenue(c, rv) : null
        case 'cost_margin': return c > 0 && m > 0 ? calcFromCostAndMargin(c, m) : null
        case 'cost_markup': return c > 0 && mk > 0 ? calcFromCostAndMarkup(c, mk) : null
        case 'revenue_margin': return rv > 0 && m > 0 ? calcFromRevenueAndMargin(rv, m) : null
      }
    } catch { return null }
  }, [mode, cost, revenue, margin, markup])

  const convMarginResult = useMemo(() => {
    const m = parseFloat(convMargin)
    if (isNaN(m) || m <= 0 || m >= 100) return null
    return r(marginToMarkup(m), 4)
  }, [convMargin])

  const convMarkupResult = useMemo(() => {
    const mk = parseFloat(convMarkup)
    if (isNaN(mk) || mk <= 0) return null
    return r(markupToMargin(mk), 4)
  }, [convMarkup])

  // Reference table rows
  const refRows = [10, 20, 25, 30, 33.33, 40, 50, 60, 66.67, 75]

  return (
    <>
      <SEOHead
        title="Margin Calculator – Profit Margin, Markup & Gross Profit"
        description="Free margin and markup calculator. Calculate gross profit margin, markup percentage, and selling price. Convert between margin and markup instantly."
        canonical="/business/margin-markup-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Pricing</p>
            <h1 className={s.h1}>Margin & Markup Calculator</h1>
            <p className={s.sub}>Calculate gross profit margin, markup percentage, and selling price from any two known values.</p>
          </div>

          <AdBanner slot="38000000001" />

          {/* Mode selector */}
          <div className={s.modeGrid}>
            {MODES.map(m => (
              <button key={m.id}
                className={`${s.modeBtn} ${mode === m.id ? s.modeActive : ''}`}
                onClick={() => setMode(m.id)}>
                <span className={s.modeName}>{m.label}</span>
                <span className={s.modeDesc}>{m.desc}</span>
              </button>
            ))}
          </div>

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Known Values</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              {(mode === 'cost_revenue' || mode === 'cost_margin' || mode === 'cost_markup') && (
                <div className={s.field}>
                  <label className={s.label}>Cost ({sym})</label>
                  <input className={s.input} type="number" value={cost} onChange={e => setCost(e.target.value)} min="0" step="0.01" placeholder="e.g. 60" />
                </div>
              )}

              {(mode === 'cost_revenue' || mode === 'revenue_margin') && (
                <div className={s.field}>
                  <label className={s.label}>Revenue / Selling Price ({sym})</label>
                  <input className={s.input} type="number" value={revenue} onChange={e => setRevenue(e.target.value)} min="0" step="0.01" placeholder="e.g. 100" />
                </div>
              )}

              {(mode === 'cost_margin' || mode === 'revenue_margin') && (
                <div className={s.field}>
                  <label className={s.label}>Gross Margin (%)</label>
                  <input className={s.input} type="number" value={margin} onChange={e => setMargin(e.target.value)} min="0" max="99.99" step="0.01" placeholder="e.g. 40" />
                </div>
              )}

              {mode === 'cost_markup' && (
                <div className={s.field}>
                  <label className={s.label}>Markup (%)</label>
                  <input className={s.input} type="number" value={markup} onChange={e => setMarkup(e.target.value)} min="0" step="0.01" placeholder="e.g. 66.67" />
                </div>
              )}
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Results</h2>

                <div className={s.bigRow}>
                  <BigStat label="Gross Margin" value={pct(result.margin)} color="green" />
                  <BigStat label="Markup" value={pct(result.markup)} color="blue" />
                </div>

                <div className={s.statGrid}>
                  <StatRow label="Cost" value={fmtMoney(result.cost, currency)} />
                  <StatRow label="Revenue" value={fmtMoney(result.revenue, currency)} />
                  <StatRow label="Gross Profit" value={fmtMoney(result.profit, currency)} green={result.profit > 0} />
                  <StatRow label="Margin" value={pct(result.margin)} />
                  <StatRow label="Markup" value={pct(result.markup)} />
                  <StatRow label="Profit / Revenue" value={`${sym}${r(result.profit)} of every ${sym}${r(result.revenue)}`} />
                </div>

                {/* Visual margin bar */}
                <div className={s.barSection}>
                  <div className={s.barLabel}>
                    <span>Cost</span>
                    <span>Profit</span>
                  </div>
                  <div className={s.bar}>
                    <div className={s.barCost} style={{ width: `${100 - result.margin}%` }} />
                    <div className={s.barProfit} style={{ width: `${result.margin}%` }} />
                  </div>
                  <div className={s.barPcts}>
                    <span>{pct(100 - result.margin)}</span>
                    <span>{pct(result.margin)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>💰</div>
                <p>Enter values to calculate margin and markup.</p>
              </div>
            )}
          </div>

          {/* Conversion tool */}
          <div className={`${s.convCard} animate-in`}>
            <h2 className={s.convTitle}>Margin ↔ Markup Converter</h2>
            <div className={s.convGrid}>
              <div className={s.convSide}>
                <label className={s.label}>Margin (%)</label>
                <input className={s.input} type="number" value={convMargin}
                  onChange={e => setConvMargin(e.target.value)} min="0" max="99.99" step="0.01" />
                {convMarginResult !== null && (
                  <div className={s.convResult}>= <strong>{convMarginResult}%</strong> markup</div>
                )}
              </div>
              <div className={s.convArrow}>⇄</div>
              <div className={s.convSide}>
                <label className={s.label}>Markup (%)</label>
                <input className={s.input} type="number" value={convMarkup}
                  onChange={e => setConvMarkup(e.target.value)} min="0" step="0.01" />
                {convMarkupResult !== null && (
                  <div className={s.convResult}>= <strong>{convMarkupResult}%</strong> margin</div>
                )}
              </div>
            </div>
          </div>

          {/* Reference table */}
          <div className={s.refCard}>
            <h2 className={s.convTitle}>Margin vs Markup Reference</h2>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr><th>Margin</th><th>Equivalent Markup</th><th>Interpretation</th></tr>
                </thead>
                <tbody>
                  {refRows.map(m => (
                    <tr key={m}>
                      <td className={s.mono}>{r(m, 2)}%</td>
                      <td className={s.mono}>{r(marginToMarkup(m), 2)}%</td>
                      <td className={s.interp}>
                        {m < 20 ? 'Thin margin (grocery, commodity)' :
                         m < 35 ? 'Average retail margin' :
                         m < 55 ? 'Healthy margin (software, services)' :
                         'High margin (luxury, SaaS)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AdRectangle slot="38000000002" />

          <article className={s.article}>
            <h2>Margin vs Markup — The Key Difference</h2>
            <p>Both measure profitability, but from different perspectives. <strong>Margin</strong> divides profit by revenue (what the customer pays). <strong>Markup</strong> divides profit by cost (what you paid). A 50% markup always results in a 33.3% margin — not 50%. Confusing them leads to systematic underpricing.</p>
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

          <AdBanner slot="38000000003" />
        </div>
      </div>
    </>
  )
}

function BigStat({ label, value, color }: { label: string; value: string; color: 'green' | 'blue' }) {
  return (
    <div className={s.bigStat}>
      <span className={s.bigLabel}>{label}</span>
      <span className={s.bigValue} style={{ color: color === 'green' ? 'var(--accent-green)' : 'var(--accent-glow)' }}>{value}</span>
    </div>
  )
}

function StatRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={s.statRow}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}

function AdRectangle({ slot }: { slot: string }) {
  return <div data-slot={slot} className={s.adRect} />
}