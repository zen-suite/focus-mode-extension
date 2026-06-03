import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FRICTION_DISABLES_PER_LEVEL,
  getProblemsForLevel,
  nextFrictionLevelAfterSuccess,
  normalizeFrictionDisablesPerLevel,
  sanitizeFrictionDisablesPerLevel,
  shouldIncreaseFrictionLevel,
} from './friction-level'

describe(normalizeFrictionDisablesPerLevel, () => {
  it('defaults invalid values to 5', () => {
    expect(normalizeFrictionDisablesPerLevel(undefined)).toBe(
      DEFAULT_FRICTION_DISABLES_PER_LEVEL
    )
    expect(normalizeFrictionDisablesPerLevel(0)).toBe(
      DEFAULT_FRICTION_DISABLES_PER_LEVEL
    )
    expect(normalizeFrictionDisablesPerLevel(-1)).toBe(
      DEFAULT_FRICTION_DISABLES_PER_LEVEL
    )
  })

  it('floors valid positive values', () => {
    expect(normalizeFrictionDisablesPerLevel(3.9)).toBe(3)
  })
})

describe(sanitizeFrictionDisablesPerLevel, () => {
  it('parses numeric input and falls back when invalid', () => {
    expect(sanitizeFrictionDisablesPerLevel('7', 5)).toBe(7)
    expect(sanitizeFrictionDisablesPerLevel('abc', 4)).toBe(4)
  })
})

describe(getProblemsForLevel, () => {
  it('returns at least one problem', () => {
    expect(getProblemsForLevel(0)).toBe(1)
    expect(getProblemsForLevel(2)).toBe(2)
  })
})

describe(shouldIncreaseFrictionLevel, () => {
  it('uses configurable disables per level', () => {
    expect(shouldIncreaseFrictionLevel(4, 5)).toBe(false)
    expect(shouldIncreaseFrictionLevel(5, 5)).toBe(true)
    expect(shouldIncreaseFrictionLevel(3, 3)).toBe(true)
  })
})

describe(nextFrictionLevelAfterSuccess, () => {
  it('increases level after configured disable count', () => {
    expect(nextFrictionLevelAfterSuccess(1, 1, 5)).toBe(1)
    expect(nextFrictionLevelAfterSuccess(1, 5, 5)).toBe(2)
    expect(nextFrictionLevelAfterSuccess(2, 10, 5)).toBe(3)
    expect(nextFrictionLevelAfterSuccess(1, 3, 3)).toBe(2)
  })
})
