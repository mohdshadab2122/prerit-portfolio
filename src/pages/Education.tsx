import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, GraduationCap, Minus, Plus } from "lucide-react";
import { useAppData } from "../Context/DataContext";

interface Degree {
  title: string;
  tenure: string;
  duration: string;
  specialization: string;
  gpa: string;
  city: string;
  country: string;
  details: string[];
}

interface EducationItem {
  university: string;
  college?: string;
  logo: string;
  website: string;
  tenure: string;
  duration: string;
  summary: React.ReactNode;
  degrees: Degree[];
  location: string;
}

const DegreeNode = ({
  degree,
  isLast,
}: {
  degree: Degree;
  isLast: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 md:pl-10 mb-6 last:mb-0">
      {/* Vertical connector line */}
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-[-24px] w-[1.5px] bg-[#E5E7EB]" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-[2px] top-[2px] w-[20px] h-[20px] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0A5CE6] bg-white z-10" />
      </div>

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer group"
      >
        <div className="flex flex-col gap-2 md:gap-3">
          {/* Degree title + meta row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
            <div className="flex flex-wrap items-start md:items-center gap-2 md:gap-6">
              <h4 className="text-base md:text-lg font-medium text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors leading-tight">
                {degree.title}
              </h4>

              <span className="text-xs md:text-sm font-medium text-[#0A5CE6] uppercase">
                {degree.duration}
              </span>

              {degree.gpa && (
                <span className="text-xs md:text-sm text-[#0D0D0D]/45">
                  {degree.gpa}
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono text-[#0D0D0D]/40 uppercase tracking-widest md:text-right shrink-0">
              {degree.tenure}
            </span>
          </div>

          {/* Specialization */}
          <div className="mt-0.5 md:mt-1.5">
            <span className="text-sm font-medium text-[#0D0D0D]/60 leading-relaxed">
              {degree.specialization}
            </span>
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 md:p-5 mt-3">
                <ul className="space-y-2 md:space-y-3">
                  {degree.details.map((detail, i) => (
                    <li
                      key={i}
                      className="text-sm text-[#0D0D0D]/70 flex items-start gap-3 leading-relaxed"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0A5CE6]/30 mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const EducationSection = ({
  item,
  isLast,
}: {
  item: EducationItem;
  isLast: boolean;
}) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Orange timeline dot */}
      <div className="absolute left-[12px] top-8 w-6 h-6 flex items-center justify-center z-20 -translate-x-1/2">
        <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
          <Building2 className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Card */}
      <div className="ml-10 md:ml-12 bg-[#F4F4F5] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-[#D1D5DB]">
        {/* University header — clickable to expand summary */}
        <div
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="group cursor-pointer mb-4 md:mb-6"
        >
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-row items-start justify-between gap-3 md:gap-6">
              {/* Left: name + meta */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0D0D0D] tracking-tight group-hover:text-[#FF6B00] transition-colors duration-300 leading-tight">
                  {item.university}
                </h3>

                {item.college && item.college !== "N/A" && (
                  <p className="text-xs sm:text-sm text-[#0D0D0D]/55 mt-1.5 md:mt-2">
                    {item.college}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1.5 md:mt-2">
                  <span className="text-[10px] md:text-xs font-mono text-[#0D0D0D]/40 uppercase tracking-[0.2em]">
                    {item.location}
                  </span>
                  <span className="text-[10px] md:text-xs font-mono text-[#0D0D0D]/40 uppercase tracking-[0.2em]">
                    {item.tenure}
                  </span>
                </div>
              </div>

              {/* Right: logo */}
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center overflow-hidden shrink-0 hover:shadow-md transition-all"
              >
                <img
                  src={item.logo}
                  alt={item.university}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Expandable summary */}
        <AnimatePresence>
          {isSummaryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 md:mt-6 p-4 md:p-6 border-l-4 border-[#FF6B00] bg-white rounded-r-xl">
                <div className="text-[#0D0D0D]/75 text-sm leading-relaxed font-normal">
                  {item.summary}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Degrees */}
        <div className="relative mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#E5E7EB]">
          <div className="pl-0">
            {item.degrees.map((degree, idx) => (
              <div key={idx} className="mb-6 md:mb-8 last:mb-0">
                <DegreeNode
                  degree={degree}
                  isLast={idx === item.degrees.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Education() {
  const { data, loading } = useAppData();

  const getDriveImage = (link: string) => {
    if (!link) return null;
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const fileId = match[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  };

  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date
      .toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  };

  if (loading) return <div>Loading...</div>;
  if (!data || !data.education) return null;

  const educationData = data.education.map((item: any) => ({
    university: item.university,
    college: item.college && item.college !== "-" ? item.college : null,
    logo:
      Array.isArray(item.mediaLinks) && item.mediaLinks.length > 0
        ? getDriveImage(item.mediaLinks[0]) || "/fallback.png"
        : "/fallback.png",
    website: item.externalLinks?.[0] || "#",
    location: item.location,
    tenure: formatMonthYear(item.year),
    duration: "Completed",
    summary: (
      <>
        <p>
          <strong>{item.university}</strong> {item.universityDesc}
        </p>
        <p className="mt-4">
          <strong>Prerit Pramod</strong> {item.preritDesc}
        </p>
      </>
    ),
    degrees: [
      {
        title: item.degree,
        tenure: formatMonthYear(item.year),
        duration: "Completed",
        specialization: item.specialization,
        gpa: (() => {
          if (!item.gpa) return "";
          const value = parseFloat(item.gpa);
          if (isNaN(value)) return item.gpa;
          if (value <= 1) return (value * 100).toFixed(2) + "%";
          return item.gpa;
        })(),
        city: item.location?.split(",")[0] || "",
        country: item.location?.split(",").slice(1).join(",") || "",
        details: item.degreeDesc
          ? item.degreeDesc.split("\n").filter((d: string) => d.trim() !== "")
          : [],
      },
    ],
  }));

  return (
    <div className="w-full bg-white min-h-screen pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-5xl mx-auto">
        <div className="pt-6 md:pt-12 pb-8 md:pb-12">
          {/* ─── Page Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-16 lg:mb-20"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-[#0D0D0D] mb-4 md:mb-6 leading-none">
              EDUCATION
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#0D0D0D]/40 max-w-3xl leading-relaxed font-light">
              Academic milestones that shaped the engineering, systems, and
              research foundation behind the journey.
            </p>

            <div className="mt-6 md:mt-10 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-[#0A5CE6]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#0D0D0D]/40 whitespace-nowrap">
                Academic Background
              </span>
              <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
            </div>
          </motion.div>

          {/* ─── Timeline List ─── */}
          <div className="relative flex flex-col gap-8 md:gap-12">
            {/* Vertical timeline line */}
            <div className="absolute left-[11px] top-8 h-[calc(100%-250px)] w-[2.2px] bg-[#E5E7EB]" />

            {educationData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <EducationSection
                  item={item}
                  isLast={index === educationData.length - 1}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
