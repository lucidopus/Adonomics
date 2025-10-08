'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Theme = 'light' | 'dark' | 'system'
type ThemePreference = 'light' | 'dark'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>('light')
  const [systemTheme, setSystemTheme] = useState<ThemePreference>('light')
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Get system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)

      // If user hasn't set a preference, follow system
      const savedPreference = localStorage.getItem('theme-preference') as Theme | null
      if (!savedPreference || savedPreference === 'system') {
        applyTheme(newSystemTheme)
        setTheme(newSystemTheme)
      }
    }

    // Initial system theme
    const initialSystemTheme = mediaQuery.matches ? 'dark' : 'light'
    setSystemTheme(initialSystemTheme)

    // Check for saved preference
    const savedPreference = localStorage.getItem('theme-preference') as Theme | null
    const savedTheme = localStorage.getItem('theme') as ThemePreference | null

    let initialTheme: ThemePreference

    if (savedPreference === 'system') {
      initialTheme = initialSystemTheme
    } else if (savedTheme) {
      initialTheme = savedTheme
    } else {
      initialTheme = initialSystemTheme
    }

    setTheme(initialTheme)
    applyTheme(initialTheme)

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  const applyTheme = (newTheme: ThemePreference) => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  }

  const setThemePreference = (preference: Theme) => {
    localStorage.setItem('theme-preference', preference)

    let actualTheme: ThemePreference
    if (preference === 'system') {
      actualTheme = systemTheme
    } else {
      actualTheme = preference
    }

    setTheme(actualTheme)
    applyTheme(actualTheme)
    setIsOpen(false)
  }

  const getCurrentPreference = (): Theme => {
    const saved = localStorage.getItem('theme-preference') as Theme | null
    if (saved) return saved

    // If no preference saved, it's effectively 'system'
    return 'system'
  }

  if (!mounted) {
    return (
      <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
        <div className="w-5 h-5 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  const currentPreference = getCurrentPreference()

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 glass rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-apple border border-border/50 hover:border-border shadow-apple"
        whileTap={{ scale: 0.95 }}
        aria-label="Theme settings"
      >
        <AnimatePresence mode="wait">
          {theme === 'light' ? (
            <motion.svg
              key="sun"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-5 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-5 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-12 z-[9999] w-48 glass rounded-xl border border-border shadow-apple-xl p-2"
            >
              <div className="space-y-1">
                {/* Light Theme */}
                <motion.button
                  onClick={() => setThemePreference('light')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    currentPreference === 'light' && theme === 'light'
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  Light
                  {currentPreference === 'light' && (
                    <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.button>

                {/* Dark Theme */}
                <motion.button
                  onClick={() => setThemePreference('dark')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    currentPreference === 'dark' && theme === 'dark'
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  Dark
                  {currentPreference === 'dark' && (
                    <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.button>

                {/* System Theme */}
                <motion.button
                  onClick={() => setThemePreference('system')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    currentPreference === 'system'
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  System
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({systemTheme === 'dark' ? 'Dark' : 'Light'})
                  </span>
                  {currentPreference === 'system' && (
                    <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.button>
              </div>

              {/* Current theme indicator */}
              <div className="mt-3 pt-2 border-t border-border">
                <div className="flex items-center justify-center text-xs text-muted-foreground">
                  <span>Current: </span>
                  <span className="font-medium ml-1 capitalize">
                    {currentPreference === 'system' ? `System (${theme})` : theme}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}