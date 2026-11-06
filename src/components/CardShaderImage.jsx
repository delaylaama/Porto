import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────
   CardShaderImage — Motion Designer Signature WebGL Shader Hover
   • RGB-Split Chromatic Aberration following cursor
   • Liquid Wave Ripple distortion around pointer
   • Zero GPU overhead when not hovered (frameloop conditional)
   • Seamless fallback to native <img>
   ───────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2      uMouse;
  uniform float     uHover;
  uniform float     uTime;
  varying vec2      vUv;

  void main() {
    vec2 uv = vUv;

    // Distance from mouse in UV space [0..1]
    float dist = distance(uv, uMouse);

    // Liquid ripple wave emanating from cursor position
    float wave = sin(dist * 22.0 - uTime * 5.0) * exp(-dist * 4.5) * uHover * 0.04;

    vec2 dir = normalize(uv - uMouse + vec2(0.0001));
    vec2 distortedUv = uv + dir * wave;

    // RGB split chromatic aberration
    float split = (0.018 + abs(wave) * 0.6) * uHover;

    float r = texture2D(uTexture, distortedUv + dir * split).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, distortedUv - dir * split).b;

    // Slight halftone comic contrast boost when hovered
    vec3 col = vec3(r, g, b);
    col = mix(col, col * 1.05, uHover * 0.3);

    gl_FragColor = vec4(col, 1.0);
  }
`

function ShaderPlane({ url, mouseUv, isHovered }) {
  const meshRef = useRef(null)
  const texture = useLoader(THREE.TextureLoader, url)

  // Configure texture filters for crisp rendering
  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
    }
  }, [texture])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
    }),
    [texture]
  )

  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const hoverProgress = useRef(0)

  useFrame((state, delta) => {
    const targetHover = isHovered ? 1 : 0
    hoverProgress.current += (targetHover - hoverProgress.current) * Math.min(delta * 8, 1)

    // Smooth lerp mouse coordinates
    smoothMouse.current.lerp(new THREE.Vector2(mouseUv.x, mouseUv.y), Math.min(delta * 12, 1))

    uniforms.uMouse.value.copy(smoothMouse.current)
    uniforms.uHover.value = hoverProgress.current
    uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
      />
    </mesh>
  )
}

export default function CardShaderImage({ 
  src, 
  alt, 
  isHovered, 
  mouseUv = { x: 0.5, y: 0.5 },
  className = '' 
}) {
  const [hasError, setHasError] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Fallback if WebGL fails or context is lost
  if (hasError || !src) {
    return <img src={src} alt={alt} className={className} loading="lazy" />
  }

  return (
    <div className={`card-shader-wrapper ${className}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Underlying base image for instant initial paint and SEO */}
      <img 
        src={src} 
        alt={alt} 
        className={className} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isReady && isHovered ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
        loading="lazy"
      />

      {/* R3F WebGL Distortion Canvas only active on hover */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.25s ease',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 1], fov: 90 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'low-power' }}
          frameloop={isHovered ? 'always' : 'never'}
          onCreated={() => setIsReady(true)}
          onError={() => setHasError(true)}
        >
          <ShaderPlane url={src} mouseUv={mouseUv} isHovered={isHovered} />
        </Canvas>
      </div>
    </div>
  )
}
