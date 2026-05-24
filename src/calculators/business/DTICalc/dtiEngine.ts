export interface DebtItem {
  id: string
  label: string
  amount: number
}

export interface DTIResult {
  grossMonthlyIncome: number
  totalMonthlyDebt: number
  frontEndDTI: number   // housing only
  backEndDTI: number    // all debts
  disposableIncome: number
  rating: 'excellent' | 'good' | 'fair' | 'poor' | 'very_poor'
  ratingLabel: string
  ratingColor: string
  maxDebtForTarget: number  // at 36% target
  debtItems: DebtItem[]
}

export function calcDTI(
  grossMonthlyIncome: number,
  housingPayment: number,
  otherDebts: DebtItem[],
): DTIResult {
  const otherTotal = otherDebts.reduce((sum, d) => sum + d.amount, 0)
  const totalMonthlyDebt = housingPayment + otherTotal

  const frontEndDTI = grossMonthlyIncome > 0 ? (housingPayment / grossMonthlyIncome) * 100 : 0
  const backEndDTI = grossMonthlyIncome > 0 ? (totalMonthlyDebt / grossMonthlyIncome) * 100 : 0
  const disposableIncome = grossMonthlyIncome - totalMonthlyDebt
  const maxDebtForTarget = grossMonthlyIncome * 0.36

  let rating: DTIResult['rating']
  let ratingLabel: string
  let ratingColor: string

  if (backEndDTI <= 20) { rating = 'excellent'; ratingLabel = 'Excellent'; ratingColor = 'var(--accent-green)' }
  else if (backEndDTI <= 28) { rating = 'good'; ratingLabel = 'Good'; ratingColor = '#22c55e' }
  else if (backEndDTI <= 36) { rating = 'fair'; ratingLabel = 'Fair'; ratingColor = 'var(--accent-amber)' }
  else if (backEndDTI <= 43) { rating = 'poor'; ratingLabel = 'High'; ratingColor = '#f97316' }
  else { rating = 'very_poor'; ratingLabel = 'Very High'; ratingColor = 'var(--accent-red)' }

  const allItems: DebtItem[] = [
    { id: 'housing', label: 'Housing Payment', amount: housingPayment },
    ...otherDebts,
  ]

  return {
    grossMonthlyIncome: Math.round(grossMonthlyIncome * 100) / 100,
    totalMonthlyDebt: Math.round(totalMonthlyDebt * 100) / 100,
    frontEndDTI: Math.round(frontEndDTI * 100) / 100,
    backEndDTI: Math.round(backEndDTI * 100) / 100,
    disposableIncome: Math.round(disposableIncome * 100) / 100,
    rating,
    ratingLabel,
    ratingColor,
    maxDebtForTarget: Math.round(maxDebtForTarget * 100) / 100,
    debtItems: allItems,
  }
}

export const DEFAULT_DEBTS: DebtItem[] = [
  { id: 'car', label: 'Car Loan', amount: 400 },
  { id: 'student', label: 'Student Loan', amount: 300 },
  { id: 'credit', label: 'Credit Card Min.', amount: 100 },
]

export const DTI_THRESHOLDS = [
  { max: 20, label: '≤ 20%', rating: 'Excellent', desc: 'Very healthy — most lenders will approve' },
  { max: 28, label: '21–28%', rating: 'Good', desc: 'Good — within conventional mortgage front-end limit' },
  { max: 36, label: '29–36%', rating: 'Fair', desc: 'Acceptable — standard back-end limit for most lenders' },
  { max: 43, label: '37–43%', rating: 'High', desc: 'Elevated — FHA limit; some lenders may decline' },
  { max: 100, label: '> 43%', rating: 'Very High', desc: 'Too high — difficulty qualifying for most loans' },
]