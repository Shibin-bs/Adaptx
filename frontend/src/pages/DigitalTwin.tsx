import { useState } from 'react'
import { motion } from 'framer-motion'
import HumanHologram from '../components/HumanHologram'
import {
  Box,
  Heart,
  Brain,
  Bone,
  Wind,
  FlaskConical,
  Zap,
} from 'lucide-react'

export default function DigitalTwin() {
  const [selectedSystem, setSelectedSystem] = useState<string>('all')
  const [simSpeed, setSimSpeed] = useState<string>('1x')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-4 p-4 lg:p-6 font-mono text-xs select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <Box size={18} className="text-cyan-400" />
            <h1 className="font-display text-base font-bold text-white tracking-wider text-glow-cyan">
              PHYSIOLOGICAL DIGITAL TWIN WORKSTATION
            </h1>
          </div>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Real-time biometric reverse engineering & multi-organ state estimation · CDR Dr. Sarah Chen
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-bio-cyan animate-pulse shadow-[0_0_8px_#06b6d4]" />
            <span className="text-gray-300">KALMAN FILTER:</span>
            <span className="text-cyan-300 font-bold">95.4% CONFIDENCE</span>
          </div>

          {/* Sim Speed */}
          <div className="flex rounded-lg bg-black/60 border border-cyan-500/30 p-0.5">
            {['1x', '2x', '5x'].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  simSpeed === spd ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3D Viewport with System Navigation Bar */}
      <div className="flex-1 min-h-[640px] bg-[#020817] border border-cyan-500/30 rounded-xl overflow-hidden relative flex flex-col">
        {/* Quick System Filter Bar */}
        <div className="p-2.5 bg-[#071A33]/90 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 z-10 backdrop-blur-md">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mr-1">
              SYSTEM ISOLATE:
            </span>
            {[
              { id: 'all', label: 'All Systems', icon: Box },
              { id: 'cardio', label: 'Cardiovascular', icon: Heart },
              { id: 'neuro', label: 'Neurological', icon: Brain },
              { id: 'skeletal', label: 'Musculoskeletal', icon: Bone },
              { id: 'pulmonary', label: 'Pulmonary', icon: Wind },
              { id: 'metabolic', label: 'Endocrine & Renal', icon: FlaskConical },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedSystem(id)}
                className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 text-[11px] ${
                  selectedSystem === id
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)] font-bold'
                    : 'bg-black/40 border-white/5 text-gray-400 hover:text-white hover:border-cyan-500/30'
                }`}
              >
                <Icon size={12} className={selectedSystem === id ? 'text-cyan-400' : 'text-gray-500'} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="text-[10px] text-bio-cyan font-mono flex items-center gap-1.5">
            <Zap size={11} />
            <span>OPEN ANATOMY 3D · DYNAMIC TELEMETRY SYNCED</span>
          </div>
        </div>

        {/* 3D Human Holographic Canvas */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          <HumanHologram />
        </div>
      </div>
    </motion.div>
  )
}
