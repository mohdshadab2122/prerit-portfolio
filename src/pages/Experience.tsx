import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Building2, Briefcase, Minus, Plus } from 'lucide-react';

interface Role {
  title: string;
  type: string;
  tenure: string;
  duration: string;
  dept: string;
  details: string[];
}

interface Company {
  name: string;
  logo: string;
  website: string;
  tenure: string;
  duration: string;
  summary: React.ReactNode;
  roles: Role[];
}

const companies: Company[] = [
  {
    name: "Inspired Innovation LLC",
    logo: "/logos/InspiredInnovation.png",
    website: "https://inspiredinnovation.in/",
    tenure: "August 2025 – Present",
    duration: "8 mos",
    summary: (
      <>
        <p>
          <strong>Inspired Innovation LLC</strong> is an engineering-led innovation and technology consulting venture focused on advanced product development, research-driven engineering services, control systems, robotics, electric mobility, and intellectual property creation.
        </p>

        <p className="mt-4">
          <strong>Prerit Pramod</strong> leads the strategic and technical direction of the organization as Founder & Chief Executive Officer, building innovation programs, defining engineering solutions, and shaping multidisciplinary technical initiatives across emerging technology domains.
        </p>
      </>
    ),
    roles: [
      {
        title: "Founder & Chief Executive Officer",
        type: "Full Time",
        tenure: "August 2025 – Present",
        duration: "8 mos",
        dept: "Engineering Services & Technology Consulting",
        details: [
          "Established a global engineering consulting and innovation-led technology business.",
          "Built technical programs across electric mobility, control systems, robotics, and product strategy.",
          "Led cross-disciplinary research, engineering feasibility, and commercialization planning.",
          "Directed innovation strategy and technical execution across advanced domains."
        ]
      }
    ]
  },
  {
    name: "MicroVision, Inc.",
    logo: "/logos/Microvision.png",
    website: "https://microvision.com/",
    tenure: "February 2025 – July 2025",
    duration: "2 yrs 6 mos",
    summary: (
      <>
        <p>
          <strong>MicroVision, Inc.</strong> is a technology company known for advanced sensing, intelligent systems, and engineering-led product development in high-performance technology environments.
        </p>

        <p className="mt-4">
          <strong>Prerit Pramod</strong> contributed across engineering leadership roles in control systems, systems engineering, and software-focused development, supporting architecture, execution, and technical coordination for advanced engineering programs.
        </p>
      </>
    ),
    roles: [
      {
        title: "Associate Director",
        type: "Full Time",
        tenure: "April 2025 – July 2025",
        duration: "4 mos",
        dept: "Control Systems, Systems & Software Engineering",
        details: [
          "Led systems and control engineering efforts across software and embedded product programs.",
          "Supported technical architecture, systems integration, and engineering coordination.",
          "Contributed to system-level execution and engineering maturity for advanced technology programs."
        ]
      },
      {
        title: "Engineering Manager",
        type: "Full Time",
        tenure: "February 2023 – April 2025",
        duration: "2 yrs 3 mos",
        dept: "Control Systems, Digital Design Engineering",
        details: [
          "Managed engineering execution for control systems and digital design activities.",
          "Helped coordinate cross-functional engineering tasks and structured development workflows.",
          "Supported technical implementation and systems-oriented engineering delivery."
        ]
      }
    ]
  },
  {
    name: "Nexteer Automotive Corporation",
    logo: "/logos/Nexteer.jpg",
    website: "https://www.nexteer.com/",
    tenure: "February 2013 – February 2023",
    duration: "10 yrs",
    summary: (
      <>
        <p>
          <strong>Nexteer Automotive Corporation</strong> is a global automotive technology company specializing in motion control, steering systems, electric motor technologies, sensing, embedded systems, and advanced mobility solutions.
        </p>

        <p className="mt-4">
          <strong>Prerit Pramod</strong> progressed through multiple engineering and leadership roles over a decade, contributing to control systems, electric motor drives, sensing technologies, advanced engineering programs, and future-focused mobility innovation initiatives.
        </p>
      </>
    ),
    roles: [
      {
        title: "Engineering Manager",
        type: "Full Time",
        tenure: "April 2020 – February 2023",
        duration: "2 yrs 11 mos",
        dept: "Motion Control Systems & Software, Advanced Engineering",
        details: [
          "Led control systems engineering team responsible for real-time embedded algorithms and advanced transportation applications.",
          "Defined system-level control and algorithmic architecture across multi-domain engineering problems.",
          "Helped shape commercialization roadmap for autonomous and advanced vehicle technologies.",
          "Collaborated across teams to ensure system safety, requirements integrity, and technical feasibility."
        ]
      },
      {
        title: "Senior Engineering Supervisor",
        type: "Full Time",
        tenure: "January 2017 – March 2020",
        duration: "3 yrs 3 mos",
        dept: "Electric Motor Drives, Research & Development",
        details: [
          "Established and led electric motor drives research and development efforts.",
          "Built globally distributed engineering capability across technical domains and geographies.",
          "Managed technical leadership, hiring, mentoring, personnel supervision, and strategic engineering planning.",
          "Directed product innovation and advanced motion control development initiatives."
        ]
      },
      {
        title: "Team Leader",
        type: "Full Time",
        tenure: "July 2016 – December 2016",
        duration: "6 mos",
        dept: "Motion Control & Sensing, Core Product Engineering",
        details: [
          "Led technical execution across motion control and sensing engineering activities.",
          "Supported engineering planning and product development coordination.",
          "Contributed to system-level product engineering initiatives."
        ]
      },
      {
        title: "Systems Engineer",
        type: "Full Time",
        tenure: "April 2014 – June 2016",
        duration: "2 yrs 3 mos",
        dept: "Motion Control & Sensing, Core Product Engineering",
        details: [
          "Worked on system design, validation, and development of motion control and sensing functions.",
          "Supported model-based design and embedded systems engineering workflows.",
          "Contributed to architecture and technical development activities."
        ]
      },
      {
        title: "Applications Engineer",
        type: "Full Time",
        tenure: "February 2013 – March 2014",
        duration: "1 yr 2 mos",
        dept: "Motion Control & Sensing, Applications Product Engineering",
        details: [
          "Supported application engineering for motion control and sensing products.",
          "Worked on validation, calibration, and deployment-related technical tasks.",
          "Assisted product engineering and technical support functions."
        ]
      },
      {
        title: "Engineering Intern",
        type: "Internship",
        tenure: "May 2012 – August 2012",
        duration: "4 mos",
        dept: "Motion Control & Sensing, Applications Product Engineering",
        details: [
          "Supported technical analysis, testing, and engineering validation work.",
          "Contributed to early-stage automotive product engineering tasks.",
          "Built foundational experience in motion control systems."
        ]
      }
    ]
  },
  {
    name: "University of Michigan",
    logo: "/logos/UniversityofMichigan.jpg",
    website: "https://umich.edu/",
    tenure: "September 2012 – December 2012",
    duration: "4 mos",
    summary: (
      <>
        <p>
          <strong>University of Michigan</strong> is a globally recognized academic and research institution with strong leadership in engineering, technology, and scientific education.
        </p>

        <p className="mt-4">
          <strong>Prerit Pramod</strong> supported undergraduate engineering education in electrical circuits and systems, contributing to technical learning, academic guidance, and engineering fundamentals development.
        </p>
      </>
    ),
    roles: [
      {
        title: "Graduate Student Instructor",
        type: "Academic",
        tenure: "September 2012 – December 2012",
        duration: "4 mos",
        dept: "Electrical Engineering & Computer Science Department",
        details: [
          "Taught undergraduate content in electrical circuits, systems, and engineering applications.",
          "Helped students understand engineering fundamentals through structured instruction.",
          "Supported academic delivery and technical learning."
        ]
      }
    ]
  },
  {
    name: "Indian Oil Corporation Limited",
    logo: "/logos/IndianOil.jpg",
    website: "https://iocl.com/",
    tenure: "September 2010 – August 2011",
    duration: "1 yr",
    summary: (
      <>
        <p>
          <strong>Indian Oil Corporation Limited</strong> is one of India’s largest integrated energy companies, operating across refining, petroleum products, supply chain systems, and industrial operations.
        </p>

        <p className="mt-4">
          <strong>Prerit Pramod</strong> worked within refinery and marketing-linked technical workflows, supporting operational execution, quality control, and process-oriented industrial systems exposure.
        </p>
      </>
    ),
    roles: [
      {
        title: "Operations Officer",
        type: "Full Time",
        tenure: "September 2010 – August 2011",
        duration: "1 yr",
        dept: "Petroleum Refinery Marketing Division",
        details: [
          "Supervised technical and operations personnel in refinery-related workflows.",
          "Supported quality control and supply chain operations.",
          "Gained industrial systems and process engineering experience."
        ]
      }
    ]
  }
];

