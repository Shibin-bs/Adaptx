import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RotateCcw,
  Layers,
  Activity,
  AlertTriangle,
  Shield,
  X,
  Compass,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'

// Clinical telemetry for selectable anatomical structures
export interface AnatomicalTelemetry {
  key: string
  name: string
  system: string
  cameraTarget: [number, number, number]
  cameraDistance: number
  metrics: {
    label: string
    current: string
    baseline: string
    unit: string
    status: 'NOMINAL' | 'ADAPTED' | 'ELEVATED' | 'WARNING'
    trend: 'stable' | 'increasing' | 'decreasing'
  }[]
  microgravityRisks: string[]
  countermeasures: string[]
  biomarkerSummary: string
  softwareClassification: string
}

export const ANATOMICAL_TELEMETRY: Record<string, AnatomicalTelemetry> = {
  brain: {
    key: 'brain',
    name: 'Cerebrum & Central Nervous System',
    system: 'Neurological / Cognitive System',
    cameraTarget: [0, 0.75, 0],
    cameraDistance: 0.85,
    metrics: [
      { label: 'Cognitive Model Score', current: '94.2', baseline: '96.0', unit: '%', status: 'NOMINAL', trend: 'stable' },
      { label: 'Sleep Quality', current: '7.2', baseline: '7.5', unit: 'hrs', status: 'NOMINAL', trend: 'stable' },
      { label: 'Allostatic Stress', current: '34', baseline: '20', unit: '/100', status: 'NOMINAL', trend: 'decreasing' },
      { label: 'Estimated ICP', current: '11.4', baseline: '10.0', unit: 'mmHg eq', status: 'NOMINAL', trend: 'stable' },
    ],
    microgravityRisks: [
      'Cephalad fluid redistribution altering intraocular & intracranial pressure balance',
      'Spaceflight-Associated Neuro-ocular Syndrome (SANS) optic disc edema risk',
      'Circadian rhythm desynchronization across 16 daily orbital sunsets',
    ],
    countermeasures: [
      'OCT retinal nerve fiber layer scanning bi-weekly',
      'Controlled blue-depleted light entrainment before sleep periods',
      'Melatonin 0.5mg timed dosing protocol',
    ],
    biomarkerSummary: 'Active vestibular adaptation completed. Visual acuity and optic disc parameters stable within NASA flight rules.',
    softwareClassification: 'NOMINAL_ADAPTED',
  },
  heart: {
    key: 'heart',
    name: 'Cardiovascular System (Myocardium)',
    system: 'Circulatory / Hemodynamics',
    cameraTarget: [0.02, 0.40, 0.05],
    cameraDistance: 0.75,
    metrics: [
      { label: 'Resting Heart Rate', current: '72', baseline: '65', unit: 'BPM', status: 'NOMINAL', trend: 'stable' },
      { label: 'HRV (RMSSD)', current: '42', baseline: '48', unit: 'ms', status: 'ADAPTED', trend: 'decreasing' },
      { label: 'Stroke Volume', current: '68', baseline: '75', unit: 'mL', status: 'NOMINAL', trend: 'stable' },
      { label: 'Cardiac Output', current: '5.1', baseline: '5.2', unit: 'L/min', status: 'NOMINAL', trend: 'stable' },
    ],
    microgravityRisks: [
      'Orthostatic intolerance upon gravitational transition due to altered baroreflex responsiveness',
      'Cephalad blood volume shift causing facial edema and lower limb volume decrease',
      'Mild myocardial deconditioning blunted by vigorous daily aerobic countermeasure',
    ],
    countermeasures: [
      'Daily 30-min high-intensity interval training on T2 treadmill with harness loading',
      'Lower Body Negative Pressure (LBNP) reconditioning starting Mission Day 160',
      'Oral fluid and electrolyte loading protocol (1.0 L isotonic saline) pre-landing',
    ],
    biomarkerSummary: 'HRV slightly reduced (42 ms) reflecting sympathetic shift to high mission workload. Hemodynamic compensation nominal.',
    softwareClassification: 'ACTIVE_ADAPTATION',
  },
  lung_l: {
    key: 'lung_l',
    name: 'Respiratory System (Pulmonary Parenchyma)',
    system: 'Pulmonary / Gas Exchange',
    cameraTarget: [0.07, 0.42, 0.03],
    cameraDistance: 0.85,
    metrics: [
      { label: 'Oxygen Saturation (SpO₂)', current: '98.4', baseline: '98.0', unit: '%', status: 'NOMINAL', trend: 'stable' },
      { label: 'Respiration Rate', current: '14', baseline: '14', unit: 'br/min', status: 'NOMINAL', trend: 'stable' },
      { label: 'Arterial pO₂ Equiv', current: '95', baseline: '96', unit: 'mmHg', status: 'NOMINAL', trend: 'stable' },
      { label: 'Dead Space Fraction', current: '0.28', baseline: '0.30', unit: 'ratio', status: 'NOMINAL', trend: 'stable' },
    ],
    microgravityRisks: [
      'Altered ventilation-perfusion uniformity without hydrostatic gravity gradient',
      'Increased thoracic blood volume slightly reducing functional residual capacity',
    ],
    countermeasures: [
      'Cabin CO₂ regulated below 0.4% via ECLSS Amine beds',
      'Daily spirometry testing during ARED exercise sessions',
    ],
    biomarkerSummary: 'Gas exchange efficiency nominal. No signs of pulmonary edema or microgravity compliance decrease.',
    softwareClassification: 'NOMINAL_BASELINE',
  },
  brachial: {
    key: 'brachial',
    name: 'Brachial Vasculature & Arterial Tone',
    system: 'Vascular / Hemodynamic',
    cameraTarget: [0.26, 0.35, 0.0],
    cameraDistance: 0.70,
    metrics: [
      { label: 'Blood Pressure', current: '120/80', baseline: '118/78', unit: 'mmHg', status: 'NOMINAL', trend: 'stable' },
      { label: 'Mean Arterial Pressure', current: '93', baseline: '91', unit: 'mmHg', status: 'NOMINAL', trend: 'stable' },
      { label: 'Pulse Wave Velocity', current: '6.8', baseline: '6.5', unit: 'm/s', status: 'NOMINAL', trend: 'stable' },
      { label: 'Capillary Refill', current: '1.2', baseline: '1.1', unit: 'sec', status: 'NOMINAL', trend: 'stable' },
    ],
    microgravityRisks: [
      'Cephalad fluid shift causing arterial remodeling in upper extremities',
      'Reduced venous return from lower extremities during quiescent rest',
    ],
    countermeasures: [
      'Periodic Braslet occlusive thigh cuffs for venous pooling simulation',
      'Upper-body ergometer isometric endurance protocol',
    ],
    biomarkerSummary: 'Brachial arterial compliance nominal. Pulse wave velocity matches healthy astronaut profile.',
    softwareClassification: 'NOMINAL_BASELINE',
  },
  liver: {
    key: 'liver',
    name: 'Hepatic & Metabolic System',
    system: 'Metabolic / Endocrine',
    cameraTarget: [-0.02, 0.20, 0.04],
    cameraDistance: 0.75,
    metrics: [
      { label: 'Fasting Blood Glucose', current: '92', baseline: '90', unit: 'mg/dL', status: 'NOMINAL', trend: 'stable' },
      { label: 'Daily Metabolic Burn', current: '2,450', baseline: '2,400', unit: 'kcal', status: 'NOMINAL', trend: 'stable' },
      { label: 'Insulin Sensitivity Index', current: '1.02', baseline: '1.00', unit: 'ratio', status: 'NOMINAL', trend: 'stable' },
      { label: 'ALT / AST Enzymes', current: '24 / 22', baseline: '22 / 20', unit: 'U/L', status: 'NOMINAL', trend: 'stable' },
    ],
    microgravityRisks: [
      'Subtle hepatic lipid metabolism alterations during long spaceflight missions',
      'Insulin resistance shifts induced by reduced non-exercise physical movement',
    ],
    countermeasures: [
      'Caloric intake calibrated to 2,800 kcal with balanced macronutrient ratio',
      'Vitamin D3 (2,000 IU/day) and Omega-3 fatty acid supplementation',
    ],
    biomarkerSummary: 'Glycemic control and liver enzyme markers within flight nominal ranges.',
    softwareClassification: 'NOMINAL_BASELINE',
  },
  kidney_l: {
    key: 'kidney_l',
    name: 'Renal System & Electrolyte Balance',
    system: 'Renal / Osmoregulation',
    cameraTarget: [0.046, 0.259, -0.01],
    cameraDistance: 0.75,
    metrics: [
      { label: 'eGFR Filtration Rate', current: '108', baseline: '112', unit: 'mL/min', status: 'NOMINAL', trend: 'stable' },
      { label: 'Urinary Calcium Excretion', current: '290', baseline: '180', unit: 'mg/24h', status: 'ELEVATED', trend: 'stable' },
      { label: 'Serum Osmolality', current: '292', baseline: '290', unit: 'mOsm/kg', status: 'NOMINAL', trend: 'stable' },
      { label: 'Hydration Biomarker', current: '1.018', baseline: '1.015', unit: 'SG', status: 'NOMINAL', trend: 'stable' },
    ],
    microgravityRisks: [
      'Hypercalciuria secondary to bone demineralization, elevating nephrolithiasis (kidney stone) risk',
      'Fluid volume contraction from altered thirst mechanism and anti-diuretic hormone response',
    ],
    countermeasures: [
      'Mandatory daily water consumption >= 2.5 L monitored via spacecraft telemetry',
      'Potassium citrate 20 mEq/day oral administration to inhibit calcium phosphate crystallization',
    ],
    biomarkerSummary: 'Renal clearance nominal. Hypercalciuria well-managed via hydration and citrate protocol.',
    softwareClassification: 'ACTIVE_ADAPTATION',
  },
  femur_l: {
    key: 'femur_l',
    name: 'Musculoskeletal (Femur & Bone Density)',
    system: 'Skeletal / Mineral Metabolism',
    cameraTarget: [0.105, -0.15, 0.02],
    cameraDistance: 0.85,
    metrics: [
      { label: 'Bone Mineral Density Rate', current: '-0.78', baseline: '0.0', unit: '%/mo', status: 'ADAPTED', trend: 'stable' },
      { label: 'Serum Osteocalcin', current: '18.4', baseline: '22.0', unit: 'ng/mL', status: 'ADAPTED', trend: 'stable' },
      { label: 'NTx Telopeptide', current: '54', baseline: '38', unit: 'nmol/mmol', status: 'ELEVATED', trend: 'stable' },
      { label: 'ARED Force Delivery', current: '620', baseline: '600', unit: 'N eq', status: 'NOMINAL', trend: 'stable' },
    ],
    microgravityRisks: [
      'Trabecular and cortical bone resorption predominantly in weight-bearing lower skeleton',
      'Increased bone fracture risk upon planetary re-entry if countermeasures lapse',
    ],
    countermeasures: [
      'ARED heavy resistive squats & deadlifts: 6 sets daily with progressive overload',
      'Bisphosphonate anti-resorptive prophylaxis administered pre-flight',
    ],
    biomarkerSummary: 'Bone resorption blunted to -0.78%/month (within NASA acceptable limit < 1.0%/mo). Good ARED compliance.',
    softwareClassification: 'ACTIVE_ADAPTATION',
  },
  activity: {
    key: 'activity',
    name: 'Muscular Locomotor & Kinetic System',
    system: 'Muscular / Locomotion',
    cameraTarget: [-0.09, -0.52, 0.02],
    cameraDistance: 0.80,
    metrics: [
      { label: 'Daily Kinetic Equivalent', current: '8,200', baseline: '9,000', unit: 'steps eq', status: 'NOMINAL', trend: 'stable' },
      { label: 'T2 Treadmill Running', current: '30', baseline: '30', unit: 'min/day', status: 'NOMINAL', trend: 'stable' },
      { label: 'ARED Protocol Adherence', current: '100', baseline: '100', unit: '%', status: 'NOMINAL', trend: 'stable' },
      { label: 'Calf Muscle Cross-Section', current: '94.2', baseline: '100', unit: '% baseline', status: 'ADAPTED', trend: 'stable' },
    ],
    microgravityRisks: [
      'Slow-twitch postural muscle fiber atrophy from lack of gravity ground reaction forces',
      'Capillary density reduction in soleus and gastrocnemius muscle beds',
    ],
    countermeasures: [
      'Daily 2.5 hours prescribed flight exercise schedule (ARED + T2 + Cycle Ergometer)',
      'High-protein nutrition (1.5g/kg body weight) to stimulate muscle protein synthesis',
    ],
    biomarkerSummary: 'Muscular performance nominal with 100% countermeasure adherence.',
    softwareClassification: 'NOMINAL_BASELINE',
  },
}

