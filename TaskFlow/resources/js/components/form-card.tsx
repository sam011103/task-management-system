import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function FormCard({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-lg flex-col gap-6">
                <Card className="rounded-xl">
                    <CardHeader className="px-10 pt-8 pb-0 text-center">
                        <CardTitle className="text-xl">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-10 py-8">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}