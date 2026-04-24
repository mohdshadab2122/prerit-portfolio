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
    <div className="border border-[#E5E7EB] rounded-3xl p-7 md:p-8 bg-[#F4F4F5] hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[#0D0D0D]">
              {item.title}
            </h3>

            <div className="mt-2 text-sm text-[#0D0D0D]/50 flex items-center gap-2">
              <span>{item.organization}</span>
              {item.year && (
                <>
                  <span className="opacity-40">•</span>
                  <span>{item.year}</span>
                </>
              )}
            </div>

            <p className="mt-3 text-sm text-[#0D0D0D]/65">{item.summary}</p>
          </div>

          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-[#0D0D0D]/40"
          >
            <ChevronDown className="w-5 h-5" />
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
              <div className="mt-5 pt-5 border-t border-[#E5E7EB]">
                <p className="text-sm text-[#0D0D0D]/70 leading-relaxed whitespace-pre-line">
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
        // AWARDS
        ...(data.awards || []).map((item: any) => ({
          category: "Awards" as Category,
          title: item.title,
          organization: item.organization,
          year: item.year,
          summary: item.summary,
          description: item.description,
        })),

        // RECOGNITIONS
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
    <div className="w-full min-h-screen bg-white py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-[#0D0D0D]">
            AWARDS & <span className="text-[#FF6B00]">RECOGNITIONS</span>
          </h1>

          <p className="mt-4 text-xl text-[#0D0D0D]/50 max-w-3xl">
            A curated record of professional honors, industry recognition, and
            technical contributions across engineering, research, and
            innovation.
          </p>

          <div className="mt-10 mb-12 marquee-wrapper">
            {/* Gradient edges */}
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="marquee gap-6">
              {[...allItems, ...allItems].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] shadow-sm whitespace-nowrap"
                >
                  <span className="text-sm font-medium text-[#0D0D0D] flex items-center gap-2">
                    <span>{item.category === "Awards" ? "🏆" : "⭐"}</span>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
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
        <div className="space-y-5">
          {filtered.map((item, i) => (
            <Card key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
