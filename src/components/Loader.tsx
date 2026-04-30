import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { buildPortfolioPageUrl } from "../config/portfolioApi";

/*
 * Loader
 *
 * The app shows this screen while DataContext is preparing the full portfolio.
 * To keep the first impression personalized, the loader reads the profile name
 * from the cached Home data first, then falls back to a lightweight Home API
 * fetch if the cache is empty.
 */

interface LoaderProps {
  name?: string;
}

interface HomeRow {
  name?: string;
  domain?: string;
}

interface HomeResponse {
  home?: HomeRow[];
}

interface CachedAppData {
  data?: {
    home?: HomeRow[];
  };
}

interface LoaderProfile {
  name: string;
  domain: string;
}

const CACHE_KEY = "appData";
const DEFAULT_PROFILE: LoaderProfile = {
  name: "Professional Portfolio",
  domain: "Portfolio System",
};

const getFirstHomeRow = (rows?: HomeRow[]) =>
  Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

// DataContext stores the formatted app payload in localStorage. Reading that
// cache lets repeat visitors see the spreadsheet name immediately.
const readProfileFromCache = (): LoaderProfile | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as CachedAppData;
    const home = getFirstHomeRow(parsed.data?.home);
    if (!home?.name) return null;

    return {
      name: home.name,
      domain: home.domain || DEFAULT_PROFILE.domain,
    };
  } catch {
    return null;
  }
};

// The Home endpoint is small, so the loader can safely fetch only that tab
// without waiting for every portfolio section to finish.
const fetchProfileFromHomeTab = async (): Promise<LoaderProfile | null> => {
  const response = await fetch(buildPortfolioPageUrl("home"));
  if (!response.ok) return null;

  const payload = (await response.json()) as HomeResponse;
  const home = getFirstHomeRow(payload.home);
  if (!home?.name) return null;

  return {
    name: home.name,
    domain: home.domain || DEFAULT_PROFILE.domain,
  };
};

const useLoaderProfile = (providedName?: string) => {
  const [profile, setProfile] = useState<LoaderProfile>(() => {
    if (providedName) {
      return {
        name: providedName,
        domain: DEFAULT_PROFILE.domain,
      };
    }

    return readProfileFromCache() || DEFAULT_PROFILE;
  });

  useEffect(() => {
    if (providedName) {
      setProfile((current) => ({
        ...current,
        name: providedName,
      }));
      return;
    }

    let mounted = true;

    fetchProfileFromHomeTab()
      .then((freshProfile) => {
        if (mounted && freshProfile) {
          setProfile(freshProfile);
        }
      })
      .catch(() => {
        // Keep the fallback profile if the Home endpoint is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, [providedName]);

  return profile;
};

const ProgressBar = () => (
  <div className="mx-auto h-px w-44 overflow-hidden bg-[#E5E7EB]">
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="h-full w-1/2 bg-[#FF6B00]"
    />
  </div>
);

export default function Loader({ name }: LoaderProps) {
  const profile = useLoaderProfile(name);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-[#0D0D0D]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-xl text-center"
      >
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#FF6B00]">
          Preparing data
        </p>

        <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
          {profile.name}
        </h1>

        {profile.domain && profile.domain !== DEFAULT_PROFILE.domain && (
          <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-[#0D0D0D]/45 sm:text-base">
            {profile.domain}
          </p>
        )}

        <div className="mt-8">
          <ProgressBar />
        </div>
      </motion.div>
    </div>
  );
}
