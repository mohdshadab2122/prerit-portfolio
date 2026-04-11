import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, GraduationCap, Minus, Plus } from 'lucide-react';

interface Degree {
  title: string;
  tenure: string;
  duration: string;
  specialization: string;
  gpa: string;
  city: string;
  country: string;
  details: string[];
}

interface EducationItem {
  university: string;
  college?: string;
  logo: string;
  website: string;
  tenure: string;
  duration: string;
  summary: React.ReactNode;
  degrees: Degree[];
}

const educationData: EducationItem[] = [
  {
    university: "University of Delhi",
    college: "Delhi College of Engineering (Delhi Technological University)",
    logo: "/logos/DelhiUniversityLogo.jpg",
    website: "https://www.du.ac.in/",
    tenure: "June 2010",
    duration: "Completed",
    summary: (
      <>
        <p>
          <strong>University of Delhi</strong>, through <strong>Delhi College of Engineering (Delhi Technological University)</strong>, provided a strong academic foundation in electrical engineering, systems thinking, and technical problem-solving.
        </p>

        <p className="mt-4">
          <strong>Prerit Pramod</strong> completed his undergraduate engineering education here, building deep technical grounding in electrical systems, electric machines, and power electronics.
        </p>
      </>
    ),
    degrees: [
      {
        title: "Bachelor of Engineering",
        tenure: "June 2010",
        duration: "Completed",
        specialization: "Electric Machines, Power Electronics",
        gpa: "76.28%",
        city: "Delhi",
        country: "India",
        details: [
          "Focused on core electrical engineering fundamentals, machines, and power systems.",
          "Built foundational expertise in electrical design, analysis, and engineering principles.",
          "Developed strong academic grounding for later specialization in control systems and advanced engineering."
        ]
      }
    ]
  },
  {
    university: "University of Michigan",
    college: "N/A",
    logo: "/logos/UniversityofMichigan.jpg",
    website: "https://umich.edu/",
    tenure: "December 2012",
    duration: "Completed",
    summary: (
      <>
        <p>
          <strong>University of Michigan</strong> is a globally recognized institution known for advanced research, engineering excellence, and interdisciplinary innovation.
        </p>

        <p className="mt-4">
          <strong>Prerit Pramod</strong> pursued graduate studies here in electrical engineering systems, strengthening his expertise in control systems, signal processing, and advanced engineering analysis.
        </p>
      </>
    ),
    degrees: [
      {
        title: "Master of Science in Engineering",
        tenure: "December 2012",
        duration: "Completed",
        specialization: "Control Systems, Signal Processing",
        gpa: "8.23/9.00 (4.00/4.00)",
        city: "Ann Arbor, Michigan",
        country: "USA",
        details: [
          "Specialized in advanced control systems, signal processing, and electrical engineering systems.",
          "Strengthened analytical, mathematical, and systems-level engineering capabilities.",
          "Built academic depth that supported later work in control engineering, robotics, and advanced product development."
        ]
      }
    ]
  }
];

const DegreeNode = ({ degree, isLast }: { degree: Degree; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-10 mb-6 last:mb-0">
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-[-24px] w-[1.5px] bg-[#E5E7EB]" />
      )}

      <div className="absolute left-0 top-[2px] w-[20px] h-[20px] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0A5CE6] bg-white z-10" />
      </div>

      <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer group">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-6">
              <h4 className="text-lg font-medium text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors leading-tight">
                {degree.title}
              </h4>

              <span className="text-sm font-medium text-[#0A5CE6] uppercase">
                {degree.duration}
              </span>

              <span className="text-sm text-[#0D0D0D]/45">
                {degree.gpa}
              </span>
            </div>

            <span className="text-[10px] font-mono text-[#0D0D0D]/40 uppercase tracking-widest md:text-right">
              {degree.tenure}
            </span>
          </div>

          <div className="mt-1.5">
            <span className="text-sm font-medium text-[#0D0D0D]/60 leading-relaxed">
              {degree.specialization}
            </span>
          </div>

          <div className="text-xs text-[#0D0D0D]/40 uppercase tracking-[0.15em]">
            {degree.city}, {degree.country}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 mt-3">
                <ul className="space-y-3">
                  {degree.details.map((detail, i) => (
                    <li key={i} className="text-sm text-[#0D0D0D]/70 flex items-start gap-3 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0A5CE6]/30 mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const EducationSection = ({ item }: { item: EducationItem }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  return (
    <div className="relative">
      <div className="absolute left-0 top-8 w-6 h-6 flex items-center justify-center z-20">
        <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
          <Building2 className="w-3 h-3 text-white" />
        </div>
      </div>

      <div className="ml-12 bg-[#F4F4F5] border border-[#E5E7EB] rounded-2xl p-8">
        <div 
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="group cursor-pointer mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#0D0D0D] tracking-tight group-hover:text-[#FF6B00] transition-colors">
                  {item.university}
                </h3>

                {item.college && item.college !== "N/A" && (
                  <p className="text-sm text-[#0D0D0D]/55 mt-2">
                    {item.college}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="text-xs font-mono text-[#0D0D0D]/40 uppercase tracking-[0.2em]">
                    {item.tenure}
                  </span>
                  <span className="text-xs font-mono text-[#0D0D0D]/45 uppercase tracking-[0.2em]">
                    {item.duration}
                  </span>
                </div>
              </div>

              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-20 h-20 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center overflow-hidden shrink-0 hover:shadow-md transition-all"
              >
                <img
                  src={item.logo}
                  alt={item.university}
                  className="w-14 h-14 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSummaryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-6 border-l-4 border-[#FF6B00] bg-white rounded-r-xl">
                <div className="text-[#0D0D0D]/75 text-sm leading-relaxed font-normal">
                  {item.summary}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mt-6 pt-6 border-t border-[#E5E7EB]">
          <div className="pl-0">
            {item.degrees.map((degree, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <DegreeNode 
                  degree={degree} 
                  isLast={idx === item.degrees.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Education() {
  return (
    <div className="w-full bg-white min-h-screen py-32 px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#0D0D0D] mb-6 leading-none">
            EDUCATION
          </h1>
          <p className="text-xl md:text-2xl text-[#0D0D0D]/40 max-w-3xl leading-relaxed font-light">
            Academic milestones that shaped the engineering, systems, and research foundation behind the journey.
          </p>
        </motion.div>

        <div className="relative flex flex-col gap-12">
          <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-[#E5E7EB]" />
          {educationData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <EducationSection item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}