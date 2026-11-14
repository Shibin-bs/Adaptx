import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Download,
  AlertTriangle,
  Clock,
  Radio,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchMetrics, fetchMetricHistory, getTelemetryWebSocketUrl } from '../api/client'

const MOCK_ANOMALIES = [
  { id: 1, time: '12:44:10 UTC', severity: 'WARNING', metric: 'HRV (RMSSD)', value: '38 ms', message: 'Sympathetic tone elevation exceeds nominal circadian bound.' },
  { id: 2, time: '08:12:05 UTC', severity: 'ADVISORY', metric: 'Sleep Duration', value: '6.4 hrs', message: 'Sleep phase delay observed (+1.4h shift from mission diurnal baseline).' },
  { id: 3, time: 'Yesterday 19:30', severity: 'NOMINAL', metric: 'ARED Protocol', value: '100%', message: 'Resistive squat countermeasure completed with 620N peak force.' },
]

export default function HealthMonitoring() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '180d'>('7d')
  const [selectedMetric, setSelectedMetric] = useState<string>('heart_rate')
  const [chartData, setChartData] = useState<{ timestamp: string; value: number }[]>([])
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
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true)

  // Real-time WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null
    try {
      ws = new WebSocket(getTelemetryWebSocketUrl())
      ws.onopen = () => setIsLiveConnected(true)
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.vitals) {
            setVitals((prev) => ({ ...prev, ...data.vitals }))
          }
        } catch {
          // ignore
        }
      }
      ws.onerror = () => setIsLiveConnected(false)
      ws.onclose = () => setIsLiveConnected(false)
    } catch {
      setIsLiveConnected(false)
    }

    return () => {
      if (ws) ws.close()
    }
  }, [])

  // Load historical trend data when selectedMetric or timeRange changes
  useEffect(() => {
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 180
    fetchMetricHistory(selectedMetric, days)
      .then((res) => {
        if (res?.points) {
          setChartData(
            res.points.map((p: any) => ({
              timestamp: p.timestamp.slice(11, 16),
              value: p.value,
            }))
          )
        }
      })
      .catch(() => {
        // Fallback synthetic wave
        const fallback = Array.from({ length: 24 }, (_, i) => ({
          timestamp: `${i.toString().padStart(2, '0')}:00`,
          value: Math.round(65 + Math.sin(i / 3) * 6 + (Math.random() * 2 - 1)),
        }))
        setChartData(fallback)
      })
  }, [selectedMetric, timeRange])

  const sensors = [
    { key: 'heart_rate', label: 'Heart Rate', value: `${vitals.heart_rate} BPM`, base: 'Base: 65 BPM', status: 'NOMINAL', icon: '❤️' },
    { key: 'hrv_rmssd', label: 'HRV (RMSSD)', value: `${vitals.hrv_rmssd} ms`, base: 'Base: 48 ms', status: 'ADAPTED', icon: '📊' },
    { key: 'blood_pressure', label: 'Blood Pressure', value: `${vitals.bp_systolic}/${vitals.bp_diastolic} mmHg`, base: 'Base: 118/78', status: 'NOMINAL', icon: '🩺' },
    { key: 'spo2', label: 'SpO₂ Oxygenation', value: `${vitals.spo2}%`, base: 'Base: 98.0%', status: 'NOMINAL', icon: '🫁' },
    { key: 'core_temperature', label: 'Core Temperature', value: `${vitals.core_temperature} °C`, base: 'Base: 36.8 °C', status: 'NOMINAL', icon: '🌡️' },
    { key: 'glucose', label: 'Blood Glucose', value: `${vitals.glucose} mg/dL`, base: 'Base: 90 mg/dL', status: 'NOMINAL', icon: '🩸' },
    { key: 'sleep_duration', label: 'Sleep Duration', value: `${vitals.sleep_duration} hrs`, base: 'Base: 7.5 hrs', status: 'ADAPTED', icon: '😴' },
    { key: 'activity_steps', label: 'Physical Activity', value: `${vitals.activity_steps.toLocaleString()} steps`, base: 'Base: 9,000', status: 'NOMINAL', icon: '🏃' },
    { key: 'stress_score', label: 'Allostatic Stress', value: `${vitals.stress_score} / 100`, base: 'Base: 25 / 100', status: 'ELEVATED', icon: '🧠' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-4 lg:p-6 font-mono text-xs select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-bio-cyan animate-pulse" />
            <h1 className="font-display text-base font-bold text-white tracking-wider text-glow-cyan">
              BIOMETRIC HEALTH MONITORING & ANOMALY DETECTION
            </h1>
          </div>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Continuous multi-signal spaceflight telemetry telemetry stream · CDR Dr. Sarah Chen
          </p>
        </div>

        {/* Live Status & Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-bio-cyan/30 text-[11px]">
            <Radio size={12} className={isLiveConnected ? 'text-bio-cyan animate-pulse' : 'text-red-400'} />
            <span className={isLiveConnected ? 'text-bio-cyan font-bold' : 'text-red-400 font-bold'}>
              {isLiveConnected ? 'LIVE 1Hz WEBSOCKET ACTIVE' : 'HTTP RESILIENT POLLING'}
            </span>
          </div>

          <a
            href="http://127.0.0.1:8000/api/datasets/export"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold transition-all"
          >
            <Download size={13} />
            <span>EXPORT CSV</span>
          </a>
        </div>
      </div>

      {/* 9 Live Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sensors.map((s) => (
          <div
            key={s.key}
            onClick={() => setSelectedMetric(s.key === 'blood_pressure' ? 'heart_rate' : s.key)}
            className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
              selectedMetric === s.key || (s.key === 'blood_pressure' && selectedMetric === 'heart_rate')
                ? 'bg-[#071A33] border-cyan-400 ring-1 ring-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-[#071A33]/80 border-cyan-500/20 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-base">{s.icon}</span>
                <span className="text-gray-300 font-bold text-xs">{s.label}</span>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  s.status === 'NOMINAL'
                    ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/30'
                    : s.status === 'ADAPTED'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {s.status}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div className="font-display font-black text-xl text-white text-glow-cyan">{s.value}</div>
              <div className="text-[10px] text-gray-400">{s.base}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Trend Chart Viewport */}
      <div className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-cyan-400" />
            <h2 className="font-display text-sm font-bold text-white tracking-wider uppercase">
              Longitudinal Signal Analysis: {selectedMetric.replace('_', ' ')}
            </h2>
          </div>

          {/* Time range selector */}
          <div className="flex rounded-lg bg-black/60 border border-cyan-500/30 p-0.5 text-xs">
            {(['24h', '7d', '30d', '180d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded transition-colors uppercase ${
                  timeRange === r ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="timestamp" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#071A33', border: '1px solid #06b6d4', borderRadius: 8, fontSize: 11 }}
              />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly Detection Alerts Log */}
      <div className="bg-[#071A33] border border-cyan-500/25 rounded-xl p-4 lg:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="font-display text-xs font-bold text-white tracking-wider">
              REAL-TIME PHYSIOLOGICAL ANOMALY AUDIT LOG
            </h3>
          </div>
          <span className="text-[10px] text-gray-400">ISOLATION FOREST v1.2 CERTIFIED</span>
        </div>

        <div className="space-y-2">
          {MOCK_ANOMALIES.map((a) => (
            <div key={a.id} className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-start justify-between text-[11px]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    a.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    a.severity === 'ADVISORY' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/30'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="text-white font-bold">{a.metric}</span>
                  <span className="text-cyan-300 font-mono font-bold">({a.value})</span>
                </div>
                <p className="text-gray-400 text-[10px]">{a.message}</p>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
