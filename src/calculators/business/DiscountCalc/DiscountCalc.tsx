import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcFromPctOff, calcFromFinalPrice, calcFromAmount, calcStacked } from './discountEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import s from './DiscountCalc.module.css'

const FAQS = [
  { question: 'How do you calculate a discount?', answer: 'Discount Amount = Original Price × (Discount% / 100). Final Price = Original Price − Discount Amount. For example, 30% off a $80 item: $80 × 0.30 = $24 discount, so you pay $80 − $24 = $56.' },
  { question: 'How do stacked discounts work?', answer: 'Stacked discounts apply sequentially, not additively. A 20% discount followed by a 10% discount is NOT 30% off. First, 20% off $100 = $80. Then 10% off $80 = $72. The effective discount is 28%, not 30%. Always apply each discount to the running price.' },
  { question: 'What is the effective discount rate?', answer: 'When multiple discounts are applied, the effective rate is the total savings as a percentage of the original price. Two sequential discounts of 20% and 10% give an effective rate of 28%, not 30%.' },
  { question: 'How do you find the original price from a discounted price?', answer: 'Original Price = Final Price / (1 − Discount%). If something costs $70 after a 30% discount, the original was $70 / (1 − 0.30) = $70 / 0.70 = $100.' },
]

type Mode = 'pct_off' | 'find_pct' | 'amount_off' | 'stacked'

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'pct_off', label: '% Off', desc: 'Price + discount %' },
  { id: 'find_pct', label: 'Find % Off', desc: 'Original + final price' },
  { id: 'amount_off', label: 'Amount Off', desc: 'Price + discount $' },
  { id: 'stacked', label: 'Stacked', desc: 'Multiple discounts' },
]

const QUICK_PCTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75]

