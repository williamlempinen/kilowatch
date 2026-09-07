import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export interface ChartDatePickerProps {
    withRange: boolean
    disabled?: boolean
    start?: Date | null
    end?: Date | null
    selectedDate?: Date | null
    minDate?: Date
    maxDate?: Date
    onDateChange?: (date: Date | null) => void
}

function ChartDatePicker({
    withRange,
    disabled,
    start,
    end,
    selectedDate,
    onDateChange
}: ChartDatePickerProps) {
    const customInput = (
        <button
            type="button"
            disabled={disabled}
            className="flex w-full items-center justify-center hover:underline hover:underline-offset-4"
        >
            {!selectedDate && !start && <span className="text-md">select date</span>}
            {selectedDate && (
                <span className="md:text-md text-sm">{selectedDate.toLocaleDateString()}</span>
            )}
            {start && (
                <span className="md:text-md text-sm">
                    {start.toLocaleDateString()}
                    <span className="text-P1"> - </span>
                </span>
            )}
            <span className="md:text-md text-sm">{end && end.toLocaleDateString()}</span>
        </button>
    )

    return (
        <div className="flex w-full flex-col">
            {withRange ? (
                <DatePicker
                    disabled={disabled}
                    startDate={start ?? undefined}
                    endDate={end ?? undefined}
                    selectsRange
                    onChange={(dates) => onDateChange?.(dates?.[0] ?? null)}
                    customInput={customInput}
                />
            ) : (
                <DatePicker
                    disabled={disabled}
                    selected={selectedDate}
                    onChange={(date: Date | null) => onDateChange?.(date)}
                    customInput={customInput}
                />
            )}
        </div>
    )
}

export default ChartDatePicker
