import { motion } from 'motion/react';
import {
  ArrowRight,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  BookOpen,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const experiences = [
    {
      role: 'Founder & CEO',
      company: 'Inspired Innovation LLC',
      years: 'August 2025 – Present',
      achievements: [
        'Building a research-first engineering and technology consulting organization focused on advanced product innovation, robotics, autonomous systems, and intellectual property generation.',
        'Developing a multidisciplinary engineering team across power electronics, controls, sensing, and embedded systems.',
        'Serving clients across electric mobility, deep technology, and next-generation intelligent systems.'
      ]
    },
    {
      role: 'Associate Director',
      company: 'MicroVision, Inc.',
      years: 'April 2025 – July 2025',
      achievements: [
        'Led control systems engineering efforts supporting real-time embedded algorithms and intelligent mobility architectures.',
        'Drove architectural and algorithmic definition from a systems perspective for advanced technical programs.',
        'Collaborated cross-functionally to support systems integration, traceability, and engineering execution.'
      ]
    },
    {
      role: 'Engineering Manager / Senior Engineering Supervisor',
      company: 'Nexteer Automotive Corporation',
      years: 'January 2017 – March 2025',
      achievements: [
        'Managed globally distributed engineering teams driving electric motor drives and motion control R&D.',
        'Led development of technologies contributing to innovative steering and advanced mobility product lines.',
        'Supported system safety, technical leadership, and engineering process maturity across advanced automotive programs.'
      ]
    }
  ];

  const education = [
    {
      degree: 'Master of Science in Engineering (M.S.E.)',
      major: 'Electrical Engineering Systems',
      specialization: 'Control Systems, Signal Processing',
      institution: 'University of Michigan, Ann Arbor, Michigan, USA',
      year: 'December 2012'
    },
    {
      degree: 'Bachelor of Engineering (B.E.)',
      major: 'Electrical Engineering',
      specialization: 'Electric Machines, Power Electronics',
      institution: 'Delhi College of Engineering, University of Delhi, Delhi, India',
      year: 'June 2010'
    }
  ];

  const awardsPreview = [
    {
      title: 'Melvin M. Wilcox Innovation Award',
      institution: 'SAE International',
      year: '2023'
    },
    {
      title: 'Innovation Hall of Fame — Platinum Tier',
      institution: 'Nexteer Automotive',
      year: '2022'
    },
    {
      title: 'IEEE Outstanding Young Member Achievement Award',
      institution: 'IEEE',
      year: '2021'
    }
  ];

  const publicationsPreview = [
    {
      title: 'Dynamic Current Control of Biaxial Excitation Synchronous Machines',
      venue: 'IEEE ECCE',
      year: '2024'
    },
    {
      title: 'Impact of Electric Motor Drive Dynamics on Performance and Stability of Electric Power Steering Systems',
      venue: 'SAE WCX',
      year: '2021'
    },
    {
      title: 'Modeling of Mutually Coupled Switched Reluctance Motors Based on Net Flux Method',
      venue: 'IEEE IAS',
      year: '2020'
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.35em] text-[#FF6B00] mb-5">
              Founder • Inventor • Engineering Executive
            </p>

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter text-[#0D0D0D] mb-6 leading-[0.9]">
              PRERIT <br />
              <span className="text-[#FF6B00]">PRAMOD</span>
            </h1>

            <h2 className="text-xl md:text-2xl font-medium text-[#0D0D0D]/80 mb-7 tracking-tight">
              Power Electronics · Autonomous Systems · Deep Technology
            </h2>

            <p className="text-lg text-[#0D0D0D]/68 mb-9 max-w-2xl leading-relaxed">
              Innovating at the intersection of power electronics, autonomous systems, and deep technology — with 225+ patents and a career spanning energy, automotive, and defense.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="https://linkedin.com/in/prerit-pramod-71a23642"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0D0D0D] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                LinkedIn
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://scholar.google.com/citations?user=CVs_a6EAAAAJ&hl=en&oi=ao"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#0D0D0D] px-6 py-3 rounded-xl font-medium hover:bg-[#F8F8F8] transition-colors"
              >
                Google Scholar
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://patents.google.com/?inventor=prerit+pramod&oq=prerit+pramod"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#0D0D0D] px-6 py-3 rounded-xl font-medium hover:bg-[#F8F8F8] transition-colors"
              >
                Google Patents
                <FileText className="w-4 h-4" />
              </a>
            </div>

            {/* Inline Stats */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#0D0D0D]/50">
              <span><strong className="text-[#0D0D0D]">225+</strong> Patents</span>
              <span><strong className="text-[#0D0D0D]">35+</strong> Technology Families</span>
              <span><strong className="text-[#0D0D0D]">50M+</strong> Vehicles Impacted</span>
              <span><strong className="text-[#0D0D0D]">$7B+</strong> Revenue Influence</span>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative h-[520px] md:h-[620px] rounded-3xl overflow-hidden border border-[#E5E7EB] bg-[#F4F4F5]">
              <img
                src="/prerit.jpg"
                alt="Prerit Pramod"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FF6B00] mb-2">
                Positioning
              </p>
              <p className="text-sm md:text-base text-[#0D0D0D]/72 leading-relaxed">
                Founder and engineering leader building across advanced controls, electric systems, intelligent mobility, and patent-led deep technology.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

     {/* Executive Summary Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0 }}
              className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
            >
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#FF6B00] mb-5">
                Leadership & Career
              </p>
              <p className="text-[17px] leading-[1.9] text-[#0D0D0D]/68 font-light">
                <span className="font-semibold text-[#0D0D0D]">Prerit Pramod</span> is the Founder and CEO of <span className="font-semibold text-[#0D0D0D]">Inspired Innovation LLC</span>, a technology consulting and product development company. His career spans roles at <span className="font-semibold text-[#0D0D0D]">Indian Oil Corporation</span>, <span className="font-semibold text-[#0D0D0D]">Nexteer Automotive</span>, and <span className="font-semibold text-[#0D0D0D]">MicroVision</span>, where he developed expertise in power electronics, motion control, embedded systems, and sensor fusion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
            >
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#FF6B00] mb-5">
                Patent Portfolio & Impact
              </p>
              <p className="text-[17px] leading-[1.9] text-[#0D0D0D]/68 font-light">
                <span className="font-semibold text-[#0D0D0D]">Prerit</span> holds a portfolio of over <span className="font-semibold text-[#0D0D0D]">225 patents</span> across US and international jurisdictions, organized into <span className="font-semibold text-[#0D0D0D]">35+ technology families</span> covering steering control, motor drives, steer-by-wire, LiDAR, and related domains. His innovations have been implemented in systems affecting over <span className="font-semibold text-[#0D0D0D]">50 million vehicles</span> and contributing to more than <span className="font-semibold text-[#0D0D0D]">$7 billion in revenue impact</span>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
            >
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#FF6B00] mb-5">
                Recognition & Standing
              </p>
              <p className="text-[17px] leading-[1.9] text-[#0D0D0D]/68 font-light">
                He is an <span className="font-semibold text-[#0D0D0D]">EB-1A visa holder</span>, recognized for extraordinary ability in engineering. His professional honors include the <span className="font-semibold text-[#0D0D0D]">IEEE Industry Applications Society Outstanding Young Professional Achievement Award</span> and induction into the <span className="font-semibold text-[#0D0D0D]">IEEE IAS Hall of Fame</span>. He has been nominated for the <span className="font-semibold text-[#0D0D0D]">IEEE Theodore W. Hissey Outstanding Young Professional Award</span>, the <span className="font-semibold text-[#0D0D0D]">SAE Forest R. McFarland Award</span>, and the <span className="font-semibold text-[#0D0D0D]">Nagamori Awards</span>.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Professional Experience */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="flex items-center gap-4">
              <Briefcase className="w-8 h-8 text-[#FF6B00]" />
              <h2 className="text-4xl font-bold tracking-tight text-[#0D0D0D]">Professional Experience</h2>
            </div>
            <Link
              to="/experience"
              className="inline-flex items-center gap-2 text-[#0A5CE6] font-medium hover:underline underline-offset-4"
            >
              View All Experience
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-[#F4F4F5] transition-colors group"
              >
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-4">{exp.years}</div>
                <h3 className="text-xl font-bold mb-2 text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors">{exp.role}</h3>
                <div className="text-[#0D0D0D]/60 font-medium mb-6">{exp.company}</div>
                <ul className="space-y-3">
                  {exp.achievements.map((achieve, i) => (
                    <li key={i} className="text-sm text-[#0D0D0D]/80 flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A5CE6]/50 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{achieve}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Preview */}
      <section className="py-20 px-6 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-[#FF6B00]" />
              <h2 className="text-4xl font-bold tracking-tight text-[#0D0D0D]">Selected Publications</h2>
            </div>
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 text-[#0A5CE6] font-medium hover:underline underline-offset-4"
            >
              View All Publications
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {publicationsPreview.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-7 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3">
                  {pub.year}
                </div>
                <h3 className="text-lg font-semibold text-[#0D0D0D] leading-snug mb-4">
                  {pub.title}
                </h3>
                <div className="text-sm text-[#0D0D0D]/55 font-medium">
                  {pub.venue}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="flex items-center gap-4">
              <GraduationCap className="w-8 h-8 text-[#FF6B00]" />
              <h2 className="text-4xl font-bold tracking-tight text-[#0D0D0D]">Education</h2>
            </div>
            <Link
              to="/education"
              className="inline-flex items-center gap-2 text-[#0A5CE6] font-medium hover:underline underline-offset-4"
            >
              View Full Education
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-[#F4F4F5] transition-colors"
              >
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-4">{edu.year}</div>
                <h3 className="text-2xl font-bold mb-2 text-[#0A5CE6] leading-tight">{edu.degree}</h3>
                <div className="text-xl font-bold text-[#0D0D0D]/85 mb-2">{edu.major}</div>
                <div className="text-[#0D0D0D]/60 font-medium italic mb-6">{edu.specialization}</div>

                <div className="pt-6 border-t border-[#E5E7EB]">
                  <div className="text-sm font-bold text-[#0D0D0D]/80 uppercase tracking-widest">
                    {edu.institution}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Preview */}
      <section className="py-20 px-6 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="flex items-center gap-4">
              <Award className="w-8 h-8 text-[#FF6B00]" />
              <h2 className="text-4xl font-bold tracking-tight text-[#0D0D0D]">Featured Awards</h2>
            </div>
            <Link
              to="/awards"
              className="inline-flex items-center gap-2 text-[#0A5CE6] font-medium hover:underline underline-offset-4"
            >
              View All Achievements
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {awardsPreview.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white p-8 rounded-2xl border border-[#E5E7EB]"
              >
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3">{award.year}</div>
                <h3 className="text-lg font-bold mb-2 leading-tight text-[#0D0D0D]">{award.title}</h3>
                <div className="text-sm text-[#0D0D0D]/60 font-medium">{award.institution}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}