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

// United Kingdom
export const UK_2024: CountryData = {
  currency: 'GBP', symbol: '£',
  brackets: [
    { min: 0, max: 12570, rate: 0 }, { min: 12570, max: 50270, rate: 0.20 },
    { min: 50270, max: 125140, rate: 0.40 }, { min: 125140, max: Infinity, rate: 0.45 },
  ],
}

// Canada
export const CA_2024: CountryData = {
  currency: 'CAD', symbol: 'CA$',
  brackets: [
    { min: 0, max: 55867, rate: 0.15 }, { min: 55867, max: 111733, rate: 0.205 },
    { min: 111733, max: 154906, rate: 0.26 }, { min: 154906, max: 220000, rate: 0.29 },
    { min: 220000, max: Infinity, rate: 0.33 },
  ],
}

// Australia
export const AU_2024: CountryData = {
  currency: 'AUD', symbol: 'A$',
  brackets: [
    { min: 0, max: 18200, rate: 0 }, { min: 18200, max: 45000, rate: 0.19 },
    { min: 45000, max: 120000, rate: 0.325 }, { min: 120000, max: 180000, rate: 0.37 },
    { min: 180000, max: Infinity, rate: 0.45 },
  ],
}

// India (New Regime)
export const IN_2024: CountryData = {
  currency: 'INR', symbol: '₹',
  brackets: [
    { min: 0, max: 300000, rate: 0 }, { min: 300000, max: 700000, rate: 0.05 },
    { min: 700000, max: 1000000, rate: 0.10 }, { min: 1000000, max: 1200000, rate: 0.15 },
    { min: 1200000, max: 1500000, rate: 0.20 }, { min: 1500000, max: Infinity, rate: 0.30 },
  ],
}

// Germany
export const DE_2024: CountryData = {
  currency: 'EUR', symbol: '€',
  brackets: [
    { min: 0, max: 11604, rate: 0 }, { min: 11604, max: 17006, rate: 0.14 },
    { min: 17006, max: 66761, rate: 0.24 }, { min: 66761, max: 277826, rate: 0.42 },
    { min: 277826, max: Infinity, rate: 0.45 },
  ],
}

// France
export const FR_2024: CountryData = {
  currency: 'EUR', symbol: '€',
  brackets: [
    { min: 0, max: 11294, rate: 0 }, { min: 11294, max: 28797, rate: 0.11 },
    { min: 28797, max: 82341, rate: 0.30 }, { min: 82341, max: 177106, rate: 0.41 },
    { min: 177106, max: Infinity, rate: 0.45 },
  ],
}

// Italy
export const IT_2024: CountryData = {
  currency: 'EUR', symbol: '€',
  brackets: [
    { min: 0, max: 28000, rate: 0.23 }, { min: 28000, max: 50000, rate: 0.35 },
    { min: 50000, max: Infinity, rate: 0.43 },
  ],
}

// Spain
export const ES_2024: CountryData = {
  currency: 'EUR', symbol: '€',
  brackets: [
    { min: 0, max: 12450, rate: 0.19 }, { min: 12450, max: 20200, rate: 0.24 },
    { min: 20200, max: 35200, rate: 0.30 }, { min: 35200, max: 60000, rate: 0.37 },
    { min: 60000, max: 300000, rate: 0.45 }, { min: 300000, max: Infinity, rate: 0.47 },
  ],
}

// Netherlands
export const NL_2024: CountryData = {
  currency: 'EUR', symbol: '€',
  brackets: [
    { min: 0, max: 75518, rate: 0.3697 }, { min: 75518, max: Infinity, rate: 0.495 },
  ],
}

// Switzerland
export const CH_2024: CountryData = {
  currency: 'CHF', symbol: 'CHF',
  brackets: [
    { min: 0, max: 17800, rate: 0 }, { min: 17800, max: 31600, rate: 0.077 },
    { min: 31600, max: 41400, rate: 0.088 }, { min: 41400, max: 55200, rate: 0.099 },
    { min: 55200, max: 72500, rate: 0.110 }, { min: 72500, max: 78100, rate: 0.121 },
    { min: 78100, max: 103600, rate: 0.132 }, { min: 103600, max: Infinity, rate: 0.115 },
  ],
}

// Japan
export const JP_2024: CountryData = {
  currency: 'JPY', symbol: '¥',
  brackets: [
    { min: 0, max: 1950000, rate: 0.05 }, { min: 1950000, max: 3300000, rate: 0.10 },
    { min: 3300000, max: 6950000, rate: 0.20 }, { min: 6950000, max: 9000000, rate: 0.23 },
    { min: 9000000, max: 18000000, rate: 0.33 }, { min: 18000000, max: 40000000, rate: 0.40 },
    { min: 40000000, max: Infinity, rate: 0.45 },
  ],
}

