import { API_BASE } from './constants.ts'

class ApiError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export interface ElectricityData {
    id: number
    date: string
    startTime: string
    productionAmount: number
    consumptionAmount: number
    hourlyPrice: number
}

const getHeaders = () => ({
    Accept: 'application/json'
})

export async function apiFetch(
    isRange: boolean,
    day: string,
    signal?: AbortSignal
): Promise<ElectricityData[]> {
    const params = new URLSearchParams({ day })
    const url = `${API_BASE}${isRange ? '/range' : ''}?${params.toString()}`

    const response = await fetch(url, {
        headers: getHeaders(),
        signal
    })
    if (!response.ok) {
        throw new ApiError(`Failed to fetch data for day ${day}: ${response.statusText}`)
    }
    const json = await response.json()
    return json as ElectricityData[]
}
