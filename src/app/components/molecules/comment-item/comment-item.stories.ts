import type { Meta, StoryObj } from '@storybook/angular';
import { CommentItemComponent } from './comment-item';

const meta: Meta<CommentItemComponent> = {
  title: 'Molecules/CommentItem',
  component: CommentItemComponent,
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-comment-item { display: block; width: 480px; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<CommentItemComponent>;

export const Default: Story = {
  args: {
    comment: {
      id: 'c1',
      author: {
        id: 'u2',
        name: 'Alex Johnson',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      content: 'This is an amazing post! Really loved the photos.',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  },
};

export const LongComment: Story = {
  args: {
    comment: {
      id: 'c2',
      author: {
        id: 'u3',
        name: 'Maria Garcia',
        avatarUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      content:
        'I completely agree with everything you said here. This is such an insightful perspective and I think more people need to hear about it. Thanks for sharing your thoughts!',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  },
};
