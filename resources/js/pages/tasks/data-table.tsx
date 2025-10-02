"use client"

import * as React from "react"

import {
    Row,
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    VisibilityState,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { ListTodo, CirclePlus } from "lucide-react"
import { tasksCreate, todoListCreate, todoListIndex } from "@/routes"
import { Form, Link, usePage } from "@inertiajs/react"
import { Label } from "@/components/ui/label"
import InputError from "@/components/input-error"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import StatusFilter from "./status-filter"
import { Checkbox } from "@/components/ui/checkbox"
import TodoListController from "@/actions/App/Http/Controllers/TodoListController"
// import { useEchoNotification } from "@laravel/echo-react"
// import { TaskStatusUpdateNotification } from "@/layouts/app-layout"
// import { Task } from "."

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    enableRowSelection?: (row: Row<TData>) => boolean;
}

export function DataTable<TData extends { id: string | number }, TValue>({
    columns,
    data,
    enableRowSelection = () => true,   
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const saved = localStorage.getItem('tasksPageIndex');
    const [pagination, setPagination] = React.useState({
        pageIndex: saved ? Number(saved) : 0,
        pageSize: 5, // ✅ show 5 rows per page by default
    });
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        status: false, // 👈 hidden by default
        id: false
    })
    const [rowSelection, setRowSelection] = React.useState({})

    // const [tasks, setTasks] = React.useState<TData[]>(data)
    // const { props: inertiaProps } = usePage();
    // const { auth } = inertiaProps;
    // const userId = auth?.user?.id;

    // useEchoNotification<TaskStatusUpdateNotification>(
    //     `App.Models.User.${userId}`,
    //     (notification) => {
    //         //search for task with same id and update it
    //         const statusFormatted = notification.task_status === 'urgent' ? 'Urgent' : 'Overdue';
    //         console.log(notification.task_id)
    //         const taskIndex = tasks.findIndex(task => task.id === notification.task_id);
            
    //         if(taskIndex !== -1)
    //         {
    //             const updatedTasks = [...data];
    //             updatedTasks[taskIndex] = {
    //                 ...updatedTasks[taskIndex],
    //                 status: notification.task_status,
    //                 //capitalize first letter
    //                 status_formatted: statusFormatted
    //             };
    //             setTasks(updatedTasks);
    //         }

    //     },
    // );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableRowSelection,
        autoResetPageIndex: false,
        state: {
            pagination,
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onPaginationChange: setPagination,
    })

    const selectedIds = table
        .getSelectedRowModel()
        .rows
        .map(row => row.original.id)

    React.useEffect(() => {
        table.setPageIndex(0)
        }, [columnFilters, table])

    React.useEffect(() => {
        localStorage.setItem('tasksPageIndex', pagination.pageIndex.toString());
    }, [pagination.pageIndex]);

    React.useEffect(() => {
        if (pagination.pageIndex >= Math.ceil(data.length/ pagination.pageSize)) {
          setPagination((prev) => ({
            ...prev,
            pageIndex: Math.max(0, Math.ceil(data.length/ prev.pageSize) - 1),
          }));
        }
      }, [pagination.pageIndex, pagination.pageSize, data.length]);

    // const showDialog = flash?.showDialog ?? false
    // const [open, setOpen] = React.useState(false)

    // React.useEffect(() => {
    //     if (flash?.showDialog) {
    //         setOpen(true)
    //         flash.showDialog = false
    //     }
    // }, [flash?.showDialog])

    // const { data, setData, post, processing, errors } = useForm({
    //     title: task.title ?? '',
    //     description: task.description ?? '',
    //     status: task.status ?? 'not_started',
    //     progress: task.progress ?? 0,
    //     hour_estimate: task.hour_estimate ?? 1,
    //     minute_estimate: task.minute_estimate ?? 1,
    //     importance_level: task.importance_level ?? 'normal',
    //     due_date: task.due_date ?? '',
    //     due_time: task.due_time ?? '',
    // })

    // function submit(e: React.FormEvent) {
    //     e.preventDefault()
    //     post(TodoListController.store().url)
    // }

    return (
    <div>
        <div className="flex items-center py-4 gap-3">
            <Input
                placeholder="Filter titles..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
            <StatusFilter column={table.getColumn('status')} />
            <DataTableViewOptions table={table}/>
            {
                table.getFilteredSelectedRowModel().rows.length == 0 ? (
                    <Link href={tasksCreate().url} className="ml-3" prefetch>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <CirclePlus />
                        Create Task
                    </Button>
                </Link>
                )
             : (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-3">
                            {/* <Link method="post" as="button" href={todoListCreate()} data={{ ids: selectedIds }}> */}
                                <ListTodo />
                                Add To List
                            {/* </Link> */}
                        </Button>
                    </DialogTrigger>
                    <DialogContent 
                    // className="!max-w-screen-md"
                    >
                        <DialogHeader>
                            <DialogTitle>Options</DialogTitle>
                            <DialogDescription>
                               
                            </DialogDescription>
                        </DialogHeader>
                        <Form
                            className="flex flex-col gap-6"
                            {...TodoListController.store.form()}
                            // onSubmit={(event) => {
                            //     wait().then(() => setOpen(false));
                            //     event.preventDefault();
                            // }}
                        >
                            {/* <fieldset className="space-y-5">
                                <legend className="text-md font-medium mb-2">Priority Method</legend>
                                <RadioGroup defaultValue="0" name="method">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="0" id="method-min" />
                                        <Label htmlFor="method-min">Minimize overdue tasks</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="method-overdue" />
                                        <Label htmlFor="method-priority">Overdue tasks first</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="method-priority" />
                                        <Label htmlFor="method-priority">Priority first</Label>
                                    </div>
                                </RadioGroup>
                               
                            </fieldset> */}
                            {/** some inputs */}
                            {({ processing, errors }) => (
                                <>
                                    {selectedIds.map(id => (
                                        <input type="hidden" name="ids[]" value={id} key={id} />
                                    ))}
                                    <InputError message={errors.ids} />
                                     <div className="flex items-center space-x-2">
                                        <Checkbox id="prioritize" name="prioritize" tabIndex={5} />
                                        <Label htmlFor="prioritize" className="mb-0">Prioritize Tasks</Label>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <Button type="submit" disabled={processing}>Proceed</Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
                ) 
            }
                
           
                
          
                
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter(
                        (column) => column.getCanHide()
                    )
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu> */}
        </div>
        <div className="overflow-hidden rounded-md border mb-4">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-gradient-to-r from-blue-500 to-teal-400">
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id} className="text-white">
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="bg-white odd:bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="whitespace-normal leading-relaxed">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        <DataTablePagination table={table} />
        {/* <Dialog  open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Replace Existing List</DialogTitle>
                    <DialogDescription className="leading-relaxed">
                    <div className="text-sm leading-relaxed">
                        You already have a{" "}
                        <Link className="text-blue-700 hover:text-blue-800 underline" href={todoListIndex()}>
                            Todo List
                        </Link> for today.
                        <br></br>
                        <br></br>
                        Do you want to replace it?
                        <br></br>
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
            
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href={todoListCreate()} data={{ ids: selectedIds, confirm: true }} method="post" as="button">
                            Proceed
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog> */}
    </div>

   
  )
}