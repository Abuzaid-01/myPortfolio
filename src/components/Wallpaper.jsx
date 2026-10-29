import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { wallpaper, wallpapers } from '@/constants'
import { useOS } from '@/store/useOS'

gsap.registerPlugin(useGSAP)

export default function Wallpaper() {
  const layer = useRef(null)
  const wallpaperId = useOS((s) => s.wallpaperId)
  const customWallpaper = useOS((s) => s.customWallpaper)
  const brightness = useOS((s) => s.brightness)
  const wp = wallpapers.find((w) => w.id === wallpaperId) ?? wallpapers[0]

  // Subtle mouse parallax (only on devices with a real pointer)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const x = gsap.quickTo(layer.current, 'x', { duration: 1.4, ease: 'power3.out' })
        const y = gsap.quickTo(layer.current, 'y', { duration: 1.4, ease: 'power3.out' })
        const onMove = (e) => {
          x((e.clientX / window.innerWidth - 0.5) * -34)
          y((e.clientY / window.innerHeight - 0.5) * -34)
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
      })
    },
    { scope: layer },
  )

  // Colours are CSS variables registered with @property (see index.css), so
  // switching presets cross-fades smoothly instead of snapping.
  const vars = {
    '--c1': wp.base[0],
    '--c2': wp.base[1],
    '--b1': wp.blobs[0],
    '--b2': wp.blobs[1],
    '--b3': wp.blobs[2],
    filter: `brightness(${brightness})`,
  }

  return (
    <div data-wallpaper={wp.id} className="wallpaper fixed inset-0 z-0 overflow-hidden bg-[#070a14]" style={vars}>
      <div ref={layer} className="absolute -inset-12">
        {customWallpaper || wallpaper.image ? (
          <img
            src={customWallpaper || wallpaper.image}
            alt="Desktop Wallpaper"
            className="h-full w-full object-cover transition-opacity duration-500"
            draggable={false}
          />
        ) : (
          <>
            <div className="wp-base absolute inset-0" />
            <div
              className="blob"
              style={{ width: '46vw', height: '46vw', left: '-6vw', top: '-8vh', background: 'var(--b1)', animation: 'drift-a 22s ease-in-out infinite' }}
            />
            <div
              className="blob"
              style={{ width: '40vw', height: '40vw', right: '-4vw', top: '6vh', background: 'var(--b2)', animation: 'drift-b 26s ease-in-out infinite' }}
            />
            <div
              className="blob"
              style={{ width: '50vw', height: '42vw', left: '28vw', bottom: '-18vh', background: 'var(--b3)', opacity: 0.7, animation: 'drift-c 30s ease-in-out infinite' }}
            />
          </>
        )}
      </div>

      {/* vignette + film grain for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)' }}
      />
      <div className="grain pointer-events-none absolute inset-0" />
    </div>
  )
}
