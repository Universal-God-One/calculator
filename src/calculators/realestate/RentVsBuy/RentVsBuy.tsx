import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcRentVsBuy } from './rentVsBuyEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
import s from './RentVsBuy.module.css'

const FAQS = [
  { question: 'Is it always better to buy than rent?', answer: 'Not always. Buying makes more financial sense when you plan to stay long-term (5+ years), home prices are reasonable relative to rents, and mortgage rates are manageable. Renting is better for flexibility, in expensive markets, or when you can invest the difference and earn strong returns.' },
  { question: 'What is the price-to-rent ratio?', answer: 'The price-to-rent ratio is the home price divided by annual rent. A ratio below 15 generally favors buying; above 20 may favor renting. In expensive cities like San Francisco or NYC, ratios can exceed 40, making renting financially smarter for many people.' },
  { question: 'What costs do buyers often overlook?', answer: 'First-time buyers often underestimate property taxes (1–2% of home value annually), maintenance (1–2% annually), home insurance, HOA fees, closing costs (2–5% of purchase price), and the opportunity cost of the down payment if invested elsewhere.' },
  { question: 'How long do I need to stay to make buying worth it?', answer: 'The break-even point — when buying becomes cheaper than renting — is typically 3–7 years, depending on your market, mortgage rate, and home appreciation. The calculator above shows your specific break-even year based on your inputs.' },
]

