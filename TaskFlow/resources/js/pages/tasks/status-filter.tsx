import * as React from "react";
import { Column } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';

interface StatusFilterProps {
  column?: Column<any, any>;
}

export default function StatusFilter({ column }: StatusFilterProps) {
  if(!column)
    return

  const value = (column.getFilterValue() as string[]) || [];
  
  const statuses = [
    "in time",
    "late",
    "overdue",
    "urgent",
    "in progress",
    "not started",
  ];

  React.useEffect(() => {
    if (!column.getFilterValue()) {
      column.setFilterValue([...statuses]);
    }
  }, [column]);

  const toggleStatus = (status: string) => {
    if (value.includes(status)) {
      column.setFilterValue(value.filter((v) => v !== status));
    } else {
      column.setFilterValue([...value, status]);
    }
  };

  const selectAll = () => column.setFilterValue([...statuses]);
  const clearAll = () => column.setFilterValue([]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter />
          Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
      <DropdownMenuItem
          onClick={value.length === statuses.length ? clearAll : selectAll}
          className="font-medium text-sm cursor-pointer"
        >
          {value.length === statuses.length ? "Clear All" : "Select All"}
        </DropdownMenuItem>

        {/* Divider */}
        <div className="border-t border-gray-200 my-1"></div>
        {/* <DropdownMenuLabel>Filter Status</DropdownMenuLabel> */}
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={value.includes(status)}
            onCheckedChange={() => toggleStatus(status)}
            className="capitalize"
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
