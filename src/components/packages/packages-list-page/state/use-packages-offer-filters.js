import { useEffect, useMemo, useState } from 'react'
import { defaultFilters } from '../utils/offers-logic'

const OFFERS_FILTERS_STORAGE_KEY = 'resortPackagesOffersFiltersV1'

function readStoredFilters() {
  if (typeof window === 'undefined') return {}

  try {
    const rawValue = window.localStorage.getItem(OFFERS_FILTERS_STORAGE_KEY)
    if (!rawValue) return {}
    const parsed = JSON.parse(rawValue)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function normalizeFilters(entry) {
  if (!entry || typeof entry !== 'object') return defaultFilters

  return {
    sortBy: typeof entry.sortBy === 'string' ? entry.sortBy : defaultFilters.sortBy,
    paxValue: typeof entry.paxValue === 'string' ? entry.paxValue : defaultFilters.paxValue,
    checkInDate: typeof entry.checkInDate === 'string' ? entry.checkInDate : defaultFilters.checkInDate,
  }
}

export default function usePackagesOfferFilters(activeTab) {
  const [filtersByTab, setFiltersByTab] = useState(() => readStoredFilters())

  const activeFilters = useMemo(() => normalizeFilters(filtersByTab?.[activeTab]), [filtersByTab, activeTab])

  const updateActiveFilters = (patch) => {
    setFiltersByTab((prev) => ({
      ...prev,
      [activeTab]: {
        ...normalizeFilters(prev?.[activeTab]),
        ...patch,
      },
    }))
  }

  const clearAllFilters = () => {
    updateActiveFilters(defaultFilters)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(OFFERS_FILTERS_STORAGE_KEY, JSON.stringify(filtersByTab))
  }, [filtersByTab])

  return {
    activeFilters,
    updateActiveFilters,
    clearAllFilters,
  }
}
