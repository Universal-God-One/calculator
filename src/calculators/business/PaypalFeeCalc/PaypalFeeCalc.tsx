import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcPaypalFee, buildFeeSchedule, PAYPAL_FEE_TYPES } from './paypalFeeEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import s from './PaypalFeeCalc.module.css'

const FAQS = [
  { question: 'How does PayPal calculate fees?', answer: 'PayPal fees consist of two parts: a percentage of the transaction amount plus a fixed fee. For example, the standard online checkout fee is 3.49% + $0.49. On a $100 payment: $100 × 3.49% = $3.49 + $0.49 = $3.98 total fee, leaving you with $96.02.' },
  { question: 'How do I calculate what to charge to receive a specific amount?', answer: 'To receive exactly X after PayPal fees, you need to charge: (X + fixed fee) / (1 - fee rate). For example, to receive $100 with 3.49% + $0.49 fee: ($100 + $0.49) / (1 - 0.0349) = $104.65. This calculator does this automatically in the "Gross needed" field.' },
  { question: 'Are PayPal fees different for international transactions?', answer: 'Yes, international (cross-border) payments have higher fees — typically 4.99% + fixed fee, plus a currency conversion fee of 3-4% if currencies differ. The exact rate depends on the sender\'s country. Always check PayPal\'s current fee schedule for your specific country pair.' },
  { question: 'Can I pass PayPal fees to customers?', answer: 'PayPal\'s User Agreement historically prohibited charging customers a surcharge specifically for PayPal usage, but this policy has varied by region and has been updated over time. A common practice is to build fees into your prices or offer a discount for other payment methods. Check PayPal\'s current terms for your region.' },
]

type Mode = 'you_send' | 'you_receive'

