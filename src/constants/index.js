// ============================================================
//  ALL CONTENT LIVES HERE. Edit this file to change the site.
//  Content is taken from the resume. Phone number is intentionally
//  NOT included, because this is a public site.
// ============================================================

// ---------- Profile ----------
export const profile = {
  name: 'Abuzaid',
  firstName: 'Abuzaid',
  roles: [
    '5th Sem CS Student @ MSIT',
    'AI / ML Developer @ DomAIyn Labs',
    'LLM Safety & Prompt Defense',
    'RAG & Agentic Systems',
  ],
  avatar: '/photos/abuzaid-main.jpg',
  tagline: 'Hey, I am Abuzaid · 5th sem CS student @ MSIT Delhi · AI/ML Developer @ DomAIyn Labs',
  summary:
    "Hey, I am Abuzaid — 5th sem CS student at Maharaja Surajmal Institute of Technology (MSIT), Delhi, and an AI/ML Developer at DomAIyn Labs. Building prompt-security firewalls, real-time threat detection pipelines (<15ms latency), RAG interfaces, and computer vision tools. I prefer building over talking — every project has a live link you can test right now.",
  email: 'abuzaid0205@gmail.com',
  location: 'New Delhi, India',
  college: 'Maharaja Surajmal Institute of Technology (MSIT), Delhi',
  semester: '5th Semester',
  company: 'DomAIyn Labs',
  github: 'https://github.com/Abuzaid-01',
  linkedin: 'https://linkedin.com/in/abuzaid01',
  x: 'https://x.com/Abuzaid340209',
  instagram: 'https://www.instagram.com/abuzaid_855/',
  portfolio: 'https://abuzaid-dev.netlify.app/',
}

// ---------- Resume ----------
// Shown in the Resume window. Put your PDF in /public with this name.
export const resumeFile = '/Abuzaid_Resume.pdf'

// ---------- Wallpaper ----------
// Set `image` to a path like '/wallpaper.jpg' (put the file in /public)
// to use your own photo. Leave null for the animated aurora.
export const wallpaper = { image: null }

// Presets shown in Control Center. `base` = the two big background glows,
// `blobs` = the three drifting colour clouds.
export const wallpapers = [
  { id: 'aurora', name: 'Aurora', base: ['#2a1f7a', '#0b5f78'], blobs: ['#6d4aff', '#06b6d4', '#d6246e'] },
  { id: 'sunset', name: 'Sunset', base: ['#7a1f3d', '#7a470b'], blobs: ['#ff5e62', '#ff9966', '#7b2ff7'] },
  { id: 'ocean', name: 'Ocean', base: ['#0b3b6b', '#0b6b5f'], blobs: ['#00a8ff', '#0052d4', '#00e0b0'] },
  { id: 'forest', name: 'Forest', base: ['#0f3d2a', '#2d3d0f'], blobs: ['#22c55e', '#a3e635', '#0ea5e9'] },
  { id: 'midnight', name: 'Midnight', base: ['#14143a', '#1b1b4a'], blobs: ['#3b3bd8', '#8b5cf6', '#1e293b'] },
]

// ---------- Gallery Photos (/photo folder) ----------
export const galleryPhotos = [
  {
    id: 'photo-1',
    src: '/photos/photo-1.jpg',
    thumb: '/photos/photo-1-thumb.jpg',
    title: 'Abuzaid — Developer Portrait',
    category: 'Portraits',
    date: 'Oct 2026',
    location: 'New Delhi, India',
    desc: 'AI / ML Developer at DomAIyn Labs and CS student at MSIT Delhi.',
    aspect: 'portrait',
    featured: true,
  },
  {
    id: 'photo-2',
    src: '/photos/photo-2.jpg',
    thumb: '/photos/photo-2-thumb.jpg',
    title: 'MSIT Campus Moments',
    category: 'Campus',
    date: 'Oct 2026',
    location: 'MSIT Delhi',
    desc: 'Between CS lectures and machine learning lab sessions.',
    aspect: 'portrait',
    featured: true,
  },
  {
    id: 'photo-3',
    src: '/photos/photo-3.jpg',
    thumb: '/photos/photo-3-thumb.jpg',
    title: 'Focused & Building',
    category: 'Portraits',
    date: 'Oct 2026',
    location: 'New Delhi',
    desc: 'Deep in AI safety architectures, vector databases, and code.',
    aspect: 'portrait',
    featured: false,
  },
  {
    id: 'photo-4',
    src: '/photos/photo-4.jpg',
    thumb: '/photos/photo-4-thumb.jpg',
    title: 'Evening Light Snapshot',
    category: 'Moments',
    date: 'Oct 2026',
    location: 'Delhi, India',
    desc: 'Golden hour outdoor vibes after shipping a new project release.',
    aspect: 'portrait',
    featured: true,
  },
  {
    id: 'photo-5',
    src: '/photos/photo-5.jpg',
    thumb: '/photos/photo-5-thumb.jpg',
    title: 'Campus Walk',
    category: 'Campus',
    date: 'Oct 2026',
    location: 'MSIT Campus',
    desc: 'Everyday campus walk at Maharaja Surajmal Institute of Technology.',
    aspect: 'portrait',
    featured: false,
  },
  {
    id: 'photo-6',
    src: '/photos/photo-6.jpg',
    thumb: '/photos/photo-6-thumb.jpg',
    title: 'Street Style & City Life',
    category: 'Portraits',
    date: 'Oct 2026',
    location: 'New Delhi',
    desc: 'Exploring Delhi and taking a breather from the screen.',
    aspect: 'portrait',
    featured: true,
  },
]

