import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import ComingSoon from '@/pages/ComingSoon'
import FinancePage from '@/pages/FinancePage'
import RealEstatePage from '@/pages/RealEstatePage'
import MathPage from '@/pages/MathPage'
import BusinessPage from '@/pages/BusinessPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'

const TaxCalc            = lazy(() => import('@/calculators/finance/TaxCalc/TaxCalc'))
const CompoundInterest   = lazy(() => import('@/calculators/finance/CompoundInterest/CompoundInterest'))
const SavingsGoal        = lazy(() => import('@/calculators/finance/SavingsGoal/SavingsGoal'))
const InvestmentROI      = lazy(() => import('@/calculators/finance/InvestmentROI/InvestmentROI'))
const RetirementCalc     = lazy(() => import('@/calculators/finance/RetirementCalc/RetirementCalc'))
const InflationCalc      = lazy(() => import('@/calculators/finance/InflationCalc/InflationCalc'))
const Calculator401k     = lazy(() => import('@/calculators/finance/Calculator401k/Calculator401k'))
const RothIRA            = lazy(() => import('@/calculators/finance/RothIRA/RothIRA'))
const SimpleInterest     = lazy(() => import('@/calculators/finance/SimpleInterest/SimpleInterest'))
const TakeHomePay        = lazy(() => import('@/calculators/finance/TakeHomePay/TakeHomePay'))
const CDCalc             = lazy(() => import('@/calculators/finance/CDCalc/CDCalc'))
const BondCalc           = lazy(() => import('@/calculators/finance/BondCalc/BondCalc'))
const MortgageCalc       = lazy(() => import('@/calculators/realestate/MortgageCalc/MortgageCalc'))
const AmortizationCalc   = lazy(() => import('@/calculators/realestate/AmortizationCalc/AmortizationCalc'))
const RentVsBuy          = lazy(() => import('@/calculators/realestate/RentVsBuy/RentVsBuy'))
const HouseAffordability = lazy(() => import('@/calculators/realestate/HouseAffordability/HouseAffordability'))
const RefinanceCalc      = lazy(() => import('@/calculators/realestate/RefinanceCalc/RefinanceCalc'))
const FHALoanCalc        = lazy(() => import('@/calculators/realestate/FHALoanCalc/FHALoanCalc'))
const VAMortgageCalc     = lazy(() => import('@/calculators/realestate/VAMortgageCalc/VAMortgageCalc'))
const HomeEquityCalc     = lazy(() => import('@/calculators/realestate/HomeEquityCalc/HomeEquityCalc'))
const RentalROI          = lazy(() => import('@/calculators/realestate/RentalROI/RentalROI'))
const DownPaymentCalc    = lazy(() => import('@/calculators/realestate/DownPaymentCalc/DownPaymentCalc'))
const MortgagePayoff     = lazy(() => import('@/calculators/realestate/MortgagePayoff/MortgagePayoff'))
const HELOCCalc         = lazy(() => import('@/calculators/realestate/HELOCCalc/HELOCCalc'))
const PercentageCalc     = lazy(() => import('@/calculators/math/PercentageCalc/PercentageCalc'))
const FractionCalc       = lazy(() => import('@/calculators/math/FractionCalc/FractionCalc'))
const ScientificCalc     = lazy(() => import('@/calculators/math/ScientificCalc/ScientificCalc'))
const StdDevCalc         = lazy(() => import('@/calculators/math/StdDevCalc/StdDevCalc'))
const QuadraticCalc      = lazy(() => import('@/calculators/math/QuadraticCalc/QuadraticCalc'))
const ProbabilityCalc    = lazy(() => import('@/calculators/math/ProbabilityCalc/ProbabilityCalc'))
const StatisticsCalc     = lazy(() => import('@/calculators/math/StatisticsCalc/StatisticsCalc'))
const ZScoreCalc         = lazy(() => import('@/calculators/math/ZScoreCalc/ZScoreCalc'))
const TriangleCalc       = lazy(() => import('@/calculators/math/TriangleCalc/TriangleCalc'))
const LongDivisionCalc   = lazy(() => import('@/calculators/math/LongDivisionCalc/LongDivisionCalc'))
const LogCalc            = lazy(() => import('@/calculators/math/LogCalc/LogCalc'))
const MatrixCalc         = lazy(() => import('@/calculators/math/MatrixCalc/MatrixCalc'))
const MarginCalc         = lazy(() => import('@/calculators/business/MarginCalc/MarginCalc'))
const BreakEvenCalc      = lazy(() => import('@/calculators/business/BreakEvenCalc/BreakEvenCalc'))
const BusinessLoanCalc   = lazy(() => import('@/calculators/business/BusinessLoanCalc/BusinessLoanCalc'))
const SalesCommissionCalc = lazy(() => import('@/calculators/business/SalesCommissionCalc/SalesCommissionCalc'))
const DiscountCalc       = lazy(() => import('@/calculators/business/DiscountCalc/DiscountCalc'))
const DTICalc            = lazy(() => import('@/calculators/business/DTICalc/DTICalc'))
const BudgetCalc         = lazy(() => import('@/calculators/business/BudgetCalc/BudgetCalc'))
const LTVCACCalc         = lazy(() => import('@/calculators/business/LTVCACCalc/LTVCACCalc'))
const BillableRateCalc   = lazy(() => import('@/calculators/business/BillableRateCalc/BillableRateCalc'))
const PaypalFeeCalc      = lazy(() => import('@/calculators/business/PaypalFeeCalc/PaypalFeeCalc'))

