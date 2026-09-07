import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api.ts'
import Filters from '../features/chart-filters.tsx'
import { DEFAULT_DATE } from '../constants.ts'
import { toDayParam } from '../utils.ts'
import ElectricityChart from '../features/chart.tsx'

const tempChartData = [
    {
        id: 24336,
        date: '2023-10-12',
        startTime: '2023-10-12T00:00:00',
        productionAmount: 35898.0,
        consumptionAmount: 4426561.27,
        hourlyPrice: -0.508
    },
    {
        id: 24337,
        date: '2023-10-12',
        startTime: '2023-10-12T01:00:00',
        productionAmount: 35147.0,
        consumptionAmount: 4452966.513,
        hourlyPrice: -0.76
    },
    {
        id: 24338,
        date: '2023-10-12',
        startTime: '2023-10-12T02:00:00',
        productionAmount: 34550.0,
        consumptionAmount: 4712351.499,
        hourlyPrice: -1.0
    },
    {
        id: 24339,
        date: '2023-10-12',
        startTime: '2023-10-12T03:00:00',
        productionAmount: 35283.0,
        consumptionAmount: 5398049.786,
        hourlyPrice: -1.008
    },
    {
        id: 24340,
        date: '2023-10-12',
        startTime: '2023-10-12T04:00:00',
        productionAmount: 36235.0,
        consumptionAmount: 5884179.259,
        hourlyPrice: -1.039
    },
    {
        id: 24341,
        date: '2023-10-12',
        startTime: '2023-10-12T05:00:00',
        productionAmount: 38250.0,
        consumptionAmount: 6023021.687,
        hourlyPrice: -1.003
    },
    {
        id: 24342,
        date: '2023-10-12',
        startTime: '2023-10-12T06:00:00',
        productionAmount: 40512.0,
        consumptionAmount: 6125884.393,
        hourlyPrice: -0.441
    },
    {
        id: 24343,
        date: '2023-10-12',
        startTime: '2023-10-12T07:00:00',
        productionAmount: 42091.0,
        consumptionAmount: 6090927.645,
        hourlyPrice: -0.217
    },
    {
        id: 24344,
        date: '2023-10-12',
        startTime: '2023-10-12T08:00:00',
        productionAmount: 41262.0,
        consumptionAmount: 6069226.734,
        hourlyPrice: -0.036
    },
    {
        id: 24345,
        date: '2023-10-12',
        startTime: '2023-10-12T09:00:00',
        productionAmount: 40855.0,
        consumptionAmount: 6018441.203,
        hourlyPrice: 0.0
    },
    {
        id: 24346,
        date: '2023-10-12',
        startTime: '2023-10-12T10:00:00',
        productionAmount: 40443.0,
        consumptionAmount: 5926854.678,
        hourlyPrice: 0.0
    },
    {
        id: 24347,
        date: '2023-10-12',
        startTime: '2023-10-12T11:00:00',
        productionAmount: 40522.0,
        consumptionAmount: 5820556.011,
        hourlyPrice: -0.011
    },
    {
        id: 24348,
        date: '2023-10-12',
        startTime: '2023-10-12T12:00:00',
        productionAmount: 40579.0,
        consumptionAmount: 5764784.631,
        hourlyPrice: -0.11
    },
    {
        id: 24349,
        date: '2023-10-12',
        startTime: '2023-10-12T13:00:00',
        productionAmount: 40644.0,
        consumptionAmount: 5782749.61,
        hourlyPrice: -0.194
    },
    {
        id: 24350,
        date: '2023-10-12',
        startTime: '2023-10-12T14:00:00',
        productionAmount: 40363.0,
        consumptionAmount: 5851522.167,
        hourlyPrice: -0.209
    },
    {
        id: 24351,
        date: '2023-10-12',
        startTime: '2023-10-12T15:00:00',
        productionAmount: 40808.0,
        consumptionAmount: 6079324.691,
        hourlyPrice: -0.209
    },
    {
        id: 24352,
        date: '2023-10-12',
        startTime: '2023-10-12T16:00:00',
        productionAmount: 42150.0,
        consumptionAmount: 6323785.069,
        hourlyPrice: -0.207
    },
    {
        id: 24353,
        date: '2023-10-12',
        startTime: '2023-10-12T17:00:00',
        productionAmount: 44117.0,
        consumptionAmount: 6166537.676,
        hourlyPrice: -0.203
    },
    {
        id: 24354,
        date: '2023-10-12',
        startTime: '2023-10-12T18:00:00',
        productionAmount: 43321.0,
        consumptionAmount: 5746436.922,
        hourlyPrice: -0.11
    },
    {
        id: 24355,
        date: '2023-10-12',
        startTime: '2023-10-12T19:00:00',
        productionAmount: 41419.0,
        consumptionAmount: 5683114.242,
        hourlyPrice: -0.011
    },
    {
        id: 24356,
        date: '2023-10-12',
        startTime: '2023-10-12T20:00:00',
        productionAmount: 40715.0,
        consumptionAmount: 5424380.307,
        hourlyPrice: -0.01
    },
    {
        id: 24357,
        date: '2023-10-12',
        startTime: '2023-10-12T21:00:00',
        productionAmount: 40188.0,
        consumptionAmount: 5075375.213,
        hourlyPrice: -0.076
    },
    {
        id: 24358,
        date: '2023-10-12',
        startTime: '2023-10-12T22:00:00',
        productionAmount: 40322.0,
        consumptionAmount: 4808559.205,
        hourlyPrice: -0.107
    },
    {
        id: 24359,
        date: '2023-10-12',
        startTime: '2023-10-12T23:00:00',
        productionAmount: 40251.0,
        consumptionAmount: 4660349.682,
        hourlyPrice: -0.167
    }
]

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
            <ElectricityChart data={tempChartData} />
        </div>
    )
}

export default Statistics
