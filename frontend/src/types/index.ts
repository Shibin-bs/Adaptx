export interface AstronautProfile {
  id: string
  name: string
  rank: string
  mission: string
  mission_day: number
  mission_duration_planned: number
  location: string
  altitude_km: number
  overall_health_status: 'NOMINAL' | 'CAUTION' | 'WARNING' | 'CRITICAL'
  health_score: number
  last_updated: string
}

export interface MetricData {
  value: number
  baseline: number
  unit: string
  status: 'NOMINAL' | 'SLIGHTLY_REDUCED' | 'ELEVATED' | 'WARNING' | 'CRITICAL'
  predicted_next?: number
  trend?: string
}

export interface BloodPressureMetric {
  systolic: number
  diastolic: number
  baseline_systolic: number
  baseline_diastolic: number
  unit: string
  status: string
}

export interface PhysiologicalMetrics {
  data_type: string
  disclaimer: string
  timestamp: string
  metrics: {
    heart_rate: MetricData
    hrv: MetricData
    blood_pressure: BloodPressureMetric
    spo2: MetricData
    temperature: MetricData
    glucose: MetricData
    sleep_duration: MetricData
    activity_level: MetricData
    stress_level: MetricData
  }
}

export type HealthStatus = 'NOMINAL' | 'SLIGHTLY_REDUCED' | 'ELEVATED' | 'WARNING' | 'CRITICAL'

export interface AdaptationDimension {
  name: string
  score: number
  status: string
  trend: string
}

export interface EnvironmentalData {
  parameter: string
  earth_value: number | string
  space_value: number | string
  unit: string
  deviation: string
}
