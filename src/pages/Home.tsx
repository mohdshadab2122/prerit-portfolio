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

// ── Shared design tokens (sab cards ek jaise dikhein) ──────────────────────
const LABEL =
  "text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3 md:mb-4";
const TITLE =
  "text-base md:text-lg font-bold text-[#0D0D0D] leading-snug mb-1.5";
const SUB = "text-sm text-[#0D0D0D]/55 font-medium";
const DOT = "w-1.5 h-1.5 bg-[#0A5CE6]/40 rounded-full mt-2 shrink-0";
const BTXT = "text-sm text-[#0D0D0D]/70 leading-relaxed";
// ─────────────────────────────────────────────────────────────────────────────

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
      {/* ══════════════════════════════════
          HERO  ─ bg: white
      ══════════════════════════════════ */}
      {/* ══════════════════════════════════
          HERO  ─ Redesigned (Light Theme, Dynamic Font)
      ══════════════════════════════════ */}
      <section className="relative pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 px-4 md:px-6 overflow-hidden bg-white border-b border-[#E5E7EB]/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Left Side - Typography & Content */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            {/* Top Tags */}
            {home.tags?.length > 0 && (
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B00] mb-5">
                {home.tags.join(" • ")}
              </p>
            )}

            {/* Massive Name with Dynamic Sizing */}
            {(() => {
              const nameStr = home.name || "";
              const nameLen = nameStr.length;

              // Font size classes based on name length
              let fontSizeClass =
                "text-6xl sm:text-7xl md:text-[80px] lg:text-[100px]"; // Default (e.g. "Prerit Pramod" - 13 chars)

              if (nameLen >= 20) {
                fontSizeClass =
                  "text-4xl sm:text-5xl md:text-[50px] lg:text-[60px]"; // Very long names
              } else if (nameLen >= 14) {
                fontSizeClass =
                  "text-5xl sm:text-6xl md:text-[65px] lg:text-[85px]"; // Medium long (e.g. "Pramod Kumar Gupta" - 18 chars)
              }

              return (
                <h1
                  className={`font-black tracking-tighter text-[#0D0D0D] mb-6 leading-[0.85] uppercase break-words w-full ${fontSizeClass}`}
                >
                  {(() => {
                    const words = nameStr.toUpperCase().split(" ") || [];
                    if (words.length === 2)
                      return (
                        <>
                          <span className="block">{words[0]}</span>
                          <span className="block text-[#FF6B00]">
                            {words[1]}
                          </span>
                        </>
                      );
                    if (words.length >= 3)
                      return (
                        <>
                          <span className="block">
                            {words[0]} {words[1]}
                          </span>
                          <span className="block text-[#FF6B00]">
                            {words.slice(2).join(" ")}
                          </span>
                        </>
                      );
                    return <span>{nameStr}</span>;
                  })()}
                </h1>
              );
            })()}

            {/* Subtitle / Domain */}
            {home.domain && (
              <h2 className="text-xl md:text-2xl font-bold text-[#0D0D0D]/70 mb-4 tracking-tight">
                {home.domain}
              </h2>
            )}

            {/* Short Bio */}
            {home.shortBio && (
              <p className="text-base md:text-lg text-[#0D0D0D]/60 mb-8 md:mb-10 max-w-2xl leading-relaxed font-medium">
                {home.shortBio}
              </p>
            )}

            {/* Links / Buttons */}
            <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
              {home.links?.linkedin && (
                <a
                  href={home.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-[#E5E7EB] px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-bold text-[#0D0D0D] rounded-[14px] hover:border-[#0D0D0D] hover:bg-[#F4F4F5] transition-all duration-200"
                >
                  LinkedIn <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {home.links?.scholar && (
                <a
                  href={home.links.scholar}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-[#E5E7EB] px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-bold text-[#0D0D0D] rounded-[14px] hover:border-[#0D0D0D] hover:bg-[#F4F4F5] transition-all duration-200"
                >
                  Google Scholar <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {home.links?.patents && (
                <a
                  href={home.links.patents}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-[#E5E7EB] px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-bold text-[#0D0D0D] rounded-[14px] hover:border-[#0D0D0D] hover:bg-[#F4F4F5] transition-all duration-200"
                >
                  Google Patents <FileText className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Bottom Stats (Achievements) */}
            {home.achievements && (
              <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 text-sm md:text-base font-bold text-[#0D0D0D]/60 tracking-wide">
                {home.achievements
                  .split(",")
                  .map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 md:gap-4"
                    >
                      <span>{item.trim()}</span>
                      {index !== home.achievements.split(",").length - 1 && (
                        <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full opacity-80" />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </motion.div>

          {/* Right Side - Rectangular Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[440px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#E5E7EB] bg-[#F4F4F5] shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative group">
              <img
                src={getDriveImage(home.photo) || "/fallback.png"}
                alt={home.name}
                className="w-full h-full object-cover object-[center_top] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          EXECUTIVE SUMMARY CARDS  ─ bg: white (hero se seamless)
      ══════════════════════════════════ */}
      <div className="bg-white pb-12 sm:pb-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
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
                    className="p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    {title && (
                      <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#0D0D0D] mb-3">
                        {title}
                      </h3>
                    )}
                    {content && (
                      <p className="text-sm leading-[1.85] text-[#0D0D0D]/65 whitespace-pre-line">
                        {content}
                      </p>
                    )}
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          EXPERIENCE  ─ bg: grey
      ══════════════════════════════════ */}
      {experiences.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-20 px-4 md:px-6 bg-[#F4F4F5]">
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
                View All Experience <ArrowRight className="w-4 h-4" />
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
                    className="p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-white rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className={LABEL}>{exp.period}</div>
                    <h3
                      className={`${TITLE} group-hover:text-[#0A5CE6] transition-colors`}
                    >
                      {exp.role}
                    </h3>
                    <div className={`${SUB} mb-4 md:mb-5`}>{exp.company}</div>
                    {exp.roleDesc && (
                      <ul className="space-y-2">
                        {exp.roleDesc
                          .split("\n")
                          .map((line: string, i: number) => (
                            <li key={i} className="flex gap-3">
                              <span className={DOT} />
                              <span className={BTXT}>{line}</span>
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

      {/* ══════════════════════════════════
          PUBLICATIONS  ─ bg: white
      ══════════════════════════════════ */}
      {publications.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-20 px-4 md:px-6 bg-white">
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
                View All Publications <ArrowRight className="w-4 h-4" />
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
                  className="border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl p-5 sm:p-6 lg:p-7 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={LABEL}>{pub.year || pub.date}</div>
                  <h3 className={TITLE}>{pub.title}</h3>
                  <div className={SUB}>
                    {pub.organization || pub.event || pub.platform}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          EDUCATION  ─ bg: grey
      ══════════════════════════════════ */}
      {education.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-20 px-4 md:px-6 bg-[#F4F4F5]">
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
                View Full Education <ArrowRight className="w-4 h-4" />
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
                    className="p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-white rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={LABEL}>{edu.year}</div>
                    {/* Degree — intentional blue accent */}
                    <h3 className="text-lg md:text-xl font-bold mb-1 text-[#0A5CE6] leading-tight">
                      {edu.degree}
                    </h3>
                    <div className="text-base md:text-lg font-bold text-[#0D0D0D]/80 mb-1">
                      {edu.major}
                    </div>
                    <div className={`${SUB} italic mb-4 md:mb-5`}>
                      {edu.specialization}
                    </div>

                    {edu.degreeDesc && (
                      <ul className="space-y-2 mb-4 md:mb-5">
                        {edu.degreeDesc
                          .split("\n")
                          .map((line: string, i: number) => (
                            <li key={i} className="flex gap-3">
                              <span className={DOT} />
                              <span className={BTXT}>{line}</span>
                            </li>
                          ))}
                      </ul>
                    )}

                    <div className="pt-4 md:pt-5 border-t border-[#E5E7EB]">
                      <div className="text-xs md:text-sm font-bold text-[#0D0D0D]/65 uppercase tracking-widest">
                        {edu.institution}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          AWARDS  ─ bg: white
      ══════════════════════════════════ */}
      {awards.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-20 px-4 md:px-6 bg-white">
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
                View All Achievements <ArrowRight className="w-4 h-4" />
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
                    className="p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={LABEL}>{award.year}</div>
                    <h3 className={TITLE}>{award.title}</h3>
                    <div className={`${SUB} mb-3`}>{award.institution}</div>
                    {award.description && (
                      <ul className="space-y-2 mt-3">
                        {award.description
                          .split("\n")
                          .map((line: string, i: number) => (
                            <li key={i} className="flex gap-3">
                              <span className={DOT} />
                              <span className={BTXT}>{line}</span>
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
