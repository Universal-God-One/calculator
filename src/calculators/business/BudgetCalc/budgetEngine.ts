export interface BudgetCategory {
  id: string
  label: string
  pct: number
  color: string
  amount: number
}

export interface BudgetResult {
  totalIncome: number
  categories: BudgetCategory[]
  totalAllocated: number
  unallocated: number
  unallocatedPct: number
  isBalanced: boolean
}

export type BudgetTemplate = '50_30_20' | '70_20_10' | '80_20' | 'custom'

export const BUDGET_TEMPLATES: Record<BudgetTemplate, Omit<BudgetCategory, 'amount'>[]> = {
  '50_30_20': [
    { id: 'needs', label: 'Needs (Housing, Food, Bills)', pct: 50, color: '#3b82f6' },
    { id: 'wants', label: 'Wants (Entertainment, Dining)', pct: 30, color: '#f59e0b' },
    { id: 'savings', label: 'Savings & Debt Repayment', pct: 20, color: '#10b981' },
  ],
  '70_20_10': [
    { id: 'living', label: 'Living Expenses', pct: 70, color: '#3b82f6' },
    { id: 'savings', label: 'Savings', pct: 20, color: '#10b981' },
    { id: 'giving', label: 'Giving / Charity', pct: 10, color: '#8b5cf6' },
  ],
  '80_20': [
    { id: 'expenses', label: 'All Expenses', pct: 80, color: '#3b82f6' },
    { id: 'savings', label: 'Pay Yourself First (Savings)', pct: 20, color: '#10b981' },
  ],
  'custom': [
    { id: 'housing', label: 'Housing', pct: 30, color: '#3b82f6' },
    { id: 'food', label: 'Food & Groceries', pct: 15, color: '#f59e0b' },
    { id: 'transport', label: 'Transportation', pct: 10, color: '#8b5cf6' },
    { id: 'utilities', label: 'Utilities & Bills', pct: 10, color: '#ef4444' },
    { id: 'healthcare', label: 'Healthcare', pct: 5, color: '#06b6d4' },
    { id: 'entertainment', label: 'Entertainment', pct: 5, color: '#f97316' },
    { id: 'savings', label: 'Savings', pct: 15, color: '#10b981' },
    { id: 'other', label: 'Other', pct: 10, color: '#94a3b8' },
  ],
}

export function calcBudget(
  monthlyIncome: number,
  categories: Omit<BudgetCategory, 'amount'>[],
): BudgetResult {
  const cats = categories.map(c => ({
    ...c,
    amount: Math.round(monthlyIncome * c.pct / 100 * 100) / 100,
  }))
  const totalPct = categories.reduce((sum, c) => sum + c.pct, 0)
  const totalAllocated = Math.round(monthlyIncome * totalPct / 100 * 100) / 100
  const unallocated = Math.round((monthlyIncome - totalAllocated) * 100) / 100

  return {
    totalIncome: monthlyIncome,
    categories: cats,
    totalAllocated,
    unallocated,
    unallocatedPct: Math.round((unallocated / monthlyIncome) * 10000) / 100,
    isBalanced: Math.abs(totalPct - 100) < 0.01,
  }
}