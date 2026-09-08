package fi.william.kwservice.electricity;

import fi.william.kwservice.config.DayDetailProperties;
import fi.william.kwservice.exception.InvalidDateException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ElectricityServiceTest {
    private static final int TOP_MOST_COUNT = 2;
    private ElectricityRepository repository;
    private ElectricityService service;

    @BeforeEach
    void setup() {
        repository = mock(ElectricityRepository.class);
        service = new ElectricityService(
            repository,
            // note: properties configured differently than the default dev application
            new DayDetailProperties(TOP_MOST_COUNT, TOP_MOST_COUNT),
            new DetailsUtil()
        );
    }

    /**
     * ElectricityDto factory
     *
     * @param time
     * @param cons
     * @param prod
     * @param price
     * @return
     */
    private ElectricityDto dto(String time, String cons, String prod, String price) {
        return new ElectricityDto(
            1L,
            LocalDate.parse(time.substring(0, 10)),
            LocalDateTime.parse(time),
            prod == null ? null : new BigDecimal(prod),
            cons == null ? null : new BigDecimal(cons),
            price == null ? null : new BigDecimal(price)
        );
    }

    private LocalDateTime toLocalDate(String time) {
        return LocalDateTime.parse(time);
    }

    @Test
    void parseDay_valid_returnsLocalDate() {
        assertThat(service.parseDay("2023-10-03")).isEqualTo(LocalDate.of(2023, 10, 3));
    }

    @Test
    void parseDay_impossibleDate_throwsInvalidDateException() {
        assertThatThrownBy(() -> service.parseDay("2023-13-40"))
            .isInstanceOf(InvalidDateException.class);
    }

    @Test
    void parseDay_wrongFormat_throwsWithMessage() {
        assertThatThrownBy(() -> service.parseDay("03-10-2023"))
            .isInstanceOf(InvalidDateException.class)
            .hasMessageContaining("Invalid date format");
    }

    @Test
    void parseDay_garbage_throwsInvalidDateException() {
        assertThatThrownBy(() -> service.parseDay("hello-world"))
            .isInstanceOf(InvalidDateException.class);
    }

    @Test
    void getDetails_noData_returnsEmptyDayDetail() {
        when(repository.findAllByDay(any())).thenReturn(List.of());

        DayDetail result = service.getElectricityDetailsByDay("2023-10-12");

        assertThat(result.date()).isEqualTo(LocalDate.of(2023, 10, 12));
        assertThat(result.totalConsumption()).isNull();
        assertThat(result.totalProduction()).isNull();
        assertThat(result.averagePrice()).isNull();
        assertThat(result.peakConsumptionVsProductionHours()).isEmpty();
        assertThat(result.cheapestHours()).isEmpty();
        assertThat(result.measures()).isEmpty();
    }

    @Test
    void getDetails_invalidDay_throwsAndNeverHitsRepository() {
        assertThatThrownBy(() -> service.getElectricityDetailsByDay("hello-world"))
            .isInstanceOf(InvalidDateException.class);
        verifyNoInteractions(repository);
    }


    @Test
    void getDetails_computesTotalsAndAverage() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T00:00:00", "100", "10", "0.50"),
            dto("2023-10-12T01:00:00", "200", "10", "0.10"),
            dto("2023-10-12T02:00:00", "300", "10", "0.30")
        );
        when(repository.findAllByDay(LocalDate.of(2023, 10, 12))).thenReturn(data);

        DayDetail d = service.getElectricityDetailsByDay("2023-10-12");

        assertThat(d.date()).isEqualTo(LocalDate.of(2023, 10, 12));
        assertThat(d.totalConsumption()).isEqualByComparingTo("600");
        assertThat(d.totalProduction()).isEqualByComparingTo("30");
        assertThat(d.averagePrice()).isEqualByComparingTo("0.30");
    }

    @Test
    void getDetails_ignoresNullAmountsInTotals() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T00:00:00", "100", null, "0.10"),
            dto("2023-10-12T01:00:00", null, "40", "0.20")
        );
        when(repository.findAllByDay(any())).thenReturn(data);

        DayDetail d = service.getElectricityDetailsByDay("2023-10-12");

        assertThat(d.totalConsumption()).isEqualByComparingTo("100");
        assertThat(d.totalProduction()).isEqualByComparingTo("40");
        assertThat(d.averagePrice()).isEqualByComparingTo("0.15");
    }

    @Test
    void calculatePeakHours_returnsTopNByConsumptionMinusProductionDescending() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T00:00:00", "100", "10", "0"),
            dto("2023-10-12T01:00:00", "300", "10", "0"),
            dto("2023-10-12T02:00:00", "200", "10", "0")
        );

        List<DayDetail.PeakHour> peaks = service.calculatePeakHours(data);

        assertThat(peaks).hasSize(TOP_MOST_COUNT);
        assertThat(peaks.get(0).consumptionMinusProduction()).isEqualByComparingTo("290");
        assertThat(peaks.get(0).hour()).isEqualTo("01:00");
        assertThat(peaks.get(1).consumptionMinusProduction()).isEqualByComparingTo("190");
        assertThat(peaks.get(1).hour()).isEqualTo("02:00");
    }

    @Test
    void calculatePeakHours_skipsRowsWithNullConsumptionOrProduction() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T00:00:00", null, "10", "0"),
            dto("2023-10-12T01:00:00", "200", null, "0"),
            dto("2023-10-12T02:00:00", "300", "50", "0")
        );

        List<DayDetail.PeakHour> peaks = service.calculatePeakHours(data);

        assertThat(peaks).hasSize(TOP_MOST_COUNT - 1); // null values should not be included into top list
        assertThat(peaks.getFirst().hour()).isEqualTo("02:00");
        assertThat(peaks.getFirst().consumptionMinusProduction()).isEqualByComparingTo("250");
    }

    @Test
    void calculatePeakHours_noValidRows_returnsEmpty() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T00:00:00", null, null, "0")
        );
        assertThat(service.calculatePeakHours(data)).isEmpty();
    }

    @Test
    void calculateCheapestHours_returnsTopNByPriceAscending() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T00:00:00", "1", "1", "0.50"),
            dto("2023-10-12T01:00:00", "1", "1", "0.10"),
            dto("2023-10-12T02:00:00", "1", "1", "0.30")
        );

        List<DayDetail.HourPrice> cheapest = service.calculateCheapestHours(data);

        assertThat(cheapest).hasSize(TOP_MOST_COUNT);
        assertThat(cheapest.get(0).price()).isEqualByComparingTo("0.10");
        assertThat(cheapest.get(0).hour()).isEqualTo("01:00");
        assertThat(cheapest.get(1).price()).isEqualByComparingTo("0.30");
    }

    @Test
    void calculateCheapestHours_priceTie_ordersByStartTime() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T05:00:00", "1", "1", "0.10"),
            dto("2023-10-12T03:00:00", "1", "1", "0.10")
        );

        List<DayDetail.HourPrice> cheapest = service.calculateCheapestHours(data);

        assertThat(cheapest.getFirst().hour()).isEqualTo("03:00");
    }

    @Test
    void calculateCheapestHours_skipsNullPrices() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T00:00:00", "1", "1", null),
            dto("2023-10-12T01:00:00", "1", "1", "0.20")
        );

        List<DayDetail.HourPrice> cheapest = service.calculateCheapestHours(data);

        assertThat(cheapest).hasSize(1);
        assertThat(cheapest.getFirst().price()).isEqualByComparingTo("0.20");
    }

    @Test
    void createMeasures_sortedByStartTime_preservesNulls() {
        List<ElectricityDto> data = List.of(
            dto("2023-10-12T01:00:00", "200", null, "0.20"),
            dto("2023-10-12T00:00:00", null, "10", null),
            dto("2023-10-12T02:00:00", "300", "30", "0.30")
        );

        List<DayDetail.Measure> measures = service.createMeasures(data);

        assertThat(measures).extracting(DayDetail.Measure::startTime)
            .containsExactly(
                toLocalDate("2023-10-12T00:00:00"),
                toLocalDate("2023-10-12T01:00:00"),
                toLocalDate("2023-10-12T02:00:00"));

        assertThat(measures.get(0).consumption()).isNull();
        assertThat(measures.get(0).price()).isNull();
        assertThat(measures.get(1).production()).isNull();
    }
}
