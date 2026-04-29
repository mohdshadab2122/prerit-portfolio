import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  ExternalLink,
  FileText,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../Context/DataContext";

/*
 * Home page
 *
 * This page is a composed landing/dashboard view. It reads already formatted
 * portfolio data from DataContext, selects the most relevant records for each
 * section, and renders the same visual language used across the portfolio.
 */

// Shape of the first item in data.home.
interface HomeProfile {
  name?: string;
  tags?: string[];
  domain?: string;
  shortBio?: string;
  achievements?: string;
  links?: {
    linkedin?: string;
    scholar?: string;
    patents?: string;
  };
  cards?: string[];
  photo?: string;
}

// Small summary shapes used by the preview sections on the home page.
interface ExperienceSummary {
  period?: string;
  role?: string;
  company?: string;
  roleDesc?: string;
}

interface EducationSummary {
  year?: string;
  degree?: string;
  major?: string;
  specialization?: string;
  institution?: string;
  university?: string;
  college?: string;
  degreeDesc?: string;
}

type PublicationCategory = "Conferences" | "Journals" | "Preprints";

interface PublicationSummary {
  category?: PublicationCategory;
  year?: string;
  date?: string;
  title?: string;
  organization?: string;
  event?: string;
  platform?: string;
}

interface AwardSummary {
  year?: string;
  title?: string;
  institution?: string;
  organization?: string;
  description?: string;
}

const FALLBACK_IMAGE = "/fallback.png";
const MAX_FEATURED_ITEMS = 3;

// Executive summary cards can be 1, 2, or 3 columns depending on the sheet data.
const CARD_GRID_BY_COUNT: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
};

// Shared class tokens keep repeated summary cards visually consistent.
const CARD_LABEL =
  "text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B00] mb-3 md:mb-4";
const CARD_TITLE =
  "text-base md:text-lg font-bold text-[#0D0D0D] leading-snug mb-1.5";
const CARD_SUBTITLE = "text-sm text-[#0D0D0D]/55 font-medium";
const BULLET_DOT = "w-1.5 h-1.5 bg-[#0A5CE6]/40 rounded-full mt-2 shrink-0";
const BODY_TEXT = "text-sm text-[#0D0D0D]/70 leading-relaxed";
const MAX_HOME_BULLETS = 2;
const MAX_BULLET_LENGTH = 120;

// Converts a Google Drive share link into an embeddable image URL.
const getDriveImage = (link?: string) => {
  if (!link) return null;

  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;

  return `https://lh3.googleusercontent.com/d/${match[1]}`;
};

const getProfileImage = (photo?: string) =>
  getDriveImage(photo) || FALLBACK_IMAGE;

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;

  const trimmed = value.slice(0, maxLength).trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}...`;
};

// Keeps very long names from overflowing the hero layout.
const getNameFontSizeClass = (name: string) => {
  if (name.length >= 20) {
    return "text-4xl sm:text-5xl md:text-[50px] lg:text-[60px]";
  }

  if (name.length >= 14) {
    return "text-5xl sm:text-6xl md:text-[65px] lg:text-[85px]";
  }

  return "text-5xl sm:text-7xl md:text-[80px] lg:text-[100px]";
};

const splitLines = (value?: string) =>
  (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

// Home cards intentionally show the newest items by reversing the incoming
// array, matching the original page behavior.
const getLatestItems = <T,>(items: T[], count: number) =>
  items.slice().reverse().slice(0, count);

const getCompanyKey = (company?: string) =>
  (company || "").trim().toLowerCase();

// Home cards link to matching anchors on the full pages. Keeping slug creation
// centralized prevents broken deep links when labels contain spaces or symbols.
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

const buildAnchorLink = (
  path: string,
  prefix: string,
  value?: string,
  search = "",
) => `${path}${search}#${buildAnchorId(prefix, value)}`;

const getPublicationSearch = (category?: PublicationCategory) =>
  category ? `?category=${encodeURIComponent(category)}` : "";

/*
 * The Home experience preview should represent the latest companies, not just
 * the latest rows. The sheet can contain multiple roles for one company, so we
 * walk newest-to-oldest and keep only the first role we see for each company.
 */
