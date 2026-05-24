import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcBond, calcBondPrice, calcYTM } from './bondEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import s from './BondCalc.module.css'

const FAQS = [
  { question: 'What is a bond?', answer: 'A bond is a fixed-income debt instrument where an investor loans money to a borrower (government or corporation) for a set period. In return, the borrower pays regular interest (coupon payments) and returns the principal (face value) at maturity.' },
  { question: 'What is Yield to Maturity (YTM)?', answer: 'YTM is the total return expected if the bond is held until maturity, assuming all coupon payments are reinvested at the same rate. It accounts for the current price, face value, coupon rate, and time to maturity — making it the most complete measure of a bond\'s return.' },
  { question: 'Why does bond price move opposite to interest rates?', answer: 'When interest rates rise, new bonds offer higher yields, making existing lower-yielding bonds less attractive, so their prices fall. When rates fall, existing bonds with higher coupons become more valuable, so their prices rise. This inverse relationship is a fundamental bond principle.' },
  { question: 'What is a bond\'s duration?', answer: 'Duration (Macaulay duration) measures a bond\'s sensitivity to interest rate changes — it is the weighted average time to receive all cash flows. A duration of 5 years means the bond\'s price will change approximately 5% for every 1% change in interest rates.' },
  { question: 'What is current yield vs YTM?', answer: 'Current yield is simply the annual coupon payment divided by the current price. YTM is more comprehensive — it includes the gain or loss from buying at a premium or discount, plus the time value of money. YTM is the better metric for comparing bonds.' },
]

type Mode = 'findPrice' | 'findYTM'

