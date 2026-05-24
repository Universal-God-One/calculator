import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import s from './HomePage.module.css'

const CATEGORIES = [
  {
    icon: '💰', label: 'Finance & Tax', slug: 'finance', color: '#3b82f6',
    tools: [
      { name: 'Income Tax Calculator', path: '/finance/income-tax-calculator' },
      { name: 'Compound Interest Calculator', path: '/finance/compound-interest-calculator' },
      { name: 'Savings Goal Calculator', path: '/finance/savings-goal-calculator' },
      { name: 'Investment ROI Calculator', path: '/finance/investment-roi-calculator' },
      { name: 'Retirement Calculator', path: '/finance/retirement-calculator' },
      { name: 'Inflation Calculator', path: '/finance/inflation-calculator' },
      { name: '401(k) Calculator', path: '/finance/401k-calculator' },
      { name: 'Roth IRA Calculator', path: '/finance/roth-ira-calculator' },
      { name: 'Simple Interest Calculator', path: '/finance/simple-interest-calculator' },
      { name: 'Take-Home Pay Calculator', path: '/finance/take-home-pay-calculator' },
      { name: 'CD Calculator', path: '/finance/cd-calculator' },
      { name: 'Bond Calculator', path: '/finance/bond-calculator' },
    ],
  },
  {
    icon: '🏠', label: 'Real Estate', slug: 'real-estate', color: '#10b981',
    tools: [
      { name: 'Mortgage Calculator', path: '/real-estate/mortgage-calculator' },
      { name: 'Amortization Calculator', path: '/real-estate/amortization-calculator' },
      { name: 'Rent vs Buy Calculator', path: '/real-estate/rent-vs-buy-calculator' },
      { name: 'House Affordability Calculator', path: '/real-estate/house-affordability-calculator' },
      { name: 'Refinance Calculator', path: '/real-estate/refinance-calculator' },
      { name: 'FHA Loan Calculator', path: '/real-estate/fha-loan-calculator' },
      { name: 'VA Mortgage Calculator', path: '/real-estate/va-mortgage-calculator' },
      { name: 'Home Equity Loan Calculator', path: '/real-estate/home-equity-loan-calculator' },
      { name: 'Rental Property ROI', path: '/real-estate/rental-property-roi-calculator' },
      { name: 'Down Payment Calculator', path: '/real-estate/down-payment-calculator' },
      { name: 'Mortgage Payoff Calculator', path: '/real-estate/mortgage-payoff-calculator' },
      { name: 'HELOC Calculator', path: '/real-estate/heloc-calculator' },
    ],
  },
  {
    icon: '📐', label: 'Math & School', slug: 'math', color: '#f59e0b',
    tools: [
      { name: 'Percentage Calculator', path: '/math/percentage-calculator' },
      { name: 'Fraction Calculator', path: '/math/fraction-calculator' },
      { name: 'Scientific Calculator', path: '/math/scientific-calculator' },
      { name: 'Standard Deviation Calculator', path: '/math/standard-deviation-calculator' },
      { name: 'Quadratic Formula Calculator', path: '/math/quadratic-formula-calculator' },
      { name: 'Probability Calculator', path: '/math/probability-calculator' },
      { name: 'Statistics Calculator', path: '/math/statistics-calculator' },
      { name: 'Z-Score Calculator', path: '/math/z-score-calculator' },
      { name: 'Triangle Calculator', path: '/math/triangle-calculator' },
      { name: 'Long Division Calculator', path: '/math/long-division-calculator' },
      { name: 'Log Calculator', path: '/math/log-calculator' },
      { name: 'Matrix Calculator', path: '/math/matrix-calculator' },
    ],
  },
  {
    icon: '🏢', label: 'Business', slug: 'business', color: '#8b5cf6',
    tools: [
      { name: 'Margin & Markup Calculator', path: '/business/margin-markup-calculator' },
      { name: 'Break-Even Calculator', path: '/business/break-even-calculator' },
      { name: 'Business Loan Calculator', path: '/business/business-loan-calculator' },
      { name: 'Sales Commission Calculator', path: '/business/sales-commission-calculator' },
      { name: 'Discount Calculator', path: '/business/discount-calculator' },
      { name: 'DTI Ratio Calculator', path: '/business/dti-ratio-calculator' },
      { name: 'Budget Allocation Calculator', path: '/business/budget-allocation-calculator' },
      { name: 'LTV to CAC Calculator', path: '/business/ltv-cac-calculator' },
      { name: 'Billable Rate Calculator', path: '/business/billable-rate-calculator' },
      { name: 'PayPal Fee Calculator', path: '/business/paypal-fee-calculator' },
    ],
  },
]

