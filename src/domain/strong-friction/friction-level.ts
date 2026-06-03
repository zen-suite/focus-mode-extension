export const DEFAULT_FRICTION_DISABLES_PER_LEVEL = 5

export function normalizeFrictionDisablesPerLevel(
  value: number | undefined
): number {
  if (value === undefined || !Number.isFinite(value) || value < 1) {
    return DEFAULT_FRICTION_DISABLES_PER_LEVEL
  }
  return Math.floor(value)
}

export function sanitizeFrictionDisablesPerLevel(
  input: string,
  fallback: number
): number {
  const parsed = Number.parseInt(input, 10)
  if (Number.isNaN(parsed)) {
    return normalizeFrictionDisablesPerLevel(fallback)
  }
  return normalizeFrictionDisablesPerLevel(parsed)
}

export function getProblemsForLevel(frictionLevel: number): number {
  return Math.max(1, frictionLevel)
}

export function nextFrictionLevelAfterSuccess(
  currentLevel: number,
  disableCountAfterIncrement: number,
  disablesPerLevel: number
): number {
  const threshold = normalizeFrictionDisablesPerLevel(disablesPerLevel)
  if (disableCountAfterIncrement % threshold === 0) {
    return currentLevel + 1
  }
  return currentLevel
}

export function shouldIncreaseFrictionLevel(
  disableCountAfterIncrement: number,
  disablesPerLevel: number
): boolean {
  const threshold = normalizeFrictionDisablesPerLevel(disablesPerLevel)
  return disableCountAfterIncrement % threshold === 0
}
