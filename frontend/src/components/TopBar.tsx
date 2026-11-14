import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Wifi, WifiOff, Bell, Shield, Radio, Activity, LogOut } from 'lucide-react'
import { fetchHealth } from '../api/client'
import { useDemoAuth } from '../context/DemoAuthContext'

export default function TopBar() {
  const [time, setTime] = useState(new Date())
  const [backendOnline, setBackendOnline] = useState<boolean | null>(true)
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(true)
  const { user, logout } = useDemoAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const check = () =>
      fetchHealth()
        .then(() => setBackendOnline(true))
        .catch(() => setBackendOnline(false))
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="h-14 sticky top-0 bg-[#071A33] border-b border-cyan-500/25 px-4 flex items-center justify-between flex-shrink-0 z-40 relative select-none shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      {/* LEFT: Mission Identifier & Elapsed Time */}
      <div className="flex items-center gap-4">
        {/* Mission Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-black/40 border border-cyan-500/30">
          <div className="w-2.5 h-2.5 rounded-full bg-bio-cyan animate-pulse shadow-[0_0_8px_#14b8a6]" />
          <div>
            <div className="font-display text-xs font-bold text-white tracking-wider flex items-center gap-2">
              <span>ARTEMIS-VII</span>
              <span className="text-[10px] text-cyan-400 font-mono font-normal">EXPEDITION 74</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
              <span className="text-cyan-300">MET: DAY 142</span>
              <span>·</span>
              <span>180D PLANNED</span>
              <span>·</span>
              <span className="text-gray-500">ISS LEO (408 KM)</span>
            </div>
          </div>
        </div>

        {/* Commander Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/5 text-[11px] font-mono">
          <span className="text-gray-500">CREW:</span>
          <span className="text-white font-medium">{user?.name || 'DR. SARAH CHEN'}</span>
          <span className="text-cyan-400 font-bold text-[10px]">({user?.astronautId || 'ASTRO001'})</span>
          <span className="text-bio-cyan text-[10px] bg-bio-cyan/10 px-1.5 py-0.5 rounded border border-bio-cyan/30">
            NOMINAL
          </span>
        </div>
      </div>

      {/* CENTER: Workstation Title & Telemetry Header */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Shield size={13} className="text-cyan-400 animate-pulse" />
          <span className="font-display text-xs font-bold text-cyan-300 tracking-[0.2em] text-glow-cyan">
            ADAPT-X COMMAND STATION
          </span>
        </div>
        <div className="text-[10px] font-mono text-gray-500 flex items-center gap-2">
          <span>DIGITAL TWIN ENGINE v1.2</span>
          <span>·</span>
          <span className="text-bio-cyan flex items-center gap-1">
            <Activity size={10} /> 95% STATE CONFIDENCE
          </span>
        </div>
      </div>

      {/* RIGHT: Telemetry Status, UTC Clock, Alerts */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Connection Status */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] ${
            backendOnline
              ? 'bg-bio-cyan/10 border-bio-cyan/30 text-bio-cyan'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {backendOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>{backendOnline ? 'BIOLINK ACTIVE' : 'TELEMETRY OFFLINE'}</span>
        </div>

        {/* Data Source Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30 text-amber-300 text-[11px]">
          <Radio size={12} className="animate-pulse text-amber-400" />
          <span>SYNTHETIC TELEMETRY</span>
        </div>

        {/* Live UTC Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-xs">
          <Clock size={13} className="text-cyan-400" />
          <span className="font-bold tracking-wider">{time.toUTCString().slice(17, 25)}</span>
          <span className="text-[10px] text-cyan-400">UTC</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setHasUnreadAlerts(false)}
          className="relative p-2 rounded-lg bg-black/40 border border-cyan-500/30 text-gray-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
          title="Flight Surgeon Notifications"
        >
          <Bell size={15} />
          {hasUnreadAlerts && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        {/* Sign Out / Disconnect BioLink */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 hover:text-white transition-colors"
          title="Sign Out / Disconnect BioLink"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline text-[11px] font-bold">LOGOUT</span>
        </button>
      </div>
    </header>
  )
}
