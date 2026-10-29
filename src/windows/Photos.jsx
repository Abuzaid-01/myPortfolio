import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  MapPin,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Wallpaper as WallpaperIcon,
  X,
} from 'lucide-react'
import { galleryPhotos, profile } from '@/constants'
import { useOS } from '@/store/useOS'

const STORAGE_KEY = 'abuzaid-portfolio-photo-favorites'

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : ['photo-1', 'photo-2', 'photo-4']
  } catch {
    return ['photo-1', 'photo-2', 'photo-4']
  }
}

export default function PhotosWindow() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [gridSize, setGridSize] = useState('normal') // 'compact' | 'normal' | 'large'
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [showInfo, setShowInfo] = useState(true)

  const setCustomWallpaper = useOS((s) => s.setCustomWallpaper)
  const clearCustomWallpaper = useOS((s) => s.clearCustomWallpaper)
  const rawCustomWallpaper = useOS((s) => s.customWallpaper)
  const customWallpaper =
    rawCustomWallpaper && rawCustomWallpaper !== 'null' && rawCustomWallpaper !== 'undefined'
      ? rawCustomWallpaper
      : null
  const notify = useOS((s) => s.notify)

  // Save favorites to storage
  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation()
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Filtered photo set
  const filteredPhotos = useMemo(() => {
    if (activeFilter === 'favorites') {
      return galleryPhotos.filter((p) => favorites.includes(p.id))
    }
    if (activeFilter === 'all') {
      return galleryPhotos
    }
    return galleryPhotos.filter((p) => p.category === activeFilter)
  }, [activeFilter, favorites])

  const selectedIndex = filteredPhotos.findIndex((p) => p.id === selectedId)
  const selectedPhoto = selectedIndex !== -1 ? filteredPhotos[selectedIndex] : null

  // Slideshow timer
  useEffect(() => {
    if (!isSlideshow || filteredPhotos.length === 0) return
    const timer = setInterval(() => {
      setSelectedId((prev) => {
        const curr = filteredPhotos.findIndex((p) => p.id === prev)
        const next = (curr + 1) % filteredPhotos.length
        return filteredPhotos[next].id
      })
    }, 3600)
    return () => clearInterval(timer)
  }, [isSlideshow, filteredPhotos])

  // Keyboard navigation
  useEffect(() => {
    if (!selectedId) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedId(null)
        setIsSlideshow(false)
      } else if (e.key === 'ArrowRight') {
        const next = (selectedIndex + 1) % filteredPhotos.length
        setSelectedId(filteredPhotos[next].id)
      } else if (e.key === 'ArrowLeft') {
        const prev = (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length
        setSelectedId(filteredPhotos[prev].id)
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        setIsSlideshow((v) => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, selectedIndex, filteredPhotos])

  const handleSetWallpaper = (photo) => {
    setCustomWallpaper(photo.src)
    notify({
      title: 'Desktop Wallpaper Set',
      body: `Applied "${photo.title}" as your desktop wallpaper`,
      emoji: '🖼️',
    })
  }

  const handleResetWallpaper = () => {
    clearCustomWallpaper()
    notify({
      title: 'Wallpaper Reset',
      body: 'Restored original animated gradient wallpaper',
      emoji: '✨',
    })
  }

  // Count by category
  const counts = {
    all: galleryPhotos.length,
    favorites: favorites.length,
    Portraits: galleryPhotos.filter((p) => p.category === 'Portraits').length,
    Campus: galleryPhotos.filter((p) => p.category === 'Campus').length,
    Moments: galleryPhotos.filter((p) => p.category === 'Moments').length,
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#121316] text-white select-none">
      {/* Top macOS Toolbar */}
      <header className="flex h-13 shrink-0 items-center justify-between border-b border-white/10 bg-[#1a1c22]/90 px-4 backdrop-blur-md">
        {/* Left: Window title & count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src="/photos-icon.png" alt="Photos" className="size-7 rounded-lg object-contain shadow-sm" />
            <div>
              <h1 className="text-xs font-semibold tracking-wide text-white">Photos</h1>
              <span className="text-[10px] text-white/50">{filteredPhotos.length} Photos</span>
            </div>
          </div>
        </div>

        {/* Center: Segmented Filter (on larger screens) */}
        <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-black/30 p-0.5 sm:flex">
          {[
            { id: 'all', label: 'All' },
            { id: 'favorites', label: 'Favorites' },
            { id: 'Portraits', label: 'Portraits' },
            { id: 'Campus', label: 'Campus' },
            { id: 'Moments', label: 'Moments' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveFilter(tab.id)
                setSelectedId(null)
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeFilter === tab.id
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">({counts[tab.id]})</span>
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Grid size toggle */}
          <div className="flex items-center rounded-lg border border-white/10 bg-black/25 p-0.5">
            <button
              type="button"
              title="Compact grid"
              onClick={() => setGridSize('compact')}
              className={`rounded p-1 text-xs transition ${
                gridSize === 'compact' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              type="button"
              title="Normal grid"
              onClick={() => setGridSize('normal')}
              className={`rounded p-1 text-xs transition ${
                gridSize === 'normal' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          {/* Slideshow button */}
          <button
            type="button"
            onClick={() => {
              if (!selectedId && filteredPhotos.length > 0) {
                setSelectedId(filteredPhotos[0].id)
              }
              setIsSlideshow((v) => !v)
            }}
            className={`inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium transition ${
              isSlideshow
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            {isSlideshow ? <Pause size={12} /> : <Play size={12} />}
            <span className="hidden sm:inline">{isSlideshow ? 'Pause' : 'Slideshow'}</span>
          </button>

          {/* Wallpaper status indicator */}
          {customWallpaper && (
            <button
              type="button"
              title="Reset desktop wallpaper"
              onClick={handleResetWallpaper}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={12} />
              <span className="hidden md:inline">Reset Wallpaper</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden w-44 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-white/10 bg-[#16181d] p-2.5 sm:flex">
          <div className="px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Library
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all')
              setSelectedId(null)
            }}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              activeFilter === 'all'
                ? 'bg-sky-500/20 text-sky-300'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <ImageIcon size={14} className="text-sky-400" /> All Photos
            </span>
            <span className="text-[10px] text-white/40">{counts.all}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilter('favorites')
              setSelectedId(null)
            }}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              activeFilter === 'favorites'
                ? 'bg-rose-500/20 text-rose-300'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart size={14} className="text-rose-400 fill-rose-400/40" /> Favorites
            </span>
            <span className="text-[10px] text-white/40">{counts.favorites}</span>
          </button>

          <div className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Categories
          </div>
          {['Portraits', 'Campus', 'Moments'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveFilter(cat)
                setSelectedId(null)
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                activeFilter === cat
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[10px] text-white/40">{counts[cat]}</span>
            </button>
          ))}

          {/* User Profile Mini Card */}
          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-left">
            <div className="flex items-center gap-2">
              <img
                src="/photos/photo-1.jpg"
                alt="Abuzaid"
                className="size-7 rounded-full object-cover border border-white/20"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-semibold text-white">{profile.name}</div>
                <div className="truncate text-[9px] text-white/50">MSIT Delhi</div>
              </div>
            </div>
            <p className="mt-2 text-[10px] leading-tight text-white/50">
              Personal portfolio snapshots & college life.
            </p>
          </div>
        </aside>

        {/* Content Area: Grid View */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredPhotos.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-white/50">
              <Heart size={36} className="mb-2 text-white/20" />
              <p className="text-sm font-medium text-white/80">No favorites yet</p>
              <p className="mt-1 text-xs text-white/40">
                Click the heart on any photo to save it here.
              </p>
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
              >
                View all photos
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-4 sm:gap-5 ${
                gridSize === 'compact'
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                  : gridSize === 'large'
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}
            >
              {filteredPhotos.map((photo) => {
                const isFav = favorites.includes(photo.id)
                const isWp = customWallpaper === photo.src

                return (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedId(photo.id)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl"
                  >
                    {/* Image Aspect Box */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50">
                      <img
                        src={photo.thumb || photo.src}
                        alt={photo.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />

                      {/* Top Overlay Badges */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2.5">
                        <span className="rounded-full border border-black/30 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-md">
                          {photo.category}
                        </span>

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(photo.id, e)}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          className={`pointer-events-auto rounded-full p-1.5 transition backdrop-blur-md ${
                            isFav
                              ? 'bg-rose-500/80 text-white shadow-sm'
                              : 'bg-black/50 text-white/70 hover:bg-black/80 hover:text-rose-400'
                          }`}
                        >
                          <Heart size={13} className={isFav ? 'fill-current' : ''} />
                        </button>
                      </div>

                      {/* Wallpaper active badge */}
                      {isWp && (
                        <div className="absolute bottom-2.5 right-2.5 rounded-full border border-sky-400/40 bg-sky-500/80 px-2 py-0.5 text-[9px] font-semibold text-white shadow-sm backdrop-blur-md">
                          Active Wallpaper
                        </div>
                      )}

                      {/* Bottom Gradient with Info on Hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8 opacity-90 transition-opacity group-hover:opacity-100">
                        <h2 className="truncate text-xs font-semibold text-white">{photo.title}</h2>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-white/60">
                          <span className="flex items-center gap-0.5">
                            <MapPin size={10} /> {photo.location}
                          </span>
                          <span>·</span>
                          <span>{photo.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Full-Screen Inspector / Lightbox Modal */}
      {selectedPhoto && (
        <div className="absolute inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
          {/* Modal Header */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null)
                  setIsSlideshow(false)
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft size={14} /> Back to Gallery
              </button>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white">{selectedPhoto.title}</div>
                <div className="text-[10px] text-white/50">
                  {selectedIndex + 1} of {filteredPhotos.length} · {selectedPhoto.category}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2">
              {/* Slideshow button in modal */}
              <button
                type="button"
                onClick={() => setIsSlideshow((v) => !v)}
                title={isSlideshow ? 'Pause Slideshow' : 'Start Slideshow'}
                className={`inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium transition ${
                  isSlideshow
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {isSlideshow ? <Pause size={13} /> : <Play size={13} />}
                <span className="hidden md:inline">{isSlideshow ? 'Pause' : 'Slideshow'}</span>
              </button>

              {/* Set as Wallpaper Button */}
              <button
                type="button"
                onClick={() => handleSetWallpaper(selectedPhoto)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  customWallpaper === selectedPhoto.src
                    ? 'bg-sky-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <WallpaperIcon size={13} />
                <span className="hidden sm:inline">
                  {customWallpaper === selectedPhoto.src ? 'Wallpaper Applied' : 'Set as Wallpaper'}
                </span>
              </button>

              {/* Favorite Button */}
              <button
                type="button"
                onClick={() => toggleFavorite(selectedPhoto.id)}
                title="Toggle favorite"
                className={`rounded-lg border border-white/15 p-1.5 transition ${
                  favorites.includes(selectedPhoto.id)
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                <Heart
                  size={15}
                  className={favorites.includes(selectedPhoto.id) ? 'fill-current' : ''}
                />
              </button>

              {/* Download original */}
              <a
                href={selectedPhoto.src}
                download={`${selectedPhoto.id}.jpg`}
                title="Download full photo"
                className="inline-flex items-center rounded-lg border border-white/15 bg-white/5 p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <Download size={15} />
              </a>

              {/* Info panel toggle */}
              <button
                type="button"
                onClick={() => setShowInfo((v) => !v)}
                title="Toggle photo info"
                className={`rounded-lg border border-white/15 p-1.5 transition ${
                  showInfo ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Info size={15} />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null)
                  setIsSlideshow(false)
                }}
                className="rounded-lg border border-white/15 bg-white/5 p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          </header>

          {/* Modal Main View */}
          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            {/* Left navigation arrow */}
            <button
              type="button"
              onClick={() => {
                const prev = (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                setSelectedId(filteredPhotos[prev].id)
              }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-3 text-white/80 backdrop-blur-md transition hover:bg-black/90 hover:text-white hover:scale-105"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Photo viewport */}
            <div className="flex min-w-0 flex-1 items-center justify-center p-4 sm:p-8">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-full max-w-full rounded-xl object-contain shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Right navigation arrow */}
            <button
              type="button"
              onClick={() => {
                const next = (selectedIndex + 1) % filteredPhotos.length
                setSelectedId(filteredPhotos[next].id)
              }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-3 text-white/80 backdrop-blur-md transition hover:bg-black/90 hover:text-white hover:scale-105"
            >
              <ChevronRight size={20} />
            </button>

            {/* Slide-out Info Sidebar */}
            {showInfo && (
              <aside className="w-64 shrink-0 border-l border-white/10 bg-[#16181d]/95 p-4 text-xs backdrop-blur-xl animate-in slide-in-from-right duration-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/40">
                  <Info size={13} /> Photo Details
                </div>

                <div className="mt-4 space-y-3.5">
                  <div>
                    <div className="text-[10px] text-white/40">Title</div>
                    <div className="mt-0.5 text-sm font-semibold text-white">
                      {selectedPhoto.title}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-white/40">Description</div>
                    <div className="mt-0.5 leading-relaxed text-white/80">
                      {selectedPhoto.desc}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <div>
                      <div className="text-[10px] text-white/40">Category</div>
                      <div className="mt-0.5 text-white/90">{selectedPhoto.category}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40">Date</div>
                      <div className="mt-0.5 text-white/90">{selectedPhoto.date}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[10px] text-white/40">Location</div>
                    <div className="mt-0.5 flex items-center gap-1 text-white/90">
                      <MapPin size={12} className="text-rose-400" />
                      <span>{selectedPhoto.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[10px] text-white/40">Subject</div>
                    <div className="mt-0.5 text-white/90">
                      Abuzaid · B.Tech CS @ MSIT
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleSetWallpaper(selectedPhoto)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 font-medium text-white transition hover:bg-sky-500"
                    >
                      <WallpaperIcon size={14} /> Set as Desktop Wallpaper
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Bottom Filmstrip thumbnail bar */}
          <footer className="flex h-18 shrink-0 items-center justify-center gap-2.5 overflow-x-auto border-t border-white/10 bg-black/60 px-4 py-2">
            {filteredPhotos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedId(photo.id)}
                className={`relative h-14 w-11 shrink-0 overflow-hidden rounded-lg transition-all ${
                  photo.id === selectedId
                    ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-black scale-105'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.thumb || photo.src}
                  alt={photo.title}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </footer>
        </div>
      )}
    </div>
  )
}

