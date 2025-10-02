import AppLayout, { TaskEvent } from '@/layouts/app-layout';
import { tasksIndex, tasksCreate } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, router } from '@inertiajs/core';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

import { DataTable } from "./data-table"
import { columns } from './columns'
import { useEffect, useState } from 'react';
import { TodoList } from '../todo-list';
import { useEcho } from '@laravel/echo-react';

export type Task = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    status_formatted: string;
    due_at_formatted: string | null;
    time_estimate_formatted: string;
    time_remaining_formatted: string;
    progress: number;
    importance_level_formatted: string;
    complete_at_formatted: string;
    today_list: TodoList[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasksIndex().url,
    },
];

export default function Index({tasks}: {tasks: Task[]}) {
    const { props: inertiaProps } = usePage();
    const { auth } = inertiaProps;
    const userId = auth?.user?.id;

    useEcho<TaskEvent>(
        `user.${userId}`,
        'TaskEvent',
        () => {
            router.reload({ replace: true });
        },
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-2 sm:p-4">
                <Card className="border-none shadow-none">
                    <CardHeader className="flex-row items-center justify-between px-0 sm:px-6">
                        <CardTitle>Tasks List</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        <CardDescription className="font-bold">Note: Select tasks to add to today's list.</CardDescription>
                        <DataTable 
                            columns={columns} 
                            data={tasks} 
                            enableRowSelection={row => row.original.progress < 100 && !row.original.today_list}  
                        />
                        {/* <<Table className="overflow-x-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Due Time</TableHead>
                                    <TableHead>Time Estimate</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((item, key) => (
                                    <TableRow key={item.id} className="items-center">
                                        <TableCell className="font-medium">{key + 1}</TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.description ? item.description : "-"}</TableCell>
                                        <TableCell>{item.priority_formatted}</TableCell>
                                        <TableCell>{item.status_formatted}</TableCell>
                                      
                                        <TableCell>{item.due_time_formatted}</TableCell>
                                        <TableCell>{item.time_estimate_formatted}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Root className="relative h-4 w-20 overflow-hidden rounded-full bg-gray-200">
                                                <Indicator
                                                    className="h-full bg-green-600 transition-all duration-500 ease-in-out"
                                                    style={{ width: item.progress > 0 ? `${item.progress}%` : "0%" }}
                                                />
                                                </Root>
                                                <span>{item.progress}%</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="flex gap-2">
                                            <EditIcon 
                                                action={tasksEdit(item).url} 
                                                disabled={item.progress === 100}
                                            />
                                            <DeleteIcon action={tasksDestroy(item).url} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>> */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>

        
    );
}