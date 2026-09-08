package fi.william.kwservice.electricity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class ElectricityRepository {
    private static final RowMapper<ElectricityDto> ROW_MAPPER = (rs, _row) -> new ElectricityDto(
        rs.getLong("id"),
        rs.getObject("date", LocalDate.class),
        rs.getObject("startTime", LocalDateTime.class),
        rs.getBigDecimal("productionAmount"),
        rs.getBigDecimal("consumptionAmount"),
        rs.getBigDecimal("hourlyPrice")
    );
    private final Logger log = LoggerFactory.getLogger(ElectricityRepository.class);
    private final JdbcClient jdbcClient;

    public ElectricityRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<ElectricityDto> findAllByDay(LocalDate date) {
        String query = """
            select *
            from electricitydata
            where date = :date
            order by startTime
            """;
        return jdbcClient.sql(query)
            .param("date", date)
            .query(ROW_MAPPER)
            .list();
    }

}
