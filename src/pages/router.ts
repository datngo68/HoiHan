/** Detect which page to render based on ?page= URL param */
export type AppPage = 'game' | 'login' | 'create' | 'dashboard'

export function detectPage(): AppPage {
  const params = new URLSearchParams(window.location.search)
  const page = params.get('page')

  if (page === 'login') return 'login'
  if (page === 'create') return 'create'
  if (page === 'dashboard') return 'dashboard'

  return 'game' // default: existing love-trap game
}

/** Navigate to a page by updating URL */
export function navigateTo(page: AppPage, extra?: Record<string, string>) {
  const url = new URL(window.location.href)
  // Clear all current params except ?id (shareable game link)
  const id = url.searchParams.get('id')
  url.search = ''

  if (page !== 'game') {
    url.searchParams.set('page', page)
  } else if (id) {
    url.searchParams.set('id', id)
  }

  if (extra) {
    Object.entries(extra).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  window.location.href = url.toString()
}
