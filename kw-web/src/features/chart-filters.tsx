import ChartDatePicker from '../components/datepicker.tsx'

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
        <div className="flex flex-col items-center justify-end gap-12 p-2 sm:flex-row">
            <ChartDatePicker selectedDate={selectedDate} onDateChange={onDateChange} />
            <div className="flex flex-col gap-3 sm:flex-row">
                <button disabled={disableApply} onClick={onApplyFilters}>
                    apply
                </button>
                <button disabled={disableClear} onClick={onClearFilters}>
                    clear
                </button>
            </div>
        </div>
    )
}

export default Filters
