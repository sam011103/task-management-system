import AppLayout from '@/layouts/app-layout';
import { todoListIndex } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { PageProps } from '@inertiajs/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Root, Indicator, } from "@radix-ui/react-progress";
import EditIcon from '@/components/icons/edit-icon';
import DeleteIcon from '@/components/icons/delete-icon';
import { tasksEdit, taskRemoveFromList } from '@/routes';
import { Task } from '../tasks';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { SquareCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Todo List',
        href: todoListIndex().url,
    },
];

export type TodoList = {
    id: number,
    date: string,
    tasks: Task[],
    completed_count: number,
    task_count: number
}

interface Props extends PageProps {
    list: TodoList;
}

export default function Index({ list }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Todo List" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-2 sm:p-4">
                <Card className="border-none shadow-none">
                    <CardHeader className="flex-row items-center px-0 sm:px-6">
                        {
                            list ? (
                                <>
                                    <CardTitle>Todo List ({list.date}) {list.task_count > 0 && `(${list.completed_count}/${list.task_count})`}</CardTitle>
                                    <div className='flex ml-auto gap-2'>
                                        <Button variant='secondary' size="sm" className='mr-2' onClick={() =>{}}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() =>{}}>
                                            Clear List
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <CardTitle>Todo List ({new Date().toISOString().split('T')[0]})</CardTitle>
                            )
                        }
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        {
                            (!list || list.tasks.length === 0) ? (
                                <p>No tasks in the list.</p>
                            ) : null
                        }
                        <ul role="list">
                            {list?.tasks?.map((task) => (
                                <Card key={task.id} className="flex-row gap-x-6 p-5 items-center mb-2 justify-start">
                                    <div className="flex-col min-w-0 gap-x-4 w-1/2">
                                        <div className="min-w-0 flex-row">
                                            <p className="text-sm/6 font-semibold text-gray-900">{task.title}</p>
                                            <p className="mt-1 text-xs/5 text-gray-500">{task.description}</p>
                                        </div>
                                    </div>
                                    <div className='hidden sm:flex items-center gap-2 w-[250px]'>
                                        <Root className="relative h-4 w-20 overflow-hidden rounded-full bg-gray-200">
                                            <Indicator
                                                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-in-out"
                                                style={{ width: task.progress > 0 ? `${task.progress}%` : "0%" }}
                                            />
                                        </Root>
                                        <span className='text-sm'>{task.progress}%</span>
                                        <p className='text-sm'>({task.time_remaining_formatted})</p>
                                    </div>
                                    <div className='w-[80px]'>
                                        <p className='text-sm'>12.00 pm</p>
                                    </div>
                                    <div className="ml-auto w-25">
                                        {
                                            task.progress < 100 ? (
                                                <Button size="sm" className='mx-auto'>Complete</Button>
                                            ) : (
                                                <SquareCheck size={36} className='mx-auto' />
                                            )
                                        }
                                    </div>
                                </Card>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                {/* <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">#</th>
                        <th className="px-4 py-2 border">Title</th>
                        <th className="px-4 py-2 border">Due At</th>
                        <th className="px-4 py-2 border">Priority Score</th>
                    </tr>
                </thead>
                <tbody>
                    {list.items.map((item, idx) => (
                        <tr key={item.task.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{idx + 1}</td>
                            <td className="px-4 py-2 border">{item.task.title}</td>
                            <td className="px-4 py-2 border">{item.task.due_at_formatted ?? '-'}</td>
                            <td className="px-4 py-2 border">{item.priority_score ?? '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table> */}
            </div>
        </AppLayout>
    );
}