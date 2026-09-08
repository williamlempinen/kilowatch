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
    void sumNonNull_sumsValues() {
        assertThat(util.sumNonNull(Arrays.asList(
            new BigDecimal("1"),
            new BigDecimal("2"),
            new BigDecimal("3")
        )))
            .isEqualByComparingTo("6");
    }

    @Test
    void sumNonNull_skipsNulls() {
        List<BigDecimal> values = Arrays.asList(
            new BigDecimal("1"),
            null,
            new BigDecimal("3")
        );
        assertThat(util.sumNonNull(values)).isEqualByComparingTo("4");
    }

    @Test
    void sumNonNull_emptyList_returnsZero() {
        assertThat(util.sumNonNull(List.of()))
            .isEqualByComparingTo("0");
    }

    @Test
    void sumNonNull_allNulls_returnsZero() {
        assertThat(util.sumNonNull(Arrays.asList(null, null)))
            .isEqualByComparingTo("0");
    }

    @Test
    void sumNonNull_mixesNegativesAndPositives() {
        assertThat(util.sumNonNull(Arrays.asList(
            new BigDecimal("-5"),
            new BigDecimal("3")
        )))
            .isEqualByComparingTo("-2");
    }

    @Test
    void avgNonNull_computesMean() {
        assertThat(util.avgNonNull(Arrays.asList(
            new BigDecimal("2"),
            new BigDecimal("4")
        )))
            .isEqualByComparingTo("3");
    }

    @Test
    void avgNonNull_ignoresNullsInBothSumAndCount() {
        List<BigDecimal> values = Arrays.asList(
            new BigDecimal("2"),
            null,
            new BigDecimal("4")
        );
        assertThat(util.avgNonNull(values))
            .isEqualByComparingTo("3");
    }

    @Test
    void avgNonNull_emptyList_returnsZero() {
        assertThat(util.avgNonNull(List.of()))
            .isEqualByComparingTo("0");
    }

    @Test
    void avgNonNull_allNulls_returnsZero() {
        assertThat(util.avgNonNull(Arrays.asList(
            null,
            null
        )))
            .isEqualByComparingTo("0");
    }

    @Test
    void avgNonNull_nonTerminatingQuotient_doesNotThrowAndRounds() {
        // 1 / 3 must not blow up with ArithmeticException (rounding must be applied)
        List<BigDecimal> values = List.of(new BigDecimal("1"), new BigDecimal("0"), new BigDecimal("0"));
        assertThatCode(() -> util.avgNonNull(values)).doesNotThrowAnyException();
        assertThat(util.avgNonNull(values))
            .isGreaterThan(new BigDecimal("0.33"))
            .isLessThan(new BigDecimal("0.34"));
    }
}