// China
export const CN_2024: CountryData = {
  currency: 'CNY', symbol: '¥',
  brackets: [
    { min: 0, max: 36000, rate: 0.03 }, { min: 36000, max: 144000, rate: 0.10 },
    { min: 144000, max: 300000, rate: 0.20 }, { min: 300000, max: 420000, rate: 0.25 },
    { min: 420000, max: 660000, rate: 0.30 }, { min: 660000, max: 960000, rate: 0.35 },
    { min: 960000, max: Infinity, rate: 0.45 },
  ],
}

// Singapore
export const SG_2024: CountryData = {
  currency: 'SGD', symbol: 'S$',
  brackets: [
    { min: 0, max: 20000, rate: 0 }, { min: 20000, max: 30000, rate: 0.02 },
    { min: 30000, max: 40000, rate: 0.035 }, { min: 40000, max: 80000, rate: 0.07 },
    { min: 80000, max: 120000, rate: 0.115 }, { min: 120000, max: 160000, rate: 0.15 },
    { min: 160000, max: 200000, rate: 0.18 }, { min: 200000, max: 240000, rate: 0.19 },
    { min: 240000, max: 280000, rate: 0.195 }, { min: 280000, max: 320000, rate: 0.20 },
    { min: 320000, max: 500000, rate: 0.22 }, { min: 500000, max: 1000000, rate: 0.23 },
    { min: 1000000, max: Infinity, rate: 0.24 },
  ],
}

// UAE (no income tax)
export const AE_2024: CountryData = {
  currency: 'AED', symbol: 'AED',
  brackets: [{ min: 0, max: Infinity, rate: 0 }],
}

// Saudi Arabia (no personal income tax)
export const SA_2024: CountryData = {
  currency: 'SAR', symbol: 'SAR',
  brackets: [{ min: 0, max: Infinity, rate: 0 }],
}

// Brazil
export const BR_2024: CountryData = {
  currency: 'BRL', symbol: 'R$',
  brackets: [
    { min: 0, max: 24511, rate: 0 }, { min: 24511, max: 33919, rate: 0.075 },
    { min: 33919, max: 45012, rate: 0.15 }, { min: 45012, max: 55976, rate: 0.225 },
    { min: 55976, max: Infinity, rate: 0.275 },
  ],
}

// Mexico
export const MX_2024: CountryData = {
  currency: 'MXN', symbol: 'MX$',
  brackets: [
    { min: 0, max: 8952, rate: 0.0192 }, { min: 8952, max: 75984, rate: 0.064 },
    { min: 75984, max: 133536, rate: 0.1088 }, { min: 133536, max: 155232, rate: 0.16 },
    { min: 155232, max: 185852, rate: 0.1792 }, { min: 185852, max: 374837, rate: 0.2136 },
    { min: 374837, max: 590796, rate: 0.2352 }, { min: 590796, max: 1127926, rate: 0.30 },
    { min: 1127926, max: 1503902, rate: 0.32 }, { min: 1503902, max: 4511706, rate: 0.34 },
    { min: 4511706, max: Infinity, rate: 0.35 },
  ],
}

// South Africa
export const ZA_2024: CountryData = {
  currency: 'ZAR', symbol: 'R',
  brackets: [
    { min: 0, max: 237100, rate: 0.18 }, { min: 237100, max: 370500, rate: 0.26 },
    { min: 370500, max: 512800, rate: 0.31 }, { min: 512800, max: 673000, rate: 0.36 },
    { min: 673000, max: 857900, rate: 0.39 }, { min: 857900, max: 1817000, rate: 0.41 },
    { min: 1817000, max: Infinity, rate: 0.45 },
  ],
}

// Nigeria
export const NG_2024: CountryData = {
  currency: 'NGN', symbol: '₦',
  brackets: [
    { min: 0, max: 300000, rate: 0.07 }, { min: 300000, max: 600000, rate: 0.11 },
    { min: 600000, max: 1100000, rate: 0.15 }, { min: 1100000, max: 1600000, rate: 0.19 },
    { min: 1600000, max: 3200000, rate: 0.21 }, { min: 3200000, max: Infinity, rate: 0.24 },
  ],
}

// New Zealand
export const NZ_2024: CountryData = {
  currency: 'NZD', symbol: 'NZ$',
  brackets: [
    { min: 0, max: 14000, rate: 0.105 }, { min: 14000, max: 48000, rate: 0.175 },
    { min: 48000, max: 70000, rate: 0.30 }, { min: 70000, max: 180000, rate: 0.33 },
    { min: 180000, max: Infinity, rate: 0.39 },
  ],
}

// Ireland
export const IE_2024: CountryData = {
  currency: 'EUR', symbol: '€',
  brackets: [
    { min: 0, max: 42000, rate: 0.20 }, { min: 42000, max: Infinity, rate: 0.40 },
  ],
}

