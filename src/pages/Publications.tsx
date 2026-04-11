import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, FileText, BookOpen, ChevronDown, Search } from 'lucide-react';

type PublicationCategory = 'Conferences' | 'Journals' | 'Preprints';

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

const publications: Publication[] = [
  // =========================
  // CONFERENCES
  // =========================
  {
    category: 'Conferences',
    title: 'Extended Model of Interior Permanent Magnet Synchronous Motors to Include Harmonics in d- and q- Axes Flux Linkages',
    year: '2015',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/7309922'
  },
  {
    category: 'Conferences',
    title: 'Modeling and Experimental Verification of Torque Transients in Interior Permanent Magnet Synchronous Motors by Including Harmonics in d- and q- Axes Flux Linkages',
    year: '2015',
    organization: 'IEEE',
    venue: 'IEMDC',
    externalLink: 'https://ieeexplore.ieee.org/document/7409090'
  },
  {
    category: 'Conferences',
    title: 'Impact of Parameter Estimation Errors on Feedforward Current Control of Permanent Magnet Synchronous Motors',
    year: '2016',
    organization: 'IEEE',
    venue: 'ITEC',
    externalLink: 'https://ieeexplore.ieee.org/document/7520290'
  },
  {
    category: 'Conferences',
    title: 'Vibration and Torque Ripple Reduction of Switched Reluctance Motors Through Current Profile Optimization',
    year: '2016',
    organization: 'IEEE',
    venue: 'APEC',
    externalLink: 'https://ieeexplore.ieee.org/document/7468336'
  },
  {
    category: 'Conferences',
    title: 'Comparison of Switching Techniques under Inverter Switch Short Circuit Fault',
    year: '2016',
    organization: 'IEEE',
    venue: 'ICEMS',
    externalLink: 'https://ieeexplore.ieee.org/document/7837372'
  },
  {
    category: 'Conferences',
    title: 'Performance Analysis of Surface Permanent Magnet Synchronous Machine Topologies with Dual-Wound Stators',
    year: '2017',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/8096963'
  },
  {
    category: 'Conferences',
    title: 'Investigation of Torque Ripple in Switched Reluctance Machines with Errors in Current and Position Sensing',
    year: '2017',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/8095859'
  },
  {
    category: 'Conferences',
    title: 'Effects of Position Sensing Dynamics on Feedforward Current Control of Permanent Magnet Synchronous Machines',
    year: '2017',
    organization: 'IEEE',
    venue: 'IEMDC',
    externalLink: 'https://ieeexplore.ieee.org/document/8002221'
  },
  {
    category: 'Conferences',
    title: 'Drive Response Modeling of Dual Wound Surface Permanent Magnet Machines',
    year: '2017',
    organization: 'IEEE',
    venue: 'IEMDC',
    externalLink: 'https://ieeexplore.ieee.org/document/8002394'
  },
  {
    category: 'Conferences',
    title: 'Effects of Position Sensing Dynamics on Feedback Current Control of Permanent Magnet Synchronous Machines',
    year: '2018',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/8557672'
  },
  {
    category: 'Conferences',
    title: 'Predictive Current Control of Mutually Coupled Switched Reluctance Motors Using Net Flux Method',
    year: '2019',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/8912690'
  },
  {
    category: 'Conferences',
    title: 'Small Signal Model of Mutually Coupled Switched Reluctance Motors Based on Net Flux Method',
    year: '2019',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/8912290'
  },
  {
    category: 'Conferences',
    title: 'Closed-loop Current Control of Synchronous Motor Drives with Position Sensing Harmonics',
    year: '2019',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/8912674'
  },
  {
    category: 'Conferences',
    title: 'Resistance Imbalance in Feedforward Current Controlled Synchronous Motor Drives',
    year: '2019',
    organization: 'IEEE',
    venue: 'ITEC',
    externalLink: 'https://ieeexplore.ieee.org/document/8790541'
  },
  {
    category: 'Conferences',
    title: 'Analysis of Dynamic Current Control Techniques for Switched Reluctance Motor Drives for High Performance Applications',
    year: '2019',
    organization: 'IEEE',
    venue: 'ITEC',
    externalLink: 'https://ieeexplore.ieee.org/document/8790571'
  },
  {
    category: 'Conferences',
    title: 'Position Sensing Induced Parasitic Torques in Permanent Magnet Synchronous Motor Drives',
    year: '2019',
    organization: 'IEEE',
    venue: 'IEMDC',
    externalLink: 'https://ieeexplore.ieee.org/document/8785401'
  },
  {
    category: 'Conferences',
    title: 'Modeling, Analysis and Compensation of Resistance Imbalance in Permanent Magnet Synchronous Motor Drives for Mass Manufacturing Applications',
    year: '2019',
    organization: 'IEEE',
    venue: 'IEMDC',
    externalLink: 'https://ieeexplore.ieee.org/document/8785260'
  },
  {
    category: 'Conferences',
    title: 'Modeling and Simulation of Switched Reluctance Machines for Control and Estimation Tasks',
    year: '2019',
    organization: 'IEEE',
    venue: 'IEMDC',
    externalLink: 'https://ieeexplore.ieee.org/document/8785081'
  },
  {
    category: 'Conferences',
    title: 'Synchronous Frame Current Estimation Inaccuracies in Permanent Magnet Synchronous Motor Drives',
    year: '2020',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/9235446'
  },
  {
    category: 'Conferences',
    title: 'Analysis of Different Operating Modes of PMSM during Regeneration with Uncontrolled Rectifier',
    year: '2020',
    organization: 'IEEE',
    venue: 'ITEC',
    externalLink: 'https://ieeexplore.ieee.org/document/9161538'
  },
  {
    category: 'Conferences',
    title: 'Performance Analysis of PMSM during Regeneration fed by Dual-Inverter System',
    year: '2021',
    organization: 'IEEE',
    venue: 'APEC',
    externalLink: 'https://ieeexplore.ieee.org/document/9487450'
  },
  {
    category: 'Conferences',
    title: 'Impact of Electric Motor Drive Dynamics on Performance and Stability of Electric Power Steering Systems',
    year: '2021',
    organization: 'SAE',
    venue: 'WCX',
    externalLink: 'https://www.sae.org/papers/impact-electric-motor-drive-dynamics-performance-stability-electric-power-steering-systems-2021-01-0932'
  },
  {
    category: 'Conferences',
    title: 'Modeling Rack Force for Steering Manoeuvres in a Stationary Vehicle',
    year: '2021',
    organization: 'SAE',
    venue: 'BRAKE',
    externalLink: 'https://www.sae.org/papers/modeling-rack-force-steering-maneuvers-a-stationary-vehicle-2021-01-1287'
  },
  {
    category: 'Conferences',
    title: 'Modeling, Characterization, and Identification of Permanent Magnet DC Motors',
    year: '2023',
    organization: 'IEEE',
    venue: 'IEMDC',
    externalLink: 'https://ieeexplore.ieee.org/document/10238912'
  },
  {
    category: 'Conferences',
    title: 'Robust Current Regulator Design for Switched Reluctance Machines with Two Degree-of-Freedom Architecture',
    year: '2024',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/11301599'
  },
  {
    category: 'Conferences',
    title: 'Dynamic Current Control of Biaxial Excitation Synchronous Machines',
    year: '2024',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/10861289'
  },
  {
    category: 'Conferences',
    title: 'Ramp Tracking Dynamic Current Regulator Design for Switched Reluctance Machines',
    year: '2024',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/10860838'
  },
  {
    category: 'Conferences',
    title: 'Design, Analysis, and Implementation of Robust Two Degree of Freedom Current Regulator for Switched Reluctance Machines',
    year: '2024',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/10861839'
  },
  {
    category: 'Conferences',
    title: 'Hybrid Current Control of Rear-Earth Free Bi-Axial Excitation Synchronous Machine',
    year: '2024',
    organization: 'IEEE',
    venue: 'ITEC',
    externalLink: 'https://ieeexplore.ieee.org/document/10599021'
  },
  {
    category: 'Conferences',
    title: 'Active Torque Capability Determination Under Unity Power Factor Operation of Biaxial Excitation Synchronous Machines',
    year: '2025',
    organization: 'IEEE',
    venue: 'IEMDC',
    externalLink: 'https://ieeexplore.ieee.org/document/11060956'
  },
  {
    category: 'Conferences',
    title: 'Optimal Current Command Determination Under Unity Power Factor Operation of Biaxial Excitation Synchronous Machines',
    year: '2025',
    organization: 'IEEE',
    venue: 'ITEC',
    externalLink: 'https://ieeexplore.ieee.org/document/11097995'
  },
  {
    category: 'Conferences',
    title: 'Active Torque Capability Determination Under Varying Power Factor Operation of Biaxial Excitation Synchronous Machines',
    year: '2025',
    organization: 'IEEE',
    venue: 'ECCE',
    externalLink: 'https://ieeexplore.ieee.org/document/11259670'
  },

    // =========================
  // JOURNALS (UPDATED)
  // =========================
  {
    category: 'Journals',
    title: 'Detection of Power Quality Events Using Demodulation Concepts: A Case Study',
    year: '2012',
    organization: 'WAU',
    venue: 'IJNS',
  },
  {
    category: 'Journals',
    title: 'Modeling of Mutually Coupled Switched Reluctance Motors Based on Net Flux Method',
    year: '2020',
    organization: 'IEEE',
    venue: 'IAS',
    externalLink: 'https://ieeexplore.ieee.org/document/8967124'
  },
  {
    category: 'Journals',
    title: 'Small Signal Modeling of Mutually Coupled Switched Reluctance Machines',
    year: '2020',
    organization: 'IEEE',
    venue: 'IAS',
    externalLink: 'https://ieeexplore.ieee.org/document/9222031'
  },
  {
    category: 'Journals',
    title: 'Segmented Rotor Mutually Coupled Switched Reluctance Machine for Low Torque Ripple Applications',
    year: '2021',
    organization: 'IEEE',
    venue: 'IAS',
    externalLink: 'https://ieeexplore.ieee.org/document/9404855'
  },
  // =========================
  // PREPRINTS (UPDATED)
  // =========================
  {
    category: 'Preprints',
    title: 'Control Performance Analysis of Power Steering System Electromechanical Dynamics',
    year: '2023',
    date: '2023-09-24',
    organization: 'arXiv',
    venue: 'arXiv',
    platform: 'arXiv',
    externalLink: 'https://arxiv.org/abs/2309.13623'
  },
  {
    category: 'Preprints',
    title: 'Analytical Modeling of Parameter Imbalance in Permanent Magnet Synchronous Machines',
    year: '2023',
    date: '2023-09-30',
    organization: 'arXiv',
    venue: 'arXiv',
    platform: 'arXiv',
    externalLink: 'https://arxiv.org/abs/2310.00508'
  },
  {
    category: 'Preprints',
    title: 'Performance Analysis of Synchronous Motor Drives under Concurrent Errors in Position and Current Sensing',
    year: '2023',
    date: '2023-10-02',
    organization: 'arXiv',
    venue: 'arXiv',
    platform: 'arXiv',
    externalLink: 'https://arxiv.org/abs/2310.00975'
  },
  {
    category: 'Preprints',
    title: 'Position Sensing Errors in Synchronous Motor Drives',
    year: '2023',
    date: '2023-10-02',
    organization: 'arXiv',
    venue: 'arXiv',
    platform: 'arXiv',
    externalLink: 'https://arxiv.org/abs/2310.00977'
  },
  {
    category: 'Preprints',
    title: 'Inverter Pulse Width Modulation Control Techniques for Electric Motor Drive Systems',
    year: '2023',
    date: '2023-10-05',
    organization: 'arXiv',
    venue: 'arXiv',
    platform: 'arXiv',
    externalLink: 'https://arxiv.org/abs/2310.03362'
  },
  {
    category: 'Preprints',
    title: 'Circulating Current Induced Electromagnetic Torque Generation in Electric Machines with Delta Windings',
    year: '2023',
    date: '2023-10-10',
    organization: 'arXiv',
    venue: 'arXiv',
    platform: 'arXiv',
    externalLink: 'https://arxiv.org/abs/2310.06469'
  },
];

