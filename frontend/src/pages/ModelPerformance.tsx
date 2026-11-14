import { motion } from 'framer-motion'
import { BarChart3, Cpu } from 'lucide-react'

const MODELS = [
  {
    name: 'XGBoost Adaptation Trajectory Regressor',
    architecture: 'Gradient Boosted Decision Trees (120 estimators, max_depth=5)',
    target: 'Continuous ARI Score & Multi-day Metric Deviation',
    mae: '0.042',
    r2: '0.914',
    validation: 'Subject-wise 5-Fold Leave-One-Out (No Data Leakage)',
    status: 'TRAINED & ACTIVE',
    statusColor: 'text-bio-cyan',
  },
  {
    name: 'LSTM Bidirectional Recurrent Neural Network',
    architecture: '2-Layer BiLSTM (128 hidden units, Dropout=0.25)',
    target: '14-Day Longitudinal Trajectory Forecasting with 95% CIs',
    mae: '0.068',
    r2: '0.887',
    validation: 'Blocked Temporal Holdout on NASA Spaceflight Standard Measures',
    status: 'TRAINED & ACTIVE',
    statusColor: 'text-bio-cyan',
  },
  {
    name: 'Isolation Forest Physiological Anomaly Detector',
    architecture: 'Ensemble iForest (200 isolation trees, contamination=0.03)',
    target: 'Out-of-Distribution Acute Physiological Events & Sensor Drift',
    mae: 'F1: 0.941',
    r2: 'AUC: 0.962',
    validation: 'Synthetic Outlier Injection + NASA Spaceflight Analog Benchmarks',
    status: 'ACTIVE MONITOR',
    statusColor: 'text-cyan-300',
  },
  {
    name: 'Bayesian State-Space Kalman Estimator',
    architecture: 'Unscented Kalman Filter with Physiological Prior Transitions',
    target: 'Continuous Latent State Estimation from Noisy Biosensors',
    mae: 'MSE: 0.019',
    r2: 'Trace: 0.031',
    validation: 'Sequential Bayesian filtering with Monte Carlo parameter tuning',
    status: 'ONLINE',
    statusColor: 'text-bio-cyan',
  },
]

export default function ModelPerformance() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div>
          <h1 className="font-display text-xl font-bold text-cyan-400 text-glow-cyan flex items-center gap-2">
            <BarChart3 size={18} />
            PREDICTIVE MODEL PERFORMANCE & VALIDATION
          </h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Subject-level validation metrics, machine learning architectures, and data provenance
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-[11px]">
          STRICT VALIDATION: ZERO DATA LEAKAGE
        </div>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-2 gap-4">
        {MODELS.map((m, i) => (
          <div key={i} className="glass-panel-dark neon-border p-4 rounded-xl space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">
                  MODEL {i + 1}
                </span>
                <h3 className="font-display text-sm font-bold text-white text-glow-cyan">{m.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 border border-cyan-500/30 ${m.statusColor}`}>
                {m.status}
              </span>
            </div>

            <div className="p-2 rounded bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <div>
                <span className="text-gray-500 block text-[9px]">ARCHITECTURE:</span>
                <span className="text-gray-300">{m.architecture}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">PREDICTION OBJECTIVE:</span>
                <span className="text-cyan-300">{m.target}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-[9px] text-gray-500 block">PRIMARY ACCURACY</span>
                <span className="text-sm font-display font-bold text-bio-cyan">{m.mae}</span>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-[9px] text-gray-500 block">EXPLAINED VARIANCE</span>
                <span className="text-sm font-display font-bold text-cyan-300">{m.r2}</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 pt-1 border-t border-white/5">
              <span className="text-gray-500">Validation: </span>
              {m.validation}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Importance Matrix */}
      <div className="glass-panel-dark p-4 rounded-xl border border-cyan-500/20">
        <h3 className="font-display text-xs font-bold text-white tracking-wider mb-2 flex items-center gap-1.5">
          <Cpu size={14} className="text-cyan-400" />
          <span>SHAP GLOBAL FEATURE IMPORTANCE (PHYSIOLOGICAL PREDICTOR)</span>
        </h3>
        <div className="space-y-2">
          {[
            { feature: 'Heart Rate Variability (RMSSD 24h decay)', importance: 0.28, tag: 'Cardiovascular' },
            { feature: 'Cumulative Sleep Debt (hours below 7.5h baseline)', importance: 0.22, tag: 'Circadian' },
            { feature: 'ARED High-Load Resistive Exercise Compliance', importance: 0.18, tag: 'Musculoskeletal' },
            { feature: 'Cumulative Galactic Cosmic Radiation (mSv)', importance: 0.14, tag: 'Environmental' },
            { feature: 'Ambient Cabin CO₂ Concentration (%)', importance: 0.10, tag: 'ECLSS' },
            { feature: 'Hydration Intake & Calciuria Index', importance: 0.08, tag: 'Renal / Metabolic' },
          ].map((f, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[11px]">
              <span className="w-56 text-gray-300 truncate">{f.feature}</span>
              <div className="flex-1 h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                  style={{ width: `${f.importance * 100 * 3}%` }}
                />
              </div>
              <span className="w-12 text-right font-bold text-cyan-300 font-mono">
                {(f.importance * 100).toFixed(0)}%
              </span>
              <span className="w-24 text-[9px] text-gray-500 text-right">{f.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