// Sweden
export const SE_2024: CountryData = {
  currency: 'SEK', symbol: 'kr',
  brackets: [
    { min: 0, max: 614000, rate: 0.32 }, { min: 614000, max: Infinity, rate: 0.52 },
  ],
}

// Norway
export const NO_2024: CountryData = {
  currency: 'NOK', symbol: 'kr',
  brackets: [
    { min: 0, max: 208050, rate: 0.219 }, { min: 208050, max: 292850, rate: 0.249 },
    { min: 292850, max: 670000, rate: 0.359 }, { min: 670000, max: 937900, rate: 0.409 },
    { min: 937900, max: 1350000, rate: 0.439 }, { min: 1350000, max: Infinity, rate: 0.459 },
  ],
}

// Denmark
export const DK_2024: CountryData = {
  currency: 'DKK', symbol: 'kr',
  brackets: [
    { min: 0, max: 50543, rate: 0 }, { min: 50543, max: 544800, rate: 0.3748 },
    { min: 544800, max: Infinity, rate: 0.5748 },
  ],
}

// Pakistan
export const PK_2024: CountryData = {
  currency: 'PKR', symbol: '₨',
  brackets: [
    { min: 0, max: 600000, rate: 0 }, { min: 600000, max: 1200000, rate: 0.05 },
    { min: 1200000, max: 2400000, rate: 0.15 }, { min: 2400000, max: 3600000, rate: 0.25 },
    { min: 3600000, max: 6000000, rate: 0.30 }, { min: 6000000, max: Infinity, rate: 0.35 },
  ],
}

// Bangladesh
export const BD_2024: CountryData = {
  currency: 'BDT', symbol: '৳',
  brackets: [
    { min: 0, max: 350000, rate: 0 }, { min: 350000, max: 450000, rate: 0.05 },
    { min: 450000, max: 750000, rate: 0.10 }, { min: 750000, max: 1150000, rate: 0.15 },
    { min: 1150000, max: 1650000, rate: 0.20 }, { min: 1650000, max: Infinity, rate: 0.25 },
  ],
}

// Philippines
export const PH_2024: CountryData = {
  currency: 'PHP', symbol: '₱',
  brackets: [
    { min: 0, max: 250000, rate: 0 }, { min: 250000, max: 400000, rate: 0.15 },
    { min: 400000, max: 800000, rate: 0.20 }, { min: 800000, max: 2000000, rate: 0.25 },
    { min: 2000000, max: 8000000, rate: 0.30 }, { min: 8000000, max: Infinity, rate: 0.35 },
  ],
}

// Indonesia
export const ID_2024: CountryData = {
  currency: 'IDR', symbol: 'Rp',
  brackets: [
    { min: 0, max: 60000000, rate: 0.05 }, { min: 60000000, max: 250000000, rate: 0.15 },
    { min: 250000000, max: 500000000, rate: 0.25 }, { min: 500000000, max: 5000000000, rate: 0.30 },
    { min: 5000000000, max: Infinity, rate: 0.35 },
  ],
}

// Malaysia
export const MY_2024: CountryData = {
  currency: 'MYR', symbol: 'RM',
  brackets: [
    { min: 0, max: 5000, rate: 0 }, { min: 5000, max: 20000, rate: 0.01 },
    { min: 20000, max: 35000, rate: 0.03 }, { min: 35000, max: 50000, rate: 0.08 },
    { min: 50000, max: 70000, rate: 0.13 }, { min: 70000, max: 100000, rate: 0.21 },
    { min: 100000, max: 400000, rate: 0.24 }, { min: 400000, max: 600000, rate: 0.245 },
    { min: 600000, max: 2000000, rate: 0.25 }, { min: 2000000, max: Infinity, rate: 0.30 },
  ],
}

// Thailand
export const TH_2024: CountryData = {
  currency: 'THB', symbol: '฿',
  brackets: [
    { min: 0, max: 150000, rate: 0 }, { min: 150000, max: 300000, rate: 0.05 },
    { min: 300000, max: 500000, rate: 0.10 }, { min: 500000, max: 750000, rate: 0.15 },
    { min: 750000, max: 1000000, rate: 0.20 }, { min: 1000000, max: 2000000, rate: 0.25 },
    { min: 2000000, max: 5000000, rate: 0.30 }, { min: 5000000, max: Infinity, rate: 0.35 },
  ],
}

// South Korea
export const KR_2024: CountryData = {
  currency: 'KRW', symbol: '₩',
  brackets: [
    { min: 0, max: 14000000, rate: 0.06 }, { min: 14000000, max: 50000000, rate: 0.15 },
    { min: 50000000, max: 88000000, rate: 0.24 }, { min: 88000000, max: 150000000, rate: 0.35 },
    { min: 150000000, max: 300000000, rate: 0.38 }, { min: 300000000, max: 500000000, rate: 0.40 },
    { min: 500000000, max: 1000000000, rate: 0.42 }, { min: 1000000000, max: Infinity, rate: 0.45 },
  ],
}

