/**
 * Global organic motion transitions (Anti-kaku / Natural easeOutExpo)
 */
export const naturalEase = [0.16, 1, 0.3, 1] as const;

export const naturalTransition = {
  duration: 0.35,
  ease: naturalEase,
};

export const organicSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

export const subtleHoverTransition = "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]";
