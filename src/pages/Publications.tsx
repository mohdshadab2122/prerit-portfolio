import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { useAppData } from "../context/DataContext";
import { getPageIntro } from "../config/pageContent";
import {
  HASH_HIGHLIGHT_CLASS,
  useHashHighlight,
} from "../utils/hashHighlight";

/*
 * Publications page
 *
 * DataContext provides three separate publication arrays from the spreadsheet:
 * conference papers, journal articles, and preprints. This file normalizes them
 * into one UI model, then filters and renders that model by active category.
 */

type PublicationCategory = "Conferences" | "Journals" | "Preprints";

interface RawConferencePublication {
  title?: string;
  year?: string;
  organization?: string;
  event?: string;
  link?: string;
}

interface RawJournalPublication {
  title?: string;
  year?: string;
  organization?: string;
  division?: string;
  link?: string;
}

interface RawPreprintPublication {
  title?: string;
  date?: string;
  platform?: string;
  link?: string;
}

// Common UI shape used by cards, search, stats, and sorting.
interface Publication {
  category: PublicationCategory;
  title: string;
  year: string;
  organization: string;
  venue: string;
  externalLink?: string;
  date?: string;
  tags?: string[];
}

interface PublicationStats {
  total: number;
  Conferences: number;
  Journals: number;
  Preprints: number;
}

const CATEGORIES: PublicationCategory[] = [
  "Conferences",
  "Journals",
  "Preprints",
];

// Home.tsx sends publication category in the query string so journal and
// preprint links open the correct tab before scrolling to the card.
const getCategoryFromSearch = (search: string): PublicationCategory => {
  const category = new URLSearchParams(search).get("category");
  return CATEGORIES.includes(category as PublicationCategory)
    ? (category as PublicationCategory)
    : "Conferences";
};

// Anchor IDs mirror the Home.tsx publication card links.
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

// Header stat cards are data-driven so adding another category later is local.
const STAT_CARDS: Array<{
  statKey: keyof PublicationStats;
  label: string;
  subLabel: string;
}> = [
  {
    statKey: "total",
    label: "Total Publications",
    subLabel: "Published Works",
  },
  {
    statKey: "Conferences",
    label: "Conferences",
    subLabel: "Research Papers",
  },
  {
    statKey: "Journals",
    label: "Journals",
    subLabel: "Journal Articles",
  },
  {
    statKey: "Preprints",
    label: "Preprints",
    subLabel: "Early Research",
  },
];

const normalizeText = (value?: string) => (value || "").toLowerCase();

// Preserve the existing date display style used for preprints.
const formatPreprintDate = (date?: string) =>
  new Date(date || "").toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Converts the three source arrays into one consistent list for the UI.
const buildPublications = (data: {
  publicationConferences?: RawConferencePublication[];
  publicationJournals?: RawJournalPublication[];
  publicationPreprints?: RawPreprintPublication[];
}): Publication[] => [
  ...(data.publicationConferences?.map((item) => ({
    category: "Conferences" as PublicationCategory,
    title: item.title || "",
    year: item.year || "",
    organization: item.organization || "",
    venue: item.event || "",
    externalLink: item.link,
  })) || []),

  ...(data.publicationJournals?.map((item) => ({
    category: "Journals" as PublicationCategory,
    title: item.title || "",
    year: item.year || "",
    organization: item.organization || "",
    venue: item.division || "",
    externalLink: item.link,
  })) || []),

  ...(data.publicationPreprints?.map((item) => ({
    category: "Preprints" as PublicationCategory,
    title: item.title || "",
    organization: item.platform || "",
    venue: "",
    year: "",
    externalLink: item.link,
    date: item.date,
  })) || []),
];

// Counts all records by category for the header stat cards.
const calculateStats = (publications: Publication[]): PublicationStats =>
  publications.reduce(
    (stats, publication) => ({
      ...stats,
      [publication.category]: stats[publication.category] + 1,
    }),
    {
      total: publications.length,
      Conferences: 0,
      Journals: 0,
      Preprints: 0,
    },
  );

