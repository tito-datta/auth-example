"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

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
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:underline">Weather Auth App</Link>
        <Link href="/weather" className="text-blue-500 hover:underline">Weather</Link>
        <Link href="/user" className="text-blue-500 hover:underline">User Info</Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            className="rounded-full overflow-hidden border-2 border-blue-400 hover:border-blue-600 transition-all w-12 h-12 focus:outline-none"
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
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50 animate-fade-in">
              <Link
                href="/user"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                User Info
              </Link>
              <Link
                href="/api/auth/logout?federated"
                className="block px-4 py-2 text-red-600 hover:bg-gray-100"
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
