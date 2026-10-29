import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export function useNow() {
  const [now, setNow] = useState(() => dayjs())
  useEffect(() => {
    const t = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}
