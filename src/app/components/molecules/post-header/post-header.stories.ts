import type { Meta, StoryObj } from '@storybook/angular';
import { PostHeaderComponent } from './post-header';

const meta: Meta<PostHeaderComponent> = {
  title: 'Molecules/PostHeader',
  component: PostHeaderComponent,
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-post-header { display: block; width: 480px; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<PostHeaderComponent>;

const author = {
  id: 'u1',
  name: 'Sarah Mitchell',
  avatarUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const Default: Story = {
  args: {
    author,
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
};

export const WithMeta: Story = {
  args: {
    author,
    timeAgo: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    meta: 'Yosemite',
    highlightMeta: true,
  },
};

export const Tagged: Story = {
  args: {
    author,
    timeAgo: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    tagged: true,
  },
};
