export default function StatusFilter({ column }: { column: any }) {
    const value = column.getFilterValue() as string | undefined
    return (
      <select
        value={value ?? ''}
        onChange={e => column.setFilterValue(e.target.value || undefined)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="">All</option>
        <option value="in time">In Time</option>
        <option value="late">Late</option>
        <option value="overdue">Overdue</option>
        <option value="urgent">Urgent</option>
        <option value="in progress">In Progress</option>
        <option value="not started">Not Started</option>
      </select>
    )
}