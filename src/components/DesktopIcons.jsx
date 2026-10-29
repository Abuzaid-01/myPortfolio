import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { useGSAP } from '@gsap/react'
import { desktopIcons } from '@/constants'
import { useOS } from '@/store/useOS'
import FolderIcon from './FolderIcon'
import { PhotosIcon } from './BrandIcons'

gsap.registerPlugin(Draggable, useGSAP)

function DocIcon({ color, badge }) {
  return (
    <svg viewBox="0 0 64 80" className="h-[66px] w-[52px] drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]" aria-hidden="true">
      <defs>
        <linearGradient id={`doc-${badge}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d8dce6" />
        </linearGradient>
      </defs>
      <path d="M6 4a4 4 0 0 1 4-4h31l17 17v59a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill={`url(#doc-${badge})`} />
      <path d="M41 0l17 17H45a4 4 0 0 1-4-4z" fill="#b4bac8" />
      <rect x="6" y="46" width="52" height="20" rx="3" fill={color} />
      <text x="32" y="60.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif" letterSpacing="0.5">
        {badge}
      </text>
      <g stroke="#b9bfcc" strokeWidth="2" strokeLinecap="round">
        <path d="M14 24h22" />
        <path d="M14 32h30" />
        <path d="M14 39h18" />
      </g>
    </svg>
  )
}

// Draggable desktop shortcuts. Click selects, double-click (or Enter) opens.
// Hidden below md: on phones the dock does the job.
export default function DesktopIcons() {
  const bounds = useRef(null)
  const openWindow = useOS((s) => s.openWindow)
  const [selected, setSelected] = useState(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const els = gsap.utils.toArray('[data-icon]')
        const drags = Draggable.create(els, {
          bounds: bounds.current,
          minimumMovement: 4,
          zIndexBoost: false,
          onPress() {
            setSelected(this.target.dataset.icon)
            gsap.to(this.target, { scale: 1.04, duration: 0.15 })
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
          },
        })
        gsap.from(els, { opacity: 0, x: 24, duration: 0.8, stagger: 0.1, delay: 1.8, ease: 'power3.out' })
        return () => drags.forEach((d) => d.kill())
      })
    },
    { scope: bounds },
  )

  // click on bare desktop deselects
  useEffect(() => {
    const onDown = (e) => {
      if (!e.target.closest?.('[data-icon]')) setSelected(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  return (
    <div ref={bounds} className="pointer-events-none fixed inset-x-0 bottom-[96px] top-[30px] z-[5] hidden md:block">
      <div className="absolute right-5 top-4 flex flex-col items-center gap-4">
        {desktopIcons.map((ic) => {
          const on = selected === ic.id
          return (
            <button
              key={ic.id}
              data-icon={ic.id}
              onDoubleClick={() => openWindow(ic.id)}
              onKeyDown={(e) => e.key === 'Enter' && openWindow(ic.id)}
              onFocus={() => setSelected(ic.id)}
              aria-label={`${ic.label}. Double-click to open`}
              className="pointer-events-auto flex w-[92px] cursor-default flex-col items-center gap-1.5 rounded-lg p-1.5 outline-none"
            >
              <span className={`rounded-lg p-1 transition-colors ${on ? 'bg-white/20' : ''}`}>
                {ic.kind === 'folder' ? (
                  <FolderIcon colors={ic.colors} className="h-[62px] w-[78px] drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]" />
                ) : ic.kind === 'photos' ? (
                  <img
                    src="/photos-icon.png"
                    alt="Photos"
                    className="size-[62px] object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.5)] rounded-[22%]"
                  />
                ) : (
                  <DocIcon color={ic.color} badge={ic.badge} />
                )}
              </span>
              <span
                className={`max-w-full truncate rounded px-1.5 py-px text-[12px] font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] ${
                  on ? 'bg-accent' : ''
                }`}
              >
                {ic.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
