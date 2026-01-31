import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const CalculatorsIndex = lazy(() => import('./pages/CalculatorsIndex'))
const CompoundInterest = lazy(() => import('./pages/calculators/CompoundInterest'))
const LoanPayment = lazy(() => import('./pages/calculators/LoanPayment'))
const MortgagePayment = lazy(() => import('./pages/calculators/MortgagePayment'))
const StudentLoanPayoff = lazy(() => import('./pages/calculators/StudentLoanPayoff'))
const InvestmentFeeImpact = lazy(() => import('./pages/calculators/InvestmentFeeImpact'))
const SalaryToHourly = lazy(() => import('./pages/calculators/SalaryToHourly'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Accessibility = lazy(() => import('./pages/Accessibility'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div className="panel">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculators" element={<CalculatorsIndex />} />
            <Route path="/calculators/compound-interest" element={<CompoundInterest />} />
            <Route path="/calculators/loan-payment" element={<LoanPayment />} />
            <Route path="/calculators/mortgage-payment" element={<MortgagePayment />} />
            <Route path="/calculators/student-loan-payoff" element={<StudentLoanPayoff />} />
            <Route path="/calculators/investment-fee-impact" element={<InvestmentFeeImpact />} />
            <Route path="/calculators/salary-to-hourly" element={<SalaryToHourly />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default App
