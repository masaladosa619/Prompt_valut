package com.Prompt_lib.demo.Exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.jsonwebtoken.JwtException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiErrorResponse apiResponse = new ApiErrorResponse(400, "Validation Failed", LocalDateTime.now(), errors);
        return new ResponseEntity<ApiErrorResponse>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PromptNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handlePromptNotFoundException(PromptNotFoundException ex) {
        String message = ex.getMessage();
        ApiErrorResponse response = new ApiErrorResponse(404, message, LocalDateTime.now(), null);
        return new ResponseEntity<ApiErrorResponse>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        String message = ex.getMessage();
        ApiErrorResponse response = new ApiErrorResponse(404, message, LocalDateTime.now(), null);
        return new ResponseEntity<ApiErrorResponse>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(AuthenticationException ex) {
        ApiErrorResponse apiErrorReApiErrorResponse = new ApiErrorResponse(401,ex.getMessage(),
                LocalDateTime.now(),null);
        return new ResponseEntity<>(apiErrorReApiErrorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiErrorResponse> handleJwtException(JwtException ex) {
        ApiErrorResponse apiErrorReApiErrorResponse = new ApiErrorResponse(401, ex.getMessage(),
                LocalDateTime.now(), null);;
        return new ResponseEntity<>(apiErrorReApiErrorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ApiErrorResponse apiErrorReApiErrorResponse = new ApiErrorResponse(403, ex.getMessage(),
                LocalDateTime.now(), null);;
        return new ResponseEntity<>(apiErrorReApiErrorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex) {
        ApiErrorResponse apiErrorReApiErrorResponse = new ApiErrorResponse(500, ex.getMessage(),
                LocalDateTime.now(), null);;
        return new ResponseEntity<>(apiErrorReApiErrorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
