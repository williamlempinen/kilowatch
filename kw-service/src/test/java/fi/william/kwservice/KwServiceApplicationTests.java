package fi.william.kwservice;

import fi.william.kwservice.electricity.ElectricityDto;
import fi.william.kwservice.electricity.ElectricityService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
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
    void getAllOnDay_returnsTwentyFourHourlyEntries() {
        List<ElectricityDto> result = service.getAllOnDay("2023-10-03");

        assertThat(result).hasSize(24);
        assertThat(result).allSatisfy(dto ->
            assertThat(dto.date()).isEqualTo(LocalDate.of(2023, 10, 3)));
    }
}
