export interface DivisionStep {
  stepNum: number
  currentDividend: number    // number being divided this step
  quotientDigit: number      // digit added to quotient
  product: number            // quotientDigit × divisor
  remainder: number          // currentDividend - product
  bringDown: number | null   // next digit brought down
  newDividend: number        // remainder after bringing down
}

export interface LongDivisionResult {
  dividend: number
  divisor: number
  quotient: number
  remainder: number
  quotientStr: string        // including decimal
  isExact: boolean
  decimalPlaces: number
  steps: DivisionStep[]
  verification: string
}

export function calcLongDivision(
  dividend: number,
  divisor: number,
  maxDecimalPlaces = 6
): LongDivisionResult {
  if (divisor === 0) throw new Error('Division by zero')

  const isNegative = (dividend < 0) !== (divisor < 0)
  const absDividend = Math.abs(dividend)
  const absDivisor = Math.abs(divisor)

  const dividendStr = String(absDividend)
  const steps: DivisionStep[] = []

  let quotientDigits: number[] = []
  let currentRemainder = 0
  let decimalPlaces = 0
  let pastDecimal = false
  let stepNum = 1

  // Process integer part digit by digit
  for (let i = 0; i < dividendStr.length; i++) {
    const digit = parseInt(dividendStr[i])
    currentRemainder = currentRemainder * 10 + digit
    const qDigit = Math.floor(currentRemainder / absDivisor)
    const product = qDigit * absDivisor
    const newRem = currentRemainder - product
    const bringDown = i < dividendStr.length - 1 ? parseInt(dividendStr[i + 1]) : null

    steps.push({
      stepNum: stepNum++,
      currentDividend: currentRemainder,
      quotientDigit: qDigit,
      product,
      remainder: newRem,
      bringDown,
      newDividend: bringDown !== null ? newRem * 10 + bringDown : newRem,
    })
    quotientDigits.push(qDigit)
    currentRemainder = newRem
  }

  // Handle decimal places
  const seen = new Set<number>()
  while (currentRemainder !== 0 && decimalPlaces < maxDecimalPlaces) {
    if (seen.has(currentRemainder)) break
    seen.add(currentRemainder)
    if (!pastDecimal) { pastDecimal = true }
    currentRemainder *= 10
    const qDigit = Math.floor(currentRemainder / absDivisor)
    const product = qDigit * absDivisor
    const newRem = currentRemainder - product

    steps.push({
      stepNum: stepNum++,
      currentDividend: currentRemainder,
      quotientDigit: qDigit,
      product,
      remainder: newRem,
      bringDown: null,
      newDividend: newRem,
    })
    quotientDigits.push(qDigit)
    currentRemainder = newRem
    decimalPlaces++
  }

  const integerDigits = quotientDigits.slice(0, dividendStr.length)
  const decimalDigits = quotientDigits.slice(dividendStr.length)

  let quotientStr = integerDigits.join('') || '0'
  if (decimalDigits.length > 0) {
    quotientStr += '.' + decimalDigits.join('')
  }
  if (isNegative) quotientStr = '-' + quotientStr

  const quotient = Math.floor(absDividend / absDivisor)
  const remainder = absDividend % absDivisor

  return {
    dividend,
    divisor,
    quotient: isNegative ? -quotient : quotient,
    remainder,
    quotientStr,
    isExact: remainder === 0,
    decimalPlaces,
    steps,
    verification: `${quotient} × ${absDivisor} + ${remainder} = ${quotient * absDivisor + remainder}`,
  }
}