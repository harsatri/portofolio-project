import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  accentColor?: "blue" | "emerald" | "amber" | "purple";
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  accentColor = "blue",
}: StatsCardProps) {
  const colorMap = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 flex flex-col justify-between shadow-xs">
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${colorMap[accentColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
          {value}
        </div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400">
            {trend && (
              <span className="text-emerald-400 font-mono font-semibold">
                {trend}
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
