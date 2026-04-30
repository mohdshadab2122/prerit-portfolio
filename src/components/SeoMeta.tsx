import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppData } from "../context/DataContext";

/*
 * SeoMeta
 *
 * index.html can only provide generic fallback metadata because this portfolio
 * is driven by spreadsheet data. This component updates browser metadata after
 * the Home sheet is loaded, so the same deployment can represent any profile.
 */

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
  photo?: string;
}

const DEFAULT_TITLE = "Professional Portfolio";
const DEFAULT_IMAGE = "/social-preview.png";
const DEFAULT_FAVICON = "/favicon.svg";
const DEFAULT_DESCRIPTION =
  "A dynamic professional portfolio highlighting experience, education, publications, intellectual property, awards, recognitions, and contact information.";
const DEFAULT_KEYWORDS = [
  "professional portfolio",
  "engineering portfolio",
  "inventor portfolio",
  "publications",
  "patents",
  "awards",
  "experience",
  "education",
];

const ROUTE_LABELS: Record<string, string> = {
  "/": "",
  "/education": "Education",
  "/experience": "Experience",
  "/publications": "Publications",
  "/intellectual-property": "Intellectual Property",
  "/awards": "Awards & Recognitions",
  "/contact": "Contact",
};

const getRouteLabel = (pathname: string) => ROUTE_LABELS[pathname] || "";

const getDriveImage = (link?: string) => {
  if (!link) return "";

  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return link;

  return `https://lh3.googleusercontent.com/d/${match[1]}`;
};

const splitCommaList = (value?: string) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const unique = (items: string[]) =>
  Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

const buildTitle = (home: HomeProfile | undefined, routeLabel: string) => {
  const baseTitle = home?.name || DEFAULT_TITLE;
  const suffix = routeLabel || home?.domain || "";

  return suffix ? `${baseTitle} | ${suffix}` : baseTitle;
};

const buildDescription = (home: HomeProfile | undefined) => {
  if (home?.shortBio) return home.shortBio;

  if (home?.name) {
    return `Portfolio of ${home.name}, highlighting experience, education, publications, intellectual property, awards, recognitions, and contact information.`;
  }

  return DEFAULT_DESCRIPTION;
};

const buildKeywords = (home: HomeProfile | undefined) =>
  unique([
    home?.name || "",
    ...(home?.tags || []),
    ...splitCommaList(home?.domain),
    ...splitCommaList(home?.achievements),
    ...DEFAULT_KEYWORDS,
  ]).join(", ");

const getAbsoluteUrl = (pathOrUrl: string) => {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${window.location.origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};

const upsertMeta = (
  attributeName: "name" | "property",
  attributeValue: string,
  content: string,
) => {
  let meta = document.querySelector<HTMLMetaElement>(
    `meta[${attributeName}="${attributeValue}"]`,
  );

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attributeName, attributeValue);
    document.head.appendChild(meta);
  }

  meta.content = content;
};

const upsertCanonical = (href: string) => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = href;
};

const upsertIconLink = (rel: string, href: string) => {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }

  link.href = href;
};

const upsertStructuredData = (
  home: HomeProfile | undefined,
  canonicalUrl: string,
  imageUrl: string,
  description: string,
) => {
  const existingScript = document.getElementById("dynamic-profile-schema");
  if (existingScript) existingScript.remove();

  const sameAs = [
    home?.links?.linkedin,
    home?.links?.scholar,
    home?.links?.patents,
  ].filter(Boolean);

  const schema = home?.name
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: home.name,
        url: canonicalUrl,
        image: imageUrl,
        jobTitle: home.domain || "Professional",
        description,
        knowsAbout: unique([
          ...(home.tags || []),
          ...splitCommaList(home.domain),
        ]),
        sameAs,
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: DEFAULT_TITLE,
        url: canonicalUrl,
        description,
      };

  const script = document.createElement("script");
  script.id = "dynamic-profile-schema";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

export default function SeoMeta() {
  const { data } = useAppData();
  const location = useLocation();

  useEffect(() => {
    const home = data?.home?.[0] as HomeProfile | undefined;
    const routeLabel = getRouteLabel(location.pathname);
    const title = buildTitle(home, routeLabel);
    const description = buildDescription(home);
    const keywords = buildKeywords(home);
    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    const imageUrl = getAbsoluteUrl(getDriveImage(home?.photo) || DEFAULT_IMAGE);
    const faviconUrl = getAbsoluteUrl(getDriveImage(home?.photo) || DEFAULT_FAVICON);

    document.title = title;
    upsertCanonical(canonicalUrl);
    upsertIconLink("icon", faviconUrl);
    upsertIconLink("apple-touch-icon", faviconUrl);

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords);
    upsertMeta("name", "author", home?.name || DEFAULT_TITLE);
    upsertMeta("name", "robots", "index, follow");

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", home?.name || DEFAULT_TITLE);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);

    upsertStructuredData(home, canonicalUrl, imageUrl, description);
  }, [data?.home, location.pathname]);

  return null;
}
