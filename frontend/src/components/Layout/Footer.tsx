// src/components/Layout/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Headphones, ArrowUp, Globe, GitBranch } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="glass-nav mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Headphones className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold gradient-text">Aloud</span>
            </div>
            <p className="text-gray-600 text-sm">
              Transform text into natural speech. Listen on the go, save your
              eyes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-purple-600 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/developers"
                  className="text-gray-600 hover:text-purple-600 transition"
                >
                  Developers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-purple-600 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-purple-600 transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/40 transition"
              >
                <GitBranch className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/40 transition"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/40 transition"
              >
                <ArrowUp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Return to Top */}
          <div className="flex justify-start md:justify-end items-end">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition group"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition" />
            </button>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Aloud. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
