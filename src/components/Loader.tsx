import { useEffect, useMemo, useState } from "react";
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

const LOADING_LABELS = ["Loading portfolio", "Preparing data"];

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

const splitDisplayName = (name: string) => {
  const words = name.toUpperCase().split(" ").filter(Boolean);

  if (words.length <= 1) {
    return {
      lead: name.toUpperCase(),
      accent: "",
    };
  }

  return {
    lead: words.slice(0, -1).join(" "),
    accent: words[words.length - 1],
  };
};

const LoadingSteps = () => (
  <div className="grid gap-3">
    {LOADING_LABELS.map((label, index) => (
      <motion.div
        key={label}
        initial={{ opacity: 0.45, x: -8 }}
        animate={{ opacity: [0.45, 1, 0.45], x: 0 }}
        transition={{
          duration: 1.8,
          delay: index * 0.25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3"
      >
        <span className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[#0D0D0D]/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
          {label}
        </span>
        <span className="text-[10px] font-mono text-[#0D0D0D]/35">
          0{index + 1}
        </span>
      </motion.div>
    ))}
  </div>
);

const ProgressBar = () => (
  <div className="relative h-px w-full overflow-hidden bg-[#E5E7EB]">
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

const LoadingMeter = () => (
  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
    <div className="mb-4 flex items-center justify-between">
      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#0D0D0D]/40">
        Preparing data
      </span>
      <motion.span
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="h-2 w-2 rounded-full bg-[#FF6B00]"
      />
    </div>

    <div className="space-y-3">
      {[72, 88, 54].map((width, index) => (
        <div
          key={width}
          className="h-2 overflow-hidden rounded-full bg-[#F4F4F5]"
        >
          <motion.div
            initial={{ width: "18%" }}
            animate={{ width: [`${Math.max(width - 22, 28)}%`, `${width}%`] }}
            transition={{
              duration: 1.4,
              delay: index * 0.12,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="h-full rounded-full bg-[#0D0D0D]"
          />
        </div>
      ))}
    </div>
  </div>
);

export default function Loader({ name }: LoaderProps) {
  const profile = useLoaderProfile(name);
  const displayName = useMemo(
    () => splitDisplayName(profile.name),
    [profile.name],
  );

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#0D0D0D] flex items-center justify-center px-5">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_24px_80px_rgba(13,13,13,0.08)]"
        >
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 sm:px-7">
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#0D0D0D]/45">
              Portfolio System
            </span>
            <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#0D0D0D]/45">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
              Live Data
            </span>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_320px] md:p-10">
            <div className="flex min-h-[260px] flex-col justify-between">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#FF6B00]">
                  Loading portfolio
                </p>

                <h1 className="max-w-2xl text-5xl sm:text-6xl md:text-7xl font-black leading-[0.85] tracking-tight text-[#0D0D0D]">
                  <span className="block">{displayName.lead}</span>
                  {displayName.accent && (
                    <span className="block text-[#FF6B00]">
                      {displayName.accent}
                    </span>
                  )}
                </h1>
              </div>

              <div className="mt-10">
                <ProgressBar />
                <p className="mt-4 text-xs font-mono uppercase tracking-[0.18em] text-[#0D0D0D]/40">
                  Preparing data
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <LoadingMeter />
              <LoadingSteps />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
