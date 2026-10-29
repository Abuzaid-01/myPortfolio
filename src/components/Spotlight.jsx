import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  Download,
  Folder,
  Lock,
  Mail,
  Maximize,
  Palette,
  Power,
  Search,
  SquareTerminal,
  CornerDownLeft,
} from 'lucide-react'
import { dockApps, profile, projects, resumeFile, skills } from '@/constants'
import { useOS } from '@/store/useOS'
import { MOD, toggleFullscreen } from '@/lib/platform'
import { restart } from '@/lib/session'
import { ICONS } from './appIcons'

// Spotlight: one searchable index of everything on the site.
// Each item runs `run()`; the overlay closes afterwards.
function useIndex() {
  const openWindow = useOS((s) => s.openWindow)
  const openProject = useOS((s) => s.openProject)
  const lock = useOS((s) => s.lock)
  const nextWallpaper = useOS((s) => s.nextWallpaper)

  return useMemo(() => {
    const open = (href) => () => window.open(href, '_blank', 'noopener,noreferrer')
    const items = []

    dockApps
      .filter((a) => a.id && !a.href && !a.action)
      .forEach((a) =>
        items.push({
          group: 'Apps',
          title: a.label,
          sub: a.app,
          keywords: a.app,
          icon: ICONS[a.icon],
          colors: a.colors,
          fg: a.fg,
          run: () => openWindow(a.id),
        }),
      )

    projects.forEach((p) =>
      items.push({
        group: 'Projects',
        title: p.name,
        sub: p.stack.slice(0, 3).join(' · '),
        keywords: [p.short, p.tagline, ...p.stack].join(' '),
        icon: Folder,
        colors: p.colors,
        fg: '#fff',
        run: () => openProject(p.id),
      }),
    )

    Object.values(skills)
      .flat()
      .forEach((s) =>
        items.push({
          group: 'Skills',
          title: s,
          sub: 'Open in Terminal',
          keywords: 'skill tech stack',
          icon: SquareTerminal,
          colors: ['#3b4252', '#0b0d12'],
          fg: '#7CFFB2',
          run: () => openWindow('terminal'),
        }),
      )

    items.push(
      {
        group: 'Links',
        title: 'Download Resume (PDF)',
        sub: 'Abuzaid_Resume.pdf',
        keywords: 'cv resume download pdf',
        icon: Download,
        colors: ['#ff6b8b', '#e0245e'],
        fg: '#fff',
        run: () => {
          const a = document.createElement('a')
          a.href = resumeFile
          a.download = 'Abuzaid_Resume.pdf'
          a.click()
        },
      },
      {
        group: 'Links',
        title: 'Send an email',
        sub: profile.email,
        keywords: 'mail contact hire',
        icon: Mail,
        colors: ['#6ee7a8', '#16a34a'],
        fg: '#fff',
        run: open(`mailto:${profile.email}`),
      },
      {
        group: 'Links',
        title: 'GitHub',
        sub: profile.github.replace('https://', ''),
        keywords: 'code repos git',
        icon: ICONS.Github,
        colors: ['#2b3137', '#0d1117'],
        fg: '#fff',
        run: () => openWindow('github'),
      },
      {
        group: 'Links',
        title: 'LinkedIn',
        sub: profile.linkedin.replace('https://', ''),
        keywords: 'connect network',
        icon: ICONS.Linkedin,
        colors: ['#3b9bff', '#0a56b8'],
        fg: '#fff',
        run: () => openWindow('linkedin'),
      },
      {
        group: 'Links',
        title: 'X (Twitter)',
        sub: profile.x.replace('https://', ''),
        keywords: 'twitter x social tweets post',
        icon: ICONS.X,
        colors: ['#27272a', '#09090b'],
        fg: '#fff',
        run: () => openWindow('x'),
      },
      {
        group: 'Actions',
        title: 'Lock Screen',
        sub: 'Show the lock screen',
        keywords: 'lock sleep',
        icon: Lock,
        colors: ['#8e8e93', '#48484a'],
        fg: '#fff',
        run: lock,
      },
      {
        group: 'Actions',
        title: 'Change Wallpaper',
        sub: 'Cycle through themes',
        keywords: 'theme background colour color',
        icon: Palette,
        colors: ['#ff9f0a', '#ff375f'],
        fg: '#fff',
        run: nextWallpaper,
      },
      {
        group: 'Actions',
        title: 'Toggle Full Screen',
        sub: 'Enter or leave full screen',
        keywords: 'fullscreen maximize',
        icon: Maximize,
        colors: ['#64d2ff', '#0a84ff'],
        fg: '#fff',
        run: toggleFullscreen,
      },
      {
        group: 'Actions',
        title: 'Restart',
        sub: 'Replay the boot sequence',
        keywords: 'reboot reload boot intro',
        icon: Power,
        colors: ['#ff6961', '#d70015'],
        fg: '#fff',
        run: restart,
      },
    )
    return items
  }, [openWindow, openProject, lock, nextWallpaper])
}

