import Statistics from './pages/statistics'
import Layout from './layout.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient.ts'

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
