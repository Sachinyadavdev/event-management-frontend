import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './hooks/useAuth.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { ToastProvider } from './hooks/useToast.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';
import BackToTop from './components/shared/BackToTop.jsx';

// Public Pages
import HomePage from './pages/public/HomePage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import EventsPage from './pages/public/EventsPage.jsx';
import EventDetails from './pages/public/EventDetails.jsx';
import EventPage from './pages/public/EventPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import Registration from './pages/auth/Registration.jsx';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/public/ResetPasswordPage.jsx';

// Demo Components
import AssetsDemonstration from './components/demo/AssetsDemonstration.jsx';
import SimpleAssetsTest from './components/demo/SimpleAssetsTest.jsx';
import ToastDemo from './components/demo/ToastDemo.jsx';
import IsacaLogoShowcase from './components/demo/IsacaLogoShowcase.jsx';
import FaviconTest from './components/demo/FaviconTest.jsx';
import ErrorPagesDemo from './pages/demo/ErrorPagesDemo.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import EventsManagement from './components/admin/EventsManagement.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';

// Error Pages
import NotFoundPage from './pages/error/NotFoundPage.jsx';
import SimpleNotFoundTest from './pages/error/SimpleNotFoundTest.jsx';
import UnauthorizedPage from './pages/error/UnauthorizedPage.jsx';

// Lazy load UserDashboard for code splitting
const UserDashboard = lazy(() => import('./pages/user/UserDashboard.jsx'));

function App() {
  return (
    <ThemeProvider>
      <ToastProvider position="top-right" maxToasts={5}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/event/:id" element={<EventPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/assets-demo" element={<AssetsDemonstration />} />
              <Route path="/assets-test" element={<SimpleAssetsTest />} />
              <Route path="/toast-demo" element={<ToastDemo />} />
              <Route path="/logo-showcase" element={<IsacaLogoShowcase />} />
              <Route path="/favicon-test" element={<FaviconTest />} />
              <Route path="/error-pages-demo" element={<ErrorPagesDemo />} />
              <Route path="/404-test" element={<NotFoundPage />} />
          
            {/* User Dashboard Route (non-admin) */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuth={true}>
                <Suspense fallback={<div>Loading...</div>}>
                  <UserDashboard />
                </Suspense>
              </ProtectedRoute>
            } />
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="content" element={<div className="p-6">Content Management - Coming Soon</div>} />
            <Route path="settings" element={<div className="p-6">Settings - Coming Soon</div>} />
          </Route>
          
          {/* Error Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/test-simple-404" element={<SimpleNotFoundTest />} />
          <Route path="*" element={<NotFoundPage />} />
            </Routes>
            
            {/* Toast Container */}
            <ToastContainer />
            
            {/* Back to Top Button - Available throughout the app */}
            <BackToTop />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
