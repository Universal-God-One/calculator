import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcFlat, calcTiered, calcGraduated, calcDraw, DEFAULT_TIERS, Tier } from './commissionEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import s from './SalesCommissionCalc.module.css'

const FAQS = [
  { question: 'What is a tiered commission structure?', answer: 'In a tiered structure, different rates apply to different sales ranges. For example: 5% on the first $10,000, 8% on $10,001–$25,000, and 12% above $25,000. Only the sales within each tier are taxed at that tier\'s rate — similar to how income tax brackets work.' },
  { question: 'What is the difference between tiered and graduated commission?', answer: 'Tiered commission applies each rate only to sales within that tier. Graduated commission applies the highest achieved rate to ALL sales — once you hit a higher tier, your entire sales volume gets that rate. Graduated structures create stronger incentives to hit thresholds.' },
  { question: 'What is a draw against commission?', answer: 'A draw is a guaranteed advance paid to a salesperson against future commissions. If you earn $3,000 in commission but received a $2,000 draw, your net pay is $1,000. If commission is less than the draw, the difference may be forgiven (non-recoverable) or owed back (recoverable).' },
  { question: 'What is a good commission rate?', answer: 'Commission rates vary widely by industry: Real estate: 2.5–3%, SaaS sales: 5–10% of ACV, retail: 1–5%, insurance: 15–25% (first year), financial advisors: 0.5–1% AUM. Base salary + commission (OTE) is more common than pure commission in B2B sales.' },
]

type Mode = 'flat' | 'tiered' | 'graduated' | 'draw'

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'flat', label: 'Flat Rate', desc: 'Single % on all sales' },
  { id: 'tiered', label: 'Tiered', desc: 'Different % per range' },
  { id: 'graduated', label: 'Graduated', desc: 'One rate applied to all sales' },
  { id: 'draw', label: 'Draw vs Commission', desc: 'Commission minus advance' },
]

