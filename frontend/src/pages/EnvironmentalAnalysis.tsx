import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Wind, Radio, Thermometer, Gauge, AlertTriangle } from 'lucide-react'

// Synthetic time series data for 7-day environmental telemetry
const ENV_HISTORY = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${130 + i}`,
  co2: Number((0.48 + Math.sin(i * 0.7) * 0.08).toFixed(2)),
  radiation: Number((1.75 + Math.cos(i * 0.9) * 0.22).toFixed(2)),
  temp: Number((21.4 + Math.sin(i * 0.5) * 0.4).toFixed(1)),
  pressure: Number((101.3 + Math.sin(i * 0.3) * 0.2).toFixed(1)),
  lightCycle: 16,
}))

export default function EnvironmentalAnalysis() {
  const [selectedParam, setSelectedParam] = useState<'co2' | 'radiation' | 'temp' | 'pressure'>('radiation')

  const paramConfig = {
    radiation: {
      name: 'Galactic & Solar Radiation',
      current: '1.84 mSv/day',
      earthRef: '0.008 mSv/day',
      unit: 'mSv/day',
      color: '#f59e0b',
      status: 'ELEVATED · SAA MONITORED',
      key: 'radiation' as const,
      description: 'South Atlantic Anomaly crossings and deep-space GCR background flux. Cumulative mission dose: 148.5 mSv.',
      correlationNote: 'Observed statistical association with mild transient oxidative stress markers; causation requires controlled longitudinal dosimetry.',
    },
    co2: {
      name: 'Cabin Carbon Dioxide Concentration',
      current: '0.52 % (3.9 mmHg)',
      earthRef: '0.04 % (0.3 mmHg)',
      unit: '%',
      color: '#06b6d4',
      status: 'MANAGED · ECLSS ACTIVE',
      key: 'co2' as const,
      description: 'Closed-loop carbon dioxide removal assemblies (CDRA) cycling nominally. ISS flight limit: < 0.70%.',
      correlationNote: 'Mild correlation observed with transient subjective headache reports during intensive payload operations.',
    },
    temp: {
      name: 'Cabin Ambient Temperature',
      current: '21.5 °C',
      earthRef: '22.0 °C',
      unit: '°C',
      color: '#10b981',
      status: 'NOMINAL',
      key: 'temp' as const,
      description: 'Thermal control loops maintaining stable convective heat rejection despite absence of natural buoyancy.',
      correlationNote: 'Microgravity alters sweat evaporation efficiency; skin temperature regulated through localized ventilation fans.',
    },
    pressure: {
      name: 'Atmospheric Cabin Pressure',
      current: '101.3 kPa (14.7 psi)',
      earthRef: '101.3 kPa (1 atm)',
      unit: 'kPa',
      color: '#3b82f6',
      status: 'NOMINAL · SEA LEVEL EQUIV',
      key: 'pressure' as const,
      description: 'Cabin atmosphere composition: 78.1% N₂, 21.0% O₂, trace inert gases. No depressurization anomalies detected.',
      correlationNote: 'Depressurization protocols pre-EVA step to 10.2 psi for nitrogen denitrogenation pre-breathe.',
    },
  }

  const active = paramConfig[selectedParam]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div>
          <h1 className="font-display text-xl font-bold text-cyan-400 text-glow-cyan flex items-center gap-2">
            <Wind size={18} />
            ENVIRONMENTAL ANALYSIS & ECLSS TELEMETRY
          </h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Spacecraft cabin telemetry, radiation dosimetry and physiological exposure correlation analysis
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-[11px]">
          DATA SOURCE: DEMO ECLSS STREAM
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { key: 'radiation', label: 'Radiation Dosimetry', value: '1.84 mSv/d', icon: Radio, sub: 'Earth: 0.008', color: 'text-warning-amber' },
          { key: 'co2', label: 'Cabin Ambient CO₂', value: '0.52 %', icon: Wind, sub: 'Earth: 0.04%', color: 'text-cyan-300' },
          { key: 'temp', label: 'Cabin Temperature', value: '21.5 °C', icon: Thermometer, sub: 'Target: 22.0°C', color: 'text-bio-cyan' },
          { key: 'pressure', label: 'Atmospheric Pressure', value: '101.3 kPa', icon: Gauge, sub: '14.7 psi (1.0 atm)', color: 'text-blue-300' },
        ].map((card) => {
          const Icon = card.icon
          const isSelected = selectedParam === card.key
          return (
            <button
              key={card.key}
              onClick={() => setSelectedParam(card.key as any)}
              className={`p-3 rounded-xl glass-panel-dark text-left transition-all border ${
                isSelected
                  ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-500/10'
                  : 'border-cyan-500/20 hover:border-cyan-400/50'
              }`}
            >
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-[10px] uppercase">{card.label}</span>
                <Icon size={14} className={card.color} />
              </div>
              <div className={`text-xl font-display font-bold ${card.color}`}>{card.value}</div>
              <div className="text-[9px] text-gray-500 mt-1">{card.sub}</div>
            </button>
          )
        })}
      </div>

      {/* Main Historical Chart */}
      <div className="glass-panel-dark neon-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-sm font-bold text-white">{active.name}</h3>
            <span className="text-[10px] text-gray-400">14-Day Historical Trend · Current: {active.current} (Earth: {active.earthRef})</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 border border-cyan-500/30 text-cyan-300">
            {active.status}
          </span>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ENV_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{ background: 'rgba(0,0,0,0.9)', border: `1px solid ${active.color}40`, borderRadius: 8, fontFamily: 'monospace', fontSize: 11 }}
                formatter={(v: any) => [`${v} ${active.unit}`, active.name]}
              />
              <Line type="monotone" dataKey={active.key} stroke={active.color} strokeWidth={2.5} dot={{ fill: active.color, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-4 text-[11px]">
          <div>
            <span className="text-cyan-400 font-bold block mb-0.5">EXPOSURE OVERVIEW:</span>
            <p className="text-gray-400">{active.description}</p>
          </div>
          <div>
            <span className="text-amber-400 font-bold block mb-0.5">PHYSIOLOGICAL ASSOCIATION:</span>
            <p className="text-gray-400">{active.correlationNote}</p>
          </div>
        </div>
      </div>

      {/* Scientific Correlation Disclaimer */}
      <div className="p-3 rounded-lg bg-black/60 border border-cyan-500/20 text-[10px] text-gray-400 flex items-start gap-2">
        <AlertTriangle size={14} className="text-warning-amber mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-cyan-300 font-bold">EPIDEMIOLOGICAL INTEGRITY RULE: </span>
          Environmental exposure models reflect observational associations. ADAPT-X does not claim direct causation
          from unverified bivariate correlations. All flight operational actions require flight surgeon review.
        </div>
      </div>
    </motion.div>
  )
}
