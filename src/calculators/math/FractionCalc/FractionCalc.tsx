import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcFraction, FractionOperation, decimalToFraction, simplify } from './fractionEngine'
import s from './FractionCalc.module.css'

const FAQS = [
  { question: 'How do you add fractions with different denominators?', answer: 'Find the Least Common Denominator (LCD) of both fractions. Convert each fraction to an equivalent fraction with the LCD, then add the numerators. Finally, simplify the result. For example: 1/3 + 1/4 → LCD=12 → 4/12 + 3/12 = 7/12.' },
  { question: 'How do you multiply fractions?', answer: 'Multiply the numerators together and the denominators together. Then simplify. For example: 2/3 × 3/4 = 6/12 = 1/2. You can also cross-simplify before multiplying to keep numbers smaller.' },
  { question: 'How do you divide fractions?', answer: 'Flip (take the reciprocal of) the second fraction, then multiply. "Keep, Change, Flip" — keep the first fraction, change division to multiplication, flip the second fraction. Example: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.' },
  { question: 'What is a mixed number?', answer: 'A mixed number has a whole number part and a fraction part, like 2 1/3. To convert an improper fraction (where numerator > denominator) to a mixed number, divide the numerator by the denominator: the quotient is the whole number, the remainder is the new numerator.' },
  { question: 'How do you simplify a fraction?', answer: 'Find the Greatest Common Divisor (GCD) of the numerator and denominator, then divide both by it. For 12/18: GCD(12,18) = 6, so 12÷6 / 18÷6 = 2/3.' },
]

const OPS: { value: FractionOperation; label: string; symbol: string }[] = [
  { value: 'add', label: 'Add', symbol: '+' },
  { value: 'subtract', label: 'Subtract', symbol: '−' },
  { value: 'multiply', label: 'Multiply', symbol: '×' },
  { value: 'divide', label: 'Divide', symbol: '÷' },
]

type Tab = 'operations' | 'simplify' | 'convert'

