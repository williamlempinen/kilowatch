import { describe, expect, test } from 'vitest'
import { dateToHour, durationSlice, parseDayParam, toDayParam } from './utils.ts'

describe('utils tests', () => {
    test('durationSlice slices the string accordingly', () => {
        const durations = ['PT1H', 'PT2H', 'PT3H']
        expect(durationSlice(durations[0])).toBe(1)
        expect(durationSlice(durations[1])).toBe(2)
        expect(durationSlice(durations[2])).toBe(3)
    })

    test('toDayParam formats a date as YYYY-MM-DD (or yyyy/MM/dd for the datepicker)', () => {
        const date = new Date(2023, 0, 5) // local 2023-01-05
        expect(toDayParam(date)).toBe('2023-01-05')
        expect(toDayParam(date, true)).toBe('2023/01/05')
    })

    test('parseDayParam returns a Date for valid input and null otherwise', () => {
        const parsed = parseDayParam('2023-01-05')
        expect(parsed).toBeInstanceOf(Date)
        expect(toDayParam(parsed as Date)).toBe('2023-01-05')

        expect(parseDayParam('2023-01-01asd')).toBeNull()
        expect(parseDayParam(null)).toBeNull()
    })

    test('dateToHour returns the local hour formatted as HH:00', () => {
        expect(dateToHour('2023-01-05T09:30:00')).toBe('09:00')
    })
})
