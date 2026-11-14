import { motion } from 'framer-motion'
import { Shield, Award, Activity, Dumbbell, Clock } from 'lucide-react'

export default function AstronautProfile() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div>
          <h1 className="font-display text-xl font-bold text-cyan-400 text-glow-cyan flex items-center gap-2">
            <Shield size={18} />
            ASTRONAUT BIOMETRIC PROFILE & FLIGHT RECORD
          </h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Individualized physiological baseline, mission genomics & operational countermeasure logs
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-[11px]">
          CLEARANCE: FLIGHT SURGEON LEVEL 4
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-panel-dark neon-border p-4 rounded-xl flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-purple-600/20 border-2 border-cyan-400/50 flex items-center justify-center text-4xl shadow-[0_0_24px_rgba(6,182,212,0.4)] flex-shrink-0">
          👩‍🚀
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg font-bold text-white text-glow-cyan">
              DR. SARAH CHEN, MD, PhD
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-bio-cyan/20 border border-bio-cyan/40 text-bio-cyan font-bold">
              ACTIVE IN FLIGHT
            </span>
          </div>
          <p className="text-cyan-400 text-xs">
            Mission Commander (CDR) · NASA Astronaut Corps Class 22 · Flight Medical Specialist
          </p>
          <div className="grid grid-cols-4 gap-3 pt-2 text-[11px]">
            <div>
              <span className="text-gray-500 block text-[9px]">ASSIGNMENT</span>
              <span className="text-white font-bold">ARTEMIS-VII</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px]">TIME IN ORBIT</span>
              <span className="text-cyan-300 font-bold">142d 08h 24m</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px]">CUMULATIVE SPACE TIME</span>
              <span className="text-white font-bold">322 Days (2 Flights)</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px]">EVA TOTAL TIME</span>
              <span className="text-cyan-300 font-bold">21h 45m (3 EVAs)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Terrestrial Baseline vs Physical Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {/* Baseline Anthropometrics */}
        <div className="glass-panel-dark p-4 rounded-xl border border-cyan-500/20 space-y-2">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-white/5">
            <Activity size={12} />
            <span>Terrestrial Baselines (Pre-Flight)</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Pre-Flight Stature:</span>
              <span className="text-white font-bold">172.0 cm</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Pre-Flight Mass:</span>
              <span className="text-white font-bold">64.5 kg</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Body Composition:</span>
              <span className="text-white font-bold">18.4% fat / 81.6% LBM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Resting Metabolic Rate:</span>
              <span className="text-white font-bold">1,480 kcal/day</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Blood Type:</span>
              <span className="text-cyan-300 font-bold">O-Positive (Rh+)</span>
            </div>
          </div>
        </div>

        {/* Aerobic & Muscular Performance */}
        <div className="glass-panel-dark p-4 rounded-xl border border-cyan-500/20 space-y-2">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-white/5">
            <Dumbbell size={12} />
            <span>Cardiopulmonary & Fitness</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">VO₂ Max (Pre-Flight):</span>
              <span className="text-bio-cyan font-bold">46.5 mL/kg/min</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">VO₂ Max (Orbit Est.):</span>
              <span className="text-warning-amber font-bold">42.8 mL/kg/min (-8%)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Max Isometric Leg Force:</span>
              <span className="text-white font-bold">1,820 N (91% baseline)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Grip Strength (Dominant):</span>
              <span className="text-white font-bold">36.5 kg (96% baseline)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Daily Exercise Compliance:</span>
              <span className="text-bio-cyan font-bold">98.2% (139/142 days)</span>
            </div>
          </div>
        </div>

        {/* Space Genomics & Biomarkers */}
        <div className="glass-panel-dark p-4 rounded-xl border border-cyan-500/20 space-y-2">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-white/5">
            <Award size={12} />
            <span>Space Omics / NASA Standard Measures</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Telomere Dynamics:</span>
              <span className="text-cyan-300 font-bold">+11% elongation (in-flight)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Mitochondrial Heteroplasmy:</span>
              <span className="text-white font-bold">Stable (&lt; 0.05%)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Immune Reactivation:</span>
              <span className="text-bio-cyan font-bold">EBV / VZV undetectable</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Cumulative Radiation Dose:</span>
              <span className="text-warning-amber font-bold">148.5 mSv (Career: 18%)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">SANS Grade:</span>
              <span className="text-bio-cyan font-bold">Grade 0 (No disc edema)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Countermeasure Schedule */}
      <div className="glass-panel-dark p-4 rounded-xl border border-cyan-500/20">
        <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock size={12} />
          <span>Operational Flight Schedule (UTC ENTRAYED)</span>
        </div>
        <div className="grid grid-cols-6 gap-2 text-center text-[10px]">
          <div className="p-2 rounded bg-black/40 border border-white/5">
            <span className="text-gray-500 block">06:00 - 07:00</span>
            <span className="text-white font-bold block">Post-Sleep</span>
            <span className="text-bio-cyan">Biomarker Log</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-white/5">
            <span className="text-gray-500 block">07:30 - 09:00</span>
            <span className="text-cyan-300 font-bold block">ARED Resistive</span>
            <span className="text-gray-400">Axial Loading</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-white/5">
            <span className="text-gray-500 block">09:30 - 13:00</span>
            <span className="text-white font-bold block">Science Tasks</span>
            <span className="text-gray-400">ISS Payloads</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-white/5">
            <span className="text-gray-500 block">14:00 - 15:00</span>
            <span className="text-cyan-300 font-bold block">T2 Treadmill</span>
            <span className="text-bio-cyan">HIIT Interval</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-white/5">
            <span className="text-gray-500 block">16:00 - 19:30</span>
            <span className="text-white font-bold block">Station Systems</span>
            <span className="text-gray-400">Maintenance</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-white/5">
            <span className="text-gray-500 block">21:30 - 05:30</span>
            <span className="text-blue-300 font-bold block">Crew Sleep</span>
            <span className="text-amber-400">Light Depleted</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
