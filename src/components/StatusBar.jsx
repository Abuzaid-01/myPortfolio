import { Search, SlidersHorizontal, Wifi } from 'lucide-react'
import { useNow } from '@/hooks/useNow'
import { useBattery } from '@/hooks/useBattery'
import { useWeather } from '@/hooks/useWeather'
import { useOS } from '@/store/useOS'
import { pets, weatherLocation } from '@/constants'
import BatteryIcon from './BatteryIcon'
import WeatherIcon from './WeatherIcon'
import ControlCenter from './ControlCenter'
import CalendarPopover from './CalendarPopover'
import PetPopover from './PetPopover'

const iconBtn = 'grid h-5 w-6 place-items-center rounded transition-colors hover:bg-white/10'

// Right side of the menu bar: pet, weather, battery, wifi, search, control center, clock.
// `open` / `setOpen` are shared with the menus so only one popover is open at a time.
export default function StatusBar({ open, setOpen }) {
  const now = useNow()
  const battery = useBattery()
  const weather = useWeather()
  const openSpotlight = useOS((s) => s.openSpotlight)
  const petId = useOS((s) => s.petId)
  const petEnabled = useOS((s) => s.petEnabled)

  const activePet = petEnabled
    ? (pets.find((p) => p.id === petId) ?? pets[0])
    : pets.find((p) => p.id === 'none')

  return (
    <div className="flex items-center gap-0.5 sm:gap-1.5">
      {/* Desktop Pet selector in Menu Bar placed right near temperature */}
      <div className="relative">
        <button
          aria-label="Desktop Pet"
          aria-expanded={open === 'pet'}
          onClick={() => setOpen(open === 'pet' ? null : 'pet')}
          className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors ${
            open === 'pet' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
          title={`Desktop Pet · ${activePet?.name ?? 'Pet'}`}
        >
          <span className="text-[13px]">{activePet?.emoji ?? '🐾'}</span>
          <span className="hidden xl:inline text-white/80 font-medium">{activePet?.short ?? 'Pet'}</span>
        </button>
        {open === 'pet' && <PetPopover onClose={() => setOpen(null)} />}
      </div>

      <span className="hidden items-center gap-1.5 px-1.5 md:flex" title={`Weather · ${weatherLocation.label}`}>
        <WeatherIcon code={weather.code} />
        <span className="tabular-nums">{weather.temp ?? '--'}°C</span>
      </span>

      <span className="px-1">
        {battery ? (
          <BatteryIcon level={battery.level} charging={battery.charging} showPercent />
        ) : (
          <BatteryIcon level={100} />
        )}
      </span>

      <Wifi size={15} className="hidden sm:block" aria-hidden="true" />

      <button
        aria-label="Search"
        onClick={() => {
          setOpen(null)
          openSpotlight()
        }}
        className={iconBtn}
      >
        <Search size={14} />
      </button>

      <div className="relative">
        <button
          aria-label="Control Center"
          aria-expanded={open === 'cc'}
          onClick={() => setOpen(open === 'cc' ? null : 'cc')}
          className={`${iconBtn} ${open === 'cc' ? 'bg-white/20' : ''}`}
        >
          <SlidersHorizontal size={14} />
        </button>
        {open === 'cc' && <ControlCenter onClose={() => setOpen(null)} />}
      </div>

      <div className="relative">
        <button
          aria-label="Calendar"
          aria-expanded={open === 'cal'}
          onClick={() => setOpen(open === 'cal' ? null : 'cal')}
          className={`flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors ${
            open === 'cal' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <span className="hidden sm:inline">{now.format('ddd D MMM')}</span>
          <span className="tabular-nums">{now.format('h:mm A')}</span>
        </button>
        {open === 'cal' && <CalendarPopover />}
      </div>
    </div>
  )
}