// 7 Floating Medical Markers with exact 3D coordinates anchored to the body
interface MarkerDef {
  key: string
  label: string
  sublabel: string
  value: string
  unit: string
  baseline: string
  status: 'NOMINAL' | 'ADAPTED' | 'ELEVATED'
  anchor: [number, number, number]
  target: [number, number, number]
  elbow: [number, number, number]
  points: number[]
}

const FLOATING_MARKERS: MarkerDef[] = [
  {
    key: 'brain',
    label: 'BRAIN HEALTH',
    sublabel: 'COGNITIVE ASSESSMENT',
    value: '94%',
    unit: 'SCORE',
    baseline: 'SLEEP: 7.2h · STRESS: 34',
    status: 'NOMINAL',
    anchor: [0.0, 0.75, 0.02],
    elbow: [-0.22, 0.76, 0.01],
    target: [-0.44, 0.76, 0.0],
    points: [40, 55, 60, 75, 70, 85, 94],
  },
  {
    key: 'heart',
    label: 'HEART RATE & HRV',
    sublabel: 'CARDIOVASCULAR',
    value: '72',
    unit: 'BPM',
    baseline: 'BASE: 65 BPM · HRV: 42ms',
    status: 'NOMINAL',
    anchor: [0.02, 0.40, 0.04],
    elbow: [-0.22, 0.44, 0.02],
    target: [-0.46, 0.44, 0.0],
    points: [65, 68, 74, 70, 75, 71, 72],
  },
  {
    key: 'lung_l',
    label: 'BLOOD OXYGEN (SpO₂)',
    sublabel: 'PULMONARY GAS EXCHANGE',
    value: '98.4%',
    unit: 'SpO₂',
    baseline: 'BASE: 98.0% · pO₂: 95 mmHg',
    status: 'NOMINAL',
    anchor: [0.07, 0.42, 0.03],
    elbow: [0.24, 0.58, 0.02],
    target: [0.46, 0.58, 0.0],
    points: [98, 98, 97, 98, 99, 98, 98],
  },
  {
    key: 'brachial',
    label: 'BLOOD PRESSURE',
    sublabel: 'BRACHIAL HEMODYNAMICS',
    value: '120/80',
    unit: 'mmHg',
    baseline: 'BASE: 118/78 · MAP: 93',
    status: 'NOMINAL',
    anchor: [0.25, 0.35, 0.0],
    elbow: [0.35, 0.35, 0.01],
    target: [0.48, 0.35, 0.0],
    points: [116, 118, 122, 119, 120, 118, 120],
  },
  {
    key: 'liver',
    label: 'GLUCOSE & METABOLISM',
    sublabel: 'ENDOCRINE BALANCE',
    value: '92',
    unit: 'mg/dL',
    baseline: 'BASE: 90 · 2,450 kcal',
    status: 'NOMINAL',
    anchor: [-0.02, 0.20, 0.04],
    elbow: [-0.22, 0.15, 0.02],
    target: [-0.46, 0.15, 0.0],
    points: [88, 92, 94, 90, 91, 93, 92],
  },
  {
    key: 'femur_l',
    label: 'BONE MINERAL DENSITY',
    sublabel: 'FEMUR DEXA REMODELING',
    value: '-0.78%',
    unit: '/mo',
    baseline: 'EARTH: 0.0% · ARED COMPLIANT',
    status: 'ADAPTED',
    anchor: [0.105, -0.15, 0.02],
    elbow: [0.26, -0.15, 0.01],
    target: [0.46, -0.15, 0.0],
    points: [-0.75, -0.76, -0.79, -0.78, -0.77, -0.79, -0.78],
  },
  {
    key: 'activity',
    label: 'PHYSICAL ACTIVITY & T2',
    sublabel: 'KINETIC COUNTERMEASURE',
    value: '8,200',
    unit: 'steps eq',
    baseline: 'BASE: 9,000 · ARED: 100%',
    status: 'NOMINAL',
    anchor: [-0.09, -0.52, 0.02],
    elbow: [-0.22, -0.52, 0.01],
    target: [-0.44, -0.52, 0.0],
    points: [7800, 8100, 8400, 8000, 8300, 8100, 8200],
  },
]

