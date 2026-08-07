"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  Mail,
  Send,
  GraduationCap,
  Globe,
  Building2,
  Heart,
  Accessibility,
  Boxes,
  Plane,
  Bot,
  Store,
  CalendarCheck,
  Award,
  Trophy,
  Gem,
  Rocket,
  Users,
  Menu,
  X,
  ChevronRight,
  CalendarDays,
  MapPin,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "experience",
        "projects",
        "awards",
        "contact",
      ];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "awards", label: "Awards" },
    { id: "contact", label: "Contact" },
  ];

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f5] font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glows */}
      <div className="fixed -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-[#00f0ff] blur-[120px] opacity-[0.15] pointer-events-none z-0" />
      <div className="fixed -bottom-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-[#8b5cf6] blur-[120px] opacity-[0.15] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#3b82f6] blur-[120px] opacity-[0.15] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[rgba(0,240,255,0.1)] backdrop-blur-xl transition-all duration-300 bg-[rgba(5,5,5,0.8)]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-[#00f0ff] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">
              ET.
            </span>
            <div>
            <a
              href="/emirkisa.pdf"
              download="emirkisa.pdf"
              className="cvButton"
            >
              <span>CV İNDİR</span>

              <i className="corner top-left" />
              <i className="corner top-right" />
              <i className="corner bottom-left" />
              <i className="corner bottom-right" />
            </a>
            </div>
          </div>

          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`relative text-sm font-medium tracking-wide transition-colors ${
                  activeSection === link.id
                    ? "text-[#00f0ff]"
                    : "text-[#8892b0] hover:text-[#00f0ff]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-[#00f0ff] to-[#8b5cf6] transition-all duration-300 ${
                    activeSection === link.id ? "w-full" : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden px-6 pb-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`block text-sm font-medium w-full text-left ${
                  activeSection === link.id
                    ? "text-[#00f0ff]"
                    : "text-[#8892b0] hover:text-[#00f0ff]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="min-h-screen flex items-center relative pt-20 z-10"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,240,255,0.1)] bg-[rgba(15,15,25,0.6)] backdrop-blur-lg mb-8">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="text-[#00f0ff] text-sm font-medium">
                Available for Opportunities
              </span>
            </div>
            <h1
              className="fade-in font-bold text-5xl md:text-7xl leading-tight mb-6"
              style={{ transitionDelay: "0.1s" }}
            >
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-[#00f0ff] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
                Emir Tolluoğlu
              </span>
            </h1>
            <p
              className="fade-in text-[#8892b0] text-lg md:text-xl max-w-2xl leading-relaxed mb-8"
              style={{ transitionDelay: "0.2s" }}
            >
              Full-stack developer, robotics enthusiast, and builder of digital
              experiences. Currently crafting web solutions at{" "}
              <span className="text-[#00f0ff]">GreaTR</span>. Passionate about
              code, design, and pushing boundaries. Building with{" "}
              <span className="text-[#00f0ff]">Next.js</span>,{" "}
              <span className="text-[#00f0ff]">TypeScript</span>,{" "}
              <span className="text-[#00f0ff]">React</span> &{" "}
              <span className="text-[#00f0ff]">Tailwind CSS</span>.
            </p>
            <div
              className="fade-in flex gap-4 mb-12"
              style={{ transitionDelay: "0.3s" }}
            >
              <a
                href="https://github.com/EmirTolluoglu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[rgba(0,240,255,0.1)] rounded-xl text-[#8892b0] transition-all hover:border-[#00f0ff] hover:text-[#00f0ff] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] bg-[rgba(15,15,25,0.6)] backdrop-blur-lg"
              >
                {/* <Github size={20} /> */}
              </a>
              <a
                href="https://www.linkedin.com/in/emir-tolluoglu/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[rgba(0,240,255,0.1)] rounded-xl text-[#8892b0] transition-all hover:border-[#00f0ff] hover:text-[#00f0ff] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] bg-[rgba(15,15,25,0.6)] backdrop-blur-lg"
              >
                {/* <Linkedin size={20} /> */}
              </a>
              <a
                href="mailto:emir.tolluoglu@example.com"
                className="w-12 h-12 flex items-center justify-center border border-[rgba(0,240,255,0.1)] rounded-xl text-[#8892b0] transition-all hover:border-[#00f0ff] hover:text-[#00f0ff] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] bg-[rgba(15,15,25,0.6)] backdrop-blur-lg"
              >
                <Mail size={20} />
              </a>
            </div>
            <div
              className="fade-in flex flex-wrap gap-8 md:gap-12"
              style={{ transitionDelay: "0.4s" }}
            >
              {[
                { num: "8+", label: "Years Coding" },
                { num: "5", label: "AP Scores" },
                { num: "2M+", label: "App Downloads" },
                { num: "10+", label: "Projects" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-[#00f0ff] to-[#8b5cf6] bg-clip-text text-transparent">
                    {stat.num}
                  </div>
                  <div className="text-[#5a6478] text-xs uppercase tracking-widest mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <div className="fade-in mb-12">
                <span className="font-semibold text-sm uppercase tracking-widest text-[#00f0ff] mb-4 block">
                  About Me
                </span>
                <h2 className="font-bold text-4xl md:text-5xl mb-4">
                  Developer by passion,
                  <br />
                  engineer by curiosity.
                </h2>
                <p className="text-[#8892b0] text-lg leading-relaxed">
                  I&apos;ve been writing code since I was a kid. From founding a
                  VEX robotics team in middle school to leading development
                  teams at startups, I thrive on turning complex problems into
                  elegant solutions. Currently focused on{" "}
                  <span className="text-[#00f0ff]">Next.js</span>,{" "}
                  <span className="text-[#00f0ff]">TypeScript</span>, and{" "}
                  <span className="text-[#00f0ff]">React</span> with{" "}
                  <span className="text-[#00f0ff]">Tailwind CSS</span> for
                  modern web experiences.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <GraduationCap size={24} />,
                    title: "Education",
                    text: (
                      <>
                        Haydarpaşa High School (2020–2025)
                        <br />
                        <span className="text-[#00f0ff]">
                          LGS: 478/500 (Top 0.6%)
                        </span>
                        <br />
                        <span className="text-[#00f0ff]">
                          5 AP Exams — All 5s
                        </span>
                        <br />
                        Calculus BC, Physics C Mech, Physics C EM, CS A, Physics
                        1
                      </>
                    ),
                  },
                  {
                    icon: <Globe size={24} />,
                    title: "Languages",
                    text: (
                      <>
                        <strong className="text-[#f0f0f5]">Turkish</strong> —
                        Native
                        <br />
                        <strong className="text-[#f0f0f5]">English</strong> —
                        Professional Working Proficiency
                        <br />
                        <br />
                        Comfortable working in international teams and
                        environments.
                      </>
                    ),
                  },
                  {
                    icon: <Building2 size={24} />,
                    title: "University Offers",
                    text: (
                      <>
                        Computer Science admissions from:
                        <br />• University of Manchester
                        <br />• University of Bristol
                        <br />• University of Edinburgh
                        <br />• Virginia Tech
                        <br />• Michigan State (50% Scholarship)
                      </>
                    ),
                  },
                  {
                    icon: <Heart size={24} />,
                    title: "Volunteering",
                    text: (
                      <>
                        <strong className="text-[#f0f0f5]">
                          System Administrator
                        </strong>{" "}
                        at Aspieder (Asperger Awareness Assoc.)
                        <br />
                        <br />
                        <strong className="text-[#f0f0f5]">Founder</strong> of
                        Haydarpaşa Outreach Club — providing educational aid and
                        equality of opportunity for students.
                      </>
                    ),
                  },
                ].map((card) => (
                  <div key={card.title} className="fade-in glass-card">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(0,240,255,0.1)] text-[#00f0ff] text-2xl mb-4">
                      {card.icon}
                    </div>
                    <h4 className="font-semibold text-xl mb-3">{card.title}</h4>
                    <p className="text-[#8892b0] text-sm leading-relaxed">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-5/12 lg:ml-auto">
              <div className="fade-in relative pl-8">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00f0ff] to-[#8b5cf6] rounded-full" />
                  {[
                    {
                      date: "2025 – Present",
                      title: "Web Developer",
                      company: "GreaTR · Part-time · Hybrid",
                      desc: "Building modern web apps with Next.js, TypeScript, React & Tailwind CSS.",
                    },
                    {
                      date: "2022 – 2024",
                      title: "Web Developer Head",
                      company: "Gofret · Full-time · Remote",
                      desc: "Led web development, built student-friendly platforms, and managed marketing feature rollouts.",
                    },
                    {
                      date: "2023",
                      title: "Mobile Developer Lead",
                      company: "Appshub · Part-time · Remote",
                      desc: "Managed 3 apps with 2M+ downloads. Delivered 10+ version updates and new features.",
                    },
                    {
                      date: "2022 – 2023",
                      title: "Vice President & Web-IT Manager",
                      company: "Haydarpaşa High School · Full-time",
                      desc: "",
                    },
                    {
                      date: "2021 – 2023",
                      title: "Co-Founder & Board Member",
                      company: "Haydarpasa Panthers #9231 (FRC)",
                      desc: "Led 50+ people in international robotics competitions. Won multiple awards.",
                    },
                    {
                      date: "2021 – 2022",
                      title: "Board Member & Programming Mentor",
                      company: "Haydarpaşa IT Club · Part-time",
                      desc: "Mentored students, organized workshops, and built countless projects.",
                    },
                    {
                      date: "2020 – 2022",
                      title: "Founder",
                      company: "Worsav Studio · Self-employed",
                      desc: "Indie game studio. Developed experimental games and mechanics.",
                    },
                    {
                      date: "2016 – 2018",
                      title: "Team Founder",
                      company: "VEX Robotics · Part-time",
                      desc: "Founded the school's first VEX team. Competed and placed in multiple tournaments.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="relative pb-12 pl-8 last:pb-0">
                      <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-[#050505] border-2 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)]" />
                      <div className="font-semibold text-xs uppercase tracking-widest text-[#00f0ff] mb-1">
                        {item.date}
                      </div>
                      <div className="font-semibold text-lg">{item.title}</div>
                      <div className="text-[#8b5cf6] text-sm font-medium">
                        {item.company}
                      </div>
                      {item.desc && (
                        <div className="text-[#8892b0] text-sm mt-2">
                          {item.desc}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-in">
            <span className="font-semibold text-sm uppercase tracking-widest text-[#00f0ff] mb-4 block">
              Portfolio
            </span>
            <h2 className="font-bold text-4xl md:text-5xl mb-4">
              Featured Projects
            </h2>
            <p className="text-[#8892b0] text-lg max-w-2xl mx-auto">
              A selection of projects that define my journey as a developer and
              problem-solver.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Accessibility size={24} />,
                title: "Multi-Sensory Geography Education",
                desc: "Tactile 3D-printed teaching materials for visually impaired students to learn earth landforms through multiple senses. Designed for secondary and high school levels.",
                tags: ["3D Printing", "3D Modeling", "Accessibility"],
                date: "Mar 2021 – Nov 2023",
              },
              {
                icon: <Boxes size={24} />,
                title: "Virtual Museum of Haydarpaşa",
                desc: "A 3D virtual museum showcasing 200 years of Haydarpaşa High School history. Photogrammetry-based 3D scans with historical context and alumni memories.",
                tags: ["Virtual Reality", "Web Development", "3D Scanning"],
                date: "Sep 2022 – May 2023",
              },
              {
                icon: <Plane size={24} />,
                title: "Teknofest Projects",
                desc: "Competed in multiple Teknofest categories: FlameFlapps (UAV), ALLTRANS (UAV), and ELECTROFORCE (Underwater Systems). Built teams and engineered solutions.",
                tags: ["UAV", "Electronics", "Leadership"],
                date: "Feb 2021 – Nov 2022",
              },
              {
                icon: <Bot size={24} />,
                title: "DUDO | TÜBİTAK 4006",
                desc: "A TÜBİTAK 4006 research project developed at Haydarpaşa High School. Applied scientific methodology to solve real-world problems.",
                tags: ["3D Modeling", "Research", "TÜBİTAK"],
                date: "May 2022 – Jun 2022",
              },
              {
                icon: <Store size={24} />,
                title: "Gofret Platform",
                desc: "A student-friendly e-commerce and social platform. Led the full-stack development as Web Developer Head, building features for thousands of users. Recently migrated to Next.js & Tailwind.",
                tags: ["Next.js", "TypeScript", "Tailwind", "Full Stack"],
                date: "2022 – 2024",
              },
              {
                icon: <CalendarCheck size={24} />,
                title: "Evo Calendar + Google API",
                desc: "Node.js integration layer connecting Google Calendar API with the Evo Calendar library. Open-source utility for dynamic calendar rendering.",
                tags: ["Node.js", "Google API", "Open Source"],
                date: "2022",
              },
            ].map((project, i) => (
              <div key={i} className="fade-in glass-card">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(0,240,255,0.1)] text-[#00f0ff] text-2xl mb-4">
                  {project.icon}
                </div>
                <h4 className="font-semibold text-xl mb-3">{project.title}</h4>
                <p className="text-[#8892b0] text-sm leading-relaxed mb-4">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.15)] text-[#00f0ff]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[#5a6478] text-sm">
                  <CalendarDays size={14} className="text-[#00f0ff]" />
                  {project.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-in">
            <span className="font-semibold text-sm uppercase tracking-widest text-[#00f0ff] mb-4 block">
              Recognition
            </span>
            <h2 className="font-bold text-4xl md:text-5xl mb-4">
              Awards & Honors
            </h2>
            <p className="text-[#8892b0] text-lg max-w-2xl mx-auto">
              Awards from robotics competitions, science fairs, and social
              responsibility initiatives.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                icon: <Award size={20} />,
                title: "Judges Award",
                issuer: "FIRST Robotics Competition",
                date: "March 2024 · Haydarpasa Panthers #9231",
              },
              {
                icon: <Trophy size={20} />,
                title: "Fikir Bilim Festivali Award",
                issuer: "Üsküdar University",
                date: "March 2023 · Vision and presentation skills recognized",
              },
              {
                icon: <Gem size={20} />,
                title: "Pearl Club of The Year",
                issuer: "LÖSEV Foundation",
                date: "February 2023 · Social responsibility initiatives",
              },
              {
                icon: <Rocket size={20} />,
                title: "FRC Rookie Inspiration Award",
                issuer: "FIRST Robotics Competition",
                date: "November 2022 · First-year performance and teamwork",
              },
              {
                icon: <Users size={20} />,
                title: "Team Spirit Award",
                issuer: "FIRST Robotics Competition",
                date: "November 2022 · Effective team spirit and collaboration",
              },
            ].map((award, i) => (
              <div
                key={i}
                className="fade-in flex items-start gap-6 p-6 bg-[rgba(15,15,25,0.6)] border border-[rgba(0,240,255,0.1)] rounded-2xl backdrop-blur-xl transition-all hover:border-[rgba(139,92,246,0.3)] hover:translate-x-1"
              >
                <div className="w-12 h-12 min-w-[48px] rounded-xl flex items-center justify-center bg-[rgba(139,92,246,0.15)] text-[#8b5cf6]">
                  {award.icon}
                </div>
                <div>
                  <div className="font-semibold text-lg">{award.title}</div>
                  <div className="text-[#8b5cf6] text-sm font-medium">
                    {award.issuer}
                  </div>
                  <div className="text-[#5a6478] text-sm">{award.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="fade-in rounded-3xl p-12 md:p-16 text-center border border-[rgba(0,240,255,0.1)] backdrop-blur-xl bg-gradient-to-br from-[rgba(0,240,255,0.05)] to-[rgba(139,92,246,0.05)]">
            <h2 className="font-bold text-3xl md:text-5xl mb-4">
              Let&apos;s build something{" "}
              <span className="bg-gradient-to-r from-[#00f0ff] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
                extraordinary
              </span>
              .
            </h2>
            <p className="text-[#8892b0] text-lg max-w-xl mx-auto mb-8">
              I&apos;m always open to discussing new projects, creative ideas,
              or opportunities to be part of your vision. Currently building
              with <span className="text-[#00f0ff]">Next.js</span>,{" "}
              <span className="text-[#00f0ff]">TypeScript</span>,{" "}
              <span className="text-[#00f0ff]">React</span> &{" "}
              <span className="text-[#00f0ff]">Tailwind CSS</span>.
            </p>
            <a
              href="mailto:emir.tolluoglu@example.com"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#8b5cf6] text-[#050505] font-semibold transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,240,255,0.3)]"
            >
              <Send size={18} />
              Get In Touch
            </a>
            <div className="flex justify-center gap-4 mt-8">
              <a
                href="https://github.com/EmirTolluoglu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[rgba(0,240,255,0.1)] rounded-xl text-[#8892b0] transition-all hover:border-[#00f0ff] hover:text-[#00f0ff] hover:-translate-y-1 bg-[rgba(15,15,25,0.6)] backdrop-blur-lg"
              >
                {/* <Github size={20} /> */}
              </a>
              <a
                href="https://www.linkedin.com/in/emir-tolluoglu/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[rgba(0,240,255,0.1)] rounded-xl text-[#8892b0] transition-all hover:border-[#00f0ff] hover:text-[#00f0ff] hover:-translate-y-1 bg-[rgba(15,15,25,0.6)] backdrop-blur-lg"
              >
                {/* <Linkedin size={20} /> */}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[rgba(0,240,255,0.1)] text-center text-[#5a6478] text-sm relative z-10">
        <div className="container mx-auto px-6">
          <p>
            © 2025 Emir Tolluoğlu. Designed & Built with Next.js, TypeScript,
            React & Tailwind CSS.
          </p>
        </div>
      </footer>

      {/* Global Styles for animations */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient-shift 3s ease infinite;
        }
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .glass-card {
          background: rgba(15, 15, 25, 0.6);
          border: 1px solid rgba(0, 240, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          transition: all 0.4s ease;
          height: 100%;
        }
        .glass-card:hover {
          border-color: rgba(0, 240, 255, 0.3);
          transform: translateY(-5px);
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(0, 240, 255, 0.05);
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00f0ff, #8b5cf6);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
