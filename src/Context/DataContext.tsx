import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { buildPortfolioPageUrl } from "../config/portfolioApi";

/*
 * DataContext
 *
 * This provider is the single data-loading layer for the portfolio. It fetches
 * all Apps Script endpoints, converts raw spreadsheet rows into UI-friendly
 * objects, stores the result in localStorage for one hour, and exposes the
 * formatted data through useAppData().
 */

type LinkValue = string | string[] | undefined;

interface ApiHomeRow {
  name?: string;
  tags?: string;
  domain?: string;
  shortBio?: string;
  achievements?: string;
  linkedin?: LinkValue;
  scholar?: LinkValue;
  patents?: LinkValue;
  card1?: string;
  card2?: string;
  card3?: string;
  photo?: LinkValue;
}

interface ApiExperienceRow {
  company?: string;
  role?: string;
  type?: string;
  period?: string;
  location?: string;
  team?: string;
  department?: string;
  roleDesc?: string;
  companyDesc?: string;
  contribution?: string;
  externalLinks?: string[];
  mediaLinks?: string[];
}

interface ApiEducationRow {
  university?: string;
  college?: string;
  degree?: string;
  specialization?: string;
  year?: string;
  location?: string;
  gpa?: string;
  universityDesc?: string;
  preritDesc?: string;
  degreeDesc?: string;
  mediaLinks?: string[];
  externalLinks?: string[];
}

interface ApiPatentRow {
  usNumber?: string;
  usDate?: string;
  usTitle?: string;
  usStatus?: string;
  usPdf?: LinkValue;
  deNumber?: string;
  deDate?: string;
  deTitle?: string;
  deStatus?: string;
  dePdf?: LinkValue;
  cnNumber?: string;
  cnDate?: string;
  cnTitle?: string;
  cnStatus?: string;
  cnPdf?: LinkValue;
  epNumber?: string;
  epDate?: string;
  epTitle?: string;
  epStatus?: string;
  epPdf?: LinkValue;
  inventors?: string;
}

interface ApiDefensivePublicationRow {
  title?: string;
  number?: string;
  date?: string;
  status?: string;
  inventors?: string;
}

interface ApiTradeSecretRow {
  title?: string;
  date?: string;
  inventors?: string;
}

interface ApiPublicationConferenceRow {
  title?: string;
  organization?: string;
  event?: string;
  year?: string;
  externalLinks?: string[];
}

interface ApiPublicationJournalRow {
  title?: string;
  organization?: string;
  division?: string;
  year?: string;
  externalLinks?: string[];
}

interface ApiPublicationPreprintRow {
  platform?: string;
  date?: string;
  title?: string;
  externalLinks?: string[];
}

interface ApiAwardRow {
  year?: string;
  organization?: string;
  title?: string;
  summary?: string;
  description?: string;
}

interface ApiRecognitionRow {
  organization?: string;
  title?: string;
  summary?: string;
  description?: string;
}

interface ApiPageContentRow {
  pageKey?: string;
  blockKey?: string;
  title?: string;
  body?: string;
}

interface PatentMember {
  jurisdiction: "US" | "DE" | "CN" | "EP";
  number: string;
  date?: string;
  title?: string;
  status?: string;
  link: string;
}

interface PatentFamily {
  familyTitle?: string;
  members: PatentMember[];
  inventors: string[];
}

interface DefensivePublicationItem {
  title?: string;
  number?: string;
  date?: string;
  status?: string;
  inventors: string[];
}

interface TradeSecretItem {
  title?: string;
  date?: string;
  inventors: string[];
}

interface HomeProfile {
  name: string;
  tags: string[];
  domain: string;
  shortBio: string;
  achievements: string;
  links: {
    linkedin: string;
    scholar: string;
    patents: string;
  };
  cards: string[];
  photo: string;
}

interface ExperienceItem {
  company?: string;
  role?: string;
  type?: string;
  period?: string;
  location?: string;
  team?: string;
  department?: string;
  roleDesc?: string;
  companyDesc?: string;
  contribution?: string;
  externalLinks?: string[];
  mediaLinks: string[];
}

interface EducationItem {
  university?: string;
  college?: string;
  degree?: string;
  specialization?: string;
  year?: string;
  location?: string;
  gpa?: string;
  universityDesc?: string;
  preritDesc?: string;
  degreeDesc?: string;
  mediaLinks: string[];
  externalLinks?: string[];
}

interface PublicationConference {
  title?: string;
  organization?: string;
  event?: string;
  year?: string;
  link: string;
}

interface PublicationJournal {
  title?: string;
  organization?: string;
  division?: string;
  year?: string;
  link: string;
}

interface PublicationPreprint {
  platform?: string;
  date?: string;
  title?: string;
  link: string;
}

