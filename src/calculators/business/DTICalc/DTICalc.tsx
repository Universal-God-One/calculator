import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcDTI, DEFAULT_DEBTS, DTI_THRESHOLDS, DebtItem } from './dtiEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import s from './DTICalc.module.css'

const FAQS = [
  { question: 'What is DTI ratio?', answer: 'Debt-to-Income (DTI) ratio is your total monthly debt payments divided by your gross monthly income, expressed as a percentage. Lenders use it to assess your ability to manage monthly payments and repay debt. A lower DTI indicates a better balance between debt and income.' },
  { question: 'What is the difference between front-end and back-end DTI?', answer: 'Front-end DTI (housing ratio) includes only housing costs (mortgage/rent, property tax, insurance) divided by income. Back-end DTI includes ALL monthly debt payments — housing plus car loans, student loans, credit cards, and other obligations. Lenders check both.' },
  { question: 'What DTI do lenders require?', answer: 'Conventional loans typically require front-end DTI ≤ 28% and back-end DTI ≤ 36%. FHA loans allow up to 31% front-end and 43% back-end. VA loans don\'t have a strict front-end limit but prefer back-end DTI ≤ 41%. Some lenders go up to 50% back-end with strong compensating factors.' },
  { question: 'How can I lower my DTI?', answer: 'Two ways: increase income (raises, side income, second job) or reduce debt (pay down balances, avoid new debt, consolidate high-rate debt). Paying off a car loan or credit card balances can significantly improve DTI before applying for a mortgage.' },
]

