import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2 } from "lucide-react";
import { useAppData } from "../Context/DataContext";

interface Role {
  title: string;
  type: string;
  tenure: string;
  duration: string;
  dept: string;
  details: string[];
}

interface Company {
  name: string;
  logo: string;
  website: string;
  tenure: string;
  duration: string;
  summary: React.ReactNode;
  roles: Role[];
}

// ── Dept helper ──
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

const RoleNode = ({ role, isLast }: { role: Role; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 md:pl-10 mb-6 last:mb-0">
      {/* Role Thread Line */}
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-[-24px] w-[1.5px] bg-[#E5E7EB]" />
      )}

      {/* Role Node Marker */}
      <div className="absolute left-[2px] top-[3px] w-[20px] h-[20px] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0A5CE6] bg-white z-10" />
      </div>

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer group"
      >
        {/* ── MOBILE layout (hidden on md+) ── */}
        <div className="flex flex-col gap-2 md:hidden">
          {/* Title */}
          <h4 className="text-[15px] font-semibold text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors leading-snug pr-2">
            {role.title}
          </h4>

          {/* Type badge + Duration on same row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-white bg-[#0A5CE6] px-2 py-[2px] rounded-md uppercase tracking-wide shrink-0">
              {role.type}
            </span>
            <span className="text-[11px] font-medium text-[#0D0D0D]/50">
              {role.duration}
            </span>
          </div>

          {/* Tenure period */}
          <span className="text-[10px] font-mono text-[#0D0D0D]/35 uppercase tracking-widest">
            {role.tenure}
          </span>

          {/* Department — separated with a subtle divider */}
          {role.dept && (
            <div className="mt-1 pt-2 border-t border-[#E5E7EB]/70">
              <DeptLabel dept={role.dept} />
            </div>
          )}
        </div>

        {/* ── DESKTOP layout (hidden on mobile) ── */}
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

        {/* ── Expanded details (shared, both layouts) ── */}
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
                  {role.details.map((detail, i) => (
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

const CompanySection = ({
  company,
  isLast,
}: {
  company: Company;
  isLast: boolean;
}) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Company Node Marker */}
      <div className="absolute left-[12px] top-8 w-6 h-6 flex items-center justify-center z-20 -translate-x-1/2">
        <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
          <Building2 className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Card */}
      <div className="ml-10 md:ml-12 bg-[#F4F4F5] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-[#D1D5DB]">
        {/* Company Header */}
        <div
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="group cursor-pointer mb-4 md:mb-6"
        >
          <div className="flex flex-row items-start justify-between gap-3 md:gap-6">
            {/* Left Side */}
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

            {/* Logo */}
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
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

        {/* Expandable Summary */}
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

        {/* Roles */}
        <div className="relative mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#E5E7EB]">
          {company.roles.map((role, idx) => (
            <div key={idx} className="mb-5 md:mb-8 last:mb-0">
              <RoleNode role={role} isLast={idx === company.roles.length - 1} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Experience() {
  const { data, loading } = useAppData();

  if (loading) return <div>Loading...</div>;

  const raw = data?.experiences || [];

  const getDriveImage = (link: string) => {
    if (!link) return null;
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const fileId = match[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  };

  const groupByCompany = (data: any[]) => {
    const map: any = {};
    data.forEach((item) => {
      if (!map[item.company]) {
        map[item.company] = {
          name: item.company,
          logo:
            Array.isArray(item.mediaLinks) && item.mediaLinks.length > 0
              ? getDriveImage(item.mediaLinks[0]) || "/fallback.png"
              : "/fallback.png",
          website: item.externalLinks?.[0] || "#",
          roles: [],
          periods: [],
          location: item.location,
          companyDesc: item.companyDesc,
          contribution: item.contribution,
        };
      }
      console.log("MEDIA LINKS RAW:", item.mediaLinks);
      console.log("ITEM:", item.company, item.mediaLinks);
      map[item.company].roles.push(item);
      map[item.company].periods.push(item.period);
    });
    return Object.values(map);
  };

  const calcDuration = (period: string) => {
    if (!period) return "";
    const parts = period.replace("–", "-").split("-");
    if (parts.length < 2) return "";
    const start = new Date(parts[0].trim());
    const end = parts[1].toLowerCase().includes("present")
      ? new Date()
      : new Date(parts[1].trim());
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return `${years ? years + " yrs " : ""}${rem} mos`;
  };

  const getStartDate = (period: string) => {
    if (!period) return 0;
    const clean = period.replace("–", "-");
    const start = clean.split("-")[0].trim();
    return new Date(start + " 1").getTime();
  };

  const stats = useMemo(() => {
    if (!raw.length) return null;
    const totalRoles = raw.length;
    const companiesSet = new Set(raw.map((r: any) => r.company));
    const totalCompanies = companiesSet.size;
    const leadershipRoles = raw.filter((r: any) =>
      /manager|director|lead|ceo|founder/i.test(r.role),
    ).length;

    const parseStart = (period: string) => {
      const clean = period.replace("–", "-");
      const start = clean.split("-")[0]?.trim();
      return new Date(start + " 1").getTime();
    };
    const parseEnd = (period: string) => {
      const clean = period.replace("–", "-");
      const end = clean.split("-")[1]?.trim();
      if (!end) return Date.now();
      if (end.toLowerCase().includes("present")) return Date.now();
      return new Date(end + " 1").getTime();
    };

    const startDates = raw
      .map((r: any) => parseStart(r.period))
      .filter(Boolean);
    const endDates = raw.map((r: any) => parseEnd(r.period));
    if (!startDates.length || !endDates.length) {
      return { totalRoles, totalCompanies, leadershipRoles, totalYears: 0 };
    }

    const minStart = Math.min(...startDates);
    const maxEnd = Math.max(...endDates);
    const totalMonths =
      (new Date(maxEnd).getFullYear() - new Date(minStart).getFullYear()) * 12 +
      (new Date(maxEnd).getMonth() - new Date(minStart).getMonth());
    const totalYears = Math.floor(totalMonths / 12);
    return { totalRoles, totalCompanies, leadershipRoles, totalYears };
  }, [raw]);

  const companies = groupByCompany(raw)
    .map((company: any) => {
      const rolesSorted = [...company.roles].sort(
        (a: any, b: any) => getStartDate(b.period) - getStartDate(a.period),
      );
      const latestRole = rolesSorted[0];
      const earliestRole = rolesSorted[rolesSorted.length - 1];
      const start = earliestRole.period.replace("–", "-").split("-")[0].trim();
      const endRaw = latestRole.period.replace("–", "-").split("-")[1]?.trim();
      const end = endRaw?.toLowerCase().includes("present")
        ? "Present"
        : endRaw;
      const tenure = `${start} – ${end}`;

      return {
        name: company.name,
        logo: company.logo,
        website: company.website,
        tenure: `${company.location} • ${tenure}`,
        duration: calcDuration(`${start} - ${end}`),
        summary: (
          <>
            <p>
              <strong>{company.name}</strong>{" "}
              {company.companyDesc?.replace(company.name, "").trim()}
            </p>
            <p className="mt-4">
              <strong>Prerit Pramod</strong>{" "}
              {company.contribution?.replace("Prerit Pramod", "").trim()}
            </p>
          </>
        ),
        roles: rolesSorted.map((r: any) => ({
          title: r.role,
          type: r.type,
          tenure: r.period,
          duration: calcDuration(r.period),
          dept:
            r.team && r.department
              ? `${r.team}, ${r.department}`
              : r.team || r.department || "",
          details: r.roleDesc
            ? r.roleDesc
                .split(/\r?\n/)
                .map((d: string) => d.trim())
                .filter(Boolean)
            : [],
        })),
        _latest: getStartDate(latestRole.period),
      };
    })
    .sort((a: any, b: any) => b._latest - a._latest);

  return (
    <div className="w-full bg-white min-h-screen pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-5xl mx-auto">
        <div className="pt-6 md:pt-12 pb-8 md:pb-12">
          {/* Header */}
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
              A visual map of engineering leadership, research, and product
              innovation across two levels of progression.
            </p>

            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-16 mt-6 md:mt-12">
                {[
                  {
                    label: "Total Experience",
                    value: stats.totalYears,
                    suffix: "+",
                    sub: "Years",
                  },
                  {
                    label: "Organizations",
                    value: stats.totalCompanies,
                    suffix: "+",
                    sub: "Companies",
                  },
                  {
                    label: "Roles",
                    value: stats.totalRoles,
                    suffix: "+",
                    sub: "Positions Held",
                  },
                  {
                    label: "Leadership",
                    value: stats.leadershipRoles,
                    suffix: "",
                    sub: "Leadership Roles",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-1.5 md:mb-2">
                      {s.label}
                    </p>
                    <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                      {s.value}
                      <span className="text-[#FF6B00]">{s.suffix}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-2 tracking-wide">
                      {s.sub}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Timeline */}
          <div className="relative flex flex-col gap-8 md:gap-12">
            <div className="absolute left-[11px] top-8 h-[calc(100%-250px)] w-[2px] bg-[#E5E7EB]" />
            {companies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <CompanySection
                  company={company}
                  isLast={index === companies.length - 1}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
