import { Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { useGSAP } from '@gsap/react'
import { Maximize2, Minus, X } from 'lucide-react'
import { windowConfig } from '@/constants'
import { useOS } from '@/store/useOS'
import { windowContent } from '@/windows'

gsap.registerPlugin(Draggable, useGSAP)

const MENU_H = 30 // menu bar height
const DOCK_SAFE = 96 // space kept free for the dock
const KEEP_VISIBLE = 120 // px of a window that must stay on screen
const MIN_W = 340
const MIN_H = 220

const isMobile = () => window.innerWidth < 768

function computeLayout(cfg, k) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (vw < 768) {
    return { x: 8, y: MENU_H + 8, width: vw - 16, height: vh - MENU_H - 8 - DOCK_SAFE }
  }
  const width = Math.min(cfg.width, vw - 40)
  const height = Math.min(cfg.height, vh - MENU_H - DOCK_SAFE - 12)
  const off = (k % 6) * 28 - 56 // cascade, so windows don't stack exactly
  const x = gsap.utils.clamp(10, Math.max(10, vw - width - 10), (vw - width) / 2 + off)
  const y = gsap.utils.clamp(
    MENU_H + 8,
    Math.max(MENU_H + 8, vh - DOCK_SAFE - height),
    MENU_H + (vh - MENU_H - DOCK_SAFE - height) / 2 + off * 0.6,
  )
  return { x, y, width, height }
}

const maxRect = () => ({
  x: 8,
  y: MENU_H + 6,
  width: window.innerWidth - 16,
  height: window.innerHeight - MENU_H - 6 - DOCK_SAFE,
})

// where the window should "suck into" when minimized: the dock icon
function dockTarget(id, node) {
  const icon = document.querySelector(`[data-dock-id="${id}"]`)
  const r = icon?.getBoundingClientRect()
  const cx = r ? r.left + r.width / 2 : window.innerWidth / 2
  const cy = r ? r.top + r.height / 2 : window.innerHeight
  return { x: cx - node.offsetWidth / 2, y: cy - node.offsetHeight / 2 }
}

function Light({ color, label, onClick, active, children }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid size-3 place-items-center rounded-full border border-black/25 text-black/70 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70"
      style={{ background: active ? color : 'rgba(255,255,255,0.22)' }}
    >
      <span className="opacity-0 transition-opacity group-hover:opacity-100">{children}</span>
    </button>
  )
}

