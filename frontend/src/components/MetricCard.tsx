import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { MetricData } from '../types'

interface Props {
  label: string
  icon: string
  metric: MetricData
  formatValue?: (v: number) => string
}

function generateSparkline(current: number, baseline: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const noise = Math.sin(i * 1.2) * 0.4 * (baseline * 0.02)
    return baseline + (current - baseline) * (i / 11) + noise
  })
}

export default function MetricCard({ label, icon, metric, formatValue }: Props) {
  const values = generateSparkline(metric.value, metric.baseline)
  
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 110
  const height = 32

  // Generate SVG path for sparkline area & line
  const pts = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 6) - 3
    return { x, y }
  })

  const lineD = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '')
  const areaD = `${lineD} L ${width} ${height} L 0 ${height} Z`

  // Status styling
  const isCritical = metric.status === 'CRITICAL' || metric.status === 'WARNING'
  const isWarning = metric.status === 'SLIGHTLY_REDUCED' || metric.status === 'ELEVATED'

  const statusColor = isCritical
    ? 'text-red-400'
    : isWarning
    ? 'text-amber-400'
    : 'text-bio-cyan'

  const borderClass = isCritical
    ? 'border-red-500/40 bg-[#071A33] shadow-[0_0_12px_rgba(239,68,68,0.15)]'
    : isWarning
    ? 'border-amber-500/35 bg-[#071A33] shadow-[0_0_12px_rgba(245,158,11,0.12)]'
    : 'border-cyan-500/25 bg-[#071A33] hover:border-cyan-400/50'

  const dotClass = isCritical
    ? 'bg-red-400 shadow-[0_0_8px_#ef4444]'
    : isWarning
    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
    : 'bg-bio-cyan shadow-[0_0_8px_#14b8a6]'

  const strokeColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#06b6d4'
  const gradId = `grad-${label.replace(/[^a-zA-Z0-9]/g, '')}`

  const displayVal = formatValue ? formatValue(metric.value) : metric.value.toFixed(0)
  const displayBase = formatValue ? formatValue(metric.baseline) : metric.baseline.toFixed(0)
  const displayPred = metric.predicted_next
    ? formatValue
      ? formatValue(metric.predicted_next)
      : metric.predicted_next.toFixed(0)
    : '—'

  return (
    <div
      className={`p-2.5 rounded-xl border transition-all duration-200 select-none ${borderClass}`}
    >
      {/* Header: Label, Icon, Status Badge */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{icon}</span>
          <span className="text-[11px] font-mono text-gray-300 font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass} animate-pulse`} />
          <span className={`text-[9px] font-mono font-bold uppercase ${statusColor}`}>
            {metric.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Measurement + Glowing SVG Sparkline */}
      <div className="flex items-center justify-between gap-2 my-1">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-display font-bold text-white tracking-tight">
              {displayVal}
            </span>
            <span className="text-[10px] font-mono text-gray-400">{metric.unit}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
            {metric.trend?.includes('decrease') ? (
              <span className="text-amber-400 flex items-center gap-0.5">
                <TrendingDown size={11} /> Trending down
              </span>
            ) : metric.trend?.includes('increase') ? (
              <span className="text-red-400 flex items-center gap-0.5">
                <TrendingUp size={11} /> Trending up
              </span>
            ) : (
              <span className="text-bio-cyan flex items-center gap-0.5">
                <Minus size={11} /> Stable
              </span>
            )}
          </div>
        </div>

        {/* Clean, High-Contrast Glowing Sparkline */}
        <div className="w-[110px] h-8 flex-shrink-0 relative overflow-hidden rounded bg-black/40 border border-white/5 px-0.5 py-0.5">
          <svg width={width} height={height} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.45} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#${gradId})`} />
            <path
              d={lineD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 3px ${strokeColor})` }}
            />
            {/* Current point dot */}
            {pts.length > 0 && (
              <circle
                cx={pts[pts.length - 1].x}
                cy={pts[pts.length - 1].y}
                r={2.5}
                fill="#ffffff"
                stroke={strokeColor}
                strokeWidth={1.5}
              />
            )}
          </svg>
        </div>
      </div>

      {/* Footer: Earth Baseline vs Model Prediction */}
      <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[10px] font-mono text-gray-400">
        <span>
          Earth Base: <strong className="text-gray-200">{displayBase} {metric.unit}</strong>
        </span>
        <span>
          Pred (+24h): <strong className="text-cyan-300 font-bold">{displayPred} {metric.unit}</strong>
        </span>
      </div>
    </div>
  )
}
