import { useEffect, useState } from 'react'
import { weatherLocation } from '@/constants'

// Live temperature from Open-Meteo (free, no key). Refreshes every 15 min.
export function useWeather() {
  const [weather, setWeather] = useState({ temp: null, code: null })

  useEffect(() => {
    const ctrl = new AbortController()
    const { lat, lon } = weatherLocation
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`

    const load = () =>
      fetch(url, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) =>
          setWeather({
            temp: Math.round(d.current.temperature_2m),
            code: d.current.weather_code,
          }),
        )
        .catch(() => {})

    load()
    const t = setInterval(load, 15 * 60 * 1000)
    return () => {
      ctrl.abort()
      clearInterval(t)
    }
  }, [])

  return weather
}
