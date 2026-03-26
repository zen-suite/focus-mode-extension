import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers'
import dayjs, { type ManipulateType, type Dayjs } from 'dayjs'
import { useState } from 'react'
import { PomodoroActiveNotice } from '../../components/PomodoroActiveNotice'

interface IProps {
  onSetBreakTime: (breakTime: Dayjs) => void | Promise<void>
  disabled?: boolean
}

export default function (props: IProps) {
  return <TakeABreakItem {...props} />
}

export function TakeABreakItem(props: IProps) {
  const [breakTime, setBreakTime] = useState<Dayjs | null>(dayjs())

  function onQuickButtonClick({
    unit,
    value,
  }: {
    unit: ManipulateType
    value: number
  }) {
    setBreakTime(
      breakTime ? breakTime.add(value, unit) : dayjs().add(value, unit)
    )
  }
  return (
    <Card>
      <CardContent>
        <Typography
          variant="caption"
          sx={{
            mb: 2,
          }}
          component="p"
          color="text.secondary"
        >
          This section contains configuration for taking a break. By taking a
          break, the extension will temporarily disable blocking for specified
          period of time and resume blocking after break is over.
        </Typography>
        {props.disabled && (
          <Box mb={2}>
            <PomodoroActiveNotice
              title="Pomodoro is active"
              description="Pomodoro currently controls website blocking, so break controls are unavailable."
            />
          </Box>
        )}
        <Typography>Take a break till:</Typography>
        <TimePicker
          value={breakTime}
          disabled={props.disabled}
          onChange={(val) => {
            setBreakTime(val)
          }}
          sx={{
            my: 2,
          }}
        />
        <Box>
          {[
            { text: '+1 hour', unit: 'hour', value: 1 },
            { text: '+45 minutes', unit: 'minute', value: 45 },
            { text: '+30 minutes', unit: 'minute', value: 30 },
            { text: '+15 minutes', unit: 'minute', value: 15 },
          ].map(({ text, unit, value }) => {
            return (
              <Button
                sx={{ mr: 2 }}
                key={text}
                disabled={props.disabled}
                onClick={() => {
                  onQuickButtonClick({ unit: unit as ManipulateType, value })
                }}
              >
                {text}
              </Button>
            )
          })}
        </Box>
      </CardContent>
      <CardActions
        sx={{
          px: 2,
        }}
      >
        <Button
          variant="contained"
          disabled={props.disabled}
          onClick={() => {
            if (!breakTime) {
              return
            }
            props.onSetBreakTime(breakTime)
          }}
        >
          Set break time
        </Button>
      </CardActions>
    </Card>
  )
}
