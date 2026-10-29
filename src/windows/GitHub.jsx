import { ArrowUpRight, BookOpen, GitFork, MapPin, Star, Users } from 'lucide-react'
import { profile } from '@/constants'
import { GithubIcon } from '@/components/BrandIcons'
import BrowserShell from '@/components/BrowserShell'

const REPOSITORIES = [
  {
    name: 'Float_Chat',
    href: 'https://github.com/Abuzaid-01/Float_Chat',
    desc: 'ARGO Ocean Data Explorer with FAISS vector search, Groq SQL conversion & 9 MCP tools over 1.27M measurements.',
    lang: 'Python',
    langColor: '#3572A5',
    stars: 1,
    forks: 0,
    tag: 'RAG & MCP',
  },
  {
    name: 'VISIONSTRA',
    href: 'https://github.com/Abuzaid-01/VISIONSTRA',
    desc: 'VisionSTRA is a lightweight, browser-powered AI safety assistant enabling independent and accessible road navigation for visually impaired users.',
    lang: 'Python',
    langColor: '#3572A5',
    stars: 0,
    forks: 0,
    tag: 'AI Safety & CV',
  },
  {
    name: 'Sentrix',
    href: 'https://github.com/Abuzaid-01/Sentrix',
    desc: 'Autonomous Tri-Vector Compound Fraud Defense Platform (Chatbot NLP, ONNX Card Anomaly, Mule Graph ML).',
    lang: 'TypeScript',
    langColor: '#3178c6',
    stars: 0,
    forks: 0,
    tag: 'Fraud Defense',
  },
  {
    name: 'AI_bouncer',
    href: 'https://github.com/Abuzaid-01/AI_bouncer',
    desc: 'Prompt-safety firewall for LLMs — defender model preventing prompt injections and jailbreaks with FAISS & XGBoost.',
    lang: 'Python',
    langColor: '#3572A5',
    stars: 0,
    forks: 0,
    tag: 'Prompt Security',
  },
  {
    name: 'movie_recommendation_system',
    href: 'https://github.com/Abuzaid-01/movie_recommendation_system',
    desc: 'CineMatch — AI-powered Movie Recommendation System over 3,360+ movies with FastAPI backend and Vercel edge UI.',
    lang: 'Jupyter Notebook',
    langColor: '#DA5B0B',
    stars: 0,
    forks: 0,
    tag: 'Recommender System',
  },
  {
    name: 'plant_disease_detector',
    href: 'https://github.com/Abuzaid-01/plant_disease_detector',
    desc: 'Vision model (EfficientNet-B2) + domain-restricted Groq Llama chatbot for crop disease identification across 9 crops.',
    lang: 'Python',
    langColor: '#3572A5',
    stars: 0,
    forks: 0,
    tag: 'Computer Vision',
  },
  {
    name: 'TrustLens',
    href: 'https://github.com/Abuzaid-01/TrustLens',
    desc: 'Multi-agent review verification system scoring review credibility (0–100) using Llama 3.3 and Vision agents.',
    lang: 'Python',
    langColor: '#3572A5',
    stars: 0,
    forks: 0,
    tag: 'Multi-Agent',
  },
  {
    name: 'virality_analyzer',
    href: 'https://github.com/Abuzaid-01/virality_analyzer',
    desc: 'Predictive analytics application analyzing post virality potential and audience engagement features.',
    lang: 'TypeScript',
    langColor: '#3178c6',
    stars: 0,
    forks: 0,
    tag: 'Predictive ML',
  },
]

export default function GitHubWindow() {
  return (
    <BrowserShell
      url={profile.github}
      displayUrl="github.com/Abuzaid-01"
      title="GitHub"
      accentColor="#2ea44f"
    >
      <div className="mx-auto max-w-4xl p-5 sm:p-7">
        {/* Profile Card / Header */}
        <div className="flex flex-col gap-5 rounded-2xl border border-[#30363d] bg-[#0d1117] p-5 shadow-lg sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <img
              src="https://avatars.githubusercontent.com/u/174946133?v=4"
              alt="Abuzaid"
              className="size-18 sm:size-22 rounded-full border-2 border-[#30363d] bg-black/40 object-cover shadow-md"
              onError={(e) => {
                e.target.src = '/photos/photo-1.jpg'
              }}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white sm:text-2xl">{profile.name}</h1>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60">
                  Abuzaid-01
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                  DomAiynLabs
                </span>
              </div>
              <p className="mt-1 text-sm text-[#8b949e]">
                Second year computer science student at Maharaja Surajmal Institute of Technology · AI/ML Developer @ DomAiynLabs
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#8b949e]">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#7d8590]" /> India, Delhi
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={13} className="text-[#7d8590]" /> <strong className="text-white">50</strong> public repos
                </span>
                <span className="flex items-center gap-1">
                  <Users size={13} className="text-[#7d8590]" /> <strong className="text-white">9</strong> followers · <strong className="text-white">8</strong> following
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2 sm:flex-col">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#238636] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2ea043]"
            >
              <GithubIcon size={14} />
              <span>Follow on GitHub</span>
              <ArrowUpRight size={13} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium text-white/85 transition hover:bg-[#30363d] hover:text-white"
            >
              <span>Open in new tab</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>

        {/* Section title */}
        <div className="mb-3 mt-7 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8b949e]">
            <BookOpen size={14} />
            <span>Pinned & Featured Repositories</span>
          </div>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#58a6ff] hover:underline"
          >
            View all 50 repositories on GitHub →
          </a>
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {REPOSITORIES.map((repo) => (
            <div
              key={repo.name}
              className="group flex flex-col justify-between rounded-xl border border-[#30363d] bg-[#161b22] p-4 transition hover:border-[#8b949e]/40 hover:bg-[#1b222d]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#58a6ff] group-hover:underline"
                  >
                    <span>{repo.name}</span>
                    <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[#8b949e]">
                    {repo.tag}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-[#8b949e]">
                  {repo.desc}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-[#8b949e]">
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: repo.langColor }}
                  />
                  <span>{repo.lang}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Star size={13} className="text-[#7d8590]" />
                  <span>{repo.stars}</span>
                </div>

                <div className="flex items-center gap-1">
                  <GitFork size={13} className="text-[#7d8590]" />
                  <span>{repo.forks}</span>
                </div>

                <a
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[11px] text-[#58a6ff] hover:underline"
                >
                  View ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4 text-center sm:flex-row sm:text-left">
          <div>
            <div className="text-sm font-semibold text-white">Explore full code on GitHub</div>
            <p className="text-xs text-[#8b949e]">
              Over 50 repositories spanning AI safety, prompt defense, RAG systems, and computer vision.
            </p>
          </div>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#21262d] border border-[#30363d] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#30363d]"
          >
            <span>Open github.com/Abuzaid-01</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </BrowserShell>
  )
}
