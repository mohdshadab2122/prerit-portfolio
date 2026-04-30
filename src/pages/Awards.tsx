import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppData } from "../context/DataContext";
import { getPageIntro } from "../config/pageContent";

/*
 * Awards page
 *
 * DataContext exposes awards and recognitions as two separate arrays. This page
 * converts them into one shared item model, uses tabs to choose which group is
 * displayed, and keeps a marquee of all titled items above the list.
 */

type Category = "Awards" | "Recognitions";

interface RawAward {
  title?: string;
  organization?: string;
  year?: string;
  summary?: string;
  description?: string;
}

interface RawRecognition {
  title?: string;
  organization?: string;
  summary?: string;
  description?: string;
}

// Shared UI shape used by cards, tabs, and the marquee.
interface AwardItem {
  category: Category;
  title: string;
  organization: string;
  year?: string;
  summary: string;
  description: string;
}

const TABS: Category[] = ["Awards", "Recognitions"];

// Home.tsx includes the target tab in the query string so deep links can open
// the right list before scrolling to a specific award card.
const getCategoryFromSearch = (search: string): Category => {
  const category = new URLSearchParams(search).get("category");
  return TABS.includes(category as Category)
    ? (category as Category)
    : "Awards";
};

// Anchor IDs mirror the Home.tsx award card links.
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

// Converts separate source arrays into one typed list while preserving category
// labels for filtering and marquee badges.
const buildAwardItems = (data: {
  awards?: RawAward[];
  recognitions?: RawRecognition[];
}): AwardItem[] => [
  ...(data.awards?.map((item) => ({
    category: "Awards" as Category,
    title: item.title || "",
    organization: item.organization || "",
    year: item.year,
    summary: item.summary || "",
    description: item.description || "",
  })) || []),
  ...(data.recognitions?.map((item) => ({
    category: "Recognitions" as Category,
    title: item.title || "",
    organization: item.organization || "",
    summary: item.summary || "",
    description: item.description || "",
  })) || []),
];

// Marquee skips untitled records, then reverses the list to match the original
// newest-first visual behavior.
const getMarqueeItems = (items: AwardItem[]) =>
  items
    .filter((item) => item.title && item.title.trim() !== "")
    .slice()
    .reverse();

// The tab list uses the same reverse behavior as the original component.
const getFilteredItems = (items: AwardItem[], active: Category) =>
  items
    .filter((item) => item.category === active)
    .slice()
    .reverse();

const LoadingState = () => <div>Loading...</div>;

const TabButton = ({
  tab,
  active,
  onClick,
}: {
  tab: Category;
  active: Category;
  onClick: (tab: Category) => void;
}) => (
  <button
    onClick={() => onClick(tab)}
    className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all ${
      active === tab
        ? "bg-black text-white"
        : "bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]"
    }`}
  >
    {tab}
  </button>
);

// One expandable award/recognition card. The summary is always visible, while
// the longer description is revealed on click.
const AwardCard = ({ item }: { item: AwardItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      id={buildAnchorId("award", item.title)}
      className="scroll-mt-28 border border-[#E5E7EB] rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 bg-[#F4F4F5] hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <div
        onClick={() => setOpen((current) => !current)}
        className="cursor-pointer"
      >
        <div className="flex justify-between items-start gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#0D0D0D] leading-snug">
              {item.title}
            </h3>

            <div className="mt-1.5 md:mt-2 text-xs md:text-sm text-[#0D0D0D]/50 flex flex-wrap items-center gap-1.5 md:gap-2">
              <span>{item.organization}</span>
              {item.year && (
                <>
                  <span className="opacity-40">{"\u2022"}</span>
                  <span>{item.year}</span>
                </>
              )}
            </div>

            <p className="mt-2 md:mt-3 text-xs md:text-sm text-[#0D0D0D]/65 leading-relaxed">
              {item.summary}
            </p>
          </div>

          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-[#0D0D0D]/40 shrink-0 mt-0.5"
          >
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
          </motion.div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-[#E5E7EB]">
                <p className="text-xs md:text-sm text-[#0D0D0D]/70 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const AwardsHeader = ({ intro }: { intro: string }) => (
  <div className="pt-3 md:pt-8 pb-8 md:pb-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#0D0D0D] tracking-tighter leading-none">
        AWARDS & <span className="text-[#FF6B00]">RECOGNITIONS</span>
      </h1>

      <p className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-[#0D0D0D]/50 max-w-3xl leading-relaxed font-light">
        {intro}
      </p>
    </motion.div>
  </div>
);

// The marquee is decorative but data-driven. Duplicating the array creates a
// seamless loop when paired with the existing marquee CSS.
const AwardsMarquee = ({ items }: { items: AwardItem[] }) => (
  <div className="mt-8 md:mt-10 mb-8 md:mb-12 marquee-wrapper">
    <div className="absolute left-0 top-0 h-full w-12 md:w-20 bg-gradient-to-r from-white to-transparent z-10" />
    <div className="absolute right-0 top-0 h-full w-12 md:w-20 bg-gradient-to-l from-white to-transparent z-10" />

    <div className="marquee gap-3 md:gap-6">
      {[...items, ...items].map((item, index) => (
        <div
          key={`${item.category}-${item.title}-${index}`}
          className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] shadow-sm whitespace-nowrap"
        >
          <span className="text-xs md:text-sm font-medium text-[#0D0D0D] flex items-center gap-1.5 md:gap-2">
            <span>{item.category === "Awards" ? "\u{1F3C6}" : "\u2B50"}</span>
            {item.title}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AwardsTabs = ({
  active,
  onTabChange,
}: {
  active: Category;
  onTabChange: (tab: Category) => void;
}) => (
  <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
    {TABS.map((tab) => (
      <TabButton key={tab} tab={tab} active={active} onClick={onTabChange} />
    ))}
  </div>
);

const AwardsList = ({ items }: { items: AwardItem[] }) => (
  <div className="space-y-3 md:space-y-5">
    {items.map((item) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.35 }}
      >
        <AwardCard item={item} />
      </motion.div>
    ))}
  </div>
);

// Entry point: normalize awards/recognitions, derive the marquee and active tab
// lists, then compose the page.
export default function Awards() {
  const { data, loading } = useAppData();
  const location = useLocation();
  const intro = getPageIntro(data?.pageContent, "awards");
  const [active, setActive] = useState<Category>(() =>
    getCategoryFromSearch(location.search),
  );

  const mappedData = useMemo(
    () =>
      data
        ? buildAwardItems({
            awards: data.awards as RawAward[],
            recognitions: data.recognitions as RawRecognition[],
          })
        : [],
    [data],
  );

  const marqueeItems = useMemo(() => getMarqueeItems(mappedData), [mappedData]);
  const filteredItems = useMemo(
    () => getFilteredItems(mappedData, active),
    [active, mappedData],
  );

  useEffect(() => {
    setActive(getCategoryFromSearch(location.search));
  }, [location.search]);

  useEffect(() => {
    if (!loading && filteredItems.length) {
      scrollToHash(location.hash);
    }
  }, [filteredItems, loading, location.hash]);

  if (loading || !data) return <LoadingState />;

  return (
    <div className="w-full min-h-screen bg-white pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <AwardsHeader intro={intro} />
        <AwardsMarquee items={marqueeItems} />
        <AwardsTabs active={active} onTabChange={setActive} />
        <AwardsList items={filteredItems} />
      </div>
    </div>
  );
}
