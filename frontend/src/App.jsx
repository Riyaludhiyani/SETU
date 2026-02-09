import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import AuthSelection from './AuthSelection/AuthSelection';
import SignupForm from './AuthForm/SignupForm';
import LoginForm from './AuthForm/LoginForm';
import CustomerDashboard from './Dashboard/CustomerDashboard';
import AgencyDashboard from './Dashboard/AgencyDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Selection Pages */}
        <Route path="/signup" element={<AuthSelection type="signup" />} />
        <Route path="/login" element={<AuthSelection type="login" />} />
        
        {/* Signup Forms */}
        <Route path="/signup/:userType" element={<SignupForm />} />
        
        {/* Login Forms */}
        <Route path="/login/:userType" element={<LoginForm />} />
        
        {/* Dashboards */}
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/agency" element={<AgencyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;