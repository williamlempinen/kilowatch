/**
 * Format a Date as YYYY-MM-DD
 * isDatePicker option is currently only used to format the current date for datepicker rendering
 * formatting it to: yyyy/MM/dd
 */
export function toDayParam(date: Date, isDatePicker: boolean = false): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return isDatePicker ? `${year}/${month}/${day}` : `${year}-${month}-${day}`
}

/**
 * Safely parse a `YYYY-MM-DD` day param into a Date.
 * Returns null when the value is missing or not a valid date, so callers never pass an
 * `Invalid Date` into components such as the date picker (which throws on formatting).
 */
export function parseDayParam(day: string | null): Date | null {
    if (!day) return null
    const date = new Date(`${day}T00:00:00`)
    return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Slice DayDetail duration string's to return just number
 * E.g. "PT13H" -> 13
 * @param duration
 */
export function durationSlice(duration: string): number {
    return parseInt(duration.split('').slice(2, -1).join(''))
}

/**
 * Returns the hour of a date object in format of HH:00
 * @param date
 */
export function dateToHour(date: string): string {
    return new Date(date).getHours().toString().padStart(2, '0') + ':00'
}
