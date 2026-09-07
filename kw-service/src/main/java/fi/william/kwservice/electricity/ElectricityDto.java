package fi.william.kwservice.electricity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ElectricityDto(
    long id,
    LocalDate date,
    LocalDateTime startTime,
    BigDecimal productionAmount,
    BigDecimal consumptionAmount,
    BigDecimal hourlyPrice
) {
}
