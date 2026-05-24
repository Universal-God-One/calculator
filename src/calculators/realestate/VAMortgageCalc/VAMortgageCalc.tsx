import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcVA, ServiceType, SERVICE_LABELS, VA_LOAN_LIMIT_2024 } from './vaEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import s from './VAMortgageCalc.module.css'

const FAQS = [
  { question: 'Who qualifies for a VA loan?', answer: 'VA loans are available to active duty service members, veterans, and eligible surviving spouses. General eligibility requires 90 days of active duty during wartime, 181 days during peacetime, or 6 years in the National Guard or Reserves. You must also have not been dishonorably discharged.' },
  { question: 'What is the VA funding fee?', answer: 'The VA funding fee is a one-time charge (typically 2.15%–3.3% of the loan for first-time use) that helps fund the VA loan program. It can be financed into the loan or paid upfront. Veterans with service-connected disabilities of 10% or more are exempt from the funding fee.' },
  { question: 'Do VA loans require a down payment?', answer: 'VA loans do not require a down payment — you can finance 100% of the home price. However, making a down payment of 5% or more reduces the funding fee rate, and 10%+ reduces it further. A down payment also reduces your monthly payment and total interest paid.' },
  { question: 'Do VA loans have mortgage insurance (PMI)?', answer: 'No — VA loans do not require Private Mortgage Insurance (PMI) regardless of the down payment amount. This is one of the biggest advantages over FHA and conventional loans with less than 20% down. The funding fee is a one-time charge, not an ongoing monthly cost.' },
  { question: 'What is the VA loan limit?', answer: 'Veterans with full entitlement (first-time use or previous loan fully paid off) have no loan limit and can borrow any amount the lender approves. The 2024 conforming loan limit is $766,550 for most counties. Veterans with reduced entitlement may have limits based on remaining entitlement.' },
]

