import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StrongFrictionDialog } from './StrongFrictionDialog'

const mockProblem = {
  expression: '(2 + 2) * 2 / 2 - 1',
  answer: 3,
}

const mockGenerateArithmeticProblem = vi.hoisted(() => vi.fn(() => mockProblem))

const mockIsAnswerCorrect = vi.hoisted(() =>
  vi.fn(
    (problem: { answer: number }, userInput: string) =>
      userInput.trim() === String(problem.answer)
  )
)

vi.mock('../domain/strong-friction/arithmetic-problem', () => ({
  generateArithmeticProblem: mockGenerateArithmeticProblem,
  isAnswerCorrect: mockIsAnswerCorrect,
}))

describe(StrongFrictionDialog, () => {
  beforeEach(() => {
    mockGenerateArithmeticProblem.mockClear()
    mockGenerateArithmeticProblem.mockImplementation(() => mockProblem)
    mockIsAnswerCorrect.mockClear()
    mockIsAnswerCorrect.mockImplementation(
      (problem: { answer: number }, userInput: string) =>
        userInput.trim() === String(problem.answer)
    )
  })

  it('calls onCancel without confirming', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()

    render(
      <StrongFrictionDialog
        open
        problemCount={1}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('confirms when all answers are correct', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <StrongFrictionDialog
        open
        problemCount={1}
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    )

    expect(await screen.findByText(/problem 1:/i)).not.toBeNull()
    await user.type(screen.getByLabelText(/your answer/i), '3')
    await user.click(screen.getByRole('button', { name: /confirm disable/i }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('shows an error and does not confirm when an answer is wrong', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <StrongFrictionDialog
        open
        problemCount={1}
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    )

    expect(await screen.findByText(/problem 1:/i)).not.toBeNull()
    await user.type(screen.getByLabelText(/your answer/i), '99')
    await user.click(screen.getByRole('button', { name: /confirm disable/i }))

    expect(
      screen.getByText(/one or more answers are incorrect/i)
    ).not.toBeNull()
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
