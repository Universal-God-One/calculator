export interface BillableRateResult {
  minimumHourlyRate: number
  recommendedRate: number
  annualRevenue: number
  monthlyRevenue: number
  effectiveHourlyRate: number
  billableHoursPerYear: number
  billableHoursPerWeek: number
  utilizationRate: number
  // Cost breakdown
  annualExpenses: number
  annualSalaryTarget: number
  annualTax: number
  totalAnnualCost: number
  profitBuffer: number
  // Breakdowns
  dailyRate: number
  weeklyRate: number
  projectRate: (hours: number) => number
}

export function calcBillableRate(
  annualSalaryTarget: number,
  weeklyHours: number,
  weeksPerYear: number,
  billableHoursPercentage: number,
  annualExpenses: number,
  taxRate: number,
  profitMarginPct: number,
): BillableRateResult {
  const totalWorkingHours = weeklyHours * weeksPerYear
  const billableHoursPerYear = totalWorkingHours * (billableHoursPercentage / 100)
  const billableHoursPerWeek = weeklyHours * (billableHoursPercentage / 100)
  const utilizationRate = billableHoursPercentage

  // Tax grossed up salary: to net salaryTarget after tax
  const annualTax = annualSalaryTarget * (taxRate / 100)
  const grossedSalary = annualSalaryTarget + annualTax

  // Total cost including expenses
  const totalCost = grossedSalary + annualExpenses

  // Add profit margin
  const totalWithProfit = totalCost / (1 - profitMarginPct / 100)
  const profitBuffer = totalWithProfit - totalCost

  // Minimum rate just to break even
  const minimumHourlyRate = billableHoursPerYear > 0 ? totalCost / billableHoursPerYear : 0

  // Recommended rate including profit
  const recommendedRate = billableHoursPerYear > 0 ? totalWithProfit / billableHoursPerYear : 0

  const annualRevenue = recommendedRate * billableHoursPerYear
  const monthlyRevenue = annualRevenue / 12
  const effectiveHourlyRate = totalWorkingHours > 0 ? annualRevenue / totalWorkingHours : 0

  return {
    minimumHourlyRate: Math.round(minimumHourlyRate * 100) / 100,
    recommendedRate: Math.round(recommendedRate * 100) / 100,
    annualRevenue: Math.round(annualRevenue * 100) / 100,
    monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
    billableHoursPerYear: Math.round(billableHoursPerYear * 10) / 10,
    billableHoursPerWeek: Math.round(billableHoursPerWeek * 10) / 10,
    utilizationRate,
    annualExpenses,
    annualSalaryTarget,
    annualTax: Math.round(annualTax * 100) / 100,
    totalAnnualCost: Math.round(totalCost * 100) / 100,
    profitBuffer: Math.round(profitBuffer * 100) / 100,
    dailyRate: Math.round(recommendedRate * 8 * 100) / 100,
    weeklyRate: Math.round(recommendedRate * billableHoursPerWeek * 100) / 100,
    projectRate: (hours: number) => Math.round(recommendedRate * hours * 100) / 100,
  }
}

export const INDUSTRY_RATES: { role: string; low: number; high: number; currency: string }[] = [
  { role: 'Web Developer', low: 75, high: 200, currency: 'USD' },
  { role: 'UX/UI Designer', low: 65, high: 175, currency: 'USD' },
  { role: 'Copywriter', low: 50, high: 150, currency: 'USD' },
  { role: 'Marketing Consultant', low: 75, high: 250, currency: 'USD' },
  { role: 'Business Consultant', low: 100, high: 350, currency: 'USD' },
  { role: 'Software Architect', low: 125, high: 300, currency: 'USD' },
  { role: 'Data Scientist', low: 100, high: 275, currency: 'USD' },
  { role: 'SEO Specialist', low: 50, high: 150, currency: 'USD' },
  { role: 'Video Editor', low: 50, high: 150, currency: 'USD' },
  { role: 'Accountant / CPA', low: 75, high: 200, currency: 'USD' },
]