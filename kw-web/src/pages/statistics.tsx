import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Filters from '../features/chart-filters.tsx'
import { DEFAULT_DATE } from '../constants.ts'
import { toDayParam } from '../utils.ts'
import ElectricityChart from '../features/chart.tsx'
import { fetchDayDetail } from '../api.ts'

const tempData = {
    date: '2023-10-12',
    totalConsumption: 134315940.093,
    totalProduction: 955925.0,
    averagePrice: -0.3182,
    peakConsumptionVsProductionHours: [
        {
            hour: '16:00',
            consumptionMinusProduction: 6281635.069
        },
        {
            hour: '17:00',
            consumptionMinusProduction: 6122420.676
        },
        {
            hour: '06:00',
            consumptionMinusProduction: 6085372.393
        }
    ],
    cheapestHours: [
        {
            hour: '04:00',
            price: -1.039
        },
        {
            hour: '03:00',
            price: -1.008
        },
        {
            hour: '05:00',
            price: -1.003
        }
    ],
    measures: [
        {
            startTime: '2023-10-12T00:00:00',
            consumption: 4426561.27,
            production: 35898.0,
            price: -0.508
        },
        {
            startTime: '2023-10-12T01:00:00',
            consumption: 4452966.513,
            production: 35147.0,
            price: -0.76
        },
        {
            startTime: '2023-10-12T02:00:00',
            consumption: 4712351.499,
            production: 34550.0,
            price: -1.0
        },
        {
            startTime: '2023-10-12T03:00:00',
            consumption: 5398049.786,
            production: 35283.0,
            price: -1.008
        },
        {
            startTime: '2023-10-12T04:00:00',
            consumption: 5884179.259,
            production: 36235.0,
            price: -1.039
        },
        {
            startTime: '2023-10-12T05:00:00',
            consumption: 6023021.687,
            production: 38250.0,
            price: -1.003
        },
        {
            startTime: '2023-10-12T06:00:00',
            consumption: 6125884.393,
            production: 40512.0,
            price: -0.441
        },
        {
            startTime: '2023-10-12T07:00:00',
            consumption: 6090927.645,
            production: 42091.0,
            price: -0.217
        },
        {
            startTime: '2023-10-12T08:00:00',
            consumption: 6069226.734,
            production: 41262.0,
            price: -0.036
        },
        {
            startTime: '2023-10-12T09:00:00',
            consumption: 6018441.203,
            production: 40855.0,
            price: 0.0
        },
        {
            startTime: '2023-10-12T10:00:00',
            consumption: 5926854.678,
            production: 40443.0,
            price: 0.0
        },
        {
            startTime: '2023-10-12T11:00:00',
            consumption: 5820556.011,
            production: 40522.0,
            price: -0.011
        },
        {
            startTime: '2023-10-12T12:00:00',
            consumption: 5764784.631,
            production: 40579.0,
            price: -0.11
        },
        {
            startTime: '2023-10-12T13:00:00',
            consumption: 5782749.61,
            production: 40644.0,
            price: -0.194
        },
        {
            startTime: '2023-10-12T14:00:00',
            consumption: 5851522.167,
            production: 40363.0,
            price: -0.209
        },
        {
            startTime: '2023-10-12T15:00:00',
            consumption: 6079324.691,
            production: 40808.0,
            price: -0.209
        },
        {
            startTime: '2023-10-12T16:00:00',
            consumption: 6323785.069,
            production: 42150.0,
            price: -0.207
        },
        {
            startTime: '2023-10-12T17:00:00',
            consumption: 6166537.676,
            production: 44117.0,
            price: -0.203
        },
        {
            startTime: '2023-10-12T18:00:00',
            consumption: 5746436.922,
            production: 43321.0,
            price: -0.11
        },
        {
            startTime: '2023-10-12T19:00:00',
            consumption: 5683114.242,
            production: 41419.0,
            price: -0.011
        },
        {
            startTime: '2023-10-12T20:00:00',
            consumption: 5424380.307,
            production: 40715.0,
            price: -0.01
        },
        {
            startTime: '2023-10-12T21:00:00',
            consumption: 5075375.213,
            production: 40188.0,
            price: -0.076
        },
        {
            startTime: '2023-10-12T22:00:00',
            consumption: 4808559.205,
            production: 40322.0,
            price: -0.107
        },
        {
            startTime: '2023-10-12T23:00:00',
            consumption: 4660349.682,
            production: 40251.0,
            price: -0.167
        }
    ]
}

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
        isError,
        error
    } = useQuery({
        queryKey: ['day-details', dayParam],
        queryFn: ({ signal }) => fetchDayDetail(dayParam ?? '', signal),
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
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />
            <div>
                {!dayParam && <p>Select a date and click apply to load statistics.</p>}
                {isLoading && <p>Loading…</p>}
                {isError && <p>Error: {(error as Error).message}</p>}
                {dayDetail && dayDetail.measures.length === 0 && <p>No data for {dayParam}.</p>}
                {dayDetail && dayDetail.measures.length > 0 && (
                    <>
                        <p>
                            {dayDetail.measures.length} entries loaded for {dayDetail.date}
                        </p>
                    </>
                )}
            </div>
            <ElectricityChart data={tempData.measures} />
        </div>
    )
}

export default Statistics
