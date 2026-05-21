import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner, AdRectangle } from '@/components/AdUnit'
import { calcPercentage, PctMode } from './percentageEngine'
import s from './PercentageCalc.module.css'

const MODES: { value: PctMode; label: string; aLabel: string; bLabel: string; placeholder: [string, string] }[] = [
  { value: 'whatIsXofY', label: 'What is X% of Y?', aLabel: 'Percentage (%)', bLabel: 'Value', placeholder: ['e.g. 15', 'e.g. 200'] },
  { value: 'xIsWhatPctOfY', label: 'X is what % of Y?', aLabel: 'Value (X)', bLabel: 'Total (Y)', placeholder: ['e.g. 30', 'e.g. 200'] },
  { value: 'pctChange', label: '% change from X to Y', aLabel: 'Original Value (X)', bLabel: 'New Value (Y)', placeholder: ['e.g. 80', 'e.g. 100'] },
  { value: 'pctOf', label: 'X is Y% of what?', aLabel: 'Value (X)', bLabel: 'Percentage (Y%)', placeholder: ['e.g. 30', 'e.g. 15'] },
]

const FAQS = [
  { question: 'How do I calculate what percentage one number is of another?',
    answer: 'Divide the part by the whole and multiply by 100. For example, 30 is what percent of 150? Answer: (30 ÷ 150) × 100 = 20%. This tells you that 30 is 20% of 150.' },
  { question: 'How do I calculate percentage increase or decrease?',
    answer: 'Percentage change = ((New Value - Old Value) ÷ |Old Value|) × 100. A positive result is an increase; negative is a decrease. For example, going from 80 to 100 is ((100-80) ÷ 80) × 100 = 25% increase.' },
  { question: 'How do I find the original value before a percentage change?',
    answer: 'If a value increased by X%, the original = new value ÷ (1 + X/100). If it decreased by X%, original = new value ÷ (1 - X/100). For example, if a price is $120 after a 20% increase, original = $120 ÷ 1.20 = $100.' },
  { question: 'What is the difference between percentage points and percent?',
    answer: 'Percentage points measure the arithmetic difference between two percentages. If a rate goes from 10% to 15%, it increased by 5 percentage points, but the relative change is 50% (a 5 percentage point increase on a base of 10%). These are often confused in financial and economic reporting.' },
]

export default function PercentageCalcPage() {
  const [mode, setMode] = useState<PctMode>('whatIsXofY')
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const modeConfig = MODES.find(m => m.value === mode)!

  const result = useMemo(() => {
    const na = parseFloat(a)
    const nb = parseFloat(b)
    if (isNaN(na) || isNaN(nb) || nb === 0) return null
    try { return calcPercentage(mode, na, nb) }
    catch { return null }
  }, [mode, a, b])

  const fmt = (n: number) => {
    if (mode === 'xIsWhatPctOfY' || mode === 'pctChange') return n.toFixed(4) + '%'
    return n.toLocaleString('en-US', { maximumFractionDigits: 6 })
  }

  return (
    <>
      <SEOHead
        title="Percentage Calculator – Free Online % Tool"
        description="Free percentage calculator. Calculate what is X% of Y, percentage change, X is what percent of Y, and more. Instant results with step-by-step formulas."
        canonical="/math/percentage-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>Math › Percentage</p>
            <h1 className={s.h1}>Percentage Calculator</h1>
            <p className={s.sub}>Four percentage tools in one. Pick your calculation type below.</p>
          </div>

          <AdBanner slot="5000000001" />

          {/* Mode selector */}
          <div className={s.modes}>
            {MODES.map(m => (
              <button key={m.value} className={`${s.modeBtn} ${mode === m.value ? s.modeBtnActive : ''}`}
                onClick={() => { setMode(m.value); setA(''); setB('') }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Calculator */}
          <div className={s.calcCard}>
            <div className={s.inputs}>
              <div className={s.field}>
                <label className={s.label}>{modeConfig.aLabel}</label>
                <input className={s.input} type="number" value={a}
                  onChange={e => setA(e.target.value)} placeholder={modeConfig.placeholder[0]} />
              </div>
              <div className={s.field}>
                <label className={s.label}>{modeConfig.bLabel}</label>
                <input className={s.input} type="number" value={b}
                  onChange={e => setB(e.target.value)} placeholder={modeConfig.placeholder[1]} />
              </div>
            </div>

            {result ? (
              <div className={`${s.result} animate-in`}>
                <span className={s.resultLabel}>Answer</span>
                <span className={s.resultValue}>{fmt(result.answer)}</span>
                <div className={s.formula}>
                  <span className={s.formulaLabel}>Formula:</span>
                  <span className={s.formulaText}>{result.formula}</span>
                </div>
              </div>
            ) : (
              <div className={s.resultEmpty}>Enter both values to calculate</div>
            )}
          </div>

          <AdRectangle slot="5000000002" />

          <article className={s.article}>
            <h2>How to Calculate Percentages</h2>
            <p>A percentage is a ratio expressed as a fraction of 100. The word comes from the Latin "per centum" — per hundred. Percentages are used everywhere: tax rates, discounts, interest rates, exam scores, statistics, and financial reporting.</p>

            {result && parseFloat(a) && parseFloat(b) && (
              <div className={s.example}>
                <h3>📊 Your Calculation</h3>
                <p><strong>{modeConfig.label.replace('X', a).replace('Y', b)}</strong></p>
                <p>{result.explanation}</p>
              </div>
            )}

            <h2>The 4 Core Percentage Calculations</h2>
            <p><strong>1. What is X% of Y?</strong> Multiply Y by X/100. This is used for calculating tips, tax amounts, discounts, and commissions. Example: 15% of $80 = 0.15 × $80 = $12.</p>
            <p><strong>2. X is what percent of Y?</strong> Divide X by Y and multiply by 100. Used to find test scores, market share, or how much one value represents of another. Example: 45 out of 60 = (45/60) × 100 = 75%.</p>
            <p><strong>3. Percentage change from X to Y.</strong> This measures growth or decline. Formula: ((Y - X) / |X|) × 100. Used in finance, economics, and scientific analysis. A stock going from $50 to $65 is a 30% increase.</p>
            <p><strong>4. X is Y% of what?</strong> Reverse percentage — find the whole when you know a part and its percentage. Used for finding original prices after discounts. If $30 is 15% of something, the whole is $30 / 0.15 = $200.</p>

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

          <AdBanner slot="5000000003" />
        </div>
      </div>
    </>
  )
}
