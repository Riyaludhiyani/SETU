import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage.jsx';
import AuthSelection from './AuthSelection/AuthSelection.jsx';
import SignupForm from './AuthForm/SignupForm.jsx';
import LoginForm from './AuthForm/LoginForm.jsx';
import CustomerDashboard from './Dashboard/CustomerDashboard.jsx';
import AgencyDashboard from './Dashboard/AgencyDashboard.jsx';
import AddProduct from './AddProduct/AddProduct.jsx';
import MyProducts from './MyProducts/MyProducts.jsx';

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

        {/* Agency Product Routes */}
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/my-products" element={<MyProducts />} />
      </Routes>
    </Router>
  );
}

export default App;