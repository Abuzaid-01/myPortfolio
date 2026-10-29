import { useState } from 'react'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Copy, Lock, RotateCw } from 'lucide-react'

export default function BrowserShell({
  url,
  displayUrl,
  title,
  subtitle,
  children,
  accentColor = '#3b82f6',
}) {
  const [copied, setCopied] = useState(false)
  const [reloading, setReloading] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const handleReload = () => {
    setReloading(true)
    setTimeout(() => setReloading(false), 500)
  }

  return (
    <div className="flex h-full flex-col bg-[#0b0f19] text-white">
      {/* Safari / Browser Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1 text-white/40">
          <button
            type="button"
            disabled
            className="grid size-7 place-items-center rounded-md transition disabled:opacity-30"
            aria-label="Back"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            disabled
            className="grid size-7 place-items-center rounded-md transition disabled:opacity-30"
            aria-label="Forward"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={handleReload}
            className={`grid size-7 place-items-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white ${
              reloading ? 'animate-spin' : ''
            }`}
            aria-label="Reload"
            title="Reload preview"
          >
            <RotateCw size={13} />
          </button>
        </div>

        {/* Centered Address Bar */}
        <div className="flex max-w-md flex-1 items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/90 shadow-inner">
          <div className="flex min-w-0 items-center gap-2">
            <Lock size={12} className="shrink-0 text-emerald-400" />
            <span className="truncate font-mono text-[11.5px] text-white/80">
              {displayUrl || url.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-white/50 transition hover:bg-white/10 hover:text-white"
            title="Copy URL"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Open in New Tab primary action */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
          title="Open in a new browser tab"
        >
          <span>Open in new tab</span>
          <ArrowUpRight size={13} />
        </a>
      </div>

      {/* Sub-bar / hint */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-white/[0.015] px-4 py-1.5 text-[11.5px] text-white/50">
        <span className="truncate">
          Viewing in-app <span className="font-medium text-white/80">{title}</span> preview
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center gap-1 font-medium text-accent hover:underline"
        >
          <span>Open externally</span>
          <ArrowUpRight size={11} />
        </a>
      </div>

      {/* Main Content Area */}
      <div className={`min-h-0 flex-1 overflow-y-auto select-text ${reloading ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
        {children}
      </div>
    </div>
  )
}

