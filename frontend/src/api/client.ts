import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)

export const fetchProfile = () => apiClient.get('/api/astronaut/profile').then(r => r.data)
export const fetchMetrics = () => apiClient.get('/api/metrics/current').then(r => r.data)
export const fetchHealth = () => apiClient.get('/api/health').then(r => r.data)