// ---------- Desktop icons (right side of the desktop, md+ screens) ----------
// kind: 'folder' | 'doc' | 'photos'. `id` = the window that opens on double-click.
export const desktopIcons = [
  { id: 'finder', label: 'Projects', kind: 'folder', colors: ['#5ac8fa', '#1c6ef2'] },
  { id: 'photos', label: 'Photos', kind: 'photos', colors: ['#ffffff', '#f4f4f5'] },
  { id: 'resume', label: 'Resume.pdf', kind: 'doc', badge: 'PDF', color: '#e0245e' },
  { id: 'notes', label: 'README.txt', kind: 'doc', badge: 'TXT', color: '#4f6bed' },
]

// ---------- Weather in the menu bar (Open-Meteo, no API key) ----------
export const weatherLocation = { lat: 28.6139, lon: 77.209, label: 'New Delhi' }

// ---------- Desktop Pets ----------
export const pets = [
  {
    id: 'dog',
    name: 'Puppy',
    short: 'Dog',
    emoji: '🐶',
    sprite: '/pets/dog.png',
    desc: 'The black-eared pup that playfully chases your cursor and wags its tail',
  },
  {
    id: 'cat',
    name: 'Neko Cat',
    short: 'Cat',
    emoji: '🐱',
    sprite: '/pets/cat.png',
    desc: 'Classic curious kitten that naps when you stop moving',
  },
  {
    id: 'shiba',
    name: 'Shiba Inu',
    short: 'Shiba',
    emoji: '🐕',
    sprite: '/pets/shiba.png',
    desc: 'Golden Shiba with pointy ears, high energy & bouncy run',
  },
  {
    id: 'tora',
    name: 'Tora Cat',
    short: 'Tora',
    emoji: '🐯',
    sprite: '/pets/tora.png',
    desc: 'Vibrant orange ginger tabby kitten',
  },
  {
    id: 'duck',
    name: 'Duckling',
    short: 'Duck',
    emoji: '🦆',
    sprite: '/pets/duck.png',
    desc: 'Cheerful yellow duckling waddling along the screen',
  },
  {
    id: 'none',
    name: 'No Pet',
    short: 'Off',
    emoji: '🚫',
    sprite: null,
    desc: 'Hide desktop pet for clean focus',
  },
]

// ---------- Dock ----------
// `icon` maps to the ICONS table in components/Dock.jsx
export const dockApps = [
  { id: 'finder', label: 'Projects', app: 'Finder', icon: 'Folder', colors: ['#5ac8fa', '#1c6ef2'], fg: '#ffffff' },
  { id: 'notes', label: 'About Me', app: 'Notes', icon: 'StickyNote', colors: ['#ffe27a', '#f5a300'], fg: '#4a3200' },
  { id: 'photos', label: 'Photos', app: 'Photos', icon: 'Photos', colors: ['#ffffff', '#f4f4f5'], fg: '#18181b' },
  { id: 'terminal', label: 'Skills', app: 'Terminal', icon: 'SquareTerminal', colors: ['#3b4252', '#0b0d12'], fg: '#7CFFB2' },
  { id: 'resume', label: 'Resume', app: 'Preview', icon: 'FileText', colors: ['#ff8a8a', '#e0245e'], fg: '#ffffff' },
  { id: 'contact', label: 'Contact', app: 'Mail', icon: 'Mail', colors: ['#6ee7b7', '#059669'], fg: '#ffffff' },
  { type: 'separator' },
  { id: 'github', label: 'GitHub', app: 'GitHub', icon: 'Github', colors: ['#30363d', '#0d1117'], fg: '#ffffff' },
  { id: 'linkedin', label: 'LinkedIn', app: 'LinkedIn', icon: 'Linkedin', colors: ['#3b9bff', '#0a56b8'], fg: '#ffffff' },
  { id: 'x', label: 'X', app: 'X', icon: 'X', colors: ['#27272a', '#09090b'], fg: '#ffffff' },
  { type: 'separator', desktopOnly: true },
  { id: 'settings', label: 'Settings', app: 'System Settings', icon: 'Settings', colors: ['#e5e7eb', '#9ca3af'], fg: '#1f2937' },
  { id: 'trash', label: 'Trash', app: 'Trash', icon: 'Trash2', action: 'trash', desktopOnly: true, colors: ['#a1a8b3', '#4b5563'], fg: '#ffffff' },
]

