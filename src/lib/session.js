// Per-tab session flags (boot animation plays once per session).
export const BOOT_KEY = 'portfolio-booted'
export const WELCOME_KEY = 'portfolio-welcomed'

const get = (k) => {
  try {
    return sessionStorage.getItem(k) === '1'
  } catch {
    return false
  }
}
const set = (k) => {
  try {
    sessionStorage.setItem(k, '1')
  } catch {
    /* storage blocked: the flag just won't persist */
  }
}

// Skip the boot sequence for returning visitors and for reduced-motion users.
export const hasBooted = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  } catch {
    /* ignore */
  }
  return get(BOOT_KEY)
}
export const markBooted = () => set(BOOT_KEY)

export const wasWelcomed = () => get(WELCOME_KEY)
export const markWelcomed = () => set(WELCOME_KEY)

// "Restart…" replays the boot sequence.
export const restart = () => {
  try {
    sessionStorage.removeItem(BOOT_KEY)
    sessionStorage.removeItem(WELCOME_KEY)
  } catch {
    /* ignore */
  }
  window.location.reload()
}
