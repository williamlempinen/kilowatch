package fi.william.kwservice.electricity;

import java.math.BigDecimal;
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
 * @param peakConsumptionVsProductionHours
 * @param cheapestHours
 * @param measures
 */
public record DayDetail(
    LocalDate date,
    BigDecimal totalConsumption,
    BigDecimal totalProduction,
    BigDecimal averagePrice,
    List<PeakHour> peakConsumptionVsProductionHours,
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
            List.of(),
            List.of(),
            List.of()
        );
    }

    /**
     * A record consisting a pair of timestamp and consumption minus production.
     * Use for collecting the peak hour for given day when consumption exceeded production.
     *
     * @param hour
     * @param consumptionMinusProduction
     */
    public record PeakHour(LocalDateTime hour, BigDecimal consumptionMinusProduction) {
    }

    /**
     * A record consisting a pair of timestamp and price.
     * Use for collecting the cheapest hour for given day.
     *
     * @param hour
     * @param price
     */
    public record HourPrice(LocalDateTime hour, BigDecimal price) {
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
