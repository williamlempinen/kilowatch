import { QueryClient } from '@tanstack/react-query'
import { DURATION_15_MIN, DURATION_5_MIN } from './constants.ts'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: DURATION_5_MIN, // for the sake of exercise, mark the data as stale after 5min
            gcTime: DURATION_15_MIN, // keep old cache for 15min
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
})
