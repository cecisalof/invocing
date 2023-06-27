import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/Login.jsx';
import { Income } from './pages/income/Income.jsx';
import { AddIncome } from './pages/income/AddIncome.jsx';
import { Outcome } from './pages/Outcome.jsx';
import { MainLayout } from './core/layout/MainLayout'
import { Documents } from './pages/Documents.jsx';
import { Logout } from './pages/Logout.jsx';
import { Vacations } from './pages/Vacations.jsx';
import { Payroll } from './pages/Payroll.jsx';
import { Suppliers } from './pages/suppliers/Suppliers.jsx';
import { AddSupplier } from './pages/suppliers/AddSupplier.jsx';
import { ExpenseTickets } from './pages/expensesTickets/ExpenseTickets.jsx';
import { AddExpenseTickets } from './pages/expensesTickets/AddExpenseTickets.jsx';
import { InvoicesToPay } from './pages/invoicesToPay/InvoicesToPay.jsx';
import { AddInvoicesToPay } from './pages/invoicesToPay/AddInvoicesToPay.jsx';
import { Dashboard } from './pages/dashboard/Dashboard.jsx';
import UserState from './contexts/UserState';
import NotFound from './NotFound.js';

export const App = () => {
  return (
    <UserState>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout/>} >
          <Route index element={<Dashboard />}/>
          <Route path="/income" element={<Income />} />
          <Route path="/outcome" element={<Outcome />} >
              <Route path=':suppliers' element={<Suppliers />} />
              <Route path=':expense-tickets' element={<ExpenseTickets />} />
              <Route path=':invoices-to-pay' element={<InvoicesToPay />} />
          </Route>
          <Route path="/vacations" element={<Vacations />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/logout" element={<Logout />} />
          <Route path='/add-suppliers' element={<AddSupplier />} />
          <Route path='/add-income' element={<AddIncome />} />
          <Route path='/add-invoices-to-pay' element={<AddInvoicesToPay />} />
          <Route path='/add-expenses' element={<AddExpenseTickets />} />
          {/* Ruta para la página 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserState>
  );
}
