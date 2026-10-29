import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ChevronDown } from 'lucide-react'
import { profile } from '@/constants'
import { useOS } from '@/store/useOS'
import { MOD } from '@/lib/platform'

const BASE_WEIGHT = 600

export default function Hero() {
  const root = useRef(null)
  const nameRef = useRef(null)
  const [roleIdx, setRoleIdx] = useState(0)

  // the hero recedes while any window is open, so it doesn't ghost through them
  const anyOpen = useOS((s) => Object.values(s.windows).some((w) => w.isOpen && !w.isMinimized))
  const seen = useRef(false)
  useEffect(() => {
    if (!seen.current) {
      seen.current = true
      return
    }
    gsap.to(root.current, {
      opacity: anyOpen ? 0.12 : 1,
      filter: anyOpen ? 'blur(4px)' : 'blur(0px)',
      duration: 0.6,
      ease: 'power2.out',
    })
  }, [anyOpen])

  // rotating role line
  useEffect(() => {
    const t = setInterval(() => setRoleIdx((n) => (n + 1) % profile.roles.length), 2800)
    return () => clearInterval(t)
  }, [])

  // intro animation
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-eyebrow', { opacity: 0, y: 12, duration: 0.8 }, 0.5)
        .from(
          '.hero-letter',
          { opacity: 0, y: 50, filter: 'blur(14px)', duration: 1, stagger: 0.07, ease: 'power4.out' },
          0.7,
        )
        .from('.hero-role', { opacity: 0, y: 14, duration: 0.8 }, 1.4)
        .from('.hero-tagline', { opacity: 0, duration: 0.8 }, 1.6)
        .from('.hero-hint', { opacity: 0, duration: 1 }, 2.2)
    },
    { scope: root },
  )

  // font-weight "swell" under the cursor (Inter is a variable font)
  const onMove = (e) => {
    const letters = nameRef.current?.querySelectorAll('.hero-letter')
    if (!letters) return
    letters.forEach((el) => {
      const r = el.getBoundingClientRect()
      const d = Math.abs(e.clientX - (r.left + r.width / 2))
      const weight = gsap.utils.clamp(300, 900, 900 - (d / 200) * 600)
      gsap.to(el, { fontWeight: weight, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
    })
  }
  const onLeave = () => {
    const letters = nameRef.current?.querySelectorAll('.hero-letter')
    if (letters) gsap.to(letters, { fontWeight: BASE_WEIGHT, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
  }

  return (
    <section
      ref={root}
      className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center px-6 pb-24 text-center"
    >
      <p className="hero-eyebrow text-xs font-medium uppercase tracking-[0.4em] text-white/60 sm:text-sm">
        Hi, I&apos;m
      </p>

      <h1
        ref={nameRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="pointer-events-auto mt-3 cursor-default select-none leading-none tracking-tight"
        style={{ fontSize: 'clamp(3.4rem, 13vw, 10rem)' }}
        aria-label={profile.name}
      >
        {[...profile.firstName].map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="hero-letter inline-block"
            style={{
              fontWeight: BASE_WEIGHT,
              backgroundImage: 'linear-gradient(180deg, #ffffff 25%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              paddingInline: '0.01em',
            }}
          >
            {ch}
          </span>
        ))}
      </h1>

      <div className="hero-role mt-5 h-8 overflow-hidden text-lg font-medium text-white/85 sm:text-2xl">
        <span key={roleIdx} className="role-in inline-block">
          {profile.roles[roleIdx]}
        </span>
      </div>

      <p className="hero-tagline mt-2 max-w-xl text-balance text-xs text-white/45 sm:text-sm">{profile.tagline}</p>

      <div className="hero-hint mt-10 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-white/40">
        <span>Explore the dock</span>
        <ChevronDown size={16} className="hint" />
        <span className="mt-3 hidden items-center gap-1.5 normal-case tracking-normal text-white/35 md:flex">
          or press <kbd className="kbd">{MOD}</kbd> <kbd className="kbd">K</kbd> to search
        </span>
      </div>
    </section>
  )
}
