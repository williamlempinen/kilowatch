package fi.william.kwservice.electricity;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;

@Component
public class DetailsUtil {
    public BigDecimal sumNonNull(List<BigDecimal> values) {
        return values.stream()
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal avgNonNull(List<BigDecimal> values) {
        List<BigDecimal> nonNullValues = values.stream()
            .filter(Objects::nonNull)
            .toList();
        if (nonNullValues.isEmpty()) {
            return BigDecimal.ZERO;
        }
        BigDecimal sum = sumNonNull(nonNullValues);
        return sum.divide(BigDecimal.valueOf(nonNullValues.size()), 4, RoundingMode.HALF_UP);
    }
}
