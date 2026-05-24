import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import s from './LegalPage.module.css'

const STATS = [
  { value: '46+', label: 'Free Calculators' },
  { value: '4', label: 'Categories' },
  { value: '0', label: 'Signups Needed' },
  { value: '100%', label: 'Free Forever' },
]

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About – Calculator | Free Online Calculators"
        description="Learn about Calculator — a free collection of 46+ online calculators for finance, real estate, math, and business. No signup, no ads tracking, just accurate results."
        canonical="/about"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <h1 className={s.h1}>About Calculator</h1>

          <div className={s.content}>
            <p className={s.lead}>Calculator is a free collection of 46+ online tools for finance, real estate, math, and business — built for people who need fast, accurate answers without the noise.</p>

            <div className={s.statsRow}>
              {STATS.map(st => (
                <div key={st.label} className={s.statBox}>
                  <span className={s.statVal}>{st.value}</span>
                  <span className={s.statLabel}>{st.label}</span>
                </div>
              ))}
            </div>

            <h2>Why We Built This</h2>
            <p>Most online calculators are either too simple to be useful, buried under ads and popups, or require you to sign up just to use a basic tool. We built Calculator to be different: fast, thorough, and completely free with no account required.</p>
            <p>Every calculator shows its work — step-by-step explanations, formula breakdowns, and charts so you understand the result, not just the number.</p>

            <h2>Our Calculators</h2>

            <h3>Finance & Tax</h3>
            <p>12 calculators covering income tax, compound interest, savings goals, investment ROI, retirement planning, inflation, 401(k), Roth IRA, simple interest, take-home pay, CDs, and bonds.</p>

            <h3>Real Estate</h3>
            <p>12 calculators for mortgage payments, amortization, rent vs buy, house affordability, refinancing, FHA loans, VA mortgages, home equity, rental ROI, down payment, mortgage payoff, and HELOCs.</p>

            <h3>Math & Statistics</h3>
            <p>12 calculators including percentages, fractions, scientific calculator, standard deviation, quadratic formula, probability (binomial & normal distribution), statistics, z-scores, triangle solver, long division, logarithms, and matrix operations.</p>

            <h3>Business</h3>
            <p>10 calculators for margin & markup, break-even analysis, business loans, sales commission, discounts, DTI ratio, budget allocation, LTV:CAC ratio, billable rate, and PayPal fees.</p>

            <h2>Our Commitment</h2>
            <ul>
              <li><strong>Free forever</strong> — No paywalls, no premium tiers</li>
              <li><strong>No signup</strong> — Use any calculator immediately</li>
              <li><strong>Privacy first</strong> — Your inputs stay in your browser</li>
              <li><strong>Accurate</strong> — Standard financial and mathematical formulas</li>
              <li><strong>Educational</strong> — Step-by-step explanations included</li>
            </ul>

            <h2>Disclaimer</h2>
            <p>Our calculators are for informational and educational purposes only. Results are estimates based on the values you enter. Always consult a qualified financial advisor, accountant, attorney, or other professional before making important financial decisions.</p>

            <div className={s.ctaRow}>
              <Link to="/" className={s.ctaBtn}>Browse All Calculators →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}