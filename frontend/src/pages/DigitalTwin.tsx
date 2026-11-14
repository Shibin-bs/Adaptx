import { motion } from 'framer-motion'
import HumanHologram from '../components/HumanHologram'
export default function DigitalTwin() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl text-cyan-400 mb-1">Physiological Digital Twin</h1>
        <p className="font-mono text-xs text-gray-400">Interactive 3D physiological model with real-time health overlay.</p>
      </div>
      <div className="flex-1 glass-panel-dark neon-border rounded-xl overflow-hidden">
        <HumanHologram />
      </div>
    </motion.div>
  )
}
