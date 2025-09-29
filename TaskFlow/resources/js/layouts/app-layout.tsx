import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast, Toaster } from "sonner";
import { useEchoNotification } from "@laravel/echo-react";

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  const { props: inertiaProps } = usePage<{ flash?: { success?: string; error?: string } }>();
  const { flash } = inertiaProps;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  // const userId = inertiaProps.auth?.user?.id;
  // console.log('User ID:', userId);

  // useEchoNotification(
  //   `App.Models.User.${userId}`,
  //   (notification) => {
  //       console.log(notification.type);
  //   },
  // );

  return (
    <>
      <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
      </AppLayoutTemplate>

      <Toaster position="top-center" richColors />
    </>
  );
}
