export interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  effectiveRate: number
  apr: number
  schedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export function calcBusinessLoan(
  loanAmount: number,
  annualRate: number,
  termMonths: number,
  originationFeePct: number = 0,
): LoanResult {
  const mr = annualRate / 100 / 12
  const n = termMonths
  const originationFee = loanAmount * originationFeePct / 100
  const financedAmount = loanAmount // fee typically paid upfront, not financed

  const monthlyPayment = mr === 0
    ? financedAmount / n
    : financedAmount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)

  let balance = financedAmount
  let totalInterest = 0
  const schedule = []

  for (let m = 1; m <= n; m++) {
    const interest = balance * mr
    const principal = Math.min(balance, monthlyPayment - interest)
    balance = Math.max(0, balance - principal)
    totalInterest += interest
    schedule.push({
      month: m,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
    if (balance <= 0) break
  }

  const totalPayment = monthlyPayment * n + originationFee
  const totalCost = totalInterest + originationFee

  // APR calculation including origination fee
  // APR: solve for rate in PV = PMT * (1-(1+r)^-n)/r where PV = loanAmount - fee
  let apr = annualRate
  if (originationFee > 0) {
    const netProceeds = loanAmount - originationFee
    let r = annualRate / 100 / 12
    for (let i = 0; i < 100; i++) {
      const pv = monthlyPayment * (1 - Math.pow(1 + r, -n)) / r
      const dpv = monthlyPayment * (
        (n * Math.pow(1 + r, -n - 1)) / r -
        (1 - Math.pow(1 + r, -n)) / (r * r)
      )
      const f = pv - netProceeds
      if (Math.abs(f) < 0.01) break
      r -= f / dpv
    }
    apr = r * 12 * 100
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalCost * 100) / 100,
    effectiveRate: Math.round((totalCost / loanAmount) * 10000) / 100,
    apr: Math.round(apr * 100) / 100,
    schedule,
  }
}