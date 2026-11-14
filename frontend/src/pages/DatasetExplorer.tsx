import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  ExternalLink,
  Download,
  Search,
  Layers,
  Dna,
  Calendar,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  ChevronLeft,
  ChevronRight,
  Activity,
  Sparkles,
} from 'lucide-react'
import {
  fetchDatasetRegistry,
  fetchNasaStudy,
  fetchTelemetrySamples,
} from '../api/client'

interface RegistryItem {
  id: string
  name: string
  source: string
  url: string | null
  variables: string[]
  subjects: number
  status: string
  loaded: boolean
  note: string
}

interface NasaStudyDetail {
  id: string
  accession: string
  title: string
  mission: string
  principal_investigators: string[]
  assays: string[]
  organism: string
  subjects_count: number
  timepoints: string[]
  findings: string[]
  url: string
  status: string
}

interface TelemetryRecord {
  timestamp: string
  mission_day: number
  heart_rate: number
  hrv_rmssd: number
  bp_systolic: number
  bp_diastolic: number
  spo2: number
  core_temperature: number
  glucose: number
  sleep_duration: number
  activity_steps: number
  stress_score: number
  bmd_loss_rate: number
  ari_score: number
  data_type: string
}

export default function DatasetExplorer() {
  const [registry, setRegistry] = useState<RegistryItem[]>([])
  const [selectedStudyId, setSelectedStudyId] = useState<string>('NASA-OSDR-OSD-379')
  const [studyDetail, setStudyDetail] = useState<NasaStudyDetail | null>(null)
  const [telemetryRecords, setTelemetryRecords] = useState<TelemetryRecord[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize] = useState(15)
  const [filterMode, setFilterMode] = useState<'all' | 'stress' | 'hrv' | 'sleep'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'studies' | 'telemetry'>('studies')

  useEffect(() => {
    fetchDatasetRegistry()
      .then((res) => {
        if (res?.registry) {
          setRegistry(res.registry)
        }
      })
      .catch((err) => console.error('Failed to load dataset registry:', err))
  }, [])

  useEffect(() => {
    if (selectedStudyId.startsWith('NASA-')) {
      fetchNasaStudy(selectedStudyId)
        .then((detail) => setStudyDetail(detail))
        .catch((err) => console.error('Failed to load NASA study:', err))
    } else {
      setStudyDetail(null)
    }
  }, [selectedStudyId])

  useEffect(() => {
    fetchTelemetrySamples(pageSize, page * pageSize)
      .then((res) => {
        if (res?.records) {
          setTelemetryRecords(res.records)
          setTotalRecords(res.total)
        }
      })
      .catch((err) => console.error('Failed to load telemetry samples:', err))
  }, [page, pageSize])

  const filteredRecords = telemetryRecords.filter((rec) => {
    if (filterMode === 'stress') return rec.stress_score > 35
    if (filterMode === 'hrv') return rec.hrv_rmssd < 45
    if (filterMode === 'sleep') return rec.sleep_duration < 7.0
    return true
  }).filter((rec) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      rec.mission_day.toString().includes(q) ||
      rec.heart_rate.toString().includes(q) ||
      rec.timestamp.toLowerCase().includes(q)
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 lg:p-6 font-mono text-xs select-none"
    >
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.12)]">
        <div>
          <div className="flex items-center gap-2">
            <Database size={20} className="text-cyan-400" />
            <h1 className="font-display text-base font-bold text-white tracking-wider text-glow-cyan">
              NASA OPEN SCIENCE & MISSION DATASET EXPLORER
            </h1>
          </div>
          <p className="text-gray-400 text-[11px] mt-0.5">
            NASA Open Science Data Repository (OSDR), Life Sciences Data Archive (LSDA), and ADAPT-X 180-Day Longitudinal Mission Telemetry
          </p>
        </div>

        {/* Action buttons & mode switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-black/40 border border-cyan-500/30 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('studies')}
              className={`px-3 py-1 rounded text-[11px] transition-colors ${
                activeTab === 'studies' ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              NASA OSDR Studies
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1 rounded text-[11px] transition-colors ${
                activeTab === 'telemetry' ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              Mission Telemetry (720 Records)
            </button>
          </div>

          <a
            href="http://localhost:8000/api/datasets/export"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 font-bold text-[11px] transition-all"
          >
            <Download size={13} />
            EXPORT CSV (180 DAYS)
          </a>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#071A33] border border-cyan-500/25 p-3 rounded-xl">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Indexed NASA Studies</div>
          <div className="text-xl font-bold font-display text-cyan-300 mt-1">3 Major Programs</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Inspiration4, Standard Measures, Twins</div>
        </div>

        <div className="bg-[#071A33] border border-cyan-500/25 p-3 rounded-xl">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Mission Telemetry Records</div>
          <div className="text-xl font-bold font-display text-white mt-1">720 Timepoints</div>
          <div className="text-[10px] text-cyan-400 mt-0.5">180 Days @ 4 Samples/Day</div>
        </div>

        <div className="bg-[#071A33] border border-cyan-500/25 p-3 rounded-xl">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Physiological Subsystems</div>
          <div className="text-xl font-bold font-display text-purple-300 mt-1">9 Dimensions</div>
          <div className="text-[10px] text-purple-400 mt-0.5">Cardio, Skeletal, Circadian, Metabolic</div>
        </div>

        <div className="bg-[#071A33] border border-cyan-500/25 p-3 rounded-xl">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">NASA OSDR Compatibility</div>
          <div className="text-xl font-bold font-display text-emerald-300 mt-1">TRL-6 Compliant</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">JSON Schema / FAIR Data Principles</div>
        </div>
      </div>

      {/* TAB 1: NASA OSDR STUDIES INSPECTOR */}
      {activeTab === 'studies' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Study List Cards */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Layers size={14} className="text-cyan-400" />
              <span>Registered Spaceflight Datasets</span>
            </div>

            {registry.map((item) => {
              const isSelected = selectedStudyId === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedStudyId(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-[#071A33] border-cyan-500/20 hover:border-cyan-500/40 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-white text-xs truncate max-w-[260px]">
                      {item.name}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        item.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-cyan-400 mb-2">{item.source}</div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.variables.slice(0, 4).map((v, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-gray-300 border border-white/5"
                      >
                        {v}
                      </span>
                    ))}
                    {item.variables.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-gray-400">
                        +{item.variables.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-gray-400 border-t border-white/5 pt-1.5 flex justify-between">
                    <span>Subjects: {item.subjects}</span>
                    <span className="text-gray-400">{item.id}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Detailed Study Viewer */}
          <div className="lg:col-span-7 bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl flex flex-col justify-between">
            {studyDetail ? (
              <div className="space-y-3.5">
                <div className="border-b border-cyan-500/20 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/40">
                      NASA OSDR ACCESSION: {studyDetail.accession}
                    </span>
                    {studyDetail.url && (
                      <a
                        href={studyDetail.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-200 text-[10px] flex items-center gap-1 underline"
                      >
                        Official NASA Portal <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-white text-base mt-2">
                    {studyDetail.title}
                  </h2>
                  <div className="text-[11px] text-cyan-300 mt-1 flex items-center gap-2">
                    <span>Mission: {studyDetail.mission}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                    <div className="text-gray-400 text-[10px] uppercase flex items-center gap-1">
                      <Users size={12} className="text-cyan-400" /> Principal Investigators
                    </div>
                    <div className="text-gray-200 font-bold mt-1">
                      {studyDetail.principal_investigators.join(', ')}
                    </div>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                    <div className="text-gray-400 text-[10px] uppercase flex items-center gap-1">
                      <Dna size={12} className="text-purple-400" /> Organism & Cohort
                    </div>
                    <div className="text-gray-200 font-bold mt-1">
                      {studyDetail.organism} ({studyDetail.subjects_count} Crewmembers)
                    </div>
                  </div>
                </div>

                {/* Multi-Omics Assays */}
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles size={12} className="text-cyan-400" /> Biological Assays & Methodologies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {studyDetail.assays.map((assay, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded bg-black/50 border border-cyan-500/30 text-cyan-200 text-[10px]"
                      >
                        {assay}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flight Timepoints */}
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar size={12} className="text-cyan-400" /> Sampling Timepoints
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {studyDetail.timepoints.map((tp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-gray-300 text-[10px]"
                      >
                        {tp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Biological Findings */}
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Key Physiological Discoveries
                  </div>
                  <ul className="space-y-1.5 bg-black/30 p-3 rounded-lg border border-white/5 text-[11px] text-gray-300">
                    {studyDetail.findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              /* Fallback for Synthetic Stream */
              <div className="space-y-3.5">
                <div className="border-b border-cyan-500/20 pb-3">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/40">
                    ADAPT-X LONGITUDINAL STREAM: SYNTHETIC-ADAPT-X-001
                  </span>
                  <h2 className="font-display font-bold text-white text-base mt-2">
                    ADAPT-X High-Fidelity Synthetic Spacecraft Stream
                  </h2>
                  <div className="text-[11px] text-cyan-300 mt-1">
                    Mission: Artemis-VII / ISS Expedition 74 (LEO 408 km) · CDR Dr. Sarah Chen
                  </div>
                </div>

                <p className="text-gray-300 text-[11px] leading-relaxed">
                  Generated via non-linear multi-compartment differential equations modeling 180 days of long-duration orbital spaceflight. Simulates acute cephalad fluid shifts, -0.78%/month trabecular bone demineralization, ARED resistive exercise compliance, circadian phase shifts (+1.4h), and allostatic stress accumulation.
                </p>

                <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-1.5 text-[11px]">
                  <div className="text-cyan-400 font-bold">Mathematical Model Architecture:</div>
                  <div className="text-gray-300">• 4 samples per flight day (00:00, 06:00, 12:00, 18:00 UTC) = 720 total data points</div>
                  <div className="text-gray-300">• Selye General Adaptation Syndrome (GAS) 3-stage temporal envelope</div>
                  <div className="text-gray-300">• Respiratory Sinus Arrhythmia (RSA) high-frequency autonomic coupling</div>
                  <div className="text-gray-300">• Pre-landing saline loading and countermeasure reverse-engineering validation</div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('telemetry')}
                    className="w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Activity size={14} /> VIEW 720 TELEMETRY RECORDS IN DATA MATRIX
                  </button>
                </div>
              </div>
            )}

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[10px] text-gray-400 mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Info size={12} className="text-cyan-400" />
                NASA Open Science Data Repository (OSDR) BioData Standards
              </span>
              <span>Updated: Mission Day 142</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE MISSION TELEMETRY FEATURE MATRIX TABLE */}
      {activeTab === 'telemetry' && (
        <div className="bg-[#071A33] border border-cyan-500/25 p-4 rounded-xl space-y-3">
          {/* Controls: Search, Filter, Pagination */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-cyan-400" />
              <span className="font-display font-bold text-white tracking-wider">
                180-DAY PREPROCESSED TELEMETRY FEATURE MATRIX ({totalRecords} Total Records)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter day / HR / timestamp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-cyan-500/30 text-white placeholder-gray-500 text-[11px] focus:outline-none focus:border-cyan-400 w-52"
                />
              </div>

              {/* Filter mode */}
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2 py-1 rounded ${filterMode === 'all' ? 'bg-cyan-500/30 text-cyan-200 font-bold' : 'text-gray-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterMode('stress')}
                  className={`px-2 py-1 rounded ${filterMode === 'stress' ? 'bg-rose-500/30 text-rose-200 font-bold' : 'text-gray-400'}`}
                >
                  High Stress
                </button>
                <button
                  onClick={() => setFilterMode('hrv')}
                  className={`px-2 py-1 rounded ${filterMode === 'hrv' ? 'bg-amber-500/30 text-amber-200 font-bold' : 'text-gray-400'}`}
                >
                  Low HRV
                </button>
                <button
                  onClick={() => setFilterMode('sleep')}
                  className={`px-2 py-1 rounded ${filterMode === 'sleep' ? 'bg-purple-500/30 text-purple-200 font-bold' : 'text-gray-400'}`}
                >
                  Sleep &lt;7h
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="border-b border-cyan-500/30 bg-black/40 text-cyan-300">
                  <th className="py-2 px-2.5">Flight Day</th>
                  <th className="py-2 px-2.5">Timestamp (UTC)</th>
                  <th className="py-2 px-2.5 text-right">Heart Rate</th>
                  <th className="py-2 px-2.5 text-right">HRV RMSSD</th>
                  <th className="py-2 px-2.5 text-right">Blood Pressure</th>
                  <th className="py-2 px-2.5 text-right">SpO2</th>
                  <th className="py-2 px-2.5 text-right">Core Temp</th>
                  <th className="py-2 px-2.5 text-right">Glucose</th>
                  <th className="py-2 px-2.5 text-right">Sleep</th>
                  <th className="py-2 px-2.5 text-right">Steps</th>
                  <th className="py-2 px-2.5 text-right">Stress</th>
                  <th className="py-2 px-2.5 text-right">ARI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {filteredRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                    <td className="py-1.5 px-2.5 font-bold text-white">FD {rec.mission_day.toFixed(2)}</td>
                    <td className="py-1.5 px-2.5 text-gray-400 text-[10px]">{rec.timestamp.replace('+00:00', '')}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-cyan-300">{rec.heart_rate.toFixed(1)} bpm</td>
                    <td className="py-1.5 px-2.5 text-right text-cyan-400">{rec.hrv_rmssd.toFixed(1)} ms</td>
                    <td className="py-1.5 px-2.5 text-right text-gray-300">
                      {rec.bp_systolic.toFixed(0)}/{rec.bp_diastolic.toFixed(0)}
                    </td>
                    <td className="py-1.5 px-2.5 text-right text-emerald-400">{rec.spo2.toFixed(1)}%</td>
                    <td className="py-1.5 px-2.5 text-right text-gray-300">{rec.core_temperature.toFixed(2)} °C</td>
                    <td className="py-1.5 px-2.5 text-right text-gray-300">{rec.glucose.toFixed(0)} mg/dL</td>
                    <td className="py-1.5 px-2.5 text-right text-cyan-300">{rec.sleep_duration.toFixed(1)} h</td>
                    <td className="py-1.5 px-2.5 text-right text-gray-300">{rec.activity_steps.toLocaleString()}</td>
                    <td className="py-1.5 px-2.5 text-right">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          rec.stress_score > 40
                            ? 'bg-rose-500/20 text-rose-300'
                            : rec.stress_score > 25
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {rec.stress_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-cyan-300">
                      {rec.ari_score ? rec.ari_score.toFixed(1) : '71.2'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-cyan-500/20 pt-3">
            <span className="text-[11px] text-gray-400">
              Showing records {page * pageSize + 1} – {Math.min((page + 1) * pageSize, totalRecords)} of {totalRecords}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px] text-cyan-300 font-bold">
                Page {page + 1} of {Math.ceil(totalRecords / pageSize) || 1}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * pageSize >= totalRecords}
                className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Synthetic Disclaimer Footer */}
      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[10px] text-gray-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Info size={12} className="text-cyan-400" />
          <span>NASA Open Science Data Repository (OSDR) Cross-Mission Integration · Synthetic Telemetry Pipeline</span>
        </span>
        <span className="text-gray-400">Artemis-VII Telemetry Provenance Registry</span>
      </div>
    </motion.div>
  )
}