export default function RentVsBuyPage() {
  const [currency, setCurrency] = useState('USD')
  // Buying
  const [homePrice, setHomePrice] = useState('400000')
  const [downPct, setDownPct] = useState('20')
  const [mortgageRate, setMortgageRate] = useState('7')
  const [mortgageTerm, setMortgageTerm] = useState('30')
  const [propertyTax, setPropertyTax] = useState('1.2')
  const [homeInsurance, setHomeInsurance] = useState('1500')
  const [maintenance, setMaintenance] = useState('1')
  const [hoa, setHoa] = useState('0')
  const [appreciation, setAppreciation] = useState('3')
  // Renting
  const [rent, setRent] = useState('2000')
  const [rentIncrease, setRentIncrease] = useState('3')
  const [rentersIns, setRentersIns] = useState('200')
  // Common
  const [years, setYears] = useState('10')
  const [investReturn, setInvestReturn] = useState('7')
  const [taxRate, setTaxRate] = useState('22')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const hp = parseFloat(homePrice) || 0
    const dp = parseFloat(downPct) || 0
    const mr = parseFloat(mortgageRate) || 0
    const mt = parseInt(mortgageTerm) || 30
    const pt = parseFloat(propertyTax) || 0
    const hi = parseFloat(homeInsurance) || 0
    const mn = parseFloat(maintenance) || 0
    const h = parseFloat(hoa) || 0
    const ap = parseFloat(appreciation) || 0
    const r = parseFloat(rent) || 0
    const ri = parseFloat(rentIncrease) || 0
    const ri2 = parseFloat(rentersIns) || 0
    const y = parseInt(years) || 0
    const ir = parseFloat(investReturn) || 0
    const tr = parseFloat(taxRate) || 0
    if (hp <= 0 || r <= 0 || y <= 0) return null
    return calcRentVsBuy(hp, dp, mr, mt, pt, hi, mn, h, ap, r, ri, ri2, y, ir, tr)
  }, [homePrice, downPct, mortgageRate, mortgageTerm, propertyTax, homeInsurance, maintenance, hoa, appreciation, rent, rentIncrease, rentersIns, years, investReturn, taxRate])

  const hp = parseFloat(homePrice) || 0
  const y = parseInt(years) || 0

  const chartData = result?.schedule.map(row => ({
    year: `Yr ${row.year}`,
    'Home Equity': row.equity,
    'Renter Portfolio': row.rentNetWorth,
  })) ?? []

  return (
    <>
      <SEOHead
        title="Rent vs Buy Calculator – Is It Better to Rent or Buy?"
        description="Free rent vs buy calculator. Compare the true cost of renting vs buying a home over time. See break-even point, net worth comparison, and year-by-year analysis."
        canonical="/real-estate/rent-vs-buy-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › Analysis</p>
            <h1 className={s.h1}>Rent vs Buy Calculator</h1>
            <p className={s.sub}>Compare the true financial cost of renting vs buying over time and find your break-even point.</p>
          </div>

          <AdBanner slot="17000000001" />

          <div className={s.inputsGrid}>
            {/* Buying */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>🏠 Buying</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Home Price ({sym})</label>
                <input className={s.input} type="number" value={homePrice} onChange={e => setHomePrice(e.target.value)} min="0" step="10000" />
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Down Payment (%)</label>
                  <input className={s.input} type="number" value={downPct} onChange={e => setDownPct(e.target.value)} min="0" max="100" step="1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Mortgage Rate (%)</label>
                  <input className={s.input} type="number" value={mortgageRate} onChange={e => setMortgageRate(e.target.value)} min="0" max="20" step="0.1" />
                </div>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Property Tax (%/yr)</label>
                  <input className={s.input} type="number" value={propertyTax} onChange={e => setPropertyTax(e.target.value)} min="0" max="5" step="0.1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Maintenance (%/yr)</label>
                  <input className={s.input} type="number" value={maintenance} onChange={e => setMaintenance(e.target.value)} min="0" max="5" step="0.1" />
                </div>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Home Insurance ({sym}/yr)</label>
                  <input className={s.input} type="number" value={homeInsurance} onChange={e => setHomeInsurance(e.target.value)} min="0" step="100" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>HOA ({sym}/mo)</label>
                  <input className={s.input} type="number" value={hoa} onChange={e => setHoa(e.target.value)} min="0" step="50" />
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Home Appreciation (%/yr)</label>
                <input className={s.input} type="number" value={appreciation} onChange={e => setAppreciation(e.target.value)} min="0" max="20" step="0.5" />
              </div>
            </div>

            {/* Renting */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>🏢 Renting</h2>

              <div className={s.field}>
                <label className={s.label}>Monthly Rent ({sym})</label>
                <input className={s.input} type="number" value={rent} onChange={e => setRent(e.target.value)} min="0" step="100" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Rent Increase (%)</label>
                <input className={s.input} type="number" value={rentIncrease} onChange={e => setRentIncrease(e.target.value)} min="0" max="20" step="0.5" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Renter's Insurance ({sym}/yr)</label>
                <input className={s.input} type="number" value={rentersIns} onChange={e => setRentersIns(e.target.value)} min="0" step="50" />
              </div>

              <div className={s.divider} />
              <h3 className={s.sectionLabel}>Comparison Settings</h3>

              <div className={s.field}>
                <label className={s.label}>Years to Compare</label>
                <input className={s.input} type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="40" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Investment Return (% if renting)</label>
                <input className={s.input} type="number" value={investReturn} onChange={e => setInvestReturn(e.target.value)} min="0" max="20" step="0.5" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Marginal Tax Rate (%)</label>
                <input className={s.input} type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} min="0" max="50" step="1" />
              </div>
            </div>
          </div>

          {/* Verdict */}
          {result && (
            <div className={`${s.verdictCard} animate-in ${result.buyingWins ? s.buyWins : s.rentWins}`}>
              <div className={s.verdictIcon}>{result.buyingWins ? '🏠' : '🏢'}</div>
              <div className={s.verdictText}>
                <h2 className={s.verdictTitle}>
                  {result.buyingWins ? 'Buying Wins' : 'Renting Wins'} After {y} Years
                </h2>
                <p className={s.verdictSub}>
                  {result.buyingWins
                    ? `Home equity of ${fmtMoney(result.netWorthBuying, currency)} vs renter portfolio of ${fmtMoney(result.netWorthRenting, currency)}`
                    : `Renter portfolio of ${fmtMoney(result.netWorthRenting, currency)} vs home equity of ${fmtMoney(result.netWorthBuying, currency)}`
                  }
                </p>
              </div>
              {result.breakEvenYear && (
                <div className={s.breakEven}>
                  Break-even: <strong>Year {result.breakEvenYear}</strong>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          {result && (
            <div className={`${s.statsRow} animate-in`}>
              <StatCard label="Home Equity After" sub={`${y} years`} value={fmtMoney(result.netWorthBuying, currency)} color="var(--accent-green)" />
              <StatCard label="Renter Portfolio After" sub={`${y} years`} value={fmtMoney(result.netWorthRenting, currency)} color="var(--accent)" />
              <StatCard label="Total Buying Cost" sub="all-in" value={fmtMoney(result.buyingCost, currency)} color="var(--text-secondary)" />
              <StatCard label="Total Renting Cost" sub="all-in" value={fmtMoney(result.rentingCost, currency)} color="var(--text-secondary)" />
            </div>
          )}

          {/* Chart */}
          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Home Equity vs Renter Portfolio Over {y} Years</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={70}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  {result.breakEvenYear && (
                    <ReferenceLine x={`Yr ${result.breakEvenYear}`} stroke="var(--accent-amber)" strokeDasharray="4 4"
                      label={{ value: 'Break-even', fill: 'var(--accent-amber)', fontSize: 10 }} />
                  )}
                  <Line type="monotone" dataKey="Home Equity" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Renter Portfolio" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Year by year table */}
          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Year-by-Year Comparison</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Home Value</th>
                      <th>Home Equity</th>
                      <th>Renter Portfolio</th>
                      <th>Buy Cost</th>
                      <th>Rent Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.year}>
                        <td>{row.year}</td>
                        <td>{fmtMoney(row.homeValue, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.equity, currency)}</td>
                        <td className={s.blue}>{fmtMoney(row.rentNetWorth, currency)}</td>
                        <td>{fmtMoney(row.buyTotalCost, currency)}</td>
                        <td>{fmtMoney(row.rentTotalCost, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="17000000002" />

          <article className={s.article}>
            <h2>Rent vs Buy — The Full Picture</h2>
            <p>The rent vs buy decision is one of the most important financial choices you'll make. Buying builds equity and protects against rent increases. Renting offers flexibility and keeps capital available for investing. The right answer depends on your timeline, local market, and financial situation.</p>

            {result && hp > 0 && (
              <div className={s.example}>
                <h3>📊 Your {y}-Year Analysis</h3>
                <ul>
                  <li>After {y} years, buying gives you <strong>{fmtMoney(result.netWorthBuying, currency)}</strong> in home equity</li>
                  <li>Renting and investing gives <strong>{fmtMoney(result.netWorthRenting, currency)}</strong> in portfolio value</li>
                  <li>Total buying costs: <strong>{fmtMoney(result.buyingCost, currency)}</strong></li>
                  <li>Total renting costs: <strong>{fmtMoney(result.rentingCost, currency)}</strong></li>
                  {result.breakEvenYear && <li>Buying breaks even at: <strong>Year {result.breakEvenYear}</strong></li>}
                </ul>
              </div>
            )}

            <h2>Hidden Costs of Buying</h2>
            <p>Buyers often underestimate ongoing costs. Property taxes typically run 1–2% of home value annually. Maintenance averages 1–2% per year. Home insurance, HOA fees, and closing costs add up quickly. These costs don't build equity — they're pure expenses, just like rent.</p>

            <h2>The Renter's Advantage</h2>
            <p>Renters who invest the down payment and monthly savings can build significant wealth. A $80,000 down payment invested at 7% annually becomes over $300,000 in 20 years. The key is actually investing the difference — renters who spend it lose the financial advantage.</p>

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

          <AdBanner slot="17000000003" />
        </div>
      </div>
    </>
  )
}

function StatCard({ label, sub, value, color }: { label: string; sub: string; value: string; color: string }) {
  return (
    <div className={s.statCard}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statSub}>{sub}</span>
      <span className={s.statValue} style={{ color }}>{value}</span>
    </div>
  )
}