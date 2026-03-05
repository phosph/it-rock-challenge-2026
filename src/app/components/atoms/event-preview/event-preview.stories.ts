import type { Meta, StoryObj } from '@storybook/angular';
import { EventPreviewComponent } from './event-preview';

const meta: Meta<EventPreviewComponent> = {
  title: 'Atoms/EventPreview',
  component: EventPreviewComponent,
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-event-preview { display: block; max-width: 520px; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<EventPreviewComponent>;

export const Default: Story = {
  args: {
    event: {
      imageUrl:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1470&q=80',
      title: 'Tech Conference 2026',
      location: 'San Francisco, CA',
      date: 'March 15, 2026',
    },
  },
};
