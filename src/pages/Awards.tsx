import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

type Category = 'Awards' | 'Recognitions';

interface Item {
  category: Category;
  title: string;
  organization: string;
  year?: string;
  summary: string;
  description: string;
  importance: number;
}

const data: Item[] = [
  // ======================
  // AWARDS (SORTED BY IMPORTANCE)
  // ======================
  {
    category: 'Awards',
    title: 'IEEE IAS Outstanding Young Professional Achievement Award',
    organization: 'IEEE Industry Applications Society',
    year: '2024',
    summary:
      'Global recognition for high-impact contributions in industrial electrical engineering.',
    description:
      'This award is conferred by the IEEE Industry Applications Society to recognize exceptional early-career engineers demonstrating significant technical contributions and leadership in industrial applications.\n\nPrerit Pramod was recognized for his impactful work in power electronics, motion control systems, and applied engineering innovation across automotive and industrial domains.',
    importance: 100,
  },
  {
    category: 'Awards',
    title: 'Melvin M. Wilcox Innovation Award',
    organization: 'Nexteer Automotive',
    year: '2020',
    summary:
      'Prestigious industry innovation award for breakthrough engineering contributions.',
    description:
      'The Melvin M. Wilcox Award (formerly Boss Kettering Award) is one of the highest innovation honors at Nexteer Automotive, recognizing engineers who create transformative product-level impact.\n\nPrerit received this award for developing novel steering system technologies that directly contributed to significant business growth and product-line revenue generation.',
    importance: 95,
  },
  {
    category: 'Awards',
    title: 'Outstanding Graduate Student Instructor',
    organization: 'University of Michigan',
    year: '2012',
    summary:
      'Academic recognition for excellence in teaching and engineering instruction.',
    description:
      'This award is presented by the University of Michigan to recognize exceptional teaching performance and student impact.\n\nPrerit was honored for delivering high-quality instruction in electrical engineering courses and contributing to strong student learning outcomes.',
    importance: 80,
  },

  // ======================
  // RECOGNITIONS (SORTED BY IMPORTANCE)
  // ======================
  {
    category: 'Recognitions',
    title: 'Innovation Hall of Fame — Platinum Tier',
    organization: 'Nexteer Automotive',
    summary:
      'Top-tier innovation recognition for sustained intellectual property contributions.',
    description:
      'Inducted into the highest tier of Nexteer’s Innovation Hall of Fame, reserved for engineers with sustained and high-impact innovation output.\n\nPrerit earned this distinction through the development of more than 50 intellectual property artifacts, contributing to advanced steering and mobility technologies.',
    importance: 100,
  },
  {
    category: 'Recognitions',
    title: 'IEEE Senior Member',
    organization: 'IEEE',
    summary:
      'Distinguished professional grade recognizing significant engineering contributions.',
    description:
      'IEEE Senior Member status is awarded to professionals with demonstrated technical expertise, professional maturity, and significant performance in the field of electrical and electronics engineering.\n\nPrerit was elevated to this grade in recognition of his sustained contributions to engineering innovation and applied systems development.',
    importance: 96,
  },
  {
    category: 'Recognitions',
    title: 'Journal Reviewer',
    organization: 'IEEE, IET, SAE, IETE',
    summary:
      'Recognition for peer review contributions to leading global engineering journals.',
    description:
      'Prerit serves as a reviewer for multiple high-impact journals including IEEE Transactions on Industrial Electronics and publications from IET, SAE, and IETE.\n\nThis role reflects deep technical expertise and trust within the global engineering research community.',
    importance: 90,
  },
  {
    category: 'Recognitions',
    title: 'Conference Reviewer',
    organization: 'IEEE, SAE',
    summary:
      'Technical reviewer for international engineering conferences.',
    description:
      'Actively contributes to the evaluation of research papers for international conferences organized under IEEE and SAE.\n\nThis role supports quality control and technical rigor in global engineering knowledge dissemination.',
    importance: 88,
  },
  {
    category: 'Recognitions',
    title: 'Conference Organizer',
    organization: 'IEEE',
    summary:
      'Leadership role in organizing and managing global technical conferences.',
    description:
      'Participated in organizing international engineering conferences, including responsibilities as session chair, topic lead, and organizing committee member.\n\nContributed to the structure and execution of global technical events.',
    importance: 84,
  },
  {
    category: 'Recognitions',
    title: 'Awards Committee Member',
    organization: 'IEEE IAS',
    summary:
      'Peer evaluation role in professional award selection processes.',
    description:
      'Served as a reviewer for IEEE Industry Applications Society award nominations.\n\nThis role reflects recognition as a trusted evaluator within the engineering community.',
    importance: 82,
  },
  {
    category: 'Recognitions',
    title: 'Doctoral Adviser',
    organization: 'North Carolina State University',
    summary:
      'Academic advisory role supporting doctoral research in advanced electrical machine systems.',
    description:
      'Served as a committee member and advisor for engineering doctoral (Ph.D.) students at North Carolina State University.\n\nThis included advising Siddharth Mehta, whose thesis titled "Design, Modeling, and Control of Doubly Salient Reluctance Machines" was defended in August 2020, and Krishna Namburi, whose research focuses on "Characterization and Control of Biaxial Excitation Machines," with defense targeted in 2025.',
    importance: 81,
  },
  {
    category: 'Recognitions',
    title: 'Industrial Advisory Board Member',
    organization: 'Saginaw Valley State University',
    summary:
      'Industry-academia collaboration role in engineering education.',
    description:
      'Contributed as a member of the industrial advisory board, helping shape engineering curriculum and academic programs.\n\nSupported alignment between academic training and industry needs.',
    importance: 80,
  },
  {
    category: 'Recognitions',
    title: 'Young Professional Advisory Board Member',
    organization: 'SAE',
    summary:
      'Mentorship and leadership role for early-career engineers.',
    description:
      'Served on the SAE Young Professional Advisory Board and contributed to initiatives such as MobilityRxiv.\n\nFocused on supporting young engineers and advancing knowledge-sharing platforms.',
    importance: 78,
  },
];

const tabs: Category[] = ['Awards', 'Recognitions'];

const Card = ({ item }: { item: Item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#E5E7EB] rounded-3xl p-7 md:p-8 bg-white hover:shadow-sm transition">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[#0D0D0D]">
              {item.title}
            </h3>

            <div className="mt-2 text-sm text-[#0D0D0D]/50">
              {item.organization}
              {item.year && <> • {item.year}</>}
            </div>

            <p className="mt-3 text-sm text-[#0D0D0D]/65">
              {item.summary}
            </p>
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
              animate={{ height: 'auto', opacity: 1 }}
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
  const [active, setActive] = useState<Category>('Awards');

  const filtered = data
    .filter((i) => i.category === active)
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="w-full min-h-screen bg-white py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-[#0D0D0D]">
            AWARDS & <span className="text-[#FF6B00]">RECOGNITIONS</span>
          </h1>

          <p className="mt-4 text-xl text-[#0D0D0D]/50 max-w-3xl">
            A curated record of professional honors, industry recognition, and technical contributions across engineering, research, and innovation.
          </p>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                active === tab
                  ? 'bg-black text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="space-y-5">
          {filtered.map((item, i) => (
            <Card key={i} item={item} />
          ))}
        </div>

      </div>
    </div>
  );
}