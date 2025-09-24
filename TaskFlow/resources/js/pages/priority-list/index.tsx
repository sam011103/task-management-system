import AppLayout from '@/layouts/app-layout';
import { priorityListIndex } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { PageProps } from '@inertiajs/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Root, Indicator, } from "@radix-ui/react-progress";
import EditIcon from '@/components/icons/edit-icon';
import DeleteIcon from '@/components/icons/delete-icon';
import { tasksEdit, PriorityItemDestroy } from '@/routes';
import { Task } from '../tasks';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Priority List',
        href: priorityListIndex().url,
    },
];

type PriorityItem = {
    id: number,
    task: Task,
    priority_score: number,
}

type PriorityList = {
    id: number,
    items: PriorityItem[]
}

interface Props extends PageProps {
    list: PriorityList;
}

export default function Index({list}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Priority List" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex-row items-center">
                        <CardTitle>Priority List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table className="overflow-x-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Importance Level</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due At</TableHead>
                                    {/* <TableHead>Time Estimate</TableHead> */}
                                    <TableHead>Time Remaining</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Priority Score</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {list && list.items.map((item, key) => (
                                    <TableRow key={item.id} className="items-center">
                                        <TableCell className="font-medium">{key + 1}</TableCell>
                                        <TableCell className='whitespace-normal leading-relaxed'>{item.task.title}</TableCell>
                                        <TableCell className='whitespace-normal leading-relaxed'>{item.task.description ? item.task.description : "-"}</TableCell>
                                        <TableCell>{item.task.importance_level_formatted}</TableCell>
                                        <TableCell>{item.task.status_formatted}</TableCell>
                                        <TableCell>{item.task.due_at_formatted}</TableCell>
                                        {/* <TableCell>{item.task.time_estimate_formatted}</TableCell> */}
                                        <TableCell>{item.task.time_remaining_formatted}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Root className="relative h-4 w-20 overflow-hidden rounded-full bg-gray-200">
                                                <Indicator
                                                    className="h-full bg-green-600 transition-all duration-500 ease-in-out"
                                                    style={{ width: item.task.progress > 0 ? `${item.task.progress}%` : "0%" }}
                                                />
                                                </Root>
                                                <span>{item.task.progress}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.priority_score}</TableCell>
                                    
                                        <TableCell className="align-middle">
                                            <div className="flex gap-2">
                                                <EditIcon action={tasksEdit(item.task).url} disabled={item.task.progress === 100}/>
                                                <DeleteIcon action={PriorityItemDestroy(item).url}/>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
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