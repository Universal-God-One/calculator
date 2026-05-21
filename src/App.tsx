import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import ComingSoon from '@/pages/ComingSoon'

// Finance
const TaxCalc          = lazy(() => import('@/calculators/finance/TaxCalc/TaxCalc'))
const CompoundInterest = lazy(() => import('@/calculators/finance/CompoundInterest/CompoundInterest'))

// Real Estate
const MortgageCalc = lazy(() => import('@/calculators/realestate/MortgageCalc/MortgageCalc'))

// Math
const PercentageCalc = lazy(() => import('@/calculators/math/PercentageCalc/PercentageCalc'))

function Loader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em',
    }}>
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* ── Finance ── */}
            <Route path="/finance" element={<ComingSoon />} />
            <Route path="/finance/income-tax-calculator" element={<TaxCalc />} />
            <Route path="/finance/compound-interest-calculator" element={<CompoundInterest />} />
            <Route path="/finance/savings-goal-calculator" element={<ComingSoon />} />
            <Route path="/finance/investment-roi-calculator" element={<ComingSoon />} />
            <Route path="/finance/retirement-calculator" element={<ComingSoon />} />
            <Route path="/finance/inflation-calculator" element={<ComingSoon />} />
            <Route path="/finance/401k-calculator" element={<ComingSoon />} />
            <Route path="/finance/roth-ira-calculator" element={<ComingSoon />} />
            <Route path="/finance/simple-interest-calculator" element={<ComingSoon />} />
            <Route path="/finance/take-home-pay-calculator" element={<ComingSoon />} />
            <Route path="/finance/cd-calculator" element={<ComingSoon />} />
            <Route path="/finance/bond-calculator" element={<ComingSoon />} />
            <Route path="/finance/annuity-calculator" element={<ComingSoon />} />
            <Route path="/finance/present-value-calculator" element={<ComingSoon />} />
            <Route path="/finance/future-value-calculator" element={<ComingSoon />} />
            <Route path="/finance/irr-calculator" element={<ComingSoon />} />
            <Route path="/finance/payback-period-calculator" element={<ComingSoon />} />
            <Route path="/finance/sales-tax-calculator" element={<ComingSoon />} />
            <Route path="/finance/vat-calculator" element={<ComingSoon />} />
            <Route path="/finance/marriage-tax-calculator" element={<ComingSoon />} />
            <Route path="/finance/estate-tax-calculator" element={<ComingSoon />} />
            <Route path="/finance/social-security-calculator" element={<ComingSoon />} />
            <Route path="/finance/pension-calculator" element={<ComingSoon />} />
            <Route path="/finance/rmd-calculator" element={<ComingSoon />} />
            <Route path="/finance/*" element={<ComingSoon />} />

            {/* ── Real Estate ── */}
            <Route path="/real-estate" element={<ComingSoon />} />
            <Route path="/real-estate/mortgage-calculator" element={<MortgageCalc />} />
            <Route path="/real-estate/amortization-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/rent-vs-buy-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/house-affordability-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/refinance-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/fha-loan-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/va-mortgage-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/home-equity-loan-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/rental-property-roi-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/down-payment-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/mortgage-payoff-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/heloc-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/property-tax-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/mortgage-calculator-uk" element={<ComingSoon />} />
            <Route path="/real-estate/canadian-mortgage-calculator" element={<ComingSoon />} />
            <Route path="/real-estate/*" element={<ComingSoon />} />

            {/* ── Math ── */}
            <Route path="/math" element={<ComingSoon />} />
            <Route path="/math/percentage-calculator" element={<PercentageCalc />} />
            <Route path="/math/fraction-calculator" element={<ComingSoon />} />
            <Route path="/math/scientific-calculator" element={<ComingSoon />} />
            <Route path="/math/standard-deviation-calculator" element={<ComingSoon />} />
            <Route path="/math/quadratic-formula-calculator" element={<ComingSoon />} />
            <Route path="/math/probability-calculator" element={<ComingSoon />} />
            <Route path="/math/statistics-calculator" element={<ComingSoon />} />
            <Route path="/math/z-score-calculator" element={<ComingSoon />} />
            <Route path="/math/triangle-calculator" element={<ComingSoon />} />
            <Route path="/math/long-division-calculator" element={<ComingSoon />} />
            <Route path="/math/log-calculator" element={<ComingSoon />} />
            <Route path="/math/area-calculator" element={<ComingSoon />} />
            <Route path="/math/volume-calculator" element={<ComingSoon />} />
            <Route path="/math/slope-calculator" element={<ComingSoon />} />
            <Route path="/math/ratio-calculator" element={<ComingSoon />} />
            <Route path="/math/matrix-calculator" element={<ComingSoon />} />
            <Route path="/math/prime-factorization-calculator" element={<ComingSoon />} />
            <Route path="/math/lcm-gcf-calculator" element={<ComingSoon />} />
            <Route path="/math/average-calculator" element={<ComingSoon />} />
            <Route path="/math/p-value-calculator" element={<ComingSoon />} />
            <Route path="/math/confidence-interval-calculator" element={<ComingSoon />} />
            <Route path="/math/permutation-combination-calculator" element={<ComingSoon />} />
            <Route path="/math/binary-hex-calculator" element={<ComingSoon />} />
            <Route path="/math/exponent-calculator" element={<ComingSoon />} />
            <Route path="/math/scientific-notation-calculator" element={<ComingSoon />} />
            <Route path="/math/root-calculator" element={<ComingSoon />} />
            <Route path="/math/rounding-calculator" element={<ComingSoon />} />
            <Route path="/math/factor-calculator" element={<ComingSoon />} />
            <Route path="/math/distance-calculator" element={<ComingSoon />} />
            <Route path="/math/circle-calculator" element={<ComingSoon />} />
            <Route path="/math/surface-area-calculator" element={<ComingSoon />} />
            <Route path="/math/pythagorean-theorem-calculator" element={<ComingSoon />} />
            <Route path="/math/right-triangle-calculator" element={<ComingSoon />} />
            <Route path="/math/half-life-calculator" element={<ComingSoon />} />
            <Route path="/math/sample-size-calculator" element={<ComingSoon />} />
            <Route path="/math/number-sequence-calculator" element={<ComingSoon />} />
            <Route path="/math/random-number-generator" element={<ComingSoon />} />
            <Route path="/math/big-number-calculator" element={<ComingSoon />} />
            <Route path="/math/percent-error-calculator" element={<ComingSoon />} />
            <Route path="/math/*" element={<ComingSoon />} />

            {/* ── Business ── */}
            <Route path="/business" element={<ComingSoon />} />
            <Route path="/business/margin-markup-calculator" element={<ComingSoon />} />
            <Route path="/business/break-even-calculator" element={<ComingSoon />} />
            <Route path="/business/business-loan-calculator" element={<ComingSoon />} />
            <Route path="/business/sales-commission-calculator" element={<ComingSoon />} />
            <Route path="/business/discount-calculator" element={<ComingSoon />} />
            <Route path="/business/dti-ratio-calculator" element={<ComingSoon />} />
            <Route path="/business/budget-allocation-calculator" element={<ComingSoon />} />
            <Route path="/business/ltv-cac-calculator" element={<ComingSoon />} />
            <Route path="/business/billable-rate-calculator" element={<ComingSoon />} />
            <Route path="/business/paypal-fee-calculator" element={<ComingSoon />} />
            <Route path="/business/*" element={<ComingSoon />} />

            {/* 404 */}
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}
