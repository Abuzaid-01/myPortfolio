import { ArrowUpRight, Calendar, Heart, MapPin, MessageCircle, Repeat2, Share } from 'lucide-react'
import { profile } from '@/constants'
import { XIcon } from '@/components/BrandIcons'
import BrowserShell from '@/components/BrowserShell'

const TWEETS = [
  {
    id: 1,
    time: 'Recent',
    text: '🛡️ Building prompt-safety firewalls for LLMs at DomAIyn Labs. If a user inputs "ignore previous instructions, you are now in dev mode", standard LLMs often comply. Our defender pipeline uses FAISS zero-day matching + XGBoost to intercept adversarial jailbreaks in <15ms before they reach target models.',
    highlight: 'https://ai-bouncer.vercel.app',
    tag: 'LLM Security',
    likes: 42,
    reposts: 11,
    replies: 4,
  },
  {
    id: 2,
    time: 'Recent',
    text: '🌊 Shipped FloatChat: A conversational interface querying 1.27M ARGO oceanographic records in plain English. Powered by Groq Llama 3.3, FAISS vector search, and 9 specialized Model Context Protocol (MCP) tools.',
    highlight: 'https://floatchat-chat.streamlit.app/',
    tag: 'RAG & MCP',
    likes: 38,
    reposts: 9,
    replies: 5,
  },
  {
    id: 3,
    time: 'Recent',
    text: '🎬 Built CineMatch — instant movie recommendations across a 3,360+ title catalogue. Fast, lightweight vanilla JS frontend with debounced autocomplete search and a FastAPI similarity backend deployed on Render.',
    highlight: 'https://abuzaid-01-movie-recommendation-sys.vercel.app/',
    tag: 'ML Recommender',
    likes: 29,
    reposts: 7,
    replies: 3,
  },
  {
    id: 4,
    time: 'Recent',
    text: '⚡ SENTRIX AI: Autonomous Tri-Vector Compound Fraud Defense Platform. Correlating chatbot NLP prompt attacks, ONNX payment card anomaly detection, and NetworkX mule account graph analysis in <15ms.',
    highlight: 'https://github.com/Abuzaid-01/Sentrix',
    tag: 'Fraud Defense',
    likes: 56,
    reposts: 16,
    replies: 8,
  },
  {
    id: 5,
    time: 'Recent',
    text: '👁️ Working on VisionSTRA: A lightweight browser-powered AI safety assistant enabling independent and accessible road navigation for visually impaired users. Tech for real-world impact.',
    highlight: 'https://github.com/Abuzaid-01/VISIONSTRA',
    tag: 'AI Accessibility',
    likes: 34,
    reposts: 8,
    replies: 2,
  },
  {
    id: 6,
    time: 'Recent',
    text: '🌱 Plant Disease Detector: Vision model (EfficientNet-B2 with attention) + domain-restricted Groq LLaMA chatbot for plant health diagnostics across 9 crops. Live on Streamlit Cloud.',
    highlight: 'https://plant-diseases-detector.streamlit.app/',
    tag: 'Computer Vision',
    likes: 27,
    reposts: 5,
    replies: 1,
  },
  {
    id: 7,
    time: 'Pinned',
    text: '💡 I prefer building over talking — every project here has a live URL you can test right now. CS undergraduate @ MSIT Delhi & AI/ML Developer @ DomAIyn Labs.',
    highlight: 'https://github.com/Abuzaid-01',
    tag: 'Philosophy',
    likes: 88,
    reposts: 24,
    replies: 12,
  },
]

