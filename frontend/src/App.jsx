import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import AuthSelection from './AuthSelection/AuthSelection';
import SignupForm from './AuthForm/SignupForm';
import LoginForm from './AuthForm/LoginForm';
import CustomerDashboard from './Dashboard/CustomerDashboard';
import AgencyDashboard from './Dashboard/AgencyDashboard';
import AdminDashboard from './Dashboard/AdminDashboard';
import AddProduct from './AddProduct/AddProduct';
import MyProducts from './MyProducts/MyProducts';
import Analytics from './Analytics/Analytics';
import Messages from './Messages/Messages';
import Settings from './Settings/Settings';
import BrowseProducts from './BrowseProducts/BrowseProducts';
import ProductDetail from './ProductDetail/ProductDetail';
import Orders from './Orders/Orders';
import Watchlist from './Watchlist/Watchlist';
import Support from './Support/Support';
import UploadDocuments from './UploadDocuments/UploadDocuments';
import DocumentApproval from './DocumentApproval/DocumentApproval';
import Checkout from './Checkout/Checkout';
import PendingProducts from './AdminProducts/PendingProducts';
import AllProducts from './AdminProducts/AllProducts';
import AdminUsers from './AdminUsers/AdminUsers';
import AdminAnalytics from './AdminAnalytics/AdminAnalytics';
import AgencyOrders from './AgencyOrders/AgencyOrders';
import Features from './StaticPages/Features';
import HowItWorks from './StaticPages/HowItWorks';
import About from './StaticPages/About';
import PrivacyPolicy from './StaticPages/PrivacyPolicy';
import TermsOfService from './StaticPages/TermsOfService';
import Compliance from './StaticPages/Compliance';
import HelpCenter from './StaticPages/HelpCenter';
import ContactUs from './StaticPages/ContactUs';
import FAQ from './StaticPages/FAQ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<AuthSelection type="signup" />} />
        <Route path="/login" element={<AuthSelection type="login" />} />
        <Route path="/signup/:userType" element={<SignupForm />} />
        <Route path="/login/:userType" element={<LoginForm />} />
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/agency" element={<AgencyDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/upload-documents" element={<UploadDocuments />} />
        <Route path="/document-approval" element={<DocumentApproval />} />
        <Route path="/admin/pending-products" element={<PendingProducts />} />
        <Route path="/admin/all-products" element={<AllProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/browse-products" element={<BrowseProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/agency-orders" element={<AgencyOrders />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/support" element={<Support />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Shared Routes */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;