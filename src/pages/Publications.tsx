import { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Search } from "lucide-react";
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
    <div className="bg-[#F4F4F5] border border-[#E5E7EB] rounded-xl px-4 sm:px-5 md:px-6 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-y-[2px]">
      {/* LEFT */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] md:text-[17px] font-medium text-[#0D0D0D] leading-snug">
          {publication.title}
        </h3>

        <div className="text-xs md:text-sm text-[#0D0D0D]/50 mt-2 flex flex-wrap items-center gap-1.5 md:gap-2">
          <span>{publication.organization}</span>

          {publication.venue && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              <span>{publication.venue}</span>
            </>
          )}

          <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
          <span>
            {publication.category === "Preprints"
              ? new Date(publication.date || "").toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : publication.year}
          </span>
        </div>
      </div>

      {/* RIGHT BUTTON */}
      {publication.externalLink && (
        <a
          href={publication.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm rounded-md border border-[#E5E7EB] transition-all duration-200 hover:bg-black hover:text-white w-fit shrink-0"
        >
          Open
          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
    .filter((p) => p.category === activeCategory)
    .filter((p) => {
      const query = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.organization.toLowerCase().includes(query) ||
        p.venue.toLowerCase().includes(query) ||
        (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      const yearA = Number(a.year) || 0;
      const yearB = Number(b.year) || 0;
      return yearB - yearA;
    });

  if (loading || !data) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="w-full bg-white min-h-screen pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-6xl mx-auto">
        <div className="pt-6 md:pt-12 pb-8 md:pb-12">
          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-16 lg:mb-20"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter leading-none mb-4 md:mb-6 md:mb-8">
              PUBLICATIONS
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#0D0D0D]/40 max-w-4xl leading-relaxed font-light mb-8 md:mb-12">
              A structured archive of conference papers, journal publications,
              and preprints across electric machines, control systems, motion
              control, sensing, and advanced drive systems.
            </p>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-1.5 md:mb-2">
                  Conferences
                </p>
                <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {
                    publications.filter((p) => p.category === "Conferences")
                      .length
                  }
                  <span className="text-[#FF6B00] text-xl md:text-2xl font-medium">
                    +
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-2 tracking-wide">
                  Research Papers
                </p>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-1.5 md:mb-2">
                  Journals
                </p>
                <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {publications.filter((p) => p.category === "Journals").length}
                  <span className="text-[#FF6B00] text-xl md:text-2xl font-medium">
                    +
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-2 tracking-wide">
                  Journal Articles
                </p>
              </div>

              <div className="col-span-2 md:col-span-1 border border-[#E5E7EB] rounded-lg p-3 md:p-4 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-1.5 md:mb-2">
                  Preprints
                </p>
                <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {
                    publications.filter((p) => p.category === "Preprints")
                      .length
                  }
                  <span className="text-[#FF6B00] text-xl md:text-2xl font-medium">
                    +
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-2 tracking-wide">
                  Early Research
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-6 mb-8 md:mb-12">
            {/* LEFT: Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
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
            <div className="relative w-full sm:w-[280px] md:w-[360px]">
              <input
                type="text"
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-2.5 rounded-full bg-white text-xs md:text-sm outline-none border border-[#E5E7EB]"
              />
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/40">
                <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            </div>
          </div>

          {/* Count / Meta */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="text-xs md:text-sm text-[#0D0D0D]/45">
              Showing{" "}
              <span className="font-semibold text-[#0D0D0D]">
                {filteredPublications.length}
              </span>{" "}
              {activeCategory.toLowerCase()}
            </div>
          </div>

          {/* Publications List */}
          <div className="space-y-4 md:space-y-6">
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
    </div>
  );
}