export default function FractionCalcPage() {
  const [tab, setTab] = useState<Tab>('operations')
  const [op, setOp] = useState<FractionOperation>('add')

  // Operation inputs
  const [n1, setN1] = useState('1')
  const [d1, setD1] = useState('2')
  const [n2, setN2] = useState('1')
  const [d2, setD2] = useState('3')

  // Simplify inputs
  const [sNum, setSNum] = useState('12')
  const [sDen, setSDen] = useState('18')

  // Convert inputs
  const [decInput, setDecInput] = useState('0.75')

  const opResult = useMemo(() => {
    const num1 = parseInt(n1) || 0
    const den1 = parseInt(d1) || 0
    const num2 = parseInt(n2) || 0
    const den2 = parseInt(d2) || 0
    if (den1 === 0 || den2 === 0) return null
    if (op === 'divide' && num2 === 0) return null
    try { return calcFraction(num1, den1, num2, den2, op) } catch { return null }
  }, [n1, d1, n2, d2, op])

  const simplifyResult = useMemo(() => {
    const num = parseInt(sNum) || 0
    const den = parseInt(sDen) || 0
    if (den === 0) return null
    const [sn, sd] = simplify(num, den)
    const decimal = sn / sd
    return {
      original: `${num}/${den}`,
      simplified: sd === 1 ? `${sn}` : `${sn}/${sd}`,
      decimal: Math.round(decimal * 1000000) / 1000000,
      percentage: Math.round(decimal * 10000) / 100,
      alreadySimplified: sn === num && sd === den,
    }
  }, [sNum, sDen])

  const convertResult = useMemo(() => {
    const dec = parseFloat(decInput)
    if (isNaN(dec)) return null
    const [n, d] = decimalToFraction(dec)
    return {
      decimal: dec,
      fraction: d === 1 ? `${n}` : `${n}/${d}`,
      percentage: Math.round(dec * 10000) / 100,
    }
  }, [decInput])

  const opSymbol = OPS.find(o => o.value === op)?.symbol ?? '+'

  return (
    <>
      <SEOHead
        title="Fraction Calculator – Add, Subtract, Multiply, Divide Fractions"
        description="Free fraction calculator. Add, subtract, multiply, and divide fractions with step-by-step solutions. Simplify fractions and convert decimals to fractions."
        canonical="/math/fraction-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Fractions</p>
            <h1 className={s.h1}>Fraction Calculator</h1>
            <p className={s.sub}>Add, subtract, multiply, and divide fractions with step-by-step solutions.</p>
          </div>

          <AdBanner slot="27000000001" />

          {/* Tabs */}
          <div className={s.tabs}>
            {(['operations', 'simplify', 'convert'] as Tab[]).map(t => (
              <button key={t} className={`${s.tab} ${tab === t ? s.tabActive : ''}`} onClick={() => setTab(t)}>
                {t === 'operations' ? 'Operations' : t === 'simplify' ? 'Simplify' : 'Decimal ↔ Fraction'}
              </button>
            ))}
          </div>

          {tab === 'operations' && (
            <div className={`${s.card} animate-in`}>
              {/* Op selector */}
              <div className={s.opRow}>
                {OPS.map(o => (
                  <button key={o.value} className={`${s.opBtn} ${op === o.value ? s.opActive : ''}`}
                    onClick={() => setOp(o.value)}>
                    <span className={s.opSymbol}>{o.symbol}</span>
                    <span className={s.opLabel}>{o.label}</span>
                  </button>
                ))}
              </div>

              {/* Fraction inputs */}
              <div className={s.fractionRow}>
                <FractionInput n={n1} d={d1} onN={setN1} onD={setD1} label="First Fraction" />
                <div className={s.opDisplay}>{opSymbol}</div>
                <FractionInput n={n2} d={d2} onN={setN2} onD={setD2} label="Second Fraction" />
                <div className={s.equals}>=</div>
                {opResult ? (
                  <div className={s.resultFrac}>
                    <div className={s.resultNum}>{opResult.numerator}</div>
                    <div className={s.resultBar} />
                    <div className={s.resultDen}>{opResult.denominator}</div>
                  </div>
                ) : (
                  <div className={s.resultFrac}><div className={s.resultNum}>—</div></div>
                )}
              </div>

              {opResult && (
                <div className={s.resultMeta}>
                  <span className={s.metaItem}><strong>Simplified:</strong> {opResult.simplified}</span>
                  {opResult.mixedNumber && <span className={s.metaItem}><strong>Mixed:</strong> {opResult.mixedNumber}</span>}
                  <span className={s.metaItem}><strong>Decimal:</strong> {opResult.decimal}</span>
                  <span className={s.metaItem}><strong>Percent:</strong> {opResult.percentage}%</span>
                </div>
              )}

              {opResult && opResult.steps.length > 0 && (
                <div className={s.steps}>
                  <h3 className={s.stepsTitle}>Step-by-Step Solution</h3>
                  <ol className={s.stepsList}>
                    {opResult.steps.map((step, i) => (
                      <li key={i} className={s.step}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {tab === 'simplify' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Simplify a Fraction</h2>
              <div className={s.simplifyRow}>
                <div className={s.simplifyInput}>
                  <input className={s.bigInput} type="number" value={sNum} onChange={e => setSNum(e.target.value)} placeholder="12" />
                  <div className={s.bigBar} />
                  <input className={s.bigInput} type="number" value={sDen} onChange={e => setSDen(e.target.value)} placeholder="18" />
                </div>
                <div className={s.equals}>=</div>
                {simplifyResult && (
                  <div className={s.simplifyOutput}>
                    <span className={s.simplifiedFrac}>{simplifyResult.simplified}</span>
                    {simplifyResult.alreadySimplified && (
                      <span className={s.alreadySimple}>Already in simplest form</span>
                    )}
                  </div>
                )}
              </div>
              {simplifyResult && (
                <div className={s.resultMeta}>
                  <span className={s.metaItem}><strong>Decimal:</strong> {simplifyResult.decimal}</span>
                  <span className={s.metaItem}><strong>Percent:</strong> {simplifyResult.percentage}%</span>
                </div>
              )}
            </div>
          )}

          {tab === 'convert' && (
            <div className={`${s.card} animate-in`}>
              <h2 className={s.cardTitle}>Decimal ↔ Fraction</h2>
              <div className={s.convertGrid}>
                <div className={s.convertSection}>
                  <label className={s.convertLabel}>Decimal</label>
                  <input className={s.convertInput} type="number" value={decInput}
                    onChange={e => setDecInput(e.target.value)} step="0.01" placeholder="e.g. 0.75" />
                </div>
                <div className={s.convertArrow}>→</div>
                <div className={s.convertSection}>
                  <label className={s.convertLabel}>Fraction</label>
                  <div className={s.convertResult}>{convertResult?.fraction ?? '—'}</div>
                </div>
              </div>
              {convertResult && (
                <div className={s.resultMeta}>
                  <span className={s.metaItem}><strong>Decimal:</strong> {convertResult.decimal}</span>
                  <span className={s.metaItem}><strong>Fraction:</strong> {convertResult.fraction}</span>
                  <span className={s.metaItem}><strong>Percent:</strong> {convertResult.percentage}%</span>
                </div>
              )}

              {/* Common fractions reference */}
              <div className={s.reference}>
                <h3 className={s.refTitle}>Common Fractions</h3>
                <div className={s.refGrid}>
                  {[
                    ['1/2', '0.5', '50%'],
                    ['1/3', '0.333…', '33.3%'],
                    ['2/3', '0.666…', '66.7%'],
                    ['1/4', '0.25', '25%'],
                    ['3/4', '0.75', '75%'],
                    ['1/5', '0.2', '20%'],
                    ['1/8', '0.125', '12.5%'],
                    ['3/8', '0.375', '37.5%'],
                    ['5/8', '0.625', '62.5%'],
                    ['7/8', '0.875', '87.5%'],
                    ['1/10', '0.1', '10%'],
                    ['1/100', '0.01', '1%'],
                  ].map(([f, d, p]) => (
                    <div key={f} className={s.refRow}>
                      <span className={s.refFrac}>{f}</span>
                      <span className={s.refDec}>{d}</span>
                      <span className={s.refPct}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <article className={s.article}>
            <h2>How to Work with Fractions</h2>
            <p>Fractions represent parts of a whole. The top number (numerator) tells how many parts you have; the bottom number (denominator) tells how many equal parts the whole is divided into. Mastering fraction operations is fundamental to algebra, ratios, and everyday calculations.</p>

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

          <AdBanner slot="27000000002" />
        </div>
      </div>
    </>
  )
}

function FractionInput({ n, d, onN, onD, label }: {
  n: string; d: string; onN: (v: string) => void; onD: (v: string) => void; label: string
}) {
  return (
    <div className={s.fracInputWrap}>
      <span className={s.fracLabel}>{label}</span>
      <div className={s.fracStack}>
        <input className={s.fracNum} type="number" value={n} onChange={e => onN(e.target.value)} placeholder="1" />
        <div className={s.fracBar} />
        <input className={s.fracDen} type="number" value={d} onChange={e => onD(e.target.value)} placeholder="2" />
      </div>
    </div>
  )
}