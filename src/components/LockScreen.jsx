import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Lock } from 'lucide-react'
import { profile } from '@/constants'
import { useNow } from '@/hooks/useNow'
import { useOS } from '@/store/useOS'

// Big clock, avatar and "click to unlock". Opened from the logo menu,
// Control Center or Spotlight.
export default function LockScreen() {
  const locked = useOS((s) => s.locked)
  const unlock = useOS((s) => s.unlock)
  const now = useNow()
  const root = useRef(null)
  const [show, setShow] = useState(false)

  // mount on lock, animate out on unlock
  useEffect(() => {
    if (locked) setShow(true)
    else if (show && root.current) {
      gsap.to(root.current, { opacity: 0, scale: 1.04, duration: 0.45, ease: 'power2.in', onComplete: () => setShow(false) })
    }
  }, [locked]) // eslint-disable-line react-hooks/exhaustive-deps

  useGSAP(
    () => {
      if (!show) return
      gsap.fromTo(root.current, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' })
      gsap.from('.lock-item', { opacity: 0, y: 18, duration: 0.7, stagger: 0.09, delay: 0.15, ease: 'power3.out' })
    },
    { scope: root, dependencies: [show] },
  )

  // any key unlocks
  useEffect(() => {
    if (!locked) return
    const onKey = (e) => {
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) return
      e.preventDefault()
      unlock()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [locked, unlock])

  if (!show) return null

  return (
    <button
      ref={root}
      data-lock
      onClick={unlock}
      aria-label="Locked. Click to unlock"
      className="fixed inset-0 z-[2500] flex cursor-pointer flex-col items-center bg-black/35 px-6 pb-10 pt-[11vh] text-center text-white outline-none backdrop-blur-3xl"
    >
      <div className="lock-item text-lg font-medium text-white/80 sm:text-xl">{now.format('dddd, D MMMM')}</div>
      <div
        className="lock-item mt-1 leading-none tracking-tight tabular-nums"
        style={{ fontSize: 'clamp(5rem, 22vw, 11rem)', fontWeight: 200, textShadow: '0 6px 40px rgba(0,0,0,0.35)' }}
      >
        {now.format('h:mm')}
      </div>

      <div className="mt-auto flex flex-col items-center">
        <div className="lock-item relative size-22 overflow-hidden rounded-full border-2 border-white/20 shadow-xl shadow-black/40">
          <img
            src="/photos/photo-1.jpg"
            alt="Abuzaid"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = 'https://avatars.githubusercontent.com/u/174946133?v=4'
            }}
          />
        </div>
        <div className="lock-item mt-3 text-lg font-semibold">{profile.name}</div>
        <div className="lock-item mt-1 flex items-center gap-1.5 text-sm text-white/60">
          <Lock size={13} />
          <span className="hint-fade">Click or press any key to unlock</span>
        </div>
      </div>
    </button>
  )
}
