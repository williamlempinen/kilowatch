import type { DayDetail } from '../api.ts'
import { dateToHour, durationSlice } from '../utils.ts'

export interface ElectricityDetailsProps {
    data: DayDetail
}

function ElectricityDetails({ data }: ElectricityDetailsProps) {
    return (
        <div className="my-2 flex flex-col gap-3 border-y-2 border-G3 p-2">
            <p className="text-lg">measurements for the day: {data.measures.length}</p>
            <div className="flex flex-col">
                {data.measures.length > 0 && (
                    <>
                        <p className="text-lg">total consumption: {data.totalConsumption}</p>
                        <p className="text-lg">total production: {data.totalProduction}</p>
                        <p className="text-lg">average price: {data.averagePrice}</p>
                    </>
                )}
            </div>
            {data.negativePeriod && (
                <div>
                    <p className="text-lg">
                        longest negative price period: {durationSlice(data.negativePeriod.duration)}{' '}
                        hours
                    </p>
                    <p className="text-lg">from: {dateToHour(data.negativePeriod.start)}</p>
                    <p className="text-lg">to: {dateToHour(data.negativePeriod.end)}</p>
                </div>
            )}
            <div className="flex flex-col gap-12 sm:flex-row">
                {data.peakConsumptions.length > 0 && (
                    <div className="flex flex-col">
                        <p className="self-start text-lg">peak consumptions:</p>
                        <ul className="pl-8">
                            {data.peakConsumptions.map((peak, idx) => (
                                <li key={`${idx}-${peak.consumption}`}>
                                    <p>
                                        {peak.hour}: {peak.consumption}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {data.cheapestHours.length > 0 && (
                    <div className="flex flex-col">
                        <p className="text-lg">cheapest hours:</p>
                        <ul className="pl-8">
                            {data.cheapestHours.map((cheap, idx) => (
                                <li key={`${idx}-${cheap.price}`}>
                                    <p>
                                        {cheap.hour}: {cheap.price}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ElectricityDetails
