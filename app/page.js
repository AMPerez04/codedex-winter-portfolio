import Image from 'next/image';
import headshot from '../public/img/headshot.jpg';
import ThemeToggle from './ThemeToggle';
import { profile, stats, work, pipeline, aiPractice, about } from './content';

const nav = [
  { href: '#work', label: 'Work' },
  { href: '#ai', label: 'Building with AI' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

function Arrow() {
  return (
    <span aria-hidden="true" className="ml-1 inline-block translate-y-[-1px]">
      ↗
    </span>
  );
}

function SectionHeading({ children }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <h2 className="label">{children}</h2>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function LoadTimeFigure() {
  const rows = [
    { name: 'Before', value: '400 ms', width: '100%', color: 'bg-bar' },
    { name: 'After', value: '< 200 ms', width: '49%', color: 'bg-accent' },
  ];
  return (
    <figure className="rounded-lg border border-line bg-surface p-5">
      <figcaption className="label mb-4">Context menu load time, P50</figcaption>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-[3.25rem_1fr_4.75rem] items-center gap-3">
            <span className="text-sm text-muted">{row.name}</span>
            <span className="block">
              <span
                className={`block h-2.5 rounded-full ${row.color}`}
                style={{ width: row.width }}
              />
            </span>
            <span className="whitespace-nowrap font-mono text-sm">{row.value}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

function PipelineFigure() {
  return (
    <figure className="rounded-lg border border-line bg-surface p-5">
      <figcaption className="label mb-4">How a recommendation is produced</figcaption>
      <ol className="grid gap-3 sm:grid-cols-4 sm:gap-0">
        {pipeline.map((item, i) => (
          <li
            key={item.step}
            className={`relative sm:px-4 ${i === 0 ? 'sm:pl-0' : 'sm:border-l sm:border-line'} ${
              i === pipeline.length - 1 ? 'sm:pr-0' : ''
            }`}
          >
            <div
              className={`font-mono text-xs ${item.step === 'Grounding' ? 'text-accent' : 'text-muted'}`}
            >
              {String(i + 1).padStart(2, '0')} {item.step}
            </div>
            <div className="mt-1 text-sm font-medium leading-snug">{item.title}</div>
            <div className="mt-1 text-sm leading-snug text-muted">{item.note}</div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

const visuals = {
  loadtime: LoadTimeFigure,
  pipeline: PipelineFigure,
};

function WorkItem({ item }) {
  const Visual = item.visual ? visuals[item.visual] : null;
  return (
    <article className="grid gap-x-10 gap-y-4 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-[11rem_1fr]">
      <div className="md:pt-1.5">
        <div className="label">{item.dates}</div>
        {item.datesNote && <div className="mt-1 text-sm text-muted">{item.datesNote}</div>}
      </div>
      <div className="min-w-0">
        <h3 className="text-2xl font-semibold tracking-tight">{item.name}</h3>
        <p className="mt-1 text-muted">
          {item.role}
          {item.org !== item.name && <> · {item.org}</>}
        </p>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed">{item.summary}</p>
        {Visual && (
          <div className="mt-6 max-w-2xl">
            <Visual />
          </div>
        )}
        <ul className="mt-6 max-w-2xl space-y-3">
          {item.points.map((point) => (
            <li key={point} className="grid grid-cols-[1rem_1fr] leading-relaxed">
              <span aria-hidden="true" className="mt-[0.7em] h-1 w-1 rounded-full bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {item.stack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
        {item.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {item.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {link.label}
                <Arrow />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="site-header sticky top-0 z-50 border-b border-line">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="font-semibold tracking-tight">
            {profile.name}
          </a>
          <div className="flex items-center gap-1">
            <nav aria-label="Sections" className="mr-2 hidden items-center gap-6 text-sm md:flex">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line px-3 py-1.5 text-sm transition-colors hover:border-ink"
            >
              Resume
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* HERO */}
        <section className="pb-16 pt-16 sm:pb-20 sm:pt-24">
          <p className="label">
            {profile.title} · {profile.location}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {profile.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a
              href="#work"
              className="rounded-md bg-ink px-4 py-2.5 font-medium text-page transition-opacity hover:opacity-85"
            >
              See the work
            </a>
            <a href={`mailto:${profile.email}`} className="text-link">
              {profile.email}
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-link">
              GitHub
              <Arrow />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              LinkedIn
              <Arrow />
            </a>
          </div>

          <dl className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.value} className="flex flex-col-reverse bg-surface p-5">
                <dt className="mt-1.5 text-sm leading-snug text-muted">{stat.label}</dt>
                <dd className="font-mono text-lg font-medium tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* WORK */}
        <section id="work" className="py-12 sm:py-16">
          <SectionHeading>Work</SectionHeading>
          <div>
            {work.map((item) => (
              <WorkItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* AI */}
        <section id="ai" className="py-12 sm:py-16">
          <SectionHeading>Building with AI</SectionHeading>
          <p className="max-w-2xl text-[1.0625rem] leading-relaxed">
            I use LLMs in two places: inside the products I ship, and in how I write the code. A
            few things I hold to in both.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {aiPractice.map((item, i) => (
              <div key={item.title} className="border-t border-ink pt-4">
                <div className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-12 sm:py-16">
          <SectionHeading>About</SectionHeading>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-[11rem_1fr]">
            <Image
              src={headshot}
              alt="Austin Perez"
              width={176}
              height={176}
              sizes="176px"
              placeholder="blur"
              className="h-28 w-28 rounded-lg object-cover md:h-44 md:w-44"
              style={{ objectPosition: 'center 20%' }}
            />
            <div className="min-w-0">
              <div className="max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed">
                {about.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <dl className="mt-10 max-w-2xl border-t border-line">
                {about.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid gap-x-6 gap-y-1 border-b border-line py-3.5 sm:grid-cols-[9.5rem_1fr]"
                  >
                    <dt className="label pt-0.5">{fact.label}</dt>
                    <dd className="text-[0.9375rem] leading-relaxed">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-12 sm:py-16">
          <SectionHeading>Contact</SectionHeading>
          <p className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Email is the fastest way to reach me:{' '}
            <a href={`mailto:${profile.email}`} className="text-link decoration-accent">
              {profile.email}
            </a>
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              LinkedIn
              <Arrow />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-link">
              GitHub
              <Arrow />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="text-link">
              Resume (PDF)
              <Arrow />
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-5 py-6 text-sm text-muted sm:px-8">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Designed and built by me, with Next.js.</span>
        </div>
      </footer>
    </div>
  );
}
