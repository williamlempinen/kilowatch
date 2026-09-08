import type { Measure } from '../api.ts'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts'
import { RechartsDevtools } from '@recharts/devtools'

function ChartTooltip() {
    return (
        <div>
            <p>hello</p>
        </div>
    )
}

export interface ElectricityChartProps {
    data: Measure[]
}

function ElectricityChart({ data }: ElectricityChartProps) {
    const chartStyles = {
        width: '100%',
        maxWidth: '1600px',
        maxHeight: '70vh',
        aspectRatio: 1.618,
        border: '2px',
        borderStyle: 'dashed',
        borderColor: 'red'
    }

    console.log('data 0: ', data[0])

    return (
        <div>
            <ComposedChart
                style={chartStyles}
                responsive
                data={data}
                margin={{
                    top: 20,
                    right: 0,
                    bottom: 0,
                    left: 0
                }}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="startTime" scale="band" />
                <YAxis yAxisId="price" width="auto" />
                <YAxis yAxisId="amount" orientation="right" width="auto" niceTicks="snap125" />
                <Bar yAxisId="amount" dataKey="consumption" barSize={20} fill="#413ea0" />
                <Bar yAxisId="amount" dataKey="production" barSize={20} fill="#00b6d9" />
                <Line yAxisId="price" type="monotone" dataKey="price" stroke="#ff7300" />
                <Tooltip />
                <Legend />
                <RechartsDevtools />
            </ComposedChart>
        </div>
    )
}

export default ElectricityChart
