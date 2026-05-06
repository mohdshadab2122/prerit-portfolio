import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Check,
  ExternalLink,
  FileText,
  GraduationCap,
  Linkedin,
  Mail,
  Menu,
  Monitor,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppData } from "../context/DataContext";
import SeoMeta from "./SeoMeta";

/*
 * Layout component
 *
 * This component owns the shared page frame: sticky navigation, mobile menu,
 * dynamic SEO metadata, routed page content, and footer. Page-specific content
 * is rendered through <Outlet />, while profile/social links are read from
 * DataContext.
 */

interface NavLinkItem {
  name: string;
  path: string;
}

interface SocialLinkItem {
  href: string;
  icon: ReactNode;
  label: string;
}

interface HomeLinks {
  linkedin?: string;
  scholar?: string;
  patents?: string;
}

type ThemePreference = "light" | "dark" | "system";
type EffectiveTheme = "light" | "dark";

const BUSINESS_SITE_URL = import.meta.env.VITE_BUSINESS_SITE_URL || "";
const DEFAULT_SITE_NAME = "Professional Portfolio";
const THEME_STORAGE_KEY = "portfolioTheme";

const THEME_OPTIONS: Array<{ label: string; value: ThemePreference }> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const NAV_LINKS: NavLinkItem[] = [
  { name: "Home", path: "/" },
  { name: "Education", path: "/education" },
  { name: "Experience", path: "/experience" },
  { name: "Publications", path: "/publications" },
  { name: "Intellectual Property", path: "/intellectual-property" },
  { name: "Awards & Recognitions", path: "/awards" },
  { name: "Contact", path: "/contact" },
];

// Social links are driven by the Home sheet. Missing links are omitted so the
// footer never renders inert "#" links.
const buildSocialLinks = (links: HomeLinks): SocialLinkItem[] => {
  const socialLinks: Array<SocialLinkItem | null> = [
    links.linkedin
      ? {
          href: links.linkedin,
          icon: <Linkedin className="w-5 h-5 lg:w-6 lg:h-6" />,
          label: "LinkedIn",
        }
      : null,
    links.scholar
      ? {
          href: links.scholar,
          icon: <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6" />,
          label: "Google Scholar",
        }
      : null,
    links.patents
      ? {
          href: links.patents,
          icon: <FileText className="w-5 h-5 lg:w-6 lg:h-6" />,
          label: "Google Patents",
        }
      : null,
  ];

  return socialLinks.filter((link): link is SocialLinkItem => link !== null);
};

const isActivePath = (currentPath: string, linkPath: string) =>
  currentPath === linkPath;

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

const getSystemTheme = (): EffectiveTheme => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getStoredThemePreference = (): ThemePreference => {
  if (typeof window === "undefined") return "system";
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemePreference(storedTheme) ? storedTheme : "system";
};

const renderThemeIcon = (
  theme: ThemePreference | EffectiveTheme,
  className = "h-4 w-4",
) => {
  if (theme === "dark") return <Moon className={className} />;
  if (theme === "system") return <Monitor className={className} />;
  return <Sun className={className} />;
};

const BrandLink = ({ name }: { name: string }) => (
  <Link
    to="/"
    className="text-base lg:text-xl font-bold tracking-tight shrink-0"
  >
    {name.toUpperCase()}
  </Link>
);

const BusinessSiteLink = ({ mobile = false }: { mobile?: boolean }) => {
  if (!BUSINESS_SITE_URL) return null;

  return (
    <a
      href={BUSINESS_SITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        mobile
          ? "mt-2 inline-flex items-center gap-2 bg-near-black text-white px-4 py-2.5 text-sm font-medium hover:bg-near-black/90 transition-colors rounded-lg w-fit"
          : "hidden lg:inline-flex items-center gap-1.5 xl:gap-2 bg-near-black text-white px-3 xl:px-5 py-2 xl:py-2.5 text-[13px] xl:text-sm font-medium hover:bg-near-black/90 transition-colors whitespace-nowrap"
      }
    >
      Visit Business Site
      <ExternalLink className={mobile ? "w-4 h-4" : "w-3 h-3 xl:w-4 xl:h-4"} />
    </a>
  );
};

const DesktopNav = ({ pathname }: { pathname: string }) => (
  <nav className="hidden lg:flex items-center gap-3 xl:gap-8">
    {NAV_LINKS.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        className={`text-[13px] xl:text-sm font-medium transition-colors whitespace-nowrap ${
          isActivePath(pathname, link.path)
            ? "text-primary-orange"
            : "text-near-black/70 hover:text-near-black"
        }`}
      >
        {link.name}
      </Link>
    ))}
  </nav>
);

