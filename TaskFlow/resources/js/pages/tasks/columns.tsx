import { ColumnDef } from "@tanstack/react-table"
import EditIcon from '@/components/icons/edit-icon';
import DeleteIcon from '@/components/icons/delete-icon';
import { tasksEdit, tasksDestroy } from '@/routes';
import { Root, Indicator, } from "@radix-ui/react-progress";
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import dayjs from "dayjs"
import { Task } from ".";
import { StatusBadge } from "@/components/status-badge";

const importanceLevelOrder = ["Very Low", "Low", "Medium", "High", "Very High"]

function parseTimeToMinutes(str: string) {
    if (!str) return 0
    let total = 0
    const hourMatch = str.match(/(\d+)\s*hrs?/)   // matches "1 hr" or "2 hrs"
    const minMatch = str.match(/(\d+)\s*mins?/)   // matches "1 min" or "30 mins"
    if (hourMatch) total += parseInt(hourMatch[1], 10) * 60
    if (minMatch) total += parseInt(minMatch[1], 10)
    return total
}
  

export const columns: ColumnDef<Task>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-white"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => {
            if (row.original.progress === 100) {
                return null;
            }
            return (
                <Checkbox
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-white"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            )
        }
    },
    // {
    //     accessorKey: 'id',
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="No." />
    //     ),
    //     cell: ({ row }) => row.index + 1, // row.index starts from 0
    //     footer: props => props.column.id,
    //     meta: {title: 'No.'},
    // },
    {
        accessorKey: "title",
        header: "Title",
        cell: info => {
            const title = info.getValue() as string
            const status = info.row.original.status // assuming row has a `status`

            return (
                <div className="flex items-start gap-2">
                    <span>
                        {title}
                    </span>
                    <StatusBadge status={status} />
                </div>
            )
        },
        footer: props => props.column.id,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: info => info.getValue() ?? '-',
        footer: props => props.column.id,
    },
    {
        accessorKey: 'importance_level_formatted',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Importance" />
        ),
        cell: info => info.getValue(),
        footer: props => props.column.id,
        meta: {title: 'Importance'},
        sortingFn: (rowA, rowB, columnId) => {
            const a = rowA.getValue<string>(columnId)
            const b = rowB.getValue<string>(columnId)
            return importanceLevelOrder.indexOf(a) - importanceLevelOrder.indexOf(b)
        }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: info => info.getValue(),
        footer: props => props.column.id,
        meta: {title: 'Status'},
        enableHiding: false,
        filterFn: (row, id, filterValues: string[] | undefined) => {
            // if no filters selected, show all rows
            if (!filterValues || filterValues.length === 0) return false;
        
            // show row if its status is included in selected filter values
            return filterValues.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'due_at_formatted',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Due At" />
        ),
        cell: info => info.getValue(),
        sortingFn: (rowA, rowB, columnId) => {
            const a = dayjs(rowA.getValue(columnId) as string, "D MMM YYYY h:mm A")
            const b = dayjs(rowB.getValue(columnId) as string, "D MMM YYYY h:mm A")
        
            if (!a.isValid() && !b.isValid()) return 0
            if (!a.isValid()) return -1
            if (!b.isValid()) return 1
        
            return a.valueOf() - b.valueOf()
        },
        footer: props => props.column.id,
        meta: {title: 'Due At'},
    },
    {
        accessorKey: 'complete_at_formatted',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Complete At" />
        ),
        cell: info => info.getValue(),
        sortingFn: (rowA, rowB, columnId) => {
            const a = dayjs(rowA.getValue(columnId) as string, "D MMM YYYY h:mm A")
            const b = dayjs(rowB.getValue(columnId) as string, "D MMM YYYY h:mm A")
        
            if (!a.isValid() && !b.isValid()) return 0
            if (!a.isValid()) return -1
            if (!b.isValid()) return 1
        
            return a.valueOf() - b.valueOf()
        },
        footer: props => props.column.id,
        meta: {title: 'Complete At'},
    },
    // {
    //     accessorKey: 'due_time_formatted',
    //     header: 'Due Time',
    //     cell: info => info.getValue(),
    //     footer: props => props.column.id,
    //     meta: {title: 'Due Time'},
    // },
    // {
    //     accessorKey: 'time_estimate_formatted',
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Effort Estimate" />
    //     ),
    //     cell: info => info.getValue(),
    //     footer: props => props.column.id,
    //     sortingFn: (rowA, rowB, columnId) => {
    //         const a = parseTimeToMinutes(rowA.getValue(columnId))
    //         const b = parseTimeToMinutes(rowB.getValue(columnId))
    //         return a - b
    //     },
    //     meta: {title: 'Effort Estimate'},
    // },
    {
        accessorKey: 'time_remaining_formatted',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Effort Left" />
        ),
        cell: info => info.getValue(),
        footer: props => props.column.id,
        sortingFn: (rowA, rowB, columnId) => {
            const a = parseTimeToMinutes(rowA.getValue(columnId))
            const b = parseTimeToMinutes(rowB.getValue(columnId))
            return a - b
        },
        meta: {title: 'Effort Left'},
    },
    {
        accessorKey: 'progress',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Progress" />
        ),
        cell: ({ row, getValue }) => {
            const value = getValue<number>() // progress as number
            return (
              <div className="flex items-center gap-2">
                <Root className="relative h-4 w-20 overflow-hidden rounded-full bg-gray-200">
                    <Indicator
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-in-out"
                        style={{ width: value > 0 ? `${value}%` : "0%" }}
                    />
                </Root>

                {/* Percentage text */}
                <span>{value}%</span>
              </div>
            )
        },
        footer: props => props.column.id,
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex gap-2">
              <EditIcon action={tasksEdit(row.original).url} disabled={row.original.progress === 100} />
              <DeleteIcon action={tasksDestroy(row.original).url} />
            </div>
        ),
        footer: props => props.column.id,
    },
];