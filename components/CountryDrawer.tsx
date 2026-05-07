"use client";

import { Country } from "@/types/country";
import { useI18n } from "@/contexts/I18nContext";
import { X, Globe, Phone, BadgeDollarSign, Languages, MapPin } from "lucide-react";
import { useEffect } from "react";

interface CountryDrawerProps {
  country: Country | null;
  onClose: () => void;
  homeCountry: Country | null;
  onSetHomeCountry: (c: Country | null) => void;
  localeTag: string;
}

export function CountryDrawer({
  country,
  onClose,
  homeCountry,
  onSetHomeCountry,
  localeTag,
}: CountryDrawerProps) {
  const { t } = useI18n();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (country) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [country]);

  if (!country) return null;

  const isHome = homeCountry?.locale === country.locale;
  const initial = country.name?.[0]?.toUpperCase() ?? "?";

  const formattedSample = country.currencyCode
    ? (() => {
        try {
          return new Intl.NumberFormat(localeTag, {
            style: "currency",
            currency: country.currencyCode,
            maximumFractionDigits: 0,
          }).format(1000);
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${country.name}`}
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-white rounded-t-3xl shadow-2xl
          animate-in slide-in-from-bottom duration-300
          max-h-[85vh] overflow-y-auto
        "
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-linear-to-br from-teal-400 to-emerald-500 text-white font-bold text-lg">
              {country.flag ?? initial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">
                {country.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium">{country.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={14} className="text-slate-600" />
          </button>
        </div>

        {/* Details */}
        <div className="px-5 pb-4 space-y-3">
          <DetailRow
            icon={<Phone size={15} className="text-teal-500" />}
            label={t.drawer.countryCode}
            value={country.code}
          />
          <DetailRow
            icon={<BadgeDollarSign size={15} className="text-teal-500" />}
            label={t.drawer.currency}
            value={
              country.currencyCode
                ? `${country.currency} (${country.currencyCode})`
                : country.currency
            }
          />
          {country.currencyIcon && (
            <DetailRow
              icon={
                <span className="text-teal-500 font-bold text-sm">
                  {country.currencyIcon}
                </span>
              }
              label={t.drawer.currencySymbol}
              value={country.currencyIcon}
            />
          )}
          {formattedSample && (
            <DetailRow
              icon={<BadgeDollarSign size={15} className="text-teal-500" />}
              label={t.drawer.currencyPreview.replace("{{locale}}", localeTag)}
              value={formattedSample}
            />
          )}
          <DetailRow
            icon={<Globe size={15} className="text-teal-500" />}
            label={t.drawer.internetCode}
            value={country.locale}
          />
          {country.countryId && (
            <DetailRow
              icon={<Languages size={15} className="text-teal-500" />}
              label={t.drawer.countryId}
              value={country.countryId}
            />
          )}
          {country.region && (
            <DetailRow
              icon={<MapPin size={15} className="text-teal-500" />}
              label={t.drawer.region}
              value={country.region}
            />
          )}
        </div>

        {/* Locale toggle */}
        <div className="px-5 pb-8">
          <button
            onClick={() => onSetHomeCountry(isHome ? null : country)}
            className={`
              w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200
              flex items-center justify-center gap-2 cursor-pointer
              ${
                isHome
                  ? "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                  : "bg-teal-500 text-white hover:bg-teal-600 active:scale-[0.98]"
              }
            `}
          >
            <Globe size={15} />
            {isHome ? t.drawer.removeLocale : t.drawer.setLocale}
          </button>
        </div>
      </div>
    </>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-slate-700 font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}
