import { Lock, Maximize, Search, Sun } from 'lucide-react'
import { pets, wallpapers } from '@/constants'
import { useOS } from '@/store/useOS'
import { toggleFullscreen } from '@/lib/platform'

const tile =
  'flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/[0.08] py-3 text-[11px] text-white/85 transition hover:bg-white/[0.16] active:scale-95'

// Dropdown panel from the menu bar's sliders icon: wallpaper, brightness, quick actions.
export default function ControlCenter({ onClose }) {
  const wallpaperId = useOS((s) => s.wallpaperId)
  const setWallpaper = useOS((s) => s.setWallpaper)
  const brightness = useOS((s) => s.brightness)
  const setBrightness = useOS((s) => s.setBrightness)
  const lock = useOS((s) => s.lock)
  const openSpotlight = useOS((s) => s.openSpotlight)
  const petId = useOS((s) => s.petId)
  const petEnabled = useOS((s) => s.petEnabled)
  const setPet = useOS((s) => s.setPet)
  const togglePet = useOS((s) => s.togglePet)

  const pct = Math.round(((brightness - 0.4) / 0.6) * 100)

  return (
    <div
      role="dialog"
      aria-label="Control Center"
      className="glass-menu menu-in absolute right-0 top-[calc(100%+4px)] z-10 max-sm:fixed max-sm:right-2 max-sm:top-[36px] w-[300px] max-w-[calc(100vw-16px)] origin-top-right rounded-2xl p-3 text-white"
    >
      <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">Wallpaper</div>
      <div className="grid grid-cols-5 gap-2">
        {wallpapers.map((w) => {
          const on = w.id === wallpaperId
          return (
            <button
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              aria-label={`${w.name} wallpaper`}
              aria-pressed={on}
              title={w.name}
              className={`relative aspect-square overflow-hidden rounded-xl transition active:scale-90 ${
                on ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e202e]' : 'ring-1 ring-white/15 hover:ring-white/40'
              }`}
              style={{
                background: `radial-gradient(circle at 25% 25%, ${w.blobs[0]}, transparent 62%), radial-gradient(circle at 80% 30%, ${w.blobs[1]}, transparent 60%), radial-gradient(circle at 55% 95%, ${w.blobs[2]}, transparent 60%), ${w.base[0]}`,
              }}
            />
          )
        })}
      </div>
      <div className="mt-1.5 px-1 text-xs text-white/55">
        {wallpapers.find((w) => w.id === wallpaperId)?.name}
      </div>

      {/* Desktop Pet Section in Control Center */}
      <div className="mb-2 mt-4 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
        <span>Desktop Pet</span>
        <button
          type="button"
          onClick={togglePet}
          className="text-[10.5px] font-medium text-accent hover:underline cursor-pointer"
        >
          {petEnabled ? 'Turn off' : 'Turn on'}
        </button>
      </div>
      <div className="grid grid-cols-6 gap-1 rounded-xl bg-white/[0.06] p-1.5">
        {pets.map((p) => {
          const isSelected = p.id === petId && petEnabled
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPet(p.id)}
              aria-label={p.name}
              title={p.name}
              className={`grid aspect-square place-items-center rounded-lg text-sm transition ${
                isSelected
                  ? 'bg-white/20 ring-1 ring-white/50 scale-105'
                  : 'hover:bg-white/10'
              }`}
            >
              {p.emoji}
            </button>
          )
        })}
      </div>

      <div className="mb-2 mt-4 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
        <span>Display</span>
        <span className="tabular-nums normal-case tracking-normal text-white/50">{pct}%</span>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.08] px-3 py-2.5">
        <Sun size={16} className="shrink-0 text-white/70" />
        <input
          type="range"
          min={0.4}
          max={1}
          step={0.01}
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
          aria-label="Brightness"
          className="h-1 w-full cursor-pointer accent-white"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          className={tile}
          onClick={() => {
            onClose()
            setTimeout(openSpotlight, 40)
          }}
        >
          <Search size={17} /> Search
        </button>
        <button className={tile} onClick={toggleFullscreen}>
          <Maximize size={17} /> Full Screen
        </button>
        <button
          className={tile}
          onClick={() => {
            onClose()
            lock()
          }}
        >
          <Lock size={17} /> Lock
        </button>
      </div>
    </div>
  )
}
