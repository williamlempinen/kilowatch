import type { Measure } from '../../api.ts'
import type { TooltipContentProps } from 'recharts'
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import { CONSUMPTION_COLOR, PRICE_COLOR, PRODUCTION_COLOR } from '../../constants.ts'

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
    const consumption = payload[0]
    const production = payload[1]
    const price = payload[2]
    const isVisible = active && payload != null

    return (
        <div className="border-2 border-G3 bg-BG p-2">
            {isVisible && (
                <div className="flex flex-col">
                    <p className="self-center text-xl text-P1">{label}</p>
                    <p>
                        <span className="text-lg text-PRICE">price:</span>{' '}
                        {parseFloat(price.value as string).toFixed(2)}
                    </p>
                    <p>
                        <span className="text-lg text-CONS">consumption:</span>{' '}
                        {parseFloat(consumption.value as string).toFixed(3)}
                    </p>
                    <p>
                        <span className="text-lg text-PROD">production: </span> {production.value}
                    </p>
                </div>
            )}
        </div>
    )
}

export interface ElectricityChartProps {
    data: Measure[]
}

function ElectricityChart({ data }: ElectricityChartProps) {
    return (
        <div className="max-h-800 w-full max-w-400">
            <ResponsiveContainer width="100%" height={800}>
                <ComposedChart
                    responsive
                    data={data}
                    margin={{
                        top: 20,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }}
                >
                    {/* BG-color */}
                    <CartesianGrid stroke="#f7f9fa" />
                    <XAxis dataKey="startTime" />
                    <YAxis yAxisId="price" orientation="left" width="auto" stroke={PRICE_COLOR} />
                    <YAxis yAxisId="amount" orientation="right" width="auto" />
                    <Bar
                        yAxisId="amount"
                        dataKey="consumption"
                        barSize={20}
                        fill={CONSUMPTION_COLOR}
                    />
                    <Bar
                        yAxisId="amount"
                        dataKey="production"
                        barSize={20}
                        fill={PRODUCTION_COLOR}
                    />
                    <Line
                        yAxisId="price"
                        type="monotone"
                        dataKey="price"
                        stroke={PRICE_COLOR}
                        strokeWidth={3}
                    />
                    <Tooltip content={ChartTooltip} />
                    <Legend />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ElectricityChart
