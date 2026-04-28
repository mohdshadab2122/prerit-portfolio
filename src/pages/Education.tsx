import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Building2 } from "lucide-react";
import { useAppData } from "../Context/DataContext";

/*
 * Education page
 *
 * The spreadsheet provides one flat education row per degree/institution. This
 * file adapts that data into an expandable timeline, then renders the timeline
 * with the same interaction pattern used by the Experience page.
 */

// Raw shape supplied by DataContext after Apps Script has formatted the sheet.
interface RawEducationRow {
  university?: string;
  college?: string;
  mediaLinks?: string[];
  externalLinks?: string[];
  location?: string;
  year?: string;
  degree?: string;
  specialization?: string;
  gpa?: string;
  universityDesc?: string;
  preritDesc?: string;
  degreeDesc?: string;
}

// One expandable degree node inside an institution card.
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

// Top-level institution card rendered in the timeline.
interface EducationItem {
  university: string;
  college?: string | null;
  logo: string;
  website: string;
  tenure: string;
  duration: string;
  summary: ReactNode;
  degrees: Degree[];
  location: string;
}

const FALLBACK_LOGO = "/fallback.png";
const COMPLETED_STATUS = "Completed";

// Google Drive share links are converted to direct image URLs for logos.
const getDriveImage = (link?: string) => {
  if (!link) return null;

  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;

  return `https://lh3.googleusercontent.com/d/${match[1]}`;
};

const getLogoUrl = (mediaLinks?: string[]) => {
  if (!Array.isArray(mediaLinks) || mediaLinks.length === 0) {
    return FALLBACK_LOGO;
  }

  return getDriveImage(mediaLinks[0]) || FALLBACK_LOGO;
};

// Converts date-like sheet values into the uppercase month/year label used by
// the timeline, for example "MAY 2024".
const formatMonthYear = (dateStr?: string) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  return date
    .toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
};

const formatGpa = (gpa?: string) => {
  if (!gpa) return "";

  const value = Number.parseFloat(gpa);
  if (Number.isNaN(value)) return gpa;

  return value <= 1 ? `${(value * 100).toFixed(2)}%` : gpa;
};

// Degree descriptions are authored as multiline text in the sheet.
const splitDetails = (details?: string) =>
  (details || "")
    .split("\n")
    .map((detail) => detail.trim())
    .filter(Boolean);

// Location is split for future display needs while preserving the full location
// string in the card header.
const splitLocation = (location?: string) => {
  const parts = (location || "").split(",");

  return {
    city: parts[0] || "",
    country: parts.slice(1).join(",") || "",
  };
};

// The API returns one flattened row per education entry. This adapter creates
// the timeline shape consumed by the visual components below.
const buildEducationItems = (rows: RawEducationRow[]): EducationItem[] =>
  rows.map((row) => {
    const location = splitLocation(row.location);
    const tenure = formatMonthYear(row.year);

    return {
      university: row.university || "",
      college: row.college && row.college !== "-" ? row.college : null,
      logo: getLogoUrl(row.mediaLinks),
      website: row.externalLinks?.[0] || "#",
      location: row.location || "",
      tenure,
      duration: COMPLETED_STATUS,
      summary: (
        <>
          <p>
            <strong>{row.university}</strong> {row.universityDesc}
          </p>
          <p className="mt-4">
            <strong>Prerit Pramod</strong> {row.preritDesc}
          </p>
        </>
      ),
      degrees: [
        {
          title: row.degree || "",
          tenure,
          duration: COMPLETED_STATUS,
          specialization: row.specialization || "",
          gpa: formatGpa(row.gpa),
          city: location.city,
          country: location.country,
          details: splitDetails(row.degreeDesc),
        },
      ],
    };
  });

const LoadingState = () => <div>Loading...</div>;

// Shared expanded content for a degree. It is separate from DegreeNode so the
// click/animation wrapper stays easy to scan.
const DegreeDetails = ({ details }: { details: string[] }) => (
  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 md:p-5 mt-3">
    <ul className="space-y-2 md:space-y-3">
      {details.map((detail, index) => (
        <li
          key={index}
          className="text-sm text-[#0D0D0D]/70 flex items-start gap-3 leading-relaxed"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#0A5CE6]/30 mt-2 flex-shrink-0" />
          {detail}
        </li>
      ))}
    </ul>
  </div>
);

// One degree inside an institution card. Clicking the degree reveals the
// details pulled from degreeDesc.
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
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-[-24px] w-[1.5px] bg-[#E5E7EB]" />
      )}

      <div className="absolute left-[2px] top-[2px] w-[20px] h-[20px] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0A5CE6] bg-white z-10" />
      </div>

      <div
        onClick={() => setIsExpanded((current) => !current)}
        className="cursor-pointer group"
      >
        <div className="flex flex-col gap-2 md:gap-3">
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

          <div className="mt-0.5 md:mt-1.5">
            <span className="text-sm font-medium text-[#0D0D0D]/60 leading-relaxed">
              {degree.specialization}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <DegreeDetails details={degree.details} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Top-level institution card. The institution header expands to show the
// university and Prerit summary, and degree nodes live below it.
const EducationCard = ({ item }: { item: EducationItem }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  return (
    <div className="relative">
      <div className="absolute left-[12px] top-8 w-6 h-6 flex items-center justify-center z-20 -translate-x-1/2">
        <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
          <Building2 className="w-3 h-3 text-white" />
        </div>
      </div>

      <div className="ml-10 md:ml-12 bg-[#F4F4F5] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-[#D1D5DB]">
        <div
          onClick={() => setIsSummaryExpanded((current) => !current)}
          className="group cursor-pointer mb-4 md:mb-6"
        >
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-row items-start justify-between gap-3 md:gap-6">
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

              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
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

        <div className="relative mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#E5E7EB]">
          <div className="pl-0">
            {item.degrees.map((degree, index) => (
              <div key={index} className="mb-6 md:mb-8 last:mb-0">
                <DegreeNode
                  degree={degree}
                  isLast={index === item.degrees.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Page title, subtitle, and the small "Academic Background" divider row.
const EducationHeader = () => (
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
      Academic milestones that shaped the engineering, systems, and research
      foundation behind the journey.
    </p>

    <div className="mt-6 md:mt-10 flex items-center gap-4">
      <div className="h-[1px] w-12 bg-[#0A5CE6]" />
      <span className="text-xs uppercase tracking-[0.2em] text-[#0D0D0D]/40 whitespace-nowrap">
        Academic Background
      </span>
      <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
    </div>
  </motion.div>
);

// Vertical wrapper for all education cards. Individual cards own their own
// expansion state.
const EducationTimeline = ({ items }: { items: EducationItem[] }) => (
  <div className="relative flex flex-col gap-8 md:gap-12">
    <div className="absolute left-[11px] top-8 h-[calc(100%-250px)] w-[2.2px] bg-[#E5E7EB]" />

    {items.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative"
      >
        <EducationCard item={item} />
      </motion.div>
    ))}
  </div>
);

// Entry point: read education data from context, adapt it, then render.
export default function Education() {
  const { data, loading } = useAppData();

  if (loading) return <LoadingState />;
  if (!data || !data.education) return null;

  const educationItems = buildEducationItems(
    data.education as RawEducationRow[],
  );

  return (
    <div className="w-full bg-white min-h-screen pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="pt-6 md:pt-12 pb-8 md:pb-12">
          <EducationHeader />
          <EducationTimeline items={educationItems} />
        </div>
      </div>
    </div>
  );
}