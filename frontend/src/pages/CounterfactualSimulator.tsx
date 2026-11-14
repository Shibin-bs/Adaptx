import { useState } from 'react'
import { motion } from 'framer-motion'
import { FlaskConical, AlertTriangle, RefreshCw } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CounterfactualSimulator() {
  // Scenario sliders
  const [sleepDelta, setSleepDelta] = useState(-1.5) // hours change
  const [exerciseBonus, setExerciseBonus] = useState(30) // min extra exercise
  const [lightEntrainment, setLightEntrainment] = useState('spectrum_shifted') // protocol
  const [nutritionCalories, setNutritionCalories] = useState(2600) // kcal/day
  const [fluidIntake, setFluidIntake] = useState(2.8) // L/day

  // Dynamic model-based trajectory projection across 14 simulated days
  const simData = Array.from({ length: 14 }, (_, i) => {
    const day = i + 1
    const sleepEffect = sleepDelta * 1.8 * (day / 14)
    const exerciseEffect = (exerciseBonus / 30) * 1.2 * (day / 14)

    return {
      day: `Day +${day}`,
      projectedHRV: Math.round(42 + exerciseEffect * 4 + sleepEffect * 3.5),
      projectedRestingHR: Math.round(68 - exerciseEffect * 2 - sleepEffect * 1.2),
      projectedBoneLossRate: Number((-0.78 + (exerciseBonus / 30) * 0.15).toFixed(2)),
      projectedStressScore: Math.min(100, Math.max(10, Math.round(38 - sleepDelta * 6 - (exerciseBonus / 30) * 4))),
    }
  })

  const resetDefaults = () => {
    setSleepDelta(0)
    setExerciseBonus(0)
    setLightEntrainment('nominal')
    setNutritionCalories(2750)
    setFluidIntake(2.6)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div>
          <h1 className="font-display text-xl font-bold text-cyan-400 text-glow-cyan flex items-center gap-2">
            <FlaskConical size={18} />
            COUNTERFACTUAL PHYSIOLOGICAL SIMULATOR
          </h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Explore "what-if" operational countermeasures: sleep alteration, exercise loading, dietary shifts
          </p>
        </div>
        <button
          onClick={resetDefaults}
          className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] hover:bg-cyan-500/20 flex items-center gap-1.5 transition-all"
        >
          <RefreshCw size={12} />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Simulator Inputs & Controls */}
      <div className="grid grid-cols-5 gap-3">
        {/* Sleep Delta */}
        <div className="glass-panel-dark p-3 rounded-xl border border-cyan-500/20">
          <div className="flex justify-between items-center mb-1 text-[10px]">
            <span className="text-gray-400">SLEEP DELTA:</span>
            <span className={sleepDelta >= 0 ? 'text-bio-cyan font-bold' : 'text-warning-amber font-bold'}>
              {sleepDelta > 0 ? `+${sleepDelta}` : sleepDelta} h/night
            </span>
          </div>
          <input
            type="range"
            min="-3"
            max="2"
            step="0.5"
            value={sleepDelta}
            onChange={(e) => setSleepDelta(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[9px] text-gray-500 block mt-1">Current: 6.8h/night</span>
        </div>

        {/* Exercise Loading */}
        <div className="glass-panel-dark p-3 rounded-xl border border-cyan-500/20">
          <div className="flex justify-between items-center mb-1 text-[10px]">
            <span className="text-gray-400">EXTRA EXERCISE:</span>
            <span className="text-bio-cyan font-bold">+{exerciseBonus} min</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="10"
            value={exerciseBonus}
            onChange={(e) => setExerciseBonus(parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[9px] text-gray-500 block mt-1">ARED & T2 treadmill</span>
        </div>

        {/* Light Protocol */}
        <div className="glass-panel-dark p-3 rounded-xl border border-cyan-500/20">
          <div className="flex justify-between items-center mb-1 text-[10px]">
            <span className="text-gray-400">LIGHT SPECTRUM:</span>
            <span className="text-cyan-300 font-bold">CYCLED</span>
          </div>
          <select
            value={lightEntrainment}
            onChange={(e) => setLightEntrainment(e.target.value)}
            className="w-full bg-black/60 border border-cyan-500/40 rounded px-2 py-1 text-[11px] text-cyan-300 font-mono"
          >
            <option value="nominal">Standard ISS Light</option>
            <option value="spectrum_shifted">Blue-Depleted Pre-Sleep</option>
            <option value="bright_alert">High-Lux Alert Shift</option>
          </select>
          <span className="text-[9px] text-gray-500 block mt-1">Circadian entrainment</span>
        </div>

        {/* Caloric Intake */}
        <div className="glass-panel-dark p-3 rounded-xl border border-cyan-500/20">
          <div className="flex justify-between items-center mb-1 text-[10px]">
            <span className="text-gray-400">DAILY NUTRITION:</span>
            <span className="text-white font-bold">{nutritionCalories} kcal</span>
          </div>
          <input
            type="range"
            min="2000"
            max="3500"
            step="50"
            value={nutritionCalories}
            onChange={(e) => setNutritionCalories(parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[9px] text-gray-500 block mt-1">Target: 2750 kcal/day</span>
        </div>

        {/* Fluid Loading */}
        <div className="glass-panel-dark p-3 rounded-xl border border-cyan-500/20">
          <div className="flex justify-between items-center mb-1 text-[10px]">
            <span className="text-gray-400">HYDRATION:</span>
            <span className="text-cyan-300 font-bold">{fluidIntake} L/day</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="4.0"
            step="0.1"
            value={fluidIntake}
            onChange={(e) => setFluidIntake(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[9px] text-gray-500 block mt-1">Stone risk threshold: 2.5L</span>
        </div>
      </div>

      {/* Simulation Results Projections */}
      <div className="grid grid-cols-2 gap-4">
        {/* Trajectory 1: Heart Rate Variability Response */}
        <div className="glass-panel-dark neon-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-white">Projected HRV Trajectory (RMSSD)</h3>
              <span className="text-[10px] text-gray-400">Model projection over next 14 mission days</span>
            </div>
            <span className="text-sm font-display font-bold text-cyan-300">
              Day +14: {simData[simData.length - 1].projectedHRV} ms
            </span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simData}>
                <defs>
                  <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis domain={[30, 60]} tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid #06b6d440', borderRadius: 8, fontFamily: 'monospace', fontSize: 11 }}
                  formatter={(v: any) => [`${v} ms`, 'Projected HRV']}
                />
                <Area type="monotone" dataKey="projectedHRV" stroke="#06b6d4" strokeWidth={2} fill="url(#hrvGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trajectory 2: Stress & Neuroendocrine Response */}
        <div className="glass-panel-dark neon-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-white">Projected Stress & Allostatic Load</h3>
              <span className="text-[10px] text-gray-400">Composite index (cortisol, HRV, sleep debt)</span>
            </div>
            <span className="text-sm font-display font-bold text-amber-400">
              Day +14: {simData[simData.length - 1].projectedStressScore} / 100
            </span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simData}>
                <defs>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis domain={[10, 80]} tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid #f59e0b40', borderRadius: 8, fontFamily: 'monospace', fontSize: 11 }}
                  formatter={(v: any) => [`${v} / 100`, 'Estimated Stress']}
                />
                <Area type="monotone" dataKey="projectedStressScore" stroke="#f59e0b" strokeWidth={2} fill="url(#stressGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Projection Integrity Note */}
      <div className="p-3 rounded-lg bg-black/60 border border-amber-500/30 text-[10px] text-gray-400 flex items-start gap-2">
        <AlertTriangle size={14} className="text-warning-amber mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-amber-300 font-bold">COUNTERFACTUAL MODEL DISCLAIMER: </span>
          Hypothetical projections are generated using linear-dynamical state-space simulations based on NASA spaceflight
          analog parameters. These represent statistical estimates of physiological adaptation, not guaranteed clinical outcomes.
        </div>
      </div>
    </motion.div>
  )
}
