import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AstronautUser {
  astronautId: string
  name: string
  role: string
  mission: string
  clearanceLevel: number
  loginTimestamp: string
}

interface DemoAuthContextType {
  user: AstronautUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (astronautId: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (astronautId: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined)

const DEFAULT_DEMO_ACCOUNT = {
  astronautId: 'ASTRO001',
  password: 'ADAPT2026',
  name: 'Dr. Sarah Chen',
  role: 'Mission Commander & Flight Surgeon',
  mission: 'ARTEMIS-VII / ISS EXPEDITION 74',
  clearanceLevel: 4,
}

const STORAGE_KEY_SESSION = 'adaptx_demo_session'
const STORAGE_KEY_ACCOUNTS = 'adaptx_demo_accounts'

export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AstronautUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize demo accounts & restore session from localStorage
  useEffect(() => {
    try {
      const storedAccounts = localStorage.getItem(STORAGE_KEY_ACCOUNTS)
      if (!storedAccounts) {
        // Pre-populate with default demo account
        const initialAccounts = [DEFAULT_DEMO_ACCOUNT]
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(initialAccounts))
      } else {
        const parsed = JSON.parse(storedAccounts)
        // Ensure default demo account is always present
        if (!parsed.some((acc: any) => acc.astronautId.toUpperCase() === 'ASTRO001')) {
          parsed.push(DEFAULT_DEMO_ACCOUNT)
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(parsed))
        }
      }

      const activeSession = localStorage.getItem(STORAGE_KEY_SESSION)
      if (activeSession) {
        const parsedSession = JSON.parse(activeSession)
        setUser(parsedSession)
      }
    } catch (err) {
      console.warn('DemoAuth initialization notice:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (astronautId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for authentic aerospace biometric verification feel
    await new Promise((r) => setTimeout(r, 650))

    const cleanId = astronautId.trim().toUpperCase()
    const cleanPass = password.trim()

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Astronaut ID and password are required.' }
    }

    try {
      const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS)
      const accounts = accountsJson ? JSON.parse(accountsJson) : [DEFAULT_DEMO_ACCOUNT]

      const matched = accounts.find(
        (acc: any) => acc.astronautId.toUpperCase() === cleanId && acc.password === cleanPass
      )

      if (!matched) {
        return {
          success: false,
          error: 'Access Denied: Invalid Astronaut ID or Security Passcode.',
        }
      }

      const sessionUser: AstronautUser = {
        astronautId: matched.astronautId,
        name: matched.name || `Astronaut ${matched.astronautId}`,
        role: matched.role || 'Flight Specialist',
        mission: matched.mission || 'ARTEMIS-VII EXPEDITION',
        clearanceLevel: matched.clearanceLevel || 3,
        loginTimestamp: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionUser))
      setUser(sessionUser)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Local authentication database error.' }
    }
  }

  const signup = async (astronautId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 700))

    const cleanId = astronautId.trim().toUpperCase()
    const cleanPass = password.trim()

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'All registration fields are required.' }
    }

    if (cleanId.length < 4) {
      return { success: false, error: 'Astronaut ID must be at least 4 alphanumeric characters.' }
    }

    if (cleanPass.length < 6) {
      return { success: false, error: 'Security passcode must be at least 6 characters.' }
    }

    try {
      const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS)
      const accounts = accountsJson ? JSON.parse(accountsJson) : [DEFAULT_DEMO_ACCOUNT]

      if (accounts.some((acc: any) => acc.astronautId.toUpperCase() === cleanId)) {
        return {
          success: false,
          error: `Astronaut ID "${cleanId}" is already registered in the Artemis telemetry registry.`,
        }
      }

      const newAccount = {
        astronautId: cleanId,
        password: cleanPass,
        name: `Specialist ${cleanId}`,
        role: 'Mission Payload Specialist',
        mission: 'ARTEMIS-VII / ISS EXPEDITION 74',
        clearanceLevel: 3,
      }

      accounts.push(newAccount)
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts))

      // Automatically authenticate the newly registered astronaut
      const sessionUser: AstronautUser = {
        astronautId: newAccount.astronautId,
        name: newAccount.name,
        role: newAccount.role,
        mission: newAccount.mission,
        clearanceLevel: newAccount.clearanceLevel,
        loginTimestamp: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionUser))
      setUser(sessionUser)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Failed to record astronaut credentials.' }
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_SESSION)
    setUser(null)
  }

  return (
    <DemoAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  )
}

export const useDemoAuth = (): DemoAuthContextType => {
  const context = useContext(DemoAuthContext)
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider')
  }
  return context
}
