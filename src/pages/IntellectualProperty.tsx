import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppData } from "../Context/DataContext";

/*
 * Intellectual Property page
 *
 * This page reads three groups from DataContext: patent families, defensive
 * publications, and formal trade secrets. The helpers below handle shared
 * formatting, filtering, and pagination so the render components can stay
 * focused on UI.
 */

// Tabs are typed to the exact labels shown in the UI. This keeps the filtering
// and rendering branches aligned with what the user clicks.
type IntellectualPropertyTab =
  | "Patents"
  | "Defensive Publications"
  | "Formal Trade Secrets";

// Country filters only apply to patents. EP intentionally includes WO records.
type JurisdictionFilter = "ALL" | "US" | "DE" | "CN" | "EP";

type PatentJurisdiction = "US" | "DE" | "CN" | "EP" | "WO";

// One patent filing for a single jurisdiction inside a patent family.
interface PatentMember {
  jurisdiction: PatentJurisdiction | string;
  number: string;
  date?: string;
  title?: string;
  status?: string;
  link?: string;
}

// One patent family can contain filings across multiple jurisdictions.
interface PatentFamily {
  familyTitle: string;
  members: PatentMember[];
  inventors: string[];
}

// Defensive publications and trade secrets are simpler table-like records.
interface DefensivePublication {
  title: string;
  number: string;
  date: string;
  status: string;
  inventors: string[];
}

interface TradeSecret {
  title: string;
  date: string;
  inventors: string[];
}

interface PatentStats {
  totalFamilies: number;
  totalFilings: number;
  grantedCount: number;
  jurisdictions: number;
}

const ITEMS_PER_PAGE = 20;
const FEATURED_INVENTOR = "prerit pramod";

// Data-driven navigation definitions keep button rendering simple.
const TABS: IntellectualPropertyTab[] = [
  "Patents",
  "Defensive Publications",
  "Formal Trade Secrets",
];

const COUNTRY_FILTERS: JurisdictionFilter[] = ["ALL", "US", "DE", "CN", "EP"];

// Shared jurisdiction order for desktop columns and mobile family member cards.
const PATENT_JURISDICTION_COLUMNS: Array<{
  label: string;
  jurisdiction: Exclude<JurisdictionFilter, "ALL">;
}> = [
  { label: "US", jurisdiction: "US" },
  { label: "DE", jurisdiction: "DE" },
  { label: "CN", jurisdiction: "CN" },
  { label: "EP / WO", jurisdiction: "EP" },
];

// Header metric definitions. Each entry extracts one value from PatentStats.
const STAT_CARDS: Array<{
  label: string;
  subLabel: string;
  getValue: (stats: PatentStats) => number;
  suffix?: string;
}> = [
  {
    label: "Across Jurisdictions",
    subLabel: "Patent Families",
    getValue: (stats) => stats.totalFamilies,
    suffix: "+",
  },
  {
    label: "US · DE · CN · EP",
    subLabel: "Total Filings",
    getValue: (stats) => stats.totalFilings,
    suffix: "+",
  },
  {
    label: "Confirmed by Office",
    subLabel: "Granted Patents",
    getValue: (stats) => stats.grantedCount,
    suffix: "+",
  },
  {
    label: "Global Coverage",
    subLabel: "Jurisdictions",
    getValue: (stats) => stats.jurisdictions,
  },
];

const normalizeText = (value: string) => value.toLowerCase();

const isGranted = (status?: string) => status?.toLowerCase() === "grant";

// Invalid or already-formatted date values fall back to their original string,
// so the UI never hides data just because parsing failed.
const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === "-") return dateStr;

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// EP data can arrive as either EP or WO. Keep this lookup centralized so every
// mobile and desktop patent view handles the fallback the same way.
const getPatentMember = (
  family: PatentFamily,
  jurisdiction: JurisdictionFilter,
) => {
  if (jurisdiction === "ALL") return undefined;

  if (jurisdiction === "EP") {
    return (
      family.members.find((member) => member.jurisdiction === "EP") ||
      family.members.find((member) => member.jurisdiction === "WO")
    );
  }

  return family.members.find((member) => member.jurisdiction === jurisdiction);
};