interface AwardItem {
  year?: string;
  organization?: string;
  title?: string;
  summary?: string;
  description?: string;
}

interface RecognitionItem {
  organization?: string;
  title?: string;
  summary?: string;
  description?: string;
}

interface PageContentBlock {
  pageKey?: string;
  blockKey?: string;
  title?: string;
  body?: string;
}

export interface AppDataType {
  patents: PatentFamily[];
  defensivePublications: DefensivePublicationItem[];
  tradeSecrets: TradeSecretItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  publicationConferences: PublicationConference[];
  publicationJournals: PublicationJournal[];
  publicationPreprints: PublicationPreprint[];
  awards: AwardItem[];
  recognitions: RecognitionItem[];
  pageContent: PageContentBlock[];
  home: HomeProfile[];
}

interface DataContextValue {
  data: AppDataType | null;
  loading: boolean;
}

interface CachedAppData {
  data: AppDataType;
  timestamp: number;
}

interface HomeResponse {
  home?: ApiHomeRow[];
}

interface AwardsResponse {
  awards?: ApiAwardRow[];
}

interface RecognitionsResponse {
  recognitions?: ApiRecognitionRow[];
}

interface ExperienceResponse {
  experiences?: ApiExperienceRow[];
}

interface EducationResponse {
  education?: ApiEducationRow[];
}

interface PublicationConferencesResponse {
  publicationConferences?: ApiPublicationConferenceRow[];
}

interface PublicationJournalsResponse {
  publicationJournals?: ApiPublicationJournalRow[];
}

interface PublicationPreprintsResponse {
  publicationPreprints?: ApiPublicationPreprintRow[];
}

interface PatentsResponse {
  patents?: ApiPatentRow[];
}

interface DefensivePublicationsResponse {
  defensivePublications?: ApiDefensivePublicationRow[];
}

interface TradeSecretsResponse {
  tradeSecrets?: ApiTradeSecretRow[];
}

interface PageContentResponse {
  pageContent?: ApiPageContentRow[];
}

interface PortfolioSectionResult {
  sections: Omit<AppDataType, "home">;
  hasFailures: boolean;
}

const CACHE_KEY = "appData_v2";
const CACHE_TTL_MS = 60 * 60 * 1000;

const DataContext = createContext<DataContextValue | null>(null);

