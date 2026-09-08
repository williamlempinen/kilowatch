import Statistics from './pages/statistics'
import Layout from './layout.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DURATION_15_MIN } from './constants.ts'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity, // constant data, i.e. no new data
            gcTime: DURATION_15_MIN, // keep old cache for 15min
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path={'/'} element={<Statistics />} />
                        <Route path="/*" element={<Navigate to={'/'} replace />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
