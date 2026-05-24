import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcStdDev, parseInput } from './stdDevEngine'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import s from './StdDevCalc.module.css'

const FAQS = [
  { question: 'What is standard deviation?', answer: 'Standard deviation measures how spread out values are from the mean. A low standard deviation means values cluster tightly around the mean; a high standard deviation means they spread widely. It\'s the square root of the variance.' },
  { question: 'Population vs sample standard deviation — what\'s the difference?', answer: 'Population standard deviation (σ) divides by N and is used when you have data for the entire population. Sample standard deviation (s) divides by N-1 (Bessel\'s correction) and is used when your data is a sample from a larger population. Sample SD is almost always the right choice in practice.' },
  { question: 'What is the coefficient of variation?', answer: 'The coefficient of variation (CV) is the standard deviation divided by the mean, expressed as a percentage. It measures relative variability — useful for comparing spread across datasets with different units or scales. A CV under 15% is generally considered low variability.' },
  { question: 'What is the interquartile range (IQR)?', answer: 'The IQR is the range between the 25th percentile (Q1) and 75th percentile (Q3). It measures the spread of the middle 50% of data and is resistant to outliers, making it a robust measure of dispersion. Outliers are typically defined as values more than 1.5×IQR below Q1 or above Q3.' },
]

const SAMPLE_DATASETS = {
  'Test Scores': '72, 85, 91, 68, 77, 88, 95, 73, 80, 84, 90, 76',
  'Heights (cm)': '165, 170, 172, 168, 175, 180, 163, 177, 171, 169',
  'Daily Sales': '1200, 1450, 980, 1320, 1580, 1100, 1420, 1650, 1280, 1390',
}

function r(n: number, d = 4) { return Math.round(n * Math.pow(10, d)) / Math.pow(10, d) }

