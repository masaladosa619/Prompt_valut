package com.Prompt_lib.demo.Exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
        
        ApiErrorResponse apiResponse = new ApiErrorResponse(400,"Validation Failed",LocalDateTime.now(), errors); 
        return new ResponseEntity<ApiErrorResponse>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PromptNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handlePromptNotFoundException(PromptNotFoundException ex) {
        String message = ex.getMessage();
        ApiErrorResponse Response = new ApiErrorResponse(404,message,LocalDateTime.now(),null);
        return new ResponseEntity<ApiErrorResponse>(Response, HttpStatus.NOT_FOUND);

    }
}
