import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────
   HeroScene — interactive halftone dot field for the landing page
   • Onyx dots on white, so the clean look stays
   • Cursor pushes dots up + outward and tints them blue → terracotta
   • Idle autopilot: a slow "ghost cursor" keeps the field alive
   • Pauses rendering when the hero leaves the viewport
   • Respects prefers-reduced-motion
   ───────────────────────────────────────────────────────────── */

const COLS = 150
const ROWS = 84

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uSize;
  uniform float uPixelRatio;

  varying float vInfluence;

  void main() {
    vec2 p = position.xy * uSize;

    // cursor influence (soft radius)
    float d = distance(p, uMouse);
    float influence = smoothstep(2.4, 0.0, d);

    // ambient wave so the field breathes even without input
    float wave = sin(p.x * 0.55 + uTime * 0.8) * 0.5
               + sin(p.y * 0.85 - uTime * 0.6) * 0.5;

    // push dots away from the cursor and lift them toward the camera
    vec2 dir = normalize(p - uMouse + vec2(0.0001));
    p += dir * influence * 0.4;
    float z = wave * 0.22 + influence * 1.3;

    vec4 mv = modelViewMatrix * vec4(p, z, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = 0.85 + wave * 0.3 + influence * 2.8;
    gl_PointSize = size * uPixelRatio * (17.0 / -mv.z);

    vInfluence = influence;
  }
`

const fragmentShader = /* glsl */ `
  varying float vInfluence;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float edge = smoothstep(0.5, 0.4, r);

    vec3 onyx       = vec3(0.071, 0.075, 0.075);   // #121313
    vec3 blueBell   = vec3(0.000, 0.553, 0.835);   // #008dd5
    vec3 terracotta = vec3(0.914, 0.310, 0.216);   // #e94f37

    vec3 col = mix(onyx, blueBell, smoothstep(0.0, 0.55, vInfluence));
    col = mix(col, terracotta, smoothstep(0.75, 1.0, vInfluence));

    float alpha = (0.2 + vInfluence * 0.75) * edge;
    gl_FragColor = vec4(col, alpha);
  }
`

function DotField({ reduced, inView }) {
  const { viewport, gl } = useThree()
  const pointer = useRef({ x: 0, y: 0, last: -Infinity })
  const smooth = useRef(new THREE.Vector2())
  const started = useRef(false)
  const rectRef = useRef({ left: 0, top: 0, width: 1920, height: 1080 })

  const positions = useMemo(() => {
    const arr = new Float32Array(COLS * ROWS * 3)
    let i = 0
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        arr[i++] = x / (COLS - 1) - 0.5
        arr[i++] = y / (ROWS - 1) - 0.5
        arr[i++] = 0
      }
    }
    return arr
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uSize: { value: new THREE.Vector2(1, 1) },
      uPixelRatio: { value: 1 },
    }),
    []
  )

  // Cache bounding rect on resize/scroll to avoid layout thrashing on every pointermove
  useEffect(() => {
    if (reduced) return
    const el = gl.domElement
    const updateRect = () => {
      if (el) {
        const r = el.getBoundingClientRect()
        rectRef.current = {
          left: r.left,
          top: r.top,
          width: r.width || window.innerWidth,
          height: r.height || window.innerHeight,
        }
      }
    }
    updateRect()

    window.addEventListener('resize', updateRect, { passive: true })
    window.addEventListener('scroll', updateRect, { passive: true })

    const onMove = (e) => {
      if (!inView) return
      const rect = rectRef.current
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      pointer.current.last = performance.now()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
      window.removeEventListener('pointermove', onMove)
    }
  }, [gl, reduced, inView])

  useFrame((state, delta) => {
    if (!inView) return

    const t = state.clock.elapsedTime
    const hw = viewport.width / 2
    const hh = viewport.height / 2

    // real cursor, or a slow ghost cursor when idle
    const idle = performance.now() - pointer.current.last > 3000
    const nx = idle ? Math.sin(t * 0.4) * 0.55 : pointer.current.x
    const ny = idle ? Math.cos(t * 0.31) * 0.4 : pointer.current.y
    const tx = nx * hw
    const ty = ny * hh

    if (!started.current) {
      smooth.current.set(tx, ty)
      started.current = true
    }
    smooth.current.lerp(new THREE.Vector2(tx, ty), 1 - Math.exp(-delta * 6))

    uniforms.uMouse.value.copy(smooth.current)
    uniforms.uTime.value = reduced ? 0 : t
    uniforms.uSize.value.set(viewport.width * 1.15, viewport.height * 1.15)
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()

    // tiny camera parallax for depth
    if (!reduced) {
      state.camera.position.x += (nx * 0.35 - state.camera.position.x) * 0.04
      state.camera.position.y += (ny * 0.2 - state.camera.position.y) * 0.04
      state.camera.lookAt(0, 0, 0)
    }
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  )
}

export default function HeroScene() {
  const wrapRef = useRef(null)
  const [inView, setInView] = useState(true)
  const reduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  // stop the render loop when the hero is scrolled out of view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="hero-landing__canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        frameloop={inView ? 'always' : 'never'}
      >
        <DotField reduced={reduced} inView={inView} />
      </Canvas>
    </div>
  )
}
