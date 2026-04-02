const PACKAGES_VIEW_STATE_KEY = 'resortPackagesViewStateV1'

const defaultViewState = {
  activeTab: 'daytour',
  scrollTopByTab: {},
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
      scrollTopByTab:
        parsed.scrollTopByTab && typeof parsed.scrollTopByTab === 'object'
          ? parsed.scrollTopByTab
          : defaultViewState.scrollTopByTab,
    }
  } catch {
    return defaultViewState
  }
}

function writePackagesViewState(nextState) {
  if (typeof window === 'undefined') return

  window.sessionStorage.setItem(PACKAGES_VIEW_STATE_KEY, JSON.stringify(nextState))
}

function getSavedScrollTop(activeTab) {
  const state = readPackagesViewState()
  const savedScrollTop = state.scrollTopByTab?.[activeTab]

  return Number.isFinite(savedScrollTop) ? savedScrollTop : 0
}

export { defaultViewState, getSavedScrollTop, readPackagesViewState, writePackagesViewState }