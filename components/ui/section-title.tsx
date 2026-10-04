import { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-bodoni font-medium tracking-tight relative inline-flex items-start">
      <span className="section-title-highlight">{children}</span>
      <span className="text-ring text-xl ml-1 -mt-1 leading-none select-none">✦</span>
    </h2>
  );
}
