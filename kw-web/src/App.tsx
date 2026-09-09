import Statistics from './pages/statistics'
import Layout from './layout.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient.ts'
import ErrorBoundary from './components/error-boundary.tsx'
import { lazy, Suspense } from 'react'

const ReactQueryDevtools = import.meta.env.DEV
    ? lazy(() =>
          import('@tanstack/react-query-devtools').then((module) => ({
              default: module.ReactQueryDevtools
          }))
      )
    : () => null

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ErrorBoundary>
                    <Layout>
                        <Routes>
                            <Route path={'/statistics'} element={<Statistics />} />
                            <Route path="/*" element={<Navigate to={'/statistics'} replace />} />
                        </Routes>
                    </Layout>
                </ErrorBoundary>
            </BrowserRouter>
            {import.meta.env.DEV && (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            )}
        </QueryClientProvider>
    )
}

export default App