// Pick the most relevant title for the active country filter. In ALL mode, use
// the first available title in the same order the jurisdictions are displayed.
const getPatentDisplayTitle = (
  family: PatentFamily,
  country: JurisdictionFilter,
) => {
  if (country !== "ALL") {
    return getPatentMember(family, country)?.title || family.familyTitle;
  }

  return (
    getPatentMember(family, "US")?.title ||
    getPatentMember(family, "DE")?.title ||
    getPatentMember(family, "CN")?.title ||
    getPatentMember(family, "EP")?.title ||
    family.familyTitle
  );
};

// Returns only the jurisdictions that exist for a patent family.
const getJurisdictionRows = (family: PatentFamily) =>
  PATENT_JURISDICTION_COLUMNS.map(
    ({ label, jurisdiction }) =>
      [label, getPatentMember(family, jurisdiction)] as const,
  ).filter(([, member]) => member != null);

const getSearchPlaceholder = (activeTab: IntellectualPropertyTab) => {
  if (activeTab === "Patents") return "Search patents...";
  if (activeTab === "Defensive Publications") return "Search publications...";
  return "Search trade secrets...";
};

// Stats are based on all patent families, not the current search/filter state,
// matching the original page behavior.
const calculatePatentStats = (patentFamilies: PatentFamily[]): PatentStats => {
  let totalFilings = 0;
  let grantedCount = 0;
  const jurisdictions = new Set<string>();

  patentFamilies.forEach((family) => {
    (family.members || []).forEach((member) => {
      totalFilings++;
      if (isGranted(member.status)) grantedCount++;
      jurisdictions.add(member.jurisdiction);
    });
  });

  return {
    totalFamilies: patentFamilies.length,
    totalFilings,
    grantedCount,
    jurisdictions: jurisdictions.size,
  };
};

// Patent search checks family title and inventors. Country matching is done at
// the filing/member level because each family can span several jurisdictions.
const filterPatents = (
  patentFamilies: PatentFamily[],
  search: string,
  country: JurisdictionFilter,
) => {
  const query = normalizeText(search);

  return patentFamilies.filter((family) => {
    const matchSearch =
      normalizeText(family.familyTitle || "").includes(query) ||
      normalizeText((family.inventors || []).join(" ")).includes(query);

    const matchCountry =
      country === "ALL" ||
      (family.members || []).some(
        (member) =>
          member.jurisdiction === country ||
          (country === "EP" && member.jurisdiction === "WO"),
      );

    return matchSearch && matchCountry;
  });
};

// Non-patent tabs currently expose title search only, because that is the
// searchable field shown most prominently in those views.
const filterDefensivePublications = (
  publications: DefensivePublication[],
  search: string,
) => {
  const query = normalizeText(search);
  return publications.filter((publication) =>
    normalizeText(publication.title).includes(query),
  );
};

const filterTradeSecrets = (tradeSecrets: TradeSecret[], search: string) => {
  const query = normalizeText(search);
  return tradeSecrets.filter((tradeSecret) =>
    normalizeText(tradeSecret.title).includes(query),
  );
};

// Shared inventor renderer. It highlights the portfolio owner consistently
// across patent cards and tables.
const InventorList = ({
  inventors,
  featuredClassName = "font-semibold",
}: {
  inventors: string[];
  featuredClassName?: string;
}) => (
  <>
    {inventors.map((inventor, index) => (
      <span key={index}>
        {inventor.toLowerCase() === FEATURED_INVENTOR ? (
          <span className={featuredClassName}>Prerit Pramod</span>
        ) : (
          inventor
        )}
        {index !== inventors.length - 1 && ", "}
      </span>
    ))}
  </>
);

