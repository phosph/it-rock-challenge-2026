import type { Meta, StoryObj } from '@storybook/angular';
import { QuoteBlockComponent } from './quote-block';

const meta: Meta<QuoteBlockComponent> = {
  title: 'Atoms/QuoteBlock',
  component: QuoteBlockComponent,
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-quote-block { display: block; max-width: 520px; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<QuoteBlockComponent>;

export const Default: Story = {
  args: {
    quote: 'The only way to do great work is to love what you do.',
  },
};

export const LongQuote: Story = {
  args: {
    quote:
      'In the middle of every difficulty lies opportunity. The important thing is not to stop questioning. Curiosity has its own reason for existing.',
  },
};