const MobileMenuButton = ({
  menuOpen,
  onToggle,
}: {
  menuOpen: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className="lg:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
    aria-label="Toggle menu"
  >
    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
  </button>
);

const ThemeOptionButton = ({
  option,
  selected,
  onSelect,
  mobile = false,
}: {
  option: { label: string; value: ThemePreference };
  selected: boolean;
  onSelect: (theme: ThemePreference) => void;
  mobile?: boolean;
}) => (
  <button
    type="button"
    onClick={() => onSelect(option.value)}
    className={
      mobile
        ? `flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors ${
            selected
              ? "border-primary-orange bg-primary-orange/10 text-primary-orange"
              : "border-[#E5E7EB] bg-white text-near-black/70 hover:text-near-black"
          }`
        : `flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            selected
              ? "bg-primary-orange/10 text-primary-orange"
              : "text-near-black/70 hover:bg-black/5 hover:text-near-black"
          }`
    }
  >
    <span className="flex items-center gap-2">
      {renderThemeIcon(option.value, mobile ? "h-3.5 w-3.5" : "h-4 w-4")}
      {option.label}
    </span>
    {!mobile && selected && <Check className="h-4 w-4" />}
  </button>
);

const ThemeMenu = ({
  themePreference,
  onThemeChange,
}: {
  themePreference: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/5 bg-white text-near-black/70 transition-colors hover:text-near-black"
        aria-label="Change appearance"
        aria-expanded={open}
      >
        {renderThemeIcon(themePreference)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl shadow-black/10"
          >
            <p className="px-3 pb-1.5 pt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#0D0D0D]/45">
              Appearance
            </p>
            <div className="space-y-1">
              {THEME_OPTIONS.map((option) => (
                <ThemeOptionButton
                  key={option.value}
                  option={option}
                  selected={themePreference === option.value}
                  onSelect={(theme) => {
                    onThemeChange(theme);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileThemeMenu = ({
  themePreference,
  onThemeChange,
}: {
  themePreference: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}) => (
  <div className="mt-3 border-t border-black/5 pt-3">
    <p className="px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#0D0D0D]/45">
      Appearance
    </p>
    <div className="mt-2 grid grid-cols-3 gap-2 px-3">
      {THEME_OPTIONS.map((option) => (
        <ThemeOptionButton
          key={option.value}
          option={option}
          selected={themePreference === option.value}
          onSelect={onThemeChange}
          mobile
        />
      ))}
    </div>
  </div>
);

// Mobile menu is animated separately from the header so the sticky nav height
// can collapse cleanly after a route is selected.
const MobileNav = ({
  pathname,
  menuOpen,
  onClose,
  themePreference,
  onThemeChange,
}: {
  pathname: string;
  menuOpen: boolean;
  onClose: () => void;
  themePreference: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}) => (
  <AnimatePresence>
    {menuOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="lg:hidden overflow-hidden border-t border-black/5 bg-soft-grey/98 backdrop-blur-md"
      >
        <nav className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 flex flex-col gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActivePath(pathname, link.path)
                  ? "text-primary-orange bg-primary-orange/5"
                  : "text-near-black/70 hover:text-near-black hover:bg-black/5"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <MobileThemeMenu
            themePreference={themePreference}
            onThemeChange={onThemeChange}
          />

          <BusinessSiteLink mobile />
        </nav>
      </motion.div>
    )}
  </AnimatePresence>
);

const Header = ({
  pathname,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  profileName,
  themePreference,
  onThemeChange,
}: {
  pathname: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  profileName: string;
  themePreference: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}) => (
  <header className="sticky top-0 z-50 bg-soft-grey/90 backdrop-blur-md border-b border-black/5">
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 lg:h-20 flex items-center justify-between">
      <BrandLink name={profileName} />
      <DesktopNav pathname={pathname} />

      <div className="flex items-center gap-3">
        <ThemeMenu
          themePreference={themePreference}
          onThemeChange={onThemeChange}
        />
        <BusinessSiteLink />
        <MobileMenuButton menuOpen={menuOpen} onToggle={onToggleMenu} />
      </div>
    </div>

    <MobileNav
      pathname={pathname}
      menuOpen={menuOpen}
      onClose={onCloseMenu}
      themePreference={themePreference}
      onThemeChange={onThemeChange}
    />
  </header>
);

const Footer = ({
  profileName,
  socialLinks,
}: {
  profileName: string;
  socialLinks: SocialLinkItem[];
}) => (
  <footer className="bg-near-black text-white py-12 lg:py-16">
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
      <div className="text-center md:text-left">
        <h2 className="text-xl lg:text-2xl font-bold tracking-tight mb-2">
          {profileName.toUpperCase()}
        </h2>
        <p className="text-white/60 text-base lg:text-lg italic">
          "Think deeper. Build bolder. Learn without limits."
        </p>
      </div>

      <div className="flex items-center gap-5 lg:gap-6">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-primary-orange transition-colors"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}

        <Link
          to="/contact"
          className="text-white/60 hover:text-primary-orange transition-colors"
          aria-label="Contact"
        >
          <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
        </Link>
      </div>
    </div>
  </footer>
);

// Entry point: read route state and profile links, then compose the app shell.
export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    getStoredThemePreference,
  );
  const [systemTheme, setSystemTheme] =
    useState<EffectiveTheme>(getSystemTheme);
  const { data } = useAppData();

  const homeData = data?.home?.[0];
  const profileName = homeData?.name || DEFAULT_SITE_NAME;
  const socialLinks = buildSocialLinks(homeData?.links || {});
  const effectiveTheme =
    themePreference === "system" ? systemTheme : themePreference;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () =>
      setSystemTheme(mediaQuery.matches ? "dark" : "light");

    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  }, [themePreference]);

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
    document.documentElement.style.colorScheme = effectiveTheme;
  }, [effectiveTheme]);

  return (
    <div className="min-h-screen flex flex-col bg-soft-grey text-near-black">
      <SeoMeta />

      <Header
        pathname={location.pathname}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((current) => !current)}
        onCloseMenu={() => setMenuOpen(false)}
        profileName={profileName}
        themePreference={themePreference}
        onThemeChange={setThemePreference}
      />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer profileName={profileName} socialLinks={socialLinks} />
    </div>
  );
}
