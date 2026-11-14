import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe2, Rocket, ArrowRightLeft, Sparkles, Sliders } from 'lucide-react'

interface ComparisonRow {
  category: string
  parameter: string
  unit: string
  earthBaseline: string | number
  spaceObserved: string | number
  deviation: string
  status: 'NOMINAL' | 'ADAPTED' | 'ELEVATED' | 'CRITICAL'
  predicted60d: string
}

const COMPARISONS: ComparisonRow[] = [
  { category: 'Physical Environment', parameter: 'Gravitational Acceleration', unit: 'm/s²', earthBaseline: '9.81 G (1.00 G)', spaceObserved: '0.001 G (μG)', deviation: '-99.99%', status: 'ADAPTED', predicted60d: '0.001 G' },
  { category: 'Physical Environment', parameter: 'Galactic & Solar Radiation', unit: 'mSv/day', earthBaseline: '0.008 (3.0/yr)', spaceObserved: '1.84 mSv/day', deviation: '+22,900%', status: 'ELEVATED', predicted60d: '1.88 mSv/day' },
  { category: 'Physical Environment', parameter: 'Ambient Cabin Carbon Dioxide', unit: '% volume', earthBaseline: '0.04% (0.3 mmHg)', spaceObserved: '0.52% (3.9 mmHg)', deviation: '+1,200%', status: 'ELEVATED', predicted60d: '0.48%' },
  { category: 'Circadian / Sleep', parameter: 'Circadian Light Cycle', unit: 'h cycle', earthBaseline: '24.0h solar day', spaceObserved: '90-min LEO orbit (16 sunrises)', deviation: 'Phase shift +1.4h', status: 'ADAPTED', predicted60d: 'Entrained' },
  { category: 'Circadian / Sleep', parameter: 'Rest Duration / Night', unit: 'hours', earthBaseline: '7.8 h', spaceObserved: '6.8 h (interrupted)', deviation: '-12.8%', status: 'ELEVATED', predicted60d: '7.1 h' },
  { category: 'Cardiovascular', parameter: 'Mean Resting Heart Rate', unit: 'bpm', earthBaseline: '65 bpm', spaceObserved: '68 bpm', deviation: '+4.6%', status: 'NOMINAL', predicted60d: '67 bpm' },
  { category: 'Cardiovascular', parameter: 'Heart Rate Variability (RMSSD)', unit: 'ms', earthBaseline: '48 ms', spaceObserved: '42 ms', deviation: '-12.5%', status: 'ELEVATED', predicted60d: '41 ms' },
  { category: 'Cardiovascular', parameter: 'Blood Pressure (Supine/Stand)', unit: 'mmHg', earthBaseline: '120/78 mmHg', spaceObserved: '118/76 mmHg', deviation: '-1.7% MAP', status: 'NOMINAL', predicted60d: '116/74 mmHg' },
  { category: 'Musculoskeletal', parameter: 'Total Stature / Height', unit: 'cm', earthBaseline: '172.0 cm', spaceObserved: '176.2 cm (+4.2 cm)', deviation: '+2.4% elongation', status: 'ADAPTED', predicted60d: '176.4 cm' },
  { category: 'Musculoskeletal', parameter: 'Femoral Bone Mineral Density', unit: '% / month', earthBaseline: '0.0% / month', spaceObserved: '-0.78% / month', deviation: 'Resorption active', status: 'ELEVATED', predicted60d: '-0.72%/mo' },
  { category: 'Musculoskeletal', parameter: 'Calf Muscle Cross-Sectional Area', unit: '% baseline', earthBaseline: '100%', spaceObserved: '93.8%', deviation: '-6.2%', status: 'ELEVATED', predicted60d: '92.5%' },
  { category: 'Metabolic & Fluid', parameter: 'Total Blood Volume', unit: 'L', earthBaseline: '4.85 L', spaceObserved: '4.25 L (-600 mL)', deviation: '-12.4% cephalad shift', status: 'ADAPTED', predicted60d: '4.20 L' },
  { category: 'Metabolic & Fluid', parameter: '24h Urinary Calcium Excretion', unit: '% elevation', earthBaseline: 'Baseline (0%)', spaceObserved: '+18.2% calciuria', deviation: 'Stone risk moderate', status: 'ELEVATED', predicted60d: '+16.5%' },
]

