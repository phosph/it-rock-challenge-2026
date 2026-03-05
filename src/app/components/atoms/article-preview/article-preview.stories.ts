import type { Meta, StoryObj } from '@storybook/angular';
import { ArticlePreviewComponent } from './article-preview';

const meta: Meta<ArticlePreviewComponent> = {
  title: 'Atoms/ArticlePreview',
  component: ArticlePreviewComponent,
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-article-preview { display: block; max-width: 520px; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<ArticlePreviewComponent>;

export const WithLabel: Story = {
  args: {
    article: {
      imageUrl:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
      title: 'The Future of Web Development in 2026',
      description:
        'An in-depth look at emerging technologies and frameworks shaping the web development landscape.',
      label: 'Tech Blog',
    },
  },
};

export const WithoutLabel: Story = {
  args: {
    article: {
      imageUrl:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
      title: 'Understanding Modern CSS Architecture',
      description:
        'A comprehensive guide to organizing and scaling CSS in large applications using modern methodologies.',
    },
  },
};
