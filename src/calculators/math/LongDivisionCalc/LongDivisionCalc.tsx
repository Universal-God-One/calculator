import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcLongDivision } from './longDivisionEngine'
import s from './LongDivisionCalc.module.css'

const FAQS = [
  { question: 'How does long division work?', answer: 'Long division breaks the process into a series of steps: Divide, Multiply, Subtract, Bring Down (DMSB). You take part of the dividend, find how many times the divisor goes into it, multiply to find the product, subtract to get the remainder, then bring down the next digit and repeat.' },
  { question: 'What is the remainder in division?', answer: 'The remainder is what is left over after dividing as evenly as possible. For 17 ÷ 5, the quotient is 3 (since 3 × 5 = 15) and the remainder is 2 (since 17 − 15 = 2). We write this as 17 ÷ 5 = 3 R 2, or as 3 and 2/5, or as the decimal 3.4.' },
  { question: 'How do you divide with decimals?', answer: 'When the remainder is not zero, you can continue the division by adding a decimal point and bringing down zeros. Each step gives another decimal digit. Some divisions terminate (like 1 ÷ 4 = 0.25) while others repeat (like 1 ÷ 3 = 0.333...).' },
  { question: 'What is DMSB?', answer: 'DMSB stands for Divide, Multiply, Subtract, Bring Down — the four steps repeated in long division. Divide: find how many times the divisor goes in. Multiply: divisor × quotient digit. Subtract: subtract the product from the current dividend. Bring Down: pull down the next digit.' },
]

const EXAMPLES = [
  { label: '852 ÷ 4', a: 852, b: 4 },
  { label: '1234 ÷ 7', a: 1234, b: 7 },
  { label: '100 ÷ 3', a: 100, b: 3 },
  { label: '7 ÷ 4', a: 7, b: 4 },
]

