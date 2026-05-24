export interface RetirementResult {
  nestedEgg: number
  totalContributions: number
  totalInterest: number
  monthlyIncomeAvailable: number
  yearsOfIncome: number
  savingsPhase: { year: number; age: number; balance: number; contribution: number; interest: number }[]
  withdrawalPhase: { year: number; age: number; balance: number; withdrawal: number }[]
}

export function calcRetirement(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  currentSavings: number,
  monthlyContribution: number,
  annualReturnPct: number,       // during savings
  withdrawalReturnPct: number,   // during retirement (conservative)
  desiredMonthlyIncome: number
): RetirementResult {
  const savingsYears = retirementAge - currentAge
  const retirementYears = lifeExpectancy - retirementAge
  const monthlyRate = annualReturnPct / 100 / 12
  const withdrawalMonthlyRate = withdrawalReturnPct / 100 / 12

  // Savings phase - month by month → summarize by year
  let balance = currentSavings
  let totalContributions = currentSavings
  let totalInterest = 0
  const savingsPhase = []

  for (let y = 1; y <= savingsYears; y++) {
    let yearInterest = 0
    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate
      balance += interest + monthlyContribution
      yearInterest += interest
    }
    totalContributions += monthlyContribution * 12
    totalInterest += yearInterest
    savingsPhase.push({
      year: y,
      age: currentAge + y,
      balance: Math.round(balance),
      contribution: Math.round(monthlyContribution * 12),
      interest: Math.round(yearInterest),
    })
  }

  const nestedEgg = Math.round(balance)

  // How long will savings last at desired withdrawal?
  // Max monthly income the nest egg can sustain indefinitely (at withdrawal rate)
  const maxMonthlyIncome = withdrawalMonthlyRate > 0
    ? balance * withdrawalMonthlyRate / (1 - Math.pow(1 + withdrawalMonthlyRate, -retirementYears * 12))
    : balance / (retirementYears * 12)

  // Withdrawal phase
  const withdrawalPhase = []
  let wBalance = balance
  const monthlyWithdrawal = desiredMonthlyIncome

  for (let y = 1; y <= retirementYears; y++) {
    for (let m = 0; m < 12; m++) {
      const interest = wBalance * withdrawalMonthlyRate
      wBalance += interest - monthlyWithdrawal
      if (wBalance <= 0) { wBalance = 0; break }
    }
    withdrawalPhase.push({
      year: y,
      age: retirementAge + y,
      balance: Math.round(Math.max(0, wBalance)),
      withdrawal: Math.round(monthlyWithdrawal * 12),
    })
    if (wBalance <= 0) break
  }

  // How many years will savings last?
  let yearsOfIncome = 0
  if (withdrawalMonthlyRate > 0 && monthlyWithdrawal > 0) {
    yearsOfIncome = Math.log(monthlyWithdrawal / (monthlyWithdrawal - balance * withdrawalMonthlyRate)) /
      (12 * Math.log(1 + withdrawalMonthlyRate))
  } else if (monthlyWithdrawal > 0) {
    yearsOfIncome = balance / (monthlyWithdrawal * 12)
  }

  return {
    nestedEgg,
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(totalInterest),
    monthlyIncomeAvailable: Math.round(maxMonthlyIncome),
    yearsOfIncome: Math.round(yearsOfIncome * 10) / 10,
    savingsPhase,
    withdrawalPhase,
  }
}