import { useState } from 'react'
import HumanHologram from '../components/HumanHologram'
import {
  Wind,
  Zap,
  TrendingUp,
  ArrowRightLeft,
  ChevronDown,
  FlaskConical,
  Activity,
  Calendar,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts'

// 7-day multi-metric trend data for lower section
const SEVEN_DAY_TRENDS = [
  { day: 'Day 136', hr: 66, hrv: 46, spo2: 98, stress: 32, sleep: 7.2 },
  { day: 'Day 137', hr: 67, hrv: 45, spo2: 98, stress: 35, sleep: 6.9 },
  { day: 'Day 138', hr: 69, hrv: 43, spo2: 97, stress: 40, sleep: 6.5 },
  { day: 'Day 139', hr: 68, hrv: 41, spo2: 98, stress: 42, sleep: 6.4 },
  { day: 'Day 140', hr: 70, hrv: 40, spo2: 98, stress: 41, sleep: 6.6 },
  { day: 'Day 141', hr: 68, hrv: 42, spo2: 99, stress: 39, sleep: 7.0 },
  { day: 'Day 142', hr: 68, hrv: 42, spo2: 98, stress: 38, sleep: 6.8 },
]

// 14-day projection data for predictive timeline
const PREDICTION_TIMELINE = Array.from({ length: 14 }, (_, i) => ({
  day: `Day +${i + 1}`,
  predictedHR: Math.round(68 - i * 0.08),
  hrUpper: Math.round(68 - i * 0.08 + 2.5),
  hrLower: Math.round(68 - i * 0.08 - 2.5),
  predictedHRV: Math.round(42 - i * 0.12),
  hrvUpper: Math.round(42 - i * 0.12 + 3.0),
  hrvLower: Math.round(42 - i * 0.12 - 3.0),
}))

// Radar data for Adaptation Index
const ADAPTATION_RADAR = [
  { dimension: 'Cardiovascular', score: 74, baseline: 100 },
  { dimension: 'Musculoskeletal', score: 68, baseline: 100 },
  { dimension: 'Circadian', score: 61, baseline: 100 },
  { dimension: 'Metabolic', score: 82, baseline: 100 },
  { dimension: 'Behavioural', score: 71, baseline: 100 },
]

export default function Dashboard() {
  const [exerciseAdherence, setExerciseAdherence] = useState(100)

  // Counterfactual simulated outputs based on adherence slider
  const simulatedVO2Max = (100 - (100 - exerciseAdherence) * 0.22).toFixed(1)
  const simulatedBoneLoss = (-0.78 - (100 - exerciseAdherence) * 0.015).toFixed(2)
  const simulatedOrthostaticRisk = exerciseAdherence < 70 ? 'HIGH' : exerciseAdherence < 90 ? 'MODERATE' : 'LOW'

  return (
    <div className="w-full flex flex-col select-none">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: FULL-SCREEN 3D HUMAN ANATOMICAL DIGITAL TWIN             */}
      {/* Occupies 75-85% of viewport height with rotating floating health markers  */}
      {/* ========================================================================= */}
      <section className="h-[calc(100vh-3.5rem)] min-h-[700px] w-full relative flex flex-col bg-[#020817] border-b border-cyan-500/25">
        {/* Full-Screen 3D Holographic Viewer */}
        <div className="flex-1 w-full relative overflow-hidden">
          <HumanHologram />
        </div>

        {/* COMPACT BOTTOM ADAPTATION STATUS & TIMELINE DOCK */}
        <div className="h-14 bg-[#071A33]/90 backdrop-blur-md border-t border-cyan-500/30 px-4 flex items-center justify-between text-xs font-mono z-20 flex-shrink-0">
          {/* Mission Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Calendar size={13} className="text-cyan-400" />
              <span className="font-bold">MISSION EXPEDITION 74:</span>
              <span>DAY 142 / 180</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-28 h-1.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '78.8%' }} />
              </div>
              <span className="text-[10px] text-gray-400 font-bold">78.8% MET</span>
            </div>
          </div>

          {/* Adaptation Status Subsystem Chips */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/50 border border-cyan-500/30">
              <Activity size={11} className="text-cyan-400" />
              <span className="text-[10px] text-gray-400">ARI SCORE:</span>
              <span className="text-[10px] text-cyan-300 font-bold">71 / 100</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span>Cardio: <strong className="text-bio-cyan">74%</strong></span>
              <span>·</span>
              <span>Musculoskeletal: <strong className="text-amber-300">68%</strong></span>
              <span>·</span>
              <span>Circadian: <strong className="text-blue-300">61%</strong></span>
              <span>·</span>
              <span>Metabolic: <strong className="text-bio-cyan">82%</strong></span>
            </div>
          </div>

          {/* Scroll Down Prompt Indicator */}
          <a
            href="#lower-sections"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-[11px] transition-all duration-200 animate-pulse hover:animate-none"
          >
            <span>Longitudinal Analytics & Forecasts</span>
            <ChevronDown size={13} />
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LOWER DASHBOARD SECTIONS (Accessible via vertical page scroll)          */}
      {/* ========================================================================= */}
      <div id="lower-sections" className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* SECTION A: PHYSIOLOGICAL TREND ANALYSIS */}
        <section className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={18} className="text-cyan-400" />
              <h2 className="font-display text-sm font-bold text-white tracking-wider">
                PHYSIOLOGICAL TREND ANALYSIS (7-DAY EXPEDITION TELEMETRY)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
              RECORDED: MISSION DAYS 136 - 142
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 1: Resting HR vs HRV */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-300 font-bold">Resting HR (bpm) vs HRV RMSSD (ms)</span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-red-400">● Heart Rate</span>
                  <span className="text-cyan-400">● HRV</span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SEVEN_DAY_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} domain={[35, 75]} />
                    <Tooltip
                      contentStyle={{ background: '#071A33', border: '1px solid #06b6d440', borderRadius: 8, fontSize: 11 }}
                    />
                    <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="hrv" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sleep Duration vs Stress Score */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-300 font-bold">Sleep Duration (h) vs Stress Index (/100)</span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-blue-400">● Sleep Duration</span>
                  <span className="text-amber-400">● Stress Index</span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SEVEN_DAY_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{ background: '#071A33', border: '1px solid #f59e0b40', borderRadius: 8, fontSize: 11 }}
                    />
                    <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B: EARTH VS SPACE ENVIRONMENTAL RECONSTRUCTION */}
        <section className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <ArrowRightLeft size={18} className="text-cyan-400" />
              <h2 className="font-display text-sm font-bold text-white tracking-wider">
                EARTH ↔ SPACE ENVIRONMENTAL RECONSTRUCTION
              </h2>
            </div>
            <span className="text-[10px] font-mono text-bio-cyan bg-bio-cyan/10 px-2.5 py-1 rounded border border-bio-cyan/30">
              ORBIT: ISS 408 KM LEO · INCLINATION 51.6°
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-gray-500 block font-bold">GRAVITY GRADIENT</span>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Earth: 9.81 m/s²</span>
                <span className="text-cyan-300 font-bold">Space: 0.001 G</span>
              </div>
              <span className="text-[10px] text-neon-blue font-bold block mt-1">Δ -99.99% Hydrostatic shift</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-gray-500 block font-bold">DAILY RADIATION DOSIMETRY</span>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Earth: 0.008 mSv</span>
                <span className="text-amber-400 font-bold">Space: 1.84 mSv</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold block mt-1">Δ +22,900% Cosmic GCR</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-gray-500 block font-bold">CABIN CARBON DIOXIDE</span>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Earth: 0.04%</span>
                <span className="text-cyan-300 font-bold">Space: 0.52%</span>
              </div>
              <span className="text-[10px] text-cyan-300 font-bold block mt-1">Δ +1,200% ECLSS Controlled</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-gray-500 block font-bold">BONE MINERAL DENSITY RATE</span>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Earth: 0.0%/mo</span>
                <span className="text-amber-400 font-bold">Space: -0.78%/mo</span>
              </div>
              <span className="text-[10px] text-bio-cyan font-bold block mt-1">ARED Resistive compliant</span>
            </div>
          </div>
        </section>

        {/* SECTION C & D: ENVIRONMENTAL MONITORING & ADAPTATION RADAR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* SECTION C: ENVIRONMENTAL MONITORING */}
          <section className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2.5">
                <Wind size={18} className="text-cyan-400" />
                <h2 className="font-display text-xs font-bold text-white tracking-wider">
                  ECLSS SPACECRAFT ENVIRONMENT
                </h2>
              </div>
              <span className="text-[10px] font-mono text-bio-cyan bg-bio-cyan/10 px-2 py-0.5 rounded border border-bio-cyan/30">
                ● ALL SUBSYSTEMS NOMINAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-500 block">CABIN TEMPERATURE</span>
                <span className="text-base font-display font-bold text-bio-cyan">21.5 °C</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Target: 22.0 °C (±1.5)</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-500 block">CABIN PRESSURE</span>
                <span className="text-base font-display font-bold text-blue-300">101.3 kPa</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">14.7 psi (Sea Level Equiv)</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-500 block">OXYGEN CONCENTRATION</span>
                <span className="text-base font-display font-bold text-cyan-300">21.0 %</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Partial pressure: 21.3 kPa</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-500 block">CIRCADIAN LIGHT CYCLE</span>
                <span className="text-base font-display font-bold text-amber-300">16 Orbits / Day</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">90 min cycle (45m sun / 45m dark)</span>
              </div>
            </div>
          </section>

          {/* SECTION D: ADAPTATION TRAJECTORY (RADAR) */}
          <section className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2.5">
                <Zap size={18} className="text-amber-400" />
                <h2 className="font-display text-xs font-bold text-white tracking-wider">
                  ADAPTIVE RESPONSE INDEX (ARI: 71 / 100)
                </h2>
              </div>
              <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 font-bold">
                ACTIVE ADAPTATION
              </span>
            </div>

            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={ADAPTATION_RADAR}>
                  <PolarGrid stroke="rgba(6,182,212,0.2)" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} />
                  <Radar name="Observed Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* SECTION E: 14-DAY BAYESIAN PREDICTION TIMELINE */}
        <section className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={18} className="text-blue-400" />
              <h2 className="font-display text-sm font-bold text-white tracking-wider">
                14-DAY BAYESIAN PHYSIOLOGICAL TRAJECTORY PREDICTION
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
              95% UNCERTAINTY CONFIDENCE INTERVALS (DASHED BANDS)
            </span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PREDICTION_TIMELINE}>
                <defs>
                  <linearGradient id="predHRGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis domain={[35, 75]} tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ background: '#071A33', border: '1px solid #06b6d4', borderRadius: 8, fontSize: 11 }}
                />
                <Area type="monotone" dataKey="hrUpper" stroke="#06b6d4" strokeDasharray="3 3" fill="none" strokeWidth={1} />
                <Area type="monotone" dataKey="hrLower" stroke="#06b6d4" strokeDasharray="3 3" fill="none" strokeWidth={1} />
                <Area type="monotone" dataKey="predictedHR" stroke="#06b6d4" strokeWidth={2.5} fill="url(#predHRGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* SECTION F: COUNTERFACTUAL SIMULATOR ENGINE */}
        <section className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <FlaskConical size={18} className="text-cyan-400" />
              <h2 className="font-display text-sm font-bold text-white tracking-wider">
                COUNTERFACTUAL SIMULATION & INTERVENTION SENSITIVITY
              </h2>
            </div>
            <span className="text-[10px] font-mono text-bio-cyan bg-bio-cyan/10 px-2.5 py-1 rounded border border-bio-cyan/30">
              REVERSIBILITY MODEL v1.2
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
            {/* Slider control */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-bold">ARED Exercise Adherence:</span>
                <span className="text-cyan-300 font-bold text-sm">{exerciseAdherence}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={exerciseAdherence}
                onChange={(e) => setExerciseAdherence(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>30% (Sedentary Risk)</span>
                <span>100% (NASA Flight Protocol)</span>
              </div>
            </div>

            {/* Simulated Cardiovascular Outcome */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-[10px] text-gray-400 font-bold block">PROJECTED VO₂ MAX PRESERVATION</span>
              <div className="text-2xl font-display font-black text-white">{simulatedVO2Max}%</div>
              <div className="text-[10px] text-gray-400">
                Orthostatic intolerance risk upon return: <strong className={simulatedOrthostaticRisk === 'LOW' ? 'text-bio-cyan' : simulatedOrthostaticRisk === 'MODERATE' ? 'text-amber-400' : 'text-red-400'}>{simulatedOrthostaticRisk}</strong>
              </div>
            </div>

            {/* Simulated Bone Loss Outcome */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-[10px] text-gray-400 font-bold block">MONTHLY FEMUR BMD TRAJECTORY</span>
              <div className="text-2xl font-display font-black text-amber-300">{simulatedBoneLoss}%/mo</div>
              <div className="text-[10px] text-gray-400">
                Flight threshold limit: <strong className="text-cyan-300">&lt; -1.0%/mo</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