export default function BondCalcPage() {
  const [mode, setMode] = useState<Mode>('findPrice')
  const [currency, setCurrency] = useState('USD')
  const [faceValue, setFaceValue] = useState('1000')
  const [couponRate, setCouponRate] = useState('5')
  const [ytm, setYtm] = useState('6')
  const [price, setPrice] = useState('950')
  const [years, setYears] = useState('10')
  const [frequency, setFrequency] = useState('2')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const fv = parseFloat(faceValue) || 0
    const cr = parseFloat(couponRate) || 0
    const y = parseInt(years) || 0
    const fr = parseInt(frequency) || 2
    if (fv <= 0 || cr <= 0 || y <= 0) return null

    if (mode === 'findPrice') {
      const ytmVal = parseFloat(ytm) || 0
      if (ytmVal <= 0) return null
      return calcBond(fv, cr, ytmVal, y, fr)
    } else {
      const p = parseFloat(price) || 0
      if (p <= 0) return null
      const calculatedYTM = calcYTM(fv, cr, p, y, fr)
      return calcBond(fv, cr, calculatedYTM, y, fr)
    }
  }, [mode, faceValue, couponRate, ytm, price, years, frequency])

  const fv = parseFloat(faceValue) || 0
  const cr = parseFloat(couponRate) || 0
  const fr = parseInt(frequency) || 2

  const chartData = result?.schedule
    .filter((_, i) => fr === 1 || i % fr === fr - 1)
    .map((row, i) => ({
      year: `Yr ${i + 1}`,
      Coupon: row.coupon * fr,
      'Principal': row.principal,
    })) ?? []

  const isPremium = result && result.price > fv
  const isDiscount = result && result.price < fv

  return (
    <>
      <SEOHead
        title="Bond Calculator – Price, YTM & Duration"
        description="Free bond calculator. Calculate bond price from YTM, or find YTM from market price. Includes Macaulay duration, current yield, and full cash flow schedule."
        canonical="/finance/bond-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Finance › Fixed Income</p>
            <h1 className={s.h1}>Bond Calculator</h1>
            <p className={s.sub}>Calculate bond price, yield to maturity, duration, and full cash flow schedule.</p>
          </div>

          <AdBanner slot="15000000001" />

          <div className={s.modeRow}>
            <button className={`${s.modeBtn} ${mode === 'findPrice' ? s.modeActive : ''}`}
              onClick={() => setMode('findPrice')}>
              Find Bond Price (from YTM)
            </button>
            <button className={`${s.modeBtn} ${mode === 'findYTM' ? s.modeActive : ''}`}
              onClick={() => setMode('findYTM')}>
              Find YTM (from Price)
            </button>
          </div>

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Bond Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Face Value ({sym})</label>
                <input className={s.input} type="number" value={faceValue}
                  onChange={e => setFaceValue(e.target.value)} min="0" step="100" placeholder="e.g. 1000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Coupon Rate (%)</label>
                <input className={s.input} type="number" value={couponRate}
                  onChange={e => setCouponRate(e.target.value)} min="0" max="30" step="0.1" placeholder="e.g. 5" />
              </div>

              {mode === 'findPrice' ? (
                <div className={s.field}>
                  <label className={s.label}>Required Yield / YTM (%)</label>
                  <input className={s.input} type="number" value={ytm}
                    onChange={e => setYtm(e.target.value)} min="0" max="50" step="0.1" placeholder="e.g. 6" />
                </div>
              ) : (
                <div className={s.field}>
                  <label className={s.label}>Market Price ({sym})</label>
                  <input className={s.input} type="number" value={price}
                    onChange={e => setPrice(e.target.value)} min="0" step="10" placeholder="e.g. 950" />
                </div>
              )}

              <div className={s.field}>
                <label className={s.label}>Years to Maturity</label>
                <input className={s.input} type="number" value={years}
                  onChange={e => setYears(e.target.value)} min="1" max="50" placeholder="e.g. 10" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Coupon Frequency</label>
                <select className={s.select} value={frequency} onChange={e => setFrequency(e.target.value)}>
                  <option value="1">Annual</option>
                  <option value="2">Semi-Annual</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                </select>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Bond Analysis</h2>

                <div className={s.priceBanner}>
                  <div>
                    <span className={s.priceLabel}>Bond Price</span>
                    <span className={s.priceValue}>{fmtMoney(result.price, currency)}</span>
                    <span className={`${s.priceBadge} ${isPremium ? s.premium : isDiscount ? s.discount : s.par}`}>
                      {isPremium ? `Premium (+${fmtMoney(result.price - fv, currency)})` :
                       isDiscount ? `Discount (-${fmtMoney(fv - result.price, currency)})` : 'At Par'}
                    </span>
                  </div>
                  <div>
                    <span className={s.priceLabel}>Yield to Maturity</span>
                    <span className={s.priceValue} style={{ color: 'var(--accent-green)' }}>{result.ytm.toFixed(3)}%</span>
                  </div>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Face Value" value={fmtMoney(fv, currency)} />
                  <Stat label="Coupon Rate" value={`${cr}%`} />
                  <Stat label="Current Yield" value={`${result.currentYield.toFixed(3)}%`} green />
                  <Stat label="YTM" value={`${result.ytm.toFixed(3)}%`} green />
                  <Stat label="Total Coupons" value={fmtMoney(result.totalCouponPayments, currency)} />
                  <Stat label="Total Return" value={fmtMoney(result.totalReturn, currency)} green />
                  <Stat label="Duration" value={`${result.duration.toFixed(2)} years`} />
                  <Stat label="Coupon/Period" value={fmtMoney((fv * cr / 100) / fr, currency)} />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>📊</div>
                <p>Enter bond details to calculate price and yield.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Annual Cash Flows</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={65}
                    tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <ReferenceLine y={0} stroke="var(--border)" />
                  <Bar dataKey="Coupon" fill="#3b82f6" radius={[2,2,0,0]} />
                  <Bar dataKey="Principal" fill="#10b981" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.tableCard} animate-in`}>
              <h2 className={s.chartTitle}>Cash Flow Schedule</h2>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Period</th><th>Coupon</th><th>Principal</th><th>Cash Flow</th><th>Present Value</th></tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.period}>
                        <td>{row.period}</td>
                        <td className={s.blue}>{fmtMoney(row.coupon, currency)}</td>
                        <td>{row.principal > 0 ? fmtMoney(row.principal, currency) : '—'}</td>
                        <td className={s.bold}>{fmtMoney(row.cashflow, currency)}</td>
                        <td className={s.green}>{fmtMoney(row.presentValue, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AdRectangle slot="15000000002" />

          <article className={s.article}>
            <h2>How Bond Pricing Works</h2>
            <p>A bond's price is the sum of all future cash flows (coupons + face value) discounted at the required yield. When the YTM equals the coupon rate, the bond trades at par (face value). When YTM is higher than the coupon rate, the bond trades at a discount. When YTM is lower, it trades at a premium.</p>

            {result && fv > 0 && (
              <div className={s.example}>
                <h3>📊 Your Bond</h3>
                <ul>
                  <li>Bond price: <strong>{fmtMoney(result.price, currency)}</strong> {isPremium ? '(trading at a premium)' : isDiscount ? '(trading at a discount)' : '(at par)'}</li>
                  <li>YTM: <strong>{result.ytm.toFixed(3)}%</strong></li>
                  <li>Current yield: <strong>{result.currentYield.toFixed(3)}%</strong></li>
                  <li>Total coupon income: <strong>{fmtMoney(result.totalCouponPayments, currency)}</strong></li>
                  <li>Total return: <strong>{fmtMoney(result.totalReturn, currency)}</strong></li>
                  <li>Macaulay duration: <strong>{result.duration.toFixed(2)} years</strong></li>
                </ul>
              </div>
            )}

            <h2>Bond Price vs Interest Rates</h2>
            <p>Bond prices and interest rates move in opposite directions. If you buy a bond paying 5% and market rates rise to 6%, your bond is less attractive — so its price falls to compensate. If rates fall to 4%, your 5% bond becomes more valuable. This is why existing bond holders lose money when rates rise and gain when rates fall.</p>

            <h2>Understanding Duration</h2>
            <p>Macaulay duration measures the weighted average time to receive all cash flows. A bond with 7 years duration will change in price by approximately 7% for every 1% change in interest rates. Lower coupon bonds and longer maturity bonds have higher duration and are more sensitive to rate changes.</p>

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

          <AdBanner slot="15000000003" />
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