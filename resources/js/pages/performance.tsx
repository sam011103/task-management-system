import AppLayout from '@/layouts/app-layout';
import { performance } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Performance',
        href: performance().url,
    },
];

export default function Performance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Performance" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
               This is Performance Page
            </div>
        </AppLayout>
    );
}