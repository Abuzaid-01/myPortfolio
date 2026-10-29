import { useState } from 'react'
import { ArrowUpRight, Briefcase, GraduationCap, Hammer, User } from 'lucide-react'
import { education, experience, profile, projects } from '@/constants'
import { useOS } from '@/store/useOS'

// ---------- small building blocks ----------
const Title = ({ children, sub }) => (
  <header className="mb-5">
    <h1 className="text-2xl font-bold tracking-tight text-white @xl:text-3xl">{children}</h1>
    {sub && <p className="mt-1 text-sm text-white/50">{sub}</p>}
  </header>
)

const Fact = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition hover:bg-white/[0.06]">
    <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">{label}</div>
    <div className="mt-1 text-sm font-medium text-white/90">{value}</div>
  </div>
)

const Chip = ({ children }) => (
  <span className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-white/70">
    {children}
  </span>
)

// ---------- the notes ----------
const focusAreas = [
  { project: 'sentrix', area: 'Fraud Defense & Graph ML', line: 'Autonomous tri-vector fraud defense simulating and stopping compound GenAI financial attacks.' },
  { project: 'ai-bouncer', area: 'LLM Safety & Security', line: 'An LLM firewall that catches jailbreaks and zero-day prompt attacks.' },
  { project: 'floatchat', area: 'RAG & Data Systems', line: 'Natural-language queries over 1.27M ocean measurements, via SQL and vector search.' },
  { project: 'trustlens', area: 'Multi-Agent Systems', line: 'LangGraph agents that verify reviews and output a 0–100 trust score.' },
  { project: 'movie-recommendation', area: 'Recommendation Systems', line: 'FastAPI and ML content-based movie recommendation engine over 3,360+ titles.' },
  { project: 'plant-disease', area: 'Computer Vision', line: 'EfficientNet-B2 leaf-disease detection across 9 crops.' },
]

function About() {
  const openWindow = useOS((s) => s.openWindow)

  return (
    <>
      {/* Top Hero Photo Showcase Card with User Photo */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-5 shadow-xl sm:p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          {/* User's Exact Photo */}
          <div className="relative group shrink-0">
            <div className="relative size-36 sm:size-44 overflow-hidden rounded-2xl border-2 border-white/25 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
              <img
                src="/photos/abuzaid-main.jpg"
                alt="Abuzaid"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <button
              type="button"
              onClick={() => openWindow('photos')}
              className="absolute -bottom-2 -right-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/85 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-black hover:scale-105"
            >
              <img src="/photos-icon.png" alt="" className="size-3.5 object-contain" />
              <span>Gallery</span>
            </button>
          </div>

          {/* Profile Header Details */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for AI/ML Opportunities</span>
            </div>

            <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Hey, I&apos;m Abuzaid 👋
            </h1>
            <p className="mt-1 text-base font-semibold text-sky-400 sm:text-lg">
              5th Sem CS Student @ MSIT Delhi
            </p>
            <p className="text-sm font-medium text-white/70">
              AI / ML Developer @ DomAIyn Labs
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75">
                📍 New Delhi, India
              </span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75">
                🎓 B.Tech CSE (2024–2028)
              </span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75">
                ⚡ 50+ Repositories
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bio Text */}
      <div className="space-y-3.5 text-[15px] sm:text-base leading-relaxed text-white/85">
        <p>
          Hey, I am <strong className="text-white font-semibold">Abuzaid</strong> — a{' '}
          <strong className="text-sky-300 font-semibold">5th sem CS student</strong> at{' '}
          <strong className="text-white font-semibold">Maharaja Surajmal Institute of Technology (MSIT)</strong>, Delhi,
          and an <strong className="text-sky-400 font-semibold">AI/ML Developer at DomAIyn Labs</strong>.
        </p>
        <p>
          I build real, production-ready AI systems: from adversarial prompt-defense firewalls intercepting attacks in
          &lt;15ms latency, to conversational RAG pipelines over large-scale datasets and vision-based diagnostic models.
        </p>
        <p className="text-white/70 italic">
          I prefer building over talking — every project in this portfolio has a live URL you can test right now.
        </p>
      </div>

      {/* Key Facts Grid */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Fact label="Current Status" value="5th Sem CS · B.Tech (2024 – 2028)" />
        <Fact label="College" value="MSIT · Maharaja Surajmal Institute of Tech" />
        <Fact label="Work" value="AI / ML Developer @ DomAIyn Labs" />
        <Fact label="Focus Areas" value="LLM Prompt Defense · RAG · Computer Vision" />
        <Fact label="Campus Chapter" value="Dev Trainee @ Microsoft Student Chapter" />
        <Fact label="GPA" value={education.gpa} />
      </div>

      {/* Socials & Photo Gallery Shortcuts */}
      <h2 className="mb-2.5 mt-8 text-xs font-semibold uppercase tracking-widest text-white/40">Connect & Explore</h2>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => openWindow('photos')}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20 cursor-pointer"
        >
          <img src="/photos-icon.png" alt="" className="size-4 object-contain" />
          <span>Photos Gallery</span>
          <ArrowUpRight size={14} className="text-white/60" />
        </button>

        {[
          { label: 'GitHub', action: () => openWindow('github') },
          { label: 'LinkedIn', action: () => openWindow('linkedin') },
          { label: 'X (Twitter)', action: () => openWindow('x') },
          { label: 'Email Me', href: `mailto:${profile.email}` },
        ].map((item) =>
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-white/90 transition hover:bg-white/12"
            >
              {item.label} <ArrowUpRight size={13} className="text-white/45" />
            </a>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-white/90 transition hover:bg-white/12 cursor-pointer"
            >
              {item.label} <ArrowUpRight size={13} className="text-white/45" />
            </button>
          ),
        )}
      </div>
    </>
  )
}

