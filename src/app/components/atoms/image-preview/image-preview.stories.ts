import type { Meta, StoryObj } from '@storybook/angular';
import { ImagePreviewComponent } from './image-preview';

const meta: Meta<ImagePreviewComponent> = {
  title: 'Atoms/ImagePreview',
  component: ImagePreviewComponent,
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-image-preview { display: block; max-width: 520px; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<ImagePreviewComponent>;

export const WithCaption: Story = {
  args: {
    image: {
      imageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1470&q=80',
      alt: 'Mountain landscape at sunset',
      caption: 'Sony A7III',
    },
  },
};

export const WithoutCaption: Story = {
  args: {
    image: {
      imageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1470&q=80',
      alt: 'Mountain landscape at sunset',
    },
  },
};
