import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail, Send } from 'lucide-react'
import { profile } from '@/constants'
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/BrandIcons'

const host = (u) => u.replace(/^https?:\/\/(www\.)?/, '')

function Row({ icon: Icon, label, value, href, tint, children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 pr-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg text-white" style={{ background: tint }}>
        <Icon size={17} />
      </span>
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="group min-w-0 flex-1"
      >
        <div className="text-[10.5px] font-medium uppercase tracking-widest text-white/40">{label}</div>
        <div className="flex items-center gap-1 text-sm text-white/90 group-hover:text-white">
          <span className="min-w-0 break-all">{value}</span>
          <ArrowUpRight size={13} className="shrink-0 text-white/35 transition group-hover:text-white/80" />
        </div>
      </a>
      {children}
    </div>
  )
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  const [subject, setSubject] = useState('Hello from your portfolio')
  const [message, setMessage] = useState('')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  }

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

  return (
    <div className="h-full select-text overflow-auto p-5">
      <div className="flex items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-white/20 shadow-lg shadow-black/40">
          <img
            src="/photos/photo-1.jpg"
            alt="Abuzaid"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = 'https://avatars.githubusercontent.com/u/174946133?v=4'
            }}
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-white">{profile.name}</h1>
          <p className="truncate text-sm text-white/55">CS Undergrad · MSIT Delhi</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Row icon={Mail} label="Email" value={profile.email} href={`mailto:${profile.email}`} tint="linear-gradient(135deg,#34d399,#059669)">
          <button
            onClick={copyEmail}
            aria-label="Copy email address"
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-white/12 bg-white/[0.06] px-2.5 text-xs text-white/80 transition hover:bg-white/12"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </Row>
        <Row icon={LinkedinIcon} label="LinkedIn" value={host(profile.linkedin)} href={profile.linkedin} tint="linear-gradient(135deg,#3b9bff,#0a56b8)" />
        <Row icon={XIcon} label="X (Twitter)" value={host(profile.x)} href={profile.x} tint="linear-gradient(135deg,#27272a,#09090b)" />
        <Row icon={GithubIcon} label="GitHub" value={host(profile.github)} href={profile.github} tint="linear-gradient(135deg,#3b424b,#0d1117)" />
      </div>

      <h2 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-widest text-white/40">Say hello</h2>
      <div className="space-y-2">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-label="Subject"
          placeholder="Subject"
          className="w-full rounded-lg border border-white/12 bg-black/25 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-accent"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Message"
          placeholder="Write a message…"
          rows={3}
          className="w-full resize-none rounded-lg border border-white/12 bg-black/25 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-accent"
        />
        <a
          href={mailto}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Send size={14} /> Open in mail app
        </a>
        <p className="text-[11.5px] text-white/35">Opens your email app with this message ready to send.</p>
      </div>
    </div>
  )
}
