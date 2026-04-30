import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Building2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppData } from "../context/DataContext";
import { getPageIntro } from "../config/pageContent";

/*
 * Experience page
 *
 * Data enters this file as flat rows from DataContext. The first half of the
 * file turns those rows into a company timeline model. The second half renders
 * that model as the expandable timeline UI.
 */

// Raw shape supplied by DataContext after Apps Script data has been formatted.
interface RawExperienceRow {
  company?: string;
  role?: string;
  type?: string;
  team?: string;
  department?: string;
  period?: string;
  location?: string;
  companyDesc?: string;
  contribution?: string;
  roleDesc?: string;
  mediaLinks?: string[];
  externalLinks?: string[];
}

// UI-facing role model used by each timeline node.
interface Role {
  title: string;
  type: string;
  tenure: string;
  duration: string;
  dept: string;
  details: string[];
}

// UI-facing company model used by each top-level timeline card.
interface Company {
  name: string;
  logo: string;
  website: string;
  tenure: string;
  duration: string;
  summary: ReactNode;
  roles: Role[];
}

// Temporary grouping model used while converting flat rows into companies.
interface CompanyGroup {
  name: string;
  logo: string;
  website: string;
  roles: RawExperienceRow[];
  location: string;
  companyDesc: string;
  contribution: string;
}

interface CompanyTimelineItem extends Company {
  latestTimestamp: number;
}

interface ExperienceStats {
  totalYears: number;
  totalCompanies: number;
  totalRoles: number;
  leadershipRoles: number;
}

const FALLBACK_LOGO = "/fallback.svg";
const PRESENT_LABEL = "Present";
const LEADERSHIP_ROLE_PATTERN = /manager|director|lead|ceo|founder/i;
const DEFAULT_OWNER_NAME = "Portfolio Owner";

