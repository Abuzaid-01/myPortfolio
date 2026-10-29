import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useOS } from '@/store/useOS'
import { isMac, toggleFullscreen } from '@/lib/platform'

// Things that keep the browser's own right-click menu
const IGNORE = '[data-win], header, [data-dock], [role="dialog"], [data-lock], [data-boot], input, textarea, a, [data-icon]'

export default function ContextMenu() {
  const [pos, setPos] = useState(null)
  const ref = useRef(null)
  const openWindow = useOS((s) => s.openWindow)
  const openSpotlight = useOS((s) => s.openSpotlight)
  const nextWallpaper = useOS((s) => s.nextWallpaper)
  const lock = useOS((s) => s.lock)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onCtx = (e) => {
      if (e.target.closest?.(IGNORE)) return setPos(null)
      e.preventDefault()
      setPos({ x: e.clientX, y: e.clientY })
    }
    const close = (e) => {
      if (e?.type === 'pointerdown' && ref.current?.contains(e.target)) return
      setPos(null)
    }
    const onKey = (e) => e.key === 'Escape' && setPos(null)
    document.addEventListener('contextmenu', onCtx)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', onKey)
    window.addEventListener('blur', close)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('contextmenu', onCtx)
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('blur', close)
      window.removeEventListener('resize', close)
    }
  }, [])

  // keep the menu inside the viewport
  useLayoutEffect(() => {
    if (!pos || !ref.current) return
    const { width, height } = ref.current.getBoundingClientRect()
    const x = Math.min(pos.x, window.innerWidth - width - 8)
    const y = Math.min(pos.y, window.innerHeight - height - 8)
    ref.current.style.left = `${Math.max(8, x)}px`
    ref.current.style.top = `${Math.max(36, y)}px`
  }, [pos])

  if (!pos) return null

  const mod = isMac ? '⌘' : 'Ctrl+'
  const items = [
    { label: 'Open Projects', run: () => openWindow('finder') },
    { label: 'Open Resume', run: () => openWindow('resume') },
    { label: 'Contact Me', run: () => openWindow('contact') },
    { type: 'sep' },
    { label: 'Change Wallpaper…', run: () => openWindow('settings') },
    { label: 'System Settings…', run: () => openWindow('settings') },
    { label: 'Search…', shortcut: `${mod}K`, run: () => setTimeout(openSpotlight, 40) },
    { label: 'Toggle Full Screen', run: toggleFullscreen },
    { type: 'sep' },
    { label: 'Lock Screen', run: lock },
  ]

  return (
    <ul
      ref={ref}
      role="menu"
      data-context-menu
      style={{ left: pos.x, top: pos.y }}
      className="glass-menu menu-in fixed z-[1500] min-w-52 select-none rounded-xl p-1.5 text-[13px] text-white"
    >
      {items.map((it, i) =>
        it.type === 'sep' ? (
          <li key={i} role="separator" className="my-1 h-px bg-white/15" />
        ) : (
          <li key={it.label} role="none">
            <button
              role="menuitem"
              onClick={() => {
                setPos(null)
                it.run()
              }}
              className="flex w-full items-center justify-between gap-6 rounded-md px-2.5 py-1 text-left hover:bg-accent"
            >
              {it.label}
              {it.shortcut && <span className="text-[12px] text-white/45">{it.shortcut}</span>}
            </button>
          </li>
        ),
      )}
    </ul>
  )
}
