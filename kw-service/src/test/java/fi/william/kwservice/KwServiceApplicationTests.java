package fi.william.kwservice;

import fi.william.kwservice.electricity.DayDetail;
import fi.william.kwservice.electricity.ElectricityService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Valid dates set to the test dataset include:
 * 2021: Jan 1 -> Jan 2
 * 2024: Jan 1 -> Jan 8
 */
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@Sql(scripts = {"/schema.sql", "/data.sql"})
class KwServiceApplicationTests {
    @Autowired
    private ElectricityService service;

    @Test
    void getDetails_returns_expected_shape() {
        DayDetail result = service.getElectricityDetailsByDay("2024-01-01");

        assertThat(result.date()).isEqualTo(LocalDate.of(2024, 1, 1));
        assertThat(result.measures()).hasSize(24);
        assertThat(result.peakConsumptions()).hasSize(3);
        assertThat(result.cheapestHours()).hasSize(3);
    }

    @Test
    void getDetails_on_empty_date_returns_empty_dayDetail() {
        DayDetail result = service.getElectricityDetailsByDay("2025-01-01");

        assertThat(result.date()).isEqualTo(LocalDate.of(2025, 1, 1));
        assertThat(result.measures()).isEmpty();
        assertThat(result.peakConsumptions()).isEmpty();
        assertThat(result.cheapestHours()).isEmpty();
        assertThat(result.totalConsumption()).isNull();
        assertThat(result.totalProduction()).isNull();
        assertThat(result.averagePrice()).isNull();
        assertThat(result.negativePeriod()).isNull();
    }

    @Test
    void getDetails_computes_totals_and_average() {
        DayDetail result = service.getElectricityDetailsByDay("2024-01-01");

        assertThat(result.totalConsumption()).isEqualByComparingTo("204677.5286");
        assertThat(result.totalProduction()).isEqualByComparingTo("1072392");
        assertThat(result.averagePrice()).isEqualByComparingTo("5.5905");
    }

    @Test
    void getDetails_peakConsumptions_ordered_by_consumption_descending() {
        DayDetail result = service.getElectricityDetailsByDay("2024-01-01");

        assertThat(result.peakConsumptions())
            .extracting(DayDetail.PeakHour::hour)
            .containsExactly("17:00", "16:00", "15:00");

        assertThat(result.peakConsumptions().getFirst().consumption())
            .isEqualByComparingTo("9310.8124");
    }

    @Test
    void getDetails_cheapestHours_ordered_by_price_ascending() {
        DayDetail result = service.getElectricityDetailsByDay("2024-01-01");

        assertThat(result.cheapestHours())
            .extracting(DayDetail.HourPrice::hour)
            .containsExactly("06:00", "07:00", "05:00");

        assertThat(result.cheapestHours().getFirst().price()).isEqualByComparingTo("2.633");
    }

    @Test
    void getDetails_measures_sorted_by_startTime_and_scaled() {
        DayDetail result = service.getElectricityDetailsByDay("2024-01-01");
        List<DayDetail.Measure> measures = result.measures();
        DayDetail.Measure first = measures.getFirst();

        assertThat(measures.getLast().startTime()).isEqualTo(LocalDateTime.of(2024, 1, 1, 23, 0));

        assertThat(first.startTime()).isEqualTo(LocalDateTime.of(2024, 1, 1, 0, 0));
        assertThat(first.consumption()).isEqualByComparingTo("7754.5160");
        assertThat(first.production()).isEqualByComparingTo("43602");
        assertThat(first.price()).isEqualByComparingTo("4.961");
    }

    @Test
    void getDetails_peakConsumption_firstHour_and_average_for_another_day() {
        DayDetail result = service.getElectricityDetailsByDay("2024-01-02");

        assertThat(result.peakConsumptions().getFirst().hour()).isEqualTo("15:00");
        assertThat(result.averagePrice()).isEqualByComparingTo("21.3008");
    }

    @Test
    void getDetails_no_negative_prices_yields_null_period() {
        assertThat(service.getElectricityDetailsByDay("2024-01-01").negativePeriod()).isNull();
        assertThat(service.getElectricityDetailsByDay("2024-01-05").negativePeriod()).isNull();
    }

    @Test
    void getDetails_nullConsumption_excluded_from_peaks_and_totals() {
        DayDetail result = service.getElectricityDetailsByDay("2021-01-01");

        assertThat(result.totalConsumption()).isEqualByComparingTo("0");
        assertThat(result.peakConsumptions()).isEmpty();

        assertThat(result.totalProduction()).isEqualByComparingTo("174115");
        assertThat(result.measures()).hasSize(24);
    }

    @Test
    void getDetails_nullPrice_skipped_in_cheapest_and_average() {
        DayDetail result = service.getElectricityDetailsByDay("2021-01-01");

        assertThat(result.averagePrice()).isEqualByComparingTo("3.2585");
        assertThat(result.cheapestHours())
            .extracting(DayDetail.HourPrice::hour)
            .containsExactly("04:00", "05:00", "03:00");
    }

    @Test
    void getDetails_measures_preserve_nulls() {
        DayDetail result = service.getElectricityDetailsByDay("2021-01-01");
        DayDetail.Measure first = result.measures().getFirst();

        assertThat(first.startTime()).isEqualTo(LocalDateTime.of(2021, 1, 1, 0, 0));
        assertThat(first.consumption()).isEqualByComparingTo("0");
        assertThat(first.price()).isNull();
        assertThat(first.production()).isEqualByComparingTo("6890");
    }
}
