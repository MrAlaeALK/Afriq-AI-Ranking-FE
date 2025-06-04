import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import DarkModeToggle from './DarkModeToggle';

import '../index.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10 text-black dark:text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/afriq_ai_logo.svg" alt="Logo Afriq'AI" className="h-10 w-auto dark:invert-0 dark:brightness-150" />
        </div>

        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 bg-white dark:bg-gray-900 md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none md:items-center space-y-4 md:space-y-0 md:space-x-6`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-purple-700 dark:text-purple-400 font-medium"
                : "relative text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-purple-600 dark:after:bg-purple-400 after:transition-all after:duration-300"
            }
            end
          >
            {t('home')}
          </NavLink>
          <NavLink
            to="/carte"
            className={({ isActive }) =>
              isActive
                ? "text-purple-700 dark:text-purple-400 font-medium"
                : "relative text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-purple-600 dark:after:bg-purple-400 after:transition-all after:duration-300"
            }
          >
            {t('card')}
          </NavLink>
          <NavLink
            to="/classement"
            className={({ isActive }) =>
              isActive
                ? "text-purple-700 dark:text-purple-400 font-medium"
                : "relative text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-purple-600 dark:after:bg-purple-400 after:transition-all after:duration-300"
            }
          >
            {t('ranking')}
          </NavLink>
          <NavLink
            to="/comparer"
            className={({ isActive }) =>
              isActive
                ? "text-purple-700 dark:text-purple-400 font-medium"
                : "relative text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-purple-600 dark:after:bg-purple-400 after:transition-all after:duration-300"
            }
          >
            {t('compare')}
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              isActive 
                ? "text-purple-700 dark:text-purple-400 font-medium" 
                : "relative text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-purple-600 dark:after:bg-purple-400 after:transition-all after:duration-300"
            }
          >
            Contact
          </NavLink>
        </nav>

        <LanguageSwitcher />
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
