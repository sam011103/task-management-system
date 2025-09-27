import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard, priorityListIndex, tasksIndex } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import DonutChart from './donut-chart';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { SquareCheck } from 'lucide-react';
import { Legend } from 'recharts';

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
    due_date: string
}

interface Props extends PageProps {
    stats: { 
        completed: number, 
        incomplete: number, 
        urgent: number,
        overdue: number,
    },
    chartData : ChartItem[],
    deadlines: DeadlineItem[]
}
    

export default function Index({stats, chartData, deadlines}: Props) {
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
                    <Card className="h-full border-2 border-red-500 rounded-lg shadow-lg overflow-hidden bg-red-100">
                        <CardHeader>
                            <CardTitle className='text-red-700 font-bold text-lg'>Overdue Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <p className='text-4xl font-extrabold text-red-600 m-0'>{stats.overdue}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 md:grid-rows-2">
                    <Card className="border-2 rounded-lg shadow-lg overflow-hidden md:col-start-1 md:row-start-1">
                        <CardHeader>
                            <CardTitle className='font-bold text-lg'>Today To-Do List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table className='table-fixed mb-2'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="w-[20px]">1.</TableCell>
                                        <TableCell className=''>Shopping</TableCell>
                                        <TableCell className='w-[150px]'>9.00 AM - 10.00 AM</TableCell>
                                        <TableCell className='w-[40px]'>
                                            <SquareCheck />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="w-[20px]">2.</TableCell>
                                        <TableCell>Cooking</TableCell>
                                        <TableCell>12.00 PM - 1.00 PM</TableCell>
                                        <TableCell>
                                            {/* <SquareCheck /> */}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                    <TableCell className="w-[20px]">3.</TableCell>
                                        <TableCell className='truncate'>Hanging Clothes Hanging Clothes Hanging Clothes Hanging Clothes</TableCell>
                                        <TableCell>2.00 PM - 2.30 PM</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="w-[20px]">4.</TableCell>
                                        <TableCell>Coding</TableCell>
                                        <TableCell>4.00 PM - 6.00 PM</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="w-[20px]">5.</TableCell>  
                                        <TableCell>Shopping</TableCell>
                                        <TableCell>9.00 AM - 10.00 AM</TableCell>
                                        <TableCell>
                                            <SquareCheck />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Link className='text-sm text-blue-700 underline hover:text-blue-800' href={priorityListIndex()}>View more</Link>
                        </CardContent>
                    </Card>  
                    <Card className="border-2 rounded-lg shadow-lg overflow-hidden md:col-start-1 md:row-start-2">
                        <CardHeader>
                            <CardTitle className='font-bold text-lg'>Upcoming Deadlines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table className='mb-2 table-fixed'>
                                <TableBody>
                                    {deadlines.map((deadline, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='w-[20px]'>{index + 1}.</TableCell>
                                            <TableCell className='truncate'>{deadline.title}</TableCell>
                                            <TableCell className='w-[190px]'>{new Date(deadline.due_date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</TableCell>
                                        </TableRow>
                                    ))}
                                    {/* <TableRow>
                                        <TableCell>2. Cooking</TableCell>
                                        <TableCell>27 Sep 2025 12:00PM</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>3. Hanging Clothes</TableCell>
                                        <TableCell>27 Sep 2025 6:00PM</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>4. Coding</TableCell>
                                        <TableCell>28 Sep 2025 10:00AM</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>5. Sleep</TableCell>
                                        <TableCell>29 Sep 2025 10:00AM</TableCell>
                                    </TableRow> */}
                                </TableBody>
                            </Table>
                            <Link className='text-sm text-blue-700 underline hover:text-blue-800 flex-end' href={tasksIndex()}>View more</Link>
                        </CardContent>
                    </Card> 
                    <Card className="h-full border-2 rounded-lg shadow-lg overflow-hidden md:row-span-2">
                        <CardHeader>
                            <CardTitle className='font-bold text-lg'>Task Overview</CardTitle>
                        </CardHeader>
                        <CardContent className='h-full'>
                            <DonutChart data={chartData}></DonutChart>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
