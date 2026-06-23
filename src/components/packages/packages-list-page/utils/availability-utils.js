export function getTodayISODate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getStayNightsByTab(activeTab) {
  return activeTab === 'overnight' ? 1 : 0
}

export function addDaysToISODate(isoDate, daysToAdd) {
  if (!isoDate) return ''

  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''

  date.setDate(date.getDate() + daysToAdd)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isItemAvailableForDate(item, checkInDate) {
  if (!checkInDate) return false

  const blockedDates = item.availability?.unavailableCheckInDates ?? []
  return !blockedDates.includes(checkInDate)
}
