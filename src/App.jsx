import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import ProtectedRoute from './ProtectedRoute';

import LandingPage    from './LandingPage';
import Login          from './Login';
import SignUp         from './SignUp';
import NotFound       from './NotFound';
import Forgotpassword from './Forgotpassword';
import ResetPassword  from './ResetPassword';

import Welcome        from './Welcome';
import Buyer          from './Buyer';
import Productdetail  from './Productdetail';
// import Library      from './Library';
import Cart           from './Cart';
import Checkout       from './Checkout';
import Ordersuccess   from './Ordersuccess';
import Orders         from './Orders';
import Settings       from './Settings';

import SellerDashboard from './SellerDashboard';
import UploadProduct   from './UploadProduct';
import SellerProducts  from './SellerProducts';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>

          {/* ── Public ── */}
          <Route path="/"                         element={<LandingPage />} />
          <Route path="/getstarted"               element={<SignUp />} />
          <Route path="/login"                    element={<Login />} />
          <Route path="/forgot-password"          element={<Forgotpassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

          {/* ── Buyer ── */}
          <Route path="/welcome"       element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/buyer"         element={<ProtectedRoute><Buyer /></ProtectedRoute>} />
          <Route path="/product/:id"   element={<ProtectedRoute><Productdetail /></ProtectedRoute>} />
          {/* <Route path="/library"       element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} /> */}
          <Route path="/cart"          element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout"      element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><Ordersuccess /></ProtectedRoute>} />
          <Route path="/orders"        element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/settings"      element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* ── Seller ── */}
          <Route path="/seller"          element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/upload"   element={<ProtectedRoute><UploadProduct /></ProtectedRoute>} />
          <Route path="/seller/products" element={<ProtectedRoute><SellerProducts /></ProtectedRoute>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;