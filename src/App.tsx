import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import CalculatorsIndex from './pages/CalculatorsIndex'
import CompoundInterest from './pages/calculators/CompoundInterest'
import LoanPayment from './pages/calculators/LoanPayment'
import MortgagePayment from './pages/calculators/MortgagePayment'
import StudentLoanPayoff from './pages/calculators/StudentLoanPayoff'
import InvestmentFeeImpact from './pages/calculators/InvestmentFeeImpact'
import SalaryToHourly from './pages/calculators/SalaryToHourly'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Accessibility from './pages/Accessibility'
import NotFound from './pages/NotFound'

export const AppRoutes = () => {
  return (
    <Layout>
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
    </Layout>
  )
}

export default AppRoutes