const getLatestExperiencesByCompany = (
  experiences: ExperienceSummary[],
  count: number,
) => {
  const selectedCompanies = new Set<string>();
  const latestCompanyExperiences: ExperienceSummary[] = [];

  experiences
    .slice()
    .reverse()
    .forEach((experience) => {
      const companyKey = getCompanyKey(experience.company);
      if (!companyKey || selectedCompanies.has(companyKey)) return;

      selectedCompanies.add(companyKey);
      latestCompanyExperiences.push(experience);
    });

  return latestCompanyExperiences.slice(0, count);
};

const getCardGridClass = (cards: string[]) =>
  CARD_GRID_BY_COUNT[cards.length] ||
  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

// The API currently stores each executive card as a single text block where the
// first line is the heading and the remaining lines are body copy.
const parseExecutiveCard = (card: string) => {
  const [title, ...contentLines] = card.split("\n");
  return {
    title,
    content: contentLines.join("\n"),
  };
};

const getEducationMajor = (education: EducationSummary) =>
  education.major || education.specialization || "";

const getEducationInstitution = (education: EducationSummary) =>
  education.institution || education.university || education.college || "";

const getAwardInstitution = (award: AwardSummary) =>
  award.institution || award.organization || "";

const CARD_LINK_CLASS =
  "block h-full rounded-2xl no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5CE6] focus-visible:ring-offset-4";

const CardAction = () => (
  <div className="mt-auto pt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0A5CE6]">
    <span>View details</span>
    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
  </div>
);

// Simple route-level states. Loader is intentionally plain because App.tsx also
// owns the main application loader.
const LoadingState = () => (
  <div className="h-screen flex items-center justify-center">
    <p>Loading portfolio...</p>
  </div>
);

const EmptyState = () => (
  <div className="h-screen flex items-center justify-center">
    <p>No Home Data Found</p>
  </div>
);

// Hero name treatment: first name lines stay dark and the final name segment is
// highlighted in orange. This preserves the original visual identity.
const HighlightedName = ({ name }: { name: string }) => {
  const words = name.toUpperCase().split(" ").filter(Boolean);
  const fontSizeClass = getNameFontSizeClass(name);

  return (
    <h1
      className={`font-black tracking-tighter text-[#0D0D0D] leading-[0.85] uppercase break-words w-full mb-6 lg:mb-6 ${fontSizeClass}`}
    >
      {words.length === 2 && (
        <>
          <span className="block">{words[0]}</span>
          <span className="block text-[#FF6B00]">{words[1]}</span>
        </>
      )}

      {words.length >= 3 && (
        <>
          <span className="block">
            {words[0]} {words[1]}
          </span>
          <span className="block text-[#FF6B00]">
            {words.slice(2).join(" ")}
          </span>
        </>
      )}

      {words.length < 2 && <span>{name}</span>}
    </h1>
  );
};

// Shared profile image block used in both mobile and desktop hero positions.
const ProfileImage = ({
  home,
  className,
  hoverScale = false,
}: {
  home: HomeProfile;
  className: string;
  hoverScale?: boolean;
}) => (
  <div
    className={`w-full max-w-[260px] sm:max-w-[360px] md:max-w-[400px] aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-[#E5E7EB] bg-[#F4F4F5] shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative group ${className}`}
  >
    <img
      src={getProfileImage(home.photo)}
      alt={home.name || "Profile"}
      className={`w-full h-full object-cover object-[center_top] ${
        hoverScale
          ? "transition-transform duration-700 group-hover:scale-105"
          : ""
      }`}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
  </div>
);

// Shared external link button. The first CTA uses the primary black treatment;
// secondary actions keep the outlined style.
const ExternalAction = ({
  href,
  children,
  variant = "secondary",
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) => {
  if (!href) return null;

  const className =
    variant === "primary"
      ? "inline-flex items-center gap-2 bg-[#0D0D0D] border-2 border-[#0D0D0D] px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-bold text-white rounded-[14px] hover:bg-black/80 hover:border-black/0 transition-all duration-200 shadow-sm"
      : "inline-flex items-center gap-2 border-2 border-[#E5E7EB] px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-bold text-[#0D0D0D] rounded-[14px] hover:border-[#0D0D0D] hover:bg-[#F4F4F5] transition-all duration-200";

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
};

// Achievements arrive as a comma-separated string from the sheet.
const Achievements = ({ achievements }: { achievements?: string }) => {
  if (!achievements) return null;

  const items = achievements
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 text-sm md:text-base font-bold text-[#0D0D0D]/60 tracking-wide">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3 md:gap-4">
          <span>{item}</span>
          {index !== items.length - 1 && (
            <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full opacity-80" />
          )}
        </div>
      ))}
    </div>
  );
};