// simple ranking: prefix > word start > substring > keyword match
function score(item, q) {
  const t = item.title.toLowerCase()
  if (t === q) return 100
  if (t.startsWith(q)) return 80
  if (t.split(/[\s/().·-]+/).some((w) => w.startsWith(q))) return 65
  if (t.includes(q)) return 50
  if ((item.sub + ' ' + item.keywords).toLowerCase().includes(q)) return 25
  return 0
}

const GROUP_ORDER = ['Apps', 'Projects', 'Links', 'Actions', 'Skills']
const SUGGESTED = ['Projects', 'Resume', 'Contact', 'Lock Screen']

function Highlight({ text, q }) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-transparent font-semibold text-white underline decoration-accent decoration-2 underline-offset-2">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  )
}

export default function Spotlight() {
  const open = useOS((s) => s.spotlight)
  const close = useOS((s) => s.closeSpotlight)
  const index = useIndex()

  const [show, setShow] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const panel = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const q = query.trim().toLowerCase()

  // flat list, in display order
  const results = useMemo(() => {
    let list
    if (!q) {
      list = SUGGESTED.map((t) => index.find((i) => i.title === t)).filter(Boolean)
      list = [...list, ...index.filter((i) => i.group === 'Projects')]
    } else {
      list = index
        .map((i) => ({ i, s: score(i, q) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s || GROUP_ORDER.indexOf(a.i.group) - GROUP_ORDER.indexOf(b.i.group))
        .map((x) => x.i)
        .slice(0, 12)
    }
    // group, preserving first-seen order of groups by best score
    const groups = []
    list.forEach((item) => {
      const label = !q && SUGGESTED.includes(item.title) ? 'Suggestions' : item.group
      let g = groups.find((x) => x.label === label)
      if (!g) groups.push((g = { label, items: [] }))
      g.items.push(item)
    })
    return groups
  }, [q, index])

  const flat = useMemo(() => results.flatMap((g) => g.items), [results])

  // mount / animate out
  useEffect(() => {
    if (open) {
      setShow(true)
      setQuery('')
      setActive(0)
    } else if (show && root.current) {
      gsap.to(panel.current, { opacity: 0, y: -10, scale: 0.97, duration: 0.16, ease: 'power2.in' })
      gsap.to(root.current, { opacity: 0, duration: 0.2, onComplete: () => setShow(false) })
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useGSAP(
    () => {
      if (!show || !open) return
      gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(
        panel.current,
        { opacity: 0, y: -18, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.5)' },
      )
      inputRef.current?.focus()
    },
    { scope: root, dependencies: [show, open] },
  )

  useEffect(() => setActive(0), [q])

  // keep the highlighted row in view
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, flat])

  const run = (item) => {
    close()
    // let the overlay start closing first so focus/animations don't fight
    setTimeout(() => item.run(), 60)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (flat.length ? (a + 1) % flat.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[active]) run(flat[active])
    }
  }

  if (!show) return null

  let n = -1
  return (
    <div
      ref={root}
      data-spotlight
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search"
      className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/30 px-3 pt-[14vh] backdrop-blur-[3px]"
      onPointerDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={panel}
        className="glass-menu flex max-h-[68vh] w-full max-w-[620px] select-none flex-col overflow-hidden rounded-2xl"
        style={{ boxShadow: '0 30px 90px -20px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.12)' }}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <Search size={20} className="shrink-0 text-white/50" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search projects, skills, apps…"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-[19px] font-light text-white outline-none placeholder:text-white/35"
          />
          <kbd className="kbd hidden sm:grid">esc</kbd>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2" role="listbox" aria-label="Results">
          {flat.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-white/45">
              <Search size={24} className="mx-auto mb-2 text-white/25" />
              No results for “{query}”
            </div>
          ) : (
            results.map((g) => (
              <div key={g.label} className="mb-1">
                <div className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-white/35">
                  {g.label}
                </div>
                {g.items.map((item) => {
                  n += 1
                  const idx = n
                  const Icon = item.icon
                  const isActive = idx === active
                  return (
                    <button
                      key={g.label + item.title}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onMouseMove={() => active !== idx && setActive(idx)}
                      onClick={() => run(item)}
                      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                        isActive ? 'bg-accent' : ''
                      }`}
                    >
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-[9px]"
                        style={{
                          background: `linear-gradient(160deg, ${item.colors[0]}, ${item.colors[1]})`,
                          color: item.fg,
                        }}
                      >
                        <Icon className="size-[17px]" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] text-white">
                          <Highlight text={item.title} q={q} />
                        </span>
                        <span className={`block truncate text-[12px] ${isActive ? "text-white" : "text-white/55"}`}>
                          {item.sub}
                        </span>
                      </span>
                      {isActive && <CornerDownLeft size={15} className="shrink-0 text-white/70" />}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="hidden items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] text-white/40 sm:flex">
          <span className="flex items-center gap-3">
            <span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> navigate</span>
            <span><kbd className="kbd">↵</kbd> open</span>
          </span>
          <span>
            <kbd className="kbd">{MOD}</kbd> <kbd className="kbd">K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  )
}
