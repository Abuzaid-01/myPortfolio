import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, FileText, LayoutGrid, Search, X } from 'lucide-react'
import { profile, projects } from '@/constants'
import { useOS } from '@/store/useOS'
import { GithubIcon, LinkedinIcon, PhotosIcon, XIcon } from '@/components/BrandIcons'
import FolderIcon from '@/components/FolderIcon'

const isGithub = (url) => /github\.com/.test(url)

const navBtn =
  'grid size-7 place-items-center rounded-md text-white/75 transition hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent'

// ---------- one project, opened ----------
function ProjectView({ project: p, onTag, onOpen }) {
  const others = projects.filter((x) => x.id !== p.id)
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start gap-4">
        <FolderIcon colors={p.colors} className="h-16 w-20 shrink-0" />
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-white @xl:text-2xl">{p.name}</h1>
          <p className="mt-1 text-sm text-white/55">{p.tagline}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {p.link && (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-110"
          >
            {isGithub(p.link) ? <GithubIcon className="size-4" /> : null}
            {isGithub(p.link) ? 'View on GitHub' : 'Open live demo'}
            <ArrowUpRight size={14} />
          </a>
        )}
        {p.demo && p.demo !== p.link && (
          <a
            href={p.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-white/12"
          >
            Open live demo
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2.5 @lg:grid-cols-3">
        {p.metrics.map((m) => (
          <div key={m.value} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <div className="break-words text-lg font-semibold leading-tight text-white">{m.value}</div>
            <div className="mt-0.5 text-xs leading-snug text-white/50">{m.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-2 mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/40">
        <FileText size={13} /> README.md
      </h2>
      <ul className="space-y-2.5">
        {p.bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-[13.5px] leading-relaxed text-white/80">
            <span className="mt-[9px] size-1.5 shrink-0 rounded-full" style={{ background: p.colors[0] }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <h2 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-widest text-white/40">Built with</h2>
      <div className="flex flex-wrap gap-1.5">
        {p.stack.map((t) => (
          <button
            key={t}
            onClick={() => onTag(t)}
            title={`Find other projects using ${t}`}
            className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-xs text-white/75 transition hover:bg-white/15 hover:text-white"
          >
            {t}
          </button>
        ))}
      </div>

      <h2 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-widest text-white/40">More projects</h2>
      <div className="flex flex-wrap gap-2 pb-2">
        {others.map((o) => (
          <button
            key={o.id}
            onClick={() => onOpen(o.id)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3 text-sm text-white/85 transition hover:bg-white/10"
          >
            <FolderIcon colors={o.colors} className="h-5 w-6" />
            {o.short}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- the app ----------
export default function Finder() {
  const openWindow = useOS((s) => s.openWindow)
  const finderProject = useOS((s) => s.finderProject)
  const finderNonce = useOS((s) => s.finderNonce)
  const consumeFinderProject = useOS((s) => s.consumeFinderProject)
  const [nav, setNav] = useState({ stack: [null], i: 0 }) // null = all projects (grid)
  const [query, setQuery] = useState('')

  const current = nav.stack[nav.i]
  const project = projects.find((p) => p.id === current)

  const go = (to) =>
    setNav((n) => (n.stack[n.i] === to ? n : { stack: [...n.stack.slice(0, n.i + 1), to], i: n.i + 1 }))
  const back = () => setNav((n) => ({ ...n, i: Math.max(0, n.i - 1) }))
  const forward = () => setNav((n) => ({ ...n, i: Math.min(n.stack.length - 1, n.i + 1) }))

  // deep link from Spotlight: jump straight into a project (also on first mount)
  useEffect(() => {
    if (!finderProject) return
    setQuery('')
    go(finderProject)
    consumeFinderProject()
  }, [finderNonce]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSearch = (v) => {
    setQuery(v)
    if (v && current !== null) go(null)
  }
  const searchTag = (tag) => {
    setQuery(tag)
    go(null)
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((p) => [p.name, p.tagline, ...p.stack, ...p.bullets].join(' ').toLowerCase().includes(q))
  }, [query])

  const sideBtn = (active) =>
    `flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors ${
      active ? 'bg-accent text-white' : 'text-white/80 hover:bg-white/8'
    }`

  return (
    <div className="@container flex h-full min-h-0 flex-col">
      {/* toolbar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-white/[0.03] px-2.5 py-1.5">
        <div className="flex">
          <button aria-label="Back" onClick={back} disabled={nav.i === 0} className={navBtn}>
            <ChevronLeft size={18} />
          </button>
          <button aria-label="Forward" onClick={forward} disabled={nav.i >= nav.stack.length - 1} className={navBtn}>
            <ChevronRight size={18} />
          </button>
        </div>

        <nav aria-label="Path" className="min-w-0 flex-1 truncate text-sm font-semibold text-white/90">
          {project ? (
            <>
              <button onClick={() => go(null)} className="hidden font-medium text-white/50 hover:text-white @md:inline">
                Projects
              </button>
              <span className="mx-1.5 hidden text-white/30 @md:inline">/</span>
              {project.short}
            </>
          ) : (
            'Projects'
          )}
        </nav>

        <label className="relative w-36 shrink-0 @xl:w-52">
          <Search size={13} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search projects"
            placeholder="Search name or tech"
            className="h-7 w-full rounded-md border border-white/12 bg-black/25 pl-7 pr-6 text-xs text-white outline-none placeholder:text-white/35 focus:border-accent"
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/45 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </label>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        <aside className="hidden w-44 shrink-0 flex-col gap-0.5 overflow-auto border-r border-white/10 bg-black/20 p-2 @2xl:flex">
          <div className="px-2 pb-0.5 pt-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-white/35">Favorites</div>
          <button className={sideBtn(current === null)} onClick={() => go(null)}>
            <LayoutGrid size={14} /> All Projects
          </button>
          <button className={sideBtn(false)} onClick={() => openWindow('photos')}>
            <PhotosIcon className="size-3.5" /> Photos Gallery
          </button>
          <button className={sideBtn(false)} onClick={() => openWindow('resume')}>
            <FileText size={14} /> Resume
          </button>

          <div className="px-2 pb-0.5 pt-3 text-[10.5px] font-semibold uppercase tracking-widest text-white/35">Projects</div>
          {projects.map((p) => (
            <button key={p.id} className={sideBtn(current === p.id)} onClick={() => go(p.id)}>
              <FolderIcon colors={p.colors} className="h-3.5 w-4 shrink-0" />
              <span className="truncate">{p.short}</span>
            </button>
          ))}

          <div className="px-2 pb-0.5 pt-3 text-[10.5px] font-semibold uppercase tracking-widest text-white/35">Links</div>
          <button type="button" className={sideBtn(false)} onClick={() => openWindow('github')}>
            <GithubIcon className="size-3.5" /> GitHub
          </button>
          <button type="button" className={sideBtn(false)} onClick={() => openWindow('linkedin')}>
            <LinkedinIcon className="size-3.5" /> LinkedIn
          </button>
          <button type="button" className={sideBtn(false)} onClick={() => openWindow('x')}>
            <XIcon className="size-3.5" /> X (Twitter)
          </button>
        </aside>

        {/* content */}
        <div className="min-w-0 flex-1 select-text overflow-auto p-5">
          {project ? (
            <ProjectView project={project} onTag={searchTag} onOpen={go} />
          ) : shown.length === 0 ? (
            <div className="grid h-full place-items-center text-center text-sm text-white/50">
              <div>
                <Search size={26} className="mx-auto mb-2 text-white/30" />
                <p>
                  No projects match <span className="font-medium text-white/80">“{query}”</span>
                </p>
                <button onClick={() => setQuery('')} className="mt-2 text-accent hover:underline">
                  Clear search
                </button>
              </div>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-3">
              {shown.map((p) => (
                <button
                  key={p.id}
                  onClick={() => go(p.id)}
                  aria-label={`Open ${p.short}`}
                  className="group flex flex-col items-center rounded-xl p-3 text-center outline-none transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <FolderIcon colors={p.colors} className="h-[76px] w-24 drop-shadow-[0_8px_14px_rgba(0,0,0,0.45)] transition-transform group-hover:-translate-y-0.5" />
                  <span className="mt-2 text-[13px] font-medium leading-tight text-white">{p.short}</span>
                  <span className="mt-0.5 line-clamp-1 text-[11px] text-white/45">{p.stack.slice(0, 2).join(' · ')}</span>
                </button>
              ))}
            </div>
            {!query && (
              <p className="mt-10 text-center text-xs text-white/30">
                Click a folder to open it · search by technology, e.g. “FAISS”
              </p>
            )}
            </>
          )}
        </div>
      </div>

      {/* status bar */}
      <footer className="shrink-0 border-t border-white/10 bg-black/20 px-3 py-1 text-center text-[11px] text-white/45">
        {project
          ? `${project.bullets.length} highlights · ${project.stack.length} technologies`
          : `${shown.length} ${shown.length === 1 ? 'item' : 'items'}${query ? ` matching “${query}”` : ''}`}
      </footer>
    </div>
  )
}
