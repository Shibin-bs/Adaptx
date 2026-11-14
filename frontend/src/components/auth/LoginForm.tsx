import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react'
import { useDemoAuth } from '../../context/DemoAuthContext'

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToSignup: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const { login } = useDemoAuth()
  const [astronautId, setAstronautId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleQuickFill = () => {
    setAstronautId('ASTRO001')
    setPassword('ADAPT2026')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!astronautId.trim()) {
      setError('Please enter your Astronaut ID.')
      return
    }

    if (!password) {
      setError('Please enter your security passcode.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await login(astronautId, password)
      if (res.success) {
        setIsSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 900)
      } else {
        setError(res.error || 'Authentication rejected.')
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Telecommand connection error. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs select-none">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={16} className="text-cyan-400" />
          <h2 className="font-display text-base font-bold text-white tracking-wider text-glow-cyan">
            ASTRONAUT AUTHENTICATION
          </h2>
        </div>
        <p className="text-gray-400 text-[11px]">
          Enter authorized astronaut credentials to connect to Artemis mission telemetry.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Pill */}
      <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-cyan-300">
          <Sparkles size={12} className="text-cyan-400 flex-shrink-0 animate-pulse" />
          <span>Demo Access: <strong className="text-white">ASTRO001</strong> / <strong className="text-white">ADAPT2026</strong></span>
        </div>
        <button
          type="button"
          onClick={handleQuickFill}
          className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400/40 transition-colors"
        >
          Auto-Fill
        </button>
      </div>

      {/* Error Message Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-[11px] flex items-center gap-2"
        >
          <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Success Notification Alert */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-400/60 text-emerald-200 text-[11px] flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
        >
          <ShieldCheck size={16} className="text-emerald-400 animate-bounce" />
          <span className="font-bold">BIOLINK ESTABLISHED · TELEMETRY SYNCHRONIZED</span>
        </motion.div>
      )}

      {/* Astronaut ID Field */}
      <div>
        <label className="block text-gray-300 text-[11px] uppercase tracking-wider mb-1">
          Astronaut Identifier
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <User size={14} />
          </div>
          <input
            type="text"
            value={astronautId}
            onChange={(e) => setAstronautId(e.target.value.toUpperCase())}
            placeholder="e.g. ASTRO001"
            disabled={isSubmitting || isSuccess}
            className="w-full pl-9 pr-3 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 text-xs tracking-wider focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-gray-300 text-[11px] uppercase tracking-wider mb-1">
          Security Passcode
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Lock size={14} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter mission passcode"
            disabled={isSubmitting || isSuccess}
            className="w-full pl-9 pr-10 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 text-xs tracking-wider focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-300 transition-colors"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>AUTHENTICATING BIOLINK...</span>
            </div>
          ) : isSuccess ? (
            <span>CLEARANCE VERIFIED</span>
          ) : (
            <>
              <span>ACCESS MISSION CONTROL</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onSwitchToSignup}
          disabled={isSubmitting || isSuccess}
          className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white text-xs font-mono transition-colors text-center"
        >
          New crewmember? Register Astronaut ID
        </button>
      </div>
    </form>
  )
}

export default LoginForm
