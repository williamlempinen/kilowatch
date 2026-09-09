import { API_BASE } from './constants.ts'

export interface ApiErrorBody {
    timestamp: string
    status: string
    message: string
}

export class ApiError extends Error {
    readonly status: number
    readonly body: ApiErrorBody | null

    constructor(message: string, status: number, body: ApiErrorBody | null = null) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.body = body
    }
}

export interface NegativePeriod {
    start: string
    end: string
    duration: string
}

export interface PeakHour {
    hour: string
    consumption: number
}

export interface HourPrice {
    hour: string
    price: number
}

export interface Measure {
    startTime: string
    consumption: number | null
    production: number | null
    price: number | null
}

export interface DayDetail {
    date: string
    totalConsumption: number | null
    totalProduction: number | null
    averagePrice: number | null
    negativePeriod: NegativePeriod | null
    peakConsumptions: PeakHour[]
    cheapestHours: HourPrice[]
    measures: Measure[]
}

const getHeaders = () => ({
    Accept: 'application/json'
})

async function apiFetch<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    signal?: AbortSignal
): Promise<T> {
    const url = new URL(`${API_BASE}${path}`, window.location.origin)
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) url.searchParams.set(key, `${value}`)
        }
    }

    const response = await fetch(url, {
        headers: getHeaders(),
        signal
    })

    if (!response.ok) {
        let body: ApiErrorBody | null = null
        try {
            body = await response.json()
        } catch {
            /* empty */
        }
        throw new ApiError(body?.message ?? response.statusText, response.status, body)
    }

    return (await response.json()) as T
}

export async function fetchDayDetail(day: string, signal?: AbortSignal): Promise<DayDetail> {
    return apiFetch<DayDetail>(`/electricity`, { day }, signal)
}
