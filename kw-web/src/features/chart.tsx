import type { ElectricityData } from '../api.ts'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts'
import { RechartsDevtools } from '@recharts/devtools'

export interface ElectricityChartProps {
    data: ElectricityData[]
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
                <Bar yAxisId="amount" dataKey="consumptionAmount" barSize={20} fill="#413ea0" />
                <Bar dataKey="productionAmount" barSize={20} fill="#413ea0" />
                <Line yAxisId="price" type="monotone" dataKey="hourlyPrice" stroke="#ff7300" />
                <Tooltip />
                <Legend />
                <RechartsDevtools />
            </ComposedChart>
        </div>
    )
}

export default ElectricityChart
