export const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '')

// label for the primary modifier key
export const MOD = isMac ? '⌘' : 'Ctrl'

export const hasHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

export const toggleFullscreen = () => {
  if (document.fullscreenElement) document.exitFullscreen?.()
  else document.documentElement.requestFullscreen?.()
}
