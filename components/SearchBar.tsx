"use client";

import { FilterKey } from "@/types/country";
import { useI18n } from "@/contexts/I18nContext";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  filterBy: FilterKey;
  onQueryChange: (v: string) => void;
  onFilterChange: (f: FilterKey) => void;
  total: number;
  filtered: number;
}

const FILTER_KEYS: FilterKey[] = ["name", "code", "currency", "currencyCode"];

export function SearchBar({
  query,
  filterBy,
  onQueryChange,
  onFilterChange,
  total,
  filtered,
}: SearchBarProps) {
  const { t } = useI18n();

  const filterLabel = (key: FilterKey) => t.filters[key === "currencyCode" ? "currencyCode" : key];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t.search.placeholder.replace("{{filter}}", filterLabel(filterBy).toLowerCase())}
          className="
            w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200
            bg-white text-sm text-slate-800 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400
            transition-all duration-200
          "
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
          >
            {t.search.clear}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {FILTER_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`
                flex-1 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer
                ${
                  filterBy === key
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              {filterLabel(key)}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 text-right">
          {query
            ? t.search.filteredCount
                .replace("{{filtered}}", String(filtered))
                .replace("{{total}}", String(total))
            : t.search.totalCountries.replace("{{count}}", String(total))}
        </span>
      </div>
    </div>
  );
}
