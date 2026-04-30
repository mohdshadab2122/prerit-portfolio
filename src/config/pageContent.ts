/*
 * Page content helpers
 *
 * The Page Content spreadsheet tab lets non-layout copy change without editing
 * React files. Each row is addressed by a pageKey and blockKey, while these
 * helpers keep page components small and provide safe generic fallbacks.
 */

export interface PageContentRecord {
  pageKey?: string;
  blockKey?: string;
  title?: string;
  body?: string;
}

export interface SideInfoContent {
  blockKey: string;
  title: string;
  body: string;
}

export const PAGE_INTRO_FALLBACKS = {
  education:
    "Academic milestones, programs, and learning experiences that shaped the professional foundation.",
  experience:
    "A visual map of professional roles, leadership scope, and contributions across organizations and teams.",
  publications:
    "A structured archive of publications, research outputs, papers, and professional knowledge contributions across venues.",
  intellectual_property:
    "A structured portfolio of intellectual property, protected work, formal disclosures, and innovation contributions.",
  awards:
    "A curated record of professional honors, industry recognition, and notable achievements.",
  contact:
    "For consulting, collaboration, speaking, advisory, media, or professional inquiries, use the form below.",
} as const;

export const CONTACT_CARD_FALLBACKS: SideInfoContent[] = [
  {
    blockKey: "professional_inquiries",
    title: "Professional Inquiries",
    body: "Open to consulting, advisory, collaboration, speaking, research, media, and other professional inquiries.",
  },
  {
    blockKey: "response_window",
    title: "Response Window",
    body: "Most professional inquiries are typically reviewed within 2-5 business days.",
  },
  {
    blockKey: "advisory_collaboration",
    title: "Advisory & Collaboration",
    body: "Relevant for strategic discussions, project collaboration, innovation review, research, and professional partnerships.",
  },
];

const normalizeKey = (value?: string) =>
  (value || "").trim().toLowerCase().replace(/\s+/g, "_");

export const findPageContentBlock = (
  records: PageContentRecord[] | undefined,
  pageKey: string,
  blockKey: string,
) =>
  records?.find(
    (record) =>
      normalizeKey(record.pageKey) === normalizeKey(pageKey) &&
      normalizeKey(record.blockKey) === normalizeKey(blockKey),
  );

export const getPageIntro = (
  records: PageContentRecord[] | undefined,
  pageKey: keyof typeof PAGE_INTRO_FALLBACKS,
) =>
  findPageContentBlock(records, pageKey, "intro")?.body ||
  PAGE_INTRO_FALLBACKS[pageKey];

export const getContactSideInfo = (
  records: PageContentRecord[] | undefined,
) =>
  CONTACT_CARD_FALLBACKS.map((fallback) => {
    const sheetBlock = findPageContentBlock(
      records,
      "contact",
      fallback.blockKey,
    );

    return {
      ...fallback,
      title: sheetBlock?.title || fallback.title,
      body: sheetBlock?.body || fallback.body,
    };
  });