// Miniature SVG Sparkline component
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 64
  const height = 18

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
          r="2"
          fill={color}
        />
      )}
    </svg>
  )
}

// 3D Scene containing the anatomical GLB model with MeshoptDecoder
function AnatomicalScene({
  sex,
  layers,
  selectedKey,
  onSelectKey,
  setLoadingState,
  setErrorState,
}: {
  sex: 'female' | 'male'
  layers: { skin: boolean; organs: boolean; skeleton: boolean; muscles: boolean; vessels: boolean }
  selectedKey: string | null
  onSelectKey: (key: string) => void
  setLoadingState: (loading: boolean) => void
  setErrorState: (err: string | null) => void
}) {
  const [modelScene, setModelScene] = useState<THREE.Group | null>(null)

  useEffect(() => {
    let isCancelled = false
    setLoadingState(true)
    setErrorState(null)

    const modelPath = sex === 'female' ? '/models/anatomy-female.glb' : '/models/anatomy-male.glb'

    MeshoptDecoder.ready
      .then(() => {
        if (isCancelled) return
        const loader = new GLTFLoader()
        loader.setMeshoptDecoder(MeshoptDecoder)

        loader.load(
          modelPath,
          (gltf) => {
            if (isCancelled) return
            const scene = gltf.scene

            // Space medical holographic materials
            const skinMat = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#06b6d4'),
              roughness: 0.15,
              metalness: 0.1,
              transparent: true,
              opacity: 0.20,
              depthWrite: false,
              side: THREE.DoubleSide,
            })

            const skeletonMat = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#dbeafe'),
              roughness: 0.35,
              metalness: 0.1,
              emissive: new THREE.Color('#0369a1'),
              emissiveIntensity: 0.25,
            })

            const muscleMat = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#2563eb'),
              roughness: 0.45,
              metalness: 0.05,
              transparent: true,
              opacity: 0.85,
              emissive: new THREE.Color('#1d4ed8'),
              emissiveIntensity: 0.3,
            })

            scene.traverse((obj) => {
              if (obj instanceof THREE.Mesh) {
                const name = obj.name.toLowerCase()

                if (name.includes('skin')) {
                  obj.material = skinMat
                  obj.userData.system = 'skin'
                } else if (
                  name.includes('spine') ||
                  name.includes('skull') ||
                  name.includes('ribs') ||
                  name.includes('femur') ||
                  name.includes('clavicle') ||
                  name.includes('tibia') ||
                  name.includes('pelvis') ||
                  name.includes('sternum') ||
                  name.includes('bone')
                ) {
                  obj.material = skeletonMat.clone()
                  obj.userData.system = 'skeleton'
                } else if (name.includes('muscle')) {
                  obj.material = muscleMat.clone()
                  obj.userData.system = 'muscles'
                } else if (name.includes('heart')) {
                  obj.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#ef4444'),
                    emissive: new THREE.Color('#ef4444'),
                    emissiveIntensity: 0.8,
                    roughness: 0.25,
                  })
                  obj.userData.system = 'organs'
                } else if (name.includes('brain')) {
                  obj.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#c084fc'),
                    emissive: new THREE.Color('#9333ea'),
                    emissiveIntensity: 0.7,
                    roughness: 0.25,
                  })
                  obj.userData.system = 'organs'
                } else if (name.includes('lung')) {
                  obj.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#38bdf8'),
                    emissive: new THREE.Color('#0284c7'),
                    emissiveIntensity: 0.6,
                    roughness: 0.3,
                  })
                  obj.userData.system = 'organs'
                } else if (name.includes('liver')) {
                  obj.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#fbbf24'),
                    emissive: new THREE.Color('#d97706'),
                    emissiveIntensity: 0.6,
                    roughness: 0.3,
                  })
                  obj.userData.system = 'organs'
                } else if (name.includes('kidney')) {
                  obj.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#2dd4bf'),
                    emissive: new THREE.Color('#0d9488'),
                    emissiveIntensity: 0.6,
                    roughness: 0.3,
                  })
                  obj.userData.system = 'organs'
                } else {
                  obj.material = skeletonMat.clone()
                  obj.userData.system = 'skeleton'
                }
              }
            })

            // Center model at [0, 0, 0]: height is 1.62m, midpoint is Y = 0.81m
            scene.position.set(0, -0.81, 0)
            setModelScene(scene)
            setLoadingState(false)
          },
          undefined,
          (err) => {
            if (isCancelled) return
            console.error('Failed to load anatomical GLB model:', err)
            setErrorState('Failed to load Open Anatomy 3D asset.')
            setLoadingState(false)
          }
        )
      })
      .catch((err) => {
        if (isCancelled) return
        setErrorState('Meshopt decoder failed: ' + err.message)
        setLoadingState(false)
      })

    return () => {
      isCancelled = true
    }
  }, [sex, setLoadingState, setErrorState])

  // Apply layer visibility
  useEffect(() => {
    if (!modelScene) return
    modelScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const sys = obj.userData.system as 'skin' | 'skeleton' | 'muscles' | 'organs'
        if (sys && layers[sys] !== undefined) {
          obj.visible = layers[sys]
        }
      }
    })
  }, [layers, modelScene])

  // Highlight selected organ
  useEffect(() => {
    if (!modelScene) return
    modelScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const name = obj.name.toLowerCase()
        const isMatch =
          selectedKey &&
          (name.includes(selectedKey) ||
            (selectedKey === 'lung_l' && (name.includes('lung_l') || name.includes('lung_r'))) ||
            (selectedKey === 'kidney_l' && (name.includes('kidney_l') || name.includes('kidney_r'))) ||
            (selectedKey === 'brachial' && name.includes('arm')) ||
            (selectedKey === 'femur_l' && name.includes('femur')) ||
            (selectedKey === 'activity' && (name.includes('muscle') || name.includes('tibia'))))

        if (isMatch) {
          if (obj.material && 'emissive' in obj.material) {
            ;(obj.material as THREE.MeshStandardMaterial).emissive.set('#06b6d4')
            ;(obj.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0
          }
        }
      }
    })
  }, [selectedKey, modelScene])

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (e.object && e.object.name) {
      const meshName = e.object.name.toLowerCase()
      if (meshName.includes('brain')) onSelectKey('brain')
      else if (meshName.includes('heart')) onSelectKey('heart')
      else if (meshName.includes('lung')) onSelectKey('lung_l')
      else if (meshName.includes('liver')) onSelectKey('liver')
      else if (meshName.includes('kidney')) onSelectKey('kidney_l')
      else if (meshName.includes('femur') || meshName.includes('bone')) onSelectKey('femur_l')
      else if (meshName.includes('muscle')) onSelectKey('activity')
    }
  }

  return modelScene ? <primitive object={modelScene} onClick={handleClick} /> : null
}

