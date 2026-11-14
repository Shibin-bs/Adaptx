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
    console.warn('API Response Notice:', error.message)
    return Promise.reject(error)
  }
)

// Astronaut Endpoints
export const fetchProfile = () => apiClient.get('/api/astronaut/profile').then((r) => r.data)
export const fetchQualifications = () => apiClient.get('/api/astronaut/qualifications').then((r) => r.data)

// Metrics Endpoints
export const fetchMetrics = () => apiClient.get('/api/metrics/current').then((r) => r.data)
export const fetchMetricHistory = (metric: string, days = 7) =>
  apiClient.get(`/api/metrics/history/${metric}?days=${days}`).then((r) => r.data)
export const fetchAlarmThresholds = () => apiClient.get('/api/metrics/thresholds').then((r) => r.data)

// Adaptation Endpoints
export const fetchAdaptationIndex = () => apiClient.get('/api/adaptation/index').then((r) => r.data)
export const evaluateAdaptation = (vitals: Record<string, number>) =>
  apiClient.post('/api/adaptation/evaluate', vitals).then((r) => r.data)

// Environment Endpoints
export const fetchEnvironment = () => apiClient.get('/api/environment/current').then((r) => r.data)
export const fetchEclss = () => apiClient.get('/api/environment/eclss').then((r) => r.data)

// Predictions Endpoints
export const fetchPredictions = () => apiClient.get('/api/predictions/trajectory').then((r) => r.data)
export const fetchSansRisk = () => apiClient.get('/api/predictions/sans_risk').then((r) => r.data)

// Simulation Endpoints
export const runCounterfactual = (params: {
  exercise_adherence: number
  dietary_countermeasure?: boolean
  fluid_loading_pre_landing?: boolean
  radiation_shielding_factor?: number
}) => apiClient.post('/api/simulation/counterfactual', params).then((r) => r.data)

// Dataset Endpoints
export const fetchDatasetRegistry = () => apiClient.get('/api/datasets/registry').then((r) => r.data)
export const fetchNasaStudy = (studyId: string) => apiClient.get(`/api/datasets/nasa/${studyId}`).then((r) => r.data)
export const fetchTelemetrySamples = (limit = 50, offset = 0) =>
  apiClient.get('/api/datasets/telemetry-samples', { params: { limit, offset } }).then((r) => r.data)

// Model Performance Endpoints
export const fetchModelBenchmarks = () => apiClient.get('/api/models/benchmarks').then((r) => r.data)
export const fetchModelArchitectures = () => apiClient.get('/api/models/architectures').then((r) => r.data)

// Health
export const fetchHealth = () => apiClient.get('/api/health').then((r) => r.data)

// WebSocket URL
export const getTelemetryWebSocketUrl = () => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/^https?:\/\//, '')
  return `${wsProtocol}//${host}/ws/telemetry`
}
