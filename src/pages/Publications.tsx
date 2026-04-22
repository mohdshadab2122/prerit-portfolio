import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  FileText,
  BookOpen,
  ChevronDown,
  Search,
} from "lucide-react";
import { useAppData } from "../Context/DataContext";

type PublicationCategory = "Conferences" | "Journals" | "Preprints";

interface Publication {
  category: PublicationCategory;
  title: string;
  year: string;
  organization: string;
  venue: string;
  externalLink?: string;
  pdfLink?: string;
  date?: string;
  platform?: string;
  tags?: string[];
}

const categories: PublicationCategory[] = [
  "Conferences",
  "Journals",
  "Preprints",
];

const PublicationCard = ({ publication }: { publication: Publication }) => {
  return (
    <div className="bg-[#F4F4F5] border border-[#E5E7EB] rounded-xl px-6 py-5 flex items-center justify-between gap-6 transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-y-[2px]">
      {/* LEFT */}
      <div className="flex-1">
        <h3 className="text-[17px] leading-relaxed font-medium text-[#0D0D0D] leading-snug">
          {publication.title}
        </h3>

        <p className="text-sm text-[#0D0D0D]/50 mt-2 flex items-center gap-2">
          <span>{publication.organization}</span>

          {publication.venue && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{publication.venue}</span>
            </>
          )}

          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>
            {publication.category === "Preprints"
              ? new Date(publication.date || "").toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : publication.year}
          </span>
        </p>
      </div>

      {/* RIGHT BUTTON */}
      {publication.externalLink && (
        <a
          href={publication.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-md border border-[#E5E7EB] transition-all duration-200 hover:bg-black hover:text-white"
        >
          Open
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};

export default function Publications() {
  const { data, loading } = useAppData();
  const [activeCategory, setActiveCategory] =
    useState<PublicationCategory>("Conferences");
  const [searchQuery, setSearchQuery] = useState("");

  const publications: Publication[] = data
    ? [
        ...(data?.publicationConferences?.map((item: any) => ({
          category: "Conferences" as PublicationCategory,
          title: item.title,
          year: item.year,
          organization: item.organization,
          venue: item.event,
          externalLink: item.link,
        })) || []),

        ...(data?.publicationJournals?.map((item: any) => ({
          category: "Journals" as PublicationCategory,
          title: item.title,
          year: item.year,
          organization: item.organization,
          venue: item.division,
          externalLink: item.link,
        })) || []),

        ...(data?.publicationPreprints?.map((item: any) => ({
          category: "Preprints" as PublicationCategory,
          title: item.title,
          organization: item.platform,
          venue: "",
          year: "",
          externalLink: item.link,
          date: item.date,
        })) || []),
      ]
    : [];

  const filteredPublications = publications
    .filter((publication) => publication.category === activeCategory)
    .filter((publication) => {
      const query = searchQuery.toLowerCase();

      return (
        publication.title.toLowerCase().includes(query) ||
        publication.organization.toLowerCase().includes(query) ||
        publication.venue.toLowerCase().includes(query) ||
        (publication.tags &&
          publication.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    })
    .sort((a, b) => {
      // ✅ first priority: date (newest first)
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      // ✅ fallback: year
      const yearA = Number(a.year) || 0;
      const yearB = Number(b.year) || 0;

      return yearB - yearA;
    });

  if (loading || !data) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  return (
    <div className="w-full bg-white min-h-screen py-32 px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-6xl mx-auto">
        <div className="pt-12 pb-12">
          {/* HEADING */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
            PUBLICATIONS
          </h1>

          {/* DESCRIPTION */}
          <p className="text-xl md:text-2xl text-[#0D0D0D]/40 max-w-4xl leading-relaxed font-light mb-12">
            A structured archive of conference papers, journal publications, and
            preprints across electric machines, control systems, motion control,
            sensing, and advanced drive systems.
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD 1 */}
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                Conferences
              </p>
              <div className="text-3xl font-semibold tracking-tight">
                {
                  publications.filter((p) => p.category === "Conferences")
                    .length
                }
                <span className="text-[#FF6B00] text-2xl font-medium">+</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                Research Papers
              </p>
            </div>

            {/* CARD 2 */}
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                Journals
              </p>
              <div className="text-3xl font-semibold tracking-tight">
                {publications.filter((p) => p.category === "Journals").length}
                <span className="text-[#FF6B00] text-2xl font-medium">+</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                Journal Articles
              </p>
            </div>

            {/* CARD 3 */}
            <div className="border border-[#E5E7EB] rounded-lg p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                Preprints
              </p>
              <div className="text-3xl font-semibold tracking-tight">
                {publications.filter((p) => p.category === "Preprints").length}
                <span className="text-[#FF6B00] text-2xl font-medium">+</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                Early Research
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {/* Tabs + Search (Patents Style) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          {/* LEFT: Tabs */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-black text-white"
                    : "bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* RIGHT: Search */}
          <div className="relative w-full md:w-[360px]">
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-full bg-white text-sm outline-none border border-[#E5E7EB]"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/40">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Count / Meta */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-[#0D0D0D]/45">
            Showing{" "}
            <span className="font-semibold text-[#0D0D0D]">
              {filteredPublications.length}
            </span>{" "}
            {activeCategory.toLowerCase()}
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#0D0D0D]/30">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em]">
              Research Portfolio Archive
            </span>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6">
          {filteredPublications.map((publication, index) => (
            <motion.div
              key={`${publication.title}-${publication.year}-${index}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
            >
              <PublicationCard publication={publication} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
