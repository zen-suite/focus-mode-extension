import { type Meta, type StoryObj } from '@storybook/react'
import TakeABreakPopup from './TakeABreakPopup'

const meta: Meta<typeof TakeABreakPopup> = {
  component: TakeABreakPopup,
}

type Story = StoryObj<typeof TakeABreakPopup>

export const Default: Story = {
  render: () => {
    return <TakeABreakPopup breakUntil={new Date().toISOString()} />
  },
}

export default meta
