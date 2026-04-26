import { motion } from "motion/react";
import {
  ArrowRight,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  BookOpen,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../Context/DataContext";

const getDriveImage = (link: string) => {
  if (!link) return null;
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  const fileId = match[1];
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
    ...(data.publicationConferences || []).slice().reverse().slice(0, 1),
    ...(data.publicationJournals || []).slice().reverse().slice(0, 1),
    ...(data.publicationPreprints || []).slice().reverse().slice(0, 1),
  ];
  const awards = data.awards || [];

  return (
    <div className="w-full bg-white">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-8 md:pt-10 lg:pt-14 pb-8 md:pb-10 lg:pb-12 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 lg:gap-14 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {home.tags?.length > 0 && (
              <p className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.35em] text-[#FF6B00] mb-4 md:mb-5">
                {home.tags.join(" • ")}
              </p>
            )}

            {/* Responsive hero name — 15.6" (xl) stays at text-8xl */}
            <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-[#0D0D0D] mb-4 md:mb-6 leading-[0.9]">
              {(() => {
                const words = home.name?.toUpperCase().split(" ") || [];
                if (words.length === 2) {
                  return (
                    <>
                      <span>{words[0]}</span>
                      <br />
                      <span className="text-[#FF6B00]">{words[1]}</span>
                    </>
                  );
                }
                if (words.length >= 3) {
                  return (
                    <>
                      <span>
                        {words[0]} {words[1]}
                      </span>
                      <br />
                      <span className="text-[#FF6B00]">
                        {words.slice(2).join(" ")}
                      </span>
                    </>
                  );
                }
                return <span>{home.name}</span>;
              })()}
            </h1>

            {home.domain && (
              <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-[#0D0D0D]/80 mb-5 md:mb-7 tracking-tight">
                {home.domain}
              </h2>
            )}

            {home.shortBio && (
              <p className="text-base md:text-lg text-[#0D0D0D]/68 mb-7 md:mb-9 max-w-2xl leading-relaxed">
                {home.shortBio}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 md:gap-4">
              {home.links?.linkedin && (
                <a
                  href={home.links.linkedin}
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-[#0D0D0D] text-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-xl hover:opacity-90 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200"
                >
                  LinkedIn{" "}
                  <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              )}

              {home.links?.scholar && (
                <a
                  href={home.links.scholar}
                  target="_blank"
                  className="inline-flex items-center gap-2 border border-[#E5E7EB] px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-xl hover:bg-[#F4F4F5] hover:shadow-sm hover:-translate-y-[1px] transition-all duration-200"
                >
                  Google Scholar{" "}
                  <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              )}

              {home.links?.patents && (
                <a
                  href={home.links.patents}
                  target="_blank"
                  className="inline-flex items-center gap-2 border border-[#E5E7EB] px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-xl hover:bg-[#F4F4F5] hover:shadow-sm hover:-translate-y-[1px] transition-all duration-200"
                >
                  Google Patents{" "}
                  <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              )}
            </div>

            {/* Inline Stats */}
            {home.achievements && (
              <div className="mt-7 md:mt-10 flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 text-xs md:text-sm text-[#0D0D0D]/60">
                {home.achievements
                  .split(",")
                  .map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 md:gap-4"
                    >
                      <span>{item.trim()}</span>
                      {index !== home.achievements.split(",").length - 1 && (
                        <span className="w-1.5 h-1.5 bg-[#0D0D0D]/30 rounded-full" />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </motion.div>

          {/* Right — Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="flex justify-center lg:justify-end lg:pr-12">
              {/*
                Image sizes by breakpoint:
                  mobile  (< 640px)  : w-56  h-56  (224px)
                  sm      (≥ 640px)  : w-72  h-72  (288px)
                  md      (≥ 768px)  : 340px
                  lg      (≥ 1024px) : 380px  ← your 13" laptop
                  xl      (≥ 1280px) : 480px  ← same as original on 14"–15.6"
              */}
              <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px] xl:w-[480px] xl:h-[480px] rounded-full overflow-hidden border border-[#E5E7EB]/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
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

      {/* ─── Executive Summary Cards ─── */}
      <div className="max-w-7xl mx-auto mt-6 md:mt-8 px-4 md:px-6">
        <div
          className={`grid gap-4 sm:gap-6 lg:gap-8 ${
            (home.cards || []).length === 1
              ? "grid-cols-1"
              : (home.cards || []).length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {home.cards &&
            home.cards.map((card: string, index: number) => {
              const [title, ...rest] = card.split("\n");
              const content = rest.join("\n");
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  {title && (
                    <h3 className="text-[14px] md:text-[16px] lg:text-[18px] font-bold uppercase tracking-[0.08em] text-[#0D0D0D] mb-3 md:mb-4">
                      {title}
                    </h3>
                  )}
                  {content && (
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] leading-[1.8] text-[#0D0D0D]/75 whitespace-pre-line">
                      {content}
                    </p>
                  )}
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* ─── Professional Experience ─── */}
      {experiences.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8 mb-8 md:mb-10 lg:mb-14">
              <div className="flex items-center gap-3 md:gap-4">
                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-[#FF6B00] shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0D0D0D]">
                  Professional Experience
                </h2>
              </div>
              <Link
                to="/experience"
                className="inline-flex items-center gap-2 text-[#0A5CE6] text-sm md:text-base font-medium hover:underline underline-offset-4 shrink-0"
              >
                View All Experience
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                    className="p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3 md:mb-4">
                      {exp.period}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors">
                      {exp.role}
                    </h3>
                    <div className="text-sm md:text-base text-[#0D0D0D]/60 font-medium mb-4 md:mb-6">
                      {exp.company}
                    </div>
                    {exp.roleDesc && (
                      <ul className="space-y-2">
                        {exp.roleDesc
                          .split("\n")
                          .map((line: string, i: number) => (
                            <li
                              key={i}
                              className="text-sm text-[#0D0D0D]/80 flex gap-3"
                            >
                              <span className="w-1.5 h-1.5 bg-[#0A5CE6]/50 rounded-full mt-2 shrink-0" />
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

      {/* ─── Publications Preview ─── */}
      {publications.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-20 px-4 md:px-6 bg-[#F8F8F8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8 mb-8 md:mb-10 lg:mb-14">
              <div className="flex items-center gap-3 md:gap-4">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-[#FF6B00] shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0D0D0D]">
                  Selected Publications
                </h2>
              </div>
              <Link
                to="/publications"
                className="inline-flex items-center gap-2 text-[#0A5CE6] text-sm md:text-base font-medium hover:underline underline-offset-4 shrink-0"
              >
                View All Publications
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {publications.map((pub: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 lg:p-7 hover:bg-[#FAFAFA] hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3">
                    {pub.year || pub.date}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-[#0D0D0D] leading-snug mb-4">
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

      {/* ─── Education ─── */}
      {education.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8 mb-8 md:mb-10 lg:mb-14">
              <div className="flex items-center gap-3 md:gap-4">
                <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-[#FF6B00] shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0D0D0D]">
                  Education
                </h2>
              </div>
              <Link
                to="/education"
                className="inline-flex items-center gap-2 text-[#0A5CE6] text-sm md:text-base font-medium hover:underline underline-offset-4 shrink-0"
              >
                View Full Education
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
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
                    className="p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3 md:mb-4">
                      {edu.year}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#0A5CE6] leading-tight">
                      {edu.degree}
                    </h3>
                    <div className="text-lg md:text-xl font-bold text-[#0D0D0D]/85 mb-2">
                      {edu.major}
                    </div>
                    <div className="text-sm md:text-base text-[#0D0D0D]/60 font-medium italic mb-4 md:mb-6">
                      {edu.specialization}
                    </div>

                    {edu.degreeDesc && (
                      <ul className="space-y-2 mt-3 md:mt-4">
                        {edu.degreeDesc
                          .split("\n")
                          .map((line: string, i: number) => (
                            <li
                              key={i}
                              className="text-sm text-[#0D0D0D]/80 flex gap-3"
                            >
                              <span className="w-1.5 h-1.5 bg-[#0A5CE6]/50 rounded-full mt-2 shrink-0" />
                              <span>{line}</span>
                            </li>
                          ))}
                      </ul>
                    )}

                    <div className="pt-5 md:pt-6 border-t border-[#E5E7EB]">
                      <div className="text-xs md:text-sm font-bold text-[#0D0D0D]/80 uppercase tracking-widest">
                        {edu.institution}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Awards ─── */}
      {awards.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-20 px-4 md:px-6 bg-[#F8F8F8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8 mb-8 md:mb-10 lg:mb-14">
              <div className="flex items-center gap-3 md:gap-4">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-[#FF6B00] shrink-0" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0D0D0D]">
                  Featured Awards
                </h2>
              </div>
              <Link
                to="/awards"
                className="inline-flex items-center gap-2 text-[#0A5CE6] text-sm md:text-base font-medium hover:underline underline-offset-4 shrink-0"
              >
                View All Achievements
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
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
                    className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] hover:bg-[#FAFAFA] hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3">
                      {award.year}
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-2 leading-tight text-[#0D0D0D]">
                      {award.title}
                    </h3>
                    <div className="text-sm text-[#0D0D0D]/60 font-medium">
                      {award.institution}
                    </div>
                    {award.description && (
                      <ul className="space-y-2 mt-3 md:mt-4">
                        {award.description
                          .split("\n")
                          .map((line: string, i: number) => (
                            <li
                              key={i}
                              className="text-sm text-[#0D0D0D]/80 flex gap-3"
                            >
                              <span className="w-1.5 h-1.5 bg-[#0A5CE6]/50 rounded-full mt-2 shrink-0" />
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
