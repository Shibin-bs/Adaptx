import { motion } from 'framer-motion'
export default function DatasetExplorer() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h1 className="font-display text-2xl text-cyan-400 mb-2">NASA Dataset Explorer</h1>
      <p className="font-mono text-sm text-gray-400">NASA OSDR dataset ingestion, inspection and preprocessing pipeline. Full implementation in Phase 4.</p>
    </motion.div>
  )
}