export default function DiscountCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [mode, setMode] = useState<Mode>('pct_off')
  const [original, setOriginal] = useState('100')
  const [pctOff, setPctOff] = useState('20')
  const [finalPrice, setFinalPrice] = useState('80')
  const [amountOff, setAmountOff] = useState('20')
  const [taxPct, setTaxPct] = useState('0')
  const [stackedDiscounts, setStackedDiscounts] = useState('20, 10')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'
  const origNum = parseFloat(original) || 0
  const taxNum = parseFloat(taxPct) || 0

  const result = useMemo(() => {
    if (origNum <= 0) return null
    try {
      switch (mode) {
        case 'pct_off': return { type: 'single', data: calcFromPctOff(origNum, parseFloat(pctOff) || 0, taxNum) }
        case 'find_pct': return { type: 'single', data: calcFromFinalPrice(origNum, parseFloat(finalPrice) || 0, taxNum) }
        case 'amount_off': return { type: 'single', data: calcFromAmount(origNum, parseFloat(amountOff) || 0, taxNum) }
        case 'stacked': {
          const discounts = stackedDiscounts.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n > 0)
          return { type: 'stacked', data: calcStacked(origNum, discounts, taxNum) }
        }
      }
    } catch { return null }
  }, [mode, origNum, pctOff, finalPrice, amountOff, taxNum, stackedDiscounts])

  // Reference table for common discounts
  const refRows = QUICK_PCTS.map(pct => {
    const r = calcFromPctOff(origNum, pct)
    return { pct, save: r.discountAmount, final: r.finalPrice }
  })

  return (
    <>
      <SEOHead
        title="Discount Calculator – Sale Price, % Off & Stacked Discounts"
        description="Free discount calculator. Find sale price, discount percentage, savings amount, and stacked discounts with tax. Fast and accurate."
        canonical="/business/discount-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Pricing</p>
            <h1 className={s.h1}>Discount Calculator</h1>
            <p className={s.sub}>Calculate sale prices, savings, discount percentages, and stacked discounts.</p>
          </div>

          <AdBanner slot="42000000001" />

          <div className={s.modeGrid}>
            {MODES.map(m => (
              <button key={m.id} className={`${s.modeBtn} ${mode === m.id ? s.modeActive : ''}`}
                onClick={() => setMode(m.id)}>
                <span className={s.modeName}>{m.label}</span>
                <span className={s.modeDesc}>{m.desc}</span>
              </button>
            ))}
          </div>

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Discount Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Original Price ({sym})</label>
                <input className={s.input} type="number" value={original}
                  onChange={e => setOriginal(e.target.value)} min="0" step="0.01" placeholder="e.g. 100" />
              </div>

              {mode === 'pct_off' && (
                <div className={s.field}>
                  <label className={s.label}>Discount (%)</label>
                  <div className={s.quickPcts}>
                    {[10, 15, 20, 25, 30, 50].map(p => (
                      <button key={p}
                        className={`${s.quickBtn} ${pctOff === String(p) ? s.quickActive : ''}`}
                        onClick={() => setPctOff(String(p))}>
                        {p}%
                      </button>
                    ))}
                  </div>
                  <input className={s.input} type="number" value={pctOff}
                    onChange={e => setPctOff(e.target.value)} min="0" max="100" step="0.1" placeholder="e.g. 20" />
                </div>
              )}

              {mode === 'find_pct' && (
                <div className={s.field}>
                  <label className={s.label}>Final / Sale Price ({sym})</label>
                  <input className={s.input} type="number" value={finalPrice}
                    onChange={e => setFinalPrice(e.target.value)} min="0" step="0.01" placeholder="e.g. 80" />
                </div>
              )}

              {mode === 'amount_off' && (
                <div className={s.field}>
                  <label className={s.label}>Discount Amount ({sym})</label>
                  <input className={s.input} type="number" value={amountOff}
                    onChange={e => setAmountOff(e.target.value)} min="0" step="0.01" placeholder="e.g. 20" />
                </div>
              )}

              {mode === 'stacked' && (
                <div className={s.field}>
                  <label className={s.label}>Stacked Discounts (% separated by commas)</label>
                  <input className={s.input} type="text" value={stackedDiscounts}
                    onChange={e => setStackedDiscounts(e.target.value)} placeholder="e.g. 20, 10" />
                  <span className={s.hint}>Each discount applies to the price after previous discounts</span>
                </div>
              )}

              <div className={s.field}>
                <label className={s.label}>Sales Tax (%)</label>
                <input className={s.input} type="number" value={taxPct}
                  onChange={e => setTaxPct(e.target.value)} min="0" max="50" step="0.1" placeholder="0" />
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                {result.type === 'single' && (() => {
                  const d = result.data as ReturnType<typeof calcFromPctOff>
                  return (
                    <>
                      <h2 className={s.cardTitle}>Discount Results</h2>
                      <div className={s.priceDisplay}>
                        <div className={s.originalPriceTag}>
                          <span className={s.originalLabel}>Original</span>
                          <span className={s.originalValue}>{fmtMoney(d.originalPrice, currency)}</span>
                        </div>
                        <div className={s.discountBadge}>−{d.discountPct}%</div>
                        <div className={s.finalPriceTag}>
                          <span className={s.finalLabel}>You Pay</span>
                          <span className={s.finalValue}>{fmtMoney(d.finalPrice, currency)}</span>
                        </div>
                      </div>

                      <div className={s.savingsBox}>
                        <span className={s.savingsLabel}>You Save</span>
                        <span className={s.savingsAmount}>{fmtMoney(d.savings, currency)}</span>
                      </div>

                      <div className={s.statGrid}>
                        <StatRow label="Original Price" value={fmtMoney(d.originalPrice, currency)} />
                        <StatRow label="Discount" value={`${d.discountPct}% (${fmtMoney(d.discountAmount, currency)})`} />
                        <StatRow label="Sale Price" value={fmtMoney(d.finalPrice, currency)} green />
                        {taxNum > 0 && <>
                          <StatRow label="Tax ({taxPct}%)" value={fmtMoney(d.taxAmount, currency)} />
                          <StatRow label="Total with Tax" value={fmtMoney(d.totalWithTax, currency)} />
                        </>}
                      </div>

                      <div className={s.savingsBar}>
                        <div className={s.barFinal} style={{ width: `${100 - d.discountPct}%` }} />
                        <div className={s.barSaved} style={{ width: `${Math.min(d.discountPct, 100)}%` }} />
                      </div>
                      <div className={s.barLabels}>
                        <span>Pay: {(100 - d.discountPct).toFixed(1)}%</span>
                        <span>Save: {d.discountPct}%</span>
                      </div>
                    </>
                  )
                })()}

                {result.type === 'stacked' && (() => {
                  const d = result.data as ReturnType<typeof calcStacked>
                  return (
                    <>
                      <h2 className={s.cardTitle}>Stacked Discount Results</h2>
                      <div className={s.stackedSteps}>
                        <div className={s.stackStep}>
                          <span className={s.stackLabel}>Start</span>
                          <span className={s.stackValue}>{fmtMoney(origNum, currency)}</span>
                        </div>
                        {d.results.map((r, i) => (
                          <div key={i} className={s.stackStep}>
                            <span className={s.stackLabel}>After {r.discountPct}% off</span>
                            <span className={s.stackValue}>{fmtMoney(r.finalPrice, currency)}</span>
                            <span className={s.stackSaved}>−{fmtMoney(r.discountAmount, currency)}</span>
                          </div>
                        ))}
                      </div>

                      <div className={s.savingsBox}>
                        <span className={s.savingsLabel}>Total Saved</span>
                        <span className={s.savingsAmount}>{fmtMoney(d.totalSavings, currency)}</span>
                      </div>

                      <div className={s.statGrid}>
                        <StatRow label="Original Price" value={fmtMoney(origNum, currency)} />
                        <StatRow label="Final Price" value={fmtMoney(d.finalPrice, currency)} green />
                        <StatRow label="Effective Discount" value={`${d.effectivePct}%`} />
                        <StatRow label="Total Savings" value={fmtMoney(d.totalSavings, currency)} />
                        {taxNum > 0 && <StatRow label="Total with Tax" value={fmtMoney(d.totalWithTax, currency)} />}
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🏷️</div>
                <p>Enter original price to calculate discount.</p>
              </div>
            )}
          </div>

          {/* Reference table */}
          {origNum > 0 && (
            <div className={`${s.refCard} animate-in`}>
              <h2 className={s.refTitle}>Discount Reference for {fmtMoney(origNum, currency)}</h2>
              <div className={s.refGrid}>
                {refRows.map(row => (
                  <div key={row.pct} className={`${s.refRow} ${pctOff === String(row.pct) && mode === 'pct_off' ? s.refRowActive : ''}`}
                    onClick={() => { setMode('pct_off'); setPctOff(String(row.pct)) }}>
                    <span className={s.refPct}>{row.pct}% off</span>
                    <span className={s.refSave}>Save {fmtMoney(row.save, currency)}</span>
                    <span className={s.refFinal}>Pay {fmtMoney(row.final, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <article className={s.article}>
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

          <AdBanner slot="42000000002" />
        </div>
      </div>
    </>
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