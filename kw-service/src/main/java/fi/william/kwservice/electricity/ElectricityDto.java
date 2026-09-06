package fi.william.kwservice.electricity;

import java.sql.Timestamp;
import java.util.Date;

public record ElectricityDto(
    long id,
    Date date,
    Timestamp startTime,
    Double productionAmount,
    Double consumptionAmount,
    Double hourlyPrice
) {
}
