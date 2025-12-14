import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import ForInspectors from './pages/ForInspectors'
import ForHomeowners from './pages/ForHomeowners'
import ForPropertyManagers from './pages/ForPropertyManagers'
import Pricing from './pages/Pricing'
import DemoReport from './pages/DemoReport'
import HowAIWorks from './pages/HowAIWorks'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import CaseStudies from './pages/CaseStudies'
import Comparison from './pages/Comparison'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import NewInspection from './pages/NewInspection'
import InspectionDetail from './pages/InspectionDetail'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSystem from './pages/admin/AdminSystem'
import PromoteAdmin from './pages/PromoteAdmin'

import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Marketing Site */}
          <Route path="/" element={<Landing />} />
          <Route path="/solutions/inspectors" element={<ForInspectors />} />
          <Route path="/solutions/homeowners" element={<ForHomeowners />} />
          <Route path="/solutions/property-managers" element={<ForPropertyManagers />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/demo" element={<DemoReport />} />
          <Route path="/how-ai-works" element={<HowAIWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/promote-admin" element={<PromoteAdmin />} />
          
          {/* App */}
          <Route path="/app" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:id" element={<PropertyDetail />} />
            <Route path="inspections" element={<Dashboard />} />
            <Route path="inspections/new" element={<NewInspection />} />
            <Route path="inspections/:id" element={<InspectionDetail />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/analytics" element={
            <PrivateRoute>
              <AdminLayout>
                <AdminAnalytics />
              </AdminLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/system" element={
            <PrivateRoute>
              <AdminLayout>
                <AdminSystem />
              </AdminLayout>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
