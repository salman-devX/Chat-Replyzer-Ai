import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Marketing Pages
import { Home } from '../pages/public/Home';
import { Features } from '../pages/public/Features';
import { HowItWorks } from '../pages/public/HowItWorks';
import { UseCases } from '../pages/public/UseCases';
import { Pricing } from '../pages/public/Pricing';
import { About } from '../pages/public/About';
import { Security } from '../pages/public/Security';
import { Integrations } from '../pages/public/Integrations';
import { FAQ } from '../pages/public/FAQ';
import { Contact } from '../pages/public/Contact';
import { Privacy } from '../pages/public/Privacy';
import { Terms } from '../pages/public/Terms';

// Auth Pages
import { Login } from '../pages/public/Login';
import { Signup } from '../pages/public/Signup';
import { ForgotPassword } from '../pages/public/ForgotPassword';
import { VerifyEmail } from '../pages/public/VerifyEmail';

// Onboarding Wizard
import { OnboardingWizard } from '../pages/onboarding/OnboardingWizard';

// Authenticated Dashboard Pages
import { Dashboard } from '../pages/dashboard/Dashboard';
import { ConversationsInbox } from '../pages/dashboard/ConversationsInbox';
import { PersonalityStudio } from '../pages/dashboard/PersonalityStudio';
import { ConversationLab } from '../pages/dashboard/ConversationLab';
import { AdminPanel } from '../pages/admin/AdminPanel';

// Protected Route Guard
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-navy-600 text-xs font-semibold">
        Verifying authentication credentials...
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Admin-Only Route Guard
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <div className="p-8 text-center text-xs text-navy-500">Checking administrator privileges...</div>;
  }
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with Header & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/security" element={<Security />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Onboarding Wizard (Accessible to registered / onboarding users) */}
      <Route path="/onboarding" element={<OnboardingWizard />} />

      {/* Protected Dashboard Shell */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="conversations" element={<ConversationsInbox />} />
        <Route path="personality" element={<PersonalityStudio />} />
        <Route path="lab" element={<ConversationLab />} />
      </Route>

      {/* Protected Admin Shell */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminPanel />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
