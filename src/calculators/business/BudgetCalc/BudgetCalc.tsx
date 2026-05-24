import { useState, useMemo } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { calcBudget, BUDGET_TEMPLATES, BudgetTemplate, BudgetCategory } from './budgetEngine'
import { CURRENCY_LIST, fmtMoney } from '@/data/currencies'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import s from './BudgetCalc.module.css'

const FAQS = [
  { question: 'What is the 50/30/20 budget rule?', answer: 'The 50/30/20 rule divides after-tax income into three categories: 50% for needs (housing, food, utilities, insurance), 30% for wants (dining out, entertainment, hobbies), and 20% for savings and debt repayment. It\'s a simple, flexible framework popularized by Senator Elizabeth Warren.' },
  { question: 'What is the pay yourself first strategy?', answer: 'Pay yourself first (80/20) means automatically transferring a fixed percentage (typically 20%) to savings before spending on anything else. This removes the temptation to spend first and save what\'s left — which often leaves nothing. Automate savings on payday and live on the rest.' },
  { question: 'How much should I spend on housing?', answer: 'The traditional rule is no more than 28-30% of gross income on housing (rent or mortgage). In expensive cities this may be difficult, but keeping housing under one-third of income helps maintain financial stability. Housing costs include rent/mortgage, utilities, insurance, and property tax.' },
  { question: 'How do I stick to a budget?', answer: 'Track every expense for 30 days to find where money is actually going. Automate savings and bill payments. Use the envelope method (cash or digital) for variable categories. Review monthly and adjust. The best budget is one you can actually maintain — perfectionism is the enemy of budgeting.' },
]

const TEMPLATES: { id: BudgetTemplate; label: string; desc: string }[] = [
  { id: '50_30_20', label: '50/30/20', desc: 'Needs / Wants / Savings' },
  { id: '70_20_10', label: '70/20/10', desc: 'Living / Savings / Giving' },
  { id: '80_20', label: '80/20', desc: 'Pay Yourself First' },
  { id: 'custom', label: 'Custom', desc: '8-category breakdown' },
]

const COLORS = ['#3b82f6','#f59e0b','#10b981','#8b5cf6','#ef4444','#06b6d4','#f97316','#94a3b8']

