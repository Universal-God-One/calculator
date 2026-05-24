import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import s from './CategoryPage.module.css'

const REAL_ESTATE_TOOLS = [
  {
    group: 'Mortgage & Loans',
    tools: [
      { name: 'Mortgage Calculator', path: '/real-estate/mortgage-calculator', desc: 'Monthly payment, total interest, and amortization' },
      { name: 'Amortization Calculator', path: '/real-estate/amortization-calculator', desc: 'Full payment schedule with extra payment support' },
      { name: 'Mortgage Payoff Calculator', path: '/real-estate/mortgage-payoff-calculator', desc: 'Pay off early with extra payments and see interest saved' },
      { name: 'Refinance Calculator', path: '/real-estate/refinance-calculator', desc: 'Break-even point and savings from refinancing' },
    ],
  },
  {
    group: 'Loan Types',
    tools: [
      { name: 'FHA Loan Calculator', path: '/real-estate/fha-loan-calculator', desc: 'Monthly payment with upfront and annual MIP' },
      { name: 'VA Mortgage Calculator', path: '/real-estate/va-mortgage-calculator', desc: 'VA loan payment with 2024 funding fee rates' },
    ],
  },
  {
    group: 'Home Equity',
    tools: [
      { name: 'Home Equity Loan Calculator', path: '/real-estate/home-equity-loan-calculator', desc: 'Max borrowing amount and monthly payment' },
      { name: 'HELOC Calculator', path: '/real-estate/heloc-calculator', desc: 'Draw and repayment period payments with payment shock warning' },
    ],
  },
  {
    group: 'Buying Decisions',
    tools: [
      { name: 'House Affordability Calculator', path: '/real-estate/house-affordability-calculator', desc: 'Max home price using the 28/36 lending rule' },
      { name: 'Down Payment Calculator', path: '/real-estate/down-payment-calculator', desc: 'How long to save and milestone tracker' },
      { name: 'Rent vs Buy Calculator', path: '/real-estate/rent-vs-buy-calculator', desc: 'True cost comparison with break-even year' },
    ],
  },
  {
    group: 'Investment',
    tools: [
      { name: 'Rental Property ROI Calculator', path: '/real-estate/rental-property-roi-calculator', desc: 'Cap rate, cash-on-cash return, and total return' },
    ],
  },
]

export default function RealEstatePage() {
  return (
    <>
      <SEOHead
        title="Real Estate Calculators – Mortgage, Refinance, HELOC & More"
        description="Free real estate calculators for mortgage, amortization, refinance, FHA, VA loans, HELOC, home equity, rent vs buy, affordability, and rental ROI."
        canonical="/real-estate"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>◈ Real Estate</p>
            <h1 className={s.h1}>Real Estate Calculators</h1>
            <p className={s.sub}>12 free real estate calculators for mortgages, loans, home equity, and investment analysis.</p>
          </div>

          {REAL_ESTATE_TOOLS.map(group => (
            <section key={group.group} className={s.group}>
              <h2 className={s.groupTitle}>{group.group}</h2>
              <div className={s.grid}>
                {group.tools.map(tool => (
                  <Link key={tool.path} to={tool.path} className={s.card}>
                    <span className={s.cardName}>{tool.name}</span>
                    <span className={s.cardDesc}>{tool.desc}</span>
                    <span className={s.cardArrow}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}