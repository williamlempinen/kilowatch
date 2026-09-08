/**
 * Format a Date as YYYY-MM-DD
 * isDatePicker option is currently only used to format the current date for datepicker rendering
 */
export function toDayParam(date: Date, isDatePicker: boolean = false): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return isDatePicker ? `${year}/${month}/${day}` : `${year}-${month}-${day}`
}

/**
 * Slice DayDetail duration string's to return just number
 * E.g. "PT13H" -> 13
 * @param duration
 */
export function durationSlice(duration: string): number {
    return parseInt(duration.split('').slice(2, -1).join(''))
}

export function dateToHour(date: string): string {
    return new Date(date).getHours().toString().padStart(2, '0') + ':00'
}
