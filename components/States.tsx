"use client";

import { useI18n } from "@/contexts/I18nContext";
import { AlertCircle, Globe, SearchX } from "lucide-react";

export function LoadingState() {
  const { t } = useI18n();
  return (
    <div className="space-y-3" aria-label={t.states.loading} aria-busy>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 animate-pulse"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 rounded-full w-2/5" />
            <div className="h-2.5 bg-slate-100 rounded-full w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <h3 className="font-semibold text-slate-700 mb-1">{t.states.errorTitle}</h3>
      <p className="text-sm text-slate-400 mb-5 max-w-xs">
        {message ?? t.states.errorMessage}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            px-5 py-2 rounded-xl bg-teal-500 text-white text-sm font-semibold
            hover:bg-teal-600 active:scale-95 transition-all duration-150 cursor-pointer
          "
        >
          {t.states.retry}
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  query?: string;
  onClear?: () => void;
}

export function EmptyState({ query, onClear }: EmptyStateProps) {
  const { t } = useI18n();
  const hasQuery = Boolean(query?.trim());

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
        {hasQuery ? (
          <SearchX size={24} className="text-slate-400" />
        ) : (
          <Globe size={24} className="text-slate-400" />
        )}
      </div>
      <h3 className="font-semibold text-slate-700 mb-1">
        {hasQuery ? t.states.noMatchTitle : t.states.emptyTitle}
      </h3>
      <p className="text-sm text-slate-400 mb-5 max-w-xs">
        {hasQuery
          ? t.states.noMatchMessage.replace("{{query}}", query ?? "")
          : t.states.emptyMessage}
      </p>
      {hasQuery && onClear && (
        <button
          onClick={onClear}
          className="
            px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold
            hover:border-teal-300 hover:text-teal-600 active:scale-95 transition-all duration-150 cursor-pointer
          "
        >
          {t.states.clearSearch}
        </button>
      )}
    </div>
  );
}
