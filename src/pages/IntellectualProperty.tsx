import { useMemo, useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppData } from "../Context/DataContext";

const countries = ["ALL", "US", "DE", "CN", "EP"];

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === "-") return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── Mobile-only expandable patent card ────────────────────────────────────
const MobilePatentCard = ({
  family,
  index,
  page,
  itemsPerPage,
  country,
  getMember,
}: {
  family: any;
  index: number;
  page: number;
  itemsPerPage: number;
  country: string;
  getMember: (family: any, j: string) => any;
}) => {
  const [expanded, setExpanded] = useState(false);

  const us = getMember(family, "US");
  const de = getMember(family, "DE");
  const cn = getMember(family, "CN");
  const ep = getMember(family, "EP");

  const displayTitle =
    country === "ALL"
      ? us?.title || de?.title || cn?.title || ep?.title || family.familyTitle
      : getMember(family, country)?.title || family.familyTitle;

  // Only show jurisdictions that exist
  const jurisdictionRows: [string, any][] = (
    [["US", us], ["DE", de], ["CN", cn], ["EP / WO", ep]] as [string, any][]
  ).filter(([, m]) => m != null);

  const grantedCount = jurisdictionRows.filter(
    ([, m]) => m?.status?.toLowerCase() === "grant"
  ).length;

  return (
    <div
      className={`border border-[#E5E7EB] rounded-2xl overflow-hidden transition-shadow duration-200 ${
        index % 2 === 0 ? "bg-white" : "bg-[#F9F9F9]"
      } ${expanded ? "shadow-md border-[#D1D5DB]" : ""}`}
    >
      {/* ── Collapsed Header ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 flex items-start gap-3 group"
      >
        {/* Serial number */}
        <span className="text-[11px] text-gray-400 font-mono mt-[3px] shrink-0 w-5 text-right">
          {(page - 1) * itemsPerPage + index + 1}.
        </span>

        {/* Title + quick info pills */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#0D0D0D] leading-snug">
            {displayTitle}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Jurisdiction pills */}
            {jurisdictionRows.map(([label]) => (
              <span
                key={label}
                className="text-[10px] px-2 py-[2px] bg-[#F4F4F5] text-[#0D0D0D]/55 rounded-md font-mono"
              >
                {label}
              </span>
            ))}

            {grantedCount > 0 && (
              <>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] px-2 py-[2px] bg-[#FFF4EB] text-[#FF6B00] rounded-md font-medium">
                  {grantedCount} Granted
                </span>
              </>
            )}
          </div>
        </div>

        {/* Chevron */}
        <span className="shrink-0 mt-[3px] text-gray-400 group-hover:text-[#0A5CE6] transition-colors">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* ── Expanded Body ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[#E5E7EB]">

              {/* Family Members label */}
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mt-3 mb-2">
                Family Members
              </p>

              {/* One card per jurisdiction */}
              <div className="space-y-2">
                {jurisdictionRows.map(([label, m]) => (
                  <div
                    key={label}
                    className="bg-white border border-[#E5E7EB] rounded-xl p-3"
                  >
                    {/* Top row: label + status badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0D0D0D]/45">
                        {label}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-[2px] rounded-md font-medium ${
                          m.status?.toLowerCase() === "grant"
                            ? "bg-[#FFF4EB] text-[#FF6B00]"
                            : "bg-[#EEF2FF] text-[#2563EB]"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    {/* Patent number */}
                    <p className="text-[13px] font-mono text-[#0D0D0D] font-semibold mb-1.5">
                      {m.number}
                    </p>

                    {/* Date + PDF */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {m.date && (
                        <span className="text-[11px] text-gray-400">
                          {formatDate(m.date)}
                        </span>
                      )}
                      {m.link && (
                        <a
                          href={m.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] px-2.5 py-[3px] border border-[#E5E7EB] rounded-lg bg-[#F9F9F9] hover:bg-gray-100 text-[#0A5CE6] font-medium transition-colors"
                        >
                          View PDF ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inventors */}
              <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                  Inventors
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {family.inventors.map((inv: string, idx: number) => (
                    <span key={idx}>
                      {inv.toLowerCase() === "prerit pramod" ? (
                        <span className="font-semibold text-[#0D0D0D]">Prerit Pramod</span>
                      ) : (
                        inv
                      )}
                      {idx !== family.inventors.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function IntellectualProperty() {
  const [activeTab, setActiveTab] = useState("Patents");
  const { data } = useAppData();
  const patentFamilies = data?.patents || [];
  const defensivePublications = data?.defensivePublications || [];
  const tradeSecrets = data?.tradeSecrets || [];
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("ALL");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  console.log("RAW TRADE SECRETS 👉", tradeSecrets);

  const stats = useMemo(() => {
    let totalFamilies = patentFamilies.length;
    let totalFilings = 0;
    let grantedCount = 0;
    let jurisdictions = new Set();

    patentFamilies.forEach((family) => {
      (family.members || []).forEach((m: any) => {
        totalFilings++;
        if (m.status?.toLowerCase() === "grant") grantedCount++;
        jurisdictions.add(m.jurisdiction);
      });
    });

    return { totalFamilies, totalFilings, grantedCount, jurisdictions: jurisdictions.size };
  }, [patentFamilies]);

  const filtered = useMemo(() => {
    if (activeTab === "Patents") {
      return patentFamilies.filter((family) => {
        const matchSearch =
          (family.familyTitle || "").toLowerCase().includes(search.toLowerCase()) ||
          (family.inventors || []).join(" ").toLowerCase().includes(search.toLowerCase());
        const matchCountry =
          country === "ALL" ||
          (family.members || []).some(
            (m: any) =>
              m.jurisdiction === country ||
              (country === "EP" && m.jurisdiction === "WO"),
          );
        return matchSearch && matchCountry;
      });
    }
    if (activeTab === "Defensive Publications") {
      return defensivePublications.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (activeTab === "Formal Trade Secrets") {
      return tradeSecrets.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return [];
  }, [search, country, activeTab, patentFamilies, defensivePublications, tradeSecrets]);

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  console.log("STEP 7: PAGINATED 👉", paginated);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, country, activeTab]);

  const getMember = (family: any, j: string) => {
    if (j === "EP") {
      return (
        family.members.find((m: any) => m.jurisdiction === "EP") ||
        family.members.find((m: any) => m.jurisdiction === "WO")
      );
    }
    return family.members.find((m: any) => m.jurisdiction === j);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-12 md:pb-16">

        {/* ─── HEADER ─── */}
        <div className="pt-6 md:pt-12 pb-8 md:pb-12">
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-none mb-5 md:mb-8">
            INTELLECTUAL <span className="text-[#FF6B00]">PROPERTY</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#0D0D0D]/40 max-w-4xl leading-relaxed font-light mb-8 md:mb-12">
            A structured portfolio of patent families, defensive publications,
            and formal trade secrets spanning motion control, power electronics,
            electric drive systems, steer-by-wire, and advanced embedded
            engineering.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-16">
            <div className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-2">Across Jurisdictions</p>
              <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                {stats.totalFamilies}<span className="text-[#FF6B00]">+</span>
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 tracking-wide">Patent Families</p>
            </div>

            <div className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-2">US · DE · CN · EP</p>
              <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                {stats.totalFilings}<span className="text-[#FF6B00]">+</span>
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 tracking-wide">Total Filings</p>
            </div>

            <div className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-2">Confirmed by Office</p>
              <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                {stats.grantedCount}<span className="text-[#FF6B00]">+</span>
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 tracking-wide">Granted Patents</p>
            </div>

            <div className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-2">Global Coverage</p>
              <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                {stats.jurisdictions}
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 tracking-wide">Jurisdictions</p>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {["Patents", "Defensive Publications", "Formal Trade Secrets"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch(""); setPage(1); }}
                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-12">
          {activeTab === "Patents" && (
            <div className="flex gap-2 flex-wrap">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCountry(c); setPage(1); }}
                  className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm border rounded-md transition-all duration-200 ${
                    country === c
                      ? "border-[#FF6B00] text-[#FF6B00] bg-[#FFF4EB]"
                      : "border-[#E5E7EB] text-gray-500 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-[#FFF4EB]"
                  }`}
                >
                  {c === "EP" ? "EP & WO" : c}
                </button>
              ))}
            </div>
          )}

          <div className={`relative ${activeTab !== "Patents" ? "w-full sm:w-[320px]" : "w-full sm:w-[280px] md:w-[320px]"}`}>
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              className="w-full border border-[#E5E7EB] rounded-full pl-10 pr-4 py-2 bg-white text-sm focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
              placeholder={
                activeTab === "Patents"
                  ? "Search patents..."
                  : activeTab === "Defensive Publications"
                  ? "Search publications..."
                  : "Search trade secrets..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════
            PATENTS
        ══════════════════════════════════════ */}
        {activeTab === "Patents" && (
          <>
            {/* Mobile: expandable accordion cards */}
            <div className="lg:hidden space-y-2 mt-4">
              {paginated.map((family: any, i) => (
                <MobilePatentCard
                  key={i}
                  family={family}
                  index={i}
                  page={page}
                  itemsPerPage={itemsPerPage}
                  country={country}
                  getMember={getMember}
                />
              ))}
            </div>

            {/* Desktop: full table — unchanged */}
            <div className="hidden lg:block mt-4 border border-[#E5E7EB] rounded-xl overflow-hidden">
              <div className="grid grid-cols-[40px_2fr_1.6fr_1.6fr_1.6fr_1.6fr_2fr] gap-x-6 px-6 py-4 text-xs text-gray-500 border-b border-[#E5E7EB]">
                <div>#</div>
                <div>Title</div>
                <div>USA</div>
                <div>Germany</div>
                <div>China</div>
                <div>Europe & World</div>
                <div>Inventors</div>
              </div>

              {paginated.map((family: any, i) => {
                const us = getMember(family, "US");
                const de = getMember(family, "DE");
                const cn = getMember(family, "CN");
                const ep = getMember(family, "EP");

                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[40px_2fr_1.6fr_1.6fr_1.6fr_1.6fr_2fr] gap-x-6 px-6 py-5 border-b border-[#E5E7EB] ${
                      i % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"
                    } hover:bg-[#ECECEF] transition-colors duration-200`}
                  >
                    <div>{(page - 1) * itemsPerPage + i + 1}</div>
                    <div className="text-[13px] pr-4">
                      {(() => {
                        const selected =
                          country === "ALL" ? us || de || cn || ep : getMember(family, country);
                        return selected?.title || family.familyTitle;
                      })()}
                    </div>
                    {[us, de, cn, ep].map((m, idx) => (
                      <div key={idx} className="text-sm leading-tight pr-3 min-w-0">
                        {m ? (
                          <>
                            <div className="text-[13px] whitespace-nowrap">{m.number}</div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`text-[10px] px-2 py-[2px] rounded-md font-medium ${
                                m.status?.toLowerCase() === "grant"
                                  ? "bg-[#FFF4EB] text-[#FF6B00]"
                                  : "bg-[#EEF2FF] text-[#2563EB]"
                              }`}>
                                {m.status}
                              </span>
                              {m.date && (
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                  {formatDate(m.date)}
                                </span>
                              )}
                            </div>
                            {m.link && (
                              <a
                                href={m.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-1 text-[10px] px-2 py-[2px] border border-[#E5E7EB] rounded-md hover:bg-gray-100"
                                onClick={() => console.log("Opening Link:", m.link)}
                              >
                                View PDF
                              </a>
                            )}
                          </>
                        ) : "-"}
                      </div>
                    ))}
                    <div className="text-[13px]">
                      {family.inventors.map((inv: any, idx: any) => (
                        <span key={idx}>
                          {inv.toLowerCase() === "prerit pramod" ? (
                            <span className="font-semibold">Prerit Pramod</span>
                          ) : inv}
                          {idx !== family.inventors.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════
            DEFENSIVE PUBLICATIONS
        ══════════════════════════════════════ */}
        {activeTab === "Defensive Publications" && (
          <>
            <div className="md:hidden mt-4 space-y-3">
              {paginated.map((p: any, i) => (
                <div key={i} className={`border border-[#E5E7EB] rounded-xl p-4 ${i % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"}`}>
                  <p className="text-sm font-medium text-[#0D0D0D] mb-2 leading-snug">{p.title}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span><span className="font-medium text-gray-600">Number:</span> {p.number}</span>
                    <span><span className="font-medium text-gray-600">Status:</span> {p.status}</span>
                    <span><span className="font-medium text-gray-600">Date:</span> {formatDate(p.date)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="font-medium text-gray-600">Inventors:</span> {p.inventors.join(", ")}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden md:block mt-10 border border-[#E5E7EB] rounded-xl">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_2fr] px-6 py-4 text-xs text-gray-500 border-b border-[#E5E7EB]">
                <div>Title</div><div>Number</div><div>Status</div><div>Date</div><div>Inventors</div>
              </div>
              {paginated.map((p: any, i) => (
                <div key={i} className={`grid grid-cols-[2fr_1fr_1fr_1fr_2fr] px-6 py-4 border-b border-[#E5E7EB] text-sm ${i % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"} hover:bg-[#ECECEF] transition-colors duration-200`}>
                  <div>{p.title}</div>
                  <div>{p.number}</div>
                  <div>{p.status}</div>
                  <div>{formatDate(p.date)}</div>
                  <div>{p.inventors.join(", ")}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════
            TRADE SECRETS
        ══════════════════════════════════════ */}
        {activeTab === "Formal Trade Secrets" && (
          <>
            <div className="sm:hidden mt-4 space-y-3">
              {paginated.map((t: any, i) => (
                <div key={i} className={`border border-[#E5E7EB] rounded-xl p-4 ${i % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"}`}>
                  <p className="text-sm font-medium text-[#0D0D0D] mb-2 leading-snug break-words">{t.title}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span><span className="font-medium text-gray-600">Date:</span> {formatDate(t.date)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="font-medium text-gray-600">Inventors:</span> {t.inventors.join(", ")}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden sm:block mt-10 border border-[#E5E7EB] rounded-xl">
              <div className="grid grid-cols-[2fr_1fr_2fr] px-6 py-4 text-xs text-gray-500 border-b border-[#E5E7EB]">
                <div>Title</div><div>Date</div><div>Inventors</div>
              </div>
              {paginated.map((t: any, i) => (
                <div key={i} className={`grid grid-cols-[2fr_1fr_2fr] px-6 py-4 border-b border-[#E5E7EB] text-sm ${i % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"} hover:bg-[#ECECEF] transition-colors duration-200`}>
                  <div className="break-words pr-6">{t.title}</div>
                  <div>{formatDate(t.date)}</div>
                  <div>{t.inventors.join(", ")}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── Pagination ─── */}
        <div className="flex justify-center items-center gap-1.5 md:gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border border-[#E5E7EB] rounded-md text-sm transition-all duration-200 text-gray-600 hover:border-black hover:text-black hover:bg-[#F9F9F9] hover:-translate-y-[1px] hover:shadow-sm"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                page === i + 1
                  ? "bg-black text-white"
                  : "border border-[#E5E7EB] text-gray-600 hover:border-black hover:text-black hover:bg-[#F9F9F9] hover:-translate-y-[1px] hover:shadow-sm"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border border-[#E5E7EB] rounded-md text-sm transition-all duration-200 text-gray-600 hover:border-black hover:text-black hover:bg-[#F9F9F9] hover:-translate-y-[1px] hover:shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}