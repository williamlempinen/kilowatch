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
