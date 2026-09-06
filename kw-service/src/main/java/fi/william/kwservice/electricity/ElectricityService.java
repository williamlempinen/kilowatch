package fi.william.kwservice.electricity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return electricityRepository.getAllOnDay(day);
    }


}