export default function LongDivisionCalcPage() {
  const [dividend, setDividend] = useState('852')
  const [divisor, setDivisor] = useState('4')
  const [decPlaces, setDecPlaces] = useState('4')
  const [showSteps, setShowSteps] = useState(true)

  const result = useMemo(() => {
    const a = parseInt(dividend)
    const b = parseInt(divisor)
    const d = parseInt(decPlaces) || 4
    if (isNaN(a) || isNaN(b) || b === 0) return null
    try { return calcLongDivision(a, b, d) } catch { return null }
  }, [dividend, divisor, decPlaces])

  const dividendStr = String(Math.abs(parseInt(dividend) || 0))
  const divisorNum = parseInt(divisor) || 0

  return (
    <>
      <SEOHead
        title="Long Division Calculator – Step-by-Step Division"
        description="Free long division calculator with step-by-step solution. Shows every divide, multiply, subtract, and bring-down step. Supports decimals and remainders."
        canonical="/math/long-division-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Arithmetic</p>
            <h1 className={s.h1}>Long Division Calculator</h1>
            <p className={s.sub}>See every step of long division — Divide, Multiply, Subtract, Bring Down.</p>
          </div>

          <AdBanner slot="35000000001" />

          <div className={s.mainGrid}>
            {/* Input */}
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Division Problem</h2>

              <div className={s.inputRow}>
                <div className={s.field}>
                  <label className={s.label}>Dividend</label>
                  <input className={s.input} type="number" value={dividend}
                    onChange={e => setDividend(e.target.value)} placeholder="e.g. 852" />
                </div>
                <div className={s.divSymbol}>÷</div>
                <div className={s.field}>
                  <label className={s.label}>Divisor</label>
                  <input className={s.input} type="number" value={divisor}
                    onChange={e => setDivisor(e.target.value)} placeholder="e.g. 4" />
                  {divisorNum === 0 && <span className={s.errNote}>Divisor cannot be 0</span>}
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Decimal Places (if needed)</label>
                <input className={s.input} type="number" value={decPlaces}
                  onChange={e => setDecPlaces(e.target.value)} min="0" max="10" />
              </div>

              <div className={s.examples}>
                <span className={s.exLabel}>Examples:</span>
                <div className={s.exBtns}>
                  {EXAMPLES.map(e => (
                    <button key={e.label} className={s.exBtn}
                      onClick={() => { setDividend(String(e.a)); setDivisor(String(e.b)) }}>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {result && (
                <div className={s.summary}>
                  <div className={s.summaryRow}>
                    <span>{result.dividend} ÷ {result.divisor} =</span>
                    <span className={s.summaryVal}>{result.quotientStr}</span>
                  </div>
                  {!result.isExact && (
                    <div className={s.summaryRow}>
                      <span>With remainder:</span>
                      <span className={s.summaryVal}>{result.quotient} R {result.remainder}</span>
                    </div>
                  )}
                  <div className={s.summaryRow}>
                    <span>Verification:</span>
                    <span className={s.summaryVerify}>{result.verification}</span>
                  </div>
                  <div className={s.summaryRow}>
                    <span>Exact division:</span>
                    <span style={{ color: result.isExact ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                      {result.isExact ? 'Yes ✓' : `No — remainder ${result.remainder}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Long division visual */}
            {result && (
              <div className={`${s.divisionCard} animate-in`}>
                <h2 className={s.cardTitle}>Long Division Layout</h2>
                <div className={s.longDivBox}>
                  <LongDivLayout
                    dividend={result.dividend}
                    divisor={result.divisor}
                    quotientStr={result.quotientStr}
                    isExact={result.isExact}
                    remainder={result.remainder}
                    decimalPlaces={result.decimalPlaces}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step-by-step */}
          {result && (
            <div className={`${s.stepsCard} animate-in`}>
              <div className={s.stepsHeader}>
                <h2 className={s.cardTitle}>Step-by-Step Solution</h2>
                <button className={s.toggleBtn} onClick={() => setShowSteps(v => !v)}>
                  {showSteps ? 'Hide' : 'Show'} Steps
                </button>
              </div>

              {showSteps && (
                <div className={s.stepsGrid}>
                  {result.steps.map((step, i) => {
                    const isDecStep = i >= dividendStr.length
                    return (
                      <div key={step.stepNum} className={`${s.stepBlock} ${isDecStep ? s.stepDecimal : ''}`}>
                        <div className={s.stepNum}>
                          Step {step.stepNum}
                          {isDecStep && <span className={s.decTag}>decimal</span>}
                        </div>
                        <div className={s.stepLines}>
                          <StepLine icon="÷" label="Divide" desc={`${step.currentDividend} ÷ ${Math.abs(result.divisor)} = ${step.quotientDigit}`} />
                          <StepLine icon="×" label="Multiply" desc={`${step.quotientDigit} × ${Math.abs(result.divisor)} = ${step.product}`} />
                          <StepLine icon="−" label="Subtract" desc={`${step.currentDividend} − ${step.product} = ${step.remainder}`} />
                          {step.bringDown !== null && (
                            <StepLine icon="↓" label="Bring down" desc={`Bring down ${step.bringDown} → ${step.newDividend}`} />
                          )}
                          {step.bringDown === null && step.remainder === 0 && (
                            <div className={s.doneNote}>✓ No remainder — division complete</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <article className={s.article}>
            <h2>How Long Division Works</h2>
            <p>Long division uses four repeating steps remembered by <strong>DMSB</strong>: <strong>D</strong>ivide (how many times does the divisor fit?), <strong>M</strong>ultiply (quotient digit × divisor), <strong>S</strong>ubtract (find the remainder), <strong>B</strong>ring down (next digit from dividend). Repeat until finished.</p>
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

          <AdBanner slot="35000000002" />
        </div>
      </div>
    </>
  )
}

function StepLine({ icon, label, desc }: { icon: string; label: string; desc: string }) {
  return (
    <div className={s.stepLine}>
      <span className={s.stepIcon}>{icon}</span>
      <span className={s.stepLabel}>{label}:</span>
      <span className={s.stepDesc}>{desc}</span>
    </div>
  )
}

function LongDivLayout({ dividend, divisor, quotientStr, isExact, remainder, decimalPlaces }:
  { dividend: number; divisor: number; quotientStr: string; isExact: boolean; remainder: number; decimalPlaces: number }) {
  return (
    <div className={s.ldLayout}>
      <div className={s.ldTop}>
        <span className={s.ldDivisor}>{Math.abs(divisor)}</span>
        <div className={s.ldRight}>
          <div className={s.ldQuotient}>{quotientStr}</div>
          <div className={s.ldBar} />
          <div className={s.ldDividend}>{Math.abs(dividend)}</div>
        </div>
      </div>
      {!isExact && (
        <div className={s.ldRem}>Remainder: {remainder}</div>
      )}
      {decimalPlaces > 0 && (
        <div className={s.ldNote}>Computed to {decimalPlaces} decimal place{decimalPlaces > 1 ? 's' : ''}</div>
      )}
    </div>
  )
}