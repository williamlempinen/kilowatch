package fi.william.kwservice;

import org.springframework.boot.SpringApplication;

public class TestKwServiceApplication {

    public static void main(String[] args) {
        SpringApplication.from(KwServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
