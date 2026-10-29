import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { dockApps, menuOrder, menus, windowConfig } from '@/constants'
import { useOS } from '@/store/useOS'
import StatusBar from './StatusBar'
import { isMac, toggleFullscreen } from '@/lib/platform'
import { restart } from '@/lib/session'

const WINDOW_ACTIONS = ['close', 'minimize', 'zoom']

function Dropdown({ items, onPick }) {
  return (
    <ul
      role="menu"
      className="glass-menu menu-in absolute left-0 top-[calc(100%+3px)] z-10 min-w-56 rounded-xl p-1.5 text-[13px]"
    >
      {items.map((item, i) =>
        item.type === 'separator' ? (
          <li key={i} role="separator" className="my-1 h-px bg-white/15" />
        ) : (
          <li key={i} role="none">
            <button
              role="menuitem"
              disabled={item.disabled}
              onClick={() => onPick(item)}
              className="flex w-full items-center justify-between gap-6 rounded-md px-2.5 py-1 text-left text-white enabled:hover:bg-accent disabled:text-white/35"
            >
              <span>
                {item.checked && <span className="mr-1.5">✓</span>}
                {item.label}
              </span>
              {item.shortcut && <span className="text-[12px] text-white/45">{item.shortcut}</span>}
            </button>
          </li>
        ),
      )}
    </ul>
  )
}

function MenuButton({ id, open, setOpen, items, onPick, className = '', children }) {
  const isOpen = open === id
  return (
    <div className="relative">
      <button
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpen(isOpen ? null : id)}
        // like macOS: once a menu is open, hovering another one switches to it
        onMouseEnter={() => open && setOpen(id)}
        className={`rounded px-2 py-0.5 transition-colors ${isOpen ? 'bg-white/20' : 'hover:bg-white/10'} ${className}`}
      >
        {children}
      </button>
      {isOpen && <Dropdown items={items} onPick={onPick} />}
    </div>
  )
}

export default function MenuBar() {
  const barRef = useRef(null)
  const [open, setOpen] = useState(null)

  const windows = useOS((s) => s.windows)
  const activeApp = useOS((s) => s.activeApp)
  const openWindow = useOS((s) => s.openWindow)
  const closeActive = useOS((s) => s.closeActive)
  const minimizeActive = useOS((s) => s.minimizeActive)
  const zoomActive = useOS((s) => s.zoomActive)
  const openSpotlight = useOS((s) => s.openSpotlight)
  const lock = useOS((s) => s.lock)
  const nextWallpaper = useOS((s) => s.nextWallpaper)

  const activeName = dockApps.find((a) => a.id === activeApp)?.app ?? 'Finder'
  const hasActive = !!windows[activeApp]?.isOpen && !windows[activeApp].isMinimized

  // static items from constants + live window state
  const itemsFor = (id) => {
    const base = menus[id].map((item) => {
      // show Ctrl+ instead of the Mac symbols on Windows/Linux
      const shortcut = !isMac && item.shortcut ? item.shortcut.replace('⌃⌘', 'Ctrl+').replace('⇧⌘', 'Shift+Ctrl+').replace('⌘', 'Ctrl+') : item.shortcut
      const next = { ...item, shortcut }
      return WINDOW_ACTIONS.includes(item.action) ? { ...next, disabled: !hasActive } : next
    })
    if (id !== 'Window') return base

    const openWins = Object.entries(windows)
      .filter(([, w]) => w.isOpen)
      .sort((a, b) => a[1].z - b[1].z)
    if (!openWins.length) return base
    return [
      ...base,
      { type: 'separator' },
      ...openWins.map(([wid, w]) => ({
        label: windowConfig[wid].title + (w.isMinimized ? ' (minimized)' : ''),
        action: `focus:${wid}`,
        checked: wid === activeApp && !w.isMinimized,
      })),
    ]
  }

  const onPick = (item) => {
    if (item.disabled) return
    const a = item.action
    if (item.href) window.open(item.href, '_blank', 'noopener,noreferrer')
    else if (a?.startsWith('launch:')) openWindow(a.slice(7))
    else if (a?.startsWith('focus:')) openWindow(a.slice(6))
    else if (a === 'close') closeActive()
    else if (a === 'minimize') minimizeActive()
    else if (a === 'zoom') zoomActive()
    else if (a === 'reload') window.location.reload()
    else if (a === 'fullscreen') toggleFullscreen()
    else if (a === 'spotlight') setTimeout(openSpotlight, 40)
    else if (a === 'lock') lock()
    else if (a === 'wallpaper') nextWallpaper()
    else if (a === 'restart') restart()
    setOpen(null)
  }

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setOpen(null)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // intro: slide down
  useGSAP(
    () => {
      gsap.from(barRef.current, { yPercent: -100, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })
    },
    { scope: barRef },
  )

  return (
    <header
      ref={barRef}
      className="glass-bar fixed inset-x-0 top-0 z-[1000] flex h-[30px] items-center justify-between px-1.5 text-[13px] text-white/95 sm:px-3"
    >
      <nav className="flex items-center">
        <MenuButton id="logo" open={open} setOpen={setOpen} items={itemsFor('logo')} onPick={onPick} className="px-1.5">
          <span
            className="grid size-[18px] place-items-center rounded-[5px] text-[11px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c5cff, #22d3ee)' }}
          >
            A
          </span>
        </MenuButton>

        <span className="px-2 font-semibold">{activeName}</span>

        <div className="hidden items-center sm:flex">
          {menuOrder.map((name) => (
            <MenuButton key={name} id={name} open={open} setOpen={setOpen} items={itemsFor(name)} onPick={onPick}>
              {name}
            </MenuButton>
          ))}
        </div>
      </nav>

      <StatusBar open={open} setOpen={setOpen} />
    </header>
  )
}