// Rotating group that holds the anatomical model and floating 3D markers
function RotatingAnatomyGroup({
  sex,
  layers,
  selectedKey,
  onSelectKey,
  autoRotate,
  isLoading,
  setLoadingState,
  setErrorState,
}: {
  sex: 'female' | 'male'
  layers: { skin: boolean; organs: boolean; skeleton: boolean; muscles: boolean; vessels: boolean }
  selectedKey: string | null
  onSelectKey: (key: string) => void
  autoRotate: boolean
  isLoading: boolean
  setLoadingState: (loading: boolean) => void
  setErrorState: (err: string | null) => void
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current && !selectedKey) {
      groupRef.current.rotation.y += delta * 0.22
    }
  })

  return (
    <group ref={groupRef}>
      {/* The 3D Anatomical Human Model */}
      <AnatomicalScene
        sex={sex}
        layers={layers}
        selectedKey={selectedKey}
        onSelectKey={onSelectKey}
        setLoadingState={setLoadingState}
        setErrorState={setErrorState}
      />

      {/* FLOATING ANATOMICAL MARKERS WITH 3D CONNECTOR LINES (Shown in full overview mode) */}
      {!isLoading &&
        !selectedKey &&
        FLOATING_MARKERS.map((marker) => {
          const isSelected = selectedKey === marker.key
          const isLeft = marker.target[0] < 0

          return (
            <group key={marker.key}>
              {/* 1. Glowing Anatomical Beacon Dot on the organ/mesh */}
              <mesh position={marker.anchor}>
                <sphereGeometry args={[0.014, 16, 16]} />
                <meshBasicMaterial color="#06b6d4" />
              </mesh>

              {/* Concentric pulsing beacon ring */}
              <mesh position={marker.anchor} rotation={[-Math.PI / 4, 0, 0]}>
                <ringGeometry args={[0.018, 0.026, 24]} />
                <meshBasicMaterial color="#67e8f9" transparent opacity={0.65} side={THREE.DoubleSide} />
              </mesh>

              {/* 2. Thin Glowing 3D Connector Line from anchor to target */}
              <Line
                points={[marker.anchor, marker.elbow, marker.target]}
                color={isSelected ? '#38bdf8' : '#06b6d4'}
                lineWidth={1.5}
                transparent
                opacity={isSelected ? 0.95 : 0.75}
              />

              {/* 3. Floating Medical Information HUD Card at target */}
              <Html
                position={marker.target}
                distanceFactor={2.4}
                style={{ pointerEvents: 'auto', userSelect: 'none' }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectKey(marker.key)
                  }}
                  className={`cursor-pointer transition-all duration-200 backdrop-blur-md rounded-lg p-2 font-mono text-xs shadow-[0_8px_32px_rgba(0,0,0,0.85)] border w-44 ${
                    isLeft ? '-translate-x-full pr-2.5' : 'pl-2.5'
                  } ${
                    isSelected
                      ? 'bg-[#071A33]/95 border-cyan-300 ring-2 ring-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                      : 'bg-[#071A33]/85 border-cyan-500/40 hover:border-cyan-300 hover:scale-102 hover:bg-[#071A33]/95'
                  }`}
                >
                  {/* Header with region tag */}
                  <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                        {marker.label}
                      </span>
                    </div>
                    <span
                      className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                        marker.status === 'NOMINAL'
                          ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {marker.status}
                    </span>
                  </div>

                  {/* Measurement Readout & Mini Sparkline */}
                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className="font-display font-black text-white text-base tracking-wide text-glow-cyan">
                        {marker.value}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1 font-mono">{marker.unit}</span>
                    </div>
                    <MiniSparkline
                      data={marker.points}
                      color={marker.status === 'NOMINAL' ? '#06b6d4' : '#f59e0b'}
                    />
                  </div>

                  {/* Baseline Comparison */}
                  <div className="text-[9px] text-gray-400 mt-1 flex items-center justify-between font-mono pt-1 border-t border-white/5">
                    <span className="truncate">{marker.baseline}</span>
                    <span className="text-cyan-400 font-bold ml-1">›</span>
                  </div>
                </div>
              </Html>
            </group>
          )
        })}
    </group>
  )
}

