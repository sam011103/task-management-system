import AppLayout from '@/layouts/app-layout';
import { tasksIndex, tasksCreate } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import FormCard from '@/components/form-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasksIndex().url,
    },
    {
        title: 'Create',
        href: tasksCreate().url,
    }
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Task" />
            <FormCard title="Create New Task">
                <Form
                //    {...AuthenticatedSessionController.store.form()}
                    {...TaskController.store.form()}
                    className="flex flex-col gap-6 px-6"
                    >

                        {({ processing, errors }) => (
                            <>
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
                                            autoComplete="title"
                                            placeholder="Shopping"
                                        />
                                        <InputError message={errors.title} />
                                    </div>
    
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            tabIndex={2}
                                            autoComplete="description"
                                            placeholder="Buy eggs, milk, and bread..."
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
                                                defaultValue={0}
                                                required
                                                tabIndex={2}
                                                autoComplete="timeEstimate"
                                                placeholder="1"
                                            /> hour(s)
                                            <InputError message={errors.hour_estimate} />
                                            <Input
                                                id="minuteEstimate"
                                                name="minute_estimate"
                                                type="number"
                                                step="15"
                                                max="45"
                                                defaultValue={0}
                                                required
                                                tabIndex={2}
                                                autoComplete="timeEstimate"
                                            />minute(s)
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
                                                defaultValue="medium"
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
                                                autoComplete="date"
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
                                                autoComplete="time"
                                            />
                                            <InputError message={errors.due_time} />
                                        </div>
                                    </div>
                                    {/* <div className="flex items-center space-x-2">
                                        <Checkbox id="completed" name="completed" tabIndex={5} />
                                        <Label htmlFor="completed" className="mb-0">Mark as Completed</Label>
                                    </div> */}
                                </div>
    
                                <div className="flex items-center justify-end gap-4">
                                    <Button type="submit" disabled={processing} tabIndex={6}>
                                        Submit
                                    </Button>
                                </div>
                            </>
                        )}
                </Form>
            </FormCard>
        </AppLayout>
    );
}