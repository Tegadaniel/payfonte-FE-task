"use client";

import { Country } from "@/types/country";
import { Globe, Phone, BadgeDollarSign, ChevronRight } from "lucide-react";

interface CountryCardProps {
  country: Country;
  onClick: (c: Country) => void;
  variant?: "list" | "grid";
}

export function CountryCard({ country, onClick, variant = "list" }: CountryCardProps) {
  const initial = country.name?.[0]?.toUpperCase() ?? "?";

  if (variant === "grid") {
    return (
      <button
        onClick={() => onClick(country)}
        className="
          group w-full bg-white border border-slate-200 rounded-2xl p-4
          hover:border-teal-300 hover:shadow-md hover:shadow-teal-50
          active:scale-[0.97] transition-all duration-200 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-teal-400 cursor-pointer
          flex flex-col items-center text-center gap-2
        "
      >
        {/* Flag avatar */}
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          {country.flagURL?.png ? (
            <img
              src={country.flagURL.png}
              alt={country.flagURL.alt ?? `${country.name} flag`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {country.flag ?? initial}
            </div>
          )}
        </div>

        {/* Name */}
        <p className="font-semibold text-slate-800 text-sm leading-tight line-clamp-1 w-full">
          {country.name}
        </p>

        {/* Chips row */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
          <Chip icon={<Phone size={9} />} label={country.code} />
          {country.currencyCode && (
            <Chip icon={<BadgeDollarSign size={9} />} label={country.currencyCode} />
          )}
          <Chip icon={<Globe size={9} />} label={country.locale} />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(country)}
      className="
        group w-full text-left bg-white border border-slate-200 rounded-2xl p-4
        hover:border-teal-300 hover:shadow-md hover:shadow-teal-50
        active:scale-[0.98] transition-all duration-200 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-teal-400 cursor-pointer
      "
    >
      <div className="flex items-start gap-3">
        {/* Avatar / flag image */}
        <div className="relative w-12 h-12 rounded-3xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
          {country.flagURL?.png ? (
            <img
              src={country.flagURL.png}
              alt={country.flagURL.alt ?? `${country.name} flag`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-700">
              {country.flag ?? initial}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate leading-tight">
            {country.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {country.currencyCode ? `${country.currencyCode} · ` : ""}
            {country.currency}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip icon={<Phone size={10} />} label={country.code} />
            <Chip
              icon={<BadgeDollarSign size={10} />}
              label={country.currencyCode ?? country.currency}
            />
            <Chip icon={<Globe size={10} />} label={country.locale} />
          </div>
        </div>

        <ChevronRight
          size={14}
          className="text-slate-300 group-hover:text-teal-400 mt-1 transition-colors shrink-0"
        />
      </div>
    </button>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label?: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
      <span className="text-slate-400">{icon}</span>
      {label}
    </span>
  );
}
