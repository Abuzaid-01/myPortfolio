import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { dockApps } from '@/constants'
import { useOS } from '@/store/useOS'

const TRASH_LINES = [
  ['Nothing to delete', 'My code is clean. No bugs in the bin. 😉'],
  ['Trash is empty', 'Even my failed experiments got promoted to projects.'],
  ['Whoa, easy there', 'Hiring me is the only thing worth clicking here.'],
]
import { ICONS } from './appIcons'

const RANGE = 150 // px of cursor distance that still magnifies an icon

const calcBase = () => (window.innerWidth < 480 ? 38 : window.innerWidth < 768 ? 46 : 56)

function useBaseSize() {
  const [size, setSize] = useState(calcBase)
  useEffect(() => {
    const onResize = () => setSize(calcBase())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

export default function Dock() {
  const base = useBaseSize()
  const max = Math.round(base * 1.75)

  const wrapRef = useRef(null)
  const dockRef = useRef(null)
  const buttons = useRef([]) // icon buttons, used for magnification
  const items = useRef([]) // <li> elements, used for the launch bounce

  const windows = useOS((s) => s.windows)
  const openWindow = useOS((s) => s.openWindow)
  const notify = useOS((s) => s.notify)
  const trashHits = useRef(0)

  // keep sizes in sync when breakpoint changes
  useGSAP(
    () => {
      gsap.set(buttons.current.filter(Boolean), { width: base, height: base })
    },
    { scope: wrapRef, dependencies: [base] },
  )

  // intro: dock rises from the bottom
  useGSAP(
    () => {
      gsap.from(dockRef.current, { y: 140, opacity: 0, duration: 1.1, delay: 1.1, ease: 'back.out(1.4)' })
    },
    { scope: wrapRef },
  )

  // magnification (mouse devices only)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const els = buttons.current.filter(Boolean)
        const setters = els.map((el) => ({
          w: gsap.quickTo(el, 'width', { duration: 0.18, ease: 'power3.out' }),
          h: gsap.quickTo(el, 'height', { duration: 0.18, ease: 'power3.out' }),
        }))

        const onMove = (e) => {
          els.forEach((el, i) => {
            const r = el.getBoundingClientRect()
            const dist = Math.abs(e.clientX - (r.left + r.width / 2))
            const t = Math.max(0, 1 - dist / RANGE)
            const eased = t * t * (3 - 2 * t) // smoothstep
            const size = base + (max - base) * eased
            setters[i].w(size)
            setters[i].h(size)
          })
        }
        const reset = () =>
          setters.forEach((s) => {
            s.w(base)
            s.h(base)
          })

        const dock = dockRef.current
        dock.addEventListener('mousemove', onMove)
        dock.addEventListener('mouseleave', reset)
        return () => {
          dock.removeEventListener('mousemove', onMove)
          dock.removeEventListener('mouseleave', reset)
        }
      })
    },
    { scope: wrapRef, dependencies: [base, max], revertOnUpdate: true },
  )

  const bounce = (li) => {
    gsap
      .timeline()
      .to(li, { y: -24, duration: 0.3, ease: 'power2.out' })
      .to(li, { y: 0, duration: 0.45, ease: 'bounce.out' })
      .to(li, { y: -14, duration: 0.25, ease: 'power2.out' })
      .to(li, { y: 0, duration: 0.4, ease: 'bounce.out' })
  }

  const onClick = (app, li) => {
    const wasRunning = windows[app.id]?.isOpen
    if (app.href) {
      window.open(app.href, '_blank', 'noopener,noreferrer')
      bounce(li)
      return
    }
    if (app.action === 'trash') {
      bounce(li)
      const [title, body] = TRASH_LINES[trashHits.current++ % TRASH_LINES.length]
      notify({ title, body, emoji: '🗑️' })
      return
    }
    openWindow(app.id)
    if (!wasRunning) bounce(li)
  }

  let iconIndex = -1

  return (
    <div ref={wrapRef} className="pointer-events-none fixed inset-x-0 bottom-2 z-[900] flex justify-center px-2">
      <ul
        ref={dockRef}
        data-dock
        className="glass pointer-events-auto flex items-end gap-1.5 rounded-[22px] px-2 pb-1 pt-2 sm:gap-2 sm:rounded-[26px] sm:px-2.5"
      >
        {dockApps.map((app, i) => {
          if (app.type === 'separator') {
            return (
              <li
                key={`sep-${i}`}
                aria-hidden="true"
                className={`mx-0.5 mb-3 h-9 w-px self-end bg-white/20 ${app.desktopOnly ? 'hidden sm:block' : ''}`}
              />
            )
          }

          iconIndex += 1
          const idx = iconIndex
          const Icon = ICONS[app.icon]
          const running = !!windows[app.id]?.isOpen

          return (
            <li
              key={app.id}
              ref={(el) => (items.current[idx] = el)}
              className={`group relative flex-col items-center justify-end ${app.desktopOnly ? 'hidden sm:flex' : 'flex'}`}
            >
              <span className="glass pointer-events-none absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 md:block">
                {app.label}
              </span>

              <button
                ref={(el) => (buttons.current[idx] = el)}
                data-dock-id={app.id}
                aria-label={app.href ? `Open ${app.label} (new tab)` : app.action ? app.label : `Open ${app.label}`}
                onClick={() => onClick(app, items.current[idx])}
                className="relative grid place-items-center overflow-hidden rounded-[24%] outline-none transition-[filter] focus-visible:ring-2 focus-visible:ring-white/70 active:brightness-90"
                style={{
                  width: base,
                  height: base,
                  color: app.fg,
                  background:
                    app.id === 'photos'
                      ? 'transparent'
                      : `linear-gradient(160deg, ${app.colors[0]}, ${app.colors[1]})`,
                  boxShadow:
                    app.id === 'photos'
                      ? '0 6px 16px -6px rgba(0,0,0,0.65)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 6px 16px -6px rgba(0,0,0,0.65)',
                }}
              >
                {app.id === 'photos' ? (
                  <img
                    src="/photos-icon.png"
                    alt="Photos"
                    className="size-full object-cover pointer-events-none rounded-[24%]"
                  />
                ) : (
                  <>
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
                    <Icon className="relative size-[54%]" strokeWidth={1.8} />
                  </>
                )}
              </button>

              <span
                className={`mt-1 h-1 w-1 rounded-full bg-white/80 transition-opacity ${running ? 'opacity-100' : 'opacity-0'}`}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
