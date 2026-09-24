"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { motion, AnimatePresence } from "framer-motion";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div className={`w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 hover:bg-zinc-200/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 cursor-pointer shadow-xs ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Moon className="w-4 h-4 text-zinc-300 dark:text-zinc-200" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0.6, rotate: 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sun className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
