package com.dh.ti.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.validation.FieldError;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<HashMap<String,String>> processResourceNotFoundException(ResourceNotFoundException exception) {

        HashMap<String,String> mensaje = new HashMap<>();
        mensaje.put("errors",exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);

    }

    @ExceptionHandler(ResourceCreatedException.class)
    public ResponseEntity<HashMap<String,String>> processResourceCreatedException(ResourceCreatedException exception) {

        HashMap<String,String> mensaje = new HashMap<>();
        mensaje.put("errors",exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(mensaje);

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream().map(FieldError::getDefaultMessage).collect(Collectors.toList());
        return new ResponseEntity<>(getErrorsMap(errors), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    private Map<String, List<String>> getErrorsMap(List<String> errors) {
        Map<String, List<String>> errorResponse = new HashMap<>();
        errorResponse.put("errors", errors);
        return errorResponse;
    }
}
