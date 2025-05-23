'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  HiOutlineViewGrid,
  HiOutlineCreditCard,
  HiOutlineReceiptRefund,
  HiOutlineCurrencyDollar,
  HiOutlineFlag,
  HiUserCircle,
  HiMenu,
  HiX,
  HiMoon,
  HiSun,
} from 'react-icons/hi';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const pathname = usePathname();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Scroll freeze using position fixed for better compatibility
  useEffect(() => {
    if (isOpen) {
      // Save scroll position to restore later
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Navigation links data
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid size={20} /> },
    { href: '/expenses', label: 'Expenses', icon: <HiOutlineCreditCard size={20} /> },
    { href: '/receipts', label: 'Receipts', icon: <HiOutlineReceiptRefund size={20} /> },
    { href: '/budgets', label: 'Budgets', icon: <HiOutlineCurrencyDollar size={20} /> },
    { href: '/goals', label: 'Goals', icon: <HiOutlineFlag size={20} /> },
  ];

  return (
    <>
      {/* Hamburger Button (Mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-md bg-teal-700 text-white shadow-lg hover:bg-teal-800 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-screen w-64 bg-teal-700 text-white dark:bg-black dark:text-white
          z-[50] flex flex-col p-6 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          shadow-lg md:shadow-none flex-shrink-0`}
        aria-hidden={!isOpen && window.innerWidth < 768}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center md:justify-start">
          <h1 className="text-3xl font-extrabold tracking-tight whitespace-nowrap select-none">
            PVA
          </h1>
        </div>

        {/* Navigation Links */}
        <nav
          className="flex flex-col gap-3 text-base font-medium flex-grow"
          role="navigation"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 truncate
                  ${
                    active
                      ? 'bg-white text-teal-700 dark:bg-teal-600 dark:text-white font-semibold'
                      : 'hover:bg-white/20'
                  }`}
                onClick={() => setIsOpen(false)} // close on mobile
                aria-current={active ? 'page' : undefined}
              >
                <span className="min-w-[20px] flex-shrink-0">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col space-y-4">
          {/* Developer Portfolio Link */}
          <a
            href="https://your-portfolio-url.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-xl border border-blue-500 bg-white/10 backdrop-blur-sm p-5 flex items-center gap-5 shadow-[0_0_8px_rgba(59,130,246,0.4)] hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300 group cursor-pointer"
          >
            <HiUserCircle
              size={48}
              className="text-white group-hover:text-blue-300 transition-transform duration-300 group-hover:scale-110"
            />
            <div>
              <p className="font-semibold text-base text-white group-hover:text-blue-300 transition-colors">
                Developer
              </p>
              <p className="text-sm text-blue-300 group-hover:text-white transition-colors">
                Visit Portfolio
              </p>
            </div>
          </a>

          {/* User Profile Info */}
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="w-full rounded-xl border border-blue-500 bg-white/10 backdrop-blur-sm p-5 flex items-center gap-5 shadow-[0_0_8px_rgba(59,130,246,0.4)] hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300 cursor-pointer"
          >
            <img
              src="/profile.png"
              alt="Puneet Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-white/50 shadow-md hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-base truncate hover:text-blue-300 transition-colors">
                Puneet
              </p>
              <p className="text-sm text-blue-300 truncate hover:text-white transition-colors">
                puneetshukla043@gmail.com
              </p>
            </div>
          </Link>

          {/* Dark Mode Toggle */}
          <label
            className="flex items-center justify-between cursor-pointer text-sm font-medium pt-2"
            htmlFor="dark-mode-toggle"
          >
            <span className="flex items-center gap-2 select-none">
              {isDark ? <HiMoon /> : <HiSun />}
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <div className="relative">
              <input
                id="dark-mode-toggle"
                type="checkbox"
                className="sr-only peer"
                checked={isDark}
                onChange={() => setIsDark((prev) => !prev)}
                aria-checked={isDark}
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer-checked:bg-teal-500 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-full" />
            </div>
          </label>
        </div>
      </aside>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
