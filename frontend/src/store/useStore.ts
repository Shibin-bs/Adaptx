import { create } from 'zustand'
import type { AstronautProfile, PhysiologicalMetrics } from '../types'

interface AppState {
  profile: AstronautProfile | null
  metrics: PhysiologicalMetrics | null
  isLoading: boolean
  error: string | null
  sidebarOpen: boolean
  setProfile: (profile: AstronautProfile) => void
  setMetrics: (metrics: PhysiologicalMetrics) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  toggleSidebar: () => void
}

export const useStore = create<AppState>((set) => ({
  profile: null,
  metrics: null,
  isLoading: false,
  error: null,
  sidebarOpen: true,
  setProfile: (profile) => set({ profile }),
  setMetrics: (metrics) => set({ metrics }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