// ---------- Windows ----------
// One entry per window. `id` must match a dock app id and a key in src/windows/index.jsx
export const windowConfig = {
  finder: { title: 'Projects', width: 880, height: 580 },
  notes: { title: 'About Me', width: 900, height: 640 },
  photos: { title: 'Photos — Abuzaid', width: 940, height: 640 },
  settings: { title: 'System Settings', width: 880, height: 620 },
  terminal: { title: 'abuzaid — zsh', width: 780, height: 500 },
  resume: { title: 'Abuzaid_Resume.pdf', width: 800, height: 700 },
  contact: { title: 'Contact', width: 540, height: 640 },
  github: { title: 'GitHub — @Abuzaid-01', width: 880, height: 620 },
  linkedin: { title: 'LinkedIn — Abuzaid', width: 880, height: 620 },
  x: { title: 'X — @Abuzaid340209', width: 820, height: 620 },
}

// ---------- Menu bar dropdowns ----------
// item: { label, action?, href?, shortcut?, disabled? } | { type: 'separator' }
// actions: 'launch:<appId>' | 'close' | 'minimize' | 'zoom' | 'spotlight' | 'lock' |
//          'wallpaper' | 'restart' | 'reload' | 'fullscreen'
export const menuOrder = ['File', 'Edit', 'View', 'Window', 'Help']

