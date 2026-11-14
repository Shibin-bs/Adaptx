import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDemoAuth } from '../context/DemoAuthContext'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useDemoAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#020817] flex flex-col items-center justify-center font-mono text-cyan-400">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <div className="text-xs uppercase tracking-widest text-glow-cyan animate-pulse">
          VERIFYING BIOLINK AUTHENTICATION...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated requests to Landing Page
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