export default function StdDevCalcPage() {
  const [input, setInput] = useState('72, 85, 91, 68, 77, 88, 95, 73, 80, 84, 90, 76')
  const [showFormulas, setShowFormulas] = useState(false)

  const { values, result, error } = useMemo(() => {
    const values = parseInput(input)
    if (values.length === 0) return { values: [], result: null, error: 'Enter numbers separated by commas, spaces, or new lines.' }
    if (values.length < 2) return { values, result: null, error: 'Enter at least 2 values.' }
    try {
      return { values, result: calcStdDev(values), error: null }
    } catch (e) {
      return { values, result: null, error: String(e) }
    }
  }, [input])

  // Frequency chart data
  const freqData = useMemo(() => {
    if (!result) return []
    const freq: Record<number, number> = {}
    values.forEach(v => { freq[v] = (freq[v] ?? 0) + 1 })
    return Object.entries(freq)
      .sort(([a], [b]) => +a - +b)
      .map(([val, count]) => ({ value: +val, count }))
  }, [values, result])

  return (
    <>
      <SEOHead
        title="Standard Deviation Calculator – Mean, Variance & Statistics"
        description="Free standard deviation calculator. Calculate mean, median, mode, variance, standard deviation, quartiles, and IQR with a dot plot."
        canonical="/math/standard-deviation-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Statistics</p>
            <h1 className={s.h1}>Standard Deviation Calculator</h1>
            <p className={s.sub}>Calculate mean, median, variance, standard deviation, quartiles, and more from your data.</p>
          </div>

          <AdBanner slot="29000000001" />

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Enter Your Data</h2>
              <textarea
                className={s.dataInput}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Enter numbers separated by commas, spaces, or new lines&#10;e.g. 10, 20, 30, 40, 50"
                rows={6}
              />
              <div className={s.sampleRow}>
                <span className={s.sampleLabel}>Try a sample:</span>
                {Object.entries(SAMPLE_DATASETS).map(([name, data]) => (
                  <button key={name} className={s.sampleBtn} onClick={() => setInput(data)}>{name}</button>
                ))}
              </div>
              {error && <p className={s.errorMsg}>{error}</p>}
              {result && (
                <div className={s.inputMeta}>
                  <span>{result.count} values parsed</span>
                  <span>Min: {r(result.min)}</span>
                  <span>Max: {r(result.max)}</span>
                </div>
              )}
            </div>

            {result && (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Results</h2>

                <div className={s.highlight}>
                  <div className={s.highlightItem}>
                    <span className={s.hlLabel}>Sample Std Dev (s)</span>
                    <span className={s.hlValue}>{r(result.stddev_sample)}</span>
                  </div>
                  <div className={s.highlightItem}>
                    <span className={s.hlLabel}>Mean (x̄)</span>
                    <span className={s.hlValue}>{r(result.mean)}</span>
                  </div>
                </div>

                <div className={s.statGrid}>
                  <StatRow label="Count (n)" value={result.count} />
                  <StatRow label="Sum" value={r(result.sum)} />
                  <StatRow label="Mean (x̄)" value={r(result.mean)} />
                  <StatRow label="Median" value={r(result.median)} />
                  <StatRow label="Mode" value={result.mode.length ? result.mode.map(v => r(v)).join(', ') : 'None'} />
                  <StatRow label="Range" value={r(result.range)} />
                  <StatRow label="Min" value={r(result.min)} />
                  <StatRow label="Max" value={r(result.max)} />
                  <StatRow label="Q1 (25th pctl)" value={r(result.q1)} />
                  <StatRow label="Q3 (75th pctl)" value={r(result.q3)} />
                  <StatRow label="IQR" value={r(result.iqr)} />
                  <StatRow label="Population Variance (σ²)" value={r(result.variance_population)} />
                  <StatRow label="Sample Variance (s²)" value={r(result.variance_sample)} />
                  <StatRow label="Population Std Dev (σ)" value={r(result.stddev_population)} />
                  <StatRow label="Sample Std Dev (s)" value={r(result.stddev_sample)} green />
                  <StatRow label="Coeff. of Variation (CV)" value={`${r(result.cv, 2)}%`} />
                </div>

                <button className={s.formulaToggle} onClick={() => setShowFormulas(v => !v)}>
                  {showFormulas ? 'Hide' : 'Show'} Formulas
                </button>
                {showFormulas && (
                  <div className={s.formulas}>
                    <div className={s.formula}><span className={s.fLabel}>Mean:</span> <code>x̄ = Σx / n</code></div>
                    <div className={s.formula}><span className={s.fLabel}>Pop. Variance:</span> <code>σ² = Σ(x - x̄)² / n</code></div>
                    <div className={s.formula}><span className={s.fLabel}>Sample Variance:</span> <code>s² = Σ(x - x̄)² / (n-1)</code></div>
                    <div className={s.formula}><span className={s.fLabel}>Std Dev:</span> <code>σ = √σ²</code></div>
                    <div className={s.formula}><span className={s.fLabel}>CV:</span> <code>CV = (s / |x̄|) × 100%</code></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {result && freqData.length > 0 && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Frequency Distribution</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={freqData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="value" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} width={30} />
                  <Tooltip
                    formatter={(v: number) => [v, 'Count']}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <ReferenceLine x={result.mean} stroke="var(--accent-green)" strokeDasharray="4 4"
                    label={{ value: 'Mean', fill: 'var(--accent-green)', fontSize: 10, position: 'top' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {result && (
            <div className={`${s.boxPlotCard} animate-in`}>
              <h2 className={s.chartTitle}>Box Plot (Five-Number Summary)</h2>
              <BoxPlot result={result} />
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

          <AdBanner slot="29000000002" />
        </div>
      </div>
    </>
  )
}

function StatRow({ label, value, green }: { label: string; value: string | number; green?: boolean }) {
  return (
    <div className={s.statRow}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}

function BoxPlot({ result }: { result: ReturnType<typeof import('./stdDevEngine').calcStdDev> }) {
  const { min, q1, median, q3, max, mean } = result
  const range = max - min || 1
  const pct = (v: number) => `${((v - min) / range) * 100}%`

  return (
    <div className={s.boxPlot}>
      <div className={s.bpTrack}>
        <div className={s.bpWhiskerLeft} style={{ left: '0%', width: pct(q1) }} />
        <div className={s.bpBox} style={{ left: pct(q1), width: `calc(${pct(q3)} - ${pct(q1)})` }}>
          <div className={s.bpMedian} style={{ left: `calc((${pct(median)} - ${pct(q1)}) / ((${pct(q3)} - ${pct(q1)}) / 1))` }} />
        </div>
        <div className={s.bpWhiskerRight} style={{ left: pct(q3), width: `calc(100% - ${pct(q3)})` }} />
        <div className={s.bpMean} style={{ left: pct(mean) }} title={`Mean: ${mean}`} />
      </div>
      <div className={s.bpLabels}>
        <span style={{ left: '0%' }}>{min}</span>
        <span style={{ left: pct(q1) }}>Q1</span>
        <span style={{ left: pct(median) }}>Med</span>
        <span style={{ left: pct(q3) }}>Q3</span>
        <span style={{ right: '0%', left: 'auto' }}>{max}</span>
      </div>
    </div>
  )
}