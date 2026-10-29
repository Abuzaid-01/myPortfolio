import { create } from 'zustand'
import { wallpapers, windowConfig } from '@/constants'

// Global "operating system" state: windows (open / minimized / maximized / z),
// the active app, plus desktop-level things: wallpaper, brightness, lock screen,
// Spotlight and notifications.
// Window geometry (x, y, size) is NOT stored here. GSAP owns it for smooth drags.

// ---- persisted preferences (localStorage can be blocked: always try/catch) ----
const read = (key, fallback) => {
  try {
    const val = localStorage.getItem(key)
    if (val === null || val === 'null' || val === 'undefined') return fallback
    return val
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    if (value === null || value === undefined || value === 'null' || value === 'undefined') {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, String(value))
    }
  } catch {
    /* ignore */
  }
}

const initialWallpaper = (() => {
  const id = read('portfolio-wallpaper', wallpapers[0].id)
  return wallpapers.some((w) => w.id === id) ? id : wallpapers[0].id
})()

const initialCustomWallpaper = (() => {
  const v = read('portfolio-custom-wallpaper', null)
  if (!v || v === 'null' || v === 'undefined' || typeof v !== 'string' || !v.trim()) {
    try {
      localStorage.removeItem('portfolio-custom-wallpaper')
    } catch {}
    return null
  }
  return v
})()

const initialBrightness = (() => {
  const n = parseFloat(read('portfolio-brightness', '1'))
  return Number.isFinite(n) ? Math.min(1, Math.max(0.4, n)) : 1
})()

const initialPet = (() => {
  const p = read('portfolio-pet', 'dog')
  return ['dog', 'cat', 'shiba', 'tora', 'duck', 'none'].includes(p) ? p : 'dog'
})()

const initialPetEnabled = read('portfolio-pet-enabled', 'true') === 'true'

// ---- windows ----
const blank = { isOpen: false, isMinimized: false, isMaximized: false, z: 0 }
const initialWindows = Object.fromEntries(Object.keys(windowConfig).map((id) => [id, { ...blank }]))

// id of the top-most window that is open and not minimized (or null)
const topVisible = (windows) => {
  let best = null
  for (const [id, w] of Object.entries(windows)) {
    if (w.isOpen && !w.isMinimized && (best === null || w.z > windows[best].z)) best = id
  }
  return best
}

let notificationId = 0

export const useOS = create((set, get) => ({
  // ===== windows =====
  windows: initialWindows,
  activeApp: 'finder', // drives the menu bar title (falls back to Finder)
  zTop: 1,

  // Open a closed window, restore a minimized one, or just bring it to front.
  openWindow: (id) =>
    set((s) => {
      const w = s.windows[id]
      if (!w) return s
      const z = s.zTop + 1
      return {
        zTop: z,
        activeApp: id,
        windows: { ...s.windows, [id]: { ...w, isOpen: true, isMinimized: false, z } },
      }
    }),

  focusWindow: (id) =>
    set((s) => {
      const w = s.windows[id]
      if (!w?.isOpen || (s.activeApp === id && w.z === s.zTop)) return s
      const z = s.zTop + 1
      return { zTop: z, activeApp: id, windows: { ...s.windows, [id]: { ...w, z } } }
    }),

  closeWindow: (id) =>
    set((s) => {
      const windows = {
        ...s.windows,
        [id]: { ...s.windows[id], isOpen: false, isMinimized: false, isMaximized: false },
      }
      return {
        windows,
        activeApp: s.activeApp === id ? (topVisible(windows) ?? 'finder') : s.activeApp,
      }
    }),

  minimizeWindow: (id) =>
    set((s) => {
      const windows = { ...s.windows, [id]: { ...s.windows[id], isMinimized: true } }
      return {
        windows,
        activeApp: s.activeApp === id ? (topVisible(windows) ?? 'finder') : s.activeApp,
      }
    }),

  toggleMaximize: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], isMaximized: !s.windows[id].isMaximized } },
    })),

  // Menu-bar actions: act on the currently active window
  closeActive: () => {
    const { activeApp, windows, closeWindow } = get()
    const w = windows[activeApp]
    if (w?.isOpen && !w.isMinimized) closeWindow(activeApp)
  },
  minimizeActive: () => {
    const { activeApp, windows, minimizeWindow } = get()
    const w = windows[activeApp]
    if (w?.isOpen && !w.isMinimized) minimizeWindow(activeApp)
  },
  zoomActive: () => {
    const { activeApp, windows, toggleMaximize } = get()
    const w = windows[activeApp]
    if (w?.isOpen && !w.isMinimized) toggleMaximize(activeApp)
  },

  // ===== Finder deep link (Spotlight -> a specific project) =====
  finderProject: null,
  finderNonce: 0,
  openProject: (id) => {
    set((s) => ({ finderProject: id, finderNonce: s.finderNonce + 1 }))
    get().openWindow('finder')
  },
  consumeFinderProject: () => set({ finderProject: null }),

  // ===== wallpaper + display =====
  wallpaperId: initialWallpaper,
  customWallpaper: initialCustomWallpaper,
  brightness: initialBrightness,
  setWallpaper: (id) => {
    if (!wallpapers.some((w) => w.id === id)) return
    write('portfolio-wallpaper', id)
    write('portfolio-custom-wallpaper', null)
    set({ wallpaperId: id, customWallpaper: null })
  },
  setCustomWallpaper: (url) => {
    if (!url || url === 'null' || url === 'undefined') return
    write('portfolio-custom-wallpaper', url)
    set({ customWallpaper: url })
  },
  clearCustomWallpaper: () => {
    write('portfolio-custom-wallpaper', null)
    set({ customWallpaper: null })
  },
  nextWallpaper: () => {
    const i = wallpapers.findIndex((w) => w.id === get().wallpaperId)
    get().setWallpaper(wallpapers[(i + 1) % wallpapers.length].id)
  },
  setBrightness: (v) => {
    const b = Math.min(1, Math.max(0.4, v))
    write('portfolio-brightness', b)
    set({ brightness: b })
  },

  // ===== lock screen =====
  locked: false,
  lock: () => set({ locked: true, spotlight: false }),
  unlock: () => set({ locked: false }),

  // ===== Spotlight =====
  spotlight: false,
  openSpotlight: () => set({ spotlight: true }),
  closeSpotlight: () => set({ spotlight: false }),
  toggleSpotlight: () => set((s) => ({ spotlight: !s.spotlight })),

  // ===== notifications =====
  notifications: [],
  notify: (n) => {
    const id = ++notificationId
    set((s) => ({ notifications: [...s.notifications.slice(-2), { id, ...n }] }))
    return id
  },
  dismissNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  // ===== desktop pet =====
  petId: initialPet,
  petEnabled: initialPetEnabled && initialPet !== 'none',
  setPet: (id) => {
    write('portfolio-pet', id)
    if (id === 'none') {
      write('portfolio-pet-enabled', false)
      set({ petId: id, petEnabled: false })
    } else {
      write('portfolio-pet-enabled', true)
      set({ petId: id, petEnabled: true })
    }
  },
  togglePet: () =>
    set((s) => {
      const next = !s.petEnabled
      write('portfolio-pet-enabled', next)
      return { petEnabled: next, petId: next && s.petId === 'none' ? 'dog' : s.petId }
    }),
}))