export default function Window({ id }) {
  const cfg = windowConfig[id]
  const Content = windowContent[id]

  const { isOpen, isMinimized, isMaximized, z } = useOS((s) => s.windows[id])
  const isActive = useOS((s) => s.activeApp === id)
  const focusWindow = useOS((s) => s.focusWindow)
  const closeWindow = useOS((s) => s.closeWindow)
  const minimizeWindow = useOS((s) => s.minimizeWindow)
  const toggleMaximize = useOS((s) => s.toggleMaximize)

  const el = useRef(null)
  const bar = useRef(null)
  const drag = useRef(null)
  const resizing = useRef(null)
  const saved = useRef({ min: { x: 0, y: 0 }, max: { x: 0, y: 0, width: 0, height: 0 } })
  const prev = useRef({ open: false, min: false, max: false })

  const [show, setShow] = useState(false) // content mounted (kept until the close animation ends)
  const [mobile, setMobile] = useState(isMobile)

  // "latest value" refs so GSAP callbacks / effects never read stale state
  const flags = useRef({})
  flags.current = { open: isOpen, min: isMinimized, max: isMaximized, mobile }

  const syncDrag = () => {
    const f = flags.current
    drag.current?.enabled(f.open && !f.min && !f.max && !f.mobile)
  }

  // ---- create the draggable once ----
  useGSAP(
    () => {
      const node = el.current
      const bounds = () => ({
        minX: -(node.offsetWidth - KEEP_VISIBLE),
        maxX: window.innerWidth - KEEP_VISIBLE,
        minY: MENU_H,
        maxY: window.innerHeight - 48,
      })

      const [d] = Draggable.create(node, {
        type: 'x,y',
        trigger: bar.current,
        dragClickables: false, // traffic-light buttons stay clickable
        zIndexBoost: false, // z-index is managed by the store
        minimumMovement: 3,
        cursor: 'default',
        activeCursor: 'default',
        bounds: bounds(),
        onPress() {
          this.applyBounds(bounds())
        },
      })
      d.disable()
      drag.current = d

      const onResize = () => {
        const m = isMobile()
        flags.current.mobile = m
        setMobile(m)
        if (!flags.current.open) return
        if (m) {
          gsap.set(node, computeLayout(cfg, 0))
        } else if (flags.current.max) {
          gsap.set(node, maxRect())
        } else {
          const b = bounds()
          gsap.set(node, {
            x: gsap.utils.clamp(b.minX, b.maxX, gsap.getProperty(node, 'x')),
            y: gsap.utils.clamp(b.minY, b.maxY, gsap.getProperty(node, 'y')),
          })
        }
        d.update()
        syncDrag()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    },
    { scope: el },
  )

  // ---- open / close ----
  useEffect(() => {
    if (prev.current.open === isOpen) return
    prev.current.open = isOpen
    const node = el.current
    gsap.killTweensOf(node)

    if (isOpen) {
      const m = isMobile()
      setMobile(m)
      flags.current.mobile = m
      const others = Object.entries(useOS.getState().windows).filter(([k, w]) => k !== id && w.isOpen).length
      gsap.set(node, {
        ...computeLayout(cfg, others),
        visibility: 'visible',
        scale: 0.86,
        opacity: 0,
        transformOrigin: '50% 50%',
      })
      drag.current?.update()
      setShow(true)
      syncDrag()
      gsap.to(node, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' })
    } else {
      gsap.to(node, {
        scale: 0.9,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(node, { visibility: 'hidden', scale: 1 })
          setShow(false)
        },
      })
      syncDrag()
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- minimize to dock / restore ----
  useEffect(() => {
    if (prev.current.min === isMinimized) return
    prev.current.min = isMinimized
    if (!flags.current.open) return
    const node = el.current
    gsap.killTweensOf(node)

    if (isMinimized) {
      saved.current.min = { x: gsap.getProperty(node, 'x'), y: gsap.getProperty(node, 'y') }
      const t = dockTarget(id, node)
      gsap.to(node, {
        x: t.x,
        y: t.y,
        scale: 0.06,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => gsap.set(node, { visibility: 'hidden' }),
      })
    } else {
      gsap.set(node, { visibility: 'visible' })
      gsap.to(node, {
        x: saved.current.min.x,
        y: saved.current.min.y,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => drag.current?.update(),
      })
    }
    syncDrag()
  }, [isMinimized]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- zoom (maximize) / restore ----
  useEffect(() => {
    if (prev.current.max === isMaximized) return
    prev.current.max = isMaximized
    syncDrag()
    if (!flags.current.open || flags.current.mobile) return
    const node = el.current

    if (isMaximized) {
      saved.current.max = {
        x: gsap.getProperty(node, 'x'),
        y: gsap.getProperty(node, 'y'),
        width: node.offsetWidth,
        height: node.offsetHeight,
      }
      gsap.to(node, { ...maxRect(), duration: 0.42, ease: 'power3.inOut', onComplete: () => drag.current?.update() })
    } else {
      gsap.to(node, { ...saved.current.max, duration: 0.42, ease: 'power3.inOut', onComplete: () => drag.current?.update() })
    }
  }, [isMaximized]) // eslint-disable-line react-hooks/exhaustive-deps

  // keep drag state right when `mobile` flips
  useEffect(() => {
    syncDrag()
  }, [mobile]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- resize handle (bottom-right corner) ----
  const onResizeDown = (e) => {
    if (isMaximized || mobile) return
    e.preventDefault()
    e.stopPropagation()
    const node = el.current
    resizing.current = {
      sx: e.clientX,
      sy: e.clientY,
      sw: node.offsetWidth,
      sh: node.offsetHeight,
      left: gsap.getProperty(node, 'x'),
      top: gsap.getProperty(node, 'y'),
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onResizeMove = (e) => {
    const r = resizing.current
    if (!r) return
    gsap.set(el.current, {
      width: gsap.utils.clamp(MIN_W, Math.max(MIN_W, window.innerWidth - r.left - 4), r.sw + e.clientX - r.sx),
      height: gsap.utils.clamp(MIN_H, Math.max(MIN_H, window.innerHeight - r.top - 4), r.sh + e.clientY - r.sy),
    })
  }
  const onResizeUp = () => {
    resizing.current = null
  }

  return (
    <section
      ref={el}
      data-win={id}
      aria-label={cfg.title}
      onPointerDownCapture={() => focusWindow(id)}
      style={{ zIndex: 100 + z }}
      className={`win invisible fixed left-0 top-0 flex flex-col overflow-hidden rounded-xl ${isActive ? 'win-active' : ''}`}
    >
      <div
        ref={bar}
        data-bar
        onDoubleClick={() => !mobile && toggleMaximize(id)}
        className="relative flex h-9 shrink-0 select-none items-center border-b border-white/10 bg-white/[0.04] px-3"
      >
        <div className="group relative z-10 flex items-center gap-2">
          <Light color="#ff5f57" label="Close" active={isActive} onClick={() => closeWindow(id)}>
            <X size={9} strokeWidth={3.2} />
          </Light>
          <Light color="#febc2e" label="Minimize" active={isActive} onClick={() => minimizeWindow(id)}>
            <Minus size={9} strokeWidth={3.2} />
          </Light>
          {!mobile && (
            <Light color="#28c840" label={isMaximized ? 'Restore' : 'Zoom'} active={isActive} onClick={() => toggleMaximize(id)}>
              <Maximize2 size={8} strokeWidth={3} />
            </Light>
          )}
        </div>
        <h2
          className={`pointer-events-none absolute inset-x-16 truncate text-center text-[13px] font-medium transition-colors ${
            isActive ? 'text-white/90' : 'text-white/45'
          }`}
        >
          {cfg.title}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {show && (
          <Suspense fallback={<div className="grid h-full place-items-center text-sm text-white/40">Loading…</div>}>
            <Content />
          </Suspense>
        )}
      </div>

      {!mobile && !isMaximized && (
        <div
          data-resize
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          onPointerCancel={onResizeUp}
          className="absolute bottom-0 right-0 z-20 size-5 cursor-nwse-resize touch-none"
          aria-hidden="true"
        />
      )}
    </section>
  )
}
