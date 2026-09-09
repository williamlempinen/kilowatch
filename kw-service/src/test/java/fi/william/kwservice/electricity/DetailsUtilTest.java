package fi.william.kwservice.electricity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

class DetailsUtilTest {
    private final DetailsUtil util = new DetailsUtil();

    @Test
    void sumNonNull_sums_values() {
        assertThat(util.sumNonNull(Arrays.asList(
            new BigDecimal("1"),
            new BigDecimal("2"),
            new BigDecimal("3")
        )))
            .isEqualByComparingTo("6");
    }

    @Test
    void sumNonNull_skips_nulls() {
        List<BigDecimal> values = Arrays.asList(
            new BigDecimal("1"),
            null,
            new BigDecimal("3")
        );
        assertThat(util.sumNonNull(values)).isEqualByComparingTo("4");
    }

    @Test
    void sumNonNull_empty_list_returns_zero() {
        assertThat(util.sumNonNull(List.of()))
            .isEqualByComparingTo("0");
    }

    @Test
    void sumNonNull_all_nulls_returns_zero() {
        assertThat(util.sumNonNull(Arrays.asList(null, null)))
            .isEqualByComparingTo("0");
    }

    @Test
    void sumNonNull_mixes_negatives_and_positives() {
        assertThat(util.sumNonNull(Arrays.asList(
            new BigDecimal("-5"),
            new BigDecimal("3")
        )))
            .isEqualByComparingTo("-2");
    }

    @Test
    void avgNonNull_computes_mean() {
        assertThat(util.avgNonNull(Arrays.asList(
            new BigDecimal("2"),
            new BigDecimal("4")
        )))
            .isEqualByComparingTo("3");
    }

    @Test
    void avgNonNull_ignores_nulls_in_both_sum_and_count() {
        List<BigDecimal> values = Arrays.asList(
            new BigDecimal("2"),
            null,
            new BigDecimal("4")
        );
        assertThat(util.avgNonNull(values))
            .isEqualByComparingTo("3");
    }

    @Test
    void avgNonNull_empty_list_returns_zero() {
        assertThat(util.avgNonNull(List.of()))
            .isEqualByComparingTo("0");
    }

    @Test
    void avgNonNull_all_nulls_returns_zero() {
        assertThat(util.avgNonNull(Arrays.asList(
            null,
            null
        )))
            .isEqualByComparingTo("0");
    }

    @Test
    void avgNonNull_non_terminating_quotient_does_not_throw_and_rounds() {
        // 1 / 3 must not blow up with ArithmeticException (rounding must be applied)
        List<BigDecimal> values = Arrays.asList(
            new BigDecimal("1"),
            new BigDecimal("0"),
            new BigDecimal("0")
        );
        assertThatCode(() -> util.avgNonNull(values)).doesNotThrowAnyException();
        assertThat(util.avgNonNull(values))
            .isGreaterThan(new BigDecimal("0.33"))
            .isLessThan(new BigDecimal("0.34"));
    }
}