// Search checks the fields visible in the card plus optional tags for future
// sheet expansion.
const matchesSearch = (publication: Publication, searchQuery: string) => {
  const query = normalizeText(searchQuery);

  return (
    normalizeText(publication.title).includes(query) ||
    normalizeText(publication.organization).includes(query) ||
    normalizeText(publication.venue).includes(query) ||
    Boolean(publication.tags?.some((tag) => normalizeText(tag).includes(query)))
  );
};

const sortPublications = (a: Publication, b: Publication) => {
  if (a.date && b.date) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }

  const yearA = Number(a.year) || 0;
  const yearB = Number(b.year) || 0;
  return yearB - yearA;
};

const filterPublications = (
  publications: Publication[],
  activeCategory: PublicationCategory,
  searchQuery: string,
) =>
  publications
    .filter((publication) => publication.category === activeCategory)
    .filter((publication) => matchesSearch(publication, searchQuery))
    .sort(sortPublications);

const LoadingState = () => <div className="p-10 text-center">Loading...</div>;

const StatCard = ({
  label,
  value,
  subLabel,
  className = "",
}: {
  label: string;
  value: number;
  subLabel: string;
  className?: string;
}) => (
  <div
    className={`${className} border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
  >
    <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-1.5 md:mb-2">
      {label}
    </p>
    <div className="text-2xl md:text-3xl font-semibold tracking-tight">
      {value}
      <span className="text-[#FF6B00] text-xl md:text-2xl font-medium">+</span>
    </div>
    <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-2 tracking-wide">
      {subLabel}
    </p>
  </div>
);

// Page header and category stats. Stats summarize the full publications set,
// not only the active tab.
const PublicationsHeader = ({
  intro,
  stats,
}: {
  intro: string;
  stats: PublicationStats;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="mb-10 md:mb-16 lg:mb-20"
  >
    <h1 className="text-[2.5rem] sm:text-5xl lg:text-7xl font-bold tracking-tighter leading-none mb-4 md:mb-8 break-words">
      PUBLICATIONS
    </h1>

    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#0D0D0D]/40 max-w-4xl leading-relaxed font-light mb-7 md:mb-12">
      {intro}
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {STAT_CARDS.map((card) => (
        <StatCard
          key={card.statKey}
          label={card.label}
          value={stats[card.statKey]}
          subLabel={card.subLabel}
        />
      ))}
    </div>
  </motion.div>
);

const CategoryTabs = ({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: PublicationCategory;
  onCategoryChange: (category: PublicationCategory) => void;
}) => (
  <div className="flex flex-wrap gap-2 md:gap-3">
    {CATEGORIES.map((category) => (
      <button
        key={category}
        onClick={() => onCategoryChange(category)}
        className={`flex-1 sm:flex-none px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
          activeCategory === category
            ? "bg-black text-white"
            : "bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

const SearchField = ({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) => (
  <div className="relative w-full sm:w-[280px] md:w-[360px]">
    <input
      type="text"
      placeholder="Search publications..."
      value={searchQuery}
      onChange={(event) => onSearchChange(event.target.value)}
      className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-2.5 rounded-full bg-white text-xs md:text-sm outline-none border border-[#E5E7EB]"
    />
    <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/40">
      <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
    </div>
  </div>
);

// Combined controls row: category tabs on the left, search on the right.
const PublicationsToolbar = ({
  activeCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: {
  activeCategory: PublicationCategory;
  searchQuery: string;
  onCategoryChange: (category: PublicationCategory) => void;
  onSearchChange: (value: string) => void;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-6 mb-8 md:mb-12">
    <CategoryTabs
      activeCategory={activeCategory}
      onCategoryChange={onCategoryChange}
    />
    <SearchField searchQuery={searchQuery} onSearchChange={onSearchChange} />
  </div>
);

const ResultsMeta = ({
  count,
  activeCategory,
}: {
  count: number;
  activeCategory: PublicationCategory;
}) => (
  <div className="flex items-center justify-between mb-6 md:mb-8">
    <div className="text-xs md:text-sm text-[#0D0D0D]/45">
      Showing <span className="font-semibold text-[#0D0D0D]">{count}</span>{" "}
      {activeCategory.toLowerCase()}
    </div>
  </div>
);

const PublicationDate = ({ publication }: { publication: Publication }) => (
  <span>
    {publication.category === "Preprints"
      ? formatPreprintDate(publication.date)
      : publication.year}
  </span>
);

// One publication row/card. The layout stays identical across categories while
// metadata adapts to conference venue, journal division, or preprint platform.
const PublicationCard = ({
  publication,
  highlightedId,
}: {
  publication: Publication;
  highlightedId: string;
}) => {
  const anchorId = buildAnchorId("publication", publication.title);
  const isHighlighted = highlightedId === anchorId;

  return (
    <div
      id={anchorId}
      className={`scroll-mt-28 bg-[#F4F4F5] border border-[#E5E7EB] rounded-xl px-4 sm:px-5 md:px-6 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-y-[2px] ${
        isHighlighted ? HASH_HIGHLIGHT_CLASS : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-[15px] md:text-[17px] font-medium text-[#0D0D0D] leading-snug break-words hyphens-auto">
          {publication.title}
        </h3>

        <div className="text-xs md:text-sm text-[#0D0D0D]/50 mt-2 flex flex-wrap items-center gap-1.5 md:gap-2">
          <span className="break-words">{publication.organization}</span>

          {publication.venue && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="break-words">{publication.venue}</span>
            </>
          )}

          <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
          <PublicationDate publication={publication} />
        </div>
      </div>

      {publication.externalLink && (
        <a
          href={publication.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full sm:w-fit items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm rounded-md border border-[#E5E7EB] transition-all duration-200 hover:bg-black hover:text-white shrink-0"
        >
          Open
          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </a>
      )}
    </div>
  );
};

const PublicationsList = ({
  publications,
  highlightedId,
}: {
  publications: Publication[];
  highlightedId: string;
}) => (
  <div className="space-y-4 md:space-y-6">
    {publications.map((publication, index) => (
      <motion.div
        key={`${publication.title}-${publication.year}-${index}`}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.35, delay: index * 0.03 }}
      >
        <PublicationCard
          publication={publication}
          highlightedId={highlightedId}
        />
      </motion.div>
    ))}
  </div>
);

// Entry point: normalize source arrays, compute stats, filter active records,
// and render the publications archive.
export default function Publications() {
  const { data, loading } = useAppData();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<PublicationCategory>(
    () => getCategoryFromSearch(location.search),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const intro = getPageIntro(data?.pageContent, "publications");

  const publications = useMemo(
    () =>
      data
        ? buildPublications({
            publicationConferences:
              data.publicationConferences as RawConferencePublication[],
            publicationJournals:
              data.publicationJournals as RawJournalPublication[],
            publicationPreprints:
              data.publicationPreprints as RawPreprintPublication[],
          })
        : [],
    [data],
  );

  const stats = useMemo(() => calculateStats(publications), [publications]);

  const filteredPublications = useMemo(
    () => filterPublications(publications, activeCategory, searchQuery),
    [activeCategory, publications, searchQuery],
  );
  const highlightedId = useHashHighlight(
    location.hash,
    !loading && filteredPublications.length > 0,
  );

  useEffect(() => {
    setActiveCategory(getCategoryFromSearch(location.search));
  }, [location.search]);

  useEffect(() => {
    if (!loading && filteredPublications.length) {
      scrollToHash(location.hash);
    }
  }, [filteredPublications, loading, location.hash]);

  if (loading || !data) {
    return <LoadingState />;
  }

  return (
    <div className="w-full bg-white min-h-screen pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="pt-3 md:pt-8 pb-8 md:pb-12">
          <PublicationsHeader intro={intro} stats={stats} />
          <PublicationsToolbar
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onCategoryChange={setActiveCategory}
            onSearchChange={setSearchQuery}
          />
          <ResultsMeta
            count={filteredPublications.length}
            activeCategory={activeCategory}
          />
          <PublicationsList
            publications={filteredPublications}
            highlightedId={highlightedId}
          />
        </div>
      </div>
    </div>
  );
}