// Camera controller that smoothly transitions to selected anatomical region
function CameraController({
  selectedKey,
}: {
  selectedKey: string | null
}) {
  const { camera } = useThree()
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 2.3))

  useEffect(() => {
    if (selectedKey && ANATOMICAL_TELEMETRY[selectedKey]) {
      const telem = ANATOMICAL_TELEMETRY[selectedKey]
      targetLookAt.current.set(...telem.cameraTarget)
      targetCamPos.current.set(
        telem.cameraTarget[0],
        telem.cameraTarget[1],
        telem.cameraTarget[2] + telem.cameraDistance
      )
    } else {
      targetLookAt.current.set(0, 0, 0)
      targetCamPos.current.set(0, 0, 2.3)
    }
  }, [selectedKey])

  useFrame((_, delta) => {
    camera.position.lerp(targetCamPos.current, delta * 3)
    camera.lookAt(targetLookAt.current)
  })

  return null
}

export default function HumanHologram() {
  const [sex, setSex] = useState<'female' | 'male'>('female')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [layers, setLayers] = useState({
    skin: true,
    organs: true,
    skeleton: true,
    muscles: true,
    vessels: true,
  })

  const toggleLayer = (layerName: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }))
  }

  const handleSelectKey = useCallback((key: string) => {
    setSelectedKey((prev) => (prev === key ? null : key))
  }, [])

  const activeTelemetry = selectedKey ? ANATOMICAL_TELEMETRY[selectedKey] : null

  return (
    <div className="relative w-full h-full bg-[#020817] flex flex-col select-none overflow-hidden">
      {/* 1. TOP OVERLAY CONTROLS */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="font-display text-xs font-bold text-cyan-300 tracking-wider flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
            <span>3D ANATOMICAL DIGITAL TWIN</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-bio-cyan/20 border border-bio-cyan/40 text-bio-cyan font-bold">
              OPEN ANATOMY 3D · FULL BODY
            </span>
          </div>
        </div>

        {/* Right Action Chips */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Sex toggle */}
          <div className="flex rounded-lg bg-black/60 border border-cyan-500/30 p-0.5 text-xs font-mono backdrop-blur-sm">
            <button
              onClick={() => setSex('female')}
              className={`px-2 py-1 rounded transition-colors ${
                sex === 'female' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              FEMALE
            </button>
            <button
              onClick={() => setSex('male')}
              className={`px-2 py-1 rounded transition-colors ${
                sex === 'male' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              MALE
            </button>
          </div>

          {/* Auto-rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-mono text-xs transition-colors backdrop-blur-sm ${
              autoRotate
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-black/60 border-cyan-500/30 text-gray-400'
            }`}
            title="Toggle 360° Continuous Rotation"
          >
            <RotateCcw size={13} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
            <span className="text-[11px]">{autoRotate ? 'ROTATING' : 'PAUSED'}</span>
          </button>

          {/* Layer visibility toggle button */}
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-mono text-xs transition-colors backdrop-blur-sm ${
              showLayerMenu
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-black/60 border-cyan-500/30 text-gray-300 hover:border-cyan-400'
            }`}
          >
            <Layers size={13} />
            <span className="text-[11px]">LAYERS</span>
          </button>

          {/* Reset camera button */}
          {selectedKey && (
            <button
              onClick={() => setSelectedKey(null)}
              className="px-2.5 py-1.5 rounded-lg border bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30 flex items-center gap-1.5 font-mono text-xs backdrop-blur-sm"
            >
              <X size={13} />
              <span>RESET VIEW</span>
            </button>
          )}
        </div>
      </div>

      {/* LAYER SELECTOR DROPDOWN */}
      <AnimatePresence>
        {showLayerMenu && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-14 right-4 z-30 p-3 rounded-xl bg-[#071A33] border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] w-48 space-y-1.5 text-xs font-mono"
          >
            <div className="text-[10px] text-cyan-400 uppercase tracking-wider pb-1 border-b border-cyan-500/20 flex justify-between items-center">
              <span>Anatomical Layers</span>
              <button onClick={() => setShowLayerMenu(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            {[
              { key: 'skin' as const, label: 'Skin (Translucent)', color: 'text-cyan-300' },
              { key: 'organs' as const, label: 'Internal Organs', color: 'text-red-400' },
              { key: 'skeleton' as const, label: 'Skeleton / Bones', color: 'text-blue-200' },
              { key: 'muscles' as const, label: 'Muscular System', color: 'text-rose-400' },
            ].map(({ key, label, color }) => (
              <label
                key={key}
                className="flex items-center justify-between p-1 rounded hover:bg-cyan-500/10 cursor-pointer text-[11px]"
              >
                <span className={layers[key] ? color : 'text-gray-500 line-through'}>{label}</span>
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={() => toggleLayer(key)}
                  className="rounded border-cyan-500/40 bg-black/60 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN 3D FULL-SCREEN CANVAS */}
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#020817]/85 backdrop-blur-md gap-3">
            <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#06b6d4]" />
            <span className="font-display text-sm font-bold text-cyan-300 tracking-wider">
              INITIALIZING ANATOMICAL DIGITAL TWIN...
            </span>
            <span className="text-xs font-mono text-gray-400">
              Decoding 133 Open Anatomy 3D structures ({sex})
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-red-950/80 backdrop-blur-md gap-2">
            <AlertTriangle size={28} className="text-red-400" />
            <span className="font-display text-sm font-bold text-red-300">
              ANATOMICAL ASSET ERROR
            </span>
            <p className="font-mono text-xs text-gray-300 max-w-md">{errorMessage}</p>
          </div>
        )}

        <Canvas
          camera={{ position: [0, 0, 2.3], fov: 44 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Futuristic Medical Lights */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 3, 3]} intensity={1.6} color="#67e8f9" />
          <directionalLight position={[-2, 1, -2]} intensity={0.9} color="#3b82f6" />
          <pointLight position={[0, 1.2, 1.5]} intensity={1.3} color="#06b6d4" />
          <pointLight position={[0, -1.0, 1.5]} intensity={0.7} color="#1d4ed8" />

          {/* Circular Holographic Scanning Pedestal */}
          <group position={[0, -0.83, 0]}>
            <gridHelper args={[2.8, 18, '#06b6d4', 'rgba(6,182,212,0.15)']} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
              <ringGeometry args={[0.3, 1.2, 48]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} wireframe />
            </mesh>
          </group>

          {/* Rotating Anatomy Group containing Model + Floating Markers */}
          <RotatingAnatomyGroup
            sex={sex}
            layers={layers}
            selectedKey={selectedKey}
            onSelectKey={handleSelectKey}
            autoRotate={autoRotate}
            isLoading={isLoading}
            setLoadingState={setIsLoading}
            setErrorState={setErrorMessage}
          />

          {/* Camera smoothly positions to selected organ or defaults to full-screen view */}
          <CameraController selectedKey={selectedKey} />

          {/* OrbitControls for smooth interactive mouse rotation and zooming */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={0.8}
            maxDistance={3.8}
            dampingFactor={0.06}
            enableDamping
          />
        </Canvas>
      </div>

      {/* 3. QUICK ANATOMICAL REGION SELECTOR (Bottom Left) */}
      <div className="absolute left-4 bottom-4 z-20 flex flex-wrap gap-1.5 max-w-[420px] pointer-events-auto">
        <div className="w-full text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-0.5 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/20">
          <Compass size={11} />
          <span>Select Anatomical Region:</span>
        </div>
        {[
          { key: 'brain', label: 'Brain', icon: '🧠' },
          { key: 'heart', label: 'Heart', icon: '❤️' },
          { key: 'lung_l', label: 'Lungs', icon: '🫁' },
          { key: 'brachial', label: 'Blood Pressure', icon: '🩺' },
          { key: 'liver', label: 'Metabolism', icon: '🩸' },
          { key: 'kidney_l', label: 'Kidneys', icon: '🧬' },
          { key: 'femur_l', label: 'Skeleton & BMD', icon: '🦴' },
          { key: 'activity', label: 'Muscles', icon: '💪' },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => handleSelectKey(key)}
            className={`px-2 py-1 rounded text-[11px] font-mono border transition-all flex items-center gap-1 backdrop-blur-sm ${
              selectedKey === key
                ? 'bg-cyan-500 text-black font-bold border-cyan-300 shadow-[0_0_12px_#06b6d4]'
                : 'bg-black/70 border-cyan-500/30 text-gray-300 hover:border-cyan-400 hover:text-cyan-300'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
        {selectedKey && (
          <button
            onClick={() => setSelectedKey(null)}
            className="px-2 py-1 rounded text-[11px] font-mono bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/30 flex items-center gap-1 backdrop-blur-sm"
          >
            <X size={11} />
            <span>Reset View</span>
          </button>
        )}
      </div>

      {/* 4. DETAILED ANATOMICAL INFORMATION PANEL (RIGHT SLIDE-OVER) */}
      <AnimatePresence>
        {activeTelemetry && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute top-14 right-4 bottom-4 w-96 z-30 bg-[#071A33]/95 backdrop-blur-xl border border-cyan-400/50 rounded-xl p-4 flex flex-col gap-3 overflow-y-auto text-xs font-mono shadow-[0_16px_50px_rgba(0,0,0,0.95)]"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-cyan-500/30">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold block">
                  {activeTelemetry.system}
                </span>
                <h3 className="font-display text-sm font-bold text-white text-glow-cyan">
                  {activeTelemetry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedKey(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Classification */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/60 border border-cyan-500/30">
              <span className="text-[10px] text-gray-400">CLASSIFICATION:</span>
              <span
                className={`text-[10px] font-bold ${
                  activeTelemetry.softwareClassification === 'NOMINAL_BASELINE' ||
                  activeTelemetry.softwareClassification === 'NOMINAL_ADAPTED'
                    ? 'text-bio-cyan text-glow-green'
                    : 'text-warning-amber text-glow-amber'
                }`}
              >
                {activeTelemetry.softwareClassification.replace('_', ' ')}
              </span>
            </div>

            {/* Metrics Comparison */}
            <div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Activity size={11} />
                <span>Telemetry vs Earth Baseline:</span>
              </div>
              <div className="space-y-1.5">
                {activeTelemetry.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="text-gray-300 font-medium">{m.label}</div>
                      <div className="text-[10px] text-gray-500">
                        Earth Base: <span className="text-gray-300 font-mono">{m.baseline} {m.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-display font-bold text-cyan-300">
                        {m.current} <span className="text-[10px] font-mono text-gray-400">{m.unit}</span>
                      </div>
                      <div className="text-[10px] font-mono flex items-center gap-1 justify-end">
                        {m.trend === 'stable' ? (
                          <Minus size={10} className="text-bio-cyan" />
                        ) : m.trend === 'increasing' ? (
                          <TrendingUp size={10} className="text-warning-amber" />
                        ) : (
                          <TrendingDown size={10} className="text-blue-400" />
                        )}
                        <span className={m.status === 'NOMINAL' ? 'text-bio-cyan' : 'text-warning-amber'}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Microgravity Spaceflight Risks */}
            <div>
              <div className="text-[10px] text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertTriangle size={11} />
                <span>Microgravity Physiological Risks:</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                {activeTelemetry.microgravityRisks.map((risk, i) => (
                  <div key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">›</span>
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Countermeasures */}
            <div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Shield size={11} />
                <span>Prescribed Flight Countermeasures:</span>
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                {activeTelemetry.countermeasures.map((cm, i) => (
                  <div key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span>{cm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Biomarker Summary */}
            <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] text-gray-400 leading-relaxed">
              <span className="text-cyan-400 font-bold">CLINICAL SUMMARY: </span>
              {activeTelemetry.biomarkerSummary}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reticle corners & sci-fi scanner overlays */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70 pointer-events-none" />

      {/* Futuristic Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-24 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent scanline" />
      </div>

      {/* Mouse interaction hint */}
      <div className="absolute bottom-2 right-4 pointer-events-none z-10 flex items-center gap-3 text-[10px] font-mono text-gray-400 bg-black/50 px-2 py-0.5 rounded border border-white/5">
        <span>DRAG: ORBIT 360°</span>
        <span>·</span>
        <span>SCROLL: ZOOM</span>
        <span>·</span>
        <span>CLICK ORGAN / MARKER TO INSPECT</span>
      </div>
    </div>
  )
}
