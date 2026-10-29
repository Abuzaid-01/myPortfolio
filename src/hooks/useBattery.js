import { useEffect, useState } from 'react'

// Real battery level where the browser supports it (Chrome/Edge/Android).
// Returns null on Safari/Firefox, so the UI falls back to a plain full icon.
export function useBattery() {
  const [state, setState] = useState(null)

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.getBattery) return
    let battery = null
    let alive = true
    const events = ['levelchange', 'chargingchange']
    const update = () => {
      if (alive && battery) {
        setState({ level: Math.round(battery.level * 100), charging: battery.charging })
      }
    }
    navigator
      .getBattery()
      .then((b) => {
        battery = b
        update()
        events.forEach((e) => b.addEventListener(e, update))
      })
      .catch(() => {})
    return () => {
      alive = false
      if (battery) events.forEach((e) => battery.removeEventListener(e, update))
    }
  }, [])

  return state
}
