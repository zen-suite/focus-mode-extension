import { describe, expect, it } from 'vitest'
import {
  evaluateExpression,
  generateArithmeticProblem,
  isAnswerCorrect,
} from './arithmetic-problem'

describe(evaluateExpression, () => {
  it('evaluates expressions with parentheses and operator precedence', () => {
    expect(evaluateExpression('(6 + 2) * 3 / 4 - 1')).toBe(5)
    expect(evaluateExpression('10 - 3 * 2')).toBe(4)
    expect(evaluateExpression('8 / 2 + 3')).toBe(7)
  })
})

describe(generateArithmeticProblem, () => {
  it('includes required operators and parentheses', () => {
    const problem = generateArithmeticProblem()
    expect(problem.expression).toMatch(/\+/)
    expect(problem.expression).toMatch(/-/)
    expect(problem.expression).toMatch(/\*/)
    expect(problem.expression).toMatch(/\//)
    expect(problem.expression).toMatch(/\(/)
    expect(problem.expression).toMatch(/\)/)
  })

  it('matches stored answer when evaluated', () => {
    const problem = generateArithmeticProblem()
    expect(evaluateExpression(problem.expression)).toBe(problem.answer)
    expect(Number.isInteger(problem.answer)).toBe(true)
  })
})

describe(isAnswerCorrect, () => {
  it('accepts matching integer answers only', () => {
    const problem = { expression: '2 + 2', answer: 4 }
    expect(isAnswerCorrect(problem, '4')).toBe(true)
    expect(isAnswerCorrect(problem, '5')).toBe(false)
    expect(isAnswerCorrect(problem, '')).toBe(false)
    expect(isAnswerCorrect(problem, '4.0')).toBe(false)
  })
})
