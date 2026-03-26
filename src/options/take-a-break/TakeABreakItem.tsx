import { Button, Card, CardActions, CardContent, Stack } from '@mui/material'
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
        <Stack spacing={2}>
          {props.disabled && (
            <PomodoroActiveNotice
              title="Pomodoro is active"
              description="Pomodoro currently controls website blocking, so break controls are unavailable."
            />
          )}
          <TimePicker
            label="Blocking resumes at"
            value={breakTime}
            disabled={props.disabled}
            onChange={(val) => {
              setBreakTime(val)
            }}
            sx={{ width: '100%' }}
          />
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {[
              { text: '+1 hour', unit: 'hour', value: 1 },
              { text: '+45 min', unit: 'minute', value: 45 },
              { text: '+30 min', unit: 'minute', value: 30 },
              { text: '+15 min', unit: 'minute', value: 15 },
            ].map(({ text, unit, value }) => (
              <Button
                key={text}
                size="small"
                disabled={props.disabled}
                onClick={() => {
                  onQuickButtonClick({ unit: unit as ManipulateType, value })
                }}
              >
                {text}
              </Button>
            ))}
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2 }}>
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
