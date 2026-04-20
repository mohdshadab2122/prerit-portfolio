import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Linkedin,
  Mail,
  FileText,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { motion } from "motion/react";

export default function Layout() {
  const location = useLocation();

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
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            PRERIT PRAMOD
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-primary-orange"
                    : "text-near-black/70 hover:text-near-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <a
            href="https://inspiredinnovation.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-near-black text-white px-5 py-2.5 text-sm font-medium hover:bg-near-black/90 transition-colors"
          >
            Visit Business Site
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-near-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              PRERIT PRAMOD
            </h2>
            <p className="text-white/60 text-lg italic">
              "Think deeper. Build bolder. Learn without limits."
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-white/60 hover:text-primary-orange transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-primary-orange transition-colors"
              aria-label="Google Scholar"
            >
              <GraduationCap className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-primary-orange transition-colors"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-primary-orange transition-colors"
              aria-label="Resume"
            >
              <FileText className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
