import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Box,
  Activity,
  TrendingUp,
  Globe2,
  Wind,
  Zap,
  FlaskConical,
  Database,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Mission Dashboard', exact: true },
  { to: '/profile', icon: User, label: 'Astronaut Profile' },
  { to: '/digital-twin', icon: Box, label: 'Digital Twin' },
  { to: '/health', icon: Activity, label: 'Health Monitoring' },
  { to: '/analytics', icon: TrendingUp, label: 'Predictive Analytics' },
  { to: '/earth-space', icon: Globe2, label: 'Earth vs Space' },
  { to: '/environment', icon: Wind, label: 'Environmental Analysis' },
  { to: '/adaptation', icon: Zap, label: 'Adaptation Engine' },
  { to: '/simulator', icon: FlaskConical, label: 'Counterfactual Sim' },
  { to: '/datasets', icon: Database, label: 'Dataset Explorer' },
  { to: '/models', icon: BarChart3, label: 'Model Performance' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`sticky top-14 self-start h-[calc(100vh-3.5rem)] bg-[#071A33] border-r border-cyan-500/25 flex flex-col z-30 select-none transition-all duration-300 flex-shrink-0 ${
        isCollapsed ? 'w-16' : 'w-[220px]'
      }`}
    >
      {/* ADAPT-X Header Logo */}
      <div className="p-3 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 via-blue-600/40 to-cyan-400/20 border border-cyan-400/60 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <span className="font-display font-black text-cyan-300 text-xs tracking-wider">AX</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="font-display font-black text-white text-sm tracking-wider text-glow-cyan truncate">
                ADAPT-X
              </div>
              <div className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase truncate">
                DIGITAL TWIN
              </div>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-gray-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List - STRICTLY VERTICAL IN A COLUMN */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto flex flex-col space-y-1 font-mono">
        {!isCollapsed && (
          <div className="px-2 py-1 text-[9px] text-gray-400 uppercase tracking-widest font-bold">
            Navigation
          </div>
        )}
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 group ${
                isCollapsed ? 'justify-center px-0' : ''
              } ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-300'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mini Profile Badge */}
      <div className="p-2 border-t border-cyan-500/20 bg-black/30 m-1.5 rounded-lg border border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-sm flex-shrink-0">
            👩‍🚀
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-white text-[11px] font-display font-bold truncate">Dr. Sarah Chen</div>
              <div className="text-[9px] text-cyan-400 font-mono truncate">CDR · LEO 408 KM</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
