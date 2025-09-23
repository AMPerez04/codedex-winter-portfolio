'use client';

import { useRef, useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import LandingAnimation from './LandingAnimation'; // Import the component
import {
  SiHtml5, SiReact, SiJavascript, SiTypescript, SiPython, SiCplusplus,
  SiNodedotjs, SiBun,
} from "react-icons/si";
import { FaDatabase } from "react-icons/fa";

gsap.registerPlugin(TextPlugin);

export default function Home() {
  const toggleRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(false); // Add state to track the current theme
  const landingTextRef = useRef(null);
  const [colors, setColors] = useState({
    primaryColor: '#ffffff',
    accentColor: '#160000',
  });
  const [activeResume, setActiveResume] = useState('swe');

  useEffect(() => {
    // Set initial theme
    const html = document.documentElement;
    if (!html.classList.contains('dark') && !html.classList.contains('light')) {
      html.classList.add('light');
    }

    // Theme Toggle
    const toggleButton = toggleRef.current;
    const toggleTheme = () => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        setIsDarkMode(false); // Update state
        gsap.to(colors, {
          primaryColor: '#ffffff', // Light background color
          accentColor: '#160000', // Light accent color

          duration: 0.0,
          onUpdate: () => {
            setColors({ ...colors });
          },
        });
      } else {
        html.classList.remove('light');
        html.classList.add('dark');
        setIsDarkMode(true); // Update state
        gsap.to(colors, {
          primaryColor: '#181818', // Dark background color
          accentColor: '#282828', // Dark accent color
          duration: 0.0,
          onUpdate: () => {
            setColors({ ...colors });
          },
        });
      }
    };
    toggleButton.addEventListener('click', toggleTheme);

    return () => toggleButton.removeEventListener('click', toggleTheme);
  }, []);

  useEffect(() => {
    // Landing Text Animation
    const textTimeline = gsap.timeline({ repeat: -1, yoyo: true, delay: 0.5 });
    textTimeline
      .to(landingTextRef.current, { text: 'AUSTIN PEREZ', duration: 1, ease: 'power2.inOut' })
      .to(landingTextRef.current, { text: 'SOFTWARE ENGINEER', duration: 2, ease: 'power2.inOut' })
      .to(landingTextRef.current, { text: 'CREATIVE DEVELOPER', duration: 2, ease: 'power2.inOut' })
      .to(landingTextRef.current, { text: 'FULL STACK ENGINEER', duration: 2, ease: 'power2.inOut' })
      .to(landingTextRef.current, { text: 'FOUNDER', duration: 2, ease: 'power2.inOut' })
      .to(landingTextRef.current, { text: 'AUSTIN PEREZ', duration: 2, ease: 'power2.inOut' });



    // Ensure landingTextRef is not empty initially
    landingTextRef.current.textContent = 'AUSTIN PEREZ';

    // Scroll Animations
    gsap.utils.toArray('.site-section').forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);




  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // transition-colors duration-300 ease-in-out
  return (

    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] tracking-wider">

      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-[var(--color-bg)] border-b border-[var(--color-header-border)] shadow-lg" style={{ height: '6vh' }}>
        {/* Left side: Logo */}
        <div className="logo h-full">
          <button className="text-2xl md:text-3xl lg:text-4xl font-bold px-5 h-full hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] whitespace-nowrap overflow-x-auto" onClick={() => scrollToSection('landing')}>
            AUSTIN PEREZ
          </button>
        </div>

        {/* Right side: Navigation and icons */}
        <div className="flex items-center gap-0 h-full">
          <nav className="hidden md:flex items-center gap-0 h-full">
            <button
              className="hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] px-5   text-2xl h-full "
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button
              className="hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] px-5   text-2xl h-full"
              onClick={() => scrollToSection('work')}
            >
              Work
            </button>
            <button
              className="hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] px-5  text-2xl h-full"
              onClick={() => scrollToSection('resume')}
            >
              Resume
            </button>
            <button
              className="hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] px-5   text-2xl h-full"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>

          </nav>

          {/* GitHub Icon */}
          <a
            href="https://github.com/AMPerez04"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-xl text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] px-5 py-5 h-full"
            title="GitHub"
          >
            <FaGithub />
          </a>

          {/* LinkedIn Icon */}
          <a
            href="https://www.linkedin.com/in/austin-m-perez/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-xl text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] px-5 py-5 h-full"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>

          {/* Theme Toggle */}
          <button
            ref={toggleRef}
            className=" flex items-center justify-center header-toggle hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] px-5 py-5 text-xl h-full"
            title="Toggle Theme"
          >
            {isDarkMode ? <BsFillMoonFill /> : <BsFillSunFill />}
          </button>
        </div>
      </header>

      <section
        id="landing"
        className="relative flex flex-col items-center justify-center border-b border-[var(--color-header-border)]"
        style={{ minHeight: "80vh" }} // Adjust this height based on your design needs
      >
        {/* Background Animation */}
        <div className="w-full h-full">
          <LandingAnimation
            primaryColor={colors.primaryColor}
            accentColor={colors.accentColor}
          />
        </div>

        {/* Centered Heading */}
        <h1
          ref={landingTextRef}
          className="absolute text-5xl md:text-7xl lg:text-9xl font-bold text-center tracking-wide uppercase text-[var(--color-text)" >

        </h1>
      </section>


      <main className="site-main flex-1 justify-center items-center w-full">

        {/* ABOUT */}
        <section
          id="about"
          className="site-section relative w-full max-w-screen-2xl justify-center items-center"
        >
          <div className=" px-6 md:px-10 justify-center items-center">
            <h2 className="section-title">About</h2>
            <div className="flex flex-col md:flex-row gap-10 w-full justify-between">

              <div className="md:min-w-1/2 w-full md:col-span-3">
                <div className="flex justify-center mb-6">
                  <img
                    src="/img/headshot.jpg"
                    alt="Austin Perez headshot"
                    className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full shadow-lg border-4 border-[var(--color-border)] bg-[var(--color-bg)]"
                    style={{ objectPosition: "center 20%" }}
                  />
                </div>
                <p className="text-sm md:text-base leading-relaxed mb-4 ">
                  I&apos;m Austin Perez, a 2x Founder and Software Engineer focused on building clean, performant
                  software across web and mobile. I enjoy turning complex
                  problems into simple, great experiences and shipping things that
                  actually get used.
                </p>
                <p className="text-sm md:text-base leading-relaxed ">
                  Recently I&apos;ve been working with React/React Native, Bun, and Javascript,
                  with additional experience in C/C++ for low-level work and competetive programming in Python.
                </p>
                <aside className="md:col-span-2 mt-6">
                  <div className="rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 backdrop-blur-sm p-5">
                    <h3 className="text-xl font-bold uppercase tracking-wide mb-4">Quick facts</h3>
                    <ul className="space-y-3 text-sm md:text-base">
                      <li className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-3">
                        <span className="opacity-80">Education</span>
                        <span className="text-right">B.S. CS · M.S. CS (in progress)</span>
                      </li>
                      <li className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-3">
                        <span className="opacity-80">Experience</span>
                        <span className="text-right">2+ Professional Years · Web/Mobile/DevOps</span>
                      </li>
                      <li className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-3">
                        <span className="opacity-80">Focus</span>
                        <span className="text-right">Full Stack Systems · APIs · Iteration</span>
                      </li>
                      <li className="flex items-start justify-between gap-4">
                        <span className="opacity-80">Currently</span>
                        <span className="text-right">Building useful things and learning fast</span>
                      </li>
                    </ul>
                  </div>
                </aside>
              </div>

              <div className="skills flex justify-center md:min-w-1/2 w-full">
                <div className="skills-row flex flex-col justify-center">
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiHtml5 className="w-10 h-10 md:w-16 md:h-16 text-orange-500" />
                    <div className="skill-text">HTML</div>
                  </div>
                  <div className="skill-item relative flex flex-col items-center justify-evenlyh-20 w-28 md:w-40 md:h-28   border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiReact className="w-10 h-10 md:w-16 md:h-16 text-sky-400" />
                    <div className="skill-text">REACT</div>
                  </div>
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiJavascript className="w-10 h-10 md:w-16 md:h-16 text-yellow-400" />
                    <div className="skill-text">JAVASCRIPT</div>
                  </div>
                </div>
                <div className="skills-row flex flex-col justify-center">
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiTypescript className="w-10 h-10 md:w-16 md:h-16 text-blue-500 " />
                    <div className="skill-text">TYPESCRIPT</div>
                  </div>
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiPython className="w-10 h-10 md:w-16 md:h-16 text-blue-400 " />
                    <div className="skill-text">PYTHON</div>
                  </div>
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <FaDatabase className="w-10 h-10 md:w-16 md:h-16 text-indigo-400" />
                    <div className="skill-text">SQL</div>
                  </div>
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiCplusplus className="w-10 h-10 md:w-16 md:h-16 text-blue-700" />
                    <div className="skill-text">C++</div>
                  </div>
                </div>
                <div className="skills-row flex flex-col justify-center">
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiNodedotjs className="w-10 h-10 md:w-16 md:h-16 text-green-600" />
                    <div className="skill-text">NODE.JS</div>
                  </div>
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiBun className="w-10 h-10 md:w-16 md:h-16 bun-icon" />
                    <div className="skill-text">BUN</div>
                  </div>
                  <div className="skill-item relative flex flex-col items-center justify-evenly h-20 w-28 md:w-40 md:h-28 border-2 border-[var(--color-border)] rounded-lg transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] hover:border-[var(--color-decoration)] cursor-pointer">
                    <SiReact className="w-10 h-10 md:w-16 md:h-16 text-sky-400" />
                    <div className="skill-text">REACT NATIVE</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* EXPERIENCE & PROJECTS */}
        <section id="work" className="site-section relative max-w-screen-2xl w-full"
        >
          <div className=" max-w-screen-2xl px-6 md:px-10 w-full">
            <h2 className="section-title">Experience</h2>
            <div className="mb-10 flex flex-col justify-center items-center">

              <p className="text-sm md:text-base opacity-80 max-w-3xl">
                A selection of my work, highlighting relevant experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6 md:gap-8">
              <article className="group rounded border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors bg-[var(--color-bg)]/60 backdrop-blur-sm p-6 w-full md:w-[22rem] ">
                <header className="mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold uppercase">(NDA) Software Engineer</h3>
                  <p className="text-xs md:text-sm opacity-70">System Design · DevOps · CI/CD</p>
                </header>
                <p className="text-sm md:text-base leading-relaxed mb-4">
                  Early engineer (1 of 6) building a green-field, cloud-native product from scratch.
                  Designed and implemented robust backend systems to support scalable features and CI/CD pipelines.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Bun</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">React</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">AWS</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Docker</span>
                </div>
              </article>

              <article className="group rounded border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors bg-[var(--color-bg)]/60 backdrop-blur-sm p-6 w-full md:w-[22rem]">
                <header className="mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold uppercase">Founder · Sports Psych App</h3>
                  <p className="text-xs md:text-sm opacity-70">System Design · UI Architecture · Sales</p>
                </header>
                <p className="text-sm md:text-base leading-relaxed mb-4">
                  Built a sports psychology app from the ground up, led engineering, won multiple VC competitions, and scaled it to active use by 30 organizations.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">React</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">React Native</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">iOS and Android Development</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">PostHog</span>
                </div>
              </article>

              <article className="group rounded border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors bg-[var(--color-bg)]/60 backdrop-blur-sm p-6 w-full md:w-[22rem]">
                <header className="mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold uppercase">Founder · Resale App</h3>
                  <p className="text-xs md:text-sm opacity-70">Personalization · Payments · UX</p>
                </header>
                <p className="text-sm md:text-base leading-relaxed mb-4">
                  Built a secondhand marketplace with tailored recommendations, secure checkout,
                  and a responsive design system. Led product strategy end-to-end.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">React Native</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">MongoDB</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Express</span>
                </div>
              </article>

              <article className="group rounded border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors bg-[var(--color-bg)]/60 backdrop-blur-sm p-6 w-full md:w-[22rem]">
                <header className="mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold uppercase">Freelance Web Designer</h3>
                  <p className="text-xs md:text-sm opacity-70">UI/UX · Branding · Client Collaboration</p>
                </header>
                <p className="text-sm md:text-base leading-relaxed mb-4">
                  Designed and developed custom websites for small businesses and individuals, focusing on modern aesthetics, responsive layouts, and seamless user experiences. Worked directly with clients to translate their vision into engaging digital products.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">React</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Figma</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Tailwind CSS</span>
                </div>
              </article>

              <article className="group rounded border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors bg-[var(--color-bg)]/60 backdrop-blur-sm p-6 w-full md:w-[22rem]">
                <header className="mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold uppercase">Full-Stack Intern</h3>
                  <p className="text-xs md:text-sm opacity-70">Collaboration · JavaScript · Product Development</p>
                </header>
                <p className="text-sm md:text-base leading-relaxed mb-4">
                  Collaborated with startups at the Skandalaris Center, building responsive web apps with JavaScript and contributing across ideation, development, and deployment.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">JavaScript</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Full-Stack</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Responsive Design</span>
                </div>
              </article>

              <article className="group rounded border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors bg-[var(--color-bg)]/60 backdrop-blur-sm p-6 w-full md:w-[22rem]">
                <header className="mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold uppercase"> Game Dev | Modder</h3>
                  <p className="text-xs md:text-sm opacity-70">Community Management · Game Development · Game Modding</p>
                </header>
                <p className="text-sm md:text-base leading-relaxed mb-4">
                  Shipped an indie game and created mods for existing games, reaching 30k+ downloads across all platforms.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Godot</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">C#</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Java</span>
                  <span className="px-2 py-1 border border-[var(--color-border)] rounded">Design</span>
                </div>
              </article>
            </div>
          </div>
        </section>



        {/* RESUME */}
        <section id="resume" className="site-section relative max-w-screen-2xl w-full">
          <div className="max-w-screen-xl px-6 md:px-10 w-full">
            <h2 className="section-title">Resume</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Software Engineering */}
              <a
                href="/resume-swe.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg)]/60 hover:shadow-lg transition-shadow"
                aria-label="Open Software Engineering resume PDF in a new tab"
              >
                <figure>
                  <div className="relative w-full aspect-[8.5/11] bg-[var(--color-bg)]">
                    {/* thumbnail preview image of page 1 */}
                    <img
                      src="/img/resume-swe-preview.jpg"
                      alt="Software Engineering resume preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between p-3 text-sm md:text-base">
                    <span className="font-semibold">Software Engineering</span>
                    <span className="opacity-70 group-hover:opacity-100">Open PDF ↗</span>
                  </figcaption>
                </figure>
              </a>

              {/* Finance */}
              <a
                href="/resume-finance.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg)]/60 hover:shadow-lg transition-shadow"
                aria-label="Open Finance resume PDF in a new tab"
              >
                <figure>
                  <div className="relative w-full aspect-[8.5/11] bg-[var(--color-bg)]">
                    <img
                      src="/img/resume-finance-preview.jpg"
                      alt="Finance resume preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between p-3 text-sm md:text-base">
                    <span className="font-semibold">Finance</span>
                    <span className="opacity-70 group-hover:opacity-100">Open PDF ↗</span>
                  </figcaption>
                </figure>
              </a>
            </div>
          </div>
        </section>


        {/* CONTACT */}
        <section id="contact" className="site-section relative max-w-screen-2xl w-full">
          <div className=" w-full max-w-screen-2xl px-6 md:px-10 text-center">
            <h2 className="section-title">Contact</h2>
            <p className="text-sm md:text-base opacity-90 leading-relaxed mb-8">
              Open to new opportunities, collaborations, and interesting problems. If my work resonates,
              let&apos;s talk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:austinp0502@gmail.com"
                className="px-5 py-3 border border-[var(--color-border)] rounded hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors"
              >
                Email Me
              </a>
              <a
                href="https://linkedin.com/in/austin-m-perez"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-[var(--color-border)] rounded hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>


      <footer className="border-t border-[var(--color-header-border)] py-8 text-center text-sm opacity-80">
        &copy; {new Date().getFullYear()} Austin Perez. All rights reserved.
      </footer>
    </div>
  );
}