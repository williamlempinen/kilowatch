import { describe, expect, test } from 'vitest'
import { durationSlice } from './utils.ts'

describe('utils tests', () => {
    test('durationSlice slices the string accordingly', () => {
        const durations = ['PT1H', 'PT2H', 'PT3H']
        expect(durationSlice(durations[0])).toBe(1)
        expect(durationSlice(durations[1])).toBe(2)
        expect(durationSlice(durations[2])).toBe(3)
    })
})