export const menus = {
  logo: [
    { label: 'About This Portfolio', action: 'launch:notes' },
    { label: 'System Settings…', action: 'launch:settings', shortcut: '⌘,' },
    { label: 'Wallpaper Settings…', action: 'launch:settings' },
    { type: 'separator' },
    { label: 'Spotlight Search…', action: 'spotlight', shortcut: '⌘K' },
    { label: 'Lock Screen', action: 'lock' },
    { type: 'separator' },
    { label: 'View on GitHub', action: 'launch:github' },
    { type: 'separator' },
    { label: 'Restart…', action: 'restart' },
  ],
  File: [
    { label: 'Open Projects', action: 'launch:finder', shortcut: '⌘O' },
    { label: 'Open Photos Gallery', action: 'launch:photos', shortcut: '⌘P' },
    { label: 'Open Resume', action: 'launch:resume' },
    { type: 'separator' },
    { label: 'Close Window', action: 'close', shortcut: '⌘W' },
  ],
  Edit: [
    { label: 'Undo', shortcut: '⌘Z', disabled: true },
    { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
    { type: 'separator' },
    { label: 'Cut', shortcut: '⌘X', disabled: true },
    { label: 'Copy', shortcut: '⌘C', disabled: true },
    { label: 'Paste', shortcut: '⌘V', disabled: true },
  ],
  View: [
    { label: 'Change Wallpaper…', action: 'launch:settings' },
    { type: 'separator' },
    { label: 'Enter Full Screen', action: 'fullscreen', shortcut: '⌃⌘F' },
    { label: 'Reload', action: 'reload', shortcut: '⌘R' },
  ],
  Window: [
    { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
    { label: 'Zoom', action: 'zoom' },
  ],
  Help: [
    { label: 'Search…', action: 'spotlight', shortcut: '⌘K' },
    { type: 'separator' },
    { label: 'Contact Me', action: 'launch:contact' },
    { label: 'Say hi on LinkedIn', action: 'launch:linkedin' },
    { label: 'Follow on X', action: 'launch:x' },
  ],
}

// ---------- Education ----------
export const education = {
  school: 'Maharaja Surajmal Institute of Technology',
  place: 'New Delhi, India',
  degree: 'Bachelor of Technology in Computer Science and Engineering',
  period: '2024 – 2028',
  gpa: '8.46 / 10',
}

// ---------- Projects ----------
export const projects = [
  {
    id: 'floatchat',
    short: 'FloatChat',
    tagline: 'Natural-language queries over 1.27M ARGO ocean measurements.',
    colors: ['#38bdf8', '#0369a1'],
    metrics: [
      { value: '1.27M', label: 'ocean measurements' },
      { value: '9', label: 'MCP tools' },
      { value: '5', label: 'dashboard tabs' },
    ],
    name: 'FloatChat — ARGO Ocean Data Explorer',
    stack: ['Python', 'Streamlit', 'PostgreSQL', 'FAISS', 'Gemini'],
    link: 'https://github.com/Abuzaid-01/Float_Chat',
    bullets: [
      'Built a RAG pipeline converting natural language queries to SQL using Groq API with FAISS vector search for semantic retrieval from 1.27M oceanographic measurements.',
      'Implemented Model Context Protocol (MCP) with 9 specialized tools for thermocline calculation, water mass identification, and spatial analytics on ARGO float data.',
      'Developed interactive Streamlit dashboard with 5 tabs, Leaflet maps, NetCDF data ingestion, and cloud PostgreSQL (Neon) integration.',
    ],
  },
  {
    id: 'ai-bouncer',
    short: 'AI Bouncer',
    tagline: 'An LLM firewall that stops jailbreaks and zero-day prompt attacks.',
    colors: ['#fb7185', '#be123c'],
    metrics: [
      { value: 'Jailbreaks', label: '+ zero-day attacks' },
      { value: 'FAISS', label: 'semantic attack matching' },
      { value: 'XGBoost', label: 'probability scoring' },
    ],
    name: 'AI Bouncer',
    stack: ['Python', 'FastAPI', 'XGBoost', 'FAISS', 'Hugging Face', 'Next.js'],
    link: 'https://ai-bouncer.vercel.app/',
    bullets: [
      'Developed an enterprise-grade LLM firewall to detect jailbreaks and zero-day attacks using a multi-layered ensemble pipeline.',
      'Implemented semantic attack matching with FAISS vector search and statistical probability scoring using an XGBoost engine.',
      'Built a decoupled architecture with a Next.js frontend and a Python-based ML engine to intercept and sanitize malicious prompts.',
    ],
  },
  {
    id: 'trustlens',
    short: 'TrustLens',
    tagline: 'Multi-agent system that scores how trustworthy a product review is.',
    colors: ['#a78bfa', '#6d28d9'],
    metrics: [
      { value: '0–100', label: 'trust score' },
      { value: '5', label: 'verification checks' },
      { value: '3', label: 'outcomes: approve / review / reject' },
    ],
    name: 'TrustLens — AI Review Verification System',
    stack: ['Python', 'FastAPI', 'React', 'LangGraph', 'Groq Cloud'],
    link: 'https://trust-lens-rho.vercel.app/',
    bullets: [
      'Built an end-to-end LangGraph multi-agent review verification system to detect fake reviews, verify purchases, analyze reviewer behavior, identify duplicate reviews, and assess media authenticity.',
      'Integrated Llama 3.3 for text reasoning and Llama 4 Scout Vision for image analysis with a SQLite orders database for purchase verification, generating a 0–100 Trust Score with Approve, Review, or Reject recommendations.',
    ],
  },
  {
    id: 'plant-disease',
    short: 'Plant Disease',
    tagline: 'Identify plant diseases from a leaf photo across 9 crops.',
    colors: ['#4ade80', '#15803d'],
    metrics: [
      { value: '9', label: 'crops' },
      { value: 'EfficientNet-B2', label: 'with attention' },
      { value: 'Gemini', label: 'disease insights' },
    ],
    name: 'Plant Disease Classification Web App',
    stack: ['PyTorch', 'Flask', 'JavaScript', 'Gemini API', 'HTML/CSS'],
    link: 'https://plant-diseases-detector.streamlit.app/',
    bullets: [
      'Developed a deep learning web application to identify plant diseases from leaf images across 9 crops.',
      'Implemented EfficientNet-B2 with attention mechanisms for robust detection under varying conditions.',
      'Designed a responsive UI with image upload, dark mode, multilingual support, and Gemini-powered disease insights.',
    ],
  },
  {
    id: 'sentrix',
    short: 'Sentrix',
    tagline: 'Autonomous tri-vector fraud defense simulating and stopping compound GenAI attacks.',
    colors: ['#f97316', '#c2410c'],
    metrics: [
      { value: '< 15ms', label: 'kill switch latency' },
      { value: '3-Vector', label: 'compound neural fusion' },
      { value: '99.9%', label: 'critical threat catch rate' },
    ],
    name: 'SENTRIX AI — Autonomous Compound Fraud Defense',
    stack: ['Python', 'FastAPI', 'PyTorch', 'ONNX', 'XGBoost', 'NetworkX', 'Next.js'],
    link: 'https://github.com/Abuzaid-01/Sentrix',
    bullets: [
      'Architected an enterprise-grade autonomous fraud defense platform unifying chatbot NLP prompt-injection defense, ONNX XGBoost card fraud scoring, and NetworkX mule graph analysis.',
      'Engineered a cross-vector neural fusion head correlating multi-stage fraud kill chains into critical threat alerts with sub-15ms inference latency.',
      'Implemented closed-loop adversarial active learning simulating red-team attack vectors to self-heal and retrain blue-team detection heads 24/7.',
    ],
  },
  {
    id: 'movie-recommendation',
    short: 'CineMatch',
    tagline: 'Content-based movie recommendation system over 3,360+ films with autocomplete.',
    colors: ['#ec4899', '#9d174d'],
    metrics: [
      { value: '3,360+', label: 'movies database' },
      { value: 'FastAPI', label: 'recommendation engine' },
      { value: '95+', label: 'Lighthouse score' },
    ],
    name: 'CineMatch — Movie Recommendation System',
    stack: ['Python', 'FastAPI', 'JavaScript', 'HTML/CSS', 'Render', 'Vercel'],
    link: 'https://github.com/Abuzaid-01/movie_recommendation_system',
    demo: 'https://abuzaid-01-movie-recommendation-sys.vercel.app/',
    bullets: [
      'Built an end-to-end movie recommendation web application serving personalized suggestions across a 3,360+ movie dataset with API fallback.',
      'Engineered a content-based filtering pipeline backed by a high-performance FastAPI service deployed on Render.',
      'Designed a responsive, lightweight frontend with debounced autocomplete search, modal details, dynamic top-rated filters, and Vercel edge deployment.',
    ],
  },
]

// ---------- Experience / Roles ----------
export const experience = [
  {
    org: 'DomAIyn Labs',
    role: 'AI / ML Developer',
    period: 'Apr 2026 – Present',
    location: 'New Delhi, India',
    bullets: [
      'Building systems to protect LLMs against adversarial prompt attacks and jailbreaks.',
      'Contributing to real-time LLM threat detection & response pipelines (<15ms latency).',
      'Developing compliance tooling aligned with EU AI Act safety requirements.',
      'Researching shadow AI discovery and hallucination detection in regulated enterprise environments.',
      'Deploying on-premise AI safety components with zero data exfiltration.',
    ],
    tech: ['Python', 'PyTorch', 'FastAPI', 'LangChain', 'FAISS', 'Hugging Face', 'XGBoost', 'EU AI Act'],
  },
  {
    org: 'Microsoft Student Chapter & Geek Room',
    role: 'Development Trainee',
    period: 'Sep 2024 – Present',
    location: 'MSIT Delhi',
    bullets: [
      'Organizing AI/ML technical workshops, hackathons, and collaborative developer sessions on campus.',
      'Mentoring junior students on Python data science pipelines, Git workflows, and API architectures.',
    ],
    tech: ['Python', 'Data Science', 'Workshops', 'Git'],
  },
  {
    org: 'No Soul Hungry',
    role: 'Volunteer',
    period: 'Jul 2024 – Present',
    location: 'Delhi',
    bullets: ['Participated in food drives and logistics to provide meals to underprivileged communities across Delhi.'],
    tech: ['Community Service', 'Outreach'],
  },
]

// ---------- Skills ----------
export const skills = {
  Languages: ['Python', 'C/C++', 'JavaScript', 'HTML/CSS'],
  'Frameworks & APIs': ['FastAPI', 'Flask', 'Streamlit', 'Postman'],
  Libraries: [
    'LangChain',
    'LangGraph',
    'Hugging Face Transformers',
    'TensorFlow',
    'PyTorch',
    'Keras',
    'OpenCV',
    'Pandas',
    'NumPy',
    'Matplotlib',
    'NetworkX',
    'XGBoost',
  ],
  'Developer Tools': ['Git', 'Docker', 'Render', 'Vercel', 'VS Code', 'Jupyter Notebook', 'Google Colab'],
}
