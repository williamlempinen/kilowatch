package fi.william.kwservice.electricity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/electricity")
public class ElectricityController {
    private final Logger log = LoggerFactory.getLogger(ElectricityController.class);
    private final ElectricityService electricityService;

    public ElectricityController(ElectricityService electricityService) {
        this.electricityService = electricityService;
    }

    @GetMapping("/day")
    public ResponseEntity<DayDetail> getElectricityDataOnDay(
        @RequestParam String day
    ) {
        log.info("Received request to get all electricity data on day: {}", day);
        return ResponseEntity.ok(electricityService.getElectricityDetailsByDay(day));
    }

}
