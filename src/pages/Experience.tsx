import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Building2, Briefcase, Minus, Plus } from "lucide-react";
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

const RoleNode = ({ role, isLast }: { role: Role; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-10 mb-5 last:mb-0">
      {/* Level 2: Role Thread Line */}
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-[-25px] w-[1.5px] bg-[#E5E7EB]" />
      )}

      {/* Role Node Marker */}
      <div className="absolute left-0 top-[2px] w-[20px] h-[20px] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0A5CE6] bg-white z-10" />
      </div>

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer group"
      >
        <div className="flex flex-col gap-3">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-6">
              <h4 className="text-lg font-medium text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors leading-tight">
                {role.title}
              </h4>

              <span className="text-sm font-medium text-[#0A5CE6] uppercase">
                {role.type}
              </span>

              <span className="text-sm text-[#0D0D0D]/45">{role.duration}</span>
            </div>

            <span className="text-[10px] font-mono text-[#0D0D0D]/40 uppercase tracking-widest md:text-right">
              {role.tenure}
            </span>
          </div>

          {/* Department */}
          <div className="mt-1.5">
            <span className="text-sm font-medium text-[#0D0D0D]/60 leading-relaxed">
              {role.dept.split(",")[0]}
              {role.dept.includes(",") && (
                <>
                  {","}{" "}
                  <span className="italic text-[#0D0D0D]/55">
                    {role.dept.split(",").slice(1).join(",").trim()}
                  </span>
                </>
              )}
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
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 mt-3">
                <ul className="space-y-3">
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
      {/* Level 1: Main Company Thread Line */}

      {/* Company Node Marker */}
      <div className="absolute left-0 top-8 w-6 h-6 flex items-center justify-center z-20">
        <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
          <Building2 className="w-3 h-3 text-white" />
        </div>
      </div>

      <div className="ml-12 bg-[#F4F4F5] border border-[#E5E7EB] rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-[#D1D5DB]">
        {/* Company Header */}
        <div
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="group cursor-pointer mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left Side */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#0D0D0D] tracking-tight group-hover:text-[#FF6B00] transition-colors duration-300">
                  {company.name}
                </h3>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-xs font-mono text-[#0D0D0D]/40 uppercase tracking-[0.2em]">
                    {company.tenure}
                  </span>

                  <span className="w-[3.2px] h-[3.2px] rounded-full bg-[#0D0D0D]/40 inline-block align-middle"></span>

                  <span className="text-xs font-mono text-[#0D0D0D]/45 uppercase tracking-[0.2em]">
                    {company.duration}
                  </span>
                </div>
              </div>

              {/* Right Side Clickable Logo */}
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-20 h-20 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center overflow-hidden shrink-0 hover:shadow-md transition-all"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-14 h-14 object-contain"
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
              <div className="mt-6 p-6 border-l-4 border-[#FF6B00] bg-white rounded-r-xl">
                <div className="text-[#0D0D0D]/75 text-sm leading-relaxed font-normal">
                  {company.summary}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level 2: Role Thread */}
        <div className="relative mt-6 pt-6 border-t border-[#E5E7EB]">
          <div className="pl-0">
            {company.roles.map((role, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <RoleNode
                  role={role}
                  isLast={idx === company.roles.length - 1}
                />
              </div>
            ))}
          </div>
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

    // 🔥 CHANGE HERE: 'drive.google.com' ki jagah 'googleusercontent.com' use kar rahe hain
    // Ye iframe aur ad-blockers me fail nahi hota
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

    const clean = period.replace("–", "-"); // dash fix
    const start = clean.split("-")[0].trim();

    return new Date(start + " 1").getTime();
  };

  const stats = useMemo(() => {
    if (!raw.length) return null;

    // total roles
    const totalRoles = raw.length;

    // unique companies
    const companiesSet = new Set(raw.map((r: any) => r.company));
    const totalCompanies = companiesSet.size;

    // leadership roles
    const leadershipRoles = raw.filter((r: any) =>
      /manager|director|lead|ceo|founder/i.test(r.role),
    ).length;

    // total experience years
    // ✅ NEW SAFE LOGIC

    const parseStart = (period: string) => {
      const clean = period.replace("–", "-");
      const start = clean.split("-")[0]?.trim();
      return new Date(start + " 1").getTime();
    };

    const parseEnd = (period: string) => {
      const clean = period.replace("–", "-");
      const end = clean.split("-")[1]?.trim();

      if (!end) return Date.now();

      if (end.toLowerCase().includes("present")) {
        return Date.now(); // ✅ multiple present handled
      }

      return new Date(end + " 1").getTime();
    };

    const startDates = raw
      .map((r: any) => parseStart(r.period))
      .filter(Boolean);
    const endDates = raw.map((r: any) => parseEnd(r.period));

    // safety
    if (!startDates.length || !endDates.length) {
      return {
        totalRoles,
        totalCompanies,
        leadershipRoles,
        totalYears: 0,
      };
    }

    const minStart = Math.min(...startDates);
    const maxEnd = Math.max(...endDates);

    const totalMonths =
      (new Date(maxEnd).getFullYear() - new Date(minStart).getFullYear()) * 12 +
      (new Date(maxEnd).getMonth() - new Date(minStart).getMonth());

    const totalYears = Math.floor(totalMonths / 12);

    return {
      totalRoles,
      totalCompanies,
      leadershipRoles,
      totalYears,
    };
  }, [raw]);

  const companies = groupByCompany(raw)
    .map((company: any) => {
      // ✅ roles latest first
      const rolesSorted = [...company.roles].sort(
        (a: any, b: any) => getStartDate(b.period) - getStartDate(a.period),
      );

      // ✅ latest role (top)
      const latestRole = rolesSorted[0];

      // ✅ earliest role (bottom)
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

        // ✅ location + tenure
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
                .split("\\")
                .map((d: string) => d.trim())
                .filter(Boolean)
            : [],
        })),

        // 🔥 IMPORTANT: store latest start date for sorting
        _latest: getStartDate(latestRole.period),
      };
    })
    // ✅ FINAL SORT (यह सबसे important है)
    .sort((a: any, b: any) => b._latest - a._latest);

  return (
    <div className="w-full bg-white min-h-screen py-32 px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#0D0D0D] mb-6 leading-none">
            EXPERIENCE
          </h1>
          <p className="text-xl md:text-2xl text-[#0D0D0D]/40 max-w-3xl leading-relaxed font-light">
            A visual map of engineering leadership, research, and product
            innovation across two levels of progression.
          </p>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 mt-12">
              <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                  Total Experience
                </p>
                <div className="text-3xl font-semibold tracking-tight">
                  {stats.totalYears}
                  <span className="text-[#FF6B00]">+</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 tracking-wide">
                  Years
                </p>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                  Organizations
                </p>
                <div className="text-3xl font-semibold tracking-tight">
                  {stats.totalCompanies}
                  <span className="text-[#FF6B00]">+</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 tracking-wide">
                  Companies
                </p>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                  Roles
                </p>
                <div className="text-3xl font-semibold tracking-tight">
                  {stats.totalRoles}
                  <span className="text-[#FF6B00]">+</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 tracking-wide">
                  Positions Held
                </p>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                  Leadership
                </p>
                <div className="text-3xl font-semibold tracking-tight">
                  {stats.leadershipRoles}
                </div>
                <p className="text-xs text-gray-500 mt-2 tracking-wide">
                  Leadership Roles
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Timeline Section */}
        {/* Timeline Section */}
        <div className="relative flex flex-col gap-12">
          <div className="absolute left-[11px] top-8 bottom-54 w-[2px] bg-[#E5E7EB]" />
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
  );
}