const categories: PublicationCategory[] = ['Conferences', 'Journals', 'Preprints'];

const PublicationCard = ({ publication }: { publication: Publication }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#F4F4F5] border border-[#E5E7EB] rounded-2xl p-6 md:p-7">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer group"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors leading-snug">
              {publication.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-[#0D0D0D]/55">
              <span className="font-medium">{publication.organization}</span>
              <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
              <span>{publication.venue}</span>
              <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
              <span>{publication.year}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">


            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-[#0D0D0D]/40"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-[#E5E7EB] grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0D0D0D]/35 mb-1">
                      Organization
                    </p>
                    <p className="text-sm text-[#0D0D0D]/75">{publication.organization}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0D0D0D]/35 mb-1">
                      Venue / Division / Platform
                    </p>
                    <p className="text-sm text-[#0D0D0D]/75">
                      {publication.platform || publication.venue}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0D0D0D]/35 mb-1">
                      Publication Year
                    </p>
                    <p className="text-sm text-[#0D0D0D]/75">{publication.year}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {publication.date && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0D0D0D]/35 mb-1">
                        Date
                      </p>
                      <p className="text-sm text-[#0D0D0D]/75">{publication.date}</p>
                    </div>
                  )}

                  {publication.tags && publication.tags.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#0D0D0D]/35 mb-2">
                        Research Areas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {publication.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs text-[#0D0D0D]/65"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {publication.externalLink && (
                      <a
                        href={publication.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D0D0D] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Open Publication
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {publication.pdfLink && (
                      <a
                        href={publication.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-[#0D0D0D]"
                      >
                        PDF
                        <FileText className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function Publications() {
  const [activeCategory, setActiveCategory] = useState<PublicationCategory>('Conferences');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPublications = publications
  .filter((publication) => publication.category === activeCategory)
  .filter((publication) => {
    const query = searchQuery.toLowerCase();

    return (
      publication.title.toLowerCase().includes(query) ||
      publication.organization.toLowerCase().includes(query) ||
      publication.venue.toLowerCase().includes(query) ||
      (publication.tags &&
        publication.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        ))
    );
  })
  .sort((a, b) => {
    if (Number(b.year) !== Number(a.year)) {
      return Number(b.year) - Number(a.year);
    }

    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    return 0;
  });

  return (
    <div className="w-full bg-white min-h-screen py-32 px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#0D0D0D] mb-6 leading-none">
            PUBLICATIONS
          </h1>
          <p className="text-xl md:text-2xl text-[#0D0D0D]/40 max-w-4xl leading-relaxed font-light">
            A structured archive of conference papers, journal publications, and preprints across electric machines, control systems, motion control, sensing, and advanced drive systems.
          </p>
        </motion.div>

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
                    ? 'bg-black text-white'
                    : ':bg-white border border-[#E5E7EB] text-[#0D0D0D]/70 hover:bg-[#F9F9F9]'
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
            Showing <span className="font-semibold text-[#0D0D0D]">{filteredPublications.length}</span>{' '}
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
        <div className="space-y-5">
          {filteredPublications.map((publication, index) => (
            <motion.div
              key={`${publication.title}-${publication.year}-${index}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
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