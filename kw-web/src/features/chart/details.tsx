import type { DayDetail } from '../../api.ts'
import { dateToHour, durationSlice } from '../../utils.ts'

export interface ElectricityDetailsProps {
    data: DayDetail
}

function ElectricityDetails({ data }: ElectricityDetailsProps) {
    return (
        <div className="mt-1 flex flex-col gap-3">
            <h2 className="self-end text-2xl">{data.date}</h2>
            <div className="flex gap-3">
                <div className="flex flex-col">
                    <p>total consumption: {data.totalConsumption?.toFixed(3)}</p>
                    <p>total production: {data.totalProduction}</p>
                    <p>average price: {data.averagePrice}</p>
                </div>
                {data.negativePeriod && (
                    <div>
                        <p>
                            longest negative price period:{' '}
                            {durationSlice(data.negativePeriod.duration)}
                        </p>
                        <p>from: {dateToHour(data.negativePeriod.start)}</p>
                        <p>to: {dateToHour(data.negativePeriod.end)}</p>
                    </div>
                )}
            </div>
            <div className="flex gap-3">
                {data.peakConsumptions.length > 0 && (
                    <>
                        <p>peak consumptions:</p>
                        <ul>
                            {data.peakConsumptions.map((peak, idx) => (
                                <li key={`${idx}-${peak.consumption}`}>
                                    <p>
                                        {peak.hour}: {peak.consumption}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {data.cheapestHours.length > 0 && (
                    <>
                        <p>cheapest hours:</p>
                        <ul>
                            {data.cheapestHours.map((cheap, idx) => (
                                <li key={`${idx}-${cheap.price}`}>
                                    <p>
                                        {cheap.hour}: {cheap.price}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            <p>measurements for the day: {data.measures.length}</p>
        </div>
    )
}

export default ElectricityDetails
