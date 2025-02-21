'use client';

import { useRef, useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import LandingAnimation from './LandingAnimation'; // Import the component
import Head from 'next/head';
import AboutSection from './AboutSection';
import WorkSection from './WorkSection';
import ExtraSection from './ExtraSection';
import ContactSection from './ContactSection';

gsap.registerPlugin(TextPlugin);

export default function Home() {
  const toggleRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(false); // Add state to track the current theme
  const landingTextRef = useRef(null);
  const [colors, setColors] = useState({
    primaryColor: '#ffffff',
    accentColor: '#160000',
  });

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

      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-[var(--color-bg)] border-b border-[var(--color-fg)] shadow-lg" style={{ height: '6vh' }}>
        {/* Left side: Logo */}
        <div className="logo h-full">
          <button className="text-2xl md:text-3xl lg:text-4xl font-bold px-5 h-full hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] whitespace-nowrap overflow-x-auto" onClick={() => scrollToSection('landing')}>
            AUSTIN PEREZ
          </button>
        </div>

        {/* Right side: Navigation and icons */}
        <div className="flex items-center gap-0 h-full">
          <nav className="hidden md:flex items-center gap-0 h-full">
            <button
              className="hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5   text-2xl h-full "
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
            className="flex items-center justify-center text-xl text-[var(--color-text)] hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5 py-5 h-full"
            title="GitHub"
          >
            <FaGithub />
          </a>

          {/* LinkedIn Icon */}
          <a
            href="https://www.linkedin.com/in/austin-m-perez/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-xl text-[var(--color-text)] hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5 py-5 h-full"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>

          {/* Theme Toggle */}
          <button
            ref={toggleRef}
            className=" flex items-center justify-center header-toggle hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] px-5 py-5 text-xl h-full"
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
          className="absolute text-5xl md:text-7xl lg:text-9xl font-bold text-center tracking-wide uppercase text-[var(--color-text)" >

        </h1>
      </section>


      <main className="site-main flex-1">

        <section
          id="about"
          className="relative min-h-screen border-b border-[var(--color-fg)]"
        >
          {/* Background Animation */}
          <div className="absolute inset-0 z-0">
            <AboutSection
              primaryColor={colors.primaryColor}
              accentColor={colors.accentColor}
            />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-stretch min-h-screen">
            {/* Left Column: About */}
            <div className="flex-1 p-6 sm:p-10 md:p-16 flex flex-col justify-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase mb-6">
                About
              </h2>
              <p className="mobile-text text-sm md:text-base my-3 text-justify">
                Welcome! I'm Austin Perez, a versatile developer with 4+ years of
                experience crafting innovative solutions in Python, JavaScript, and
                Java. My expertise extends to C and C++, with 2+ years of proficiency,
                and a solid year of game design and game engine development experience
                using Godot.
              </p>
              <p className="mobile-text text-sm md:text-base my-3 text-justify">
                I thrive at the intersection of creativity and technology, applying a
                blend of technical expertise and an entrepreneurial mindset to solve
                real-world problems. With a passion for turning ideas into impactful
                projects, I bring both innovative thinking and a results-driven
                approach to everything I do.
              </p>
            </div>

            {/* Right Column: Qualifications */}
            <div className="relative flex-1 p-6 sm:p-10 md:p-16 flex flex-col justify-center">
              {/* An optional translucent overlay so text stands out */}
              <div className="absolute inset-0 bg-[var(--color-bg)]/70 z-[-1]" />

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase mb-6">
                Qualifications
              </h2>
              <p className="mobile-text text-sm md:text-base my-3 text-justify">
                I hold a Bachelor’s degree in Computer Science and am currently pursuing
                a Master’s in Computer Science at a top 20 university. My academic
                journey has equipped me with a strong foundation in algorithmic
                thinking, software design, and advanced programming concepts.
              </p>
              <p className="mobile-text text-sm md:text-base my-3 text-justify">
                Professionally, I have over four years of experience working with
                Python, JavaScript, and Java, along with 2+ years of expertise in C and
                C++. I also have a year of hands-on experience in game design and game
                engine development, specifically using Godot, where I combined
                creativity and technical skills to create engaging interactive
                experiences.
              </p>
            </div>
          </div>
        </section>



        <section id="work" className="relative flex flex-col items-center justify-center border-b border-[var(--color-fg)]">
          <div className="w-full h-full">
            <WorkSection
              primaryColor={colors.primaryColor}
              accentColor={colors.accentColor}
            />
          </div>
          <div className="absolute flex flex-col justify-center gap-5 items-center h-full">
            <div className="box text-center text-[var(--color-text)] bg-[var(--color-bg)] p-6 border border-[var(--color-fg)] shadow-md">
              <h2 className="text-lg sm:text-5xl md:text-7xl font-bold uppercase mb-3">Work</h2>
              <p className="mobile-text text-sm md:text-base mx-auto my-1 text-justify">
                4+ years of experience in web, mobile, and game development, with expertise in Python, JavaScript, and Java. Proficient in creating scalable apps, APIs, and interactive experiences using Godot.
              </p>
            </div>
            <div className="flex horizontal-list justify-center" style={{ gap: '1vw' }}>
              <div className="alt-box text-center text-[var(--color-text)] bg-[var(--color-bg)] p-6 border border-[var(--color-fg)] shadow-md">
                <h2 className="text-lg sm:text-4xl md:text-5xl font-bold uppercase mb-3">Startup</h2>
                <p className="mobile-text text-sm md:text-base mx-auto my-1 text-justify">
                  Scaled web and mobile apps, built modular components, and optimized performance using AWS, React Native, and RESTful APIs in fast-paced environments.
                </p>
              </div>
              <div className="alt-box text-center text-[var(--color-text)] bg-[var(--color-bg)] p-6 border border-[var(--color-fg)] shadow-md">
                <h2 className="text-lg sm:text-4xl md:text-5xl font-bold uppercase mb-3">Entrepreneurship</h2>
                <p className="mobile-text text-sm md:text-base mx-auto my-1 text-justify">
                  Founded a secondhand clothing app with personalized algorithms, payment systems, and responsive UI/UX using React Native and MongoDB.
                </p>
              </div>
              <div className="alt-box text-center text-[var(--color-text)] bg-[var(--color-bg)] p-6 border border-[var(--color-fg)] shadow-md">
                <h2 className="text-lg sm:text-4xl md:text-5xl font-bold uppercase mb-3">Freelance</h2>
                <p className="mobile-text text-sm md:text-base mx-auto my-1 text-justify">
                  Delivered custom software for diverse clients, managing the full lifecycle with Python, JavaScript, and Java, while honing communication and time management skills.
                </p>
              </div>
            </div>
          </div>

        </section>




        <section id="contact" className="relative flex flex-col items-center justify-center border-b border-[var(--color-fg)]">
          <div className="w-full h-full">
            <ContactSection
              primaryColor={colors.primaryColor}
              accentColor={colors.accentColor}
            />
          </div>
          <div className="box absolute text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)]  shadow-md">
            <h2 className="text-1xl sm:text-5xl md:text-7xl font-bold uppercase mb-4">Contact Me</h2>
            <p className="mobile-text text-xs md:text-base mx-auto my-2 text-justify">
              I’m always open to connecting with like-minded professionals, collaborating on impactful projects, or discussing exciting opportunities. Let’s create something extraordinary together.
            </p>
            <p className="mobile-text text-xs md:text-base mx-auto my-2 text-justify">
              Email: <a href="mailto:austin@example.com" className="underline">austinp0502@gmail.com</a>
            </p>
            <p className="mobile-text text-xs md:text-base mx-auto my-2 text-justify">
              Or send me a message on <a href="https://linkedin.com/in/austin-m-perez" className="underline">LinkedIn</a>.
            </p>
          </div>
        </section>

        <section id="extras" className="relative flex flex-col items-center justify-center border-b border-[var(--color-fg)]">
          <div className="w-full h-full">
            <ExtraSection
              primaryColor={colors.primaryColor}
              accentColor={colors.accentColor}
            />
          </div>
          <div className="box absolute text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)]  shadow-md">
            <h2 className="text-1xl sm:text-5xl md:text-7xl font-bold uppercase mb-4">Extras</h2>
            <p className="mobile-text text-xs md:text-base mx-auto my-2 text-justify">
              Beyond client work, I’ve delved into game development and modding, which allows me to combine technical rigor with creative expression. These projects not only refine my programming skills but also demonstrate my ability to work on complex, highly engaging systems.
            </p>
            <p className="mobile-text text-xs md:text-base mx-auto my-2 text-justify">
              Take a look at my <a href="https://github.com/AMPerez04" className="underline">GitHub</a> to explore my experiments, or check out my <a href="https://linkedin.com/in/austin-m-perez" className="underline">LinkedIn</a> for more about my professional journey.
            </p>
          </div>
        </section>
      </main>


      <footer className="footer">
        &copy; {new Date().getFullYear()} AP's Retro Portfolio
      </footer>
    </div>
  );
}