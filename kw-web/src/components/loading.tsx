type LoadingProps = {
    height?: string
    width?: string
    className?: string
}

function Loading({ height = '3rem', width = '100%', className }: LoadingProps) {
    return (
        <div
            className={`my-2 animate-pulse rounded bg-G1 ${className}`}
            style={{ height, width }}
        ></div>
    )
}

export default Loading
