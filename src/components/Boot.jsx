import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { profile } from '@/constants'

const STEPS = ['Starting PortfolioOS…', 'Loading projects…', 'Compiling skills…', 'Warming up the dock…', 'Welcome']

// Cinematic intro. Calls onReveal() when the desktop should mount (so its own
// entrance animations play under the fading overlay), then onDone() when gone.
// Click or press any key to speed through it.
export default function Boot({ onReveal, onDone }) {
  const root = useRef(null)
  const bar = useRef(null)
  const status = useRef(null)
  const tl = useRef(null)

  useGSAP(
    () => {
      const p = { v: 0 }
      let last = -1

      const t = gsap.timeline()
      tl.current = t
      t.from('.boot-badge', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.6)' })
        .from('.boot-text', { opacity: 0, y: 10, duration: 0.6, stagger: 0.12 }, '-=0.4')
        .to(
          p,
          {
            v: 1,
            duration: 2.1,
            ease: 'power1.inOut',
            onUpdate: () => {
              bar.current.style.transform = `scaleX(${p.v})`
              const i = Math.min(STEPS.length - 1, Math.floor(p.v * STEPS.length))
              if (i !== last) {
                last = i
                status.current.textContent = STEPS[i]
              }
            },
          },
          '-=0.2',
        )
        .add(() => onReveal())
        .to(root.current, { opacity: 0, duration: 0.9, ease: 'power2.inOut', onComplete: () => onDone() }, '+=0.2')
    },
    { scope: root },
  )

  // speed up on any interaction
  useEffect(() => {
    const skip = () => tl.current?.timeScale(6)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [])

  return (
    <div
      ref={root}
      data-boot
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[3000] grid cursor-pointer select-none place-items-center overflow-hidden"
      style={{ background: 'radial-gradient(60% 50% at 50% 42%, #1a1440 0%, #07080f 60%, #000 100%)' }}
    >
      <div className="relative flex flex-col items-center">
        {/* soft pulsing glow behind the badge */}
        <div
          aria-hidden="true"
          className="breathe absolute left-1/2 top-[46px] size-56 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.55), rgba(34,211,238,0.18) 60%, transparent 72%)' }}
        />

        <div
          className="boot-badge relative grid size-[92px] place-items-center rounded-[26px] text-[52px] font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #7c5cff, #22d3ee)',
            boxShadow: '0 0 70px rgba(124,92,255,0.5), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -6px 14px rgba(0,0,0,0.18)',
          }}
        >
          {profile.name[0]}
        </div>

        <h1 className="boot-text mt-6 text-2xl font-semibold tracking-tight text-white">{profile.name}</h1>
        <p className="boot-text mt-1 text-[10px] uppercase tracking-[0.45em] text-white/40">PortfolioOS</p>

        <div className="boot-text mt-9 h-[3px] w-48 overflow-hidden rounded-full bg-white/15">
          <div
            ref={bar}
            className="h-full origin-left rounded-full"
            style={{ transform: 'scaleX(0)', background: 'linear-gradient(90deg, #7c5cff, #22d3ee)' }}
          />
        </div>
        <p ref={status} className="boot-text mt-3 h-4 font-mono text-[11px] text-white/45">
          {STEPS[0]}
        </p>
      </div>

      <p className="absolute bottom-6 text-[10px] uppercase tracking-[0.3em] text-white/20">Click to skip</p>
    </div>
  )
}