// Shared filing status badge. "Grant" uses the orange success treatment; all
// other statuses retain the blue in-progress style.
const StatusBadge = ({ status }: { status?: string }) => (
  <span
    className={`text-[10px] px-2 py-[2px] rounded-md font-medium ${
      isGranted(status)
        ? "bg-[#FFF4EB] text-[#FF6B00]"
        : "bg-[#EEF2FF] text-[#2563EB]"
    }`}
  >
    {status}
  </span>
);

// Reusable metric card for the header stats grid.
const StatCard = ({
  label,
  value,
  suffix,
  subLabel,
}: {
  label: string;
  value: number;
  suffix?: string;
  subLabel: string;
}) => (
  <div className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-2">
      {label}
    </p>
    <div className="text-2xl md:text-3xl font-semibold tracking-tight">
      {value}
      {suffix && <span className="text-[#FF6B00]">{suffix}</span>}
    </div>
    <p className="text-[10px] md:text-xs text-gray-500 mt-2 tracking-wide">
      {subLabel}
    </p>
  </div>
);

// Top-level tab button.
const TabButton = ({
  tab,
  activeTab,
  onClick,
}: {
  tab: IntellectualPropertyTab;
  activeTab: IntellectualPropertyTab;
  onClick: (tab: IntellectualPropertyTab) => void;
}) => (
  <button
    onClick={() => onClick(tab)}
    className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
      activeTab === tab
        ? "bg-black text-white"
        : "bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]"
    }`}
  >
    {tab}
  </button>
);

// Patent-only country filter. EP is labelled "EP & WO" because the data model
// treats WO as the EP fallback jurisdiction.
const CountryFilterButton = ({
  country,
  activeCountry,
  onClick,
}: {
  country: JurisdictionFilter;
  activeCountry: JurisdictionFilter;
  onClick: (country: JurisdictionFilter) => void;
}) => (
  <button
    onClick={() => onClick(country)}
    className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm border rounded-md transition-all duration-200 ${
      activeCountry === country
        ? "border-[#FF6B00] text-[#FF6B00] bg-[#FFF4EB]"
        : "border-[#E5E7EB] text-gray-500 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-[#FFF4EB]"
    }`}
  >
    {country === "EP" ? "EP & WO" : country}
  </button>
);

// Search input adapts width and placeholder to the active tab.
const SearchField = ({
  activeTab,
  search,
  onSearchChange,
}: {
  activeTab: IntellectualPropertyTab;
  search: string;
  onSearchChange: (value: string) => void;
}) => (
  <div
    className={`relative ${
      activeTab !== "Patents"
        ? "w-full sm:w-[320px]"
        : "w-full sm:w-[280px] md:w-[320px]"
    }`}
  >
    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
    <input
      className="w-full border border-[#E5E7EB] rounded-full pl-10 pr-4 py-2 bg-white text-sm focus:outline-none focus:ring-0 focus:border-[#E5E7EB]"
      placeholder={getSearchPlaceholder(activeTab)}
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
    />
  </div>
);

