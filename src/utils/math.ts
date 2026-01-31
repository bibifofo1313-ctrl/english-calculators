export const toNumber = (value: string) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

export const isPositive = (value: number) => Number.isFinite(value) && value > 0

export const isNonNegative = (value: number) => Number.isFinite(value) && value >= 0
