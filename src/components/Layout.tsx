import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Linkedin,
  Mail,
  FileText,
  ExternalLink,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Education", path: "/education" },
    { name: "Experience", path: "/experience" },
    { name: "Publications", path: "/publications" },
    { name: "Intellectual Property", path: "/intellectual-property" },
    { name: "Awards & Recognitions", path: "/awards" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-soft-grey text-near-black">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-soft-grey/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-base lg:text-xl font-bold tracking-tight shrink-0"
          >
            PRERIT PRAMOD
          </Link>

          {/* Desktop Nav — visible on lg (1024px) and above */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[13px] xl:text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === link.path
                    ? "text-primary-orange"
                    : "text-near-black/70 hover:text-near-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Business site button — desktop only */}
            <a
              href="https://inspiredinnovation.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 xl:gap-2 bg-near-black text-white px-3 xl:px-5 py-2 xl:py-2.5 text-[13px] xl:text-sm font-medium hover:bg-near-black/90 transition-colors whitespace-nowrap"
            >
              Visit Business Site
              <ExternalLink className="w-3 h-3 xl:w-4 xl:h-4" />
            </a>

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
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
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-primary-orange bg-primary-orange/5"
                        : "text-near-black/70 hover:text-near-black hover:bg-black/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Business site link inside mobile menu */}
                <a
                  href="https://inspiredinnovation.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 bg-near-black text-white px-4 py-2.5 text-sm font-medium hover:bg-near-black/90 transition-colors rounded-lg w-fit"
                >
                  Visit Business Site
                  <ExternalLink className="w-4 h-4" />
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-near-black text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight mb-2">
              PRERIT PRAMOD
            </h2>
            <p className="text-white/60 text-base lg:text-lg italic">
              "Think deeper. Build bolder. Learn without limits."
            </p>
          </div>

          <div className="flex items-center gap-5 lg:gap-6">
            <a
              href="#"
              className="text-white/60 hover:text-primary-orange transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 lg:w-6 lg:h-6" />
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-primary-orange transition-colors"
              aria-label="Google Scholar"
            >
              <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6" />
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-primary-orange transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-primary-orange transition-colors"
              aria-label="Resume"
            >
              <FileText className="w-5 h-5 lg:w-6 lg:h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
