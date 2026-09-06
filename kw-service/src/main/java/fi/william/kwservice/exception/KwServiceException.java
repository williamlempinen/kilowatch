package fi.william.kwservice.exception;

public class KwServiceException extends RuntimeException {
    public KwServiceException() {
        super("Business Exception");
    }

    public KwServiceException(String message) {
        super(message);
    }
}
