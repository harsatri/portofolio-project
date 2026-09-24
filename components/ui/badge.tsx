import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow hover:bg-zinc-800 dark:hover:bg-zinc-200",
        secondary:
          "border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800",
        destructive:
          "border-transparent bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400",
        outline: "text-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950/40",
        success: "border-emerald-300 dark:border-emerald-800/60 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400",
        tech: "border-zinc-300 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-800 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
