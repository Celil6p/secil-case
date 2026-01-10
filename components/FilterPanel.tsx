"use client";

import { useState } from "react";
import type { Filter, AdditionalFilter } from "@/lib/types";

interface FilterPanelProps {
  filters: Filter[];
  activeFilters: AdditionalFilter[];
  onFilterChange: (filter: AdditionalFilter) => void;
  onFilterRemove: (filterId: string, value: string) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export function FilterPanel({
  filters,
  activeFilters,
  onFilterChange,
  onFilterRemove,
  onClearFilters,
  loading,
}: FilterPanelProps) {
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["color", "category"]);
  const [searchTerm, setSearchTerm] = useState<Record<string, string>>({});

  const toggleFilter = (filterId: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const isFilterActive = (filterId: string, value: string) => {
    return activeFilters.some((f) => f.id === filterId && f.value === value);
  };

  const handleFilterClick = (filter: Filter, value: string) => {
    if (isFilterActive(filter.id, value)) {
      onFilterRemove(filter.id, value);
    } else {
      onFilterChange({
        id: filter.id,
        value,
        comparisonType: filter.comparisonType,
      });
    }
  };

  const getFilteredValues = (filter: Filter) => {
    const search = searchTerm[filter.id]?.toLowerCase() || "";
    if (!search) return filter.values.slice(0, 15);
    return filter.values.filter(
      (v) => v.valueName?.toLowerCase().includes(search) || v.value.toLowerCase().includes(search)
    ).slice(0, 15);
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-[var(--bg-tertiary)] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--info)]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Filtreler</h3>
            {activeFilters.length > 0 && (
              <p className="text-sm text-[var(--text-secondary)]">{activeFilters.length} filtre aktif</p>
            )}
          </div>
        </div>
        {activeFilters.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-[var(--error)] hover:opacity-80 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Temizle
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--info)]/5">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((af, index) => {
              const filter = filters.find((f) => f.id === af.id);
              const filterValue = filter?.values.find((v) => v.value === af.value);
              return (
                <span
                  key={`${af.id}-${af.value}-${index}`}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-sm font-medium bg-[var(--info)]/15 text-[var(--info)]"
                >
                  <span className="opacity-70 text-xs">{filter?.title}:</span>
                  {filterValue?.valueName || af.value}
                  <button
                    onClick={() => onFilterRemove(af.id, af.value)}
                    className="ml-0.5 p-0.5 hover:bg-[var(--info)]/20 rounded-full transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {filters.map((filter) => (
          <div key={filter.id} className="border-b border-[var(--border-color)] last:border-b-0">
            <button
              onClick={() => toggleFilter(filter.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <span className="text-sm font-medium text-[var(--text-primary)]">{filter.title}</span>
              <div className="flex items-center gap-2">
                {activeFilters.filter(f => f.id === filter.id).length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[var(--info)] text-white text-xs flex items-center justify-center">
                    {activeFilters.filter(f => f.id === filter.id).length}
                  </span>
                )}
                <svg
                  className={`w-5 h-5 text-[var(--text-tertiary)] transition-transform duration-200 ${
                    expandedFilters.includes(filter.id) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedFilters.includes(filter.id) && (
              <div className="px-5 pb-4 space-y-3">
                {/* Search within filter */}
                {filter.values.length > 10 && (
                  <div className="relative">
                    <svg className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Ara..."
                      value={searchTerm[filter.id] || ""}
                      onChange={(e) => setSearchTerm({ ...searchTerm, [filter.id]: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--info)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                    />
                  </div>
                )}

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {getFilteredValues(filter).map((value, idx) => (
                    <label
                      key={`${filter.id}-${value.value || idx}-${value.valueName || idx}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isFilterActive(filter.id, value.value)
                          ? "bg-[var(--info)]/10"
                          : "hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isFilterActive(filter.id, value.value)}
                        onChange={() => handleFilterClick(filter, value.value)}
                        className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--info)] focus:ring-[var(--info)] bg-[var(--bg-primary)]"
                      />
                      <span className={`text-sm ${
                        isFilterActive(filter.id, value.value)
                          ? "text-[var(--info)] font-medium"
                          : "text-[var(--text-secondary)]"
                      }`}>
                        {value.valueName || value.value || `Secenek ${idx + 1}`}
                      </span>
                    </label>
                  ))}
                </div>

                {filter.values.length > 15 && (
                  <p className="text-xs text-[var(--text-tertiary)] text-center pt-2">
                    {filter.values.length - 15} daha fazla secenek mevcut
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
