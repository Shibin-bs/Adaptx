import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldAlert, Radio } from 'lucide-react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

interface AuthenticationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Tint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020817]/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#071A33]/90 backdrop-blur-xl border border-cyan-400/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] z-10 overflow-hidden font-mono"
        >
          {/* Top Aerospace Glow Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />

          {/* Header Row: ADAPT-X Badge & Close Button */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/30 via-blue-600/40 to-cyan-400/20 border border-cyan-400/60 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <span className="font-display font-black text-cyan-300 text-[11px] tracking-wider">AX</span>
              </div>
              <div>
                <div className="font-display font-black text-white text-xs tracking-wider text-glow-cyan flex items-center gap-2">
                  <span>ADAPT-X MISSION GATE</span>
                </div>
                <div className="text-[9px] text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                  <Radio size={9} className="animate-pulse" />
                  <span>SECURE TELEMETRY CHANNEL</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-colors"
              title="Return to Horizon View"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-black/50 border border-cyan-500/30 rounded-xl mb-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-1.5 rounded-lg font-bold transition-all ${
                mode === 'login'
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ASTRONAUT LOGIN
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-1.5 rounded-lg font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              REGISTER NEW ID
            </button>
          </div>

          {/* Form Content with Smooth Mode Transition */}
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm
                  onSuccess={onSuccess}
                  onSwitchToSignup={() => setMode('signup')}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SignupForm
                  onSuccess={onSuccess}
                  onSwitchToLogin={() => setMode('login')}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Clearance Notice */}
          <div className="mt-4 pt-3 border-t border-cyan-500/20 text-[10px] text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldAlert size={11} className="text-amber-400" />
              <span>DEMO GATEWAY · LEVEL 4 CLEARANCE</span>
            </span>
            <span>EXPEDITION 74</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AuthenticationModal
