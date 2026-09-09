export interface ErrorTypographyProps {
    message: string
    action?: () => void
}

function ErrorTypography({ message = 'oops, error occurred', action }: ErrorTypographyProps) {
    return (
        <div className="flex flex-col p-2">
            <p className="text-xl! text-E1!">{message}</p>
            {action && <button onClick={action}>recover</button>}
        </div>
    )
}

export default ErrorTypography
