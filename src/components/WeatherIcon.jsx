import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from 'lucide-react'

// Open-Meteo WMO weather codes -> icon
export default function WeatherIcon({ code, size = 14 }) {
  let Icon = Cloud
  if (code === 0) Icon = Sun
  else if (code === 1 || code === 2) Icon = CloudSun
  else if (code === 3) Icon = Cloud
  else if (code === 45 || code === 48) Icon = CloudFog
  else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) Icon = CloudRain
  else if ((code >= 71 && code <= 77) || code === 85 || code === 86) Icon = CloudSnow
  else if (code >= 95) Icon = CloudLightning
  return <Icon size={size} strokeWidth={2} aria-hidden="true" />
}
