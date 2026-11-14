import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Eye,
  ShieldAlert,
  Activity,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchPredictions, fetchSansRisk } from '../api/client'

export default function PredictiveAnalytics() {
  const [selectedSignal, setSelectedSignal] = useState<'heart_rate' | 'hrv' | 'stress_level' | 'sleep_duration'>('heart_rate')
  const [projections, setProjections] = useState<any>(null)
  const [sansData, setSansData] = useState<any>(null)

  useEffect(() => {
    fetchPredictions().then((data) => setProjections(data?.projections)).catch(() => {})
    fetchSansRisk().then((data) => setSansData(data)).catch(() => {})
  }, [])

  const defaultTimeline = Array.from({ length: 14 }, (_, i) => ({
    date: `Day +${i + 1}`,
    value: Math.round(68 - i * 0.08),
    lower_ci: Math.round(68 - i * 0.08 - 2.5),
    upper_ci: Math.round(68 - i * 0.08 + 2.5),
  }))

  const chartData = projections?.[selectedSignal] || defaultTimeline
  const sansRiskPercent = sansData?.risk_score ? sansData.risk_score : 18.4

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-4 lg:p-6 font-mono text-xs select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            <h1 className="font-display text-base font-bold text-white tracking-wider text-glow-cyan">
              PREDICTIVE PHYSIOLOGICAL ANALYTICS & PROGNOSTICS
            </h1>
          </div>
          <p className="text-gray-400 text-[11px] mt-0.5">
            14-Day Bayesian sequence trajectory forecasting with 95% uncertainty estimation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 text-[11px]">
            LSTM DEEP RECURRENT v1.2
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-bio-cyan/10 border border-bio-cyan/30 text-bio-cyan text-[11px] font-bold">
            BAYESIAN PRIOR CERTIFIED
          </span>
        </div>
      </div>

      {/* SANS & Critical Risk Prognostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: SANS Risk */}
        <div className="p-4 rounded-xl bg-[#071A33] border border-cyan-500/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-cyan-400" />
              <span className="font-display text-xs font-bold text-white">SANS OPHTHALMIC RISK</span>
            </div>
            <span className="text-[10px] text-bio-cyan font-bold bg-bio-cyan/10 px-2 py-0.5 rounded border border-bio-cyan/30">
              LOW-MODERATE
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-display font-black text-2xl text-white">{sansRiskPercent}%</span>
            <span className="text-[10px] text-gray-400">OCT Retinal Nerve: 98 μm</span>
          </div>

          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-bio-cyan to-amber-400 h-full" style={{ width: `${sansRiskPercent}%` }} />
          </div>
          <p className="text-[10px] text-gray-400">Cephalad fluid redistribution mitigated by strict cabin pCO₂ control.</p>
        </div>

        {/* Card 2: Orthostatic Intolerance */}
        <div className="p-4 rounded-xl bg-[#071A33] border border-cyan-500/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-400" />
              <span className="font-display text-xs font-bold text-white">RE-ENTRY ORTHOSTATIC RISK</span>
            </div>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              MONITORED
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-display font-black text-2xl text-amber-300">24.2%</span>
            <span className="text-[10px] text-gray-400">MAP Threshold: 85 mmHg</span>
          </div>

          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-blue-500 to-amber-400 h-full" style={{ width: '24.2%' }} />
          </div>
          <p className="text-[10px] text-gray-400">Prescribed fluid loading & G-suit reconditioning begins FD 160.</p>
        </div>

        {/* Card 3: Bone Demineralization Rate */}
        <div className="p-4 rounded-xl bg-[#071A33] border border-cyan-500/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-rose-400" />
              <span className="font-display text-xs font-bold text-white">BMD LOSS PROJECTION</span>
            </div>
            <span className="text-[10px] text-bio-cyan font-bold bg-bio-cyan/10 px-2 py-0.5 rounded border border-bio-cyan/30">
              ARED COMPLIANT
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-display font-black text-2xl text-cyan-300">-0.78%</span>
            <span className="text-[10px] text-gray-400">Flight Rule: &lt; -1.0%/mo</span>
          </div>

          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full" style={{ width: '78%' }} />
          </div>
          <p className="text-[10px] text-gray-400">Progressive overload squats prevent critical trabecular thinning.</p>
        </div>
      </div>

      {/* 14-Day Trajectory Forecasting Chart */}
      <div className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
          <div>
            <h2 className="font-display text-sm font-bold text-white tracking-wider uppercase">
              14-Day Multi-Horizon Physiological Projection
            </h2>
            <p className="text-[10px] text-gray-400">Dashed upper and lower lines delineate 95% Bayesian credible intervals.</p>
          </div>

          {/* Signal Selector */}
          <div className="flex rounded-lg bg-black/60 border border-cyan-500/30 p-0.5 text-xs">
            {[
              { id: 'heart_rate', label: 'Heart Rate' },
              { id: 'hrv', label: 'HRV' },
              { id: 'stress_level', label: 'Stress Score' },
              { id: 'sleep_duration', label: 'Sleep Duration' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSelectedSignal(id as any)}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedSignal === id ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="predAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#071A33', border: '1px solid #06b6d4', borderRadius: 8, fontSize: 11 }}
              />
              <Area type="monotone" dataKey="upper_ci" stroke="#06b6d4" strokeDasharray="3 3" fill="none" strokeWidth={1} name="95% Upper CI" />
              <Area type="monotone" dataKey="lower_ci" stroke="#06b6d4" strokeDasharray="3 3" fill="none" strokeWidth={1} name="95% Lower CI" />
              <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2.5} fill="url(#predAreaGrad)" name="Predicted Mean" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
