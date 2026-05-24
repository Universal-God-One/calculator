import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import s from './CategoryPage.module.css'

const BUSINESS_TOOLS = [
  {
    group: 'Pricing & Profit',
    tools: [
      { name: 'Margin & Markup Calculator', path: '/business/margin-markup-calculator', desc: 'Calculate gross profit margin, markup %, and selling price' },
      { name: 'Discount Calculator', path: '/business/discount-calculator', desc: 'Sale price, % off, stacked discounts, and tax' },
      { name: 'Break-Even Calculator', path: '/business/break-even-calculator', desc: 'Find break-even units, contribution margin, and margin of safety' },
    ],
  },
  {
    group: 'Financing',
    tools: [
      { name: 'Business Loan Calculator', path: '/business/business-loan-calculator', desc: 'Monthly payments, true APR, and full amortization schedule' },
      { name: 'DTI Ratio Calculator', path: '/business/dti-ratio-calculator', desc: 'Debt-to-income ratio with front-end and back-end breakdown' },
    ],
  },
  {
    group: 'Sales & Revenue',
    tools: [
      { name: 'Sales Commission Calculator', path: '/business/sales-commission-calculator', desc: 'Flat, tiered, graduated, and draw-against-commission structures' },
      { name: 'LTV to CAC Calculator', path: '/business/ltv-cac-calculator', desc: 'Customer lifetime value, acquisition cost ratio, and payback period' },
    ],
  },
  {
    group: 'Freelancing & Fees',
    tools: [
      { name: 'Billable Rate Calculator', path: '/business/billable-rate-calculator', desc: 'Freelance hourly rate based on income target, expenses, and utilization' },
      { name: 'PayPal Fee Calculator', path: '/business/paypal-fee-calculator', desc: 'Calculate PayPal fees for any transaction type instantly' },
    ],
  },
  {
    group: 'Planning',
    tools: [
      { name: 'Budget Allocation Calculator', path: '/business/budget-allocation-calculator', desc: '50/30/20, 70/20/10, pay-yourself-first, or custom budget' },
    ],
  },
]

export default function BusinessPage() {
  return (
    <>
      <SEOHead
        title="Business Calculators – Profit, Loans, Commission & More"
        description="Free business calculators for margin, markup, break-even, business loans, sales commission, LTV:CAC, billable rate, PayPal fees, and budget allocation."
        canonical="/business"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>◈ Business</p>
            <h1 className={s.h1}>Business Calculators</h1>
            <p className={s.sub}>10 free business calculators covering pricing, financing, sales, freelancing, and planning.</p>
          </div>

          {BUSINESS_TOOLS.map(group => (
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