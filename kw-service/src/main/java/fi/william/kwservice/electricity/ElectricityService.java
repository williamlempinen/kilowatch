package fi.william.kwservice.electricity;

import fi.william.kwservice.exception.InvalidDateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ElectricityService {
    private final Logger log = LoggerFactory.getLogger(ElectricityService.class);

    private final ElectricityRepository electricityRepository;

    public ElectricityService(ElectricityRepository electricityRepository) {
        this.electricityRepository = electricityRepository;
    }

    @Transactional(readOnly = true)
    public List<ElectricityDto> getAllOnDay(String day) {
        LocalDate parsedDate = parseDay(day);
        List<ElectricityDto> electricityData = electricityRepository.getAllOnDay(parsedDate);
        log.debug("Fetched {} electricity data entries for day: {}", electricityData.size(), parsedDate);
        return electricityData;
    }

    LocalDate parseDay(String day) {
        try {
            return LocalDate.parse(day);
        } catch (Exception e) {
            log.error("Error parsing day: {}", day, e);
            throw new InvalidDateException();
        }
    }

}
