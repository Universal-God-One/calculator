export interface K401Result {
  finalBalance: number
  totalContributions: number
  totalEmployerMatch: number
  totalInterest: number
  schedule: {
    year: number
    age: number
    balance: number
    contribution: number
    employerMatch: number
    interest: number
  }[]
}

export function calc401k(
  currentAge: number,
  retirementAge: number,
  currentBalance: number,
  annualSalary: number,
  contributionPct: number,   // % of salary you contribute
  employerMatchPct: number,  // % employer matches
  employerMatchLimit: number, // max % of salary employer matches
  annualReturn: number
): K401Result {
  const years = retirementAge - currentAge
  const monthlyRate = annualReturn / 100 / 12
  const annualContribution = annualSalary * (contributionPct / 100)
  const annualEmployerMatch = annualSalary * (Math.min(contributionPct, employerMatchLimit) / 100) * (employerMatchPct / 100)

  let balance = currentBalance
  let totalContributions = currentBalance
  let totalEmployerMatch = 0
  let totalInterest = 0
  const schedule = []

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0
    const monthlyContrib = (annualContribution + annualEmployerMatch) / 12

    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate
      balance += interest + monthlyContrib
      yearInterest += interest
    }

    totalContributions += annualContribution
    totalEmployerMatch += annualEmployerMatch
    totalInterest += yearInterest

    schedule.push({
      year: y,
      age: currentAge + y,
      balance: Math.round(balance),
      contribution: Math.round(annualContribution),
      employerMatch: Math.round(annualEmployerMatch),
      interest: Math.round(yearInterest),
    })
  }

  return {
    finalBalance: Math.round(balance),
    totalContributions: Math.round(totalContributions),
    totalEmployerMatch: Math.round(totalEmployerMatch),
    totalInterest: Math.round(totalInterest),
    schedule,
  }
}