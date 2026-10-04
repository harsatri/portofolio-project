import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "border-border bg-secondary text-foreground hover:bg-secondary",
        destructive:
          "border-transparent bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400",
        outline: "text-foreground border-border bg-card",
        success: "border-emerald-300 dark:border-emerald-800/60 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400",
        tech: "border-border bg-secondary text-foreground hover:text-foreground hover:border-ring",
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
