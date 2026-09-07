package fi.william.kwservice.config;

import fi.william.kwservice.exception.InvalidDateException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InvalidDateException.class)
    public ResponseEntity<ApiErrorBody> handleInvalidDateException(InvalidDateException ex) {
        return new ResponseEntity<>(
            new ApiErrorBody(
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST,
                ex.getMessage()),
            HttpStatus.BAD_REQUEST);
    }

    private record ApiErrorBody(
        String timestamp,
        HttpStatus status,
        String message
    ) {
    }
}
