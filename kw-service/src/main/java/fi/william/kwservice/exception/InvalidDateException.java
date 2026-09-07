package fi.william.kwservice.exception;

public class InvalidDateException extends RuntimeException {
    public InvalidDateException() {
        super("Invalid date format. Please use the format 'yyyy-MM-dd'.");
    }

    public InvalidDateException(String message) {
        super(message);
    }

    public InvalidDateException(String message, Throwable cause) {
        super(message, cause);
    }
}
