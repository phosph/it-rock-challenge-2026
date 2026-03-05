import type { Meta, StoryObj } from '@storybook/angular';
import { AvatarComponent } from './avatar';

const meta: Meta<AvatarComponent> = {
  title: 'Atoms/Avatar',
  component: AvatarComponent,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<AvatarComponent>;

const avatarUrl =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export const Small: Story = {
  args: { src: avatarUrl, alt: 'User avatar', size: 'sm' },
};

export const Medium: Story = {
  args: { src: avatarUrl, alt: 'User avatar', size: 'md' },
};

export const Large: Story = {
  args: { src: avatarUrl, alt: 'User avatar', size: 'lg' },
};
