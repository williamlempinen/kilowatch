import { API_BASE } from './constants.ts'

export interface ElectricityData {
    id: number
    date: Date
    startTime: string
    productionAmount: number
    consumptionAmount: number
    hourlyProduction: number
}

const getHeaders = () => ({
    Accept: 'application/json'
})

export async function apiFetch(path: string, signal?: AbortSignal): Promise<ElectricityData[]> {
    const response = await fetch(`${API_BASE}/${path}`, { headers: getHeaders(), signal })
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${path}: ${response.statusText}`)
    }
    const json = await response.json()
    return json as ElectricityData[]
}
