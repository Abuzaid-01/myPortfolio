import { ArrowUpRight, Award, Briefcase, GraduationCap, MapPin, Send } from 'lucide-react'
import { education, experience, profile, skills } from '@/constants'
import { LinkedinIcon } from '@/components/BrandIcons'
import BrowserShell from '@/components/BrowserShell'

export default function LinkedInWindow() {
  return (
    <BrowserShell
      url={profile.linkedin}
      displayUrl="linkedin.com/in/abuzaid01"
      title="LinkedIn"
      accentColor="#0a66c2"
    >
      <div className="mx-auto max-w-4xl p-5 sm:p-7">
        {/* Main Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b1f24] shadow-lg">
          {/* Cover Banner */}
          <div
            className="h-28 sm:h-36 w-full"
            style={{
              background: 'linear-gradient(135deg, #0a56b8 0%, #002244 50%, #1e1b4b 100%)',
            }}
          />

          <div className="relative px-5 pb-5 pt-0 sm:px-6">
            {/* Avatar & Action Button */}
            <div className="-mt-14 mb-3 flex items-end justify-between">
              <div className="relative size-24 sm:size-28 overflow-hidden rounded-full border-4 border-[#1b1f24] bg-zinc-800 shadow-md">
                <img
                  src="/photos/photo-1.jpg"
                  alt="Abuzaid"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://avatars.githubusercontent.com/u/174946133?v=4'
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0a66c2] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#004182]"
                >
                  <LinkedinIcon size={14} />
                  <span>Open in new tab</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Profile Info */}
            <h1 className="text-xl font-bold text-white sm:text-2xl">{profile.name}</h1>
            <p className="mt-1 text-sm font-medium text-white/90">
              AI / ML Developer at DomAIyn Labs | Computer Science Engineering @ MSIT (2024–2028)
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <MapPin size={13} /> New Delhi, Delhi, India
              </span>
              <span>·</span>
              <span className="text-[#70b5f9]">500+ connections</span>
              <span>·</span>
              <span className="text-emerald-400">Available for AI/ML opportunities</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15"
              >
                <span>Connect on LinkedIn</span>
                <ArrowUpRight size={12} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                <Send size={12} />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#1b1f24] p-5 shadow-lg">
          <h2 className="text-base font-bold text-white">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            {profile.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-sky-300">
              🛡️ LLM Prompt Defense
            </span>
            <span className="rounded-md border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-purple-300">
              🧠 RAG & Vector Search
            </span>
            <span className="rounded-md border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
              ⚡ Compound Fraud Detection
            </span>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#1b1f24] p-5 shadow-lg">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Briefcase size={16} className="text-[#70b5f9]" />
            <span>Experience & Roles</span>
          </div>
          <div className="mt-4 space-y-5">
            {experience.map((exp) => (
              <div key={exp.org} className="border-l-2 border-white/15 pl-4">
                <div className="text-sm font-semibold text-white">{exp.role}</div>
                <div className="text-xs font-medium text-[#70b5f9]">{exp.org}</div>
                <div className="text-[11px] text-white/45">{exp.period} · {exp.location}</div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1.5 text-xs text-white/75">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-sky-400">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {exp.tech && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#1b1f24] p-5 shadow-lg">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <GraduationCap size={16} className="text-[#70b5f9]" />
            <span>Education</span>
          </div>
          <div className="mt-3 border-l-2 border-white/15 pl-4">
            <div className="text-sm font-semibold text-white">{education.school}</div>
            <div className="text-xs text-white/80">{education.degree}</div>
            <div className="text-[11px] text-white/45">
              {education.period} · {education.place} · {education.affiliation || 'GGSIPU Affiliated'}
            </div>
            <div className="mt-2 text-xs text-white/70">
              <strong>Core Coursework:</strong> Machine Learning, Data Structures & Algorithms, Computer Vision, DBMS, Operating Systems, Computer Networks.
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#1b1f24] p-5 shadow-lg">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Award size={16} className="text-[#70b5f9]" />
            <span>Skills & Technologies</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Object.values(skills)
              .flat()
              .map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80"
                >
                  {s}
                </span>
              ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center sm:flex-row sm:text-left">
          <div>
            <div className="text-sm font-semibold text-white">View Abuzaid on LinkedIn</div>
            <p className="text-xs text-white/50">
              Connect directly on LinkedIn: linkedin.com/in/abuzaid01
            </p>
          </div>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0a66c2] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#004182]"
          >
            <span>Open in new tab</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </BrowserShell>
  )
}