function Education() {
  return (
    <>
      <Title sub={education.place}>Education</Title>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-bold text-white">{education.school}</h2>
          <span className="text-sm tabular-nums text-white/60">{education.period}</span>
        </div>
        <p className="mt-1 text-base text-sky-400 font-medium">{education.degree}</p>
        <p className="mt-1 text-xs text-white/50">{education.affiliation || 'Guru Gobind Singh Indraprastha University (GGSIPU)'}</p>
        
        <div className="mt-5 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${parseFloat(education.gpa) * 10}%`, background: 'linear-gradient(90deg,#7c5cff,#22d3ee)' }}
            />
          </div>
          <span className="text-sm font-bold tabular-nums text-white">GPA {education.gpa}</span>
        </div>

        <div className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/70">
          <strong>Key Coursework:</strong> Machine Learning, Data Structures & Algorithms, Computer Vision, Database Management Systems (DBMS), Operating Systems, Computer Networks.
        </div>
      </div>
    </>
  )
}

function Experience() {
  return (
    <>
      <Title sub="Industry & campus roles">Experience</Title>
      <ol className="relative ml-2 border-l border-white/15 pl-6">
        {experience.map((e) => (
          <li key={e.org} className="relative pb-8 last:pb-0">
            <span
              className="absolute -left-[31px] top-1.5 size-2.5 rounded-full ring-4 ring-[#161824]"
              style={{ background: 'linear-gradient(135deg,#7c5cff,#22d3ee)' }}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h2 className="text-lg font-bold text-white">{e.org}</h2>
              <span className="text-xs tabular-nums text-white/45">{e.period}</span>
            </div>
            <p className="text-sm font-semibold text-[#7dd3fc]">{e.role}</p>
            {e.bullets && e.bullets.length > 0 && (
              <ul className="mt-2.5 space-y-1.5 text-xs text-white/75 leading-relaxed">
                {e.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-sky-400">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {e.tech && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}

function WhatIBuild() {
  return (
    <>
      <Title sub="Six focus areas, six shipped projects">What I Build</Title>
      <div className="grid grid-cols-1 gap-3.5 @lg:grid-cols-2">
        {focusAreas.map((f) => {
          const p = projects.find((x) => x.id === f.project)
          const Wrapper = p?.link ? 'a' : 'div'
          return (
            <Wrapper
              key={f.project}
              {...(p?.link ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4.5 transition hover:bg-white/[0.08]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold text-white">{f.area}</h2>
                  {p?.link && <ArrowUpRight size={15} className="shrink-0 text-white/35 transition group-hover:text-white/80" />}
                </div>
                <p className="mt-1 text-[13px] leading-snug text-white/60">{f.line}</p>
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold text-[#7dd3fc]">{p?.name.split(' — ')[0]}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p?.stack.slice(0, 4).map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            </Wrapper>
          )
        })}
      </div>
    </>
  )
}

const NOTES = [
  { id: 'about', title: 'About Me', preview: "Hey, I'm Abuzaid — 5th sem CS…", icon: User, View: About },
  { id: 'education', title: 'Education', preview: 'MSIT Delhi · B.Tech CSE (5th Sem)', icon: GraduationCap, View: Education },
  { id: 'experience', title: 'Experience', preview: 'DomAIyn Labs · MSIT Chapter', icon: Briefcase, View: Experience },
  { id: 'build', title: 'What I Build', preview: 'Fraud defense, LLM safety, RAG, agents…', icon: Hammer, View: WhatIBuild },
]

export default function Notes() {
  const [activeId, setActiveId] = useState('about')
  const active = NOTES.find((n) => n.id === activeId)
  const View = active.View

  return (
    <div className="@container flex h-full min-h-0">
      {/* sidebar (wide windows) */}
      <aside className="hidden w-60 shrink-0 flex-col gap-1 overflow-auto border-r border-white/10 bg-black/25 p-2.5 @xl:flex">
        <div className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-white/35">Notes</div>
        {NOTES.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveId(n.id)}
            aria-current={n.id === activeId}
            className={`rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
              n.id === activeId ? 'bg-[#f5b301] text-black shadow-md' : 'text-white/85 hover:bg-white/8'
            }`}
          >
            <div className="flex items-center gap-2 text-[13.5px] font-semibold">
              <n.icon size={15} />
              {n.title}
            </div>
            <div className={`mt-0.5 truncate text-[11.5px] ${n.id === activeId ? 'text-black/75' : 'text-white/40'}`}>
              {n.preview}
            </div>
          </button>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* tabs (narrow windows) */}
        <div className="flex gap-1 overflow-x-auto border-b border-white/10 bg-black/20 p-1.5 @xl:hidden">
          {NOTES.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              aria-current={n.id === activeId}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[12.5px] font-medium ${
                n.id === activeId ? 'bg-[#f5b301] text-black font-semibold' : 'text-white/75'
              }`}
            >
              <n.icon size={13} />
              {n.title}
            </button>
          ))}
        </div>

        <article key={activeId} className="min-h-0 flex-1 select-text overflow-auto p-6 @xl:p-8">
          <View />
        </article>
      </div>
    </div>
  )
}
