package fi.william.kwservice.electricity;

import fi.william.kwservice.config.DayDetailProperties;
import fi.william.kwservice.exception.InvalidDateException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

public class ElectricityServiceTest {
    private static final BigDecimal SCALE_MULTIPLIER = new BigDecimal("1000");
    private ElectricityRepository repository;
    private ElectricityService service;

    @BeforeEach
    void setup() {
        repository = mock(ElectricityRepository.class);
        service = new ElectricityService(
            repository,
            new DayDetailProperties(3, 3, SCALE_MULTIPLIER),
            new DetailsUtil()
        );
    }

    @Test
    void parseDay_valid_returns_LocalDate() {
        assertThat(service.parseDay("2023-10-03")).isEqualTo(LocalDate.of(2023, 10, 3));
    }

    @Test
    void parseDay_impossible_date_throws_InvalidDateException() {
        assertThatThrownBy(() -> service.parseDay("2023-13-40"))
            .isInstanceOf(InvalidDateException.class);
    }

    @Test
    void parseDay_wrong_format_throws_withMessage() {
        assertThatThrownBy(() -> service.parseDay("03-10-2023"))
            .isInstanceOf(InvalidDateException.class)
            .hasMessageContaining("Invalid date format");
    }

    @Test
    void parseDay_garbage_throws_InvalidDateException() {
        assertThatThrownBy(() -> service.parseDay("hello-world"))
            .isInstanceOf(InvalidDateException.class);
    }

    @Test
    void getDetails_invalid_day_throws_and_never_hits_repository() {
        assertThatThrownBy(() -> service.getElectricityDetailsByDay("hello-world"))
            .isInstanceOf(InvalidDateException.class);
        verifyNoInteractions(repository);
    }


    @Test
    void toMwhScale_divides_by_scaleMultiplier() {
        assertThat(service.toMwhScale(new BigDecimal("2500"))).isEqualByComparingTo("2.5");
    }

    @Test
    void toMwhScale_rounds_to_four_decimals() {
        assertThat(service.toMwhScale(new BigDecimal("1"))).isEqualByComparingTo("0.001");
    }

    @Test
    void toMwhScale_null_returns_zero() {
        assertThat(service.toMwhScale(null)).isEqualByComparingTo("0");
    }
}
