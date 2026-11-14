import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react'
import { useDemoAuth } from '../../context/DemoAuthContext'

interface SignupFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { signup } = useDemoAuth()
  const [astronautId, setAstronautId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanId = astronautId.trim().toUpperCase()

    if (!cleanId) {
      setError('Please provide an Astronaut Identifier.')
      return
    }

    if (cleanId.length < 4) {
      setError('Astronaut ID must be at least 4 characters (e.g. ASTRO042).')
      return
    }

    if (!password) {
      setError('Please create a security passcode.')
      return
    }

    if (password.length < 6) {
      setError('Passcode must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passcode confirmation does not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await signup(cleanId, password)
      if (res.success) {
        setIsSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 900)
      } else {
        setError(res.error || 'Registration failed.')
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Artemis registry synchronization error.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs select-none">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <UserPlus size={16} className="text-cyan-400" />
          <h2 className="font-display text-base font-bold text-white tracking-wider text-glow-cyan">
            ASTRONAUT REGISTRATION
          </h2>
        </div>
        <p className="text-gray-400 text-[11px]">
          Register a new crewmember digital twin profile in the Artemis flight registry.
        </p>
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
          <span className="font-bold">CREWMEMBER REGISTERED · INITIALIZING TWIN</span>
        </motion.div>
      )}

      {/* Astronaut ID Field */}
      <div>
        <label className="block text-gray-300 text-[11px] uppercase tracking-wider mb-1">
          Create Astronaut ID
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <User size={14} />
          </div>
          <input
            type="text"
            value={astronautId}
            onChange={(e) => setAstronautId(e.target.value.toUpperCase())}
            placeholder="e.g. ASTRO042"
            disabled={isSubmitting || isSuccess}
            className="w-full pl-9 pr-3 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 text-xs tracking-wider focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-gray-300 text-[11px] uppercase tracking-wider mb-1">
          Create Security Passcode
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Lock size={14} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 alphanumeric characters"
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

      {/* Confirm Password Field */}
      <div>
        <label className="block text-gray-300 text-[11px] uppercase tracking-wider mb-1">
          Confirm Passcode
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Lock size={14} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter security passcode"
            disabled={isSubmitting || isSuccess}
            className="w-full pl-9 pr-3 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 text-xs tracking-wider focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
          />
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
              <span>RECORDING ASTRONAUT PROFILE...</span>
            </div>
          ) : (
            <span>CREATE ASTRONAUT ACCOUNT</span>
          )}
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onSwitchToLogin}
            disabled={isSubmitting || isSuccess}
            className="text-gray-400 hover:text-cyan-300 text-[11px] underline transition-colors"
          >
            Already registered? Login.
          </button>
        </div>
      </div>
    </form>
  )
}

export default SignupForm
