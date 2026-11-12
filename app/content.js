// All copy on the home page lives here. Edit this file to update the site.

export const profile = {
  name: 'Austin Perez',
  title: 'Software Engineer',
  location: 'Seattle, WA',
  email: 'austinp0502@gmail.com',
  github: 'https://github.com/AMPerez04',
  linkedin: 'https://www.linkedin.com/in/austin-m-perez/',
  resume: '/Austin-Perez-Resume.pdf',
  headline: 'I build products from zero and ship them to real users.',
  intro:
    "I'm a software engineer at Microsoft, where I shipped the redesigned File Explorer context menu in Windows 11. I'm also the founding engineer of SPARC Sports, an AI mental performance platform used by 400 athletes on 30 tennis teams. Before that I founded Quture, a secondhand clothing marketplace.",
};

export const stats = [
  {
    value: '400 → <200 ms',
    label: 'File Explorer context menu load time at P50',
  },
  {
    value: '400 athletes',
    label: 'on 30 teams use SPARC, from high school to NCAA Division I',
  },
  {
    value: '111K+ downloads',
    label: 'of MineZero, my open-source Minecraft mod',
  },
];

export const work = [
  {
    id: 'microsoft',
    name: 'Windows File Explorer',
    org: 'Microsoft',
    role: 'Software Engineer',
    dates: 'Jan 2026 – Present',
    summary:
      'I shipped the redesigned, customizable File Explorer context menu, one of the most-used surfaces in Windows, and drove its rollout from Windows Insider channels to Windows 11 retail.',
    visual: 'loadtime',
    points: [
      'Cut context menu load time in half, from 400 ms to under 200 ms at P50. This answered long-standing feedback that the menu was slow and cluttered, and drove down customer dissatisfaction (DSAT).',
      'Ported legacy context menu verbs such as Send To to the modern menu in days rather than weeks, using agentic workflows to reimplement legacy code as modern code.',
    ],
    stack: ['C++', 'Windows', 'Agentic workflows'],
    links: [],
  },
  {
    id: 'sparc',
    name: 'SPARC Sports',
    org: 'SPARC Sports',
    role: 'Founding Engineer',
    dates: 'May 2025 – Present',
    datesNote: 'Part-time since Jan 2026',
    summary:
      'SPARC is an AI-powered mental performance platform for competitive tennis. I built the entire product: the iOS and Android apps, the coach analytics dashboard, and the cloud backend. 30 teams and 400 athletes use it, from high school programs to NCAA Division I.',
    visual: 'pipeline',
    points: [
      'Architected a provider-agnostic LLM pipeline that maps athlete journal entries to a psychologist-reviewed library of techniques, exercises, and modules, so every AI recommendation is grounded in vetted content.',
      'Mentored 4 interns for over a year and guided their side projects to ship in the app. Introduced AI-assisted coding and test tools to speed delivery.',
    ],
    stack: [
      'TypeScript',
      'React',
      'React Native',
      'Node',
      'Postgres',
      'AWS App Runner / ECS',
      'PostHog',
    ],
    links: [],
  },
  {
    id: 'minezero',
    name: 'MineZero',
    org: 'Open source',
    role: 'Creator and maintainer',
    dates: '2025 – Present',
    summary:
      'MineZero is a Minecraft mod that adds a checkpoint and world reset system: when the anchor player dies, the whole world returns to the last checkpoint. It has 111K+ downloads on CurseForge.',
    points: [
      'I run the player community on Discord and CurseForge and turn feedback and bug reports into iterative releases, including new multiplayer modes and configurable gamerules.',
      'Supports Forge and NeoForge across Minecraft 1.12.2, 1.20.1, and 1.21.1. Localized in 9 languages. Apache 2.0 licensed.',
    ],
    stack: ['Java', 'Forge', 'NeoForge', 'Gradle'],
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/AMPerez04/MineZero' },
      {
        label: 'CurseForge',
        href: 'https://www.curseforge.com/minecraft/mc-mods/mine-zero-return-by-death',
      },
    ],
  },
  {
    id: 'quture',
    name: 'Quture',
    org: 'Quture',
    role: 'Founder and Product Manager',
    dates: 'Feb 2024 – Aug 2025',
    summary:
      'Quture was a secondhand clothing marketplace for Gen Z. I founded it, recruited and led a team of 6 developers, and launched the app.',
    points: [
      'Built a virtual try-on closet that used computer vision and AI image editing to turn clothing listings into try-on-ready garments.',
      'Raised $15,000+ and reached the finals of multiple startup competitions.',
    ],
    stack: ['TypeScript', 'React Native', 'MongoDB', 'Express', 'Node'],
    links: [],
  },
];

export const pipeline = [
  { step: 'Input', title: 'Athlete journal entry', note: 'What the athlete wrote' },
  { step: 'Model', title: 'Provider-agnostic LLM layer', note: 'GPT-6 Luna in production' },
  {
    step: 'Grounding',
    title: 'Psychologist-reviewed library',
    note: 'Techniques, exercises, modules',
  },
  { step: 'Output', title: 'Recommendation', note: 'Always tied to vetted content' },
];

export const aiPractice = [
  {
    title: 'Ground what the model says',
    body: "At SPARC the model maps an athlete's journal entry to content a sports psychologist has already reviewed, so every recommendation traces back to vetted material.",
  },
  {
    title: 'Keep the provider swappable',
    body: 'The SPARC pipeline is provider-agnostic. I have built against the Claude, OpenAI, and Gemini APIs, and production currently runs on GPT-6 Luna.',
  },
  {
    title: 'Use agents where they earn it',
    body: 'On File Explorer I used agentic workflows to port legacy verbs in days rather than weeks. I was an early adopter on the team, taught teammates cost-efficient AI usage and model selection, and was recognized for steering agents toward correct, maintainable solutions.',
  },
];

export const about = {
  body: [
    "I like owning a product all the way through: talking to the people who use it, deciding what to build, building it across the stack, and watching what happens after it ships. I've done that as a founder, as a founding engineer, and on a Windows surface with a very large audience.",
    'I studied computer science and mathematics at Washington University in St. Louis, and left the M.S. program to join Microsoft.',
  ],
  facts: [
    {
      label: 'Education',
      value:
        'B.S. Computer Science + Mathematics, Washington University in St. Louis. M.S. Computer Science coursework, GPA 3.93.',
    },
    {
      label: 'Graduate courses',
      value: 'Large Language Models, Systems Security, Data Management at Scale, AI for Health',
    },
    {
      label: 'Languages',
      value: 'C++, TypeScript / JavaScript, Python, Java',
    },
    {
      label: 'Frameworks',
      value: 'React, React Native, Next.js, Node / Express, FastAPI',
    },
    {
      label: 'Infrastructure',
      value: 'AWS (EC2, ECS, App Runner, S3), Docker, Kubernetes, GitHub Actions, PostgreSQL, MongoDB',
    },
    {
      label: 'Earlier',
      value:
        "Freelance web design, a full-stack internship with startups at WashU's Skandalaris Center, and an indie game built in Godot.",
    },
  ],
};