export default function DTICalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [annualIncome, setAnnualIncome] = useState('80000')
  const [housing, setHousing] = useState('1500')
  const [debts, setDebts] = useState<DebtItem[]>(DEFAULT_DEBTS)
  const [newLabel, setNewLabel] = useState('')
  const [newAmount, setNewAmount] = useState('')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'
  const monthlyIncome = (parseFloat(annualIncome) || 0) / 12

  const result = useMemo(() => {
    if (monthlyIncome <= 0) return null
    return calcDTI(monthlyIncome, parseFloat(housing) || 0, debts)
  }, [monthlyIncome, housing, debts])

  function addDebt() {
    if (!newLabel.trim() || !newAmount) return
    setDebts(prev => [...prev, {
      id: Date.now().toString(),
      label: newLabel.trim(),
      amount: parseFloat(newAmount) || 0,
    }])
    setNewLabel('')
    setNewAmount('')
  }

  function removeDebt(id: string) {
    setDebts(prev => prev.filter(d => d.id !== id))
  }

  function updateDebt(id: string, amount: string) {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, amount: parseFloat(amount) || 0 } : d))
  }

  return (
    <>
      <SEOHead
        title="DTI Ratio Calculator – Debt-to-Income Ratio"
        description="Free DTI ratio calculator. Calculate your front-end and back-end debt-to-income ratio. See your rating and how much debt you can afford."
        canonical="/business/dti-ratio-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Finance</p>
            <h1 className={s.h1}>DTI Ratio Calculator</h1>
            <p className={s.sub}>Calculate your Debt-to-Income ratio and see how lenders evaluate your financial health.</p>
            <div className={s.formulaBadge}>DTI = Total Monthly Debt ÷ Gross Monthly Income × 100</div>
          </div>

          <AdBanner slot="43000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Income & Debts</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Annual Gross Income ({sym})</label>
                <input className={s.input} type="number" value={annualIncome}
                  onChange={e => setAnnualIncome(e.target.value)} min="0" step="1000" placeholder="e.g. 80000" />
                {monthlyIncome > 0 && <span className={s.hint}>{fmtMoney(monthlyIncome, currency)}/month</span>}
              </div>

              <div className={s.debtSection}>
                <h3 className={s.debtTitle}>Monthly Debt Payments</h3>

                <div className={s.debtRow}>
                  <span className={s.debtLabel}>🏠 Housing (rent/mortgage)</span>
                  <div className={s.debtInputWrap}>
                    <span className={s.debtSym}>{sym}</span>
                    <input className={s.debtInput} type="number" value={housing}
                      onChange={e => setHousing(e.target.value)} min="0" step="50" />
                  </div>
                </div>

                {debts.map(debt => (
                  <div key={debt.id} className={s.debtRow}>
                    <span className={s.debtLabel}>{debt.label}</span>
                    <div className={s.debtInputWrap}>
                      <span className={s.debtSym}>{sym}</span>
                      <input className={s.debtInput} type="number" value={debt.amount}
                        onChange={e => updateDebt(debt.id, e.target.value)} min="0" step="10" />
                      <button className={s.removeBtn} onClick={() => removeDebt(debt.id)}>×</button>
                    </div>
                  </div>
                ))}

                {/* Add debt */}
                <div className={s.addDebtRow}>
                  <input className={s.addLabelInput} type="text" value={newLabel}
                    onChange={e => setNewLabel(e.target.value)} placeholder="Debt name"
                    onKeyDown={e => e.key === 'Enter' && addDebt()} />
                  <div className={s.debtInputWrap}>
                    <span className={s.debtSym}>{sym}</span>
                    <input className={s.debtInput} type="number" value={newAmount}
                      onChange={e => setNewAmount(e.target.value)} min="0" placeholder="0"
                      onKeyDown={e => e.key === 'Enter' && addDebt()} />
                  </div>
                  <button className={s.addBtn} onClick={addDebt}>+</button>
                </div>
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>DTI Analysis</h2>

                {/* Big DTI display */}
                <div className={s.dtiDisplay}>
                  <div className={s.dtiMain}>
                    <span className={s.dtiLabel}>Back-End DTI</span>
                    <span className={s.dtiValue} style={{ color: result.ratingColor }}>{result.backEndDTI}%</span>
                    <span className={s.dtiRating} style={{ color: result.ratingColor }}>{result.ratingLabel}</span>
                  </div>
                  <div className={s.dtiFront}>
                    <span className={s.dtiSmLabel}>Front-End DTI</span>
                    <span className={s.dtiSmValue}>{result.frontEndDTI}%</span>
                    <span className={s.dtiSmNote}>(housing only)</span>
                  </div>
                </div>

                {/* DTI bar */}
                <div className={s.dtiBar}>
                  <div className={s.dtiBarFill} style={{
                    width: `${Math.min(result.backEndDTI, 100)}%`,
                    background: result.ratingColor,
                  }} />
                  <div className={s.dtiBarMarks}>
                    {[28, 36, 43].map(mark => (
                      <div key={mark} className={s.dtiMark} style={{ left: `${mark}%` }}>
                        <div className={s.dtiMarkLine} />
                        <span className={s.dtiMarkLabel}>{mark}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={s.statGrid}>
                  <Stat label="Gross Monthly Income" value={fmtMoney(result.grossMonthlyIncome, currency)} />
                  <Stat label="Total Monthly Debt" value={fmtMoney(result.totalMonthlyDebt, currency)} />
                  <Stat label="Disposable Income" value={fmtMoney(result.disposableIncome, currency)} green={result.disposableIncome > 0} />
                  <Stat label="Max Debt (36% target)" value={fmtMoney(result.maxDebtForTarget, currency)} />
                </div>

                {/* Debt breakdown */}
                <div className={s.breakdown}>
                  <h3 className={s.breakdownTitle}>Debt Breakdown</h3>
                  {result.debtItems.filter(d => d.amount > 0).map(item => {
                    const pct = result.grossMonthlyIncome > 0 ? (item.amount / result.grossMonthlyIncome) * 100 : 0
                    return (
                      <div key={item.id} className={s.breakRow}>
                        <span className={s.breakLabel}>{item.label}</span>
                        <div className={s.breakBarWrap}>
                          <div className={s.breakBar} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className={s.breakPct}>{pct.toFixed(1)}%</span>
                        <span className={s.breakAmt}>{fmtMoney(item.amount, currency)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>📊</div>
                <p>Enter your income and monthly debt payments to calculate DTI.</p>
              </div>
            )}
          </div>

          {/* DTI thresholds reference */}
          <div className={`${s.thresholdsCard} animate-in`}>
            <h2 className={s.thresholdsTitle}>DTI Rating Scale</h2>
            <div className={s.thresholdsGrid}>
              {DTI_THRESHOLDS.map(t => (
                <div key={t.max} className={`${s.threshold} ${result && (
                  (t.max === 20 && result.backEndDTI <= 20) ||
                  (t.max === 28 && result.backEndDTI > 20 && result.backEndDTI <= 28) ||
                  (t.max === 36 && result.backEndDTI > 28 && result.backEndDTI <= 36) ||
                  (t.max === 43 && result.backEndDTI > 36 && result.backEndDTI <= 43) ||
                  (t.max === 100 && result.backEndDTI > 43)
                ) ? s.thresholdActive : ''}`}>
                  <span className={s.thresholdRange}>{t.label}</span>
                  <span className={s.thresholdRating}>{t.rating}</span>
                  <span className={s.thresholdDesc}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

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

          <AdBanner slot="43000000002" />
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