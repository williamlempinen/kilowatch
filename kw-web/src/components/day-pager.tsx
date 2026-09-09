export interface DayPagerProps {
    disable: boolean
    onPrevious: () => void
    onNext: () => void
}

function DayPager({ disable, onPrevious, onNext }: DayPagerProps) {
    return (
        <div className="my-2 flex w-full items-center justify-between">
            <button onClick={onPrevious}>previous day</button>
            <button onClick={onNext} disabled={disable}>
                next day
            </button>
        </div>
    )
}

export default DayPager