const RoleNode = ({ role, isLast }: { role: Role; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-10 mb-5 last:mb-0">
      {/* Level 2: Role Thread Line */}
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-[-25px] w-[1.5px] bg-[#E5E7EB]" />
      )}
      
      {/* Role Node Marker */}
      <div className="absolute left-0 top-[2px] w-[20px] h-[20px] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0A5CE6] bg-white z-10" />
      </div>

      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer group"
      >
        <div className="flex flex-col gap-3">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-6">
              <h4 className="text-lg font-medium text-[#0D0D0D] group-hover:text-[#0A5CE6] transition-colors leading-tight">
                {role.title}
              </h4>

              <span className="text-sm font-medium text-[#0A5CE6] uppercase">
                {role.type}
              </span>

              <span className="text-sm text-[#0D0D0D]/45">
                {role.duration}
              </span>
            </div>

            <span className="text-[10px] font-mono text-[#0D0D0D]/40 uppercase tracking-widest md:text-right">
              {role.tenure}
            </span>
          </div>

          {/* Department */}
          <div className="mt-1.5">
            <span className="text-sm font-medium text-[#0D0D0D]/60 leading-relaxed">
              {role.dept.split(',')[0]}
              {role.dept.includes(',') && (
                <>
                  {','}{' '}
                  <span className="italic text-[#0D0D0D]/55">
                    {role.dept.split(',').slice(1).join(',').trim()}
                  </span>
                </>
              )}
            </span>
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
                  {role.details.map((detail, i) => (
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

const CompanySection = ({ company, isLast }: { company: Company; isLast: boolean }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Level 1: Main Company Thread Line */}
      

      {/* Company Node Marker */}
      <div className="absolute left-0 top-8 w-6 h-6 flex items-center justify-center z-20">
        <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
          <Building2 className="w-3 h-3 text-white" />
        </div>
      </div>

      <div className="ml-12 bg-[#F4F4F5] border border-[#E5E7EB] rounded-2xl p-8">
        {/* Company Header */}
        <div 
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="group cursor-pointer mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left Side */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#0D0D0D] tracking-tight group-hover:text-[#FF6B00] transition-colors">
                  {company.name}
                </h3>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="text-xs font-mono text-[#0D0D0D]/40 uppercase tracking-[0.2em]">
                    {company.tenure}
                  </span>
                  <span className="text-xs font-mono text-[#0D0D0D]/45 uppercase tracking-[0.2em]">
                    {company.duration}
                  </span>
                </div>
              </div>

              {/* Right Side Clickable Logo */}
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-20 h-20 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center overflow-hidden shrink-0 hover:shadow-md transition-all"
              >
                <img
                  src={company.logo}
                  alt={company.name}
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
                  {company.summary}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level 2: Role Thread */}
        <div className="relative mt-6 pt-6 border-t border-[#E5E7EB]">
          <div className="pl-0">
            {company.roles.map((role, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <RoleNode 
                  role={role} 
                  isLast={idx === company.roles.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Experience() {
  return (
    <div className="w-full bg-white min-h-screen py-32 px-6 font-sans selection:bg-[#0A5CE6]/10 selection:text-[#0A5CE6]">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#0D0D0D] mb-6 leading-none">
            EXPERIENCE
          </h1>
          <p className="text-xl md:text-2xl text-[#0D0D0D]/40 max-w-3xl leading-relaxed font-light">
            A visual map of engineering leadership, research, and product innovation across two levels of progression.
          </p>
        </motion.div>

        {/* Timeline Section */}
        {/* Timeline Section */}
        <div className="relative flex flex-col gap-12">
          <div className="absolute left-[11px] top-8 bottom-54 w-[2px] bg-[#E5E7EB]" />
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <CompanySection 
                company={company} 
                isLast={index === companies.length - 1}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
