import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toDayParam } from '../utils.ts'

export interface ChartDatePickerProps {
    disabled?: boolean
    selectedDate?: Date | null
    minDate?: Date
    maxDate?: Date
    onDateChange: (date: Date | null) => void
}

function ChartDatePicker({ disabled, selectedDate, onDateChange }: ChartDatePickerProps) {
    const customInput = (
        <button
            type="button"
            disabled={disabled}
            className="flex w-full items-center justify-center"
        >
            {!selectedDate && <span className="text-md">select date</span>}
            {selectedDate && (
                <span className="md:text-md text-xl">{toDayParam(selectedDate, true)}</span>
            )}
        </button>
    )

    return (
        <DatePicker
            disabled={disabled}
            selected={selectedDate}
            onChange={(date: Date | null) => onDateChange(date)}
            customInput={customInput}
        />
    )
}

export default ChartDatePicker
