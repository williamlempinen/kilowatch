package fi.william.kwservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class KwServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(KwServiceApplication.class, args);
    }
}
