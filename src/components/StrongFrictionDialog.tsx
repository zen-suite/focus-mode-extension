import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  generateArithmeticProblem,
  isAnswerCorrect,
  type IArithmeticProblem,
} from '../domain/strong-friction/arithmetic-problem'

interface IStrongFrictionDialogProps {
  open: boolean
  problemCount: number
  onCancel: () => void
  onConfirm: () => void | Promise<void>
}

function createProblems(count: number): IArithmeticProblem[] {
  return Array.from({ length: count }, () =>
    generateArithmeticProblem()
  ).filter((problem): problem is IArithmeticProblem => problem !== undefined)
}

export function StrongFrictionDialog(props: IStrongFrictionDialogProps) {
  const [problems, setProblems] = useState<IArithmeticProblem[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!props.open || props.problemCount < 1) {
      return
    }
    const nextProblems = createProblems(props.problemCount)
    setProblems(nextProblems)
    setAnswers(nextProblems.map(() => ''))
    setErrorMessage(undefined)
    setSubmitting(false)
  }, [props.open, props.problemCount])

  const problemsReady = problems.length === props.problemCount

  async function handleConfirm() {
    if (!problemsReady) {
      return
    }

    const allCorrect = problems.every((problem, index) =>
      isAnswerCorrect(problem, answers[index] ?? '')
    )

    if (!allCorrect) {
      setErrorMessage(
        'One or more answers are incorrect. Try again with new problems.'
      )
      const nextProblems = createProblems(props.problemCount)
      setProblems(nextProblems)
      setAnswers(nextProblems.map(() => ''))
      return
    }

    try {
      setSubmitting(true)
      await props.onConfirm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={props.onCancel} open={props.open}>
      <DialogTitle>Solve to disable blocking</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography color="text.secondary" variant="body2">
            Blocking stays on until you solve every problem below.
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {problems.map((problem, index) => {
            if (!problem) {
              return null
            }

            return (
              <Stack key={index} spacing={1}>
                <Typography variant="subtitle2">
                  Problem {index + 1}: {problem.expression}
                </Typography>
                <TextField
                  autoComplete="off"
                  inputMode="numeric"
                  label="Your answer"
                  onChange={(event) => {
                    const nextAnswers = [...answers]
                    nextAnswers[index] = event.target.value
                    setAnswers(nextAnswers)
                    setErrorMessage(undefined)
                  }}
                  size="small"
                  value={answers[index] ?? ''}
                />
              </Stack>
            )
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button disabled={submitting} onClick={props.onCancel}>
          Cancel
        </Button>
        <Button
          disabled={submitting || !problemsReady}
          onClick={handleConfirm}
          variant="contained"
        >
          Confirm disable
        </Button>
      </DialogActions>
    </Dialog>
  )
}
