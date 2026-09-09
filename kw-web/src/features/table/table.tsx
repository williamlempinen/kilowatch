import type { Measure } from '../../api.ts'
import { useMemo, useState } from 'react'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { dateToHour } from '../../utils.ts'

export interface DetailTableProps {
    data: Measure[]
}

type SortKey = keyof Measure
type SortDirection = 'asc' | 'desc'

interface Column {
    key: SortKey
    label: string
    numeric?: boolean
    format?: (value: string | number) => string
}

const columns: Column[] = [
    { key: 'startTime', label: 'time', format: (value) => dateToHour(String(value)) },
    {
        key: 'consumption',
        label: 'consumption',
        numeric: true
    },
    { key: 'production', label: 'production', numeric: true },
    {
        key: 'price',
        label: 'price',
        numeric: true
    }
]

function compare(
    a: string | number | null,
    b: string | number | null,
    direction: SortDirection
): number {
    if (a === b) return 0
    if (a === null) return 1
    if (b === null) return -1

    const result = a < b ? -1 : 1
    return direction === 'asc' ? result : -result
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
    if (!active) return <FaSort className="text-G3" aria-hidden />
    return direction === 'asc' ? <FaSortUp aria-hidden /> : <FaSortDown aria-hidden />
}

function DetailTable({ data }: DetailTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>('startTime')
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
    }

    const sortedData = useMemo(
        () => [...data].sort((a, b) => compare(a[sortKey], b[sortKey], sortDirection)),
        [data, sortKey, sortDirection]
    )

    return (
        <table className="w-full border-collapse text-left">
            <thead>
                <tr className="border-b-2 border-G3">
                    {columns.map((column) => {
                        const isActive = column.key === sortKey
                        return (
                            <th
                                key={column.key}
                                scope="col"
                                aria-sort={
                                    isActive
                                        ? sortDirection === 'asc'
                                            ? 'ascending'
                                            : 'descending'
                                        : 'none'
                                }
                                className={column.numeric ? 'text-right' : 'text-left'}
                            >
                                <button
                                    onClick={() => handleSort(column.key)}
                                    className={`flex w-full items-center gap-1 py-1 ${
                                        column.numeric ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {column.label}
                                    <SortIcon active={isActive} direction={sortDirection} />
                                </button>
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row) => (
                    <tr key={row.startTime} className="border-b border-G3">
                        {columns.map((column) => {
                            const value = row[column.key]
                            return (
                                <td
                                    key={column.key}
                                    className={`py-1 ${column.numeric ? 'text-right tabular-nums' : 'text-left'}`}
                                >
                                    {value === null
                                        ? 'N/A'
                                        : column.format
                                          ? column.format(value)
                                          : value}
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default DetailTable
