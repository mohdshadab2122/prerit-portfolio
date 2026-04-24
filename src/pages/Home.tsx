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
import { useAppData } from "../Context/DataContext";

const getDriveImage = (link: string) => {
    if (!link) return null;

    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;

    const fileId = match[1];

    // 🔥 CHANGE HERE: 'drive.google.com' ki jagah 'googleusercontent.com' use kar rahe hain
    // Ye iframe aur ad-blockers me fail nahi hota
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  };


export default function Home() {
  const { data, loading } = useAppData();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading portfolio...</p>
      </div>
    );
  }

if (!data) return null;

  const home = data.home?.[0];
  if (!home) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>No Home Data Found</p>
      </div>
    );
  }
  
  const experiences = data.experiences || [];
  const education = data.education || [];
  const publications = [
    ...(data.publicationConferences || []).slice().reverse().slice(0,1),
    ...(data.publicationJournals || []).slice().reverse().slice(0,1),
    ...(data.publicationPreprints || []).slice().reverse().slice(0,1),
  ];
  const awards = data.awards || [];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-14 pb-10 md:pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {home.tags?.length > 0 && (
              <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.35em] text-[#FF6B00] mb-5">
                {home.tags.join(" • ")}
              </p>
            )}

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter text-[#0D0D0D] mb-6 leading-[0.9]">
              PRERIT <br />
              <span className="text-[#FF6B00]">PRAMOD</span>
            </h1>

            {home.domain && (
              <h2 className="text-xl md:text-2xl font-medium text-[#0D0D0D]/80 mb-7 tracking-tight">
                {home.domain}
              </h2>
            )}

            {home.shortBio && (
              <p className="text-lg text-[#0D0D0D]/68 mb-9 max-w-2xl leading-relaxed">
                {home.shortBio}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {home.links?.linkedin && (
                <a href={home.links.linkedin} target="_blank"
                  className="inline-flex items-center gap-2 bg-[#0D0D0D] text-white px-6 py-3 rounded-xl hover:opacity-90 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200">
                  LinkedIn <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {home.links?.scholar && (
                <a href={home.links.scholar} target="_blank"
                  className="inline-flex items-center gap-2 border border-[#E5E7EB] px-6 py-3 rounded-xl hover:bg-[#F4F4F5] hover:shadow-sm hover:-translate-y-[1px] transition-all duration-200">
                  Google Scholar <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {home.links?.patents && (
                <a href={home.links.patents} target="_blank"
                  className="inline-flex items-center gap-2 border border-[#E5E7EB] px-6 py-3 rounded-xl hover:bg-[#F4F4F5] hover:shadow-sm hover:-translate-y-[1px] transition-all duration-200">
                  Google Patents <FileText className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Inline Stats */}
            {home.achievements && (
              <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#0D0D0D]/60">
                {home.achievements.split(",").map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <span>{item.trim()}</span>

                    {index !== home.achievements.split(",").length - 1 && (
                      <span className="w-1.5 h-1.5 bg-[#0D0D0D]/30 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="flex justify-center lg:justify-end lg:pr-12">
              <div className="w-[380px] h-[380px] md:w-[480px] md:h-[480px] rounded-full overflow-hidden border border-[#E5E7EB]/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                <img
                  src={getDriveImage(home.photo) || "/fallback.png"}
                  alt="Prerit Pramod"
                  className="w-full h-full object-cover object-[center_top]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

     {/* Executive Summary Cards */}
      <div className="max-w-7xl mx-auto mt-8 px-6">
        <div className={`grid gap-8 ${
          (home.cards || []).length === 1
            ? "md:grid-cols-1"
            : (home.cards || []).length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-3"
        }`}>
          {home.cards && home.cards.map((card: string, index: number) => {
            const [title, ...rest] = card.split("\n");
            const content = rest.join("\n");

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                {title && (
                  <h3 className="text-[16px] md:text-[18px] font-bold uppercase tracking-[0.08em] text-[#0D0D0D] mb-4">
                    {title}
                  </h3>
                )}

                {content && (
                  <p className="text-[15px] md:text-[16px] leading-[1.8] text-[#0D0D0D]/75 leading-relaxed whitespace-pre-line">
                    {content}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Professional Experience */}
      {experiences.length > 0 && (
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
              {experiences
                .slice()
                .reverse()
                .slice(0, 3)
                .map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-4">{exp.period}</div>
                  <h3 className="text-xl font-bold mb-2 text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors">{exp.role}</h3>
                  <div className="text-[#0D0D0D]/60 font-medium mb-6">{exp.company}</div>
                  {exp.roleDesc && (
                    <ul className="space-y-2">
                      {exp.roleDesc.split("\n").map((line: string, i: number) => (
                        <li key={i} className="text-sm text-[#0D0D0D]/80 flex gap-3">
                          <span className="w-1.5 h-1.5 bg-[#0A5CE6]/50 rounded-full mt-2" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Publications Preview */}
      {publications.length > 0 && (
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
              {publications.length > 0 && publications.map((pub: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-7 hover:bg-[#FAFAFA] hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3">
                    {pub.year || pub.date}
                  </div>
                  <h3 className="text-lg font-semibold text-[#0D0D0D] leading-snug mb-4">
                    {pub.title}
                  </h3>
                  <div className="text-sm text-[#0D0D0D]/55 font-medium">
                    {pub.organization || pub.event || pub.platform}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
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
              {education
                .slice()
                .reverse()
                .slice(0, 2)
                .map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-4">{edu.year}</div>
                  <h3 className="text-2xl font-bold mb-2 text-[#0A5CE6] leading-tight">{edu.degree}</h3>
                  <div className="text-xl font-bold text-[#0D0D0D]/85 mb-2">{edu.major}</div>
                  <div className="text-[#0D0D0D]/60 font-medium italic mb-6">{edu.specialization}</div>

                  {edu.degreeDesc && (
                    <ul className="space-y-2 mt-4">
                      {edu.degreeDesc.split("\n").map((line: string, i: number) => (
                        <li key={i} className="text-sm text-[#0D0D0D]/80 flex gap-3">
                          <span className="w-1.5 h-1.5 bg-[#0A5CE6]/50 rounded-full mt-2" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}

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
      )}

      {/* Awards Preview */}
      {awards.length > 0 && (
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
              {awards
                .slice()
                .reverse()
                .slice(0, 3)
                .map((award: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:bg-[#FAFAFA] hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3">{award.year}</div>
                  <h3 className="text-lg font-bold mb-2 leading-tight text-[#0D0D0D]">{award.title}</h3>
                  <div className="text-sm text-[#0D0D0D]/60 font-medium">{award.institution}</div>
                  {award.description && (
                    <ul className="space-y-2 mt-4">
                      {award.description.split("\n").map((line: string, i: number) => (
                        <li key={i} className="text-sm text-[#0D0D0D]/80 flex gap-3">
                          <span className="w-1.5 h-1.5 bg-[#0A5CE6]/50 rounded-full mt-2" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}