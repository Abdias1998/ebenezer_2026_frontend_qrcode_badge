import type { ReactNode } from "react";
import type { RegistrationListParams } from "@/types/registration.types";

/** Compteurs cliquables par valeur (taille, ville, pays...) servant aussi de filtres. */
export function StatChips({
  title,
  icon,
  items,
  activeValue,
  filterKey,
  onToggle,
  formatLabel = (value) => value,
}: {
  title: string;
  icon: ReactNode;
  items: { value: string; count: number }[];
  activeValue: string;
  filterKey: keyof RegistrationListParams;
  onToggle: (key: keyof RegistrationListParams, value: string) => void;
  formatLabel?: (value: string) => string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
        {icon}
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = activeValue === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(filterKey, item.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? "bg-royal-600 text-white border-royal-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-royal-300 hover:text-royal-700"
              }`}
            >
              {formatLabel(item.value)} · {item.count}
            </button>
          );
        })}
      </div>
    </div>
  );
}
