import type { Meta, StoryObj } from '@storybook/angular';
import type { Post } from '@src/app/interfaces/post.interface';
import { PostCardComponent } from './post-card';

const basePost: Post = {
  id: '1',
  type: 'image',
  content: 'Just finished an amazing hike in the mountains! The view from the top was absolutely breathtaking. Sometimes you need to disconnect to reconnect.',
  author: {
    id: 'u1',
    name: 'Sarah Mitchell',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  createdAt: '2 hours ago',
  meta: 'Yosemite',
  image: {
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1470&q=80',
    alt: 'Mountain landscape at sunset',
    caption: 'Sony A7III',
  },
  stats: { likes: 124, comments: 8, shares: 7 },
  liked: false,
  tagged: false,
};

const meta: Meta<PostCardComponent> = {
  title: 'Organisms/PostCard',
  component: PostCardComponent,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: ['::ng-deep app-post-card { max-width: 520px; display: block; }'],
    }),
  ],
};

export default meta;
type Story = StoryObj<PostCardComponent>;

export const Default: Story = {
  args: {
    post: basePost,
  },
};

export const Liked: Story = {
  args: {
    post: { ...basePost, liked: true },
  },
};

export const Tagged: Story = {
  args: {
    post: { ...basePost, tagged: true },
  },
};

export const LikedAndTagged: Story = {
  args: {
    post: { ...basePost, liked: true, tagged: true },
  },
};

export const ArticlePost: Story = {
  args: {
    post: {
      ...basePost,
      type: 'article',
      image: undefined,
      content: 'Great read on the latest trends in web development. Highly recommend this article!',
      article: {
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
        title: 'The Future of Web Development in 2026',
        description: 'An in-depth look at emerging technologies and frameworks shaping the web.',
        label: 'Tech Blog',
      },
    },
  },
};

export const WithoutCommentAction: Story = {
  args: {
    post: basePost,
    showCommentAction: false,
  },
};
