import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Toaster } from "sonner";
import { useEcho } from "@laravel/echo-react";
import { Task } from '@/pages/tasks';
import { toastWithSound } from '@/lib/utils';

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
      toastWithSound("success", flash.success);
    }
    if (flash?.error) {
      toastWithSound("error", flash.error);
    }
  }, [flash]);

  const userId = auth?.user?.id;

  useEcho<TaskEvent>(
    `user.${userId}`,
    'TaskEvent',
    (e) => {
		let message: ReactNode = "";
		let description: "";
		if(e.task.status === 'urgent')
		{
			message = (<>
				Urgent Task! <br />
				{e.task.title} <br />
				</>);
			description = 'Please complete this task by ' + e.task.due_at_formatted + '.';
			toastWithSound("warning", message, description);
		}
		else if(e.task.status === 'overdue')
		{
			message = (<>
				Overdue Task! <br />
				{e.task.title}
				</>);
			description = 'This task was due on ' + e.task.due_at_formatted + '.';
			toastWithSound("error", message, description);
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
