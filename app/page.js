'use client';

import { useRef, useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import LandingAnimation from './LandingAnimation'; // Import the component
import Head from 'next/head';
import AboutSection from './AboutSection';

gsap.registerPlugin(TextPlugin);

export default function Home() {
  const toggleRef = useRef(null);
  
  const [isDarkMode, setIsDarkMode] = useState(true); // Add state to track the current theme
  const landingTextRef = useRef(null);
  const [colors, setColors] = useState({
    primaryColor: '#f40c3f',
    accentColor: '#160000',
  });

  useEffect(() => {
    // Set initial theme
    const html = document.documentElement;
    if (!html.classList.contains('dark') && !html.classList.contains('light')) {
      html.classList.add('dark');
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
          primaryColor: '#f40c3f', // Dark background color
          accentColor: '#160000', // Dark accent color
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
      .to(landingTextRef.current, { text: 'CREATIVE DEVELOPER', duration: 2, ease: 'power2.inOut' });

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
    
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]  font-mono tracking-wider">

      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-[var(--color-bg)] border-b border-[var(--color-fg)] shadow-lg" style={{height: '6vh' }}>
        {/* Left side: Logo */}
        <div className="logo h-full" title="AP">
          <button className="text-4xl font-bold px-5 h-full hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]" style={{ fontFamily: 'monospace' }} onClick={() => scrollToSection('landing')}>
            AUSTIN PEREZ
          </button>
        </div>

        {/* Right side: Navigation and icons */}
        <div className="flex items-center gap-0 h-full">
          <nav className="flex items-center gap-0 h-full">
            <button
              className="hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5   text-2xl h-full"
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button
              className="hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5   text-2xl h-full"
              onClick={() => scrollToSection('work')}
            >
              Work
            </button>
            <button
              className="hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5   text-2xl h-full"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
            <button
              className="hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5  text-2xl h-full"
              onClick={() => scrollToSection('extras')}
            >
              Extras
            </button>
          </nav>

          {/* GitHub Icon */}
          <a
            href="https://github.com/AMPerez04"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-[var(--color-text)] hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5 py-5 h-full"
            title="GitHub"
          >
            <FaGithub />
          </a>

          {/* LinkedIn Icon */}
          <a
            href="https://www.linkedin.com/in/austin-m-perez/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-[var(--color-text)] hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5 py-5 h-full"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>

          {/* Theme Toggle */}
          <button
            ref={toggleRef}
            className="header-toggle hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5 py-5 text-xl h-full"
            title="Toggle Theme"
          >
            {isDarkMode ? <BsFillMoonFill /> : <BsFillSunFill />}
          </button>
        </div>
      </header>

      <section
        id="landing"
        className="relative flex flex-col items-center justify-center border-b border-[var(--color-fg)]"
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
          className="absolute text-5xl md:text-7xl lg:text-8xl font-bold text-center tracking-wide uppercase text-[var(--color-text)]"
        >

        </h1>
      </section>


      <main className="site-main flex-1">

      <section
      id="about"
      className="relative flex flex-col items-center justify-center border-b border-[var(--color-fg)]"
      >
  
        <div className="w-full h-full">
          <AboutSection
            primaryColor={colors.primaryColor}
            accentColor={colors.accentColor}
          />
        </div>
        {/* Your About Content */}
        <div className="absolute text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)]  shadow-md" style={{maxWidth: '30vw'}}>
          <h2 className="text-5xl md:text-7xl font-bold uppercase mb-4">About</h2>
          <p className="text-xl md:text-2xl text-justify">
            Welcome! I'm Austin Perez, a versatile developer with over four years
            of freelance experience, a proven track record working with startups,
            and the entrepreneurial drive to launch my own successful venture.
            My passion lies at the intersection of creativity and technology,
            where I craft solutions that make a real impact.
          </p>
        </div>
      </section>


        <section id="work" className="site-section">
          <h2 className="section-title">Work</h2>
          <p className="max-w-prose mx-auto my-4 text-justify">
            My professional journey spans a variety of projects across web and mobile development, highlighting my ability to adapt to new challenges and deliver results. Whether building intuitive applications, scaling infrastructure for startups, or creating innovative user experiences, I bring technical expertise and a problem-solving mindset to every project.
          </p>
          <p className="max-w-prose mx-auto my-4 text-justify">
            Alongside my professional work, I actively explore game development and modding, which fuels my creativity and hones my technical skills. These side projects reflect my commitment to learning and experimenting with cutting-edge technologies.
          </p>
        </section>

        <section id="contact" className="site-section">
          <h2 className="section-title">Contact</h2>
          <p className="max-w-prose mx-auto my-4 text-justify">
            I’m always open to connecting with like-minded professionals, collaborating on impactful projects, or discussing exciting opportunities. Let’s create something extraordinary together.
          </p>
          <p className="max-w-prose mx-auto my-4 text-justify">
            Email: <a href="mailto:austin@example.com" className="underline">austin@example.com</a>
          </p>
          <p className="max-w-prose mx-auto my-4 text-justify">
            Or send me a message on <a href="https://linkedin.com/in/austin-m-perez" className="underline">LinkedIn</a>.
          </p>
        </section>

        <section id="extras" className="site-section">
          <h2 className="section-title">Extras</h2>
          <p className="max-w-prose mx-auto my-4 text-justify">
            Beyond client work, I’ve delved into game development and modding, which allows me to combine technical rigor with creative expression. These projects not only refine my programming skills but also demonstrate my ability to work on complex, highly engaging systems.
          </p>
          <p className="max-w-prose mx-auto my-4 text-justify">
            Take a look at my <a href="https://github.com/AMPerez04" className="underline">GitHub</a> to explore my experiments, or check out my <a href="https://linkedin.com/in/austin-m-perez" className="underline">LinkedIn</a> for more about my professional journey.
          </p>
        </section>
      </main>


      <footer className="footer">
        &copy; {new Date().getFullYear()} AP's Retro Portfolio
      </footer>
    </div>
  );
}