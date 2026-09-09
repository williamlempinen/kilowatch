import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorTypography from './error.tsx'

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Uncaught error in component tree:', error, info)
    }

    private handleReset = () => {
        this.setState({ hasError: false })
        window.location.assign('/statistics')
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[60vh] items-center justify-center">
                    <ErrorTypography
                        message="something went wrong, please try again"
                        action={this.handleReset}
                    />
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