export default function VAMortgageCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [homePrice, setHomePrice] = useState('350000')
  const [downPct, setDownPct] = useState('0')
  const [rate, setRate] = useState('6.5')
  const [term, setTerm] = useState('30')
  const [serviceType, setServiceType] = useState<ServiceType>('active_first')
  const [propertyTax, setPropertyTax] = useState('1.2')
  const [homeInsurance, setHomeInsurance] = useState('1200')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'

  const result = useMemo(() => {
    const hp = parseFloat(homePrice) || 0
    const dp = parseFloat(downPct) || 0
    const r = parseFloat(rate) || 0
    const t = parseInt(term) || 30
    const pt = parseFloat(propertyTax) || 0
    const hi = parseFloat(homeInsurance) || 0
    if (hp <= 0 || r <= 0) return null
    return calcVA(hp, dp, r, t, serviceType, pt, hi)
  }, [homePrice, downPct, rate, term, serviceType, propertyTax, homeInsurance])

  const hp = parseFloat(homePrice) || 0
  const dp = parseFloat(downPct) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 30
  const isExempt = serviceType === 'exempt'

  const chartData = result?.schedule
    .filter((_, i) => i % 12 === 0)
    .map(row => ({
      year: `Yr ${Math.ceil(row.month / 12)}`,
      Balance: row.balance,
    })) ?? []

  return (
    <>
      <SEOHead
        title="VA Mortgage Calculator – VA Loan Payment with Funding Fee"
        description="Free VA mortgage calculator. Calculate your VA loan monthly payment including the 2024 VA funding fee. No PMI required. Supports all service types."
        canonical="/real-estate/va-mortgage-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Real Estate › VA Loan</p>
            <h1 className={s.h1}>VA Mortgage Calculator</h1>
            <p className={s.sub}>Calculate your VA loan payment with the 2024 funding fee. No PMI. No down payment required.</p>
          </div>

          <AdBanner slot="21000000001" />

          {/* VA Benefits Banner */}
          <div className={s.benefitsBanner}>
            <div className={s.benefit}><span className={s.benefitIcon}>✅</span><span>No Down Payment Required</span></div>
            <div className={s.benefit}><span className={s.benefitIcon}>✅</span><span>No PMI Ever</span></div>
            <div className={s.benefit}><span className={s.benefitIcon}>✅</span><span>Competitive Rates</span></div>
            <div className={s.benefit}><span className={s.benefitIcon}>✅</span><span>No Loan Limit (Full Entitlement)</span></div>
          </div>

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

              <div className={s.field}>
                <label className={s.label}>Service Type</label>
                <select className={s.select} value={serviceType} onChange={e => setServiceType(e.target.value as ServiceType)}>
                  {(Object.entries(SERVICE_LABELS) as [ServiceType, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                {isExempt && <span className={s.exemptNote}>✅ Funding fee waived</span>}
              </div>

              <div className={s.field}>
                <label className={s.label}>Home Price ({sym})</label>
                <input className={s.input} type="number" value={homePrice}
                  onChange={e => setHomePrice(e.target.value)} min="0" step="5000" placeholder="e.g. 350000" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Down Payment (%)</label>
                <input className={s.input} type="number" value={downPct}
                  onChange={e => setDownPct(e.target.value)} min="0" max="100" step="0.5" placeholder="0 — not required" />
                {result && dp > 0 && (
                  <span className={s.hint}>= {fmtMoney(result.downPayment, currency)}</span>
                )}
                {result && !isExempt && (
                  <span className={s.feeNote}>
                    Funding fee: {result.fundingFeePct.toFixed(2)}%
                    {dp >= 10 ? ' (reduced — 10%+ down)' : dp >= 5 ? ' (reduced — 5%+ down)' : ''}
                  </span>
                )}
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Interest Rate (%)</label>
                  <input className={s.input} type="number" value={rate}
                    onChange={e => setRate(e.target.value)} min="0" max="20" step="0.05" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Loan Term</label>
                  <select className={s.select} value={term} onChange={e => setTerm(e.target.value)}>
                    <option value="30">30 Years</option>
                    <option value="20">20 Years</option>
                    <option value="15">15 Years</option>
                    <option value="10">10 Years</option>
                  </select>
                </div>
              </div>

              <div className={s.fieldRow}>
                <div className={s.field}>
                  <label className={s.label}>Property Tax (%/yr)</label>
                  <input className={s.input} type="number" value={propertyTax}
                    onChange={e => setPropertyTax(e.target.value)} min="0" max="5" step="0.1" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Home Insurance ({sym}/yr)</label>
                  <input className={s.input} type="number" value={homeInsurance}
                    onChange={e => setHomeInsurance(e.target.value)} min="0" step="100" />
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>VA Loan Summary</h2>

                <div className={s.totalPayment}>
                  <span className={s.totalLabel}>Total Monthly Payment</span>
                  <span className={s.totalValue}>{fmtMoney(result.monthlyPayment, currency)}</span>
                </div>

                <div className={s.breakdown}>
                  <BRow label="Principal & Interest" value={fmtMoney(result.monthlyPI, currency)} />
                  <BRow label="Property Tax" value={fmtMoney(result.monthlyPropertyTax, currency)} />
                  <BRow label="Home Insurance" value={fmtMoney(result.monthlyInsurance, currency)} />
                  <BRow label="PMI" value="None ✅" green />
                </div>

                <div className={s.feeCard}>
                  <h3 className={s.feeTitle}>VA Funding Fee</h3>
                  <div className={s.feeGrid}>
                    <div className={s.feeStat}>
                      <span className={s.feeStatLabel}>Fee Rate</span>
                      <span className={s.feeStatValue}>{isExempt ? 'Exempt' : result.fundingFeePct.toFixed(2) + '%'}</span>
                    </div>
                    <div className={s.feeStat}>
                      <span className={s.feeStatLabel}>Fee Amount</span>
                      <span className={s.feeStatValue}>{isExempt ? fmtMoney(0, currency) : fmtMoney(result.fundingFee, currency)}</span>
                    </div>
                    <div className={s.feeStat}>
                      <span className={s.feeStatLabel}>Base Loan</span>
                      <span className={s.feeStatValue}>{fmtMoney(result.loanAmount, currency)}</span>
                    </div>
                    <div className={s.feeStat}>
                      <span className={s.feeStatLabel}>Total Loan</span>
                      <span className={s.feeStatValue}>{fmtMoney(result.totalLoanWithFee, currency)}</span>
                    </div>
                  </div>
                  {dp < 5 && !isExempt && (
                    <p className={s.feeTip}>💡 Put 5% down to reduce funding fee to {serviceType.includes('first') ? '1.5%' : '1.5%'}, saving {fmtMoney(result.fundingFee * 0.3, currency)}+</p>
                  )}
                </div>

                <div className={s.loanSummary}>
                  <SumRow label="Home Price" value={fmtMoney(hp, currency)} />
                  <SumRow label="Down Payment" value={fmtMoney(result.downPayment, currency)} />
                  <SumRow label="Total Interest" value={fmtMoney(result.totalInterest, currency)} />
                  <SumRow label="Funding Fee" value={fmtMoney(result.fundingFee, currency)} />
                  <SumRow label="Total Cost" value={fmtMoney(result.totalPayment + result.fundingFee, currency)} bold />
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🎖️</div>
                <p>Enter your loan details to calculate your VA mortgage payment.</p>
              </div>
            )}
          </div>

          {result && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Loan Balance Over {t} Years</h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gVA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={70}
                    tickFormatter={v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v} />
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Balance" stroke="#3b82f6" fill="url(#gVA)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <AdRectangle slot="21000000002" />

          <article className={s.article}>
            <h2>VA Loan Benefits</h2>
            <p>VA loans offer some of the best terms available to any mortgage borrower. No down payment, no PMI, competitive interest rates, and no loan limit for veterans with full entitlement. These benefits are earned through military service and can be used multiple times throughout a veteran's life.</p>

            {result && hp > 0 && (
              <div className={s.example}>
                <h3>📊 Your VA Loan</h3>
                <p><strong>{fmtMoney(hp, currency)}</strong> home, <strong>{dp}% down</strong>, <strong>{rate}%</strong> rate, <strong>{t} years</strong>:</p>
                <ul>
                  <li>Monthly P&I payment: <strong>{fmtMoney(result.monthlyPI, currency)}</strong></li>
                  <li>VA funding fee ({result.fundingFeePct.toFixed(2)}%): <strong>{fmtMoney(result.fundingFee, currency)}</strong></li>
                  <li>Total loan (fee financed): <strong>{fmtMoney(result.totalLoanWithFee, currency)}</strong></li>
                  <li>Total interest: <strong>{fmtMoney(result.totalInterest, currency)}</strong></li>
                  <li>Monthly PMI: <strong>$0 — no PMI on VA loans</strong></li>
                </ul>
              </div>
            )}

            <h2>2024 VA Funding Fee Rates</h2>
            <p>The funding fee varies based on service type, use (first vs subsequent), and down payment. Active duty/veterans pay 2.15% for first use with no down payment, reduced to 1.5% with 5%+ down, and 1.25% with 10%+ down. Subsequent use rates are higher (3.3% with no down). Veterans with 10%+ disability ratings are fully exempt.</p>

            <h2>VA vs FHA vs Conventional</h2>
            <p>VA loans are the best option for eligible veterans in most cases. No PMI saves $100–$300/month vs FHA loans. The one-time funding fee is usually much less than years of PMI payments. Compared to conventional loans with less than 20% down (which require PMI), VA loans are almost always more economical for those who qualify.</p>

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

          <AdBanner slot="21000000003" />
        </div>
      </div>
    </>
  )
}

function BRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={s.bRow}>
      <span>{label}</span>
      <span className={s.bVal} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}

function SumRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`${s.sumRow} ${bold ? s.sumRowBold : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}