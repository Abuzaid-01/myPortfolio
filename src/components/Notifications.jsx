import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Bell } from 'lucide-react'
import { useOS } from '@/store/useOS'

const LIFETIME = 6500

function Toast({ n }) {
  const ref = useRef(null)
  const dismiss = useOS((s) => s.dismissNotification)
  const closing = useRef(false)

  const close = () => {
    if (closing.current) return
    closing.current = true
    gsap.to(ref.current, {
      x: 40,
      opacity: 0,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => dismiss(n.id),
    })
  }

  useEffect(() => {
    const el = ref.current
    gsap.fromTo(el, { x: 60, opacity: 0, scale: 0.96 }, { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const bar = el.querySelector('[data-bar]')
    const tween = gsap.fromTo(bar, { scaleX: 1 }, { scaleX: 0, duration: LIFETIME / 1000, ease: 'none', onComplete: close })
    const pause = () => tween.pause()
    const play = () => tween.play()
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', play)
    return () => {
      tween.kill()
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', play)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      role="status"
      onClick={() => {
        n.onClick?.()
        close()
      }}
      className="glass-menu pointer-events-auto relative w-full cursor-pointer overflow-hidden rounded-2xl p-3 text-white"
    >
      <div className="flex gap-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-[10px] text-lg"
          style={{ background: 'linear-gradient(135deg, #7c5cff, #22d3ee)' }}
        >
          {n.emoji ?? <Bell size={17} />}
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-tight">{n.title}</div>
          <div className="mt-0.5 text-[12.5px] leading-snug text-white/70">{n.body}</div>
        </div>
      </div>
      <div data-bar className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-white/30" />
    </div>
  )
}

// Top-right toast stack
export default function Notifications() {
  const list = useOS((s) => s.notifications)
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-2 top-[38px] z-[950] flex w-[340px] max-w-[calc(100vw-16px)] flex-col gap-2 sm:right-3"
    >
      {list.map((n) => (
        <Toast key={n.id} n={n} />
      ))}
    </div>
  )
}
