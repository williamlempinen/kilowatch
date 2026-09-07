import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api.ts'
import Filters from '../features/chart-filters.tsx'
import { DEFAULT_DATE } from '../constants.ts'
import { toDayParam } from '../utils.ts'

function Statistics() {
    const [searchParams, setSearchParams] = useSearchParams()
    const dayParam = searchParams.get('day')

    const [selectedDate, setSelectedDate] = useState<Date | null>(
        dayParam ? new Date(`${dayParam}T00:00:00`) : DEFAULT_DATE
    )
    const [isRange, setIsRange] = useState(false)

    const { data, isLoading, isPending, isFetching, isError, error } = useQuery({
        queryKey: ['electricity', dayParam],
        queryFn: ({ signal }) => apiFetch(isRange, dayParam!, signal),
        enabled: !!dayParam
    })

    const handleApplyFilters = () => {
        if (!selectedDate) return
        setSearchParams({ day: toDayParam(selectedDate) })
    }

    const handleClearFilters = () => {
        setSelectedDate(null)
        setSearchParams({})
    }

    return (
        <div>
            <Filters
                disableApply={!selectedDate || toDayParam(selectedDate) === dayParam}
                disableClear={!dayParam && !selectedDate}
                isRange={isRange}
                setIsRange={setIsRange}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />
            <div>
                {!dayParam && <p>Select a date and click apply to load statistics.</p>}
                {isLoading && <p>Loading…</p>}
                {isError && <p>Error: {(error as Error).message}</p>}
                {data && (
                    <div>
                        <p>
                            {data.length} entries loaded for {dayParam}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Statistics
