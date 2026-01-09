import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard, todoListIndex, tasksIndex } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, router } from '@inertiajs/core';
import DonutChart from './donut-chart';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { SquareCheck } from 'lucide-react';
import React, { useEffect } from 'react';
import { Task } from '../tasks';
import { useEcho } from '@laravel/echo-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface ChartItem {
    status: string
    tasks: number
    fill: string
}

interface DeadlineItem {
    title: string,
    due_at_formatted: string
}

interface Props extends PageProps {
    stats: { 
        completed: number, 
        incomplete: number, 
        urgent: number,
        overdue: number,
    },
    chartData: ChartItem[],
    deadlines: DeadlineItem[]
    todayList: {
        id: number,
        date: string,
        tasks: Task[],
        completed_count: number,
        task_count: number
    }
}
    

export default function Index({stats, chartData, deadlines, todayList}: Props) {
    const { props: inertiaProps } = usePage();
    const { auth } = inertiaProps;
    const userId = auth?.user?.id;

    useEcho(
        `user.${userId}`,
        "TaskEvent",
        () => {
            router.reload({ replace: true });
        },
    );

    const totalTasks = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.tasks, 0)
    }, [chartData]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="h-full border-2 border-green-500 rounded-lg shadow-lg overflow-hidden bg-green-100">
                        <CardHeader>
                            <CardTitle className='text-green-700 font-bold text-lg'>Completed Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <p className='text-4xl font-extrabold text-green-600 m-0'>{stats.completed}</p>
                        </CardContent>
                    </Card>
                    <Card className="h-full border-2 border-blue-500 rounded-lg shadow-lg overflow-hidden bg-blue-100">
                        <CardHeader>
                            <CardTitle className='text-blue-700 font-bold text-lg'>Incomplete Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <p className='text-4xl font-extrabold text-blue-600 m-0'>{stats.incomplete}</p>
                        </CardContent>
                    </Card>
                    <Card className="h-full border-2 border-yellow-500 rounded-lg shadow-lg overflow-hidden bg-yellow-100">
                        <CardHeader>
                            <CardTitle className='text-yellow-700 font-bold text-lg'>Urgent Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <p className='text-4xl font-extrabold text-yellow-600 m-0'>{stats.urgent}</p>
                        </CardContent>
                    </Card>
                    <Card className="h-full border-2 border-orange-500 rounded-lg shadow-lg overflow-hidden bg-orange-100">
                        <CardHeader>
                            <CardTitle className='text-orange-700 font-bold text-lg'>Overdue Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <p className='text-4xl font-extrabold text-orange-600 m-0'>{stats.overdue}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 md:grid-rows-2">
                    <Card className="border-2 rounded-lg shadow-lg overflow-hidden md:col-start-1 md:row-start-1 bg-orange-50">
                        <CardHeader>
                            <CardTitle className='font-bold text-lg text-blue-600'>
                                Todo List ({new Date().toISOString().split('T')[0]}) {todayList?.tasks?.length > 0 ? `(${todayList.completed_count}/${todayList.task_count})` : ""}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                        {(!todayList || todayList?.tasks?.length === 0) ? 
                            "No tasks for today." 
                        : 
                        (
                            <div className="overflow-y-auto max-h-60">
                                <Table className='table-fixed mb-2'>
                                    <TableBody>
                                    {
                                        todayList?.tasks?.map((task, index) => (
                                        <TableRow key={task.id}>
                                            <TableCell className='w-[40px]'>{index + 1}.</TableCell>
                                            <TableCell className={`truncate ${task.progress === 100 ? 'line-through text-gray-500' : ''}`}>{task.title}</TableCell>
                                            <TableCell className='w-[40px]'>
                                                {task.progress === 100 ? <SquareCheck /> : null}
                                            </TableCell>
                                        </TableRow>
                                        ))
                                    }
                                    </TableBody>
                                </Table>
                            </div>
                        )} 
                        {/* {
                            todayList?.tasks?.length > 5 &&
                                <Link className='text-sm text-blue-700 underline hover:text-blue-800' href={todoListIndex()}>View more</Link>
                        } */}
                            
                        </CardContent>
                    </Card>  
                    <Card className="border-2 rounded-lg shadow-lg overflow-hidden md:col-start-1 md:row-start-2 bg-amber-50">
                        <CardHeader>
                            <CardTitle className='font-bold text-lg text-blue-600'>Upcoming Deadlines</CardTitle>
                        </CardHeader>
                        <CardContent>
                        {deadlines.length === 0 ? (
                            "No upcoming deadlines."
                        ):
                        (
                            <>
                                <Table className='mb-2 table-fixed'>
                                    <TableBody>
                                        {
                                            deadlines.map((deadline, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className='w-[40px]'>{index + 1}.</TableCell>
                                                    <TableCell className='truncate'>{deadline.title}</TableCell>
                                                    <TableCell className='w-[160px] text-red-500 font-bold'>{deadline.due_at_formatted}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </>
                        )}
                        {
                            deadlines.length === 5 &&
                                <Link className='text-sm text-blue-700 underline hover:text-blue-800 flex-end' href={tasksIndex()}>View more</Link>
                        }
                        
                        </CardContent>
                    </Card> 
                    <Card className="h-full border-2 rounded-lg shadow-lg overflow-hidden md:row-span-2 bg-teal-50">
                        <CardHeader>
                            <CardTitle className='font-bold text-lg text-blue-600'>Task Overview</CardTitle>
                        </CardHeader>
                        <CardContent className='h-full'>
                            {
                                totalTasks === 0 ? "No tasks available." : (
                                    <>
                                    <DonutChart data={chartData} total={totalTasks}></DonutChart>
                                        <ul className="mt-4 flex flex-wrap gap-2 justify-center">
                                            {chartData.map((entry, index) => (
                                            <li key={`item-${index}`} className="flex items-center gap-2">
                                                <span
                                                className="inline-block w-3 h-3 rounded-full"
                                                style={{ backgroundColor: entry.fill }} // assuming chartData has fill
                                                />
                                                <span className="capitalize text-sm sm:text-base">
                                                    {entry.status} ({entry.tasks})
                                                </span>
                                            </li>
                                            ))}
                                        </ul>
                                    </>
                                )
                            }
                           
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
