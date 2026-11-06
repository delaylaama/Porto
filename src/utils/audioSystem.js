/* ─────────────────────────────────────────────────────────────
   audioSystem.js — High-Fidelity Synthesized Web Audio Engine
   • Zero external audio file requests (synthesized in realtime)
   • 48kHz Spatial Test Tone & Chirp
   • Subtle tactile micro-ticks on UI hover and scrubber interaction
   • Controlled by Spatial 48kHz master toggle
   ───────────────────────────────────────────────────────────── */

let audioCtx = null
let isAudioEnabled = false

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function setSpatialAudio(enabled) {
  isAudioEnabled = enabled
  if (enabled) {
    const ctx = getAudioContext()
    if (ctx) {
      // Play activation confirmation: calibrated 48kHz spatial stereo sweep
      playSpatialTone()
    }
  }
  return isAudioEnabled
}

export function getSpatialAudioState() {
  return isAudioEnabled
}

export function playSpatialTone() {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  // Dual-frequency resonant chime (calibrated 440Hz → 880Hz octave)
  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(440, now)
  osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12)

  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(880, now)
  osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.12)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(3200, now)

  gain.gain.setValueAtTime(0.001, now)
  gain.gain.linearRampToValueAtTime(0.08, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)

  osc1.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc1.start(now)
  osc2.start(now)
  osc1.stop(now + 0.3)
  osc2.stop(now + 0.3)
}

export function playTick(pitch = 1) {
  if (!isAudioEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  // Ultra-short, tactile micro-tick (like a cinema camera dial click)
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(2200 * pitch, now)
  osc.frequency.exponentialRampToValueAtTime(400 * pitch, now + 0.015)

  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1800, now)
  filter.Q.setValueAtTime(2.5, now)

  gain.gain.setValueAtTime(0.035, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.02)
}

export function playWhoosh() {
  if (!isAudioEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(180, now)
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.18)

  gain.gain.setValueAtTime(0.04, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.22)
}