// Mobile patents use an accordion layout to keep dense jurisdiction data
// readable without changing the desktop table experience.
const MobilePatentCard = ({
  family,
  index,
  page,
  itemsPerPage,
  country,
}: {
  family: PatentFamily;
  index: number;
  page: number;
  itemsPerPage: number;
  country: JurisdictionFilter;
}) => {
  const [expanded, setExpanded] = useState(false);
  const jurisdictionRows = getJurisdictionRows(family);
  const grantedCount = jurisdictionRows.filter(([, member]) =>
    isGranted(member?.status),
  ).length;

  return (
    <div
      className={`border border-[#E5E7EB] rounded-2xl overflow-hidden transition-shadow duration-200 ${
        index % 2 === 0 ? "bg-white" : "bg-[#F9F9F9]"
      } ${expanded ? "shadow-md border-[#D1D5DB]" : ""}`}
    >
      <button
        onClick={() => setExpanded((value) => !value)}
        className="w-full text-left p-4 flex items-start gap-3 group"
      >
        <span className="text-[11px] text-gray-400 font-mono mt-[3px] shrink-0 w-5 text-right">
          {(page - 1) * itemsPerPage + index + 1}.
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#0D0D0D] leading-snug">
            {getPatentDisplayTitle(family, country)}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
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

        <span className="shrink-0 mt-[3px] text-gray-400 group-hover:text-[#0A5CE6] transition-colors">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

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
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mt-3 mb-2">
                Family Members
              </p>

              <div className="space-y-2">
                {jurisdictionRows.map(([label, member]) => (
                  <div
                    key={label}
                    className="bg-white border border-[#E5E7EB] rounded-xl p-3"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0D0D0D]/45">
                        {label}
                      </span>
                      <StatusBadge status={member?.status} />
                    </div>

                    <p className="text-[13px] font-mono text-[#0D0D0D] font-semibold mb-1.5">
                      {member?.number}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      {member?.date && (
                        <span className="text-[11px] text-gray-400">
                          {formatDate(member.date)}
                        </span>
                      )}
                      {member?.link && (
                        <a
                          href={member.link}
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

              <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                  Inventors
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <InventorList
                    inventors={family.inventors}
                    featuredClassName="font-semibold text-[#0D0D0D]"
                  />
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// One jurisdiction cell in the desktop patent table. Missing filings render as
// "-" to preserve the original comparison-table layout.
const PatentJurisdictionCell = ({ member }: { member?: PatentMember }) => (
  <div className="text-sm leading-tight pr-3 min-w-0">
    {member ? (
      <>
        <div className="text-[13px] whitespace-nowrap">{member.number}</div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <StatusBadge status={member.status} />
          {member.date && (
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {formatDate(member.date)}
            </span>
          )}
        </div>
        {member.link && (
          <a
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 text-[10px] px-2 py-[2px] border border-[#E5E7EB] rounded-md hover:bg-gray-100"
          >
            View PDF
          </a>
        )}
      </>
    ) : (
      "-"
    )}
  </div>
);

// Desktop patent table keeps all jurisdiction columns visible for comparison.
const PatentDesktopTable = ({
  families,
  page,
  country,
}: {
  families: PatentFamily[];
  page: number;
  country: JurisdictionFilter;
}) => (
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

    {families.map((family, index) => {
      const us = getPatentMember(family, "US");
      const de = getPatentMember(family, "DE");
      const cn = getPatentMember(family, "CN");
      const ep = getPatentMember(family, "EP");

      return (
        <div
          key={index}
          className={`grid grid-cols-[40px_2fr_1.6fr_1.6fr_1.6fr_1.6fr_2fr] gap-x-6 px-6 py-5 border-b border-[#E5E7EB] ${
            index % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"
          } hover:bg-[#ECECEF] transition-colors duration-200`}
        >
          <div>{(page - 1) * ITEMS_PER_PAGE + index + 1}</div>
          <div className="text-[13px] pr-4">
            {getPatentDisplayTitle(family, country)}
          </div>
          {[us, de, cn, ep].map((member, memberIndex) => (
            <PatentJurisdictionCell key={memberIndex} member={member} />
          ))}
          <div className="text-[13px]">
            <InventorList inventors={family.inventors} />
          </div>
        </div>
      );
    })}
  </div>
);

// Responsive patent view: mobile uses accordion cards, desktop uses the full
// jurisdiction comparison table.
const PatentsView = ({
  families,
  page,
  country,
}: {
  families: PatentFamily[];
  page: number;
  country: JurisdictionFilter;
}) => (
  <>
    <div className="lg:hidden space-y-2 mt-4">
      {families.map((family, index) => (
        <MobilePatentCard
          key={index}
          family={family}
          index={index}
          page={page}
          itemsPerPage={ITEMS_PER_PAGE}
          country={country}
        />
      ))}
    </div>

    <PatentDesktopTable families={families} page={page} country={country} />
  </>
);

// Defensive publications need separate mobile and desktop layouts because the
// inventor column can become dense on smaller screens.
const DefensivePublicationsView = ({
  publications,
}: {
  publications: DefensivePublication[];
}) => (
  <>
    <div className="md:hidden mt-4 space-y-3">
      {publications.map((publication, index) => (
        <div
          key={index}
          className={`border border-[#E5E7EB] rounded-xl p-4 ${
            index % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"
          }`}
        >
          <p className="text-sm font-medium text-[#0D0D0D] mb-2 leading-snug">
            {publication.title}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>
              <span className="font-medium text-gray-600">Number:</span>{" "}
              {publication.number}
            </span>
            <span>
              <span className="font-medium text-gray-600">Status:</span>{" "}
              {publication.status}
            </span>
            <span>
              <span className="font-medium text-gray-600">Date:</span>{" "}
              {formatDate(publication.date)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-medium text-gray-600">Inventors:</span>{" "}
            {publication.inventors.join(", ")}
          </p>
        </div>
      ))}
    </div>

    <div className="hidden md:block mt-10 border border-[#E5E7EB] rounded-xl">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_2fr] px-6 py-4 text-xs text-gray-500 border-b border-[#E5E7EB]">
        <div>Title</div>
        <div>Number</div>
        <div>Status</div>
        <div>Date</div>
        <div>Inventors</div>
      </div>
      {publications.map((publication, index) => (
        <div
          key={index}
          className={`grid grid-cols-[2fr_1fr_1fr_1fr_2fr] px-6 py-4 border-b border-[#E5E7EB] text-sm ${
            index % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"
          } hover:bg-[#ECECEF] transition-colors duration-200`}
        >
          <div>{publication.title}</div>
          <div>{publication.number}</div>
          <div>{publication.status}</div>
          <div>{formatDate(publication.date)}</div>
          <div>{publication.inventors.join(", ")}</div>
        </div>
      ))}
    </div>
  </>
);

// Formal trade secrets have fewer fields, so this view renders a reduced
// title/date/inventors layout.
const TradeSecretsView = ({
  tradeSecrets,
}: {
  tradeSecrets: TradeSecret[];
}) => (
  <>
    <div className="sm:hidden mt-4 space-y-3">
      {tradeSecrets.map((tradeSecret, index) => (
        <div
          key={index}
          className={`border border-[#E5E7EB] rounded-xl p-4 ${
            index % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"
          }`}
        >
          <p className="text-sm font-medium text-[#0D0D0D] mb-2 leading-snug break-words">
            {tradeSecret.title}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>
              <span className="font-medium text-gray-600">Date:</span>{" "}
              {formatDate(tradeSecret.date)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-medium text-gray-600">Inventors:</span>{" "}
            {tradeSecret.inventors.join(", ")}
          </p>
        </div>
      ))}
    </div>

    <div className="hidden sm:block mt-10 border border-[#E5E7EB] rounded-xl">
      <div className="grid grid-cols-[2fr_1fr_2fr] px-6 py-4 text-xs text-gray-500 border-b border-[#E5E7EB]">
        <div>Title</div>
        <div>Date</div>
        <div>Inventors</div>
      </div>
      {tradeSecrets.map((tradeSecret, index) => (
        <div
          key={index}
          className={`grid grid-cols-[2fr_1fr_2fr] px-6 py-4 border-b border-[#E5E7EB] text-sm ${
            index % 2 === 0 ? "bg-white" : "bg-[#F4F4F5]"
          } hover:bg-[#ECECEF] transition-colors duration-200`}
        >
          <div className="break-words pr-6">{tradeSecret.title}</div>
          <div>{formatDate(tradeSecret.date)}</div>
          <div>{tradeSecret.inventors.join(", ")}</div>
        </div>
      ))}
    </div>
  </>
);

// Shared pagination for all tabs. The parent owns page state so filters and tab
// switches can reset the list back to page 1.
const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number | ((currentPage: number) => number)) => void;
}) => (
  <div className="flex justify-center items-center gap-1.5 md:gap-2 mt-8 flex-wrap">
    <button
      onClick={() =>
        onPageChange((currentPage) => Math.max(currentPage - 1, 1))
      }
      className="px-3 py-1 border border-[#E5E7EB] rounded-md text-sm transition-all duration-200 text-gray-600 hover:border-black hover:text-black hover:bg-[#F9F9F9] hover:-translate-y-[1px] hover:shadow-sm"
    >
      Prev
    </button>
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
          page === index + 1
            ? "bg-black text-white"
            : "border border-[#E5E7EB] text-gray-600 hover:border-black hover:text-black hover:bg-[#F9F9F9] hover:-translate-y-[1px] hover:shadow-sm"
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() =>
        onPageChange((currentPage) => Math.min(currentPage + 1, totalPages))
      }
      className="px-3 py-1 border border-[#E5E7EB] rounded-md text-sm transition-all duration-200 text-gray-600 hover:border-black hover:text-black hover:bg-[#F9F9F9] hover:-translate-y-[1px] hover:shadow-sm"
    >
      Next
    </button>
  </div>
);

// Entry point: read portfolio data from context, apply active filters, paginate
// the result, then render the matching tab view.
export default function IntellectualProperty() {
  const { data } = useAppData();
  const [activeTab, setActiveTab] =
    useState<IntellectualPropertyTab>("Patents");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<JurisdictionFilter>("ALL");
  const [page, setPage] = useState(1);

  const patentFamilies = (data?.patents || []) as PatentFamily[];
  const defensivePublications = (data?.defensivePublications ||
    []) as DefensivePublication[];
  const tradeSecrets = (data?.tradeSecrets || []) as TradeSecret[];

  // Header stats always summarize the full patent portfolio.
  const stats = useMemo(
    () => calculatePatentStats(patentFamilies),
    [patentFamilies],
  );

  // The active tab decides which source array is searched and displayed.
  const filtered = useMemo(() => {
    if (activeTab === "Patents") {
      return filterPatents(patentFamilies, search, country);
    }

    if (activeTab === "Defensive Publications") {
      return filterDefensivePublications(defensivePublications, search);
    }

    if (activeTab === "Formal Trade Secrets") {
      return filterTradeSecrets(tradeSecrets, search);
    }

    return [];
  }, [
    activeTab,
    country,
    defensivePublications,
    patentFamilies,
    search,
    tradeSecrets,
  ]);

  // Pagination is applied after filtering so page counts reflect the visible
  // result set.
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Any filter or tab change should return the list to the first page.
  useEffect(() => {
    setPage(1);
  }, [search, country, activeTab]);

  // Switching sections clears search because each tab searches a different
  // dataset and uses a different placeholder.
  const handleTabChange = (tab: IntellectualPropertyTab) => {
    setActiveTab(tab);
    setSearch("");
    setPage(1);
  };

  // Country selection is patent-specific and should start at the first page of
  // the newly filtered result.
  const handleCountryChange = (nextCountry: JurisdictionFilter) => {
    setCountry(nextCountry);
    setPage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-12 md:pb-16">
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

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-16">
            {STAT_CARDS.map((card) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.getValue(stats)}
                suffix={card.suffix}
                subLabel={card.subLabel}
              />
            ))}
          </div>

          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                activeTab={activeTab}
                onClick={handleTabChange}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-12">
          {activeTab === "Patents" && (
            <div className="flex gap-2 flex-wrap">
              {COUNTRY_FILTERS.map((countryFilter) => (
                <CountryFilterButton
                  key={countryFilter}
                  country={countryFilter}
                  activeCountry={country}
                  onClick={handleCountryChange}
                />
              ))}
            </div>
          )}

          <SearchField
            activeTab={activeTab}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        {activeTab === "Patents" && (
          <PatentsView
            families={paginated as PatentFamily[]}
            page={page}
            country={country}
          />
        )}

        {activeTab === "Defensive Publications" && (
          <DefensivePublicationsView
            publications={paginated as DefensivePublication[]}
          />
        )}

        {activeTab === "Formal Trade Secrets" && (
          <TradeSecretsView tradeSecrets={paginated as TradeSecret[]} />
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
