import type { Meta, StoryObj } from '@storybook/react';
import { Weather } from '../components/Weather';

const meta: Meta<typeof Weather> = {
  title: 'Components/Weather',
  component: Weather,
  args: { city: 'London' }
};
export default meta;

type Story = StoryObj<typeof Weather>;

export const Default: Story = {};
