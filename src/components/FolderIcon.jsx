import { useId } from 'react'

// macOS-style folder icon, tinted with two colours (light -> dark).
export default function FolderIcon({ colors, className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 96 80" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[1]} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <path d="M6 14a6 6 0 0 1 6-6h22l8 8h42a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill={`url(#${id}b)`} />
      <path d="M6 28a6 6 0 0 1 6-6h72a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill={`url(#${id}f)`} />
      <path d="M12 23.5h72" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
