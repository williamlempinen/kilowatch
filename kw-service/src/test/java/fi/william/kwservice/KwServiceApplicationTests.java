package fi.william.kwservice;

import fi.william.kwservice.electricity.DayDetail;
import fi.william.kwservice.electricity.ElectricityService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;

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
    void getElectricityDetails_returns_expected_dayDetail() {
        DayDetail result = service.getElectricityDetailsByDay("2024-01-01");

        assertThat(result.measures()).hasSize(24);
        assertThat(result.peakConsumptionVsProductionHours()).hasSize(3);
        assertThat(result.cheapestHours()).hasSize(3);
        assertThat(result.date()).isEqualTo(LocalDate.of(2024, 1, 1));
    }
}
