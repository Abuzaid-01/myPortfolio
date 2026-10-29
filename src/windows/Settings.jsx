import { useMemo, useState } from 'react'
import {
  Check,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  Info,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Settings as SettingsIcon,
  Sparkles,
  Sun,
  Volume2,
  Wallpaper as WallpaperIcon,
} from 'lucide-react'
import { education, galleryPhotos, pets, profile, wallpapers } from '@/constants'
import { useOS } from '@/store/useOS'

export default function SettingsWindow() {
  const [activeTab, setActiveTab] = useState('wallpaper')

  // Wallpaper state
  const wallpaperId = useOS((s) => s.wallpaperId)
  const customWallpaper = useOS((s) => s.customWallpaper)
  const setCustomWallpaper = useOS((s) => s.setCustomWallpaper)
  const setWallpaper = useOS((s) => s.setWallpaper)
  const clearCustomWallpaper = useOS((s) => s.clearCustomWallpaper)
  const brightness = useOS((s) => s.brightness)
  const setBrightness = useOS((s) => s.setBrightness)

  // Pet state
  const petId = useOS((s) => s.petId)
  const petEnabled = useOS((s) => s.petEnabled)
  const setPetId = useOS((s) => s.setPetId)
  const togglePet = useOS((s) => s.togglePet)

  const notify = useOS((s) => s.notify)

  const isCustomActive = !!(
    customWallpaper &&
    customWallpaper !== 'null' &&
    customWallpaper !== 'undefined'
  )

  // Find active wallpaper title
  const currentWallpaperInfo = useMemo(() => {
    if (isCustomActive) {
      const match = galleryPhotos.find((p) => p.src === customWallpaper)
      return {
        title: match ? match.title : 'Custom Photo',
        subtitle: match ? `${match.category} · ${match.date}` : 'From Gallery',
        type: 'photo',
        src: customWallpaper,
      }
    }
    const match = wallpapers.find((w) => w.id === wallpaperId) || wallpapers[0]
    return {
      title: `${match.name} Gradient`,
      subtitle: 'Dynamic Animated Mesh Wallpaper',
      type: 'gradient',
      base: match.base,
    }
  }, [isCustomActive, customWallpaper, wallpaperId])

  const handleSelectPhoto = (photo) => {
    setCustomWallpaper(photo.src)
    notify({
      title: 'Wallpaper Updated',
      body: `Set desktop background to "${photo.title}"`,
      emoji: '🖼️',
    })
  }

  const handleSelectGradient = (wp) => {
    setWallpaper(wp.id)
    notify({
      title: 'Wallpaper Updated',
      body: `Restored animated "${wp.name}" gradient`,
      emoji: '✨',
    })
  }

  const handleResetWallpaper = () => {
    clearCustomWallpaper()
    notify({
      title: 'Wallpaper Restored',
      body: 'Restored original animated aurora gradient',
      emoji: '🎨',
    })
  }

  return (
    <div className="flex h-full w-full select-none overflow-hidden bg-[#1a1c22] text-white">
      {/* Left Sidebar */}
      <aside className="w-56 shrink-0 flex-col border-r border-white/10 bg-[#14151a] p-3 hidden sm:flex">
        {/* Profile Card Header */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
          <img
            src="/photos/abuzaid-main.jpg"
            alt="Abuzaid"
            className="size-10 rounded-full object-cover border border-white/20 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-white">{profile.name}</div>
            <div className="truncate text-[10px] text-white/50">5th Sem CS · MSIT</div>
          </div>
        </div>

        <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Preferences
        </div>

        <nav className="space-y-1">
          {[
            { id: 'wallpaper', label: 'Wallpaper', icon: WallpaperIcon, color: 'text-sky-400' },
            { id: 'pet', label: 'Desktop Pet', icon: Sparkles, color: 'text-amber-400' },
            { id: 'display', label: 'Display & Brightness', icon: Sun, color: 'text-yellow-400' },
            { id: 'about', label: 'About Mac & System', icon: Info, color: 'text-indigo-400' },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                  active
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={active ? 'text-white' : tab.color} />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight size={13} className={`opacity-40 ${active ? 'opacity-80' : ''}`} />
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Pane */}
      <main className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
        {/* Mobile Tab Selector */}
        <div className="mb-4 flex gap-1 overflow-x-auto border-b border-white/10 pb-2 sm:hidden">
          {[
            { id: 'wallpaper', label: 'Wallpaper' },
            { id: 'pet', label: 'Pet' },
            { id: 'display', label: 'Display' },
            { id: 'about', label: 'About' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                activeTab === tab.id ? 'bg-sky-600 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== WALLPAPER TAB ==================== */}
        {activeTab === 'wallpaper' && (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Wallpaper Settings
                </h1>
                <p className="mt-1 text-xs text-white/50">
                  Select any photo from your gallery or choose a dynamic animated gradient.
                </p>
              </div>

              {isCustomActive && (
                <button
                  type="button"
                  onClick={handleResetWallpaper}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw size={13} />
                  <span>Reset to Gradient</span>
                </button>
              )}
            </div>

            {/* Current Active Wallpaper Mini Preview */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-4 shadow-xl">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                {/* Mini Display Frame */}
                <div className="relative aspect-video w-full max-w-[240px] shrink-0 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg bg-black">
                  {currentWallpaperInfo.type === 'photo' ? (
                    <img
                      src={currentWallpaperInfo.src}
                      alt="Current Wallpaper"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(135deg, ${currentWallpaperInfo.base[0]}, ${currentWallpaperInfo.base[1]})`,
                      }}
                    />
                  )}

                  {/* Tiny mock macOS menu bar */}
                  <div className="absolute inset-x-0 top-0 flex h-3 items-center justify-between bg-black/50 px-2 text-[6px] text-white/70 backdrop-blur-xs">
                    <span> Finder</span>
                    <span>11:42</span>
                  </div>

                  {/* Tiny mock dock */}
                  <div className="absolute inset-x-0 bottom-1 flex justify-center">
                    <div className="h-2 w-20 rounded-full bg-white/25 backdrop-blur-sm" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-sky-300">
                    <Check size={11} /> Currently Active Desktop Background
                  </div>
                  <h2 className="mt-2 text-base font-bold text-white sm:text-lg">
                    {currentWallpaperInfo.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-white/50">{currentWallpaperInfo.subtitle}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-white/70">
                    Wallpapers persist automatically across reloads and sync with your desktop.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION: Gallery Photos (From /photo) */}
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-md bg-rose-500/20 text-rose-400">
                    <ImageIcon size={13} />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white/90">
                    Photos from Gallery ({galleryPhotos.length})
                  </h2>
                </div>
                <span className="text-[11px] text-white/40">Click any photo to set background</span>
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3">
                {galleryPhotos.map((photo) => {
                  const isCurrent = customWallpaper === photo.src
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => handleSelectPhoto(photo)}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'border-sky-400 ring-2 ring-sky-400/60 shadow-xl shadow-sky-500/10'
                          : 'border-white/10 hover:border-white/30 hover:scale-[1.02] bg-white/[0.03]'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                        <img
                          src={photo.thumb || photo.src}
                          alt={photo.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Top Category Badge */}
                        <span className="absolute left-2 top-2 rounded-full border border-black/30 bg-black/60 px-2 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-md">
                          {photo.category}
                        </span>

                        {/* Active checkmark badge */}
                        {isCurrent && (
                          <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
                            <Check size={14} strokeWidth={2.5} />
                          </span>
                        )}

                        {/* Bottom Overlay Title */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 pt-6">
                          <div className="truncate text-xs font-semibold text-white">
                            {photo.title}
                          </div>
                          <div className="text-[10px] text-white/60">{photo.location}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SECTION: Dynamic Wallpapers (Animated Gradients) */}
            <div className="mt-8">
              <div className="flex items-center gap-2">
                <div className="flex size-5 items-center justify-center rounded-md bg-purple-500/20 text-purple-400">
                  <Palette size={13} />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/90">
                  Dynamic Animated Wallpapers ({wallpapers.length})
                </h2>
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {wallpapers.map((wp) => {
                  const isCurrent = !isCustomActive && wallpaperId === wp.id
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => handleSelectGradient(wp)}
                      className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition cursor-pointer ${
                        isCurrent
                          ? 'border-sky-400 ring-2 ring-sky-400/60 shadow-lg'
                          : 'border-white/10 hover:border-white/30 hover:scale-[1.02]'
                      }`}
                    >
                      <div
                        className="relative aspect-video w-full overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${wp.base[0]}, ${wp.base[1]})`,
                        }}
                      >
                        <div
                          className="absolute -inset-2 opacity-70 blur-md"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${wp.blobs[0]}, transparent 60%)`,
                          }}
                        />

                        {isCurrent && (
                          <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
                            <Check size={12} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                      <div className="bg-[#121316] p-2">
                        <div className="truncate text-xs font-semibold text-white">{wp.name}</div>
                        <div className="text-[10px] text-white/40">Animated</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== DESKTOP PET TAB ==================== */}
        {activeTab === 'pet' && (
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Desktop Pet Settings
            </h1>
            <p className="mt-1 text-xs text-white/50">
              Select your interactive companion that roams your macOS portfolio desktop.
            </p>

            {/* Enable / Disable Toggle */}
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div>
                <div className="text-sm font-semibold text-white">Enable Desktop Pet</div>
                <p className="text-xs text-white/50">
                  Allows the pet to follow cursor, take naps, and react to clicks.
                </p>
              </div>

              <button
                type="button"
                onClick={togglePet}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  petEnabled ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    petEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Character Selection */}
            <div className="mt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Choose Character
              </h2>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pets.map((p) => {
                  const isSelected = petId === p.id && petEnabled
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPetId(p.id)
                        notify({
                          title: 'Pet Changed',
                          body: `Switched companion to ${p.name}`,
                          emoji: p.emoji,
                        })
                      }}
                      className={`flex items-center gap-3.5 rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400'
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl shadow-sm">
                        {p.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">{p.name}</span>
                          {isSelected && (
                            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-semibold text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-white/50 leading-tight">{p.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== DISPLAY TAB ==================== */}
        {activeTab === 'display' && (
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Display & Appearance
            </h1>
            <p className="mt-1 text-xs text-white/50">
              Adjust desktop brightness and interface appearance.
            </p>

            <div className="mt-5 space-y-4">
              {/* Brightness Control */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">Brightness</div>
                  <span className="text-xs font-semibold tabular-nums text-white/60">
                    {Math.round(brightness * 100)}%
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <Sun size={16} className="text-white/40" />
                  <input
                    type="range"
                    min="0.4"
                    max="1.0"
                    step="0.05"
                    value={brightness}
                    onChange={(e) => setBrightness(parseFloat(e.target.value))}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-white/20 accent-sky-400"
                  />
                  <Sun size={20} className="text-white" />
                </div>
              </div>

              {/* Appearance info */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm font-semibold text-white">Appearance Mode</div>
                <p className="mt-1 text-xs text-white/50">
                  macOS Dark Mode is enabled by default with dynamic glass vibrancy and blur effects.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs text-white/80">
                  <Moon size={14} className="text-indigo-400" />
                  <span>Dark Mode (Active)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ABOUT SYSTEM TAB ==================== */}
        {activeTab === 'about' && (
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              About This Portfolio
            </h1>
            <p className="mt-1 text-xs text-white/50">
              System architecture, student developer info, and hardware specs.
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
              <img
                src="/photos/abuzaid-main.jpg"
                alt="Abuzaid"
                className="mx-auto size-20 rounded-full border-2 border-white/25 object-cover shadow-xl"
              />
              <h2 className="mt-3 text-lg font-bold text-white">{profile.name}</h2>
              <p className="text-xs text-sky-400">5th Sem CS Student · MSIT Delhi</p>
              <p className="text-xs text-white/50">AI / ML Developer @ DomAIyn Labs</p>

              <div className="mt-6 grid grid-cols-1 gap-2.5 text-left text-xs sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-white/40">OS Version</div>
                  <div className="mt-0.5 font-medium text-white">macOS Sequoia 15.1 · Web Edition</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-white/40">Architecture</div>
                  <div className="mt-0.5 font-medium text-white">React 19 + Vite 8 + GSAP Physics</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-white/40">College</div>
                  <div className="mt-0.5 font-medium text-white">{education.school}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-white/40">Affiliation</div>
                  <div className="mt-0.5 font-medium text-white">GGSIPU, New Delhi</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
