import { type Meta, type StoryObj } from '@storybook/react'
import TakeABreakPopup from './TakeABreakPopup'

const meta: Meta<typeof TakeABreakPopup> = {
  component: TakeABreakPopup,
}

type Story = StoryObj<typeof TakeABreakPopup>

export const Default: Story = {
  args: {
    breakUntil: new Date().toISOString(),
  },
  argTypes: {
    onAddMoreTime: {
      action: 'added more time',
    },
  },
}

export default meta
