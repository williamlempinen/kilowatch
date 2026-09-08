package fi.william.kwservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "kilowatch.day-details")
public record DayDetailProperties(
    int cheapestHoursCount,
    int peakHoursCount
) {
}