// First viewport section: profile identity, primary links, achievements, and
// responsive portrait placement.
const HeroSection = ({ home }: { home: HomeProfile }) => (
  <section className="relative pt-6 md:pt-10 lg:pt-12 pb-10 md:pb-16 lg:pb-20 px-4 md:px-6 overflow-hidden bg-white">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-16 lg:gap-20 items-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
      >
        {home.tags && home.tags.length > 0 && (
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B00] mb-5">
            {home.tags.join(" \u2022 ")}
          </p>
        )}

        <HighlightedName name={home.name || ""} />

        <ProfileImage home={home} className="block lg:hidden mb-8 mx-auto" />

        {home.domain && (
          <h2 className="text-xl md:text-2xl font-bold text-[#0D0D0D]/70 mb-4 tracking-tight">
            {home.domain}
          </h2>
        )}

        {home.shortBio && (
          <p className="text-base md:text-lg text-[#0D0D0D]/60 mb-8 md:mb-10 max-w-2xl leading-relaxed font-medium">
            {home.shortBio}
          </p>
        )}

        <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
          <ExternalAction href={home.links?.linkedin} variant="primary">
            LinkedIn <ExternalLink className="w-4 h-4" />
          </ExternalAction>
          <ExternalAction href={home.links?.scholar}>
            Google Scholar <ExternalLink className="w-4 h-4" />
          </ExternalAction>
          <ExternalAction href={home.links?.patents}>
            Google Patents <FileText className="w-4 h-4" />
          </ExternalAction>
        </div>

        <Achievements achievements={home.achievements} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="hidden lg:flex justify-center lg:justify-end"
      >
        <ProfileImage home={home} className="lg:max-w-[440px]" hoverScale />
      </motion.div>
    </div>
  </section>
);

