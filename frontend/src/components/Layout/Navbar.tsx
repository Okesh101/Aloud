// src/components/Layout/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X, Headphones, User, LogOut, Settings } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/developers", label: "Developers" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Aloud</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 glass-card px-3 py-2 hover:bg-white/40 transition">
                    <User className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">{user.firstname}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 glass-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-white/30 transition"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-white/30 transition w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="glass-button !py-2 !px-6">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass-card"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-2 text-gray-700 hover:text-purple-600 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-purple-600 font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-purple-600 font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
