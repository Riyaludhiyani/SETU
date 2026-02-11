import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import LandingPage from './LandingPage/LandingPage.jsx';
import AuthSelection from './AuthSelection/AuthSelection.jsx';
import SignupForm from './AuthForm/SignupForm.jsx';
import LoginForm from './AuthForm/LoginForm.jsx';
import CustomerDashboard from './Dashboard/CustomerDashboard.jsx';
import AgencyDashboard from './Dashboard/AgencyDashboard.jsx';
import AddProduct from './AddProduct/AddProduct.jsx';
import MyProducts from './MyProducts/MyProducts.jsx';
=======
import LandingPage from './LandingPage/LandingPage';
import AuthSelection from './AuthSelection/AuthSelection';
import SignupForm from './AuthForm/SignupForm';
import LoginForm from './AuthForm/LoginForm';
import CustomerDashboard from './Dashboard/CustomerDashboard';
import AgencyDashboard from './Dashboard/AgencyDashboard';
import AddProduct from './AddProduct/AddProduct';
import MyProducts from './MyProducts/MyProducts';
import Analytics from './Analytics/Analytics';
import Messages from './Messages/Messages';
import Settings from './Settings/Settings';
import BrowseProducts from './BrowseProducts/BrowseProducts';
import ProductDetail from './ProductDetail/ProductDetail';
import Orders from './Orders/Orders';
import Watchlist from './Watchlist/Watchlist';
>>>>>>> 5137482c498d5c5f1ccbf431868ddf14606f9793

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
        <Route path="/analytics" element={<Analytics />} />

        {/* Customer Routes */}
        <Route path="/browse-products" element={<BrowseProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/watchlist" element={<Watchlist />} />

        {/* Shared Routes */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;