// Executive summary cards are controlled entirely by the Home sheet card fields.
const ExecutiveSummary = ({ cards }: { cards: string[] }) => {
  if (!cards.length) return null;

  return (
    <div className="bg-white pb-10 sm:pb-14 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className={`grid gap-4 sm:gap-6 lg:gap-8 ${getCardGridClass(cards)}`}
        >
          {cards.map((card, index) => {
            const { title, content } = parseExecutiveCard(card);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                {title && (
                  <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#0D0D0D] mb-3">
                    {title}
                  </h3>
                )}
                {content && (
                  <p className="text-sm leading-[1.75] text-[#0D0D0D]/65 whitespace-pre-line">
                    {content}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Shared title row for the preview sections below the hero.
const SectionHeader = ({
  icon,
  title,
  to,
  linkLabel,
}: {
  icon: ReactNode;
  title: string;
  to: string;
  linkLabel: string;
}) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8 mb-8 md:mb-10 lg:mb-14">
    <div className="flex items-center gap-3 md:gap-4">
      {icon}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0D0D0D]">
        {title}
      </h2>
    </div>
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-[#0A5CE6] text-sm md:text-base font-medium hover:underline underline-offset-4 shrink-0"
    >
      {linkLabel} <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);

// Turns multiline spreadsheet text into the compact bullet style used across
// experience, education, and awards previews.
const BulletList = ({ value }: { value?: string }) => {
  const lines = splitLines(value)
    .slice(0, MAX_HOME_BULLETS)
    .map((line) => truncateText(line, MAX_BULLET_LENGTH));
  if (!lines.length) return null;

  return (
    <ul className="space-y-2">
      {lines.map((line, index) => (
        <li key={index} className="flex gap-3">
          <span className={BULLET_DOT} />
          <span className={BODY_TEXT}>{line}</span>
        </li>
      ))}
    </ul>
  );
};

// Preview card for a recent role.
const ExperienceCard = ({
  experience,
  index,
}: {
  experience: ExperienceSummary;
  index: number;
}) => {
  const to = buildAnchorLink("/experience", "experience", experience.company);

  return (
    <Link
      to={to}
      className={CARD_LINK_CLASS}
      aria-label={`Open ${experience.company || "experience"} details`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        className="h-full flex flex-col p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 hover:border-[#FF6B00]/50 transition-all duration-300 group cursor-pointer"
      >
        <div className={CARD_LABEL}>{experience.period}</div>
        <h3
          className={`${CARD_TITLE} group-hover:text-[#0A5CE6] transition-colors`}
        >
          {experience.role}
        </h3>
        <div className={`${CARD_SUBTITLE} mb-4 md:mb-5`}>
          {experience.company}
        </div>
        <div className="flex-1">
          <BulletList value={experience.roleDesc} />
        </div>
        <CardAction />
      </motion.div>
    </Link>
  );
};

// Preview card for one selected publication.
const PublicationCard = ({
  publication,
  index,
}: {
  publication: PublicationSummary;
  index: number;
}) => {
  const to = buildAnchorLink(
    "/publications",
    "publication",
    publication.title,
    getPublicationSearch(publication.category),
  );

  return (
    <Link
      to={to}
      className={CARD_LINK_CLASS}
      aria-label={`Open ${publication.title || "publication"} details`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        className="h-full flex flex-col border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl p-5 sm:p-6 lg:p-7 hover:bg-white hover:shadow-lg hover:-translate-y-1 hover:border-[#FF6B00]/50 transition-all duration-300 group cursor-pointer"
      >
        <div className={CARD_LABEL}>{publication.year || publication.date}</div>
        <h3 className={CARD_TITLE}>
          {truncateText(publication.title || "", 130)}
        </h3>
        <div className={CARD_SUBTITLE}>
          {publication.organization ||
            publication.event ||
            publication.platform}
        </div>
        <CardAction />
      </motion.div>
    </Link>
  );
};

// Preview card for an education record. Some older data uses institution/major
// while newer data uses university/specialization, so helpers handle both.
const EducationCard = ({
  education,
  index,
}: {
  education: EducationSummary;
  index: number;
}) => {
  const institution = getEducationInstitution(education);
  const to = buildAnchorLink(
    "/education",
    "education",
    institution || education.degree,
  );

  return (
    <Link
      to={to}
      className={CARD_LINK_CLASS}
      aria-label={`Open ${institution || "education"} details`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        className="h-full flex flex-col p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 hover:border-[#FF6B00]/50 transition-all duration-300 group cursor-pointer"
      >
        <div className={CARD_LABEL}>{education.year}</div>
        <h3 className="text-lg md:text-xl font-bold mb-1 text-[#0A5CE6] leading-tight">
          {education.degree}
        </h3>
        <div className="text-base md:text-lg font-bold text-[#0D0D0D]/80 mb-1">
          {getEducationMajor(education)}
        </div>
        <div className={`${CARD_SUBTITLE} italic mb-4 md:mb-5`}>
          {education.specialization}
        </div>

        <div className="mb-4 md:mb-5 flex-1">
          <BulletList value={education.degreeDesc} />
        </div>

        <div className="pt-4 md:pt-5 border-t border-[#E5E7EB]">
          <div className="text-xs md:text-sm font-bold text-[#0D0D0D]/65 uppercase tracking-widest">
            {institution}
          </div>
        </div>
        <CardAction />
      </motion.div>
    </Link>
  );
};

// Preview card for awards and recognitions-like award data.
const AwardCard = ({
  award,
  index,
}: {
  award: AwardSummary;
  index: number;
}) => {
  const to = buildAnchorLink(
    "/awards",
    "award",
    award.title,
    "?category=Awards",
  );

  return (
    <Link
      to={to}
      className={CARD_LINK_CLASS}
      aria-label={`Open ${award.title || "award"} details`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        className="h-full flex flex-col p-5 sm:p-6 lg:p-8 border border-[#E5E7EB] bg-[#F4F4F5]/60 rounded-2xl hover:bg-white hover:shadow-lg hover:-translate-y-1 hover:border-[#FF6B00]/50 transition-all duration-300 group cursor-pointer"
      >
        <div className={CARD_LABEL}>{award.year}</div>
        <h3 className={CARD_TITLE}>{award.title}</h3>
        <div className={`${CARD_SUBTITLE} mb-3`}>
          {getAwardInstitution(award)}
        </div>
        <div className="flex-1">
          <BulletList value={award.description} />
        </div>
        <CardAction />
      </motion.div>
    </Link>
  );
};

// Home preview sections are intentionally hidden when their data arrays are
// empty, keeping the page compact if a sheet has no published records.
const ExperienceSection = ({
  experiences,
}: {
  experiences: ExperienceSummary[];
}) => {
  const featuredExperiences = getLatestExperiencesByCompany(
    experiences,
    MAX_FEATURED_ITEMS,
  );

  if (!featuredExperiences.length) return null;

  return (
    <section className="py-10 sm:py-14 lg:py-20 px-4 md:px-6 bg-[#F4F4F5]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={
            <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-[#FF6B00] shrink-0" />
          }
          title="Professional Experience"
          to="/experience"
          linkLabel="View All Experience"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {featuredExperiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// One recent item from each publication category is displayed.
const PublicationsSection = ({
  publications,
}: {
  publications: PublicationSummary[];
}) => {
  if (!publications.length) return null;

  return (
    <section className="py-10 sm:py-14 lg:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={
            <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-[#FF6B00] shrink-0" />
          }
          title="Selected Publications"
          to="/publications"
          linkLabel="View All Publications"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {publications.map((publication, index) => (
            <PublicationCard
              key={index}
              publication={publication}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Shows the two most recent education records.
const EducationSection = ({ education }: { education: EducationSummary[] }) => {
  if (!education.length) return null;

  return (
    <section className="py-10 sm:py-14 lg:py-20 px-4 md:px-6 bg-[#F4F4F5]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={
            <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-[#FF6B00] shrink-0" />
          }
          title="Education"
          to="/education"
          linkLabel="View Full Education"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {getLatestItems(education, 2).map((educationItem, index) => (
            <EducationCard
              key={index}
              education={educationItem}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Shows the three most recent awards.
const AwardsSection = ({ awards }: { awards: AwardSummary[] }) => {
  if (!awards.length) return null;

  return (
    <section className="py-10 sm:py-14 lg:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={
            <Award className="w-6 h-6 md:w-8 md:h-8 text-[#FF6B00] shrink-0" />
          }
          title="Featured Awards"
          to="/awards"
          linkLabel="View All Achievements"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {getLatestItems(awards, MAX_FEATURED_ITEMS).map((award, index) => (
            <AwardCard key={index} award={award} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Entry point: pick the home profile and section preview data, then compose the page.
export default function Home() {
  const { data, loading } = useAppData();

  if (loading) return <LoadingState />;
  if (!data) return null;

  const home = data.home?.[0] as HomeProfile | undefined;
  if (!home) return <EmptyState />;

  const experiences = (data.experiences || []) as ExperienceSummary[];
  const education = (data.education || []) as EducationSummary[];
  const awards = (data.awards || []) as AwardSummary[];

  // Keep the original behavior: surface one recent item from each publication
  // category instead of mixing all categories into one global sort.
  const publications: PublicationSummary[] = [
    ...getLatestItems(data.publicationConferences || [], 1).map((item) => ({
      ...item,
      category: "Conferences" as PublicationCategory,
    })),
    ...getLatestItems(data.publicationJournals || [], 1).map((item) => ({
      ...item,
      category: "Journals" as PublicationCategory,
    })),
    ...getLatestItems(data.publicationPreprints || [], 1).map((item) => ({
      ...item,
      category: "Preprints" as PublicationCategory,
    })),
  ];

  return (
    <div className="w-full bg-white">
      <HeroSection home={home} />
      <ExecutiveSummary cards={home.cards || []} />
      <ExperienceSection experiences={experiences} />
      <PublicationsSection publications={publications} />
      <EducationSection education={education} />
      <AwardsSection awards={awards} />
    </div>
  );
}