export default function PaypalFeeCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [amount, setAmount] = useState('100')
  const [feeTypeId, setFeeTypeId] = useState('standard_checkout')
  const [mode, setMode] = useState<Mode>('you_receive')

  const sym = CURRENCY_LIST.find(c => c.code === currency)?.symbol ?? '$'
  const feeType = PAYPAL_FEE_TYPES.find(f => f.id === feeTypeId) ?? PAYPAL_FEE_TYPES[0]
  const amountNum = parseFloat(amount) || 0

  const result = useMemo(() => {
    if (amountNum <= 0) return null
    return calcPaypalFee(amountNum, feeType, currency)
  }, [amountNum, feeType, currency])

  const schedule = useMemo(() => buildFeeSchedule(feeType), [feeType])

  // In "you_send" mode: amount is what sender pays, show what recipient gets
  // In "you_receive" mode: amount is what you want to receive, show what to charge
  const displayResult = useMemo(() => {
    if (!result) return null
    if (mode === 'you_receive') {
      // User enters desired net → show gross to charge
      return {
        entered: amountNum,
        enteredLabel: 'You want to receive',
        chargeLabel: 'You should charge',
        chargeAmount: result.grossNeeded,
        feeLabel: 'PayPal fee',
        feeAmount: result.grossNeeded - amountNum,
        netLabel: 'You receive',
        netAmount: amountNum,
      }
    } else {
      // User enters amount to send → show what recipient gets
      return {
        entered: amountNum,
        enteredLabel: 'You charge / send',
        chargeLabel: 'Recipient receives',
        chargeAmount: result.netAmount,
        feeLabel: 'PayPal fee',
        feeAmount: result.feeAmount,
        netLabel: 'Net after fee',
        netAmount: result.netAmount,
      }
    }
  }, [result, mode, amountNum])

  return (
    <>
      <SEOHead
        title="PayPal Fee Calculator – Calculate PayPal Fees Instantly"
        description="Free PayPal fee calculator. Calculate PayPal fees for any transaction type — online checkout, invoicing, in-person, international. Find what to charge to receive a specific amount."
        canonical="/business/paypal-fee-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Payments</p>
            <h1 className={s.h1}>PayPal Fee Calculator</h1>
            <p className={s.sub}>Calculate PayPal transaction fees instantly. Know exactly what you'll receive — or what to charge.</p>
          </div>

          <AdBanner slot="47000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Transaction Details</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              {/* Mode toggle */}
              <div className={s.modeToggle}>
                <button className={`${s.modeBtn} ${mode === 'you_receive' ? s.modeActive : ''}`}
                  onClick={() => setMode('you_receive')}>
                  I want to receive
                </button>
                <button className={`${s.modeBtn} ${mode === 'you_send' ? s.modeActive : ''}`}
                  onClick={() => setMode('you_send')}>
                  I'm charging / sending
                </button>
              </div>

              <div className={s.field}>
                <label className={s.label}>
                  {mode === 'you_receive' ? `Amount to Receive (${sym})` : `Amount to Charge (${sym})`}
                </label>
                <input className={s.input} type="number" value={amount}
                  onChange={e => setAmount(e.target.value)} min="0" step="0.01" placeholder="e.g. 100" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Payment Type</label>
                <select className={s.select} value={feeTypeId} onChange={e => setFeeTypeId(e.target.value)}>
                  {PAYPAL_FEE_TYPES.map(ft => (
                    <option key={ft.id} value={ft.id}>{ft.label}</option>
                  ))}
                </select>
                <span className={s.hint}>{feeType.desc}</span>
                <div className={s.feeInfo}>
                  <span className={s.feeInfoItem}>Rate: <strong>{feeType.rate}%</strong></span>
                  <span className={s.feeInfoItem}>Fixed: <strong>${feeType.fixed}</strong></span>
                </div>
              </div>
            </div>

            {displayResult ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Fee Breakdown</h2>

                {/* Big result */}
                <div className={s.resultFlow}>
                  <div className={s.flowBox}>
                    <span className={s.flowLabel}>{displayResult.enteredLabel}</span>
                    <span className={s.flowAmount}>{fmtMoney(displayResult.entered, currency)}</span>
                  </div>
                  <div className={s.flowArrow}>→</div>
                  <div className={`${s.flowBox} ${s.flowFee}`}>
                    <span className={s.flowLabel}>PayPal takes</span>
                    <span className={s.flowFeeAmount}>−{fmtMoney(displayResult.feeAmount, currency)}</span>
                  </div>
                  <div className={s.flowArrow}>→</div>
                  <div className={`${s.flowBox} ${s.flowNet}`}>
                    <span className={s.flowLabel}>{mode === 'you_receive' ? 'Charge customer' : 'Recipient gets'}</span>
                    <span className={s.flowNetAmount}>{fmtMoney(displayResult.chargeAmount, currency)}</span>
                  </div>
                </div>

                <div className={s.statGrid}>
                  <StatRow label={mode === 'you_receive' ? 'You receive' : 'Transaction amount'} value={fmtMoney(mode === 'you_receive' ? amountNum : amountNum, currency)} green />
                  <StatRow label="PayPal fee" value={`−${fmtMoney(displayResult.feeAmount, currency)}`} red />
                  <StatRow label={`Rate (${feeType.rate}%)`} value={fmtMoney(amountNum * feeType.rate / 100, currency)} />
                  <StatRow label={`Fixed fee`} value={`$${feeType.fixed}`} />
                  {mode === 'you_receive' && (
                    <StatRow label="Charge customer" value={fmtMoney(displayResult.chargeAmount, currency)} />
                  )}
                  <StatRow label="Effective rate" value={`${result!.effectiveRate}%`} />
                </div>

                {mode === 'you_receive' && (
                  <div className={s.formulaBox}>
                    <span className={s.formulaTitle}>Formula to recover fees:</span>
                    <span className={s.formulaText}>
                      ({fmtMoney(amountNum, currency)} + ${feeType.fixed}) ÷ (1 − {feeType.rate}%) = <strong>{fmtMoney(displayResult.chargeAmount, currency)}</strong>
                    </span>
                  </div>
                )}

                {/* Fee bar */}
                <div className={s.feeBar}>
                  <div className={s.feeBarNet} style={{ width: `${(displayResult.netAmount / (mode === 'you_receive' ? displayResult.chargeAmount : amountNum)) * 100}%` }} />
                  <div className={s.feeBarFee} />
                </div>
                <div className={s.feeBarLabels}>
                  <span>You keep: {((displayResult.netAmount / (mode === 'you_receive' ? displayResult.chargeAmount : amountNum)) * 100).toFixed(1)}%</span>
                  <span>PayPal: {result!.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>💳</div>
                <p>Enter an amount to calculate PayPal fees.</p>
              </div>
            )}
          </div>

          {/* Fee schedule table */}
          <div className={`${s.scheduleCard} animate-in`}>
            <h2 className={s.scheduleTitle}>Fee Schedule — {feeType.label}</h2>
            <p className={s.scheduleSub}>{feeType.rate}% + ${feeType.fixed} fixed fee per transaction</p>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr><th>Amount</th><th>PayPal Fee</th><th>You Receive</th><th>Effective Rate</th><th>Charge to Receive</th></tr>
                </thead>
                <tbody>
                  {schedule.map(row => {
                    const effRate = ((row.fee / row.amount) * 100).toFixed(2)
                    const gross = calcPaypalFee(row.amount, feeType)
                    return (
                      <tr key={row.amount} className={amountNum === row.amount ? s.activeRow : ''}>
                        <td className={s.mono}>${row.amount.toLocaleString()}</td>
                        <td className={`${s.mono} ${s.red}`}>−${row.fee.toFixed(2)}</td>
                        <td className={`${s.mono} ${s.green}`}>${row.net.toFixed(2)}</td>
                        <td className={s.mono}>{effRate}%</td>
                        <td className={s.mono}>${gross.grossNeeded.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compare fee types */}
          <div className={`${s.compareCard} animate-in`}>
            <h2 className={s.compareTitle}>Compare PayPal Fee Types for {fmtMoney(amountNum || 100, currency)}</h2>
            <div className={s.compareGrid}>
              {PAYPAL_FEE_TYPES.map(ft => {
                const amt = amountNum || 100
                const r = calcPaypalFee(amt, ft)
                const isActive = ft.id === feeTypeId
                return (
                  <div key={ft.id}
                    className={`${s.compareRow} ${isActive ? s.compareActive : ''}`}
                    onClick={() => setFeeTypeId(ft.id)}>
                    <div className={s.compareLeft}>
                      <span className={s.compareName}>{ft.label}</span>
                      <span className={s.compareRate}>{ft.rate}% + ${ft.fixed}</span>
                    </div>
                    <div className={s.compareRight}>
                      <span className={s.compareFee}>−{fmtMoney(r.feeAmount, currency)}</span>
                      <span className={s.compareNet}>{fmtMoney(r.netAmount, currency)}</span>
                    </div>
                  </div>
                )
              })}
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

          <AdBanner slot="47000000002" />
        </div>
      </div>
    </>
  )
}

function StatRow({ label, value, green, red }: { label: string; value: string; green?: boolean; red?: boolean }) {
  return (
    <div className={s.statRow}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : red ? { color: 'var(--accent-red)' } : {}}>{value}</span>
    </div>
  )
}