function Loader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
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
            <Route path="/" element={<HomePage />} />

            <Route path="/finance" element={<FinancePage />} />
            <Route path="/finance/income-tax-calculator" element={<TaxCalc />} />
            <Route path="/finance/compound-interest-calculator" element={<CompoundInterest />} />
            <Route path="/finance/savings-goal-calculator" element={<SavingsGoal />} />
            <Route path="/finance/investment-roi-calculator" element={<InvestmentROI />} />
            <Route path="/finance/retirement-calculator" element={<RetirementCalc />} />
            <Route path="/finance/inflation-calculator" element={<InflationCalc />} />
            <Route path="/finance/401k-calculator" element={<Calculator401k />} />
            <Route path="/finance/roth-ira-calculator" element={<RothIRA />} />
            <Route path="/finance/simple-interest-calculator" element={<SimpleInterest />} />
            <Route path="/finance/take-home-pay-calculator" element={<TakeHomePay />} />
            <Route path="/finance/cd-calculator" element={<CDCalc />} />
            <Route path="/finance/bond-calculator" element={<BondCalc />} />

            <Route path="/real-estate" element={<RealEstatePage />} />
            <Route path="/real-estate/mortgage-calculator" element={<MortgageCalc />} />
            <Route path="/real-estate/amortization-calculator" element={<AmortizationCalc />} />
            <Route path="/real-estate/rent-vs-buy-calculator" element={<RentVsBuy />} />
            <Route path="/real-estate/house-affordability-calculator" element={<HouseAffordability />} />
            <Route path="/real-estate/refinance-calculator" element={<RefinanceCalc />} />
            <Route path="/real-estate/fha-loan-calculator" element={<FHALoanCalc />} />
            <Route path="/real-estate/va-mortgage-calculator" element={<VAMortgageCalc />} />
            <Route path="/real-estate/home-equity-loan-calculator" element={<HomeEquityCalc />} />
            <Route path="/real-estate/rental-property-roi-calculator" element={<RentalROI />} />
            <Route path="/real-estate/down-payment-calculator" element={<DownPaymentCalc />} />
            <Route path="/real-estate/mortgage-payoff-calculator" element={<MortgagePayoff />} />
            <Route path="/real-estate/heloc-calculator" element={<HELOCCalc />} />

            <Route path="/math" element={<MathPage />} />
            <Route path="/math/percentage-calculator" element={<PercentageCalc />} />
            <Route path="/math/fraction-calculator" element={<FractionCalc />} />
            <Route path="/math/scientific-calculator" element={<ScientificCalc />} />
            <Route path="/math/standard-deviation-calculator" element={<StdDevCalc />} />
            <Route path="/math/quadratic-formula-calculator" element={<QuadraticCalc />} />
            <Route path="/math/probability-calculator" element={<ProbabilityCalc />} />
            <Route path="/math/statistics-calculator" element={<StatisticsCalc />} />
            <Route path="/math/z-score-calculator" element={<ZScoreCalc />} />
            <Route path="/math/triangle-calculator" element={<TriangleCalc />} />
            <Route path="/math/long-division-calculator" element={<LongDivisionCalc />} />
            <Route path="/math/log-calculator" element={<LogCalc />} />
            <Route path="/math/matrix-calculator" element={<MatrixCalc />} />
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/business/margin-markup-calculator" element={<MarginCalc />} />
            <Route path="/business/break-even-calculator" element={<BreakEvenCalc />} />
            <Route path="/business/business-loan-calculator" element={<BusinessLoanCalc />} />
            <Route path="/business/sales-commission-calculator" element={<SalesCommissionCalc />} />
            <Route path="/business/discount-calculator" element={<DiscountCalc />} />
            <Route path="/business/dti-ratio-calculator" element={<DTICalc />} />
            <Route path="/business/budget-allocation-calculator" element={<BudgetCalc />} />
            <Route path="/business/ltv-cac-calculator" element={<LTVCACCalc />} />
            <Route path="/business/billable-rate-calculator" element={<BillableRateCalc />} />
            <Route path="/business/paypal-fee-calculator" element={<PaypalFeeCalc />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}