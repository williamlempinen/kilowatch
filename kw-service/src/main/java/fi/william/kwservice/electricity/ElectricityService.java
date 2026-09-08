package fi.william.kwservice.electricity;

import fi.william.kwservice.config.DayDetailProperties;
import fi.william.kwservice.exception.InvalidDateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ElectricityService {
    private final Logger log = LoggerFactory.getLogger(ElectricityService.class);

    private final ElectricityRepository electricityRepository;
    private final DayDetailProperties dayDetailProperties;
    private final DetailsUtil detailsUtil;

    public ElectricityService(
        ElectricityRepository electricityRepository,
        DayDetailProperties dayDetailProperties,
        DetailsUtil detailsUtil
    ) {
        this.electricityRepository = electricityRepository;
        this.dayDetailProperties = dayDetailProperties;
        this.detailsUtil = detailsUtil;
    }

    @Transactional(readOnly = true)
    public DayDetail getElectricityDetailsByDay(String day) {
        LocalDate parsedDate = parseDay(day);
        List<ElectricityDto> data = electricityRepository.findAllByDay(parsedDate);
        log.debug("Fetched {} electricity data entries for day: {}", data.size(), parsedDate);

        return data.isEmpty()
            ? DayDetail.empty(parsedDate)
            : calculateDayDetail(parsedDate, data);
    }

    DayDetail calculateDayDetail(LocalDate date, List<ElectricityDto> data) {
        BigDecimal totalConsumption = toMwhScale(detailsUtil.sumNonNull(data.stream().map(ElectricityDto::consumptionAmount).toList()));
        BigDecimal totalProduction = detailsUtil.sumNonNull(data.stream().map(ElectricityDto::productionAmount).toList());
        BigDecimal averagePrice = detailsUtil.avgNonNull(data.stream().map(ElectricityDto::hourlyPrice).toList());
        log.debug("Calculated totalConsumption: {}, totalProduction: {}, averagePrice: {} for day: {}",
            totalConsumption,
            totalProduction,
            averagePrice,
            date
        );

        List<DayDetail.PeakHour> peakHours = calculatePeakHours(data);
        log.debug("Calculated peak hours: {}", peakHours);

        List<DayDetail.HourPrice> cheapestHours = calculateCheapestHours(data);
        log.debug("Calculated cheapest hours: {}", cheapestHours);

        DayDetail.NegativePeriod negativePeriod = calculateLongestNegativePeriod(data);
        log.debug("Calculated longest negative period: {}", negativePeriod);

        List<DayDetail.Measure> measures = createMeasures(data);

        return new DayDetail(
            date,
            totalConsumption,
            totalProduction,
            averagePrice,
            negativePeriod,
            peakHours,
            cheapestHours,
            measures
        );
    }

    List<DayDetail.PeakHour> calculatePeakHours(List<ElectricityDto> data) {
        return data.stream()
            .filter(measure -> measure.consumptionAmount() != null && measure.productionAmount() != null)
            .map(measure -> new DayDetail.PeakHour(
                detailsUtil.toHourFormat(measure.startTime()),
                toMwhScale(measure.consumptionAmount())
            ))
            .sorted(Comparator.comparing(DayDetail.PeakHour::consumption).reversed())
            .limit(dayDetailProperties.peakHoursCount())
            .toList();
    }

    List<DayDetail.HourPrice> calculateCheapestHours(List<ElectricityDto> data) {
        return data.stream()
            .filter(measure -> measure.hourlyPrice() != null)
            .sorted(
                Comparator.comparing(ElectricityDto::hourlyPrice).thenComparing(ElectricityDto::startTime)
            )
            .limit(dayDetailProperties.cheapestHoursCount())
            .map(measure -> new DayDetail.HourPrice(
                detailsUtil.toHourFormat(measure.startTime()),
                measure.hourlyPrice())
            )
            .toList();
    }

    /**
     * Calculates the longest continuous period of negative electricity prices from the provided data.
     *
     * @param data list should be ordered by the dto startTime
     */
    DayDetail.NegativePeriod calculateLongestNegativePeriod(List<ElectricityDto> data) {
        List<ElectricityDto> sortedData = data.stream()
            .sorted(Comparator.comparing(ElectricityDto::startTime))
            .toList();

        LocalDateTime currentStart = null;
        LocalDateTime longestStart = null;
        LocalDateTime longestEnd = null;
        Duration longestDuration = Duration.ZERO;

        for (ElectricityDto ed : sortedData) {
            BigDecimal price = ed.hourlyPrice();
            boolean negative = price != null && price.signum() < 0;

            if (negative) {
                if (currentStart == null) currentStart = ed.startTime();
            } else if (currentStart != null) {
                LocalDateTime currentEnd = ed.startTime();
                Duration duration = Duration.between(currentStart, currentEnd);

                if (duration.compareTo(longestDuration) > 0) {
                    longestDuration = duration;
                    longestStart = currentStart;
                    longestEnd = currentEnd;
                }

                currentStart = null;
            }
        }

        if (currentStart != null) {
            LocalDateTime currentEnd = sortedData.getLast().startTime().plusHours(1);
            Duration duration = Duration.between(currentStart, currentEnd);

            if (duration.compareTo(longestDuration) > 0) {
                longestDuration = duration;
                longestStart = currentStart;
                longestEnd = currentEnd;
            }
        }

        if (longestStart == null) return null;

        return new DayDetail.NegativePeriod(
            longestStart,
            longestEnd,
            longestDuration
        );
    }

    List<DayDetail.Measure> createMeasures(List<ElectricityDto> data) {
        return data.stream()
            .sorted(Comparator.comparing(ElectricityDto::startTime))
            .map(measure -> new DayDetail.Measure(
                measure.startTime(),
                toMwhScale(measure.consumptionAmount()),
                measure.productionAmount(),
                measure.hourlyPrice())
            )
            .toList();
    }

    BigDecimal toMwhScale(BigDecimal amount) {
        return detailsUtil.nonNull(amount).divide(dayDetailProperties.scaleMultiplier(), 4, RoundingMode.HALF_UP);
    }

    LocalDate parseDay(String day) {
        try {
            return LocalDate.parse(day);
        } catch (Exception e) {
            log.error("Error parsing payload day into LocalDate: {}", day, e);
            throw new InvalidDateException();
        }
    }
}
