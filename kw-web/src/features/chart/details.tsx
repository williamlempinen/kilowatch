import type { DayDetail } from '../../api.ts'
import { durationSlice } from '../../utils.ts'

export interface ElectricityDetailsProps {
    data: DayDetail
}

function ElectricityDetails({ data }: ElectricityDetailsProps) {
    return (
        <div>
            <h2>Electricity Details</h2>
            <p>Date: {data.date}</p>
            <p>Total consumption: {data.totalConsumption}</p>
            <p>Total production: {data.totalProduction}</p>
            <p>Average price: {data.averagePrice}</p>
            {data.negativePeriod && (
                <div>
                    <p>
                        Longest negative price period: {durationSlice(data.negativePeriod.duration)}
                    </p>
                    <p>Starting from: {data.negativePeriod.start}</p>
                    <p>to: {data.negativePeriod.end}</p>
                </div>
            )}
            {data.peakConsumptions.length > 0 && (
                <>
                    {data.peakConsumptions.map((peak, index) => (
                        <>
                            <p>{peak.consumption}</p>
                            <p>{peak.hour}</p>
                        </>
                    ))}
                </>
            )}
            {data.cheapestHours.length > 0 && (
                <>
                    {data.cheapestHours.map((cheap, index) => (
                        <>
                            <p>{cheap.price}</p>
                            <p>{cheap.hour}</p>
                        </>
                    ))}
                </>
            )}
            <p>Total amount on measures: {data.measures.length}</p>
        </div>
    )
}

export default ElectricityDetails
