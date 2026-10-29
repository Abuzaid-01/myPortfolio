export default function BatteryIcon({ level = 100, charging = false, showPercent = false }) {
  const fill = Math.max(0, Math.min(100, level))
  const color = charging ? '#34d399' : fill <= 20 ? '#f87171' : '#ffffff'

  return (
    <span className="flex items-center gap-1" title={`Battery ${fill}%${charging ? ' (charging)' : ''}`}>
      {showPercent && <span className="hidden text-[12px] tabular-nums sm:inline">{fill}%</span>}
      <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" opacity="0.5" />
        <rect x="2" y="2" width={(19 * fill) / 100} height="9" rx="2" fill={color} />
        <path d="M24 4.2v4.6c.9-.3 1.5-1.2 1.5-2.3S24.9 4.5 24 4.2z" fill="currentColor" opacity="0.5" />
      </svg>
    </span>
  )
}
