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

      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-[var(--color-bg)] border-b border-[var(--color-fg)] shadow-lg" style={{ height: '6vh' }}>
        {/* Left side: Logo */}
        <div className="logo h-full">
          <button className="text-2xl md:text-3xl lg:text-4xl font-bold px-5 h-full hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] whitespace-nowrap overflow-x-auto" style={{ fontFamily: 'monospace' }} onClick={() => scrollToSection('landing')}>
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
          className="relative flex flex-col items-center justify-center border-b border-[var(--color-fg)]"
        >

          <div className="w-full h-full">
            <AboutSection
              primaryColor={colors.primaryColor}
              accentColor={colors.accentColor}
            />
          </div>
          <div className="absolute flex flex-col justify-evenly h-full">
            <div className="text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)] shadow-md" style={{ maxWidth: '90vw' }}>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold uppercase mb-4">About</h2>
              <p className="max-w-screen-lg mx-auto my-4 text-justify">
                Welcome! I'm Austin Perez, a versatile developer with 4+ years of experience crafting innovative solutions
                in Python, JavaScript, and Java. My expertise extends to C and C++, with 2+ years of proficiency, and a solid year
                of game design and game engine development experience using Godot.
              </p>
              <p className="max-w-screen-lg mx-auto my-4 text-justify">
                I thrive at the intersection of creativity and technology, applying a blend of technical expertise and an
                entrepreneurial mindset to solve real-world problems. With a passion for turning ideas into impactful projects,
                I bring both innovative thinking and a results-driven approach to everything I do.
              </p>
            </div>
            <div className="text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)] shadow-md" style={{ maxWidth: '90vw' }}>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold uppercase mb-4">Qualifications</h2>
              <p className="max-w-screen-lg mx-auto my-4 text-justify">
                I hold a Bachelor’s degree in Computer Science and am currently pursuing a Master’s in Computer Science at a
                top 20 university. My academic journey has equipped me with a strong foundation in algorithmic thinking,
                software design, and advanced programming concepts.
              </p>
              <p className="max-w-screen-lg mx-auto my-4 text-justify">
                Professionally, I have over four years of experience working with Python, JavaScript, and Java, along with
                2+ years of expertise in C and C++. I also have a year of hands-on experience in game design and game engine
                development, specifically using Godot, where I combined creativity and technical skills to create engaging
                interactive experiences.
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
          <div className="absolute flex flex-col justify-evenly h-full">
            <div className="text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)] shadow-md" style={{ width: '92vw' }}>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold uppercase mb-4">Work</h2>
              <p className="mx-auto my-4 text-justify">
                I have 4+ years of experience in web, mobile, and game development, specializing in Python, JavaScript, and Java, with 2+ years in C/C++. My professional background includes building scalable applications, designing efficient APIs, and solving complex technical challenges. In addition, I have a year of game development experience using Godot, where I merged creativity and technology to create engaging interactive experiences.
              </p>
            </div>
            <div className="flex flex-row justify-center" style={{ gap: '1vw' }}>
              <div className="text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)] shadow-md" style={{ width: '30vw' }}>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase mb-4">Startup Experience</h2>
                <p className="mx-auto my-4 text-justify">
                  At a startup, I contributed to scaling web and mobile applications by implementing modular front-end components using React Native and integrating RESTful APIs. I also optimized app performance and improved reliability for thousands of users. This experience sharpened my ability to work in fast-paced environments and adapt to evolving challenges.
                </p>
              </div>
              <div className="text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)] shadow-md" style={{ width: '30vw' }}>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase mb-4">Entrepreneurship</h2>
                <p className="mx-auto my-4 text-justify">
                  I founded and developed a secondhand clothing app that blends fashion inspiration with a marketplace. I led the development of features like a personalized content algorithm, shipping and payment systems, and a responsive UI/UX design using React Native and MongoDB. This role demonstrated my ability to take an idea from concept to execution, delivering a seamless user experience.
                </p>
              </div>
              <div className="text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)] shadow-md" style={{ width: '30vw' }}>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase mb-4">Freelance Work</h2>
                <p className="mx-auto my-4 text-justify">
                  As a freelance developer, I delivered tailored software solutions for a diverse range of clients, including e-commerce platforms and custom web tools. I worked across the full development lifecycle, from gathering requirements to deployment, leveraging Python, JavaScript, and Java to meet client needs. Freelancing honed my skills in communication, time management, and adaptability.
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
          <div className="absolute text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)]  shadow-md" style={{ maxWidth: '90vw' }}>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold uppercase mb-4">Contact Me</h2>
            <p className="max-w-screen-lg mx-auto my-4 text-justify">
              I’m always open to connecting with like-minded professionals, collaborating on impactful projects, or discussing exciting opportunities. Let’s create something extraordinary together.
            </p>
            <p className="max-w-screen-lg mx-auto my-4 text-justify">
              Email: <a href="mailto:austin@example.com" className="underline">austinp0502@gmail.com</a>
            </p>
            <p className="max-w-screen-lg mx-auto my-4 text-justify">
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
          <div className="absolute text-center text-[var(--color-text)] bg-[var(--color-bg)] p-8 border border-[var(--color-fg)]  shadow-md" style={{ maxWidth: '90vw' }}>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold uppercase mb-4">Extras</h2>
            <p className="max-w-screen-lg mx-auto my-4 text-justify">
              Beyond client work, I’ve delved into game development and modding, which allows me to combine technical rigor with creative expression. These projects not only refine my programming skills but also demonstrate my ability to work on complex, highly engaging systems.
            </p>
            <p className="max-w-screen-lg mx-auto my-4 text-justify">
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