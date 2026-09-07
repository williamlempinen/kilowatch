package fi.william.kwservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {
    @Value("#{'${kilowatch.cors.allowed-origins}'.split(',')}")
    private List<String> allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(allowedMethods());
        config.setAllowedHeaders(allowedHeaders());
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    private List<String> allowedHeaders() {
        return List.of("Authorization", "Accept", "Content-Type");
    }

    private List<String> allowedMethods() {
        return List.of("GET", "POST");
    }
}
