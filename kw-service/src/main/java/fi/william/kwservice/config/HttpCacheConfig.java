package fi.william.kwservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

/**
 * HTTP caching configuration.
 * <p>
 * Registers a {@link ShallowEtagHeaderFilter} that computes an {@code ETag} from the response
 * body and answers conditional requests carrying {@code If-None-Match} with a
 * {@code 304 Not Modified} (empty body). Combined with the {@code Cache-Control} headers set in
 * the controller, this reduces bandwidth when the browser HTTP cache or TanStack Query revalidates
 * previously fetched days.
 */
@Configuration
public class HttpCacheConfig {

    @Bean
    public ShallowEtagHeaderFilter shallowEtagHeaderFilter() {
        return new ShallowEtagHeaderFilter();
    }
}