export default function BudgetCalcPage() {
  const [currency, setCurrency] = useState('USD')
  const [monthlyIncome, setMonthlyIncome] = useState('5000')
  const [template, setTemplate] = useState<BudgetTemplate>('50_30_20')
  const [categories, setCategories] = useState<Omit<BudgetCategory, 'amount'>[]>(
    BUDGET_TEMPLATES['50_30_20']
  )
  const [newLabel, setNewLabel] = useState('')

  const income = parseFloat(monthlyIncome) || 0

  const result = useMemo(() => {
    if (income <= 0) return null
    return calcBudget(income, categories)
  }, [income, categories])

  function applyTemplate(t: BudgetTemplate) {
    setTemplate(t)
    setCategories(BUDGET_TEMPLATES[t].map((c, i) => ({
      ...c, color: COLORS[i % COLORS.length]
    })))
  }

  function updatePct(id: string, val: string) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, pct: parseFloat(val) || 0 } : c))
  }

  function updateLabel(id: string, val: string) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, label: val } : c))
  }

  function addCategory() {
    if (!newLabel.trim()) return
    const id = Date.now().toString()
    setCategories(prev => [...prev, {
      id, label: newLabel.trim(), pct: 0, color: COLORS[prev.length % COLORS.length]
    }])
    setNewLabel('')
    setTemplate('custom')
  }

  function removeCategory(id: string) {
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const totalPct = categories.reduce((sum, c) => sum + c.pct, 0)
  const overBudget = totalPct > 100

  const pieData = result?.categories.filter(c => c.amount > 0).map(c => ({
    name: c.label, value: c.amount, color: c.color,
  })) ?? []

  return (
    <>
      <SEOHead
        title="Budget Allocation Calculator – 50/30/20 & Custom Budget"
        description="Free budget allocation calculator. Try the 50/30/20 rule, 70/20/10, pay yourself first, or build a custom budget. See your breakdown with a pie chart."
        canonical="/business/budget-allocation-calculator"
        faqs={FAQS}
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Business › Personal Finance</p>
            <h1 className={s.h1}>Budget Allocation Calculator</h1>
            <p className={s.sub}>Allocate your income using the 50/30/20 rule, pay-yourself-first, or build a custom budget.</p>
          </div>

          <AdBanner slot="44000000001" />

          {/* Template selector */}
          <div className={s.templateGrid}>
            {TEMPLATES.map(t => (
              <button key={t.id} className={`${s.templateBtn} ${template === t.id ? s.templateActive : ''}`}
                onClick={() => applyTemplate(t.id)}>
                <span className={s.templateName}>{t.label}</span>
                <span className={s.templateDesc}>{t.desc}</span>
              </button>
            ))}
          </div>

          <div className={s.mainGrid}>
            <div className={s.inputCard}>
              <h2 className={s.cardTitle}>Your Budget</h2>

              <div className={s.field}>
                <label className={s.label}>Currency</label>
                <select className={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Monthly Income (after tax)</label>
                <input className={s.input} type="number" value={monthlyIncome}
                  onChange={e => setMonthlyIncome(e.target.value)} min="0" step="100" placeholder="e.g. 5000" />
              </div>

              <div className={s.categoriesSection}>
                <div className={s.catHeader}>
                  <span className={s.catTitle}>Categories</span>
                  <span className={`${s.totalPct} ${overBudget ? s.totalOver : totalPct === 100 ? s.totalOk : ''}`}>
                    {totalPct.toFixed(1)}% / 100%
                  </span>
                </div>

                {categories.map(cat => (
                  <div key={cat.id} className={s.catRow}>
                    <div className={s.catColor} style={{ background: cat.color }} />
                    <input className={s.catLabelInput} type="text" value={cat.label}
                      onChange={e => updateLabel(cat.id, e.target.value)} />
                    <div className={s.catPctWrap}>
                      <input className={s.catPctInput} type="number" value={cat.pct}
                        onChange={e => updatePct(cat.id, e.target.value)} min="0" max="100" step="1" />
                      <span className={s.pctSymbol}>%</span>
                    </div>
                    <button className={s.removeBtn} onClick={() => removeCategory(cat.id)}>×</button>
                  </div>
                ))}

                {/* Add category */}
                <div className={s.addRow}>
                  <input className={s.addInput} type="text" value={newLabel}
                    onChange={e => setNewLabel(e.target.value)} placeholder="New category name"
                    onKeyDown={e => e.key === 'Enter' && addCategory()} />
                  <button className={s.addBtn} onClick={addCategory}>+ Add</button>
                </div>

                {overBudget && (
                  <div className={s.overWarning}>⚠️ Total exceeds 100% by {(totalPct - 100).toFixed(1)}%</div>
                )}
              </div>
            </div>

            {result ? (
              <div className={`${s.resultsCard} animate-in`}>
                <h2 className={s.cardTitle}>Budget Summary</h2>

                <div className={s.incomeSummary}>
                  <div className={s.incomeItem}>
                    <span className={s.incomeLabel}>Monthly Income</span>
                    <span className={s.incomeVal}>{fmtMoney(income, currency)}</span>
                  </div>
                  <div className={s.incomeItem}>
                    <span className={s.incomeLabel}>Allocated</span>
                    <span className={s.incomeVal}>{fmtMoney(result.totalAllocated, currency)}</span>
                  </div>
                  {result.unallocated !== 0 && (
                    <div className={s.incomeItem}>
                      <span className={s.incomeLabel}>{result.unallocated > 0 ? 'Unallocated' : 'Over Budget'}</span>
                      <span className={s.incomeVal} style={{ color: result.unallocated > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {fmtMoney(Math.abs(result.unallocated), currency)}
                      </span>
                    </div>
                  )}
                </div>

                <div className={s.categoryList}>
                  {result.categories.map(cat => (
                    <div key={cat.id} className={s.catResult}>
                      <div className={s.catResultLeft}>
                        <div className={s.catDot} style={{ background: cat.color }} />
                        <span className={s.catName}>{cat.label}</span>
                        <span className={s.catPctBadge}>{cat.pct}%</span>
                      </div>
                      <div className={s.catRight}>
                        <div className={s.catAmountBar}>
                          <div className={s.catBar} style={{ width: `${cat.pct}%`, background: cat.color + '60' }} />
                        </div>
                        <span className={s.catAmount}>{fmtMoney(cat.amount, currency)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={s.annualNote}>
                  <span className={s.annualLabel}>Annual income:</span>
                  <span className={s.annualVal}>{fmtMoney(income * 12, currency)}</span>
                </div>
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyIcon}>💰</div>
                <p>Enter your monthly income to see your budget breakdown.</p>
              </div>
            )}
          </div>

          {result && pieData.length > 0 && (
            <div className={`${s.chartCard} animate-in`}>
              <h2 className={s.chartTitle}>Budget Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={110} strokeWidth={2} stroke="var(--bg-surface)">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtMoney(v, currency)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <article className={s.article}>
            <h2>Choosing a Budget Method</h2>
            <p>The <strong>50/30/20 rule</strong> is the most popular starting point — simple, flexible, and works for most income levels. The <strong>70/20/10</strong> is similar but adds a charitable giving component. <strong>Pay yourself first (80/20)</strong> is ideal if you struggle to save — automate 20% savings before spending anything. The <strong>custom</strong> approach gives granular control for those who want to track exactly where every dollar goes.</p>
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

          <AdBanner slot="44000000002" />
        </div>
      </div>
    </>
  )
}