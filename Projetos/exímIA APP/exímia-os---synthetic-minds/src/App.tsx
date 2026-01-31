import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './test-connection'
import { Login } from '../components/pages/Login'
import { ForgotPassword } from '../components/pages/ForgotPassword'
import { ResetPassword } from '../components/pages/ResetPassword'
import { AuthCallback } from '../components/pages/AuthCallback'
import { AppWrapper } from '../components/pages/AppWrapper'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18181B',
            color: '#fff',
            border: '1px solid #27272A',
          },
          success: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected route - Main application */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppWrapper />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
