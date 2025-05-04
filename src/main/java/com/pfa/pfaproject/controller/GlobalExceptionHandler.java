package com.pfa.pfaproject.controller;

import com.pfa.pfaproject.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<?> handleCustomException(CustomException e) {
//        ResponseWrapper responseWrapper = new ResponseWrapper();
        return ResponseEntity
                .status(e.getStatus())
                .body(ResponseWrapper.error(e.getMessage()));
    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<?> handleException(Exception e) {
////        ResponseWrapper responseWrapper = new ResponseWrapper();
//        return ResponseEntity
//                .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(ResponseWrapper.error("Internal Server Error"));
//    }
}
