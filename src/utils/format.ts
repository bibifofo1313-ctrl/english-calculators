export const formatCurrency = (value: number, digits = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)

export const formatNumber = (value: number, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value)

export const formatPercent = (value: number, digits = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100)

export const formatYearsAndMonths = (months: number) => {
  if (!Number.isFinite(months) || months <= 0) return '0 months'
  const rounded = Math.ceil(months)
  const years = Math.floor(rounded / 12)
  const remainingMonths = rounded % 12
  const parts = []
  if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`)
  if (remainingMonths > 0) parts.push(`${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`)
  return parts.join(' ') || '0 months'
}
