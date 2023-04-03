import { Routes, Route } from 'react-router-dom'
// import { Signin }   from './pages/Login.jsx';
import { Home } from './pages/Home.jsx';
import { Income } from './pages/Income.jsx';
import { Outcome } from './pages/Outcome.jsx';
import { MainLayout } from './core/layout/MainLayout'
import { Documents } from './pages/Documents.jsx';
import { Vacations } from './pages/Vacations.jsx';
import { Payroll } from './pages/Payroll.jsx';

export const App = () => {
  return (
    
    <Routes>

      <Route path="/" element={<MainLayout />} >
        <Route index element={<Home />}/>
        <Route path="/income" element={<Income />} />
        <Route path="/outcome" element={<Outcome />} />
        <Route path="/vacations" element={<Vacations />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/documents" element={<Documents />} />
      </Route>
    </Routes>
    
  );
}
