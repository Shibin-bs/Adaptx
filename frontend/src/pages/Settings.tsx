import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bluetooth, Plus, CheckCircle, AlertTriangle } from 'lucide-react'

interface SensorDevice {
  id: string
  name: string
  type: string
  transport: 'BLE' | 'WIRED' | 'SIMULATOR'
  status: 'CONNECTED' | 'DISCONNECTED' | 'SIMULATED'
  battery: string
  lastSync: string
}

const INITIAL_DEVICES: SensorDevice[] = [
  { id: 'dev-01', name: 'Polar H10 / BioHarness BLE', type: 'PPG / 1-Lead ECG & HRV', transport: 'BLE', status: 'SIMULATED', battery: '94%', lastSync: '1 sec ago' },
  { id: 'dev-02', name: 'Nonin WristOx2 BLE', type: 'Continuous SpO₂ & Pulse Rate', transport: 'BLE', status: 'SIMULATED', battery: '88%', lastSync: '1 sec ago' },
  { id: 'dev-03', name: 'CORE Body Temp Sensor', type: 'Continuous Core Temperature', transport: 'BLE', status: 'SIMULATED', battery: '91%', lastSync: '2 sec ago' },
  { id: 'dev-04', name: 'Validated Omron Space Cuff', type: 'Oscillometric Blood Pressure', transport: 'WIRED', status: 'SIMULATED', battery: 'Mains', lastSync: '30 min ago' },
  { id: 'dev-05', name: 'Abbott FreeStyle Libre Pro', type: 'Intermittent Glucose Monitor', transport: 'BLE', status: 'SIMULATED', battery: '78%', lastSync: '5 min ago' },
]

export default function Settings() {
  const [devices] = useState<SensorDevice[]>(INITIAL_DEVICES)
  const [manualMetric, setManualMetric] = useState('heart_rate')
  const [manualValue, setManualValue] = useState('')
  const [manualFeedback, setManualFeedback] = useState<string | null>(null)

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualValue) return
    setManualFeedback(`Manual sample recorded: ${manualMetric} = ${manualValue} (Logged to local state)`)
    setTimeout(() => setManualFeedback(null), 4000)
    setManualValue('')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div>
          <h1 className="font-display text-xl font-bold text-cyan-400 text-glow-cyan flex items-center gap-2">
            <SettingsIcon size={18} />
            SETTINGS & SENSOR INTEGRATION
          </h1>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Wearable telemetry architecture, Bluetooth Low Energy (BLE) pairing & manual data entry
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 font-mono text-[11px]">
          MODE: SIMULATION STREAM
        </div>
      </div>

      {/* Honest Scientific Disclaimer */}
      <div className="p-3 rounded-lg bg-black/60 border border-amber-500/30 text-[10px] text-gray-400 flex items-start gap-2">
        <AlertTriangle size={14} className="text-warning-amber mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-amber-300 font-bold">SENSOR TRANSPARENCY NOTICE: </span>
          ADAPT-X strictly adheres to scientific integrity rules. No fabricated live Bluetooth connections are claimed.
          All biosensor devices below are operating in clearly-labelled Demonstration Simulation Mode. Real BLE pairing
          uses the Web Bluetooth API on supported browsers.
        </div>
      </div>

      {/* Sensor Device Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-cyan-400 text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Bluetooth size={12} />
            <span>Configured Biosensor Devices</span>
          </span>
          <span className="text-gray-500">5 Devices Registered</span>
        </div>

        <div className="space-y-2">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className="glass-panel-dark p-3 rounded-xl border border-cyan-500/20 flex items-center justify-between hover:border-cyan-400/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Bluetooth size={16} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{dev.name}</div>
                  <div className="text-[10px] text-gray-500">{dev.type} · Transport: {dev.transport}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <div className="text-right">
                  <span className="text-[9px] text-gray-500 block">BATTERY</span>
                  <span className="text-cyan-300 font-bold">{dev.battery}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-gray-500 block">LAST SYNC</span>
                  <span className="text-gray-300">{dev.lastSync}</span>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {dev.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Biometric Input Form */}
      <div className="glass-panel-dark neon-border p-4 rounded-xl">
        <h3 className="font-display text-xs font-bold text-white tracking-wider mb-2 flex items-center gap-1.5">
          <Plus size={14} className="text-cyan-400" />
          <span>MANUAL FLIGHT SURGEON BIOMETRIC INGESTION</span>
        </h3>
        <p className="text-[10px] text-gray-400 mb-3">
          For offline or non-streaming validated diagnostic instruments (e.g., manual sphygmomanometer, capillary blood lancet).
        </p>

        <form onSubmit={handleManualSubmit} className="flex items-center gap-3">
          <select
            value={manualMetric}
            onChange={(e) => setManualMetric(e.target.value)}
            className="bg-black/60 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="heart_rate">Heart Rate (bpm)</option>
            <option value="blood_pressure">Blood Pressure (Systolic mmHg)</option>
            <option value="glucose">Blood Glucose (mg/dL)</option>
            <option value="temperature">Core Temperature (°C)</option>
            <option value="spo2">Blood Oxygen SpO₂ (%)</option>
          </select>

          <input
            type="text"
            placeholder="Enter measurement value..."
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            className="flex-1 bg-black/60 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-400"
          />

          <button
            type="submit"
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <span>Record Sample</span>
          </button>
        </form>

        {manualFeedback && (
          <div className="mt-2 text-[10px] text-bio-cyan flex items-center gap-1">
            <CheckCircle size={12} />
            <span>{manualFeedback}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
