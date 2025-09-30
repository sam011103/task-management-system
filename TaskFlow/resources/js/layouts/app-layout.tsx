import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast, Toaster } from "sonner";
import { useEcho } from "@laravel/echo-react";
import { Task } from '@/pages/tasks';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export type TaskEvent = {
  task: Task;
};

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  const { props: inertiaProps } = usePage();
  const { flash, auth } = inertiaProps;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const userId = auth?.user?.id;

  useEcho<TaskEvent>(
    `user.${userId}`,
    'TaskEvent',
    (e) => {
        if(e.task.status === 'urgent')
        {
          toast.warning(<>
            Urgent Task! <br />
            {e.task.title} <br />
          </>, {
            description: 'Please complete this task by ' + e.task.due_at_formatted + '.',
            duration: 6000,
            icon: '⚡',
          })
        }
        else if(e.task.status === 'overdue')
        {
          toast.error(<>
            Overdue Task! <br />
            {e.task.title}
          </>, {
            duration: 6000,
            icon: '⏰',
          })
        }
    },
  );

  return (
    <>
      <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
      </AppLayoutTemplate>

      <Toaster position="top-center" richColors />
    </>
  );
}
