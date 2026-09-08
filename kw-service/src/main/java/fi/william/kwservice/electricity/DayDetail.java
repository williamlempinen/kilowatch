package fi.william.kwservice.electricity;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * A record describing the aggregated data and measures for a single day.
 *
 * @param date
 * @param totalConsumption
 * @param totalProduction
 * @param averagePrice
 * @param peakConsumptions
 * @param cheapestHours
 * @param measures
 */
public record DayDetail(
    LocalDate date,
    BigDecimal totalConsumption,
    BigDecimal totalProduction,
    BigDecimal averagePrice,
    NegativePeriod negativePeriod,
    List<PeakHour> peakConsumptions,
    List<HourPrice> cheapestHours,
    List<Measure> measures
) {
    /**
     * Create an empty DayDetail record with just current date.
     *
     * @param date Current date
     * @return DayDetail
     */
    public static DayDetail empty(LocalDate date) {
        return new DayDetail(
            date,
            null,
            null,
            null,
            null,
            List.of(),
            List.of(),
            List.of()
        );
    }

    /**
     * A record describing the longest consecutive time period where the price has been less than zero.
     *
     * @param start
     * @param end
     * @param duration
     */
    public record NegativePeriod(
        LocalDateTime start,
        LocalDateTime end,
        Duration duration
    ) {
    }

    /**
     * A record consisting a pair of timestamp and consumption minus production.
     * Use for collecting the peak hour for given day when consumption exceeded production.
     *
     * @param hour
     * @param consumption
     */
    public record PeakHour(String hour, BigDecimal consumption) {
    }

    /**
     * A record consisting a pair of timestamp and price.
     * Use for collecting the cheapest hour for given day.
     *
     * @param hour
     * @param price
     */
    public record HourPrice(String hour, BigDecimal price) {
    }

    /**
     * A record for single measure. Stripped down ElectricityDto.
     *
     * @param startTime
     * @param consumption
     * @param production
     * @param price
     */
    public record Measure(
        LocalDateTime startTime,
        BigDecimal consumption,
        BigDecimal production,
        BigDecimal price
    ) {
    }
}
