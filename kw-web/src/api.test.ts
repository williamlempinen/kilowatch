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

    it('preserves the ApiError type', async () => {
        vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 404 }))
        await expect(fetchDayDetail('x')).rejects.toBeInstanceOf(ApiError)
    })
})
