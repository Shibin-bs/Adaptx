import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Shield,
  Activity,
  Globe2,
  Sparkles,
  ArrowRight,
  Radio,
  UserCheck,
} from 'lucide-react'
import EarthScene from '../components/EarthScene'
import AuthenticationModal from '../components/auth/AuthenticationModal'
import { useDemoAuth } from '../context/DemoAuthContext'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useDemoAuth()

  // Scene state: 'intro' | 'auth' | 'transition'
  const [phase, setPhase] = useState<'intro' | 'auth' | 'transition'>('intro')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [hasStartedIntro, setHasStartedIntro] = useState(false)

  useEffect(() => {
    // Initial cinematic fade-in trigger
    const timer = setTimeout(() => {
      setHasStartedIntro(true)
    }, 400)
    return () => clearInterval(timer)
  }, [])

  const handleEnterMissionControl = () => {
    if (isAuthenticated) {
      // User is already authenticated: trigger cinematic fly-through directly into dashboard
      triggerDashboardTransition()
    } else {
      setPhase('auth')
      setIsAuthModalOpen(true)
    }
  }

  const handleOpenAuthModal = () => {
    setPhase('auth')
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
    setPhase('intro')
  }

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
    triggerDashboardTransition()
  }

  const triggerDashboardTransition = () => {
    setPhase('transition')
    // Camera will accelerate forward in EarthScene; transition complete callback will navigate
  }

  const handleTransitionComplete = () => {
    navigate('/dashboard')
  }

  return (
    <div className="relative w-screen h-screen min-h-[640px] bg-[#020817] text-white overflow-hidden select-none font-mono">
      {/* 3D Photorealistic Earth Canvas (Earth ONLY, deep space, stars, atmospheric glow) */}
      <EarthScene
        phase={phase}
        onTransitionComplete={handleTransitionComplete}
      />

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#020817] via-transparent to-[#020817]/70 z-10" />

      {/* Radial Blue Atmospheric Gradient at Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[40vh] bg-gradient-to-t from-cyan-900/20 via-blue-900/10 to-transparent blur-3xl pointer-events-none z-10" />

      {/* TOP HUD BAR */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: hasStartedIntro ? 1 : 0, y: hasStartedIntro ? 0 : -20 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute top-0 left-0 right-0 z-20 px-6 py-5 flex items-center justify-between"
      >
        {/* Left: NASA / Mission Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Globe2 size={18} />
          </div>
          <div>
            <div className="text-[11px] font-display font-black tracking-widest text-white text-glow-cyan">
              NASA // ARTEMIS-VII EXPEDITION 74
            </div>
            <div className="text-[9px] text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Radio size={9} className="animate-pulse" />
              <span>ORBITAL TELEMETRY STATION · 408 KM LEO</span>
            </div>
          </div>
        </div>

        {/* Right: Security Status & Session */}
        <div className="flex items-center gap-3 text-xs">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 bg-[#071A33]/80 border border-cyan-400/40 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <UserCheck size={14} className="text-emerald-400" />
              <div className="text-left text-[10px]">
                <span className="text-gray-400 block">AUTHENTICATED:</span>
                <span className="text-white font-bold tracking-wider">{user.astronautId}</span>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-gray-400">
              <Shield size={12} className="text-cyan-400" />
              <span>CLEARANCE: DEMO ACCESS</span>
            </div>
          )}
        </div>
      </motion.header>

      {/* MAIN CINEMATIC HERO CONTENT */}
      <AnimatePresence>
        {phase !== 'transition' && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: hasStartedIntro ? 1 : 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 1.0 }}
            className="relative z-20 h-full flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto"
          >
            {/* Mission Sub-Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-[11px] tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              <Sparkles size={12} className="text-cyan-300 animate-pulse" />
              <span>AI-POWERED ASTRONAUT HEALTH MONITORING</span>
            </motion.div>

            {/* ADAPT-X Grand Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 1.0 }}
              className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.6)] mb-3"
            >
              ADAPT-X
            </motion.h1>

            {/* Mission Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="font-display text-sm sm:text-base md:text-lg tracking-[0.25em] text-cyan-200 uppercase font-semibold mb-5 text-glow-cyan"
            >
              YOUR BODY. YOUR MISSION. OUR NEXT FRONTIER.
            </motion.p>

            {/* Scientific Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="max-w-xl text-gray-300 text-xs sm:text-sm font-sans font-light leading-relaxed mb-8 text-center text-balance"
            >
              A physiological digital twin for monitoring, understanding, and predicting astronaut adaptation to spaceflight.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="flex flex-col sm:flex-row items-center gap-3.5"
            >
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={handleEnterMissionControl}
                    className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 text-black font-display font-bold text-xs tracking-[0.18em] uppercase flex items-center gap-2.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>RESUME MISSION CONTROL</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleOpenAuthModal}
                    className="px-5 py-3 rounded-xl bg-black/50 hover:bg-white/10 border border-white/15 hover:border-cyan-400/50 text-gray-300 hover:text-white text-xs font-mono transition-all"
                  >
                    Switch Crewmember
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEnterMissionControl}
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 text-black font-display font-bold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center gap-3 hover:shadow-[0_0_40px_rgba(6,182,212,0.75)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Activity size={16} className="text-black animate-pulse" />
                  <span>ENTER MISSION CONTROL</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              )}
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* CINEMATIC TRANSITION HUD OVERLAY */}
      <AnimatePresence>
        {phase === 'transition' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none font-mono"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-3"
            >
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_30px_rgba(6,182,212,0.8)]" />
              <div className="font-display font-bold text-lg md:text-xl text-white tracking-[0.25em] text-glow-cyan uppercase">
                CLEARANCE VERIFIED // TRAVERSING ATMOSPHERE
              </div>
              <div className="text-xs text-cyan-300 uppercase tracking-widest animate-pulse">
                INITIALIZING ADAPT-X PHYSIOLOGICAL TWIN WORKSTATION...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER METRICS HUD */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: hasStartedIntro ? 1 : 0 }}
        transition={{ duration: 1.0, delay: 1.8 }}
        className="absolute bottom-4 left-0 right-0 z-20 px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 gap-2 pointer-events-none"
      >
        <div className="flex items-center gap-4">
          <span>ORBITAL ALTITUDE: 408 KM</span>
          <span>·</span>
          <span>ORBITAL VELOCITY: 7.66 KM/S</span>
          <span>·</span>
          <span>INCLINATION: 51.6°</span>
        </div>
        <div className="text-cyan-400/80">
          NASA SPACE APPS CHALLENGE 2026 · ADAPT-X DIGITAL TWIN
        </div>
      </motion.footer>

      {/* AUTHENTICATION MODAL OVERLAY */}
      <AuthenticationModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default LandingPage
