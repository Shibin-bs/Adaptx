import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
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
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<AstronautProfile />} />
          <Route path="digital-twin" element={<DigitalTwin />} />
          <Route path="health" element={<HealthMonitoring />} />
          <Route path="analytics" element={<PredictiveAnalytics />} />
          <Route path="earth-space" element={<EarthSpaceReconstruction />} />
          <Route path="environment" element={<EnvironmentalAnalysis />} />
          <Route path="adaptation" element={<AdaptationEngine />} />
          <Route path="simulator" element={<CounterfactualSimulator />} />
          <Route path="datasets" element={<DatasetExplorer />} />
          <Route path="models" element={<ModelPerformance />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
