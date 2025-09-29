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

export default function Index({list}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Todo List" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-2 sm:p-4">
                <Card className="border-none shadow-none">
                    <CardHeader className="flex-row items-center px-0 sm:px-6">
                        <CardTitle>Todo List ({list.date}) { list.task_count > 0 && `(${list.completed_count}/${list.task_count})`}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        <Table className='rounded-md overflow-hidden'>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-blue-500 to-teal-400">
                                    <TableHead className='text-white'>No.</TableHead>
                                    <TableHead className='text-white'>Title</TableHead>
                                    <TableHead className='text-white'>Description</TableHead>
                                    {/* <TableHead className='text-white'>Importance</TableHead> */}
                                    {/* <TableHead>Status</TableHead>
                                    <TableHead>Due At</TableHead> */}
                                    {/* <TableHead>Time Estimate</TableHead> */}
                                    <TableHead className='text-white'>Effort Left</TableHead>
                                    <TableHead className='text-white'>Progress</TableHead>
                                    {/* <TableHead>Priority Score</TableHead> */}
                                    <TableHead className='text-white'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {
                                (!list.tasks || list?.tasks?.length === 0) ? 
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            No tasks in the list
                                        </TableCell>
                                    </TableRow>
                                :
                                list?.tasks?.map((task, key) => (
                                    <TableRow key={task.id} className="bg-white odd:bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors items-center">
                                        <TableCell className="font-medium">{key + 1}</TableCell>
                                        <TableCell className='whitespace-normal leading-relaxed'>
                                            <div className="flex items-start gap-2">
                                                <span>
                                                    {task.title}
                                                </span>
                                                <StatusBadge status={task.status} />
                                            </div>
                                        </TableCell>
                                        <TableCell className='whitespace-normal leading-relaxed'>{task.description ? task.description : "-"}</TableCell>
                                        {/* <TableCell>{task.importance_level_formatted}</TableCell> */}
                                        {/* <TableCell>{item.task.status_formatted}</TableCell>
                                        <TableCell>{item.task.due_at_formatted}</TableCell> */}
                                        {/* <TableCell>{item.task.time_estimate_formatted}</TableCell> */}
                                        <TableCell>{task.time_remaining_formatted}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Root className="relative h-4 w-20 overflow-hidden rounded-full bg-gray-200">
                                                <Indicator
                                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-in-out"
                                                    style={{ width: task.progress > 0 ? `${task.progress}%` : "0%" }}
                                                />
                                                </Root>
                                                <span>{task.progress}%</span>
                                            </div>
                                        </TableCell>
                                        {/* <TableCell>{item.priority_score}</TableCell> */}
                                    
                                        <TableCell className="align-middle">
                                            <div className="flex gap-2">
                                                <EditIcon action={tasksEdit(task).url} disabled={task.progress === 100}/>
                                                <DeleteIcon action={taskRemoveFromList(task.id).url}/>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            </TableBody>
                        </Table>
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