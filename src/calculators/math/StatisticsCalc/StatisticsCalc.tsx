import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcStats, parseValues, parseWeights } from './statisticsEngine'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ReferenceLine,
} from 'recharts'
import s from './StatisticsCalc.module.css'

type Tab = 'summary' | 'frequency' | 'percentiles' | 'zscores'

const SAMPLES = {
  'Exam scores': '72, 85, 91, 68, 77, 88, 95, 73, 80, 84, 90, 76, 62, 88, 71',
  'Monthly sales': '1200, 1450, 980, 1320, 1580, 1100, 1420, 1650, 1280, 1390, 2100',
  'With outlier': '10, 12, 11, 13, 10, 12, 11, 12, 10, 11, 85',
}

function r(n: number, d = 4) { return +n.toFixed(d) }

export default function StatisticsCalcPage() {
  const [rawInput, setRawInput] = useState('72, 85, 91, 68, 77, 88, 95, 73, 80, 84, 90, 76, 62, 88, 71')
  const [weightInput, setWeightInput] = useState('')
  const [showWeights, setShowWeights] = useState(false)
  const [tab, setTab] = useState<Tab>('summary')

  const { values, weights, result, error } = useMemo(() => {
    const values = parseValues(rawInput)
    if (values.length < 2) return { values, weights: [], result: null, error: 'Enter at least 2 values.' }
    const weights = showWeights ? parseWeights(weightInput) : []
    const w = weights.length === values.length ? weights : undefined
    try {
      return { values, weights, result: calcStats(values, w), error: null }
    } catch (e) {
      return { values, weights, result: null, error: String(e) }
    }
  }, [rawInput, weightInput, showWeights])

  // Histogram buckets
  const histData = useMemo(() => {
    if (!result || values.length < 2) return []
    const buckets = Math.min(Math.ceil(Math.sqrt(values.length)), 12)
    const range = result.max - result.min || 1
    const width = range / buckets
    const bins = Array.from({ length: buckets }, (_, i) => ({
      from: result.min + i * width,
      to: result.min + (i + 1) * width,
      count: 0,
    }))
    for (const v of values) {
      const idx = Math.min(Math.floor((v - result.min) / width), buckets - 1)
      bins[idx].count++
    }
    return bins.map(b => ({
      label: `${r(b.from, 1)}–${r(b.to, 1)}`,
      count: b.count,
      midpoint: r((b.from + b.to) / 2, 2),
    }))
  }, [result, values])

  const dotData = useMemo(() => {
    if (!result) return []
    return values.map((v, i) => ({ x: v, y: 1, z: result.outliers.includes(v) ? 2 : 1, i }))
  }, [values, result])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'frequency', label: 'Frequency Table' },
    { id: 'percentiles', label: 'Percentiles' },
    { id: 'zscores', label: 'Z-Scores' },
  ]

  return (
    <>
      <SEOHead
        title="Statistics Calculator – Mean, Median, Mode, Skewness & More"
        description="Free statistics calculator. Calculate mean, median, mode, variance, standard deviation, skewness, kurtosis, quartiles, outliers, z-scores, and frequency table."
        canonical="/math/statistics-calculator"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>Math › Statistics</p>
            <h1 className={s.h1}>Statistics Calculator</h1>
            <p className={s.sub}>Complete descriptive statistics — mean, median, variance, skewness, outliers, z-scores, frequency table, and more.</p>
          </div>

          <AdBanner slot="32000000001" />

          {/* Input */}
          <div className={s.inputCard}>
            <div className={s.inputHeader}>
              <h2 className={s.cardTitle}>Data Input</h2>
              <div className={s.sampleRow}>
                {Object.entries(SAMPLES).map(([name, data]) => (
                  <button key={name} className={s.sampleBtn} onClick={() => setRawInput(data)}>{name}</button>
                ))}
              </div>
            </div>
            <textarea
              className={s.dataInput}
              value={rawInput}
              onChange={e => setRawInput(e.target.value)}
              placeholder="Enter numbers separated by commas, spaces, or new lines"
              rows={3}
            />
            <div className={s.weightToggle}>
              <input type="checkbox" id="wt" checked={showWeights} onChange={e => setShowWeights(e.target.checked)} className={s.check} />
              <label htmlFor="wt" className={s.checkLabel}>Use custom weights (weighted mean)</label>
            </div>
            {showWeights && (
              <textarea
                className={s.dataInput}
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                placeholder="Enter weights (same count as data values)"
                rows={2}
              />
            )}
            {result && (
              <div className={s.meta}>
                <span>{result.count} values</span>
                <span>Min: {r(result.min)}</span>
                <span>Max: {r(result.max)}</span>
                {result.outliers.length > 0 && (
                  <span className={s.outWarn}>⚠️ {result.outliers.length} outlier{result.outliers.length > 1 ? 's' : ''}: {result.outliers.join(', ')}</span>
                )}
              </div>
            )}
            {error && <p className={s.errorMsg}>{error}</p>}
          </div>

          {result && (
            <>
              {/* Histogram */}
              <div className={`${s.chartCard} animate-in`}>
                <h2 className={s.chartTitle}>Histogram</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={histData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} angle={-30} textAnchor="end" />
                    <YAxis allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={28} />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Box plot */}
              <div className={`${s.chartCard} animate-in`}>
                <h2 className={s.chartTitle}>Box Plot</h2>
                <BoxPlot result={result} />
              </div>

              {/* Tabs */}
              <div className={s.tabs}>
                {TABS.map(t => (
                  <button key={t.id} className={`${s.tab} ${tab === t.id ? s.tabActive : ''}`}
                    onClick={() => setTab(t.id)}>{t.label}</button>
                ))}
              </div>

              {tab === 'summary' && (
                <div className={`${s.tableCard} animate-in`}>
                  <div className={s.statsGrid}>
                    <Section title="Central Tendency">
                      <Row label="Mean (x̄)" value={r(result.mean)} />
                      <Row label="Median" value={r(result.median)} />
                      <Row label="Mode" value={result.mode.length ? result.mode.join(', ') : 'None'} />
                      <Row label="Trimmed Mean (5%)" value={r(result.trimmedMean)} />
                      {result.weightedMean !== null && <Row label="Weighted Mean" value={r(result.weightedMean)} />}
                    </Section>
                    <Section title="Spread">
                      <Row label="Std Dev — Sample (s)" value={r(result.stddev_s)} green />
                      <Row label="Std Dev — Population (σ)" value={r(result.stddev_p)} />
                      <Row label="Variance — Sample (s²)" value={r(result.variance_s)} />
                      <Row label="Variance — Population (σ²)" value={r(result.variance_p)} />
                      <Row label="Std Error of Mean" value={r(result.sem)} />
                      <Row label="Coeff. of Variation" value={`${r(result.cv, 2)}%`} />
                      <Row label="Range" value={r(result.range)} />
                      <Row label="IQR" value={r(result.iqr)} />
                    </Section>
                    <Section title="Shape">
                      <Row label="Skewness" value={r(result.skewness)}
                        note={result.skewness > 0.5 ? 'right-skewed' : result.skewness < -0.5 ? 'left-skewed' : 'approx. symmetric'} />
                      <Row label="Excess Kurtosis" value={r(result.kurtosis)}
                        note={result.kurtosis > 1 ? 'leptokurtic' : result.kurtosis < -1 ? 'platykurtic' : 'approx. normal'} />
                    </Section>
                    <Section title="Five-Number Summary">
                      <Row label="Min" value={r(result.min)} />
                      <Row label="Q1 (25th)" value={r(result.q1)} />
                      <Row label="Median (50th)" value={r(result.median)} />
                      <Row label="Q3 (75th)" value={r(result.q3)} />
                      <Row label="Max" value={r(result.max)} />
                    </Section>
                    <Section title="Count">
                      <Row label="n" value={result.count} />
                      <Row label="Sum" value={r(result.sum)} />
                      <Row label="Outliers" value={result.outliers.length || 'None'} />
                    </Section>
                  </div>
                </div>
              )}

              {tab === 'frequency' && (
                <div className={`${s.tableCard} animate-in`}>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead><tr><th>Value</th><th>Count</th><th>Rel. Frequency</th><th>Cumulative %</th></tr></thead>
                      <tbody>
                        {result.frequencies.map((row, i) => (
                          <tr key={i}>
                            <td className={s.mono}>{row.value}</td>
                            <td className={s.mono}>{row.count}</td>
                            <td className={s.mono}>{(row.relFreq * 100).toFixed(2)}%</td>
                            <td className={s.mono}>{(row.cumFreq * 100).toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'percentiles' && (
                <div className={`${s.tableCard} animate-in`}>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead><tr><th>Percentile</th><th>Value</th></tr></thead>
                      <tbody>
                        {result.percentiles.map(row => (
                          <tr key={row.p}>
                            <td className={s.mono}>P{row.p}</td>
                            <td className={s.mono}>{r(row.value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'zscores' && (
                <div className={`${s.tableCard} animate-in`}>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead><tr><th>#</th><th>Value</th><th>Z-Score</th><th>Outlier?</th></tr></thead>
                      <tbody>
                        {values.map((v, i) => (
                          <tr key={i} className={result.outliers.includes(v) ? s.outRow : ''}>
                            <td className={s.mono}>{i + 1}</td>
                            <td className={s.mono}>{v}</td>
                            <td className={s.mono} style={{ color: Math.abs(result.zScores[i]) > 2 ? 'var(--accent-amber)' : undefined }}>
                              {r(result.zScores[i])}
                            </td>
                            <td>{result.outliers.includes(v) ? '⚠️ Yes' : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          <AdBanner slot="32000000002" />
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={s.section}>
      <h3 className={s.sectionTitle}>{title}</h3>
      {children}
    </div>
  )
}

function Row({ label, value, green, note }: { label: string; value: string | number; green?: boolean; note?: string }) {
  return (
    <div className={s.statRow}>
      <span className={s.statLabel}>{label}{note && <span className={s.statNote}> ({note})</span>}</span>
      <span className={s.statValue} style={green ? { color: 'var(--accent-green)' } : {}}>{value}</span>
    </div>
  )
}

function BoxPlot({ result }: { result: import('./statisticsEngine').DescriptiveStats }) {
  const { min, q1, median, q3, max, mean, outliers } = result
  const lo = q1 - 1.5 * result.iqr, hi = q3 + 1.5 * result.iqr
  const wMin = result.sorted.find(v => v >= lo) ?? min
  const wMax = [...result.sorted].reverse().find(v => v <= hi) ?? max
  const range = max - min || 1
  const pct = (v: number) => `${Math.max(0, Math.min(100, ((v - min) / range) * 100))}%`
  return (
    <div className={s.boxPlot}>
      <div className={s.bpTrack}>
        <div className={s.bpWL} style={{ left: pct(wMin), width: `calc(${pct(q1)} - ${pct(wMin)})` }} />
        <div className={s.bpBox} style={{ left: pct(q1), width: `calc(${pct(q3)} - ${pct(q1)})` }}>
          <div className={s.bpMed} style={{ left: `${((median - q1) / (q3 - q1 || 1)) * 100}%` }} />
        </div>
        <div className={s.bpWR} style={{ left: pct(q3), width: `calc(${pct(wMax)} - ${pct(q3)})` }} />
        <div className={s.bpMean} style={{ left: pct(mean) }} title={`Mean: ${r(mean)}`} />
        {outliers.map((o, i) => (
          <div key={i} className={s.bpOutlier} style={{ left: pct(o) }} title={`Outlier: ${o}`} />
        ))}
      </div>
      <div className={s.bpLabels}>
        {[{ v: wMin, l: r(wMin) }, { v: q1, l: 'Q1' }, { v: median, l: 'Med' }, { v: q3, l: 'Q3' }, { v: wMax, l: r(wMax) }].map(({ v, l }) => (
          <span key={l} style={{ position: 'absolute', left: pct(v), transform: 'translateX(-50%)', fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l}</span>
        ))}
      </div>
    </div>
  )
}