// Anchor IDs must match Home.tsx links so preview cards can deep-link directly
// to the company timeline card.
const slugifyAnchor = (value?: string) => {
  const slug = (value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "item";
};

const buildAnchorId = (prefix: string, value?: string) =>
  `${prefix}-${slugifyAnchor(value)}`;

const scrollToHash = (hash: string) => {
  const targetId = decodeURIComponent(hash.replace("#", ""));
  if (!targetId) return;

  window.requestAnimationFrame(() => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
};

// Drives the four stat cards without duplicating card markup.
const STAT_CARDS: Array<{
  label: string;
  key: keyof ExperienceStats;
  suffix: string;
  sub: string;
}> = [
  {
    label: "Total Experience",
    key: "totalYears",
    suffix: "+",
    sub: "Years",
  },
  {
    label: "Organizations",
    key: "totalCompanies",
    suffix: "+",
    sub: "Companies",
  },
  {
    label: "Roles",
    key: "totalRoles",
    suffix: "+",
    sub: "Positions Held",
  },
  {
    label: "Leadership",
    key: "leadershipRoles",
    suffix: "",
    sub: "Leadership Roles",
  },
];

// Google Drive share links are converted to direct image URLs for company logos.
const getDriveImage = (link?: string) => {
  if (!link) return null;

  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;

  return `https://lh3.googleusercontent.com/d/${match[1]}`;
};

const getCompanyLogo = (mediaLinks?: string[]) => {
  if (!Array.isArray(mediaLinks) || mediaLinks.length === 0) {
    return FALLBACK_LOGO;
  }

  return getDriveImage(mediaLinks[0]) || FALLBACK_LOGO;
};

// Period values can contain an en dash from the spreadsheet. Normalize it once
// so every date helper can safely split on a normal hyphen.
const normalizePeriod = (period?: string) =>
  (period || "").replace(/\u2013/g, "-");

const splitPeriod = (period?: string) => {
  const [start = "", end = ""] = normalizePeriod(period).split("-");
  return {
    start: start.trim(),
    end: end.trim(),
  };
};

const parseTimelineDate = (value?: string) => {
  if (!value) return 0;
  return new Date(`${value.trim()} 1`).getTime();
};

const parsePeriodEndDate = (period?: string) => {
  const { end } = splitPeriod(period);
  if (!end) return Date.now();
  if (end.toLowerCase().includes("present")) return Date.now();
  return parseTimelineDate(end);
};

const getStartDate = (period?: string) => {
  const { start } = splitPeriod(period);
  return parseTimelineDate(start);
};

// Returns compact duration text such as "2 yrs 4 mos" for role and company
// tenures. Invalid or incomplete periods intentionally render as empty text.
const calculateDuration = (period?: string) => {
  const { start, end } = splitPeriod(period);
  if (!start || !end) return "";

  const startDate = new Date(start);
  const endDate = end.toLowerCase().includes("present")
    ? new Date()
    : new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "";
  }

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years ? `${years} yrs ` : ""}${months} mos`;
};

const splitRoleDetails = (details?: string) =>
  (details || "")
    .split(/\r?\n/)
    .map((detail) => detail.trim())
    .filter(Boolean);

const getDepartmentLabel = (row: RawExperienceRow) => {
  if (row.team && row.department) return `${row.team}, ${row.department}`;
  return row.team || row.department || "";
};

const removeLeadingName = (value: string | undefined, leadingText: string) =>
  (value || "").replace(leadingText, "").trim();

// Group flattened API rows into the company -> roles shape used by the timeline.
const groupByCompany = (rows: RawExperienceRow[]): CompanyGroup[] => {
  const companyMap = new Map<string, CompanyGroup>();

  rows.forEach((row) => {
    const companyName = row.company || "";

    if (!companyMap.has(companyName)) {
      companyMap.set(companyName, {
        name: companyName,
        logo: getCompanyLogo(row.mediaLinks),
        website: row.externalLinks?.[0] || "#",
        roles: [],
        location: row.location || "",
        companyDesc: row.companyDesc || "",
        contribution: row.contribution || "",
      });
    }

    companyMap.get(companyName)?.roles.push(row);
  });

  return Array.from(companyMap.values());
};

const buildCompanySummary = (company: CompanyGroup, ownerName: string) => (
  <>
    <p>
      <strong>{company.name}</strong>{" "}
      {removeLeadingName(company.companyDesc, company.name)}
    </p>
    <p className="mt-4">
      <strong>{ownerName}</strong>{" "}
      {removeLeadingName(company.contribution, ownerName)}
    </p>
  </>
);

// Builds the final timeline view model:
// - groups roles by company
// - sorts roles newest first inside each company
// - computes company tenure from earliest to latest role
// - sorts companies by their latest role date
const buildCompanyTimeline = (
  rows: RawExperienceRow[],
  ownerName: string,
): CompanyTimelineItem[] =>
  groupByCompany(rows)
    .map((company) => {
      const rolesSorted = [...company.roles].sort(
        (a, b) => getStartDate(b.period) - getStartDate(a.period),
      );
      const latestRole = rolesSorted[0];
      const earliestRole = rolesSorted[rolesSorted.length - 1];
      const { start } = splitPeriod(earliestRole?.period);
      const latestPeriod = splitPeriod(latestRole?.period);
      const end = latestPeriod.end.toLowerCase().includes("present")
        ? PRESENT_LABEL
        : latestPeriod.end;
      const tenure = `${start} \u2013 ${end}`;

      return {
        name: company.name,
        logo: company.logo,
        website: company.website,
        tenure: `${company.location} \u2022 ${tenure}`,
        duration: calculateDuration(`${start} - ${end}`),
        summary: buildCompanySummary(company, ownerName),
        roles: rolesSorted.map((role) => ({
          title: role.role || "",
          type: role.type || "",
          tenure: role.period || "",
          duration: calculateDuration(role.period),
          dept: getDepartmentLabel(role),
          details: splitRoleDetails(role.roleDesc),
        })),
        latestTimestamp: getStartDate(latestRole?.period),
      };
    })
    .sort((a, b) => b.latestTimestamp - a.latestTimestamp);

// Summary metrics shown in the header. The total experience range is calculated
// from the earliest role start to the latest role end.
const calculateExperienceStats = (rows: RawExperienceRow[]) => {
  if (!rows.length) return null;

  const totalRoles = rows.length;
  const totalCompanies = new Set(rows.map((row) => row.company)).size;
  const leadershipRoles = rows.filter((row) =>
    LEADERSHIP_ROLE_PATTERN.test(row.role || ""),
  ).length;

  const startDates = rows
    .map((row) => getStartDate(row.period))
    .filter(Boolean);
  const endDates = rows
    .map((row) => parsePeriodEndDate(row.period))
    .filter(Boolean);

  if (!startDates.length || !endDates.length) {
    return { totalRoles, totalCompanies, leadershipRoles, totalYears: 0 };
  }

  const minStart = Math.min(...startDates);
  const maxEnd = Math.max(...endDates);
  const totalMonths =
    (new Date(maxEnd).getFullYear() - new Date(minStart).getFullYear()) * 12 +
    (new Date(maxEnd).getMonth() - new Date(minStart).getMonth());

  return {
    totalRoles,
    totalCompanies,
    leadershipRoles,
    totalYears: Math.floor(totalMonths / 12),
  };
};

const LoadingState = () => <div>Loading...</div>;

// Departments can be stored as "team, department". The first part remains
// normal text and the rest is styled as a secondary detail.
const DeptLabel = ({ dept }: { dept: string }) => {
  if (!dept) return null;

  const parts = dept.split(",");

  return (
    <span className="text-[12px] md:text-sm font-medium text-[#0D0D0D]/55 leading-relaxed">
      {parts[0]}
      {parts.length > 1 && (
        <>
          {", "}
          <span className="italic text-[#0D0D0D]/45">
            {parts.slice(1).join(",").trim()}
          </span>
        </>
      )}
    </span>
  );
};

// Expanded bullet list for a role. Kept separate because mobile and desktop
// role headers share the same expandable content.
const RoleDetails = ({ details }: { details: string[] }) => (
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

// Mobile keeps role metadata stacked so long titles and departments do not
// collide on narrow screens.
const RoleMobileHeader = ({ role }: { role: Role }) => (
  <div className="flex flex-col gap-2 md:hidden">
    <h4 className="text-[15px] font-semibold text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors leading-snug pr-2">
      {role.title}
    </h4>

    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold text-white bg-[#0A5CE6] px-2 py-[2px] rounded-md uppercase tracking-wide shrink-0">
        {role.type}
      </span>
      <span className="text-[11px] font-medium text-[#0D0D0D]/50">
        {role.duration}
      </span>
    </div>

    <span className="text-[10px] font-mono text-[#0D0D0D]/35 uppercase tracking-widest">
      {role.tenure}
    </span>

    {role.dept && (
      <div className="mt-1 pt-2 border-t border-[#E5E7EB]/70">
        <DeptLabel dept={role.dept} />
      </div>
    )}
  </div>
);

// Desktop keeps the same data in a denser horizontal row.
const RoleDesktopHeader = ({ role }: { role: Role }) => (
  <div className="hidden md:flex md:flex-col gap-3">
    <div className="flex md:flex-row md:items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-6">
        <h4 className="text-lg font-medium text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors leading-tight">
          {role.title}
        </h4>
        <span className="text-sm font-medium text-[#0A5CE6] uppercase">
          {role.type}
        </span>
        <span className="text-sm text-[#0D0D0D]/45">{role.duration}</span>
      </div>
      <span className="text-[10px] font-mono text-[#0D0D0D]/40 uppercase tracking-widest text-right shrink-0">
        {role.tenure}
      </span>
    </div>
    <div className="mt-1.5">
      <DeptLabel dept={role.dept} />
    </div>
  </div>
);

// One role node in the company timeline. Clicking the node reveals the role
// details without navigating away from the page.
const RoleNode = ({ role, isLast }: { role: Role; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 md:pl-10 mb-6 last:mb-0">
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-[-24px] w-[1.5px] bg-[#E5E7EB]" />
      )}

      <div className="absolute left-[2px] top-[3px] w-[20px] h-[20px] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0A5CE6] bg-white z-10" />
      </div>

      <div
        onClick={() => setIsExpanded((current) => !current)}
        className="cursor-pointer group"
      >
        <RoleMobileHeader role={role} />
        <RoleDesktopHeader role={role} />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <RoleDetails details={role.details} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Top-level company card. The header expands to show company and personal
// contribution summary, while roles are always visible below it.
const CompanySection = ({ company }: { company: Company }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  return (
    <div
      id={buildAnchorId("experience", company.name)}
      className="relative scroll-mt-28"
    >
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
          <div className="flex flex-row items-start justify-between gap-3 md:gap-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0D0D0D] tracking-tight group-hover:text-[#FF6B00] transition-colors duration-300 leading-tight">
                {company.name}
              </h3>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1.5 md:mt-2">
                <span className="text-[10px] md:text-xs font-mono text-[#0D0D0D]/40 uppercase tracking-[0.2em]">
                  {company.tenure}
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-[#0D0D0D]/30 hidden sm:inline-block" />
                <span className="text-[10px] md:text-xs font-mono text-[#0D0D0D]/45 uppercase tracking-[0.2em]">
                  {company.duration}
                </span>
              </div>
            </div>

            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center overflow-hidden shrink-0 hover:shadow-md transition-all"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
              />
            </a>
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
                  {company.summary}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#E5E7EB]">
          {company.roles.map((role, index) => (
            <div key={index} className="mb-5 md:mb-8 last:mb-0">
              <RoleNode
                role={role}
                isLast={index === company.roles.length - 1}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Small reusable stat tile for the header metrics.
const StatCard = ({
  label,
  value,
  suffix,
  sub,
}: {
  label: string;
  value: number;
  suffix: string;
  sub: string;
}) => (
  <div className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-1.5 md:mb-2">
      {label}
    </p>
    <div className="text-2xl md:text-3xl font-semibold tracking-tight">
      {value}
      <span className="text-[#FF6B00]">{suffix}</span>
    </div>
    <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-2 tracking-wide">
      {sub}
    </p>
  </div>
);

// Only render stats after there is data; this keeps the empty/loading path clean.
const ExperienceStatsGrid = ({ stats }: { stats: ExperienceStats | null }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-16 mt-6 md:mt-12">
      {STAT_CARDS.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={stats[card.key]}
          suffix={card.suffix}
          sub={card.sub}
        />
      ))}
    </div>
  );
};

// Page headline and stat summary.
const ExperienceHeader = ({
  intro,
  stats,
}: {
  intro: string;
  stats: ExperienceStats | null;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="mb-10 md:mb-16 lg:mb-20"
  >
    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-[#0D0D0D] mb-4 md:mb-6 leading-none">
      EXPERIENCE
    </h1>
    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#0D0D0D]/40 max-w-3xl leading-relaxed font-light">
      {intro}
    </p>

    <ExperienceStatsGrid stats={stats} />
  </motion.div>
);

// Vertical timeline wrapper. Individual cards handle their own expansion state.
const ExperienceTimeline = ({
  companies,
}: {
  companies: CompanyTimelineItem[];
}) => (
  <div className="relative flex flex-col gap-8 md:gap-12">
    <div className="absolute left-[11px] top-8 h-[calc(100%-250px)] w-[2px] bg-[#E5E7EB]" />
    {companies.map((company, index) => (
      <motion.div
        key={`${company.name}-${index}`}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative"
      >
        <CompanySection company={company} />
      </motion.div>
    ))}
  </div>
);

// Entry point: read portfolio data, adapt it into view models, then render.
export default function Experience() {
  const { data, loading } = useAppData();
  const location = useLocation();
  const ownerName = data?.home?.[0]?.name || DEFAULT_OWNER_NAME;
  const intro = getPageIntro(data?.pageContent, "experience");

  const rawExperiences = (data?.experiences || []) as RawExperienceRow[];

  const stats = useMemo(
    () => calculateExperienceStats(rawExperiences),
    [rawExperiences],
  );
  const companies = useMemo(
    () => buildCompanyTimeline(rawExperiences, ownerName),
    [ownerName, rawExperiences],
  );

  useEffect(() => {
    if (!loading && companies.length) {
      scrollToHash(location.hash);
    }
  }, [companies, loading, location.hash]);

  if (loading) return <LoadingState />;

  return (
    <div className="w-full bg-white min-h-screen pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="pt-3 md:pt-8 pb-8 md:pb-12">
          <ExperienceHeader intro={intro} stats={stats} />
          <ExperienceTimeline companies={companies} />
        </div>
      </div>
    </div>
  );
}
