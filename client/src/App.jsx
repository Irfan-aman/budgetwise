import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/income" element={<PrivateRoute><Income /></PrivateRoute>} />
            <Route path="/expense" element={<PrivateRoute><Expense /></PrivateRoute>} />
            <Route path="/budget" element={<PrivateRoute><Budget /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
