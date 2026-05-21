export interface TaxBracket { min: number; max: number; rate: number }
export interface FilingRates {
  single: TaxBracket[]
  married_jointly: TaxBracket[]
  married_separately: TaxBracket[]
  head_of_household: TaxBracket[]
}

export interface CountryData {
  currency: string; symbol: string
  standardDeduction?: Record<string, number>
  brackets: FilingRates | TaxBracket[]
  socialSecurity?: { rate: number; cap: number }
  medicare?: { rate: number; extraRate: number; extraThreshold: number }
  stateRates?: Record<string, number>
}

export const US_2024: CountryData = {
  currency: 'USD', symbol: '$',
  standardDeduction: { single: 14600, married_jointly: 29200, married_separately: 14600, head_of_household: 21900 },
  brackets: {
    single: [
      { min: 0, max: 11600, rate: 0.10 }, { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 }, { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 }, { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ],
    married_jointly: [
      { min: 0, max: 23200, rate: 0.10 }, { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 }, { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 }, { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 },
    ],
    married_separately: [
      { min: 0, max: 11600, rate: 0.10 }, { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 }, { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 }, { min: 243725, max: 365600, rate: 0.35 },
      { min: 365600, max: Infinity, rate: 0.37 },
    ],
    head_of_household: [
      { min: 0, max: 16550, rate: 0.10 }, { min: 16550, max: 63100, rate: 0.12 },
      { min: 63100, max: 100500, rate: 0.22 }, { min: 100500, max: 191950, rate: 0.24 },
      { min: 191950, max: 243700, rate: 0.32 }, { min: 243700, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ],
  } as FilingRates,
  socialSecurity: { rate: 0.062, cap: 168600 },
  medicare: { rate: 0.0145, extraRate: 0.009, extraThreshold: 200000 },
  stateRates: {
    'No State Tax': 0, 'Alabama': 0.05, 'Arizona': 0.025, 'Arkansas': 0.044,
    'California': 0.133, 'Colorado': 0.044, 'Connecticut': 0.0699, 'Delaware': 0.066,
    'Georgia': 0.055, 'Hawaii': 0.11, 'Idaho': 0.058, 'Illinois': 0.0495,
    'Indiana': 0.0315, 'Iowa': 0.057, 'Kansas': 0.057, 'Kentucky': 0.045,
    'Louisiana': 0.0425, 'Maine': 0.0715, 'Maryland': 0.0575, 'Massachusetts': 0.05,
    'Michigan': 0.0425, 'Minnesota': 0.0985, 'Mississippi': 0.047, 'Missouri': 0.048,
    'Montana': 0.059, 'Nebraska': 0.0664, 'New Jersey': 0.1075, 'New Mexico': 0.059,
    'New York': 0.109, 'North Carolina': 0.045, 'North Dakota': 0.025, 'Ohio': 0.035,
    'Oklahoma': 0.0475, 'Oregon': 0.099, 'Pennsylvania': 0.0307, 'Rhode Island': 0.0599,
    'South Carolina': 0.065, 'Utah': 0.0465, 'Vermont': 0.0875, 'Virginia': 0.0575,
    'West Virginia': 0.065, 'Wisconsin': 0.0765,
  },
}

export const UK_2024: CountryData = {
  currency: 'GBP', symbol: '£',
  brackets: [
    { min: 0, max: 12570, rate: 0 }, { min: 12570, max: 50270, rate: 0.20 },
    { min: 50270, max: 125140, rate: 0.40 }, { min: 125140, max: Infinity, rate: 0.45 },
  ],
}

export const CA_2024: CountryData = {
  currency: 'CAD', symbol: 'CA$',
  brackets: [
    { min: 0, max: 55867, rate: 0.15 }, { min: 55867, max: 111733, rate: 0.205 },
    { min: 111733, max: 154906, rate: 0.26 }, { min: 154906, max: 220000, rate: 0.29 },
    { min: 220000, max: Infinity, rate: 0.33 },
  ],
}

export const AU_2024: CountryData = {
  currency: 'AUD', symbol: 'A$',
  brackets: [
    { min: 0, max: 18200, rate: 0 }, { min: 18200, max: 45000, rate: 0.19 },
    { min: 45000, max: 120000, rate: 0.325 }, { min: 120000, max: 180000, rate: 0.37 },
    { min: 180000, max: Infinity, rate: 0.45 },
  ],
}

export const IN_2024: CountryData = {
  currency: 'INR', symbol: '₹',
  brackets: [
    { min: 0, max: 300000, rate: 0 }, { min: 300000, max: 700000, rate: 0.05 },
    { min: 700000, max: 1000000, rate: 0.10 }, { min: 1000000, max: 1200000, rate: 0.15 },
    { min: 1200000, max: 1500000, rate: 0.20 }, { min: 1500000, max: Infinity, rate: 0.30 },
  ],
}

export const COUNTRIES: Record<string, CountryData> = {
  'United States': US_2024,
  'United Kingdom': UK_2024,
  'Canada': CA_2024,
  'Australia': AU_2024,
  'India': IN_2024,
}
