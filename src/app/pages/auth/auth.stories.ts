import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { provideMockAuthService } from '@src/app/services/auth';
import AuthPage from './auth';

const meta: Meta<AuthPage> = {
  title: 'Pages/Login',
  component: AuthPage,
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        provideMockAuthService(),
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<AuthPage>;

export const Default: Story = {};
