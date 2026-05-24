export interface PaypalFeeResult {
  originalAmount: number
  feeAmount: number
  netAmount: number        // what you receive
  grossNeeded: number      // what to charge to receive originalAmount
  feeRate: number
  fixedFee: number
  effectiveRate: number
}

export interface PaypalFeeType {
  id: string
  label: string
  desc: string
  rate: number        // percentage
  fixed: number       // fixed fee in USD
  fixedCurrency: string
  domestic: boolean
}

// PayPal fee structures (approximate, as of 2024)
export const PAYPAL_FEE_TYPES: PaypalFeeType[] = [
  {
    id: 'standard_checkout',
    label: 'PayPal Checkout (Online)',
    desc: 'Standard online payments via PayPal button or checkout',
    rate: 3.49, fixed: 0.49, fixedCurrency: 'USD', domestic: true,
  },
  {
    id: 'send_receive',
    label: 'Send / Receive Money (Business)',
    desc: 'Business or personal payments via PayPal',
    rate: 2.99, fixed: 0.49, fixedCurrency: 'USD', domestic: true,
  },
  {
    id: 'card_present',
    label: 'Card Present (In-Person)',
    desc: 'In-person payments with PayPal card reader',
    rate: 2.29, fixed: 0.09, fixedCurrency: 'USD', domestic: true,
  },
  {
    id: 'qr_code',
    label: 'QR Code Payments',
    desc: 'Payments made via PayPal QR code',
    rate: 1.90, fixed: 0.10, fixedCurrency: 'USD', domestic: true,
  },
  {
    id: 'invoicing',
    label: 'Invoicing',
    desc: 'Payments received through PayPal invoices',
    rate: 3.49, fixed: 0.49, fixedCurrency: 'USD', domestic: true,
  },
  {
    id: 'micropayments',
    label: 'Micropayments',
    desc: 'For transactions under $10 (lower fixed, higher rate)',
    rate: 4.99, fixed: 0.09, fixedCurrency: 'USD', domestic: true,
  },
  {
    id: 'international',
    label: 'International Payments',
    desc: 'Receiving from a different country (additional cross-border fee)',
    rate: 4.99, fixed: 0.49, fixedCurrency: 'USD', domestic: false,
  },
  {
    id: 'venmo_business',
    label: 'Venmo Business Profile',
    desc: 'Payments to a Venmo business profile',
    rate: 1.90, fixed: 0.10, fixedCurrency: 'USD', domestic: true,
  },
]

export function calcPaypalFee(
  amount: number,
  feeType: PaypalFeeType,
  currency: string = 'USD',
): PaypalFeeResult {
  const rate = feeType.rate / 100
  const fixed = feeType.fixed

  // Fee = Amount * rate + fixed
  const feeAmount = amount * rate + fixed
  const netAmount = amount - feeAmount

  // To receive `amount` after fees: gross = (amount + fixed) / (1 - rate)
  const grossNeeded = (amount + fixed) / (1 - rate)
  const effectiveRate = amount > 0 ? (feeAmount / amount) * 100 : 0

  return {
    originalAmount: Math.round(amount * 100) / 100,
    feeAmount: Math.round(feeAmount * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
    grossNeeded: Math.round(grossNeeded * 100) / 100,
    feeRate: feeType.rate,
    fixedFee: fixed,
    effectiveRate: Math.round(effectiveRate * 1000) / 1000,
  }
}

export function buildFeeSchedule(
  feeType: PaypalFeeType,
): { amount: number; fee: number; net: number }[] {
  const amounts = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
  return amounts.map(amount => {
    const r = calcPaypalFee(amount, feeType)
    return { amount, fee: r.feeAmount, net: r.netAmount }
  })
}