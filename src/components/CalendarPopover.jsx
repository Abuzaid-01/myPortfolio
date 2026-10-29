import { useState } from 'react'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNow } from '@/hooks/useNow'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const btn = 'grid size-7 place-items-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white'

// Month grid opened from the clock. Today is highlighted.
export default function CalendarPopover() {
  const now = useNow()
  const [month, setMonth] = useState(() => dayjs().startOf('month'))

  const lead = month.day() // empty cells before the 1st
  const days = month.daysInMonth()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const isThisMonth = month.isSame(now, 'month')

  return (
    <div
      role="dialog"
      aria-label="Calendar"
      className="glass-menu menu-in absolute right-0 top-[calc(100%+4px)] z-10 max-sm:fixed max-sm:right-2 max-sm:top-[36px] w-[272px] origin-top-right rounded-2xl p-3 text-white"
    >
      <div className="mb-3 text-center">
        <div className="text-3xl font-light tabular-nums">{now.format('h:mm')}<span className="ml-1 text-base text-white/50">{now.format('A')}</span></div>
        <div className="text-xs text-white/50">{now.format('dddd, D MMMM YYYY')}</div>
      </div>

      <div className="flex items-center justify-between">
        <button aria-label="Previous month" className={btn} onClick={() => setMonth((m) => m.subtract(1, 'month'))}>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => setMonth(dayjs().startOf('month'))}
          title="Jump to today"
          className="rounded-md px-2 py-1 text-sm font-semibold transition hover:bg-white/10"
        >
          {month.format('MMMM YYYY')}
        </button>
        <button aria-label="Next month" className={btn} onClick={() => setMonth((m) => m.add(1, 'month'))}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-0.5 text-center text-[12px]">
        {DOW.map((d, i) => (
          <div key={i} className="py-1 text-[11px] font-medium text-white/35">
            {d}
          </div>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <div key={`e${i}`} />
          ) : (
            <div
              key={d}
              className={`mx-auto grid size-8 place-items-center rounded-full tabular-nums ${
                isThisMonth && d === now.date() ? 'bg-accent font-semibold text-white' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              {d}
            </div>
          ),
        )}
      </div>

      {!isThisMonth && (
        <button
          onClick={() => setMonth(dayjs().startOf('month'))}
          className="mt-2 w-full rounded-lg bg-white/[0.08] py-1.5 text-xs text-white/80 transition hover:bg-white/15"
        >
          Today
        </button>
      )}
    </div>
  )
}
