import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Filters from '../features/chart/chart-filters.tsx'
import { DEFAULT_DATE } from '../constants.ts'
import { toDayParam } from '../utils.ts'
import ElectricityChart from '../features/chart/chart.tsx'
import { fetchDayDetail } from '../api.ts'
import ElectricityDetails from '../features/chart/details.tsx'
import DetailTable from '../features/table/table.tsx'
import Loading from '../components/loading.tsx'
import DayPager from '../components/day-pager.tsx'
import ErrorTypography from '../components/error.tsx'

function Statistics() {
    const [searchParams, setSearchParams] = useSearchParams()
    const dayParam = searchParams.get('day')

    const [selectedDate, setSelectedDate] = useState<Date | null>(
        dayParam ? new Date(`${dayParam}T00:00:00`) : DEFAULT_DATE
    )

    const {
        data: dayDetail,
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

    const disableNextDay = !!(selectedDate && selectedDate >= new Date())
    const hasData = !!dayDetail && dayDetail.measures.length > 0
    const isEmpty = !!dayDetail && dayDetail.measures.length === 0
    const pagerProps = {
        disable: disableNextDay,
        onPrevious: () => shiftDay(-1),
        onNext: () => shiftDay(1)
    }

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
                {!dayParam && <p>select a date and click apply to load statistics</p>}
                {isFetching && <Loading height="10rem" />}
                {isError && (
                    <ErrorTypography message="error fetching data, please try again later" />
                )}
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
        </div>
    )
}

export default Statistics
