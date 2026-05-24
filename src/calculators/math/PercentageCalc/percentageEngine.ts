export type PctMode =
  | 'whatIsXofY'       // What is X% of Y?
  | 'xIsWhatPctOfY'   // X is what % of Y?
  | 'pctChange'        // % change from X to Y
  | 'pctOf'            // X is Y% of what?

export interface PctResult {
  answer: number
  explanation: string
  formula: string
}

export function calcPercentage(mode: PctMode, a: number, b: number): PctResult {
  switch (mode) {
    case 'whatIsXofY': {
      const answer = (a / 100) * b
      return {
        answer,
        explanation: `${a}% of ${b} = ${a}/100 × ${b} = ${answer.toLocaleString()}`,
        formula: `(${a} ÷ 100) × ${b} = ${answer.toLocaleString()}`,
      }
    }
    case 'xIsWhatPctOfY': {
      const answer = (a / b) * 100
      return {
        answer,
        explanation: `${a} is ${answer.toFixed(4)}% of ${b}`,
        formula: `(${a} ÷ ${b}) × 100 = ${answer.toFixed(4)}%`,
      }
    }
    case 'pctChange': {
      const answer = ((b - a) / Math.abs(a)) * 100
      const dir = answer >= 0 ? 'increase' : 'decrease'
      return {
        answer,
        explanation: `${a} to ${b} is a ${Math.abs(answer).toFixed(4)}% ${dir}`,
        formula: `((${b} - ${a}) ÷ |${a}|) × 100 = ${answer.toFixed(4)}%`,
      }
    }
    case 'pctOf': {
      const answer = (a / b) * 100
      return {
        answer,
        explanation: `${a} is ${b}% of ${answer.toLocaleString()}`,
        formula: `${a} ÷ (${b}/100) = ${answer.toLocaleString()}`,
      }
    }
  }
}