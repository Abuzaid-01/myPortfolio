import { useEffect, useRef, useState } from 'react'
import { education, experience, profile, projects, skills } from '@/constants'
import { useOS } from '@/store/useOS'

const HOST = 'abuzaid@portfolio'
const START = Date.now()

// ------------------------------------------------------------------
//  Virtual filesystem (read-only). Built from constants, so editing
//  src/constants/index.js updates the terminal too.
// ------------------------------------------------------------------
const SKILL_FILE = {
  Languages: 'languages',
  'Frameworks & APIs': 'frameworks',
  Libraries: 'libraries',
  'Developer Tools': 'tools',
}

const file = (content) => ({ type: 'file', content })
const dir = (children) => ({ type: 'dir', children })

const aboutText = [
  profile.name,
  profile.summary,
  '',
  'Education',
  `  ${education.degree}`,
  `  ${education.school}, ${education.place} (${education.period}) · GPA ${education.gpa}`,
  '',
  'Experience',
  ...experience.map((e) => `  ${e.role} — ${e.org} (${e.period})`),
].join('\n')

const projectMd = (p) =>
  [`# ${p.name}`, p.tagline, '', `stack: ${p.stack.join(', ')}`, p.link ? `link:  ${p.link}` : '', '', ...p.bullets.map((b) => `- ${b}`)]
    .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
    .join('\n')

const FS = dir({
  'about.txt': file(aboutText),
  'contact.txt': file([`email:    ${profile.email}`, `linkedin: ${profile.linkedin}`, `x:        ${profile.x}`, `github:   ${profile.github}`].join('\n')),
  'resume.pdf': { type: 'file', binary: true },
  skills: dir(
    Object.fromEntries(
      Object.entries(skills).map(([cat, items]) => [`${SKILL_FILE[cat] ?? cat.toLowerCase()}.txt`, file(items.join('\n'))]),
    ),
  ),
  projects: dir(Object.fromEntries(projects.map((p) => [`${p.id}.md`, file(projectMd(p))]))),
})

const COMMANDS = [
  'help', 'ls', 'cd', 'cat', 'tree', 'pwd', 'skills', 'projects', 'open', 'neofetch',
  'whoami', 'date', 'echo', 'history', 'clear', 'exit',
]
const APPS = ['resume', 'finder', 'notes', 'photos', 'contact', 'github', 'linkedin', 'x']
const OPEN_TARGETS = [...APPS, 'twitter', 'email', 'gallery', ...projects.map((p) => p.id)]

// resolve a path against the virtual FS -> { node, parts } | null
function resolve(cwd, path = '.') {
  const absolute = /^[~/]/.test(path)
  const parts = absolute ? [] : [...cwd]
  for (const seg of path.replace(/^[~/]\/?/, '').split('/').filter(Boolean)) {
    if (seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  let node = FS
  for (const part of parts) {
    if (node.type !== 'dir' || !node.children[part]) return null
    node = node.children[part]
  }
  return { node, parts }
}

const pathLabel = (cwd) => (cwd.length ? `~/${cwd.join('/')}` : '~')

// ------------------------------------------------------------------
//  Output helpers
// ------------------------------------------------------------------
const LINK_RE = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g

function Linkified({ text }) {
  return text.split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return part
    const href = part.startsWith('http') ? part : `mailto:${part}`
    return (
      <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline decoration-sky-300/40 underline-offset-2 hover:decoration-sky-300">
        {part}
      </a>
    )
  })
}

const Dim = ({ children }) => <span className="text-white/45">{children}</span>
const Err = ({ children }) => <span className="text-rose-400">{children}</span>

function Prompt({ cwd }) {
  return (
    <span className="shrink-0 select-none">
      <span className="text-emerald-400">{HOST}</span> <span className="text-sky-300">{pathLabel(cwd)}</span>{' '}
      <span className="text-white/60">%</span>
    </span>
  )
}

