import type { Meta, StoryObj } from '@storybook/angular';
import { PostStatsComponent } from './post-stats';

const meta: Meta<PostStatsComponent> = {
  title: 'Atoms/PostStats',
  component: PostStatsComponent,
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-post-stats { display: block; width: 480px; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<PostStatsComponent>;

const stats = { likes: 124, comments: 8, shares: 7 };

export const Default: Story = {
  args: { stats, liked: false },
};

export const Liked: Story = {
  args: { stats, liked: true },
};

export const ZeroCounts: Story = {
  args: { stats: { likes: 0, comments: 0, shares: 0 }, liked: false },
};
