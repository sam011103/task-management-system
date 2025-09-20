import AppLayout from '@/layouts/app-layout';
import { tasksIndex, tasksCreate } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { CirclePlus, SquarePen, Trash2 } from 'lucide-react';
import ActionButtons from '@/components/action-buttons';
import { Root, Indicator, } from "@radix-ui/react-progress";

interface Task {
    id: number;
    title: string;
    description: string | null;
    status_formatted: string;
    due_date_formatted: string | null;
    due_time_formatted: string | null;
    time_estimate_formatted: string;
    progress: number;
    priority_formatted: string;
}

interface Props extends PageProps {
    tasks: Task[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasksIndex().url,
    },
];

export default function Index({tasks}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Tasks List</CardTitle>
                        <a href={tasksCreate().url}>
                            <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white">
                                <CirclePlus />
                                Create Task
                            </Button>
                        </a>
                    </CardHeader>
                    <CardContent>
                        <Table className="overflow-x-auto">
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
                                        <TableCell>{item.due_date_formatted}</TableCell>
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
                                            <ActionButtons />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>

        
    );
}