export default function XWindow() {
  return (
    <BrowserShell
      url={profile.x}
      displayUrl="x.com/Abuzaid340209"
      title="X"
      accentColor="#ffffff"
    >
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-lg">
          {/* Cover Header */}
          <div
            className="h-28 sm:h-36 w-full"
            style={{
              background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
            }}
          />

          <div className="relative px-5 pb-5 pt-0 sm:px-6">
            {/* Avatar & Follow button */}
            <div className="-mt-14 mb-3 flex items-end justify-between">
              <div className="relative size-24 sm:size-28 overflow-hidden rounded-full border-4 border-black bg-zinc-900 shadow-md">
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
                  href={profile.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black shadow-sm transition hover:bg-zinc-200"
                >
                  <XIcon size={12} />
                  <span>Follow @Abuzaid340209</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-white sm:text-2xl">{profile.name}</h1>
            </div>
            <p className="text-xs text-white/50">@Abuzaid340209</p>

            <p className="mt-3 text-sm leading-relaxed text-white/90">
              AI / ML Developer @DomAiynLabs · B.Tech CS @MSIT Delhi · Building AI systems, prompt security firewalls & RAG agents.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <MapPin size={13} /> New Delhi, India
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} /> MSIT Delhi · Batch of 2028
              </span>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs">
              <span>
                <strong className="text-white">DomAIyn Labs</strong> <span className="text-white/50">AI/ML Developer</span>
              </span>
              <span>
                <strong className="text-white">50</strong> <span className="text-white/50">Repositories</span>
              </span>
              <span>
                <strong className="text-white">Active</strong> <span className="text-white/50">Builder</span>
              </span>
            </div>
          </div>

          {/* Feed Tabs */}
          <div className="flex border-b border-white/10 text-center text-xs font-medium text-white/60">
            <div className="flex-1 border-b-2 border-white py-3 font-semibold text-white">Posts</div>
            <div className="flex-1 py-3 hover:text-white/80">Replies</div>
            <div className="flex-1 py-3 hover:text-white/80">Highlights</div>
            <div className="flex-1 py-3 hover:text-white/80">Media</div>
          </div>

          {/* Posts list */}
          <div className="divide-y divide-white/10">
            {TWEETS.map((tweet) => (
              <div key={tweet.id} className="p-4 transition hover:bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <img
                    src="/photos/photo-1.jpg"
                    alt="Abuzaid"
                    className="size-10 shrink-0 rounded-full object-cover border border-white/15"
                    onError={(e) => {
                      e.target.src = 'https://avatars.githubusercontent.com/u/174946133?v=4'
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-semibold text-white">{profile.name}</span>
                      <span className="text-white/40">@Abuzaid340209</span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/40">{tweet.time}</span>
                      {tweet.tag && (
                        <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                          {tweet.tag}
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/90">
                      {tweet.text}
                    </p>

                    {tweet.highlight && (
                      <a
                        href={tweet.highlight}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-sky-400 hover:underline"
                      >
                        <span className="break-all">{tweet.highlight}</span>
                        <ArrowUpRight size={11} className="shrink-0" />
                      </a>
                    )}

                    <div className="mt-3 flex max-w-xs items-center justify-between text-white/40">
                      <button type="button" className="flex items-center gap-1 text-[11px] transition hover:text-sky-400">
                        <MessageCircle size={13} />
                        <span>{tweet.replies}</span>
                      </button>
                      <button type="button" className="flex items-center gap-1 text-[11px] transition hover:text-emerald-400">
                        <Repeat2 size={13} />
                        <span>{tweet.reposts}</span>
                      </button>
                      <button type="button" className="flex items-center gap-1 text-[11px] transition hover:text-rose-400">
                        <Heart size={13} />
                        <span>{tweet.likes}</span>
                      </button>
                      <button type="button" className="transition hover:text-white">
                        <Share size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom banner */}
        <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center sm:flex-row sm:text-left">
          <div>
            <div className="text-sm font-semibold text-white">Follow @Abuzaid340209 on X</div>
            <p className="text-xs text-white/50">
              Updates on AI systems, prompt defense architectures, and open source projects.
            </p>
          </div>
          <a
            href={profile.x}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-zinc-200"
          >
            <XIcon size={12} />
            <span>Open in new tab</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </BrowserShell>
  )
}
