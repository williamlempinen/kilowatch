import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Filters from '../features/chart-filters.tsx'
import { DEFAULT_DATE } from '../constants.ts'
import { toDayParam, parseDayParam } from '../utils.ts'
import ElectricityChart from '../features/chart.tsx'
import { ApiError, fetchDayDetail } from '../api.ts'
import ElectricityDetails from '../features/details.tsx'
import DetailTable from '../features/table.tsx'
import Loading from '../components/loading.tsx'
import DayPager from '../components/day-pager.tsx'
import ErrorTypography from '../components/error.tsx'

function Statistics() {
    const [searchParams, setSearchParams] = useSearchParams()
    const dayParam = searchParams.get('day')

    const [selectedDate, setSelectedDate] = useState<Date | null>(
        parseDayParam(dayParam) ?? DEFAULT_DATE
    )

    const {
        data: dayDetail,
        isFetching,
        isError,
        error
    } = useQuery({
        queryKey: ['day-details', dayParam],
        queryFn: ({ signal }) => fetchDayDetail(dayParam ?? toDayParam(DEFAULT_DATE), signal),
        enabled: !!dayParam
    })

    const shiftDay = (delta: number) => {
        const base = parseDayParam(dayParam) ?? selectedDate ?? DEFAULT_DATE
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

    const disableNextDay = !!(selectedDate && selectedDate >= new Date())
    const hasData = !!dayDetail && dayDetail.measures.length > 0
    const isEmpty = !!dayDetail && dayDetail.measures.length === 0
    const pagerProps = {
        disable: disableNextDay,
        onPrevious: () => shiftDay(-1),
        onNext: () => shiftDay(1)
    }

    return (
        <>
            <Filters
                disableApply={!selectedDate || toDayParam(selectedDate) === dayParam}
                disableClear={!dayParam && !selectedDate}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />
            <div>
                {!dayParam && (
                    <p className="text-2xl">select a date and click apply to load statistics</p>
                )}
                {isFetching && <Loading height="10rem" />}
                {isError &&
                    (error instanceof ApiError ? (
                        <ErrorTypography message={error.message} />
                    ) : (
                        <ErrorTypography message="error fetching data, please try again later" />
                    ))}
                {isEmpty && <p>no data for {dayParam}</p>}
            </div>
            {dayParam && <DayPager {...pagerProps} />}
            {hasData && (
                <div className="flex flex-col gap-3">
                    <ElectricityDetails data={dayDetail} />
                    <DetailTable data={dayDetail.measures} />
                    <ElectricityChart data={dayDetail.measures} />
                    <DayPager {...pagerProps} />
                </div>
            )}
        </>
    )
}

export default Statistics
