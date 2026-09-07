import ChartDatePicker from '../components/datepicker.tsx'
import { type Dispatch, type SetStateAction } from 'react'

export interface FiltersProps {
    disableApply: boolean
    disableClear: boolean
    isRange: boolean
    setIsRange: Dispatch<SetStateAction<boolean>>
    selectedDate: Date | null
    onDateChange: (date: Date | null) => void
    onApplyFilters: () => void
    onClearFilters: () => void
}

function Filters({
    disableApply,
    disableClear,
    isRange,
    setIsRange,
    selectedDate,
    onDateChange,
    onApplyFilters,
    onClearFilters
}: FiltersProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-3 border-2 border-E1 p-2 sm:flex-row">
            <div className="flex items-center gap-3 border-2 border-P1">
                <ChartDatePicker
                    withRange={isRange}
                    selectedDate={selectedDate}
                    onDateChange={onDateChange}
                />
                <input
                    type="checkbox"
                    checked={isRange}
                    onChange={() => setIsRange(!isRange)}
                    id="range-date"
                />
                <label htmlFor="range-date" className="text-xs text-G3">
                    search with range
                </label>
            </div>
            <div className="flex flex-col gap-3 border-2 border-S1 sm:flex-row">
                <button
                    className="flex w-full items-center justify-center hover:underline hover:underline-offset-4 disabled:text-G3 disabled:no-underline"
                    disabled={disableApply}
                    onClick={onApplyFilters}
                >
                    apply
                </button>
                <button
                    className="flex w-full items-center justify-center hover:underline hover:underline-offset-4 disabled:text-G3 disabled:no-underline"
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
