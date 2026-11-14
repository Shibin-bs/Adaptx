import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { DemoAuthProvider } from './context/DemoAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AstronautProfile from './pages/AstronautProfile'
import DigitalTwin from './pages/DigitalTwin'
import HealthMonitoring from './pages/HealthMonitoring'
import PredictiveAnalytics from './pages/PredictiveAnalytics'
import EarthSpaceReconstruction from './pages/EarthSpaceReconstruction'
import EnvironmentalAnalysis from './pages/EnvironmentalAnalysis'
import AdaptationEngine from './pages/AdaptationEngine'
import CounterfactualSimulator from './pages/CounterfactualSimulator'
import DatasetExplorer from './pages/DatasetExplorer'
import ModelPerformance from './pages/ModelPerformance'
import Settings from './pages/Settings'

export default function App() {
  return (
    <DemoAuthProvider>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Landing & Cinematic Earth Authentication Experience */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />

          {/* Protected Spaceflight Mission Control Workstations */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<AstronautProfile />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/health" element={<HealthMonitoring />} />
            <Route path="/analytics" element={<PredictiveAnalytics />} />
            <Route path="/earth-space" element={<EarthSpaceReconstruction />} />
            <Route path="/environment" element={<EnvironmentalAnalysis />} />
            <Route path="/adaptation" element={<AdaptationEngine />} />
            <Route path="/simulator" element={<CounterfactualSimulator />} />
            <Route path="/datasets" element={<DatasetExplorer />} />
            <Route path="/models" element={<ModelPerformance />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </DemoAuthProvider>
  )
}