export default function SalesCommissionCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [mode, setMode] = useState<Mode>('flat')
  const [sales, setSales] = useState('50000')
  const [flatRate, setFlatRate] = useState('8')
  const [baseSalary, setBaseSalary] = useState('0')
  const [drawAmount, setDrawAmount] = useState('2000')
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS)

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'
  const salesNum = parseFloat(sales) || 0

  const result = useMemo(() => {
    if (salesNum <= 0) return null
    try {
      switch (mode) {
        case 'flat': return calcFlat(salesNum, parseFloat(flatRate) || 0, parseFloat(baseSalary) || 0)
        case 'tiered': return calcTiered(salesNum, tiers)
        case 'graduated': return calcGraduated(salesNum, tiers)
        case 'draw': return calcDraw(salesNum, parseFloat(flatRate) || 0, parseFloat(drawAmount) || 0)
      }
    } catch { return null }
  }, [mode, salesNum, flatRate, baseSalary, drawAmount, tiers])

  function updateTier(i: number, field: keyof Tier, value: string) {
    setTiers(prev => prev.map((t, idx) => idx === i
      ? { ...t, [field]: field === 'to' ? (value === '' ? null : parseFloat(value)) : parseFloat(value) || 0 }
      : t
    ))
  }

  function addTier() {
    const last = tiers[tiers.length - 1]
    const newFrom = last.to ?? (last.from + 10000)
    setTiers(prev => [...prev.slice(0, -1).map((t, i) => i === prev.length - 2 ? { ...t, to: newFrom } : t),
      { from: newFrom, to: null, rate: 15 }])
  }

  function removeTier(i: number) {
    if (tiers.length <= 1) return
    setTiers(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <>
      <SEOHead
        title="Sales Commission Calculator – Flat, Tiered & Draw"
        description="Free sales commission calculator. Calculate flat rate, tiered, graduated, and draw-against-commission earnings. Supports multiple commission structures."
        canonical="/business/sales-commission-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Sales</p>
            <h1 className={s.h1}>Sales Commission Calculator</h1>
            <p className={s.sub}>Calculate commissions for flat rate, tiered, graduated, and draw-against-commission structures.</p>
          </div>

          <AdBanner slot="41000000001" />

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
              <h2 className={s.cardTitle}>Commission Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Total Sales ({sym})</label>
                <input className={s.input} type="number" value={sales}
                  onChange={e => setSales(e.target.value)} min="0" step="1000" placeholder="e.g. 50000" />
              </div>

              {(mode === 'flat' || mode === 'draw') && (
                <div className={s.field}>
                  <label className={s.label}>Commission Rate (%)</label>
                  <input className={s.input} type="number" value={flatRate}
                    onChange={e => setFlatRate(e.target.value)} min="0" max="100" step="0.1" placeholder="e.g. 8" />
                </div>
              )}

              {mode === 'flat' && (
                <div className={s.field}>
                  <label className={s.label}>Base Salary ({sym})</label>
                  <input className={s.input} type="number" value={baseSalary}
                    onChange={e => setBaseSalary(e.target.value)} min="0" step="100" placeholder="0" />
                </div>
              )}

              {mode === 'draw' && (
                <div className={s.field}>
                  <label className={s.label}>Draw Amount ({sym})</label>
                  <input className={s.input} type="number" value={drawAmount}
                    onChange={e => setDrawAmount(e.target.value)} min="0" step="100" placeholder="e.g. 2000" />
                </div>
              )}

              {(mode === 'tiered' || mode === 'graduated') && (
                <div className={s.tiersSection}>
                  <div className={s.tiersHeader}>
                    <span className={s.tiersTitle}>Commission Tiers</span>
                    <button className={s.addTierBtn} onClick={addTier}>+ Add Tier</button>
                  </div>
                  <div className={s.tiersGrid}>
                    <span className={s.tierHeader}>From ({sym})</span>
                    <span className={s.tierHeader}>To ({sym})</span>
                    <span className={s.tierHeader}>Rate %</span>
                    <span />
                  </div>
                  {tiers.map((tier, i) => (
                    <div key={i} className={s.tierRow}>
                      <input className={s.tierInput} type="number" value={tier.from}
                        onChange={e => updateTier(i, 'from', e.target.value)} min="0" />
                      <input className={s.tierInput} type="number" value={tier.to ?? ''}
                        onChange={e => updateTier(i, 'to', e.target.value)} min="0" placeholder="∞" />
                      <input className={s.tierInput} type="number" value={tier.rate}
                        onChange={e => updateTier(i, 'rate', e.target.value)} min="0" max="100" step="0.1" />
                      <button className={s.removeTierBtn} onClick={() => removeTier(i)} disabled={tiers.length <= 1}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Commission Earned</h2>

                <div className={s.bigCommission}>
                  <span className={s.bigLabel}>
                    {mode === 'draw' ? 'Net Commission (after draw)' : mode === 'flat' && parseFloat(baseSalary) > 0 ? 'Total Earnings' : 'Commission Earned'}
                  </span>
                  <span className={s.bigValue}>{fmtMoney(result.netCommission, currency)}</span>
                </div>

                <div className={s.statGrid}>
                  <StatCard label="Total Sales" value={fmtMoney(result.totalSales, currency)} />
                  <StatCard label="Gross Commission" value={fmtMoney(result.grossCommission, currency)} green />
                  <StatCard label="Effective Rate" value={result.effectiveRate + '%'} />
                  {mode === 'flat' && parseFloat(baseSalary) > 0 && (
                    <StatCard label="Base Salary" value={fmtMoney(parseFloat(baseSalary), currency)} />
                  )}
                  {mode === 'draw' && (
                    <StatCard label="Draw Advance" value={fmtMoney(parseFloat(drawAmount), currency)} />
                  )}
                </div>

                <div className={s.breakdownSection}>
                  <h3 className={s.breakdownTitle}>Breakdown</h3>
                  {result.breakdown.map((row, i) => (
                    <div key={i} className={`${s.bRow} ${row.commission < 0 ? s.bRowNeg : ''}`}>
                      <span className={s.bLabel}>{row.label}</span>
                      {row.sales > 0 && <span className={s.bSales}>{fmtMoney(row.sales, currency)}</span>}
                      <span className={s.bCommission} style={row.commission < 0 ? { color: 'var(--accent-red)' } : {}}>
                        {row.commission < 0 ? '−' : ''}{fmtMoney(Math.abs(row.commission), currency)}
                      </span>
                    </div>
                  ))}
                  {mode === 'flat' && parseFloat(baseSalary) > 0 && (
                    <div className={s.bRow}>
                      <span className={s.bLabel}>Base Salary</span>
                      <span className={s.bCommission} style={{ color: 'var(--accent-green)' }}>
                        +{fmtMoney(parseFloat(baseSalary), currency)}
                      </span>
                    </div>
                  )}
                  <div className={`${s.bRow} ${s.bRowTotal}`}>
                    <span>Total Earnings</span>
                    <span>{fmtMoney(result.netCommission, currency)}</span>
                  </div>
                </div>

                {mode === 'graduated' && (
                  <div className={s.gradNote}>
                    💡 Graduated: hitting {fmtMoney(salesNum, currency)} applies <strong>{result.effectiveRate}%</strong> to your entire sales volume.
                  </div>
                )}
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>💼</div>
                <p>Enter your sales figures to calculate commission.</p>
              </div>
            )}
          </div>

          {/* What-if table */}
          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.tableTitle}>What-If: Commission at Different Sales Levels</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Sales Volume</th><th>Commission</th><th>Effective Rate</th><th>Total Earnings</th></tr>
                  </thead>
                  <tbody>
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(mult => {
                      const s2 = salesNum * mult
                      let r2
                      try {
                        switch (mode) {
                          case 'flat': r2 = calcFlat(s2, parseFloat(flatRate) || 0, parseFloat(baseSalary) || 0); break
                          case 'tiered': r2 = calcTiered(s2, tiers); break
                          case 'graduated': r2 = calcGraduated(s2, tiers); break
                          case 'draw': r2 = calcDraw(s2, parseFloat(flatRate) || 0, parseFloat(drawAmount) || 0); break
                        }
                      } catch { r2 = null }
                      return r2 ? (
                        <tr key={mult} className={mult === 1 ? s.currentRow : ''}>
                          <td className={s.mono}>{fmtMoney(s2, currency)}{mult === 1 ? ' ←' : ''}</td>
                          <td className={`${s.mono} ${s.green}`}>{fmtMoney(r2.grossCommission, currency)}</td>
                          <td className={s.mono}>{r2.effectiveRate}%</td>
                          <td className={`${s.mono} ${s.bold}`}>{fmtMoney(r2.netCommission, currency)}</td>
                        </tr>
                      ) : null
                    })}
                  </tbody>
                </table>
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

          <AdBanner slot="41000000002" />
        </div>
      </div>
    </>
  )
}

function StatCard({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={s.statCard}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}