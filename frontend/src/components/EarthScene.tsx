import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface EarthSceneProps {
  phase: 'intro' | 'auth' | 'transition'
  onTransitionComplete?: () => void
}

// Custom Atmospheric Rim Glow Shader
const AtmosphereGlow: React.FC<{ radius: number }> = ({ radius }) => {
  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        color: { value: new THREE.Color(0x00d2ff) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 color;
        void main() {
          vec3 viewDirection = normalize(-vPosition);
          float fresnel = dot(vNormal, viewDirection);
          float intensity = pow(0.7 - fresnel, 2.5);
          intensity = clamp(intensity, 0.0, 1.0);
          gl_FragColor = vec4(color, intensity * 0.9);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    }
  }, [])

  return (
    <mesh>
      <sphereGeometry args={[radius * 1.15, 64, 64]} />
      <shaderMaterial attach="material" {...shaderArgs} />
    </mesh>
  )
}

// Photorealistic Earth Object
const EarthObject: React.FC<{ phase: 'intro' | 'auth' | 'transition' }> = ({ phase }) => {
  const earthRef = useRef<THREE.Group>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const surfaceRef = useRef<THREE.Mesh>(null)

  // Load NASA photorealistic 2048x1024 textures
  const [dayMap, cloudsMap, specularMap, normalMap, lightsMap] = useTexture([
    '/textures/earth/earth_day.jpg',
    '/textures/earth/earth_clouds.png',
    '/textures/earth/earth_specular.jpg',
    '/textures/earth/earth_normal.jpg',
    '/textures/earth/earth_lights.png',
  ])

  // Setup color space & filtering
  useMemo(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace
    cloudsMap.colorSpace = THREE.SRGBColorSpace
    lightsMap.colorSpace = THREE.SRGBColorSpace
  }, [dayMap, cloudsMap, lightsMap])

  const earthRadius = 3.2

  useFrame((_, delta) => {
    if (surfaceRef.current) {
      surfaceRef.current.rotation.y += delta * 0.02
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.028
    }

    if (earthRef.current) {
      // Subtle float oscillation
      if (phase === 'intro') {
        earthRef.current.position.y = -2.1 + Math.sin(Date.now() * 0.0006) * 0.04
      } else if (phase === 'auth') {
        earthRef.current.position.y = -2.5 + Math.sin(Date.now() * 0.0006) * 0.03
      }
    }
  })

  return (
    <group
      ref={earthRef}
      rotation={[0.41, -0.3, 0]} // 23.5 degree axial tilt
      position={[0, -2.1, 0]}
    >
      {/* 1. Base Daytime Surface with Specular and Normal maps */}
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[earthRadius, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Night-side City Lights (additive blend) */}
      <mesh>
        <sphereGeometry args={[earthRadius * 1.001, 64, 64]} />
        <meshBasicMaterial
          map={lightsMap}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Translucent Rotating Clouds Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[earthRadius * 1.015, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Atmospheric Blue Glow Rim */}
      <AtmosphereGlow radius={earthRadius} />

      {/* 5. Orbiting ISS Beacon Silhouette (Tiny blinking beacon in LEO) */}
      <OrbitingSatellite radius={earthRadius * 1.12} />
    </group>
  )
}

// Satellite / Spacecraft Silhouette in LEO
const OrbitingSatellite: React.FC<{ radius: number }> = ({ radius }) => {
  const satRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (satRef.current) {
      satRef.current.rotation.y += delta * 0.12
      satRef.current.rotation.x += delta * 0.03
    }
  })

  return (
    <group ref={satRef}>
      <group position={[radius, 0.4, 0]}>
        {/* Spacecraft Body */}
        <mesh>
          <boxGeometry args={[0.06, 0.025, 0.025]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Solar Panels */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.04, 0.005, 0.08]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[0.04, 0.005, 0.08]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
        {/* Pulsing Strobe Light */}
        <pointLight color="#00f0ff" intensity={1.5} distance={1.2} />
      </group>
    </group>
  )
}

// Subtle Deep Space Starfield (ZERO other planets!)
const DeepSpaceStarfield: React.FC = () => {
  const count = 2800

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const colorWhite = new THREE.Color(0xffffff)
    const colorCyan = new THREE.Color(0x7dd3fc)
    const colorBlue = new THREE.Color(0x38bdf8)

    for (let i = 0; i < count; i++) {
      // Distribute evenly in a spherical shell far away (r = 50 to 120)
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 50 + Math.random() * 70

      const sinPhi = Math.sin(phi)
      pos[i * 3] = r * sinPhi * Math.cos(theta)
      pos[i * 3 + 1] = r * sinPhi * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      // Random color variation
      const randColor = Math.random()
      const chosenColor = randColor > 0.8 ? colorCyan : randColor > 0.6 ? colorBlue : colorWhite
      cols[i * 3] = chosenColor.r
      cols[i * 3 + 1] = chosenColor.g
      cols[i * 3 + 2] = chosenColor.b
    }

    return { positions: pos, colors: cols }
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Cinematic Camera Movement Controller
const CameraController: React.FC<{
  phase: 'intro' | 'auth' | 'transition'
  onTransitionComplete?: () => void
}> = ({ phase, onTransitionComplete }) => {
  const transitionProgress = useRef(0)

  useFrame(({ camera }, delta) => {
    if (phase === 'intro') {
      // Smooth cinematic camera positioned to emphasize Earth's magnificent horizon
      const targetPos = new THREE.Vector3(0, 0.2, 7.2)
      camera.position.lerp(targetPos, delta * 1.5)
      camera.lookAt(0, -1.0, 0)
    } else if (phase === 'auth') {
      // Gently pull back and elevate slightly to frame Earth behind the authentication panel
      const targetPos = new THREE.Vector3(0, 0.6, 8.2)
      camera.position.lerp(targetPos, delta * 2.0)
      camera.lookAt(0, -1.2, 0)
    } else if (phase === 'transition') {
      // Accelerate rapidly past Earth's atmosphere into outer space
      transitionProgress.current += delta * 1.8
      const speed = Math.min(transitionProgress.current, 1.0)
      const targetZ = THREE.MathUtils.lerp(8.2, 1.5, Math.pow(speed, 2.5))
      const targetY = THREE.MathUtils.lerp(0.6, -1.2, speed)
      camera.position.set(0, targetY, targetZ)
      camera.lookAt(0, -1.8, -10)

      if (transitionProgress.current >= 1.0 && onTransitionComplete) {
        onTransitionComplete()
      }
    }
  })

  return null
}

export const EarthScene: React.FC<EarthSceneProps> = ({ phase, onTransitionComplete }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <Canvas
        camera={{ position: [0, 2.5, 9.5], fov: 45, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Deep Space Ambient Light */}
        <ambientLight intensity={0.25} />

        {/* Primary Sun Direct Light */}
        <directionalLight
          position={[12, 6, 8]}
          intensity={2.8}
          color="#ffffff"
        />

        {/* Subtle Cyan Backlight from Atmospheric Horizon */}
        <directionalLight
          position={[-10, -4, -6]}
          intensity={0.6}
          color="#00e5ff"
        />

        {/* Stars */}
        <DeepSpaceStarfield />

        {/* Photorealistic Earth */}
        <React.Suspense fallback={null}>
          <EarthObject phase={phase} />
        </React.Suspense>

        {/* Smooth Camera Director */}
        <CameraController phase={phase} onTransitionComplete={onTransitionComplete} />
      </Canvas>
    </div>
  )
}

export default EarthScene
