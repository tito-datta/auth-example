"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";

interface User {
  name: string;
  email: string;
  profilePicture: string;
}

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  return (
    <header className="header-main flex items-center justify-between px-6 py-4 bg-white dark:bg-dark-bg shadow-md border-b border-gray-200 dark:border-dark-border">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-dark-text hover:underline">Weather Auth App</Link>
        <Link href="/weather" className="text-blue-500 dark:text-dark-text-secondary hover:underline">Weather</Link>
        <Link href="/user" className="text-blue-500 dark:text-dark-text-secondary hover:underline">User Info</Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="font-medium text-gray-900 dark:text-dark-text">{user.name}</span>
          <span className="text-xs text-gray-500 dark:text-dark-text-secondary">{user.email}</span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            className="rounded-full overflow-hidden border-2 border-blue-400 dark:border-blue-600 hover:border-blue-600 dark:hover:border-blue-400 transition-all w-12 h-12 focus:outline-none"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="Open user menu"
          >
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 animate-fade-in">
              <Link
                href="/user"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setDropdownOpen(false)}
              >
                User Info
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => { toggleTheme(); setDropdownOpen(false); }}
              >
                {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
              <Link
                href="/api/auth/logout?federated"
                className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setDropdownOpen(false)}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
