import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './Pages/HomePage';
import TopBanner from './Components/TopBanner';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import LoginPage from './Pages/LoginPage';
import { useState } from 'react';
import AuthServices from './Services/AuthServices';
import AuthContext from './Contexts/AuthContext';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import ProfilePage from './Pages/ProfilePage';
import LegalNoticePage from './Pages/LegalNoticePage';
import TermsOfSalePage from './Pages/TermsOfSalePage';
import TermsOfUsePage from './Pages/TermsOfUsePage';
import PrivacyPolicyPage from './Pages/PrivacyPolicyPage';
import ContactPage from './Pages/ContactPage';
import FaqPage from './Pages/FaqPage';
import OurValuesPage from './Pages/OurValues';
import ScrollTop from './Components/ScrollTop';
import ProductPage from './Pages/ProductPage';
import Cart from './Components/Cart';
import { CartProvider } from './Contexts/CartContext';
import ReservationPage from './Pages/ReservationPage';
import ReservationWrapper from './Wrappers/ReservationWrapper';
import ConfirmationPage from './Pages/ConfirmationPage';
import ConfirmationWrapper from './Wrappers/ConfirmationWrapper';
import ProductListPage from './Pages/ProductListPage';
import AdminPanelPage from './Pages/AdminPanelPage';
import OrderPanelPage from './Pages/OrderPanelPage';
import AdminRoute from './Components/AdminRoute';
import PrivateRoute from './Components/PrivateRoute';

function AppContent() {
  const [isConnected, setIsConnected] = useState(AuthServices.isConnected());
  const [role, setRole] = useState(AuthServices.getRole());
  const [user, setUser] = useState(AuthServices.getUser());
  const [cartOpen, setCartOpen] = useState(false);

  const location = useLocation();
  const hideLayout = location.pathname === '/reservation' || location.pathname === '/confirmation';

  return (
    <AuthContext.Provider value={{ isConnected, setIsConnected, role, setRole, user, setUser }}>
      <CartProvider>
        <div className="app-container d-flex flex-column min-vh-100">
          {!hideLayout && <TopBanner />}
          {!hideLayout && <NavBar onCartClick={() => setCartOpen(true)} />}
          <main className="main-content flex-grow-1">
            <ScrollTop />
            {!hideLayout && <Cart show={cartOpen} onHide={() => setCartOpen(false)} />}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/legal-notice" element={<LegalNoticePage />} />
              <Route path="/terms-of-sale" element={<TermsOfSalePage />} />
              <Route path="/terms-of-use" element={<TermsOfUsePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/our-values" element={<OurValuesPage />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/products/:offerType" element={<ProductListPage />} />
              <Route path="/reservation" element={
                <PrivateRoute>
                  <ReservationWrapper />
                </PrivateRoute>
              } />
              <Route path="/confirmation" element={
                <PrivateRoute>
                  <ConfirmationWrapper />
                </PrivateRoute>
              } />
              <Route path="/admin-panel" element={
                <AdminRoute>
                  <AdminPanelPage />
                </AdminRoute>
              } />
              <Route path='/todo' element={
                <AdminRoute>
                  <OrderPanelPage />
                </AdminRoute>
              } />
            </Routes>
          </main>
          {!hideLayout && <Footer />}
          <ToastContainer
            position="bottom-center"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </CartProvider>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
