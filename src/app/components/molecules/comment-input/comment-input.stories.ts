import type { Meta, StoryObj } from '@storybook/angular';
import { CommentInputComponent } from './comment-input';

const meta: Meta<CommentInputComponent> = {
  title: 'Molecules/CommentInput',
  component: CommentInputComponent,
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-comment-input { display: block; width: 480px; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<CommentInputComponent>;

export const Default: Story = {
  args: {
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    authorName: 'Sarah Mitchell',
  },
};
