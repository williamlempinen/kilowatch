package fi.william.kwservice.electricity;

import fi.william.kwservice.config.DayDetailProperties;
import fi.william.kwservice.exception.InvalidDateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
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
        BigDecimal totalConsumption = detailsUtil.sumNonNull(data.stream().map(ElectricityDto::consumptionAmount).toList());
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

        List<DayDetail.Measure> measures = createMeasures(data);

        return new DayDetail(
            date,
            totalConsumption,
            totalProduction,
            averagePrice,
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
                measure.consumptionAmount().subtract(measure.productionAmount())
            ))
            .sorted(Comparator.comparing(DayDetail.PeakHour::consumptionMinusProduction).reversed())
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

    List<DayDetail.Measure> createMeasures(List<ElectricityDto> data) {
        return data.stream()
            .sorted(Comparator.comparing(ElectricityDto::startTime))
            .map(measure -> new DayDetail.Measure(
                measure.startTime(),
                measure.consumptionAmount(),
                measure.productionAmount(),
                measure.hourlyPrice())
            )
            .toList();
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