// Russia
export const RU_2024: CountryData = {
  currency: 'RUB', symbol: '₽',
  brackets: [
    { min: 0, max: 2400000, rate: 0.13 }, { min: 2400000, max: 5000000, rate: 0.15 },
    { min: 5000000, max: 20000000, rate: 0.18 }, { min: 20000000, max: 50000000, rate: 0.20 },
    { min: 50000000, max: Infinity, rate: 0.22 },
  ],
}

// Turkey
export const TR_2024: CountryData = {
  currency: 'TRY', symbol: '₺',
  brackets: [
    { min: 0, max: 110000, rate: 0.15 }, { min: 110000, max: 230000, rate: 0.20 },
    { min: 230000, max: 580000, rate: 0.27 }, { min: 580000, max: 3000000, rate: 0.35 },
    { min: 3000000, max: Infinity, rate: 0.40 },
  ],
}

// Poland
export const PL_2024: CountryData = {
  currency: 'PLN', symbol: 'zł',
  brackets: [
    { min: 0, max: 120000, rate: 0.12 }, { min: 120000, max: Infinity, rate: 0.32 },
  ],
}

// Argentina
export const AR_2024: CountryData = {
  currency: 'ARS', symbol: 'AR$',
  brackets: [
    { min: 0, max: 419648, rate: 0.05 }, { min: 419648, max: 839296, rate: 0.09 },
    { min: 839296, max: 1258944, rate: 0.12 }, { min: 1258944, max: 1678592, rate: 0.15 },
    { min: 1678592, max: 2517888, rate: 0.19 }, { min: 2517888, max: 3357184, rate: 0.23 },
    { min: 3357184, max: 5035776, rate: 0.27 }, { min: 5035776, max: 6714368, rate: 0.31 },
    { min: 6714368, max: Infinity, rate: 0.35 },
  ],
}

// Colombia
export const CO_2024: CountryData = {
  currency: 'COP', symbol: 'COP$',
  brackets: [
    { min: 0, max: 38004000, rate: 0 }, { min: 38004000, max: 59772000, rate: 0.19 },
    { min: 59772000, max: 95832000, rate: 0.28 }, { min: 95832000, max: 383328000, rate: 0.33 },
    { min: 383328000, max: Infinity, rate: 0.39 },
  ],
}

// Kenya
export const KE_2024: CountryData = {
  currency: 'KES', symbol: 'KSh',
  brackets: [
    { min: 0, max: 288000, rate: 0.10 }, { min: 288000, max: 388000, rate: 0.25 },
    { min: 388000, max: Infinity, rate: 0.30 },
  ],
}

// Israel
export const IL_2024: CountryData = {
  currency: 'ILS', symbol: '₪',
  brackets: [
    { min: 0, max: 81480, rate: 0.10 }, { min: 81480, max: 116760, rate: 0.14 },
    { min: 116760, max: 187440, rate: 0.20 }, { min: 187440, max: 260520, rate: 0.31 },
    { min: 260520, max: 542160, rate: 0.35 }, { min: 542160, max: 698280, rate: 0.47 },
    { min: 698280, max: Infinity, rate: 0.50 },
  ],
}

export const COUNTRIES: Record<string, CountryData> = {
  'United States': US_2024,
  'United Kingdom': UK_2024,
  'Canada': CA_2024,
  'Australia': AU_2024,
  'New Zealand': NZ_2024,
  'India': IN_2024,
  'Pakistan': PK_2024,
  'Bangladesh': BD_2024,
  'Germany': DE_2024,
  'France': FR_2024,
  'Italy': IT_2024,
  'Spain': ES_2024,
  'Netherlands': NL_2024,
  'Switzerland': CH_2024,
  'Ireland': IE_2024,
  'Sweden': SE_2024,
  'Norway': NO_2024,
  'Denmark': DK_2024,
  'Poland': PL_2024,
  'Japan': JP_2024,
  'China': CN_2024,
  'South Korea': KR_2024,
  'Singapore': SG_2024,
  'Malaysia': MY_2024,
  'Thailand': TH_2024,
  'Philippines': PH_2024,
  'Indonesia': ID_2024,
  'UAE': AE_2024,
  'Saudi Arabia': SA_2024,
  'Israel': IL_2024,
  'Turkey': TR_2024,
  'Russia': RU_2024,
  'Brazil': BR_2024,
  'Mexico': MX_2024,
  'Argentina': AR_2024,
  'Colombia': CO_2024,
  'South Africa': ZA_2024,
  'Nigeria': NG_2024,
  'Kenya': KE_2024,
}