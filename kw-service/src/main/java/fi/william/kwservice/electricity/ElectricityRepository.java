package fi.william.kwservice.electricity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ElectricityRepository {
    private static final RowMapper<ElectricityDto> ROW_MAPPER = (rs, _row) -> new ElectricityDto(
        rs.getLong("id"),
        rs.getDate("date"),
        rs.getTimestamp("startTime"),
        rs.getDouble("productionAmount"),
        rs.getDouble("consumptionAmount"),
        rs.getDouble("hourlyPrice")
    );
    private final Logger log = LoggerFactory.getLogger(ElectricityRepository.class);
    private final JdbcClient jdbcClient;

    public ElectricityRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<ElectricityDto> getAllOnDay(String date) {
        String query = """
            select *
            from electricitydata
            where date = :date
            """;
        return jdbcClient.sql(query)
            .param("date", date)
            .query(ROW_MAPPER)
            .list();
    }

}