const fetchPage = async <T,>(page: string): Promise<T> => {
  const response = await fetch(buildPortfolioPageUrl(page));

  if (!response.ok) {
    throw new Error(`Failed to fetch ${page}: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const fetchOptionalPage = async <T,>(
  page: string,
  fallback: T,
  onFailure: (page: string, error: unknown) => void,
): Promise<T> => {
  try {
    return await fetchPage<T>(page);
  } catch (error) {
    onFailure(page, error);
    return fallback;
  }
};

const isCacheExpired = (timestamp: number) =>
  Date.now() - timestamp > CACHE_TTL_MS;

// Reads localStorage defensively. Bad cache data is removed so the next render
// can fetch clean data from the API.
const readCachedData = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached) as Partial<CachedAppData>;

    if (!parsed.timestamp || !parsed.data) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    if (isCacheExpired(parsed.timestamp)) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed.data;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const writeCachedData = (data: AppDataType) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    }),
  );
};

const asArray = <T,>(value: T[] | undefined) =>
  Array.isArray(value) ? value : [];

const firstLink = (value: LinkValue) => {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
};

const splitCommaList = (value?: string) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const splitInventors = (value?: string) => splitCommaList(value);

const cleanPatentNumber = (value?: string) =>
  (value || "").replace(/[, ]/g, "");

// Patent PDFs sometimes arrive as a string or an array, and sometimes include
// multiple URLs. Prefer a direct PDF link, then fall back to any HTTP URL.
const getValidLink = (pdfData: LinkValue) => {
  if (!pdfData) return "";

  const linksArray = Array.isArray(pdfData)
    ? pdfData
    : pdfData.split(/[\n,; ]+/).filter(Boolean);

  const pdfLink = linksArray.find(
    (link) => link.startsWith("http") && link.includes(".pdf"),
  );
  if (pdfLink) return pdfLink.trim();

  const fallback = linksArray.find((link) => link.startsWith("http"));
  return fallback ? fallback.trim() : "";
};

const createPatentMember = (
  jurisdiction: PatentMember["jurisdiction"],
  number?: string,
  date?: string,
  title?: string,
  status?: string,
  pdf?: LinkValue,
): PatentMember | null => {
  if (!number || number === "-") return null;

  return {
    jurisdiction,
    number: cleanPatentNumber(number),
    date,
    title,
    status,
    link: getValidLink(pdf),
  };
};

const formatPatents = (rows: ApiPatentRow[]): PatentFamily[] =>
  rows.map((row) => ({
    familyTitle: row.usTitle || row.deTitle || row.cnTitle || row.epTitle,
    members: [
      createPatentMember(
        "US",
        row.usNumber,
        row.usDate,
        row.usTitle,
        row.usStatus,
        row.usPdf,
      ),
      createPatentMember(
        "DE",
        row.deNumber,
        row.deDate,
        row.deTitle,
        row.deStatus,
        row.dePdf,
      ),
      createPatentMember(
        "CN",
        row.cnNumber,
        row.cnDate,
        row.cnTitle,
        row.cnStatus,
        row.cnPdf,
      ),
      createPatentMember(
        "EP",
        row.epNumber,
        row.epDate,
        row.epTitle,
        row.epStatus,
        row.epPdf,
      ),
    ].filter((member): member is PatentMember => Boolean(member)),
    inventors: splitInventors(row.inventors),
  }));

const formatDefensivePublications = (
  rows: ApiDefensivePublicationRow[],
): DefensivePublicationItem[] =>
  rows.map((row) => ({
    title: row.title,
    number: cleanPatentNumber(row.number),
    date: row.date,
    status: row.status,
    inventors: splitInventors(row.inventors),
  }));

const formatTradeSecrets = (rows: ApiTradeSecretRow[]): TradeSecretItem[] =>
  rows.map((row) => ({
    title: row.title,
    date: row.date,
    inventors: splitInventors(row.inventors),
  }));

const formatExperiences = (rows: ApiExperienceRow[]): ExperienceItem[] =>
  rows.map((row) => ({
    company: row.company,
    role: row.role,
    type: row.type,
    period: row.period,
    location: row.location,
    team: row.team,
    department: row.department,
    roleDesc: row.roleDesc,
    companyDesc: row.companyDesc,
    contribution: row.contribution,
    externalLinks: row.externalLinks,
    mediaLinks: asArray(row.mediaLinks),
  }));

const formatEducation = (rows: ApiEducationRow[]): EducationItem[] =>
  rows.map((row) => ({
    university: row.university,
    college: row.college,
    degree: row.degree,
    specialization: row.specialization,
    year: row.year,
    location: row.location,
    gpa: row.gpa,
    universityDesc: row.universityDesc,
    preritDesc: row.preritDesc,
    degreeDesc: row.degreeDesc,
    mediaLinks: asArray(row.mediaLinks),
    externalLinks: row.externalLinks,
  }));

const formatConferences = (
  rows: ApiPublicationConferenceRow[],
): PublicationConference[] =>
  rows.map((row) => ({
    title: row.title,
    organization: row.organization,
    event: row.event,
    year: row.year,
    link: row.externalLinks?.[0] || "",
  }));

const formatJournals = (
  rows: ApiPublicationJournalRow[],
): PublicationJournal[] =>
  rows.map((row) => ({
    title: row.title,
    organization: row.organization,
    division: row.division,
    year: row.year,
    link: row.externalLinks?.[0] || "",
  }));

const formatPreprints = (
  rows: ApiPublicationPreprintRow[],
): PublicationPreprint[] =>
  rows.map((row) => ({
    platform: row.platform,
    date: row.date,
    title: row.title,
    link: row.externalLinks?.[0] || "",
  }));

const formatAwards = (rows: ApiAwardRow[]): AwardItem[] =>
  rows.map((row) => ({
    year: row.year,
    organization: row.organization,
    title: row.title,
    summary: row.summary,
    description: row.description,
  }));

const formatRecognitions = (rows: ApiRecognitionRow[]): RecognitionItem[] =>
  rows.map((row) => ({
    organization: row.organization,
    title: row.title,
    summary: row.summary,
    description: row.description,
  }));

const formatPageContent = (rows: ApiPageContentRow[]): PageContentBlock[] =>
  rows.map((row) => ({
    pageKey: row.pageKey,
    blockKey: row.blockKey,
    title: row.title,
    body: row.body,
  }));

const formatHome = (rows: ApiHomeRow[]): HomeProfile[] =>
  rows.map((row) => ({
    name: row.name || "",
    tags: splitCommaList(row.tags),
    domain: row.domain || "",
    shortBio: row.shortBio || "",
    achievements: row.achievements || "",
    links: {
      linkedin: firstLink(row.linkedin),
      scholar: firstLink(row.scholar),
      patents: firstLink(row.patents),
    },
    cards: [row.card1 || "", row.card2 || "", row.card3 || ""].filter(Boolean),
    photo: firstLink(row.photo),
  }));

const createEmptyAppData = (home: HomeProfile[] = []): AppDataType => ({
  patents: [],
  defensivePublications: [],
  tradeSecrets: [],
  experiences: [],
  education: [],
  publicationConferences: [],
  publicationJournals: [],
  publicationPreprints: [],
  awards: [],
  recognitions: [],
  pageContent: [],
  home,
});

const fetchHomeData = async (): Promise<HomeProfile[]> => {
  const homeJson = await fetchPage<HomeResponse>("home");
  return formatHome(asArray(homeJson.home));
};

// Home loads first for perceived speed. The heavier portfolio sections are
// fetched afterwards and merged into the already-rendered Home shell.
const fetchPortfolioSections = async (): Promise<PortfolioSectionResult> => {
  const failedPages: string[] = [];
  const handleSectionFailure = (page: string, error: unknown) => {
    failedPages.push(page);
    console.error(`PORTFOLIO SECTION FETCH ERROR (${page}):`, error);
  };

  const [
    awardsJson,
    recognitionsJson,
    experienceJson,
    educationJson,
    publicationJson,
    journalsJson,
    preprintsJson,
    patentsJson,
    defensiveJson,
    tradeJson,
    pageContentJson,
  ] = await Promise.all([
    fetchOptionalPage<AwardsResponse>("awards", {}, handleSectionFailure),
    fetchOptionalPage<RecognitionsResponse>(
      "recognitions",
      {},
      handleSectionFailure,
    ),
    fetchOptionalPage<ExperienceResponse>(
      "experience",
      {},
      handleSectionFailure,
    ),
    fetchOptionalPage<EducationResponse>("education", {}, handleSectionFailure),
    fetchOptionalPage<PublicationConferencesResponse>(
      "publication_conferences",
      {},
      handleSectionFailure,
    ),
    fetchOptionalPage<PublicationJournalsResponse>(
      "publication_journals",
      {},
      handleSectionFailure,
    ),
    fetchOptionalPage<PublicationPreprintsResponse>(
      "publication_preprints",
      {},
      handleSectionFailure,
    ),
    fetchOptionalPage<PatentsResponse>("patents", {}, handleSectionFailure),
    fetchOptionalPage<DefensivePublicationsResponse>(
      "defensive_publications",
      {},
      handleSectionFailure,
    ),
    fetchOptionalPage<TradeSecretsResponse>(
      "trade_secrets",
      {},
      handleSectionFailure,
    ),
    fetchOptionalPage<PageContentResponse>(
      "page_content",
      {},
      handleSectionFailure,
    ),
  ]);

  return {
    sections: {
      patents: formatPatents(asArray(patentsJson.patents)),
      defensivePublications: formatDefensivePublications(
        asArray(defensiveJson.defensivePublications),
      ),
      tradeSecrets: formatTradeSecrets(asArray(tradeJson.tradeSecrets)),
      experiences: formatExperiences(asArray(experienceJson.experiences)),
      education: formatEducation(asArray(educationJson.education)),
      publicationConferences: formatConferences(
        asArray(publicationJson.publicationConferences),
      ),
      publicationJournals: formatJournals(
        asArray(journalsJson.publicationJournals),
      ),
      publicationPreprints: formatPreprints(
        asArray(preprintsJson.publicationPreprints),
      ),
      awards: formatAwards(asArray(awardsJson.awards)),
      recognitions: formatRecognitions(asArray(recognitionsJson.recognitions)),
      pageContent: formatPageContent(asArray(pageContentJson.pageContent)),
    },
    hasFailures: failedPages.length > 0,
  };
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const cachedData = readCachedData();
    const hasWarmCache = Boolean(cachedData);

    if (cachedData) {
      setData(cachedData);
      setLoading(false);
    }

    const loadData = async () => {
      try {
        const home = await fetchHomeData();
        if (cancelled) return;

        // Cached data should render immediately, then be refreshed in the
        // background. Without this, valid localStorage can hide spreadsheet
        // edits until the full cache TTL expires.
        if (!hasWarmCache) {
          setData(createEmptyAppData(home));
        } else {
          setData((currentData) =>
            currentData ? { ...currentData, home } : createEmptyAppData(home),
          );
        }

        setLoading(false);

        try {
          const { sections, hasFailures } = await fetchPortfolioSections();
          if (cancelled) return;

          const completeData = {
            ...sections,
            home,
          };

          if (!hasFailures) {
            writeCachedData(completeData);
          }

          setData(completeData);
        } catch (sectionError) {
          console.error("BACKGROUND DATA FETCH ERROR:", sectionError);
        }
      } catch (err) {
        console.error("DATA FETCH ERROR:", err);
        if (!cancelled && !hasWarmCache) {
          setData(createEmptyAppData());
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useAppData must be used inside DataProvider");
  }

  return context;
};
