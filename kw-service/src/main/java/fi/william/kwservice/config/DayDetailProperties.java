package fi.william.kwservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@ConfigurationProperties(prefix = "kilowatch.day-details")
public record DayDetailProperties(
    int cheapestHoursCount,
    int peakHoursCount,
    // Scale multiplier used for calculating production and consumption difference
    BigDecimal scaleMultiplier
) {
}
