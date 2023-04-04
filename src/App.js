import { Routes, Route } from 'react-router-dom'
import { LoginPage }   from './pages/Login.jsx';
import { Home } from './pages/Home.jsx';
import { Income } from './pages/Income.jsx';
import { Outcome } from './pages/Outcome.jsx';
import { MainLayout } from './core/layout/MainLayout'
import { Documents } from './pages/Documents.jsx';
import { Vacations } from './pages/Vacations.jsx';
import { Payroll } from './pages/Payroll.jsx';
import { Suppliers } from './pages/Suppliers.jsx';
import { Invoices } from './pages/Invoices.jsx';
import { ExpenseTickets } from './pages/ExpenseTickets.jsx';

export const App = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="/" element={<MainLayout />} >
        <Route index element={<Home />}/>
        <Route path="/income" element={<Income />} />
        <Route path="/outcome" element={<Outcome />} >
            <Route path=':expense-tickets' element={<ExpenseTickets />} />
            <Route path=':invoices' element={<Invoices />} />
            <Route path=':suppliers' element={<Suppliers />} />
        </Route>
        <Route path="/vacations" element={<Vacations />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/documents" element={<Documents />} />
      </Route>
    </Routes>
    
  );
}
