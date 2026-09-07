export interface ElectricityDetailsProps {
    date: string
    startTime: string
    productionAmount: number
    consumptionAmount: number
    hourlyPrice: number
}

function ElectricityDetails({
    date,
    startTime,
    productionAmount,
    consumptionAmount,
    hourlyPrice
}: ElectricityDetailsProps) {
    return (
        <div>
            <h2>Electricity Details</h2>
            <p>Date: {date}</p>
            <p>Start Time: {startTime}</p>
            <p>Production Amount: {productionAmount}</p>
            <p>Consumption Amount: {consumptionAmount}</p>
            <p>Hourly Price: {hourlyPrice}</p>
        </div>
    )
}

export default ElectricityDetails
