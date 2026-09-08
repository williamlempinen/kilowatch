import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Filters from '../features/chart/chart-filters.tsx'
import { DEFAULT_DATE } from '../constants.ts'
import { dateToHour, toDayParam } from '../utils.ts'
import ElectricityChart from '../features/chart/chart.tsx'
import { fetchDayDetail } from '../api.ts'
import ElectricityDetails from '../features/chart/details.tsx'

function Statistics() {
    const [searchParams, setSearchParams] = useSearchParams()
    const dayParam = searchParams.get('day')

    const [selectedDate, setSelectedDate] = useState<Date | null>(
        dayParam ? new Date(`${dayParam}T00:00:00`) : DEFAULT_DATE
    )

    const {
        data: dayDetail,
        isLoading,
        isPending,
        isFetching,
        isError
    } = useQuery({
        queryKey: ['day-details', dayParam],
        queryFn: ({ signal }) => fetchDayDetail(dayParam ?? '', signal),
        enabled: !!dayParam
    })

    const shiftDay = (delta: number) => {
        const base = dayParam ? new Date(`${dayParam}T00:00:00`) : (selectedDate ?? DEFAULT_DATE)
        const nextDate = new Date(base)
        nextDate.setDate(nextDate.getDate() + delta)

        setSelectedDate(nextDate)
        setSearchParams({ day: toDayParam(nextDate) })
    }

    const handleApplyFilters = () => {
        if (!selectedDate) return
        setSearchParams({ day: toDayParam(selectedDate) })
    }

    const handleClearFilters = () => {
        setSelectedDate(null)
        setSearchParams({})
    }

    const formattedMeasures = dayDetail?.measures.map((measure) => ({
        ...measure,
        startTime: dateToHour(measure.startTime)
    }))

    return (
        <div>
            <Filters
                disableApply={!selectedDate || toDayParam(selectedDate) === dayParam}
                disableClear={!dayParam && !selectedDate}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />
            <div>
                {!dayParam && <p>Select a date and click apply to load statistics.</p>}
                {isLoading && <p>Loading…</p>}
                {isError && <p>Error</p>}
                {dayDetail && dayDetail.measures.length === 0 && <p>No data for {dayParam}.</p>}
            </div>
            {dayDetail && (
                <>
                    <ElectricityDetails data={dayDetail} />
                </>
            )}
            {formattedMeasures && formattedMeasures.length > 0 && (
                <>
                    <ElectricityChart data={formattedMeasures} />
                </>
            )}
            <div className="mt-2 flex w-full items-center justify-between">
                <button
                    className="text-xl hover:underline hover:underline-offset-4 disabled:text-G3 disabled:no-underline"
                    onClick={() => shiftDay(-1)}
                >
                    previous day
                </button>
                <button
                    className="text-xl hover:underline hover:underline-offset-4 disabled:text-G3 disabled:no-underline"
                    onClick={() => shiftDay(1)}
                >
                    next day
                </button>
            </div>
        </div>
    )
}

export default Statistics
