package fi.william.kwservice.electricity;

import fi.william.kwservice.exception.InvalidDateException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

public class ElectricityServiceTest {
    private ElectricityService service;

    @BeforeEach
    void setup() {
        ElectricityRepository repository = mock(ElectricityRepository.class);
        service = new ElectricityService(repository);
    }

    @Test
    void parseDay_valid_returnsLocalDate() {
        LocalDate result = service.parseDay("2023-10-03");
        assertThat(result).isEqualTo(LocalDate.of(2023, 10, 3));
    }

    @Test
    void parseDay_invalidDate_throwsInvalidDateException() {
        assertThatThrownBy(() -> service.parseDay("2023-13-40"))
            .isInstanceOf(InvalidDateException.class);
    }

    @Test
    void parseDay_invalidDate_format_throwsInvalidDateException() {
        assertThatThrownBy(() -> service.parseDay("03-10-2023"))
            .isInstanceOf(InvalidDateException.class)
            .hasMessageContaining("Invalid date format");
    }

    @Test
    void parseDay_invalidDate_text_throwsInvalidDateException() {
        assertThatThrownBy(() -> service.parseDay("hello-world"))
            .isInstanceOf(InvalidDateException.class);
    }
}
