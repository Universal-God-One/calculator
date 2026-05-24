export interface RothIRAResult {
  finalBalance: number
  totalContributions: number
  totalInterest: number
  taxFreeSavings: number
  schedule: {
    year: number
    age: number
    balance: number
    contribution: number
    interest: number
  }[]
}

export function calcRothIRA(
  currentAge: number,
  retirementAge: number,
  currentBalance: number,
  annualContribution: number,
  annualReturn: number
): RothIRAResult {
  const IRS_LIMIT_2024 = 7000
  const IRS_LIMIT_50_PLUS = 8000
  const years = retirementAge - currentAge
  const monthlyRate = annualReturn / 100 / 12

  let balance = currentBalance
  let totalContributions = currentBalance
  let totalInterest = 0
  const schedule = []

  for (let y = 1; y <= years; y++) {
    const age = currentAge + y
    const limit = age >= 50 ? IRS_LIMIT_50_PLUS : IRS_LIMIT_2024
    const yearContrib = Math.min(annualContribution, limit)
    const monthlyContrib = yearContrib / 12
    let yearInterest = 0

    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate
      balance += interest + monthlyContrib
      yearInterest += interest
    }

    totalContributions += yearContrib
    totalInterest += yearInterest

    schedule.push({
      year: y,
      age,
      balance: Math.round(balance),
      contribution: Math.round(yearContrib),
      interest: Math.round(yearInterest),
    })
  }

  return {
    finalBalance: Math.round(balance),
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(totalInterest),
    taxFreeSavings: Math.round(balance),
    schedule,
  }
}

// Traditional IRA comparison (taxable at withdrawal)
export function calcTraditionalIRA(
  finalBalance: number,
  taxRateAtWithdrawal: number
): number {
  return finalBalance * (1 - taxRateAtWithdrawal / 100)
}