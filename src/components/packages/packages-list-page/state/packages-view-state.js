const PACKAGES_VIEW_STATE_KEY = 'resortPackagesViewStateV1'

const defaultViewState = {
  activeTab: 'daytour',
}

function readPackagesViewState() {
  if (typeof window === 'undefined') return defaultViewState

  try {
    const rawValue = window.sessionStorage.getItem(PACKAGES_VIEW_STATE_KEY)
    if (!rawValue) return defaultViewState

    const parsed = JSON.parse(rawValue)
    if (!parsed || typeof parsed !== 'object') return defaultViewState

    return {
      ...defaultViewState,
      ...parsed,
    }
  } catch {
    return defaultViewState
  }
}

function writePackagesViewState(nextState) {
  if (typeof window === 'undefined') return

  window.sessionStorage.setItem(PACKAGES_VIEW_STATE_KEY, JSON.stringify(nextState))
}

export { readPackagesViewState, writePackagesViewState }
