import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import s from './CategoryPage.module.css'

const FINANCE_TOOLS = [
  {
    group: 'Tax',
    tools: [
      { name: 'Income Tax Calculator', path: '/finance/income-tax-calculator', desc: 'Federal & state income tax estimator for 40+ countries' },
      { name: 'Take-Home Pay Calculator', path: '/finance/take-home-pay-calculator', desc: 'Net salary after all taxes and deductions' },
    ],
  },
  {
    group: 'Savings & Interest',
    tools: [
      { name: 'Compound Interest Calculator', path: '/finance/compound-interest-calculator', desc: 'Watch your money grow with compounding' },
      { name: 'Simple Interest Calculator', path: '/finance/simple-interest-calculator', desc: 'Calculate interest using I = P × R × T' },
      { name: 'Savings Goal Calculator', path: '/finance/savings-goal-calculator', desc: 'How much to save monthly to reach your goal' },
      { name: 'CD Calculator', path: '/finance/cd-calculator', desc: 'Certificate of Deposit interest and APY' },
    ],
  },
  {
    group: 'Investment',
    tools: [
      { name: 'Investment ROI Calculator', path: '/finance/investment-roi-calculator', desc: 'Total return and annualized CAGR' },
      { name: 'Inflation Calculator', path: '/finance/inflation-calculator', desc: 'Purchasing power erosion over time' },
      { name: 'Bond Calculator', path: '/finance/bond-calculator', desc: 'Bond price, YTM, duration, and cash flows' },
    ],
  },
  {
    group: 'Retirement',
    tools: [
      { name: 'Retirement Calculator', path: '/finance/retirement-calculator', desc: 'Project your nest egg and retirement income' },
      { name: '401(k) Calculator', path: '/finance/401k-calculator', desc: 'Employer match and long-term 401k growth' },
      { name: 'Roth IRA Calculator', path: '/finance/roth-ira-calculator', desc: 'Tax-free retirement savings growth' },
    ],
  },
]

export default function FinancePage() {
  return (
    <>
      <SEOHead
        title="Finance Calculators – Tax, Investment, Retirement & More"
        description="Free finance calculators for tax, compound interest, savings, investment ROI, retirement, 401k, Roth IRA, bonds, and more."
        canonical="/finance"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>◈ Finance</p>
            <h1 className={s.h1}>Finance Calculators</h1>
            <p className={s.sub}>12 free financial calculators for tax, savings, investment, and retirement planning.</p>
          </div>

          {FINANCE_TOOLS.map(group => (
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