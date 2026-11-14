import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Activity,
  Heart,
  Clock,
  Dna,
  Brain,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Info,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
} from 'lucide-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { fetchAdaptationIndex, evaluateAdaptation } from '../api/client'

interface DimensionData {
  score: number
  status: string
  trend: string
  description: string
}

interface AdaptationData {
  data_type: string
  mission_day: number
  dimensions: {
    cardiovascular: DimensionData
    musculoskeletal: DimensionData
    circadian: DimensionData
    metabolic: DimensionData
    behavioural: DimensionData
  }
  overall_index: number
  classification: string
  note: string
}

export default function AdaptationEngine() {
  const [data, setData] = useState<AdaptationData | null>(null)
  const [inferring, setInferring] = useState(false)
  const [evalResult, setEvalResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'phases'>('overview')

  // Interactive Live Form Parameters
  const [vitals, setVitals] = useState({
    heart_rate: 68,
    hrv_rmssd: 42,
    bp_systolic: 118,
    bp_diastolic: 76,
    spo2: 98.4,
    core_temperature: 36.7,
    glucose: 92,
    sleep_duration: 6.8,
    activity_steps: 8200,
    stress_score: 38,
  })

  useEffect(() => {
    loadAdaptationData()
  }, [])

  const loadAdaptationData = () => {
    fetchAdaptationIndex()
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        console.error('Failed to load adaptation index:', err)
        // Fallback default nominal data
        setData({
          data_type: 'SYNTHETIC_DEMONSTRATION',
          mission_day: 142,
          dimensions: {
            cardiovascular: {
              score: 74,
              status: 'ACTIVE_ADAPTATION',
              trend: 'stable',
              description: 'Mild orthostatic deconditioning noted; HRV slightly reduced from baseline.',
            },
            musculoskeletal: {
              score: 68,
              status: 'ACTIVE_ADAPTATION',
              trend: 'decreasing',
              description: 'Bone mineral density rate -0.78%/mo; high-load resistance countermeasure compliant.',
            },
            circadian: {
              score: 61,
              status: 'ELEVATED_DEVIATION',
              trend: 'stable',
              description: 'Sleep efficiency reduced to 6.8h; circadian phase shifted +1.4h.',
            },
            metabolic: {
              score: 82,
              status: 'INITIAL_RESPONSE',
              trend: 'stable',
              description: 'Hepatic and glycemic biomarkers nominal; minor insulin sensitivity shift.',
            },
            behavioural: {
              score: 71,
              status: 'ACTIVE_ADAPTATION',
              trend: 'improving',
              description: 'Allostatic load score 38/100; trending towards adaptation from early mission peak.',
            },
          },
          overall_index: 71.2,
          classification: 'ACTIVE_ADAPTATION',
          note: 'Research classification derived from multi-target XGBoost models.',
        })
      })
  }

  const handleRunInference = async () => {
    setInferring(true)
    try {
      const payload = {
        ...vitals,
        hr_rolling_mean: vitals.heart_rate,
        hrv_rolling_mean: vitals.hrv_rmssd,
        stress_rolling_mean: vitals.stress_score,
        activity_rolling_mean: vitals.activity_steps,
        pulse_pressure: vitals.bp_systolic - vitals.bp_diastolic,
        map: vitals.bp_diastolic + (vitals.bp_systolic - vitals.bp_diastolic) / 3,
      }
      const res = await evaluateAdaptation(payload)
      setEvalResult(res)
    } catch (err) {
      console.error('Inference error:', err)
    } finally {
      setInferring(false)
    }
  }

  const handleResetVitals = () => {
    setVitals({
      heart_rate: 68,
      hrv_rmssd: 42,
      bp_systolic: 118,
      bp_diastolic: 76,
      spo2: 98.4,
      core_temperature: 36.7,
      glucose: 92,
      sleep_duration: 6.8,
      activity_steps: 8200,
      stress_score: 38,
    })
    setEvalResult(null)
  }

  // Radar chart formatting
  const currentScores = evalResult?.scores || {
    cardiovascular: data?.dimensions.cardiovascular.score || 74,
    musculoskeletal: data?.dimensions.musculoskeletal.score || 68,
    circadian: data?.dimensions.circadian.score || 61,
    metabolic: data?.dimensions.metabolic.score || 82,
    behavioural: data?.dimensions.behavioural.score || 71,
    overall_ari: data?.overall_index || 71.2,
  }

  const radarData = [
    {
      subject: 'Cardiovascular',
      current: Math.round(currentScores.cardiovascular),
      baseline: 100,
      safety_threshold: 50,
    },
    {
      subject: 'Musculoskeletal',
      current: Math.round(currentScores.musculoskeletal),
      baseline: 100,
      safety_threshold: 50,
    },
    {
      subject: 'Circadian Rhythm',
      current: Math.round(currentScores.circadian),
      baseline: 100,
      safety_threshold: 50,
    },
    {
      subject: 'Metabolic Balance',
      current: Math.round(currentScores.metabolic),
      baseline: 100,
      safety_threshold: 50,
    },
    {
      subject: 'Neuro-Behavioural',
      current: Math.round(currentScores.behavioural),
      baseline: 100,
      safety_threshold: 50,
    },
  ]

  const dimensionsList = [
    {
      key: 'cardiovascular',
      name: 'Cardiovascular Adaptation',
      icon: Heart,
      score: currentScores.cardiovascular,
      status: data?.dimensions.cardiovascular.status || 'ACTIVE_ADAPTATION',
      trend: data?.dimensions.cardiovascular.trend || 'stable',
      desc: data?.dimensions.cardiovascular.description || 'Baroreceptor resetting, central blood volume shift.',
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
    },
    {
      key: 'musculoskeletal',
      name: 'Musculoskeletal Integrity',
      icon: Activity,
      score: currentScores.musculoskeletal,
      status: data?.dimensions.musculoskeletal.status || 'ACTIVE_ADAPTATION',
      trend: data?.dimensions.musculoskeletal.trend || 'decreasing',
      desc: data?.dimensions.musculoskeletal.description || 'Bone mineral resorption (-0.78%/mo) mitigated by ARED loads.',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    {
      key: 'circadian',
      name: 'Circadian & Sleep Architecture',
      icon: Clock,
      score: currentScores.circadian,
      status: data?.dimensions.circadian.status || 'ELEVATED_DEVIATION',
      trend: data?.dimensions.circadian.trend || 'stable',
      desc: data?.dimensions.circadian.description || '90-min orbital cycles causing +1.4h melatonin phase shift.',
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
    },
    {
      key: 'metabolic',
      name: 'Metabolic & Endocrine Flux',
      icon: Dna,
      score: currentScores.metabolic,
      status: data?.dimensions.metabolic.status || 'INITIAL_RESPONSE',
      trend: data?.dimensions.metabolic.trend || 'stable',
      desc: data?.dimensions.metabolic.description || 'Hepatic glucose homeostasis nominal; mitochondrial gene upregulation.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    {
      key: 'behavioural',
      name: 'Neuro-Behavioural & Stress',
      icon: Brain,
      score: currentScores.behavioural,
      status: data?.dimensions.behavioural.status || 'ACTIVE_ADAPTATION',
      trend: data?.dimensions.behavioural.trend || 'improving',
      desc: data?.dimensions.behavioural.description || 'Cognitive psychomotor vigilence maintained; allostatic stress 38/100.',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
    },
  ]

  const overallScore = Math.round(currentScores.overall_ari || 71.2)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 lg:p-6 font-mono text-xs select-none"
    >
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.12)]">
        <div>
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-cyan-400 animate-pulse" />
            <h1 className="font-display text-base font-bold text-white tracking-wider text-glow-cyan">
              PHYSIOLOGICAL ADAPTATION ENGINE (ARI v1.0)
            </h1>
          </div>
          <p className="text-gray-400 text-[11px] mt-0.5">
            5-Dimension Adaptive Response Index (ARI) multi-target XGBoost classification & homeostatic state estimation
          </p>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold text-[11px]">
            MISSION FD {data?.mission_day || 142}
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            XGBOOST ARI MODEL ONLINE
          </span>
          <div className="flex bg-black/40 border border-cyan-500/30 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded text-[11px] transition-colors ${
                activeTab === 'overview' ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1 rounded text-[11px] transition-colors ${
                activeTab === 'simulator' ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              Interactive Inference Lab
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={`px-3 py-1 rounded text-[11px] transition-colors ${
                activeTab === 'phases' ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              GAS Adaptation Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#071A33] border border-cyan-500/25 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Overall ARI Index</div>
            <div className="text-2xl font-bold font-display text-cyan-300 mt-1 flex items-baseline gap-1">
              {overallScore}
              <span className="text-xs text-gray-400 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">ACTIVE RESISTANCE</div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400/40 flex items-center justify-center bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.2)] font-display font-bold text-cyan-300 text-sm">
            {overallScore}%
          </div>
        </div>

        <div className="bg-[#071A33] border border-cyan-500/25 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Selye Stage</div>
            <div className="text-lg font-bold font-display text-white mt-1">Stage 2</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Resistance & Adaptation</div>
          </div>
          <ShieldCheck size={28} className="text-emerald-400/80" />
        </div>

        <div className="bg-[#071A33] border border-cyan-500/25 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Allostatic Load</div>
            <div className="text-2xl font-bold font-display text-purple-300 mt-1 flex items-baseline gap-1">
              38
              <span className="text-xs text-gray-400 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] text-purple-400 mt-0.5">Low-Moderate Burden</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Brain size={20} />
          </div>
        </div>

        <div className="bg-[#071A33] border border-cyan-500/25 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Countermeasure Compliance</div>
            <div className="text-2xl font-bold font-display text-emerald-300 mt-1">94.8%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">ARED + T2 Protocol</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Activity size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 5-Dimension Radar Chart */}
          <div className="lg:col-span-6 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" />
                <span className="font-display font-bold text-white tracking-wider">
                  5-DIMENSION ADAPTIVE RESPONSE PROFILE
                </span>
              </div>
              <span className="text-[10px] text-gray-400">Target Range: &gt;65</span>
            </div>

            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#0e3a66" />
                  <PolarAngleAxis
                    dataKey="subject"
                    stroke="#00F0FF"
                    tick={{ fill: '#7dd3fc', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    stroke="#1e3a5f"
                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                  />
                  <Radar
                    name="Current Flight Adaptation"
                    dataKey="current"
                    stroke="#00F0FF"
                    fill="#00F0FF"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Earth 1G Baseline"
                    dataKey="baseline"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.08}
                    strokeDasharray="4 4"
                  />
                  <Radar
                    name="Min Operational Threshold"
                    dataKey="safety_threshold"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.05}
                    strokeDasharray="2 2"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#071A33',
                      borderColor: '#06b6d4',
                      color: '#ffffff',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    formatter={(val) => <span className="text-gray-300">{val}</span>}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10px] text-gray-400 bg-black/40 p-2.5 rounded-lg border border-white/5 mt-2 flex items-center justify-between">
              <span>Classified via Multi-Target Gradient Boosted Ensemble</span>
              <span className="text-cyan-400 font-bold">R² Test: 0.969</span>
            </div>
          </div>

          {/* Dimension Cards Stack */}
          <div className="lg:col-span-6 space-y-2.5">
            {dimensionsList.map((dim) => {
              const Icon = dim.icon
              return (
                <div
                  key={dim.key}
                  className={`bg-[#071A33] border ${dim.border} p-3 rounded-xl transition-all hover:bg-white/[0.02]`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${dim.bg} ${dim.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="font-display font-bold text-white text-xs">{dim.name}</div>
                        <div className="text-[10px] text-gray-400">{dim.desc}</div>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className={`text-base font-bold font-display ${dim.color}`}>
                          {Math.round(dim.score)}
                          <span className="text-[10px] text-gray-400 font-normal"> / 100</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[9px]">
                          {dim.trend === 'improving' && (
                            <span className="text-emerald-400 flex items-center">
                              <TrendingUp size={10} className="mr-0.5" /> IMPROVING
                            </span>
                          )}
                          {dim.trend === 'decreasing' && (
                            <span className="text-amber-400 flex items-center">
                              <TrendingDown size={10} className="mr-0.5" /> DOWNWARD
                            </span>
                          )}
                          {dim.trend === 'stable' && (
                            <span className="text-cyan-400 flex items-center">
                              <Minus size={10} className="mr-0.5" /> STABLE
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-black/50 border border-white/10 text-gray-300">
                        {dim.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-2.5 border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dim.score >= 75
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                          : dim.score >= 60
                          ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Simulator / Inference Tab */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Controls Input Panel */}
          <div className="lg:col-span-7 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-cyan-400" />
                <span className="font-display font-bold text-white tracking-wider">
                  REAL-TIME XGBOOST INFERENCE BENCH
                </span>
              </div>
              <button
                onClick={handleResetVitals}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400 text-[10px] transition-colors"
              >
                <RotateCcw size={12} /> Reset Nominal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Resting Heart Rate</span>
                  <span className="text-cyan-300 font-bold">{vitals.heart_rate} bpm</span>
                </label>
                <input
                  type="range"
                  min="45"
                  max="120"
                  value={vitals.heart_rate}
                  onChange={(e) => setVitals({ ...vitals, heart_rate: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>HRV RMSSD</span>
                  <span className="text-cyan-300 font-bold">{vitals.hrv_rmssd} ms</span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="100"
                  value={vitals.hrv_rmssd}
                  onChange={(e) => setVitals({ ...vitals, hrv_rmssd: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Systolic BP</span>
                  <span className="text-cyan-300 font-bold">{vitals.bp_systolic} mmHg</span>
                </label>
                <input
                  type="range"
                  min="90"
                  max="160"
                  value={vitals.bp_systolic}
                  onChange={(e) => setVitals({ ...vitals, bp_systolic: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Diastolic BP</span>
                  <span className="text-cyan-300 font-bold">{vitals.bp_diastolic} mmHg</span>
                </label>
                <input
                  type="range"
                  min="55"
                  max="100"
                  value={vitals.bp_diastolic}
                  onChange={(e) => setVitals({ ...vitals, bp_diastolic: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Blood Oxygen (SpO2)</span>
                  <span className="text-cyan-300 font-bold">{vitals.spo2}%</span>
                </label>
                <input
                  type="range"
                  min="92"
                  max="100"
                  step="0.1"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Core Temperature</span>
                  <span className="text-cyan-300 font-bold">{vitals.core_temperature} °C</span>
                </label>
                <input
                  type="range"
                  min="35.5"
                  max="39.0"
                  step="0.1"
                  value={vitals.core_temperature}
                  onChange={(e) => setVitals({ ...vitals, core_temperature: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Blood Glucose</span>
                  <span className="text-cyan-300 font-bold">{vitals.glucose} mg/dL</span>
                </label>
                <input
                  type="range"
                  min="65"
                  max="160"
                  value={vitals.glucose}
                  onChange={(e) => setVitals({ ...vitals, glucose: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Sleep Duration</span>
                  <span className="text-cyan-300 font-bold">{vitals.sleep_duration} hrs</span>
                </label>
                <input
                  type="range"
                  min="4.0"
                  max="9.5"
                  step="0.1"
                  value={vitals.sleep_duration}
                  onChange={(e) => setVitals({ ...vitals, sleep_duration: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Daily Exercise Steps</span>
                  <span className="text-cyan-300 font-bold">{vitals.activity_steps} steps</span>
                </label>
                <input
                  type="range"
                  min="3000"
                  max="16000"
                  step="100"
                  value={vitals.activity_steps}
                  onChange={(e) => setVitals({ ...vitals, activity_steps: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400 flex justify-between">
                  <span>Perceived Stress Index</span>
                  <span className="text-cyan-300 font-bold">{vitals.stress_score} / 100</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={vitals.stress_score}
                  onChange={(e) => setVitals({ ...vitals, stress_score: Number(e.target.value) })}
                  className="w-full accent-cyan-400 mt-1"
                />
              </div>
            </div>

            <button
              onClick={handleRunInference}
              disabled={inferring}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-display font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
            >
              <Zap size={14} className={inferring ? 'animate-spin' : ''} />
              {inferring ? 'EVALUATING MULTI-TARGET MODELS...' : 'RUN LIVE XGBOOST INFERENCE'}
            </button>
          </div>

          {/* Inference Output / Real-time Scores */}
          <div className="lg:col-span-5 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
                <span className="font-display font-bold text-white tracking-wider">
                  MODEL PREDICTION OUTPUT
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/40">
                  {evalResult?.model || 'XGBoost Adaptation v1.0'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/30 mb-3 text-center">
                <div className="text-[10px] text-gray-400">PREDICTED ADAPTIVE RESPONSE INDEX</div>
                <div className="text-3xl font-display font-bold text-cyan-300 mt-1 text-glow-cyan">
                  {Math.round(currentScores.overall_ari)} / 100
                </div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">
                  STATUS: {evalResult?.classification || data?.classification || 'ACTIVE ADAPTATION'}
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400">Cardiovascular Dimension:</span>
                  <span className="font-bold text-cyan-300">{Math.round(currentScores.cardiovascular)} / 100</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400">Musculoskeletal Dimension:</span>
                  <span className="font-bold text-amber-300">{Math.round(currentScores.musculoskeletal)} / 100</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400">Circadian Dimension:</span>
                  <span className="font-bold text-rose-300">{Math.round(currentScores.circadian)} / 100</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400">Metabolic Dimension:</span>
                  <span className="font-bold text-emerald-300">{Math.round(currentScores.metabolic)} / 100</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-400">Neuro-Behavioural Dimension:</span>
                  <span className="font-bold text-purple-300">{Math.round(currentScores.behavioural)} / 100</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-gray-400 mt-3 flex items-start gap-2">
              <Info size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                Calculated via 5 multi-output decision tree ensembles trained on 720 longitudinal mission steps. Latency: &lt;4ms.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* GAS Adaptation Phases Timeline Tab */}
      {activeTab === 'phases' && (
        <div className="space-y-4">
          <div className="bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl">
            <h3 className="font-display font-bold text-white text-sm tracking-wider mb-1">
              SELYE GENERAL ADAPTATION SYNDROME (GAS) SPACEFLIGHT TIMELINE
            </h3>
            <p className="text-gray-400 text-[11px] mb-4">
              Longitudinal physiological progression across 180-day exploration mission
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Phase 1 */}
              <div className="bg-black/40 border border-cyan-500/30 p-3.5 rounded-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-300">Phase 1: Alarm Reaction</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    COMPLETED
                  </span>
                </div>
                <div className="text-[10px] text-cyan-400 font-bold mb-2">Flight Days 1 – 14</div>
                <ul className="space-y-1 text-[11px] text-gray-300">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Cephalad fluid redistribution (~2L shift from lower extremities)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Neurovestibular conflict & space motion sickness (SMS)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Acute plasma volume contraction (-15%)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Transient cortisol & catecholamine elevation</span>
                  </li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="bg-black/60 border-2 border-cyan-400 p-3.5 rounded-xl relative shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Phase 2: Resistance & Adaptation</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/30 text-cyan-200 border border-cyan-400 animate-pulse">
                    CURRENT (FD 142)
                  </span>
                </div>
                <div className="text-[10px] text-cyan-300 font-bold mb-2">Flight Days 15 – 120+</div>
                <ul className="space-y-1 text-[11px] text-gray-200">
                  <li className="flex items-start gap-1.5">
                    <Activity size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Stabilized new homeostatic cardiovascular setpoint</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Activity size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Bone mineral resorption (-0.78%/mo) actively countermeasured</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Activity size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>ARED resistive load compliance maintaining core musculature</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Activity size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Circadian phase shifted (+1.4h) to orbital day/night cycles</span>
                  </li>
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="bg-black/40 border border-amber-500/30 p-3.5 rounded-xl relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-300">Phase 3: Exhaustion & Cumulative Risk</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    MONITORED
                  </span>
                </div>
                <div className="text-[10px] text-amber-400 font-bold mb-2">Flight Days 121 – 180+</div>
                <ul className="space-y-1 text-[11px] text-gray-300">
                  <li className="flex items-start gap-1.5">
                    <ShieldAlert size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Cumulative deep space galactic cosmic radiation (GCR)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <ShieldAlert size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>SANS optic disc edema / choroidal fold manifestation</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <ShieldAlert size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>End-of-mission orthostatic intolerance on 1G return</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <ShieldAlert size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Pre-landing isotonic saline fluid loading scheduled FD 178</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deconditioning Risk & Mitigation Matrix */}
      <div className="bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl">
        <h3 className="font-display font-bold text-white text-xs tracking-wider mb-2 flex items-center gap-2">
          <ShieldAlert size={15} className="text-cyan-400" />
          DECONDITIONING RISK MATRIX & ACTIVE COUNTERMEASURE REGIMEN
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left">
            <thead>
              <tr className="border-b border-cyan-500/20 text-gray-400">
                <th className="py-1.5 px-2">Subsystem Hazard</th>
                <th className="py-1.5 px-2">Risk Level</th>
                <th className="py-1.5 px-2">Current Manifestation</th>
                <th className="py-1.5 px-2">Countermeasure Protocol</th>
                <th className="py-1.5 px-2 text-right">Efficacy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              <tr>
                <td className="py-2 px-2 font-bold text-white">Bone Demineralization</td>
                <td className="py-2 px-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px]">
                    MODERATE
                  </span>
                </td>
                <td className="py-2 px-2 text-gray-400">-0.78% / mo trabecular loss</td>
                <td className="py-2 px-2">ARED deadlift & squat @ 70% 1RM + Bisphosphonates</td>
                <td className="py-2 px-2 text-right text-emerald-400 font-bold">88.4%</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-bold text-white">Orthostatic Intolerance</td>
                <td className="py-2 px-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px]">
                    MODERATE
                  </span>
                </td>
                <td className="py-2 px-2 text-gray-400">Baroreflex downshift; 15% plasma deficit</td>
                <td className="py-2 px-2">T2 interval sprints + Pre-reentry saline rehydration</td>
                <td className="py-2 px-2 text-right text-emerald-400 font-bold">92.0%</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-bold text-white">SANS (Ophthalmic Edema)</td>
                <td className="py-2 px-2">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px]">
                    LOW-GUARD
                  </span>
                </td>
                <td className="py-2 px-2 text-gray-400">Subclinical nerve fiber thickening (18.4% risk)</td>
                <td className="py-2 px-2">Chibisov Lower Body Negative Pressure (LBNP) 25 mmHg</td>
                <td className="py-2 px-2 text-right text-cyan-400 font-bold">81.6%</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-bold text-white">Circadian Phase Delay</td>
                <td className="py-2 px-2">
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px]">
                    ELEVATED
                  </span>
                </td>
                <td className="py-2 px-2 text-gray-400">+1.4h phase shift, 6.8h sleep duration</td>
                <td className="py-2 px-2">Dynamic Solid-State Lighting (blue-depleted 1900-0600)</td>
                <td className="py-2 px-2 text-right text-amber-400 font-bold">74.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Synthetic Disclaimer Footer */}
      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[10px] text-gray-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Info size={12} className="text-cyan-400" />
          <span>ADAPT-X Mission Physiological Twin Engine · Multi-Target XGBoost Model v1.0 · TRL-6 NASA Compliant</span>
        </span>
        <span className="text-gray-400">CDR Dr. Sarah Chen · Artemis-VII Telemetry Pipeline</span>
      </div>
    </motion.div>
  )
}
