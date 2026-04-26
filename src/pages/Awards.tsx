import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useAppData } from "../Context/DataContext";

type Category = "Awards" | "Recognitions";

interface Item {
  category: Category;
  title: string;
  organization: string;
  year?: string;
  summary: string;
  description: string;
}

const tabs: Category[] = ["Awards", "Recognitions"];

const Card = ({ item }: { item: Item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#E5E7EB] rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 bg-[#F4F4F5] hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        <div className="flex justify-between items-start gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#0D0D0D] leading-snug">
              {item.title}
            </h3>

            <div className="mt-1.5 md:mt-2 text-xs md:text-sm text-[#0D0D0D]/50 flex flex-wrap items-center gap-1.5 md:gap-2">
              <span>{item.organization}</span>
              {item.year && (
                <>
                  <span className="opacity-40">•</span>
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

export default function Awards() {
  const { data, loading } = useAppData();
  const [active, setActive] = useState<Category>("Awards");

  const mappedData: Item[] = data
    ? [
        ...(data.awards || []).map((item: any) => ({
          category: "Awards" as Category,
          title: item.title,
          organization: item.organization,
          year: item.year,
          summary: item.summary,
          description: item.description,
        })),
        ...(data.recognitions || []).map((item: any) => ({
          category: "Recognitions" as Category,
          title: item.title,
          organization: item.organization,
          summary: item.summary,
          description: item.description,
        })),
      ]
    : [];

  const allItems = mappedData
    .filter((item) => item.title && item.title.trim() !== "")
    .slice()
    .reverse();

  const filtered = mappedData
    .filter((i) => i.category === active)
    .slice()
    .reverse();

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-white pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="pt-6 md:pt-12 pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#0D0D0D] tracking-tighter leading-none">
              AWARDS & <span className="text-[#FF6B00]">RECOGNITIONS</span>
            </h1>

            <p className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-[#0D0D0D]/50 max-w-3xl leading-relaxed font-light">
              A curated record of professional honors, industry recognition, and
              technical contributions across engineering, research, and
              innovation.
            </p>
          </motion.div>

          {/* MARQUEE */}
          <div className="mt-8 md:mt-10 mb-8 md:mb-12 marquee-wrapper">
            {/* Gradient edges */}
            <div className="absolute left-0 top-0 h-full w-12 md:w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 h-full w-12 md:w-20 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="marquee gap-3 md:gap-6">
              {[...allItems, ...allItems].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] shadow-sm whitespace-nowrap"
                >
                  <span className="text-xs md:text-sm font-medium text-[#0D0D0D] flex items-center gap-1.5 md:gap-2">
                    <span>{item.category === "Awards" ? "🏆" : "⭐"}</span>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all ${
                active === tab
                  ? "bg-black text-white"
                  : "bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="space-y-3 md:space-y-5">
          {filtered.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35 }}
            >
              <Card item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
