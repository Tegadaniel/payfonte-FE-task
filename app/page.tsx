"use client";

import { useState, useEffect, useRef } from "react";
import { useCountries } from "@/hooks/useCountries";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocale } from "@/hooks/useLocale";
import { useI18n, type Locale } from "@/contexts/I18nContext";
import { Country, FilterKey } from "@/types/country";
import { PayfonteLogo } from "@/components/PayfonteLogo";
import { SearchBar } from "@/components/SearchBar";
import { CountryCard } from "@/components/CountryCard";
import { CountryDrawer } from "@/components/CountryDrawer";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { LayoutGrid, LayoutList } from "lucide-react";

type ViewMode = "list" | "grid";

function loadViewMode(): ViewMode {
  if (typeof window === "undefined") return "list";
  return (localStorage.getItem("payfonte_view") as ViewMode) ?? "list";
}

const PAGE_SIZE = 20;
const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export default function CountriesPage() {
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState<FilterKey>("name");
  const [selected, setSelected] = useState<Country | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode);

  const { locale, setLocale, t } = useI18n();
  const { homeCountry, setHomeCountry, localeTag } = useLocale();
  const debouncedQuery = useDebounce(query, 300);
  const { filtered, data, isLoading, isError, error, refetch } = useCountries({
    query: debouncedQuery,
    filterBy,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedQuery, filterBy]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount((prev) => prev + PAGE_SIZE);
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered]);

  function handleViewMode(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem("payfonte_view", mode);
  }

  const visibleCountries = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <PayfonteLogo width={100} />

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-full p-0.5">
                {LOCALES.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => setLocale(code)}
                    className={`
                      px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer
                      ${
                        locale === code
                          ? "bg-white text-teal-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 rounded-full">
                {homeCountry ? (
                  <>
                    <span className="text-sm">{homeCountry.flag}</span>
                    <span className="text-xs font-semibold text-teal-600">
                      {homeCountry.locale}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-teal-600">
                    {typeof navigator !== "undefined"
                      ? navigator.language
                      : "en-US"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <SearchBar
            query={query}
            filterBy={filterBy}
            onQueryChange={setQuery}
            onFilterChange={(f) => {
              setFilterBy(f);
              setQuery("");
            }}
            total={data?.length ?? 0}
            filtered={filtered.length}
          />
        </div>
      </header>

      <section className="max-w-lg mx-auto px-4 py-4">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            message={(error as Error)?.message}
            onRetry={() => refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState query={debouncedQuery} onClear={() => setQuery("")} />
        ) : (
          <>
            <div className="flex items-center justify-end mb-3">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
                <button
                  onClick={() => handleViewMode("list")}
                  aria-label="List view"
                  className={`
                    p-1.5 rounded-lg transition-all duration-150 cursor-pointer
                    ${
                      viewMode === "list"
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }
                  `}
                >
                  <LayoutList size={15} />
                </button>
                <button
                  onClick={() => handleViewMode("grid")}
                  aria-label="Grid view"
                  className={`
                    p-1.5 rounded-lg transition-all duration-150 cursor-pointer
                    ${
                      viewMode === "grid"
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }
                  `}
                >
                  <LayoutGrid size={15} />
                </button>
              </div>
            </div>

            <ul
              className={
                viewMode === "grid" ? "grid grid-cols-2 gap-2.5" : "space-y-2.5"
              }
            >
              {visibleCountries.map((country) => (
                <li key={`${country.code}-${country.locale}`}>
                  <CountryCard
                    country={country}
                    onClick={setSelected}
                    variant={viewMode}
                  />
                </li>
              ))}
            </ul>

            {hasMore && (
              <div ref={sentinelRef} className="py-6 flex justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-teal-300 border-t-teal-500 animate-spin" />
              </div>
            )}

            {!hasMore && filtered.length > PAGE_SIZE && (
              <p className="text-center text-xs text-slate-400 py-6">
                {t.states.allLoaded.replace(
                  "{{count}}",
                  String(filtered.length),
                )}
              </p>
            )}
          </>
        )}
      </section>

      <CountryDrawer
        country={selected}
        onClose={() => setSelected(null)}
        homeCountry={homeCountry}
        onSetHomeCountry={setHomeCountry}
        localeTag={localeTag}
      />
    </main>
  );
}