function Skills({ only }) {
  const q = only?.toLowerCase()
  const rows = Object.entries(skills).filter(
    ([cat]) => !q || cat.toLowerCase().includes(q) || SKILL_FILE[cat]?.startsWith(q),
  )
  if (!rows.length) return <Err>skills: no category “{only}” (try: languages, frameworks, libraries, tools)</Err>
  return (
    <div className="space-y-2.5 py-1">
      {rows.map(([cat, items]) => (
        <div key={cat}>
          <div className="text-sky-300">{cat}</div>
          <div className="mt-1 flex flex-wrap gap-1.5 pl-3">
            {items.map((i) => (
              <span key={i} className="rounded border border-white/15 bg-white/[0.06] px-1.5 text-emerald-300">
                {i}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Neofetch() {
  const up = Math.max(1, Math.floor((Date.now() - START) / 1000))
  const uptime = up < 60 ? `${up}s` : `${Math.floor(up / 60)}m ${up % 60}s`
  const rows = [
    ['OS', 'PortfolioOS · macOS-style web desktop'],
    ['Host', 'MSIT Delhi · B.Tech CSE'],
    ['Shell', 'zsh (simulated)'],
    ['Uptime', uptime],
    ['Focus', 'AI/ML · LLM Safety · RAG'],
    ['Languages', skills.Languages.join(', ')],
    ['Projects', String(projects.length)],
    ['Contact', profile.email],
  ]
  return (
    <div className="flex gap-5 py-1">
      <div
        aria-hidden="true"
        className="hidden size-16 shrink-0 place-items-center rounded-2xl text-3xl font-bold text-white shadow-lg shadow-black/40 @md:grid"
        style={{ background: 'linear-gradient(135deg, #7c5cff, #22d3ee)' }}
      >
        A
      </div>
      <div>
        <div className="text-emerald-400">{HOST}</div>
        <div className="text-white/30">─────────────────</div>
        {rows.map(([k, v]) => (
          <div key={k}>
            <span className="text-sky-300">{k}</span>: {v}
          </div>
        ))}
      </div>
    </div>
  )
}

const HELP = [
  ['help', 'show this list'],
  ['ls [path]', 'list files'],
  ['cd <dir>', 'change directory'],
  ['cat <file>', 'print a file'],
  ['tree', 'show the file tree'],
  ['skills [name]', 'languages · frameworks · libraries · tools'],
  ['projects', 'list my projects'],
  ['open <target>', 'resume · github · linkedin · x · email · a project · finder · notes · contact'],
  ['neofetch', 'system summary'],
  ['whoami · pwd · date · echo · history', ''],
  ['clear · exit', ''],
]

function Banner() {
  return (
    <div className="mb-1 text-white/55">
      <div>
        Welcome to <span className="text-white">Abuzaid&apos;s portfolio shell</span>.
      </div>
      <div>
        Type <span className="text-emerald-300">help</span> for commands · <span className="text-white/70">Tab</span> completes ·{' '}
        <span className="text-white/70">↑ ↓</span> history
      </div>
    </div>
  )
}

function treeLines(node, prefix = '') {
  const names = Object.keys(node.children)
  return names.flatMap((name, i) => {
    const last = i === names.length - 1
    const child = node.children[name]
    const line = (
      <div key={prefix + name}>
        <span className="text-white/30">{prefix + (last ? '└── ' : '├── ')}</span>
        <span className={child.type === 'dir' ? 'text-sky-300' : ''}>{name}</span>
      </div>
    )
    return [line, ...(child.type === 'dir' ? treeLines(child, prefix + (last ? '    ' : '│   ')) : [])]
  })
}

// ------------------------------------------------------------------
//  Command runner: pure -> { out: ReactNode[], cwd?, clear?, effect? }
// ------------------------------------------------------------------
function execute(raw, cwd, history) {
  const input = raw.trim()
  if (!input) return { out: [] }
  const [cmd, ...args] = input.split(/\s+/)
  const paths = args.filter((a) => !a.startsWith('-'))

  switch (cmd) {
    case 'help':
      return {
        out: [
          <div key="h" className="py-1">
            {HELP.map(([c, d]) => (
              <div key={c} className="flex gap-3">
                <span className="w-[13.5rem] shrink-0 text-emerald-300 @sm:w-72">{c}</span>
                <span className="text-white/60">{d}</span>
              </div>
            ))}
          </div>,
        ],
      }

    case 'ls':
    case 'll':
    case 'la': {
      const r = resolve(cwd, paths[0])
      if (!r) return { out: [<Err key="e">ls: {paths[0]}: No such file or directory</Err>] }
      if (r.node.type === 'file') return { out: [paths[0]] }
      return {
        out: [
          <div key="l" className="flex flex-wrap gap-x-5 gap-y-0.5">
            {Object.entries(r.node.children).map(([name, n]) => (
              <span key={name} className={n.type === 'dir' ? 'font-semibold text-sky-300' : ''}>
                {name}
                {n.type === 'dir' ? '/' : ''}
              </span>
            ))}
          </div>,
        ],
      }
    }

    case 'cd': {
      if (!paths[0]) return { out: [], cwd: [] }
      const r = resolve(cwd, paths[0])
      if (!r) return { out: [<Err key="e">cd: no such file or directory: {paths[0]}</Err>] }
      if (r.node.type !== 'dir') return { out: [<Err key="e">cd: not a directory: {paths[0]}</Err>] }
      return { out: [], cwd: r.parts }
    }

    case 'pwd':
      return { out: [`/home/abuzaid${cwd.length ? '/' + cwd.join('/') : ''}`] }

    case 'cat': {
      if (!paths.length) return { out: [<Dim key="u">usage: cat &lt;file&gt;</Dim>] }
      return {
        out: paths.map((p) => {
          const r = resolve(cwd, p)
          if (!r) return <Err key={p}>cat: {p}: No such file or directory</Err>
          if (r.node.type === 'dir') return <Err key={p}>cat: {p}: Is a directory</Err>
          if (r.node.binary)
            return (
              <Dim key={p}>
                {p}: binary file. Try <span className="text-emerald-300">open resume</span>
              </Dim>
            )
          return (
            <div key={p} className="py-0.5">
              <Linkified text={r.node.content} />
            </div>
          )
        }),
      }
    }

    case 'tree': {
      const r = resolve(cwd, paths[0])
      if (!r || r.node.type !== 'dir') return { out: [<Err key="e">tree: {paths[0] ?? '.'}: not a directory</Err>] }
      return {
        out: [
          <div key="t" className="py-0.5">
            <div className="text-sky-300">{pathLabel(r.parts)}</div>
            {treeLines(r.node)}
          </div>,
        ],
      }
    }

    case 'skills':
      return { out: [<Skills key="s" only={args[0]} />] }

    case 'projects':
      return {
        out: [
          <div key="p" className="space-y-1.5 py-1">
            {projects.map((p) => (
              <div key={p.id}>
                <span className="text-emerald-300">{p.id}</span> <span className="text-white/35">—</span> {p.tagline}
                {p.link && (
                  <div className="pl-4 text-white/60">
                    <Linkified text={p.link} />
                  </div>
                )}
              </div>
            ))}
            <Dim>
              Tip: <span className="text-white/70">cat projects/floatchat.md</span> · <span className="text-white/70">open ai-bouncer</span>
            </Dim>
          </div>,
        ],
      }

    case 'open': {
      const t = (args[0] ?? '').toLowerCase()
      if (!t) return { out: [<Dim key="u">usage: open &lt;{OPEN_TARGETS.join(' | ')}&gt;</Dim>] }
      const win = t === 'projects' ? 'finder' : t === 'about' ? 'notes' : t === 'twitter' ? 'x' : t
      if (APPS.includes(win)) {
        return { out: [<Dim key="o">Opening {win}…</Dim>], effect: () => useOS.getState().openWindow(win) }
      }
      const ext = {
        email: `mailto:${profile.email}`,
      }[t]
      const proj = projects.find((p) => p.id === t || p.short.toLowerCase() === t)
      const url = ext ?? proj?.link
      if (!url) return { out: [<Err key="e">open: don&apos;t know “{args[0]}”. Try: {OPEN_TARGETS.join(', ')}</Err>] }
      return {
        out: [<Dim key="o">Opening {t}…</Dim>],
        effect: () => (t === 'email' ? (window.location.href = url) : window.open(url, '_blank', 'noopener,noreferrer')),
      }
    }

    case 'neofetch':
      return { out: [<Neofetch key="n" />] }

    case 'whoami':
      return { out: [`${profile.name.toLowerCase()} — ${profile.roles.join(' · ')}`] }

    case 'date':
      return { out: [new Date().toString()] }

    case 'echo':
      return { out: [args.join(' ')] }

    case 'history':
      return { out: history.map((h, i) => <div key={i}><Dim>{String(i + 1).padStart(3)}</Dim>  {h}</div>) }

    case 'clear':
      return { out: [], clear: true }

    case 'exit':
      return { out: [<Dim key="x">logout</Dim>], effect: () => setTimeout(() => useOS.getState().closeWindow('terminal'), 250) }

    case 'sudo':
      return { out: [<Err key="e">{profile.name.toLowerCase()} is not in the sudoers file. This incident will be reported.</Err>] }

    case 'rm':
    case 'mv':
    case 'touch':
    case 'mkdir':
      return { out: [<Err key="e">{cmd}: permission denied: this portfolio is read-only</Err>] }

    default:
      return {
        out: [
          <div key="e">
            <Err>zsh: command not found: {cmd}</Err>
            <div>
              <Dim>
                Type <span className="text-emerald-300">help</span> to see what works.
              </Dim>
            </div>
          </div>,
        ],
      }
  }
}

// ------------------------------------------------------------------
//  Component
// ------------------------------------------------------------------
const QUICK = ['skills', 'ls', 'cat about.txt', 'projects', 'neofetch', 'help']

export default function Terminal() {
  const scroller = useRef(null)
  const inputRef = useRef(null)
  const nextId = useRef(2)
  const hist = useRef(['skills'])
  const histIdx = useRef(1)

  const [cwd, setCwd] = useState([])
  const [value, setValue] = useState('')
  const [entries, setEntries] = useState(() => [
    { id: 0, out: [<Banner key="b" />] },
    { id: 1, cwd: [], input: 'skills', out: execute('skills', [], ['skills']).out },
  ])

  // desktop: focus the prompt right away (on touch it would pop the keyboard)
  useEffect(() => {
    if (window.matchMedia('(hover: hover)').matches) inputRef.current?.focus({ preventScroll: true })
  }, [])

  // keep the newest output in view
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries])

  const run = (raw, { focus = true } = {}) => {
    const input = raw.trim()
    if (input) hist.current.push(input)
    histIdx.current = hist.current.length

    const res = execute(raw, cwd, hist.current)
    setEntries((prev) => {
      if (res.clear) return []
      const entry = { id: nextId.current++, cwd, input: raw, out: res.out }
      return [...prev, entry].slice(-200)
    })
    if (res.cwd) setCwd(res.cwd)
    setValue('')
    res.effect?.()
    if (focus && window.matchMedia('(hover: hover)').matches) inputRef.current?.focus({ preventScroll: true })
  }

  const complete = () => {
    const tokens = value.split(/\s+/)
    const last = tokens[tokens.length - 1]
    let candidates = []
    let prefix = ''

    if (tokens.length === 1) {
      candidates = COMMANDS.filter((c) => c.startsWith(last))
    } else if (tokens[0] === 'open') {
      candidates = OPEN_TARGETS.filter((c) => c.startsWith(last))
    } else if (tokens[0] === 'skills') {
      candidates = Object.values(SKILL_FILE).filter((c) => c.startsWith(last))
    } else {
      const slash = last.lastIndexOf('/') + 1
      prefix = last.slice(0, slash)
      const base = last.slice(slash)
      const r = resolve(cwd, prefix || '.')
      if (r?.node.type === 'dir') {
        candidates = Object.entries(r.node.children)
          .filter(([n]) => n.startsWith(base))
          .map(([n, node]) => n + (node.type === 'dir' ? '/' : ''))
      }
    }
    if (!candidates.length) return

    const head = value.slice(0, value.length - last.length)
    const common = candidates.reduce((a, b) => {
      let i = 0
      while (i < a.length && a[i] === b[i]) i++
      return a.slice(0, i)
    })

    if (candidates.length === 1) {
      const c = candidates[0]
      setValue(head + prefix + c + (c.endsWith('/') ? '' : ' '))
    } else {
      setValue(head + prefix + common)
      setEntries((prev) => [
        ...prev,
        { id: nextId.current++, cwd, input: value, out: [<div key="c" className="text-white/60">{candidates.join('   ')}</div>] },
      ])
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(value)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (histIdx.current > 0) {
        histIdx.current -= 1
        setValue(hist.current[histIdx.current])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx.current < hist.current.length) {
        histIdx.current += 1
        setValue(hist.current[histIdx.current] ?? '')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      complete()
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setEntries([])
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault()
      setEntries((prev) => [...prev, { id: nextId.current++, cwd, input: value + '^C', out: [] }])
      setValue('')
    }
  }

  return (
    <div
      className="@container flex h-full min-h-0 flex-col bg-[#07090d]/80 font-mono text-[12.5px] leading-relaxed text-white/85 @md:text-[13px]"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <div
        ref={scroller}
        data-term-scroll
        onClick={() => !window.getSelection()?.toString() && inputRef.current?.focus({ preventScroll: true })}
        className="min-h-0 flex-1 select-text overflow-auto px-4 pb-2 pt-3"
      >
        {entries.map((e) => (
          <div key={e.id} className="mb-1.5">
            {e.input !== undefined && (
              <div className="flex gap-2">
                <Prompt cwd={e.cwd} />
                <span className="min-w-0 break-all text-white">{e.input}</span>
              </div>
            )}
            {e.out.map((o, i) => (
              <div key={i} data-term-out className="whitespace-pre-wrap break-words">
                {o}
              </div>
            ))}
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Prompt cwd={cwd} />
          <input
            ref={inputRef}
            data-term-input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-white caret-emerald-400 outline-none"
          />
        </div>
      </div>

      {/* quick commands: handy on touch screens, and shows what the shell can do */}
      <div className="flex shrink-0 gap-1.5 overflow-x-auto border-t border-white/10 bg-black/30 px-3 py-1.5">
        {QUICK.map((c) => (
          <button
            key={c}
            onClick={() => run(c)}
            className="shrink-0 rounded-md border border-white/12 bg-white/[0.05] px-2 py-0.5 text-[11.5px] text-white/70 transition hover:bg-white/12 hover:text-white"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
