import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isAuthenticated ? '/dashboard' : '/'}>BudgetWise</Link>
      </div>
      {isAuthenticated && (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/income">Income</Link>
          <Link to="/expense">Expense</Link>
          <Link to="/budget">Budget</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/transactions">History</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/profile">Profile</Link>
          <span className="navbar-user">Hi, {user?.name}</span>
          <button className="btn-link" onClick={handleLogout}>Logout</button>
        </div>
      )}
      {!isAuthenticated && (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}
