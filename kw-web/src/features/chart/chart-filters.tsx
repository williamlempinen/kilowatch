import ChartDatePicker from '../../components/datepicker.tsx'

export interface FiltersProps {
    disableApply: boolean
    disableClear: boolean
    selectedDate: Date | null
    onDateChange: (date: Date | null) => void
    onApplyFilters: () => void
    onClearFilters: () => void
}

function Filters({
    disableApply,
    disableClear,
    selectedDate,
    onDateChange,
    onApplyFilters,
    onClearFilters
}: FiltersProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-3 border-2 border-E1 p-2 sm:flex-row">
            <div className="flex items-center gap-3 border-2 border-P1">
                <ChartDatePicker selectedDate={selectedDate} onDateChange={onDateChange} />
            </div>
            <div className="flex flex-col gap-3 border-2 border-S1 sm:flex-row">
                <button
                    className="hover:underline hover:underline-offset-4 disabled:text-G3 disabled:no-underline"
                    disabled={disableApply}
                    onClick={onApplyFilters}
                >
                    apply
                </button>
                <button
                    className="hover:underline hover:underline-offset-4 disabled:text-G3 disabled:no-underline"
                    disabled={disableClear}
                    onClick={onClearFilters}
                >
                    clear
                </button>
            </div>
        </div>
    )
}

export default Filters