export default function EarthSpaceReconstruction() {
  // Interactive hypothetical simulation parameters
  const [hypoGravity, setHypoGravity] = useState(0.001) // G
  const [hypoRadiation, setHypoRadiation] = useState(1.84) // mSv/day
  const [hypoSleep, setHypoSleep] = useState(6.8) // hours
  const [hypoCO2, setHypoCO2] = useState(0.52) // %

  // Model-based projection calculations
  const projectedHR = Math.round(65 + (1 - hypoGravity) * 3 + (hypoCO2 - 0.04) * 4 + (7.8 - hypoSleep) * 1.5)
  const projectedBoneLoss = Number(((1 - hypoGravity) * -0.8 * (hypoRadiation / 1.5)).toFixed(2))
  const projectedStress = Math.min(100, Math.round(25 + (hypoRadiation * 4) + (7.5 - hypoSleep) * 5 + (hypoCO2 * 12)))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div>
          <h1 className="font-display text-xl font-bold text-cyan-400 text-glow-cyan flex items-center gap-2">
            <ArrowRightLeft size={18} />
            EARTH ↔ SPACE ENVIRONMENTAL RECONSTRUCTION
          </h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Comparative digital twin analysis: Terrestrial pre-flight baseline vs Microgravity orbital physiology
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] flex items-center gap-1.5">
          <Sparkles size={12} className="text-cyan-400 animate-pulse" />
          <span>MISSION DAY 142 · LEO EXPEDITION</span>
        </div>
      </div>

      {/* DUAL COMPARISON ENVIRONMENT PANELS */}
      <div className="grid grid-cols-2 gap-4">
        {/* EARTH BASELINE ENVIRONMENT */}
        <div className="glass-panel-dark p-4 rounded-xl border border-blue-500/30 shadow-[0_8px_32px_rgba(29,78,216,0.15)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-500/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-400">
                <Globe2 size={18} />
              </div>
              <div>
                <span className="text-[10px] text-blue-400 font-bold tracking-wider">ENVIRONMENT 01</span>
                <h3 className="font-display text-sm font-bold text-white">EARTH TERRESTRIAL BASELINE</h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30">
              1.00 G · SEA LEVEL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-[9px] text-gray-400 block">GRAVITY VECTOR</span>
              <span className="text-white font-bold text-sm">9.81 m/s²</span>
              <span className="text-[9px] text-gray-500 block">Normal hydrostatic column</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-[9px] text-gray-400 block">MAGNETIC SHIELDING</span>
              <span className="text-bio-cyan font-bold text-sm">Nominal (1 atm)</span>
              <span className="text-[9px] text-gray-500 block">Van Allen belt protection</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-[9px] text-gray-400 block">CIRCADIAN CYCLE</span>
              <span className="text-white font-bold text-sm">24.0h Diurnal</span>
              <span className="text-[9px] text-gray-500 block">Natural solar spectral cues</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-[9px] text-gray-400 block">PHYSIOLOGICAL LOAD</span>
              <span className="text-bio-cyan font-bold text-sm">Resting Homeostasis</span>
              <span className="text-[9px] text-gray-500 block">Baseline bone/muscle mass</span>
            </div>
          </div>
        </div>

        {/* SPACE FLIGHT ENVIRONMENT */}
        <div className="glass-panel-dark neon-border p-4 rounded-xl shadow-[0_8px_32px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
                <Rocket size={18} />
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 font-bold tracking-wider">ENVIRONMENT 02</span>
                <h3 className="font-display text-sm font-bold text-white">ORBITAL SPACECRAFT (ISS LEO)</h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              0.001 G · 408 KM
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-[9px] text-gray-400 block">GRAVITY VECTOR</span>
              <span className="text-warning-amber font-bold text-sm">~0.001 m/s² (μG)</span>
              <span className="text-[9px] text-gray-500 block">Loss of venous hydrostatic gradient</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-[9px] text-gray-400 block">RADIATION DOSIMETRY</span>
              <span className="text-warning-amber font-bold text-sm">1.84 mSv / day</span>
              <span className="text-[9px] text-gray-500 block">SAA passes & cosmic ray exposure</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-[9px] text-gray-400 block">CABIN ATMOSPHERE</span>
              <span className="text-cyan-300 font-bold text-sm">0.52% CO₂ · 21.5°C</span>
              <span className="text-[9px] text-gray-500 block">Closed-loop ECLSS environment</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-[9px] text-gray-400 block">ACTIVE ADAPTATION</span>
              <span className="text-bio-cyan font-bold text-sm">ARI: 71 / 100</span>
              <span className="text-[9px] text-gray-500 block">ARED daily countermeasures active</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARATIVE TELEMETRY TABLE */}
      <div className="glass-panel-dark neon-border rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
            <span>PHYSIOLOGICAL & ENVIRONMENTAL RECONSTRUCTION MATRIX</span>
          </h3>
          <span className="text-[10px] text-gray-400">
            CONFIDENCE: 95% STATE ESTIMATION
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/30 text-[10px] text-cyan-400 uppercase tracking-wider font-mono">
              <th className="py-2 px-2">System / Parameter</th>
              <th className="py-2 px-2">Unit</th>
              <th className="py-2 px-2 text-blue-300">Earth Baseline</th>
              <th className="py-2 px-2 text-cyan-300">Space Observed</th>
              <th className="py-2 px-2">Net Deviation</th>
              <th className="py-2 px-2">Adaptation Status</th>
              <th className="py-2 px-2 text-gray-400">+60d Projection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px]">
            {COMPARISONS.map((row, i) => (
              <tr key={i} className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2 px-2">
                  <div className="text-white font-medium">{row.parameter}</div>
                  <div className="text-[9px] text-gray-500">{row.category}</div>
                </td>
                <td className="py-2 px-2 text-gray-400">{row.unit}</td>
                <td className="py-2 px-2 text-blue-200 font-mono">{row.earthBaseline}</td>
                <td className="py-2 px-2 text-cyan-300 font-bold font-mono">{row.spaceObserved}</td>
                <td className="py-2 px-2 font-mono">
                  <span className={row.deviation.startsWith('+') ? 'text-warning-amber' : 'text-neon-blue'}>
                    {row.deviation}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      row.status === 'NOMINAL'
                        ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/40'
                        : row.status === 'ADAPTED'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-gray-300 font-mono">{row.predicted60d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INTERACTIVE SIMULATION: HYPOTHETICAL ENVIRONMENTAL SCENARIOS */}
      <div className="glass-panel-dark p-4 rounded-xl border border-cyan-500/20">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            <h3 className="font-display text-xs font-bold text-white tracking-wider">
              INTERACTIVE COUNTERFACTUAL ENVIRONMENTAL SIMULATOR
            </h3>
          </div>
          <span className="text-[10px] text-warning-amber font-mono">
            MODEL-BASED ESTIMATION · NOT CLINICAL DIAGNOSIS
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Gravity Field:</span>
              <span className="text-cyan-300 font-bold">{hypoGravity.toFixed(3)} G</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={hypoGravity}
              onChange={(e) => setHypoGravity(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
              <span>0G (Microgravity)</span>
              <span>0.38G (Mars)</span>
              <span>1.0G (Earth)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Radiation Exposure:</span>
              <span className="text-warning-amber font-bold">{hypoRadiation.toFixed(2)} mSv/d</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={hypoRadiation}
              onChange={(e) => setHypoRadiation(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
              <span>0.1 (LEO min)</span>
              <span>1.84 (ISS)</span>
              <span>5.0 (SPE Event)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Sleep Duration:</span>
              <span className="text-blue-300 font-bold">{hypoSleep.toFixed(1)} h/night</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.0"
              step="0.2"
              value={hypoSleep}
              onChange={(e) => setHypoSleep(parseFloat(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
              <span>4.0h (Deprived)</span>
              <span>6.8h (Current)</span>
              <span>8.5h (Optimal)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Cabin Ambient CO₂:</span>
              <span className="text-cyan-300 font-bold">{hypoCO2.toFixed(2)} %</span>
            </div>
            <input
              type="range"
              min="0.04"
              max="1.50"
              step="0.02"
              value={hypoCO2}
              onChange={(e) => setHypoCO2(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
              <span>0.04% (Earth)</span>
              <span>0.52% (ISS)</span>
              <span>1.50% (High)</span>
            </div>
          </div>
        </div>

        {/* Projected Outcomes from Simulation */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-black/60 border border-cyan-500/20">
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block">ESTIMATED RESTING HR</span>
            <span className="text-xl font-display font-bold text-cyan-300">{projectedHR} bpm</span>
            <span className="text-[9px] text-gray-500 block">Baseline: 65 bpm</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block">ESTIMATED BONE LOSS RATE</span>
            <span className="text-xl font-display font-bold text-amber-400">{projectedBoneLoss}% / mo</span>
            <span className="text-[9px] text-gray-500 block">Safe threshold: &lt; 1.2%/mo</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block">ALLOSTATIC STRESS INDEX</span>
            <span className="text-xl font-display font-bold text-rose-400">{projectedStress} / 100</span>
            <span className="text-[9px] text-gray-500 block">Earth baseline: 25 / 100</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
