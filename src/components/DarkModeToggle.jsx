// src/components/DarkModeToggle.jsx
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`relative w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 shadow-lg focus:outline-none
      ${isDark 
        ? 'bg-gradient-to-br from-indigo-600 to-purple-700' 
        : 'bg-gradient-to-br from-yellow-400 to-orange-500'
      }`}
    >
      {isDark ? (
        <svg className="w-6 h-6 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" d="
            M12 1v2
            M12 21v2
            M4.22 4.22l1.42 1.42
            M18.36 18.36l1.42 1.42
            M1 12h2
            M21 12h2
            M4.22 19.78l1.42-1.42
            M18.36 5.64l1.42-1.42
        " />
        </svg>
      )}
    </button>

  );
}
