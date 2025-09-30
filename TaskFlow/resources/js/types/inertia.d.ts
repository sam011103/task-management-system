import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps {
    flash?: {
      success?: string;
      error?: string;
      showDialog?: boolean;
    };
    auth?: {
      user?: {
        id: number;
        name: string;
        email: string;
      } | null;
    }
  }
}
