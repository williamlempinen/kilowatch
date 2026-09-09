import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, fetchDayDetail } from './api'

describe('fetchDayDetail', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns parsed data on success', async () => {
        const payload = { date: '2023-10-12', measures: [] }
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }))

        const result = await fetchDayDetail('2023-10-12')
        expect(result).toEqual(payload)
    })

    it('sends the day as a query param', async () => {
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))

        await fetchDayDetail('2023-10-12')

        const calledUrl = vi.mocked(fetch).mock.calls[0][0] as URL
        expect(calledUrl.searchParams.get('day')).toBe('2023-10-12')
    })

    it('throws ApiError with the backend message on a 400', async () => {
        const errorBody = {
            timestamp: '2026-09-09T13:59:23',
            status: '400 BAD_REQUEST',
            message: 'Requested day is in the future: 2026-09-10'
        }
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(errorBody), { status: 400 }))

        await expect(fetchDayDetail('2026-09-10')).rejects.toMatchObject({
            message: 'Requested day is in the future: 2026-09-10',
            status: 400
        })
    })

    it('falls back to statusText when the error body is not JSON', async () => {
        vi.mocked(fetch).mockResolvedValue(
            new Response('not json', { status: 500, statusText: 'Internal Server Error' })
        )

        await expect(fetchDayDetail('2023-10-12')).rejects.toMatchObject({
            message: 'Internal Server Error',
            status: 500
        })
    })

    it('preserves the ApiError type', async () => {
        vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 404 }))
        await expect(fetchDayDetail('x')).rejects.toBeInstanceOf(ApiError)
    })
})