const STATS = [
  { value: '90+', label: 'Free Tools' },
  { value: '4', label: 'Categories' },
  { value: '0', label: 'Signups Needed' },
  { value: '100%', label: 'Free Forever' },
]

const HERO_TOOLS = [
  { name: 'Mortgage Calculator', path: '/real-estate/mortgage-calculator', icon: '🏠', cat: 'Real Estate' },
  { name: 'Income Tax', path: '/finance/income-tax-calculator', icon: '💰', cat: 'Finance' },
  { name: 'Compound Interest', path: '/finance/compound-interest-calculator', icon: '📈', cat: 'Finance' },
  { name: 'Percentage Calculator', path: '/math/percentage-calculator', icon: '📐', cat: 'Math' },
  { name: 'Retirement Calculator', path: '/finance/retirement-calculator', icon: '🏦', cat: 'Finance' },
  { name: 'Rent vs Buy', path: '/real-estate/rent-vs-buy-calculator', icon: '🏡', cat: 'Real Estate' },
]

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="Free Online Calculators – Finance, Mortgage, Math & Business"
        description="90+ free online calculators for finance, tax, mortgage, real estate, math, and business. Instant results, no signup required."
        canonical="/"
      />

      <div className={s.page}>

        {/* ── Hero ── */}
        <section className={s.hero}>
          <div className={`container ${s.heroInner}`}>

            {/* Left */}
            <div className={s.heroLeft}>
              <span className={s.badge}>◈ 90+ Free Tools</span>
              <h1 className={s.h1}>
                Calculate<br />
                <span className={s.h1Accent}>Anything.</span>
              </h1>
              <p className={s.sub}>
                Free online calculators for finance, tax, mortgage,
                real estate, math, and business. Instant results. No signup. No nonsense.
              </p>
              <div className={s.catPills}>
                {CATEGORIES.map(c => (
                  <Link key={c.slug} to={`/${c.slug}`} className={s.pill}
                    style={{ '--c': c.color } as React.CSSProperties}>
                    {c.icon} {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — floating tool cards */}
            <div className={s.heroRight}>
              <div className={s.floatGrid}>
                {HERO_TOOLS.map((t, i) => (
                  <Link key={t.path} to={t.path} className={s.floatCard}
                    style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}>
                    <span className={s.floatIcon}>{t.icon}</span>
                    <div>
                      <p className={s.floatName}>{t.name}</p>
                      <p className={s.floatCat}>{t.cat}</p>
                    </div>
                    <span className={s.floatArrow}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Background blobs */}
          <div className={s.blob1} />
          <div className={s.blob2} />
          <div className={s.blob3} />
        </section>

        {/* ── Stats bar ── */}
        <div className={s.statsBar}>
          <div className="container">
            <div className={s.statsInner}>
              {STATS.map(st => (
                <div key={st.label} className={s.stat}>
                  <span className={s.statVal}>{st.value}</span>
                  <span className={s.statLabel}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container">
          <AdBanner slot="1000000001" />

          {/* ── Category sections ── */}
          {CATEGORIES.map(cat => (
            <section key={cat.slug} className={s.catSection}>
              <div className={s.catHead}>
                <div className={s.catTitleWrap}>
                  <span className={s.catIcon}>{cat.icon}</span>
                  <h2 className={s.catTitle} style={{ '--c': cat.color } as React.CSSProperties}>
                    {cat.label}
                  </h2>
                </div>
                <Link to={`/${cat.slug}`} className={s.viewAll}>View all →</Link>
              </div>
              <div className={s.toolGrid}>
                {cat.tools.map(t => (
                  <Link key={t.path} to={t.path} className={s.toolCard}
                    style={{ '--c': cat.color } as React.CSSProperties}>
                    <span className={s.toolName}>{t.name}</span>
                    <span className={s.toolArrow}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <AdBanner slot="1000000002" />
        </div>
      </div>
    </>
  )
}