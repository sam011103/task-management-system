import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { tasksIndex, tasksEdit } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { useForm, Head } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import FormCard from '@/components/form-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { Slider } from "@/components/ui/slider"
import { useState } from 'react';

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    due_time: string | null;
    hour_estimate: number;
    minute_estimate: number;
    progress: number;
    importance_level: string;
}

interface Props extends PageProps {
    task: Task;
}

export default function Edit({task}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: tasksIndex().url,
        },
        {
            title: "Edit",
            href: tasksEdit(task).url, // pass the task id
        }
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: task.title ?? '',
        description: task.description ?? '',
        status: task.status ?? 'not_started',
        progress: task.progress ?? 0,
        hour_estimate: task.hour_estimate ?? 1,
        minute_estimate: task.minute_estimate ?? 1,
        importance_level: task.importance_level ?? 'normal',
        due_date: task.due_date ?? '',
        due_time: task.due_time ?? '',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        put(TaskController.update(task).url)
    }

    console.log(task.importance_level)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />
            <FormCard title="Edit Task">
                <form onSubmit={submit} className="flex flex-col gap-6 px-2 sm:px-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                required
                                autoFocus
                                tabIndex={1}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Task Title"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                tabIndex={2}
                                value={data.description || ''}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Task Description"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor="description">Effort Estimate</Label>
                            <div className="flex gap-2 items-center">
                            
                                <Input
                                    id="hourEstimate"
                                    name="hour_estimate"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={data.hour_estimate}
                                    onChange={(e) => setData('hour_estimate', Number(e.target.value))}
                                    required
                                    tabIndex={2}
                                    autoComplete="timeEstimate"
                                /> 
                                hour(s)
                                <InputError message={errors.hour_estimate} />
                                <Input
                                    id="minuteEstimate"
                                    name="minute_estimate"
                                    type="number"
                                    step="15"
                                    min="0"
                                    max="45"
                                    value={data.minute_estimate}
                                    onChange={(e) => setData('minute_estimate', Number(e.target.value))}
                                    required
                                    tabIndex={2}
                                    autoComplete="timeEstimate"
                                />
                                minute(s)
                                <InputError message={errors.minute_estimate} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor='importance_level'>Importance Level</Label>
                            <select
                                id="importance_level"
                                name="importance_level"
                                required
                                tabIndex={2}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.importance_level}
                                onChange={(e) => setData('importance_level', e.target.value)}
                            >
                                <option value="very low">Very Low</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="very high">Very High</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    name="due_date"
                                    tabIndex={3}
                                    value={data.due_date || ''}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                />
                                <InputError message={errors.due_date} />
                            </div>
                        
                            <div className="grid gap-2">
                                <Label htmlFor="dueTime">Due Time</Label>
                                <Input
                                    id="dueTime"
                                    type="time"
                                    name="due_time"
                                    tabIndex={4}
                                    value={data.due_time || ''}
                                    onChange={(e) => setData('due_time', e.target.value)}

                                />
                                <InputError message={errors.due_time} />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="progress">Progress</Label>
                            <div className="flex items-center gap-4">
                                <Slider 
                                    id="progress"
                                    name="progress"
                                    value={[data.progress]}
                                    onValueChange={(value) => setData('progress', value[0])}    
                                    max={100} 
                                    step={1} 
                                />
                                <span>{data.progress}%</span>
                            </div>
                            {/* <InputError message={errors.title} /> */}
                        </div>

                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Button type="submit" disabled={processing} tabIndex={6}>
                            Submit
                        </Button>
                    </div>
                            
                        
                </form>
            </FormCard>
        </AppLayout>
    );
}
